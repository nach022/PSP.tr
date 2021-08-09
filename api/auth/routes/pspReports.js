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
      console.log('Agrego Coment');
    }
    console.log('body', req.body.comments);
    console.log('data', data);

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


router.post('/reporte22/:areaId', asyncHandler(async (req, res) => {
    try{
        
        let queryTotal = 'select sum(cant) as cant from (select count(*) as cant from psp.EjecucionesTareas ejec inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId ';
        queryTotal += ' inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId where tipo.ServicioEjecutorId = ';
        queryTotal += req.area.Id.toString();
        queryTotal += ' and year(Fecha) = year(getdate()) Union select count(*) from psp.EjecucionesFuturasTareas ejec '; 
        queryTotal += ' inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId ';
        queryTotal += ' inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId where tipo.ServicioEjecutorId = ';
        queryTotal += req.area.Id.toString();
        queryTotal += ') tabla';
        let result = await db.query( queryTotal, { plain: true, type: sequelize.QueryTypes.SELECT});
        const total = result.cant;
        
        let queryEjec = 'select count(*) as cant from psp.EjecucionesTareas ejec inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId ';
        queryEjec += ' inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId ';
        queryEjec += " where year(Fecha) = year(getdate()) and ejec.Estado = 'FIN' and tipo.ServicioEjecutorId = ";
        queryEjec += req.area.Id.toString();
        result = await db.query( queryEjec, { plain: true, type: sequelize.QueryTypes.SELECT});
        const ejecutadas = result.cant;
        
        let queryVenc = 'select sum(cant) as cant from (select count(*) as cant from psp.EjecucionesTareas ejec ';
        queryVenc += ' inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId ';
        queryVenc += " where year(Fecha) = year(getdate()) and ejec.Estado = 'VENC' and  tipo.ServicioEjecutorId = ";
        queryVenc += req.area.Id.toString();
        queryVenc += " Union select count(*) from psp.EjecucionesFuturasTareas ejec inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId ";
        queryVenc += " inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId where ejec.Estado = 'VENC' and tipo.ServicioEjecutorId = ";
        queryVenc += req.area.Id.toString();
        queryVenc += ') as tabla';
        result = await db.query( queryVenc, { plain: true, type: sequelize.QueryTypes.SELECT});
        const vencidas = result.cant;
         
        let queryCanc = 'select sum(cant) as cant from (select count(*) as cant from psp.EjecucionesTareas ejec ';
        queryCanc += ' inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId ';
        queryCanc += " where year(Fecha) = year(getdate()) and ejec.Estado = 'CANC' and tipo.ServicioEjecutorId = ";
        queryCanc += req.area.Id.toString();
        queryCanc += ' Union select count(*) from psp.EjecucionesFuturasTareas ejec inner join psp.Tareas tarea on ejec.TareaId = tarea.TareaId ';
        queryCanc += " inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId where ejec.Estado = 'CANC' and tipo.ServicioEjecutorId = ";
        queryCanc += req.area.Id.toString();
        queryCanc += ') as tabla';
        result = await db.query( queryCanc, { plain: true, type: sequelize.QueryTypes.SELECT});
        const canceladas = result.cant;

        let querySemana = 'select count(*) as cant from psp.TareasInfo info inner join psp.Tareas tarea on tarea.PPM_CODE = info.PPM_CODE and tarea.Equipo = info.OBJ_CODE ';
        querySemana += ' inner join psp.TiposTareas tipo on tipo.TipoTareaId = tarea.TipoTareaId  where Holgura between 1 and 7 and tipo.ServicioEjecutorId = ';
        querySemana += req.area.Id.toString();
        result = await db.query( querySemana, { plain: true, type: sequelize.QueryTypes.SELECT});
        const semana = result.cant;





        const officegen = require('officegen');
        
        // Create an empty Word object:
        let docx = officegen('docx')


        // Officegen calling this function after finishing to generate the docx document:
        docx.on('finalize', function(written) {
            console.log(
                'Finish to create a Microsoft Word document.'
            )
        })

        // Officegen calling this function to report errors:
        docx.on('error', function(err) {
            console.log(err);
            res.status(500).send(err.err);
        })


        let f = new Date();
        let fecha = f.getDate() + "/" + (f.getMonth() +1) + "/" + f.getFullYear();

        var header = docx.getHeader().createP({ align: 'center' });
        header.addText ('Gerencia de Ingeniería y Planeamiento, Área Civil.', { bold: true });

      
        pObj = docx.createP({ align: 'center' });
        pObj.addText('Plan de Seguridad de Presa', { font_size: 16, bold: true });

        pObj = docx.createP();
        pObj.addText('Grupo de Acción: ', { bold: true });
        pObj.addText(req.area.Nombre);
        pObj.addLineBreak();
        pObj.addText('Fecha del Reporte: ', { bold: true });
        pObj.addText(fecha);
        pObj.addLineBreak();
        pObj.addText('Año en Curso: ', { bold: true });
        pObj.addText(f.getFullYear().toString());
        pObj.addLineBreak();

        pObj = docx.createP();
        pObj.addText('Resumen de Tareas.', { font_size: 12, bold: true });
        pObj = docx.createP();
        pObj.addText('Total de tareas del año en curso: ', { bold: true });
        pObj.addText(total.toString());
        pObj.addLineBreak();
        pObj.addText('Total de tareas ejecutadas a la fecha: ', { bold: true });
        pObj.addText(ejecutadas.toString());
        pObj.addLineBreak();
        pObj.addText('Total de tareas vencidas a la fecha: ', { bold: true });
        pObj.addText(vencidas.toString());
        pObj.addLineBreak();
        pObj.addText('Total de tareas canceladas a la fecha: ', { bold: true });
        pObj.addText(canceladas.toString());
        pObj.addLineBreak();
        pObj.addText('Total de tareas a vencer en los próximos 7 días: ', { bold: true });
        pObj.addText(semana.toString());
        pObj.addLineBreak();

        pObj = docx.createP();
        pObj.addText('Listado de tareas vencidas.', { font_size: 12, bold: true });
        





        var table = [
            [{
              val: "Tarea",
              opts: {
                cellColWidth: 4261,
                b:true,
                vAlign: "center",
                spacingBefore: 120,
                spacingAfter: 120,
                spacingLine: 240,
                spacingLineRule: 'atLeast',
                shd: {
                  fill: "7F7FFF",
                  themeFill: "text1",
                  "themeFillTint": "80"
                },
                fontFamily: "Calibri"
              }
            },{
              val: "Frecuencia.",
              opts: {
                b:true,
                vAlign: "center",
                shd: {
                  fill: "92CDDC",
                  themeFill: "text1",
                  "themeFillTint": "80"
                }
              }
            },
            {
                val: "Vencimiento",
                opts: {
                  vAlign: "center",
                  cellColWidth: 42,
                  b:true,
                  shd: {
                    fill: "92CDDC",
                    themeFill: "text1",
                    "themeFillTint": "80"
                  }
                }
              }],
            ['Medición de juntas	S00005','2 semanas','09/03/2021'],
            ['Medición de Asentímetros de Brazos Cruzados	S00006','6 meses','02/02/2021'],
            ['Medición de jabalinas	S00020','1 mes','04/03/2021'],
            ['Control de Sismoscopios	S00015','1 mes','21/12/2020'],
          ]
          
        var tableStyle = {
            tableAlign: "left",
            tableFontFamily: "Calibri",
            spacingLineRule: 'atLeast', // default is atLeast
            borders: true, // default is false. if true, default border size is 4
            borderSize: 2, // To use this option, the 'borders' must set as true, default is 4
            columns: [{ width: 42 }, { width: 1 }, { width: 42 }], // Table logical columns
        }
        docx.createTable (table, tableStyle);

        if(req.body.commentText && req.body.commentText.length){
            pObj = docx.createP();
            pObj.addLineBreak();
            pObj.addLineBreak();
            pObj.addText('Comentarios Adicionales.', { font_size: 12, bold: true });
            pObj.addLineBreak();
            pObj.addText(req.body.commentText);
        }
        

       /* pObj.addText(' with color', { color: '000088' })
        pObj.addText(' and back color.', { color: '00ffff', back: '000088' })

        pObj = docx.createP()

        pObj.addText('Since ')
        pObj.addText('officegen 0.2.12', {
        back: '00ffff',
        shdType: 'pct12',
        shdColor: 'ff0000'
        }) // Use pattern in the background.
        pObj.addText(' you can do ')
        pObj.addText('more cool ', { highlight: true }) // Highlight!
        pObj.addText('stuff!', { highlight: 'darkGreen' }) // Different highlight color.

        pObj = docx.createP()

        pObj.addText('Even add ')
        pObj.addText('external link', { link: 'https://github.com' })
        pObj.addText('!')

        pObj = docx.createP()

        pObj.addText('Bold + underline', { bold: true, underline: true })

        pObj = docx.createP({ align: 'center' })

        pObj.addText('Center this text', {
        border: 'dotted',
        borderSize: 12,
        borderColor: '88CCFF'
        })

        pObj = docx.createP()
        pObj.options.align = 'right'

        pObj.addText('Align this text to the right.')

        pObj = docx.createP()

        pObj.addText('Those two lines are in the same paragraph,')
        pObj.addLineBreak()
        pObj.addText('but they are separated by a line break.')

        docx.putPageBreak()

        pObj = docx.createP()

        pObj.addText('Fonts face only.', { font_face: 'Calibri' })
        pObj.addText(' Fonts face and size.', { font_face: 'Calibri', font_size: 40 })

        docx.putPageBreak()

        pObj = docx.createP()

        // We can even add images:
        //pObj.addImage('some-image.png')*/

        // Let's generate the Word document into a file:

        res.writeHead (200, {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'Content-disposition': 'attachment; filename=rep.docx'
          })

        // Async call to generate the output file:
        docx.generate(res);
    }
    catch(e){
        console.log(e);
        res.status(500).send('Error generando reporte.<br>'+ e.message);
    }
    
}));

module.exports = router;