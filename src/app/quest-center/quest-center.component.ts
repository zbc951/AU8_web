import { UtilService } from './../app-service/util.service';
import { tabs } from './../letter/letter.component';
import { PublicService } from './../app-service/public.service';
import { AuthService } from './../app-service/auth.service';
import { LangService } from './../app-service/lang.service';
import { ToastService } from './../app-service/toast.service';
import { AppRoutes } from './../constant/routes';
import { Router } from '@angular/router';
import { WalletService, buyResponse } from './../app-service/wallet.service';
import { Component, OnInit } from '@angular/core';

enum Tabs {
  ALL = 'all',
  before = 'before',
  after = 'after',
  fixed = 'fixed',
  percent = 'percent',
  stages = 'stages',
}

enum Activity_type {
  fixed = 'fixed',
  percent = 'percent',
}

@Component({
  selector: 'app-quest-center',
  templateUrl: './quest-center.component.html',
  // styleUrls: ['./quest-center.component.scss']
})
export class QuestCenterComponent implements OnInit {
  Activity_type = Activity_type;
  public tabs: any = Tabs;
  public selected: Tabs;
  public listData: any;
  public pageConfig: any = {
    itemsPerPage: 10,
    currentPage: 1,
    totalItems: 0,
  };

  public questData: any[] | null = null;

  url;
  AppRoutes = AppRoutes;

  questTypes = [];
  quest_method;

  constructor(
    private walletService: WalletService,
    private publicService: PublicService,
    private router: Router,
    private toast: ToastService,
    private langService: LangService,
    private auth: AuthService
  ) {
    // console.log(this.router.url);
    this.url = this.router.url.split('/')[1];

    this.langService.onloadSub.subscribe((boo) => {
      if (boo) {
        this.quest_method = this.langService.translations.quest_method;
        this.questTypes = [
          {
            name: this.quest_method.fixed,
            value: Tabs.fixed,
          },
          {
            name: this.quest_method.percent,
            value: Tabs.percent,
          },
          {
            name: this.quest_method.stages,
            value: Tabs.stages,
          },
        ];
      }
    });
  }

  ngOnInit(): void {
    // console.log('url', this.url);

    switch (this.url) {
      case AppRoutes.Activity_Wallet:
        this.getActivityWallet();

        break;

      case AppRoutes.QUEST:
        this.initQuest();

        break;
    }

    // this.questData = null;
    this.selected = Tabs.ALL;
  }

  getActivityWallet(): void {
    this.walletService.getActivityWallet().subscribe((res) => {
      // console.log('getActivityWallet', res);
      this.listData = res.data.products;
    });
  }

  initQuest(): void {
    this.publicService.getPublicQuestList().subscribe((response) => {
      // let questList = response.data.content;
      let questList = [];
      response.data.content.forEach((item) => {
        questList.push({
          name: item.quest_name,
          startAt: item.startAt,
          endAt: item.endAt,
          information: item.information,
          image: item.image_url,
          informationDisplay: item.info_display,
          method: item.method,
          type: item.type,
        });
      });

      this.listData = questList;
    });
  }

  selectType(t: Tabs): void {
    this.questData = null;

    switch (this.url) {
      case AppRoutes.Activity_Wallet:
        this.getActivityWallet();

        break;

      case AppRoutes.QUEST:
        this.selected = t;
        this.initQuest();

        break;
    }

    // this.getActivityWallet();
    // this.selected = t;
  }

  pageChanged(event): void {
    this.pageConfig.currentPage = event;
    UtilService.toTop();
  }

  getDetail(data: any): void {
    // console.log('getDetail', data);
    this.questData = data;
    UtilService.toTop();
  }

  buy(item): void {
    if (this.auth.user.money < item.price) {
      this.toast.error(
        this.langService.translations.QUEST_CENTER.buy_moneyNotEnough
      );
      return;
    }

    if (item.type === Activity_type.fixed) {
      this.walletService.buyActivityWallet(item.id).subscribe(
        (res) => {
          // console.log('res', res);
          this.resHandler(res);
        },
        (err) => {
          // console.log('err', err);
          this.errorHandler(err);
        }
      );
    } else {
      this.toast.buyActivity(
        this.langService.translations.QUEST_CENTER.price_input,
        item.percentMinPrice,
        (input) => {
          console.log('input', input);
          this.walletService.buyActivityWallet(item.id, input).subscribe(
            (res) => {
              // console.log('res', res);
              this.resHandler(res);
            },
            (err) => {
              // console.log('err', err);
              this.errorHandler(err);
            }
          );
        }
      );
    }
  }

  resHandler(res): void {
    if (res.result) {
      const result = String(res.result);
      switch (res.result) {
        case buyResponse.ok:


          if (res.isAutoPass) {

            this.toast.error(
              this.langService.translations.QUEST_CENTER.buy_success
            );

          } else {

            this.toast.error(
              this.langService.translations.QUEST_CENTER.review
            );

          }

          break;
        case buyResponse.exceedNum:
          this.toast.error(
            this.langService.translations.QUEST_CENTER.buy_exceedNum
          );
          break;
        case buyResponse.moneyNotEnough:
          this.toast.error(
            this.langService.translations.QUEST_CENTER.buy_moneyNotEnough
          );
          break;
        case buyResponse.noProd:
          this.toast.error(
            this.langService.translations.QUEST_CENTER.buy_noProd
          );
          break;
      }

      this.getActivityWallet();
    }
  }

  errorHandler(err): void {

    // console.log('errorHandler err', err);


    if (err.error.message) {
      this.toast.error(err.error.message);
    } else {
      this.toast.error(err.message);
    }
  }
}
