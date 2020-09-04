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
import { CovalentModule } from './covalent.module';
import { AvatarModule } from 'ngx-avatar';

// Pass the fusioncharts library and chart modules
FusionChartsModule.fcRoot(FusionCharts, charts, Widgets, Gantt, FusionTheme);

@NgModule({
  declarations: [
    AppComponent,
    CommentsDialogBoxComponent,
    LoginComponent,
    NavbarComponent,
    NavbarItemsComponent,
    NavbarItemComponent,
    BlockTemplateComponent,
    HomeComponent,
    RegisterComponent,
    AreasSettingComponent,
    AreasDialogBoxComponent,
    TaskTypesDialogBoxComponent,
    TaskTypesSettingsComponent,
    TasksSettingComponent,
    TasksDialogBoxComponent,
    TasksOverviewComponent,
    GanttComponent,
    UsersSettingComponent,
    UsersDialogBoxComponent,
    FreqDiffComponent,
    MedicionesJuntasComponent
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
  entryComponents: [
    BlockTemplateComponent,
    AreasDialogBoxComponent,
    TaskTypesDialogBoxComponent
  ],
  providers: [
    AuthService,
    AuthGuard,
    NotificationService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true
    }


  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
