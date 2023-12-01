import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { Region } from './region';
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
  regiones: Region[];


  public errors : string[];

  constructor(private clienteService:ClienteService,
    private router:Router,
    private activatedRouter: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
    this.clienteService.getRegiones().subscribe(regiones => {
      this.regiones = regiones;
    })
  }

  cargarCliente(): void {
    this.activatedRouter.paramMap.subscribe(params => {
      let id = +params.get('id');
      console.log(id);
      if(id){
        this.clienteService.getCliente(id).subscribe( (cliente) => this.cliente = cliente)
      }
    })
  }

  public create(): void {
    this.clienteService.create(this.cliente)
      .subscribe( res => {
        this.router.navigate(['/clientes'])
        swal.fire("Nuevo Cliente",`${res.message}`, 'success')
      },
      err => {
        this.errors = err.error.errors as string[];
        console.log("Código del error desde el backend: "+err.status);
        console.log(err.error.errors);
      }
    );
  }

  update() : void{
    this.clienteService.update(this.cliente)
      .subscribe( res => {
        this.router.navigate(['/clientes']);
        swal.fire("Cliente Actualizado",`${res.message}`, 'success');
      }),
      err => {
        this.errors = err.error.errors as string[];
        console.log("Código del error desde el backend: "+err.status);
        console.log(err.error.errors);
      }
  }

  compararRegion(regionSelect : Region, clienteRegion : Region): boolean{
    console.log(clienteRegion)
    if (regionSelect == undefined && clienteRegion == undefined) {
      return true;
    }
    return regionSelect == null || clienteRegion == null ? false : regionSelect.id === clienteRegion.id;
  }

}
