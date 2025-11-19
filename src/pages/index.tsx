import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import { FaGithub, FaLinkedin, FaOrcid } from 'react-icons/fa';
import { SiGooglescholar } from 'react-icons/si';
import SocialIconButton from '@/components/SocialIconButton';
import HeroCTAButton from '@/components/HeroCTAButton';
import { useCardHover } from '@/hooks/useCardHover';
import { TRANSITIONS, BORDER_RADIUS } from '@/constants/styles';
import { FONT_SIZES, FONT_WEIGHTS, SPACING } from '@/constants/typography';

// SVG imports
const MountainSvg = require('@site/static/img/undraw_docusaurus_mountain.svg').default;
const TreeSvg = require('@site/static/img/undraw_docusaurus_tree.svg').default;
const ReactSvg = require('@site/static/img/undraw_docusaurus_react.svg').default;

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className="relative py-6 overflow-hidden hero-header">
      <div className="container relative z-10 mx-auto px-4">
        {/* 프로필 이미지 */}
        <div className="relative mx-auto w-48 h-48 mb-4">
          <img
            src="/img/seungwon.jpg"
            alt="Seungwon Yang"
            className="w-48 h-48 mx-auto rounded-full border-4 border-white shadow-2xl"
          />
        </div>

        {/* 제목과 부제목 */}
        <div className="text-center mb-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
            {siteConfig.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90">
            {siteConfig.tagline}
          </p>
        </div>

        {/* 주요 버튼 */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <HeroCTAButton to="/publications" icon={null} label="Publications" variant="primary" />
          <a
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold no-underline"
            style={{
              backgroundColor: 'white',
              color: 'var(--ifm-color-primary)',
              fontSize: FONT_SIZES.LG,
              fontWeight: FONT_WEIGHTS.SEMIBOLD,
              padding: `${SPACING.MD} ${SPACING.LG}`,
              borderRadius: BORDER_RADIUS.LG,
              transition: TRANSITIONS.DEFAULT,
            }}
            href={require("/cv.pdf").default}>
            CV
          </a>
        </div>

        {/* 소셜 링크 */}
        <div className="flex justify-center gap-4 mt-2">
          <SocialIconButton
            href="https://scholar.google.com/citations?user=YJm0n7gAAAAJ"
            icon={<SiGooglescholar className="w-6 h-6 text-white" />}
            label="Google Scholar"
          />
          <SocialIconButton
            href="https://github.com/YangSeungWon"
            icon={<FaGithub className="w-6 h-6 text-white" />}
            label="GitHub"
          />
          <SocialIconButton
            href="https://www.linkedin.com/in/seungwon-yang"
            icon={<FaLinkedin className="w-6 h-6 text-white" />}
            label="LinkedIn"
          />
          <SocialIconButton
            href="https://orcid.org/0009-0009-0755-2450"
            icon={<FaOrcid className="w-6 h-6 text-white" />}
            label="ORCID"
          />
        </div>
      </div>
    </header>
  );
}

// 공통으로 사용할 카드 컴포넌트
function FeatureCard({ title, Svg, description }) {
  const { styles, handlers } = useCardHover({ scale: 'SCALE_SMALL' });

  return (
    <div className="w-full md:w-1/3 px-4 mb-12">
      <div className="flex flex-col items-center p-6 rounded-2xl"
           style={{
             backgroundColor: 'var(--ifm-card-background-color)',
             border: '1px solid var(--ifm-color-emphasis-200)',
             transform: styles.transform,
             transition: TRANSITIONS.DEFAULT,
           }}
           {...handlers}>
        <div className="text-center mb-6">
          <Svg className="w-40 h-40 md:w-48 md:h-48" role="img" />
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4"
              style={{
                color: 'var(--ifm-color-primary)',
                fontSize: FONT_SIZES['2XL'],
                fontWeight: FONT_WEIGHTS.BOLD,
              }}>
            {title}
          </h3>
          <p className="leading-relaxed text-base"
             style={{
               color: 'var(--ifm-font-color-base)',
               fontSize: FONT_SIZES.BASE,
             }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <section className="py-16 px-4">
          <div className="container mx-auto">
            <div className="flex flex-wrap -mx-4">
              <FeatureCard
                title="HCI Researcher"
                Svg={MountainSvg}
                description={
                  <>
                    I am a Ph.D. student in <Link href='https://his-lab.org'>HISLab</Link>@POSTECH, South Korea.
                    My research interests are in Accessibility, Gamification, Location-based Games, and LLMs.
                  </>
                }
              />
              <FeatureCard
                title="Hacker"
                Svg={TreeSvg}
                description={
                  <>
                    I was a member of <Link href='https://plus.or.kr'>PLUS</Link>@POSTECH, South Korea.
                    I studied Computer Security, especially in Web Security and Web3, and participated in CTFs.
                  </>
                }
              />
              <FeatureCard
                title="..."
                Svg={ReactSvg}
                description="I believe the power of not only technology but also humanity. Peace and Love for all, with my best wishes."
              />
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
