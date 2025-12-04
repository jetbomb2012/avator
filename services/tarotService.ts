
import { MAJOR_ARCANA_ZH, MAJOR_ARCANA_EN, OS_CHROME, OS_WINDOWS, OS_MAC, OS_OTHERS, AI_PHRASES, UI_TEXT, PRODUCTS } from '../constants';
import { DrawnCard, SpreadType, Language } from '../types';

export const drawCards = (spreadType: SpreadType, lang: Language = 'zh'): DrawnCard[] => {
  // 1. Select deck based on language
  const sourceDeck = lang === 'en' ? MAJOR_ARCANA_EN : MAJOR_ARCANA_ZH;
  const deck = [...sourceDeck];

  // 2. Fisher-Yates Shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  // 3. Determine count based on spread
  const count = spreadType === 'single' ? 1 : 3;

  // 4. Pick cards and determine orientation
  const results: DrawnCard[] = [];
  
  const text = UI_TEXT[lang];
  const positionLabels = spreadType === 'three' 
    ? [text.pos_past, text.pos_present, text.pos_future] 
    : [text.pos_guide];

  for (let i = 0; i < count; i++) {
    const isReversed = Math.random() < 0.5; // 50% chance of reversal
    
    // Weighted Random Selection for OS
    const randomValue = Math.random() * 100;
    let selectedPool: string[];

    if (randomValue < 60) {
      selectedPool = OS_CHROME;
    } else if (randomValue < 90) {
      selectedPool = OS_WINDOWS;
    } else if (randomValue < 99) {
      selectedPool = OS_MAC;
    } else {
      selectedPool = OS_OTHERS;
    }

    const randomOS = selectedPool[Math.floor(Math.random() * selectedPool.length)];
    const randomAIPhrase = AI_PHRASES[Math.floor(Math.random() * AI_PHRASES.length)];

    // V4.0 Random Product Selection
    const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    // For display logic, we need localized names
    const prodName = lang === 'zh' ? randomProduct.name.zh : randomProduct.name.en;

    results.push({
      card: deck[i],
      isReversed,
      positionLabel: positionLabels[i],
      recommendedOS: randomOS,
      aiPhrase: randomAIPhrase,
      productName: prodName,
      productIcon: randomProduct.icon
    });
  }

  return results;
};