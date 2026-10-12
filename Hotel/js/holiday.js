

$("#contact-btn").click(function(){
		  $("#contact-form-pop").show().fadeIn();
		  $(".enq-pop-overlay").show().fadeIn();
		});
		
$("#log-signup-btn").click(function(){
		  $("#login-signup-pop").show().fadeIn();
		  $(".enq-pop-overlay").show().fadeIn();
		});
$("#enq-now, .h-moredtls").click(function(){
		  $(".enq-pop").show().fadeIn();
		  $(".enq-pop-overlay").show().fadeIn();
		});
		
		
		$(".popup-close").click(function(){
		  $(".enq-pop").hide();
		  $(".enq-pop-overlay").hide();
		  $("#enq-form").show().fadeIn();
		   $("#thankyou-win").hide().fadeOut();
		});
		

 $("#mnum-window").show();
	 $("#otp-window").hide();
	 $("#getotp").click(function(){
		  $("#otp-window").show().fadeIn();
		   $("#mnum-window").hide().fadeOut();
		  
		});
		
	$(".back-ph").click(function(){
		  $("#otp-window").hide().fadeOut();
		   $("#mnum-window").show().fadeIn();
		  
		});		
//filter mobile 
	
/*price range slider*/

function showProducts(minPrice, maxPrice) {
    $("#flightlist .search-result-bx").hide().filter(function() {
        var price = parseInt($(this).data("price"), 10);
        return price >= minPrice && price <= maxPrice;
    }).show();
	
}

$(function() {
    var options = {
        range: true,
        min: 0,
        max: 500,
        values: [10, 300],
        slide: function(event, ui) {
            var min = ui.values[0],
                max = ui.values[1];

            $("#amount").val("$" + min + " - $" + max);
            showProducts(min, max);
        }
    }, min, max;

    $("#slider-range").slider(options);

    min = $("#slider-range").slider("values", 0);
    max = $("#slider-range").slider("values", 1);

    $("#amount").val("$" + min + " - $" + max);

    showProducts(min, max);
});

$(function() {
    var options = {
        range: true,
        min: 0,
        max: 20,
        values: [3, 15],
        slide: function(event, ui) {
            var min = ui.values[0],
                max = ui.values[1];

            $("#amount-dur").val(+ min + " - " + max);
            showProducts(min, max);
        }
    }, min, max;

    $("#slider-duration").slider(options);

    min = $("#slider-duration").slider("values", 0);
    max = $("#slider-duration").slider("values", 1);

    $("#amount-dur").val(+ min + " - " + max);

    showProducts(min, max);
});


$("#pills-hotel-tab").click(function(){
$('.flight-slider').slick('refresh');
$('.hotel-slider').slick('refresh');
});











		
 var changeSlide = 4; // mobile -1, desktop + 1
// Resize and refresh page. slider-two slideBy bug remove
var slide = changeSlide;
          if ($(window).width() < 600) {
             var slide = changeSlide;
              slide--;
          }
          else if ($(window).width() > 999) {
             var slide = changeSlide;
              slide++;
          }
          else{
           var slide = changeSlide;
          }
  $(document).ready(function() {
      $('.one').owlCarousel({
          nav: true,
          items: 1,
      })
      $('.two').owlCarousel({
          nav: true,
          margin: 15,
          mouseDrag: false,
          touchDrag: false,
          responsive: {
              0: {
                  items: changeSlide - 1,
                  slideBy: changeSlide - 1
              },
              600: {
                  items: changeSlide,
                  slideBy: changeSlide
              },
              1000: {
                  items: changeSlide + 1,
                  slideBy: changeSlide + 1
              }
          }
      })
      var owl = $('.one');
      owl.owlCarousel();
      owl.on('translated.owl.carousel', function(event) {
          $(".right").removeClass("nonr");
          $(".left").removeClass("nonl");
          if ($('.one .owl-next').is(".disabled")) {
              $(".holiday-slider .right").addClass("nonr");
          }
          if ($('.one .owl-prev').is(".disabled")) {
              $(".holiday-slider .left").addClass("nonl");
          }
          $('.slider-two .item').removeClass("active");
          var c = $(".holiday-slider .owl-item.active").index();
          $('.slider-two .item').eq(c).addClass("active");
          var d = Math.ceil((c + 1) / (slide)) - 1;
          $(".slider-two .owl-dots .owl-dot").eq(d).trigger('click');
      })
      $('.right').click(function() {
          $(".holiday-slider .owl-next").trigger('click');
      });
      $('.left').click(function() {
          $(".holiday-slider .owl-prev").trigger('click');
      });
      $('.slider-two .item').click(function() {
          var b = $(".item").index(this);
          $(".holiday-slider .owl-dots .owl-dot").eq(b).trigger('click');
          $(".slider-two .item").removeClass("active");
          $(this).addClass("active");
      });
      var owl2 = $('.two');
      owl2.owlCarousel();
      owl2.on('translated.owl.carousel', function(event) {
          $(".right-t").removeClass("nonr-t");
          $(".left-t").removeClass("nonl-t");
          if ($('.two .owl-next').is(".disabled")) {
              $(".slider-two .right-t").addClass("nonr-t");
          }
          if ($('.two .owl-prev').is(".disabled")) {
              $(".slider-two .left-t").addClass("nonl-t");
          }
      })
      $('.right-t').click(function() {
          $(".slider-two .owl-next").trigger('click');
      });
      $('.left-t').click(function() {
          $(".slider-two .owl-prev").trigger('click');
      });
  });
  
  $("#bn-btn").click(function(){
		  $("#enq-form").hide().fadeOut();
		   $("#thankyou-win").show().fadeIn();
		  
		});
 