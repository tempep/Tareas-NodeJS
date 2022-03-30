const { Console } = require('console');
const express=require('express');
const router = express.Router();
const conexion=require('../database');

router.get('/form',(req,res)=>{
    res.render('form_emp.hbs');
});

router.post('/form',async (req,res)=>{
    const {nombre, apellido, username, password,cargo}=req.body;
    const newEmpleado={
        nombre,
        apellido,
        username,
        password,
        cargo
    }
    const consulta_e=await conexion.query('INSERT INTO empleados SET ?', [newEmpleado]);
    res.redirect('/form');
    
});




module.exports=router;