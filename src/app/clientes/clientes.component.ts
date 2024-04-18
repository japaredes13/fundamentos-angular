import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';
import { tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  selectedCliente: Cliente;
  authService : AuthService;

  constructor(private clienteService: ClienteService,
    private modalService : ModalService,
    authService : AuthService,
    private activatedRoute : ActivatedRoute) {
      this.authService = authService;
  }

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

    this.modalService.notificationUpload.subscribe(cliente => {
      this.clientes.map(clienteOriginal => {
        if (cliente.id == clienteOriginal.id)
          return clienteOriginal.photo = cliente.photo;
        return clienteOriginal;
      })
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

  openModal(cliente:Cliente){
    this.selectedCliente = cliente;
    this.modalService.abrirModal();
  }

}
