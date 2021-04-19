import { forkJoin } from 'rxjs';
import { WalletService } from './../app-service/wallet.service';
import { MemberService } from './../app-service/member.service';
import { PublicService } from './../app-service/public.service';
import { Component, OnInit } from '@angular/core';
import { AppRoutes } from './../constant/routes';

@Component({
  selector: 'app-small-queest',
  templateUrl: './small-queest.component.html',
  styleUrls: ['./small-queest.component.scss']
})
export class SmallQueestComponent implements OnInit {

  questList = [];
  public AppRoutes = AppRoutes;


  constructor(
    private publicService: PublicService,
    private memberService: MemberService
  ) { }

  ngOnInit(): void {

    forkJoin([
      this.publicService.getPublicQuestList(),
      this.memberService.getQuestRecord()

    ])
      .subscribe((res) => {

        // console.log('res', res);

        let tmp = [...res[1]];
        tmp.forEach((item) => {

          const questId = item.questId;
          const data = res[0].data.content;
          const tmpitem = data.find((el) => {
            return el.quest_id === questId;
          });

          if (tmpitem) {
            item.imageUrl = tmpitem.image_url;
          }
        });

        this.questList = tmp;


      });

  }

}
