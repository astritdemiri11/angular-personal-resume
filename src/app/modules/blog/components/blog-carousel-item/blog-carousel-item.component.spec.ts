import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogCarouselItemComponent } from './blog-carousel-item.component';

describe('BlogCarouselItemComponent', () => {
  let component: BlogCarouselItemComponent;
  let fixture: ComponentFixture<BlogCarouselItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlogCarouselItemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogCarouselItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
