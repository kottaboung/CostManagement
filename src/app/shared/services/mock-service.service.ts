// mock-service.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Projects } from '../../features/home/mockup-data';


@Injectable({
  providedIn: 'root'
})
export class MockService {
  private mockProjectsUrl = '/assets/mockdata/mockData.json';

  constructor(private http: HttpClient) {}

  getMockProjects(): Observable<Projects[]> {
    return this.http.get<Projects[]>(this.mockProjectsUrl);
  }
}
