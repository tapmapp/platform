import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// SERVICES
import { ClientsListsService } from '../../services/clients-lists/clients-lists.service';

// INTERFACES
import { ClientsLists } from '../../interfaces/clients-lists.interface';

@Component({
  selector: 'select-clients-list',
  providers: [],
  styleUrls: [ './select-clients-list.component.css' ],
  templateUrl: './select-clients-list.component.html'
})
export class SelectClientsListComponent implements OnInit {

  clientsListsData: Observable<Array<ClientsLists>>;

  clientsLists: Array<ClientsLists> = [];
;
  clientsListState: boolean = false;

  selectedClientsList: string = 'Select Clients List';
  selectedClientsListId: string = '';

  constructor(private clientsListsService: ClientsListsService) {}

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
  
  // SELECT CLIENTS LISTS
  selectClientsList(clientsList, clientsListId) {
    this.clientsListState = false;
    this.selectedClientsList = clientsList;
    this.selectedClientsListId = clientsListId;
  }

  // SHOW HIDE CLIENTS LISTS
  showHideClientsList() {
    if(this.clientsListState == true) {
      this.clientsListState = false;
    } else {
      this.clientsListState = true;
    }
  }

  ngOnInit() {

    // CLIENTS LISTS SUBSCRIBER
    this.clientsListsData = this.clientsListsService.myClientsLists;
    this.clientsListsData.subscribe(data => {

      if(data.length > 0) {
        this.clientsLists = this.getClientsLists(data);
      }
      
    });

  }

}
