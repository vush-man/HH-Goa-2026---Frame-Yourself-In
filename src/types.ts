export type FrameFormat = 'pfp' | 'pass';

export interface PhotoState {
  file: File | null;
  dataUrl: string | null;
  imageObj: HTMLImageElement | null;
  scale: number;
  panX: number;
  panY: number;
  rotation: number; // 0, 90, 180, 270
}

export interface BuilderProfile {
  name: string;
  teamName?: string;
  stack: string;
  title: string;
  theme: 'goa-green' | 'sunset-yellow' | 'magenta-pink' | 'midnight-dark';
  passId: string;
}

export interface CanvasRenderOptions {
  format: FrameFormat;
  photo: PhotoState;
  profile: BuilderProfile;
  showCirclePreview?: boolean;
}

export const BUILDER_STACK_SUGGESTIONS = [
  'LLM', 'AI', 'Agentic AI', 'Automation', 'Crypto', 'Blockchain',
  'React', 'Next.js', 'Node.js', 'TypeScript',
  'Gemini AI', 'Python', 'Rust', 'Solana',
  'Tailwind CSS', 'Figma', 'DevOps', 'Flutter',
  'PostgreSQL', 'System Design'
];
