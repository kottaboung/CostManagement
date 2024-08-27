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
  public projectDetails: { label: string, value: string | number | any }[] = [];
  public page = 1;
  constructor(private route: ActivatedRoute, private router: Router) { }
  

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name') ?? '';
    this.project = mockProjects.find(p => p.name === name);

    if (this.project) {
      const formattedDate = this.formatDate(this.project.createdDate);
      
      this.projectDetails = [
        { label: 'Name', value: this.project.name },
        { label: 'Cost', value: this.project.cost },
        { label: 'Created Date', value: formattedDate },
        { label: 'Status', value: this.project.status }
      ];
    } else {
      // Redirect or show a user-friendly message
      this.router.navigate(['/projects'], { queryParams: { error: 'not-found' } });
    }
  }

  private formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

  onBackToProjects(): void {
    this.currentStep = 1; 
    this.router.navigate(['/projects']);
  }
}
