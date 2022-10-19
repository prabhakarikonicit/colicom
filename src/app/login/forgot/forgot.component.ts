import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ForgotPwdService } from 'src/app/shared/services/forgot-pwd.service';
import { GlobalService } from 'src/app/shared/services/global.service';
import { LoginService } from 'src/app/shared/services/login.service';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss']
})
export class ForgotComponent implements OnInit {
  authError: string = '';
  email = new FormControl('', Validators.email);

  constructor(private forgotPwdService: ForgotPwdService, private globalService: GlobalService, private loginService: LoginService) { }

  ngOnInit(): void {
    console.log("In forgot component ");
  }

  resetPassword() {
    this.globalService.showLoader();
    this.forgotPwdService.requestPasswordReset(this.email.value)
      .subscribe((result) => {
        console.log(result);
        this.loginService.showLogin();
      }, error => {
        console.log(error);
        this.authError = error.message;
        this.globalService.hideLoader();
      })
  }
  goToMarketingSupportSite() {
    this.globalService.goToMarketingSupportSite();
  }
}
