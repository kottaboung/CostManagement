import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private projects = [];

  constructor() {}

  createProject(project: any): Observable<any> {
    this.projects.push();  // Store project locally or use API to save
    return of(project);
  }

  getProjects(): Observable<any[]> {
    return of(this.projects);  // Return the stored projects
  }
}
