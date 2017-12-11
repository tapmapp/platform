import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';

// INTERFACES
import { Merchant } from '../../interfaces/merchants.interface';

@Injectable()
export class MerchantsService {

    // CATEGORIES OBSERVABLE SERVICE
    merchant: Observable<Array<Merchant>>;
    private _merchant: BehaviorSubject<Array<Merchant>>;
    private merchantStore: { merchant: Array<Merchant> };

    constructor(private http: Http) {

        // CATEGORIES
        this.merchantStore = { merchant: [] };
        this._merchant = new BehaviorSubject(this.merchantStore.merchant);
        this.merchant = this._merchant.asObservable();

        // GET MERCHANT INFO
        this.getMerchant();

    }

    // GET MERCHANTS REQUEST
    getMerchant() {
        
        // TRADE API URL
        let merchantUrl = 'http://localhost:3000/merchants/merchant-info';

        this.http.get(merchantUrl, {}).subscribe(data => {
            this.merchantStore.merchant = JSON.parse(data.text());
            this._merchant.next(this.merchantStore.merchant);
        });

    }

}