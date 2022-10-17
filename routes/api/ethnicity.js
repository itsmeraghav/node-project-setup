var router = require('express').Router();
var mongoose = require('mongoose');
var Ethnicity = mongoose.model('Ethnicity'); 
var auth = require('../../config/auth');

// var User = mongoose.model('User');
var async = require('async');
var ObjectId = require('mongodb').ObjectID;
var slug = require('slug')
var multer = require('multer');
upload = multer({ dest: 'uploads/' });

router.param('ethnicity', function (req, res, next, id) {
	Ethnicity.findOne({ _id: id })
		.then(function (ethnicity) {
			if (!ethnicity) { return res.sendStatus(404); }
			req.ethnicity = ethnicity;
			return next();
		}).catch(next);
});


//add new Ethnicity
router.post('/create', auth.required,  upload.array(), async function (req, res, next) {
	var newRecord = new Ethnicity(req.body); 
	newRecord.slug = slug(req.body.name, { replacement: '-', lower: true, charmap: slug.charmap, }); 
        return newRecord.save().then(results =>{
			return res.json({ data: results });
        })
        .catch(err =>{
			return res.json({ data: err });
        }) 

});


router.post('/list', auth.required,  upload.array(), function (req, res, next) {
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

		Ethnicity.find(query)
			.populate({ path: 'created_by' }) 
			.limit(Number(limit))
			.skip(Number(offset))
			.sort({ _id: 'desc' })
			.exec(),
			Ethnicity.count(query).exec(),
		req.payload ? Ethnicity.findById(req.payload.id) : null,
		 
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

router.post('/delete', auth.required,  upload.array(), function (req, res, next) {

	Ethnicity.findByIdAndRemove(req.body.redors_id, (err, faq) => {
		if (err) {
			return res.json({ errors: { message: " Record not Found!" } });
		} else {
			return res.json({ data: true });


		}
	})

});

// return an ethnicity
router.get('/detail/:ethnicity',auth.required,  function (req, res, next) {
	async.parallel({
		ethnicity: function (callback) {
			Ethnicity.findOne({ "_id": ObjectId(req.ethnicity._id) })
				.then(function (results) {
					callback(null, results);
				});
		}
	},
		function (err, results) {
			return res.json({ data: results['ethnicity'] });
		}); 
});

// update ethnicity
router.post('/update', auth.required,  upload.array(), function (req, res, next) {
	Ethnicity.findOne({ _id: req.body.id }).then(function (response) {
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