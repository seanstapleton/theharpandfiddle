$(document).ready(function() {
    
    var bootstrap_enabled = (typeof $().modal == 'function');
    console.log(bootstrap_enabled);
    
    $('#nav-hmenu').click(function(){
		$(this).toggleClass('open');
    });
    
    $('.flap-spacer').css("height", $('ul.nav').height());
    
});
