import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { SiteService } from 'src/app/services/site.service';
import { Subscription, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  NombreUsuario = '';
  RolUsuario = [];
  notificaciones: {icon: string, text: string, func: string, color: string, path: string}[] = [];
  subscription: Subscription;

  constructor(private auth: AuthService, private siteService: SiteService, private router: Router, private notif: NotificationService) {}


  ngOnInit(): void {
    this.NombreUsuario = sessionStorage.getItem('psp-name');
    if (sessionStorage.getItem('psp-rol')){
      this.RolUsuario = sessionStorage.getItem('psp-rol').split(',');
    }

    this.subscription = timer(0, 20000).pipe(
      switchMap(() => this.siteService.getNotifications())
    ).subscribe(notif => {
      const aux = [];
      notif.forEach(element => {
        if (element.Tipo === 'newPPM'){
          aux.push({
            icon: 'note_add',
            text: `Se han creado ${element.Cant} tareas nuevas de PSP en EAM.`,
            path: '/tasks-setting',
            color: 'primary'
          });
        }
        else if (element.Tipo === 'difFrec'){
          aux.push({
            icon: 'replay',
            text: `Hay ${element.Cant} tareas con diferente frecuencia en EAM.`,
            path: '/freq-diff',
            color: 'warn'
          });
        }
        else if (element.Tipo === 'vencSemana'){
          aux.push({
            icon: 'alarm_add',
            text: `Hay ${element.Cant} tareas que se vencen esta semana.`,
            path: '/tasks-overview',
            color: 'primary'
          });
        }
        else if (element.Tipo === 'vencidas'){
          aux.push({
            icon: 'alarm',
            text: `Hay ${element.Cant} tareas vencidas.`,
            path: '/tasks-overview',
            color: 'warn'
          });
        }
        else if (element.Tipo === 'newUser'){
          aux.push({
            icon: 'group_add',
            text: `Hay ${element.Cant} solicitudes de usuarios nuevos.`,
            path: '/users-setting',
            color: 'primary'
          });
        }
        this.notificaciones = aux;
      });
    });
  }
  cerrarSesion(){
    this.auth.logOff();
  }


  navegar(ruta){
    this.notif.clear();
    this.router.navigate([ruta]).catch(err => {
      this.notif.error(err);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
