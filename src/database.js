const mysql=require('mysql');
const {promisify}=require('util');

const conexionConfig=require('mysql/lib/PoolConfig');


const {database}=require('./keys');
const conexion=mysql.createPool(database);

conexion.getConnection((err, connection)=>{
    if(err){
        if(err.code==='PROTOCOL_CONNECTION_LOST'){
            console.log('DATABASE CONNECTION WAS CLOSED');

        }
        if(err.code==='ER_CON_COUNT_ERROR'){
            console.log('DATABASE HAS TO MANY CONNECTIONS');

        }
        if(err.code==='ECONNREFUSED'){
            console.log('DATABASE CONNECTION WAS REFUSED');

        }
    }else{
        if(connection)connection.release();
            console.log('Database is Connected');
                return;
        }

    
});


//Promisify conexion query
conexion.query=promisify(conexion.query)

//exporting conexion
module.exports=conexion;