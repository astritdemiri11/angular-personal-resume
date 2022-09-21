import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-blog-item',
  templateUrl: './blog-item.component.html',
  styleUrls: ['./blog-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BlogItemComponent implements OnInit {
  content: string;

  private subscriptions: Subscription[];

  constructor(private activatedRoute: ActivatedRoute) {
    this.subscriptions = [];
    this.content = '';
   }

  ngOnInit() {
    this.subscriptions.push(this.activatedRoute.data.subscribe(data => this.content = data['blog'].content));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
