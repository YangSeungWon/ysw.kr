import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import PageTitle from '@/components/PageTitle';
import { SPACING, FONT_SIZES } from '@/constants/typography';
import styles from './misc.module.css';

type Kind = 'extension' | 'web' | 'app' | 'game';

interface Project {
  /** Display name */
  name: string;
  /** One line, no period */
  blurb: string;
  /** Primary destination — where the title click goes */
  url: string;
  kind: Kind;
  /** Optional — omit if unknown */
  year?: string;
  /** Emoji, or an image URL when `iconIsImage` */
  icon: string;
  iconIsImage?: boolean;
  /** Banner tint for featured cards */
  color?: string;
  /** Featured projects get a full card; everything else is a one-liner */
  featured?: boolean;
  /** Optional banner screenshot, replaces the gradient (featured only) */
  image?: string;
  /** Extra links shown as pills (featured only) */
  links?: Array<{ label: string; url: string }>;
  /** Shown as a small icon on minor rows, and as a pill on featured cards */
  repo?: string;
}

/**
 * Adding a project is meant to be cheap: name / blurb / url / kind / icon is
 * enough (year and repo are optional). Add `featured: true` (plus `color` and
 * any extra `links`) only for the ones worth a big card.
 */
const projects: Project[] = [
  {
    name: 'Polis Korea',
    blurb:
      'Korean election results visualized with hex cartograms and geo maps, aligned to each era’s administrative boundaries',
    url: 'https://polis.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F5F3}️',
    color: '#1E3A8A',
    featured: true,
    repo: 'https://github.com/YangSeungWon/polis-korea',
  },
  {
    name: 'Voca Web',
    blurb: 'Vocabulary learning platform pairing a browser extension with a web app',
    url: 'https://voca.ysw.kr',
    kind: 'extension',
    year: '2024',
    icon: '\u{1F4DA}',
    color: '#4A90E2',
    featured: true,
    links: [
      { label: 'About', url: '/misc/voca-web' },
      {
        label: 'Chrome',
        url: 'https://chromewebstore.google.com/detail/voca-web-vocabulary-build/ajflgkmapedegaokdcmpdepepmchfbeo',
      },
      { label: 'Firefox', url: 'https://addons.mozilla.org/ko/firefox/addon/voca-web/' },
    ],
    repo: 'https://github.com/YangSeungWon/voca-web',
  },
  {
    name: 'Ohnit',
    blurb: 'Couple messenger that automatically matches similar daily photos using AI',
    url: 'https://ohn.it.kr',
    kind: 'app',
    year: '2025',
    icon: 'https://ohn.it.kr/favicon.ico',
    iconIsImage: true,
    color: '#FF6B6B',
    featured: true,
    links: [
      {
        label: 'App Store',
        url: 'https://apps.apple.com/kr/app/%EC%98%A8%EC%9E%87-%EC%9D%BC%EC%83%81%EC%9D%84-%EC%9E%87%EB%8B%A4/id6749170363',
      },
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=kr.it.ohn' },
    ],
  },

  // --- lighter entries ---
  {
    name: 'Submission Check',
    blurb: 'Scans a paper PDF for anonymity leaks, format and font issues',
    url: 'https://submit.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F4C4}',
    repo: 'https://github.com/YangSeungWon/pdf-submit-checker',
  },
  {
    name: 'Claudish Checker',
    blurb: 'Finds Claude-flavoured sentences in a paper draft',
    url: 'https://claudish.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F916}',
    repo: 'https://github.com/YangSeungWon/pdf-claudish-checker',
  },
  {
    name: 'Reference DOI Checker',
    blurb: "Verifies a paper's references against official DOI metadata",
    url: 'https://refs.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F517}',
    repo: 'https://github.com/YangSeungWon/pdf-doi-checker',
  },
  {
    name: 'POSTECH Shuttle',
    blurb: 'Live shuttle map with routes, stops and a next-bus countdown',
    url: 'https://bus.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F68C}',
    repo: 'https://github.com/YangSeungWon/postech-shuttle',
  },
  {
    name: 'Project Dugout',
    blurb: 'Baseball GM sim where true ability is never revealed',
    url: 'https://baseball.ysw.kr',
    kind: 'game',
    year: '2026',
    icon: '\u26BE',
    repo: 'https://github.com/YangSeungWon/baseball-manager',
  },
  {
    name: 'Rack Planner',
    blurb: 'Week-by-week cage rack layout editor with Excel and image export',
    url: 'https://rack.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F5C4}\uFE0F',
    repo: 'https://github.com/YangSeungWon/rack-planner',
  },
  {
    name: 'Sigun Typing',
    blurb: 'Typing practice on a map \u2014 name each district to fill it in',
    url: 'https://sigun-typing.ysw.kr',
    kind: 'game',
    year: '2026',
    icon: '\u2328\uFE0F',
    repo: 'https://github.com/YangSeungWon/sigun-typing',
  },
  {
    name: 'Tarot',
    blurb: 'Free Rider-Waite draws with upright and reversed readings',
    url: 'https://tarot.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F52E}',
    repo: 'https://github.com/YangSeungWon/tarot',
  },
  {
    name: '36 Questions',
    blurb: 'The Fast Friends closeness questionnaire, in Korean and English',
    url: 'https://friends.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F91D}',
    repo: 'https://github.com/YangSeungWon/fast-friends',
  },
  {
    name: 'Korea via Data',
    blurb: 'Interactive views of Korean public datasets',
    url: 'https://kvd.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F4CA}',
    repo: 'https://github.com/YangSeungWon/korea-via-data',
  },
  {
    name: 'MMM',
    blurb: 'Quirky facts and trivia',
    url: 'https://mmm.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F9E0}',
  },
  {
    name: 'Quiz Korea',
    blurb: 'Map quiz for learning Korean provinces and districts',
    url: 'https://quiz-korea.ysw.kr',
    kind: 'web',
    year: '2025',
    icon: '\u{1F5FA}\uFE0F',
    repo: 'https://github.com/YangSeungWon/quiz-korea',
  },
  {
    name: 'Lotto 6/45 Stats',
    blurb: 'Draw statistics, past winning numbers and a number generator',
    url: 'https://lotto.ysw.kr',
    kind: 'web',
    year: '2025',
    icon: '\u{1F3B1}',
    repo: 'https://github.com/YangSeungWon/lotto',
  },
  {
    name: 'Naver Cafe Extractor',
    blurb: 'Extracts Naver Cafe posts and comments as JSON',
    url: 'https://chromewebstore.google.com/detail/%EB%84%A4%EC%9D%B4%EB%B2%84-%EC%B9%B4%ED%8E%98-%EB%8C%93%EA%B8%80-%EC%B6%94%EC%B6%9C%EA%B8%B0/hkehmkenhldahnonfaecaflemnpdihjg',
    kind: 'extension',
    year: '2025',
    icon: '\u{1F4AC}',
    repo: 'https://github.com/YangSeungWon/naver-cafe-comments-extract',
  },
  {
    name: 'Lime Game',
    blurb: 'Fruit Box puzzle clone, playable in the browser',
    url: 'https://li.me.kr',
    kind: 'game',
    year: '2025',
    icon: '\u{1F34B}',
    repo: 'https://github.com/YangSeungWon/lime-game',
  },
  {
    name: 'Survival Game',
    blurb: 'Web survival game built around upgrades and resource management',
    url: 'https://survival.game.ysw.kr',
    kind: 'game',
    year: '2024',
    icon: '\u{1F3D5}\uFE0F',
    repo: 'https://github.com/YangSeungWon/survival-game',
  },
  {
    name: 'Jack of All Trades Simulator',
    blurb: 'League of Legends item stat builder',
    url: 'https://lol.ysw.kr',
    kind: 'web',
    year: '2024',
    icon: '\u2694\uFE0F',
    repo: 'https://github.com/YangSeungWon/simulator-jack-of-all-trades-league-of-legends',
  },
  {
    name: 'YOWO',
    blurb: 'Blurs YouTube videos you have already watched, so you only watch once',
    url: 'https://chromewebstore.google.com/detail/you-only-watch-once-yowo/licbbogphmmjlffefkigjenihlogehgc',
    kind: 'extension',
    year: '2024',
    icon: '\u{1F4FA}',
    repo: 'https://github.com/YangSeungWon/you-only-watch-once',
  },
];

const KIND_LABEL: Record<Kind, string> = {
  extension: 'extension',
  web: 'web',
  app: 'app',
  game: 'game',
};

const isExternal = (url: string) => /^https?:\/\//.test(url);

const ExternalArrow: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    aria-hidden="true"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="8 7 17 7 17 16" />
  </svg>
);

const GitHubMark: React.FC = () => (
  <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const FeaturedCard: React.FC<{ project: Project }> = ({ project }) => {
  const accent = project.color ?? 'var(--ifm-color-primary)';
  const pills = [
    ...(project.links ?? []),
    ...(project.repo ? [{ label: 'GitHub', url: project.repo }] : []),
  ];

  return (
    <article className={styles.card} style={{ marginBottom: SPACING.MD }}>
      <div
        className={styles.banner}
        style={
          project.image
            ? { padding: 0 }
            : {
                background: `linear-gradient(135deg, ${accent} 0%, color-mix(in srgb, ${accent} 62%, #000) 100%)`,
              }
        }
      >
        {project.image ? (
          <img className={styles.bannerImage} src={project.image} alt="" />
        ) : project.iconIsImage ? (
          <img className={styles.bannerIconImage} src={project.icon} alt="" />
        ) : (
          <span className={styles.bannerIcon}>{project.icon}</span>
        )}
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardHead}>
          <h3 className={styles.cardTitle}>
            <Link className={styles.stretch} to={project.url}>
              {project.name}
            </Link>
          </h3>
          <span className={styles.kind}>{KIND_LABEL[project.kind]}</span>
          {project.year && (
            <span className={styles.year} style={{ marginLeft: 'auto' }}>
              {project.year}
            </span>
          )}
        </div>

        <p className={styles.cardDesc}>{project.blurb}</p>

        {pills.length > 0 && (
          <div className={styles.pills}>
            {pills.map((link) => (
              <Link key={link.url} className={styles.pill} to={link.url}>
                {link.label}
                {isExternal(link.url) && <ExternalArrow />}
              </Link>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

const MinorRow: React.FC<{ project: Project }> = ({ project }) => (
  <div className={styles.row}>
    <span className={styles.rowIcon}>
      {project.iconIsImage ? (
        <img className={styles.rowIconImage} src={project.icon} alt="" />
      ) : (
        project.icon
      )}
    </span>
    <Link className={`${styles.rowName} ${styles.stretch}`} to={project.url}>
      {project.name}
    </Link>
    <span className={styles.rowBlurb}>{project.blurb}</span>
    <span className={styles.rowMeta}>
      <span className={styles.kind}>{KIND_LABEL[project.kind]}</span>
      {project.year && <span className={styles.year}>{project.year}</span>}
      {project.repo ? (
        <Link
          className={styles.rowRepo}
          to={project.repo}
          aria-label={`${project.name} on GitHub`}
        >
          <GitHubMark />
        </Link>
      ) : (
        <span className={styles.rowRepoSlot} />
      )}
      <ExternalArrow className={styles.arrow} />
    </span>
  </div>
);

const Misc: React.FC = () => {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);

  return (
    <Layout title="Misc Projects" description="Side projects built out of curiosity">
      <div className="container margin-vert--lg">
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: SPACING.XL }}>
            <PageTitle>Side Projects</PageTitle>
            <p
              style={{
                fontSize: FONT_SIZES.BASE,
                color: 'var(--ifm-color-emphasis-700)',
                maxWidth: '500px',
                margin: '0 auto',
              }}
            >
              A collection of projects built out of curiosity and passion
            </p>
          </div>

          <section style={{ marginBottom: SPACING.XL }}>
            {featured.map((project) => (
              <FeaturedCard key={project.name} project={project} />
            ))}
          </section>

          <section>
            <h2 className={styles.sectionLabel}>Also built</h2>
            {rest.map((project) => (
              <MinorRow key={project.name} project={project} />
            ))}
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Misc;
