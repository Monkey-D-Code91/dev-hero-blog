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
        "Software Engineer & Tech Lead Frontend in TeamSystem. Architettura frontend in React e TypeScript, team distribuito tra Italia e Albania, piattaforma SaaS per il monitoraggio del roaming.",
    },
    nav: {
      home: "Home",
      about: "Chi sono",
      experience: "Esperienza",
      skills: "Competenze",
      contact: "Contatti",
      authors: "Autori",
      menu: "Menu",
      close: "Chiudi",
    },
    hero: {
      badge: "Tech Lead • Frontend & Telecomunicazioni",
      headline: "Ingegnere frontend e Tech Lead. Trasformo requisiti complessi in prodotti che funzionano.",
      subline:
        "Sono Marco Mariotti, Software Engineer & Tech Lead in TeamSystem. Guido un team distribuito tra Italia e Albania nello sviluppo di una piattaforma SaaS per il monitoraggio del traffico dati in roaming — prevenzione extracosti, alert automatici, blocchi in tempo reale. Mi occupo dell'architettura frontend in React e TypeScript e del percorso di crescita delle persone nel team.",
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
        articles: "Articoli pubblicati",
      },
    },
    experience: {
      heading: "Esperienza",
      lead: "Il percorso che mi ha portato a guidare prodotti e team.",
      items: [
        {
          period: "Ott 2024 – Oggi",
          role: "Software Engineer & Tech Lead Frontend",
          company: "TeamSystem",
          description:
            "A seguito dell'acquisizione di Habble, ho assunto la guida tecnica e formativa del team. Progetto nuovi moduli e feature, seguo la crescita delle persone e ottimizzo il workflow, mantenendo un ruolo attivo nello sviluppo quotidiano in React e TypeScript.",
        },
        {
          period: "Set 2022 – Set 2024",
          role: "Software Engineer",
          company: "Habble",
          description:
            "Sviluppo della piattaforma SaaS per il monitoraggio del traffico dati in roaming, in Java e React. Crescita verso l'architettura software e l'ottimizzazione di sistemi che processano grandi volumi di dati.",
        },
        {
          period: "Nov 2020 – Ago 2022",
          role: "Fullstack Software Engineer",
          company: "Reloc",
          description:
            "PoC su architetture serverless AWS e Azure per clienti in settori diversi: software per macchine elettromedicali, integrazione di servizi IoT per la smart home. Prima esperienza full stack con React, Redux e Python.",
        },
        {
          period: "Lug 2019 – Ott 2020",
          role: "Software Analyst",
          company: "Accenture Technology",
          description:
            "Sviluppo backend per un sistema di rilevamento e localizzazione in tempo reale delle perdite di gas sui gasdotti. Stack: Java, Apache Kafka, MongoDB. Contatto diretto con il cliente per la validazione delle soluzioni sviluppate.",
        },
      ],
    },
    skills: {
      heading: "Competenze",
      lead: "Ciò che porto in ogni progetto.",
      categories: [
        {
          title: "Tecnologie & Architettura",
          items: [
            "React, TypeScript",
            "Java",
            "Architetture serverless (AWS, Azure)",
            "SQL / NoSQL (MongoDB)",
            "Apache Kafka",
          ],
        },
        {
          title: "Leadership & Team",
          items: [
            "Gestione di team distribuiti",
            "Mentoring e crescita delle persone",
            "Technical leadership",
            "Scrum / Pianificazione Agile",
            "Code review",
          ],
        },
        {
          title: "Dominio — Telecom",
          items: [
            "Monitoraggio traffico dati in roaming",
            "Sistemi di alerting e automazione",
            "Prevenzione extracosti su sim aziendali",
            "Piattaforme SaaS B2B",
            "Elaborazione di grandi volumi di dati",
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
    landing: {
      meta: {
        title: "First Draft — Blog tech & AI",
        description:
          "Articoli su tecnologia, AI e crescita professionale — scritti da chi lavora nel settore.",
      },
      hero: {
        badge: "Tech, Humans & AI",
        headline: "Le idee al loro stato grezzo.",
        lead: "Articoli su tecnologia, AI e crescita delle persone, scritti da chi lavora nel settore. Visioni diverse su un mondo che cambia veloce.",
        ctaRead: "Inizia a leggere",
        ctaAuthors: "Gli autori",
      },
      recentPosts: {
        heading: "Ultimi articoli",
        cta: "Tutti gli articoli",
        empty: "Nessun articolo ancora pubblicato.",
      },
      authors: {
        heading: "Gli autori",
        viewProfile: "Vedi profilo",
      },
    },
    blog: {
      nav: "Blog",
      heading: "Blog",
      lead: "Pensiero critico in un mare di contenuti generati. Tech, human & AI.",
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
      byAuthor: "di",
      authorPostsHeading: (name: string) => `Articoli di ${name}`,
      authorPostsEmpty: "Nessun articolo ancora pubblicato.",
      authorCardHeading: "L'autore",
      authorsCardHeading: "Gli autori",
      authorCardProfile: "Vedi profilo completo",
      relatedHeading: "Articoli correlati",
      shareHeading: "Condividi",
      shareCopy: "Copia link",
      shareCopied: "Copiato!",
      upcomingHeading: "In arrivo",
      upcomingRoadmapCta: "Tutta la roadmap",
      rssCtaText: "Niente newsletter, niente algoritmi: i prossimi articoli arrivano via RSS.",
      rssCtaLabel: "Segui il feed",
    },
    roadmap: {
      nav: "Roadmap",
      eyebrow: "La roadmap in capitoli",
      heading: "Un blog che si legge come un romanzo",
      intro:
        "Ogni arco è un capitolo. Ti raccontiamo dove sta andando First Draft e perché, un articolo alla volta.",
      stats: { firstArc: "Arco I", pipeline: "In pipeline", signatures: "Firme" },
      status: {
        published: "Pubblicato",
        inProgress: "In lavorazione",
        planned: "In programma",
      },
      progressCaption: (done: number, total: number) =>
        `${done} di ${total} pubblicati`,
      progressAria: (numeral: string, done: number, total: number) =>
        `Arco ${numeral}: ${done} di ${total} tappe pubblicate`,
    },
  },

  en: {
    meta: {
      title: "Marco Mariotti — Software Engineer & Tech Lead",
      description:
        "Software Engineer & Tech Lead Frontend at TeamSystem. Frontend architecture in React and TypeScript, distributed team across Italy and Albania, SaaS platform for roaming data monitoring.",
    },
    nav: {
      home: "Home",
      about: "About",
      experience: "Experience",
      skills: "Skills",
      contact: "Contact",
      authors: "Authors",
      menu: "Menu",
      close: "Close",
    },
    hero: {
      badge: "Tech Lead • Frontend & Telecommunications",
      headline: "Frontend engineer and Tech Lead. I turn complex requirements into products that work.",
      subline:
        "I'm Marco Mariotti, Software Engineer & Tech Lead at TeamSystem. I lead a team across Italy and Albania building a SaaS platform for roaming data traffic monitoring — cost prevention, automated alerts, real-time traffic blocks. I handle frontend architecture in React and TypeScript and the growth of the people in the team.",
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
        articles: "Published articles",
      },
    },
    experience: {
      heading: "Experience",
      lead: "The path that led me to lead products and teams.",
      items: [
        {
          period: "Oct 2024 – Present",
          role: "Software Engineer & Tech Lead Frontend",
          company: "TeamSystem",
          description:
            "Following the acquisition of Habble, I took on technical and formative leadership of the team. I design new modules and features, support the growth of the people in the team and optimise the workflow, while remaining hands-on in daily development in React and TypeScript.",
        },
        {
          period: "Sep 2022 – Sep 2024",
          role: "Software Engineer",
          company: "Habble",
          description:
            "Development of the SaaS platform for roaming data traffic monitoring, in Java and React. Growth towards software architecture and optimisation of systems processing large data volumes.",
        },
        {
          period: "Nov 2020 – Aug 2022",
          role: "Fullstack Software Engineer",
          company: "Reloc",
          description:
            "PoC on serverless AWS and Azure architectures for clients across different sectors: software for medical devices, IoT service integration for smart home. First full-stack experience with React, Redux and Python.",
        },
        {
          period: "Jul 2019 – Oct 2020",
          role: "Software Analyst",
          company: "Accenture Technology",
          description:
            "Backend development for a real-time gas leak detection and localisation system on pipelines. Stack: Java, Apache Kafka, MongoDB. Direct client contact for solution validation.",
        },
      ],
    },
    skills: {
      heading: "Skills",
      lead: "What I bring to every project.",
      categories: [
        {
          title: "Technology & Architecture",
          items: [
            "React, TypeScript",
            "Java",
            "Serverless architectures (AWS, Azure)",
            "SQL / NoSQL (MongoDB)",
            "Apache Kafka",
          ],
        },
        {
          title: "Leadership & Team",
          items: [
            "Distributed team management",
            "Mentoring and growing people",
            "Technical leadership",
            "Scrum / Agile planning",
            "Code review",
          ],
        },
        {
          title: "Domain — Telecom",
          items: [
            "Roaming data traffic monitoring",
            "Alerting systems and automation",
            "SIM cost overrun prevention",
            "B2B SaaS platforms",
            "Large-scale data processing",
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
    landing: {
      meta: {
        title: "First Draft — Tech & AI Blog",
        description:
          "Articles on technology, AI and professional growth — written by people who work in the field.",
      },
      hero: {
        badge: "Tech, Humans & AI",
        headline: "Ideas in their raw state.",
        lead: "Articles on technology, AI and human growth, written by people in the field. Different perspectives on a fast-changing world.",
        ctaRead: "Start reading",
        ctaAuthors: "The authors",
      },
      recentPosts: {
        heading: "Recent articles",
        cta: "All articles",
        empty: "No articles published yet.",
      },
      authors: {
        heading: "Authors",
        viewProfile: "View profile",
      },
    },
    blog: {
      nav: "Blog",
      heading: "Blog",
      lead: "Critical thinking in a sea of generated content. Tech, human & AI.",
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
      byAuthor: "by",
      authorPostsHeading: (name: string) => `Articles by ${name}`,
      authorPostsEmpty: "No articles published yet.",
      authorCardHeading: "The author",
      authorsCardHeading: "The authors",
      authorCardProfile: "View full profile",
      relatedHeading: "Related articles",
      shareHeading: "Share",
      shareCopy: "Copy link",
      shareCopied: "Copied!",
      upcomingHeading: "Coming up",
      upcomingRoadmapCta: "Full roadmap",
      rssCtaText: "No newsletter, no algorithms: new essays arrive via RSS.",
      rssCtaLabel: "Follow the feed",
    },
    roadmap: {
      nav: "Roadmap",
      eyebrow: "The roadmap in chapters",
      heading: "A blog that reads like a novel",
      intro:
        "Each arc is a chapter. We tell you where First Draft is heading and why, one article at a time.",
      stats: { firstArc: "Arc I", pipeline: "In pipeline", signatures: "Bylines" },
      status: {
        published: "Published",
        inProgress: "In progress",
        planned: "Planned",
      },
      progressCaption: (done: number, total: number) =>
        `${done} of ${total} published`,
      progressAria: (numeral: string, done: number, total: number) =>
        `Arc ${numeral}: ${done} of ${total} stops published`,
    },
  },
} as const;
