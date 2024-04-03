import {Component, Input, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserInfo} from "../../../../types/user-info";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input()scrolled!: boolean;

  userName: string = '';

  isLogged: boolean = false;

  constructor(public authService: AuthService,
              private _snackbar: MatSnackBar,
              private router: Router) {
    this.isLogged = this.authService.isLoggedIn();
  }

  ngOnInit(): void {

    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = isLoggedIn;
      if (this.isLogged) {
        this.setUsername();
      }
    });
    this.setUsername();

    this.authService.userName$.subscribe((userName: string) => {
      this.userName = userName;
    });
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: () => {
          this.doLogout();
        },
        error: () => {
          this.doLogout();
        },
      });
  }


  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this._snackbar.open('Вы вышли из системы');
    this.router.navigate(['/']);
  }

  setUsername() {
    return this.authService.getUsername(localStorage.getItem(this.authService.accessTokenKey)!).subscribe((data: UserInfo) => {
      this.authService.setUserName(data.name);
    });
  }

}
