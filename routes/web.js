module.exports = {
    configure: (router) =>{
        app = router;
        
        /** default routes */
        app.all('/',(req,res)=>{
            res.render('home', { title: 'Foodie Backend' })
        });
    }
}