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
  dataSource: any;
  isDataLoaded: boolean;
  @BlockUI() blockUI: NgBlockUI;


  constructor(private siteService: SiteService) {
    const  mes = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
              'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const hoy = new Date();
    const hoy2 = new Date(hoy.getFullYear() + 1, hoy.getMonth(), hoy.getDate());

    const inicioChart = formatDate(hoy, 'dd/MM/yyyy', 'en');
    const findeAnio = formatDate(new Date(hoy.getFullYear(), 11, 31), 'dd/MM/yyyy', 'en');
    const inicioAnio = formatDate(new Date(hoy2.getFullYear(), 0, 1), 'dd/MM/yyyy', 'en');
    const finChart = formatDate(hoy2, 'dd/MM/yyyy', 'en');

    const categoryMeses = [];
    let aux = new Date(hoy);

    while (aux <= hoy2){
      let aux2 = new Date(aux.getFullYear(), aux.getMonth() + 1, 0);
      if (aux2 > hoy2){
        aux2 = hoy2;
      }
      categoryMeses.push({
        start: formatDate(aux, 'dd/MM/yyyy', 'en'),
        end: formatDate(aux2, 'dd/MM/yyyy', 'en'),
        label: mes[aux.getMonth()]
      });
      aux = new Date(aux.getFullYear(), aux.getMonth() + 1, 1);
    }


    const tasks = [];
    const equipos = [];
    const processes = [];

    this.blockUI.start('Cargando Datos de Tareas...');
    this.siteService.getTareasOverview().subscribe(
      res => {
        this.blockUI.stop();
        let indx = 1;
        res.forEach(element => {
          let prox = new Date(element.UltimaEjecucion);
          if (element.Periodo === 'M'){
            prox.setMonth(prox.getMonth() + element.Frecuencia);
          }
          else if (element.Periodo === 'D'){
            prox.setDate(prox.getDate() + element.Frecuencia);
          }
          else if (element.Periodo === 'Y'){
            prox.setFullYear(prox.getFullYear() + element.Frecuencia);
          }
          else if (element.Periodo === 'W'){
            prox.setDate(prox.getDate() + 7 * element.Frecuencia);
          }
          else{
            prox = new Date(hoy);
          }

          let vencido = false;

          if (prox <= hoy){
            prox = new Date(hoy);
            vencido = true;

          }

          if (prox < hoy2){

            processes.push({
              label: element.PPM,
              id: `${indx}`
            });
            equipos.push({
              label: element.Equipo
            });
            while (prox < hoy2){
              let colorBarra = '#66bbef';
              if (vencido){
                vencido = false;
                colorBarra = '#ef9266';
              }
              let finTarea = new Date(prox.getFullYear(), prox.getMonth(), prox.getDate() + element.Duracion);
              if (finTarea > hoy2){
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

              if (element.Periodo === 'M'){
                prox.setMonth(prox.getMonth() + element.Frecuencia);
              }
              else if (element.Periodo === 'D'){
                prox.setDate(prox.getDate() + element.Frecuencia);
              }
              else if (element.Periodo === 'Y'){
                prox.setFullYear(prox.getFullYear() + element.Frecuencia);
              }
              else if (element.Periodo === 'W'){
                prox.setDate(prox.getDate() + 7 * element.Frecuencia);
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
            theme: 'fusion',
            caption: 'Tareas a ejecutar en el Año Móvil',
            // subcaption: `${inicioChart} - ${EindeAnio} - ${inicioAnio} - ${finChart}`,
            dateformat: 'dd/mm/yyyy',
            outputdateformat: 'dd/mm/yyyy',
            ganttwidthpercent: '60',
            ganttPaneDuration: '30',
            ganttPaneDurationUnit: 'd',
            plottooltext:
              '$label{br}Fecha de inicio: $start{br}Fecha de fin: $end',
            legendBorderAlpha: '0',
            legendShadow: '0',
            usePlotGradientColor: '0',
            showCanvasBorder: '0',
            flatScrollBars: '1',
            gridbordercolor: '#333333',
            gridborderalpha: '20',
            slackFillColor: '#e44a00',
            taskBarFillMix: 'light+0'
          },
          categories: [
            {
              bgcolor: '#999999',
              align: 'middle',
              fontcolor: '#ffffff',
              fontsize: '12',
              category: [
                {
                  start: inicioChart,
                  end: findeAnio,
                  label: `${hoy.getFullYear()}`
                },
                {
                  start: inicioAnio,
                  end: finChart,
                  label: `${hoy.getFullYear() + 1}`

                }

              ]
            },
            {
              bgcolor: '#999999',
              align: 'middle',
              fontcolor: '#ffffff',
              fontsize: '12',
              category: categoryMeses
            }
          ],
          processes: {
            headertext: 'Tarea',
            fontcolor: '#000000',
            fontsize: '11',
            isanimated: '1',
            bgcolor: '#6baa01',
            headervalign: 'bottom',
            headeralign: 'left',
            headerbgcolor: '#999999',
            headerfontcolor: '#ffffff',
            headerfontsize: '12',
            align: 'left',
            isbold: '1',
            bgalpha: '25',
            hoverBandColor: '#e44a00',
            hoverBandAlpha: '40',
            process: processes
          },
          datatable: {
            showprocessname: '1',
            namealign: 'left',
            fontcolor: '#000000',
            fontsize: '10',
            valign: 'right',
            align: 'center',
            headervalign: 'bottom',
            headeralign: 'center',
            headerbgcolor: '#999999',
            headerfontcolor: '#ffffff',
            headerfontsize: '12',
            datacolumn: [
              {
                bgcolor: '#eeeeee',
                headertext: 'Equipo',
                text: equipos
              },
            ]
          },
          tasks: {
            task: tasks
          },
          legend: {
            item: [
              {
                label: 'Vencidas',
                color: '#e44a00'
              }
            ]
          },
          trendlines: [
            {
              line: [
                {
                  start: findeAnio,
                  color: '333333',
                  thickness: '2',
                  dashed: '1'
                }
              ]
            }
          ]
        };
        this.isDataLoaded = true;
      },
      err => {
        console.log(err);
        this.blockUI.stop();
      });
    }


  ngOnInit(): void {
  }

}
