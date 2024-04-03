import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',

})
export class LayoutComponent implements OnInit {
  
  scrolled: boolean = false;
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.scrolled = window.scrollY > 0;
  }
  constructor() { }

  ngOnInit(): void {
  }



}
