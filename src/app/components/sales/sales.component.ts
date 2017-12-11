import { Component, OnInit, Input } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { ViewChild } from '@angular/core';

// SERVICES
import { FilterConfigService } from '../../services/filter-config/filter-config.service';
import { SalesService } from '../../services/sales/sales.service';
import { NewSaleService } from '../../socket/new-sale.service';

// INTERFACES
import { Categories } from '../../interfaces/categories.interface';
import { FilterConfig } from '../../interfaces/filter-config.interface';
import { FilterOptions } from '../../interfaces/filter-options.interface';

@Component({
  selector: 'sales',
  providers: [],
  styleUrls: [ './sales.component.css' ],
  templateUrl: './sales.component.html'
})
export class SalesComponent implements OnInit {
  
  filterConfig = <FilterConfig>{};
  filterOptions: FilterOptions;
  
  newSale: Array<Boolean> = [];

  filterConfigData: Observable<any>;
  salesChartData: Observable<any>;
  newSaleData: Observable<any>;

  // MONTHS ARRAY
  months = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

  // CHART VARIABLES
  labels: Array<string>;
  data: Array<number>;
  columnTypes: Array<any>;
  chartType : string;
  options: any;

  // COLUMN CHART DATA
  columnChartData:any =  {
    chartType: 'LineChart',
    dataTable: [
      ['Date', 'Average', 'Sales']
    ],
    options: {
      'bar' : {groupWidth: 120 },
      'width': '70%',
      'height': 300,
      'bars': 'vertical',
      'backgroundColor': '#fff',
      'colors': ['#dab07b', '#7bbcda'],
      'chartArea': { 'left': 60, 'bottom': 30, 'right':0, 'top': 50 },
      hAxis: {
        'slantedText': true,
        'textStyle' : {
          color: '#333',
          fontSize: 12
        }
      },
      vAxis: {
        'baseline': 0,
        'baselineColor': '#bbb',
        'gridlines': {
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
      }
    }
  }

  @ViewChild('cchart') cchart;

  constructor(
    private filterConfigService: FilterConfigService,
    private salesService: SalesService,
    private newSaleService: NewSaleService) {

    // INITIALIZE FILTER OPTIONS
    this.filterOptions = {
      store: true,
      category: true,
      product: true,
      brand: true,
      genre: true,
      user: false,
      method: true,
      toDate: true,
      fromDate: true,
      period: true
    }

  }

  // GET CHART DATA
  getChartData(sales) {

    let dataTable = [];
    let dateTable = [];

    let fromDate = new Date(this.filterConfig.fromDate);
    let toDate = new Date(this.filterConfig.toDate);

    this.columnChartData = Object.create(this.columnChartData);

    if(this.filterConfig.selectedPeriod == 'Daily') {
      
      let timeDifference = (toDate.getTime() + (1000 * 3600 * 24)) - fromDate.getTime();
      let days = (timeDifference / (1000 * 3600 * 24));

      let daySaleData = [];
      let daySaleAmount = 0;

      let newDate = fromDate;

      for(let j = 0; j <= days; j++) {

        if(j != 0) {

          newDate = new Date(newDate.getTime() + (3600 * 24 * 1000));

          let newFormatDate = newDate.getDate() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getFullYear();
          dateTable[ newDate.getDate() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getFullYear() ] = [ dateFormat(newDate.getDate()) + '-' + dateFormat((newDate.getMonth() + 1)), 0, 0 ];

        } else {

          newDate = new Date(newDate.getTime());

          let newFormatDate = newDate.getDate() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getFullYear();
          dateTable[ newDate.getDate() + '-' + (newDate.getMonth() + 1) + '-' + newDate.getFullYear() ] = [ dateFormat(newDate.getDate()) + '-' + dateFormat((newDate.getMonth() + 1)), 0 , 0];

        }

      }

      if(sales.length > 0) {
        for(let i = sales.length - 1; i >= 0; i--) {

          let saleDate = new Date(sales[i].date);
          let saleFormatDate = saleDate.getDate() + '-' + (saleDate.getMonth() + 1) + '-' + saleDate.getFullYear();

          if(dateTable[saleFormatDate]) {
            dateTable[saleFormatDate] = [ dateTable[saleFormatDate][0], dateTable[saleFormatDate][1] + ( parseFloat(sales[i].totalAmount) - 0.30 ), dateTable[saleFormatDate][2] + parseFloat(sales[i].totalAmount) ];
          }

        }
      }

      for(let k = 0; k <= Object.keys(dateTable).length - 1; k++) {
        dataTable.push([ dateTable[Object.keys(dateTable)[k]][0], dateTable[Object.keys(dateTable)[k]][1], dateTable[Object.keys(dateTable)[k]][2] ]);
      }
    
      dataTable.unshift(['Date', 'Average', 'Sales']);
      this.columnChartData.dataTable = dataTable;

    }

    if(this.filterConfig.selectedPeriod == 'Monthly') {}
    if(this.filterConfig.selectedPeriod == 'Yearly') {}

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

  changeChart() {
    this.chartType = 'Line';
    //this.cchart.redraw();
  }

  addSale(sale: any) {
    this.salesService.addSale(sale);
  }

  ngOnInit() {

    // FILTER CONFIG SUBSCRIBER
    this.filterConfigData = this.filterConfigService.myFilterConfig;
    this.filterConfigData.subscribe(data => {

      this.filterConfig = data;

    });

    // SALES CHART SUBSCRIBER
    this.salesChartData = this.salesService.mySalesChart;
    this.salesChartData.subscribe(data => {

      // GET CHART DATA
      this.getChartData(data);

    });

    // NEW SALE SUBSCRIBER
    this.newSaleData = this.newSaleService.newSale;
    this.newSaleData.subscribe(data => {
      
      this.newSale = data;

      if(this.newSale[0] == true) {
        this.salesService.getSales(this.filterConfig.fromDate, this.filterConfig.toDate);
      }

    });

  }

}
