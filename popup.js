// Request tabs when the popup opens
document.addEventListener('DOMContentLoaded', () => {
  browser.runtime.sendMessage({ action: 'getTabs' });
});

// Listen for the message with grouped tabs from the background script
browser.runtime.onMessage.addListener((message) => {
  if (message.groupedTabs) {
    console.log('Received grouped tabs in popup:', message.groupedTabs);
    displayGroupedTabs(message.groupedTabs);
  }
});

// Function to display the grouped tabs in the popup
function displayGroupedTabs(groups) {
  const container = document.getElementById('tabGroupsContainer');
  container.innerHTML = ''; // Clear previous content

  for (let domain in groups) {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'tab-group';

    // Create a heading for each domain
    const domainHeading = document.createElement('h3');
    domainHeading.textContent = domain;
    groupDiv.appendChild(domainHeading);

    // Create a button to move all tabs of this domain to a new window
    const moveButton = document.createElement('button');
    moveButton.textContent = 'Move all tabs to new window';
    moveButton.addEventListener('click', () => {
      browser.runtime.sendMessage({ action: 'moveToNewWindow', domain, tabs: groups[domain] });
    });
    groupDiv.appendChild(moveButton);

    // Create a list of tabs under the domain
    const tabList = document.createElement('ul');
    groups[domain].forEach((tab) => {
      const tabItem = document.createElement('li');
      tabItem.textContent = tab.title;
      tabItem.style.cursor = 'pointer';
      tabItem.addEventListener('click', () => {
        browser.tabs.update(tab.id, { active: true });
      });
      tabList.appendChild(tabItem);
    });

    groupDiv.appendChild(tabList);
    container.appendChild(groupDiv);
  }
}
