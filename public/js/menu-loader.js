(function() {
  $.urlParam = function(name){
  	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  	return results[1] || 0;
  }

  // $(document).on('click', '.subsection-header', function() {
  //   $(this).parent().find(".subsection-content-container").slideToggle();
  // });

  $.get("/backendServices/menuSection/" + $.urlParam("menu"))
    .then(function(res) {
      if (!res.success) {
        console.log(res.err);
      } else {
        console.log(res.data);
        const menuData = res.data;
        $("#menu-header").css("background-image", "url('"+menuData.header_img+"')");
        var headerTitle = $("<h2></h2>").text(menuData.header_title);
        $("#menu-header").append(headerTitle);
        for (var i = 0; i < menuData.subsections.length; ++i) {
          var container = $("<div class='subsection-container'></div>");
          var contentContainer = $("<div class='subsection-content-container'></div>");
          container.append($("<h4 class='subsection-header'></h4>").text(menuData.subsections[i].title));
          var menuItems = menuData.subsections[i].items;
          for (var j = 0; j < menuItems.length; ++j) {
            var itemOuterContainer = $("<div class='item-outer-container'></div>")
            var itemContainer = $("<div class='item-inner-container'></div>");
            var itemTitle = $("<p class='item-title'></p>").text(menuItems[j].title);
            var itemPrice = $("<p class='item-price'></p>").text(menuItems[j].price);
            var itemDesc = $("<p class='item-desc'></p>").text(menuItems[j].description);
            itemContainer.append(itemTitle, itemPrice, itemDesc);
            itemOuterContainer.append(itemContainer);
            contentContainer.append(itemOuterContainer);
          }
          container.append(contentContainer);
          $("#menu-content").append(container);
        }
      }
    });
})();
