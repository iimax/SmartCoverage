// Copyright (c) 2016 iimax. All rights reserved.

//https://www.iconfinder.com/icons/69832/basic_button_check_red_icon#size=48

var parent = chrome.contextMenus.create({
  "title": "Generate Codes(Auto)",
  "id": "0",
  "contexts": ["all"]
});
// var parentH = chrome.contextMenus.create({
//   "title": "Generate Codes(Home)",
//   "id": "1",
//   "contexts": ["all"]
// });

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  chrome.tabs.sendMessage(tab.id, {});
})