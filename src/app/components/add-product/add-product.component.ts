import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// SERVICES
import { BrandsService } from '../../services/brands/brands.service';
import { CategoriesService } from '../../services/categories/categories.service';
import { ProductsService } from '../../services/products/products.service';
import { StoresService } from '../../services/stores/stores.service';

// INTERFACES
import { Brands } from '../../interfaces/brands.interface';
import { Categories } from '../../interfaces/categories.interface';
import { Stores } from '../../interfaces/stores.interface';

@Component({
  selector: 'add-product',
  providers: [],
  styleUrls: [ './add-product.component.css' ],
  templateUrl: './add-product.component.html'
})
export class AddProductComponent implements OnInit {

  brands: Array<Brands> = [];
  categories: Array<Categories> = [];
  stores: Array<Stores> = [];

  brandData: Observable<Array<Brands>>;
  categoriesData: Observable<Array<Categories>>;
  storesData: Observable<Array<Stores>>;

  // DISPLAYS STATE
  brandState: boolean = false;
  categoryState: boolean = false;
  storeState: boolean = false;

  // DISPLAY SELECTED STATE
  selectedBrand: string = 'Select Brand';
  selectedCategory: string = 'Select Category';
  selectedStore: string = 'Select Store';

  constructor(
    private brandsService: BrandsService,
    private categoriesService: CategoriesService,
    private productsService: ProductsService,
    private storesService: StoresService) {}
  
  // CREATE PRODUCT
  createProduct() {
    this.productsService.addProduct([]);
  }

  // SHOW / HIDE BRANDS
  showHideBrands() {
    if(this.brandState == false) {
      this.brandState = true;
    } else {
      this.brandState = false;
    }
  }

  // SHOW / HIDE CATEGORIES
  showHideCategories() {
    if(this.categoryState == false) {
      this.categoryState = true;
    } else {
      this.categoryState = false;
    }
  }

  // SHOW / HIDE STORES
  showHideStores() {
    if(this.storeState == false) {
      this.storeState = true;
    } else {
      this.storeState = false;
    }
  }

  ngOnInit() {

    // BRAND SUBSCRIBER
    this.brandData = this.brandsService.brands;
    this.brandData.subscribe(data => {
      this.brands = data;
    });

    // CATEGORIES SUBSCRIBER
    this.categoriesData = this.categoriesService.myCategories;
    this.categoriesData.subscribe(data => {
      this.categories = data;
    });

    // STORES SUBSCRIBER
    this.storesData = this.storesService.myStores;
    this.storesData.subscribe(data => {
      this.stores = data;
    });

  }

}
