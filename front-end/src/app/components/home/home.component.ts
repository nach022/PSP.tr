import { Component, OnInit } from '@angular/core';
import { IframeTrackerDirective } from './iframe-tracker.directive';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})



export class HomeComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }


  navegarTareas(){
    alert('click');
  }

}
