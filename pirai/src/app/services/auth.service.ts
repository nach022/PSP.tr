import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { TimeoutError } from 'rxjs';
import { LoginResponse } from '../models/LoginResponse';
import { Router } from '@angular/router';
import { GlobalConstants } from '../common/global.constants';



@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }


  // Función asíncrona para login de usuario
  async loginUser(userid, password, appid): Promise<LoginResponse> {

    // Retorno una promesa
    return new Promise(resolve => {
      // inicializo la respuesta vacía
      const loginResponse: LoginResponse = {
        success: false,
        rol: false,
        status: 0,
        message: ''
      };

      const user = {
        UserId: userid,
        Password: password,
        AppId: appid
      };

      // ejecuto el post al backend, con un timeout de 20 segundos
      this.http.post<any>(GlobalConstants.API_LOGIN_URL, user, { observe: 'response' }).
        pipe(
          timeout(GlobalConstants.HTTP_TIMEOUT)
        ).subscribe(

          // recibo una respuesta correcta del servidos
          res => {
            // cargo los valores en la respuesta que retornaré
            console.log(res);
            loginResponse.success = true;
            loginResponse.status = 200;
            if (res.headers.get(GlobalConstants.HEADERS_ROL_KEY) === '1') {
              loginResponse.rol = true;
              sessionStorage.setItem(GlobalConstants.SESSION_ROL_KEY, res.body.rol);

            } else {
              loginResponse.rol = false;
              sessionStorage.setItem(GlobalConstants.SESSION_ROL_KEY, res.headers.get(GlobalConstants.HEADERS_ROL_KEY));
              if (res.headers.get(GlobalConstants.HEADERS_ROL_KEY) === '0') {
                sessionStorage.setItem(GlobalConstants.SESSION_ROL_CREATED_AT, res.body.createdAt);
              }
            }
            // obtengo el JWT y lo almaceno en almacenamiento local
            localStorage.setItem(GlobalConstants.LOCAL_TOKEN_KEY, res.headers.get(GlobalConstants.HEADERS_TOKEN_KEY));
            // almaceno el nombre del usuario en la sesión
            sessionStorage.setItem(GlobalConstants.SESSION_NAME_KEY, res.body.nombre);
            // retorno la resolución de la promesa
            resolve(loginResponse);
          },

          // recibo una respuesta con error o se agota el timeout
          err => {

            // cargo los valores de error en la respuesta que retornaré
            loginResponse.success = false;

            if (err instanceof TimeoutError) { // Si el error es por timeout, muestro un mensaje de error
              loginResponse.status = 504;
              loginResponse.message = 'Se ha agotado el tiempo de espera del servidor.';

            } else { // Si se trata un error de servidor o de credenciales, replico el error recibido
              loginResponse.status = err.status;
              loginResponse.message = err.error;
            }
            // retorno la resolución de la promesa
            resolve(loginResponse);
          }
        );
    });
  }


  registerUser(nombre: string) {
    return this.http.post(GlobalConstants.API_REGISTER_URL, {Nombre: nombre});
  }



  loggedIn(): boolean {
    return (!!localStorage.getItem(GlobalConstants.LOCAL_TOKEN_KEY))
            && sessionStorage.getItem(GlobalConstants.SESSION_ROL_KEY) !== '-1'
            && sessionStorage.getItem(GlobalConstants.SESSION_ROL_KEY) !== '0';
  }

  loggedInNoRol(): boolean {
    return (!!localStorage.getItem(GlobalConstants.LOCAL_TOKEN_KEY)) &&
            Number(sessionStorage.getItem(GlobalConstants.SESSION_ROL_KEY)) <= 0;
  }


  logOff() {
    sessionStorage.removeItem(GlobalConstants.SESSION_NAME_KEY);
    sessionStorage.removeItem(GlobalConstants.SESSION_ROL_KEY);
    sessionStorage.removeItem(GlobalConstants.SESSION_ROL_CREATED_AT);
    localStorage.removeItem(GlobalConstants.LOCAL_TOKEN_KEY);
    this.router.navigate(['login']);
  }


}
