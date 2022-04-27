import { Component, OnInit } from '@angular/core';
import { SiteService } from 'src/app/services/site.service';
import { NgBlockUI, BlockUI } from 'ng-block-ui';
import { saveAs } from 'file-saver';
import {FormGroup, FormControl} from '@angular/forms';
import * as moment from 'moment';



@Component({
  selector: 'app-rpt-periodico',
  templateUrl: './rpt-periodico.component.html',
  styleUrls: ['./rpt-periodico.component.css'],
  providers: [

  ],
})
export class RptPeriodicoComponent implements OnInit {

  range = new FormGroup({
    start: new FormControl(moment()),
    end: new FormControl(moment())
  });



  constructor(private siteService: SiteService) { }
  @BlockUI() blockUI: NgBlockUI;
  public isDataLoaded = false;
  public grupos: any;
  public area: number;
  public inicio: Date;
  public fin: Date;


  ngOnInit(): void {
    this.blockUI.start('Cargando Grupos de Acción...');
    this.siteService.getGruposRptPeriodico().subscribe(
      res => {
        this.grupos = res;
        this.isDataLoaded = true;
        console.log(this.grupos);
        if(res.length == 1){
          this.area = res[0].Id;
        }
        this.blockUI.stop();
      },
      () => {
        this.blockUI.stop();
      }
    );
  }

  generarReporte(){
    console.log(this.area);
    const nombre = (this.grupos.find(x => x.Id === this.area)).Descr;
    this.siteService.postReportePeriodico(this.area, this.inicio, this.fin).subscribe(
      res => {
        saveAs(res, `Informe Periódico PSP - ${nombre}.docx`);
        this.blockUI.stop();
        console.log(res);

      },
      err => {
        console.log(err);
        this.blockUI.stop();
      }
    );
  }

}
