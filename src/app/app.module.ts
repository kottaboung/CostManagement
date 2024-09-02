import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeModule } from './features/home/home.module';
import { AboutModule } from './features/about/about.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { MyInterceptor } from './my-interceptor.interceptor';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbNavModule,
    NgbModule,
    HomeModule,
    AboutModule,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS, 
      useClass: MyInterceptor, 
      multi: true
  }
   
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
