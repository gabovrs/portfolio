import Header from "./Header";
import Home from "./Home";
import Experience from "./Experience";
import Section from "./Section";
import { BriefcaseBusiness } from "lucide-react";

function App() {
  return (
    <>
      <div className="fixed top-0 z-[-2] h-screen w-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>

      <Header />

      <main className="w-full xl:w-[50rem] px-4 flex flex-col mt-20 xl:mt-32 gap-y-12 xl:gap-y-24 mx-auto">
        <Section id="top">
          <Home />
        </Section>

        <Section id="experience" title="Experiencia" icon={<BriefcaseBusiness strokeWidth={2.5} size={24} />}>
          <Experience />
        </Section>

        <Section id="projects" title="Proyectos" icon={<BriefcaseBusiness strokeWidth={2.5} size={24} />}>
          <p className="text-gray-400">Aquí van los proyectos que he realizado.</p>
        </Section>

        <Section id="about" title="Sobre mí" icon={<BriefcaseBusiness strokeWidth={2.5} size={24} />}>
          <p className="text-gray-400 text-pretty">Soy estudiante de segundo año de Ingeniería Civil en Informática y Telecomunicaciones con experiencia en desarrollo de software y proyectos de programación. Poseo competencias en diversos lenguajes de programación y habilidades en trabajo en equipo y liderazgo de proyectos. Estoy en constante búsqueda de oportunidades para aplicar y expandir mis conocimientos en programación y desarrollo.</p>
        </Section>
      </main>

      <footer className="w-full text-center text-gray-500 mt-12 mb-6 xl:mt-24 xl:mb-12">
        <p>© 2025 Gabriel Varas. Todos los derechos reservados.</p>
      </footer>
    </>
  );
}

export default App;
