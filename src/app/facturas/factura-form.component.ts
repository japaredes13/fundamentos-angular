import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { FacturaService } from './services/factura.service';
import { Producto } from './models/producto';
import { DetalleFactura } from './models/detalle-factura';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import swal from 'sweetalert2';

@Component({
  selector: 'app-factura-form',
  templateUrl: './factura-form.component.html'
})
export class FacturaFormComponent implements OnInit {

  titulo : string = "Nueva Factura";
  factura : Factura = new Factura();

  autocompleteControl = new FormControl('');
  productosFiltrados: Observable<Producto[]>;
  
  constructor(private clienteService : ClienteService,
    private activatedRoute : ActivatedRoute,
    private router : Router,
    private facturaService : FacturaService
  ) { 

  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let clienteId = params.get("clienteId");
      this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges.
    pipe(
      map(value => typeof value === "string" ? value : value.nombre),
      flatMap(value => value ? this._filter(value || '') : []),
    );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();

    return this.facturaService.searchProductos(filterValue);
  }

  mostrarNombre(producto ?: Producto):string | undefined {
    return producto ? producto.nombre : undefined;
  }

  seleccionarProducto(event : MatAutocompleteSelectedEvent): void{
    let producto = event.option.value as Producto;
    console.log(producto);

    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id);
    } else {
      let detalleFactura = new DetalleFactura();
      detalleFactura.producto = producto;
      this.factura.detallesFactura.push(detalleFactura);
    }
    
    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id: number, event: any): void {
    let cantidad: number = event.target.value as number;

    if (cantidad == 0) {
      return this.eliminarItemFactura(id);
    }

    this.factura.detallesFactura = this.factura.detallesFactura.map((detalleFactura: DetalleFactura) => {
      if (id === detalleFactura.producto.id) {
        detalleFactura.cantidad = cantidad;
      }
      return detalleFactura;
    });
  }


  existeItem(id: number): boolean {
    let existe = false;
    this.factura.detallesFactura.forEach((detalleFactura: DetalleFactura) => {
      if (id === detalleFactura.producto.id) {
        existe = true;
      }
    });
    return existe;
  }


  incrementaCantidad(id: number): void {
    this.factura.detallesFactura = this.factura.detallesFactura.map((detalleFactura: DetalleFactura) => {
      if (id === detalleFactura.producto.id) {
        ++detalleFactura.cantidad;
      }
      return detalleFactura;
    });
  }

  eliminarItemFactura(id: number): void {
    this.factura.detallesFactura = this.factura.detallesFactura.filter((detalleFactura: DetalleFactura) => id !== detalleFactura.producto.id);
  }

  crearFactura(facturaForm) : void {
    if (this.factura.detallesFactura.length == 0) {
      this.autocompleteControl.setErrors({"invalid" : true});
    }
    if(facturaForm.form.valid && this.factura.detallesFactura.length > 0){
      this.facturaService.crearFactura(this.factura).subscribe(factura => {
        swal.fire(this.titulo, `Factura ${factura.descripcion} creada con éxito!`, "success");
        this.router.navigate(['/clientes']);
      });
    }
      
  }

}
