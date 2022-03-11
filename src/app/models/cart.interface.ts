import { Address } from "./address.modal";
import { Events } from "./event.model";
import { Ticket } from "./ticket.model";

export interface Cart {
    event: Events;
    items: Ticket[];
    totalItem?: number;
    totalPrice?: number;
    grandTotal?: number;
    location?: Address;
    from?: string;
}
