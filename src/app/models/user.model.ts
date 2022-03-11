export class User {
    constructor(
        public email: string,
        public firstname: string,
        public lastname: string,
        public phone: string,
        public status?: string,
        public type?: string,
        public uid?: string,
    ) { }
}
