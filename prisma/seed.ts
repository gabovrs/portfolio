import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Solo carga los datos iniciales en una base vacía, así no pisa lo que edites en el panel.
  if ((await prisma.profile.count()) > 0) {
    console.log("La base ya tiene datos: se omite la carga inicial.");
    return;
  }

  await prisma.profile.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      firstName: "Gabriel",
      lastName: "Varas",
      accentName: "Ibaceta",
      headline: "Desarrollador full-stack · Chile",
      intro:
        "Construyo productos web de principio a fin. **Más de 3 años de experiencia profesional** y productos propios en producción con **usuarios reales**. Estudio Ingeniería Civil en Informática y Telecomunicaciones en la Universidad Diego Portales.",
      availability: "Disponible para Práctica 1",
      available: true,
      photoUrl: "/seed/foto.jpg",
      photoCaption: "3.er año · UDP",
      aboutQuote: "Llevo ideas desde cero hasta *usuarios reales*: diseño, código, despliegue y comunidad.",
      aboutText:
        "Me interesan el desarrollo de software, las nuevas tecnologías y el emprendimiento. A mediano plazo quiero crear una startup. Tengo experiencia liderando proyectos y trabajando en equipos de desarrollo.",
      contactTitle: "Busco mi Práctica 1. *Conversemos.*",
      email: "gabriel.varas1@mail.udp.cl",
      linkedinUrl: "https://linkedin.com/in/gabriel-varas",
      githubUrl: "https://github.com/gabovrs",
      cvUrl: null,
      techStrip: ["TypeScript", "Next.js", "React", "Node.js", "PostgreSQL", "Prisma", "Tailwind CSS", "Lua", "Python", "C++", "Vercel", "Git"],
    },
  });

  if ((await prisma.stat.count()) === 0) {
    await prisma.stat.createMany({
      data: [
        { value: "3+", label: "años de experiencia profesional", order: 0 },
        { value: "500+", label: "usuarios activos en Dovux Games", order: 1 },
        { value: "~10k", label: "visitas mensuales en Quedo", order: 2 },
        { value: "40+", label: "sistemas desarrollados en Chile Life RP", order: 3 },
      ],
    });
  }

  await prisma.project.upsert({
    where: { slug: "chile-life-rp" },
    update: {},
    create: {
      slug: "chile-life-rp",
      title: "Chile Life RP",
      role: "Cofundador y desarrollador principal",
      period: "2026",
      status: "IN_PROGRESS",
      statusLabel: "En curso · beta abierta",
      summary:
        "Servidor de roleplay para GTA V (FiveM) orientado a la comunidad chilena, con framework propio, tienda web y sistema de monetización.",
      highlights: [
        "Framework propio en TypeScript para cliente, servidor e interfaz, con base de datos SQL versionada por migraciones.",
        "Más de 40 sistemas: economía, inventario, facciones con MDT y dispatch, propiedades y teléfono con 6 apps.",
        "Monetización con Tebex (VIP por suscripción, gift cards, reembolsos) sin vender ventajas de juego.",
        "Web oficial en Vercel con contenido editable desde un panel de administración.",
      ],
      tech: ["TypeScript", "Node.js", "FiveM", "SQL", "Vercel", "Tebex"],
      metrics: [],
      url: "https://chileliferp.com",
      linkLabel: "chileliferp.com",
      imageUrl: "/seed/chile-life-rp.jpg",
      imageAlt: "Página de inicio de Chile Life RP",
      featured: true,
      visible: true,
      order: 0,
    },
  });

  await prisma.project.upsert({
    where: { slug: "quedo" },
    update: {},
    create: {
      slug: "quedo",
      title: "Quedo",
      role: "Desarrollo full-stack · individual",
      period: "Proyecto personal",
      status: "LIVE",
      statusLabel: "En producción",
      summary:
        "Plataforma gratuita para ingresar el puntaje PAES una sola vez y compararlo al instante con los puntajes de corte históricos de más de 100 universidades.",
      highlights: [],
      tech: ["Next.js", "Prisma", "PostgreSQL", "NextAuth", "Tailwind", "shadcn/ui"],
      metrics: [
        { value: "~10k", label: "visitas mensuales" },
        { value: "100+", label: "universidades" },
      ],
      url: "https://quedo.cl",
      linkLabel: "quedo.cl",
      imageUrl: "/seed/quedo.jpg",
      imageAlt: "Página de inicio de Quedo",
      featured: false,
      visible: true,
      order: 1,
    },
  });

  if ((await prisma.experience.count()) === 0) {
    await prisma.experience.createMany({
      data: [
        {
          period: "Ene 2023 – hoy",
          title: "Desarrollador de Software",
          org: "Dovux Games · Remoto",
          description:
            "Desarrollo y mantenimiento de una plataforma de servidores de juegos con más de 500 usuarios activos en tiempo real. Equipo de 10 personas: lidero proyectos, optimizo rendimiento y desarrollo con Lua, React y SQL.",
          current: true,
          order: 0,
        },
        {
          period: "2026 – hoy",
          title: "Cofundador y desarrollador principal",
          org: "Chile Life RP",
          description:
            "Producto completo: arquitectura, más de 40 sistemas, web, monetización, moderación y roadmap por fases hacia el MVP, trabajando con Git en equipo.",
          current: true,
          order: 1,
        },
        {
          period: "Mar 2024 – hoy",
          title: "Ingeniería Civil en Informática y Telecomunicaciones",
          org: "Universidad Diego Portales",
          description: "Tercer año. En búsqueda de Práctica 1.",
          current: false,
          order: 2,
        },
        {
          period: "2012 – 2023",
          title: "Enseñanza Básica y Media",
          org: "Colegio Alcántara de Talagante",
          description: "",
          current: false,
          order: 3,
        },
      ],
    });
  }

  if ((await prisma.skillGroup.count()) === 0) {
    await prisma.skillGroup.createMany({
      data: [
        { label: "Lenguajes", items: ["TypeScript", "JavaScript", "Python", "C++", "C#", "Lua", "SQL"], order: 0 },
        { label: "Frameworks", items: ["Next.js", "React", "Node.js", "Prisma", "NextAuth", "Tailwind CSS", "shadcn/ui"], order: 1 },
        { label: "Datos y nube", items: ["PostgreSQL (Neon)", "SQL", "Vercel"], order: 2 },
        { label: "Herramientas", items: ["Git / GitHub", "pnpm", "Notion", "Claude Code"], order: 3 },
        { label: "Idiomas", items: ["Español nativo", "Inglés intermedio"], order: 4 },
      ],
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
