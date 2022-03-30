const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;


const conexion=require('../database');
const helpers=require('./helpers');


passport.use('local.signin', new LocalStrategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback:true
}, async (req,username,password,done)=>{
    const rows=await conexion.query('SELECT * FROM empleados WHERE username=?',[username]);
    console.log(rows);
    if(rows.length > 0 ){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password)
        if(validPassword){
            done(null,user, req.flash('success', 'Bienvenido ' + user.username));
        }else{
            done(null,false,req.flash('message', 'Contraseña incorrecta'));
        }
    }else{
        return done(null,false, req.flash('message', 'El nombre de usuario no existe'));
    }
}
));

passport.use('local.signup', new LocalStrategy({
    usernameField:'username',
    passwordField:'password',
    passReqToCallback:true

}, async(req,username,password,done)=>{
    const { nombre,apellido }=req.body;
    const newUser={
        nombre,
        apellido,
        username,
        password
    };
    newUser.password=await helpers.encryptPassword(password);
    //Guardando la contraseña encriptada en la BD
    const result=await conexion.query('INSERT INTO empleados SET ?',[newUser]);
    newUser.id=result.insertId;
    return done(null, newUser);

}
));

passport.serializeUser((user,done)=>{
    done(null, user.id);
});

passport.deserializeUser( async (id,done)=>{
    const rows= await conexion.query('SELECT * FROM empleados WHERE ID=?',[id]);
     done(null,rows[0]);
});