import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { NotificationService } from 'src/app/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalConstants } from 'src/app/common/global.constants';




@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private auth: AuthService, private notif: NotificationService,
              private router: Router, private activatedRoute: ActivatedRoute) { }
  @BlockUI() blockUI: NgBlockUI;

  ngOnInit(): void {
    this.auth.logOff();
    this.activatedRoute.params.subscribe(params => {
      if (params.error401) {
          this.notif.info('Su sesión ha expirado. Por favor, ingrese nuevamente.');
      }

   });
  }

  loginUser(form: NgForm) {
    this.notif.clear(); // limpio las notificaciones existentes
    this.blockUI.start('Validando credenciales...'); // bloqueo pantalla y muestro spinner

    if (form.invalid) { // si los datos ingresdos no cumplen los criterios, no los envío al servidor
      return;
    } else {
      // llamo al servicio para login con los datos del formulario
      this.auth.loginUser(form.value.userid, form.value.password, GlobalConstants.APP_ID).then(response => {
        console.log(response);
        this.blockUI.stop(); // al obtener respuesta desbloqueo la pantalla
        if (!response.success) { // si la respuesta no es exitosa
          if (response.status === 401) { // si el error es de credenciales, muestro información del error
            this.notif.info(response.message);
          } else { // si el error es de servidor u otro tipo, muestro el mensaje como error
            this.notif.error(response.message);
          }
        } else { // si la respuesta sí es exitosa
          if (response.rol) { // si el usuario tiene rol asignado, lo redirecciono al inicio
            this.router.navigate(['/home']);
          } else { // si no tiene rol asignado, lo redirecciono al registro de usuarios
            this.router.navigate(['/register']);
          }
        }
      });

    }

  }

}
