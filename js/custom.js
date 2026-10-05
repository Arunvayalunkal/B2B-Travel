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

<!--popup-->
$("#pop-link").on("click", function () { 
	$("#c-pop").show();
	$(".commonpop-overlay").show();
});
$(".pop-close").on("click", function () { 
	$("#c-pop").hide();
	$(".commonpop-overlay").hide();
});

$(".pop-close").on("click", function () { 
	$("#offer-pop").hide();
	$(".commonpop-overlay").hide();
});