$(document).ready(function() {



	//new instance of client
	var client = new BowlingApiClient('http://bowling-api.nextcapital.com/api');
	
	//user instantiated after succesful log in/sign up
	var user;


	//login

	$('#signup-container').hide();
	$('#view-leagues').hide();

	//toggle signup
	$('#show-signup').click(function() {
		console.log("hi");
		$('#login-container').hide();
		$('#signup-container').show();
	});

	$('#show-login').click(function() {
		$('#login-container').show();
		$('#signup-container').hide();
	});

	//login form
	$('#login-form').submit(function(event) {
		event.preventDefault();
	
		var loginemail = $("#username").val();
		var loginpassword = $("#password").val();

		//console.log(loginemail);
		//console.log(loginpassword);

		client.loginUser({
		    email: loginemail,
		    password: loginpassword,
		    success: function(userData) {
		      console.log(userData);
		      console.log("success");
		      //window.location.replace("app.html");
		      //$(location).attr('href','app.html');
		      $('#login-signup-portal').hide();
		      $('#view-leagues').show();
		      processUserInfo(userData.id);
		      viewLeagues();
		    },
		    error: function(xhr)  {
		      console.log(JSON.parse(xhr.responseText));
		      console.log("failure");
		    }
	  	});
		
	});

	//signup form
	$('#signup-form').submit(function(event) {
		event.preventDefault();
		console.log("success");
		var loginemail = $("#signupusername").val();
		var loginpassword = $("#signuppassword").val();
		var name = $("#name").val();

		console.log(loginemail);
		console.log(loginpassword);
		console.log(name);

		//create the new user's account
		client.createUser({
		    email: loginemail,
		    password: loginpassword,
		    success: function(userData) {
		      console.log(userData);

		      //create new user object for use during this session
		      user = new User(userData.id, name, createBowler(name));
		     
		    },
		    error: function(xhr)  {
		      console.log(JSON.parse(xhr.responseText));
		    }
  		});

  		//create the new user's bowler name
  		function createBowler(name) {
	  		client.createBowler ({
			    name: name,
			    success: function(bowler) {
			      console.log(bowler);

			      return bowler.id;

			    },
			    error: function(xhr)  {
			      console.log(JSON.parse(xhr.responseText));
			      return null;
			    }
			});
	  	}

	});

	//-------------------------------app-----------------------------//

	

	//user constructor
	function user(userID, bowlerName, bowlerID) {
		this.userID = userID;
		this.bowlerName = bowlerName;
		this.bowlerID = bowlerID;

	}


	$('h2').click(function() {
		viewLeagues();
	});

	//event handler for back button and refresh button
	function buttons() {
		$('.btn').click(function() {
			viewLeagues();
		});
	}
		


	
	//user constructor - holds user data
	function User(userID, bowlerID, bowlerName) {
		this.userID = userID;
		this.bowlerID = bowlerID;
		this.bowlerName = bowlerName;
	}

	
	//draws winner - if you are the winner, lets you input how many pins you got.
	function drawWinner() {
		console.log("drawwinner initailized");
		$('.drawwinner').click(function(){
			console.log("drawwinner clicked");
			var league_id = $(this).attr("id");
			var lottery_id = $(this).attr('class').split(' ')[1];
			client.drawWinner({
			    leagueId: league_id,
			    lotteryId: lottery_id,
			    success: function(roll) {
			      console.log(roll);
			      console.log("rollin");
			      console.log(user.bowlerID);

			      recordRoll(league_id, lottery_id, roll.bowler_id);

			      
			    },
			    error: function(xhr)  {
			      alert("This lottery has finished!");
			      console.log(JSON.parse(xhr.responseText));
		    }
		  });
			
		});
	}

	//records roll in a new interface
	function recordRoll(leagueID, lotteryID, bowlerID) {
		console.log('new screen');
		$('.leagues').html("");
		$('.leagues').append("<button style = \"text-align:center\" type=\"button\" class=\"btn btn-default\" aria-label=\"Left Align\">"
			+"<span class=\"glyphicon glyphicon-arrow-left\" aria-hidden=\"true\"></span></button><br>");
		$('.leagues').append('<input type = \"text\" class = \"enter-pins\" placeholder = \"Enter pins\">'
								+'<button type = \"button\" class = \"pins\">Submit</button>');

		buttons();
		$('.pins').click(function() {
			client.updateRoll({
			    leagueId: leagueID,
			    lotteryId: lotteryID,
			    pinCount: $('enter-pins').val(),
			    success: function(roll) {
			      console.log(roll);
			      console.log(bowlerID);
			      if(roll.bowler_id === user.bowlerID) {
			      	console.log('winner');
			      	alert('You have won $'+roll.payout);
			      }
			    },
			    error: function(xhr)  {
			      console.log(JSON.parse(xhr.responseText));
			    }
			  });
			});
	}

	//joins league and buys ticket
	function buy() {
		$('.buy').click(function() {
			var league_id = $(this).attr("id");
			console.log('Initializing buy ticket button event listeners');
			console.log(user.userID +" "+user.bowlerID+" "+user.bowlerName);
			console.log(league_id);
			client.joinLeague({
			    bowlerId: user.bowlerID,
			    leagueId: league_id,
			    success: function(bowlers) {
			      console.log(bowlers);
			      console.log("league joined successfully");

			      
			      getLotteries(user.bowlerID, league_id);
			    },
			    error: function(xhr)  {
			    	console.log("join failed");
			      console.log(JSON.parse(xhr.responseText));
			    }
			});

		});
	}

	//view jackpot history
	function viewHistory() {
		$('.history').click(function() {
			$('.leagues').html("");
			$('.leagues').append("<button style = \"text-align:center\" type=\"button\" class=\"btn btn-default\" aria-label=\"Left Align\">"
			+"<span class=\"glyphicon glyphicon-arrow-left\" aria-hidden=\"true\"></span></button><br>");
			buttons();
			var league_id = $(this).attr("id");
			getHistory(league_id);
		});
	}


	//helper function for viewHistory
	function getHistory(leagueID) {
		client.getLotteries({
		    leagueId: leagueID,
		    success: function(lotteries) {
		      console.log(lotteries);
		      //$('.leagues').html("");

		      for(var i = 0; i < lotteries.length; i++) {
		      	if(lotteries[i].payout !== null)
		      		$('.leagues').append("<p>Lottery "+(i+1)+"- Payout: $"+lotteries[i].payout.toFixed(2));
		      }
		    },
		    error: function(xhr)  {
		      console.log(JSON.parse(xhr.responseText));
		    }
		});
	}

	//attach class identifier for draw winner button
	function getLotteryForButton(leagueID) {
		client.getLotteries({
		    leagueId: leagueID,
		    success: function(lotteries) {
		      console.log("Lottery id for button "+leagueID+" is "+lotteries[lotteries.length-1].id);
		      $('#'+leagueID+'.drawwinner').addClass(''+lotteries[lotteries.length-1].id); 
		      console.log('#'+leagueID+'.drawwinner');
		      

		    },
		    error: function(xhr)  {
		      console.log(JSON.parse(xhr.responseText));
		    }
	  	});

	}

	
	//get lotteries and purhcase a ticket for most recent lottery
	function getLotteries(bowlerID, leagueID) {
		client.getLotteries({
		    leagueId: leagueID,
		    success: function(lotteries) {
		      console.log(lotteries[lotteries.length-1].id);
		      purchaseTicket(bowlerID, leagueID, lotteries[lotteries.length-1].id); 

		    },
		    error: function(xhr)  {
		      console.log(JSON.parse(xhr.responseText));
		    }
	  	});

	}

	//buy the ticket
	function purchaseTicket(bowlerID, leagueID, lotteryID) {
		client.purchaseTicket({
			bowlerId: bowlerID,
			leagueId: leagueID,
			lotteryId: lotteryID,
		    success: function(ticket) {
		      console.log(ticket);
		      console.log("ticket purchased successfully");

		      //refresh jackpots
		      viewLeagues();

		      drawWinner();

		    },
		    error: function(xhr)  {
		      console.log(JSON.parse(xhr.responseText));
		    }
		});
	}

	//finds bowler id of logged in user
	function processUserInfo(id) {
		client.getBowlers({
		    success: function(bowlers) {
		      console.log("id"+id);
		      for(var i = 0; i < bowlers.length; i++) {
		      	console.log(bowlers[i].user_id);
		      	console.log(id);
		      	if(bowlers[i].user_id === id) {
		      
		      		user = new User(id, bowlers[i].id, bowlers[i].name);
		      		console.log("user processed");
		      	}
		      }
		    },
		    error: function(xhr) {
		    	console.log("processuserinfo failed");
		      console.log(JSON.parse(xhr.responseText));
		    }
		});
	}
	//buy tickets
	function buyTickets() {
		$('.leagues').html("");
		$('.leagues').append('hi');
	}


	//show leagues + jackpot + buttons for buying tickets/history/drawing winner
	function viewLeagues() {
		$('.leagues').html("");
		$('.leagues').append("<button style = \"text-align:center\" type=\"button\" class=\"btn btn-default\" aria-label=\"Left Align\">"
			+"<span class=\"glyphicon glyphicon-refresh\" aria-hidden=\"true\"></span></button><br>");

		
		buttons();
		
		client.getLeagues({
		    success: function(leagues) {
		      console.log(leagues[0].name);
		      for(var i = 0; i < leagues.length; i++) {
		      	$('.leagues').append("<button id ="+leagues[i].id+" class = \"buy\">Buy ticket</button>"
		      		+"<button id ="+leagues[i].id+" class = \"drawwinner\">Draw Winner</button>"
		      		+"<button id ="+leagues[i].id+" class = \"history\">View History</button>"
		      		+"<p class = "+leagues[i].id+">"+leagues[i].name+"</p>");
				showLotteries(leagues[i].id);
				getLotteryForButton(leagues[i].id);

			  }
			  drawWinner();
			  buy();
			  viewHistory();
		    },
		    error: function(xhr)  {
		      console.log(JSON.parse(xhr.responsseText));
		    }
		});

		
	}

	//show current jackpot
	function showLotteries(league_id) {
		client.getLotteries({
		    leagueId: league_id,
		    success: function(lotteries) {
		    	console.log(lotteries[lotteries.length-1]);
		      $('.'+league_id).append('-\tJackpot: $'+lotteries[lotteries.length-1].balance.toFixed(2));
		    },
		    error: function(xhr)  {
		      console.log(JSON.parse(xhr.responseText));
		    }
		});
	}


	



});