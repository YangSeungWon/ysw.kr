import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

// SVG imports
const MountainSvg = require('@site/static/img/undraw_docusaurus_mountain.svg').default;
const TreeSvg = require('@site/static/img/undraw_docusaurus_tree.svg').default;
const ReactSvg = require('@site/static/img/undraw_docusaurus_react.svg').default;

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className="relative py-8 overflow-hidden"
      style={{
        background: `linear-gradient(135deg, var(--ifm-color-primary-lighter), var(--ifm-color-primary-darker))`
      }}>
      {/* 배경 장식 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1), transparent 50%)'
          }}></div>
        <div className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,0.08), transparent 50%)'
          }}></div>
      </div>

      <div className="container relative z-10 mx-auto px-4">
        {/* 프로필 이미지 */}
        <div className="relative mx-auto w-48 h-48 mb-4">
          <div className="absolute inset-0 animate-pulse bg-white/20 rounded-full blur-xl"></div>
          <img
            src="/img/seungwon.jpg"
            alt="Seungwon Yang"
            className="relative w-48 h-48 mx-auto rounded-full border-4 border-white/80 shadow-xl 
                     hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* 제목과 부제목 */}
        <div className="text-center mb-6">
          <Heading as="h1"
            className="text-4xl md:text-6xl font-bold text-white mb-2 
                     [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">
            {siteConfig.title}
          </Heading>
          <p className="text-xl md:text-2xl text-white/90 
                     [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)]">
            {siteConfig.tagline}
          </p>
        </div>

        {/* 주요 버튼 */}
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          <Link
            to="/about"
            className="px-8 py-3 bg-white text-xl text-primary-dark font-semibold rounded-full
                       hover:bg-white/90 hover:scale-105 transform transition-all duration-200
                       shadow-lg hover:shadow-xl border-2 border-white/20">
            About Me
          </Link>
          <a
            className="px-8 py-3 bg-white text-xl text-primary-dark font-semibold rounded-full
                       hover:bg-white/90 hover:scale-105 transform transition-all duration-200
                       shadow-lg hover:shadow-xl border-2 border-white/20"
            href={require("/cv.pdf").default}>
            CV
          </a>
        </div>

        {/* 보조 버튼 */}
        <div className="flex flex-wrap justify-center gap-2">
          <Link
            to="misc"
            className="px-6 py-2 bg-white/90 text-white font-medium rounded-full 
                       hover:bg-white/80 transition-all duration-200 backdrop-blur-sm
                       border border-white/30 shadow-md">
            Misc
          </Link>
          <Link
            to="tools"
            className="px-6 py-2 bg-white/90 text-white font-medium rounded-full 
                       hover:bg-white/80 transition-all duration-200 backdrop-blur-sm
                       border border-white/30 shadow-md">
            Tools
          </Link>
        </div>
      </div>
    </header>
  );
}

// 공통으로 사용할 카드 컴포넌트
function FeatureCard({ title, Svg, description }) {
  return (
    <div className="w-full md:w-1/3 px-4 mb-12">
      <div className="flex flex-col items-center group hover:translate-y-[-4px] transition-all duration-300">
        <div className="text-center mb-6 transform transition-transform duration-300 group-hover:scale-105">
          <Svg className="w-40 h-40 md:w-48 md:h-48" role="img" />
        </div>
        <div className="text-center px-6">
          <Heading as="h3" className="text-2xl font-bold mb-4">
            {title}
          </Heading>
          <p className="leading-relaxed">
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
                    I am an M.S. student in <Link href='https://his-lab.org'>HISLab</Link>@POSTECH, South Korea.
                    My research interests are in Accessibility, Gamification, and LLMs.
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
