var router = require('express').Router();
var mongoose = require('mongoose');
var Role = mongoose.model('Role');
// var auth = require('../auth');
var User = mongoose.model('User');
var async = require('async');
var ObjectId = require('mongodb').ObjectID;
var slug = require('slug')
var multer = require('multer');
upload = multer({ dest: 'uploads/' });

router.param('role', function (req, res, next, id) {
	Role.findOne({ _id: id })
		.then(function (role) {
			if (!role) { return res.sendStatus(404); }
			req.role = role;
			return next();
		}).catch(next);
});


//add new role
router.post('/create',   upload.array(), async function (req, res, next) {
	var newRecord = new Role(req.body);

	newRecord.slug = slug(req.body.name, { replacement: '-', lower: true, charmap: slug.charmap, });
	// newRecord.created_by = req.payload.id;  
        return newRecord.save().then(results =>{
			return res.json({ data: results });
        })
        .catch(err =>{
			return res.json({ data: err });
        })
		 

});


router.post('/list',   upload.array(), function (req, res, next) {
	var query = {};

	var limit = 10;
	var offset = 0;
	var page = 1;
	query.status = { $ne: 2 };

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


	offset = (page - 1) * limit;
	Promise.all([

		Role.find(query)
			.populate({ path: 'created_by' }) 
			.limit(Number(limit))
			.skip(Number(offset))
			.sort({ _id: 'desc' })
			.exec(),
		Role.count(query).exec(),
		req.payload ? Role.findById(req.payload.id) : null,
		 
	]).then(function (results) {
		var data = results[0];
	 
		var dataCount = results[1];
		return res.json({
			data: data.map(function (re) {
				return re;
			}),
			totalItem: dataCount
		});
	});

});

router.post('/delete',   upload.array(), function (req, res, next) {

	Role.findByIdAndRemove(req.body._id, (err, faq) => {
		if (err) {
			return res.json({ errors: { message: " Record not Found!" } });
		} else {
			return res.json({ data: req.body._id });


		}
	})

});

// return an role
router.get('/detail/:role',  function (req, res, next) {
	async.parallel({
		role: function (callback) {
			Role.findOne({ "_id": ObjectId(req.role._id) })
				.then(function (results) {
					callback(null, results);
				});
		}
	},
		function (err, results) {
			return res.json({ data: results['role'] });
		});
	// Promise.all([
	// req.payload ? User.findById(req.payload.id) : null,
	// req.role			
	// .execPopulate()
	// ]).then(function (results) {
	// var user = results[0];
	// return res.json({ role: req.role});
	// }).catch(next);
});

// update role
router.post('/update',   upload.array(), function (req, res, next) {
	Role.findOne({ _id: req.body.id }).then(function (response) {
		if (response) {
			response.name = req.body.name;
			response.slug = slug(req.body.name, { replacement: '-', lower: true, charmap: slug.charmap, });
			return response.save().then(function () {
				return res.json({ data: response });
			});
		} else {
			return res.json({ errors: { message: " Record not Found!" } });
		}
	});
});



 


module.exports = router;