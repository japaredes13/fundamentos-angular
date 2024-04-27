import { Cliente } from "src/app/clientes/cliente";
import { DetalleFactura } from "./detalle-factura";

export class Factura {
    id: number;
    descripcion: string;
    observacion: string;
    detallesFactura: Array<DetalleFactura> = [];
    cliente: Cliente;
    total: number;
    createdAt: string;


    calcularTotalFactura(): number {
        this.total = 0;
        this.detallesFactura.forEach((detalleFactura : DetalleFactura) => {
            this.total += detalleFactura.calcularImporte();
        });
        return this.total;
    }
    
}
