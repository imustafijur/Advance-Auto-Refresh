document.addEventListener('DOMContentLoaded', () => {
  // Element declarations
  const urlList = document.getElementById('urlList');
  const newUrlInput = document.getElementById('newUrl');
  const addUrlButton = document.getElementById('addUrl');
  const addCurrentUrlButton = document.getElementById('addCurrentUrl');
  const minIntervalInput = document.getElementById('minInterval');
  const maxIntervalInput = document.getElementById('maxInterval');
  const pinnedOnlyCheckbox = document.getElementById('pinnedOnly');
  const enabledCheckbox = document.getElementById('enabled');
  const saveButton = document.getElementById('save');

  // Variable declarations
  let urls = [];
  let savePopupTimeout; // Properly declared here

  // Load saved settings
  chrome.storage.sync.get(['urls', 'minInterval', 'maxInterval', 'pinnedOnly', 'enabled'], (settings) => {
    urls = settings.urls || [];
    renderUrlList();
    minIntervalInput.value = settings.minInterval || 60;
    maxIntervalInput.value = settings.maxInterval || 120;
    pinnedOnlyCheckbox.checked = settings.pinnedOnly || false;
    enabledCheckbox.checked = settings.enabled || false;
  });

  // Render URL list
  function renderUrlList() {
    urlList.innerHTML = '';
    urls.forEach((url, index) => {
      const li = document.createElement('li');
      li.textContent = url;
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => {
        urls.splice(index, 1);
        renderUrlList();
      });
      li.appendChild(removeButton);
      urlList.appendChild(li);
    });
  }

  // Add URL from input
  addUrlButton.addEventListener('click', () => {
    const newUrl = newUrlInput.value.trim();
    if (newUrl && !urls.includes(newUrl)) {
      urls.push(newUrl);
      renderUrlList();
      newUrlInput.value = '';
    }
  });

  // Add current tab's URL
  addCurrentUrlButton.addEventListener('click', () => {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      const currentUrl = tabs[0].url;
      if (currentUrl && !urls.includes(currentUrl)) {
        urls.push(currentUrl);
        renderUrlList();
      }
    });
  });

  // Save settings
  saveButton.addEventListener('click', () => {
    const min = parseInt(minIntervalInput.value, 10);
    const max = parseInt(maxIntervalInput.value, 10);
    
    if (!min || !max || min > max) {
      alert('Please ensure min interval is less than max interval.');
      return;
    }

    const settings = {
      urls,
      minInterval: min,
      maxInterval: max,
      pinnedOnly: pinnedOnlyCheckbox.checked,
      enabled: enabledCheckbox.checked
    };

    chrome.storage.sync.set(settings, () => {
      showSavePopup();
    });
  });

  // Save popup handler
  function showSavePopup() {
    const popup = document.getElementById('save-popup');
    popup.classList.add('visible');
    
    if (savePopupTimeout) {
      clearTimeout(savePopupTimeout);
    }
    
    savePopupTimeout = setTimeout(() => {
      popup.classList.remove('visible');
    }, 1000);
  }
});