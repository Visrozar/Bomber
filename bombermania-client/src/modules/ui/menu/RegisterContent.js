function RegisterContent( game, content_width, content_height ){
	Phaser.Group.call(this, game);

	var context = this;
	var font_style = { font: "28px Luckiest", fill: "#FFFFFF" };

	var login_lbl = game.add.text(0, 0, "LOGIN", font_style);
	login_lbl.x = ( content_width - login_lbl.width ) * 0.5;
	login_lbl.y = content_height * 0.06;
	this.add(login_lbl);

	var login_tf = game.add.inputField(10, 90, {
	    font: '23px Luckiest',
	    fill: '#FFFFFF',
		backgroundColor: "#575957",
		cursorColor: "#FFFFFF",
	    width: content_width * 0.65,
	    padding: 9,
		borderWidth: 0,
		borderColor: "#575957",
	    borderRadius: 100
	});
	login_tf.x = ( content_width - login_tf.width ) * 0.5;
	login_tf.y = login_lbl.y + content_height * 0.07;
	this.add(login_tf);

	var password_lbl = game.add.text(0, 0, "PASSWORD", font_style);
	password_lbl.x = ( content_width - password_lbl.width ) * 0.5;
	password_lbl.y = content_height * 0.25;
	this.add(password_lbl);

	var password_tf = game.add.inputField(10, 90, {
	    font: '23px Luckiest',
	    fill: '#FFFFFF',
		backgroundColor: "#575957",
		cursorColor: "#FFFFFF",
	    width: content_width * 0.65,
	    padding: 9,
		borderWidth: 0,
		borderColor: "#575957",
	    borderRadius: 100,
		type: PhaserInput.InputType.password
	});
	password_tf.x = ( content_width - password_tf.width ) * 0.5;
	password_tf.y = password_lbl.y + content_height * 0.07;
	this.add(password_tf);

	var rpassword_lbl = game.add.text(0, 0, "REPEAT PASSWORD", font_style);
	rpassword_lbl.x = ( content_width - rpassword_lbl.width ) * 0.5;
	rpassword_lbl.y = content_height * 0.41;
	this.add(rpassword_lbl);

	var rpassword_tf = game.add.inputField(10, 90, {
	    font: '23px Luckiest',
	    fill: '#FFFFFF',
		backgroundColor: "#575957",
		cursorColor: "#FFFFFF",
	    width: content_width * 0.65,
	    padding: 9,
		borderWidth: 0,
		borderColor: "#575957",
	    borderRadius: 100,
		type: PhaserInput.InputType.password
	});
	rpassword_tf.x = ( content_width - rpassword_tf.width ) * 0.5;
	rpassword_tf.y = rpassword_lbl.y + content_height * 0.07;
	this.add(rpassword_tf);

	var signup_button = new UIButton( game, 140, 45, 0x7CC576, "SIGN UP");
	signup_button.x = ( content_width - signup_button.width ) * 0.5;
	signup_button.y = content_height * 0.62;
	this.add(signup_button);
	var _this = this;

	signup_button.onPress = function(){
		webAuth.signup({
            connection: 'Username-Password-Authentication',
            email: login_tf.value,
            password: password_tf.value
        },

		function(error, result){
			if(error){
				_this.remove(_this.getAt(4));
				var err = error.description.split(':');
				var error_msg1 = game.add.text(0, 0, err[0], font_style);;
					error_msg1.x = ( content_width - error_msg1.width * 1.6 );
					error_msg1.y = content_height * 0.80;
					_this.addAt(error_msg1,4);
			}
			else{
				console.log(result);

				webAuth.client.login({
					realm: 'Username-Password-Authentication',
					username: login_tf.value,
					password: password_tf.value,
					scope: 'openid profile',
					audience: 'https://flint0.auth0.com/api/v2/',
					avatar: null
				},

				function(error, result){
					if(error){
						var error_msg = game.add.text(0, 0, error.description, font_style);
						error_msg.x = ( content_width - error_msg.width ) * 0.5;
						error_msg.y = content_height * 0.30;
					}
					else{
						console.log(result);

						var xmlHttp = new XMLHttpRequest();
					    xmlHttp.onreadystatechange = function() {
					        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
								context.onRegularRegister( JSON.parse(xmlHttp.responseText), login_tf.value );
					    }
					    xmlHttp.open("GET", "https://flint0.auth0.com/userinfo", true); // true for asynchronous
						xmlHttp.setRequestHeader("Authorization", "Bearer "+result.accessToken)
					    xmlHttp.send(null);
						//var token = result.accessToken;
					}
				});
			}
		});
	}

	// var or_lbl = game.add.text(0, 0, "OR", font_style);
	// or_lbl.x = ( content_width - or_lbl.width ) * 0.5;
	// or_lbl.y = content_height * 0.74;
	// this.add(or_lbl);
	//
	// var facebook_button = new UIButton( game, 330, 45, 0x0072BC, "REGISTER VIA FACEBOOK");
	// facebook_button.x = ( content_width - facebook_button.width ) * 0.5;
	// facebook_button.y = content_height * 0.83;
	// this.add(facebook_button);
	//
	// facebook_button.onPress = function(){
	// 	webAuth.popup.authorize({
	// 		connection: 'facebook',
	// 		responseType: 'token'
	// 	},
	//
	// 	function(error, result){
	// 		if(error){
	// 			console.log(error);
	// 		}
	// 		else{
	// 			console.log(result);
	//
	// 			var xmlHttp = new XMLHttpRequest();
	// 		    xmlHttp.onreadystatechange = function() {
	// 		        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
	// 					context.onFacebookRegister( JSON.parse(xmlHttp.responseText) );
	// 		    }
	// 		    xmlHttp.open("GET", "https://flint0.auth0.com/userinfo", true); // true for asynchronous
	// 			xmlHttp.setRequestHeader("Authorization", "Bearer "+result.accessToken)
	// 		    xmlHttp.send(null);
	// 		}
	// 	});
	// };
	//
	// this.onFacebookRegister = function( user_data ){};
	this.onRegularRegister = function( user_data ){};
}

RegisterContent.prototype = Object.create(Phaser.Group.prototype);
