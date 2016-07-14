$(document).ready(function() {
    
    var bootstrap_enabled = (typeof $().modal == 'function');
    console.log(bootstrap_enabled);
    
    $('#nav-hmenu').click(function(){
		$(this).toggleClass('open');
    });
    
    $('.flap-spacer').css("height", $('ul.nav').height());
    
    if ($('.specials ul li').length < 1) {
        $('.specials ul').append($('<li></li>').text("No specials today").addClass("list-group-item"));
    }
    
    $(window).resize(function() {
        $('.flap-spacer').css("height", $('ul.nav').height()); 
    });
    
});