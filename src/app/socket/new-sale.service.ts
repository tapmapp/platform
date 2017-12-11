import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import * as io from 'socket.io-client';

//const socket = io.connect('http://localhost:3030');

@Injectable()
export class NewSaleService {
    
    socket: any;

    // NEW SALE OBSERVABLE SERVICE
    newSale: Observable<Array<any>>;
    private _newSale: BehaviorSubject<Array<any>>;
    private newSaleStore: { newSale: Array<any> };    

    constructor() {
        
        this.socket = io.connect('http://localhost:3030');
        this.socket.on('newSale', this.onMessage.bind(this));

        // NEW SALE
        this.newSaleStore = { newSale: [] };
        this._newSale = new BehaviorSubject(this.newSaleStore.newSale);
        this.newSale = this._newSale.asObservable();

    }

    onMessage(message) {
        console.log('New Sale: ' + message);
        this.sendConfirmation(message);  
    }
    
    sendMessage(message) {
        this.socket.emit('newSale', message);
    }

    sendConfirmation(val) {
        this.newSaleStore.newSale.length = 0;
        this.newSaleStore.newSale.push(val);
        this._newSale.next(this.newSaleStore.newSale);
    }

}