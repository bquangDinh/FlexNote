chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    "id": "highlight_color_menu",
    "title": "Select highlight color",
    "contexts": ["selection"]
  });

  chrome.contextMenus.create({
    "parentId": "highlight_color_menu",
    "id": 'important',
    "title": "important (red)",
    "contexts": ["selection"]
  });

  chrome.contextMenus.create({
    "parentId": "highlight_color_menu",
    "id": "review",
    "title": "review (yellow)",
    "contexts": ["selection"]
  });

  chrome.contextMenus.create({
    "parentId": "highlight_color_menu",
    "id": "example",
    "title": "example (pink)",
    "contexts": ["selection"]
  });

  chrome.contextMenus.create({
    "parentId": "highlight_color_menu",
    "id": "term",
    "title": "term (green)",
    "contexts": ["selection"]
  });

  chrome.contextMenus.create({
    "parentId": "highlight_color_menu",
    "id": "other",
    "title": "other (orange)",
    "contexts": ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(function(info, tab){
  //send highlight instruction to content_script
  console.log(info);

  if (info.parentMenuItemId === 'highlight_color_menu'){
    chrome.tabs.sendMessage(tab.id,{
      command: 'highlight',
      menuId: info.menuItemId,
      selectionText: info.selectionText
    }, function(response){
      console.log(response);
    });
  }
});