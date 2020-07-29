import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { AreasSettingComponent } from './components/areas-setting/areas-setting.component';
import { AuthGuard } from './guards/auth.guard';
import { TaskTypesSettingsComponent } from './components/task-types-settings/task-types-settings.component';
import { TasksSettingComponent } from './components/tasks-setting/tasks-setting.component';
import { TasksOverviewComponent } from './components/tasks-overview/tasks-overview.component';
import { GanttComponent } from './components/gantt/gantt.component';
import { RegisterGuard } from './guards/register.guard';
import { UsersSettingComponent } from './components/users-setting/users-setting.component';


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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
