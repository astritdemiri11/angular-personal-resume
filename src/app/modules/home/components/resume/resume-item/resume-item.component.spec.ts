import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TESTING_DECLARATIONS, TESTING_MODULES, TESTING_PROVIDERS } from 'src/app/spec/constants';

import { ResumeItemComponent } from './resume-item.component';

describe('ResumeItemComponent', () => {
  let component: ResumeItemComponent;
  let fixture: ComponentFixture<ResumeItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [...TESTING_DECLARATIONS],
      imports: [...TESTING_MODULES],
      providers: [...TESTING_PROVIDERS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResumeItemComponent);
    component = fixture.componentInstance;
    component.icon = 'test';
    component.item = [];
    component.title = 'test';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
