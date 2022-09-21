import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TESTING_DECLARATIONS, TESTING_MODULES, TESTING_PROVIDERS } from 'src/app/spec/constants';

import { ContactItemComponent } from './contact-item.component';

describe('ContactItemComponent', () => {
  let component: ContactItemComponent;
  let fixture: ComponentFixture<ContactItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [...TESTING_DECLARATIONS],
      imports: [...TESTING_MODULES],
      providers: [...TESTING_PROVIDERS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactItemComponent);
    component = fixture.componentInstance;
    component.label = 'test';
    component.icon = 'test';
    component.values = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
