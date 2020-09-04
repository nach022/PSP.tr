import { ProgressAnimationType } from 'ngx-toastr';
import { environment } from 'src/environments/environment';


// Clase para exportar variables globales
export class GlobalConstants {

  // setting general de la APP
  public static APP_ID = 1;
  public static APP_TITLE = 'PSP.tr';
  public static APP_NOTIF_PREVENT_DUPLICATES = true;
  public static APP_NOTIF_DURATION = 3500;
  public static APP_NOTIF_CLOSE_BUTTON = true;
  public static APP_NOTIF_PROGRESS_BAR = true;
  public static APP_NOTIF_PROGRESS_STYLE: ProgressAnimationType = 'increasing';
  public static APP_NOTIF_POSITION = 'toast-bottom-full-width';

  // urls de los servicios de la API

  public static API_PORT = 3000;
  public static API_BASE_URL = `http://${GlobalConstants.API_SERVER()}:${GlobalConstants.API_PORT}/api`;
  public static API_COMMENTS_URL = `${GlobalConstants.API_BASE_URL}/psp/commentsTarea`;
  public static API_FILTRO_AREAS_URL = `${GlobalConstants.API_BASE_URL}/psp/myAreas`;
  public static API_LOGIN_URL = `${GlobalConstants.API_BASE_URL}/user/login`;
  public static API_MENU_URL = `${GlobalConstants.API_BASE_URL}/app/menu`;
  public static API_NOTIF_URL = `${GlobalConstants.API_BASE_URL}/psp/notificaciones`;
  public static API_JUNTAS_URL = `${GlobalConstants.API_BASE_URL}/psp/juntas`;
  public static API_REGISTER_URL = `${GlobalConstants.API_BASE_URL}/user/register`;
  public static API_ROLES_URL = `${GlobalConstants.API_BASE_URL}/app/roles`;
  public static API_SERV_EJEC_URL = `${GlobalConstants.API_BASE_URL}/psp/areas`;
  public static API_TIPO_TAREAS_URL = `${GlobalConstants.API_BASE_URL}/psp/tiposTareas`;
  public static API_TAREAS_URL = `${GlobalConstants.API_BASE_URL}/psp/tareas`;
  public static API_TAREAS_OVERVIEW_URL = `${GlobalConstants.API_BASE_URL}/psp/tareasOverview`;
  public static API_TAREAS_FREQDIFF_URL = `${GlobalConstants.API_BASE_URL}/psp/tareasFreqDiff`;
  public static API_USUARIOS_URL = `${GlobalConstants.API_BASE_URL}/app/usuarios`;
  public static HTTP_TIMEOUT = 20000;

  // keys para obtener información desde los headers de respuesta de la API
  public static HEADERS_ROL_KEY = 'auth-rol';
  public static HEADERS_TOKEN_KEY = 'auth-token';


  // keys para almacenar información en la sessión del navegador
  public static SESSION_ROL_KEY = 'psp-rol';
  public static SESSION_NAME_KEY = 'psp-name';
  public static SESSION_ROL_CREATED_AT = 'rol-createdAt';
  public static SESSION_FILTRO_AREAS = 'psp-filtroAreas';

  // keys para almacenar información en el local storage
  public static LOCAL_TOKEN_KEY = 'psp-token';

  public static API_SERVER(){
    if (environment.production) {
      return'172.16.3.46';
    }
    else{
      return 'localhost';
    }
  }



}
