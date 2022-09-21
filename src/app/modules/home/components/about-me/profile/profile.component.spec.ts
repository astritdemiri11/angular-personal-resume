import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TESTING_DECLARATIONS, TESTING_MODULES, TESTING_PROVIDERS } from 'src/app/spec/constants';

import { Contact } from '../../../models/contact/contact.model';
import { Profile } from '../../../models/profile/profile.model';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [...TESTING_DECLARATIONS],
      imports: [...TESTING_MODULES],
      providers: [...TESTING_PROVIDERS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    component.contact = new Contact({ a: [], e: [], p: [] });
    component.profile = new Profile({ b: '', d: new Date().toISOString(), l: [], n: '', p: '', s: '' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
