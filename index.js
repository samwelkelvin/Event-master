//Import express
const express = require('express');
const app = express();
const port = 3001;

//Import sqlite3
const sqlite3 = require('sqlite3').verbose();

//Create database connection
const conn = new sqlite3.Database(
    "./events.db",
     sqlite3.OPEN_READWRITE,
      (err) => {
        if (err) return console.error(err.message);
    });

 app.use(express.json());

//Static files
app.use(express.static('public'));
app.use('/css',express.static(__dirname + 'public/css'));
app.use('/js',express.static(__dirname + 'public/js'));
app.use('/img',express.static(__dirname + 'public/img'));

//Set views
app.set('views', './views');

app.set('view engine', 'ejs');

app.engine('html', require('ejs').renderFile);

//Create routes

//home page route
app.get('/', function(request,response){
    response.render('index');
});

//route to for upcoming events
app.get('/upcoming-events', function(request,response){
    response.render('upcoming-events');
});

//route to for past event
app.get('/past-events', function(request,response){
    response.render('past-events');
});

//route to for faqs
app.get('/faqs', function(request,response){
    response.render('faqs');
});

//route for contact us page
app.get('/contact-us', function(request,response){
    response.render('contact-us',{title:'About us'});
});

//Fetch upcoming events
app.post('/getEventsLineUp', function(request,response){

    let sql = `SELECT * FROM events WHERE  event_date  BETWEEN ? AND ?`;
    
    let sdate = `2024-06-20`;

    let edate = `2024-06-20`;

    conn.all(sql, [sdate,edate], (err, data) => {

        if (err) {
            throw err;
        }else{
            response.json({
                data:data
            });
        }
     
    });

});

//Fetch past events
app.post('/getPastEvents', function(request,response){
    
    let year = request.body.year;

    let sql = `SELECT * FROM events WHERE  event_date  BETWEEN ? AND ?`;
    
    let sdate = `${year}-01-01`;

    let edate = `${year}-12-31`;

    conn.all(sql, [sdate,edate], (err, data) => {

        if (err) {
            throw err;
        }else{
            response.json({
                data:data
            });
        }
     
    });
});

//Insert contact information into the database
app.post('/addContactInfo',(request,response)=>{
    //get information send from client side
    let name = request.body.name;
    let email = request.body.email;
    let message = request.body.message;

    console.log(request.body);

    sql = `INSERT INTO enquiry (name, email, message) VALUES(?,?,?)`;

    conn.run(sql,[name,email, message],(err) => {
            if (err) response.json({ error:true,message:"An error occured"});
            else response.json({error:false, message:"Enquiry sent successfully"});

        }
    ); 
});

// Listen
app.listen(port, () => {
    console.info(`App staterted Visit htt://localhost:${port}`)
});