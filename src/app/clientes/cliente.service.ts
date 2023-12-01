 import { Injectable } from '@angular/core';
import { formatDate, DatePipe } from '@angular/common';
import { Cliente } from './cliente';
import { Region } from './region';
import { of,Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
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

  getRegiones(): Observable<Region[]>{
    return this.http.get<Region[]>(this.urlEndPoint + "/regiones");
  }

  getClientes(page : number): Observable<any>{
    //return of(CLIENTES);
    return this.http.get(this.urlEndPoint + "/page/"+ page).pipe(
      tap ( (response : any) => {
        console.log("ClienteServicie: Tap 1");
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.name);
        });
      }),

      map ( (response : any) => {
        (response.content as Cliente[]).map(cliente => {
          cliente.name = cliente.name.toUpperCase();
          let datePipe = new DatePipe('es');
          cliente.createdAt = datePipe.transform(cliente.createdAt, 'EEEE dd/MM/yyyy');//formatDate(cliente.createdAt, 'dd/MM/yyyy', 'en-US');
          return cliente;
        });
        return response;
      }),
      tap( (response : any) => {
        console.log("ClienteService: Tap 2");
        (response.content as Cliente[]).forEach(cliente => {
          console.log(cliente.name);
        });
      })
    );
  }

  create(cliente:Cliente): Observable<any> {
    return this.http.post<any>(this.urlEndPoint, cliente, {headers:this.httpHearders}).pipe(
      catchError ( e => {
        if (e.status ) {
          return throwError(e);
        }

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
        if (e.status ) {
          return throwError(e);
        }

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
    );
  }

  uploadPhoto(file : File, id): Observable<HttpEvent<{}>>{
    let formData = new FormData();
    formData.append("file", file);
    formData.append("id", id);

    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData, {
      reportProgress: true
    });

    return this.http.request(req);
  }
}
