const router = require('express').Router();
const { loginValidation, registerValidation } = require('../validation');
const verifier = require('./jwtVerify');
const jwt = require('jsonwebtoken');




router.post('/register', verifier, (req,res) => {
    console.log(req.appid, req.userid);
    const { error } = registerValidation(req.body);
    // si n está bien formado devuelvo estado 400
    if(error){     
        return res.status(400).send(error.details[0].message);
    }
    // si está bien formado
    else{
        //busco el id de rol para NOROL
        db.models['Rol'].findOne({
            where:{ AppId: req.appid, Nombre: 'NOROL'}
        }).then(norol =>{
            // busco un usuario existente con el mismo legajo.
            db.models['User'].findOne({
                paranoid: false,
                where: {
                    Legajo: req.userid,
                }
            })
            .then(existe =>{
                // si no existe usuario con el mismo legajo lo creo.
                if(existe === null){
                    db.models['User'].create({Legajo: req.userid, Nombre: req.body.Nombre.trim()})
                    .then(newUsr =>{
                        db.models['UserRol'].create({Legajo: req.userid, RolId: norol.Id})
                        .then(() =>{
                            res.status(201).send(newUsr);
                        })
                        .catch(error =>{
                            res.status(409).send(error);
                        })
                    })
                    .catch(error =>{
                        res.status(409).send(error);
                    })
                }
                // si el usaurio sí existe, lo restauro
                else{
                    existe.restore()
                    .then( restUsr =>{
                        //me fijo si hay roles para ese usuario en la aplicación
                        db.models['UserRol'].findOne({ 
                            where: { 
                                Legajo: req.userid,  
                                '$Rol.AppId$': req.appid
                            },
                            include: [ 
                                { model: db.models['Rol'] },
                            ]         
                        })
                        .then(hay =>{
                            // si no hay rol de usuario ligado a la app, creo la solicitud de rol
                            if(hay === null){
                                // me fijo si no existe el rol, pero softdeleted, si sí exitse, lo restauro, y si no, lo creo
                                db.models['UserRol'].findOne({ 
                                    where: { 
                                        Legajo: req.userid,  
                                        RolId: norol.Id
                                    },
                                    paranoid: false       
                                })
                                .then(hayRol =>{
                                    if(hayRol === null){
                                        db.models['UserRol'].create({Legajo: req.userid, RolId: norol.Id})
                                        .then(() =>{
                                            res.status(201).send(restUsr);
                                        })
                                        .catch(error =>{
                                            console.log(error);
                                            res.status(409).send(error);
                                        })
                                    }
                                    else{
                                        hayRol.restore()
                                        .then(() =>{
                                            res.status(201).send(restUsr);
                                        })
                                        .catch(error =>{
                                            console.log(error);
                                            res.status(409).send(error);
                                        })
                                    }
                                })
                                .catch(error =>{
                                    console.log(error);
                                    res.status(409).send(error);
                                })
                            
                            }
                            // si ya existe un UserRol para el rol y la app, tiro 409
                            else{
                                res.status(409).send('Ya existe un una solicitud o un rol para el Usuario.');    
                            }
                                    
                        })
                        .catch(error =>{
                            console.log(error);
                            res.status(409).send(error);
                        });
                    })
                    .catch(error =>{
                        console.log(error);
                        res.status(409).send(error);
                    });
                
                }

                
            })
            .catch(error =>{
                console.log(error);
                res.status(500).send(error)
            });




        })
        .catch(error =>{
            console.log(error);
            res.status(500).send(error);
        })
    }
});

router.post('/login', (req,res) => {
    // verifico que el body esté bien formado
    const { error } = loginValidation(req.body);
    // si n está bien formado devuelvo estado 400
    if(error){     
        return res.status(400).send(error.details[0].message);
    }
    // si está bien formado
    else{
        // obtengo usuario y pasword del body
        var data = {
            username: req.body.UserId,
            password: req.body.Password
        };
        const axios = require('axios');
        // hago un post al sevicio de log in del dominio para verificar credenciales
        axios.post(process.env.AUTH_URL, data)
            //proceso la respuesta
            .then((resAuth) => {
                // si el estado es OK
                /*resAuth.data.LoginRes = "OK";
                resAuth.data.Legajo = 10021;
                resAuth.data.Nombre = 'Failache, Nicolás';*/
                if(resAuth.status == 200){
                    // si la respuesta dice que hubo un error al verificar las credenciales, devuelvo un 401
                    if(resAuth.data.LoginRes == "ERROR"){
                        console.log(resAuth);
                        errorMessage = resAuth.data.Message;
                        return res.status(401).send(errorMessage);
                    }
                    // si la respuesta es que las credenciales no son correctas, devuelvo 401
                    else if(resAuth.data.LoginRes == "NO"){
                        console.log(2);
                        errorMessage = 'Error de autenticación. Compruebe el usuario y password ingresados y vuelva a intentarlo.';
                        return res.status(401).send(errorMessage);
                    }
                    // si las credenciales son correctas
                    else if(resAuth.data.LoginRes == "OK"){
                        // obtengo el rol de usuario para la aplicación
                        db.models['UserRol'].findAndCountAll({
                            where: {
                                UserId: resAuth.data.Legajo,
                                '$Rol.AppId$': req.body.AppId
                            },
                            include:[{ model: db.models['Rol'] },]
                        })
                        .then(queryRes => {
                            // si la cantidad de roles es 0, genero el token y devuelvo un 200 con el  rol en null
                            if(queryRes.count == 0){
                                let resData = {
                                    _id: resAuth.data.Legajo,
                                    app: req.body.AppId,
                                    rol: []
                                }
                                const token = jwt.sign(resData, JWT_SECRET, {
                                    expiresIn: JWT_EXPIRE
                                });
                                // agrego un header a la respuesta, que indica que el usuario no tiene rol
                                res.header(HEADER_ROL, -1);
                                let userData = {
                                    id: resAuth.data.Legajo,
                                    nombre: resAuth.data.Nombre,
                                    rol: [],
                                }
                                return res.header(HEADER_TOKEN, token).send(userData);
                            }
                            // si el usuario tiene un rol, lo agrego al payload, genero el jwt y devuelvo un 200
                            else{
                                db.models['Rol'].findOne({
                                    where:{ AppId: req.body.AppId, Nombre: 'NOROL'}
                                }).then(norol => {
                                    let roles = [];
                                    let nomRol = [];
                                    queryRes.rows.forEach(element => {
                                        roles.push(element.RolId);
                                        if(element.RolId > norol.Id){
                                            nomRol.push(element.Rol.Nombre);
                                        }                                    
                                    });
    
                                    let resData = {
                                        _id: resAuth.data.Legajo,
                                        app: req.body.AppId,
                                        rol: roles
                                    }
                                    const token = jwt.sign(resData, JWT_SECRET, {
                                        expiresIn: JWT_EXPIRE
                                    });
                                    
                                    // si el rol es 'Sin Rol', agrego header indicando que existe solicitud de acceso
                                    if (queryRes.rows[0].RolId === norol.Id){
                                        res.header(HEADER_ROL, 0);
                                    }
                                    // agrego un header a la respuesta, que indica que el usuario sí tiene rol
                                    else{
                                        res.header(HEADER_ROL, 1);
                                    }
                                    
                                    let userData = {
                                        id: resAuth.data.Legajo,
                                        nombre: resAuth.data.Nombre,
                                        rol: nomRol,
                                        createdAt: queryRes.rows[0].createdAt
                                    }
                                    return res.header(HEADER_TOKEN, token).send(userData);

                                });
                            }
                        })
                        // si hay error al buscar rol en la BD, devuelvo 502
                        .catch((error) => {
                            errorMessage = `Error al traer usuarios de BD: ${error}`;
                            return res.status(502).send(errorMessage);
                        });
                        
                    }
                    // Si la respuesta del servicio de autenticación de dominio no tiene la respuesta acordada, devuelvo 502
                    else{
                        errorMessage = `Error al decodificar respuesta del servidor de autenticación. Respuesta: ${resAuth.data.LoginRes}`;
                        return res.status(502).send(errorMessage)
                    }
                }
                // Si no puedo conectar al servidor de autenticación del dominio, retorno 502
                else{
                    errorMessage = `Error en diálogo con servidor de autenticación: ${error.response.status}`;
                    return res.status(502).send(errorMessage);
                }
            })
            // cualquier otro error, retorno 502
            .catch((error) => {
                console.log(error);
                errorMessage = `Error al contactar servidor de autenticación: ${error}`;
                return res.status(502).send(errorMessage);
            });
        }


});

module.exports = router;


