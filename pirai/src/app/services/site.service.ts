import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { GlobalConstants } from '../common/global.constants';

@Injectable({
  providedIn: 'root'
})
export class SiteService {
  constructor(private http: HttpClient) { }

  // SELECT
  getProfundidades(){
    return this.http.get<any>(GlobalConstants.API_PROFUND_URL);
  }

  // UPDATE
  putProfundidad(profData: any) {
    return this.http.put(`${GlobalConstants.API_PROFUND_URL}/${profData.Id}`, {Nombre: profData.Nombre});
  }

  // INSERT
  postProfundidad(profData: any) {
    return this.http.post(GlobalConstants.API_PROFUND_URL, {Nombre: profData.Nombre});
  }

  // DELETE
  deleteProfundidad(profData: any) {
    return this.http.delete(`${GlobalConstants.API_PROFUND_URL}/${profData.Id}`);
  }





  getMenu() {
    return this.http.get<any>(GlobalConstants.API_MENU_URL);
  }



}
