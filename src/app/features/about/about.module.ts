import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { AboutComponent } from "./about.component";
import { CommonModule } from "@angular/common";
import { AboutRoutingModule } from "./about.routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SettingComponent } from "./pages/setting/setting.component";
import { SharedModule } from "../../shared/shared.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";


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
        SharedModule,
        NgbModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AboutModule { }