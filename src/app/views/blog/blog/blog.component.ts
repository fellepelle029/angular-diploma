import {Component, ElementRef, HostListener, OnInit,} from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { ArticlesType } from '../../../../types/articles.type';
import { FullArticlesResponseType } from '../../../../types/full-articles-response.type';
import { SortingType } from '../../../../types/sorting.type';
import { ArticlesService } from '../../../shared/services/articles.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  articles: ArticlesType[] = [];
  pages: number[] = [];
  currentPage: number = 1;
  totalPages: number = 1;

  sortingOpen: boolean = false;
  sortingOptions: SortingType[] = [
    { name: 'Фриланс', value: 'frilans' },
    { name: 'Дизайн', value: 'dizain' },
    { name: 'SMM', value: 'smm' },
    { name: 'Таргет', value: 'target' },
    { name: 'Копирайтинг', value: 'kopiraiting' },
  ];

  selectedCategories: string[] = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private elementRef: ElementRef,
    private http: HttpClient,
    private router: Router
  ) { }


  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const targetElement = event.target as Element;
    if (!this.elementRef.nativeElement.querySelector('.blog-filters').contains(targetElement) && !targetElement.classList.contains('span')) {
      this.sortingOpen = false;
    }
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.currentPage = +params['page'] || 1;
      this.selectedCategories = params['categories'] ? (Array.isArray(params['categories']) ? params['categories'] : [params['categories']]) : [];
      this.fetchArticles();
    });
  }

  selectCategory(category: string): void {
    this.selectedCategories = this.selectedCategories.includes(category) ?
      this.selectedCategories.filter(c => c !== category) :
      [...this.selectedCategories, category];
    this.currentPage = 1;
    this.fetchArticles();
    this.updateQueryParams();
  }

  fetchArticles(): void {
    let params: HttpParams = new HttpParams().set('page', this.currentPage.toString());

    if (this.selectedCategories.length > 0) {
      params = this.selectedCategories.reduce((p, category) => p.append('categories[]', category), params);
    }

    this.http.get<FullArticlesResponseType>(`${environment.api}articles`, { params })
      .subscribe((response: FullArticlesResponseType) => {
        this.articles = response.items;
        this.totalPages = response.pages;
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      });
  }

  toggleSorting(): void {
    this.sortingOpen = !this.sortingOpen;
  }

  isActive(option: SortingType): boolean {
    return this.selectedCategories.includes(option.value);
  }

  removeAppliedFilter(category: string): void {
    this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    this.currentPage = 1;
    this.updateQueryParams();
  }

  getCategoryName(category: string): string | undefined {
    const foundOption: SortingType | undefined = this.sortingOptions.find((option:SortingType) => option.value === category);
    return foundOption?.name || category;
  }

  goToPage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.fetchArticles();
      this.updateQueryParams();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchArticles();
      this.updateQueryParams();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchArticles();
      this.updateQueryParams();
    }
  }

  private updateQueryParams(): void {
    this.router.navigate([], {
      queryParams: { page: this.currentPage, categories: this.selectedCategories },
      queryParamsHandling: 'merge'
    });
  }

}
