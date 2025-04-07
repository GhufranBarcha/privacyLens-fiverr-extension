// Initialize the UI when popup opens
document.addEventListener('DOMContentLoaded', () => {
  initializeUi();
  initializeThemeToggle();
});

// Setup theme toggle functionality with system theme detection
function initializeThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  const moonIcon = themeToggle.querySelector('.moon');
  const sunIcon = themeToggle.querySelector('.sun');
  
  // First check if user has explicitly saved a theme preference
  const savedTheme = localStorage.getItem('privacyLens-theme');
  
  // If no saved preference, check system preference
  if (!savedTheme) {
    // Check if system prefers dark mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (prefersDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'block';
      localStorage.setItem('privacyLens-theme', 'dark');
      console.log('Using system preference: dark mode');
    } else {
      document.documentElement.removeAttribute('data-theme');
      moonIcon.style.display = 'block';
      sunIcon.style.display = 'none';
      localStorage.setItem('privacyLens-theme', 'light');
      console.log('Using system preference: light mode');
    }
  } else {
    // Use saved preference
    if (savedTheme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'block';
    } else {
      document.documentElement.removeAttribute('data-theme');
      moonIcon.style.display = 'block';
      sunIcon.style.display = 'none';
    }
    console.log(`Using saved theme preference: ${savedTheme} mode`);
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    // Only auto-update if the user hasn't explicitly set a preference
    const userPreference = localStorage.getItem('privacyLens-userSelected');
    if (userPreference !== 'true') {
      const newTheme = event.matches ? 'dark' : 'light';
      console.log(`System theme changed to ${newTheme}, updating...`);
      
      if (newTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
        localStorage.setItem('privacyLens-theme', 'dark');
      } else {
        document.documentElement.removeAttribute('data-theme');
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
        localStorage.setItem('privacyLens-theme', 'light');
      }
    }
  });
  
  // Handle click on theme toggle
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    
    // Mark that the user has explicitly selected a theme
    localStorage.setItem('privacyLens-userSelected', 'true');
    
    if (currentTheme === 'dark') {
      // Switch to light mode
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('privacyLens-theme', 'light');
      moonIcon.style.display = 'block';
      sunIcon.style.display = 'none';
    } else {
      // Switch to dark mode
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('privacyLens-theme', 'dark');
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'block';
    }
  });
}

// Check if we're on Fiverr before setting up event listeners
async function checkIfOnFiverr() {
  try {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    return tab && tab.url && tab.url.includes('fiverr.com');
  } catch (error) {
    console.error('Error checking if on Fiverr:', error);
    return false;
  }
}

// Setup event listeners for toggles
document.getElementById('toggleBalance').addEventListener('click', function() {
  this.classList.toggle('active');
  toggleFeature('toggleBalance', 'Financial Info');
});

document.getElementById('toggleNames').addEventListener('click', function() {
  this.classList.toggle('active');
  toggleFeature('toggleNames', 'Usernames');
});

// Function to toggle features
async function toggleFeature(action, featureName) {
  try {
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    
    // Check if we're on a Fiverr page
    if (!tab.url || !tab.url.includes('fiverr.com')) {
      document.getElementById('status').textContent = 'Please navigate to Fiverr.com first';
      document.getElementById('status').classList.add('animated');
      return;
    }
    
    // Save the toggle state to localStorage (as a backup in case content script fails)
    const toggleElement = document.getElementById(action);
    const isActive = toggleElement.classList.contains('active');
    localStorage.setItem(`${action}-popup`, isActive.toString());
    
    // Send the toggle command to the content script
    browser.tabs.sendMessage(tab.id, { action: action }).then(response => {
      if (response) {
        const isHidden = response.hidden;
        const state = isHidden ? 'hidden' : 'visible';
        document.getElementById('status').textContent = `${featureName} now ${state}`;
        document.getElementById('status').classList.add('animated');
        
        // Update button state
        updateButtonState(action, isHidden);
      }
    }).catch(error => {
      document.getElementById('status').textContent = `Warning: Content script not loaded. Please refresh the page.`;
      console.warn('Toggle error:', error.message);
    });
  } catch (error) {
    document.getElementById('status').textContent = 'Error: ' + error.message;
    console.error(error);
  }
}

// Update toggle button state
function updateButtonState(buttonId, isHidden) {
  const toggle = document.getElementById(buttonId);
  if (toggle) {
    if (isHidden) {
      toggle.classList.add('active');
    } else {
      toggle.classList.remove('active');
    }
  }
}

// Initialize UI based on current state
async function initializeUi() {
  try {
    // Before anything, check if we're on a Fiverr page
    const isOnFiverr = await checkIfOnFiverr();
    
    if (!isOnFiverr) {
      document.getElementById('status').textContent = 'Please navigate to Fiverr.com first';
      document.getElementById('balanceCard').style.opacity = '0.5';
      document.getElementById('namesCard').style.opacity = '0.5';
      document.getElementById('toggleBalance').style.pointerEvents = 'none';
      document.getElementById('toggleNames').style.pointerEvents = 'none';
      return;
    }
    
    // Try to load saved states from localStorage as a fallback
    const savedBalanceState = localStorage.getItem('toggleBalance-popup') === 'true';
    const savedNamesState = localStorage.getItem('toggleNames-popup') === 'true';
    
    // First apply the saved states just in case
    updateButtonState('toggleBalance', savedBalanceState);
    updateButtonState('toggleNames', savedNamesState);
    
    // Now try to get the actual state from the content script
    const [tab] = await browser.tabs.query({ active: true, currentWindow: true });
    
    // Check if content script is loaded and get current state
    browser.tabs.sendMessage(tab.id, { action: "ping" }).then(response => {
      if (response) {
        // Content script is active, get the current states
        updateButtonState('toggleBalance', response.balanceHidden);
        updateButtonState('toggleNames', response.namesHidden);
        
        // Also update our localStorage backup
        localStorage.setItem('toggleBalance-popup', response.balanceHidden.toString());
        localStorage.setItem('toggleNames-popup', response.namesHidden.toString());
      }
    }).catch(error => {
      // Content script is not running
      document.getElementById('status').textContent = 'Extension not active on this page. Please refresh the page.';
      console.log('Error:', error.message);
    });
  } catch (error) {
    console.error('Error initializing UI:', error);
    document.getElementById('status').textContent = 'Error loading extension state';
  }
}