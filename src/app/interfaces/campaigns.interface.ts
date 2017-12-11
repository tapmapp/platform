export interface Campaigns {
    _id: string;
    media: string;
    name: string;
    type: string;
    start: Date;
    finish: Date;
    reach: Number;
    used: Number; 
    state: boolean;
}