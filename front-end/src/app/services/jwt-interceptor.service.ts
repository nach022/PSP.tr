// Servicio para interceptar Requests de HTTP, si los request son al backend, se le agrega en el header el JWT.

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { GlobalConstants } from '../common/global.constants';
import { Router } from '@angular/router';
import { catchError, timeout } from 'rxjs/operators';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  constructor(private router: Router, private notif: NotificationService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Intercepto el request
    let request = req;
    // si la url del request incluye la url del backend y no es la url de login, clono el request y le agrego el jwt al header
    if (req.url.includes(GlobalConstants.API_BASE_URL) && !req.url.includes(GlobalConstants.API_LOGIN_URL)){
      const token: string = localStorage.getItem(GlobalConstants.LOCAL_TOKEN_KEY);
      if (token) {
        request = req.clone({
          setHeaders: {
            Authorization: `Bearer ${ token }`
          }
        });
      }

    }
    // le paso al handler la request modificada
    return next.handle(request).pipe(timeout(GlobalConstants.HTTP_TIMEOUT))
    .pipe(
      // capturo errores de HTTP
      catchError((err: HttpErrorResponse) => {
        console.log(err);
        if (err instanceof TimeoutError){
          this.notif.error('El servidor está demorando más de lo permitido en responder su solicitud. Por favor póngase en contacto con el administrador del sistema.');
        }
        // si el error es 401 (Unauthorized), redirecciono al unuario a la página de login
        else if (err.status === 401) {
          this.router.navigate(['/login',  {error401: true}]);
        }
        else if (err.status === 403) {
          this.notif.error('No tiene permisos para realizar esta acción. De requerirlos, por favor póngase en contacto con el administrador del sistema.');
        }
        else if (err.status === 409) {
          if (typeof(err.error) === 'string') {
            this.notif.error(err.error);
          }
          else{
            this.notif.error('La entidad que ha intentado crear o modificar, está en conflicto con una ya existente en la base de datos.');
          }
        }
        else{
          if (typeof(err.error) === 'string') {
            this.notif.error(err.error);
          }
          else{
            this.notif.error(err.message);
          }
        }
        return throwError( err );

      })
    );
  }

}
