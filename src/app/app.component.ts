import { Component, ChangeDetectorRef } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { GlobalService } from './shared/services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  extraHeaderClass: string = ''

  constructor(private globalService: GlobalService, private route: Router, private cdref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.route.events.subscribe((event: any) => {
      const url: string = event.url;
      if (url && event instanceof NavigationEnd) {
        const routeUrls: Array<string> = ['/login', '/enrollment', '/welcome', '/forgot', '/update-password'];
        this.extraHeaderClass = routeUrls.find((routeUrl: string) => url === '/' || url.includes(routeUrl)) ? 'cc_login_back' : '';
      }
    });
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  isTrialMode() {
    return this.globalService.isTrialMode();
  }

  isLoadingEnabled() {
    return this.globalService.loading;
  }

  getLoadingMessage() {
    return this.globalService.loadingMessage;
  }

  getSelectedItem(): string {
    return this.globalService.selectedItem;
  }

}
