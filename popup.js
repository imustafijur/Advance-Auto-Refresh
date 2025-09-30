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

  // New elements for Randomizer mode
  const randomizerEnabledCheckbox = document.getElementById('randomizerEnabled');
  const randomUrlSection = document.getElementById('randomUrlSection');
  const randomUrlListTextarea = document.getElementById('randomUrlList');
  document.getElementById("year").textContent = new Date().getFullYear();
  // Variable declarations
  let urls = [];
  let savePopupTimeout;

  // Function to toggle UI based on Randomizer mode
  function toggleRandomizerUI(isRandomizerEnabled) {
    if (isRandomizerEnabled) {
      randomUrlSection.style.display = 'block';
      pinnedOnlyCheckbox.checked = true;
      pinnedOnlyCheckbox.disabled = true;
    } else {
      randomUrlSection.style.display = 'none';
      pinnedOnlyCheckbox.disabled = false;
    }
  }

  // Load saved settings
  const settingsToGet = [
    'urls', 'minInterval', 'maxInterval', 'pinnedOnly', 'enabled',
    'randomizerEnabled', 'randomUrlList'
  ];
  chrome.storage.sync.get(settingsToGet, (settings) => {
    urls = settings.urls || [];
    renderUrlList();
    minIntervalInput.value = settings.minInterval || 60;
    maxIntervalInput.value = settings.maxInterval || 120;
    
    const isRandomizer = settings.randomizerEnabled || false;
    randomizerEnabledCheckbox.checked = isRandomizer;
    toggleRandomizerUI(isRandomizer);

    // Only set pinnedOnly from storage if not in randomizer mode
    if (!isRandomizer) {
        pinnedOnlyCheckbox.checked = settings.pinnedOnly || false;
    }

    enabledCheckbox.checked = settings.enabled || false;
    randomUrlListTextarea.value = (settings.randomUrlList || []).join('\n');
  });

  // Render URL list
  function renderUrlList() {
    urlList.innerHTML = '';
    urls.forEach((url, index) => {
      const li = document.createElement('li');
      const urlSpan = document.createElement('span');
      urlSpan.textContent = url;
      urlSpan.title = url; // Show full URL on hover
      li.appendChild(urlSpan);

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
      if (tabs[0] && tabs[0].url) {
        // Use URL constructor to get the origin for domain matching
        try {
            const urlObject = new URL(tabs[0].url);
            const currentUrl = urlObject.origin;
            if (!urls.includes(currentUrl)) {
                urls.push(currentUrl);
                renderUrlList();
            }
        } catch (e) {
            console.error("Invalid URL:", tabs[0].url);
        }
      }
    });
  });

  // Event listener for the randomizer checkbox
  randomizerEnabledCheckbox.addEventListener('change', (event) => {
    toggleRandomizerUI(event.target.checked);
  });


  // Save settings
  saveButton.addEventListener('click', () => {
    const min = parseInt(minIntervalInput.value, 10);
    const max = parseInt(maxIntervalInput.value, 10);
    
    if (isNaN(min) || isNaN(max) || min <= 0 || max <= 0 || min > max) {
      alert('Please enter valid positive numbers. Min interval must not be greater than max interval.');
      return;
    }

    // Process the random URL list from the textarea
    const randomUrlList = randomUrlListTextarea.value
      .split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0);

    const settings = {
      urls,
      minInterval: min,
      maxInterval: max,
      pinnedOnly: pinnedOnlyCheckbox.checked,
      enabled: enabledCheckbox.checked,
      randomizerEnabled: randomizerEnabledCheckbox.checked,
      randomUrlList: randomUrlList
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
    }, 1500);
  }
});