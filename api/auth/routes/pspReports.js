const router = require('express').Router();
const verifier = require('./jwtVerify');
const sequelize = require('sequelize');
const { Op } = require('sequelize');
const asyncHandler = require('express-async-handler');
const { TemplateHandler } = require('easy-template-x');
const path = require('path');
const fs = require('fs');



router.param('areaId', function(request, response, next, id){
  db.models['ServicioEjecutor'].findByPk(id)
      .then(existe =>{
          if(existe === null){
              return response.status(404).send('No existe el Servicio Ejecutor para el cual desea generar el informe.'); 
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




async function getCantTareas(area, inicio, fin){
  let queryTotal = 'select sum(cant) as cant from (select count(*) as cant from psp.EjecucionesTareas ejec inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId ';
  queryTotal += ' inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId where tipo.ServicioEjecutorId = ';
  queryTotal += area.toString();
  queryTotal += " and Fecha >= '";
  queryTotal += inicio;
  queryTotal += "' and Fecha <= '";
  queryTotal += fin;
  queryTotal += "' Union select count(*) from psp.EjecucionesFuturasTareas ejec "; 
  queryTotal += ' inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId ';
  queryTotal += ' inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId where tipo.ServicioEjecutorId = ';
  queryTotal += area.toString();
  queryTotal += " and FechaInicio >= '";
  queryTotal += inicio;
  queryTotal += "' and FechaInicio <= '";
  queryTotal += fin;
  queryTotal += "') tabla";
  let result = await db.query( queryTotal, { plain: true, type: sequelize.QueryTypes.SELECT});
  //console.log('queryTotal', queryTotal);
  return result.cant;
}

async function getCantTareasVencidasPrePeriodo(area, inicio){
  let queryPre = 'select sum(cant) as cant from (select count(*) as cant from psp.EjecucionesTareas ejec inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId ';
  queryPre += 'inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId ';
  queryPre += 'where tipo.ServicioEjecutorId = '
  queryPre += area.toString();
  queryPre += " and Fecha < '";
  queryPre += inicio;
  queryPre += "' and (FechaFin >= '";
  queryPre += inicio
  queryPre += "' or FechaFin is null) union select count(*) from psp.EjecucionesFuturasTareas ejec ";
  queryPre += 'inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId ';
  queryPre += 'inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId ';
  queryPre += 'where tipo.ServicioEjecutorId = ';
  queryPre += area.toString();
  queryPre += " and ejec.FechaInicio < '";
  queryPre += inicio
  queryPre += "') tabla";
  let result = await db.query( queryPre, { plain: true, type: sequelize.QueryTypes.SELECT});
  //console.log('queryPre', queryPre);
  return result.cant;
}

async function getCantTareasEjecutadas(area, inicio, fin){
  let queryEjec = 'select count(*) as cant from psp.EjecucionesTareas ejec inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId ';
  queryEjec += ' inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId ';
  queryEjec += " where ejec.Estado = 'FIN' and tipo.ServicioEjecutorId = ";
  queryEjec += area.toString();
  queryEjec += " and FechaFin >= '";
  queryEjec += inicio;
  queryEjec += "' and FechaFin <= '";
  queryEjec += fin;
  queryEjec += "'";
  let result = await db.query( queryEjec, { plain: true, type: sequelize.QueryTypes.SELECT});
  //console.log('queryEjec', queryEjec);
  return result.cant;
}




async function getCantTareasVencidas(area, inicio, fin){
  let queryVenc = 'select sum(cant) as cant from (select count(*) as cant from psp.EjecucionesTareas ejec ';
  queryVenc += ' inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId ';
  queryVenc += " where tipo.ServicioEjecutorId = ";
  queryVenc += area.toString();
  queryVenc += " and Fecha <= '";
  queryVenc += fin;
  queryVenc += "' and (ejec.Estado not in ('FIN', 'CANC') or FechaFin > '";
  queryVenc += fin;
  queryVenc += "') ";
  queryVenc += " Union select count(*) from psp.EjecucionesFuturasTareas ejec inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId ";
  queryVenc += " inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId where ejec.Estado = 'VENC' and tipo.ServicioEjecutorId = ";
  queryVenc += area.toString();
  queryVenc += " and FechaInicio <= '";
  queryVenc += fin;
  queryVenc += "') as tabla";
  result = await db.query( queryVenc, { plain: true, type: sequelize.QueryTypes.SELECT});
  //console.log('queryVenc', queryVenc);
  return result.cant;
}

async function getCantTareasCanceladas(area, inicio, fin){
  let queryCanc = 'select count(*) as cant from psp.EjecucionesTareas ejec ';
  queryCanc += ' inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId ';
  queryCanc += " where ejec.Estado = 'CANC' and tipo.ServicioEjecutorId = ";
  queryCanc += area.toString();
  queryCanc += " and FechaFin >= '";
  queryCanc += inicio;
  queryCanc += "' and FechaFin <= '";
  queryCanc += fin;
  queryCanc += "'";
  result = await db.query( queryCanc, { plain: true, type: sequelize.QueryTypes.SELECT});
  //console.log('queryCanc', queryCanc);
  return result.cant;
}


async function getTareasVencidas(area, inicio, fin){

  let queryVenc = "select * from (select tarea.Descr + ' (Equipo: ' + tarea.Equipo + ')' as Descr, convert(varchar, Fecha, 103) as Venc, Fecha, "; 
  queryVenc += "cast(tarea.Frecuencia as varchar) + case tarea.Periodo when 'W' then ' semana' ";
  queryVenc += "when 'D' then ' día' when 'M' then ' mes' when 'Y' then ' año' end  + ";
  queryVenc += "case tarea.Frecuencia when  1 then '' else case tarea.Periodo when 'M' then 'es' else 's' end end as Freq"
  queryVenc += ' from psp.EjecucionesTareas ejec ';
  queryVenc += ' inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId ';
  queryVenc += " where tipo.ServicioEjecutorId = ";
  queryVenc += area.toString();
  queryVenc += " and Fecha <= '";
  queryVenc += fin;
  queryVenc += "' and (ejec.Estado not in ('FIN', 'CANC') or FechaFin > '";
  queryVenc += fin;
  queryVenc += "') "; 
  queryVenc += " union  select tarea.Descr + ' (Equipo: ' + tarea.Equipo + ')' as Descr, convert(varchar, FechaInicio, 103) as Venc, FechaInicio as Fecha, cast(tarea.Frecuencia as varchar) + ";
  queryVenc += "case tarea.Periodo when 'W' then ' semana' when 'D' then ' día' when 'M' then ' mes' when 'Y' then ' año' end + ";
  queryVenc += "case tarea.Frecuencia when  1 then '' else case tarea.Periodo when 'M' then 'es' else 's' end end as Freq";
  queryVenc += " from psp.EjecucionesFuturasTareas ejec inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId ";
  queryVenc += " inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId where ejec.Estado = 'VENC' and tipo.ServicioEjecutorId = ";
  queryVenc += area.toString();
  queryVenc += " and FechaInicio <= '";
  queryVenc += fin;
  queryVenc += "') tabla order by Descr, Fecha asc";
  result = await db.query( queryVenc, { type: sequelize.QueryTypes.SELECT });
  if (result) return result;
  else return [];
  
}



async function reporteGrupoAccion(req, res, template){
  try{
    const templatePath = path.join(__dirname, template);
    const templateFile = fs.readFileSync(templatePath);
    var dateFormat = require('dateformat');
    let now = new Date();
    let fecha = dateFormat(now, 'dd/mm/yyyy')
    let inicio = new Date(req.body.inicio);
    let fin = new Date(req.body.fin);
    let cantPrevias = await getCantTareasVencidasPrePeriodo(req.area.Id, dateFormat(inicio, 'yyyy-mm-dd'));
    let cantTareas = await getCantTareas(req.area.Id, dateFormat(inicio, 'yyyy-mm-dd'), dateFormat(fin, 'yyyy-mm-dd'));
    let cantEjec = await getCantTareasEjecutadas(req.area.Id, dateFormat(inicio, 'yyyy-mm-dd'), dateFormat(fin, 'yyyy-mm-dd'));
    let cantVenc = await getCantTareasVencidas(req.area.Id, dateFormat(inicio, 'yyyy-mm-dd'), dateFormat(fin, 'yyyy-mm-dd'));
    let cantCanc = await getCantTareasCanceladas(req.area.Id, dateFormat(inicio, 'yyyy-mm-dd'), dateFormat(fin, 'yyyy-mm-dd'));
    let tareasVencidas= await getTareasVencidas(req.area.Id, dateFormat(inicio, 'yyyy-mm-dd'), dateFormat(fin, 'yyyy-mm-dd'))

  

    const data = {
      GrupoAccion: req.area.Nombre,
      FechaRpt: fecha,
      FechaIni: dateFormat(inicio, 'dd/mm/yyyy'),
      FechaFin: dateFormat(fin, 'dd/mm/yyyy'),
      cantPrevias: cantPrevias,
      cantTareas: cantTareas,
      cantEjec: cantEjec,
      cantVenc: cantVenc,
      cantCanc: cantCanc,
      TV: tareasVencidas,
      sinTareas: tareasVencidas.length == 0,
    };

    /*for (let i = 0; i < req.body.comments.length; i++) {
      data['Comment'+ (i+1)] = req.body.comments[i];
    }*/
    const handler = new TemplateHandler();
    const doc = await handler.process(templateFile, data);

    res.send(doc);
  }
  catch(e){
    console.log(e);
    res.status(500).send('Error generando reporte.<br>'+ e.message);
  }

}


router.post('/reporte/:areaId', verifier, asyncHandler(async (req, res) => {
  /*if(req.area.Id == 9){
    await reporteGrupoAccion(req, res, '../templates/rep_GA_GIYP.docx');
  }
  else{
    await reporteGrupoAccion(req, res, '../templates/rep_GA_default.docx');
  }*/
  await reporteGrupoAccion(req, res, '../templates/rep_GA_default.docx');
}));


router.get('/reportePeriodico', verifier, asyncHandler(async (req, res) => {
  let result = [];
  if (req.rolid.includes(parseInt(global.PSP_ADMIN_ROL)) || req.rolid.includes(parseInt(global.SYSADMIN_ROL)) || req.rolid.includes(parseInt(global.PSP_AICO_ROL))){
    result.push({Id: global.PSP_AICO_ID, Descr: 'Área de Informática y Comunicaciones'})
  }
  if (req.rolid.includes(parseInt(global.PSP_ADMIN_ROL)) || req.rolid.includes(parseInt(global.SYSADMIN_ROL)) || req.rolid.includes(parseInt(global.PSP_GGEN_ROL))){
    result.push({Id: global.PSP_GGEN_ID, Descr: 'Gerencia de Generación'})
  }
  if (req.rolid.includes(parseInt(global.PSP_ADMIN_ROL)) || req.rolid.includes(parseInt(global.SYSADMIN_ROL)) || req.rolid.includes(parseInt(global.PSP_GIYP_ROL))){
    result.push({Id: global.PSP_GIYP_ID, Descr: 'Gerencia de Ingeniería y Planeamiento'})
  }
  if (req.rolid.includes(parseInt(global.PSP_ADMIN_ROL)) || req.rolid.includes(parseInt(global.SYSADMIN_ROL)) || req.rolid.includes(parseInt(global.PSP_GOPE_ROL))){
    result.push({Id: global.PSP_GOPE_ID, Descr: 'Gerencia de Operación'})
  }
  if (req.rolid.includes(parseInt(global.PSP_ADMIN_ROL)) || req.rolid.includes(parseInt(global.SYSADMIN_ROL)) || req.rolid.includes(parseInt(global.PSP_HIDRO_ROL))){
    result.push({Id: global.PSP_HIDRO_ID, Descr: 'Área Hidrología'})
  }
  res.send(result);
}));


router.post('/reportePeriodico/:areaId', verifier, asyncHandler(async (req, res) => {

  if(req.area.Id == global.PSP_AICO_ID && 
    !(req.rolid.includes(parseInt(global.PSP_ADMIN_ROL)) || req.rolid.includes(parseInt(global.SYSADMIN_ROL)) || req.rolid.includes(parseInt(global.PSP_AICO_ROL)))){
    res.status(401).send('No tiene permisos para generar el informe de '+ id +'.');
  }
  else if(req.area.Id == global.PSP_GGEN_ID && 
    !(req.rolid.includes(parseInt(global.PSP_ADMIN_ROL)) || req.rolid.includes(parseInt(global.SYSADMIN_ROL)) || req.rolid.includes(parseInt(global.PSP_GGEN_ROL)))){
    res.status(401).send('No tiene permisos para generar el informe de '+ id +'.');
  }
  else if(req.area.Id == global.PSP_GIYP_ID && 
    !(req.rolid.includes(parseInt(global.PSP_ADMIN_ROL)) || req.rolid.includes(parseInt(global.SYSADMIN_ROL)) || req.rolid.includes(parseInt(global.PSP_GIYP_ROL)))){
    res.status(401).send('No tiene permisos para generar el informe de '+ id +'.');
  }
  else if(req.area.Id == global.PSP_GOPE_ID && 
    !(req.rolid.includes(parseInt(global.PSP_ADMIN_ROL)) || req.rolid.includes(parseInt(global.SYSADMIN_ROL)) || req.rolid.includes(parseInt(global.PSP_GOPE_ROL)))){
    res.status(401).send('No tiene permisos para generar el informe de '+ id +'.');
  }
  else if(req.area.Id == global.PSP_HIDRO_ID && 
    !(req.rolid.includes(parseInt(global.PSP_ADMIN_ROL)) || req.rolid.includes(parseInt(global.SYSADMIN_ROL)) || req.rolid.includes(parseInt(global.PSP_HIDRO_ROL)))){
    res.status(401).send('No tiene permisos para generar el informe de '+ id +'.');
  }
  else{

    try{
      const template = '../templates/rep_periodico_default.docx';
      const templatePath = path.join(__dirname, template);
      const templateFile = fs.readFileSync(templatePath);
      var dateFormat = require('dateformat');
      let now = new Date();
      let fecha = dateFormat(now, 'dd/mm/yyyy')
      let inicio = new Date(req.body.inicio);
      let fin = new Date(req.body.fin);
      let cantPrevias = await getCantTareasVencidasPrePeriodo(req.area.Id, dateFormat(inicio, 'yyyy-mm-dd'));
      let cantTareas = await getCantTareas(req.area.Id, dateFormat(inicio, 'yyyy-mm-dd'), dateFormat(fin, 'yyyy-mm-dd'));
      let cantEjec = await getCantTareasEjecutadas(req.area.Id, dateFormat(inicio, 'yyyy-mm-dd'), dateFormat(fin, 'yyyy-mm-dd'));
      let cantVenc = await getCantTareasVencidas(req.area.Id, dateFormat(inicio, 'yyyy-mm-dd'), dateFormat(fin, 'yyyy-mm-dd'));
      let cantCanc = await getCantTareasCanceladas(req.area.Id, dateFormat(inicio, 'yyyy-mm-dd'), dateFormat(fin, 'yyyy-mm-dd'));

      let sectores = [];
      if(req.area.Id == global.PSP_AICO_ID ){
        sectores.push({nombre: 'Área Informática y Comunicaciones'});
      }
      else if(req.area.Id == global.PSP_GGEN_ID){
        sectores.push({nombre: 'Mantenimiento Mecánico'});
        sectores.push({nombre: 'Mantenimiento Eléctrico'});
        sectores.push({nombre: 'Gerencia de Generación'});
      }
      else if(req.area.Id == global.PSP_GIYP_ID){
        sectores.push({nombre: 'Auscultación y Vigilancia'});
        sectores.push({nombre: 'Mantenimiento y Obras'});
        sectores.push({nombre: 'Gestión Ambiental'});
        sectores.push({nombre: 'Gerencia de Ingeniería y Planeamiento'});
      }
      else if(req.area.Id == global.PSP_GOPE_ID){
        sectores.push({nombre: 'Área Despacho'});
        sectores.push({nombre: 'Gerencia de Operaciones'});
      }
      else if(req.area.Id == global.PSP_HIDRO_ID){
        sectores.push({nombre: 'Área Hidrología'});      
      }

      const data = {
        GrupoAccion: req.area.Nombre,
        FechaRpt: fecha,
        FechaIni: dateFormat(inicio, 'dd/mm/yyyy'),
        FechaFin: dateFormat(fin, 'dd/mm/yyyy'),
        cantPrevias: cantPrevias,
        cantTareas: cantTareas,
        cantEjec: cantEjec,
        cantVenc: cantVenc,
        cantCanc: cantCanc,
        sectores: sectores
      };

      const handler = new TemplateHandler();
      const doc = await handler.process(templateFile, data);

      res.send(doc);
    }
    catch(e){
      console.log(e);
      res.status(500).send('Error generando reporte.<br>'+ e.message);
    }
  }
}));


module.exports = router;
