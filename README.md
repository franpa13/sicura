# SICURA - E-commerce

Monorepo del e-commerce de **SICURA**, empresa de seguridad privada: vigilancia fisica,
seguridad electronica y productos ADT.

```
sicura/
├── client/   Frontend - React + Vite + TypeScript
└── server/   Backend  - Node.js + Express + MySQL (Sequelize)
```

Ambos proyectos estan organizados **por feature** (dominio), no por tipo de archivo:
cada feature agrupa todo lo suyo en una sola carpeta.

## Alcance actual

Esto es el **esqueleto** del proyecto: estructura, configuracion, modelos y rutas montadas.
La logica de negocio se implementa feature por feature. Los puntos todavia pendientes estan
marcados con un comentario `// Pendiente:` o lanzan un error explicito.

## Requisitos

- Node.js 20 o superior
- MySQL 8 con una base creada (por defecto `sicura_db`)

## Como levantar el proyecto en desarrollo

Los dos proyectos se levantan **por separado**, en dos terminales.

### 1. Backend (`/server`)

```bash
cd server
npm install
cp .env.example .env    # en Windows: copy .env.example .env
npm run dev
```

Queda escuchando en `http://localhost:4000`.
Health check: `GET http://localhost:4000/health`.

En desarrollo, si MySQL no esta disponible el servidor arranca igual y avisa por consola,
para poder trabajar en la API sin base levantada. En produccion, en cambio, corta el arranque.

### 2. Frontend (`/client`)

```bash
cd client
npm install
cp .env.example .env    # en Windows: copy .env.example .env
npm run dev
```

Queda en `http://localhost:5173` y pega contra la API definida en `VITE_API_URL`.

### Scripts utiles

| Carpeta  | Comando             | Que hace                               |
| -------- | ------------------- | -------------------------------------- |
| `server` | `npm run dev`       | Express con recarga automatica         |
| `server` | `npm start`         | Arranque para produccion               |
| `client` | `npm run dev`       | Vite en modo desarrollo                |
| `client` | `npm run build`     | Chequeo de tipos + build de produccion |
| `client` | `npm run typecheck` | Solo chequeo de tipos                  |
| `client` | `npm run lint`      | Linter                                 |

## Variables de entorno

Cada carpeta tiene su propio `.env.example` con todas las variables que usa el proyecto.
**Ninguno de los `.env` reales se sube a git** (ya estan en los `.gitignore`).

### Que copiar

| Carpeta  | Copiar                | A             |
| -------- | --------------------- | ------------- |
| `server` | `server/.env.example` | `server/.env` |
| `client` | `client/.env.example` | `client/.env` |

En el cliente, Vite solo expone al navegador las variables con prefijo **`VITE_`**.
Nunca poner secretos ahi: todo lo que empieza con `VITE_` viaja al browser.
Por eso en el frontend va la *public key* de Mercado Pago y en el backend el *access token*.

### Obligatorias en produccion

Con `NODE_ENV=production`, el servidor **no levanta** si falta alguna de estas:

| Variable     | Para que se usa               |
| ------------ | ----------------------------- |
| `DB_HOST`    | Host de MySQL                 |
| `DB_NAME`    | Nombre de la base             |
| `DB_USER`    | Usuario de MySQL              |
| `JWT_SECRET` | Firma de los tokens de sesion |

En desarrollo, si falta alguna se muestra un warning y se usan valores por defecto.
Por eso `DB_PASSWORD` y `JWT_SECRET` pueden quedar vacios en el `.env.example`:
se completan en el `.env` local de cada uno, que no se versiona.

### JWT_SECRET en produccion

En produccion `JWT_SECRET` tiene que ser un valor **largo y aleatorio**, distinto del que se
use en desarrollo. Si se filtra, cualquiera puede firmar tokens validos. Se puede generar asi:

```bash
node -e "console.log(require('node:crypto').randomBytes(48).toString('hex'))"
```

### Resto de las variables del server

| Seccion        | Variables                                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| Entorno        | `NODE_ENV`                                                                                                       |
| Servidor       | `PORT`                                                                                                           |
| Base de datos  | `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`                                                        |
| CORS           | `CLIENT_URL` (origen permitido del frontend)                                                                     |
| Autenticacion  | `JWT_SECRET`, `JWT_EXPIRES_IN`                                                                                   |
| Mercado Pago   | `MP_ACCESS_TOKEN`, `MP_PUBLIC_KEY`                                                                               |
| Notificaciones | `MAIL_HOST`, `MAIL_PORT`, `MAIL_USER`, `MAIL_PASSWORD`, `MAIL_FROM`, `WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_ID`   |

Todas se leen en un unico lugar: `server/src/config/env.js`.
El resto del codigo importa ese objeto `config` y **no usa `process.env` directamente**.

## Estructura del backend (`/server`)

```
server/src/
├── features/
│   ├── auth/            login, registro, perfil
│   ├── products/        catalogo (productos, kits, planes ADT)
│   ├── orders/          checkout, pagos y estados de pedido
│   ├── quotes/          cotizador de servicios para empresas
│   ├── users/           usuarios y roles
│   └── notifications/   mail y WhatsApp post-compra
├── shared/
│   ├── middlewares/     auth, errores, validaciones
│   ├── utils/           errores tipados y helpers
│   └── models.js        relaciones entre los modelos de cada feature
├── config/
│   ├── database.js      instancia de Sequelize
│   └── env.js           configuracion centralizada + validacion
├── app.js               Express: middlewares globales y montaje de rutas
└── server.js            arranque del servidor
```

Cada feature es autocontenida: `*.controller.js`, `*.service.js`, `*.routes.js` y `*.model.js`
viven juntos. Las rutas se registran centralmente en `app.js`.

### Endpoints montados

| Prefijo              | Feature       |
| -------------------- | ------------- |
| `GET /health`        | health check  |
| `/api/auth`          | auth          |
| `/api/products`      | products      |
| `/api/orders`        | orders        |
| `/api/quotes`        | quotes        |
| `/api/users`         | users         |
| `/api/notifications` | notifications |

### Modelos

| Modelo      | Campos principales                                                   |
| ----------- | -------------------------------------------------------------------- |
| `User`      | `nombre`, `email`, `password_hash`, `rol`, `tipo`                    |
| `Product`   | `nombre`, `descripcion`, `precio`, `categoria`, `imagen_url`, `tipo` |
| `Order`     | `user_id` (nulo si es invitado), `estado`, `total`, `medio_pago`     |
| `OrderItem` | `order_id`, `product_id`, `cantidad`, `precio_unitario`              |
| `Quote`     | `nombre_empresa`, `contacto`, `detalle_servicio`, `estado`           |

Cada uno tiene su interfaz equivalente en `client/src/shared/types`.

## Estructura del frontend (`/client`)

```
client/src/
├── features/
│   ├── catalog/     listado, detalle y filtro persona/empresa
│   ├── cart/        carrito de compras
│   ├── checkout/    flujo de pago, invitado vs. registrado
│   ├── quotes/      formulario de cotizacion para empresas
│   ├── auth/        login y registro opcional
│   └── admin/       panel: ABM de productos y metricas
├── shared/
│   ├── components/  UI reutilizable (Button, Card, Layout, PageHeader)
│   ├── hooks/       hooks genericos
│   ├── services/    cliente axios e interceptores
│   ├── types/       Product, Order, User, Quote y demas tipos del dominio
│   └── utils/       formateo de precios y fechas
├── App.tsx          rutas (react-router-dom)
└── main.tsx         punto de entrada
```

Cada feature agrupa sus `.tsx`, sus hooks, su `types.ts` y sus llamadas a la API.
Los tipos del dominio viven en `shared/types` y se reutilizan tanto en los servicios
como en los componentes que los consumen.

TypeScript corre en **modo estricto** (`strict: true`).

### Rutas del cliente

| Ruta               | Pantalla                |
| ------------------ | ----------------------- |
| `/catalogo`        | listado de productos    |
| `/catalogo/:id`    | detalle de producto     |
| `/carrito`         | carrito                 |
| `/checkout`        | checkout                |
| `/cotizador`       | cotizador para empresas |
| `/login`           | ingreso                 |
| `/registro`        | registro opcional       |
| `/admin`           | metricas del panel      |
| `/admin/productos` | ABM de productos        |
# sicura
