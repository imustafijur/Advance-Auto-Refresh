let refreshTimeouts = {};
let scheduledRefreshes = {};

// --- Main Control Functions ---

// Starts the extension's main logic based on saved settings
function initialize() {
  chrome.storage.sync.get(['enabled', 'randomizerEnabled'], (settings) => {
    stopAllActivity(); // Stop everything before starting
    if (settings.enabled) {
      if (settings.randomizerEnabled) {
        startRandomizer();
      } else {
        startClassicRefresh();
      }
    }
  });
}

// Function to clear all existing timeouts
function stopAllActivity() {
  for (const tabId in refreshTimeouts) {
    clearTimeout(refreshTimeouts[tabId]);
  }
  refreshTimeouts = {};
  scheduledRefreshes = {};
  updateBadge();
}

// --- Classic Refresh Mode ---

async function startClassicRefresh() {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    const matches = await matchesClassicCriteria(tab);
    if (matches) {
      scheduleClassicRefresh(tab.id);
    }
  }
}

function scheduleClassicRefresh(tabId) {
  chrome.storage.sync.get(['minInterval', 'maxInterval'], (settings) => {
    const min = settings.minInterval || 60;
    const max = settings.maxInterval || 120;
    const interval = Math.random() * (max - min) + min;
    const scheduledTime = Date.now() + interval * 1000;

    const timeoutId = setTimeout(() => {
      chrome.tabs.reload(tabId, {}, () => {
        if (chrome.runtime.lastError) {
          return cleanUpTab(tabId);
        }
        chrome.tabs.get(tabId, (tab) => {
          if (chrome.runtime.lastError || !tab) {
            return cleanUpTab(tabId);
          }
          matchesClassicCriteria(tab).then((matches) => {
            if (matches) scheduleClassicRefresh(tabId);
            else cleanUpTab(tabId);
          });
        });
      });
    }, interval * 1000);

    refreshTimeouts[tabId] = timeoutId;
    scheduledRefreshes[tabId] = scheduledTime;
    updateBadge();
  });
}

function matchesClassicCriteria(tab) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['urls', 'pinnedOnly'], (settings) => {
      if (!tab.url) return resolve(false);
      const urlMatches = (settings.urls || []).some(urlPattern => tab.url.startsWith(urlPattern));
      if (urlMatches) resolve(settings.pinnedOnly ? tab.pinned : true);
      else resolve(false);
    });
  });
}

// --- Randomizer Mode ---

async function startRandomizer() {
  const tabs = await chrome.tabs.query({ pinned: true }); // Randomizer only works on pinned tabs
  for (const tab of tabs) {
    const matches = await matchesRandomizerCriteria(tab);
    if (matches) {
      scheduleRandomNavigation(tab.id);
    }
  }
}

function scheduleRandomNavigation(tabId) {
  chrome.storage.sync.get(['minInterval', 'maxInterval', 'randomUrlList'], (settings) => {
    const randomUrls = settings.randomUrlList || [];
    if (randomUrls.length === 0) return; // Don't schedule if there are no URLs

    const min = settings.minInterval || 60;
    const max = settings.maxInterval || 120;
    const interval = Math.random() * (max - min) + min;
    const scheduledTime = Date.now() + interval * 1000;
    const nextUrl = randomUrls[Math.floor(Math.random() * randomUrls.length)];

    const timeoutId = setTimeout(() => {
      chrome.tabs.update(tabId, { url: nextUrl }, () => {
        if (chrome.runtime.lastError) {
          return cleanUpTab(tabId);
        }
        // After navigation, re-check criteria and loop
        chrome.tabs.get(tabId, (tab) => {
          if (chrome.runtime.lastError || !tab) {
            return cleanUpTab(tabId);
          }
          matchesRandomizerCriteria(tab).then((matches) => {
            if (matches) scheduleRandomNavigation(tabId);
            else cleanUpTab(tabId);
          });
        });
      });
    }, interval * 1000);

    refreshTimeouts[tabId] = timeoutId;
    scheduledRefreshes[tabId] = scheduledTime;
    updateBadge();
  });
}

function matchesRandomizerCriteria(tab) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['urls'], (settings) => {
      // Must be a pinned tab with a URL
      if (!tab.pinned || !tab.url) return resolve(false);
      
      // The URL must match one of the target domains
      const urlMatches = (settings.urls || []).some(domain => tab.url.startsWith(domain));
      resolve(urlMatches);
    });
  });
}


// --- Badge and Cleanup ---

function updateBadge() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length === 0) return chrome.action.setBadgeText({ text: '' });
    const activeTabId = tabs[0].id;
    const scheduledTime = scheduledRefreshes[activeTabId];
    if (scheduledTime) {
      const secondsUntil = Math.round((scheduledTime - Date.now()) / 1000);
      if (secondsUntil > 0) {
        const minutes = Math.floor(secondsUntil / 60);
        const seconds = secondsUntil % 60;
        const formatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        chrome.action.setBadgeText({ text: formatted });
      } else {
        chrome.action.setBadgeText({ text: '...' }); // Indicate refresh is happening
      }
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  });
}

function cleanUpTab(tabId) {
  if (refreshTimeouts[tabId]) {
    clearTimeout(refreshTimeouts[tabId]);
    delete refreshTimeouts[tabId];
    delete scheduledRefreshes[tabId];
    updateBadge();
  }
}

// --- Event Listeners ---

// Create an alarm for updating the badge every second
chrome.alarms.create('badgeUpdater', { periodInMinutes: 1 / 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'badgeUpdater') updateBadge();
});

// React to storage changes (e.g., settings saved in popup)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') initialize();
});

// Handle tab updates (e.g., URL or pinned status changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' || changeInfo.pinned !== undefined) {
    chrome.storage.sync.get(['enabled', 'randomizerEnabled'], (settings) => {
        if (!settings.enabled) return;

        const checkCriteria = settings.randomizerEnabled ? matchesRandomizerCriteria : matchesClassicCriteria;
        const scheduleNext = settings.randomizerEnabled ? scheduleRandomNavigation : scheduleClassicRefresh;

        checkCriteria(tab).then((matches) => {
            if (matches && !refreshTimeouts[tabId]) {
                scheduleNext(tabId); // Start activity if it now matches
            } else if (!matches && refreshTimeouts[tabId]) {
                cleanUpTab(tabId); // Stop activity if it no longer matches
            }
        });
    });
  }
});

// Handle tab closures
chrome.tabs.onRemoved.addListener((tabId) => {
  cleanUpTab(tabId);
});

// Update badge when switching tabs
chrome.tabs.onActivated.addListener(() => {
  updateBadge();
});

// Initialize on browser startup or extension installation
chrome.runtime.onStartup.addListener(initialize);
chrome.runtime.onInstalled.addListener(initialize);