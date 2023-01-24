import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
  public cliente: Cliente = new Cliente();
  public titulo:string = "Crear Cliente";
  clientes: Cliente[];

  constructor(private clienteService:ClienteService,
    private router:Router,
    private activatedRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activatedRouter.params.subscribe(params => {
      let id = params['id']

      if(id){
        this.clienteService.getCliente(id).subscribe( (cliente) => this.cliente = cliente)
      }
    })
  }

  public create(): void {
    this.clienteService.create(this.cliente)
      .subscribe( cliente => {
        this.router.navigate(['/clientes'])
        swal.fire("Nuevo Cliente",`Cliente ${cliente.name} creado con éxito`, 'success')
      }
    );
  }

  update() : void{
    this.clienteService.update(this.cliente)
      .subscribe( cliente => {
        this.router.navigate(['/clientes']);
        swal.fire("Cliente Actualizado",`Cliente ${cliente.name} actualizado con éxito`, 'success');
      })
  }

}
