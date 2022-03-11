import { Address } from "./address.modal";
import { Events } from "./event.model";
import { Ticket } from "./ticket.model";

export class Order {
    constructor(
        public address: Address,
        public event: Events,
        public event_id: string,
        public order: Ticket[],
        public total: number,
        public grandTotal: number,
        public status: string,
        public time: string,
        public paid: string,
        public id?: string,
        public uid?: string,
        public firstname?: string,
        public lastname?: string,
        public phone?: string,
        public payment_id?: string
    ) { }
}
