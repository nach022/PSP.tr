import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-logoff',
  templateUrl: './logoff.component.html',
  styleUrls: ['./logoff.component.css']
})
export class LogoffComponent implements OnInit {
  NombreUsuario = 'Nacho';
  RolUsuario = [];
  notificaciones: {icon: string, text: string, func: string, color: string, path: string}[] = [];

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  cerrarSesion() {
    this.auth.logOff();
  }

}
