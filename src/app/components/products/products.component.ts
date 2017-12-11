import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// GOOGLE CHART DEPENDENCIES
import { ChartReadyEvent } from 'ng2-google-charts';
import { ChartErrorEvent } from 'ng2-google-charts';
import { ChartSelectEvent } from 'ng2-google-charts';
import { ChartMouseOverEvent, ChartMouseOutEvent } from 'ng2-google-charts';

// DIRECTIVES
import { ProductDirective } from '../../directives/product/product.directive';

// SERVICES
import { CategoriesService } from '../../services/categories/categories.service';
import { FilterConfigService } from '../../services/filter-config/filter-config.service';
import { ProductsService } from '../../services/products/products.service';
import { SalesService } from '../../services/sales/sales.service';
import { StoresService } from '../../services/stores/stores.service';
import { NewSaleService } from '../../socket/new-sale.service';

// PIPES
import { FilterSalesByPipe } from '../../pipes/filter-sales-by.pipe';
import { OrderByPipe } from '../../pipes/order-by.pipe';

// INTERFACES
import { FilterConfig } from '../../interfaces/filter-config.interface';
import { FilterOptions } from '../../interfaces/filter-options.interface';
import { Categories } from '../../interfaces/categories.interface';
import { Products } from '../../interfaces/products.interface';
import { Stores } from '../../interfaces/stores.interface';

@Component({
  selector: 'products',
  providers: [ FilterSalesByPipe ],
  styleUrls: ['./products.component.css'],
  templateUrl: './products.component.html'
})
export class ProductsComponent implements OnInit {


  filterConfig = <FilterConfig>{};
  filterOptions: FilterOptions;
  categories: Array<Categories> = [];
  products: Array<Products> = [];
  stores: Array<Stores> = [];
  tickets: Array<any> = [];

  selectedProduct: Products;
  
  filterConfigData: Observable<any>;
  categoriesData: Observable<any>;
  productsData: Observable<any>;
  salesData: Observable<any>;
  storesData: Observable<any>;
  salesChartData: Observable<any>;

  merchantProductData: Observable<any>;
  
  // FILTER VARIABLES
  selectedStore: string = 'All Stores';
  selectedCategory: string = 'All Categories';
  searchedProduct: string = '';

  selectedStoreId: string = '';
  selectedCategoryId: string = '';

  // PRODUCT CONTENT STATUS
  productContent: boolean = false;

  // PRODUCT INFO CONTENT STATUS 
  productInfoContent: boolean = false;

  // CATEGORY INFO CONTENT STATUS
  categoryInfoContent: boolean = false;

  categoryState: boolean = false;
  storeState: boolean = false;
  deleteState: boolean = false;
  editState: boolean = false;

  listStates = [];

  // COLUMN CHART DATA
  columnChartData:any =  {
    chartType: 'LineChart',
    dataTable: [
      ['Date', 'Average', 'Sales']
    ],
    options: {
      bar: {groupWidth: 120 },
      width: '100%',
      height: 300,
      bars: 'vertical',
      backgroundColor: '#fff',
      colors: ['#dab07b', '#7bbcda'],
      chartArea: { 'left': 60, 'bottom': 30, 'right':30, 'top': 50 },
      legend: 'none',
      hAxis: {
        'slantedText': true,
        'textStyle' : {
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
      }
    }
  }

  pieChartData:any =  {
    chartType: 'PieChart',
    dataTable: [
      ['Category', 'Num. of Items'],
      ['Drinks', 11],
      ['Snacks', 2],
      ['Pasta', 2],
      ['Salsas y Tomate', 2],
      ['Aceites y vinagres', 7]
    ],
    options: {
      width: '100%',
      height: 300, 
      colors: ['#efa1a1'],
      chartArea: { 'left': 60, 'bottom': 30, 'right':30, 'top': 50 },
      legend: 'none'
    }  
  };

  // LOT INDEX
  lotIndex: number = 0;

  constructor(
    private categoriesService: CategoriesService,
    private filterConfigService: FilterConfigService,
    private filterSalesByPipe: FilterSalesByPipe,
    private productsService: ProductsService,
    private salesService: SalesService,
    private storesService: StoresService,
    private newSaleService: NewSaleService) {

    // INITIALIZE FILTER OPTIONS
    this.filterOptions = {
      store: true,
      category: true,
      product: false,
      brand: true,
      genre: false,
      user: false,
      method: false,
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

  // CHANGE CHART DATA
  changeData():void {
    // forces a reference update (otherwise angular won't detect the change
    this.columnChartData = Object.create(this.columnChartData);
    for (let i = 1; i < 7; i++) {
      this.columnChartData.dataTable[i][1] = Math.round(Math.random() * 1000);
      this.columnChartData.dataTable[i][2] = Math.round(Math.random() * 1000);
    }
  }

  // EDIT PRODUCT
  editProduct() {

    if(this.editState == true) {
      this.editState = false;

      // LIST STATES FALSE
      for(let i = 0; i < this.listStates.length; i++) {
        this.listStates[i].general = false;
        this.listStates[i].category = false;
        this.listStates[i].lot = false;
      }

    } else if(this.editState == false) {
      this.deleteState = false;
      this.editState = true;
    }

  }

  // DELETE PRODUCT
  deleteProduct() {

    if(this.deleteState == true){
      this.deleteState = false;
    } else if(this.deleteState == false) {
      this.deleteState = true;
      this.editState = false;
    }
    
  }

  // UPDATE PRODUCT ON FOCUS OUT
  updateProductOnFocusOut(product) {
    this.productsService.editMerchantProduct(product);
  }
  
  // SELECT CATEGORY
  selectCategory(categoryId) {
    for(let i = 0; i < this.categories.length; i++){
      if(this.categories[i]._id == categoryId) {
        /*
        this.selectedCategory = this.categories[i];
        this.productContent = false;
        this.productInfoContent = true;
        */
      }
    }
  }

  // LOAD CHART LOTS
  loadChartLots(productId, products) {

    for(let product in products) {
      if(products[product].id == productId) {
        
        let productLots = this.products[product].lot;
        let chartData = [['Lot', 'Acq.', 'Sale', 'Profit']];

        let i = 0;

        for(let productLot in productLots) {

          if(i < 5){
            chartData[chartData.length] = [
              productLots[productLot].name, 
              productLots[productLot].acqPrice,
              productLots[productLot].salePrice,
              (productLots[productLot].salePrice - productLots[productLot].acqPrice)
            ];
          }
          
          i++;

        }

      }
    }
    
  }

  // LOAD CHART CATEGORIES
  loadChartCategories(categories) {

    let categoriesChartData = [['Category', 'Num. of Items']];

    for(let i = 0; i < categories.length; i++){
      categoriesChartData.push([categories[i].name, categories[i].items]);
    }

    this.pieChartData.dataTable = categoriesChartData;
    
  }

  activeStatesLists(products: Array<Products>) {

    this.listStates = [];

    for(let i = 0; i < products.length; i++) {
      this.listStates.push({
        general: false,
        category: false,
        lot: false
      });
    }

  }

  editProductShowHideCategories(index) {

    if(this.editState == true) {
      for(let i = 0; i < this.listStates.length; i++) {
        this.listStates[i].general = false;
        if(index != i) this.listStates[i].category = false;
        this.listStates[i].lot = false;
      }

      if(this.listStates[index].category == false){
        this.listStates[index].category = true;
      } else {
        this.listStates[index].category = false;
      }
    }

  }

  editProductShowHideLots(index) {

    if(this.editState == true) {
      for(let i = 0; i < this.listStates.length; i++) {
        this.listStates[i].general = false;
        this.listStates[i].category = false;
        if(i != index) this.listStates[i].lot = false;
      }
      
      if(this.listStates[index].lot == false) {
        this.listStates[index].lot = true;
      } else {
        this.listStates[index].lot = false;
      }
    }

  }


  ngOnInit() {

    // FILTER CONFIG SUBSCRIBER
    this.filterConfigData = this.filterConfigService.myFilterConfig;
    this.filterConfigData.subscribe(data => {

      this.filterConfig = data;

    });


    // CATEGORIES SUBSCRIBER
    this.categoriesData = this.categoriesService.myCategories;
    this.categoriesData.subscribe(data => {

      this.categories = data;

      if(this.categories.length > 0) {
        this.loadChartCategories(this.categories);
      }
  
    });

    // PRODUCTS SUBSCRIBER
    this.productsData = this.productsService.myProducts;
    this.productsData.subscribe(data => {

      if(data.length > 0 ) {

        this.products = data;

        this.loadChartLots(this.products[0]._id, this.products); 
        this.activeStatesLists(this.products);

      }
    
    });

    // SALES SUBSCRIBER
    this.salesData = this.salesService.mySales;
    this.salesData.subscribe(data => {
      if(data.length > 0) {
        this.tickets = this.filterSalesByPipe.transform(data, this.filterConfig);
      } 
    });

    // SALES CHART SUBSCRIBER
    this.salesChartData = this.salesService.mySalesChart;
    this.salesChartData.subscribe(data => {

      // GET CHART DATA
      this.getChartData(data);

    });

    // STORES SUBSCRIBER
    this.storesData = this.storesService.myStores;
    this.storesData.subscribe(data => {
      if(data.length > 0) {
        this.stores = data;
      } 
    });

    // STORES SUBSCRIBER
    this.merchantProductData = this.productsService.merchantProductConf;
    this.merchantProductData.subscribe(data => {

      if(data == true) {
        this.productsService.getProducts();
        this.categoriesService.getCategories();
      }

    });
    
  }

}
