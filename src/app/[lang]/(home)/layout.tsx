import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { baseOptions, linkItems } from '@/lib/layout.shared';
import {
  NavbarMenu,
  NavbarMenuContent,
  NavbarMenuLink,
  NavbarMenuTrigger,
} from 'fumadocs-ui/layouts/home/navbar';
import { Footer } from '@/components/footer';
import Link from 'fumadocs-core/link';
import {
  HelpCircle,
  Sparkles,
  BookOpen,
  type LucideIcon,
} from 'lucide-react';
import { getLocalePath } from '@/lib/i18n';

// Navigation items configuration
const NAV_ITEMS = [
  { key: 'api', icon: BookOpen, path: '/api' },
  { key: 'apps', icon: Sparkles, path: '/apps' },
  { key: 'support', icon: HelpCircle, path: '/support' },
] as const;

// Internationalization text
const i18nText: Record<
  string,
  Record<string, { text: string; desc: string }>
> = {
  en: {
    title: { text: 'Documentation', desc: '' },
    support: { text: 'Help & Support', desc: 'FAQ and community support.' },
    api: {
      text: 'API Reference',
      desc: 'Complete API documentation and reference.',
    },
    apps: {
      text: 'AI Applications',
      desc: 'Integration guides for AI applications.',
    },
  },
  zh: {
    title: { text: '文档', desc: '' },
    support: { text: '帮助支持', desc: '常见问题和社区支持。' },
    api: { text: 'API 参考', desc: '完整的 API 文档和参考指南。' },
    apps: { text: 'AI 应用', desc: 'AI 应用集成指南。' },
  },
  ja: {
    title: { text: 'ドキュメント', desc: '' },
    support: {
      text: 'ヘルプ＆サポート',
      desc: 'よくある質問とコミュニティサポート。',
    },
    api: {
      text: 'API リファレンス',
      desc: '完全な API ドキュメントとリファレンス。',
    },
    apps: {
      text: 'AI アプリケーション',
      desc: 'AI アプリケーション統合ガイド。',
    },
  },
};

// Get localized text
const getTexts = (lang: string) => i18nText[lang] || i18nText.en;

// Build navigation items
const buildNavItems = (lang: string, docsUrl: string) => {
  const texts = getTexts(lang);
  return NAV_ITEMS.map(({ key, icon: Icon, path }) => ({
    text: texts[key].text,
    desc: texts[key].desc,
    url: `${docsUrl}${path}`,
    Icon,
  }));
};

// Menu link item component
function MenuLinkItem({
  item,
  className,
}: {
  item?: { text: string; desc: string; url: string; Icon: LucideIcon };
  className?: string;
}) {
  if (!item) return null;
  const { Icon, text, desc, url } = item;
  return (
    <NavbarMenuLink href={url} className={className}>
      <Icon className="bg-fd-primary text-fd-primary-foreground mb-2 rounded-md p-1" />
      <p className="font-medium">{text}</p>
      <p className="text-fd-muted-foreground text-sm">{desc}</p>
    </NavbarMenuLink>
  );
}

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: React.ReactNode;
}) {
  const { lang } = await params;
  const texts = getTexts(lang);
  const docsUrl = getLocalePath(lang, 'docs');
  const navItems = buildNavItems(lang, docsUrl);

  return (
    <div className="flex min-h-screen flex-col">
      <HomeLayout
        {...baseOptions(lang)}
        links={[
          // Mobile menu
          {
            type: 'menu',
            on: 'menu',
            text: texts.title.text,
            items: navItems.map(({ text, url, Icon }) => ({
              text,
              url,
              icon: <Icon />,
            })),
          },
          // Desktop navigation
          {
            type: 'custom',
            on: 'nav',
            children: (
              <NavbarMenu>
                <NavbarMenuTrigger>
                  <Link href={`${docsUrl}/api`}>{texts.title.text}</Link>
                </NavbarMenuTrigger>
                <NavbarMenuContent className="text-[15px]">
                  {navItems.map((item) => (
                    <MenuLinkItem key={item.url} item={item} />
                  ))}
                </NavbarMenuContent>
              </NavbarMenu>
            ),
          },
          ...linkItems,
        ]}
        className="flex-1 dark:bg-neutral-950 dark:[--color-fd-background:var(--color-neutral-950)]"
      >
        {children}
      </HomeLayout>
      <Footer lang={lang} />
    </div>
  );
}
