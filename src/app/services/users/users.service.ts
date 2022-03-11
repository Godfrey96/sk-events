import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  apiURLUsers = environment.apiURL + 'users';

  constructor(
    private http: HttpClient
  ) { }

  // get all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURLUsers);
  }

  // get single user
  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiURLUsers}/${userId}`);
  }

  // add new user
  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiURLUsers, user);
  }
}
