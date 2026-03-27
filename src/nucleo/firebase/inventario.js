import { getFirebaseDb } from "./client.js";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const db = getFirebaseDb();

/**
 * Obtiene todos los productos del inventario
 */
export async function obtenerInventario() {
  try {
    const inventarioRef = collection(db, "inventario");
    const snapshot = await getDocs(inventarioRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error obteniendo inventario:", error);
    return [];
  }
}

/**
 * Obtiene un producto por ID
 */
export async function obtenerProducto(productoId) {
  try {
    const inventarioRef = collection(db, "inventario");
    const snapshot = await getDocs(inventarioRef);
    const productos = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    return productos.find((p) => p.id === productoId) || null;
  } catch (error) {
    console.error("Error obteniendo producto:", error);
    return null;
  }
}

/**
 * Crea un nuevo producto (solo admin)
 */
export async function crearProducto(datos) {
  try {
    const inventarioRef = collection(db, "inventario");
    const docRef = await addDoc(inventarioRef, {
      ...datos,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...datos };
  } catch (error) {
    console.error("Error creando producto:", error);
    throw error;
  }
}

/**
 * Actualiza un producto (solo admin)
 */
export async function actualizarProducto(productoId, datos) {
  try {
    const productoRef = doc(db, "inventario", productoId);
    await updateDoc(productoRef, {
      ...datos,
      updatedAt: serverTimestamp(),
    });
    return { id: productoId, ...datos };
  } catch (error) {
    console.error("Error actualizando producto:", error);
    throw error;
  }
}

/**
 * Reduce la cantidad de un producto
 */
export async function reducirCantidad(productoId, cantidad) {
  try {
    const producto = await obtenerProducto(productoId);
    if (!producto) throw new Error("Producto no encontrado");

    const nuevaCantidad = Math.max(0, producto.cantidad - cantidad);
    return await actualizarProducto(productoId, {
      cantidad: nuevaCantidad,
      ultimoMovimiento: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error reduciendo cantidad:", error);
    throw error;
  }
}

/**
 * Incrementa la cantidad de un producto
 */
export async function incrementarCantidad(productoId, cantidad) {
  try {
    const producto = await obtenerProducto(productoId);
    if (!producto) throw new Error("Producto no encontrado");

    const nuevaCantidad = producto.cantidad + cantidad;
    return await actualizarProducto(productoId, {
      cantidad: nuevaCantidad,
      ultimoMovimiento: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error incrementando cantidad:", error);
    throw error;
  }
}

/**
 * Obtiene productos con bajo stock
 */
export async function obtenerProductosBajoStock(minimo = 5) {
  try {
    const inventario = await obtenerInventario();
    return inventario.filter((p) => p.cantidad <= minimo);
  } catch (error) {
    console.error("Error obteniendo productos bajo stock:", error);
    return [];
  }
}

/**
 * Elimina un producto (solo admin)
 */
export async function eliminarProducto(productoId) {
  try {
    const productoRef = doc(db, "inventario", productoId);
    await deleteDoc(productoRef);
    return true;
  } catch (error) {
    console.error("Error eliminando producto:", error);
    throw error;
  }
}

/**
 * Inicializa inventario de prueba en Firestore
 */
export async function inicializarInventario() {
  try {
    const inventarioRef = collection(db, "inventario");
    const snapshot = await getDocs(inventarioRef);

    // Si ya existen productos, no hacer nada
    if (snapshot.docs.length > 0) {
      console.log("Inventario ya existe en Firestore");
      return;
    }

    const productosPrueba = [
      {
        nombre: "Esmalte Rojo Pasión",
        marca: "OPI",
        categoria: "esmaltes",
        cantidad: 15,
        precioCompra: 80,
        precioVenta: 150,
        proveedor: "Distribuidora ABC",
      },
      {
        nombre: "Acetona Pura",
        marca: "Generic",
        categoria: "solventes",
        cantidad: 5,
        precioCompra: 120,
        precioVenta: 200,
        proveedor: "Químicos XYZ",
      },
      {
        nombre: "Gel Base",
        marca: "Gelish",
        categoria: "geles",
        cantidad: 8,
        precioCompra: 200,
        precioVenta: 350,
        proveedor: "Distribuidor Premium",
      },
      {
        nombre: "Broca Punta Diamante",
        marca: "Generic",
        categoria: "herramientas",
        cantidad: 12,
        precioCompra: 50,
        precioVenta: 100,
        proveedor: "Herramientas SQL",
      },
      {
        nombre: "Algodón Cosmético",
        marca: "Generic",
        categoria: "consumibles",
        cantidad: 25,
        precioCompra: 30,
        precioVenta: 60,
        proveedor: "Cosméticos Lidia",
      },
      {
        nombre: "Primer para Uñas",
        marca: "Orly",
        categoria: "preparación",
        cantidad: 4,
        precioCompra: 150,
        precioVenta: 280,
        proveedor: "Distribuidor Premium",
      },
    ];

    for (const producto of productosPrueba) {
      await addDoc(inventarioRef, {
        ...producto,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    console.log("Inventario inicializado correctamente");
  } catch (error) {
    console.error("Error inicializando inventario:", error);
  }
}
