import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';

// INTERFACES
import { Products } from '../../interfaces/products.interface';
import { MerchantProducts } from '../../interfaces/merchant-products.interface';

@Injectable()
export class ProductsService {

    // PRODUCTS OBSERVABLE SERVICE CONFIGURATION VARIABLES
    products: Observable<Array<Products>>;
    private _products: BehaviorSubject<Array<Products>>;
    private productsStore: { products: Array<Products> };

    // MY PRODUCTS OBSERVABLE SERVICE CONFIGURATION VARIABLES
    myProducts: Observable<Array<MerchantProducts>>;
    private _myProducts: BehaviorSubject<Array<MerchantProducts>>;
    private myProductsStore: { myProducts: Array<MerchantProducts> };

    // MY POSITIONS OBSERVABLE SERVICE CONFIGURATION VARIABLES
    findedProducts: Observable<Array<Products>>;
    private _findedProducts: BehaviorSubject<Array<Products>>;
    private findedProductsStore: { findedProducts: Array<Products> };

    // PRODUCTS OBSERVABLE SERVICE CONFIGURATION VARIABLES
    merchantProductConf: Observable<Boolean>;
    private _merchantProductConf: BehaviorSubject<Boolean>;
    private merchantProductConfStore: { merchantProductConf: Boolean };

    constructor(private http: Http) {

        // PRODUCTS INITIALIZATION VARIABLES
        this.productsStore = { products: [] };
        this._products = new BehaviorSubject(this.productsStore.products);
        this.products = this._products.asObservable();

        // MY PRODUCTS INITIALIZATION VARIABLES
        this.myProductsStore = { myProducts: [] };
        this._myProducts = new BehaviorSubject(this.myProductsStore.myProducts);
        this.myProducts = this._myProducts.asObservable();

        // FINDED PRODUCTS INITIALIZATION VARIABLES
        this.findedProductsStore = { findedProducts: [] };
        this._findedProducts = new BehaviorSubject(this.findedProductsStore.findedProducts);
        this.findedProducts = this._findedProducts.asObservable();

        // FINDED PRODUCTS INITIALIZATION VARIABLES
        this.merchantProductConfStore = { merchantProductConf: false };
        this._merchantProductConf = new BehaviorSubject(this.merchantProductConfStore.merchantProductConf);
        this.merchantProductConf = this._merchantProductConf.asObservable();

        // GET PRODUCTS
        this.getProducts();

    }

    // GET PRODUCTS REQUEST
    getProducts() {
        
        // GET PRODUCTS URL
        let productsUrl = 'http://localhost:3000/products/merchant-products';

        this.http.get(productsUrl).subscribe(data => {
            this.myProductsStore.myProducts = JSON.parse(data.text());
            this._myProducts.next(this.myProductsStore.myProducts);
        });

    }

    // FIND PRODUCTS REQUEST
    findProduct(productString: string) {

        // FIND PRODUCTS URL
        let findProductsUrl = 'http://localhost:3000/products/find';

        this.http.post(findProductsUrl, { productString: productString }).subscribe(data => {
            this.findedProductsStore.findedProducts = JSON.parse(data.text());
            this._findedProducts.next(this.findedProductsStore.findedProducts);
        });

    }

    // ADD PRODUCT REQUEST
    addProduct(product: Array<any>) {
    
        // ADD PRODUCT API URL
        let addProductsUrl = 'http://localhost:3000/products/add';

        this.http.post(addProductsUrl, { product: product }).subscribe(data => {
            
        });

    }   

    // REMOVE MERCHANT PRODUCT
    removeProduct(productId) {
        
        // REMOVE MERCHANT PRODUCT API URL
        let removeMerchantProductUrl = 'http://localhost:3000/products/delete-merchant-product';

        this.http.post(removeMerchantProductUrl, { productId: productId }).subscribe(data => {
            
            var response = JSON.parse(data.text());
            
            if(response == true) {
                this._merchantProductConf.next(true);
            }
 
        });
    }

    // ADD MERCHANT PRODUCT REQUEST
    addMerchantProduct(product: any) {

        // ADD MERCHANT PRODUCT API URL
        let addProductsUrl = 'http://localhost:3000/products/add-merchant-product';
        
        this.http.post(addProductsUrl, { product: product[0] }).subscribe(data => {
            this.getProducts();
            this._merchantProductConf.next(true);
        });

    }

    // EDIT MERCHANT PRODUCT REQUEST
    editMerchantProduct(product: any) {

        // EDIT MERCHANT PRODUCT URL
        let editMerchantProductUrl = 'http://localhost:3000/products/edit-merchant-product';

        this.http.post(editMerchantProductUrl, { product: product }).subscribe(data => {
            
        });

    }


    // EDIT MERCHANT LOT REQUEST
    editMerchantLot(lotId: any) {

        // TRADE API URL
        let editMerchantLotUrl = 'http://localhost:3000/products/edit-merchant-lot';

        this.http.post(editMerchantLotUrl, { lot: lotId }).subscribe(data => {
            
        });

    }

}