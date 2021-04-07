import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobalConstants } from './common/global.constants';
import { BlockUIModule } from 'ng-block-ui';
import { BlockTemplateComponent } from './block-template.component';
import { AngularMaterialModule } from './angular-material.module';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { ToastrModule } from 'ngx-toastr';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { MenuComponent } from './components/menu/menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { JwtInterceptorService } from './services/jwt-interceptor.service';
import { LogoffComponent } from './components/logoff/logoff.component';
import { ProfundidadesSettingComponent } from './components/programas/profundidades-setting/profundidades-setting.component';
import { ProfundDialogBoxComponent } from './components/programas/profundidades-setting/profund-dialog-box/profund-dialog-box.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LogoffComponent,
    MenuComponent,
    RegisterComponent,
    HomeComponent,
    BlockTemplateComponent,
    ProfundidadesSettingComponent,
    ProfundDialogBoxComponent
  ],
  imports: [
    DragDropModule,
    BrowserModule,
    AppRoutingModule,
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
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    FlexLayoutModule
  ],
  entryComponents: [
    BlockTemplateComponent,
    ProfundDialogBoxComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
