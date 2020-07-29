import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SiteService } from 'src/app/services/site.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { TaskTypesDialogBoxComponent } from './task-types-dialog-box/task-types-dialog-box.component';
import { MatTable } from '@angular/material/table';


export interface tipoInterface{
  Id: number,
  Nombre: string,
  ServicioEjecutorId: number
}


@Component({
  selector: 'app-task-types-settings',
  templateUrl: './task-types-settings.component.html',
  styleUrls: ['./task-types-settings.component.css']
})


export class TaskTypesSettingsComponent implements OnInit{
  displayedColumns: string[] = ['id', 'name', 'action'];
  @ViewChildren(MatTable) _tables: QueryList<MatTable<any>>;


  constructor(private _siteService: SiteService, private _notif: NotificationService, public dialog: MatDialog) { }
  @BlockUI() _blockUI: NgBlockUI;
  public isDataLoaded: boolean = false;
  public servicios = [];
  public tipos = new Map();

  ngOnInit(): void {
    this._blockUI.start('Cargando Grupos de Acción...');
    this._siteService.getServiciosEjecutores().subscribe(
      servs => {
        this._blockUI.stop();
        this.servicios = servs;
        this.servicios.forEach(serv => {
          this.tipos[serv.Id] = [];
        });
        console.log('this.tipos: ', this.tipos);
        this._blockUI.start('Cargando Tipos de Tareas...');
        this._siteService.getTiposTareas().subscribe(
          tipos => {
            console.log('tipos: ', tipos)
            tipos.forEach(tipo => {
              this.tipos[tipo.ServicioEjecutorId].push({ Id: tipo.Id, Nombre: tipo.Nombre, Responsable: tipo.ServicioEjecutorId})
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
  }

  openDialog(action,obj, indxTabla) {
    obj.action = action;
    const dialogRef = this.dialog.open(TaskTypesDialogBoxComponent, {
      width: '600px',
      data:obj
    });
    console.log(this._tables.toArray()[indxTabla]);

    dialogRef.afterClosed().subscribe(result => {
      this._notif.clear();
      if(result){
        console.log(result.event, result.data);
        if(result.event == 'Add'){
          this.addRowData(result.data, indxTabla);
        }else if(result.event == 'Update'){
          this.updateRowData(result.data);
        }else if(result.event == 'Delete'){
          this.deleteRowData(result.data);
        }

      }

    });
  }

  addRowData(row_obj, indxTabla){
    this._blockUI.start('Creando Tipo de Tarea...');
    let tipoData = {
      Responsable: row_obj.Responsable,
      Nombre: row_obj.Nombre
    }
    this._siteService.postTipoTarea(tipoData).subscribe(
      res=>{

        this.tipos[row_obj.Responsable].push({ Id: res.Id, Nombre: res.Nombre, Responsable: res.ServicioEjecutorId});
        this._tables.toArray()[indxTabla].renderRows();
        this._blockUI.stop();
        this._notif.info('El Tipo de Tarea se creó correctamente.');

      },
      error =>{
        this._blockUI.stop();
        console.log(error);
      }
    );
  }

  updateRowData(tipoData){
    console.log(tipoData);
    this._blockUI.start('Modificando Tipo de Tarea...');
    this._siteService.putTipoTarea(tipoData).subscribe(
      res=>{
        console.log(res);
        this.tipos[tipoData.Responsable] = this.tipos[tipoData.Responsable].filter((value,key)=>{
          if(value.Id == tipoData.Id){
            value.Nombre = tipoData.Nombre;
          }
          return true;
        });
        this._blockUI.stop();
        this._notif.info('El Tipo de Tarea se modificó correctamente.');

      },
      error =>{
        this._blockUI.stop();
        console.log(error);
      }
    );
  }


  deleteRowData(tipoData) {
    this._blockUI.start('Eliminando Tipo de Tarea...');
    this._siteService.deleteTipoTarea(tipoData).subscribe(
      res => {
        this.tipos[tipoData.Responsable] = this.tipos[tipoData.Responsable].filter((value,key)=>{
          return value.Id != tipoData.Id;
        });
        this._blockUI.stop();
        this._notif.info(`El Tipo de Tarea ${tipoData.Nombre} se eliminó correctamente.`);
      },
      error =>{
        this._blockUI.stop();
        console.log(error);
      }
    );
  }



}
