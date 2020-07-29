import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { SiteService } from 'src/app/services/site.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { UserIterface } from 'src/app/models/UserInterface';
import { RolIterface } from 'src/app/models/RolInterface';
import { UsersDialogBoxComponent } from './users-dialog-box/users-dialog-box.component';



@Component({
  selector: 'app-users-setting',
  templateUrl: './users-setting.component.html',
  styleUrls: ['./users-setting.component.css']
})

export class UsersSettingComponent implements OnInit{
  displayedColumns: string[] = ['Id', 'Nombre', 'Roles', 'action'];
  displayedColumnsSol: string[] = ['Id', 'Nombre', 'action'];
  @ViewChildren(MatTable) tables: QueryList<MatTable<any>>;

  constructor(private siteService: SiteService, private notif: NotificationService, public dialog: MatDialog) { }
  @BlockUI() blockUI: NgBlockUI;
  public isDataLoaded = false;
  public usuarios: UserIterface[] = [];
  public solicitudes: UserIterface[] = [];
  public roles: RolIterface[] = [];
  public mapRoles: string[] = [];

  ngOnInit(): void {
    this.blockUI.start('Cargando Roles...');
    this.siteService.getRoles().subscribe(
      roles => {
        roles.forEach(rol => {
          this.mapRoles[rol.Id] = rol.Nombre;
        });
        this.blockUI.stop();
        this.roles = roles;
        this.blockUI.start('Cargando Usuarios...');
        this.siteService.getUsuarios().subscribe(
          usuarios => {
            this.blockUI.stop();
            usuarios.forEach(usr => {
              if (usr.Roles.length !== 0){
                let rolesList = this.mapRoles[usr.Roles[0]];
                let indx = 1;
                while (indx < usr.Roles.length){
                  rolesList += `, ${this.mapRoles[usr.Roles[indx]]}`;
                  indx++;
                }
                usr.RolesList = rolesList;
                this.usuarios.push(usr);
              }
              else{
                this.solicitudes.push(usr);
              }
            });
            this.isDataLoaded = true;
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
      });
    }


    openDialog(action, obj) {
      const dialogRef = this.dialog.open(UsersDialogBoxComponent, {
        width: '600px',
        data: {
          user: {...obj},
          action,
          rolesList: this.roles
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        this.notif.clear();
        if (result){
          if (result.event === 'Update'){
            this.updateUsuario(result.data, 'usr');
          }else if (result.event === 'Delete'){
            this.deleteUsuario(result.data, 'usr');
          }
          else if (result.event === 'UpdateSol'){
            this.updateUsuario(result.data, 'sol');
          }else if (result.event === 'DeleteSol'){
            this.deleteUsuario(result.data, 'sol');
          }
        }
      });
    }




  updateUsuario(usr, entidad){
    this.notif.clear();
    if (usr.Roles.length === 0){
      this.notif.info('Por favor, asigne al menos un rol al usuario.');
    }
    else{
      let msg = '';
      let msg2 = '';
      if (entidad === 'sol'){
        msg = 'Creando Usuario del Sistema...';
        msg2 = 'El usuario fue creado con éxito.';
      }
      else{
        msg = 'Modificando Usuario del Sistema...';
        msg2 = 'El usuario fue modificado con éxito.';
      }
      this.blockUI.start(msg);
      let rolesList = this.mapRoles[usr.Roles[0]];
      let indx = 1;
      while (indx < usr.Roles.length){
        rolesList += `, ${this.mapRoles[usr.Roles[indx]]}`;
        indx++;
      }
      const usuario = {
        Id: usr.Id,
        Nombre: usr.Nombre.trim(),
        Roles: usr.Roles,
        RolesList: rolesList
      };

      this.siteService.putUsuario(usuario).subscribe(
        res => {
          if (entidad === 'sol'){
            this.usuarios.push(usr);
            this.solicitudes = this.solicitudes.filter((value, key) => {
              return value.Id !== usuario.Id;
            });
          }
          else{
            const aux = this.usuarios.filter((value, key) => {
              return value.Id === usr.Id;
            });
            aux[0].Nombre = usuario.Nombre;
            aux[0].Roles = usuario.Roles;
            aux[0].RolesList = usuario.RolesList;
          }
          this.tables.toArray()[1].renderRows();
          this.blockUI.stop();
          this.notif.info(msg2);

        },
        error => {
          this.blockUI.stop();
          console.log(error);
        }
      );
    }
  }


  deleteUsuario(usr, entidad) {
    this.notif.clear();
    let msg = '';
    let msg2 = '';
    if (entidad === 'sol'){
      msg = 'Eliminando Solicitud de Acceso...';
      msg2 = 'La Solicitud de Acceso se ha eliminado con éxito';
    }
    else{
      msg = 'Eliminando Usuario del Sistema...';
      msg2 = 'El Usuario se ha eliminado con éxito';
    }
    this.blockUI.start(msg);
    this.siteService.deleteUsuario(usr).subscribe(
      res => {
        if (entidad === 'sol'){
          this.solicitudes = this.solicitudes.filter((value, key) => {
            return value.Id !== usr.Id;
          });
        }
        else{
          this.usuarios = this.usuarios.filter((value, key) => {
            return value.Id !== usr.Id;
          });
        }
        this.blockUI.stop();
        this.notif.info(msg2);

      },
      error => {
        this.blockUI.stop();
        console.log(error);
      }
    );
  }











}
