import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SiteService } from 'src/app/services/site.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { TasksDialogBoxComponent } from './tasks-dialog-box/tasks-dialog-box.component';
import { MatTable } from '@angular/material/table';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';



export interface tareaDataInterface {
  Id: number,
  PPM: string,
  Descr: string,
  TipoTareaId: number,
  Frecuencia?: number,
  Periodo?: string,
  Equipo: string,
  EquipoDescr: string
}






@Component({
  selector: 'app-tasks-setting',
  templateUrl: './tasks-setting.component.html',
  styleUrls: ['./tasks-setting.component.css']
})
export class TasksSettingComponent implements OnInit{
  displayedColumns: string[] = ['PPM', 'Descr', 'Equipo', 'Frecuencia', 'TipoTarea', 'action'];
  displayedColumns2: string[] = ['PPM', 'Descr', 'Equipo', 'Frecuencia', 'action'];
  periodMap = [];


  @ViewChildren(MatTable) _tables: QueryList<MatTable<any>>;

  constructor(private _siteService: SiteService, private _notif: NotificationService, public dialog: MatDialog) { }
  @BlockUI() _blockUI: NgBlockUI;
  public isDataLoaded: boolean = false;
  public servicios = [];
  public tipos = new Map();
  public tareas = [];
  public selectedValue = [];
  public tablesIndexes = [];

  ngOnInit(): void {
    this.periodMap['Y'] = [];
    this.periodMap['Y'][1] = "año";
    this.periodMap['Y'][2] = "años";
    this.periodMap['M'] = [];
    this.periodMap['M'][1] = "mes";
    this.periodMap['M'][2] = "meses";
    this.periodMap['D'] = [];
    this.periodMap['D'][1] = "día";
    this.periodMap['D'][2] = "días";
    this.periodMap['W'] = [];
    this.periodMap['W'][1] = "semana";
    this.periodMap['W'][2] = "semanas";

    this._blockUI.start('Cargando Grupos de Acción...');
    this._siteService.getServiciosEjecutores().subscribe(
      servs => {
        this._blockUI.stop();
        this.servicios = servs;
        this.servicios.forEach(serv => {
          this.tipos[serv.Id] = [];
        });
        this._blockUI.start('Cargando Tipos de Tareas...');
        this._siteService.getTiposTareas().subscribe(
          tipos => {
            this._blockUI.stop();
            this.tareas[0] = [];
            tipos.forEach(tipo => {
              this.tipos[tipo.ServicioEjecutorId].push({ Id: tipo.Id, Nombre: tipo.Nombre.trim(), Responsable: tipo.ServicioEjecutorId});
              this.tareas[tipo.Id] = [];
            });
            console.log(this.tareas);
            this._blockUI.start('Cargando Tareas...');
            this._siteService.getTareas().subscribe(
              tareas => {
                console.log('tareas: ',tareas)
                tareas.forEach(tarea => {
                  if(tarea.TipoTareaId === null){
                    this.tareas[0].push({ Id: tarea.Id, PPM: tarea.PPM.trim(), Descr: tarea.Descr.trim(), TipoTareaId: tarea.TipoTareaId,
                      Frecuencia: tarea.Frecuencia, Periodo: tarea.Periodo !== null ?  tarea.Periodo.trim() : null, Equipo: tarea.Equipo.trim(), EquipoDescr: tarea.EquipoDescr.trim(),
                      PeriodoMap: tarea.Periodo !== null ? this.periodMap[tarea.Periodo.trim()][tarea.Frecuencia > 1 ? 2 : 1] : ""});

                      if(!this.selectedValue[tarea.PPM.trim()]){
                        this.selectedValue[tarea.PPM.trim()] = [];
                      }
                      this.selectedValue[tarea.PPM.trim()][tarea.Equipo.trim()] = "";
                  }
                  else{
                    console.log(tarea.Periodo);
                    console.log(this.periodMap);
                    this.tareas[tarea.TipoTareaId].push({ Id: tarea.Id, PPM: tarea.PPM.trim(), Descr: tarea.Descr.trim(), TipoTareaId: tarea.TipoTareaId,
                      Frecuencia: tarea.Frecuencia, Equipo: tarea.Equipo.trim(), EquipoDescr: tarea.EquipoDescr.trim(), Periodo: tarea.Periodo !== null ?  tarea.Periodo.trim() : null,
                      PeriodoMap: tarea.Periodo !== null ? this.periodMap[tarea.Periodo.trim()][tarea.Frecuencia > 1 ? 2 : 1] : ""});
                  }

                });


                this.isDataLoaded = true;
                this._blockUI.stop();
              },
              error =>{
                console.log(error);
                this._blockUI.stop();
              }
            )
          },
          err => {
            console.log(err);
            this._blockUI.stop();
          }
        )
      },
      err => {
        console.log(err);
        this._blockUI.stop();
      }
    )
  }


  setTableArray(idTipo, index){
    this.tablesIndexes[idTipo] = index+1;
  }


  assignTipo(ppm){
    this._notif.clear();
    this._blockUI.start('Creando Tarea...');
    console.log('asignando: ', ppm);
    let tareaData ={
      PPM: ppm.PPM.trim(),
      Equipo: ppm.Equipo.trim(),
      Descr: ppm.Descr.trim(),
      Frecuencia: ppm.Frecuencia,
      Periodo: ppm.Periodo !== null ?  ppm.Periodo.trim() : null,
      TipoTareaId: this.selectedValue[ppm.PPM.trim()][ppm.Equipo.trim()]
    };
    this._siteService.postTarea(tareaData).subscribe(
      res=>{
        console.log('res: ', res);
        let nuevaTarea = {
          Id: res.Id,
          PPM: res.PPM.trim(),
          Descr: res.Descr.trim(),
          Equipo: res.Equipo.trim(),
          EquipoDescr: ppm.EquipoDescr.trim(),
          TipoTareaId: res.TipoTareaId,
          Frecuencia: res.Frecuencia,
          Periodo: res.Periodo !== null ?  res.Periodo.trim() : null,
          PeriodoMap: res.Periodo !== null ? this.periodMap[res.Periodo.trim()][res.Frecuencia > 1 ? 2 : 1] : ""
        }
        this.tareas[tareaData.TipoTareaId].push(nuevaTarea);
        this.tareas[0] = this.tareas[0].filter((value,key)=>{
          return value.PPM != nuevaTarea.PPM || value.Equipo != nuevaTarea.Equipo;
        });
        this._tables.toArray().forEach(element => {
          element.renderRows();
        });
        console.log('index:', this.tablesIndexes[tareaData.TipoTareaId]);

        this._blockUI.stop();
        this._notif.info('La Tarea se creó correctamente.');

      },
      error =>{
        this._blockUI.stop();
        console.log(error);
      }
    );
  }

  openDialog(action ,obj) {
    obj.action = action;
    obj.groups = this.servicios;
    obj.tipos = this.tipos;
    const dialogRef = this.dialog.open(TasksDialogBoxComponent, {
      width: '600px',
      data:obj
    });

    dialogRef.afterClosed().subscribe(result => {
      this._notif.clear();
      if(result){
        console.log(result.event, result.data);
        if(result.event == 'Update'){
          this.updateRowData(result.data);
        }else if(result.event == 'Delete'){
          this.deleteRowData(result.data);
        }

      }

    });
  }



  updateRowData(tareaData){
    this._blockUI.start('Modificando Tarea...');
    this._siteService.putTarea(tareaData).subscribe(
      res=>{
        console.log(res);
        // Me fijo si en la lista de tareas de ese tipo, ya está esta tarea (no cambió el TipoTarea, sólo frecuencia o período)
        let aux = this.tareas[tareaData.TipoTareaId].filter((value,key)=>{
          return value.PPM == tareaData.PPM && value.Equipo == tareaData.Equipo;
        });
        // si no existía esta tarea en este tipo, debo crearla y borrarla de la lista de tareas del tipo anterior
        if(aux.length == 0){

          let nuevaTarea = {
            Id: res.Id,
            PPM: res.PPM.trim(),
            Descr: res.Descr.trim(),
            Equipo: res.Equipo.trim(),
            EquipoDescr: tareaData.EquipoDescr.trim(),
            TipoTareaId: res.TipoTareaId,
            Frecuencia: res.Frecuencia,
            Periodo: res.Periodo !== null ?  res.Periodo.trim() : null,
            PeriodoMap: res.Periodo !== null ? this.periodMap[res.Periodo.trim()][res.Frecuencia > 1 ? 2 : 1] : ""
          }
          this.tareas.forEach((value: [any], key: number) => {
            this.tareas[key] = this.tareas[key].filter((value,key2)=>{
              return value.PPM != tareaData.PPM || value.Equipo != tareaData.Equipo;
            });
          });

          this.tareas[tareaData.TipoTareaId].push(nuevaTarea);

        }
        // Si ya existía, le cambio los valores
        else{
          aux[0].Descr = res.Descr.trim();
          aux[0].Frecuencia = res.Frecuencia;
          aux[0].Periodo = res.Periodo !== null ?  res.Periodo.trim() : null;
          aux[0].PeriodoMap = res.Periodo !== null ? this.periodMap[res.Periodo.trim()][res.Frecuencia > 1 ? 2 : 1] : "";


        }
        this._tables.toArray().forEach(element => {
          element.renderRows();
        });


        this._blockUI.stop();
        this._notif.info('La Tarea se modificó correctamente.');

      },
      error =>{
        this._blockUI.stop();
        console.log(error);
      }
    );
  }


  deleteRowData(tareaData) {
    this._blockUI.start('Eliminando Tarea...');
    this._siteService.deleteTarea(tareaData).subscribe(
      res => {
        this.tareas[tareaData.TipoTareaId] = this.tareas[tareaData.TipoTareaId].filter((value,key)=>{
          return value.PPM != tareaData.PPM || value.Equipo != tareaData.Equipo;
        });

        this.selectedValue[tareaData.PPM.trim()][tareaData.Equipo.trim()] = "";
        this.tareas[0].push(
          { Id: 0,
            PPM: tareaData.PPM.trim(),
            Descr: tareaData.Descr.trim(),
            TipoTareaId: null,
            Frecuencia: tareaData.Frecuencia,
            Periodo: tareaData.Periodo,
            Equipo: tareaData.Equipo.trim(),
            EquipoDescr: tareaData.EquipoDescr.trim(),
            PeriodoMap: tareaData.PeriodoMap
          });
        this._tables.toArray()[0].renderRows();
        this._blockUI.stop();
        this._notif.info(`La Tarea ${tareaData.Descr} del equipo ${tareaData.EquipoDescr} se eliminó correctamente.`);
      },
      error =>{
        this._blockUI.stop();
        console.log(error);
      }
    );
  }



}
