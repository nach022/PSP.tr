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
  public static API_EJEC_FUTURAS_URL = `${GlobalConstants.API_BASE_URL}/psp/EjecucionesFuturas`;
  public static API_FILTRO_AREAS_URL = `${GlobalConstants.API_BASE_URL}/psp/myAreas`;
  public static API_LOGIN_URL = `${GlobalConstants.API_BASE_URL}/user/login`;
  public static API_MENU_URL = `${GlobalConstants.API_BASE_URL}/app/menu`;
  public static API_NOTIF_URL = `${GlobalConstants.API_BASE_URL}/psp/notificaciones`;
  public static API_JUNTAS_URL = `${GlobalConstants.API_BASE_URL}/psp/juntas`;
  public static API_OTS_URL = `${GlobalConstants.API_BASE_URL}/psp/OTs`;
  public static API_REGISTER_URL = `${GlobalConstants.API_BASE_URL}/user/register`;
  public static API_REPORTE_URL = `${GlobalConstants.API_BASE_URL}/pspReports/reporte`;
  public static API_ROLES_URL = `${GlobalConstants.API_BASE_URL}/app/roles`;
  public static API_SERV_EJEC_URL = `${GlobalConstants.API_BASE_URL}/psp/areas`;
  public static API_TIPO_TAREAS_URL = `${GlobalConstants.API_BASE_URL}/psp/tiposTareas`;
  public static API_TAREAS_URL = `${GlobalConstants.API_BASE_URL}/psp/tareas`;
  public static API_TAREAS_OVERVIEW_URL = `${GlobalConstants.API_BASE_URL}/psp/tareasOverview`;
  public static API_TAREAS_FREQDIFF_URL = `${GlobalConstants.API_BASE_URL}/psp/tareasFreqDiff`;
  public static API_USUARIOS_URL = `${GlobalConstants.API_BASE_URL}/app/usuarios`;
  public static HTTP_TIMEOUT = 20000;



 // urls de los dasboards de Grafana
 // http://172.16.3.43:3000/d-solo/o8DrKF4Gk/homepage?orgId=1${this.filtro}&theme=light&panelId=4`;
 // http://172.16.3.43:3000/d-solo/o8DrKF4Gk/homepage?orgId=1${this.filtro}&theme=light&panelId=5`;


// 0.101.0.57:3003/d-solo/UKwkTCNGz/mediciones-juntas?orgId=1&var-Junta=${this.junta}&from=${epochIni}&to=${epochFin}&panelId=4&theme=light`
// 10.101.0.57:3003/d-solo/UKwkTCNGz/mediciones-juntas?orgId=1&var-Junta=${this.junta}&from=${epochIni}&to=${epochFin}&panelId=8&theme=light
// 10.101.0.57:3003/d-solo/UKwkTCNGz/mediciones-juntas?orgId=1&var-Junta=${this.junta}&from=${epochIni}&to=${epochFin}&panelId=7&theme=light
// 0.101.0.57:3003/d-solo/UKwkTCNGz/mediciones-juntas?orgId=1&var-Junta=${this.junta}&from=${epochIni}&to=${epochFin}&panelId=10&theme=light

  public static GRAFANA_THEME = `light`;
  public static GRAFANA_PORT = `3000`;
  public static GRAFANA_HOST = `172.16.3.43`;
  public static GRAFANA_BASE_URL = `http://${GlobalConstants.GRAFANA_HOST}:${GlobalConstants.GRAFANA_PORT}/d-solo`;
  public static GRAFANA_PARAM_FIJOS = `orgId=1&theme=${GlobalConstants.GRAFANA_THEME}`;

  public static GRAFANA_DASHBOARD_HOME = `o8DrKF4Gk/homepage`;
  public static GRAFANA_HOME_BASE = `${GlobalConstants.GRAFANA_BASE_URL}/${GlobalConstants.GRAFANA_DASHBOARD_HOME}?${GlobalConstants.GRAFANA_PARAM_FIJOS}`;
  public static GRAFANA_HOME_TAREAS_GAUGES = `${GlobalConstants.GRAFANA_HOME_BASE}@filtro_area@&panelId=4`;
  public static GRAFANA_HOME_TRABAJOS_GAUGES = `${GlobalConstants.GRAFANA_HOME_BASE}@filtro_area@&panelId=5`;
  public static GRAFANA_HOME_LAST_UPD = `${GlobalConstants.GRAFANA_HOME_BASE}&panelId=2`;

  public static GRAFANA_DASHBOARD_JUNTAS = `UKwkTCNGz/mediciones-juntas`;
  public static GRAFANA_JUNTAS_BASE = `${GlobalConstants.GRAFANA_BASE_URL}/${GlobalConstants.GRAFANA_DASHBOARD_JUNTAS}?${GlobalConstants.GRAFANA_PARAM_FIJOS}`;
  public static GRAFANA_JUNTA_X = `${GlobalConstants.GRAFANA_JUNTAS_BASE}&var-Junta=@junta@&from=@ini@&to=@fin@&panelId=4`;
  public static GRAFANA_JUNTA_Y = `${GlobalConstants.GRAFANA_JUNTAS_BASE}&var-Junta=@junta@&from=@ini@&to=@fin@&panelId=8`;
  public static GRAFANA_JUNTA_Z = `${GlobalConstants.GRAFANA_JUNTAS_BASE}&var-Junta=@junta@&from=@ini@&to=@fin@&panelId=7`;
  public static GRAFANA_JUNTA_T = `${GlobalConstants.GRAFANA_JUNTAS_BASE}&var-Junta=@junta@&from=@ini@&to=@fin@&panelId=10`;



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

  public static GRAFANA_HOME_TAREAS(filtro: string){
    return GlobalConstants.GRAFANA_HOME_TAREAS_GAUGES.replace('@filtro_area@', filtro);
  }

  public static GRAFANA_HOME_TRABAJOS(filtro: string){
    return GlobalConstants.GRAFANA_HOME_TRABAJOS_GAUGES.replace('@filtro_area@', filtro);
  }

  public static GRAFANA_JUNTAS_X(junta: string, epochIni: string, epochFin: string){
    return GlobalConstants.GRAFANA_JUNTA_X.replace('@junta@', junta).replace('@ini@', epochIni).replace('@fin@', epochFin);
  }

  public static GRAFANA_JUNTAS_Y(junta: string, epochIni: string, epochFin: string){
    return GlobalConstants.GRAFANA_JUNTA_Y.replace('@junta@', junta).replace('@ini@', epochIni).replace('@fin@', epochFin);
  }

  public static GRAFANA_JUNTAS_Z(junta: string, epochIni: string, epochFin: string){
    return GlobalConstants.GRAFANA_JUNTA_Z.replace('@junta@', junta).replace('@ini@', epochIni).replace('@fin@', epochFin);
  }

  public static GRAFANA_JUNTAS_T(junta: string, epochIni: string, epochFin: string){
    return GlobalConstants.GRAFANA_JUNTA_T.replace('@junta@', junta).replace('@ini@', epochIni).replace('@fin@', epochFin);
  }



}
