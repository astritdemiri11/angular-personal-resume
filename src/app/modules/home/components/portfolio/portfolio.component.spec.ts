import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TESTING_DECLARATIONS, TESTING_MODULES, TESTING_PROVIDERS } from 'src/app/spec/constants';

import { PortfolioComponent } from './portfolio.component';

describe('PortfolioComponent', () => {
  let component: PortfolioComponent;
  let fixture: ComponentFixture<PortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [...TESTING_DECLARATIONS],
      imports: [...TESTING_MODULES],
      providers: [...TESTING_PROVIDERS]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
