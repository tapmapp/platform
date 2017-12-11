import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { ViewChild } from '@angular/core';

// SERVICES
import { ClientsService } from '../../services/clients/clients.service';
import { FilterConfigService } from '../../services/filter-config/filter-config.service';
import { SalesService } from '../../services/sales/sales.service';

// PIPES
import { FilterSalesByPipe } from '../../pipes/filter-sales-by.pipe';

// INTERFACES
import { Clients } from '../../interfaces/clients.interface';
import { FilterConfig } from '../../interfaces/filter-config.interface';

@Component({
  selector: 'clients',
  styleUrls: [ './client-info.component.css' ],
  templateUrl: './client-info.component.html',
  providers: [ FilterSalesByPipe ]
})
export class ClientInfoComponent implements OnInit {

  id: string;
  clientInfo: Array<Clients>;
  filterConfig = <FilterConfig>{};
  tickets: Array<any> = [];

  routeSubscriber: any;
  clientInfoData: Observable<Array<Clients>>;
  filterConfigData: Observable<any>;
  salesData: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private clientsService: ClientsService,
    private filterConfigService: FilterConfigService,
    private filterSalesByPipe: FilterSalesByPipe,
    private salesService: SalesService) {}

  ngOnInit() {

    this.routeSubscriber = this.route.params.subscribe(params => {

      // CLIENT ID
      this.id = params.id;

      // GET CLIENT INFO
      this.clientsService.getClientInfo(this.id);

    });

    // CLIENT INFO SUBSCRIBER
    this.clientInfoData = this.clientsService.clientInfo;
    this.clientInfoData.subscribe(data => {
      if(data.length > 0) {
        this.clientInfo = data;
      }
    });

    // FILTER CONFIG SUBSCRIBER
    this.filterConfigData = this.filterConfigService.myFilterConfig;
    this.filterConfigData.subscribe(data => {

      this.filterConfig = data;

    });

    // SALES SUBSCRIBER
    this.salesData = this.salesService.mySales;
    this.salesData.subscribe(data => {

      if(data.length > 0) {

        // USER ID
        this.filterConfig.userId = this.id;

        this.tickets = this.filterSalesByPipe.transform(data, this.filterConfig);

        // GET FRECUENCY SALES
        //this.getDaysFrecuency(this.tickets);
        //this.getTimeFrecuency(this.tickets);
      }
      
    });

  }

  ngOnDestroy() {
    this.routeSubscriber.unsubscribe();
  }

}
