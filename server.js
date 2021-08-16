const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const MySQLStore = require('express-mysql-session')(session);
const app = express();

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

//Definition 
let mysqloptions = {
    host: "localhost",
    user: "",
    password: "",
    database: ""
};

//Connection
let db = mysql.createConnection(mysqloptions);
db.connect(function(err) {
  if(err) throw err;
  console.log("Connected!");
});
let sessionStore = new MySQLStore({}/* options */, db);

sessionStore.defaultOptions.schema.tableName = 'mysessiontbl';

//Session
app.use(session({

    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true
    },
    store: sessionStore,

  }))

app.get('/', (req, res)=>{

    res.sendFile(__dirname + '/public/todov2.html');

});

app.get('/getitems',(req,res)=>{

    let SID = req.sessionID;
    let sql = `select * from todos where sessionID = '${SID}' order by timems`;

    let query =  db.query(sql,(err,result)=>{

        if(err) throw err; 

        console.log(result);
        console.log('Your data has returned. ')
        
        res.send(result);
        

    });
    
})

app.post('/senditem', (req,res)=>{

    console.log(req.body);
    console.log(req.sessionID);

    let SID = req.sessionID;
    let d = req.body.taskDescription;
    let t = req.body.date  
    let sql = `insert into todos (sessionID, description, timems) values ('${SID}', '${d}', ${t});`;

    let query =  db.query(sql,(err,result)=>{

        if(err) throw err; 
        console.log('data stored prepetually');
        
    });
}) 

app.listen(3000);

/*create table todos (
    id int not null auto_increment,
    sessionID varchar(80) not null,
    description text not null,
    timems bigint not null,
    primary key(id)
);
insert into todos (sessionID, description, timems) values ('vee4534%#sid', 'hello', 23423423);*/
// select * from todos where sessionID = 'QvrCTFfGWYshZVlv4rUbSXzLsywG3OJJ order by timems';