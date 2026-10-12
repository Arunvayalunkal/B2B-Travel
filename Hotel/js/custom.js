$(".nav-btn").click(function(){
  $(".mob-overlay").show();
  $(".mobile-menu").show();
});
$(".mob-overlay, .m-close-btn").click(function(){
  $(".mob-overlay").hide();
  $(".mobile-menu").hide();
  $(".filter-con").hide();
});

$(".prof-link").click(function(){
  $(".prof-pop").toggle();
});

$(".submenu-link").click(function(){
  $(".submenu-pop").toggle();
});

//sort mobile pop

$("#s-mob-link").click(function(){
  $(".sort-pop").toggle();
});

//filter mobile 
$(".filter-btn").click(function(){
  $(".mob-overlay").show();
  $(".filter-con").show();
});

//modify search 
$(".ms-btn,.modify-btn").click(function(){
  $(".modify-overlay").show();
  $(".modify-window").show();
});
$(".modify-overlay").click(function(){
  $(".modify-overlay").hide();
  $(".modify-window").hide();
});

//hotel room show hide
$("#mroom").click(function(){
	$("#pills-home.tab-mob-hide").toggleClass("tab-mob-show");
	$("#mroom.arrow-down").toggleClass("arrow-up");
});

$("#sroom").click(function(){
	$("#pills-profile.tab-mob-hide").toggleClass("tab-mob-show");
	$("#sroom.arrow-down").toggleClass("arrow-up");
});

$("#troom").click(function(){
	$("#pills-contact.tab-mob-hide").toggleClass("tab-mob-show");
	$("#troom.arrow-down").toggleClass("arrow-up");
});