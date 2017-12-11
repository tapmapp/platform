import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// SERVICES
import { CategoriesService } from '../../services/categories/categories.service';
import { FilterConfigService } from '../../services/filter-config/filter-config.service';
import { ProductsService } from '../../services/products/products.service';
import { MerchantsService } from '../../services/merchants/merchants.service';
import { SalesService } from '../../services/sales/sales.service';
import { StoresService } from '../../services/stores/stores.service';

// INTERFACES
import { Brands } from '../../interfaces/brands.interface';
import { Categories } from '../../interfaces/categories.interface';
import { FilterConfig } from '../../interfaces/filter-config.interface';
import { FilterOptions } from '../../interfaces/filter-options.interface';
import { Merchant } from '../../interfaces/merchants.interface';
import { Stores } from '../../interfaces/stores.interface';
import { Products } from '../../interfaces/products.interface';

@Component({
  selector: 'filter-menu',
  providers: [],
  styleUrls: [ './filter-menu.component.css' ],
  templateUrl: './filter-menu.component.html'
})
export class FilterMenuComponent implements OnInit {

  @Input('filterOptions') filterOptions = <FilterOptions>{}; 

  filterConfig = <FilterConfig>{};
  stores: Array<Stores> = [];
  categories: Array<Categories> = [];
  merchant = <Merchant>{};
  products: Array<Products> = [];
  brands: Array<Brands> = [];

  filterConfigData: Observable<any>;
  storesData: Observable<any>;
  categoriesData: Observable<any>;
  productsData: Observable<any>;
  merchantData: Observable<any>;

  // FILTER VARIABLES
  selectedStore: string = 'All Stores';
  selectedCategory: string = 'All Categories';
  selectedProduct: string = 'All Products';
  selectedBrand: string = 'All Brands';
  selectedGenre: string = 'All Genres';
  selectedRate: string = 'All Rates';
  selectedPeriod: string = 'Daily';
  selectedMethod: string = 'All Methods';

  // FILTER VARIABLES ID
  selectedStoreId: string = '';
  selectedCategoryId: string = '';
  selectedProductId: string = '';
  selectedGenreId: string = '';
  searchedProduct: string = '';

  // FILTER STATES
  categoryState: boolean = false;
  brandState: boolean = false;
  productState: boolean = false;
  storeState: boolean = false;
  genreState: boolean = false;
  rateState: boolean = false;
  periodState: boolean = false;
  methodState: boolean = false;

  extraFiltersState: boolean = false;

  constructor(
    private categoriesService: CategoriesService,
    private filterConfigService: FilterConfigService,
    private merchantsService: MerchantsService,
    private productsService: ProductsService,
    private salesService: SalesService,
    private storesService: StoresService) {}

  // SELECT STORE
  selectStore(store: string, storeId: string) {
    
    this.storeState = false;
    this.selectedStore = store;
    this.filterConfig.storeId = storeId;

    // SEND FILTER CONFIG
    this.filterConfigService.setConfig(this.filterConfig);

  }

  // SELECT CATEGORY
  selectCategory(category: string, categoryId: string) {

    this.categoryState = false;
    this.selectedCategory = category;
    this.filterConfig.categoryId = categoryId;

    // SEND FILTER CONFIG
    this.filterConfigService.setConfig(this.filterConfig);

  }

  // SELECT PRODUCT
  selectProduct(product: string, productId: string) {

    this.productState = false;
    this.selectedProduct = product;
    this.filterConfig.productId = productId;

    // SEND FILTER CONFIG
    this.filterConfigService.setConfig(this.filterConfig);

  }

  // SELECT BRAND
  selectBrand(brand: string, brandId: string) {

    this.brandState = false;
    this.selectedBrand = brand;
    this.filterConfig.brandId = brandId;

    // SEND FILTER CONFIG
    this.filterConfigService.setConfig(this.filterConfig);

  }

  // SELECT GENRE
  selectGenre(genre: string, genreId: string) {

    this.genreState = false;
    this.selectedGenre = genre;
    this.filterConfig.genreId = genreId;
    
    // SEND FILTER CONFIG
    this.filterConfigService.setConfig(this.filterConfig);

  }

  // SELECT RATES
  selectRate(rate: string, rateId: string) {

    this.rateState = false;
    this.selectedRate = rate;
    this.filterConfig.rateId = rateId;
    
    // SEND FILTER CONFIG
    this.filterConfigService.setConfig(this.filterConfig);

  }

  // SELECT FROM DATE
  selectFromDate(fromDate) {
    
    this.filterConfig.fromDate = fromDate;

    // SEND FILTER CONFIG
    this.filterConfigService.setConfig(this.filterConfig);

  }

  // SELECT TO DATE
  selectToDate(toDate) {
    
    this.filterConfig.toDate = toDate;

    // SEND FILTER CONFIG
    this.filterConfigService.setConfig(this.filterConfig);

  }

  // SELECT PERIOD
  selectPeriod(period: string) {

    this.periodState = false;
    this.selectedPeriod = period;
    this.filterConfig.selectedPeriod = period;
    
    // SEND FILTER CONFIG
    this.filterConfigService.setConfig(this.filterConfig);

  }

  // SELECT METHOD
  selectMethod(method: string, methodId: string) {

    this.methodState = false;
    this.selectedMethod = method;
    this.filterConfig.method = methodId;

    // SEND FILTER CONFIG
    this.filterConfigService.setConfig(this.filterConfig);

  }

  // SET FILTER CONFIG
  setFilterConfig(filterConfig: FilterConfig) {

    // SET STORE
    for(let i = 0; i < this.stores.length; i++) {
      if(this.stores[i]._id == filterConfig.storeId) {
        this.selectedStore = this.stores[i].name;
      }
    }

    // SET CATEGORY
    for(let i = 0; i < this.categories.length; i++) {
      if(this.categories[i]._id == filterConfig.categoryId) {
        this.selectedCategory = this.categories[i].name;
      }
    }

    // SET PRODUCT
    for(let i = 0; i < this.products.length; i++) {
      if(this.products[i].productId == filterConfig.productId) {
        this.selectedProduct = this.products[i].name + ' - ' + this.products[i].brandName;
      }
    }

    // SET GENRE
    if(filterConfig.genreId == '') {
      this.selectedGenre = 'All genres';
    } else {
      this.selectedGenre = filterConfig.genreId;
    }
    
    // SET PERIOD
    this.selectedPeriod = filterConfig.selectedPeriod;

  }

  // SHOW HIDE STORES
  showHideStores() {
    if(this.storeState == true) {
      this.storeState = false;
    } else {
      this.storeState = true;
    } 
  }

  // SHOW HIDE CATEGORIES
  showHideCategories() {
    if(this.categoryState == true) {
      this.categoryState = false;
    } else {
      this.categoryState = true;
    } 
  }

  // SHOW HIDE PRODUCTS
  showHideProducts() {
    if(this.productState == true) {
      this.productState = false;
    } else {
      this.productState = true;
    }
  }

  // SHOW HIDE BRANDS
  showHideBrands() {
    if(this.brandState == true) {
      this.brandState = false;
    } else {
      this.brandState = true;
    }
  }

  // SHOW HIDE GENRES
  showHideGenre() {
    if(this.genreState == true) {
      this.genreState = false;
    } else {
      this.genreState = true;
    }
  }

  // SHOW HIDE PERIODS
  showHidePeriod() {
    if(this.periodState == true) {
      this.periodState = false;
    } else {
      this.periodState = true;
    }
  }

  // SHOW HIDE FILTERS
  showHideFilters() {
    if(this.extraFiltersState == false) {
      this.extraFiltersState = true;
    } else {
      this.extraFiltersState = false;
    }
  }

  // SHOW HIDE METHODS
  showHideMethod() {
    if(this.methodState == false) {
      this.methodState = true;
    } else {
      this.methodState = false;
    }
  }

  // CREATE BRAND LIST
  createBrandList(products: Array<Products>) {
  
    let brandList: Array<Brands> = [];

    for(let i = 0; i < products.length; i++) {
      
      let flag = 0;

      for(let j = 0; j < brandList.length; j++) {
        if(products[i].brand == brandList[j]._id) {
          flag = 1;
        }
      }

      if(flag == 0) {
        brandList.push({
          _id: products[i].brand,
          name: products[i].brandName
        });
      }

    }

    return brandList;

  }

  ngOnInit() {
    
    // STORES SUBSCRIBER
    this.storesData = this.storesService.myStores;
    this.storesData.subscribe(data => {
      if(data.length > 0) {
        this.stores = data;
      }
    });

    // CATEGORIES SUBSCRIBER
    this.categoriesData = this.categoriesService.myCategories;
    this.categoriesData.subscribe(data => {
      if(data.length > 0) {
        this.categories = data;
      }
    });

    // PRODUCTS SUBSCRIBER
    this.productsData = this.productsService.myProducts;
    this.productsData.subscribe(data => {

      if(data.length > 0) {
        this.products = data;
        this.brands = this.createBrandList(this.products);
      }

    });

    // FILTER CONFIG SUBSCRIBER
    this.filterConfigData = this.filterConfigService.myFilterConfig;
    this.filterConfigData.subscribe(data => {

      this.filterConfig = data;

      // SET FILTER VARIABLES
      this.setFilterConfig(this.filterConfig);

    });

  }
}
