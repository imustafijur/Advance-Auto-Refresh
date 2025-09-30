let refreshTimeouts = {};
let scheduledRefreshes = {};

// --- Main Control Functions ---

function initialize() {
  chrome.storage.sync.get(['enabled', 'randomizerEnabled'], (settings) => {
    stopAllActivity();
    if (settings.enabled) {
      if (settings.randomizerEnabled) {
        startRandomizer();
      } else {
        startClassicRefresh();
      }
    }
  });
}

function stopAllActivity() {
  Object.values(refreshTimeouts).forEach(clearTimeout);
  refreshTimeouts = {};
  scheduledRefreshes = {};
  updateBadge();
}

// --- Classic Refresh Mode ---

async function startClassicRefresh() {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (await matchesClassicCriteria(tab)) {
      scheduleClassicRefresh(tab.id);
    }
  }
}

function scheduleClassicRefresh(tabId) {
  chrome.storage.sync.get(['minInterval', 'maxInterval'], (settings) => {
    const min = settings.minInterval || 60;
    const max = settings.maxInterval || 120;
    const interval = Math.floor(Math.random() * (max - min + 1) + min) * 1000;
    
    refreshTimeouts[tabId] = setTimeout(() => {
      chrome.tabs.reload(tabId, {}, () => {
        if (chrome.runtime.lastError) return cleanUpTab(tabId);
        chrome.tabs.get(tabId, async (reloadedTab) => {
          if (chrome.runtime.lastError || !reloadedTab) return cleanUpTab(tabId);
          if (await matchesClassicCriteria(reloadedTab)) {
            scheduleClassicRefresh(tabId);
          } else {
            cleanUpTab(tabId);
          }
        });
      });
    }, interval);

    scheduledRefreshes[tabId] = Date.now() + interval;
    updateBadge();
  });
}

function matchesClassicCriteria(tab) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['urls', 'pinnedOnly'], (settings) => {
      if (!tab.url) return resolve(false);

      // If pinnedOnly is checked, the tab MUST be pinned.
      if (settings.pinnedOnly && !tab.pinned) {
        return resolve(false);
      }

      const urlMatches = (settings.urls || []).some(urlPattern => tab.url.startsWith(urlPattern));
      resolve(urlMatches);
    });
  });
}


// --- Randomizer Mode ---

async function startRandomizer() {
  const tabs = await chrome.tabs.query({ pinned: true });
  for (const tab of tabs) {
    if (await matchesRandomizerCriteria(tab)) {
      scheduleRandomNavigation(tab.id);
    }
  }
}

function scheduleRandomNavigation(tabId) {
  chrome.storage.sync.get(['minInterval', 'maxInterval', 'randomUrlList'], (settings) => {
    const randomUrls = settings.randomUrlList || [];
    if (randomUrls.length === 0) return;

    const min = settings.minInterval || 60;
    const max = settings.maxInterval || 120;
    const interval = Math.floor(Math.random() * (max - min + 1) + min) * 1000;
    const nextUrl = randomUrls[Math.floor(Math.random() * randomUrls.length)];

    refreshTimeouts[tabId] = setTimeout(() => {
      chrome.tabs.update(tabId, { url: nextUrl }, () => {
        if (chrome.runtime.lastError) return cleanUpTab(tabId);
        chrome.tabs.get(tabId, async (updatedTab) => {
          if (chrome.runtime.lastError || !updatedTab) return cleanUpTab(tabId);
          if (await matchesRandomizerCriteria(updatedTab)) {
            scheduleRandomNavigation(tabId);
          } else {
            cleanUpTab(tabId);
          }
        });
      });
    }, interval);

    scheduledRefreshes[tabId] = Date.now() + interval;
    updateBadge();
  });
}

function matchesRandomizerCriteria(tab) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['urls'], (settings) => {
      if (!tab.pinned || !tab.url) return resolve(false);
      const urlMatches = (settings.urls || []).some(domain => tab.url.startsWith(domain));
      resolve(urlMatches);
    });
  });
}

// --- Badge and Cleanup ---

function updateBadge() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return chrome.action.setBadgeText({ text: '' });
    const scheduledTime = scheduledRefreshes[tabs[0].id];
    if (scheduledTime) {
      const secondsLeft = Math.round((scheduledTime - Date.now()) / 1000);
      if (secondsLeft > 0) {
        const mins = Math.floor(secondsLeft / 60);
        const secs = secondsLeft % 60;
        chrome.action.setBadgeText({ text: `${mins}:${secs.toString().padStart(2, '0')}` });
      } else {
        chrome.action.setBadgeText({ text: '...' });
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
chrome.alarms.create('badgeUpdater', { periodInMinutes: 1 / 60 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'badgeUpdater') updateBadge();
});

chrome.storage.onChanged.addListener(initialize);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' || changeInfo.pinned !== undefined) {
    initialize();
  }
});

chrome.tabs.onRemoved.addListener(cleanUpTab);
chrome.tabs.onActivated.addListener(updateBadge);

chrome.runtime.onStartup.addListener(initialize);
chrome.runtime.onInstalled.addListener(initialize);
