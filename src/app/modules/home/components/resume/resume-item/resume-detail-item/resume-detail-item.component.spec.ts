import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Resume } from 'src/app/modules/home/models/resume/resume.model';
import { TESTING_DECLARATIONS, TESTING_MODULES, TESTING_PROVIDERS } from 'src/app/spec/constants';

import { ResumeDetailItemComponent } from './resume-detail-item.component';

describe('ResumeDetailItemComponent', () => {
  let component: ResumeDetailItemComponent;
  let fixture: ComponentFixture<ResumeDetailItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [...TESTING_DECLARATIONS],
      imports: [...TESTING_MODULES],
      providers: [...TESTING_PROVIDERS]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ResumeDetailItemComponent);
    component = fixture.componentInstance;
    component.item = new Resume({ id: 0, d: '', e: '', s: new Date().toISOString(), t: '', u: '' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
