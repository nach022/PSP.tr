import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { SiteService } from 'src/app/services/site.service';
import { NotificationService } from 'src/app/services/notification.service';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { ProfundDialogBoxComponent } from './profund-dialog-box/profund-dialog-box.component';

@Component({
  selector: 'app-profundidades-setting',
  templateUrl: './profundidades-setting.component.html',
  styleUrls: ['./profundidades-setting.component.css']
})
export class ProfundidadesSettingComponent implements OnInit {
  displayedColumns: string[] = ['orden', 'cod', 'descr', 'action'];
  dataSource = [];

  @ViewChild(MatTable, {static: false}) table: MatTable<any>;

  constructor(public dialog: MatDialog, private siteService: SiteService, private notif: NotificationService) { }
  @BlockUI() blockUI: NgBlockUI;
  public isDataLoaded = false;


  openDialog(action, obj) {
    obj.action = action;
    const dialogRef = this.dialog.open(ProfundDialogBoxComponent, {
      width: '600px',
      data: obj
    });

    dialogRef.afterClosed().subscribe(result => {
      this.notif.clear();
      if (result) {
        if (result.event === 'Add') {
          this.addRowData(result.data);
        } else if (result.event === 'Update') {
          this.updateRowData(result.data);
        } else if (result.event === 'Delete') {
          this.deleteRowData(result.data);
        }

      }

    });
  }

  addRowData(row) {
    this.blockUI.start('Creando Profundidad...');
    this.siteService.postProfundidad(row).subscribe(
      res => {
        this.dataSource.push(res);
        this.table.renderRows();
        this.blockUI.stop();
        this.notif.info('La Profundidad se creó correctamente.');

      },
      error => {
        this.blockUI.stop();
      }
    );
  }

  updateRowData(row) {
    this.blockUI.start('Modificando Profundidad...');
    this.siteService.putProfundidad(row).subscribe(
      res => {
        this.dataSource = this.dataSource.filter((value, key) => {
          if (value.Id === row.Id) {
            value.Nombre = row.Nombre;
          }
          return true;
        });
        this.blockUI.stop();
        this.notif.info('El Grupo de Acción se modificó correctamente.');

      },
      error => {
        this.blockUI.stop();
      }
    );
  }


  deleteRowData(row) {
    this.blockUI.start('Eliminando Profundidad...');
    this.siteService.deleteProfundidad(row).subscribe(
      res => {
        this.dataSource = this.dataSource.filter((value, key) => {
          return value.Id !== row.Id;
        });
        this.blockUI.stop();
        this.notif.info(`La Profundidad ${row.Nombre} se eliminó correctamente.`);
      },
      error => {
        this.blockUI.stop();
      }
    );
  }



  ngOnInit(): void {


    this.blockUI.start('Cargando Profundidad...');
    this.siteService.getProfundidades().subscribe(
      res => {
        this.blockUI.stop();
        this.dataSource = res;
        this.isDataLoaded = true;
      },
      err => {
        this.blockUI.stop();
      }
    );

  }

}
