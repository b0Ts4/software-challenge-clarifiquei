import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EngineerService {
    
  private api = 'http://localhost:3000/engineers';


  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.api);
  }

  
}
