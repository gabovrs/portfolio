import Button from "./Button"
import Badge from "./Badge"
import { Linkedin, Github, MailPlus } from "lucide-react"

function Home() {
  return (
    <div className="flex flex-col gap-y-6">
      <h1 className="text-2xl xl:text-4xl font-bold flex flex-wrap items-center gap-2 xl:gap-4">Hola, soy Gabriel Varas <Badge>Disponible para trabajar</Badge></h1>
      <h2 className="text-lg xl:text-xl text-gray-400">Estudiante de Ingeniería Civil en Informática con experiencia en desarrollo de software y proyectos de programación.</h2>

      <ul className="flex flex-wrap gap-2 xl:gap-4">
        <Button link="https://www.linkedin.com/in/gabriel-varas/" text="LinkedIn" icon={<Linkedin strokeWidth={2.5} size={16} />} />
        <Button link="https://github.com/gabovrs" text="GitHub" icon={<Github strokeWidth={2.5} size={16} />} />
        <Button link="mailto:gabrielvaras.ibaceta@gmail.com" text="Contáctame" icon={<MailPlus strokeWidth={2.5} size={16} />} />
      </ul>
    </div>
  )
}

export default Home