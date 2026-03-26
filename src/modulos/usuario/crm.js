// src/modulos/usuario/crm.js

export class CRM_Estetica {
    constructor() {
        this.clientas = [];
    }

    registrarClienta(nombreCompleto, correoElectronico, contraseña) {
        const nuevaClienta = {
            id: Date.now(),
            nombre: nombreCompleto,
            correo: correoElectronico,
            password: contraseña, 
            visitas: 0
        };
        
        this.clientas.push(nuevaClienta);
        return `¡Cuenta creada con éxito para ${nombreCompleto}!`;
    }

    registrarVisita(idClienta) {
        const clienta = this.clientas.find(c => c.id === idClienta);
        if (clienta) {
            clienta.visitas += 1;
            return `Visita anotada. ${clienta.nombre} lleva ${clienta.visitas} visitas.`;
        } else {
            return "Error: Clienta no encontrada.";
        }
    }

    obtenerClientas() {
        return this.clientas;
    }
}