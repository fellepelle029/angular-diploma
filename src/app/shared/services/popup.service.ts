import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  isOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);
  offerTitle: BehaviorSubject<string> = new BehaviorSubject('Укажите услугу');
  _isCallbackPopupOpen: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isRequestValid: boolean = false;
  isCallbackRequestValid: boolean = false;

  setOfferTitle(title: string) {
    this.offerTitle.next(title);
  }

  openPopup() {
    this.isOpen.next(true);
  }

  closePopup() {
    this.isOpen.next(false);
    this.isRequestValid = false;
    this.isCallbackRequestValid = false;
  }

  setCallbackPopupOpen(value: boolean) {
    this._isCallbackPopupOpen.next(value);
  }
}
