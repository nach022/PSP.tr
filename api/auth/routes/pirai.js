const router = require('express').Router();
const verifier = require('./jwtVerify');
const sequelize = require('sequelize');
const { Op } = require('sequelize');
const asyncHandler = require('express-async-handler');
const { profundidadValidation } = require('../piraiValidation');




/****************       UBICACIONES       ******************/

// SELECT
router.get('/ubicaciones', verifier, asyncHandler(async (req, res) => {
    try {
        let result = await db.models['Ubicacion'].findAll();    
        res.status(200).send(result);
    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}));

module.exports = router;

/****************     PROFUNDIDADES    ******************/

//Función auxiliar que me recupera la profundidad y la agrega al request cada vez que la url trae un codigo de profundidad
router.param('profundidadCod', function(request, response, next, id){
    db.models['Profundidad'].findByPk(id)
        .then(existe =>{
            if(existe === null){
                return response.status(404).send('No existe la Profundidad.'.id); 
            }
            else{
                request.profundidad = existe;
                next();
            }
        })
        .catch(error => {
            return next(error);
        })
  });   

// SELECT
router.get('/profundidades', verifier, asyncHandler(async (req, res) => {
    try {
        let result = await db.models['Profundidad'].findAll({ order: ['Orden'] });    
        res.status(200).send(result);
    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}));

// INSERT
router.post('/profundidades', verifier, asyncHandler(async (req, res) => {
    // verifico que el body esté bien formado
    const { error } = profundidadValidation(req.body);
    // si no está bien formado devuelvo estado 400
    if(error){  
        console.log(req.body)  
        return res.status(400).send(error.details[0].message);
    }
    // si está bien formado
    else{
        // busco una profundidad existente con la misma descripcion o mismo código o mismo orden.
        db.models['Profundidad'].findOne(
            { where: 
                { [Op.or]: [
                    { Codigo: req.body.Codigo.trim() },
                    { Descripcion: req.body.Descripcion.trim() },
                    { Orden: req.body.Orden }
                ] } 
            })
        .then(existe =>{
            // si no existe profundidad con el mismo código o descripción, la creo
            if(existe === null){
                db.models['Profundidad'].create({
                    Codigo: req.body.Codigo.trim(),
                    Descripcion: req.body.Descripcion.trim(),
                    Orden: req.body.Orden })
                .then(newProf =>{
                    res.status(201).send(newProf);
                })
                .catch(error =>{
                    res.status(409).send(error);
                })
            }
            //si ya existia una servicio con ese código, orden o descripción
            else{ 
                res.status(409).send('Ya existe una Profundidad con ese código, descripción u orden.');            
            }
        })
        .catch(error =>{
            res.status(500).send(error)
        });
    }
}));






// UPDATE
router.put('/profundidades/:profundidadCod', verifier, asyncHandler(async (req, res) => {
    // verifico que el body esté bien formado
    const { error } = profundidadValidation(req.body);
    // si n está bien formado devuelvo estado 400
    if(error){     
        return res.status(400).send(error.details[0].message);
    }
    // si está bien formado
    else{
        if(req.profundidad.Descripcion !== req.body.Descripcion.trim() || req.profundidad.Orden !== req.body.Orden ){
            // busco una profundidad con la misma descripción.
            db.models['Profundidad'].findOne({
                where: 
                    { 
                        [Op.and]: [
                            { Codigo: { [Op.ne]: req.profundidad.Codigo }},
                            {[Op.or]: [
                                { Descripcion: req.body.Descripcion.trim() },
                                { Orden: req.body.Orden }
                            ]}
                        ]    
                    } 
                })
            .then(existe =>{
                // si no existe profudidad con la misma descripción u orden, realizo la actualización
                if(existe === null){
                    req.profundidad.Descripcion = req.body.Descripcion.trim();
                    req.profundidad.Orden = req.body.Orden;
                    req.profundidad.save()
                    .then(newProf =>{
                        res.status(200).send(newProf);
                    })
                    .catch(error =>{
                        res.status(409).send(error);
                    })
                }
                //si ya existia un servicio con ese nombre retorno 409
                else{
                    res.status(409).send('Ya existe una Profundidad con la misma descripción o en el mismo orden.')
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
router.delete('/profundidades/:profundidadCod', verifier, asyncHandler(async (req, res) => {
    req.profundidad.destroy().
    then(() =>{
        res.status(200).send();
    })
    .catch(error =>{
        res.status(500).send(error)
    });   
}));





/****************       FAMILIAS       ******************/

// SELECT
router.get('/familias', verifier, asyncHandler(async (req, res) => {
    try {
        let result = await db.models['FamiliaVariables'].findAll({ order: ['Nombre'] });    
        res.status(200).send(result);
    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}));

module.exports = router;



/****************        VARIABLES     ******************/

router.get('/variables', verifier, asyncHandler(async (req, res) => {
    try {
        let result = await db.models['Variable'].findAll(
            { 
                order: ['Nombre']
            }); 

        const promises = result.map(async element => {
            let variable = 
            {
                Codigo: element.Codigo,
                Nombre: element.Nombre,
                FamiliaVariableCodigo: element.FamiliaVariableCodigo == null ? '' : element.FamiliaVariableCodigo,
                Unidad: element.Unidad == null ? '' : element.Unidad,
                Minimo: element.Minimo == null ? '' : element.Minimo,
                Maximo: element.Maximo == null ? '' : element.Maximo,
                MinVis: element.MinVis == null ? '' : element.MinVis,
                MaxVis: element.MaxVis == null ? '' : element.MaxVis,
                Tipo: element.Tipo,
                TieneLQ: element.TieneLQ,
                LQ: element.LQ == null ? '' : element.LQ,
                Campo: element.Campo,
                Laboratorio: element.Laboratorio,
                Automatica: element.Automatica,
                TecnicaCAM: '',
                TecnicaLAB: '',
                TecnicaAUT: '',
                ListaValores: []
            };

            if (element.Tipo === 'LIS'){
                let lista = await db.models['ItemListaVariable'].findAll({
                    attributes: ['ValorPosible', 'Orden'],
                    where:  {
                        VariableCodigo: element.Codigo
                    },
                    order: ['Orden']
                })
                if(lista){
                    variable.ListaValores = lista == null ? [] : lista;
                }
                
            }
               
            if(element.Campo){
                let tec = await db.models['TecnicaVariable'].findOne(
                    { 
                        where: {
                            VariableCodigo: element.Codigo,
                            Origen: 'CAM'
                        },
                        order: [['FechaEfectiva', 'DESC']]
                    });
                if (tec) {
                    variable.TecnicaCAM = tec.Tecnica == null ? '' : tec.Tecnica;
                }                
            }
            if(element.Laboratorio){
                let tec = await db.models['TecnicaVariable'].findOne(
                    { 
                        where: {
                            VariableCodigo: element.Codigo,
                            Origen: 'LAB'
                        },
                        order: [['FechaEfectiva', 'DESC']]
                    });
                if (tec) {
                    variable.TecnicaLAB = tec.Tecnica == null ? '' : tec.Tecnica;
                }                
            }
            if(element.Automatica){
                let tec = await db.models['TecnicaVariable'].findOne(
                    { 
                        where: {
                            VariableCodigo: element.Codigo,
                            Origen: 'AUT'
                        },
                        order: [['FechaEfectiva', 'DESC']]
                    });
                if (tec) {
                    variable.TecnicaAUT = tec.Tecnica == null ? '' : tec.Tecnica;
                }                
            }
            return variable;
             
        }); 
        

        const variables = await Promise.all(promises);
        let profundidades = await db.models['Profundidad'].findAll({
            order: ['Orden']
        });

        const promises2 = variables.map(async auxVar => {

            const promises3 = profundidades.map(async prof =>{
                let arrProfs = {
                    Codigo: prof.Codigo,
                    habilitado: {
                        CAM: false,
                        LAB: false,
                        AUT: false
                    }
                }

                if(auxVar.Campo){
                    let phab = await db.models['ProfundidadVariable'].findOne(
                        { 
                            where: {
                                VariableCodigo: auxVar.Codigo,
                                ProfundidadCodigo: prof.Codigo,
                                Origen: 'CAM'
                            }
                        });
                    if(phab){
                        arrProfs.habilitado.CAM = true;
                    }
                }
                if(auxVar.Laboratorio){
                    let phab = await db.models['ProfundidadVariable'].findOne(
                        { 
                            where: {
                                VariableCodigo: auxVar.Codigo,
                                ProfundidadCodigo: prof.Codigo,
                                Origen: 'LAB'
                            }
                        });
                    if(phab){
                        arrProfs.habilitado.LAB = true;
                    }
                }
                if(auxVar.Automatica){
                    let phab = await db.models['ProfundidadVariable'].findOne(
                        { 
                            where: {
                                VariableCodigo: auxVar.Codigo,
                                ProfundidadCodigo: prof.Codigo,
                                Origen: 'AUT'
                            }
                        });
                    if(phab){
                        arrProfs.habilitado.AUT = true;
                    }
                }
                return arrProfs;
            });
            let profHabs = await Promise.all(promises3);
        
            for(ph of profHabs){
                auxVar[ph.Codigo] = ph.habilitado;
            }
            return auxVar;
               
            
                      
        });  

        const salida = await Promise.all(promises2);
        res.status(200).send(salida);

        
    }
    catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}));

module.exports = router;