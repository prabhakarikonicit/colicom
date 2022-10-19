import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserCredentials, User } from 'src/app/shared/interfaces/interfaces';
import { GlobalService } from 'src/app/shared/services/global.service';
import { LoginService } from 'src/app/shared/services/login.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  authError: string = '';
  version: string = '';
  user: UserCredentials = {} as UserCredentials;

  constructor(private loginService: LoginService, private globalService: GlobalService, private router: Router) { }

  ngOnInit(): void {
    this.globalService.hideLoader();
    if (!this.loginService.validateUserSession('login')) {
      this.globalService.showLoader();
      this.router.navigate(['/enrollment']);
    }
  }

  onLogin(): void {
    this.globalService.setLoaderMessage();
    this.loginService.login(this.user).subscribe({
      next: (user: User) => {
        this.authError = '';
        this.router.navigate(['/enrollment']);
      }, error: error => {
        this.authError = 'Sorry, the email or password you entered are incorrect.';
        this.globalService.hideLoader();
      }
    });
  }

  forgotPassword(): void {
    this.router.navigate(['login/forgot']);
  }

  goToMarketingSupportSite() {
    this.globalService.goToMarketingSupportSite();
  }

  goToMarketingSite() {
    this.globalService.goToMarketingSite();
  }

}
