import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SiteService } from 'src/app/services/site.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { TasksDialogBoxComponent } from './tasks-dialog-box/tasks-dialog-box.component';
import { MatTable } from '@angular/material/table';



export interface TareaDataInterface {
  Id: number;
  PPM: string;
  Descr: string;
  TipoTareaId: number;
  Frecuencia?: number;
  Periodo?: string;
  Equipo: string;
  EquipoDescr: string;
}






@Component({
  selector: 'app-tasks-setting',
  templateUrl: './tasks-setting.component.html',
  styleUrls: ['./tasks-setting.component.css']
})
export class TasksSettingComponent implements OnInit{
  displayedColumns: string[] = ['PPM', 'Descr', 'Equipo', 'Frecuencia', 'TipoTarea', 'action'];
  displayedColumns2: string[] = ['PPM', 'Descr', 'Equipo', 'Frecuencia', 'action'];
  public periodMap = {
    Y: [],
    M: [],
    D: [],
    W: [],
  };



  @ViewChildren(MatTable) tables: QueryList<MatTable<any>>;

  constructor(private siteService: SiteService, private notif: NotificationService, public dialog: MatDialog) { }
  @BlockUI() blockUI: NgBlockUI;
  public isDataLoaded = false;
  public servicios = [];
  public tipos = new Map();
  public tareas = [];
  public selectedValue = [];
  public tablesIndexes = [];
  public cantTareas = new Map();
  public servicioTipo = new Map();

  ngOnInit(): void {
    this.periodMap.Y = [];
    this.periodMap.Y[1] = 'año';
    this.periodMap.Y[2] = 'años';
    this.periodMap.M = [];
    this.periodMap.M[1] = 'mes';
    this.periodMap.M[2] = 'meses';
    this.periodMap.D = [];
    this.periodMap.D[1] = 'día';
    this.periodMap.D[2] = 'días';
    this.periodMap.W = [];
    this.periodMap.W[1] = 'semana';
    this.periodMap.W[2] = 'semanas';

    this.blockUI.start('Cargando Grupos de Acción...');
    this.siteService.getServiciosEjecutores().subscribe(
      servs => {
        this.blockUI.stop();
        this.servicios = servs;
        this.servicios.forEach(serv => {
          this.tipos[serv.Id] = [];
          this.cantTareas[serv.Id] = 0;
        });
        this.blockUI.start('Cargando Tipos de Tareas...');
        this.siteService.getTiposTareas().subscribe(
          tipos => {
            this.blockUI.stop();
            this.tareas[0] = [];
            tipos.forEach(tipo => {
              this.tipos[tipo.ServicioEjecutorId].push({ Id: tipo.Id, Nombre: tipo.Nombre.trim(), Responsable: tipo.ServicioEjecutorId});
              this.tareas[tipo.Id] = [];
              this.servicioTipo[tipo.Id] = tipo.ServicioEjecutorId;
            });

            this.blockUI.start('Cargando Tareas...');
            this.siteService.getTareas().subscribe(
              tareas => {
                tareas.forEach(tarea => {
                  if (tarea.TipoTareaId === null){
                    this.tareas[0].push({
                      Id: tarea.Id,
                      PPM: tarea.PPM.trim(),
                      Descr: tarea.Descr.trim(),
                      TipoTareaId: tarea.TipoTareaId,
                      Frecuencia: tarea.Frecuencia,
                      Periodo: tarea.Periodo !== null ?  tarea.Periodo.trim() : null,
                      Equipo: tarea.Equipo.trim(),
                      EquipoDescr: tarea.EquipoDescr.trim(),
                      PeriodoMap: tarea.Periodo !== null ? this.periodMap[tarea.Periodo.trim()][tarea.Frecuencia > 1 ? 2 : 1] : ''
                    });

                    if (!this.selectedValue[tarea.PPM.trim()]){
                        this.selectedValue[tarea.PPM.trim()] = [];
                      }
                    this.selectedValue[tarea.PPM.trim()][tarea.Equipo.trim()] = '';
                  }
                  else{
                    this.cantTareas[this.servicioTipo[tarea.TipoTareaId]] ++;
                    this.tareas[tarea.TipoTareaId].push({
                      Id: tarea.Id,
                      PPM: tarea.PPM.trim(),
                      Descr: tarea.Descr.trim(),
                      TipoTareaId: tarea.TipoTareaId,
                      Frecuencia: tarea.Frecuencia,
                      Equipo: tarea.Equipo.trim(),
                      EquipoDescr: tarea.EquipoDescr.trim(),
                      Periodo: tarea.Periodo !== null ?  tarea.Periodo.trim() : null,
                      PeriodoMap: tarea.Periodo !== null ? this.periodMap[tarea.Periodo.trim()][tarea.Frecuencia > 1 ? 2 : 1] : ''
                    });
                  }

                });


                this.isDataLoaded = true;
                this.blockUI.stop();
                console.log(this.cantTareas);
              },
              error => {
                console.log(error);
                this.blockUI.stop();
              }
            );
          },
          err => {
            console.log(err);
            this.blockUI.stop();
          }
        );
      },
      err => {
        console.log(err);
        this.blockUI.stop();
      }
    );
  }


  setTableArray(idTipo, index){
    this.tablesIndexes[idTipo] = index + 1;
  }


  assignTipo(ppm){
    this.notif.clear();
    this.blockUI.start('Creando Tarea...');
    const tareaData = {
      PPM: ppm.PPM.trim(),
      Equipo: ppm.Equipo.trim(),
      Descr: ppm.Descr.trim(),
      Frecuencia: ppm.Frecuencia,
      Periodo: ppm.Periodo !== null ?  ppm.Periodo.trim() : null,
      TipoTareaId: this.selectedValue[ppm.PPM.trim()][ppm.Equipo.trim()]
    };
    this.siteService.postTarea(tareaData).subscribe(
      res => {
        const nuevaTarea = {
          Id: res.Id,
          PPM: res.PPM.trim(),
          Descr: res.Descr.trim(),
          Equipo: res.Equipo.trim(),
          EquipoDescr: ppm.EquipoDescr.trim(),
          TipoTareaId: res.TipoTareaId,
          Frecuencia: res.Frecuencia,
          Periodo: res.Periodo !== null ?  res.Periodo.trim() : null,
          PeriodoMap: res.Periodo !== null ? this.periodMap[res.Periodo.trim()][res.Frecuencia > 1 ? 2 : 1] : ''
        };
        this.tareas[tareaData.TipoTareaId].push(nuevaTarea);
        this.tareas[0] = this.tareas[0].filter((value, key) => {
          return value.PPM !== nuevaTarea.PPM || value.Equipo !== nuevaTarea.Equipo;
        });
        this.tables.toArray().forEach(element => {
          element.renderRows();
        });

        this.blockUI.stop();
        this.notif.info('La Tarea se creó correctamente.');

      },
      error => {
        this.blockUI.stop();
        console.log(error);
      }
    );
  }

  openDialog(action , obj) {
    obj.action = action;
    obj.groups = this.servicios;
    obj.tipos = this.tipos;
    const dialogRef = this.dialog.open(TasksDialogBoxComponent, {
      width: '600px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      this.notif.clear();
      if (result){
        if (result.event === 'Update'){
          this.updateRowData(result.data);
        }else if (result.event === 'Delete'){
          this.deleteRowData(result.data);
        }

      }

    });
  }



  updateRowData(tareaData){
    this.blockUI.start('Modificando Tarea...');
    this.siteService.putTarea(tareaData).subscribe(
      res => {
        // Me fijo si en la lista de tareas de ese tipo, ya está esta tarea (no cambió el TipoTarea, sólo frecuencia o período)
        const aux = this.tareas[tareaData.TipoTareaId].filter((value, key) => {
          return value.PPM === tareaData.PPM && value.Equipo === tareaData.Equipo;
        });
        // si no existía esta tarea en este tipo, debo crearla y borrarla de la lista de tareas del tipo anterior
        if (aux.length === 0){

          const nuevaTarea = {
            Id: res.Id,
            PPM: res.PPM.trim(),
            Descr: res.Descr.trim(),
            Equipo: res.Equipo.trim(),
            EquipoDescr: tareaData.EquipoDescr.trim(),
            TipoTareaId: res.TipoTareaId,
            Frecuencia: res.Frecuencia,
            Periodo: res.Periodo !== null ?  res.Periodo.trim() : null,
            PeriodoMap: res.Periodo !== null ? this.periodMap[res.Periodo.trim()][res.Frecuencia > 1 ? 2 : 1] : ''
          };
          this.tareas.forEach((value: [any], key: number) => {
            this.tareas[key] = this.tareas[key].filter((valor, key2) => {
              return valor.PPM !== tareaData.PPM || valor.Equipo !== tareaData.Equipo;
            });
          });

          this.tareas[tareaData.TipoTareaId].push(nuevaTarea);

        }
        // Si ya existía, le cambio los valores
        else{
          aux[0].Descr = res.Descr.trim();
          aux[0].Frecuencia = res.Frecuencia;
          aux[0].Periodo = res.Periodo !== null ?  res.Periodo.trim() : null;
          aux[0].PeriodoMap = res.Periodo !== null ? this.periodMap[res.Periodo.trim()][res.Frecuencia > 1 ? 2 : 1] : '';


        }
        this.tables.toArray().forEach(element => {
          element.renderRows();
        });


        this.blockUI.stop();
        this.notif.info('La Tarea se modificó correctamente.');

      },
      error => {
        this.blockUI.stop();
        console.log(error);
      }
    );
  }


  deleteRowData(tareaData) {
    this.blockUI.start('Eliminando Tarea...');
    this.siteService.deleteTarea(tareaData).subscribe(
      () => {
        this.tareas[tareaData.TipoTareaId] = this.tareas[tareaData.TipoTareaId].filter((value, key) => {
          return value.PPM !== tareaData.PPM || value.Equipo !== tareaData.Equipo;
        });

        this.selectedValue[tareaData.PPM.trim()][tareaData.Equipo.trim()] = '';
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
        this.tables.toArray()[0].renderRows();
        this.blockUI.stop();
        this.notif.info(`La Tarea ${tareaData.Descr} del equipo ${tareaData.EquipoDescr} se eliminó correctamente.`);
      },
      error => {
        this.blockUI.stop();
        console.log(error);
      }
    );
  }



}
