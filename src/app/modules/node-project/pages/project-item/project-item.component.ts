import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProjectItemComponent implements OnInit {
  content: string;

  constructor(private activatedRoute: ActivatedRoute) {
    this.content = '';
   }

  ngOnInit() {
    this.activatedRoute.data.subscribe(data => this.content = data['project'].content);
  }
}
