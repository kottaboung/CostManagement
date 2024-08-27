import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleTasksDetailComponent } from './module-tasks-detail.component';

describe('ModuleTasksDetailComponent', () => {
  let component: ModuleTasksDetailComponent;
  let fixture: ComponentFixture<ModuleTasksDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModuleTasksDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleTasksDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
