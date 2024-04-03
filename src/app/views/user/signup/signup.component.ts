import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../shared/services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {LoginResponseType} from "../../../../types/login-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackbar: MatSnackBar,
              private router: Router,) {
  }

  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern('[а-яА-ЯЁёa-zA-Z]+')]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)]],
    agree: [false, [Validators.requiredTrue]],
  });
  ngOnInit(): void {
  }

  signup() {
    if (this.signupForm.valid && this.signupForm.value.name && this.signupForm.value.email && this.signupForm.value.password && this.signupForm.value.agree) {
      this.authService.signup(this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
        .subscribe({
          next: (data: LoginResponseType | DefaultResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }
            const loginResponse = data as LoginResponseType;
            if (!loginResponse.accessToken || !loginResponse.refreshToken || !loginResponse.userId) {
              error = 'Ошибка авторизации';
            }
            if (error) {
              this._snackbar.open(error);
              throw new Error(error);
            }
            this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            this.authService.userId = loginResponse.userId;
            this._snackbar.open('Вы успешно зарегистрировались');
            this.router.navigate(['/']);
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.message) {
              this._snackbar.open(errorResponse.error.message);
            } else {
              this._snackbar.open('Ошибка регистрации');
            }
          },
        });
    }
  }


}
