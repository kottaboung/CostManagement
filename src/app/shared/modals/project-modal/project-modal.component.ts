import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { ApiResponse } from '../../../core/interface/response.interface';
import { map } from 'rxjs';
import { masterData, masterDataEmployee, masterDataModule } from '../../../core/interface/masterResponse.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-project-modal',
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.scss'
})
export class ProjectModalComponent {
  projectForm: FormGroup;
  minDate = Date.now();
  todate = new Date().toISOString().split('T')[0];

  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private apiserive: ApiService,
    public activeModal: NgbActiveModal
  ) {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      startDate: [this.todate, Validators.required],
      endDate: ['', Validators.required],
    }, { validators: this.dateValidator });
  }

  get startDate() {
    return this.projectForm.get('startDate')?.value;
  }

  get endDate() {
    return this.projectForm.get('endDate')?.value;
  }

  showPicker(dateControl: string) {
    const input = document.getElementById(dateControl) as HTMLInputElement;
    if (input) {
      input.focus();
      input.click();
    }
  }

  dateValidator(form: FormGroup) {
    const startDate = form.get('startDate')?.value;
    const endDate = form.get('endDate')?.value;
    if (endDate && startDate && endDate < startDate) {
      return { endDateInvalid: true };
    }
    return null;
  }

  isEndDateInvalid(): boolean {
    const startDate = this.projectForm.get('startDate')?.value;
    const endDate = this.projectForm.get('endDate')?.value;
    return endDate < startDate && endDate !== '';
  }

  addProject(): void {
    const { projectName , startDate, endDate } = this.projectForm.value;
    const newProject: any = {
      "ProjectName": projectName,
      "ProjectStart": startDate,
      "ProjectEnd": endDate,
      "ProjectStatus": false
    }
    this.apiserive.postApi<masterData, {ProjectName: string, startDate: Date}>('addprojects', newProject).subscribe({
      next: (res: ApiResponse<masterData>) => {
        if(res.status === 'success') {
          console.log('body', res.data);
          this.activeModal.close(res.data);
        } else {
          console.error(res.message);
        }
      },
      error: (error) => {
        console.error(error);
      }
    })
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      this.addProject();
    }
  }

  closeModal(): void {
    this.activeModal.dismiss('Cancel click');  
  }
}
