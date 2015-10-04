$(document).ready(function() {

	//new instance of client
	var client = new BowlingApiClient('http://bowling-api.nextcapital.com/api');
	console.log("yo");
	//login

	$('#signup-container').hide();

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
		console.log("success");
		var loginemail = $("#username").val();
		var loginpassword = $("#password").val();

		console.log(loginemail);
		console.log(loginpassword);

		client.loginUser({
		    email: loginemail,
		    password: loginpassword,
		    success: function(user) {
		      console.log(user);
		      console.log("success");
		      //window.location.replace("app.html");
		      $(location).attr('href','app.html');
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
		    success: function(user) {
		      console.log(user);
		    },
		    error: function(xhr)  {
		      console.log(JSON.parse(xhr.responseText));
		    }
  		});

  		//create the new user's bowler name
  		client.createBowler ({
		    name: name,
		    success: function(bowler) {
		      console.log(bowler);
		    },
		    error: function(xhr)  {
		      console.log(JSON.parse(xhr.responseText));
		    }
		});
	});
});