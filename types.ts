
export type Language = 'zh' | 'en';

export interface CardData {
  id: number;
  name: string;
  roman: string;
  meaningUpright: string;
  meaningReversed: string;
}

export interface DrawnCard {
  card: CardData;
  isReversed: boolean;
  positionLabel?: string; // e.g., "Past", "Present", "Future"
  recommendedOS: string; // Random OS recommendation
  aiPhrase: string; // New field for the AI love phrase
  // New V4.0 Product Fields
  productName: string; 
  productIcon: string;
}

export type SpreadType = 'single' | 'three';

// New V4.0 Decision Hub Types
export type DecisionTool = 'dashboard'; // Unified Dashboard
export type TossSkin = 'classic' | 'coin' | 'bitcoin' | 'turtle';

// Result Types
export interface BoBeiResult {
  p1: string;
  p2: string;
  result: string;
  displayTitle: string;
  isSmile: boolean;
  isNo: boolean;
}

export interface IChingResult {
  lines: boolean[];
  text: string;
  title: string;
}

export interface DiceResult {
  dice: number[];
  total: number;
  text: string;
}

export interface CoinResult {
  isHeads: boolean;
  text: string;
}

export interface CrystalResult {
  color: 'green' | 'red' | 'gold';
  text: string;
}

export interface PokerResult {
  suit: '♥' | '♦' | '♣' | '♠';
  isRed: boolean;
  number: string;
  text: string;
}

export interface NumberResult {
  num: number;
  text: string;
}

export interface EnergyResult {
  percent: number;
  text: string;
}