$(document).ready(function() {
	//----------------------------app---------------------------//

	/*view jackpot*/
	var client = new BowlingApiClient('http://bowling-api.nextcapital.com/api');
	//load leagues
	  client.createLeague({
    name: 'The Catsssss',
    success: function(league) {
      console.log(league);
    },
    error: function(xhr)  {
      console.log(JSON.parse(xhr.responseText));
    }
  });
	client.getLeagues({
	    success: function(leagues) {
	      console.log(leagues);

	    },
	    error: function(xhr)  {
	      console.log(JSON.parse(xhr.responseText));
	    }
  	});
	

	//buy ticket


	//draw winner



	//roll


	//history

});