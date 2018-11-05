module.exports = function bigsixApi( options ) {
  
  this.add( 'role:bigsixApi,path:spin', function( msg, respond ) {
    var gameID = msg.args.query.gameID;
    var bet = msg.args.query.bet;
    var betSymbol = msg.args.query.betSymbol;

    if (!gameID || !bet || !betSymbol ) {
      return respond(new Error("Expected a gameID, bet and betSymbol to be defined."));
    }

    this.act( 'role:bigsix', {
        cmd:   "play",
        gameID:  gameID,
        bet: bet,
        betSymbol: betSymbol,
      }, respond);
  })

  
  this.add( 'init:bigsixApi', function( msg, respond ) {
    this.act('role:web',{routes:{
      prefix: '/api/bigsix',
      pin:    'role:bigsixApi,path:*',
      map: {
        spin: {GET: true}
      }
    }}, respond) ;
  })

}
