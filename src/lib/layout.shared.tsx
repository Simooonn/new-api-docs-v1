import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { i18n } from '@/lib/i18n';
import Image from 'next/image';
import type { LinkItemType } from 'fumadocs-ui/layouts/docs';

const CONSOLE_BASE = 'https://www.acetoken.top';

const externalNavLabels: Record<
  string,
  { home: string; console: string; pricing: string }
> = {
  zh: {
    home: '主页',
    console: '控制台',
    pricing: '模型广场',
  },
  en: {
    home: 'Home',
    console: 'Console',
    pricing: 'Model Plaza',
  },
  ja: {
    home: 'ホーム',
    console: 'コンソール',
    pricing: 'モデル広場',
  },
};

/** Top-nav links back to the main Ace Hub site. */
export function getExternalNavLinks(locale: string): LinkItemType[] {
  const labels = externalNavLabels[locale] ?? externalNavLabels.en;

  return [
    {
      text: labels.home,
      url: `${CONSOLE_BASE}/`,
      external: true,
      active: 'none',
    },
    {
      text: labels.console,
      url: `${CONSOLE_BASE}/dashboard/overview`,
      external: true,
      active: 'none',
    },
    {
      text: labels.pricing,
      url: `${CONSOLE_BASE}/pricing`,
      external: true,
      active: 'none',
    },
  ];
}

/** @deprecated Prefer getExternalNavLinks(locale). Kept for icon-only slots. */
export const linkItems: LinkItemType[] = [];

export const logo = (
  <Image
    alt="Ace Hub"
    src="/assets/logo-512.png"
    width={40}
    height={40}
    className="size-10"
    priority
    unoptimized
  />
);

export function baseOptions(locale: string): BaseLayoutProps {
  return {
    i18n,
    nav: {
      title: (
        <>
          {logo}
          <span className="font-medium in-[header]:text-[15px] [.uwu_&]:hidden">
            Ace Hub
          </span>
        </>
      ),
    },
    links: getExternalNavLinks(locale),
  };
}
