const express=require('express');
const router=express.Router();
const conexion=require('../database');
const {isLoggedIn,isNotLoggedIn}=require('../lib/auth')





//Mostrar la vista para añadir tareas
router.get('/tareas/add',isLoggedIn,(req,res)=>{
    res.render('tareas/add');
});

//guardar las tareas en la base de datos
router.post('/tareas/add',isLoggedIn, async(req,res)=>{
    const {titulo, descripcion}=req.body;
    const newTarea={
        titulo,
        descripcion,
        empleado_id:req.user.id
    }
    const consulta_tarea=await conexion.query('INSERT INTO tareas SET ?', [newTarea]);
    res.redirect('/tareas');
});

//Mostrar las tareas creadas
router.get('/tareas',isLoggedIn,async (req,res)=>{
    const tareas=await conexion.query('SELECT * FROM tareas WHERE empleado_id=?',[req.user.id]);
    console.log(tareas);
    res.render('tareas/list_tareas', {tareas});
});

//Eliminar una tarea
router.get('/tareas/delete/:id', isLoggedIn ,async (req,res)=>{
    const {id}=req.params;
    await conexion.query('DELETE FROM tareas WHERE ID=?',[id]);
    req.flash('welldone', 'Tarea borrada con éxito!');
    res.redirect('/tareas');
});

//Traemos de la base de datos los datos que vamos a editar
router.get('/tareas/editar/:id', isLoggedIn ,async(req,res)=>{
    const {id}=req.params;
    const tareas_edit=await conexion.query('SELECT * FROM tareas WHERE ID=?',[id]);
    res.render('tareas/editar',{tareas_edit:tareas_edit[0]});

});

//Editar-Actualizar las tareas en la base de datos
router.post('/tareas/editar/:id', isLoggedIn, async (req,res)=>{
    const {id}=req.params;
    const {titulo,descripcion}=req.body;
    const newEditarTarea={
        titulo,
        descripcion
    }
    await conexion.query('UPDATE tareas SET ? WHERE ID=?',[newEditarTarea,id]);
    req.flash('success', 'Edición Éxitosa!');
    res.redirect('/tareas');
});





















module.exports=router;