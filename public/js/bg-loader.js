$(document).ready( function() {
	//background loader
	var $downloadingImage = $("<img>");
	$downloadingImage.load(function(){
	  var $str = "url(" + $(this).attr("src") + ")";
	  $(document.body).css("background", $str);
	});
	$downloadingImage.attr("src", "/img/grain-wood.jpg");
});