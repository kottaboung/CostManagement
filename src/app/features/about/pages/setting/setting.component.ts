import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss'
})
export class SettingComponent {

  constructor(
    private router: Router
  ){

  }

  GoHome() {
    this.router.navigate(['home/dashboard']);
  }
}
