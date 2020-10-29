import { Component, OnInit, ViewChild } from '@angular/core';
import { SiteService } from '../../../services/site.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CommentsDialogBoxComponent } from './comments-dialog-box/comments-dialog-box.component';



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
  public dataSource: MatTableDataSource<any>;
  public dataGrouped = [];
  public grupos = [];
  public tipos = [];
  public tareas = [];
  public grouped = false;
  public classGrupo = [];
  public classTipo = [];
  public classTarea = [];
  private sort: MatSort;



  public periodMap = {
    Y: [],
    M: [],
    D: [],
    W: [],
  };
  public displayedColumns: string[] = ['Grupo', 'PPM', 'Descr', 'Equipo', 'Frecuencia', 'UltimaEjecucion', 'ProximaEjecucion', 'Holgura', 'Ejecuciones'];
  public displayedColumns2: string[] = ['Equipo2', 'Descr2', 'Frecuencia2', 'UltimaEjecucion2', 'ProximaEjecucion2', 'Holgura2', 'Ejecuciones2'];

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }
  setDataSourceAttributes() {
    if (this.dataSource){
      this.dataSource.sort = this.sort;
    }
  }


  constructor(private siteService: SiteService, public dialog: MatDialog) {
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
        console.log(res);
        this.blockUI.stop();
        const table = [];
        res.forEach(element => {
          let freq = 0;

          const ue = new Date (element.UltimaEjecucion);
          const timeZoneDifference = (ue.getTimezoneOffset() / 60);
          ue.setTime(ue.getTime() + (timeZoneDifference * 60) * 60 * 1000);
          let prox = new Date(ue);



          if(element.PPM === '854AUS001'){
            console.log('ultima ejec:', element.UltimaEjecucion);
            console.log('next ejec:', prox);
          }

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

          const newElement = {
            Id: element.Id,
            PPM: element.PPM,
            Descr: element.Descr,
            Equipo: element.Equipo,
            EquipoDescr: element.EquipoDescr,
            Frecuencia: `${element.Frecuencia}  ${element.Periodo !== null ? this.periodMap[element.Periodo.trim()][element.Frecuencia > 1 ? 2 : 1] : ''}`,
            UEjec: element.UltimaEjecucion,
            PEjec: prox,
            UltimaEjecucion: element.UltimaEjecucion,
            ProximaEjecucion: prox,
            Holgura: element.Holgura,
            Grupo: element.ServicioEjecutor,
            TipoTarea: element.TipoTarea,
            Freq: freq,
            CantComentarios: element.CantComents
          };


          table.push(newElement);
          const tareaName = newElement.PPM + ' - ' + newElement.Descr;
          if (!this.grupos.includes(newElement.Grupo)){
            this.grupos.push(newElement.Grupo);
            this.tipos[newElement.Grupo] = [];
            this.tareas[newElement.Grupo] = [];
            this.dataGrouped[newElement.Grupo] = [];

            this.classGrupo[newElement.Grupo] = '';
            this.classTipo[newElement.Grupo] = [];
            this.classTarea[newElement.Grupo] = [];
          }
          if (!this.tipos[newElement.Grupo].includes(newElement.TipoTarea)){
            this.tipos[newElement.Grupo].push(newElement.TipoTarea);
            this.tareas[newElement.Grupo][newElement.TipoTarea] = [];
            this.dataGrouped[newElement.Grupo][newElement.TipoTarea] = [];

            this.classTipo[newElement.Grupo][newElement.TipoTarea] = '';
            this.classTarea[newElement.Grupo][newElement.TipoTarea] = [];
          }
          if (!this.tareas[newElement.Grupo][newElement.TipoTarea].includes(tareaName)){
            this.tareas[newElement.Grupo][newElement.TipoTarea].push(tareaName);
            this.dataGrouped[newElement.Grupo][newElement.TipoTarea][tareaName] = [];

            this.classTarea[newElement.Grupo][newElement.TipoTarea][tareaName] = '';
          }
          this.dataGrouped[newElement.Grupo][newElement.TipoTarea][tareaName].push(newElement);
          if (newElement.Holgura <= 7){
            if (this.classGrupo[newElement.Grupo] === ''){
              this.classGrupo[newElement.Grupo] = 'table-warning';
            }
            if (this.classTipo[newElement.Grupo][newElement.TipoTarea] === ''){
              this.classTipo[newElement.Grupo][newElement.TipoTarea] = 'table-warning';
            }
            if (this.classTarea[newElement.Grupo][newElement.TipoTarea][tareaName] === ''){
              this.classTarea[newElement.Grupo][newElement.TipoTarea][tareaName] = 'table-warning';
            }
          }

          if (newElement.Holgura <= 0){
            this.classGrupo[newElement.Grupo] = 'table-danger';
            this.classTipo[newElement.Grupo][newElement.TipoTarea] = 'table-danger';
            this.classTarea[newElement.Grupo][newElement.TipoTarea][tareaName] = 'table-danger';
          }

        });
        this.dataSource = new MatTableDataSource(table);
        this.dataSource.sortingDataAccessor = (data, col) => {
          if (col === 'Frecuencia') {
            return data.Freq;
          } else {
            return data[col];
          }
        };
        this.dataSource.sort = this.sort;
      },
      err => {
        this.blockUI.stop();
      }
    );
  }




  openDialog(Tarea ) {
    const dialogRef = this.dialog.open(CommentsDialogBoxComponent, {
      width: '80%',
      height: '90%',
      data: {
        Id: Tarea.Id,
        Tarea: Tarea.Descr,
        Equipo: Tarea.EquipoDescr,
        Fila: Tarea
      }
    });

  }

}
