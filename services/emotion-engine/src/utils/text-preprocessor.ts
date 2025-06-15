import { Injectable } from '@nestjs/common';

@Injectable()
export class TextPreprocessor {
  /**
   * Clean and normalize text for emotion analysis
   */
  preprocessText(text: string): string {
    if (!text || typeof text !== 'string') {
      return '';
    }

    // Convert to lowercase
    let processed = text.toLowerCase();

    // Remove URLs
    processed = processed.replace(/https?:\/\/[^\s]+/g, '');

    // Remove email addresses
    processed = processed.replace(/[\w\.-]+@[\w\.-]+\.\w+/g, '');

    // Remove mentions and hashtags (but keep the text)
    processed = processed.replace(/@[\w]+/g, '');
    processed = processed.replace(/#([\w]+)/g, '$1');

    // Expand contractions
    const contractions = {
      "ain't": "am not",
      "aren't": "are not",
      "can't": "cannot",
      "couldn't": "could not",
      "didn't": "did not",
      "doesn't": "does not",
      "don't": "do not",
      "hadn't": "had not",
      "hasn't": "has not",
      "haven't": "have not",
      "he's": "he is",
      "i'm": "i am",
      "i've": "i have",
      "i'll": "i will",
      "i'd": "i would",
      "isn't": "is not",
      "it's": "it is",
      "let's": "let us",
      "shouldn't": "should not",
      "that's": "that is",
      "there's": "there is",
      "they're": "they are",
      "they've": "they have",
      "we're": "we are",
      "we've": "we have",
      "weren't": "were not",
      "what's": "what is",
      "where's": "where is",
      "who's": "who is",
      "won't": "will not",
      "wouldn't": "would not",
      "you're": "you are",
      "you've": "you have",
      "you'll": "you will",
      "you'd": "you would",
    };

    Object.keys(contractions).forEach(contraction => {
      const regex = new RegExp(`\\b${contraction}\\b`, 'g');
      processed = processed.replace(regex, contractions[contraction]);
    });

    // Remove excessive punctuation but keep important emotional indicators
    processed = processed.replace(/[!]{2,}/g, '!'); // Multiple exclamation marks to single
    processed = processed.replace(/[?]{2,}/g, '?'); // Multiple question marks to single
    processed = processed.replace(/[.]{3,}/g, '...'); // Multiple dots to ellipsis

    // Remove extra whitespace
    processed = processed.replace(/\s+/g, ' ').trim();

    // Remove non-alphanumeric characters except basic punctuation
    processed = processed.replace(/[^a-zA-Z0-9\s.,!?'"()]/g, '');

    return processed;
  }

  /**
   * Extract emotion-relevant features from text
   */
  extractFeatures(text: string): {
    hasExclamation: boolean;
    hasQuestion: boolean;
    hasCapitals: boolean;
    wordCount: number;
    hasNegation: boolean;
    hasIntensifiers: boolean;
    hasEmotionalWords: boolean;
  } {
    const original = text;
    const processed = this.preprocessText(text);

    const negationWords = ['not', 'no', 'never', 'nothing', 'nowhere', 'nobody', 'none'];
    const intensifiers = ['very', 'really', 'extremely', 'incredibly', 'absolutely', 'totally', 'completely'];
    const emotionalWords = [
      'love', 'hate', 'amazing', 'terrible', 'wonderful', 'awful', 'fantastic', 'horrible',
      'excited', 'devastated', 'thrilled', 'disappointed', 'overjoyed', 'heartbroken'
    ];

    return {
      hasExclamation: original.includes('!'),
      hasQuestion: original.includes('?'),
      hasCapitals: /[A-Z]{2,}/.test(original),
      wordCount: processed.split(' ').filter(word => word.length > 0).length,
      hasNegation: negationWords.some(word => processed.includes(word)),
      hasIntensifiers: intensifiers.some(word => processed.includes(word)),
      hasEmotionalWords: emotionalWords.some(word => processed.includes(word)),
    };
  }
}
