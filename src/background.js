const HIGHLIGHT_COLOR_SELECTION_MENU = {
  id: 'highlight_color_menu',
  title: 'Select highlight color',
  contexts: ['selection'],
  children: [
    {
      id: 'important',
      title: 'important (red)',
      contexts: ['selection'],
    },
    {
      id: 'review',
      title: 'review (yellow)',
      contexts: ['selection'],
    },
    {
      id: 'term',
      title: 'term (green)',
      contexts: ['selection'],
    },
    {
      id: 'example',
      title: 'example (pink)',
      contexts: ['selection'],
    },
    {
      id: 'other',
      title: 'other (orange)',
      contexts: ['selection'],
    }
  ]
};

chrome.runtime.onInstalled.addListener(function() {
  /*Create Highlight Color Selection Menu*/
  chrome.contextMenus.create({
    "id": HIGHLIGHT_COLOR_SELECTION_MENU.id,
    "title": HIGHLIGHT_COLOR_SELECTION_MENU.title,
    "contexts": HIGHLIGHT_COLOR_SELECTION_MENU.contexts
  });

  /*Create sub-menus*/
  HIGHLIGHT_COLOR_SELECTION_MENU.children.forEach(menu => {
    chrome.contextMenus.create({
      "parentId": HIGHLIGHT_COLOR_SELECTION_MENU.id,
      "id": menu.id,
      "title": menu.title,
      "contexts": menu.contexts
    });
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