import { Component, Input, OnInit } from '@angular/core';
import { Projects } from '../../../mockup-interface';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { calculateTotalCost } from '../../../mockup-service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
})
export class ProjectDetailComponent implements OnInit {
  public project: Projects | undefined;
  @Input() currentStep = 2;
  public projectDetails: { label: string, value: string | number | any }[] = [];
  public page = 1;
  public pageName: string = "";
  projectName: string | null = null;
  @Input() Project: Projects | null = null;
  @Input() public active: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }

  ngOnInit(): void {
    // Load project based on the route parameter
    this.route.paramMap.subscribe(params => {
      this.projectName = params.get('name');
      if (this.projectName) {
        this.loadProject();
      }
    });
  }

  loadProject(): void {
    this.http.get<Projects[]>('../assets/mockdata/mockData.json').subscribe(data => {
      this.project = data.find(p => p.name === this.projectName);

      if (this.project) {
        const formattedDate = this.formatDate(this.project.createdDate);
        
        this.projectDetails = [
          { label: 'Name', value: this.project.name },
          { label: 'Cost', value: this.project.cost = calculateTotalCost(this.project) },
          { label: 'Created Date', value: formattedDate },
          { label: 'Status', value: this.project.status }
        ];
      } else {
        // Redirect or show a user-friendly message if the project is not found
        this.router.navigate(['/projects'], { queryParams: { error: 'not-found' } });
      }
    }, (error) => {
      console.error('Error loading project data:', error);
      this.router.navigate(['/projects'], { queryParams: { error: 'loading-error' } });
    });
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

  alert(value: number) {
    this.active = false;
    if (value === 1) {
      this.pageName = "Modules And Tasks";
    } else if (value === 2) {
      this.pageName = "Employees";
    }
  }
}
