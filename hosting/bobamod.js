document.addEventListener("keypress", function onEvent(event) {
    if (event.key === "z") {
        document.getElementById("bigCookie").click();
    }
});

function makeCrispy() {
	document.getElementsByTagName('body')[0].style = 'image-rendering: crisp-edges';
	alert('should be working');
}

window.onload = setTimeout(makeCrispy, 3000);