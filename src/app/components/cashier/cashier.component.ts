import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// SERVICES
import { AddProductsService } from '../../services/add-products/add-products.service';
import { CategoriesService } from '../../services/categories/categories.service';
import { ProductsService } from '../../services/products/products.service';

// INTERFACES
import { Categories } from '../../interfaces/categories.interface';
import { Products } from '../../interfaces/products.interface';

@Component({
  selector: 'cashier',
  providers: [ ],
  styleUrls: ['./cashier.component.css'],
  templateUrl: './cashier.component.html'
})
export class CashierComponent implements OnInit {

  categories: Array<Categories> = [];
  products: Array<Products> = [];
  addedProductsList: Array<any> = [];

  addProductsData: Observable<any>;
  categoriesData: Observable<any>;
  productsData: Observable<any>;

  totalAmount: number = 0;

  constructor(
    private addProductsService: AddProductsService,
    private categoriesService: CategoriesService,
    private productsService: ProductsService) {}

  // ADD PRODUCT METHOD
  addProduct(productId: string) {

    let existFlag = 0;

    this.totalAmount = 0;

    // CHECK IF PRODUCT IS ON LIST
    for(let k = 0; k < this.addedProductsList.length; k++) {
      if(productId == this.addedProductsList[k]._id) {

        // PRODUCT EXIST
        existFlag = 1;

        this.addedProductsList[k].items += 1;

      }
    }

    // PRODUCT NOT ON LIST
    if(existFlag == 0) {

      for(let i = 0; i < this.products.length; i++) {
        if(this.products[i]._id == productId) {

          for(let j = 0; j < this.products[i].lot.length; j++) {
            if(this.products[i].lot[j].active == true) {

              this.addedProductsList.push({
                _id: this.products[i]._id,
                name: this.products[i].name,
                brand: this.products[i].brandName,
                size: this.products[i].size,  
                price: this.products[i].lot[j].salePrice,
                items: 1
              });

            }
          }
        }
      }

    }

    // ADD PRODUCT
    this.addProductsService.addProduct(this.addedProductsList);

  }

  // ADD ITEM
  addItem(productId: string) {

    for(let k = 0; k < this.addedProductsList.length; k++) {
      if(productId == this.addedProductsList[k]._id) {
        this.addedProductsList[k].items += 1;
      }
    } 

    // ADD PRODUCT
    this.addProductsService.addProduct(this.addedProductsList);

  }

  // ADD ITEM
  lessItem(productId: string) {

    for(let k = 0; k < this.addedProductsList.length; k++) {
      if(productId == this.addedProductsList[k]._id) {
        this.addedProductsList[k].items -= 1;

        if(this.addedProductsList[k].items == 0) {
          this.addedProductsList.splice(k, 1);
        }

      }
    }

    // ADD PRODUCT
    this.addProductsService.addProduct(this.addedProductsList);

  }

  // SELECT CATEGORY
  selectCategory(categoryId: string) {

  }

  // CHECK OUT
  checkOut() {
    this.addProductsService.checkOut();
  } 

  // CALCULATE TOTAL AMOUNT
  calculateTotal() {

    this.totalAmount = 0;

    for(let k = 0; k < this.addedProductsList.length; k++) {
      this.totalAmount += this.addedProductsList[k].price * this.addedProductsList[k].items;
    }
  }

  ngOnInit() {

    // ADD PRODUCTS DATA
    this.addProductsData = this.addProductsService.addProducts;
    this.addProductsData.subscribe(data => {
      
        this.addedProductsList = data;

        // CALCULATE TOTAL
        this.calculateTotal();

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

      if(data.length > 0 ) {
        this.products = data;
        console.log(this.products);
      }
    
    });

  }

}
