import { GameService } from './../app-service/game.service';
import { LangService } from './../app-service/lang.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AppRoutes } from './../constant/routes';
import { PublicService, GameTypeKey } from './../app-service/public.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  // styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  types = [];
  constructor(
    private publicService: PublicService,
    private translate: TranslateService,
    private langService: LangService,
    private gameService: GameService
  ) {


    const imgMap = {
      [GameTypeKey.Sport]: 'sports.png',
      [GameTypeKey.Live]: 'live.png',
      [GameTypeKey.Slot]: 'slot.png',
      [GameTypeKey.Lottery]: 'lottery.png',
      [GameTypeKey.Fishing]: 'fish.png',
      [GameTypeKey.Board]: 'board.png',
    };

    const routerMap = {
      [GameTypeKey.Sport]: AppRoutes.SPORT,
      [GameTypeKey.Live]: AppRoutes.LIVE,
      [GameTypeKey.Slot]: AppRoutes.SlotCenter,
      [GameTypeKey.Lottery]: AppRoutes.LOTTO,
      [GameTypeKey.Fishing]: AppRoutes.FISH,
      [GameTypeKey.Board]: AppRoutes.BOARD
    };

    this.langService.onloadSub
      .subscribe((boo) => {
        if (boo) {

          const { translations } = this.langService;
          this.publicService.getTypeMenu()
            .subscribe((res) => {

              // console.log('res', res);

              res.forEach((typeObj) => {
                const { type } = typeObj;
                // typeObj.tname = translations.HEADER_NAV[type];
                typeObj.img = `/nt1_web/assets/img/types/${imgMap[type]}`;
                typeObj.route = `/${routerMap[type]}`;
              });

              const typeKeys = Object.keys(routerMap);
              const tmp = res.filter((t) => {

                return typeKeys.includes(t.type);
              });

              this.types = tmp;

            });

        }

      });
  }

  ngOnInit(): void {

    this.types = this.publicService.gametypes;
    this.gameService.cutToPlatformSubject5.next({});
    // console.log('types', this.types);

  }

}
