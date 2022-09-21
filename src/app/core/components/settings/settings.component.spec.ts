import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TESTING_DECLARATIONS, TESTING_MODULES, TESTING_PROVIDERS } from 'src/app/spec/constants';

import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [...TESTING_DECLARATIONS],
      imports: [...TESTING_MODULES],
      providers: [...TESTING_PROVIDERS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
