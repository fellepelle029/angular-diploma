import {Component, OnInit} from '@angular/core';
import {OffersType} from "../../../types/offers.type";
import {OwlOptions} from "ngx-owl-carousel-o";
import {ArticlesType} from "../../../types/articles.type";
import {ArticlesService} from "../../shared/services/articles.service";
import {environment} from "../../../environments/environment";
import {PopupService} from "../../shared/services/popup.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  offers: OffersType = [
    {
      image: 'offer-1.png',
      title: 'Создание сайтов',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: 7500,
    },
    {
      image: 'offer-2.png',
      title: 'Продвижение',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: 3500,
    },
    {
      image: 'offer-3.png',
      title: 'Реклама',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: 1000,
    },
    {
      image: 'offer-4.png',
      title: 'Копирайтинг',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: 750,
    },
  ];
  reviews: { image: string, name: string, review: string }[] = [
    {
      image: 'review-1.png',
      name: 'Станислав',
      review: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      image: 'review-2.png',
      name: 'Алёна',
      review: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      image: 'review-3.png',
      name: 'Мария',
      review: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!',
    },
  ]
  mainSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    margin: 20,
    autoplay: true,
    autoplaySpeed: 1100,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      940: {
        items: 1
      }
    },
    nav: false
  }
  reviewSlider: OwlOptions = {
    loop: true,
    mouseDrag: true,
    margin: 24,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    responsive: {
      600: {
        items: 2
      },
      1000: {
        items: 3
      },
    },
    nav: false
  }

  serverStaticPath = environment.serverStaticPath;
  popularArticles: ArticlesType[] = [];


  constructor(private articlesService: ArticlesService,
              public popupService: PopupService) {
  }

  ngOnInit(): void {
    this.getPopularArticles()
  }

  openPopup(offerTitle: string) {
    this.popupService.setCallbackPopupOpen(false)
    this.popupService.openPopup()
    this.popupService.setOfferTitle(offerTitle);
  }

  getPopularArticles() {
    this.articlesService.getPopularArticles()
      .subscribe((articles: ArticlesType[]) => {
        this.popularArticles = articles as ArticlesType[];
      });
  }

  openCallbackPopup() {
    this.popupService.openPopup();
    this.popupService.setCallbackPopupOpen(true);
  }
}
