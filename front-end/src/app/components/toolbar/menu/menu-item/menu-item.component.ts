import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';


@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit, OnChanges{
  @Input() item: any;
  @Input() expanded: boolean;
  @Output() snClose = new EventEmitter<string>();

  public selected: boolean;



  constructor() { }


  ngOnInit(): void {
    this.selected = this.expanded;
  }


  ngOnChanges(changes: SimpleChanges): void{
    this.selected = changes.expanded.currentValue;
  }

  objetizar(str: string): any {
    if (str) {
      return JSON.parse(str);
    } else {
      return null;
    }
  }

  seleccionar(action: boolean): void {
    if (action) {
      this.selected = true;
    }
    else {
      this.selected = this.expanded;
    }
  }

  public onSidenavClose(path: string): void {
    this.snClose.emit(path);
  }

}
