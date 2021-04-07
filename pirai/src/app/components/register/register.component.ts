import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from 'src/app/common/global.constants';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgBlockUI, BlockUI } from 'ng-block-ui';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  nombre: string;
  solicitud: number;
  tiempo: number;

  constructor(private auth: AuthService, private notif: NotificationService,
              private router: Router, private activatedRoute: ActivatedRoute) { }

  @BlockUI() blockUI: NgBlockUI;

  ngOnInit(): void {
    this.nombre = sessionStorage.getItem(GlobalConstants.SESSION_NAME_KEY);
    this.solicitud = Number(sessionStorage.getItem(GlobalConstants.SESSION_ROL_KEY));
    if (this.solicitud === 0) {
      const fechaSol = new Date(sessionStorage.getItem(GlobalConstants.SESSION_ROL_CREATED_AT));
      this.tiempo = Math.floor(((new Date()).getTime() - fechaSol.getTime()) / (1000 * 60 * 60 * 24));
    }

  }

  registerUser() {
    // limpio las notificaciones existentes
    this.notif.clear();

    // bloqueo pantalla y muestro spinner
    this.blockUI.start('Creando Solicitud de Acceso...');

    // llamo al servicio para registrar al usuario.
    this.auth.registerUser(this.nombre).subscribe(
      res => {
        this.blockUI.stop();
        this.notif.info('La solicitud se ha enviado con éxito. Espere a que sea revisada por el Coordinador del PSP.');
        this.solicitud = 0;
        this.tiempo = 0;
      },
      error => {
        this.blockUI.stop();
      }
    );

  }


  salir() {
    this.router.navigate(['login']);
  }

}
