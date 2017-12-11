import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// SERVICES
import { CampaignsService } from '../../services/campaigns/campaigns.service';
import { CategoriesService } from '../../services/categories/categories.service';
import { ClientsListsService } from '../../services/clients-lists/clients-lists.service';
import { ProductsService } from '../../services/products/products.service';
import { StoresService } from '../../services/stores/stores.service';

// INTERFACES
import { Categories } from '../../interfaces/categories.interface';
import { ClientsLists } from '../../interfaces/clients-lists.interface';
import { FindedProducts } from '../../interfaces/finded-products.interface';
import { Products } from '../../interfaces/products.interface';
import { Stores } from '../../interfaces/stores.interface';

@Component({
  selector: 'mobile',
  providers: [],
  styleUrls: [ './mobile.component.css' ],
  templateUrl: './mobile.component.html'
})
export class MobileComponent implements OnInit {

  categoriesData: Observable<Array<Categories>>;
  clientsListsData: Observable<Array<ClientsLists>>;
  findedProductsData: Observable<any>; 
  productsData: Observable<any>;
  storesData: Observable<any>;

  products: Array<Products> = [];
  categories: Array<Categories> = [];
  findedProducts: Array<FindedProducts> = []; 
  clientsLists: Array<ClientsLists> = [];
  stores: Array<Stores> = [];

  campaignInfo = {
    campaignTypeId: '',
    campaignName: 'Name',
    campaignTitle: 'Title',
    campaignDesc: 'Description',
    clientsListId: '',
    startDate: '2017-09-01',
    endDate: '2017-12-01'
  };

  selectedCampaign: string = 'Select Campaign';
  selectedStore: string = 'Select Store';
  selectedCampaignId: string = 'discount';

  selectedCategory: string;
  selectedProduct: string;  
  selectedCategoryId: string;
  selectedProductId: string;

  selectedClientsList: string = 'Select Clients List';
  
  campaignState: boolean = false;
  categoryState: boolean = false;
  productState: boolean = false;
  clientsListState: boolean = false;
  findContState: boolean = false;
  storeState: boolean = false;

  addedProducts: Array<Products> = [];

  constructor(
    private campaignsService: CampaignsService,
    private categoriesService: CategoriesService,
    private clientsListsService: ClientsListsService,
    private productsService: ProductsService,
    private storesService: StoresService) {}
  
  // SELECT CAMPAIGN
  selectCampaign(campaignId, campaign) {
    this.campaignState = false;
    this.selectedCampaign = campaign;
    this.campaignInfo.campaignTypeId = campaignId;
  }

  // SELECT CATEGORY
  selectCategory(category: string, categoryId: string) {
    this.categoryState = false;
    this.selectedCategory = category;
  }

  // SELECT PRODUCT
  selectProduct(product: string, productId: string) {
    this.productState = false;
    this.selectedProduct = product;
  }

  // SELECT CLIENTS LIST
  selectClientsList(clientsListName: string, clientsListId: string) {
    this.clientsListState = false;
    this.selectedClientsList = clientsListName;
    this.campaignInfo.clientsListId = clientsListId;
  }

  // ADD STORES
  addStore(storeName: string, storeId: string) {
    this.storeState = false;
    this.selectedStore = storeName;

  }

  // SHOW HIDE CAMPAIGN STATE
  showHideCampaignType() {
    if(this.campaignState == true) {
      this.campaignState = false;
    } else {
      this.campaignState = true;
    } 
  }

  // SHOW HIDE CATEGORIES
  showHideCategories() {
    if(this.categoryState == true) {
      this.categoryState = false;
    } else {
      this.categoryState = true;
    } 
  }

  // SHOW HIDE PRODUCTS
  showHideProducts() {
    if(this.productState == true) {
      this.productState = false;
    } else {
      this.productState = true;
    }
  }

  // SHOW HIDE STORES
  showHideStores() {
    if(this.storeState == true) {
      this.storeState = false;
    } else {
      this.storeState = true;
    }
  }

  // SHOW HIDE CLIENTS LISTS
  showHideClientsList() {
    if(this.clientsListState == true) {
      this.clientsListState = false;
    } else {
      this.clientsListState = true;
    }
  }

  // SEARCH PRODUCT
  productSearchChange(product) {
    if(product.length != 0) {
      this.findContState = true;
      this.productsService.findProduct(product);
    } else {
      this.findContState = false;
      this.findedProducts = [];
    }
  }

  // GET CLIENTS LISTS DATA
  getClientsLists(clientsListsData: Array<any>) {

    let clientsLists = [];

    for(let i = 0; i < clientsListsData.length; i++) {

      let clientsListNumber = 0;
      
      for(let j = 0; j < clientsListsData[i].users.length; j++) {
        clientsListNumber++;
      }

      clientsLists.push({
        _id: clientsListsData[i]._id,
        name: clientsListsData[i].name,
        number: clientsListNumber,
      });

    }

    return clientsLists;

  }

  ngOnInit() {

    // CLIENTS LISTS SUBSCRIBER
    this.clientsListsData = this.clientsListsService.myClientsLists;
    this.clientsListsData.subscribe(data => {

      if(data.length > 0) {
        this.clientsLists = this.getClientsLists(data);
      }
      
    });

    // CATEGORIES SUBSCRIBER
    this.categoriesData = this.categoriesService.myCategories;
    this.categoriesData.subscribe(data => {
      this.categories = data;

      if(data.length > 0){ 
        this.categories = data;
        this.selectedCategory = this.categories[0].name;
        this.selectedCategoryId = this.categories[0]._id;
      }

    });

    // PRODUCTS SUBSCRIBER
    this.productsData = this.productsService.myProducts;
    this.productsData.subscribe(data => {

      if(data.length > 0){ 
        this.products = data;
        this.selectedProduct = this.products[0].name;
        this.selectedProductId = this.products[0]._id;
      }

    });

    // STORES SUBSCRIBER
    this.storesData = this.storesService.myStores;
    this.storesData.subscribe(data => {

      if(data.length > 0){ 
        this.stores = data;
      }

    });

    // FINDED PRODUCTS SUBSCRIBER
    this.findedProductsData = this.productsService.findedProducts;
    this.findedProductsData.subscribe(data => {

      if(data.length > 0) {
        this.findedProducts = data;
      }
      
    });

  }

}
