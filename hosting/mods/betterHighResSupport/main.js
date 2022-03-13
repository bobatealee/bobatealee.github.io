Game.registerMod("betterHighResSupport",{
	init:function(){
		function makeCrispy() {
			// make the whole game crispy!
			document.getElementsByTagName('body')[0].style = 'image-rendering: pixelated; image-rendering: crisp-edges';
			// keep buff icons at the top right the same because they have weird scaling
			document.getElementById('buffs').style = 'image-rendering: auto';
		}

		makeCrispy();
	}
});