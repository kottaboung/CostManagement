import { Component, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Projects, mockProjects } from '../../../mockup-data';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  public project: Projects | undefined;
  @Input() currentStep = 2;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');
    this.project = mockProjects.find(p => p.name === name);
    if (!this.project) {
      console.error('Project not found');
    }
  }

  onBackToProjects(): void {
    this.currentStep = 1; 
    this.router.navigate(['/projects']);
  }
}
