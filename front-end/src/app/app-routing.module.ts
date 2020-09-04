import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/users/login/login.component';
import { RegisterComponent } from './components/users/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AreasSettingComponent } from './components/settings/areas-setting/areas-setting.component';
import { AuthGuard } from './guards/auth.guard';
import { TaskTypesSettingsComponent } from './components/settings/task-types-settings/task-types-settings.component';
import { TasksSettingComponent } from './components/settings/tasks-setting/tasks-setting.component';
import { TasksOverviewComponent } from './components/tasks/tasks-overview/tasks-overview.component';
import { GanttComponent } from './components/tasks/gantt/gantt.component';
import { RegisterGuard } from './guards/register.guard';
import { UsersSettingComponent } from './components/settings/users-setting/users-setting.component';
import { FreqDiffComponent } from './components/tasks/freq-diff/freq-diff.component';
import { MedicionesJuntasComponent } from './components/presa/mediciones-juntas/mediciones-juntas.component';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent, canActivate: [RegisterGuard] },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'users-setting', component: UsersSettingComponent, canActivate: [AuthGuard] },
  { path: 'areas-setting', component: AreasSettingComponent, canActivate: [AuthGuard] },
  { path: 'task-types-setting', component: TaskTypesSettingsComponent, canActivate: [AuthGuard] },
  { path: 'tasks-setting', component: TasksSettingComponent, canActivate: [AuthGuard] },
  { path: 'tasks-overview', component: TasksOverviewComponent, canActivate: [AuthGuard] },
  { path: 'gantt', component: GanttComponent, canActivate: [AuthGuard] },
  { path: 'freq-diff', component: FreqDiffComponent, canActivate: [AuthGuard] },
  { path: 'mediciones-juntas', component: MedicionesJuntasComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
