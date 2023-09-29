import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;

  constructor(private clienteService: ClienteService,
    private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe( params => {
      let page:number = +params.get("page");

      if(!page) page = 0;

      this.clienteService.getClientes(page).pipe(
        tap( response => {
          console.log("ClientesComponent: Tap 3:");
          (response.content as Cliente[]).forEach(cliente => {
            console.log(cliente.name);
          });
        })
      ).subscribe(
        response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        }
      );
    })

  }

  delete(cliente: Cliente): void{
    swal.fire({
      title: 'Está Seguro?',
      text: `¿Seguro que desea eliminar al cliente ${cliente.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clienteService.delete(cliente.id).subscribe (
          response => {
            this.clientes = this.clientes.filter(cli => cli !== cliente);
            swal.fire(
              'Cliente Eliminado!',
              `Cliente ${cliente.name} eliminado con éxito.`,
              'success'
            )
          }
        )
      }
    })
  }

}
