import { ToastService } from './../app-service/toast.service';
import { LangService } from './../app-service/lang.service';
import { PublicService } from './../app-service/public.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AppRoutes } from '../constant/routes';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  // styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit {

  AppRoutes = AppRoutes;

  nowNav = 0;
  nowCnt: any = 'teach1';
  url = '';
  // 存款內文
  serial = true;
  wechat = false;
  wanin = false;
  alipay = false;
  unionpay = false;
  numberdeposit = false;

  ag = true;

  constructor(
    private router: Router,
    private publicService: PublicService,
    private langService: LangService,
    private toastService: ToastService

  ) {

    this.getCurrent();

    this.publicService.pageLink.subscribe((tmpNav) => {
      if (tmpNav) {

        switch (tmpNav) {
          case AppRoutes.ABOUT:
            this.nowNav = 2;
            break;
          case AppRoutes.HELP:
            this.nowNav = 0;
            break;
          case AppRoutes.COMMON_PROBLEM:
            this.nowNav = 1;
            break;
        }
      }
    });

    this.publicService.pageTabLink.subscribe((tmpSublink) => {
      if (tmpSublink) {

        this.nowCnt = tmpSublink;
      }
    });

  }

  getCurrent() {
    this.url = this.router.url.split('/')[1];
    switch (this.url) {
      case AppRoutes.ABOUT:
        this.nowCnt = 'about1';
        this.nowNav = 2;

        break;
      case AppRoutes.HELP:
        this.nowCnt = 'teach1';
        this.nowNav = 0;

        break;

      case AppRoutes.COMMON_PROBLEM:
        this.nowCnt = 'problem1';
        this.nowNav = 1;
        break;

    }
  }

  ngOnInit(): void {
    // this.url = this.router.url.split('/')[1];
    // switch (this.url) {
    //   case AppRoutes.ABOUT:
    //     this.nowCnt = 'about1';
    //     this.nowNav = 2;
    //     console.log('ssss', this.nowCnt);

    //     break;
    //   case AppRoutes.HELP:
    //     this.nowCnt = 'teach1';
    //     this.nowNav = 0;

    //     break;

    //   case AppRoutes.COMMON_PROBLEM:
    //     this.nowCnt = 'problem1';
    //     this.nowNav = 1;
    //     break;

    // }

    // this.publicService.aboutTmpSublink.subscribe((tmpSublink) => {
    //   this.nowCnt = tmpSublink;
    // });
  }

  goNav(n): void {
    this.nowNav = n;
  }

  goCnt(t): void {
    this.nowCnt = t;
  }

  readPolicy(): void {

    const txt = this.langService.translations.ABOUT.TERMS.CNT;

    this.toastService.policy(txt, () => {
    });

  }
}
