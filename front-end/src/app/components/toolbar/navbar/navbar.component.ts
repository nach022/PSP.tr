import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  NombreUsuario : string = '';
  RolUsuario : string = '';

  constructor(private _auth: AuthService) {}

  ngOnInit(): void {
    this.NombreUsuario = sessionStorage.getItem('psp-name');
    this.RolUsuario = sessionStorage.getItem('psp-rol');
  }
  cerrarSesion(){
    this._auth.logOff();
  }

}
