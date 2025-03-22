let refreshTimeouts = {};
let scheduledRefreshes = {};

// Function to clear all existing timeouts
function clearAllTimeouts() {
  for (const tabId in refreshTimeouts) {
    clearTimeout(refreshTimeouts[tabId]);
  }
  refreshTimeouts = {};
  scheduledRefreshes = {};
  updateBadge();
}

// Function to schedule a refresh for a tab
function scheduleRefresh(tabId) {
  chrome.storage.sync.get(['minInterval', 'maxInterval'], (settings) => {
    const min = settings.minInterval || 60; // Default: 60 seconds
    const max = settings.maxInterval || 120; // Default: 120 seconds
    const interval = Math.random() * (max - min) + min; // Random interval for this tab
    const scheduledTime = Date.now() + interval * 1000;
    const timeoutId = setTimeout(() => {
      chrome.tabs.reload(tabId, {}, () => {
        chrome.tabs.get(tabId, (tab) => {
          if (tab) {
            matchesCriteria(tab).then((matches) => {
              if (matches) {
                scheduleRefresh(tabId); // Schedule the next refresh
              } else {
                delete refreshTimeouts[tabId];
                delete scheduledRefreshes[tabId];
                updateBadge();
              }
            });
          } else {
            delete refreshTimeouts[tabId];
            delete scheduledRefreshes[tabId];
            updateBadge();
          }
        });
      });
    }, interval * 1000);
    refreshTimeouts[tabId] = timeoutId;
    scheduledRefreshes[tabId] = scheduledTime;
    updateBadge();
    console.log(`Scheduled refresh for tab ${tabId} in ${interval} seconds`);
  });
}

// Function to check if a tab matches the refresh criteria
function matchesCriteria(tab) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['urls', 'pinnedOnly'], (settings) => {
      const urls = settings.urls || [];
      const pinnedOnly = settings.pinnedOnly || false;
      console.log(`Checking tab ${tab.id}: url=${tab.url}, pinned=${tab.pinned}, pinnedOnly=${pinnedOnly}, matchesURL=${urls.includes(tab.url)}`);
      if (urls.includes(tab.url)) {
        resolve(pinnedOnly ? tab.pinned : true);
      } else {
        resolve(false);
      }
    });
  });
}

// Function to start refreshing all matching tabs
function startRefreshing() {
  clearAllTimeouts();
  chrome.tabs.query({}, (tabs) => {
    let matchingTabs = 0;
    tabs.forEach((tab) => {
      matchesCriteria(tab).then((matches) => {
        if (matches) {
          matchingTabs++;
          scheduleRefresh(tab.id);
        }
      });
    });
    console.log(`Found ${matchingTabs} tabs to refresh`);
  });
}

// Function to stop refreshing all tabs
function stopRefreshing() {
  clearAllTimeouts();
}

// Function to update the badge based on the active tab
function updateBadge() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
      const activeTabId = tabs[0].id;
      const scheduledTime = scheduledRefreshes[activeTabId];
      if (scheduledTime) {
        const now = Date.now();
        const secondsUntilRefresh = Math.ceil((scheduledTime - now) / 1000);
        
        // Format time with colon
        const minutes = Math.floor(secondsUntilRefresh / 60);
        const seconds = secondsUntilRefresh % 60;
        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (secondsUntilRefresh > 0) {
          chrome.action.setBadgeText({ text: formattedTime });
        } else {
          chrome.action.setBadgeText({ text: '0:00' });
        }
      } else {
        chrome.action.setBadgeText({ text: '' });
      }
    } else {
      chrome.action.setBadgeText({ text: '' });
    }
  });
}

// Update badge every second
setInterval(updateBadge, 1000);

// React to storage changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') {
    if (changes.enabled) {
      if (changes.enabled.newValue) {
        startRefreshing();
      } else {
        stopRefreshing();
      }
    } else if (changes.urls || changes.minInterval || changes.maxInterval || changes.pinnedOnly) {
      chrome.storage.sync.get('enabled', (settings) => {
        if (settings.enabled) {
          startRefreshing();
        }
      });
    }
  }
});

// Handle tab updates (e.g., URL or pinned status changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  console.log(`Tab ${tabId} updated:`, changeInfo);
  if (changeInfo.url || changeInfo.pinned !== undefined) {
    matchesCriteria(tab).then((matches) => {
      if (matches) {
        if (!refreshTimeouts[tabId]) {
          scheduleRefresh(tabId);
        }
      } else {
        if (refreshTimeouts[tabId]) {
          console.log(`Clearing timeout for tab ${tabId}`);
          clearTimeout(refreshTimeouts[tabId]);
          delete refreshTimeouts[tabId];
          delete scheduledRefreshes[tabId];
          updateBadge();
        }
      }
    });
  }
});

// Handle tab closures
chrome.tabs.onRemoved.addListener((tabId) => {
  if (refreshTimeouts[tabId]) {
    clearTimeout(refreshTimeouts[tabId]);
    delete refreshTimeouts[tabId];
    delete scheduledRefreshes[tabId];
    updateBadge();
  }
});

// Handle tab activation to update badge for the new active tab
chrome.tabs.onActivated.addListener((activeInfo) => {
  updateBadge();
});

// Start refreshing on browser launch if enabled
chrome.storage.sync.get('enabled', (settings) => {
  if (settings.enabled) {
    startRefreshing();
  }
});