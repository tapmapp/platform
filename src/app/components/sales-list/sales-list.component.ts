import { Component, OnInit, Input} from '@angular/core';
import { Observable, Subject } from 'rxjs';

// SERVICES
import { FilterConfigService } from '../../services/filter-config/filter-config.service';
import { SalesService } from '../../services/sales/sales.service';

// PIPES
import { FilterSalesByPipe } from '../../pipes/filter-sales-by.pipe';

// INTERFACES
import { FilterConfig } from '../../interfaces/filter-config.interface';

@Component({
  selector: 'sales-list',
  styleUrls: [ './sales-list.component.css' ],
  templateUrl: './sales-list.component.html',
  providers: [ FilterSalesByPipe ]
})
export class SalesListComponent implements OnInit {

  filterConfig = <FilterConfig>{};
  sales: Array<any> = [];
  tickets: Array<any> = [];

  salesData: Observable<any>;
  filterConfigData: Observable<any>;

  totalAmount: number = 0;
  totalProfit: number = 0;

  selectedTicketId: string = '';
  orderBy: string = 'tickets';

  constructor(
    private filterConfigService: FilterConfigService,
    private filterSalesByPipe: FilterSalesByPipe,
    private salesService: SalesService) {}

  // SELECT TICKET ID
  selectTicketId(ticketId: string) {
    if(ticketId != this.selectedTicketId) {
      this.selectedTicketId = ticketId;
    } else {
      this.selectedTicketId = '';
    }
  }

  // ORDER SALES BY
  orderSalesBy(order: string) {
    this.orderBy = order;
    this.filterConfigService.setConfig(this.filterConfig);
  }

  // SELECT STORE
  selectStore(storeId: string) {
    this.filterConfig.storeId = storeId;
    this.filterConfigService.setConfig(this.filterConfig);
  }

  // SELECT PRODUCT
  selectProduct(productId: string) {
    this.filterConfig.productId = productId;
    this.filterConfigService.setConfig(this.filterConfig);
  }

  // SELECT CATEGORY
  selectCategory(categoryId: string) {
    this.filterConfig.categoryId = categoryId;
    this.filterConfigService.setConfig(this.filterConfig);
  }

  // SELECT USER
  selectUser(userId: string) {
    this.filterConfig.userId = userId;
    this.filterConfigService.setConfig(this.filterConfig);
  }

  // SELECT GENRE
  selectGenre(genre: string) {
    this.filterConfig.genreId = genre;
    this.filterConfigService.setConfig(this.filterConfig);
  }

  // SELECT METHOD
  selectMethod(method: string) {
    this.filterConfig.method = method;
    this.filterConfigService.setConfig(this.filterConfig);
  }

  // CALCULATE TOTAL AMOUNT AND TOTAL PROFIT
  calculateTotalsSales(sales) {

    this.totalAmount = 0;
    this.totalProfit = 0;

    for(let sale in sales) {
      this.totalAmount += sales[sale].price * sales[sale].units;
      this.totalProfit += (sales[sale].price - sales[sale].acqPrice) * sales[sale].units;
    }

    this.totalAmount.toFixed(2);
    this.totalProfit.toFixed(2);

  }

  // CALCULATE TOTAL AMOUNT AND TOTAL PROFIT
  calculateTotalsTickets(sales) {

    this.totalAmount = 0;
    this.totalProfit = 0;

    for(let sale in sales) {
      this.totalAmount += sales[sale].totalAmount;
      this.totalProfit += sales[sale].totalProfit;
    }

    this.totalAmount.toFixed(2);
    this.totalProfit.toFixed(2);

  }

  ngOnInit() {

    // FILTER CONFIG SUBSCRIBER
    this.filterConfigData = this.filterConfigService.myFilterConfig;
    this.filterConfigData.subscribe(data => {

      this.filterConfig = data;
      
      let filteredTickets = this.filterSalesByPipe.transform(this.tickets, this.filterConfig);

      if(this.orderBy == 'products') {
        this.sales = this.salesService.orderBySales(filteredTickets);
        this.calculateTotalsSales(this.sales);
      }
      
      if(this.orderBy == 'tickets') {
        this.sales = this.salesService.orderByTickets(filteredTickets);
        this.calculateTotalsTickets(this.sales);
      }

    });

    // SALES SUBSCRIBER
    this.salesData = this.salesService.mySales;
    this.salesData.subscribe(data => {

        this.tickets = this.filterSalesByPipe.transform(data, this.filterConfig);

        if(this.orderBy == 'products') {
          this.sales = this.salesService.orderBySales(this.tickets);
          this.calculateTotalsSales(this.sales);
        }

        if(this.orderBy == 'tickets') {
          this.sales = this.salesService.orderByTickets(this.tickets);
          this.calculateTotalsTickets(this.sales);
        }
        
    });

  }
}
