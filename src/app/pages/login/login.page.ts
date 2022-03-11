import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  type: boolean = true;
  isLogin = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private globalService: GlobalService
  ) { }

  ngOnInit() {
  }

  changeType() {
    this.type = !this.type;
  }

  onSubmit(form: NgForm) {
    console.log(form);
    if (!form.valid) return;
    this.login(form);
  }

  // login(form) {
  //   this.isLogin = true;
  //   this.authService.loginUser(form.value.email, form.value.password).subscribe(user => {
  //     console.log('user added successfully: ', user);
  //     this.globalService.successToast('User logged in successfully');
  //     // this.navigate(user);
  //     this.isLogin = false;
  //     form.reset();
  //   });
  // }

  login(form) {
    this.isLogin = true;
    this.authService.login(form.value.email, form.value.password).then(data => {
      console.log(data);
      // this.navigate(data);
      this.isLogin = false;
      form.reset();
    }).catch(e => {
      console.log(e);
      this.isLogin = false;
      let msg: string = 'Could not sign you in, please try again.';
      if (e.code === 'auth/user-not-found') msg = 'Email address could not found';
      else if (e.code === 'auth/wrong-password') msg = 'Please enter a correct password';
      this.globalService.showAlert(msg);
    });
  }

  // navigate(data?) {
  //   let url = '/tabs';
  //   if (data === 'admin') url = '/admin';
  //   this.router.navigateByUrl(url);
  // }

}
