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
      if (params.error401){
          this.notif.info('Su sesión ha expirado. Por favor, ingrese nuevamente.');
      }

   });
  }

  loginUser(form: NgForm){
    // limpio las notificaciones existentes
    this.notif.clear();

    // bloqueo pantalla y muestro spinner
    this.blockUI.start('Validando credenciales...');

    // si los datos ingresdos no cumplen los criterios, no los envío al servidor
    if (form.invalid){
      return;
    }
    else{
      // llamo al servicio para login con los datos del formulario
      this.auth.loginUser(form.value.userid, form.value.password, GlobalConstants.APP_ID).then(response => {
        // al obtener respuesta desbloqueo la pantalla
        this.blockUI.stop();
        // si la respuesta no es exitosa
        if (!response.success){
          // si el error es de credenciales, muestro información del error
          if (response.status === 401){
            this.notif.info(response.message);
          }
          // si el error es de servidor u otro tipo, muestro el mensaje como error
          else{
            this.notif.error(response.message);
          }
        }
        // si la respuesta sí es exitosa
        else{
          // si el usuario tiene rol asignado, lo redirecciono al inicio
          if (response.rol){
            this.router.navigate(['/home']);
          }
          // si no tiene rol asignado, lo redirecciono al registro de usuarios
          else{
            this.router.navigate(['/register']);
          }
        }
      });

    }

  }

}
