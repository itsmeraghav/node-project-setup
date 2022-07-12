var mongoose = require("mongoose");

//get db url and dbname from .env file
const mongoUrl = process.env.DATABASE_URL_DEVELOPMENT  ;

//connect to the mongodb
module.exports = {
    connectToServer : (callback)=>{
        mongoose.connect(mongoUrl,{useNewUrlParser:true,useUnifiedTopology: true},function (err,client) {
            if (err) {
                console.log("An error has occurred. mongodb not connected!");
                return callback(err);
            }
            console.log("Database is successfully connected!");
            
            callback(null);
        });
        try {
            mongoose.set("useFindAndModify", false);
            mongoose.set("useCreateIndex", true);
            
        } catch (error) {
            console.log("Cannot set useFindAndModify")
        }
    },
}