import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-library-item',
  templateUrl: './library-item.component.html',
  styleUrls: ['./library-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LibraryItemComponent implements OnInit {
  content: string;

  constructor(private activatedRoute: ActivatedRoute) {
    this.content = '';
   }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => this.content = data['library'].content);
  }
}
