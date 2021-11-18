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
  return result.cant;
}


async function getCantTareasEjecutadas(area, inicio, fin){
  let queryEjec = 'select count(*) as cant from psp.EjecucionesTareas ejec inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId ';
  queryEjec += ' inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId ';
  queryEjec += " where ejec.Estado = 'FIN' and tipo.ServicioEjecutorId = ";
  queryEjec += area.toString();
  queryEjec += " and Fecha >= '";
  queryEjec += inicio;
  queryEjec += "' and Fecha <= '";
  queryEjec += fin;
  queryEjec += "'";
  let result = await db.query( queryEjec, { plain: true, type: sequelize.QueryTypes.SELECT});
  return result.cant;
}




async function getCantTareasVencidas(area, inicio, fin){
  let queryVenc = 'select sum(cant) as cant from (select count(*) as cant from psp.EjecucionesTareas ejec ';
  queryVenc += ' inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId ';
  queryVenc += " where ejec.Estado = 'VENC' and  tipo.ServicioEjecutorId = ";
  queryVenc += area.toString();
  queryVenc += " and Fecha >= '";
  queryVenc += inicio;
  queryVenc += "' and Fecha <= '";
  queryVenc += fin;
  queryVenc += "' Union select count(*) from psp.EjecucionesFuturasTareas ejec inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId ";
  queryVenc += " inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId where ejec.Estado = 'VENC' and tipo.ServicioEjecutorId = ";
  queryVenc += area.toString();
  queryVenc += " and FechaInicio >= '";
  queryVenc += inicio;
  queryVenc += "' and FechaInicio <= '";
  queryVenc += fin;
  queryVenc += "') as tabla";
  result = await db.query( queryVenc, { plain: true, type: sequelize.QueryTypes.SELECT});
  return result.cant;
}

async function getCantTareasCanceladas(area, inicio, fin){
  let queryCanc = 'select sum(cant) as cant from (select count(*) as cant from psp.EjecucionesTareas ejec ';
  queryCanc += ' inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId ';
  queryCanc += " where ejec.Estado = 'CANC' and tipo.ServicioEjecutorId = ";
  queryCanc += area.toString();
  queryCanc += " and Fecha >= '";
  queryCanc += inicio;
  queryCanc += "' and Fecha <= '";
  queryCanc += fin;
  queryCanc += "' Union select count(*) from psp.EjecucionesFuturasTareas ejec inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId ";
  queryCanc += " inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId where ejec.Estado = 'CANC' and tipo.ServicioEjecutorId = ";
  queryCanc += area.toString(); 
  queryCanc += " and FechaInicio >= '";
  queryCanc += inicio;
  queryCanc += "' and FechaInicio <= '";
  queryCanc += fin;
  queryCanc += "') as tabla";
  result = await db.query( queryCanc, { plain: true, type: sequelize.QueryTypes.SELECT});
  return result.cant;
}


async function getTareasVencidas(area, inicio, fin){

  let queryVenc = "select * from (select tarea.Descr + ' (Equipo: ' + tarea.Equipo + ')' as Descr, convert(varchar, Fecha, 103) as Venc, Fecha, "; 
  queryVenc += "cast(tarea.Frecuencia as varchar) + case tarea.Periodo when 'W' then ' semana' ";
  queryVenc += "when 'D' then ' día' when 'M' then ' mes' when 'Y' then ' año' end  + ";
  queryVenc += "case tarea.Frecuencia when  1 then '' else case tarea.Periodo when 'M' then 'es' else 's' end end as Freq"
  queryVenc += ' from psp.EjecucionesTareas ejec ';
  queryVenc += ' inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId ';
  queryVenc += " where ejec.Estado = 'VENC' and  tipo.ServicioEjecutorId = ";
  queryVenc += area.toString();
  queryVenc += " and Fecha >= '";
  queryVenc += inicio;
  queryVenc += "' and Fecha <= '";
  queryVenc += fin;

  queryVenc += "' union  select tarea.Descr + ' (Equipo: ' + tarea.Equipo + ')' as Descr, convert(varchar, FechaInicio, 103) as Venc, FechaInicio as Fecha, cast(tarea.Frecuencia as varchar) + ";
  queryVenc += "case tarea.Periodo when 'W' then ' semana' when 'D' then ' día' when 'M' then ' mes' when 'Y' then ' año' end + ";
  queryVenc += "case tarea.Frecuencia when  1 then '' else case tarea.Periodo when 'M' then 'es' else 's' end end as Freq";
  queryVenc += " from psp.EjecucionesFuturasTareas ejec inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId ";
  queryVenc += " inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId where ejec.Estado = 'VENC' and tipo.ServicioEjecutorId = ";
  queryVenc += area.toString();
  queryVenc += " and FechaInicio >= '";
  queryVenc += inicio;
  queryVenc += "' and FechaInicio <= '";
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

    //let fecha = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();

    let fecha = dateFormat(now, 'dd/mm/yyyy')
    let inicio = new Date(req.body.inicio);
    let fin = new Date(req.body.fin);
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
      cantTareas: cantTareas,
      cantEjec: cantEjec,
      cantVenc: cantVenc,
      cantCanc: cantCanc,
      TV: tareasVencidas,
      sinTareas: tareasVencidas.length == 0,
    };

    for (let i = 0; i < req.body.comments.length; i++) {
      data['Comment'+ (i+1)] = req.body.comments[i];
    }
    const handler = new TemplateHandler();
    const doc = await handler.process(templateFile, data);

    res.send(doc);
  }
  catch(e){
    console.log(e);
    res.status(500).send('Error generando reporte.<br>'+ e.message);
  }

}


router.post('/reporte/:areaId', asyncHandler(async (req, res) => {
  if(req.area.Id == 9){
    await reporteGrupoAccion(req, res, '../templates/rep_GA_GIYP.docx');
  }
  else{
    await reporteGrupoAccion(req, res, '../templates/rep_GA_default.docx');
  }

}));


module.exports = router;