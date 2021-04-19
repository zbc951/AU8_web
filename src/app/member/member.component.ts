import { LetterService } from './../app-service/letter.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../app-service/auth.service';
import { AppRoutes } from '../constant/routes';


@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  // styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

  AppRoutes = AppRoutes;
  path;
  unread = 0;

  user: {
    account?: string,
    lv?: string,
    survival_day?: number
  } = {};

  constructor(
    private auth: AuthService,
    private route: Router,
    private letterService: LetterService,
  ) {

    // console.log(this.route.url);
    this.path = this.route.url.split('/')[1];
    // console.log('path', this.path);

    this.auth.isLogin()
      .subscribe((isLogin) => {

        if (isLogin) {
          const { user } = this.auth;
          const lv = user.clubRank.split(')')[1].trim();
          user.lv = lv;
          this.user = user;
        }
      });

    this.letterService.getUnreads()
      .subscribe((res: any) => {

        this.unread = res;

      });

  }

  ngOnInit(): void {

  }

  goPage(path) {

    // console.log('goPage path', path);
    this.route.navigateByUrl(path);

  }

}
