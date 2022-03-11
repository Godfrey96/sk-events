import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {

  user: any;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    // this.authService.currentUser$.subscribe(x => this.user = x);
  }

}
