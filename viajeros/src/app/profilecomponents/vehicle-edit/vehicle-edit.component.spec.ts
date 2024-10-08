import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleEditComponent } from './vehicle-edit.component';

describe('VehicleEditComponent', () => {
  let component: VehicleEditComponent;
  let fixture: ComponentFixture<VehicleEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VehicleEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehicleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
