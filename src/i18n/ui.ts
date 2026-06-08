/**
 * Dizionari di traduzione — unica fonte di verità per i testi del sito.
 * Ogni lingua ha la stessa struttura. I componenti ricevono `lang`
 * e accedono ai testi con t.<sezione>.<campo>.
 *
 * >>> I testi sono placeholder professionali: rivedili/personalizzali. <<<
 */
export const languages = {
  it: "Italiano",
  en: "English",
} as const;

export const defaultLang = "it";
export type Lang = keyof typeof languages;

export const ui = {
  it: {
    meta: {
      title: "Marco Mariotti — Software Engineer & Tech Lead",
      description:
        "Ingegnere del software e Tech Lead specializzato in sistemi di monitoraggio per le telecomunicazioni. Guido un team distribuito tra Italia e Albania nello sviluppo di prodotti complessi.",
    },
    nav: {
      about: "Chi sono",
      experience: "Esperienza",
      skills: "Competenze",
      contact: "Contatti",
      menu: "Menu",
      close: "Chiudi",
    },
    hero: {
      badge: "Tech Lead • Telecomunicazioni",
      headline: "Costruisco sistemi software complessi e guido i team che li rendono possibili.",
      subline:
        "Sono Marco Mariotti, ingegnere del software e Tech Lead. Ogni giorno coordino un team tra Italia e Albania nello sviluppo di una piattaforma per il monitoraggio del traffico dati che aiuta a tenere sotto controllo i costi del roaming.",
      ctaPrimary: "Contattami",
      ctaSecondary: "Scopri di più",
    },
    about: {
      heading: "Chi sono",
      lead: "Tecnica e leadership, nello stesso ruolo.",
      paragraphs: [
        "Sono un ingegnere del software specializzato nella progettazione e nello sviluppo di sistemi complessi per le telecomunicazioni aziendali. Guido un team distribuito tra Italia e Albania nello sviluppo di una piattaforma SaaS usata da aziende e operatori telecom per monitorare il traffico dati in roaming delle proprie sim, prevenire extracosti con alert automatici e blocchi di navigazione in tempo reale.",
        "Unisco competenza tecnica e gestione delle persone: traduco requisiti complessi in architetture solide, faccio crescere il team con mentoring e code review, e mantengo allineati persone, processi e obiettivi attraverso lingue e culture diverse.",
      ],
      stats: {
        years: "Anni di esperienza",
        teamSize: "Persone nel team",
        countries: "Paesi coordinati",
      },
    },
    experience: {
      heading: "Esperienza",
      lead: "Il percorso che mi ha portato a guidare prodotti e team.",
      // TODO: sostituisci con le tue esperienze reali (ruolo, azienda, periodo, descrizione).
      items: [
        {
          period: "Oggi",
          role: "Software Engineer & Tech Lead",
          company: "Azienda / Prodotto",
          description:
            "Guido lo sviluppo di una piattaforma di monitoraggio del traffico dati per le telecomunicazioni e coordino un team distribuito tra Italia e Albania, dall'architettura alla consegna.",
        },
        {
          period: "Periodo",
          role: "Ruolo precedente",
          company: "Azienda",
          description:
            "Descrizione sintetica delle responsabilità e dei risultati raggiunti in questo ruolo.",
        },
        {
          period: "Periodo",
          role: "Ruolo iniziale",
          company: "Azienda",
          description:
            "Descrizione sintetica delle responsabilità e dei risultati raggiunti in questo ruolo.",
        },
      ],
    },
    skills: {
      heading: "Competenze",
      lead: "Ciò che porto in ogni progetto.",
      // TODO: adatta gli elenchi alle tue competenze effettive.
      categories: [
        {
          title: "Tecnologie & Architettura",
          items: [
            "Architetture distribuite & microservizi",
            "API e sistemi real-time",
            "Cloud & containerizzazione",
            "Database SQL / NoSQL",
            "CI/CD e qualità del codice",
          ],
        },
        {
          title: "Leadership & Team",
          items: [
            "Gestione di team distribuiti",
            "Mentoring e crescita delle persone",
            "Pianificazione Agile",
            "Comunicazione cross-culturale",
            "Allineamento tra stakeholder",
          ],
        },
        {
          title: "Dominio — Telecom",
          items: [
            "Monitoraggio delle telecomunicazioni",
            "Analisi del traffico dati in roaming",
            "Ottimizzazione e controllo dei costi",
            "Data pipeline su larga scala",
            "Affidabilità dei sistemi",
          ],
        },
      ],
    },
    contact: {
      heading: "Lavoriamo insieme",
      lead: "Sei interessato al mio lavoro o vuoi semplicemente entrare in contatto? Mi trovi su LinkedIn.",
      cta: "Connettiti su LinkedIn",
    },
    footer: {
      rights: "Tutti i diritti riservati.",
      builtWith: "Realizzato con Astro, React e Tailwind CSS.",
    },
    langSwitch: {
      label: "Cambia lingua",
      toEn: "English",
      toIt: "Italiano",
    },
    blog: {
      nav: "Blog",
      heading: "Blog",
      lead: "Riflessioni su ingegneria del software, leadership e telecomunicazioni.",
      readingTime: "min di lettura",
      publishedOn: "Pubblicato il",
      updatedOn: "Aggiornato il",
      tags: "Tag",
      allPosts: "Tutti gli articoli",
      backToBlog: "Torna al blog",
      noArticles: "Nessun articolo ancora pubblicato.",
      commentsHeading: "Commenti",
      commentsPlaceholder: "I commenti saranno disponibili dopo la configurazione di Giscus.",
      tagHeading: (tag: string) => `Articoli con tag: ${tag}`,
    },
  },

  en: {
    meta: {
      title: "Marco Mariotti — Software Engineer & Tech Lead",
      description:
        "Software engineer and Tech Lead specialised in telecom monitoring systems. I lead a team across Italy and Albania building complex products.",
    },
    nav: {
      about: "About",
      experience: "Experience",
      skills: "Skills",
      contact: "Contact",
      menu: "Menu",
      close: "Close",
    },
    hero: {
      badge: "Tech Lead • Telecommunications",
      headline: "I build complex software systems and lead the teams that make them happen.",
      subline:
        "I'm Marco Mariotti, a software engineer and Tech Lead. Every day I coordinate a team across Italy and Albania building a data-traffic monitoring platform that helps keep roaming costs under control.",
      ctaPrimary: "Get in touch",
      ctaSecondary: "Learn more",
    },
    about: {
      heading: "About",
      lead: "Engineering and leadership, in the same role.",
      paragraphs: [
        "I'm a software engineer specialised in designing and building complex systems for enterprise telecommunications. I lead a team across Italy and Albania developing a SaaS platform used by companies and telecom operators to monitor roaming data usage across their SIM cards, prevent extra costs through automated alerts and real-time traffic blocks.",
        "I combine technical depth with people management: I turn complex requirements into solid architectures, grow the team through mentoring and code reviews, and keep people, processes and goals aligned across languages and cultures.",
      ],
      stats: {
        years: "Years of experience",
        teamSize: "People in the team",
        countries: "Countries coordinated",
      },
    },
    experience: {
      heading: "Experience",
      lead: "The path that led me to lead products and teams.",
      // TODO: replace with your real experience (role, company, period, description).
      items: [
        {
          period: "Now",
          role: "Software Engineer & Tech Lead",
          company: "Company / Product",
          description:
            "I lead the development of a telecom data-traffic monitoring platform and coordinate a team across Italy and Albania, from architecture to delivery.",
        },
        {
          period: "Period",
          role: "Previous role",
          company: "Company",
          description:
            "A short summary of the responsibilities and results achieved in this role.",
        },
        {
          period: "Period",
          role: "Early role",
          company: "Company",
          description:
            "A short summary of the responsibilities and results achieved in this role.",
        },
      ],
    },
    skills: {
      heading: "Skills",
      lead: "What I bring to every project.",
      // TODO: tailor the lists to your actual skills.
      categories: [
        {
          title: "Technology & Architecture",
          items: [
            "Distributed architectures & microservices",
            "APIs and real-time systems",
            "Cloud & containerisation",
            "SQL / NoSQL databases",
            "CI/CD and code quality",
          ],
        },
        {
          title: "Leadership & Team",
          items: [
            "Leading distributed teams",
            "Mentoring and growing people",
            "Agile planning",
            "Cross-cultural communication",
            "Stakeholder alignment",
          ],
        },
        {
          title: "Domain — Telecom",
          items: [
            "Telecommunications monitoring",
            "Roaming data-traffic analysis",
            "Cost optimisation & control",
            "Large-scale data pipelines",
            "System reliability",
          ],
        },
      ],
    },
    contact: {
      heading: "Let's work together",
      lead: "Interested in my work, or just want to connect? You'll find me on LinkedIn.",
      cta: "Connect on LinkedIn",
    },
    footer: {
      rights: "All rights reserved.",
      builtWith: "Built with Astro, React and Tailwind CSS.",
    },
    langSwitch: {
      label: "Switch language",
      toEn: "English",
      toIt: "Italiano",
    },
    blog: {
      nav: "Blog",
      heading: "Blog",
      lead: "Thoughts on software engineering, leadership and telecommunications.",
      readingTime: "min read",
      publishedOn: "Published on",
      updatedOn: "Updated on",
      tags: "Tags",
      allPosts: "All articles",
      backToBlog: "Back to blog",
      noArticles: "No articles published yet.",
      commentsHeading: "Comments",
      commentsPlaceholder: "Comments will be available once Giscus is configured.",
      tagHeading: (tag: string) => `Articles tagged: ${tag}`,
    },
  },
} as const;
