# Archivos Legado

Esta carpeta contiene archivos y configuraciones que fueron parte del proyecto pero **ya no se utilizan** en la versión actual.

## Contenido

### `firebase.js`

- Archivo de referencia antigua de configuración Firebase
- **Estado actual:** No se usa. La app utiliza `src/nucleo/firebase/client.js` para inicializar Firebase
- **Razón del cambio:** Consolidación de configuración en un único archivo de cliente

### `database/`

- Carpeta con scripts de SQL para PostgreSQL (01_schema.sql, 02_seed.sql)
- **Estado actual:** No se usa. El backend de datos es **Firebase Firestore**, no relacional
- **Razón:** El proyecto está 100% en Firebase (Auth + Firestore)
- Si en el futuro migrases a una BD relacional, estos scripts pueden servir como referencia

## Nota

Estos archivos se conservan aquí para referencia histórica, pero no afectan el funcionamiento actual de la app.
Si necesitas trabajar con ellos en el futuro, están disponibles en esta carpeta.

**Para IA/desarrollo futuro:** No incluyas esta carpeta en contexto de nuevos módulos.
