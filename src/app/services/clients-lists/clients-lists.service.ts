import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';

// INTERFACES
import { ClientsLists } from '../../interfaces/clients-lists.interface';

@Injectable()
export class ClientsListsService {

    // CLIENTS LISTS OBSERVABLE SERVICE
    myClientsLists: Observable<Array<ClientsLists>>;
    private _myClientsLists: BehaviorSubject<Array<ClientsLists>>;
    private myClientsListsStore: { myClientsLists: Array<ClientsLists> };

    // SELECTED CLIENTS LIST OBSERVABLE SERVICE
    selectedClientsList: Observable<ClientsLists>;
    private _selectedClientsList: BehaviorSubject<ClientsLists>;
    private selectedClientsListStore: { selectedClientsList: ClientsLists };

    constructor(private http: Http) {

        // CLIENTS LISTS VARIABLES INITIALIZATION
        this.myClientsListsStore = { myClientsLists: [] };
        this._myClientsLists = new BehaviorSubject(this.myClientsListsStore.myClientsLists);
        this.myClientsLists = this._myClientsLists.asObservable();

        // SELECTED CLIENTS LIST VARIABLES INITIALIZATION
        this.selectedClientsListStore = { selectedClientsList: <ClientsLists>{} };
        this._selectedClientsList = new BehaviorSubject(this.selectedClientsListStore.selectedClientsList);
        this.selectedClientsList = this._selectedClientsList.asObservable();
        
        // GET CLIENTS LISTS
        this.getClientsList();

    }

    // GET CLIENTS LISTS
    getClientsList() {

        // NEW CLIENTS LIST API URL
        let clientsListUrl = 'http://localhost:3000/campaigns/clients-lists';

        this.http.get(clientsListUrl).subscribe(data => {
            this.myClientsListsStore.myClientsLists = JSON.parse(data.text());
            this._myClientsLists.next(this.myClientsListsStore.myClientsLists);
        });

    }

    // SET ACTIVE CLIENTS LIST
    setActiveClientsList(clientsListId: string) {

        for(let i = 0; i < this.myClientsListsStore.myClientsLists.length; i++) {
            if(this.myClientsListsStore.myClientsLists[i]._id == clientsListId) {
                this.selectedClientsListStore.selectedClientsList = this.myClientsListsStore.myClientsLists[i];
                this._selectedClientsList.next(this.selectedClientsListStore.selectedClientsList);                
            }
        }
        
    }

    // NEW CLIENTS LIST
    newClientsList(clientsListName: string) {

        // NEW CLIENTS LIST API URL
        let clientsListUrl = 'http://localhost:3000/campaigns/new-clients-list';

        this.http.post(clientsListUrl, { clientsListName : clientsListName }).subscribe(data => {

            let response = JSON.parse(data.text());
            
            if(response != false) {
                this.myClientsListsStore.myClientsLists = JSON.parse(data.text());
                this._myClientsLists.next(this.myClientsListsStore.myClientsLists);
            } else {
                console.log('ERROR!');
            }

        });

    }

}