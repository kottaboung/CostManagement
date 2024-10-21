import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleModalComponent } from './module-modal.component';

describe('ModuleModalComponent', () => {
  let component: ModuleModalComponent;
  let fixture: ComponentFixture<ModuleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModuleModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
