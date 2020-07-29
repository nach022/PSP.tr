import { Component, OnInit, ViewChild } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';



export interface TareaOverview {
  PPM: string;
  Descr: string;
  Equipo: string;
  EquipoDescr: string;
  Frecuencia?: number;
  Periodo?: string;
  TipoTarea: string;
  ServicioEjecutor: string;
  UltimaEjecucion: Date;
}

export interface Dessert {
  calories: number;
  carbs: number;
  fat: number;
  name: string;
  protein: number;
}





@Component({
  selector: 'app-tasks-overview',
  templateUrl: './tasks-overview.component.html',
  styleUrls: ['./tasks-overview.component.css']
})
export class TasksOverviewComponent implements OnInit {
  public dataSource: MatTableDataSource<any> = new MatTableDataSource();
  public periodMap = {
    Y: [],
    M: [],
    D: [],
    W: [],
  };
  public displayedColumns: string[] = ['PPM', 'Descr', 'Equipo', 'Frecuencia', 'UltimaEjecucion', 'ProximaEjecucion', 'Holgura'];

  @ViewChild(MatSort) sort: MatSort;


  constructor(private siteService: SiteService) {
  }
  @BlockUI() blockUI: NgBlockUI;

  ngOnInit(): void {
    this.periodMap.Y[1] = 'año';
    this.periodMap.Y[2] = 'años';
    this.periodMap.M[1] = 'mes';
    this.periodMap.M[2] = 'meses';
    this.periodMap.D[1] = 'día';
    this.periodMap.D[2] = 'días';
    this.periodMap.W[1] = 'semana';
    this.periodMap.W[2] = 'semanas';

    this.blockUI.start('Cargando Datos de Tareas...');
    this.siteService.getTareasOverview().subscribe(
      res => {
        this.blockUI.stop();
        const table = [];
        res.forEach(element => {
          let freq = 0;
          let prox = new Date(element.UltimaEjecucion);
          if (element.Periodo === 'M'){
            freq = element.Frecuencia * 30;
            prox.setMonth(prox.getMonth() + element.Frecuencia);
          }
          else if (element.Periodo === 'D'){
            freq = element.Frecuencia;
            prox.setDate(prox.getDate() + element.Frecuencia);
          }
          else if (element.Periodo === 'Y'){
            freq = element.Frecuencia * 365;
            prox.setFullYear(prox.getFullYear() + element.Frecuencia);
          }
          else if (element.Periodo === 'W'){
            freq = element.Frecuencia * 7;
            prox.setDate(prox.getDate() + 7 * element.Frecuencia);
          }
          else{
            prox = new Date();
          }
          const ue = new Date (element.UltimaEjecucion);

          table.push({
            PPM: element.PPM,
            Descr: element.Descr,
            Equipo: element.Equipo,
            EquipoDescr: element.EquipoDescr,
            Frecuencia: `${element.Frecuencia}  ${element.Periodo !== null ? this.periodMap[element.Periodo.trim()][element.Frecuencia > 1 ? 2 : 1] : ''}`,
            UEjec: element.UltimaEjecucion,
            PEjec: prox,
            UltimaEjecucion: `${ue.getDate()}/${ue.getMonth() + 1}/${ue.getFullYear()}`,
            ProximaEjecucion: `${prox.getDate()}/${prox.getMonth() + 1}/${prox.getFullYear()}`,
            Holgura: Math.ceil((prox.getTime() - (new Date()).getTime()) / (1000 * 60 * 60 * 24)),
            ServicioEjecutor: element.ServicioEjecutor,
            TipoTarea: element.TipoTarea,
            Freq: freq
          });

        });
        this.dataSource = new MatTableDataSource(table);
        this.dataSource.sort = this.sort;
        console.log(this.dataSource);
      },
      err => {
        this.blockUI.stop();
      }
    );
  }

}
