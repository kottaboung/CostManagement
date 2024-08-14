import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { AboutComponent } from "./about.component";
import { CommonModule } from "@angular/common";
import { AboutRoutingModule } from "./about.routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SettingComponent } from "./pages/setting/setting.component";
import { HomeModule } from "../home/home.module";


@NgModule({
    declarations: [
        AboutComponent,
        SettingComponent
    ],
    imports: [
        CommonModule,
        AboutRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HomeModule,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AboutModule { }