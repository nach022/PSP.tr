import { ProgressAnimationType } from 'ngx-toastr';
import { environment } from 'src/environments/environment';


// Clase para exportar variables globales
export class GlobalConstants {

  // setting general de la APP
  public static APP_ID = 2;
  public static APP_TITLE = 'Piraí';
  public static APP_NOTIF_PREVENT_DUPLICATES = true;
  public static APP_NOTIF_DURATION = 3500;
  public static APP_NOTIF_CLOSE_BUTTON = true;
  public static APP_NOTIF_PROGRESS_BAR = true;
  public static APP_NOTIF_PROGRESS_STYLE: ProgressAnimationType = 'increasing';
  public static APP_NOTIF_POSITION = 'toast-bottom-full-width';

  // urls de los servicios de la API
  public static API_PORT = 3000;
  public static API_BASE_URL = `http://${GlobalConstants.API_SERVER()}:${GlobalConstants.API_PORT}/api`;
  public static API_LOGIN_URL = `${GlobalConstants.API_BASE_URL}/user/login`;
  public static API_MENU_URL = `${GlobalConstants.API_BASE_URL}/app/menu`;
  public static API_REGISTER_URL = `${GlobalConstants.API_BASE_URL}/user/register`;
  public static API_ROLES_URL = `${GlobalConstants.API_BASE_URL}/app/roles`;
  public static API_USUARIOS_URL = `${GlobalConstants.API_BASE_URL}/app/usuarios`;
  public static API_PROFUND_URL = `${GlobalConstants.API_BASE_URL}/pirai/profundidades`;
  public static HTTP_TIMEOUT = 20000;


  public static GRAFANA_THEME = `light`;
  public static GRAFANA_PORT = `3000`;
  public static GRAFANA_HOST = `172.16.3.43`;
  public static GRAFANA_BASE_URL = `http://${GlobalConstants.GRAFANA_HOST}:${GlobalConstants.GRAFANA_PORT}/d-solo`;
  public static GRAFANA_PARAM_FIJOS = `orgId=1&theme=${GlobalConstants.GRAFANA_THEME}`;

  public static GRAFANA_DASHBOARD_HOME = `o8DrKF4Gk/homepage`;
  // tslint:disable-next-line: max-line-length
  public static GRAFANA_HOME_BASE = `${GlobalConstants.GRAFANA_BASE_URL}/${GlobalConstants.GRAFANA_DASHBOARD_HOME}?${GlobalConstants.GRAFANA_PARAM_FIJOS}`;
  public static GRAFANA_HOME_TAREAS_GAUGES = `${GlobalConstants.GRAFANA_HOME_BASE}@filtro_area@&panelId=4`;
  public static GRAFANA_HOME_TRABAJOS_GAUGES = `${GlobalConstants.GRAFANA_HOME_BASE}@filtro_area@&panelId=5`;
  public static GRAFANA_HOME_LAST_UPD = `${GlobalConstants.GRAFANA_HOME_BASE}&panelId=2`;

  public static GRAFANA_DASHBOARD_JUNTAS = `UKwkTCNGz/mediciones-juntas`;
  // tslint:disable-next-line: max-line-length
  public static GRAFANA_JUNTAS_BASE = `${GlobalConstants.GRAFANA_BASE_URL}/${GlobalConstants.GRAFANA_DASHBOARD_JUNTAS}?${GlobalConstants.GRAFANA_PARAM_FIJOS}`;
  public static GRAFANA_JUNTA_X = `${GlobalConstants.GRAFANA_JUNTAS_BASE}&var-Junta=@junta@&from=@ini@&to=@fin@&panelId=4`;
  public static GRAFANA_JUNTA_Y = `${GlobalConstants.GRAFANA_JUNTAS_BASE}&var-Junta=@junta@&from=@ini@&to=@fin@&panelId=8`;
  public static GRAFANA_JUNTA_Z = `${GlobalConstants.GRAFANA_JUNTAS_BASE}&var-Junta=@junta@&from=@ini@&to=@fin@&panelId=7`;
  public static GRAFANA_JUNTA_T = `${GlobalConstants.GRAFANA_JUNTAS_BASE}&var-Junta=@junta@&from=@ini@&to=@fin@&panelId=10`;



  // keys para obtener información desde los headers de respuesta de la API
  public static HEADERS_ROL_KEY = 'auth-rol';
  public static HEADERS_TOKEN_KEY = 'auth-token';


  // keys para almacenar información en la sessión del navegador
  public static SESSION_ROL_KEY = 'pirai-rol';
  public static SESSION_NAME_KEY = 'pirai-name';
  public static SESSION_ROL_CREATED_AT = 'pirai-rol-createdAt';


  // keys para almacenar información en el local storage
  public static LOCAL_TOKEN_KEY = 'pirai-token';

  public static API_SERVER(){
    if (environment.production) {
      return'172.16.3.46';
    } else {
      return 'localhost';
    }
  }





}
