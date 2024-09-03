import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MyInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Modify request here if needed
    const modifiedReq = req.clone({
      // Example: add a custom header
      headers: req.headers.set('Authorization', 'Bearer your-token-here')
    });

    return next.handle(modifiedReq);
  }
}
