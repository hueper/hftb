import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';

@Injectable()
export class AuthService {

  isLoggedin: boolean;
  AuthToken;
  private baseUrl: string;

  constructor(public http: Http) {
    this.http = http;
    this.isLoggedin = false;
    this.AuthToken = null;
    this.baseUrl = 'http://hftb.eu:3334/api';
  }

  storeUserCredentials(token) {
    window.localStorage.setItem('auth', token);
    this.useCredentials(token);

  }

  useCredentials(token) {
    this.isLoggedin = true;
    this.AuthToken = token;
  }

  loadUserCredentials() {
    var token = window.localStorage.getItem('auth');
    this.useCredentials(token);
  }

  destroyUserCredentials() {
    this.isLoggedin = false;
    this.AuthToken = null;
    window.localStorage.clear();
  }

  authenticate(user) {
    var creds = "name=" + user.name + "&password=" + user.password;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.post(`${this.baseUrl}/authenticate`, creds, { headers: headers }).subscribe(data => {
        if (data.json().success) {
          this.storeUserCredentials(data.json().token);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }
  adduser(user) {
    var creds = "name=" + user.name + "&password=" + user.password;
    var headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    return new Promise(resolve => {
      this.http.post(`${this.baseUrl}/adduser`, creds, { headers: headers }).subscribe(data => {
        if (data.json().success) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  getinfo() {
    return new Promise(resolve => {
      var headers = new Headers();
      this.loadUserCredentials();
      headers.append('Authorization', 'Bearer ' + this.AuthToken);
      this.http.get(`${this.baseUrl}/getinfo`, { headers: headers }).subscribe(data => {
        if (data.json().success) {
          resolve(data.json());
        } else {
          resolve(false);
        }
      });
    })
  }

  logout() {
    this.destroyUserCredentials();
  }
}
