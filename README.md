# Teitos

Portal de alquiler asequible: una aplicación de una sola página (SPA) hecha con React para buscar viviendas, consultar convocatorias y presentar una solicitud. Los datos los sirve una API REST local con json-server.

Proyecto 1 de PMDM, 2º DAM.

Hace falta [Node.js](https://nodejs.org/) 22.12 o posterior (lo exige json-server) y tener libres los puertos 5173 y 3001.

```bash
git clone https://github.com/Skriptkiddie342/TeitosProyectNovember.git
cd TeitosProyectNovember
npm install
npm run reset-datos
npm start
```

1. `npm install` instala las dependencias.
2. `npm run reset-datos` genera `db.json` a partir de `db.original.json`, con la colección `solicitudes` vacía. Tiene que mostrar 16 convocatorias, 1200 viviendas y 0 solicitudes.
3. `npm start` arranca a la vez la aplicación y el servidor de datos.

Después, abre <http://localhost:5173>. El servidor de datos queda en <http://localhost:3001>. Para pararlo todo, `Ctrl + C`.

### Comprobar que el servidor responde bien

| Petición                                                             | Devuelve                                     |
| -------------------------------------------------------------------- | -------------------------------------------- |
| <http://localhost:3001/viviendas?provincia=Pontevedra&dormitorios=2> | 30 viviendas                                 |
| <http://localhost:3001/viviendas?renta_gte=300&renta_lte=500>        | 384 viviendas                                |
| <http://localhost:3001/viviendas?_page=1&_per_page=12>               | Un objeto con 12 viviendas en `data`         |
| <http://localhost:3001/solicitudes>                                  | Una lista vacía, si no se ha enviado ninguna |

### Si algo falla

- **Al enviar una solicitud dice que falta la colección `solicitudes`:** ejecuta `npm run reset-datos` y vuelve a intentarlo. json-server no crea colecciones nuevas.
- **`EADDRINUSE` en el puerto 3001:** ya hay otro servidor abierto. Ciérralo y repite `npm start`.
- **Volver a empezar:** `npm run reset-datos` restaura los datos y borra todas las solicitudes enviadas. Se puede ejecutar con el servidor en marcha.

## Comandos

| Comando               | Qué hace                                                       |
| --------------------- | -------------------------------------------------------------- |
| `npm start`           | Arranca la aplicación y el servidor de datos                   |
| `npm run dev`         | Solo la aplicación                                             |
| `npm run api`         | Solo el servidor de datos                                      |
| `npm run reset-datos` | Restaura `db.json` desde `db.original.json`                    |
| `npm run build`       | Genera la versión de producción en `dist/`                     |
| `npm run preview`     | Sirve `dist/` en <http://localhost:4173> (requiere el `build`) |
| `npm run lint`        | Revisa el código con Oxlint                                    |

## Rutas de la aplicación

| Ruta                 | Página                                                                    |
| -------------------- | ------------------------------------------------------------------------- |
| `/`                  | Inicio, con las convocatorias abiertas                                    |
| `/viviendas`         | Buscador: búsqueda, filtros, orden y paginación                           |
| `/viviendas/:id`     | Detalle de una vivienda                                                   |
| `/convocatorias`     | Todas las convocatorias                                                   |
| `/convocatorias/:id` | Detalle de una convocatoria y sus viviendas libres                        |
| `/solicitud`         | Solicitud en cuatro pasos: datos personales, hogar, viviendas y revisión  |
| `/mi-solicitud`      | Solicitudes enviadas: consultar, modificar con el plazo abierto y retirar |
| Cualquier otra       | Página 404                                                                |

El buscador guarda su estado en la URL, así que cualquier búsqueda se puede enlazar:

| Parámetro       | Valores                                                                  |
| --------------- | ------------------------------------------------------------------------ |
| `q`             | Municipio, provincia o referencia                                        |
| `provincia`     | Nombre de la provincia; se puede repetir                                 |
| `personas`      | De 1 a 6 (6 es «6 o más»)                                                |
| `ingresos`      | Ingresos netos anuales del hogar, en euros                               |
| `accesibilidad` | `adaptada`, `practicable`, `sin_adaptar` o `sin_datos`; se puede repetir |
| `rentaMax`      | Renta máxima al mes, en euros                                            |
| `orden`         | `asc` y `desc` (renta), `superficie-asc` y `superficie-desc`             |
| `vista`         | `lista`; sin el parámetro, rejilla                                       |
| `pagina`        | Número de página; sin el parámetro, la 1                                 |

Ejemplo: `/viviendas?provincia=Lugo&personas=2&ingresos=24000&orden=superficie-desc`

## Estructura

```text
db.original.json   Datos de partida. No se modifica
db.json            Copia de trabajo, en la que escribe json-server
scripts/           Script de reset-datos
docs/              Enunciado
src/
  api/             Peticiones al servidor. La URL solo está en api/api.js
  hooks/           Carga de datos, con sus estados de cargando, error y vacío
  components/      Componentes reutilizables
  pages/           Una página por ruta
  context/         Borrador de la solicitud (useReducer y localStorage)
  reglas/          Regla de acceso, validación y plazo de las convocatorias
  utils/           Funciones de apoyo
  styles/          Variables y estilos globales
```

## Publicarla

El proyecto está preparado para Netlify y para Vercel; basta con uno de los dos. Importa el repositorio desde su web y acepta la configuración que detecta: el comando `npm run build` y la carpeta `dist`.

| Servicio | Configuración                |
| -------- | ---------------------------- |
| Netlify  | [netlify.toml](netlify.toml) |
| Vercel   | [vercel.json](vercel.json)   |

Los dos ficheros incluyen la redirección que necesita React Router. Las rutas como `/viviendas/773` no existen como ficheros: sin la redirección, al recargar o abrir un enlace el servicio respondería con su propio 404. Con ella responde siempre con `index.html`, y React Router muestra la página que toca, incluida la 404 de la aplicación.

## Qué hace la versión publicada sin el servidor de datos

Netlify y Vercel publican solo la aplicación. El servidor de datos no se publica: la aplicación busca los datos en `http://localhost:3001`, que es el ordenador de quien la visita. Como ahí no hay ningún servidor, las peticiones fallan. Además, según el navegador, puede aparecer un aviso pidiendo permiso para acceder a la red local, o bloquearse la petición directamente.

La aplicación no se rompe ni muestra páginas en blanco. Esto es lo que se ve:

| Página                                 | Sin servidor de datos                                                                                       |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `/`                                    | Se ve la portada; el número de viviendas y las convocatorias muestran un error                              |
| `/viviendas`                           | «No se han podido cargar las viviendas.»                                                                    |
| `/viviendas/:id`                       | «No se ha podido cargar la vivienda», con enlace al buscador                                                |
| `/convocatorias`, `/convocatorias/:id` | Mensaje de error; el detalle enlaza con el listado                                                          |
| `/solicitud`                           | Los pasos 1 y 2 funcionan y validan. En el paso 3 avisa de que no puede comprobar las viviendas y no deja continuar |
| `/mi-solicitud`                        | «No se han podido cargar las solicitudes.»                                                                  |
| Ruta desconocida                       | Página 404                                                                                                  |

- **Sí funciona:** la navegación, el menú, recargar cualquier ruta, los enlaces directos y los dos primeros pasos de la solicitud. El borrador se guarda en el navegador (`localStorage`).
- **No funciona:** buscar viviendas, ver detalles, añadir viviendas a la solicitud y enviar, modificar o retirar solicitudes.

Para usarla completa hay que arrancarla en local con los pasos de arriba. Para que funcionara publicada habría que alojar también json-server y poner su dirección en [src/api/api.js](src/api/api.js), el único sitio donde está escrita.
