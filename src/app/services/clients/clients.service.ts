import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';

// INTERFACES
import { Clients } from '../../interfaces/clients.interface';

@Injectable()
export class ClientsService {

    // MY CLIENTS OBSERVABLE SERVICE
    myClients: Observable<Array<Clients>>;
    private _myClients: BehaviorSubject<Array<any>>;
    private myClientsStore: { myClients: Array<Clients> };

    // MY CLIENTS OBSERVABLE SERVICE
    clientInfo: Observable<Array<Clients>>;
    private _clientInfo: BehaviorSubject<Array<Clients>>;
    private clientInfoStore: { clientInfo: Array<Clients> };

    // MY CLIENTS CHART OBSERVABLE SERVICE
    myClientsChart: Observable<Array<any>>;
    private _myClientsChart: BehaviorSubject<Array<any>>;
    private myClientsChartStore: { myClientsChart: Array<any> };

    constructor(private http: Http) {

        // MY CLIENTS OBSERVABLE SERVICE INITIALIZATION
        this.myClientsStore = { myClients: [] };
        this._myClients = new BehaviorSubject(this.myClientsStore.myClients);
        this.myClients = this._myClients.asObservable();

        // CLIENT INFO OBSERVABLE SERVICE INITIALIZATION
        this.clientInfoStore = { clientInfo: [] };
        this._clientInfo = new BehaviorSubject(this.clientInfoStore.clientInfo);
        this.clientInfo = this._clientInfo.asObservable();

        // MY CLIENTS CHART OBSERVABLE SERVICE INITIALIZATION
        this.myClientsChartStore = { myClientsChart: [] };
        this._myClientsChart = new BehaviorSubject(this.myClientsChartStore.myClientsChart);
        this.myClientsChart = this._myClientsChart.asObservable();

    }

    // GET CLIENTS REQUEST
    getClientInfo(clientId: string) {
        
        // CLIENTS URL API
        let clientInfoUrl = 'http://localhost:3000/clients/client-info';

        this.http.post(clientInfoUrl, { clientId: clientId }).subscribe(data => {
            this.clientInfoStore.clientInfo = JSON.parse(data.text());
            this._clientInfo.next(this.clientInfoStore.clientInfo);
        });

    }

    // CREATE NEW USER
    createUser() {

        // CLIENTS URL API
        let clientsUrl = 'http://localhost:3000/clients/new-user';

        this.http.post(clientsUrl, {}).subscribe(data => {
            
        });

    }

    // FORMAT CLIENTS
    getClientList(clientTickets, filterConfig) {
        
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

                if(filterConfig.storeId != '') {
                    distance = getDistance(clientTickets[i].storeId.lat, clientTickets[i].storeId.long, clientTickets[i].userId.lat, clientTickets[i].userId.long);
                }

                // PUSH FIRST CLIENT
                clientList.push({
                    userId: clientTickets[i].userId._id,
                    storeId: [ clientTickets[i].storeId._id ],
                    name: clientTickets[i].userId.name,
                    lastName: clientTickets[i].userId.lastName,
                    age: calculateAge( clientTickets[i].userId.dateBirth ),
                    genre: clientTickets[i].userId.genre,
                    distance: distance,
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
                        distance: 'N/A',
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

        // GET DISTANCE BETWEEN ADDRESS AND STORE
        function getDistance(clientlat, clientlong, storeLat, storeLong) {

            if(storeLat != null && storeLong != null) {

                // EARTH RADIUS IN METTERS
                let R = 6378137; 

                // LAT, LONG DIFFERENCES
                let dLat = rad(clientlat - storeLat);
                let dLong = rad(clientlong - storeLong);

                let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(rad(storeLat)) * Math.cos(rad(clientlat)) *
                Math.sin(dLong / 2) * Math.sin(dLong / 2);

                let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                let distance = R * c;

                return (distance / 1000).toFixed(1) + ' km';

            } else {
                return 'N/A';
            }

            function rad(x) {
                return x * Math.PI / 180;
            };

        }

    }

    // SEND CLIENTS
    sendClients(clients: Array<any>) {
        this.myClientsStore.myClients = clients;
        this._myClients.next(this.myClientsStore.myClients);
    }

    // SEND CLIENTS CHART
    sendClientsChart(clientsChart: Array<any>) {
        this.myClientsChartStore.myClientsChart = clientsChart;
        this._myClientsChart.next(this.myClientsChartStore.myClientsChart);
    }   

}