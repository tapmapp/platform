import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';

// INTERFACES
import { AddProducts } from '../../interfaces/add-products.interface';

@Injectable()
export class AddProductsService {

    // PRODUCTS OBSERVABLE SERVICE CONFIGURATION VARIABLES
    addProducts: Observable<Array<any>>;
    private _addProducts: BehaviorSubject<Array<any>>;
    private addProductsStore: { addProducts: Array<any> };

    constructor(private http: Http) {

        // PRODUCTS INITIALIZATION VARIABLES
        this.addProductsStore = { addProducts: [] };
        this._addProducts = new BehaviorSubject(this.addProductsStore.addProducts);
        this.addProducts = this._addProducts.asObservable();

    }

    // ADD PRODUCT TO LIST
    addProduct(listProducts: Array<any>) {
        this.addProductsStore.addProducts = listProducts;
        this._addProducts.next(this.addProductsStore.addProducts);
    }

    // CHECKOUT
    checkOut() {

        console.log(this.addProductsStore.addProducts);
        
        // TRADE API URL
        let checkOutUrl = 'http://localhost:3000/check-out';

        this.http.post(checkOutUrl, {products: this.addProductsStore.addProducts }).subscribe(data => {
            
        });

    }

}