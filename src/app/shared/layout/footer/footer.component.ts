import { Component, OnInit } from '@angular/core';
import {PopupService} from "../../services/popup.service";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private popupService: PopupService) { }

  ngOnInit(): void {
  }

  openCallbackPopup() {
    this.popupService.openPopup();
    this.popupService.setCallbackPopupOpen(true);
  }


}
