Game.registerMod("better4ksupport",{
	init:function(){
		function makeCrispy() {
			document.getElementsByTagName('body')[0].style = 'image-rendering: pixelated; image-rendering: crisp-edges';
			document.getElementById('buffs').style = 'image-rendering: auto';
		}

		makeCrispy();
	}
});