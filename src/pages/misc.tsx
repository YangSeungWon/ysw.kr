import React from 'react';
import Layout from '@theme/Layout';
import Link from '@/components/SiteLink';
import plain from '@/components/PlainPage.module.css';
import styles from './misc.module.css';

const projectGroups = [
  { id: 'selected', title: 'Selected projects' },
  { id: 'research', title: 'Research & Writing' },
  { id: 'everyday', title: 'Everyday Apps' },
  { id: 'data', title: 'Data & Learning' },
  { id: 'games', title: 'Games & Extensions' },
] as const;

type ProjectGroup = typeof projectGroups[number]['id'];

type Kind = 'extension' | 'web' | 'app' | 'game';

interface Project {
  /** Display name */
  name: string;
  /** One line, no period */
  blurb: string;
  /** Primary destination — where the title click goes */
  url: string;
  kind: Kind;
  group: ProjectGroup;
  /** Optional — omit if unknown */
  year?: string;
  /** Emoji, or an image URL when `iconIsImage` */
  icon: string;
  iconIsImage?: boolean;
  /** Additional destinations such as app stores */
  links?: Array<{ label: string; url: string }>;
  /** Public source repository, when available */
  repo?: string;
}

const projects: Project[] = [
  {
    name: 'Polis Korea',
    group: 'selected',
    blurb:
      'Korean election results visualized with hex cartograms and geo maps, aligned to each era’s administrative boundaries',
    url: 'https://polis.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F5F3}️',
    repo: 'https://github.com/YangSeungWon/polis-korea',
  },
  {
    name: 'Voca Web',
    group: 'selected',
    blurb: 'Vocabulary learning platform pairing a browser extension with a web app',
    url: 'https://voca.ysw.kr',
    kind: 'extension',
    year: '2024',
    icon: '\u{1F4DA}',
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
    group: 'selected',
    blurb: 'Couple messenger that automatically matches similar daily photos using AI',
    url: 'https://ohn.it.kr',
    kind: 'app',
    year: '2025',
    icon: 'https://ohn.it.kr/favicon.ico',
    iconIsImage: true,
    links: [
      {
        label: 'App Store',
        url: 'https://apps.apple.com/kr/app/%EC%98%A8%EC%9E%87-%EC%9D%BC%EC%83%81%EC%9D%84-%EC%9E%87%EB%8B%A4/id6749170363',
      },
      { label: 'Google Play', url: 'https://play.google.com/store/apps/details?id=kr.it.ohn' },
    ],
  },

  {
    name: 'BookBook (책책)',
    group: 'everyday',
    blurb: 'Build and share a personal bookshelf with realistic book spines on iOS',
    url: 'https://bookbook.ysw.kr',
    kind: 'app',
    year: '2026',
    icon: '/img/projects/bookbook.webp',
    iconIsImage: true,
  },
  {
    name: 'Dama (담아)',
    group: 'everyday',
    blurb: 'Turn reservation screenshots into calendar events with on-device AI — in development',
    url: 'https://dama.ysw.kr',
    kind: 'app',
    year: '2026',
    icon: '/img/projects/dama.webp',
    iconIsImage: true,
  },
  {
    name: 'Submission Check',
    group: 'research',
    blurb: 'Scans a paper PDF for anonymity leaks, format and font issues',
    url: 'https://submit.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F4C4}',
    repo: 'https://github.com/YangSeungWon/pdf-submit-checker',
  },
  {
    name: 'Claudish Checker',
    group: 'research',
    blurb: 'Finds Claude-flavoured sentences in a paper draft',
    url: 'https://claudish.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F916}',
    repo: 'https://github.com/YangSeungWon/pdf-claudish-checker',
  },
  {
    name: 'Reference DOI Checker',
    group: 'research',
    blurb: "Verifies a paper's references against official DOI metadata",
    url: 'https://refs.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F517}',
    repo: 'https://github.com/YangSeungWon/pdf-doi-checker',
  },
  {
    name: 'POSTECH Shuttle',
    group: 'everyday',
    blurb: 'Live shuttle map with routes, stops and a next-bus countdown',
    url: 'https://bus.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F68C}',
    repo: 'https://github.com/YangSeungWon/postech-shuttle',
  },
  {
    name: 'Rack Planner',
    group: 'everyday',
    blurb: 'Week-by-week cage rack layout editor with Excel and image export',
    url: 'https://rack.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F5C4}\uFE0F',
    repo: 'https://github.com/YangSeungWon/rack-planner',
  },
  {
    name: 'Sigun Typing',
    group: 'data',
    blurb: 'Typing practice on a map \u2014 name each district to fill it in',
    url: 'https://sigun-typing.ysw.kr',
    kind: 'game',
    year: '2026',
    icon: '\u2328\uFE0F',
    repo: 'https://github.com/YangSeungWon/sigun-typing',
  },
  {
    name: 'Tarot',
    group: 'everyday',
    blurb: 'Free Rider-Waite draws with upright and reversed readings',
    url: 'https://tarot.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F52E}',
    repo: 'https://github.com/YangSeungWon/tarot',
  },
  {
    name: '36 Questions',
    group: 'everyday',
    blurb: 'The Fast Friends closeness questionnaire, in Korean and English',
    url: 'https://friends.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F91D}',
    repo: 'https://github.com/YangSeungWon/fast-friends',
  },
  {
    name: 'Korea via Data',
    group: 'data',
    blurb: 'Interactive views of Korean public datasets',
    url: 'https://kvd.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F4CA}',
    repo: 'https://github.com/YangSeungWon/korea-via-data',
  },
  {
    name: 'MMM',
    group: 'data',
    blurb: 'Quirky facts and trivia',
    url: 'https://mmm.ysw.kr',
    kind: 'web',
    year: '2026',
    icon: '\u{1F9E0}',
  },
  {
    name: 'Quiz Korea',
    group: 'data',
    blurb: 'Map quiz for learning Korean provinces and districts',
    url: 'https://quiz-korea.ysw.kr',
    kind: 'web',
    year: '2025',
    icon: '\u{1F5FA}\uFE0F',
    repo: 'https://github.com/YangSeungWon/quiz-korea',
  },
  {
    name: 'Lotto 6/45 Stats',
    group: 'data',
    blurb: 'Draw statistics, past winning numbers and a number generator',
    url: 'https://lotto.ysw.kr',
    kind: 'web',
    year: '2025',
    icon: '\u{1F3B1}',
    repo: 'https://github.com/YangSeungWon/lotto',
  },
  {
    name: 'Naver Cafe Extractor',
    group: 'games',
    blurb: 'Extracts Naver Cafe posts and comments as JSON',
    url: 'https://chromewebstore.google.com/detail/%EB%84%A4%EC%9D%B4%EB%B2%84-%EC%B9%B4%ED%8E%98-%EB%8C%93%EA%B8%80-%EC%B6%94%EC%B6%9C%EA%B8%B0/hkehmkenhldahnonfaecaflemnpdihjg',
    kind: 'extension',
    year: '2025',
    icon: '\u{1F4AC}',
    repo: 'https://github.com/YangSeungWon/naver-cafe-comments-extract',
  },
  {
    name: 'Lime Game',
    group: 'games',
    blurb: 'Fruit Box puzzle clone, playable in the browser',
    url: 'https://li.me.kr',
    kind: 'game',
    year: '2025',
    icon: '\u{1F34B}',
    repo: 'https://github.com/YangSeungWon/lime-game',
  },
  {
    name: 'Survival Game',
    group: 'games',
    blurb: 'Web survival game built around upgrades and resource management',
    url: 'https://survival.game.ysw.kr',
    kind: 'game',
    year: '2024',
    icon: '\u{1F3D5}\uFE0F',
    repo: 'https://github.com/YangSeungWon/survival-game',
  },
  {
    name: 'Jack of All Trades Simulator',
    group: 'games',
    blurb: 'League of Legends item stat builder',
    url: 'https://lol.ysw.kr',
    kind: 'web',
    year: '2024',
    icon: '\u2694\uFE0F',
    repo: 'https://github.com/YangSeungWon/simulator-jack-of-all-trades-league-of-legends',
  },
  {
    name: 'YOWO',
    group: 'games',
    blurb: 'Blurs YouTube videos you have already watched, so you only watch once',
    url: 'https://chromewebstore.google.com/detail/you-only-watch-once-yowo/licbbogphmmjlffefkigjenihlogehgc',
    kind: 'extension',
    year: '2024',
    icon: '\u{1F4FA}',
    repo: 'https://github.com/YangSeungWon/you-only-watch-once',
  },
];

function ProjectEntry({ project }: { project: Project }) {
  const links = [
    ...(project.links ?? []),
    ...(project.repo ? [{ label: 'GitHub', url: project.repo }] : []),
  ];
  return (
    <li className={styles.project}>
      <div className={styles.heading}>
        {project.iconIsImage ? (
          <img src={project.icon} className={styles.icon} alt="" width={28} height={28} loading="lazy" decoding="async" />
        ) : <span className={styles.icon} aria-hidden="true">{project.icon}</span>}
        <h3><Link to={project.url}>{project.name}</Link></h3>
      </div>
      <p>{project.blurb}</p>
      <div className={styles.meta}>
        <span>{project.kind}{project.year ? ` · ${project.year}` : ''}</span>
        {links.map(link => <Link key={link.url} to={link.url}>{link.label}</Link>)}
      </div>
    </li>
  );
}

export default function Misc(): JSX.Element {
  return (
    <Layout title="Projects" description="Side projects built out of curiosity">
      <div className={plain.page}>
        <h1>Side Projects</h1>
        <nav className={styles.groups} aria-label="Project categories">
          {projectGroups.map(group => <Link key={group.id} to={`#${group.id}`}>{group.title}</Link>)}
        </nav>
        {projectGroups.map(group => (
          <section key={group.id} id={group.id} className={styles.group}>
            <h2>{group.title}</h2>
            <ul className={styles.projects}>
              {projects.filter(project => project.group === group.id).map(project => (
                <ProjectEntry key={project.name} project={project} />
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Layout>
  );
}
