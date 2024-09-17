import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-project-modal',
  templateUrl: './project-modal.component.html',
  styleUrl: './project-modal.component.scss'
})
export class ProjectModalComponent {
  projectForm: FormGroup;
  minDate = Date.now();
  todate = new Date().toString().split('T')[0]; 

  @Output() projectCreated = new EventEmitter<any>();

  constructor(private fb: FormBuilder,
    public dialogRef: MatDialogRef<ProjectModalComponent>
  ) {
    this.projectForm = this.fb.group({
      projectName: ['', Validators.required],
      startDate: [this.minDate, Validators.required],
      endDate: ['', Validators.required],
      employee: ['', Validators.required]
    });
  }

  get startDate() {
    return this.projectForm.get('startDate')?.value;
  }

  get endDate() {
    return this.projectForm.get('endDate')?.value;
  }

  onSubmit() {
    if (this.projectForm.valid) {
      this.projectCreated.emit(this.projectForm.value);
      this.closeModal();
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
