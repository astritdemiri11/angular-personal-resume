import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomSettingsComponent } from './bottom-settings.component';

describe('BottomSettingsComponent', () => {
  let component: BottomSettingsComponent;
  let fixture: ComponentFixture<BottomSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BottomSettingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BottomSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
