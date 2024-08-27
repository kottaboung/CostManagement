import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { HomeComponent } from "./home.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { ProjectsComponent } from "./pages/projects/projects.component";
import { UserComponent } from "./pages/user/user.component";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HomeRoutingModule } from "./home-routing,module";
import { SharedModule } from "../../shared/shared.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ChartDetailComponent } from './modals/chart-detail/chart-detail.component';
import { MatDialogModule } from "@angular/material/dialog";
import { ProjectDetailComponent } from './pages/projects/project-detail/project-detail.component';
import { ModuleTasksDetailComponent } from './pages/projects/project-detail/pages/module-tasks-detail/module-tasks-detail.component';
import { EmployeesComponent } from './pages/projects/project-detail/pages/employees/employees.component';


@NgModule({
    declarations: [
    HomeComponent,
    DashboardComponent,
    ProjectsComponent,
    UserComponent,
    ChartDetailComponent,
    ProjectDetailComponent,
    ModuleTasksDetailComponent,
    EmployeesComponent,
    ],
    imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HomeRoutingModule,
    SharedModule,
    NgbModule,
    
    MatDialogModule
],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeModule { }