import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// SERVICES
import { CampaignsService } from '../../services/campaigns/campaigns.service';
import { ClientsService } from '../../services/clients/clients.service';
import { ClientsListsService } from '../../services/clients-lists/clients-lists.service';
import { SalesService } from '../../services/sales/sales.service';

// INTERFACES
import { Campaigns } from '../../interfaces/campaigns.interface';
import { Categories } from '../../interfaces/categories.interface';
import { ClientsLists } from '../../interfaces/clients-lists.interface';
import { MerchantProducts } from '../../interfaces/merchant-products.interface';

@Component({
  selector: 'campaigns',
  providers: [],
  styleUrls: [ './clients-lists.component.css' ],
  templateUrl: './clients-lists.component.html'
})
export class ClientsListsComponent implements OnInit {

  clientsLists: Array<ClientsLists> = [];
  activeClientsList: Array<any> = [];
  clients: Array<any> = [];
  
  clientsListsData: Observable<Array<ClientsLists>>;
  salesData: Observable<any>;

  createListState: boolean = false;

  newClientList: string = '';

  constructor(
    private campaignsService: CampaignsService,
    private clientsService: ClientsService,
    private clientsListsService: ClientsListsService,
    private salesService: SalesService) {}

  
  campaignState() {
    //this.campaignsService.
  }

  selectClientsList(clientsListId: string) {
    for(let i = 0; i < this.clientsLists.length; i++) {

      this.clientsLists[i].active = false;

      if(this.clientsLists[i]._id == clientsListId) {
        this.clientsLists[i].active = true;
      }
    }

    this.activeClientsList = this.getActiveClientsList(this.clientsLists);

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

  // GET CLIENTS LISTS DATA
  getClientsListsData(clientsListsData: Array<any>) {

    let clientsLists = [];

    for(let i = 0; i < clientsListsData.length; i++) {

      let clientsListNumber = 0;

      let state = false;
      if(i == 0)  state = true;
      
      for(let j = 0; j < clientsListsData[i].users.length; j++) {
        clientsListNumber++;
      }

      clientsLists.push({
        _id: clientsListsData[i]._id,
        name: clientsListsData[i].name,
        number: clientsListNumber,
        users: clientsListsData[i].users,
        active: state
      });

    }

    return clientsLists;

  }

  // GET ACTIVE CLIENTS LIST
  getActiveClientsList(clientsLists: Array<ClientsLists>) {

    for(let i = 0; i < clientsLists.length; i++) {
      if(clientsLists[i].active == true) {
        return clientsLists[i].users
      }
    }

  }

  // FORMAT CLIENTS
  getClientList(clientTickets) {
      
      let clientList = [];

      for(let i = 0; i < clientTickets.length; i++) {
        
        // TOTAL CLIENT TICKETS
        let totalClientTickets = 0;

        if(clientList.length == 0) {

            // CALCULATE TOTAL PROFIT
            let totalProfit = 0;

            for(let j = 0; j < clientTickets[i].saleId.length; j++) {
                totalProfit += (clientTickets[i].saleId[j].price - clientTickets[i].saleId[j].acqPrice) * clientTickets[i].saleId[j].units;
            }

            let distance = 'N/A';

            // PUSH FIRST CLIENT
            clientList.push({
              userId: clientTickets[i].userId._id,
              storeId: [ clientTickets[i].storeId._id ],
              name: clientTickets[i].userId.name,
              lastName: clientTickets[i].userId.lastName,
              age: calculateAge( clientTickets[i].userId.dateBirth ),
              genre: clientTickets[i].userId.genre,
              img: clientTickets[i].userId.img,
              lat: clientTickets[i].userId.lat,
              long: clientTickets[i].userId.long,
              totalSpend: clientTickets[i].totalAmount,
              totalProfit: totalProfit,
              visits: 1,
              rate: 3
            });

        } else {

          let clientExistFlag = 0;

          for(let j = 0; j < clientList.length; j++) {
              if( clientTickets[i].userId._id == clientList[j].userId ) {

                clientExistFlag = 1;

                // CALCULATE TOTAL PROFIT
                let totalProfit = 0;

                for(let j = 0; j < clientTickets[i].saleId.length; j++) {
                    totalProfit += (clientTickets[i].saleId[j].price - clientTickets[i].saleId[j].acqPrice) * clientTickets[i].saleId[j].units;
                }

                // ADD STORE ID
                let storeFlag = 0;

                for(let k = 0; k < clientList[j].storeId.length; k++) {
                    if(clientList[j].storeId == clientTickets[i].storeId._id) {
                        storeFlag = 1;
                    }
                }

                // ADD STORE ID IF DONT EXIST
                if(storeFlag == 0) {
                    clientList[j].storeId.push(clientTickets[i].storeId._id);
                }

                clientList[j].totalSpend = clientList[j].totalSpend + clientTickets[i].totalAmount;
                clientList[j].totalProfit = clientList[j].totalProfit + totalProfit;
                clientList[j].visits = clientList[j].visits + 1;

              }
          }

          if(clientExistFlag == 0) {

          // CALCULATE TOTAL PROFIT
          let totalProfit = 0;

          for(let j = 0; j < clientTickets[i].saleId.length; j++) {
            totalProfit += (clientTickets[i].saleId[j].price - clientTickets[i].saleId[j].acqPrice) * clientTickets[i].saleId[j].units;
          }

          // PUSH FIRST CLIENT
          clientList.push({
            userId: clientTickets[i].userId._id,
            storeId: [ clientTickets[i].storeId._id ],
            name: clientTickets[i].userId.name,
            lastName: clientTickets[i].userId.lastName,
            age: calculateAge( clientTickets[i].userId.dateBirth ),
            genre: clientTickets[i].userId.genre,
            lat: clientTickets[i].userId.lat,
            long: clientTickets[i].userId.long,
            totalSpend: clientTickets[i].totalAmount,
            totalProfit: totalProfit,
            visits: 1,
            rate: 3
          });

        }
          
      }
    }

    return clientList;

    // CALCULATE CLIENT AGE
    function calculateAge(birthdayDate: string) {

      let timeDifference = Date.now() - new Date(birthdayDate).getTime();
      let ageDate = new Date(timeDifference);

      return Math.abs(ageDate.getUTCFullYear() - 1970);

    }
  }

  ngOnInit() {

    // CLIENTS SUBSCRIBER
    this.clientsListsData = this.clientsListsService.myClientsLists;
    this.clientsListsData.subscribe(data => {
      
      if(data.length > 0) {
        this.clientsLists = this.getClientsListsData(data);
        this.activeClientsList = this.getActiveClientsList(this.clientsLists);
      }

    });

    // SALES SUBSCRIBER
    this.salesData = this.salesService.mySales;
    this.salesData.subscribe(data => {

      if(data.length > 0) {
        this.clients = this.getClientList(data);
      }
      
    });

  }

}
