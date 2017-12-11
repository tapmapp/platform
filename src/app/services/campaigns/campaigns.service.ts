import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs';

// INTERFACES
import { Campaigns } from '../../interfaces/campaigns.interface';

@Injectable()
export class CampaignsService {

    // CAMPAIGNS OBSERVABLE SERVICE
    myCampaigns: Observable<Array<Campaigns>>;
    private _myCampaigns: BehaviorSubject<Array<Campaigns>>;
    private myCampaignsStore: { myCampaigns: Array<Campaigns> };

    constructor(private http: Http) {

        // CAMPAIGNS VARIABLES INITIALIZATION
        this.myCampaignsStore = { myCampaigns: [] };
        this._myCampaigns = new BehaviorSubject(this.myCampaignsStore.myCampaigns);
        this.myCampaigns = this._myCampaigns.asObservable();

    }

    // GET CAMPAIGNS REQUEST
    getCampaigns() {
        
        // GET CAMPAIGNS API URL
        let campaignsUrl = 'http://localhost:3000/campaigns';

        this.http.get(campaignsUrl).subscribe(data => {
            this.myCampaignsStore.myCampaigns = JSON.parse(data.text());
            this._myCampaigns.next(this.myCampaignsStore.myCampaigns);
        });

    }

    // SET CAMPAIGN STATE
    setCampaignState(campaignData) {

        // NEW CLIENTS LIST API URL
        let campaignStateUrl = 'http://localhost:3000/campaigns/set-campaign-state';

        this.http.post(campaignStateUrl, { campaignData : campaignData }).subscribe(data => {
            this.myCampaignsStore.myCampaigns = JSON.parse(data.text());
            this._myCampaigns.next(this.myCampaignsStore.myCampaigns);
        });

    }

}