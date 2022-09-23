var router = require('express').Router();

module.exports = function() {
    router.use('/users/', require('./users'));
    router.use('/roles/',require('./roles'));  
    // router.use('/academic-year/',require('./academic-year'));  
    // // // // // // router.use('/setting/',require('./setting')); 
    // router.use('/event/',require('./event')); 
    // router.use('/vanue/',require('./vanue'));     
    // router.use('/applicant/',require('./applicant'));   
   
    router.use(function(err, req, res, next){
      if(err.name === 'ValidationError'){
        return res.status(422).json({
          errors: Object.keys(err.errors).reduce(function(errors, key){
            // errors[key] = err.errors[key].message;
            console.log("errors",errors);

            return errors;
          }, {})
        });
      }
      return next(err);
    });

    return router;
} 
