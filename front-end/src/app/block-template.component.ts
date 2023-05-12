import { Component } from '@angular/core';

@Component({
  selector: 'block-temp',
  template: `
    <div class="block-ui-spinner" style="position: absolute;  top: 45%;  left: 50%;  transform: translate(-50%, -50%);">
			<div class="block-ui-template" style="text-align: center;">
      <img
          src="/assets/img/iso.svg"
          alt="Loading..."
          height="115"
        >
			</div>
			<div class="message ng-star-inserted" style="text-align: center; position: relative; top: 60px;"> {{ message }} </div>
    </div>
  `
})
export class BlockTemplateComponent {
  message: any;
}

