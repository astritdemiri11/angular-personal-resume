import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TESTING_DECLARATIONS, TESTING_MODULES, TESTING_PROVIDERS } from 'src/app/spec/constants';

import { Skill } from '../../../models/skill/skill.model';
import { SkillItemComponent } from './skill-item.component';

describe('SkillItemComponent', () => {
  let component: SkillItemComponent;
  let fixture: ComponentFixture<SkillItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [...TESTING_DECLARATIONS],
      imports: [...TESTING_MODULES],
      providers: [...TESTING_PROVIDERS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillItemComponent);
    component = fixture.componentInstance;
    component.item = new Skill({ id: 0, p: 0, t: '' });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
