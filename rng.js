var MersenneTwister = require('mersenne-twister');

module.exports = function rng( options ) { 

	var generator = null;

	this.add('role:rng,cmd:next', next);
	this.add('init:rng', init);

	function init(msg, respond) {
		generator = new MersenneTwister();
		respond();
	}

	function next( msg, respond ) {
		respond( null, {value: generator.random_int31()});
	}

}
