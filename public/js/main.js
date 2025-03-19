/**
 * Freight Trader - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize UI components
  initializeMessageDismiss();
  initializeUserDropdown();
  initializeMobileMenu();
  initializeSearchBar();
  initializeFilterToggle();
});

/**
 * Initialize message dismiss functionality
 */
function initializeMessageDismiss() {
  const closeButtons = document.querySelectorAll('.message-close');
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const message = this.closest('.message');
      message.style.opacity = '0';
      setTimeout(() => {
        message.style.display = 'none';
      }, 300);
    });
  });

  // Auto-dismiss success messages after 5 seconds
  const successMessages = document.querySelectorAll('.message.success');
  successMessages.forEach(message => {
    setTimeout(() => {
      message.style.opacity = '0';
      setTimeout(() => {
        message.style.display = 'none';
      }, 300);
    }, 5000);
  });
}

/**
 * Initialize user dropdown menu
 */
function initializeUserDropdown() {
  const userMenu = document.querySelector('.user-menu');
  if (!userMenu) return;

  // We're already using CSS :hover for this, but adding JS
  // for better mobile support
  userMenu.addEventListener('click', function(e) {
    const dropdown = this.querySelector('.user-dropdown');
    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
    e.stopPropagation();
  });

  // Close dropdown when clicking elsewhere
  document.addEventListener('click', function() {
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown) {
      dropdown.style.display = 'none';
    }
  });
}

/**
 * Initialize mobile menu toggle
 */
function initializeMobileMenu() {
  // Create mobile menu button if it doesn't exist
  if (!document.querySelector('.mobile-menu-toggle')) {
    const header = document.querySelector('.main-header');
    if (!header) return;

    const menuButton = document.createElement('button');
    menuButton.className = 'mobile-menu-toggle';
    menuButton.innerHTML = `
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor"/>
      </svg>
    `;
    header.insertBefore(menuButton, header.firstChild);

    // Add styles for the menu button
    const style = document.createElement('style');
    style.textContent = `
      .mobile-menu-toggle {
        display: none;
        background: none;
        border: none;
        color: var(--text-color);
        cursor: pointer;
        padding: 0.5rem;
      }
      
      @media (max-width: 992px) {
        .mobile-menu-toggle {
          display: block;
        }
      }
    `;
    document.head.appendChild(style);

    // Add event listener to toggle sidebar
    menuButton.addEventListener('click', function() {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.toggle('active');
      }
    });

    // Close sidebar when clicking outside of it
    document.addEventListener('click', function(e) {
      const sidebar = document.querySelector('.sidebar');
      const menuButton = document.querySelector('.mobile-menu-toggle');
      
      if (sidebar && menuButton && 
          !sidebar.contains(e.target) && 
          !menuButton.contains(e.target)) {
        sidebar.classList.remove('active');
      }
    });
  }
}

/**
 * Initialize global search functionality
 */
function initializeSearchBar() {
  const searchInput = document.getElementById('global-search');
  if (!searchInput) return;

  searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const searchTerm = this.value.trim();
      if (searchTerm) {
        window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
      }
    }
  });

  const searchButton = document.querySelector('.search-btn');
  if (searchButton) {
    searchButton.addEventListener('click', function() {
      const searchTerm = searchInput.value.trim();
      if (searchTerm) {
        window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
      }
    });
  }
}

/**
 * Initialize filter toggle for mobile
 */
function initializeFilterToggle() {
  const filters = document.querySelector('.filters');
  if (!filters) return;

  // Only add toggle if it doesn't exist yet
  if (!document.querySelector('.filter-toggle')) {
    // Create toggle button
    const toggleButton = document.createElement('button');
    toggleButton.className = 'filter-toggle';
    toggleButton.textContent = 'Show Filters';
    
    // Create filter content wrapper
    const filterContent = document.createElement('div');
    filterContent.className = 'filter-content';
    
    // Move all filters children to the content wrapper
    while (filters.children.length > 0) {
      filterContent.appendChild(filters.children[0]);
    }
    
    // Add the button and content wrapper to filters
    filters.appendChild(toggleButton);
    filters.appendChild(filterContent);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .filter-toggle {
        display: none;
        width: 100%;
        padding: 0.75rem;
        background-color: var(--secondary-color);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        text-align: center;
        font-weight: 500;
        cursor: pointer;
      }
      
      @media (max-width: 768px) {
        .filter-toggle {
          display: block;
        }
        
        .filter-content {
          display: none;
          margin-top: 1rem;
        }
        
        .filter-content.active {
          display: block;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Add event listener
    toggleButton.addEventListener('click', function() {
      const content = this.nextElementSibling;
      content.classList.toggle('active');
      this.textContent = content.classList.contains('active') ? 'Hide Filters' : 'Show Filters';
    });
  }
}

/**
 * Format a date to a readable string
 * @param {Date|string} date - Date to format
 * @param {boolean} includeTime - Whether to include time
 * @returns {string} Formatted date string
 */
function formatDate(date, includeTime = false) {
  if (!date) return 'N/A';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid Date';
  
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };
  
  if (includeTime) {
    options.hour = '2-digit';
    options.minute = '2-digit';
  }
  
  return d.toLocaleDateString(undefined, options);
}

/**
 * Format a number to a currency string
 * @param {number} value - Number to format
 * @param {string} currency - Currency code (USD, EUR, etc.)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted currency string
 */
function formatCurrency(value, currency = 'USD', decimals = 0) {
  if (value === undefined || value === null) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Format a number with thousand separators
 * @param {number} value - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number string
 */
function formatNumber(value, decimals = 0) {
  if (value === undefined || value === null) return 'N/A';
  
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Truncate text to a specified length and add ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength = 100) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  
  return text.substring(0, maxLength) + '...';
}

/**
 * Show a notification toast
 * @param {string} message - Message to display
 * @param {string} type - Type of message (success, error, warning, info)
 * @param {number} duration - Duration in milliseconds
 */
function showNotification(message, type = 'info', duration = 3000) {
  // Create notification container if it doesn't exist
  let container = document.querySelector('.notification-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'notification-container';
    document.body.appendChild(container);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .notification-container {
        position: fixed;
        top: 1rem;
        right: 1rem;
        z-index: 9999;
      }
      
      .notification {
        padding: 1rem;
        margin-bottom: 0.5rem;
        border-radius: 4px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        min-width: 250px;
        max-width: 350px;
        animation: notification-slide-in 0.3s ease;
      }
      
      .notification.success { background-color: #e6f7ed; color: var(--success-color); }
      .notification.error { background-color: #fce8e8; color: var(--error-color); }
      .notification.warning { background-color: #fff7e6; color: var(--warning-color); }
      .notification.info { background-color: #e6f0f9; color: var(--info-color); }
      
      @keyframes notification-slide-in {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      
      @keyframes notification-slide-out {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
  
  // Create notification
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  // Add to container
  container.appendChild(notification);
  
  // Remove after duration
  setTimeout(() => {
    notification.style.animation = 'notification-slide-out 0.3s ease forwards';
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, duration);
} 