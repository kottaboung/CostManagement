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


@NgModule({
    declarations: [
    HomeComponent,
    DashboardComponent,
    ProjectsComponent,
    UserComponent,
    ChartDetailComponent,
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