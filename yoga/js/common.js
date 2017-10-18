
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

$('.format_item').equalHeights();



( function() {

	var youtube = document.querySelectorAll( ".youtube" );
	
	for (var i = 0; i < youtube.length; i++) {
		
		var source = "https://img.youtube.com/vi/"+ youtube[i].dataset.embed +"/sddefault.jpg";
		
		var image = new Image();
		image.src = source;
		image.addEventListener( "load", function() {
			youtube[ i ].appendChild( image );
		}( i ) );
		
		youtube[i].addEventListener( "click", function() {

			var iframe = document.createElement( "iframe" );

			iframe.setAttribute( "frameborder", "0" );
			iframe.setAttribute( "allowfullscreen", "" );
			iframe.setAttribute( "src", "https://www.youtube.com/embed/"+ this.dataset.embed +"?rel=0&showinfo=0&autoplay=1" );

			this.innerHTML = "";
			this.appendChild( iframe );
		} );    
	};
	
} )();



	//E-mail Ajax Send
	$("form").submit(function() { //Change
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "mail.php", //Change
			data: th.serialize()
		}).done(function() {
			alert("Thank you!");
			setTimeout(function() {
				// Done Functions
				th.trigger("reset");
			}, 1000);
		});
		return false;
	});


	$('a[href="#callback"').magnificPopup({
		type: 'inline',
		fixedContentPos: false,
		fixedBgPos: true,

		overflowY: 'auto',

		closeBtnInside: false,
		preloader: false,
		
		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-zoom-in'
	});
		$('a[href="#callback_training"').magnificPopup({
		type: 'inline',
		fixedContentPos: false,
		fixedBgPos: true,

		overflowY: 'auto',

		closeBtnInside: false,
		preloader: false,
		
		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-zoom-in'
	});		

		$('a[href="#callback_art1"').magnificPopup({
		type: 'inline',
		fixedContentPos: false,
		fixedBgPos: true,

		overflowY: 'auto',

		closeBtnInside: false,
		preloader: false,
		
		midClick: true,
		removalDelay: 300,
		mainClass: 'my-mfp-zoom-in'
	});


$(".top").click(function(){
	$("html, body").animate({scrollTop: 0}, "slow");
});

	$(".regular_nav, .hidden_menu").on("click","a", function (event) {
		//отменяем стандартную обработку нажатия по ссылке
		event.preventDefault();

		//забираем идентификатор бока с атрибута href
		var id  = $(this).attr('href'),

		//узнаем высоту от начала страницы до блока на который ссылается якорь
			top = $(id).offset().top;
		
		//анимируем переход на расстояние - top за 1500 мс
		$('body,html').animate({scrollTop: top}, "slow");
	});