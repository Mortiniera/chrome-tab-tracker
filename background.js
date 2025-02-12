chrome.runtime.onStartup.addListener(() => {
    chrome.tabs.query({}, (tabs) => {
        let updates = {};
        let now = Date.now();
        tabs.forEach(tab => {
            updates[tab.id] = now;
        });
        chrome.storage.local.set(updates);
    });
});

chrome.tabs.onActivated.addListener(activeInfo => {
    chrome.storage.local.set({ [activeInfo.tabId]: Date.now() });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete") {
        chrome.storage.local.set({ [tabId]: Date.now() });
    }
});

chrome.tabs.onRemoved.addListener(tabId => {
    chrome.storage.local.remove(tabId.toString());
});
