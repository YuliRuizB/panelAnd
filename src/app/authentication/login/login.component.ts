import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit {

  loginForm: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private authService: AuthenticationService,
    public notification: NzNotificationService
  ) { }

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }

    if (this.loginForm.valid) {
      this.authService.signIn( this.loginForm.get('userName').value, this.loginForm.get('password').value);
    } else {
      this.notification.create('error', '¡Oops...!', 'Escriba por favor sus datos para tener acceso');
    }
  }


  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }
}
