(() => {
  $.urlParam = (name) => {
    const results = new RegExp(`[?&]${name}=([^&#]*)`).exec(window.location.href);
    return results[1] || 0;
  };
  console.log(`/backendServices/menus/${$.urlParam('menu')}`);
  $.get(`/backendServices/menus/${$.urlParam('menu')}`)
    .then((res) => {
      if (!res.success) {
        console.log(res.err);
      } else {
        const menuData = res.data;
        console.log(menuData);
        $('#menu-header').css('background-image', `url('${menuData.header_img}')`);
        const headerTitle = $('<h2></h2>').text(menuData.header_title);
        $('#menu-header').append(headerTitle);
        for (let i = 0; i < menuData.subsections.length; i += 1) {
          const container = $('<div class=\'subsection-container\'></div>');
          const contentContainer = $('<div class=\'subsection-content-container\'></div>');
          container.append($('<h4 class=\'subsection-header\'></h4>').text(menuData.subsections[i].title));
          const menuItems = menuData.subsections[i].items;
          for (let j = 0; j < menuItems.length; j += 1) {
            const itemOuterContainer = $('<div class=\'item-outer-container\'></div>');
            const itemContainer = $('<div class=\'item-inner-container\'></div>');
            const itemTitle = $('<p class=\'item-title\'></p>').text(menuItems[j].title);
            const itemPrice = $('<p class=\'item-price\'></p>').text(menuItems[j].price);
            const itemDesc = $('<p class=\'item-desc\'></p>').text(menuItems[j].description);
            itemContainer.append(itemTitle, itemPrice, itemDesc);
            itemOuterContainer.append(itemContainer);
            contentContainer.append(itemOuterContainer);
          }
          container.append(contentContainer);
          $('#menu-content').append(container);
        }
      }
    });
})();
