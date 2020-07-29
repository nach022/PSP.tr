const router = require('express').Router();
const verifier = require('./jwtVerify');
const sequelize = require('sequelize');
const asyncHandler = require('express-async-handler');
const { servicioEjecutorValidation, tipoTareaValidation, tareaValidation } = require('../validation');


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

//Función auxiliar que me recupera el servicio ejecutor y lo agrega al request cada vez que la url trae un id de servicio ejecutor
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
        await dbEAM.authenticate();
        console.log("Conexion a BD de EAM, check!");
        let ppms = await dbEAM.query(`select PPM_CODE, PPM_DESC, po.PPO_OBJECT, o.OBJ_DESC, isnull(po.PPO_FREQ, p.PPM_FREQ) FREQ, 
                                        isnull(po.PPO_PERIODUOM, p.PPM_PERIODUOM) PERIODUOM  from R5PPMS p 
                                        inner join R5PPMOBJECTS po on po.PPO_PPM = p.PPM_CODE
                                        inner join R5OBJECTS o on o.OBJ_CODE = po.PPO_OBJECT
                                        where p.ppm_udfchar26 = 'SI'  and PPM_NOTUSED <> '+' order by PPM_CODE, OBJ_DESC`, 
                                        { type: sequelize.QueryTypes.SELECT});
        dbEAM.close();
        let resultado = [];
        for (index in ppms) {
            const ppm = ppms[index];
            let elemento = {
                Id: 0,
                PPM: ppm.PPM_CODE,
                TipoTareaId: null,
                Descr: ppm.PPM_DESC,
                Equipo: ppm.PPO_OBJECT,
                EquipoDescr: ppm.OBJ_DESC,
                Frecuencia: ppm.FREQ,
                Periodo: ppm.PERIODUOM
            }
            let tarea = await db.models['Tarea'].findOne({ where: { PPM: ppm.PPM_CODE, Equipo: ppm.PPO_OBJECT } });
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
        if(dbEAM) dbEAM.close();
        res.status(500).send(error);
    }
    
}));




// SELECT EXTENDIDO
router.get('/tareasOverview', /*verifier,*/ asyncHandler(async (req, res) => {

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
        let salida = [];
        await dbEAM.authenticate();
        console.log("Conexion a BD de EAM, check!");
        let tareas = await db.models['Tarea'].findAll(
            {include:
                {
                    model: db.models['TipoTarea'], as: 'Tipo'
                    
                }
            }
        );
        for(indx in tareas){
            tarea = tareas[indx];
            servicio = await tarea.Tipo.getServicioEjecutor();
            let ultimaEjec = await dbEAM.query("select max(EVT_COMPLETED) as fecha from R5EVENTS evt where evt.EVT_PPM = '"+tarea.PPM+"' and evt.EVT_OBJECT = '"+tarea.Equipo+"' and evt.EVT_TYPE = 'PPM' and EVT_RSTATUS = 'C' AND EVT_STATUS NOT IN ('REJ', 'CANC')", { type: sequelize.QueryTypes.SELECT});
            let equipoDesc = await dbEAM.query("select OBJ_DESC from r5objects where obj_code = '"+tarea.Equipo+"'", { type: sequelize.QueryTypes.SELECT});
            let duracion = await dbEAM.query("select PPM_DURATION from R5PPMS where PPM_CODE = '"+tarea.PPM+"'", { type: sequelize.QueryTypes.SELECT});
            
            let tareaSalida = {
                PPM: tarea.PPM.trim(),
                Descr: tarea.Descr.trim(),
                Equipo: tarea.Equipo.trim(),
                EquipoDescr: equipoDesc[0].OBJ_DESC.trim(),
                Frecuencia: tarea.Frecuencia,
                Periodo: tarea.Periodo.trim(),
                TipoTarea: tarea.Tipo.Nombre.trim(),
                ServicioEjecutor: servicio.Nombre.trim(),
                UltimaEjecucion: null,
                Duracion: duracion[0].PPM_DURATION
            }
            
            if(ultimaEjec){
                tareaSalida.UltimaEjecucion = ultimaEjec[0].fecha;
            }
            salida.push(tareaSalida);
        }
        dbEAM.close();
        res.send(salida);

    }
    catch(error){
        console.log(error);
        if(dbEAM) dbEAM.close();
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




module.exports = router;