import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// SERVICES
import { CategoriesService } from '../../services/categories/categories.service';
import { ProductsService } from '../../services/products/products.service';
import { StoresService } from '../../services/stores/stores.service';

// INTERFACES
import { Categories } from '../../interfaces/categories.interface';
import { Stores } from '../../interfaces/stores.interface';

@Component({
  selector: 'edit-product',
  providers: [],
  styleUrls: [ './edit-product.component.css' ],
  templateUrl: './edit-product.component.html'
})
export class EditProductComponent implements OnInit {

  categories: Array<Categories> = [];
  stores: Array<Stores> = [];

  // CATEGORIES OBSERVABLE SERVICE
  categoriesData: Observable<any>;

  // CATEGORIES OBSERVABLE SERVICE
  storesData: Observable<any>;

  // SELECTED PRODUCT INPUT EVENT
  @Input() selectedProduct: any;

  // SELECTED CATEGORY VARIABLE
  categoryState: boolean = false;
  selectedCategory: string = 'Select Category';

  // SELECTED STORE VARIABLE
  storeState: boolean = false;
  selectedStore: string = 'Select Store';

  constructor(
    private productsService: ProductsService,
    private categoriesService: CategoriesService,
    private storesService: StoresService) {}

  // DELETE MERCHANT PRODUCT
  deleteProduct(productId) {
    this.productsService.removeProduct(productId);
  }

  // SELECT CATEGORY
  selectCategoryFilter(categoryName: string) {

    for(let i = 0; i < this.categories.length; i++) {
      if(this.categories[i].name == categoryName) {
        this.selectedCategory = this.categories[i].name;
        this.selectedProduct.category._id = this.categories[i]._id;
        this.categoryState = false;
      }
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

  // SELECT STORE
  selectStoreFilter(storeName: string) {

    if(storeName == 'all') {

      this.selectedProduct.stores = [];

      for(let i = 0; i < this.stores.length; i++) {
        this.selectedProduct.stores.push(this.stores[i]._id);
        this.storeState = false;
      }

      this.selectedStore = 'All stores';

    } else {

      this.selectedProduct.stores = [];

      for(let i = 0; i < this.stores.length; i++) {
        if(this.stores[i].name == storeName) {
          this.selectedStore = this.stores[i].name;
          this.selectedProduct.stores.push(this.stores[i]._id);
          this.storeState = false;
        }
      }

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

  // ADD LOT
  addLot() {
    this.selectedProduct.lot.unshift(this.selectedProduct.lot[0]);
  }

  ngOnInit() {

    // SELECTED PRODUCT CATEGORY
    this.selectedCategory = this.selectedProduct.category.name;

    // CATEGORIES SUBSCRIBER
    this.categoriesData = this.categoriesService.myCategories;
    this.categoriesData.subscribe(data => {
      this.categories = data;
    });

    // CATEGORIES SUBSCRIBER
    this.storesData = this.storesService.myStores;
    this.storesData.subscribe(data => {
      this.stores = data;
    });

  }

}
