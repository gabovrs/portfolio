function Header() {
  return (
    <header className="fixed top-0 flex items-center justify-between py-4 px-8 xl:px-16 w-full backdrop-blur-lg border-b border-gray-500/10 z-10">
      <img
        className="size-8 xl:size-12 rounded-full"
        src="https://avatars.githubusercontent.com/u/62518173?v=4"
        alt="foto"
      />
      <nav className="flex gap-x-4 xl:gap-x-8">
        <a href="#top">Inicio</a>
        <a href="#about">Sobre mí</a>
        <a href="#experience">Experiencia</a>
        <a href="#projects">Proyectos</a>
      </nav>
    </header>
  )
}

export default Header