import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NodeProjectComponent } from './node-project.component';

describe('NodeProjectComponent', () => {
  let component: NodeProjectComponent;
  let fixture: ComponentFixture<NodeProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NodeProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NodeProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
