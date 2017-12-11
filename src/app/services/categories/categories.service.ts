import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';

// INTERFACES
import { Categories } from '../../interfaces/categories.interface';

@Injectable()
export class CategoriesService {

    // CATEGORIES OBSERVABLE SERVICE
    myCategories: Observable<Array<Categories>>;
    private _myCategories: BehaviorSubject<Array<Categories>>;
    private myCategoriesStore: { myCategories: Array<Categories> };

    constructor(private http: Http) {

        // CATEGORIES
        this.myCategoriesStore = { myCategories: [] };
        this._myCategories = new BehaviorSubject(this.myCategoriesStore.myCategories);
        this.myCategories = this._myCategories.asObservable();

        this.getCategories();

    }

    getCategories() {
        
        // TRADE API URL
        let categoriesUrl = 'http://localhost:3000/categories';

        this.http.get(categoriesUrl).subscribe(data => {
            this.myCategoriesStore.myCategories = JSON.parse(data.text());
            this._myCategories.next(this.myCategoriesStore.myCategories);
        });

    }

    getCategoriesStore() {
        return this.myCategoriesStore.myCategories;
    }
}