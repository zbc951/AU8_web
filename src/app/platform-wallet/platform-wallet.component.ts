import { WalletService, moneyLoadStatus } from './../app-service/wallet.service';
import { Router } from '@angular/router';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppRoutes } from '../constant/routes';


@Component({
  selector: 'app-platform-wallet',
  templateUrl: './platform-wallet.component.html',
  // styleUrls: ['./platform-wallet.component.scss']
})
export class PlatformWalletComponent implements OnInit {


  @Input() type: string;
  platformWalletOpen = false;

  platformWallet = [];

  @Output() transInEvt = new EventEmitter();
  $data;

  constructor(
    private walletService: WalletService
  ) {


    this.$data = this.walletService
      .getMultiPlatforms()
      .subscribe((res) => {

        // console.log('getMultiPlatforms res', res);

        this.platformWallet = res;

        this.getTransAllBalance();

      });


  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {

    this.$data.unsubscribe();

  }

  getTransAllBalance(): void {

    this.platformWallet.forEach((platform: any) => {

      platform.getStatus = moneyLoadStatus.LOADING;

      this.walletService.getMultiBalance(platform.key)
        .subscribe(
          (balanceRes: any) => {

            if (balanceRes.result == 'ok') {
              platform.getStatus = moneyLoadStatus.GOT;
              platform.balance = balanceRes.balance;

            }
          }, (err) => {
            platform.getStatus = moneyLoadStatus.GOT;
          });
    });
  }

  walletOpen(): void {
    this.platformWalletOpen = !this.platformWalletOpen;
  }

  transinAll(item): void {
    this.transInEvt.emit(item);
  }
}
