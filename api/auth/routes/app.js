const router = require('express').Router();
const verifier = require('./jwtVerify');
const sequelize = require('sequelize');
const asyncHandler = require('express-async-handler');
const { usuarioValidation } = require('../validation');

var op = sequelize.Op

/************** Usuarios **************/


//Función auxiliar que me recupera el usuario y lo agrega al request cada vez que la url trae un id de usuario
router.param('userId', function(request, response, next, id){
    db.models['User'].findByPk(id)
        .then(existe =>{
            if(existe === null){
                return response.status(404).send('No existe el Usuario.'); 
            }
            else{
                request.usuario = existe;
                next();
            }
        })
        .catch(error => {
            return next(error);
        })
  });   



// SELECT
router.get('/usuarios', verifier, asyncHandler(async (req, res) => {
    let salida = [];
    let users = await db.models['User'].findAll({ 
        order: ['Nombre']
    });
    for(indx in users) {
        let usr = users[indx];
        let roles = await db.models['UserRol'].findAll({
            where: {
                Legajo: usr.Legajo,
                '$Rol.AppId$': req.appid
            }
            ,
            include: [ 
                { model: db.models['Rol'] },
            ]  
        });
        if(roles.length){
            let usrData = {
                Id: usr.Legajo,
                Nombre: usr.Nombre,
                Roles: []
            };
            for(indx2 in roles){
                let usrRol = roles[indx2];
                if(usrRol.Rol.Id != 1){
                    usrData.Roles.push(usrRol.Rol.Id);
                }
            }
            salida.push(usrData);
        }
    }
    res.status(200).send(salida);
}));


// UPDATE
router.put('/usuarios/:userId', verifier, asyncHandler(async (req, res) => {
    // verifico que el body esté bien formado
    const { error } = usuarioValidation(req.body);
    // si n está bien formado devuelvo estado 400
    if(error){     
        return res.status(400).send(error.details[0].message);
    }
    // si está bien formado
    else{
        try{
            req.usuario.Nombre = req.body.Nombre.trim();
            let newusr = await req.usuario.save()
        
            if (req.body.Roles.length === 0){
                const noRol = await db.models['Rol'].findOne({
                    where:{ AppId: req.appid, Nombre: 'NOROL'}
                });
                req.body.Roles.push(noRol.Id);
            }
            let rolesUsr = await db.models['UserRol'].findAll({
                where: {
                    Legajo: newusr.Legajo,
                    '$Rol.AppId$': req.appid,
                },
                include: [ 
                    { model: db.models['Rol'] },
                ]  
            });
            for (indx in rolesUsr){
                let rolUsr = rolesUsr[indx];
                if(req.body.Roles.includes(rolUsr.Id)){
                    req.body.Roles = req.body.Roles.filter(item => item !== rolUsr.Id)
                }
                else{
                    await rolUsr.destroy();
                }
            }
            for (indx in req.body.Roles){
                let createRolId = req.body.Roles[indx];
                let hayRol = await db.models['UserRol'].findOne({
                    paranoid: false,
                    where: {
                        Legajo: newusr.Legajo,
                        RolId: createRolId,
                    }
                });
                if(hayRol){
                    await hayRol.restore();
                }
                else{
                    newRol = await db.models['UserRol'].create({Legajo: newusr.Legajo,
                        RolId: createRolId });
                }
            }
            res.send(newusr);
        }
        catch(error){
            console.error(error);
            res.status(409).send(error);
        }
    }    
}));


// DELETE
router.delete('/usuarios/:userId', verifier, asyncHandler(async (req, res) => {
    try{
        let roles = await db.models['UserRol'].findAll({
            where: {
                Legajo: req.usuario.Legajo,
                '$Rol.AppId$': req.appid
            }
            ,
            include: [ 
                { model: db.models['Rol'] },
            ]  
        });
        for (indx in roles){
            await roles[indx].destroy();
        }
        res.status(200).send();
    }
    catch(error){
        res.status(500).send(error);
    };   
}));


/************** Roles **************/

// SELECT
router.get('/roles', verifier, asyncHandler(async (req, res) => {
    let salida = [];
    db.models['Rol'].findAll({
        where: { 
            AppId: req.appid,
            Nombre: {[op.ne]: 'NOROL'}
        }, 
        attributes: ['Id', 'Nombre'],
        order: ['Nombre']
    })
    .then(roles => {
        res.status(200).send(roles);

    })
    .catch(error =>{
        console.log(error);
        res.status(500).send(error)
    });    
}));



/************** Menu **************/


// Función auxiliar para crear submenúes.
async function crearMenuItem(menuItem, rolid, esRoot) {
    let salida = {
        label: menuItem.Label,
        icon: menuItem.Icono,
        route: menuItem.Route,
        tipo: menuItem.Tipo,
        hijos: []
    }
    if(menuItem.Tipo == "H"){
        return salida;
    }
    else{
        let items = await 
        db.models['MenuItem'].findAll({
            where: {
                AppId: menuItem.AppId,
                Padre: menuItem.Id,
                '$Rols.RolId$': rolid
            },
            include: [ 
                {model: db.models['Rol'], as: 'Rols'},
            ],
            order: [['Orden']]
        });
        if(items.length){
            for(indx in items){
                let hijo =  await crearMenuItem(items[indx], rolid, false);
                salida.hijos.push(hijo);
            }
        }
        if(esRoot){
            return salida.hijos;
        }
        else{
            return salida;
        }
    }
};







// SELECT
router.get('/menu', verifier, asyncHandler(async (req, res) => {


        let rootNode = await db.models['MenuItem'].findAll({
            where: {
                AppId: req.appid,
                Padre : null,
                '$Rols.RolId$': req.rolid
            },
            include: [ 
                {model: db.models['Rol'], as: 'Rols'},
            ]   
        });
        if(rootNode.length){
            let menu = await crearMenuItem(rootNode[0], req.rolid, true);
            res.status(200).send(menu);
        }
        else{
            let menu = [];
            res.status(200).send(menu);
        }
        
     
    })
);




module.exports = router;