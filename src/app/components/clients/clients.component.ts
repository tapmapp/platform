import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ViewChild } from '@angular/core';

// SERVICES
import { CampaignsService } from '../../services/campaigns/campaigns.service';
import { ClientsService } from '../../services/clients/clients.service';
import { ClientsListsService } from '../../services/clients-lists/clients-lists.service';
import { FilterConfigService } from '../../services/filter-config/filter-config.service';
import { SalesService } from '../../services/sales/sales.service';

// PIPES
import { FilterSalesByPipe } from '../../pipes/filter-sales-by.pipe';

// INTERFACES
import { ClientsLists } from '../../interfaces/clients-lists.interface';
import { FilterConfig } from '../../interfaces/filter-config.interface';
import { FilterOptions } from '../../interfaces/filter-options.interface';
import { Sales } from '../../interfaces/sales.interface';

@Component({
  selector: 'clients',
  styleUrls: [ './clients.component.css' ],
  templateUrl: './clients.component.html',
  providers: [ FilterSalesByPipe ]
})
export class ClientsComponent implements OnInit {

  filterConfig = <FilterConfig>{};
  filterOptions: FilterOptions;
  tickets: Array<any> = [];
  clients: Array<any> = [];
  clientsLists: Array<ClientsLists> = [];

  clientsListsData: Observable<Array<ClientsLists>>;
  filterConfigData: Observable<any>;
  clientsChartData: Observable<any>;
  salesData: Observable<any>;
  salesChartData: Observable<any>;

  // ACTIVE STORE ATTRIBUTES
  lat: number = null; 
  long: number = null;

  // CHART VARIABLES
  labels: Array<string>;
  data: Array<number>;
  columnTypes: Array<any>;
  chartType : string;
  options: any;

  // COLUMN CHART DATA
  lineChartData:any =  {
    chartType: 'ComboChart',
    dataTable: [
      ['Month', 'Clients', 'Sales'],
      [0, 0, 0]
    ],
    options: {
      width: '100%',
      height: 300,
      min: 0,
      legend: 'none',
      chartArea: { 'left': 60, 'bottom': 30, 'right':30, 'top': 50 },
      colors: ['#ececec', '#7bbcda'],
      lineWidth: 3,
      hAxis: {
        slantedText: true,
        textStyle : {
          color: '#333',
          fontSize: 12
        }
      },
      vAxis: {
        baseline: 0,
        baselineColor: '#bbb',
        gridlines: {
          count: 4
        },
        minValue: 0,
        textStyle: {
          color: '#333',
          fontName: 'Arial',
          fontSize: 10,
          bold: false,
          italic: false
        }
      },
      seriesType: 'line',
      series: { 0: {type: 'bars', targetAxisIndex:1}}
    }
  }

  // BAR DAY DATA
  columnDaysData:any =  {
    chartType: 'ColumnChart',
    dataTable: [
      ['Day', 'Clients'],
      ['L', 0],
      ['M', 0],
      ['X', 0],
      ['J', 0],
      ['V', 0],
      ['S', 0],
      ['D', 0]
    ],
    options: {
      width: '100%',
      height: 140,
      min: 0,
      legend: 'none',
      chartArea: { 'left': 45, 'bottom': 40, 'right':30, 'top': 20 },
      colors: ['#7bbcda'],
      bar: { groupWidth: "80%" },
      hAxis: {
        slantedText: false,
        textStyle : {
          color: '#333',
          fontSize: 11
        }
      },
      vAxis: {
        baseline: 0,
        baselineColor: '#bbb',
        gridlines: {
          count: 3
        },
        minValue: 0,
        textStyle: {
          color: '#333',
          fontName: 'Arial',
          fontSize: 10,
          bold: false,
          italic: false
        }
      }
    }
  }

  // BAR DAY DATA
  columnTimeData:any =  {
    chartType: 'ColumnChart',
    dataTable: [
      ['Hour', 'Clients'],
      ['1h', 0],
      ['2h', 0],
      ['3h', 0],
      ['4h', 0],
      ['5h', 0],
      ['6h', 0],
      ['7h', 0],
      ['8h', 0],
      ['9h', 0],
      ['10h', 0],
      ['11h', 0],
      ['12h', 0],
      ['13h', 0],
      ['14h', 0],
      ['15h', 0],
      ['16h', 0],
      ['17h', 0],
      ['18h', 0],
      ['19h', 0],
      ['20h', 0],
      ['21h', 0],
      ['22h', 0],
      ['23h', 0],
      ['24h', 0]
    ],
    options: {
      width: '100%',
      height: 140,
      min: 0,
      legend: 'none',
      chartArea: { 'left': 45, 'bottom': 40, 'right':30, 'top': 20 },
      colors: ['#7bbcda'],
      bar: { groupWidth: "80%" },
      hAxis: {
        slantedText: true,
        textStyle : {
          color: '#333',
          fontSize: 11
        }
      },
      vAxis: {
        baseline: 0,
        baselineColor: '#bbb',
        gridlines: {
          count: 3
        },
        minValue: 0,
        textStyle: {
          color: '#333',
          fontName: 'Arial',
          fontSize: 10,
          bold: false,
          italic: false
        }
      }
    }
  }

  @ViewChild('cchart') cchart;
  @ViewChild('cchart2') cchart2;
  @ViewChild('cchart3') cchart3;

  constructor(
    private campaignsService: CampaignsService,
    private clientsService: ClientsService,
    private clientsListsService: ClientsListsService,
    private filterConfigService: FilterConfigService,
    private filterSalesByPipe: FilterSalesByPipe,
    private salesService: SalesService) {

    // INITIALIZE FILTER OPTIONS
    this.filterOptions = {
      store: true,
      category: true,
      product: true,
      brand: true,
      genre: true,
      user: false,
      method: false,
      toDate: true,
      fromDate: true,
      period: true
    }

  }

  createUser() {
    this.clientsService.createUser();
  }

  // FILTER BY USER
  selectUser(userId) {

    this.filterConfig.userId = userId;

    // SET FILTER CONFIG
    this.filterConfigService.setConfig(this.filterConfig);

  };
  
  // FILTER BY GENRE
  selectGenre(genreId) {
    this.filterConfig.genreId = genreId;

    // SET FILTER CONFIG
    this.filterConfigService.setConfig(this.filterConfig);
  }

  // GET CHART DATA
  getChartData(sales) {

    let dataTable = [];
    let dateTable = [];

    let fromDate = withoutTime(new Date(this.filterConfig.fromDate).getTime());
    let toDate = withoutTime(new Date(this.filterConfig.toDate).getTime());

    this.lineChartData = Object.create(this.lineChartData);

    if(this.filterConfig.selectedPeriod == 'Daily') {
      
      let timeDifference = toDate.getTime() - fromDate.getTime();
      let days = (timeDifference / (1000 * 3600 * 24));

      let daySaleData = [];
      let daySaleAmount = 0;

      let newDate = new Date(fromDate);

      for(let j = 0; j <= days; j++) {

        if(j != 0) {

          newDate = withoutTime(newDate.getTime() + (3600 * 24 * 1000));

          let newFormatDate = newDate.getDate() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getFullYear();
          dateTable[ newDate.getDate() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getFullYear() ] = [ dateFormat(newDate.getDate()) + '-' + dateFormat((newDate.getMonth() + 1)), 0, 0 ];

        } else {

          newDate = withoutTime(newDate.getTime());

          let newFormatDate = newDate.getDate() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getFullYear();
          dateTable[ newDate.getDate() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getFullYear() ] = [ dateFormat(newDate.getDate()) + '-' + dateFormat((newDate.getMonth() + 1)), 0 , 0];

        }

      }

      if(sales.length > 0) {
        for(let i = sales.length - 1; i >= 0; i--) {

          let saleDate = withoutTime(sales[i].date);
          let saleFormatDate = saleDate.getDate() + '-' + (saleDate.getMonth() + 1) + '-' + saleDate.getFullYear();

          if(dateTable[saleFormatDate]) {
            dateTable[saleFormatDate] = [ dateTable[saleFormatDate][0], dateTable[saleFormatDate][1] + 1, dateTable[saleFormatDate][2] + parseFloat(sales[i].totalAmount) ];
          }

        }
      }

      for(let k = 0; k <= Object.keys(dateTable).length - 1; k++) {
        dataTable.push([ dateTable[Object.keys(dateTable)[k]][0], dateTable[Object.keys(dateTable)[k]][1], dateTable[Object.keys(dateTable)[k]][2] ]);
      }

      dataTable.unshift(['Month', 'Clients', 'Sales']);
      this.lineChartData.dataTable = dataTable;

    }

    if(this.filterConfig.selectedPeriod == 'Monthly') {}
    if(this.filterConfig.selectedPeriod == 'Yearly') {}

    function withoutTime(saleDate: number) {
      let date = new Date(saleDate);
      return date;
    }

    function dateFormat(value: number) {
      let newValue: string;
      if(value < 10) {
        newValue = '0' + value;
      } else {
        newValue = value.toString();
      }
      return newValue;
    }

  }

  // GET VISIT FRECUENCY
  getDaysFrecuency(tickets) {

    this.columnDaysData = Object.create(this.columnDaysData);
    let frecuency: Array<any> = [
      ['Day', 'Clients'],
      ['L', 0],
      ['M', 0],
      ['X', 0],
      ['J', 0],
      ['V', 0],
      ['S', 0],
      ['D', 0]
    ];

    for(let i = 0; i < tickets.length; i++) {
      setSale(tickets[i].date);
    }

    this.columnDaysData.dataTable = frecuency;

    function setSale(saleDate: string) {

      switch (new Date(saleDate).getDay()) {
        case 0:
            frecuency[7][1] = frecuency[7][1] + 1;
            break;
        case 1:
            frecuency[1][1] = frecuency[1][1] + 1;
            break;
        case 2:
            frecuency[2][1] = frecuency[2][1] + 1;
            break;
        case 3:
            frecuency[3][1] = frecuency[3][1] + 1;
            break;
        case 4:
            frecuency[4][1] = frecuency[4][1] + 1;
            break;
        case 5:
            frecuency[5][1] = frecuency[5][1] + 1;
            break;
        case 6:
            frecuency[6][1] = frecuency[6][1] + 1;
      }

    }

  }

  // GET TIME FRECUENCY
  getTimeFrecuency(tickets) {

    this.columnTimeData = Object.create(this.columnTimeData);
    let frecuency: Array<any> = [
      ['Hour', 'Clients'],
      ['1h', 0],
      ['2h', 0],
      ['3h', 0],
      ['4h', 0],
      ['5h', 0],
      ['6h', 0],
      ['7h', 0],
      ['8h', 0],
      ['9h', 0],
      ['10h', 0],
      ['11h', 0],
      ['12h', 0],
      ['13h', 0],
      ['14h', 0],
      ['15h', 0],
      ['16h', 0],
      ['17h', 0],
      ['18h', 0],
      ['19h', 0],
      ['20h', 0],
      ['21h', 0],
      ['22h', 0],
      ['23h', 0],
      ['24h', 0]
    ];

    for(let i = 0; i < tickets.length; i++) {
      setSale(tickets[i].date);
    }

    this.columnTimeData.dataTable = frecuency;

    function setSale(saleDate: string) {

      switch (new Date(saleDate).getHours()) {
        case 0:
            frecuency[24][1] = frecuency[24][1] + 1;
            break;
        case 1:
            frecuency[1][1] = frecuency[1][1] + 1;
            break;
        case 2:
            frecuency[2][1] = frecuency[2][1] + 1;
            break;
        case 3:
            frecuency[3][1] = frecuency[3][1] + 1;
            break;
        case 4:
            frecuency[4][1] = frecuency[4][1] + 1;
            break;
        case 5:
            frecuency[5][1] = frecuency[5][1] + 1;
            break;
        case 6:
            frecuency[6][1] = frecuency[6][1] + 1;
            break;
        case 7:
            frecuency[7][1] = frecuency[7][1] + 1;
            break;
        case 8:
            frecuency[8][1] = frecuency[8][1] + 1;
            break;
        case 9:
            frecuency[9][1] = frecuency[9][1] + 1;
            break;
        case 10:
            frecuency[10][1] = frecuency[10][1] + 1;
            break;
        case 11:
            frecuency[11][1] = frecuency[11][1] + 1;
            break;
        case 12:
            frecuency[12][1] = frecuency[12][1] + 1;
            break;
        case 13:
            frecuency[13][1] = frecuency[13][1] + 1;
            break;
        case 14:
            frecuency[14][1] = frecuency[14][1] + 1;
            break;
        case 15:
            frecuency[15][1] = frecuency[15][1] + 1;
            break;
        case 16:
            frecuency[16][1] = frecuency[16][1] + 1;
            break;
        case 17:
            frecuency[17][1] = frecuency[17][1] + 1;
            break;
        case 18:
            frecuency[18][1] = frecuency[18][1] + 1;
            break;
        case 19:
            frecuency[19][1] = frecuency[19][1] + 1;
            break;
        case 20:
            frecuency[20][1] = frecuency[20][1] + 1;
            break;
        case 21:
            frecuency[21][1] = frecuency[21][1] + 1;
            break;
        case 22:
            frecuency[22][1] = frecuency[22][1] + 1;
            break;
        case 23:
            frecuency[23][1] = frecuency[23][1] + 1;
            break;
      }

    }

  }

  ngOnInit() {

    // CLIENTS LISTS SUBSCRIBER
    this.clientsListsData = this.clientsListsService.myClientsLists;
    this.clientsListsData.subscribe(data => {
      if(data.length > 0) {
        this.clientsLists = data;
      }
    });

    // FILTER CONFIG SUBSCRIBER
    this.filterConfigData = this.filterConfigService.myFilterConfig;
    this.filterConfigData.subscribe(data => {

      this.filterConfig = data;

      let filteredTickets = this.filterSalesByPipe.transform(this.tickets, this.filterConfig);
      this.clients = this.clientsService.getClientList(filteredTickets, this.filterConfig);

      // GET FRECUENCY SALES
      this.getDaysFrecuency(filteredTickets);
      this.getTimeFrecuency(filteredTickets);

    });

    // SALES CHART SUBSCRIBER
    this.salesChartData = this.salesService.mySalesChart;
    this.salesChartData.subscribe(data => {

        // GET CHART DATA
        this.getChartData(data);

    });

    // SALES SUBSCRIBER
    this.salesData = this.salesService.mySales;
    this.salesData.subscribe(data => {

      this.tickets = this.filterSalesByPipe.transform(data, this.filterConfig);
      this.clients = this.clientsService.getClientList(this.tickets, this.filterConfig);

      // GET FRECUENCY SALES
      this.getDaysFrecuency(this.tickets);
      this.getTimeFrecuency(this.tickets);

    });

  }
}
