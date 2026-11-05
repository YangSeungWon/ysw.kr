export interface PublicationLink {
  type: 'YouTube' | 'PDF' | 'DOI' | 'arXiv' | 'Link' | 'Workshop';
  url: string;
}

export interface Publication {
  id: string;
  type: 'Conference Paper' | 'Poster' | 'Demonstration' | 'Workshop Paper';
  title: string;
  citation: string;
  authors: string;
  publicationVenue: string;
  venue: string;
  year: number;
  thumbnail?: string;
  thumbnailFit?: 'cover' | 'contain';
  links: PublicationLink[];
  award?: string;
}

export const publications: Publication[] = [
  {
    id: 'C.1',
    type: 'Conference Paper',
    title: 'Toward Affective Empathy via Personalized Analogy Generation: A Case Study on Microaggression',
    venue: 'CHI 2025',
    year: 2025,
    citation: 'Hyojin Ju, Jungeun Lee, <strong>Seungwon Yang</strong>, Jungseul Ok, and Inseok Hwang (2025). "Toward Affective Empathy via Personalized Analogy Generation: A Case Study on Microaggression". In: Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems (ACM CHI 2025).',
    authors: 'Hyojin Ju, Jungeun Lee, <strong>Seungwon Yang</strong>, Jungseul Ok, and Inseok Hwang',
    publicationVenue: 'Proceedings of the 2025 CHI Conference on Human Factors in Computing Systems (ACM CHI 2025)',
    thumbnail: '/img/pub/emosync-chi2025-paper.webp',
    links: [
      { type: 'YouTube', url: 'https://www.youtube.com/watch?v=sT1gxhITWyU' },
      { type: 'DOI', url: 'https://doi.org/10.1145/3706598.3714122' },
      { type: 'PDF', url: 'https://hyojinju.com/files/papers/chi25b-sub9551-cam-i16.pdf' }
    ]
  }
];

export const demonstrations: Publication[] = [
  {
    id: 'W.2',
    type: 'Workshop Paper',
    title: 'MimeBot: Cultivating Human Engagement through Non-verbal Expression for Proactive Robot Intervention',
    venue: 'UbiComp/ISWC 2026 · PEACE Workshop',
    year: 2026,
    thumbnail: '/img/pub/mimebot-peace2026-workshop.webp',
    thumbnailFit: 'contain',
    citation: 'Mingyeol Kim, <strong>Seungwon Yang</strong>, and Inseok Hwang (2026). "MimeBot: Cultivating Human Engagement through Non-verbal Expression for Proactive Robot Intervention". In: ACM UbiComp/ISWC 2026, PEACE Workshop: Proactive Embodied Assistants in Context-aware Environments.',
    authors: 'Mingyeol Kim, <strong>Seungwon Yang</strong>, and Inseok Hwang',
    publicationVenue: 'ACM UbiComp/ISWC 2026, PEACE Workshop: Proactive Embodied Assistants in Context-aware Environments',
    links: [
      { type: 'DOI', url: 'https://doi.org/10.1145/3798063.3839203' },
      { type: 'Workshop', url: 'https://peace-workshop.github.io/' }
    ],
    award: 'Best Paper Award'
  },
  {
    id: 'P.1',
    type: 'Poster',
    title: 'Chameleon: A Surface-Anchored Smartphone AR Prototype with Visually Blended Mobile Display',
    venue: 'UIST 2025 Poster',
    year: 2025,
    citation: '<strong>Seungwon Yang</strong>, Suwon Yoon, Jeongwon Choi, and Inseok Hwang (2025). "Chameleon: A Surface-Anchored Smartphone AR Prototype with Visually Blended Mobile Display". In: Adjunct Proceedings of the 38th Annual ACM Symposium on User Interface Software and Technology (ACM UIST 2025 Poster).',
    authors: '<strong>Seungwon Yang</strong>, Suwon Yoon, Jeongwon Choi, and Inseok Hwang',
    publicationVenue: 'Adjunct Proceedings of the 38th Annual ACM Symposium on User Interface Software and Technology (ACM UIST 2025 Poster)',
    thumbnail: '/img/pub/chameleon-uist2025-poster.webp',
    links: [
      { type: 'arXiv', url: 'https://arxiv.org/abs/2509.14643' },
      { type: 'DOI', url: 'https://doi.org/10.1145/3746058.3758440' },
      { type: 'Link', url: 'https://programs.sigchi.org/uist/2025/program/content/209506' },
      { type: 'YouTube', url: 'https://www.youtube.com/watch?v=lcBdWX592iQ' }
    ]
  },
  {
    id: 'D.1',
    type: 'Demonstration',
    title: 'Toward Affective Empathy via Personalized Analogy Generation: A Case Study on Microaggression',
    venue: 'CHI 2025 Interactivity',
    year: 2025,
    citation: 'Hyojin Ju, Jungeun Lee, <strong>Seungwon Yang</strong>, Jungseul Ok, and Inseok Hwang (2025). "Toward Affective Empathy via Personalized Analogy Generation: A Case Study on Microaggression". In: Extended Abstracts of the CHI Conference on Human Factors in Computing Systems (ACM CHI 2025 Interactivity).',
    authors: 'Hyojin Ju, Jungeun Lee, <strong>Seungwon Yang</strong>, Jungseul Ok, and Inseok Hwang',
    publicationVenue: 'Extended Abstracts of the CHI Conference on Human Factors in Computing Systems (ACM CHI 2025 Interactivity)',
    thumbnail: '/img/pub/emosync-chi2025-demo.webp',
    links: [
      { type: 'Link', url: 'https://programs.sigchi.org/chi/2025/program/content/194724' },
    ],
    award: 'Popular Choice Honorable Mention Award'
  },
  {
    id: 'W.1',
    type: 'Workshop Paper',
    title: 'Chatperone: An LLM-Based Negotiable Scaffolding System for Mediating Adolescent Mobile Interactions',
    venue: 'CHI 2025 Workshop',
    year: 2025,
    citation: 'Suwon Yoon, <strong>Seungwon Yang</strong>, Jeongwon Choi, Wonjeong Park, and Inseok Hwang (2025). "Chatperone: An LLM-Based Negotiable Scaffolding System for Mediating Adolescent Mobile Interactions". In: ACM CHI 2025 Workshop.',
    authors: 'Suwon Yoon, <strong>Seungwon Yang</strong>, Jeongwon Choi, Wonjeong Park, and Inseok Hwang',
    publicationVenue: 'ACM CHI 2025 Workshop',
    thumbnail: '/img/pub/chatperone-chi2025-workshop.webp',
    links: [
      { type: 'arXiv', url: 'https://arxiv.org/abs/2504.17997' },
      { type: 'DOI', url: 'https://doi.org/10.48550/arXiv.2504.17997' },
      { type: 'Workshop', url: 'https://mobiletechteens-chi2025.github.io/' }
    ]
  }
];

// Get all publications for homepage
export function getAllPublications(): Publication[] {
  return [...publications, ...demonstrations].sort((a, b) => b.year - a.year);
}
