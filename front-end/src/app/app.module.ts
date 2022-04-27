import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularMaterialModule } from './angular-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BlockUIModule } from 'ng-block-ui';
import { BlockTemplateComponent } from './block-template.component';
import { ToastrModule } from 'ngx-toastr';
import { FusionChartsModule } from 'angular-fusioncharts';

// Import FusionCharts library and chart modules
import * as FusionCharts from 'fusioncharts';
import * as charts from 'fusioncharts/fusioncharts.charts';
import * as FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import * as Widgets from 'fusioncharts/fusioncharts.widgets.js';
import * as Gantt from 'fusioncharts/fusioncharts.gantt.js';



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/users/login/login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/toolbar/navbar/navbar.component';
import { NavbarItemsComponent } from './components/toolbar/navbar-items/navbar-items.component';
import { NavbarItemComponent } from './components/toolbar/navbar-item/navbar-item.component';
import { AuthService } from './services/auth.service';
import { NotificationService } from './services/notification.service';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/users/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { GlobalConstants } from './common/global.constants';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { AreasSettingComponent } from './components/settings/areas-setting/areas-setting.component';
import { AreasDialogBoxComponent } from './components/settings/areas-setting/areas-dialog-box/areas-dialog-box.component';
import { TaskTypesSettingsComponent } from './components/settings/task-types-settings/task-types-settings.component';
import { TaskTypesDialogBoxComponent } from './components/settings/task-types-settings/task-types-dialog-box/task-types-dialog-box.component';
import { TasksSettingComponent } from './components/settings/tasks-setting/tasks-setting.component';
import { TasksDialogBoxComponent } from './components/settings/tasks-setting/tasks-dialog-box/tasks-dialog-box.component';
import { TasksOverviewComponent } from './components/tasks/tasks-overview/tasks-overview.component';
import { GanttComponent } from './components/tasks/gantt/gantt.component';
import { UsersSettingComponent } from './components/settings/users-setting/users-setting.component';
import { UsersDialogBoxComponent } from './components/settings/users-setting/users-dialog-box/users-dialog-box.component';
import { FreqDiffComponent } from './components/tasks/freq-diff/freq-diff.component';
import { MedicionesJuntasComponent } from './components/presa/mediciones-juntas/mediciones-juntas.component';
import { CommentsDialogBoxComponent } from './components/tasks/tasks-overview/comments-dialog-box/comments-dialog-box.component';
import { DeleteCommentDialogBoxComponent } from './components/tasks/tasks-overview/delete-comment-dialog-box/delete-comment-dialog-box.component';
import { CovalentModule } from './covalent.module';
import { AvatarModule } from 'ngx-avatar';
import { RptGrupoAccionComponent } from './components/reports/rpt-grupo-accion/rpt-grupo-accion.component';
import { TaskEjecucionesComponent } from './components/tasks/task-ejecuciones/task-ejecuciones.component';

import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core'
import 'moment/locale/es';
import { LogoffComponent } from './components/toolbar/logoff/logoff.component';
import { MenuComponent } from './components/toolbar/menu/menu.component';
import { MenuItemComponent } from './components/toolbar/menu/menu-item/menu-item.component';
import { FreqDiffDialogBoxComponent } from './components/tasks/freq-diff/freq-diff-dialog-box/freq-diff-dialog-box.component';
import { RptPeriodicoComponent } from './components/reports/rpt-periodico/rpt-periodico.component';
export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};



// Pass the fusioncharts library and chart modules
FusionChartsModule.fcRoot(FusionCharts, charts, Widgets, Gantt, FusionTheme);

@NgModule({
    declarations: [
        AppComponent,
        AreasDialogBoxComponent,
        AreasSettingComponent,
        BlockTemplateComponent,
        CommentsDialogBoxComponent,
        DeleteCommentDialogBoxComponent,
        FreqDiffComponent,
        FreqDiffDialogBoxComponent,
        GanttComponent,
        HomeComponent,
        LoginComponent,
        LogoffComponent,
        MedicionesJuntasComponent,
        MenuComponent,
        MenuItemComponent,
        NavbarComponent,
        NavbarItemComponent,
        NavbarItemsComponent,
        RegisterComponent,
        RptGrupoAccionComponent,
        RptPeriodicoComponent,
        TaskEjecucionesComponent,
        TasksDialogBoxComponent,
        TasksOverviewComponent,
        TasksSettingComponent,
        TaskTypesDialogBoxComponent,
        TaskTypesSettingsComponent,
        UsersDialogBoxComponent,
        UsersSettingComponent,
    ],
    imports: [
        FusionChartsModule,
        BlockUIModule.forRoot({
            template: BlockTemplateComponent
        }),
        ToastrModule.forRoot({
            closeButton: GlobalConstants.APP_NOTIF_CLOSE_BUTTON,
            timeOut: GlobalConstants.APP_NOTIF_DURATION,
            preventDuplicates: GlobalConstants.APP_NOTIF_PREVENT_DUPLICATES,
            progressBar: GlobalConstants.APP_NOTIF_PROGRESS_BAR,
            progressAnimation: GlobalConstants.APP_NOTIF_PROGRESS_STYLE,
            positionClass: GlobalConstants.APP_NOTIF_POSITION
        }),
        AngularMaterialModule,
        CovalentModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        AvatarModule
    ],
    providers: [
        AuthService,
        AuthGuard,
        NotificationService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptorService,
            multi: true
        },
        { provide: MAT_DATE_LOCALE, useValue: 'es' },
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
        },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
    bootstrap: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
