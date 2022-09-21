import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryIndexComponent } from './library-index.component';

describe('LibraryIndexComponent', () => {
  let component: LibraryIndexComponent;
  let fixture: ComponentFixture<LibraryIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibraryIndexComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
