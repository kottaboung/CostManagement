import { Component, Input, Output } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  @Input() public page: string | undefined;

  public isSidebarMini = false;


  // constructor(
  //   private router: Router
  // )
  // {}

  // onSetting() {
  //   this.router.navigate(['/about/setting']);
  // }


  toggleSidebar(event: Event): void {
    // Prevent event propagation if clicking on the link inside the sidebar
    if ((event.target as HTMLElement).closest('a')) {
      event.stopPropagation();
    }
    this.isSidebarMini = !this.isSidebarMini;
  }

  preventClose(event: Event): void {
    // Prevent the click event from closing the sidebar
    event.stopPropagation();
  }

}
