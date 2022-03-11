import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { timer } from 'rxjs';
import { Location } from '@angular/common';
import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { GlobalService } from 'src/app/services/global/global.service';
import { UsersService } from 'src/app/services/users/users.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  isLoading: boolean = false;
  editmode = false;
  currentUserId!: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location,
    private activatedRoute: ActivatedRoute,
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
    this.authService.registerUser(form.value).then((data: any) => {
      console.log(data);
      this.router.navigateByUrl('/tabs');
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
