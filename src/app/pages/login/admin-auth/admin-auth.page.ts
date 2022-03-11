import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-admin-auth',
  templateUrl: './admin-auth.page.html',
  styleUrls: ['./admin-auth.page.scss'],
})
export class AdminAuthPage implements OnInit {

  isLoading: boolean = false;
  currentUserId!: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private globalService: GlobalService,
    private usersService: UsersService
  ) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;
    this.register(form);
  }

  register(form: NgForm) {
    this.isLoading = true;
    console.log(form.value);
    this.authService.registerOrganizer(form.value).then((data: any) => {
      console.log(data);
      this.router.navigateByUrl('/admin');
      this.isLoading = false;
      form.reset();
    }).catch(e => {
      console.log(e);
      this.isLoading = false;
      let msg: string = 'Could not sign you up, please try again';
      if (e.code === 'auth/email-already-in-use') {
        msg = e.message;
      }
      this.globalService.showAlert(msg);
    });
  }

}
