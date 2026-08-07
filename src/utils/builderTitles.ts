/**
 * Keyword-matched dictionary to auto-generate a fun, authentic Builder Title
 * based on stack/role input.
 */

interface TitleRule {
  keywords: string[];
  titles: string[];
}

const TITLE_RULES: TitleRule[] = [
  {
    keywords: ['ai', 'ml', 'llm', 'gemini', 'gpt', 'openai', 'claude', 'deep learning', 'pytorch', 'tensorflow', 'rag', 'agent'],
    titles: [
      'NEURAL ALCHEMIST',
      'SYNTHETIC MIND ARCHITECT',
      'PROMPT SORCERER',
      'INTELLIGENCE ENGINEER',
      'GEMINI WHISPERER',
      'TRANSFORMER TACTICIAN',
      'AGENTIC MATRIX WIZARD',
      'LATENT SPACE SHAMAN',
      'LLM PIPELINE MAESTRO',
      'MODEL TINKERER',
      'NEURAL NET NINJA'
    ]
  },
  {
    keywords: ['web3', 'solana', 'crypto', 'blockchain', 'eth', 'ethereum', 'smart contract', 'solidity', 'rust', 'token', 'dao'],
    titles: [
      'CHAIN MYSTIC',
      'PROTOCOL ARCHITECT',
      'DECENTRALIZED WARRIOR',
      'LEDGER WIZARD',
      'BLOCKCHAIN ALCHEMIST',
      'ZERO-KNOWLEDGE SHAMAN',
      'SOLANA RUSTACEAN',
      'SMART CONTRACT GOD',
      'GAS OPTIMIZER MAGUS',
      'DEFI PROTOCOL MAESTRO',
      'ON-CHAIN TACTICIAN'
    ]
  },
  {
    keywords: ['frontend', 'react', 'next', 'next.js', 'vue', 'tailwind', 'ui', 'ux', 'css', 'html', 'vite', 'three.js'],
    titles: [
      'PIXEL ARCHITECT',
      'DOM WHISPERER',
      'INTERFACE VIRTUOSO',
      'FRONTEND MAESTRO',
      'CANVAS CRAFTSMAN',
      'COMPONENT NINJA',
      'STATE MACHINE MAGUS',
      'LAYOUT CRAFTSMAN',
      'UX ILLUSIONIST',
      'TAILWIND WARRIOR',
      'CSS MATRIX WIZARD'
    ]
  },
  {
    keywords: ['backend', 'node', 'express', 'python', 'go', 'golang', 'java', 'c++', 'postgres', 'sql', 'database', 'graphql', 'api'],
    titles: [
      'SYSTEM ORCHESTRATOR',
      'PIPELINE ARCHITECT',
      'DATA STREAM SORCERER',
      'SERVER ENGINE MAGUS',
      'PROTOCOL CRAFTSMAN',
      'CONCURRENCY WIZARD',
      'MICROSERVICE MAESTRO',
      'DB QUERY ALCHEMIST',
      'LATENCY DEMON',
      'BACKEND WARRIOR'
    ]
  },
  {
    keywords: ['fullstack', 'full-stack', 'full stack', 'mern', 'mean', 't3', 'typescript'],
    titles: [
      'CODE POLYMATH',
      'END-TO-END BUILDER',
      'FULLSTACK MAESTRO',
      'ARCHITECT OF EVERYTHING',
      'STACK MASTER',
      'FULLSTACK TACTICIAN',
      'SHIP-FAST WARRIOR',
      'PRODUCT ENGINE MAESTRO',
      'SWISS ARMY HACKER'
    ]
  },
  {
    keywords: ['design', 'figma', 'ui/ux', 'motion', 'animation', 'graphic', 'designer', '3d', 'blender'],
    titles: [
      'VISUAL ALCHEMIST',
      'AESTHETIC GUARDIAN',
      'INTERFACE VIRTUOSO',
      'CREATIVE STRATEGIST',
      'DESIGN MAESTRO',
      'PIXEL GUARDIAN',
      'VECTOR MASTER',
      'BEZIER CURVE SORCERER',
      'DESIGN SYSTEM GOD'
    ]
  },
  {
    keywords: ['product', 'pm', 'founder', 'ceo', 'lead', 'strategy', 'manager', 'growth'],
    titles: [
      'VISION STRATEGIST',
      'PRODUCT ORCHESTRATOR',
      'FOUNDER AT LARGE',
      'ROADMAP TACTICIAN',
      'IMPACT ARCHITECT',
      'VENTURE BUILDER',
      'DEMO DAY WARRIOR',
      'CHIEF HACKER'
    ]
  },
  {
    keywords: ['mobile', 'react native', 'flutter', 'ios', 'android', 'swift', 'kotlin'],
    titles: [
      'APP MAESTRO',
      'MOBILE ARCHITECT',
      'POCKET APP SORCERER',
      'TOUCHSCREEN CRAFTSMAN',
      'CROSS-PLATFORM WARRIOR',
      'NATIVE CODE NINJA'
    ]
  },
  {
    keywords: ['devops', 'infra', 'docker', 'k8s', 'kubernetes', 'aws', 'gcp', 'cloud', 'linux', 'ci/cd', 'terraform'],
    titles: [
      'INFRASTRUCTURE SORCERER',
      'CLOUD GUARDIAN',
      'CONTAINER ALCHEMIST',
      'RELIABILITY TACTICIAN',
      'KUBERNETES COMMANDER',
      'SERVERLESS ARCHITECT'
    ]
  },
  {
    keywords: ['data', 'analytics', 'pandas', 'spark', 'sql', 'etl', 'bigdata', 'pipeline'],
    titles: [
      'INSIGHT ORACLE',
      'DATA ALCHEMIST',
      'VECTOR MATRIX ENGINEER',
      'METRIC SORCERER',
      'DATA PIPELINE NINJA'
    ]
  },
  {
    keywords: ['hardware', 'iot', 'embedded', 'arduino', 'raspberry', 'robotics', 'verilog', 'fpga'],
    titles: [
      'SILICON WIZARD',
      'HARDWARE HACKER',
      'CIRCUIT ALCHEMIST',
      'PHYSICAL ENGINE MASTER',
      'EMBEDDED SHAMAN'
    ]
  },
  {
    keywords: ['growth', 'marketing', 'community', 'hype', 'viral', 'memes', 'x', 'twitter'],
    titles: [
      'HYPE CATALYST',
      'VIRAL ARCHITECT',
      'COMMUNITY CATALYST',
      'MEME MAGUS',
      'NETWORK EFFECTS WIZARD'
    ]
  }
];

const FALLBACK_TITLES = [
  'TROPICAL CODE HACKER',
  'GOA MATRIX WIZARD',
  '2:47 AM NIGHT BUILDER',
  'GOA UNSTOPPABLE BUILDER',
  'SUNSET HACKATHON WARRIOR',
  'PALM SHADE CODE SHAMAN',
  'ARAMBOL SYNTAX WARRIOR',
  'BAGA BEACH LOGIC WIZARD',
  '0xGOA PROTOCOL LEGEND',
  'HACKER HOUSE VIP',
  'MONSOON BUG HUNTER',
  'CAFFEINE ENGINE BUILDER',
  'PALM TREE ARCHITECT',
  'GOAN BAY DEMO GOD',
  'VAGATOR CODE ALCHEMIST',
  'SHIP-FAST HACKER',
  'BEACHSIDE COMPILER',
  'SHACK LOUNGE TACTICIAN',
  'TROPICAL BYTE MAESTRO',
  'GOA HACKER HOUSE LEGEND',
  'PALM FROND CYBERPUNK'
];

/**
 * Derive title deterministically or randomly based on stack input
 */
export function generateBuilderTitle(stackInput: string, currentTitle?: string): string {
  const allPool: string[] = [];

  if (stackInput && stackInput.trim()) {
    const normalized = stackInput.toLowerCase();
    for (const rule of TITLE_RULES) {
      for (const keyword of rule.keywords) {
        if (normalized.includes(keyword)) {
          allPool.push(...rule.titles);
          break;
        }
      }
    }
  }

  // Combine category pool with fallback titles so re-roll always has plenty of variety
  const combinedPool = Array.from(new Set([...allPool, ...FALLBACK_TITLES]));

  // Filter out current title if possible so re-roll feels instant
  const validPool = currentTitle 
    ? combinedPool.filter(t => t.toUpperCase() !== currentTitle.toUpperCase())
    : combinedPool;

  const finalPool = validPool.length > 0 ? validPool : combinedPool;
  const randomIndex = Math.floor(Math.random() * finalPool.length);
  return finalPool[randomIndex];
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

export function generatePassId(): string {
  const chars = '0123456789ABCDEF';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `#HH-GOA-${result}`;
}
