import Link from 'next/link';
import { getLocalePath } from '@/lib/i18n';

interface FooterProps {
  lang: string;
}

// ============================================
// Shared Icons (Official SVG paths from Simple Icons)
// ============================================
const DockerIcon = (
  <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="size-4">
    <path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185zm-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.186zm0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.887c0 .102.082.185.185.186zm-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.887c0 .102.083.185.185.186zm-2.964 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.136a.186.186 0 0 0-.186.185v1.887c0 .102.084.185.186.186zm5.893 2.715h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185zm-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185zm-2.964 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.185-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185zm-2.92 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.186.186 0 0 0-.185.185v1.888c0 .102.084.185.185.185zM23.763 9.89c-.065-.051-.672-.51-1.954-.51-.338.001-.676.03-1.01.087-.248-1.7-1.653-2.53-1.716-2.566l-.344-.199-.226.327c-.284.438-.49.922-.612 1.43-.23.97-.09 1.882.403 2.661-.595.332-1.55.413-1.744.42H.751a.751.751 0 0 0-.75.748 11.376 11.376 0 0 0 .692 4.062c.545 1.428 1.355 2.48 2.41 3.124 1.18.723 3.1 1.137 5.275 1.137.983.003 1.963-.086 2.93-.266a12.248 12.248 0 0 0 3.823-1.389c.98-.567 1.86-1.288 2.61-2.136 1.252-1.418 1.998-2.997 2.553-4.4h.221c1.372 0 2.215-.549 2.68-1.009.309-.293.55-.65.707-1.046l.098-.288z" />
  </svg>
);

// ============================================
// Shared Data (same across all languages)
// ============================================
const socialLinks: { name: string; href: string; icon: React.ReactNode }[] = [
  {
    name: 'Docker',
    href: 'https://hub.docker.com/r/calciumion/new-api',
    icon: DockerIcon,
  },
];

// ============================================
// Internal link paths (only labels need translation)
// ============================================
const internalPaths = {
  aboutProject: 'docs/guide/wiki/basic-concepts/project-introduction',
  features: 'docs/guide/wiki/basic-concepts/features-introduction',
  installation: 'docs/installation',
  userGuide: 'docs/guide/home',
  apiDocs: 'docs/api',
} as const;

// ============================================
// Translations (only text that differs by language)
// ============================================
interface FooterTranslation {
  sections: {
    about: {
      title: string;
      aboutProject: string;
      features: string;
    };
    docs: {
      title: string;
      installation: string;
      userGuide: string;
      apiDocs: string;
    };
  };
  copyright: string;
}

const translations: Record<string, FooterTranslation> = {
  zh: {
    sections: {
      about: {
        title: '关于我们',
        aboutProject: '关于项目',
        features: '功能特性',
      },
      docs: {
        title: '文档',
        installation: '安装部署',
        userGuide: '使用指南',
        apiDocs: 'API 文档',
      },
    },
    copyright: '© 2025 锟腾科技. All Rights Reserved.',
  },
  en: {
    sections: {
      about: {
        title: 'About Us',
        aboutProject: 'About Project',
        features: 'Features',
      },
      docs: {
        title: 'Docs',
        installation: 'Installation',
        userGuide: 'User Guide',
        apiDocs: 'API Docs',
      },
    },
    copyright: '© 2025 QuantumNous. All Rights Reserved.',
  },
  ja: {
    sections: {
      about: {
        title: '私たちについて',
        aboutProject: 'プロジェクトについて',
        features: '機能',
      },
      docs: {
        title: 'ドキュメント',
        installation: 'インストール',
        userGuide: 'ユーザーガイド',
        apiDocs: 'APIドキュメント',
      },
    },
    copyright: '© 2025 QuantumNous. All Rights Reserved.',
  },
};

// ============================================
// Build sections from translations
// ============================================
function buildSections(t: FooterTranslation) {
  return [
    {
      title: t.sections.about.title,
      links: [
        {
          label: t.sections.about.aboutProject,
          href: internalPaths.aboutProject,
        },
        { label: t.sections.about.features, href: internalPaths.features },
      ],
    },
    {
      title: t.sections.docs.title,
      links: [
        {
          label: t.sections.docs.installation,
          href: internalPaths.installation,
        },
        { label: t.sections.docs.userGuide, href: internalPaths.userGuide },
        { label: t.sections.docs.apiDocs, href: internalPaths.apiDocs },
      ],
    },
  ];
}

// ============================================
// Footer Component
// ============================================
export function Footer({ lang }: FooterProps) {
  const t = translations[lang] || translations.en;
  const sections = buildSections(t);

  return (
    <footer className="border-fd-border bg-fd-card/30 mt-auto border-t backdrop-blur-sm">
      <div className="mx-auto max-w-[1400px] px-6 py-12">
        {/* Top: Links Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 pb-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-12">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-fd-foreground mb-4 text-sm font-semibold">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-fd-muted-foreground hover:text-fd-foreground text-sm transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={getLocalePath(lang, link.href)}
                        className="text-fd-muted-foreground hover:text-fd-foreground text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom: Copyright and Social */}
        <div className="border-fd-border flex flex-col items-start justify-between gap-4 border-t pt-8 sm:flex-row sm:items-center">
          {/* Left: Copyright */}
          <div className="text-fd-muted-foreground flex flex-col gap-2 text-xs">
            <p>{t.copyright}</p>
          </div>

          {/* Right: Social Icons */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => {
              const isExternal = social.href.startsWith('http');
              const Component = isExternal ? 'a' : Link;
              return (
                <Component
                  key={social.name}
                  href={
                    isExternal ? social.href : getLocalePath(lang, social.href)
                  }
                  {...(isExternal && {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                  })}
                  className="text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </Component>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
