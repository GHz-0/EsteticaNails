// src/modulos/inventario/scm.js

export class SCM_Inventario {
    constructor() {
        // Simulamos nuestra base de datos de insumos
        this.insumos = [
            { id: 1, nombre: "Monómero 8oz", cantidad: 5, minimoIdeal: 2 },
            { id: 2, nombre: "Gelish Tono Nude", cantidad: 1, minimoIdeal: 3 },
            { id: 3, nombre: "Caja de Tips", cantidad: 10, minimoIdeal: 4 }
        ];
    }

    // 1. Ver la lista de materiales
    obtenerInventario() {
        return this.insumos;
    }

    // 2. Restar material cuando se hace una aplicación de uñas
    usarInsumo(idInsumo, cantidadUsada) {
        const producto = this.insumos.find(item => item.id === idInsumo);
        
        if (producto) {
            producto.cantidad -= cantidadUsada;
            
            // Si nos queda muy poco, lanzamos una alerta
            if (producto.cantidad <= producto.minimoIdeal) {
                return `¡ALERTA! Queda muy poco ${producto.nombre}. Tienes ${producto.cantidad} y deberías tener al menos ${producto.minimoIdeal}. Hay que comprar.`;
            }
            return `Se usó ${producto.nombre.toLowerCase()}. Quedan ${producto.cantidad} en stock.`;
        }
        return "Producto no encontrado en el almacén.";
    }

    // 3. Agregar material cuando llega un pedido del proveedor
    recibirPedido(idInsumo, cantidadRecibida) {
        const producto = this.insumos.find(item => item.id === idInsumo);
        if (producto) {
            producto.cantidad += cantidadRecibida;
            return `Inventario actualizado. Ahora tienes ${producto.cantidad} de ${producto.nombre}.`;
        }
    }
}