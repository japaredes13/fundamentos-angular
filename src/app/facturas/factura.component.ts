import { Component, OnInit } from '@angular/core';
import { FacturaService } from './services/factura.service';
import { Factura } from './models/factura';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html'
})
export class FacturaComponent implements OnInit {

  factura : Factura;
  titulo : string = "Factura";

  constructor(private facturaService : FacturaService, 
    private activatedRoute : ActivatedRoute
  ) {

  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let id = +params.get("id");
      this.facturaService.getFactura(id).subscribe(factura => {
        console.log(factura);
        this.factura = factura;
      });
    });
  }

}
