import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AboutComponent } from "./about.component";
import { SettingComponent } from "./pages/setting/setting.component";


const routes: Routes =[
    {
        path: '',
        component: AboutComponent,
        children: [
            {
                path: 'setting',
                component: SettingComponent
            }
        ]
    }
];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule],
})
export class AboutRoutingModule { }