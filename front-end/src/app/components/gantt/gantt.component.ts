import { Component, OnInit } from '@angular/core';
import {formatDate} from '@angular/common';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { SiteService } from 'src/app/services/site.service';

@Component({
  selector: 'app-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.css']
})










export class GanttComponent implements OnInit {
  dataSource: Object;
  isDataLoaded : boolean;
  @BlockUI() _blockUI: NgBlockUI;


  constructor(private _siteService: SiteService) {
    let  mes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    let hoy = new Date();
    let hoy2 = new Date(hoy.getFullYear()+1, hoy.getMonth(), hoy.getDate());

    let inicioChart = formatDate(hoy, 'dd/MM/yyyy', 'en');
    let findeAnio = formatDate(new Date(hoy.getFullYear(), 11, 31), 'dd/MM/yyyy', 'en');
    let inicioAnio = formatDate(new Date(hoy2.getFullYear(), 0, 1), 'dd/MM/yyyy', 'en');
    let finChart = formatDate(hoy2, 'dd/MM/yyyy', 'en');

    let categoryMeses = [];
    let aux = new Date(hoy);

    while(aux <= hoy2){
      let aux2 = new Date(aux.getFullYear(), aux.getMonth()+1, 0);
      if(aux2 > hoy2){
        aux2 = hoy2;
      }
      categoryMeses.push({
        start: formatDate(aux, 'dd/MM/yyyy', 'en'),
        end: formatDate(aux2, 'dd/MM/yyyy', 'en'),
        label: mes[aux.getMonth()]
      });
      aux = new Date(aux.getFullYear(), aux.getMonth()+1, 1);
    }


    let tasks = [];
    let equipos = [];
    let processes = [];

    this._blockUI.start('Cargando Datos de Tareas...');
    this._siteService.getTareasOverview().subscribe(
      res => {
        this._blockUI.stop();
        let indx = 1;
        res.forEach(element => {
          let prox = new Date(element.UltimaEjecucion);
          if(element.Periodo == "M"){
            prox.setMonth(prox.getMonth() + element.Frecuencia);
          }
          else if(element.Periodo == "D"){
            prox.setDate(prox.getDate() + element.Frecuencia);
          }
          else if(element.Periodo == "Y"){
            prox.setFullYear(prox.getFullYear() + element.Frecuencia);
          }
          else if(element.Periodo == "W"){
            prox.setDate(prox.getDate() + 7*element.Frecuencia);
          }
          else{
            prox = new Date(hoy);
          }

          let vencido = false;

          if(prox <= hoy){
            prox = new Date(hoy);
            vencido = true;

          }

          if(prox < hoy2){

            processes.push({
              label: element.PPM,
              id: `${indx}`
            });
            equipos.push({
              label: element.Equipo
            });
            while(prox < hoy2){
              let colorBarra = "#66bbef";
              if(vencido){
                vencido = false;
                colorBarra = "#ef9266";
              }
              let finTarea = new Date(prox.getFullYear(), prox.getMonth(), prox.getDate() + element.Duracion);
              if(finTarea > hoy2){
                finTarea = new Date(hoy2);
              }
              tasks.push({
                label: `${element.Descr}<br>Equipo: ${element.EquipoDescr}`,
                processid: indx,
                start: formatDate(prox, 'dd/MM/yyyy', 'en'),
                end: formatDate(finTarea, 'dd/MM/yyyy', 'en'),
                color: colorBarra,
                id: `${indx}-${indx}`
              });

              if(element.Periodo == "M"){
                prox.setMonth(prox.getMonth() + element.Frecuencia);
              }
              else if(element.Periodo == "D"){
                prox.setDate(prox.getDate() + element.Frecuencia);
              }
              else if(element.Periodo == "Y"){
                prox.setFullYear(prox.getFullYear() + element.Frecuencia);
              }
              else if(element.Periodo == "W"){
                prox.setDate(prox.getDate() + 7*element.Frecuencia);
              }
              else{
                prox = new Date(hoy2);
              }

            }

          }
          indx ++;
        });

        console.log('equipos: ', equipos);
        console.log('processes: ', processes);
        console.log('tasks: ', tasks);

        this.dataSource = {
          chart: {
            theme: "fusion",
            caption: "Tareas a ejecutar en el Año Móvil",
            //subcaption: `${inicioChart} - ${EindeAnio} - ${inicioAnio} - ${finChart}`,
            dateformat: "dd/mm/yyyy",
            outputdateformat: "dd/mm/yyyy",
            ganttwidthpercent: "60",
            ganttPaneDuration: "30",
            ganttPaneDurationUnit: "d",
            plottooltext:
              "$label{br}Fecha de inicio: $start{br}Fecha de fin: $end",
            legendBorderAlpha: "0",
            legendShadow: "0",
            usePlotGradientColor: "0",
            showCanvasBorder: "0",
            flatScrollBars: "1",
            gridbordercolor: "#333333",
            gridborderalpha: "20",
            slackFillColor: "#e44a00",
            taskBarFillMix: "light+0"
          },
          categories: [
            {
              bgcolor: "#999999",
              align: "middle",
              fontcolor: "#ffffff",
              fontsize: "12",
              category: [
                {
                  start: inicioChart,
                  end: findeAnio,
                  label:`${hoy.getFullYear()}`
                },
                {
                  start: inicioAnio,
                  end: finChart,
                  label:`${hoy.getFullYear()+1}`

                }

              ]
            },
            {
              bgcolor: "#999999",
              align: "middle",
              fontcolor: "#ffffff",
              fontsize: "12",
              category: categoryMeses
            }
          ],
          processes: {
            headertext: "Tarea",
            fontcolor: "#000000",
            fontsize: "11",
            isanimated: "1",
            bgcolor: "#6baa01",
            headervalign: "bottom",
            headeralign: "left",
            headerbgcolor: "#999999",
            headerfontcolor: "#ffffff",
            headerfontsize: "12",
            align: "left",
            isbold: "1",
            bgalpha: "25",
            hoverBandColor: "#e44a00",
            hoverBandAlpha: "40",
            process: processes/*[
              {
                label: "Clear site",
                id: "1"
              },
              {
                label: "Excavate Foundation",
                id: "2",

              },
              {
                label: "Concrete Foundation",
                id: "3",
                hoverBandColor: "#e44a00",
                hoverBandAlpha: "40"
              }
            ]*/
          },
          datatable: {
            showprocessname: "1",
            namealign: "left",
            fontcolor: "#000000",
            fontsize: "10",
            valign: "right",
            align: "center",
            headervalign: "bottom",
            headeralign: "center",
            headerbgcolor: "#999999",
            headerfontcolor: "#ffffff",
            headerfontsize: "12",
            datacolumn: [
              {
                bgcolor: "#eeeeee",
                headertext: "Equipo",
                text: equipos/*[
                  {
                    label: "9/4/2021"
                  },
                  {
                    label: "13/4/2021"
                  },
                  {
                    label: "26/4/2021",
                    bgcolor: "#e44a00",
                    bgAlpha: "40"
                  },
                  {
                    label: "4/5/2021",
                    bgcolor: "#e44a00",
                    bgAlpha: "40"
                  },
                  {
                    label: "6/5/2021"
                  },
                  {
                    label: "5/5/2021",
                    bgcolor: "#e44a00",
                    bgAlpha: "40"
                  },
                  {
                    label: "11/5/2021"
                  },
                  {
                    label: "16/5/2021"
                  },
                  {
                    label: "16/5/2021"
                  },
                  {
                    label: "21/5/2021",
                    bgcolor: "#e44a00",
                    bgAlpha: "40"
                  },
                  {
                    label: "25/5/2021"
                  },
                  {
                    label: "28/5/2021"
                  },
                  {
                    label: "4/6/2021"
                  },
                  {
                    label: "4/6/2021"
                  },
                  {
                    label: "4/6/2021"
                  },
                  {
                    label: "2/6/2021"
                  },
                  {
                    label: "5/6/2021"
                  },
                  {
                    label: "18/6/2021",
                    bgcolor: "#e44a00",
                    bgAlpha: "40"
                  },
                  {
                    label: "16/6/2021",
                    bgcolor: "#e44a00",
                    bgAlpha: "40"
                  },
                  {
                    label: "23/6/2021"
                  },
                  {
                    label: "18/6/2021"
                  },
                  {
                    label: "25/6/2021"
                  }
                ]*/
              },
              /*{
                bgcolor: "#eeeeee",
                headertext: "Equipo",
                text: [
                  {
                    label: "12/4/2021"
                  },
                  {
                    label: "25/4/2021",
                    bgcolor: "#e44a00",
                    bgAlpha: "40"
                  },
                  {
                    label: "4/5/2021",
                    bgcolor: "#e44a00",
                    bgAlpha: "40"
                  },
                  {
                    label: "10/5/2021"
                  },
                  {
                    label: "10/5/2021"
                  },
                  {
                    label: "11/5/2021",
                    bgcolor: "#e44a00",
                    bgAlpha: "40"
                  },
                  {
                    label: "14/5/2021"
                  },
                  {
                    label: "19/5/2021"
                  },
                  {
                    label: "21/5/2021",
                    bgcolor: "#e44a00",
                    bgAlpha: "40"
                  },
                  {
                    label: "24/5/2021",
                    bgcolor: "#e44a00",
                    bgAlpha: "40"
                  },
                  {
                    label: "27/5/2021"
                  },
                  {
                    label: "1/6/2021"
                  },
                  {
                    label: "6/6/2021"
                  },
                  {
                    label: "4/6/2021"
                  },
                  {
                    label: "4/6/2021"
                  },
                  {
                    label: "7/6/2021"
                  },
                  {
                    label: "17/6/2021",
                    bgcolor: "#e44a00",
                    bgAlpha: "40"
                  },
                  {
                    label: "20/6/2021",
                    bgcolor: "#e44a00",
                    bgAlpha: "40"
                  },
                  {
                    label: "23/6/2021"
                  },
                  {
                    label: "23/6/2021"
                  },
                  {
                    label: "23/6/2021",
                    bgcolor: "#e44a00",
                    bgAlpha: "40"
                  },
                  {
                    label: "28/6/2021"
                  }
                ]
              }*/
            ]
          },
          tasks: {
            task: tasks/*[
              {
                label: "Planned",
                processid: "1",
                start: "9/4/2021",
                end: "12/4/2021",
                id: "1-1",
                color: "#008ee4",
              },
              {
                label: "Planned",
                processid: "1",
                start: "15/4/2021",
                end: "20/4/2021",
                id: "1-1",
                color: "#008ee4",
              },
              {
                label: "Planned",
                processid: "2",
                start: "13/4/2021",
                end: "23/4/2021",
                id: "2-1",
                color: "#008ee4",
                height: "32%",
                toppadding: "12%"
              },
              {
                label: "Actual",
                processid: "2",
                start: "13/4/2021",
                end: "25/4/2021",
                id: "2",
                color: "#6baa01",
                toppadding: "56%",
                height: "32%"
              },
              {
                label: "Delay",
                processid: "2",
                start: "23/4/2021",
                end: "25/4/2021",
                id: "2-2",
                color: "#e44a00",
                toppadding: "56%",
                height: "32%",
                tooltext: "Delayed by 2 days."
              },
              {
                label: "Planned",
                processid: "3",
                start: "23/4/2021",
                end: "30/4/2021",
                id: "3-1",
                color: "#008ee4",
                height: "32%",
                toppadding: "12%"
              },
              {
                label: "Actual",
                processid: "3",
                start: "26/4/2021",
                end: "4/5/2021",
                id: "3",
                color: "#6baa01",
                toppadding: "56%",
                height: "32%"
              },
              {
                label: "Delay",
                processid: "3",
                start: "3/5/2021",
                end: "4/5/2021",
                id: "3-2",
                color: "#e44a00",
                toppadding: "56%",
                height: "32%",
                tooltext: "Delayed by 1 days."
              }

            ]*/
          },


          legend: {
            item: [
              {
                label: "Vencidas",
                color: "#e44a00"
              }
            ]
          },
          trendlines: [
            {
              line: [
                {
                  start: findeAnio,
                  color: "333333",
                  thickness: "2",
                  dashed: "1"
                }
              ]
            }
          ]
        };
        this.isDataLoaded = true;
      },
      err => {
        this._blockUI.stop();
      });
    }


  ngOnInit(): void {
  }

}
