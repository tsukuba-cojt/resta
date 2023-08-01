chrome.action.onClicked.addListener((tab) => {
  const message = { type: 'url', url: tab.url };
  chrome.tabs.sendMessage(tab.id, message).catch(() => {
    return;
  });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    const message = { type: 'activate', url: tab.url };
    chrome.tabs.sendMessage(tab.id, message).catch(() => {
      return;
    });
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === 'complete' &&
    tab.url.indexOf('https://resta-frontend.pages.dev') > -1
  ) {
    chrome.scripting.executeScript(
      {
        target: { tabId, allFrames: true },
        files: ['upload_import_manager.js'],
      },
      () => {},
    );
  }
});
