// export class Address {
//     user: any;
//     title: string;
//     address: string;
//     landmark: string;
//     house: string;
//     lat: number;
//     lng: number;
//     id?: string;
// }

export class Address {
    constructor(
        public user: any,
        public title: string,
        public address: string,
        public landmark: string,
        public house: string,
        public lat: number,
        public lng: number,
        public id?: string,
    ) { }
}
