import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { masterData, masterDataEmployee, masterDataModule } from '../../core/interface/masterResponse.interface';
import { ModuleModalComponent } from '../modals/module-modal/module-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private modalService: NgbModal) {}

  openModal(moduleData: masterDataModule | null, projectName: string): NgbModalRef {
    const modalRef = this.modalService.open(ModuleModalComponent);
    
    modalRef.componentInstance.projectName = projectName;
  
    if (moduleData) {
      modalRef.componentInstance.moduleData = moduleData;  // Edit mode
    } else {
      modalRef.componentInstance.moduleData = null;  // Create mode
    }
    
    return modalRef;
  }

  createModal(employees: masterDataEmployee[]): NgbModalRef {
    const modalRef = this.modalService.open(ModuleModalComponent);
  
    // Pass the entire array of employees to the modal component
    modalRef.componentInstance.totalEmployee = employees;
  
    return modalRef;
  }

  closeModal(modalRef: NgbModalRef): void {
    if (modalRef) {
      modalRef.close();
    }
  }
}
