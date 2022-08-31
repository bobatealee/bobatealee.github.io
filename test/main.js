// title outlines
document.addEventListener('DOMContentLoaded', (event) => {
	$(function() {
		$('.titleOutline').attr('temp', function() {return $(this).html();});
	});
});
				
// title toy 1
function title1() {
	document.getElementById("title").classList.toggle("rainbow");
};
			
// title toy 9
function title9() {
	document.getElementById("content").classList.toggle("flipped");
	document.getElementById("modal").classList.toggle("flipped");
	document.getElementById("html").classList.toggle("flippedColor");
};