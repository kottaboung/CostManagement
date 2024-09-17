import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      employees: this.fb.array([])
    });
  }

  get employees(): FormArray {
    return this.projectForm.get('employees') as FormArray;
  }

  get startDate() {
    return this.projectForm.get('startDate')?.value;
  }

  get endDate() {
    return this.projectForm.get('endDate')?.value;
  }

  addEmployee(employeeNameInput: HTMLInputElement, employeeCostInput: HTMLInputElement): void {
    if (employeeNameInput.value && employeeCostInput.value) {
      const employeeGroup = this.fb.group({
        employeeName: [employeeNameInput.value, Validators.required],
        employeeCost: [employeeCostInput.value, Validators.required]
      });
  
      this.employees.push(employeeGroup);
  
      // Reset the input fields after adding the employee
      employeeNameInput.value = '';
      employeeCostInput.value = '';
    }
  }

  // Remove employee from the FormArray
  removeEmployee(index: number): void {
    this.employees.removeAt(index);
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
