import { Component, OnInit } from '@angular/core';
import { PublicService } from './../app-service/public.service';
import { AppRoutes } from '../constant/routes';
@Component({
  selector: 'app-community-bar',
  templateUrl: './community-bar.component.html',
  // styleUrls: ['./community-bar.component.scss']
})
export class CommunityBarComponent implements OnInit {
  AppRoutes = AppRoutes;
  communitys = [];
  constructor(private publicService: PublicService) { }

  ngOnInit(): void {
    // fake
    this.communitys = [
      {
        name: 'customerService',
        icon: '/nt1_web/assets/img/notice.svg',
        url: '',
      },
      {
        name: 'line',
        icon: '/nt1_web/assets/img/line.svg',
        url: '',
      },
      {
        name: 'wechat',
        icon: '/nt1_web/assets/img/wechat.svg',
        url: '',
      },
    ];
  }

  scrollToTop() {
    (function smoothscroll() {
      var currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - currentScroll / 8);
      }
    })();
  }
}
