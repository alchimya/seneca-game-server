
var fs = require('fs');
module.exports = function math( options ) { 

	var mathFolder = null;

	this.add('role:math,cmd:loadMath', loadMath);
	this.add('init:math', init);

	function loadMath (msg, respond) {

		if (!msg.gameID) {
			return respond(new Error("Expected a gameID to be defined."));
		}

		var mathFile = __dirname  +  "/" + mathFolder + '/' + msg.gameID + '.json';

		fs.stat (mathFile, function(err, stats) {
			if (err || !stats) {
				return respond(new Error("Math definition not found or an error occurred:" + mathFile));
			}
			var mathContent = JSON.parse(fs.readFileSync(mathFile), 'utf8');
			respond (null, {mathContent: mathContent});
		});

	}

	function init(msg, respond) {
		//todo create a new folder service.
		mathFolder = "math";
		respond();
	}

}
