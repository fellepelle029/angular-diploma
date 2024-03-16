import {Component, ElementRef, HostListener} from '@angular/core';
import {PopupService} from "../../services/popup.service";
import {RequestService} from "../../services/request.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MatSnackBar} from "@angular/material/snack-bar";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent {

  popupForm: FormGroup;
  callbackForm: FormGroup;

  constructor(public popupService: PopupService,
              private requestService: RequestService,
              private elementRef: ElementRef,
              private _snackbar: MatSnackBar,
              private fb: FormBuilder) {

    this.popupForm = this.fb.group({
      service: [{ value: '' }],
      name: ['', Validators.required],
      phone: ['', Validators.required],
      type: ['order'],
    });
    this.popupService.offerTitle.subscribe(title => {
      this.popupForm.get('service')!.setValue(title);
    });


    this.callbackForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      type: ['consultation']
    })
  }


  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const targetElement = event.target as Element;
    if (!this.elementRef.nativeElement.querySelector('.popup-wrapper').contains(targetElement) && !targetElement.classList.contains('button')) {
      this.popupService.closePopup();
    }
  }

  getPopupStyle() {
    return this.popupService.isOpen.value ? {display: 'flex'} : {display: 'none'};
  }


  sendRequest() {
    const formValue = this.popupForm.value;
    if (this.popupForm.valid) {
      this.requestService.sendRequest(formValue)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (!(data as DefaultResponseType).error) {
              this.popupService.isRequestValid = true;
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.message) {
              this._snackbar.open(errorResponse.error.message);
              throw new Error(errorResponse.error.message)
            } else {
              this._snackbar.open('Ошибка ответа сервера при отправке запроса');
              throw new Error(errorResponse.error.message)
            }
          },
        });
    }
  }

  sendCallbackRequest() {
    const formValue = this.callbackForm.value;
    if (this.callbackForm.valid) {
      this.requestService.sendRequest(formValue)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (!(data as DefaultResponseType).error) {
              this.popupService.isCallbackRequestValid = true;
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.message) {
              this._snackbar.open(errorResponse.error.message);
              throw new Error(errorResponse.error.message)
            } else {
              this._snackbar.open('Ошибка ответа сервера при отправке запроса');
              throw new Error(errorResponse.error.message)
            }
          },
        });
    }
  }
}
