export const toolCategories = [
  { key: 'all', label: 'All' },
  { key: 'image', label: 'Image' },
  { key: 'text', label: 'Text' },
  { key: 'utility', label: 'Utility' },
  { key: 'time', label: 'Time/Date' },
  { key: 'audio', label: 'Audio' },
] as const;

export type ToolCategory = typeof toolCategories[number]['key'];

export interface Tool {
  id: string;
  to: string;
  name: string;
  description: string;
  category: Exclude<ToolCategory, 'all'>;
  tags?: readonly string[];
  pageTitle?: string;
  pageDescription?: string;
}

const toolDefinitions = [
  {
    id: "ip",
    to: "/tools/ip",
    name: "IP",
    description: "Get your IP address",
    category: 'utility',
    tags: ['network', 'address'],
  },
  {
    id: "coordinates",
    to: "/tools/coordinates",
    name: "Coordinates",
    description: "Get GPS coordinates and convert to multiple formats",
    category: 'utility',
    tags: ['gps', 'location', 'map'],
  },
  {
    id: "signature",
    to: "/tools/signature",
    name: "Email Signature",
    description: "Generate email signature",
    category: 'text',
    tags: ['email', 'signature'],
  },
  {
    id: "base64",
    to: "/tools/base64",
    name: "Base64",
    description: "Encode/Decode Base64 with text and images",
    category: 'text',
    tags: ['encode', 'decode', 'base64'],
  },
  {
    id: "image-crop",
    to: "/tools/image-crop",
    name: "Image Crop",
    description: "Crop images",
    category: 'image',
    tags: ['crop', 'edit'],
  },
  {
    id: "emoji",
    pageTitle: "이모지 생성기",
    pageDescription: "Slack/Discord 이모지로 사용하기 좋은 형식으로 변환",
    to: "/tools/emoji",
    name: "Emoji Generator",
    description: "Convert images to Slack/Discord emoji format (transparent background, square, <128KB)",
    category: 'image',
    tags: ['emoji', 'slack', 'discord'],
  },
  {
    id: "qrcode-scanner",
    to: "/tools/qrcode-scanner",
    name: "QR Code Scanner",
    description: "Scan QR codes from images",
    category: 'image',
    tags: ['qr', 'scan', 'decode'],
  },
  {
    id: "qrcode-generator",
    to: "/tools/qrcode-generator",
    name: "QR Code Generator",
    description: "Generate QR codes",
    category: 'image',
    tags: ['qr', 'generate', 'encode'],
  },
  {
    id: "qrcode-multi",
    to: "/tools/qrcode-multi",
    name: "Multi QR Code Generator",
    description: "Generate multiple QR codes for different fields",
    category: 'image',
    tags: ['qr', 'batch', 'multiple'],
  },
  {
    id: "image-resizer",
    to: "/tools/image-resizer",
    name: "Image Resizer",
    description: "Resize images by scale factor",
    category: 'image',
    tags: ['resize', 'scale'],
  },
  {
    id: "color-vision-simulator",
    to: "/tools/color-vision-simulator",
    name: "Color Vision Simulator",
    description: "Simulate how images appear with different color vision deficiencies",
    category: 'image',
    tags: ['color', 'vision', 'accessibility'],
  },
  {
    id: "audio-checker",
    to: "/tools/audio-checker",
    name: "Audio Checker",
    description: "Check and test connected speakers and microphones",
    category: 'audio',
    tags: ['audio', 'test', 'microphone', 'speaker'],
  },
  {
    id: "tts-reader",
    pageTitle: "TTS Reader",
    pageDescription: "텍스트를 붙여넣고 목소리를 골라 들어보세요",
    to: "/tools/tts-reader",
    name: "TTS Reader",
    description: "Read text aloud with per-sentence Korean/English voice detection",
    category: 'audio',
    tags: ['tts', 'speech', 'voice', 'read', 'accessibility'],
  },
  {
    id: "digital-clock",
    to: "/tools/digital-clock",
    name: "Digital Clock",
    description: "Display the current time in different timezones",
    category: 'time',
    tags: ['clock', 'time', 'timezone'],
  },
  {
    id: "timer-stopwatch",
    to: "/tools/timer-stopwatch",
    name: "Timer/Stopwatch",
    description: "Timer and stopwatch",
    category: 'time',
    tags: ['timer', 'stopwatch', 'countdown'],
  },
  {
    id: "contact-importer",
    pageTitle: "연락처 일괄 가져오기",
    pageDescription: "스프레드시트에서 안드로이드 연락처로",
    to: "/tools/contact-importer",
    name: "Contact Importer",
    description: "Import spreadsheet contacts to Android (VCF format)",
    category: 'utility',
    tags: ['contact', 'vcf', 'android', 'import'],
  },
  {
    id: "character-counter",
    to: "/tools/character-counter",
    name: "Character Counter",
    description: "Count characters, words, lines, and analyze text composition",
    category: 'text',
    tags: ['character', 'word', 'count', 'text', 'analysis'],
  },
  {
    id: "text-splitter",
    to: "/tools/text-splitter",
    name: "Text Splitter",
    description: "Split text by delimiter and click to copy each part",
    category: 'text',
    tags: ['split', 'delimiter', 'copy', 'parse'],
  },
  {
    id: "doi-bibtex",
    to: "/tools/doi-bibtex",
    name: "DOI to BibTeX",
    description: "Fetch BibTeX citation from a DOI",
    category: 'text',
    tags: ['doi', 'bibtex', 'citation', 'paper', 'reference'],
  },
] as const satisfies readonly Tool[];

export type ToolId = typeof toolDefinitions[number]['id'];

export const tools: readonly Tool[] = toolDefinitions;

export function getTool(id: ToolId): Tool {
  const tool = tools.find(item => item.id === id);
  if (!tool) throw new Error(`Unknown tool: ${id}`);
  return tool;
}
