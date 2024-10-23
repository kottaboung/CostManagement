import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { masterData, masterDataEmployee, masterDataModule } from '../../core/interface/masterResponse.interface';
import { ModuleModalComponent } from '../modals/module-modal/module-modal.component';
import { DetailModalComponent } from '../modals/detail-modal/detail-modal.component';
import { ProjectDetail } from '../../core/interface/chartResponse.interface';
import { ProjectDetailComponent } from '../../features/home/pages/projects/project-detail/project-detail.component';
import { ProjectModalComponent } from '../modals/project-modal/project-modal.component';

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

  createProject(): NgbModalRef {
    return this.modalService.open(ProjectModalComponent, { backdrop: 'static', keyboard: false });
  }

  openDetail(monthDetail: ProjectDetail[], monthName: string): NgbModalRef {
    const modalRef = this.modalService.open(DetailModalComponent);

    modalRef.componentInstance.monthDetail = monthDetail; // Use monthDetail here
    modalRef.componentInstance.monthName = monthName;

    return modalRef;
}

  closeModal(modalRef: NgbModalRef): void {
    if (modalRef) {
      modalRef.close();
    }
  }
}
