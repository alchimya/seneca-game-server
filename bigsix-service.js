require( 'seneca' )()
  .use( 'bigsix' )
  .listen({ type:'tcp', pin:'role:bigsix' });
