Game.registerMod("betterHighResSupport",{
	init:function(){
		if (betterHighResSupport === undefined) var betterHighResSupport = {};
		betterHighResSupport.version = "2.0";
		var style = document.createElement("style");
		style.innerText =`
		body {
			image-rendering: pixelated; image-rendering: crisp-edges; /* make everything crispy, done with 2 different values to cover all browsers */
		}
		
		div.crate.enabled.buff::before {
			image-rendering: auto; /* exclude buff crate because it's scaled oddly */
		}
		`;

		document.head.appendChild(style);
		
		Game.Notify("Better High Res Support loaded!", "Version "+betterHighResSupport.version, [21, 1], 2, 1);
	}
});