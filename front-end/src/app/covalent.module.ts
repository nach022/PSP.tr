import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CovalentCommonModule } from '@covalent/core/common';
import { CovalentDataTableModule } from '@covalent/core/data-table';
import { CovalentDialogsModule } from '@covalent/core/dialogs';
import { CovalentExpansionPanelModule } from '@covalent/core/expansion-panel';
import { CovalentLayoutModule } from '@covalent/core/layout';
import { CovalentLoadingModule } from '@covalent/core/loading';
import { CovalentMediaModule } from '@covalent/core/media';
import { CovalentMenuModule } from '@covalent/core/menu';
import { CovalentMessageModule } from '@covalent/core/message';
import { CovalentNotificationsModule } from '@covalent/core/notifications';
import { CovalentPagingModule } from '@covalent/core/paging';
import { CovalentSearchModule } from '@covalent/core/search';
import { CovalentStepsModule } from '@covalent/core/steps';



@NgModule({
  imports: [
    CommonModule,
    CovalentCommonModule,
    CovalentDataTableModule,
    CovalentDialogsModule,
    CovalentExpansionPanelModule,
    CovalentLayoutModule,
    CovalentLoadingModule,
    CovalentMediaModule,
    CovalentMenuModule,
    CovalentMessageModule,
    CovalentNotificationsModule,
    CovalentPagingModule,
    CovalentSearchModule,
    CovalentStepsModule
  ],
  exports: [
    CommonModule,
    CovalentCommonModule,
    CovalentDataTableModule,
    CovalentDialogsModule,
    CovalentExpansionPanelModule,
    CovalentLayoutModule,
    CovalentLoadingModule,
    CovalentMediaModule,
    CovalentMenuModule,
    CovalentMessageModule,
    CovalentNotificationsModule,
    CovalentPagingModule,
    CovalentSearchModule,
    CovalentStepsModule
  ]
})

export class CovalentModule { }
