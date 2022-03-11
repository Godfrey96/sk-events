export class Ticket {
    constructor(
        public id: string,
        public uid: string,
        // public category_id: any,
        public numOfTickets: number,
        public paymentType: any,
        public price: number,
        public status: boolean,
        public quantity?: number,
    ) { }
}

// import { Events } from "./event.model";

// export class Ticket {
//     id?: string;
//     event: Events;
//     paymentType: string;
//     price: number;
//     numOfTickets: number;
//     status: boolean;
// }

