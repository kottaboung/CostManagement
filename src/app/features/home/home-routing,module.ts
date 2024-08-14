import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home.component";
import path from "path";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { ProjectsComponent } from "./pages/projects/projects.component";
import { UserComponent } from "./pages/user/user.component";
import { NgModule } from "@angular/core";



const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
          {
            path: 'dashboard',
            component: DashboardComponent,
          },
          {
            path: 'projects',
            component: ProjectsComponent,
          },
          {
            path: 'user',
            component: UserComponent,
          },
          {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full',
          }
        ]
      }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }