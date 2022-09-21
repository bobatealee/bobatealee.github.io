// title outlines
document.addEventListener('DOMContentLoaded', (event) => {
	$(function() {
		$('.titleOutline').attr('temp', function() {return $(this).html();});
	});

	for (let i = 0; i < document.getElementsByClassName("desktopButton").length; i++) {
	  document.getElementsByClassName("desktopButton")[i].style.backgroundPosition = -(i*32)+"px 0px";
	}
});
				
// title toy 1
function rainbowToggle() {
	document.getElementById("title").classList.toggle("rainbow");
};
			
// title toy 9
function flipToggle() {
	document.getElementById("content").classList.toggle("flipped");
	document.getElementById("html").classList.toggle("flippedColor");
};

// textbox opening/closing
function textboxToggle(x) {
	document.getElementById("textbox"+x).classList.toggle("hidden");
	document.getElementById("desktopButton"+x).classList.toggle("hidden");
};