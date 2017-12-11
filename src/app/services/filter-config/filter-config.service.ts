import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

// INTERFACES
import { FilterConfig } from '../../interfaces/filter-config.interface';

@Injectable()
export class FilterConfigService {

    // CATEGORIES OBSERVABLE SERVICE
    myFilterConfig: Observable<FilterConfig>;
    private _myFilterConfig: BehaviorSubject<FilterConfig>;
    private myFilterConfigStore: { myFilterConfig: FilterConfig };

    constructor() {

        // FILTER CATEGORY CONFIG INITIALIAZTION VARIABLES
        this.myFilterConfigStore = { 
            myFilterConfig: { 
                storeId: '',
                categoryId: '',
                productId: '',
                brandId: '',
                genreId: '',
                rateId: '',
                userId: '',
                method: '',
                fromDate: '',
                toDate: '',
                selectedPeriod: 'Daily',
                searchedProduct: ''
            }
        };

        this._myFilterConfig = new BehaviorSubject(this.myFilterConfigStore.myFilterConfig);
        this.myFilterConfig = this._myFilterConfig.asObservable();

    }   

    // SET CONFIG
    setConfig(filterConfig: FilterConfig) {
        this.myFilterConfigStore.myFilterConfig = filterConfig;
        this._myFilterConfig.next( this.myFilterConfigStore.myFilterConfig );
    }

    // GET STORES
    getConfig() {
        this._myFilterConfig.next( this.myFilterConfigStore.myFilterConfig );
    }

}