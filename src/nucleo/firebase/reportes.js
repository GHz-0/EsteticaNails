/**
 * Capa de servicios para reportes admin
 * Centraliza lógica de agregación y consultas de analítica
 */

import { getFirebaseDb } from "./client.js";
import { collection, getDocs, query, where } from "firebase/firestore";

const db = getFirebaseDb();

/**
 * Normaliza fechas Firestore (Timestamp o string) a Date
 */
function normalizarFecha(fecha) {
  if (!fecha) return null;
  if (fecha.toDate && typeof fecha.toDate === "function") return fecha.toDate();
  if (typeof fecha === "string") return new Date(fecha);
  if (fecha instanceof Date) return fecha;
  return null;
}

/**
 * Filtra elementos por rango de fechas (inclusive)
 */
function filtrarPorFecha(
  items,
  fechaInicioObj,
  fechaFinObj,
  campoFecha = "fecha",
) {
  const inicio = fechaInicioObj.getTime();
  const fin = new Date(fechaFinObj);
  fin.setHours(23, 59, 59, 999);

  return items.filter((item) => {
    const f = normalizarFecha(item[campoFecha]);
    if (!f) return false;
    return f.getTime() >= inicio && f.getTime() <= fin.getTime();
  });
}

/**
 * Calcula rango de fechas según preset
 */
export function calcularRangoFechas(tipo, fechaInicio = null, fechaFin = null) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  let inicio, fin;

  switch (tipo) {
    case "hoy":
      inicio = new Date(hoy);
      fin = new Date(hoy);
      break;

    case "7-dias":
      fin = new Date(hoy);
      inicio = new Date(hoy);
      inicio.setDate(inicio.getDate() - 6);
      break;

    case "30-dias":
      fin = new Date(hoy);
      inicio = new Date(hoy);
      inicio.setDate(inicio.getDate() - 29);
      break;

    case "mes-actual":
      inicio = new Date(hoy);
      inicio.setDate(1);
      fin = new Date(hoy);
      break;

    case "personalizado":
      inicio = fechaInicio ? new Date(fechaInicio) : hoy;
      fin = fechaFin ? new Date(fechaFin) : hoy;
      break;

    default:
      inicio = new Date(hoy);
      fin = new Date(hoy);
  }

  inicio.setHours(0, 0, 0, 0);
  fin.setHours(23, 59, 59, 999);

  return { inicio, fin };
}

/**
 * Obtiene KPIs principales del dashboard
 */
export async function obtenerKPIs(
  tipo = "mes-actual",
  fechaInicio = null,
  fechaFin = null,
) {
  try {
    const rango = calcularRangoFechas(tipo, fechaInicio, fechaFin);

    // Cargar todas las colecciones necesarias
    const [snapCitas, snapServicios, snapUsuarios, snapInventario] =
      await Promise.all([
        getDocs(collection(db, "citas")),
        getDocs(collection(db, "servicios")),
        getDocs(collection(db, "users")),
        getDocs(collection(db, "inventario")),
      ]);

    const citas = snapCitas.docs.map((d) => ({ id: d.id, ...d.data() }));
    const servicios = snapServicios.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    const usuarios = snapUsuarios.docs.map((d) => ({ id: d.id, ...d.data() }));
    const inventario = snapInventario.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    // Mapeo de precios
    const precioMap = new Map(
      servicios.map((s) => [s.id, Number(s.precio || 0)]),
    );

    // Filtrar citas por rango
    const citasEnRango = filtrarPorFecha(citas, rango.inicio, rango.fin);

    // Citas (excluir canceladas)
    const citasActivas = citasEnRango.filter((c) => c.estado !== "cancelada");

    // Cancelaciones
    const cancelaciones = citasEnRango.filter(
      (c) => c.estado === "cancelada",
    ).length;

    // Ingresos estimados (precio de servicio actual × citas completadas)
    const ingresos = citasActivas.reduce(
      (acc, c) => acc + (precioMap.get(c.servicioId) || 0),
      0,
    );

    // Clientes únicos en periodo
    const clientesUnicos = new Set(citasEnRango.map((c) => c.usuarioId)).size;

    // Clientes activos totales (cualquier rol usuario)
    const clientesActivos = usuarios.filter(
      (u) => u.rol === "usuario" && u.estado !== "inactivo",
    ).length;

    // Stock crítico (menor a 5)
    const stockCritico = inventario.filter((p) => (p.cantidad || 0) < 5).length;

    // Servicios disponibles
    const serviciosActivos = servicios.length;

    return {
      totalCitas: citasActivas.length,
      cancelaciones,
      ingresos: Math.round(ingresos * 100) / 100,
      clientesUnicos,
      clientesActivos,
      stockCritico,
      serviciosActivos,
      periodo: { tipo, inicio: rango.inicio, fin: rango.fin },
    };
  } catch (error) {
    console.error("Error obteniendo KPIs:", error);
    throw error;
  }
}

/**
 * Obtiene serie temporal de ingresos por día para gráfica
 */
export async function obtenerSerieIngresos(
  tipo = "mes-actual",
  fechaInicio = null,
  fechaFin = null,
) {
  try {
    const rango = calcularRangoFechas(tipo, fechaInicio, fechaFin);

    const [snapCitas, snapServicios] = await Promise.all([
      getDocs(collection(db, "citas")),
      getDocs(collection(db, "servicios")),
    ]);

    const citas = snapCitas.docs.map((d) => ({ id: d.id, ...d.data() }));
    const servicios = snapServicios.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const precioMap = new Map(
      servicios.map((s) => [s.id, Number(s.precio || 0)]),
    );
    const citasEnRango = filtrarPorFecha(citas, rango.inicio, rango.fin);
    const citasActivas = citasEnRango.filter((c) => c.estado !== "cancelada");

    // Agrupar por día
    const porDia = new Map();
    for (const cita of citasActivas) {
      const fecha = normalizarFecha(cita.fecha);
      if (!fecha) continue;
      const dia = fecha.toISOString().split("T")[0]; // YYYY-MM-DD
      const ingreso = precioMap.get(cita.servicioId) || 0;
      porDia.set(dia, (porDia.get(dia) || 0) + ingreso);
    }

    // Generar serie completa de fechas
    const serie = [];
    const actual = new Date(rango.inicio);
    while (actual <= rango.fin) {
      const dia = actual.toISOString().split("T")[0];
      serie.push({
        fecha: dia,
        ingreso: Math.round((porDia.get(dia) || 0) * 100) / 100,
      });
      actual.setDate(actual.getDate() + 1);
    }

    return serie;
  } catch (error) {
    console.error("Error obteniendo serie de ingresos:", error);
    throw error;
  }
}

/**
 * Obtiene top clientes por gasto en periodo
 */
export async function obtenerTopClientes(
  limite = 10,
  tipo = "mes-actual",
  fechaInicio = null,
  fechaFin = null,
) {
  try {
    const rango = calcularRangoFechas(tipo, fechaInicio, fechaFin);

    const [snapCitas, snapServicios, snapUsuarios] = await Promise.all([
      getDocs(collection(db, "citas")),
      getDocs(collection(db, "servicios")),
      getDocs(collection(db, "users")),
    ]);

    const citas = snapCitas.docs.map((d) => ({ id: d.id, ...d.data() }));
    const servicios = snapServicios.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    const usuarios = snapUsuarios.docs.map((d) => ({ id: d.id, ...d.data() }));

    const precioMap = new Map(
      servicios.map((s) => [s.id, Number(s.precio || 0)]),
    );
    const nombreMap = new Map(
      usuarios.map((u) => [u.uid, u.nombre || "Cliente"]),
    );

    const citasEnRango = filtrarPorFecha(citas, rango.inicio, rango.fin);
    const citasActivas = citasEnRango.filter((c) => c.estado !== "cancelada");

    // Agrupar por cliente
    const porCliente = new Map();
    for (const cita of citasActivas) {
      const uid = cita.usuarioId;
      if (!uid) continue;
      const ingreso = precioMap.get(cita.servicioId) || 0;
      const prev = porCliente.get(uid) || { uid, gasto: 0, citas: 0 };
      prev.gasto += ingreso;
      prev.citas += 1;
      porCliente.set(uid, prev);
    }

    return [...porCliente.values()]
      .map((item) => ({
        ...item,
        nombre: nombreMap.get(item.uid) || "Cliente desconocido",
        gasto: Math.round(item.gasto * 100) / 100,
      }))
      .sort((a, b) => b.gasto - a.gasto)
      .slice(0, limite);
  } catch (error) {
    console.error("Error obteniendo top clientes:", error);
    throw error;
  }
}

/**
 * Obtiene productos con stock crítico (< 5)
 */
export async function obtenerProductosCriticos(limite = 10) {
  try {
    const snapInventario = await getDocs(collection(db, "inventario"));
    const inventario = snapInventario.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    return inventario
      .filter((p) => (p.cantidad || 0) < 5)
      .map((p) => ({
        id: p.id,
        nombre: p.nombre || "Producto sin nombre",
        cantidad: p.cantidad || 0,
        precioVenta: p.precioVenta || 0,
        precioCompra: p.precioCompra || 0,
      }))
      .sort((a, b) => a.cantidad - b.cantidad)
      .slice(0, limite);
  } catch (error) {
    console.error("Error obteniendo productos críticos:", error);
    throw error;
  }
}

/**
 * Obtiene eficiencia de empleados (citas asignadas vs completadas)
 */
export async function obtenerEficienciaEmpleados(
  tipo = "mes-actual",
  fechaInicio = null,
  fechaFin = null,
) {
  try {
    const rango = calcularRangoFechas(tipo, fechaInicio, fechaFin);

    const [snapCitas, snapUsuarios] = await Promise.all([
      getDocs(collection(db, "citas")),
      getDocs(collection(db, "users")),
    ]);

    const citas = snapCitas.docs.map((d) => ({ id: d.id, ...d.data() }));
    const usuarios = snapUsuarios.docs.map((d) => ({ id: d.id, ...d.data() }));

    const citasEnRango = filtrarPorFecha(citas, rango.inicio, rango.fin);

    // Agrupar por empleado
    const porEmpleado = new Map();
    for (const cita of citasEnRango) {
      const empleadoId = cita.empleadoId;
      if (!empleadoId) continue;
      const prev = porEmpleado.get(empleadoId) || {
        empleadoId,
        total: 0,
        completadas: 0,
      };
      prev.total += 1;
      if (cita.estado === "completada" || cita.estado === "confirmada") {
        prev.completadas += 1;
      }
      porEmpleado.set(empleadoId, prev);
    }

    const nombreMap = new Map(
      usuarios
        .filter((u) => u.rol === "empleado")
        .map((u) => [u.uid, u.nombre || "Empleado"]),
    );

    return [...porEmpleado.values()]
      .map((item) => ({
        ...item,
        nombre: nombreMap.get(item.empleadoId) || "Empleado desconocido",
        eficiencia:
          item.total > 0
            ? Math.round((item.completadas / item.total) * 100)
            : 0,
      }))
      .sort((a, b) => b.eficiencia - a.eficiencia);
  } catch (error) {
    console.error("Error obteniendo eficiencia de empleados:", error);
    throw error;
  }
}

/**
 * Obtiene resumen de servicios más vendidos
 */
export async function obtenerTopServicios(
  limite = 10,
  tipo = "mes-actual",
  fechaInicio = null,
  fechaFin = null,
) {
  try {
    const rango = calcularRangoFechas(tipo, fechaInicio, fechaFin);

    const [snapCitas, snapServicios] = await Promise.all([
      getDocs(collection(db, "citas")),
      getDocs(collection(db, "servicios")),
    ]);

    const citas = snapCitas.docs.map((d) => ({ id: d.id, ...d.data() }));
    const servicios = snapServicios.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    const citasEnRango = filtrarPorFecha(citas, rango.inicio, rango.fin);
    const citasActivas = citasEnRango.filter((c) => c.estado !== "cancelada");

    // Agrupar por servicio
    const porServicio = new Map();
    for (const cita of citasActivas) {
      const servicioId = cita.servicioId;
      if (!servicioId) continue;
      const prev = porServicio.get(servicioId) || {
        servicioId,
        cantidad: 0,
        ingresos: 0,
      };
      const servicio = servicios.find((s) => s.id === servicioId);
      const precio = Number(servicio?.precio || 0);
      prev.cantidad += 1;
      prev.ingresos += precio;
      porServicio.set(servicioId, prev);
    }

    const nombreMap = new Map(
      servicios.map((s) => [s.id, s.nombre || "Servicio"]),
    );

    return [...porServicio.values()]
      .map((item) => ({
        ...item,
        nombre: nombreMap.get(item.servicioId) || "Servicio desconocido",
        ingresos: Math.round(item.ingresos * 100) / 100,
      }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, limite);
  } catch (error) {
    console.error("Error obteniendo top servicios:", error);
    throw error;
  }
}
