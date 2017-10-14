
var slideIndex=1;
showSlides(slideIndex);

function plusSlides(n){
	showSlides(slideIndex += n);
}

function currentSlide(n){
	showSlides(slideIndex = n);
}

function showSlides(n){
	var i;
	var slides = document.getElementsByClassName("sliders_item");

	if(n > slides.length){
		slideIndex = 1;
	}
	if(n < 1){
		slideIndex = slides.length;
	}
	for(i=0; i<slides.length; i++){
		slides[i].style.display = "none";
	}

	 slides[slideIndex-1].style.display = "block";
}

$(".toggle-mnu").click(function() {
  $(this).toggleClass("on");
  $(".hidden_menu").slideToggle();
  return false;
});
