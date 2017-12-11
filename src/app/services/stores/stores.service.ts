import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';

// INTERFACES
import { Stores } from '../../interfaces/stores.interface';

@Injectable()
export class StoresService {

    // CATEGORIES OBSERVABLE SERVICE
    myStores: Observable<Array<Stores>>;
    private _myStores: BehaviorSubject<Array<Stores>>;
    private myStoresStore: { myStores: Array<Stores> };

    constructor(private http: Http) {

        // CATEGORIES
        this.myStoresStore = { myStores: [] };
        this._myStores = new BehaviorSubject(this.myStoresStore.myStores);
        this.myStores = this._myStores.asObservable();

        // GET STORES
        this.getStores();

    }   

    // GET STORES REQUEST
    getStores() {

        // TRADE API URL
        let storesUrl = 'http://localhost:3000/stores';

        this.http.get(storesUrl).subscribe(data => {
            this.myStoresStore.myStores = JSON.parse(data.text());
            this._myStores.next(this.myStoresStore.myStores);
        });

    }

    // GET STORES STORE
    getStoresStore() {
        return this.myStoresStore.myStores;
    }

}