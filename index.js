/** This is root file of our node application */
const express       =   require('express');
const app           =   express();
const bodyParser    =   require('body-parser');
const cors          =   require('cors');

/** Import all custom files */
require('./config/global-constant');

app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(bodyParser.json({limit: '50mb'}));
require('dotenv').config();

/** enable cors to fetch api call from cross origin */
app.use(cors());

/**  Connection of our database */
const connection    = require('./config/connection');
connection.connectToServer((err)=>{
    if (err) throw err;
    //configure our routes with database
    const routes = require('./routes/web');
    routes.configure(app);
});

/** start server listen on specified host and server */
const port = process.env.PORT || 4000;

app.listen(port, function () {
    console.log(`Server is runing on port ${port}`);
});