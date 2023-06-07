chrome.action.onClicked.addListener((tab) => {
  const message = { type: 'url', url: tab.url };
  chrome.tabs.sendMessage(tab.id, message);
});
