
var router = require('express').Router();
var multer = require('multer');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('passport');
var async = require('async');
var auth = require('../../config/auth');
var crypto = require('crypto');

// Store File at local folder  ******start*********
var storagess = multer.diskStorage({
	destination: function (req, file, cb) { 
		cb(null, process.env.UPLOAD_PATH + '/users/')
	},
	filename: function (req, file, cb) {
		var datetimestamp = Date.now();
		cb(null, datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
	}
});
var uploadLocal = multer({ storage: storagess });
// Store File at local folder  ******close*********

router.post('/create',auth.required, uploadLocal.single('profile_pic'), function (req, res, next) {

 
	if (!req.body.email) {
		return res.json({ errors: { msg: "Email is required" } });
	} 

	var user = new User();
	const uniqueCode = randomString(50);
	user.email = req.body.email.toLowerCase();
	user.username = req.body.username.toLowerCase();
	
	if (req.body.full_name) {
		user.full_name = req.body.full_name;
	}

	if (req.body.contact_number) {
		user.contact_number = req.body.contact_number;
	}

	if (req.body.alternate_contact_number) {
		user.alternate_contact_number = req.body.alternate_contact_number;
	}


	if (req.body.reference) {
		user.reference = req.body.reference;
	}

	if (req.file.profile_pic) {
		if (req.file.profile_pic[0]) {
			user.profile_pic = req.file.profile_pic[0].location;
		}
	}

	if (req.body.state) {
		user.state = req.body.state;
	}

	if (req.body.city) {
		user.city = req.body.city;
	}

	if (req.body.role) {
		user.role = req.body.role;
	}

	
	if (req.body.password) { 
		user.setPassword(req.body.password);
	}
	user.status = 0;
	user.unique_code = uniqueCode;
	user.active_code = randomString(50);
	 
	return user.save().then(results => {
		return res.json({ data: results });
	})
		.catch(err => {
			return res.json({ data: err });
		})



});


router.post('/login', function (req, res, next) {
	 
	if (!req.body.email) {
		return res.json({ errors: { msg: "can't be blank" } });
	}

	if (!req.body.password) {
		return res.json({ errors: { msg: "can't be blank" } });
	}
	// toLowerCase()
	passport.authenticate('local', { session: false }, function (err, user, info) {
		if (err) { return next(err); }

		if (user) {

			if (user.status == 1 || user.role.slug == 'admin') {

				// if (user.lock_status == 1) {
				// 	return res.json({ errors: { msg: "User has been locked by Administrator" } });
				// }
				user.token = user.generateJWT();
				async.waterfall([
					function (callback) {
						var results = new Array();
						User.findOne({ _id: user._id })
							.populate({ path: 'role' })
							.then(function (users) {
								results['users'] = users;
								callback(null, results);
							});
					}
				], function (err, result) {
					return res.json({ user: result['users'].toAuthJSON() });
				});

			} else {
				return res.json({ errors: { msg: "Account has been deactived." } });
			}

		} else {
			return res.json({ errors: { msg: "Email or password is incorrect" } });
		}
	})(req, res, next);
});

router.post('/list',auth.required,   uploadLocal.array(), function (req, res, next) {
	var query = {};
	var limit = 10;
	var offset = 0;
	var page = 1;
	query.status = { $ne: 2 };

	query.role = { $nin: ['63258ddcf250b4aa9d128dec'] };

	if (typeof req.body.page !== 'undefined') {
		if (req.body.page !== 'all') {
			page = req.body.page;
		} else {
			limit = 1000;
		}
	}

	if (typeof req.body.limit !== 'undefined') {
		if (req.body.limit != "") {
			limit = req.body.limit;
		}
	}

	if (typeof req.query.limit !== 'undefined') {
		limit = req.query.limit;
	}

	if (typeof req.query.offset !== 'undefined') {
		offset = req.query.offset;
	}

	//res.json({data:query});
	offset = (page - 1) * limit;
	Promise.all([
		User.find(query)
			.populate({ path: 'role' })
			// .populate({ path: 'state' })
			// .populate({ path: 'city' })
			.limit(Number(limit))
			.skip(Number(offset))
			.sort({ _id: 'desc' })
			.exec(),
		User.count(query).exec(),
		req.payload ? User.findById(req.payload.id) : null,
	]).then(function (results) {
		var data = results[0];
		var dataCount = results[1];
		return res.json({
			data: data.map(function (re) {
				return re;
			}),
			totalItem: dataCount
		});
	}).catch(next);

});

router.get('/detail/:id', auth.required, uploadLocal.array(), function (req, res, next) {
 
	User.findOne({ _id: req.params.id })
		.populate({ path: 'role' })
		// .populate({ path: 'state' })
		// .populate({ path: 'city' })
		.then(function (result) {
			if (result) {
				return res.json({ data: result });

			} else {
				return res.json({ errors: { message: " Record not Found!" } });
			}



		});

});


router.post('/update', auth.required, uploadLocal.single('profile_pic'), function (req, res, next) {

	if (!req.body.email) {
		return res.json({ errors: { msg: "Email is required" } });
	}

	User.findOne({ _id: req.body.id })
		.then(function (user) {
			if (user) { 

				if (req.body.full_name) {
					user.full_name = req.body.full_name;
				}

				if (req.body.contact_number) {
					user.contact_number = req.body.contact_number;
				}

				if (req.body.alternate_contact_number) {
					user.alternate_contact_number = req.body.alternate_contact_number;
				}

			
				if (req.body.reference) {
					user.reference = req.body.reference;
				}

				if (req.file.profile_pic) {
					if (req.file.profile_pic[0]) {
						user.profile_pic = req.file.profile_pic[0].location;
					}
				}

				// if (req.body.state) {
				// 	user.state = req.body.state;
				// }

				// if (req.body.city) {
				// 	user.city = req.body.city;
				// }

				if (req.body.role) {
					user.role = req.body.role;
				}
 
			 	user.save().then(results => {
					return res.json({ data: results });
				})
					.catch(err => {
						return res.json({ data: err });
					})

			} else {
				return res.json({ errors: { msg: " Record not Found!" } });
			}
		}).catch(next);


});

router.delete('/delete/:id', auth.required, function (req, res, next) { 
	User.findOne({ _id: req.params.id }).then(function (result) {
		if (result) {
			result.status = 2; 
			return result.save().then(function () {
				return res.json({ data: true });
			});

		} else {
			return res.json({ errors: { message: " Record not Found!" } });
		} 

	});

});

// Change password of login user
router.post('/auth-reset-password', auth.required, function (req, res, next) {

	 
	if (!req.body.password) {
		return res.json({ errors: { msg: "Password is required" } });
	}

	User.findById(req.payload.id).then(function (user) {
		if (user) {
			this.salt = user.salt;
			this.hash = crypto.pbkdf2Sync(req.body.current_password, this.salt, 10000, 512, 'sha512').toString('hex');
			if (this.hash == user.hash) {
				if (typeof req.body.password !== 'undefined') {
					user.setPassword(req.body.password);
				}
				return user.save().then(function () {
					return res.json({ user: user });
				});

			} else {
				return res.json({ errors: { msg: "Your current password does not match with our records." } });
			}

		} else {
			return res.json({ errors: { msg: "Please try again." } });
		}

	})

});

// need to work
router.post('/fotgot-password', function (req, res, next) {
	var webLink = req.headers.origin;
	if (!req.body.email) {
		return res.json({ errors: { msg: "Email is required" } });
	}
	User.findOne({ email: req.body.email.toLowerCase() }).then(function (user) {
		if (user) {
			const forgotCode = randomString(50);
			let userData = {};
			userData.reset_code = forgotCode;

			User.findOneAndUpdate({ email: req.body.email.toLowerCase() }, userData, { new: true }, function (err, raw) {

				var imageUrl = req.protocol + '://' + req.get('host') + '/public/img/';
				var webLink = req.headers.origin;

				readHTMLFile('./public/email-template/reset-password.html', function (err, html) {
					var template = handlebars.compile(html);
					var replacements = {
						username: user.full_name,
						imageUrl: imageUrl,
						link: webLink + '/reset-password/' + user.unique_code + '/' + forgotCode,
						webLink: webLink

					};

					var htmlToSend = template(replacements);

					var mail = {
						from: process.env.GMAIL_FROM_EMAIL,
						to: user.email, //'manishsaini@mailinator.com',
						subject: "Forgot Password",
						html: htmlToSend
					}

					// return res.json({ user:process.env.GMAIL_FROM_EMAIL });
					transport.sendMail(mail, function (error, response) {
						if (error) {
							// return res.json({ errors: error });
							return res.json({ user: user });
						} else {

							// return res.json({ user: true });
							return res.json({ user: user });
						}
					});

				});
			});

		} else {
			return res.json({ errors: { msg: req.body.email + " Email is incorrect" } });
		}


	});
});


// update status of user administrator // need to work
router.post('/active-account', function (req, res, next) {
	User.findOne({ active_code: req.body.unique_code }).then(function (user) {
		if (user) {
			user.status = 1;
			return user.save().then(function () {
				return res.json({ data: true });
			});
		} else {
			return res.json({ data: false });
		}
	})

});


function randomString(len, an) {
	an = an && an.toLowerCase();
	var str = "",
		i = 0,
		min = an == "a" ? 10 : 0,
		max = an == "n" ? 10 : 62;
	for (; i++ < len;) {
		var r = Math.random() * (max - min) + min << 0;
		str += String.fromCharCode(r += r > 9 ? r < 36 ? 55 : 61 : 48);
	}
	return str;
}


module.exports = router;
