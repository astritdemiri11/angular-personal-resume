import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryCarouselItemComponent } from './library-carousel-item.component';

describe('LibraryCarouselItemComponent', () => {
  let component: LibraryCarouselItemComponent;
  let fixture: ComponentFixture<LibraryCarouselItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LibraryCarouselItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibraryCarouselItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
