// Function to extract the domain from a URL
function extractDomain(url) {
  try {
    const urlObj = new URL(url);
    const domainParts = urlObj.hostname.split('.');
    return domainParts.length > 2 ? domainParts.slice(-2).join('.') : urlObj.hostname;
  } catch (e) {
    console.error('Error extracting domain from URL:', url);
    return 'unknown';
  }
}

// Function to group tabs by domain
function groupTabs(tabs) {
  const groups = {};
  tabs.forEach((tab) => {
    const domain = extractDomain(tab.url);
    if (!groups[domain]) {
      groups[domain] = [];
    }
    groups[domain].push(tab);
  });
  console.log('Grouped Tabs:', groups);
  return groups;
}

// Listen for messages from popup to fetch the grouped tabs
browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getTabs') {
    browser.tabs.query({}).then((tabs) => {
      const groupedTabs = groupTabs(tabs);
      browser.runtime.sendMessage({ groupedTabs });
    });
  } else if (request.action === 'moveToNewWindow') {
    const { domain, tabs } = request;
    const tabIds = tabs.map(tab => tab.id);
    
    // Move all tabs of the domain to a new window
    browser.windows.create({ tabId: tabIds[0] }).then(newWindow => {
      browser.tabs.move(tabIds, { windowId: newWindow.id, index: -1 });
    });
  }
});
