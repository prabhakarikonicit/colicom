import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Enrollment, Exam, User } from '../../interfaces/interfaces';
import { GlobalService } from '../../services/global.service';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  profileMenuSelected: string = '';
  marketingSite: string = environment.MARKETING_SITE;
  mobileClick: boolean = false;
  constructor(private globalService: GlobalService, private loginService: LoginService, private router: Router) {
  }

  getCurrentUser(): User {
    return this.loginService.getCurrentUser() || {};
  }

  isTrialMode(): boolean {
    return this.globalService.isTrialMode();
  }

  toggleTrialModal(): void {
    this.globalService.toggleTrialModal();
  }

  getModalShown(): boolean {
    return this.globalService.modalShown;
  }

  isDemo(): boolean {
    return this.globalService.isDemo();
  }

  getSelectedItem(): string {
    return this.globalService.selectedItem;
  }

  getSelectedEnrollment(): Enrollment {
    return this.globalService?.selectedEnrollment;
  }

  getSelectedExam(): Exam {
    return this.globalService?.selectedExam;
  }

  getSelectedExamName(): string {
    return this.globalService?.selectedExam?.name;
  }

  getSelectedModuleName(): string {
    return this.globalService?.selectedModule?.name;
  }

  hasEnrollments(): boolean {
    return this.globalService?.enrollments.length > 1;
  }

  toggleMobileClick(): void {
    this.mobileClick = !this.mobileClick;
  }

  setMobileClick(value: boolean): void {
    this.mobileClick = value;
  }

  setProfileMenuSelected(value: string): void {
    this.profileMenuSelected = value;
  }

  getProfileMenuSelected(): string {
    return this.profileMenuSelected;
  }

  logout(): void {
    this.loginService.logout();
  }

}
