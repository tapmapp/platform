import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// SERVICES
import { CategoriesService } from '../../services/categories/categories.service';
import { FilterConfigService } from '../../services/filter-config/filter-config.service';

// INTERFACES
import { Categories } from '../../interfaces/categories.interface';
import { FilterConfig } from '../../interfaces/filter-config.interface';

@Component({
  selector: 'categories-list',
  providers: [ ],
  styleUrls: ['./categories-list.component.css'],
  templateUrl: './categories-list.component.html'
})
export class CategoriesListComponent implements OnInit {

  categories: Array<Categories> = [];
  filterConfig = <FilterConfig>{};

  categoriesData: Observable<any>;
  filterConfigData: Observable<FilterConfig>;

  constructor(
    private categoriesService: CategoriesService,
    private filterConfigService: FilterConfigService) {}


  // SELECT CATEGORY
  selectCategory(categoryId: string) {
    this.filterConfig.categoryId = categoryId;
    this.filterConfigService.setConfig(this.filterConfig);
  }

  ngOnInit() {

    // CATEGORIES SUBSCRIBER
    this.categoriesData = this.categoriesService.myCategories;
    this.categoriesData.subscribe(data => {

      if(data.length > 0) {
        this.categories = data;
      }
  
    });

    // FILTER CONFIG SUBSCRIBER
    this.filterConfigData = this.filterConfigService.myFilterConfig;
    this.filterConfigData.subscribe(data => {

      this.filterConfig = data;

    });

    
  }

}
