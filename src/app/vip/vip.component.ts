import { PublicService } from './../app-service/public.service';
import { AuthService } from './../app-service/auth.service';
import { MemberService } from './../app-service/member.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AppRoutes } from '../constant/routes';
import { Router } from '@angular/router';

export enum StatusType {
  CURRENT = 'current',
  DETAIL = 'detail',
}

interface rank {
  autoWater: number;
  autoWaterAt;
  bankLimit: number;
  // clubId;
  createdAt;
  depositDayTimes: number;
  depositPerMax: string;
  depositPerMin: string;
  // enabled;
  // franchiseeId;
  fullpay;
  id: number;
  name: string;
  // order;
  // updatedAt;
  upgradeByDeposit: string;
  upgradeByTotalBetAmount: string;
  upgradeByWithdraw: string;
  withdrawDayTimes: number;
  withdrawFee;
  withdrawFeePeriod: string;
  withdrawFeeType: string;
  withdrawFreeTimes: number;
  withdrawPerMax: string;
  withdrawPerMin: string;
}
@Component({
  selector: 'app-vip',
  templateUrl: './vip.component.html',
  // styleUrls: ['./vip.component.scss']
})
export class VipComponent implements OnInit {
  StatusType = StatusType;
  type: any = StatusType.CURRENT;
  math = Math;

  partners;
  // partnersList;
  partnersWidth;
  partnersImgnum;
  partnersX = 0;

  @ViewChild('partnersList') partnersList: ElementRef;

  // ======= fake ==========
  vipLevel = ['vip0', 'vip1', 'vip2', 'vip3', 'vip4', 'vip5'];
  levelBar = [];
  userData = {
    level: 1,
    curAmount: 80,
    goalAmount: 400,
    curPoint: 150,
    goalPoint: 400,
  };
  // ======= fake end ==========

  // =======================
  rankList = [];
  mine: rank;
  mine2: {
    total_bet?;
    total_deposit?;
    total_withdraw?;
  };

  mineIdx = 0;
  next: rank;
  nextLvName = '';
  barPercent;

  constructor(
    private memberService: MemberService,
    private auth: AuthService,
    private router: Router,
    private publicService: PublicService
  ) {
    this.publicService.pageTabLink.subscribe((tmpSublink) => {
      this.type = tmpSublink;
    });
  }

  ngOnInit(): void {
    const user = this.auth.user;
    // console.log('user', user);
    this.type = StatusType.CURRENT;

    this.memberService.getClubRankList().subscribe((res) => {
      this.rankList = res;

      const idx = this.rankList.findIndex((item) => {
        return user.clubRankId === item.id;
      });

      this.mineIdx = idx;
      this.mine = this.rankList[idx];

      this.next =
        idx !== this.rankList.length - 1 ? this.rankList[idx + 1] : this.next;
      // this.nextLvName = (idx !== this.rankList.length - 1) ? this.rankList[idx + 1].name : '';

      let tmpindx = -1;
      for (let i = 0; i <= this.rankList.length; i++) {
        if (i <= this.mineIdx) {
          this.levelBar.push(true);
        } else {
          tmpindx = i;
          this.levelBar.push(false);
        }
      }

      this.barPercent = tmpindx / 5 * 100;

      if (this.publicService.tmpSublink) {
        // this.selectNavtype(this.publicService.tmpSublink);
        this.type = StatusType.DETAIL;
        this.publicService.tmpSublink = null;
      }
    });

    this.memberService.getMemberClubRank().subscribe((res) => {
      // console.log('getMemberClubRank', res);
      this.mine2 = res;
    });

    this.memberService.getMemberBetAmountByPlatform().subscribe((res) => {
      // console.log('getMemberBetAmountByPlatform', res);
    });

    this.partnersImgnum = this.vipLevel.length;
    this.partnersWidth = this.partnersImgnum * 290;
  }

  partnerR(): void {
    if (this.partnersX >= -this.partnersWidth + 3 * 290) {
      this.partnersX = this.partnersX - 290;
      this.partnersList.nativeElement.style.transform = `translate3d( ${this.partnersX}px, 0px, 0px)`;
    }
  }

  partnerL(): void {
    console.log(this.partnersX, this.partnersWidth);
    if (this.partnersX !== 0) {
      this.partnersX = this.partnersX + 290;
      this.partnersList.nativeElement.style.transform = `translate3d( ${this.partnersX}px, 0px, 0px)`;
    }
  }

  openDetail(): void {
    this.router.navigate([{ outlets: { popup: [AppRoutes.VIPPOPUP] } }]);
  }
}
