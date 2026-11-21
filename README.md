# Portfolio · Gabriel Varas

Sitio personal con panel de administración. Next.js 15 (App Router), Prisma + PostgreSQL (Neon), Vercel Blob para imágenes.

- `/` página pública. Se regenera sola cada vez que guardas algo en el panel.
- `/admin` panel privado: proyectos (capturas, orden, destacado, visible), perfil y textos, foto, CV en PDF, cifras, trayectoria y habilidades.

## Desarrollo local

```bash
pnpm install
cp .env.example .env        # completa DATABASE_URL, DIRECT_URL, ADMIN_PASSWORD y AUTH_SECRET
pnpm db:migrate             # crea las tablas
pnpm db:seed                # carga tus datos iniciales
pnpm dev                    # http://localhost:3000 y http://localhost:3000/admin
```

Sin `BLOB_READ_WRITE_TOKEN`, las imágenes que subas en local se guardan en `public/uploads` (solo funciona con `pnpm dev`).

## Despliegue en Vercel

1. Importa el repositorio en Vercel.
2. En **Storage**, crea una base **Neon (Postgres)** y un **Blob store** y conéctalos al proyecto. Esto agrega `DATABASE_URL`, `DIRECT_URL` (o `DATABASE_URL_UNPOOLED`, cópiala como `DIRECT_URL`) y `BLOB_READ_WRITE_TOKEN`.
3. Agrega `ADMIN_PASSWORD`, `AUTH_SECRET` (`openssl rand -base64 32`) y `SITE_URL` (tu dominio, por ejemplo `https://gabrielvaras.cl`).
4. Cambia el **Build Command** a `pnpm db:deploy && pnpm build` para que las migraciones se apliquen en cada despliegue.
5. Después del primer despliegue, carga los datos iniciales una vez desde tu computador apuntando a la base de producción: `DATABASE_URL=... DIRECT_URL=... pnpm db:seed`.

## Formato de textos en el panel

- `**texto**` resalta en negrita (presentación).
- `*texto*` va en serif cursiva con el color de acento (frase de perfil y título de contacto).
- Listas: un elemento por línea. Cifras: `valor | descripción`.
