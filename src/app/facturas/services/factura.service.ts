import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Factura } from '../models/factura';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  private urlEndpoint :string = "http://localhost:8081/api/facturas";
  private urlEndpointProductos : string = "http://localhost:8081/api/productos";

  constructor(private httpCliente : HttpClient) { 

  }

  crearFactura(factura: Factura): Observable<Factura> {
    return this.httpCliente.post<Factura>(this.urlEndpoint, factura);
  }


  getFactura(id:number) : Observable<Factura>{
    return this.httpCliente.get<Factura>(this.urlEndpoint + `/${id}`);
  }


  deleteFactura(id:number) : Observable<void>{
    return this.httpCliente.delete<void>(this.urlEndpoint + `/${id}`);
  }


  searchProductos(term:string): Observable<Producto[]>{
    return this.httpCliente.get<Producto[]>(this.urlEndpointProductos + `/search/${term}`)
  }

}
