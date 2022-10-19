import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { GlobalService } from 'src/app/shared/services/global.service';
import { LoginService } from 'src/app/shared/services/login.service';
import { UpdatePwdService } from 'src/app/shared/services/update-pwd.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {
  authError: string = '';
  updatePwdFormGroup: FormGroup={} as FormGroup;

  constructor(private route: ActivatedRoute, private fb:FormBuilder, private globalService:GlobalService, private updatePwdService:UpdatePwdService,private loginService:LoginService) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params) => {
      console.log(params);
      this.updatePwdFormGroup = this.fb.group({
        email: [params['email'], Validators.email],
        password: ["", Validators.required],
        code: [params['code'], Validators.required]
      });
    });
    
    
  }
  update(){
 // show loading
 this.globalService.showLoader();

 this.authError = '';

 this.updatePwdService.updatePassword(this.updatePwdFormGroup.get('email')?.value, this.updatePwdFormGroup.get('password')?.value, this.updatePwdFormGroup.get('code')?.value)
 .subscribe((result)=>{
  console.log(result);
  this.loginService.showLogin();
      },error=>{
        console.log(error);
        this.globalService.hideLoader();
        this.authError="Invalid Login credentials.";
      });
  }
  goToMarketingSupportSite(){
    this.globalService.goToMarketingSupportSite();
  }
}
