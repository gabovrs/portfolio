import { SquareArrowOutUpRight } from "lucide-react";
import Button from "./Button";

const experience = [
  {
    date: "Noviembre 2024 - Actualidad",
    title: "Full Stack Developer en Chile Life",
    description: "Fui responsable de desarrollar un servidor desde cero, implementando tanto el backend como el frontend. Utilicé tecnologías como Lua y SQL para la lógica del servidor y la gestión de bases de datos, mientras que React y TypeScript fueron empleados para crear interfaces de usuario dinámicas y modernas. Este proyecto me permitió diseñar y construir una solución completa, optimizando el rendimiento y asegurando una experiencia de usuario fluida en un entorno de servidores personalizados.",
    link: "https://chileliferp.cl/"
  },
  {
    date: "Enero 2023 - Marzo 2025",
    title: "Full Stack Developer en DovuX Games",
    description: "Me dediqué al desarrollo y mantenimiento de código para una plataforma de servidores de juegos, donde fui responsable de implementar y crear aplicaciones utilizando frameworks web modernos. Durante este tiempo, aprendí a utilizar React y TypeScript, aplicándolos en un entorno de desarrollo para FiveM, lo que me permitió crear interfaces de usuario dinámicas y optimizar la experiencia del usuario en servidores personalizados. Además, trabaje con bases de datos SQL, asegurando la integridad y eficiencia de los datos",
    link: "https://dovux.gg/"
  },
]

function Experience() {
  return (
    <ol className="relative border-s-2 border-gray-500/50 ms-2">
      {experience.map((item, _) => (
        <li className="mb-4 ms-4">
          <div className="absolute w-3 h-3 rounded-full mt-1.5 -start-[0.45rem] bg-indigo-500"></div>
          <time className="mb-1 text-sm font-normal leading-none text-gray-500">{item.date}</time>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
          <p className="mb-4 text-base font-normal text-gray-400 text-pretty">{item.description}</p>
          {item.link && (
            <Button type="link" link={item.link} text="Saber más" icon={<SquareArrowOutUpRight size={16} strokeWidth={2} />} />
          )}
        </li>
      ))}
    </ol>
  )
}

export default Experience