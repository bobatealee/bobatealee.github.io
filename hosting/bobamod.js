document.addEventListener("keypress", function onEvent(event) {
    if (event.key === "z") {
        document.getElementById("bigCookie").click();
    }
});

function makeCrispy() {
	document.getElementsByTagName('body')[0].style = 'image-rendering: crisp-edges';
}

window.onload = makeCrispy;