document.addEventListener("DOMContentLoaded", () => {
    const tabList = document.getElementById("tab-list");
    const thresholdSelect = document.getElementById("threshold");

    function loadInactiveTabs() {
        const threshold = parseInt(thresholdSelect.value);
        chrome.tabs.query({}, (tabs) => {
            chrome.storage.local.get(null, (data) => {
                const now = Date.now();
                let inactiveTabs = [];

                tabs.forEach(tab => {
                    let lastAccessed = data[tab.id] || now;
                    if (now - lastAccessed > threshold) {
                        inactiveTabs.push(tab);
                    }
                });

                if (tabs.length > 0) {
                    let firstTabLastAccessed = data[tabs[0].id] || now;
                    if ((now - firstTabLastAccessed > threshold) && !inactiveTabs.includes(tabs[0])) {
                        inactiveTabs.push(tabs[0]);
                    }
                }

                displayTabs(inactiveTabs);
            });
        });
    }

    function displayTabs(inactiveTabs) {
        tabList.innerHTML = "";
        inactiveTabs.forEach(tab => {
            let tabItem = document.createElement("div");
            tabItem.className = "tab-item";

            let favicon = document.createElement("img");
            favicon.className = "tab-favicon";
            favicon.src = tab.favIconUrl || "https://www.google.com/favicon.ico";

            let tabTitle = document.createElement("span");
            tabTitle.textContent = tab.title;

            let closeBtn = document.createElement("button");
            closeBtn.className = "close-btn";
            closeBtn.innerHTML = 'Close';
            closeBtn.onclick = () => chrome.tabs.remove(tab.id);

            tabItem.appendChild(favicon);
            tabItem.appendChild(tabTitle);
            tabItem.appendChild(closeBtn);

            tabList.appendChild(tabItem);
        });
    }

    loadInactiveTabs();

    thresholdSelect.addEventListener("change", loadInactiveTabs);
});