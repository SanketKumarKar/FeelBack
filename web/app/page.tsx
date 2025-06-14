'use client';

import { Card, Text, Metric } from '@tremor/react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

export default function IndexPage() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  const [moodInput, setMoodInput] = useState('');
  const [selectedEra, setSelectedEra] = useState('2000s');
  const [selectedStyle, setSelectedStyle] = useState('pop culture');
  const [generatedText, setGeneratedText] = useState('');
  const [generatedImageUrl, setGeneratedImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGenerateNostalgia = async () => {
    setLoading(true);
    setError(null);
    setGeneratedText('');
    setGeneratedImageUrl('');

    try {
      // Step 1: Analyze emotion from text
      const emotionResponse = await fetch('http://localhost:3000/emotions/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: moodInput }),
      });

      if (!emotionResponse.ok) {
        throw new Error(`Emotion analysis failed: ${emotionResponse.statusText}`);
      }
      const { emotion } = await emotionResponse.json();

      // Step 2: Generate nostalgic content
      const nostalgiaResponse = await fetch('http://localhost:3001/nostalgia/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emotion,
          era: selectedEra,
          style: selectedStyle,
        }),
      });

      if (!nostalgiaResponse.ok) {
        throw new Error(`Nostalgia generation failed: ${nostalgiaResponse.statusText}`);
      }
      const { text, imageUrl } = await nostalgiaResponse.json();

      setGeneratedText(text);
      setGeneratedImageUrl(imageUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold mb-6">Welcome to FeelBack!</h1>
      
      {/* Theme Switcher */}
      <div className="mb-6">
        <label htmlFor="theme-select" className="mr-2">Choose Theme:</label>
        <select
          id="theme-select"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        <Card className="max-w-xs mx-auto" decoration="top" decorationColor="indigo">
          <Text>Total Users</Text>
          <Metric>12,345</Metric>
        </Card>
        <Card className="max-w-xs mx-auto" decoration="top" decorationColor="rose">
          <Text>Nostalgia Generated</Text>
          <Metric>98,765</Metric>
        </Card>
      </div>

      {/* Content Generation Section */}
      <section className="mb-10 p-6 border rounded-lg shadow-lg bg-white dark:bg-gray-800">
        <h2 className="text-2xl font-semibold mb-4">Generate Nostalgia</h2>
        
        {/* Mood Input */}
        <div className="mb-4">
          <label htmlFor="mood-input" className="block text-lg font-medium mb-2">What's your mood today?</label>
          <textarea
            id="mood-input"
            className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            rows={4}
            placeholder="e.g., I'm feeling happy and nostalgic for the 90s..."
            value={moodInput}
            onChange={(e) => setMoodInput(e.target.value)}
          ></textarea>
        </div>

        {/* Era and Style Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="era-select" className="block text-lg font-medium mb-2">Select Era:</label>
            <select
              id="era-select"
              value={selectedEra}
              onChange={(e) => setSelectedEra(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="80s">1980s</option>
              <option value="90s">1990s</option>
              <option value="2000s">2000s</option>
              <option value="2010s">2010s</option>
            </select>
          </div>
          <div>
            <label htmlFor="style-select" className="block text-lg font-medium mb-2">Select Style:</label>
            <select
              id="style-select"
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="pop culture">Pop Culture</option>
              <option value="vintage">Vintage</option>
              <option value="futuristic">Futuristic</option>
              <option value="minimalist">Minimalist</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateNostalgia}
          disabled={loading || !moodInput.trim()}
          className="w-full bg-blue-600 text-white p-3 rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Generating...' : 'Generate Nostalgia'}
        </button>

        {/* Error Display */}
        {error && <p className="text-red-500 mt-4">Error: {error}</p>}

        {/* Generated Content Display */}
        {generatedText && (
          <div className="mt-8 p-6 border rounded-lg shadow-md bg-gray-50 dark:bg-gray-700">
            <h3 className="text-xl font-semibold mb-3">Your Nostalgia:</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-200">{generatedText}</p>
            {generatedImageUrl && (
              <img
                src={generatedImageUrl}
                alt="Generated Nostalgia"
                className="w-full h-auto rounded-md object-cover max-h-96"
              />
            )}
          </div>
        )}
      </section>

      {/* Nostalgia Feed Section */}
      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Your Nostalgia Feed</h2>
        <p>More nostalgic content and social challenges will appear here.</p>
      </section>
    </main>
  );
}