document.addEventListener("keypress", function onEvent(event) {
    if (event.key === "z") {
        document.getElementById("bigCookie").click();
    }
});

function makeCrispy() {
	document.getElementsByTagName('body')[0].style = 'image-rendering: pixelated; image-rendering: crisp-edges';
	document.getElementById('buffs').style = 'image-rendering: auto';
}

window.onload = setTimeout(makeCrispy, 1500);