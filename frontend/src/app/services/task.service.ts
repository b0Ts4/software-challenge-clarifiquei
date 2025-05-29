import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private api = 'http://localhost:3000/tasks';


  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get(this.api);
  }

  alocarTarefas() {
    return this.http.post(`${this.api}/alocar`, {});
  }
}
