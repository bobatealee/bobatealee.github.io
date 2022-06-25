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

function openModal() {
	document.getElementById('modal').style.display = "block";
};

function closeModal() {
	document.getElementById('modal').style.display = "none";
};

var slides = document.getElementsByClassName("containerModal");

// on page immediate load
document.addEventListener('DOMContentLoaded', (event) => {
	for (i = 0; i < slides.length; ++i) {
		slides[i].onclick = function() {
			currentSlide(Array.prototype.indexOf.call(this.parentElement.children, this));
			openModal();
		}
	};
});

var slideIndex = 0;

function shiftSlide(n) {
	showSlides(slideIndex += n);
};

function currentSlide(n) {
	showSlides(slideIndex = n);
};

function showSlides(n) {
	if (n > (slides.length-1)) {
		slideIndex = 0;
	};
	if (n < 0) {
		slideIndex = (slides.length-1);
	};
	document.getElementById('modalTitle').innerHTML = document.getElementsByClassName("containerModal")[slideIndex].children[0].getAttribute('modalTitle');
	document.getElementById('modalImage').setAttribute('src', document.getElementsByClassName("containerModal")[slideIndex].children[0].getAttribute('src'));
	document.getElementById('modalLink').setAttribute('href', document.getElementsByClassName("containerModal")[slideIndex].children[0].getAttribute('modalLink'));
};