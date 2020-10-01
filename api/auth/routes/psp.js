const router = require('express').Router();
const verifier = require('./jwtVerify');
const sequelize = require('sequelize');
const asyncHandler = require('express-async-handler');
const { servicioEjecutorValidation, tipoTareaValidation, tareaValidation, commentValidation } = require('../validation');


/************** Servicios Ejecutores **************/

//Función auxiliar que me recupera el servicio ejecutor y lo agrega al request cada vez que la url trae un id de servicio ejecutor
router.param('areaId', function(request, response, next, id){
    db.models['ServicioEjecutor'].findByPk(id)
        .then(existe =>{
            if(existe === null){
                return response.status(404).send('No existe el Servicio Ejecutor.'); 
            }
            else{
                request.area = existe;
                next();
            }
        })
        .catch(error => {
            return next(error);
        })
  });   


// SELECT
router.get('/areas', verifier, asyncHandler(async (req, res) => {
    let areas = await db.models['ServicioEjecutor'].findAll({ order: ['Nombre'] });
    let result = [];
    for(indx in areas){
        let aux ={
            Id: areas[indx].Id,
            Nombre: areas[indx].Nombre
        }
        result.push(aux);
    }
    
    res.status(200).send(result);
}));


//Select Nombre Areas de Usuario
router.get('/myAreas', verifier, asyncHandler(async (req, res) => {
    let areas = await db.models['ServicioEjecutor'].findAll({ 
        where: {
            Id: req.areas
        },
        order: ['Nombre'] 
    });
    let result = [];
    for(indx in areas){
        result.push(areas[indx].Nombre);
    }
    res.status(200).send(result);
}));


// INSERT
router.post('/areas', verifier, asyncHandler(async (req, res) => {
// verifico que el body esté bien formado
    const { error } = servicioEjecutorValidation(req.body);
    // si n está bien formado devuelvo estado 400
    if(error){     
        return res.status(400).send(error.details[0].message);
    }
    // si está bien formado
    else{
        // busco un sevicio existente con el mismo nombre.
        db.models['ServicioEjecutor'].findOne({ where: { Nombre: req.body.Nombre.trim() } })
        .then(existe =>{
            // si no existe servicio con el mismo nombre, lo creo
            if(existe === null){
                db.models['ServicioEjecutor'].create({Nombre: req.body.Nombre.trim()})
                .then(newServ =>{
                    res.status(201).send(newServ);
                })
                .catch(error =>{
                    res.status(409).send(error);
                })
            }
            //si ya existia un servicio con ese nombre retorno 409
            else{ 
                res.status(409).send('Ya existe un Servicio Ejecutor con ese nombre.');            
            }
        })
        .catch(error =>{
            res.status(500).send(error)
        });
    }
}));


// UPDATE
router.put('/areas/:areaId', verifier, asyncHandler(async (req, res) => {
    // verifico que el body esté bien formado
    const { error } = servicioEjecutorValidation(req.body);
    // si n está bien formado devuelvo estado 400
    if(error){     
        return res.status(400).send(error.details[0].message);
    }
    // si está bien formado
    else{
        if(req.area.Nombre !== req.body.Nombre.trim()){
            // busco un sevicio existente con el mismo nombre.
            db.models['ServicioEjecutor'].findOne({ where: { Nombre: req.body.Nombre.trim() } })
            .then(existe =>{
                // si no existe servicio con el mismo nombre, realizo la actualización
                if(existe === null){
                    req.area.Nombre = req.body.Nombre.trim();
                    req.area.save()
                    .then(newServ =>{
                        res.status(200).send(newServ);
                    })
                    .catch(error =>{
                        res.status(409).send(error);
                    })
                }
                //si ya existia un servicio con ese nombre retorno 409
                else{
                    res.status(409).send('Ya existe un Servicio Ejecutor con ese nombre.')
                }
            })
            .catch(error =>{
                res.status(500).send(error)
            });
        }
        else{
            res.status(200).send(req.area);
        }
    }  
    
}));


// DELETE
router.delete('/areas/:areaId', verifier, asyncHandler(async (req, res) => {
    req.area.destroy().
    then(() =>{
        res.status(200).send();
    })
    .catch(error =>{
        res.status(500).send(error)
    });   
}));






/************** Tipos de Tareas **************/

//Función auxiliar que me recupera el servicio ejecutor y lo agrega al request cada vez que la url trae un id de servicio ejecutor
router.param('TipoTareaId', function(request, response, next, id){
    db.models['TipoTarea'].findByPk(id)
        .then(existe =>{
            if(existe === null){
                return response.status(404).send('No existe el Tipo de Tarea.'); 
            }
            else{
                request.tipoTarea = existe;
                next();
            }
        })
        .catch(error => {
            return next(error);
        })
  });   

// SELECT
router.get('/tiposTareas', verifier, asyncHandler(async (req, res) => {
    db.models['TipoTarea'].findAll({ order: ['Nombre'] })
    .then(tipos =>{
        let result = [];
        for(indx in tipos){
            let aux ={
                Id: tipos[indx].Id,
                Nombre: tipos[indx].Nombre,
                ServicioEjecutorId: tipos[indx].ServicioEjecutorId
            }
            result.push(aux);
        }
        res.status(200).send(result);

    })
    .catch(error =>{
        res.status(500).send(error)
    });
}));


// INSERT
router.post('/tiposTareas', verifier, asyncHandler(async (req, res) => {
    // verifico que el body esté bien formado
        const { error } = tipoTareaValidation(req.body);
        // si n está bien formado devuelvo estado 400
        if(error){     
            return res.status(400).send(error.details[0].message);
        }
        // si está bien formado
        else{
            // busco el servicio ejecutor
            db.models['ServicioEjecutor'].findByPk(req.body.Responsable)
            .then(servEjec => {
                // si el servicio ejecutor no existe, retorno 404
                if(servEjec === null){
                    return res.status(404).send('No existe el Servicio Ejecutor al cual desea agregarle un Tipo de Tarea.'); 
                }
                else{
                    // busco un tipo de tarea existente con el mismo nombre y mismo servicio ejecutor.
                    db.models['TipoTarea'].findOne({ where: { Nombre: req.body.Nombre.trim(), ServicioEjecutorId: req.body.Responsable }})
                    .then(existe =>{
                        // si no existe tipo de tarea con el mismo nombre y responsable, lo creo
                        if(existe === null){
                            db.models['TipoTarea'].create({Nombre: req.body.Nombre.trim()})
                            .then(newTipo =>{
                                newTipo.setServicioEjecutor(servEjec);
                                newTipo.save()
                                .then(tipo =>{
                                    res.status(201).send(tipo);
                                })
                                .catch(error =>{
                                    res.status(500).send(error);
                                })
                                
                            })
                            .catch(error =>{
                                res.status(409).send(error);
                            })
                        }
                        else{ 
                            //Si ya existe retorno 409
                            res.status(409).send('Ya existe un Tipo de Tarea con ese nombre para el Servicio Ejecutor indicado.');
                        }

                    })
                    .catch(error =>{
                        res.status(500).send(error)
                    });
               
                }
            })
            .catch(error =>{
                res.status(500).send(error)
            });
            
        }
    }));






// UPDATE
router.put('/tiposTareas/:TipoTareaId', verifier, asyncHandler(async (req, res) => {
    // verifico que el body esté bien formado
    const { error } = tipoTareaValidation(req.body);
    // si n está bien formado devuelvo estado 400
    if(error){     
        return res.status(400).send(error.details[0].message);
    }
    // si está bien formado
    else{
        if(req.tipoTarea.Nombre !== req.body.Nombre.trim()){
            // busco un sevicio existente con el mismo nombre.
            db.models['TipoTarea'].findOne({ where: { Nombre: req.body.Nombre.trim(), ServicioEjecutorId: req.body.Responsable } })
            .then(existe =>{
                // si no existe servicio con el mismo nombre, realizo la actualización
                if(existe === null){
                    req.tipoTarea.Nombre = req.body.Nombre.trim();
                    req.tipoTarea.save()
                    .then(newTipo =>{
                        res.status(200).send(newTipo);
                    })
                    .catch(error =>{
                        res.status(409).send(error);
                    })
                }
                //si ya existia un servicio con ese nombre retorno 409
                else{
                    res.status(409).send('Ya existe un Tipo de Tarea con ese nombre para ese Servicio Ejecutor.')
                }
            })
            .catch(error =>{
                res.status(500).send(error)
            });
        }
        else{
            res.status(200).send(req.tipoTarea);
        }
    }  
    
}));



// DELETE
router.delete('/tiposTareas/:TipoTareaId', verifier, asyncHandler(async (req, res) => {
    req.tipoTarea.destroy().
    then(() =>{
        res.status(200).send();
    })
    .catch(error =>{
        res.status(500).send(error)
    });   
}));





/************** Tareas **************/

//Función auxiliar que me recupera la tarea y la agrega al request cada vez que la url trae un id de tarea
router.param('TareaId', function(request, response, next, id){
    db.models['Tarea'].findByPk(id)
        .then(existe =>{
            if(existe === null){
                return response.status(404).send('No existe la Tarea.'); 
            }
            else{
                request.tarea = existe;
                next();
            }
        })
        .catch(error => {
            return next(error);
        })
  });   


// SELECT

router.get('/tareas', verifier, asyncHandler(async (req, res) => {
    const dbEAM = new sequelize(DB_EAM_NAME, DB_EAM_USER, DB_EAM_PASSWORD, {
        host: DB_EAM_HOST,
        dialect: DB_EAM_DIALECT,
        logging: false,
        dialectOptions: {
            options: {
            trustServerCertificate: true,
            schema: "dbo",
            },
        }
    });
    try{
        const db = new sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
            host: DB_HOST,
            dialect: DB_DIALECT,
            logging: false,
            dialectOptions: {
              options: {
                trustServerCertificate: true,
                schema: "auth",
              },
            },
            pool: {
              max: DB_POOL_MAX,
              min: DB_POOL_MIN,
              acquire: DB_POOL_ACQUIRE,
              idle: DB_POOL_IDLE,
            },
          });
       
        await dbEAM.authenticate();
        console.log("Conexion a BD de EAM, check!");

        let ppms = await db.query(`select PPM_CODE, PPM_DESC, OBJ_CODE, OBJ_DESC, PPM_FREQ, PPM_PERIODUOM  from psp.TareasInfo`, { type: sequelize.QueryTypes.SELECT});
        let resultado = [];
        for (index in ppms) {
            const ppm = ppms[index];
            let elemento = {
                Id: 0,
                PPM: ppm.PPM_CODE,
                TipoTareaId: null,
                Descr: ppm.PPM_DESC,
                Equipo: ppm.OBJ_CODE,
                EquipoDescr: ppm.OBJ_DESC,
                Frecuencia: ppm.PPM_FREQ,
                Periodo: ppm.PPM_PERIODUOM
            }
            let tarea = await db.models['Tarea'].findOne({ where: { PPM: ppm.PPM_CODE, Equipo: ppm.OBJ_CODE } });
            if(tarea !== null){
                //console.log(tarea);
                elemento.Id = tarea.Id;
                elemento.TipoTareaId = tarea.TipoTareaId;
                elemento.Descr = tarea.Descr;
                elemento.Frecuencia = tarea.Frecuencia;
                elemento.Periodo =  tarea.Periodo;
            }
            resultado.push(elemento);
        }
        res.send(resultado);
    }

    catch(error){
        console.log(error);
        res.status(500).send(aux);
    }
    
}));




// SELECT EXTENDIDO
router.get('/tareasOverview', verifier, asyncHandler(async (req, res) => {
    try{
        let salida = [];
        let tareasInfo = await db.query("select PPM_CODE, OBJ_CODE, PPM_DESC, OBJ_DESC, UltimaEjecucion, Holgura, PPM_DURATION from psp.TareasInfo", { type: sequelize.QueryTypes.SELECT});
        
        for(indx in tareasInfo){
            tareaInfo = tareasInfo[indx];
            let ultimaEjec = new Date(tareaInfo.UltimaEjecucion);
            const timeZoneDifference = (ultimaEjec.getTimezoneOffset() / 60);
            ultimaEjec.setTime(ultimaEjec.getTime() + (timeZoneDifference * 60) * 60 * 1000);
            if(tareaInfo.PPM_CODE === '854AUS001'){
                console.log('ue: ',tareaInfo.UltimaEjecucion);
                console.log('ue2: ',ultimaEjec);
                console.log('tz: ', timeZoneDifference);
                console.log('ue3: ',ultimaEjec);
                console.log(tareaInfo);
            }

            let duracion = tareaInfo.PPM_DURATION;
            let tarea = await db.models['Tarea'].findOne({ where:{PPM_CODE: tareaInfo.PPM_CODE, Equipo: tareaInfo.OBJ_CODE}, include:{ model: db.models['TipoTarea'], as: 'Tipo' }})
            servicio = await tarea.Tipo.getServicioEjecutor();
            if(req.areas.includes(servicio.Id)){
                let cantComents = await db.models['ComentarioTarea'].count({ where: {'TareaId': tarea.Id}});

                let tareaSalida = {
                    Id: tarea.Id,
                    PPM: tarea.PPM.trim(),
                    Descr: tarea.Descr.trim(),
                    Equipo: tarea.Equipo.trim(),
                    EquipoDescr: tareaInfo.OBJ_DESC.trim(),
                    Frecuencia: tarea.Frecuencia,
                    Periodo: tarea.Periodo.trim(),
                    TipoTarea: tarea.Tipo.Nombre.trim(),
                    ServicioEjecutor: servicio.Nombre.trim(),
                    UltimaEjecucion: ultimaEjec,
                    Duracion: duracion,
                    Holgura: tareaInfo.Holgura,
                    CantComents: cantComents
                }
                salida.push(tareaSalida);
            }
        }
        res.send(salida);

    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }
    
}));




// SELECT Diferentes frecuencias
router.get('/tareasFreqDiff', verifier, asyncHandler(async (req, res) => {
    try{
        let salida = [];
        let ppms = await db.query(`select TareaId, info.PPM_CODE, Descr, OBJ_CODE, OBJ_DESC, isnull(Frecuencia,0) Frecuencia, Periodo, 
                                isnull(PPM_FREQ,0) PPM_FREQ, PPM_PERIODUOM from psp.Tareas tarea
                                inner join psp.TareasInfo info on tarea.PPM_CODE = info.PPM_CODE and tarea.Equipo = info.OBJ_CODE
                                inner join psp.TiposTareas tipo on tarea.TipoTareaId = tipo.TipoTareaId
                                where isnull(tarea.Periodo,-999) <> isnull(info.PPM_PERIODUOM, -999) or isnull(tarea.Frecuencia,'999') <> isnull(PPM_FREQ, '999')
                                and tipo.ServicioEjecutorId in (${req.areas})`, 
                                { type: sequelize.QueryTypes.SELECT});
        
        
        for(indx in ppms){
            tarea = ppms[indx];
            let tareaSalida = {
                PPM: tarea.PPM_CODE.trim(),
                Descr: tarea.Descr.trim(),
                Equipo: tarea.OBJ_CODE.trim(),
                EquipoDescr: tarea.OBJ_DESC.trim(),
                Frecuencia: tarea.Frecuencia,
                Periodo: tarea.Periodo,
                FrecuenciaEAM: tarea.PPM_FREQ,
                PeriodoEAM: tarea.PPM_PERIODUOM,
            }
            salida.push(tareaSalida);
        }
        res.send(salida);

    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }
    
}));








// INSERT
router.post('/tareas', verifier, asyncHandler(async (req, res) => {
    // verifico que el body esté bien formado
    const { error } = tareaValidation(req.body);
    // si n está bien formado devuelvo estado 400
    if(error){     
        return res.status(400).send(error.details[0].message);
    }
    // si está bien formado
    else{
        // busco el tipo de Tarea
        db.models['TipoTarea'].findByPk(req.body.TipoTareaId)
        .then(tipo => {
            // si el tipo no existe, retorno 404
            if(tipo === null){
                return res.status(404).send('No existe el Tipo de Tarea al cual desea agregarle una Tarea.'); 
            }
            else{
                // busco una tarea existente con el mismo PPM y Equipo.
                db.models['Tarea'].findOne({ where: { PPM: req.body.PPM.trim(), Equipo: req.body.Equipo.trim() }})
                .then(existe =>{
                    // si no existe tarea con el mismo ppm y equipo lo creo
                    if(existe === null){
                        db.models['Tarea'].create({PPM: req.body.PPM.trim(), Descr:req.body.Descr.trim(), Frecuencia: req.body.Frecuencia, 
                                                    Equipo: req.body.Equipo.trim(), Periodo: req.body.Periodo})
                        .then(newTarea =>{
                            newTarea.setTipo(tipo);
                            newTarea.save()
                            .then(tarea =>{
                                res.status(201).send(tarea);
                            })
                            .catch(error =>{
                                res.status(500).send(error);
                            })
                            
                        })
                        .catch(error =>{
                            console.log(error);
                            res.status(409).send(error);
                        })
                    }
                    else{ 
                        //Si ya existe retorno 409
                        res.status(409).send('Ya existe una Tarea para el Programado indicado.');
                    }

                })
                .catch(error =>{
                    console.log(error);
                    res.status(500).send(error)
                });
            
            }
        })
        .catch(error =>{
            console.log(1,error);
            res.status(500).send(error)
        });
        
    }
}));


// UPDATE
router.put('/tareas/:TareaId', verifier, asyncHandler(async (req, res) => {
    // verifico que el body esté bien formado
    const { error } = tareaValidation(req.body);
    // si n está bien formado devuelvo estado 400
    if(error){     
        return res.status(400).send(error.details[0].message);
    }
    // si está bien formado
    else{
        // actualizo los campos a sus nuevos valores
        req.tarea.Descr = req.body.Descr.trim();
        req.tarea.Frecuencia = req.body.Frecuencia;
        if(req.body.Periodo !== null){
            req.tarea.Periodo = req.body.Periodo.trim();
        }
        else{
            req.tarea.Periodo = null;
        }

        // si el tipo de tarea fue modificado cambio la tarea al nuevo tipo.
        if(req.tarea.TipoTareaId != req.body.TipoTareaId){

            db.models['TipoTarea'].findByPk(req.body.TipoTareaId)
            .then(tipo => {
                // si el tipo no existe, retorno 404
                if(tipo === null){
                    return res.status(404).send('No existe el Tipo de Tarea al cual desea agregarle una Tarea.'); 
                }
                else{
                    req.tarea.setTipo(tipo);
                }
            });
        }
        req.tarea.save()
        .then(newTarea =>{
            res.status(200).send(newTarea);
        })
        .catch(error =>{
            res.status(409).send(error);
        })
    }    
}));



// DELETE
router.delete('/tareas/:TareaId', verifier, asyncHandler(async (req, res) => {
    req.tarea.destroy().
    then(() =>{
        res.status(200).send();
    })
    .catch(error =>{
        res.status(500).send(error)
    });   
}));



/************** Notificaciones **************/


router.get('/notificaciones', verifier, asyncHandler(async (req, res) => {
    
    try{ 
        let salida = [];
        /* Notificación de nuevos usuarios */
        if (req.rolid.includes(parseInt(PSP_ADMIN_ROL)) || req.rolid.includes(parseInt(SYSADMIN_ROL))){
            let solicitudes = await db.models['UserRol'].count({ where: {RolId: PSP_NO_ROL} })
            if(solicitudes > 0){
                salida.push({
                    Tipo: 'newUser',
                    Cant: solicitudes
                });
            }
        }

        /* Notificación de Tareas Vencidas */
        let vencidas = await db.query(`select count(*) as Cant from psp.Tareas tarea
                                        inner join psp.TiposTareas tipo on tarea.TipoTareaId = tipo.TipoTareaId
                                        inner join psp.TareasInfo info on info.PPM_CODE = tarea.PPM_CODE and info.OBJ_CODE = tarea.Equipo
                                        where tipo.ServicioEjecutorId in (${req.areas})
                                        and info.Holgura <= 0`, 
                                            { type: sequelize.QueryTypes.SELECT});
        if(vencidas[0].Cant > 0){
            salida.push({
                Tipo: 'vencidas',
                Cant: vencidas[0].Cant
            });
        }

        /* Notificaciones de vencimientos semanales */
        let vencimientos = await db.query(`select count(*) as Cant from psp.Tareas tarea
                                        inner join psp.TiposTareas tipo on tarea.TipoTareaId = tipo.TipoTareaId
                                        inner join psp.TareasInfo info on info.PPM_CODE = tarea.PPM_CODE and info.OBJ_CODE = tarea.Equipo
                                        where tipo.ServicioEjecutorId in (${req.areas})
                                        and info.Holgura > 0 and info.Holgura <= 7`, 
                                            { type: sequelize.QueryTypes.SELECT});
        if(vencimientos[0].Cant > 0){
            salida.push({
                Tipo: 'vencSemana',
                Cant: vencimientos[0].Cant
            });
        }

        /* Notificación de nuevas tareas en EAM */
        if (req.rolid.includes(parseInt(PSP_ADMIN_ROL)) || req.rolid.includes(parseInt(SYSADMIN_ROL))){
            let ppms = await db.query(`select count(*) as Cant from psp.TareasInfo info
                                            where not exists(Select 1 from psp.Tareas tarea where tarea.PPM_CODE = info.PPM_CODE and tarea.Equipo = info.OBJ_CODE)`, 
                                            { type: sequelize.QueryTypes.SELECT});
            if(ppms[0].Cant > 0){
                salida.push({
                    Tipo: 'newPPM',
                    Cant: ppms[0].Cant
                });
            }
        }

        /* Notificación de frecuencias diferentes entre EAM y PSP */
        ppms = await db.query(`select count(*) as Cant from psp.Tareas tarea
                                inner join psp.TareasInfo info on tarea.PPM_CODE = info.PPM_CODE and tarea.Equipo = info.OBJ_CODE
                                inner join psp.TiposTareas tipo on tarea.TipoTareaId = tipo.TipoTareaId
                                where isnull(tarea.Periodo,-999) <> isnull(info.PPM_PERIODUOM, -999) or isnull(tarea.Frecuencia,'999') <> isnull(PPM_FREQ, '999')
                                and tipo.ServicioEjecutorId in (${req.areas})`, 
                                { type: sequelize.QueryTypes.SELECT});
        
        if(ppms[0].Cant > 0){
            salida.push({
                Tipo: 'difFrec',
                Cant: ppms[0].Cant
            });
        }


        res.status(200).send(salida);

    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }
    
 
}));



/************** juntas **************/


router.get('/juntas', verifier, asyncHandler(async (req, res) => {
    
    try{ 
        let juntas = await db.query(`select distinct Junta from psp.LimitesMediciones`, { type: sequelize.QueryTypes.SELECT});
        res.status(200).send(juntas);

    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }
    
 
}));






/************** Comentarios de Tareas **************/

// Función auxiliar para obtener comentario
router.param('CommentId', function(request, response, next, id){
    db.models['ComentarioTarea'].findByPk(id)
        .then(existe =>{
            if(existe === null){
                return response.status(404).send('No existe el comentario.'); 
            }
            else{
                request.comentario = existe;
                next();
            }
        })
        .catch(error => {
            return next(error);
        })
  });   


//SELECT
router.get('/commentsTarea', verifier, asyncHandler(async (req, res) => {
    try{ 
        const url = require('url');
        const queryObject = url.parse(req.url, true).query;
        let comments = await db.models['ComentarioTarea'].findAll({ 
            where: {
                TareaId: queryObject.TareaId
            },
            order: ['createdAt'],
            include:{ model: db.models['User'], as: 'User' } 
        });
        salida = [];
        comments.forEach(element => {
            salida.push({
                ComentarioId: element.Id,
                CreatedAt: element.createdAt,
                UserId: element.UserLegajo,
                UserName: element.User.Nombre,
                Comentario: element.Comentario,
                Deletable: element.UserLegajo == req.userid
            })
        });
        res.status(200).send(salida);

    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }
    
 
}));



router.post('/commentsTarea', verifier, asyncHandler(async (req, res) => {
    // verifico que el body esté bien formado
    const { error } = commentValidation(req.body);
    // si n está bien formado devuelvo estado 400
    if(error){     
        return res.status(400).send(error.details[0].message);
    }
    // si está bien formado
    else{
        // busco la tarea
        db.models['Tarea'].findByPk(req.body.IdTarea, { include:{ model: db.models['TipoTarea'], as: 'Tipo' } })
        .then(tarea => {
            // si la tarea no existe, retorno 404
            if(tarea === null){
                return res.status(404).send('No existe la Tarea a al cual desea agregarle un comentario.'); 
            }
            else{
                // busco una tarea existente con el mismo PPM y Equipo.

                tarea.Tipo.getServicioEjecutor()
                .then(servicio => {
                    if(req.areas.includes(servicio.Id)){
                        db.models['ComentarioTarea'].create({TareaId: tarea.Id, Comentario: req.body.commentText.trim(), UserLegajo: req.userid})
                        .then(com =>{
                            db.models['User'].findByPk(com.UserLegajo)
                            .then(user => {
                                res.status(201).send({
                                    ComentarioId: com.Id,
                                    CreatedAt: com.createdAt,
                                    UserId: com.UserLegajo,
                                    UserName: user.Nombre,
                                    Comentario: com.Comentario,
                                    Deletable: true
                                });

                            })
                            .catch(error =>{
                                console.log(error);
                                res.status(500).send(error);
                            })
                          
                        })
                        .catch(error =>{
                            console.log(error);
                            res.status(500).send(error);
                        })
                    }
                
                    else{
                        return res.status(403).send('No puede agregar comentarios a tareas de otro grupo de acción que no sea el suyo.');
                    }
            
                })
                .catch(error =>{
                    console.log(error);
                    res.status(409).send(error);
                })
            }
                    
        })
        .catch(error =>{
            console.log(error);
            res.status(500).send(error);
        });
                
        
    }
}));



router.delete('/commentsTarea/:CommentId', verifier, asyncHandler(async (req, res) => {
    /************************************************************** si el usuario es igual */
    req.comentario.destroy().
    then(() =>{
        res.status(200).send();
    })
    .catch(error =>{
        res.status(500).send(error)
    });   
}));


module.exports = router;