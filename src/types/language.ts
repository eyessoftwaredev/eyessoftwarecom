export type Language = 'en' | 'tr';

export interface Translation {
  en: string;
  tr: string;
}

export interface Translations {
  nav: {
    home: Translation;
    services: Translation;
    portfolio: Translation;
    about: Translation;
    contact: Translation;
  };
  hero: {
    title: Translation;
    subtitle: Translation;
    cta: Translation;
  };
  stats: {
    projects: Translation;
    clients: Translation;
    solutions: Translation;
    experience: Translation;
  };
  services: {
    title: Translation;
    items: {
      website: {
        title: Translation;
        description: Translation;
      };
      mobile: {
        title: Translation;
        description: Translation;
      };
      software: {
        title: Translation;
        description: Translation;
      };
      uiux: {
        title: Translation;
        description: Translation;
      };
    };
  };
  portfolio: {
    title: Translation;
    viewProject: Translation;
  };
  about: {
    title: Translation;
    description: Translation;
  };
  testimonials: {
    title: Translation;
  };
  contact: {
    title: Translation;
    form: {
      name: Translation;
      email: Translation;
      message: Translation;
      submit: Translation;
    };
  };
  footer: {
    copyright: Translation;
    quickLinks: Translation;
  };
}