/**
 * @todo Functionality: ability to toggle extension
 * on and off
 **/

async function collectAudibleTabs() {
    const queryOpts = { audible: true };
    const tabs = await chrome.tabs.query(queryOpts);

    console.log("DEBUG: Tab Mute Extension - detected " +
        tabs.length + " audible tabs.");

    return tabs;
}

async function toggleMute() {
    /* get currently highlighted tab to determine audibility */
    const currentTab = await chrome.tabs.query({ highlighted: true });
    
    /* if the currently highlight tab is not audible, do nothing.
     * this is so going from an audible tab to an inaudible tab
     * will not cause the previous tab to be muted. */
    if (!currentTab[0].audible) return;

    const audibleTabs = await collectAudibleTabs();
    for (let i = 0; i < audibleTabs.length; ++i) {
        const tabId = await audibleTabs[i].id;
        if (audibleTabs[i].active) {
            if (audibleTabs[i].mutedInfo.muted) {   
                console.log("DEBUG: Tab Mute Extension - Tab ID: " + 
                    tabId + " UNMUTED");

                chrome.tabs.update(tabId, { muted: false });
            }
        } else {
            console.log("DEBUG: Tab Mute Extension - Tab ID: " +
                tabId + " MUTED");

            chrome.tabs.update(tabId, { muted: true });
        }
    }
}

chrome.tabs.onActivated.addListener(() => {
    toggleMute();
});

chrome.tabs.onUpdated.addListener(() => {
    toggleMute();
});

chrome.tabs.onCreated.addListener(() => {
    collectAudibleTabs();
});
