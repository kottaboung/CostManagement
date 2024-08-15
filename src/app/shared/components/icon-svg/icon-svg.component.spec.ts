import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconSvgComponent } from './icon-svg.component';

describe('IconSvgComponent', () => {
  let component: IconSvgComponent;
  let fixture: ComponentFixture<IconSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IconSvgComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
