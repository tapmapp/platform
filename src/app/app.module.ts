import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule, ApplicationRef } from '@angular/core';
//import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { RouterModule, PreloadAllModules } from '@angular/router';
import { SocketIoModule, SocketIoConfig, Socket } from 'ng2-socket-io';

// LOCAL STORAGE
import { LocalStorageModule } from 'angular-2-local-storage';

// GOOGLE CHARTS
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

// GOOGLE MAPS
import { AgmCoreModule } from '@agm/core';

// ROUTES
import { ROUTES } from './app.routes';

// COMPONENTS
import { AppComponent } from './app.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { AddCategoryComponent } from './components/add-category/add-category.component';
import { BuyClientsComponent } from './components/buy-clients/buy-clients.component';
import { BuyClientsListComponent } from './components/buy-clients-list/buy-clients-list.component';
import { CampaignsComponent } from './components/campaigns/campaigns.component';
import { CampaignInfoComponent } from './components/campaign-info/campaign-info.component';
import { CashierComponent } from './components/cashier/cashier.component';
import { CategoriesListComponent } from './components/categories-list/categories-list.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ClientInfoComponent } from './components/client-info/client-info.component';
import { ClientsListComponent } from './components/clients-list/clients-list.component';
import { ClientsListsComponent } from './components/clients-lists/clients-lists.component';
import { CreateCampaignComponent } from './components/create-campaign/create-campaign.component';
import { ContactComponent } from './components/contact/contact.component';
import { DisplayComponent } from './components/display/display.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { FilterMenuComponent } from './components/filter-menu/filter-menu.component';
import { FooterComponent } from './components/footer/footer.component';
import { LeftMenuComponent } from './components/left-menu/left-menu.component';
import { LoginComponent } from './components/login/login.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { ProductsComponent } from './components/products/products.component';
import { MessagesComponent } from './components/messages/messages.component';
import { MobileComponent } from './components/mobile/mobile.component';
import { SalesComponent } from './components/sales/sales.component';
import { SalesListComponent } from './components/sales-list/sales-list.component';
import { SelectClientsListComponent } from './components/select-clients-list/select-clients-list.component';
import { StoresComponent } from './components/stores/stores.component';

// DIRECTIVES
import { ProductDirective } from './directives/product/product.directive';

// SOCKETS
import { NewSaleService } from './socket/new-sale.service';

// SERVICES
import { AddProductsService } from './services/add-products/add-products.service';
import { BrandsService } from './services/brands/brands.service';
import { CampaignsService } from './services/campaigns/campaigns.service';
import { CategoriesService } from './services/categories/categories.service';
import { ClientsService } from './services/clients/clients.service';
import { ClientsListsService } from './services/clients-lists/clients-lists.service';
import { FilterConfigService } from './services/filter-config/filter-config.service';
import { ProductsService } from './services/products/products.service';
import { MerchantsService } from './services/merchants/merchants.service';
import { SalesService } from './services/sales/sales.service';
import { StoresService } from './services/stores/stores.service';

// PIPES
import { OrderByPipe } from './pipes/order-by.pipe';
import { FilterClientsByPipe } from './pipes/filter-clients-by.pipe';
import { FilterProductsByPipe } from './pipes/filter-products-by.pipe';
import { FilterSalesByPipe } from './pipes/filter-sales-by.pipe';
import { RatesPipe } from './pipes/rates.pipe';

// ASSETS
import '../assets/css/styles.css';

const config: SocketIoConfig = { url: 'http://localhost:3030', options: {} };

@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [

    // COMPONENTS
    AppComponent,
    AddProductComponent,
    AddCategoryComponent,
    BuyClientsComponent,
    BuyClientsListComponent,
    CampaignsComponent,
    CampaignInfoComponent,
    CashierComponent,
    CategoriesListComponent,
    ClientsComponent,
    ClientInfoComponent,
    ClientsListComponent,
    ClientsListsComponent,
    CreateCampaignComponent,
    ContactComponent,
    DisplayComponent,
    EditProductComponent,
    FilterMenuComponent,
    FooterComponent,
    HomeComponent,
    HeaderComponent,
    LeftMenuComponent,
    LoginComponent,
    ProductsComponent,
    MobileComponent,
    MessagesComponent,
    SalesComponent,
    SalesListComponent,
    SelectClientsListComponent,
    StoresComponent,
    
    // DIRECTIVES
    ProductDirective,

    // PIPES
    FilterClientsByPipe,
    FilterProductsByPipe,
    FilterSalesByPipe,
    OrderByPipe,
    RatesPipe
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(config),
    FormsModule,
    HttpModule,
    Ng2GoogleChartsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCqMOhNKdjU2Cdoh6o8esw3K32hUZiuUyQ'
    }),
    LocalStorageModule.withConfig({
        prefix: 'whola-app',
        storageType: 'localStorage'
    }),
    RouterModule.forRoot(ROUTES, { useHash: false, preloadingStrategy: PreloadAllModules })
  ],
  providers: [
    AddProductsService,
    BrandsService,
    CampaignsService,
    CategoriesService,
    ClientsService,
    ClientsListsService,
    FilterConfigService,
    MerchantsService,
    NewSaleService,
    ProductsService,
    SalesService,
    StoresService
  ]
})
export class AppModule {

  constructor() {}

}
