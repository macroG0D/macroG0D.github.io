$(function() {
	//Scrollings:
	$(".toAbout").click(function(){
		$("html, body").animate({
			scrollTop : $(".s-advantages").offset().top
		}, 800)
	});	
	$(".toChars").click(function(){
		$("html, body").animate({
			scrollTop : $(".s-chars").offset().top
		}, 800)
	});
	$(".toPreorder").click(function(){
		$("html, body").animate({
			scrollTop : $(".sect-preorder").offset().top
		}, 800)
	});
	$(".toContacts").click(function(){
		$("html, body").animate({
			scrollTop : $(".s-contacts").offset().top
		}, 800)
	});

	$(".mouse-icon").click(function(){
		$("html, body").animate({
			scrollTop : $(".s-advantages").offset().top
		}, 800)
	});
	$(".goTop").click(function(){
		$("html, body").animate({
			scrollTop : $("header").offset().top
		}, 800)
	});



	$(".toggle-mnu").click(function() {
		$(this).toggleClass("on");
		$(".hidden-mnu").slideToggle();
		return false;
	});



});
