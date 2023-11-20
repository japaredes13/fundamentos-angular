import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  modal: boolean = false;
  private _notificationUpload = new EventEmitter<any>();
  constructor() { }

  get notificationUpload(): EventEmitter<any> {
    return this._notificationUpload;
  }

  abrirModal(){
    this.modal = true;
  }

  cerrarModal(){
    this.modal = false;
  }

}
