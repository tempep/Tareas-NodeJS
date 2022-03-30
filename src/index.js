const express=require('express');
const cors=require('cors');
const path=require('path');
const exphbs=require('express-handlebars');
const session=require('express-session');
const morgan = require('morgan');
const MySqlStore=require('express-mysql-session');
const {database}=require('./keys')
const passport=require('passport');
const flash=require('connect-flash');



//Inicializaciones
const app=express();
const port=4000;
require('./lib/passport');



//Settings
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs.engine({
    defaultLayout:'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir:path.join(app.get('views'), 'partials'),
    extname:'.hbs',
    helpers:require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(
    express.urlencoded({
        extended:false
    })    
);
app.use(express.json({
    type:'*/*'
}));
app.use(session({
    secret:'fertarius1108',
    resave:false,
    saveUninitialized:false,
    store: new MySqlStore(database)
}));

app.use(flash());
app.use(cors());
app.use(morgan('dev'));
app.use(passport.initialize());
app.use(passport.session());


//Globals
app.use((req,res,next)=>{

    app.locals.success=req.flash('success');
    app.locals.message=req.flash('message');
    app.locals.message=req.flash('welldone');
    app.locals.user=req.user;
    next();
});


//Routes
app.use(require('./routes/form'));
app.use(require('./routes/index'));
app.use(require('./routes/tareas'));
app.use(require('./routes/autenticacion'));


//Public
app.use(express.static(path.join(__dirname, 'public')));


//Start server
app.listen(port,()=>{
    console.log(`Hello, Server On port ${port}!`);
});