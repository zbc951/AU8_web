import { PublicService } from './app-service/public.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private publicService: PublicService
  ) {

    this.publicService.init();
    this.publicService.games();
    this.publicService.gameTypes();
    this.publicService.updateCarousel();
    this.publicService.updateMarquee();

    setInterval(() => {
      this.publicService.updateCarousel();
      this.publicService.updateMarquee();
    }, 60000);

  }

  onActivate(event) {
    window.scroll(0, 0);
  }
}
