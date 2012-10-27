var currentBowl = null; // air, airGaram
var currentThing = null; // mainanPlastik, kayu, kunci

var bowls = {
	'air': {
		top: '10%',
		left: '5%',
		density: 1000,
	},
	'airGaram': {
		top: '10%',
		left: '20%',
		density: 1025,
	}
}
var things = {
	'mainanPlastik': {
		left: '55%',
		top: '10%',
		density: 1075,
	},
	'kayu': {
		left: '70%',
		top: '10%',
		density: 950,
	},
	'kunci': {
		left: '85%',
		top: '10%',
		density: 7800,
	}
	
};

function restoreBowl() {
	if (currentBowl == null)
		return;
	var bowl = bowls[currentBowl];
	$('#' + currentBowl).animate({top: bowl.top, left: bowl.left, width: '10%'});
}

function restoreThing() {
	if (currentThing == null)
		return;
	var thing = things[currentThing];
	$('#' + currentThing).clearQueue()
		.animate({top: thing.top, left: thing.left, width: '10%'});
	currentThing = null;
}

function bowlClicked(bowlName) {
	console.log('bowl clicked', bowlName);
	// kembalikan benda sekarang ke tempat semula
	restoreThing();
	// kembalikan bowl sekarang ke tempat semula
	restoreBowl();
	if (bowlName == currentBowl) {
		// tidak memilih bowl
		currentBowl = null;
		return;
	}
	currentBowl = bowlName;
	$('#' + currentBowl).animate({top: '45%', left: '40%', width: '30%'});
};

function drop(thingName) {
	console.log('thing clicked', thingName);
	currentThing = thingName;
	$('#' + currentThing)
		.animate({top: '10%', left: '50%'})
		.animate({top: '50%'}, function() {
			console.log('done');
		});
};

function float(thingName) {
	$('#' + thingName)
		.animate({top: '35%'})
		.animate({top: '40%'}, function() {
			// continuous animation until .clearQueue()
			if (currentThing == thingName)
				float(thingName);
		});
};

function sink(thingName) {
	$('#' + thingName).animate({top: '75%'});
};

function swim(thingName) {
	$('#' + thingName)
		.transition({x: '-10px', y: '5px'})
		.transition({x: '0px', y: '0px'})
		.transition({x: '-5px', y: '-5px'})
		.animate({top: '60%'}, function() {
			// continuous animation until .clearQueue()
			if (currentThing == thingName)
				swim(thingName);
		});
};

function dropAndDecide(thingName) {
	console.log('thing clicked', thingName);
	restoreThing();

	if (currentBowl == null) {
		alert('Pilih dulu baskomnya...');
		return;
	}
	
	currentThing = thingName;
	var thing = things[currentThing];
	var bowl = bowls[currentBowl];
	var decision = null;
	if (Math.abs(thing.density - bowl.density) <= 50.0) {
		decision = swim;
	} else if (thing.density < bowl.density) {
		decision = float;
	} else if (thing.density > bowl.density) {
		decision = sink;
	}
	// animation for dropping
	$('#' + currentThing)
		.animate({top: '10%', left: '50%'})
		.animate({top: '60%'}, 500, function() {
			// animation for decision
			console.log('deciding to...', decision);
			decision(thingName);
		});
};

// Inisialisasi

$('#air').bind('click', function(){ bowlClicked('air') });
$('#airGaram').bind('click', function(){ bowlClicked('airGaram') });

$('#mainanPlastik').bind('click', function(){ dropAndDecide('mainanPlastik') });
$('#kayu').bind('click', function(){ dropAndDecide('kayu') });
$('#kunci').bind('click', function(){ dropAndDecide('kunci') });

setInterval(function(){ $('#board').height( $('#board').width() * 0.5 ); }, 400);
