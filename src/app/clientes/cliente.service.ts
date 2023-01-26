import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { CLIENTES } from './clientes.json';
import { of,Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndPoint:string = 'http://localhost:8081/api/clientes';

  private httpHearders = new HttpHeaders({'Content-type':'application/json'})
  constructor(private http: HttpClient, private router: Router) {

  }

  getClientes(): Observable<Cliente[]>{
    //return of(CLIENTES);
    return this.http.get<Cliente[]>(this.urlEndPoint);
  }

  create(cliente:Cliente): Observable<any> {
    return this.http.post<any>(this.urlEndPoint, cliente, {headers:this.httpHearders}).pipe(
      catchError ( e => {
        console.log(e.error.message);
        swal.fire('Error al editar', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError( e => {
        this.router.navigate(['/clientes']);
        swal.fire('Error al crear', e.error.message, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente:Cliente): Observable<any>{
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHearders}).pipe(
      catchError ( e => {
        console.log(e.error.message);
        swal.fire('Error al editar', e.error.message, 'error');
        return throwError(e);
      })
    );;
  }

  delete(id: number): Observable<any>{
    return this.http.delete<any>(`${this.urlEndPoint}/${id}`, {headers: this.httpHearders}).pipe(
      catchError ( e => {
        console.log(e.error.message);
        swal.fire('Error al eliminar', e.error.message, 'error');
        return throwError(e);
      })
    );;
  }
}
