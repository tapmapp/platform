import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';

// LOCAL STORAGE
import { LocalStorageService } from 'angular-2-local-storage';

// INTERFACES
import { Sales } from '../../interfaces/sales.interface';

@Injectable()
export class SalesService {

    // MY SALES OBSERVABLE SERVICE
    mySales: Observable<Array<Sales>>;
    private _mySales: BehaviorSubject<Array<Sales>>;
    private mySalesStore: { mySales: Array<Sales> };

    // MY SALES OBSERVABLE SERVICE
    latestsSales: Observable<Array<Sales>>;
    private _latestsSales: BehaviorSubject<Array<Sales>>;
    private latestsSalesStore: { latestsSales: Array<Sales> };

    // MY SALES TO CHART OBSERVABLE SERVICE
    mySalesChart: Observable<Array<Sales>>;
    private _mySalesChart: BehaviorSubject<Array<Sales>>;
    private mySalesChartStore: { mySalesChart: Array<Sales> };
    
    /*
    // NEW SALE OBSERVABLE SERVICE
    newSale: Observable<Array<any>>;
    private _newSale: BehaviorSubject<Array<any>>;
    private newSaleStore: { newSale: Array<any> };
    */

    constructor(
        private http: Http,
        private localStorageService: LocalStorageService) {

        // MY SALES
        this.mySalesStore = { mySales: [] };
        this._mySales = new BehaviorSubject(this.mySalesStore.mySales);
        this.mySales = this._mySales.asObservable();

        // LATESTS SALES
        this.latestsSalesStore = { latestsSales: [] };
        this._latestsSales = new BehaviorSubject(this.latestsSalesStore.latestsSales);
        this.latestsSales = this._latestsSales.asObservable();

        // MY SALES CHART
        this.mySalesChartStore = { mySalesChart: [] };
        this._mySalesChart = new BehaviorSubject(this.mySalesChartStore.mySalesChart);
        this.mySalesChart = this._mySalesChart.asObservable();

        /*
        // NEW SALE
        this.newSaleStore = { newSale: [] };
        this._newSale = new BehaviorSubject(this.newSaleStore.newSale);
        this.newSale = this._newSale.asObservable();
        */

    }

    // GET SALES
    getSales(fromDate, toDate) {

        // MY SALES API URL
        let salesUrl = 'http://localhost:3000/sales/my-sales';

        this.http.post(salesUrl, { fromDate: fromDate, toDate: toDate }).subscribe(data => {

            // SET LOCAL STORAGE SALES
            this.localStorageService.set('sales-data', JSON.parse(data.text()));

            this.mySalesStore.mySales = JSON.parse(data.text());
            this._mySales.next(this.mySalesStore.mySales);
        });

    }

    // GET LATEST SALES
    getLatestSales(fromDate, toDate) {

        // MY SALES API URL
        let salesUrl = 'http://localhost:3000/sales/my-sales';

        this.http.post(salesUrl, { fromDate: fromDate, toDate: toDate }).subscribe(data => {
            this.latestsSalesStore.latestsSales = JSON.parse(data.text());
            this._latestsSales.next(this.latestsSalesStore.latestsSales);
        });

    }

    // SEND SALES
    sendSales(sales) {
        this.mySalesStore.mySales = sales;
        this._mySales.next(this.mySalesStore.mySales);
    }

    // ADD SALE
    addSale(ticket: any) {
        
        // ADD SALE API URL
        let addSaleUrl = 'http://localhost:3000/sales/add-sale';

        this.http.post(addSaleUrl, { ticket: 'test' }).subscribe(data => {
            /*this.newSaleStore.newSale.length = 0;
            this.newSaleStore.newSale.push(JSON.parse(data.text()));
            this._newSale.next(this.newSaleStore.newSale);*/
        });

    }

    // SEND CHART SALES
    sendChartSales(sales) {
        this.mySalesChartStore.mySalesChart = sales;
        this._mySalesChart.next(this.mySalesChartStore.mySalesChart);
    }

    // ORDER SALES BY PRODUCTS
    orderBySales(tickets) {

        let salesList = [];
        
        for(let i = 0; i < tickets.length; i++) {
        
            // SALES ON TICKET
            let sales = tickets[i].saleId;
            
            for(let j = 0; j < sales.length; j++) {
                
                let sale: any = {};

                sale._id = tickets[i]._id;
                sale.storeId = tickets[i].storeId._id;
                sale.storeName = tickets[i].storeId.name;
                sale.date = tickets[i].date;
                sale.genre = tickets[i].userId.genre;
                sale.totalAmount = tickets[i].totalAmount;
                sale.userId = tickets[i].userId._id;

                sale.productId = sales[j].productId._id;
                sale.productName = sales[j].productId.name + ', ' + sales[j].productId.size;

                sale.categoryId = sales[j].merchantProductId.category._id;
                sale.categoryName = sales[j].merchantProductId.category.name;

                sale.brandId = sales[j].productId.brand;
                sale.brandName = sales[j].productId.brandName;

                sale.acqPrice = sales[j].acqPrice;
                sale.price = sales[j].price;
                
                sale.units = sales[j].units;

                salesList.push(sale);

            }
        }

        return salesList;

    }

    // ORDER SALES BY TICKETS
    orderByTickets(tickets) {

        let ticketsList = [];
        
        for(let i = 0; i < tickets.length; i++) {
    
            let products: Array<any> = [];
            let ticket: any = {};

            ticket._id = tickets[i]._id;
            ticket.userId = tickets[i].userId._id;
            ticket.name = tickets[i].userId.name;
            ticket.lastName = tickets[i].userId.lastName;
            ticket.genre = tickets[i].userId.genre;
            ticket.storeId = tickets[i].storeId._id;
            ticket.storeName = tickets[i].storeId.name;
            ticket.date = tickets[i].date;
            ticket.genre = tickets[i].userId.genre;
            ticket.method = tickets[i].method;

            let sales = tickets[i].saleId;
            let units = 0;
            let totalProfit = 0;

            for(let j = 0; j < sales.length; j++) {
                
                let sale: any = {};

                sale.productId = sales[j].productId._id;
                sale.productName = sales[j].productId.name + ', ' + sales[j].productId.size;

                sale.categoryId = sales[j].merchantProductId.category._id;
                sale.categoryName = sales[j].merchantProductId.category.name;

                sale.brandId = sales[j].productId.brand;
                sale.brandName = sales[j].productId.brandName;

                sale.acqPrice = sales[j].acqPrice;
                sale.price = sales[j].price;
                sale.rate = 3;
                sale.units = sales[j].units;

                units += sales[j].units;
                totalProfit += (sales[j].price * sales[j].units) - (sales[j].acqPrice * sales[j].units);

                products.push(sale);

            }

            ticket.units = units;
            ticket.totalProfit = totalProfit;
            ticket.totalAmount = tickets[i].totalAmount;
            ticket.generalRate = 3;

            // ADD PRODUCTS TO TICKETS
            ticket.products = products;
            
            // PUSH TICKET TO TICKET LIST
            ticketsList.push(ticket);

        }   

        return ticketsList;

    }

}