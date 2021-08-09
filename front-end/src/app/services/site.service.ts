import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { GlobalConstants } from '../common/global.constants';
import { TareaDataInterface } from '../components/settings/tasks-setting/tasks-setting.component';
import { tipoInterface } from '../components/settings/task-types-settings/task-types-settings.component';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  postReporte(area: number, comentario: string[], ini: Date, fin: Date) {

    let texts = comentario.map(x=> x ? x.trim() : '');
    return this.http.post(`${GlobalConstants.API_REPORTE_URL}/${area}`,
      {
        comments: texts,
        inicio: ini,
        fin: fin
      },
      {
        responseType: 'blob'
      })
  }

  constructor(private http: HttpClient) { }

  getOTs(idTarea: string) {
    const params = new HttpParams().set('TareaId', idTarea);
    return this.http.get<any>(GlobalConstants.API_OTS_URL, { params });
  }

  getEjecucionesFuturas(idTarea: string) {
    const params = new HttpParams().set('TareaId', idTarea);
    return this.http.get<any>(GlobalConstants.API_EJEC_FUTURAS_URL, { params });
  }

  getCommentsTarea(IdTarea: number) {
    const params = new HttpParams().set('TareaId', IdTarea.toString());
    return this.http.get<any>(GlobalConstants.API_COMMENTS_URL, { params });
  }

  postCommentTarea(IdTarea: number, commentText: string) {
    return this.http.post(GlobalConstants.API_COMMENTS_URL, { IdTarea, commentText: commentText.trim() });
  }

  deleteComentarioTarea(Id: number) {
    return this.http.delete(`${GlobalConstants.API_COMMENTS_URL}/${Id}`);
  }


  getJuntas() {
    return this.http.get<any>(GlobalConstants.API_JUNTAS_URL);
  }


  // Función para recuperar el menú de la aplicación, dependiendo del rol del usuario
  getNavbar(){
    return this.http.get<any>(GlobalConstants.API_MENU_URL);
  }

  // Función para obtener notificaciones del usuario
  getNotifications(){
    return this.http.get<any>(GlobalConstants.API_NOTIF_URL);
  }

  /************* Grupos de Acción *************/

  // SELECT
  getServiciosEjecutores(){
    return this.http.get<any>(GlobalConstants.API_SERV_EJEC_URL);
  }

  // UPDATE
  putServicioEjecutor(servData: any) {
    return this.http.put(`${GlobalConstants.API_SERV_EJEC_URL}/${servData.Id}`, {Nombre: servData.Nombre});
  }

  // INSERT
  postServicioEjecutor(servData: any) {
    return this.http.post(GlobalConstants.API_SERV_EJEC_URL, {Nombre: servData.Nombre});
  }

  // DELETE
  deleteServicioEjecutor(servData: any) {
    return this.http.delete(`${GlobalConstants.API_SERV_EJEC_URL}/${servData.Id}`);
  }




  /************* Tipos de Tareas *************/
  // SELECT
  getTiposTareas() {
    return this.http.get<any>(GlobalConstants.API_TIPO_TAREAS_URL);
  }

  // INSERT
  postTipoTarea(tareaData: any) {
    return this.http.post<tipoInterface>(GlobalConstants.API_TIPO_TAREAS_URL, tareaData);
  }


  // UPDATE
  putTipoTarea(tareaData: any) {
    return this.http.put(`${GlobalConstants.API_TIPO_TAREAS_URL}/${tareaData.Id}`,
                          {
                            Nombre: tareaData.Nombre,
                            Responsable: tareaData.Responsable
                          });
  }


  // DELETE
  deleteTipoTarea(tareaData: any) {
    return this.http.delete(`${GlobalConstants.API_TIPO_TAREAS_URL}/${tareaData.Id}`);
  }



  /************* Tareas *************/
  // SELECT
  getTareas() {
    return this.http.get<any>(GlobalConstants.API_TAREAS_URL);
  }

  getTarea(id: any) {
    return this.http.get<any>(`${GlobalConstants.API_TAREAS_URL}/${id}`);
  }

  // SELECT extendido.
  getTareasOverview() {
    return this.http.get<any>(GlobalConstants.API_TAREAS_OVERVIEW_URL);
  }

  // SELECT tareas con incoherencia de frecuencias
  getTareasFreqDiff() {
    return this.http.get<any>(GlobalConstants.API_TAREAS_FREQDIFF_URL);
  }



  // INSERT
  postTarea(tarea: any) {
    return this.http.post<TareaDataInterface>(GlobalConstants.API_TAREAS_URL, tarea);
  }


  // UPDATE
  putTarea(tareaData: any) {
    return this.http.put<TareaDataInterface>(`${GlobalConstants.API_TAREAS_URL}/${tareaData.Id}`, {
            Descr: tareaData.Descr,
            Frecuencia: tareaData.Frecuencia,
            Periodo: tareaData.Periodo,
            TipoTareaId: tareaData.TipoTareaId,
            Equipo: tareaData.Equipo,
            PPM: tareaData.PPM
          });
  }


  // DELETE
  deleteTarea(tareaData: any) {
    return this.http.delete(`${GlobalConstants.API_TAREAS_URL}/${tareaData.Id}`);
  }



  /************* Usuarios *************/

  // SELECT
  getUsuarios() {
    return this.http.get<any>(GlobalConstants.API_USUARIOS_URL);
  }

  // UPDATE
  putUsuario(usuario: { Id: number; Nombre: string; Roles: number[]; }) {
    return this.http.put(`${GlobalConstants.API_USUARIOS_URL}/${usuario.Id}`, usuario);
  }

  // DELETE
  deleteUsuario(usuario: any) {
    return this.http.delete(`${GlobalConstants.API_USUARIOS_URL}/${usuario.Id}`);
  }



  /************* Roles *************/

  // SELECT
  getRoles() {
    return this.http.get<any>(GlobalConstants.API_ROLES_URL);
  }


}
