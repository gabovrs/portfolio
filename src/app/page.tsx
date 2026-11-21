import Image from "next/image";
import { getSite, metricsOf } from "@/lib/data";
import { Logo } from "@/components/Logo";
import { Rich } from "@/components/Rich";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CopyButton } from "@/components/CopyButton";

// La página se regenera al guardar en el panel (revalidatePath) y como respaldo cada hora.
export const revalidate = 3600;

export default async function Home() {
  const { profile, stats, projects, experience, skills } = await getSite();

  if (!profile) {
    return (
      <main className="wrap" style={{ paddingBlock: 120 }}>
        <h1>Sitio en preparación</h1>
        <p style={{ marginTop: 16, color: "var(--muted)" }}>
          Falta cargar los datos iniciales. Ejecuta <code>pnpm db:seed</code> o completa tu perfil en /admin.
        </p>
      </main>
    );
  }

  const fullName = `${profile.firstName} ${profile.lastName}`;
  const linkedinLabel = profile.linkedinUrl?.replace(/^https?:\/\/(www\.)?linkedin\.com\//, "") ?? "";

  return (
    <>
      <a className="skip" href="#proyectos">Saltar a proyectos</a>
      <header className="nav">
        <div className="wrap">
          <a className="brand" href="#top" aria-label="Inicio">
            <Logo />
            {fullName}
          </a>
          <nav className="links" aria-label="Secciones">
            <a href="#proyectos">Proyectos</a>
            <a href="#experiencia">Experiencia</a>
            <a href="#perfil">Perfil</a>
            <a href="#contacto">Contacto</a>
          </nav>
          <span className="status">
            <i className={profile.available ? "dot" : "dot off"} />
            <span className="t">{profile.availability}</span>
          </span>
          <ThemeToggle />
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="glow" aria-hidden="true" />
          <div className="wrap">
            <div style={{ minWidth: 0 }}>
              <div className="eyebrow">
                <span className="bar" />
                <span className="label">{profile.headline}</span>
              </div>
              <h1 className="name">
                <span className="reveal"><span>{profile.firstName}</span></span>
                <span className="reveal">
                  <span>
                    {profile.lastName}
                    {profile.accentName && <> <span className="serif">{profile.accentName}</span></>}
                  </span>
                </span>
              </h1>
              <p className="lede"><Rich text={profile.intro} /></p>
              <div className="ctas">
                <a className="btn primary" href="#proyectos">Ver proyectos <span className="arr">→</span></a>
                {profile.cvUrl && (
                  <a className="btn" href={profile.cvUrl} target="_blank" rel="noopener">Descargar CV</a>
                )}
              </div>
            </div>
            {profile.photoUrl && (
              <figure className="portrait">
                <Logo className="mark" outline />
                <div className="frame">
                  <Image src={profile.photoUrl} alt={`Retrato de ${fullName}`} width={640} height={800} priority sizes="(max-width: 900px) 420px, 460px" />
                </div>
                <figcaption><span>{fullName}</span><span>{profile.photoCaption}</span></figcaption>
              </figure>
            )}
          </div>
          {stats.length > 0 && (
            <div className="wrap">
              <div className="stats" style={{ ["--n" as string]: Math.min(stats.length, 4) }}>
                {stats.map((s) => (
                  <div className="stat" key={s.id}><b>{s.value}</b><span>{s.label}</span></div>
                ))}
              </div>
            </div>
          )}
        </section>

        {profile.techStrip.length > 0 && (
          <div className="strip" aria-label="Tecnologías">
            <div className="track">
              {profile.techStrip.map((t) => <span key={t}>{t}</span>)}
              {profile.techStrip.map((t) => <span key={`${t}-dup`} aria-hidden="true">{t}</span>)}
            </div>
          </div>
        )}

        <section className="block" id="proyectos">
          <div className="wrap">
            <div className="head">
              <div>
                <span className="label">Proyectos seleccionados</span>
                <h2>Productos en producción, <span className="serif">con usuarios reales.</span></h2>
              </div>
            </div>
            <div className="projects">
              {projects.map((p) => {
                const metrics = metricsOf(p.metrics);
                const media = (
                  <>
                    {p.imageUrl ? (
                      <Image src={p.imageUrl} alt={p.imageAlt || `Captura de ${p.title}`} fill sizes="(max-width: 900px) 100vw, 680px" />
                    ) : (
                      <span className="empty" />
                    )}
                    {p.url && <span className="open" aria-hidden="true">↗</span>}
                  </>
                );
                return (
                  <article className="proj" key={p.id}>
                    {p.url ? (
                      <a className="media" href={p.url} target="_blank" rel="noopener" aria-label={`Abrir ${p.title}`}>{media}</a>
                    ) : (
                      <div className="media">{media}</div>
                    )}
                    <div className="info">
                      <div className="top">
                        <span className={p.status === "ARCHIVED" ? "state archived" : "state"}><i />{p.statusLabel}</span>
                        {p.period && <span className="idx">{p.period}</span>}
                      </div>
                      <h3>{p.title}</h3>
                      <p className="role">{p.role}</p>
                      <p className="desc">{p.summary}</p>
                      {p.highlights.length > 0 && (
                        <ul className="hl">{p.highlights.map((h, i) => <li key={i}>{h}</li>)}</ul>
                      )}
                      {metrics.length > 0 && (
                        <div className="kv">{metrics.map((m, i) => <div key={i}><b>{m.value}</b><span>{m.label}</span></div>)}</div>
                      )}
                      {p.tech.length > 0 && <div className="tags">{p.tech.map((t) => <span key={t}>{t}</span>)}</div>}
                      {p.url && (
                        <a className="link" href={p.url} target="_blank" rel="noopener">{p.linkLabel || p.url} ↗</a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {experience.length > 0 && (
          <section className="block" id="experiencia" style={{ paddingTop: 0 }}>
            <div className="wrap">
              <div className="head"><div><span className="label">Experiencia y formación</span><h2>Trayectoria</h2></div></div>
              <div className="xp">
                {experience.map((e) => (
                  <div className="row" key={e.id}>
                    <div className="when">{e.period}</div>
                    <div>
                      <h3>{e.title}{e.current && <span className="now">Actual</span>}</h3>
                      <div className="org">{e.org}</div>
                    </div>
                    <p>{e.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="block" id="perfil" style={{ paddingTop: 0 }}>
          <div className="wrap about">
            <div>
              <span className="label" style={{ display: "block", marginBottom: 24 }}>Perfil</span>
              <p className="quote"><Rich text={profile.aboutQuote} /></p>
              <p className="more">{profile.aboutText}</p>
            </div>
            {skills.length > 0 && (
              <dl className="skills">
                {skills.map((g) => (
                  <div key={g.id}><dt>{g.label}</dt><dd>{g.items.join(", ")}</dd></div>
                ))}
              </dl>
            )}
          </div>
        </section>
      </main>

      <section className="contact" id="contacto">
        <div className="glow" aria-hidden="true" />
        <Logo className="bigmark" outline />
        <div className="wrap">
          <span className="label">Contacto</span>
          <h2><Rich text={profile.contactTitle} /></h2>
          <div className="rows">
            <div className="ct">
              <span className="label">Correo</span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <CopyButton value={profile.email} />
            </div>
            {profile.linkedinUrl && (
              <div className="ct"><span className="label">LinkedIn</span><a href={profile.linkedinUrl} target="_blank" rel="noopener">{linkedinLabel} ↗</a></div>
            )}
            {profile.githubUrl && (
              <div className="ct"><span className="label">GitHub</span><a href={profile.githubUrl} target="_blank" rel="noopener">{profile.githubUrl.replace(/^https?:\/\/(www\.)?/, "")} ↗</a></div>
            )}
            {profile.cvUrl && (
              <div className="ct"><span className="label">CV</span><a href={profile.cvUrl} target="_blank" rel="noopener">Descargar PDF ↗</a></div>
            )}
          </div>
        </div>
      </section>
      <footer className="site-footer">
        <div className="wrap"><span>© {new Date().getFullYear()} {fullName}</span><span>Hecho con Next.js</span></div>
      </footer>
    </>
  );
}
