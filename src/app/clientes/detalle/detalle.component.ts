import { Component, Input, OnInit } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';
import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo: string = "Detalle del Cliente";
  selectedPhoto: File;
  progress:number = 0;


  constructor(private clienteService: ClienteService,
    public modalService : ModalService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

  }


  selectPhoto(event){
    this.selectedPhoto = event.target.files[0];
    this.progress = 0;
    console.log(this.selectedPhoto);
    if (this.selectedPhoto.type.indexOf('image') < 0 ) {
      swal.fire("Error al seleccionar", "El archivo debe ser del tipo imagen", 'error');
      this.selectedPhoto = null;
    }
  }

  uploadPhoto(){
    if (!this.selectedPhoto) {
      swal.fire("Error Upload!", "Debe seleccionar una foto", 'error');
      return;
    }

    this.clienteService.uploadPhoto(this.selectedPhoto, this.cliente.id)
    .subscribe( event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round((event.loaded/event.total)*100);
      } else if (event.type === HttpEventType.Response) {

        let response:any = event.body;
        this.cliente = response.cliente as Cliente;
        this.modalService.notificationUpload.emit(this.cliente);
        swal.fire("La foto se ha subido completamente!", response.message, "success");

      }
    })
  }


  cerrarModal(){
    this.modalService.cerrarModal();
    this.selectPhoto = null;
    this.progress = 0;
  }

}
