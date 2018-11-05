var NodeCache = require('node-cache');

module.exports = function bigsix( options ) { 

	var nodeCache = null;

	this.add('role:bigsix,cmd:play', play);
	this.add('init:bigsix', init);


	function init(msg, respond) {
		nodeCache = new NodeCache( { stdTTL: 100, checkperiod: 120 } );
		respond();
	}

	function play( msg, respond ) {
		//check input params
		if (!msg.gameID || !msg.bet || !msg.betSymbol ) {
			return respond(new Error("Expected a gameID, bet and betSymbol to be defined."));
		}
		//get game math definition
		getMathDef(msg.gameID, function(mathDef) {
		  	if (mathDef.error) {
		  		return respond(new Error(mathDef.error));
		  	}
	  		//get game result
	  		getResult (mathDef.value , msg.bet, msg.betSymbol, function (gameResult){
	  			respond( null, gameResult);
	  		})
			
		});
	}


	function getMathDef (gameID, callback) {
		//get game math def from cache if exists, otherwise load from service and store into cache
		nodeCache.get( gameID, function( cacheErr, mathDefCached ){
			if( !cacheErr ){
				if(mathDefCached == undefined){
				  // key not found
					require('seneca')()
					  .client(8081)
					  .act('role:math,cmd:loadMath,gameID:' + gameID, function (senecaErr, result) {
					  	nodeCache.set(gameID, result.mathContent);
					  	if (callback) {
					  		callback ({
								error: senecaErr,
								value: result.mathContent
							});
					  	}
					  });

				}else{
				  	if (callback) {
				  		callback ({
							error: cacheErr,
							value: mathDefCached
						});
				  	}
				}
			}
		});

	}

	function getResult (mathDef, bet, betSymbol, callback) {

		getRandom (function (random) {
		  	if (mathDef.error) {
		  		return respond(new Error(random.error));
		  	}
		  	//get symbols stop by nomralization of the the rng result
		  	var wheelStop = (random.value % mathDef.game.wheel.items.length);
		  	//get the symbol name
		  	var symbolName = mathDef.game.wheel.items[wheelStop].toString();

		  	var win = 0;
		  	if (symbolName === betSymbol) {
			  	//get the symbol item
			  	var symbol = mathDef.game.symbols.filter (function (item){
			  		return item.name === symbolName;
			  	});

			  	if (symbol.length > 0) {
			  		//calculate the bet as bet * symbols pays
					win = bet * symbol[0].pays;
			  	}
		  	}

		  	//retun the result
		  	if (callback) {
		  		callback ({
					result: {
						bet: bet,
						betSymbol: betSymbol,
						symbol: symbolName,
		  				win: win,
		  				wheelStop: wheelStop
					}
		  		});
		  	}
		});
	}

	function getRandom (callback) {
		//get a new random number using the ng service
		require('seneca')()
		  .client(8082)
		  .act('role:rng,cmd:next', function (err, result) {
			if (callback) {
		  		callback ({
					error: err,
					value: result.value
				});
		  	}
		  });
	}

}
