import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// SERVICES
import { CampaignsService } from '../../services/campaigns/campaigns.service';
import { CategoriesService } from '../../services/categories/categories.service';
import { ClientsListsService } from '../../services/clients-lists/clients-lists.service';
import { ProductsService } from '../../services/products/products.service';

// INTERFACES
import { Campaigns } from '../../interfaces/campaigns.interface';
import { Categories } from '../../interfaces/categories.interface';
import { ClientsLists } from '../../interfaces/clients-lists.interface';
import { MerchantProducts } from '../../interfaces/merchant-products.interface';

@Component({
  selector: 'create-campaign',
  providers: [],
  styleUrls: [ './create-campaign.component.css' ],
  templateUrl: './create-campaign.component.html'
})
export class CreateCampaignComponent implements OnInit {

  categories: Array<Categories> = [];
  campaigns: Array<Campaigns> = [];
  clientsLists: Array<ClientsLists> = [];
  products: Array<MerchantProducts> = [];

  categoriesData: Observable<Array<Categories>>;
  campaignsListsData: Observable<Array<Campaigns>>;
  clientsListsData: Observable<Array<ClientsLists>>;
  productsData: Observable<Array<MerchantProducts>>;
  
  createListState: boolean = false;

  newClientList: string = '';

  columnChartData:any =  {
    chartType: 'LineChart',
    dataTable: [
      ['Lot', 'Product.', 'Average'],
      ['E', 1, 2],
      ['F', 4, 7],
      ['M', 3, 4],
      ['A', 2, 5],
      ['M', 8, 8],
      ['J', 1, 2],
      ['J', 4, 7],
      ['A', 3, 4],
      ['S', 2, 5],
      ['O', 8, 8],
      ['N', 8, 8],
      ['D', 8, 8]
    ],
    options: {
      'bar' : {groupWidth: 120 },
      'width': '100%',
      'height': 300,
      'bars': 'vertical',
      'backgroundColor': '#fff',
      'colors': ['#efa1a1', '#7bbcda'],
      'chartArea': { 'left': 60, 'bottom': 30, 'right':0, 'top': 60 },
      hAxis: {
        //title: 'Month Sales'
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
  };

  constructor(
    private campaignsService: CampaignsService,
    private categoriesService: CategoriesService,
    private clientsListsService: ClientsListsService,
    private productsService: ProductsService) {}

  
  campaignState() {
    //this.campaignsService.
  }

  // SHOW HIDE CREATE CLIENTS LIST
  showHideCreateClientsList() {
    if(this.createListState == true) {
      this.createListState = false;
    } else {
      this.createListState = true;
    }
  }

  // NEW CLIENTS LIST
  newClientsList() {
    this.clientsListsService.newClientsList(this.newClientList);
  }
  
  /*
  
name: { type: String, required: true },
  merchantId: {  type: mongoose.Schema.Types.ObjectId, ref: "Merchant", required: true },
  users:  
   */

  // GET CLIENTS LISTS DATA
  getClientsListsData(clientsListsData: Array<any>) {

    let clientsLists = [];

    for(let i = 0; i < clientsListsData.length; i++) {

      let clientsListNumber = 0;

      for(let j = 0; j < clientsListsData[i].users.length; j++) {
        clientsListNumber++;
      }

      clientsLists.push({
        name: clientsListsData[i].name,
        number: clientsListNumber
      });

    }

    return clientsLists;

  }

  ngOnInit() {
    
    // CATEGORIES SUBSCRIBER
    this.categoriesData = this.categoriesService.myCategories;
    this.categoriesData.subscribe(data => {
      if(data.length > 0) {
        this.categories = data;
      }
    });

    // PRODUCTS SUBSCRIBER
    this.productsData = this.productsService.myProducts;
    this.productsData.subscribe(data => {
      if(data.length > 0) {
        this.products = data;
      }
    });

    // CAMPAIGNS SUBSCRIBER
    this.campaignsListsData = this.campaignsService.myCampaigns;
    this.campaignsListsData.subscribe(data => {
      if(data.length > 0) {
        this.campaigns = data;
      }
    });

    // CLIENTS SUBSCRIBER
    this.clientsListsData = this.clientsListsService.myClientsLists;
    this.clientsListsData.subscribe(data => {
      if(data.length > 0) {
        this.clientsLists = this.getClientsListsData(data);
      }
    });
    
  }

}
