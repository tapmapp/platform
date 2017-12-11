import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// LOCAL STORAGE
import { LocalStorageService } from 'angular-2-local-storage';

// SERVICES
import { FilterConfigService } from './services/filter-config/filter-config.service';
import { MerchantsService } from './services/merchants/merchants.service';
import { SalesService } from './services/sales/sales.service';


// INTERFACES
import { FilterConfig } from './interfaces/filter-config.interface';
import { Merchant } from './interfaces/merchants.interface';
import { Sales } from './interfaces/sales.interface';

@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  
  merchantData: Observable<any>;
  filterConfigData: Observable<any>;
  latestsSalesData: Observable<any>;

  merchant = <Merchant>{};
  filterConfig = <FilterConfig>{};
  latestsSales: Array<Sales> = [];

  constructor(
    private localStorageService: LocalStorageService,
    private filterConfigService: FilterConfigService,
    private merchantsService: MerchantsService,
    private salesService: SalesService) {}

  ngOnInit() {

    // FILTER CONFIG SUBSCRIBER
    this.filterConfigData = this.filterConfigService.myFilterConfig;
    this.filterConfigData.subscribe(data => {

      this.filterConfig = data;

    });

    // MERCHANT INFO SUBSCRIBER
    this.merchantData = this.merchantsService.merchant;
    this.merchantData.subscribe(data => {

      if(Object.keys(data).length !== 0) {

        this.merchant = data;

        if(!this.localStorageService.get('sales-data')) {

          // MERCHANT CREATION DATE
          let merchantCreationDate = new Date(this.merchant.created);
          let merchantFormatedDate = merchantCreationDate.getFullYear() + '-' + (merchantCreationDate.getMonth() + 1) + '-' + merchantCreationDate.getDate();

          // TODAY FORMATED DATE
          let today = new Date();
          let todayFormatedDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

          // SET FROM DATE
          this.filterConfig.fromDate = merchantFormatedDate;

          // TO DATE DATE
          this.filterConfig.toDate = todayFormatedDate;

          // SET FILTER VARIABLES
          this.filterConfigService.setConfig(this.filterConfig);

          // GET SALES SINCE MERCHANT CREATION
          this.salesService.getSales(merchantFormatedDate, todayFormatedDate);

        } else {

          let storedSales: any = this.localStorageService.get('sales-data');

          // LAST SALE
          let lastSale = storedSales[storedSales.length - 1];
          let lastSaleDate = new Date(lastSale.date);
          lastSaleDate.setDate(lastSaleDate.getDate() + 1);
          let lastSaleFormatedDate = lastSaleDate.getFullYear() + '-' + (lastSaleDate.getMonth() + 1) + '-' + lastSaleDate.getDate();

          // TODAY FORMATED DATE
          let today = new Date();
          let fromDate = today.getFullYear() + '-' + (today.getMonth()) + '-' + today.getDate();
          let todayFormatedDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate(); 

          // GET SALES SINCE MERCHANT CREATION
          this.salesService.getLatestSales(lastSaleFormatedDate, todayFormatedDate);

        }

      }

    });

    // LATESTS SALES SUBSCRIBER
    this.latestsSalesData = this.salesService.latestsSales;
    this.latestsSalesData.subscribe(data => {

      if(data.length > 0) {

        // GET STORED SALES
        let storedSales: any = this.localStorageService.get('sales-data');

        let newSales = data;

        for(let i = 0; i < newSales.length; i++) {
          storedSales.push(newSales[i]);
        }

        this.localStorageService.set('sales-data', storedSales);
        
        let today = new Date();
        let fromDate = today.getFullYear() + '-' + (today.getMonth()) + '-' + today.getDate();
        let todayFormatedDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        // SET FROM DATE
        this.filterConfig.fromDate = fromDate;

        // TO DATE DATE
        this.filterConfig.toDate = todayFormatedDate;

        // SET FILTER VARIABLES
        this.filterConfigService.setConfig(this.filterConfig);

        // SEND STORED SALES
        this.salesService.sendSales(storedSales);

      } else {

        // GET STORED SALES
        let storedSales: any = this.localStorageService.get('sales-data');

        // FORMAT TODAY DATE
        let today = new Date();
        let todayFormatedDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        // FORMAT DATE ONE MONTH BEFORE TODAY
        today.setMonth(today.getMonth() - 1);
        let fromDate = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

        // SET FROM DATE
        this.filterConfig.fromDate = fromDate;

        // TO DATE DATE
        this.filterConfig.toDate = todayFormatedDate;

        // SET FILTER VARIABLES
        this.filterConfigService.setConfig(this.filterConfig);

        // SEND STORED SALES
        this.salesService.sendSales(storedSales);

      }

    });

  }
}