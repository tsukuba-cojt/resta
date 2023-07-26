chrome.action.onClicked.addListener((tab) => {
  const message = { type: 'url', url: tab.url };
  chrome.tabs.sendMessage(tab.id, message);
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    const message = { type: 'activate', url: tab.url };
    chrome.tabs.sendMessage(tab.id, message);
  });
});
