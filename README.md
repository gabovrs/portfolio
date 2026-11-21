# Portfolio · Gabriel Varas

Sitio personal con panel de administración. Next.js 15 (App Router), Prisma + PostgreSQL (Neon), Vercel Blob para imágenes.

- `/` página pública. Se regenera sola cada vez que guardas algo en el panel.
- `/admin` panel privado: proyectos (capturas, orden, destacado, visible), perfil y textos, foto, CV en PDF, cifras, trayectoria y habilidades.

## Desarrollo local

```bash
pnpm install
cp .env.example .env        # completa DATABASE_URL, DATABASE_URL_UNPOOLED, ADMIN_PASSWORD y AUTH_SECRET
pnpm db:migrate             # crea las tablas
pnpm db:seed                # carga tus datos iniciales
pnpm dev                    # http://localhost:3000 y http://localhost:3000/admin
```

Sin `BLOB_READ_WRITE_TOKEN`, las imágenes que subas en local se guardan en `public/uploads` (solo funciona con `pnpm dev`).

## Despliegue en Vercel

1. Importa el repositorio en Vercel.
2. En **Storage**, conecta una base **Neon (Postgres)** y un **Blob store** al proyecto. Vercel agrega solo `DATABASE_URL`, `DATABASE_URL_UNPOOLED` y `BLOB_READ_WRITE_TOKEN`.
3. Agrega `ADMIN_PASSWORD`, `AUTH_SECRET` (`openssl rand -base64 32`) y `SITE_URL` (tu dominio).
4. Despliega. El build (`pnpm build`) aplica las migraciones y, si la base está vacía, carga los datos iniciales. Si la base ya tiene datos, no los toca.

Si usas el dominio `*.vercel.app` como sitio público, desactiva **Settings → Deployment Protection → Vercel Authentication** para producción, o los visitantes verán un inicio de sesión de Vercel.

## Formato de textos en el panel

- `**texto**` resalta en negrita (presentación).
- `*texto*` va en serif cursiva con el color de acento (frase de perfil y título de contacto).
- Listas: un elemento por línea. Cifras: `valor | descripción`.
