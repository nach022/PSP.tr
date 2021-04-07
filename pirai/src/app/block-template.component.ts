import { Component } from '@angular/core';

@Component({
  selector: 'app-blockui',
  template: `
    <div class="block-ui-spinner">
			<div class="block-ui-template" height="100%">
        <img
          src="/assets/img/loading.svg"
          alt="Loading..."
          style="margin-left: auto; margin-right: auto; display: block;"
          height="150"
          width="150"
        >
			</div>
			<div class="message ng-star-inserted" style="position: relative; top: 25px;"> {{ message }} </div>
  `
})
export class BlockTemplateComponent {
  message: any;
}

