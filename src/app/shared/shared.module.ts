import { NgModule } from "@angular/core";

import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IconSvgComponent } from "./components/icon-svg/icon-svg.component";
import { IconColorPipe } from "./pipe/icon-color.pipe";
import { IconSizePipe } from "./pipe/icon-size.pipe";
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from "ngx-mask";



@NgModule({
    declarations:[
        IconSvgComponent,
        IconColorPipe,
        IconSizePipe,
    ],
    imports:[
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxMaskDirective,
        NgxMaskPipe
    ],
    exports:[
        IconSvgComponent,
        IconSizePipe,
        IconColorPipe,
    ],
    providers:[
        provideNgxMask(),
        IconColorPipe,
        IconSizePipe,
    ]
})
export class SharedModule { }