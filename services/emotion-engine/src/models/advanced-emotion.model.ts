import { Injectable } from '@nestjs/common';
import * as natural from 'natural';
import { EmotionModel, EmotionPrediction, EMOTION_CATEGORIES } from '../interfaces/emotion.interfaces';
import { TextPreprocessor } from '../utils/text-preprocessor';

@Injectable()
export class AdvancedEmotionModel implements EmotionModel {
  private classifier: any;
  private isInitialized = false;
  private readonly textPreprocessor = new TextPreprocessor();

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    this.classifier = new natural.BayesClassifier();
    
    // Enhanced training data with more diverse examples
    await this.trainModel();
    
    this.isInitialized = true;
  }

  private async trainModel(): Promise<void> {
    // Joy/Happiness training data
    const joyExamples = [
      'I am so happy today!', 'This is amazing!', 'I feel fantastic!', 'What a wonderful day!',
      'I love this!', 'I am thrilled!', 'This brings me so much joy!', 'I am overjoyed!',
      'Best day ever!', 'I am feeling great!', 'This makes me smile!', 'Pure happiness!',
      'I am ecstatic!', 'This is incredible!', 'I feel amazing!', 'So much joy!',
      'Feeling blessed!', 'This is perfect!', 'I am delighted!', 'Absolutely wonderful!'
    ];

    // Sadness training data
    const sadnessExamples = [
      'I feel so sad', 'This is heartbreaking', 'I am devastated', 'Feeling down today',
      'This makes me cry', 'I am so disappointed', 'Feeling lonely', 'I miss them so much',
      'This hurts so much', 'I feel empty inside', 'So much pain', 'I am heartbroken',
      'Feeling blue', 'This is depressing', 'I feel lost', 'So much grief',
      'I am mourning', 'This is tragic', 'Feeling melancholy', 'Deep sorrow'
    ];

    // Anger training data
    const angerExamples = [
      'I am so angry!', 'This is infuriating!', 'I am furious!', 'This makes me mad!',
      'I hate this!', 'This is outrageous!', 'I am livid!', 'This is unacceptable!',
      'I am enraged!', 'This pisses me off!', 'I am boiling with anger!', 'This is ridiculous!',
      'I am fed up!', 'This is annoying!', 'I am irritated!', 'This drives me crazy!',
      'I am steaming!', 'This is aggravating!', 'I am irate!', 'This is maddening!'
    ];

    // Fear/Anxiety training data
    const fearExamples = [
      'I am so scared', 'This terrifies me', 'I am anxious', 'This worries me',
      'I am afraid', 'This is frightening', 'I feel nervous', 'This gives me anxiety',
      'I am worried sick', 'This is alarming', 'I feel panicked', 'This is scary',
      'I am terrified', 'This makes me nervous', 'I feel uneasy', 'This is disturbing',
      'I am fearful', 'This is intimidating', 'I feel threatened', 'This is concerning'
    ];

    // Surprise training data
    const surpriseExamples = [
      'What a surprise!', 'I am shocked!', 'This is unexpected!', 'I am amazed!',
      'This is astonishing!', 'I cannot believe this!', 'This is incredible!', 'What?!',
      'This is mind-blowing!', 'I am stunned!', 'This is remarkable!', 'Unbelievable!',
      'This is extraordinary!', 'I am dumbfounded!', 'This is phenomenal!', 'Wow!',
      'This is breathtaking!', 'I am flabbergasted!', 'This is startling!', 'Amazing!'
    ];

    // Love/Affection training data
    const loveExamples = [
      'I love you so much', 'You mean everything to me', 'I adore you', 'You are my everything',
      'I am in love', 'You are amazing', 'I cherish you', 'You make me complete',
      'I care about you deeply', 'You are wonderful', 'I treasure you', 'You are my heart',
      'I am devoted to you', 'You are my soulmate', 'I worship you', 'You are my life',
      'I am passionate about you', 'You are my world', 'I am fond of you', 'You are precious'
    ];

    // Neutral training data
    const neutralExamples = [
      'The weather is okay', 'This is fine', 'It is what it is', 'That is normal',
      'This is average', 'Nothing special', 'It is alright', 'This is typical',
      'That is standard', 'This is ordinary', 'It is acceptable', 'This is regular',
      'That is usual', 'This is common', 'It is decent', 'This is moderate',
      'That is conventional', 'This is adequate', 'It is satisfactory', 'This is basic'
    ];

    // Train the classifier
    joyExamples.forEach(text => this.classifier.addDocument(text.toLowerCase(), EMOTION_CATEGORIES.JOY));
    sadnessExamples.forEach(text => this.classifier.addDocument(text.toLowerCase(), EMOTION_CATEGORIES.SADNESS));
    angerExamples.forEach(text => this.classifier.addDocument(text.toLowerCase(), EMOTION_CATEGORIES.ANGER));
    fearExamples.forEach(text => this.classifier.addDocument(text.toLowerCase(), EMOTION_CATEGORIES.FEAR));
    surpriseExamples.forEach(text => this.classifier.addDocument(text.toLowerCase(), EMOTION_CATEGORIES.SURPRISE));
    loveExamples.forEach(text => this.classifier.addDocument(text.toLowerCase(), EMOTION_CATEGORIES.LOVE));
    neutralExamples.forEach(text => this.classifier.addDocument(text.toLowerCase(), EMOTION_CATEGORIES.NEUTRAL));

    this.classifier.train();
  }

  async predict(text: string): Promise<EmotionPrediction> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const processedText = this.textPreprocessor.preprocessText(text);
    const features = this.textPreprocessor.extractFeatures(text);

    // Get classification probabilities
    const classifications = this.classifier.getClassifications(processedText);
    
    // Convert to emotions object
    const allEmotions: Record<string, number> = {};
    classifications.forEach((classification: any) => {
      allEmotions[classification.label] = Math.round(classification.value * 100) / 100;
    });

    // Get the top emotion
    const topClassification = classifications[0];
    const emotion = topClassification.label;
    const confidence = Math.round(topClassification.value * 100) / 100;

    // Adjust confidence based on text features
    let adjustedConfidence = confidence;
    
    // Boost confidence for strong emotional indicators
    if (features.hasExclamation) adjustedConfidence = Math.min(1, adjustedConfidence + 0.1);
    if (features.hasCapitals) adjustedConfidence = Math.min(1, adjustedConfidence + 0.05);
    if (features.hasIntensifiers) adjustedConfidence = Math.min(1, adjustedConfidence + 0.1);
    if (features.hasEmotionalWords) adjustedConfidence = Math.min(1, adjustedConfidence + 0.15);

    // Lower confidence for very short texts
    if (features.wordCount < 3) adjustedConfidence = adjustedConfidence * 0.8;

    // Determine intensity
    const intensity = this.calculateIntensity(adjustedConfidence, features);

    return {
      emotion,
      confidence: Math.round(adjustedConfidence * 100) / 100,
      allEmotions,
      intensity,
    };
  }

  private calculateIntensity(confidence: number, features: any): 'low' | 'medium' | 'high' {
    let intensityScore = confidence;

    // Boost intensity for strong indicators
    if (features.hasExclamation) intensityScore += 0.1;
    if (features.hasCapitals) intensityScore += 0.1;
    if (features.hasIntensifiers) intensityScore += 0.2;
    if (features.hasEmotionalWords) intensityScore += 0.15;

    if (intensityScore >= 0.8) return 'high';
    if (intensityScore >= 0.6) return 'medium';
    return 'low';
  }
}
