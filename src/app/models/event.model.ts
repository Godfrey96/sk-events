export class Events {
    constructor(
        public uid: string,
        public cover: string,
        public eventName: string,
        public short_name: string,
        public price: string,
        public description: string,
        public checkIn: string,
        public checkOut: string,
        public cuisines: string[],
        public address: string,
        public status: string,
        public coordinates: any,
        public g?: any,
        public distance?: number,
    ) { }
}

// import { Category } from "./category.model";
// import { User } from "./user.model";

// export class Events {
//     id: string;
//     cover: string;
//     eventName: string;
//     price: number;
//     description: string;
//     checkIn: string;
//     checkOut: string;
//     category: Category;
//     user: User;
//     address?: string;
//     status?: boolean;
//     coordinates?: any;
//     g?: any;
//     distance?: number;
//     lat?: number;
//     lng?: number;
//     updatedAt?: Date;
// }

