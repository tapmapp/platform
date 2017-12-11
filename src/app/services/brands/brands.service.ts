import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';

// INTERFACES
import { Brands } from '../../interfaces/brands.interface';

@Injectable()
export class BrandsService {

    // CATEGORIES OBSERVABLE SERVICE
    brands: Observable<Array<Brands>>;
    private _brands: BehaviorSubject<Array<Brands>>;
    private brandsStore: { brands: Array<Brands> };

    constructor(private http: Http) {

        // CATEGORIES
        this.brandsStore = { brands: [] };
        this._brands = new BehaviorSubject(this.brandsStore.brands);
        this.brands = this._brands.asObservable();

        this.getBrands();

    }

    getBrands() {
        
        // BRANDS URL
        let brandsUrl = 'http://localhost:3000/brands';

        this.http.get(brandsUrl).subscribe(data => {
            this.brandsStore.brands = JSON.parse(data.text());
            this._brands.next(this.brandsStore.brands);
        });

    }

}