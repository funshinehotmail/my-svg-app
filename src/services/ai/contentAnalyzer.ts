import type { ContentInput, ExtractedData, DataPoint, Relationship } from '../../types';

export class ContentAnalyzer {
  private static instance: ContentAnalyzer;
  
  static getInstance(): ContentAnalyzer {
    if (!ContentAnalyzer.instance) {
      ContentAnalyzer.instance = new ContentAnalyzer();
    }
    return ContentAnalyzer.instance;
  }

  async extractDataFromContent(content: ContentInput): Promise<ExtractedData> {
    console.log('🔍 Starting data extraction from content...');
    console.log('📝 Full content length:', content.content.length, 'characters');
    
    // CRITICAL: Preserve full content - no truncation
    const fullText = content.content;
    
    if (!fullText || fullText.trim().length === 0) {
      throw new Error('Content is empty or invalid');
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Extract key points (preserve full content analysis)
    console.log('📊 Extracting key points...');
    const keyPoints = this.extractKeyPoints(fullText);
    console.log('✅ Found', keyPoints.length, 'key points');
    
    // Extract numerical data points
    console.log('🔢 Extracting data points...');
    const dataPoints = this.extractDataPoints(fullText);
    console.log('✅ Found', dataPoints.length, 'data points');
    
    // Identify relationships between concepts
    console.log('🔗 Analyzing relationships...');
    const relationships = this.extractRelationships(fullText);
    console.log('✅ Found', relationships.length, 'relationships');
    
    // Analyze sentiment
    console.log('😊 Analyzing sentiment...');
    const sentiment = this.analyzeSentiment(fullText);
    console.log('✅ Sentiment:', sentiment);
    
    // Determine complexity
    console.log('🧠 Analyzing complexity...');
    const complexity = this.analyzeComplexity(fullText);
    console.log('✅ Complexity:', complexity);

    const extractedData: ExtractedData = {
      keyPoints,
      dataPoints,
      relationships,
      sentiment,
      complexity
    };

    console.log('🎉 Data extraction complete!');
    return extractedData;
  }

  private extractKeyPoints(content: string): string[] {
    console.log('🔍 Analyzing full content for key points...');
    
    // Split into sentences and analyze each one
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 10);
    console.log('📝 Processing', sentences.length, 'sentences');
    
    const importantKeywords = [
      'important', 'key', 'main', 'primary', 'significant', 'crucial', 'essential',
      'increase', 'decrease', 'growth', 'decline', 'improve', 'reduce',
      'first', 'second', 'third', 'finally', 'conclusion', 'result',
      'because', 'therefore', 'however', 'furthermore', 'moreover',
      'analysis', 'data', 'research', 'study', 'findings', 'evidence'
    ];

    // Score sentences based on importance indicators
    const scoredSentences = sentences.map(sentence => {
      const lowerSentence = sentence.toLowerCase();
      let score = 0;
      
      // Keyword matching
      importantKeywords.forEach(keyword => {
        if (lowerSentence.includes(keyword)) {
          score += 1;
        }
      });
      
      // Length bonus (longer sentences often contain more information)
      if (sentence.length > 50) score += 1;
      if (sentence.length > 100) score += 1;
      
      // Number presence (data-rich sentences)
      if (/\d+/.test(sentence)) score += 1;
      
      // Question format (often important)
      if (sentence.includes('?')) score += 1;
      
      return {
        sentence: sentence.trim(),
        score
      };
    });

    // Sort by score and take top sentences
    const topSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(10, Math.ceil(sentences.length * 0.3))) // Take top 30% or max 10
      .map(s => s.sentence);

    console.log('✅ Selected', topSentences.length, 'key points from', sentences.length, 'sentences');
    return topSentences;
  }

  private extractDataPoints(content: string): DataPoint[] {
    console.log('🔢 Extracting numerical data from full content...');
    const dataPoints: DataPoint[] = [];
    
    // Extract percentages
    const percentageRegex = /(\d+(?:\.\d+)?)\s*%/g;
    let match;
    while ((match = percentageRegex.exec(content)) !== null) {
      dataPoints.push({
        id: `percentage-${dataPoints.length}`,
        value: parseFloat(match[1]),
        label: `${match[1]}%`,
        category: 'percentage'
      });
    }

    // Extract currency amounts
    const currencyRegex = /\$(\d+(?:,\d{3})*(?:\.\d{2})?)/g;
    while ((match = currencyRegex.exec(content)) !== null) {
      const value = parseFloat(match[1].replace(/,/g, ''));
      dataPoints.push({
        id: `currency-${dataPoints.length}`,
        value,
        label: `$${match[1]}`,
        category: 'currency'
      });
    }

    // Extract years
    const yearRegex = /\b(19|20)\d{2}\b/g;
    while ((match = yearRegex.exec(content)) !== null) {
      dataPoints.push({
        id: `year-${dataPoints.length}`,
        value: parseInt(match[0]),
        label: match[0],
        category: 'year'
      });
    }

    // Extract general numbers with context
    const numberRegex = /(\w+)\s+(\d+(?:,\d{3})*(?:\.\d+)?)/g;
    while ((match = numberRegex.exec(content)) !== null) {
      const value = parseFloat(match[2].replace(/,/g, ''));
      if (value > 1) { // Filter out small numbers that might not be meaningful
        dataPoints.push({
          id: `number-${dataPoints.length}`,
          value,
          label: `${match[1]}: ${match[2]}`,
          category: 'metric'
        });
      }
    }

    // Extract ratings (e.g., "5 out of 10", "3/5 stars")
    const ratingRegex = /(\d+)\s*(?:out of|\/)\s*(\d+)/g;
    while ((match = ratingRegex.exec(content)) !== null) {
      const value = parseFloat(match[1]) / parseFloat(match[2]);
      dataPoints.push({
        id: `rating-${dataPoints.length}`,
        value,
        label: `${match[1]}/${match[2]}`,
        category: 'rating'
      });
    }

    console.log('✅ Extracted', dataPoints.length, 'data points');
    return dataPoints.slice(0, 20); // Limit to prevent overwhelming
  }

  private extractRelationships(content: string): Relationship[] {
    console.log('🔗 Analyzing relationships in full content...');
    const relationships: Relationship[] = [];
    const text = content.toLowerCase();

    // Causal relationships
    const causalIndicators = [
      'because', 'due to', 'caused by', 'results in', 'leads to', 'therefore',
      'consequently', 'as a result', 'thus', 'hence', 'so that'
    ];
    
    causalIndicators.forEach((indicator, index) => {
      const regex = new RegExp(`([^.!?]*?)\\s+${indicator}\\s+([^.!?]*?)`, 'gi');
      let match;
      while ((match = regex.exec(content)) !== null && relationships.length < 10) {
        relationships.push({
          id: `causal-${relationships.length}`,
          source: match[1].trim().substring(0, 50),
          target: match[2].trim().substring(0, 50),
          type: 'causal',
          strength: 0.8
        });
      }
    });

    // Temporal relationships
    const temporalIndicators = [
      'before', 'after', 'then', 'next', 'following', 'previously',
      'subsequently', 'meanwhile', 'during', 'while', 'when'
    ];
    
    temporalIndicators.forEach((indicator, index) => {
      const regex = new RegExp(`([^.!?]*?)\\s+${indicator}\\s+([^.!?]*?)`, 'gi');
      let match;
      while ((match = regex.exec(content)) !== null && relationships.length < 15) {
        relationships.push({
          id: `temporal-${relationships.length}`,
          source: match[1].trim().substring(0, 50),
          target: match[2].trim().substring(0, 50),
          type: 'temporal',
          strength: 0.7
        });
      }
    });

    // Comparison relationships
    const comparisonIndicators = [
      'compared to', 'versus', 'vs', 'higher than', 'lower than', 'better than',
      'worse than', 'similar to', 'different from', 'unlike', 'like'
    ];
    
    comparisonIndicators.forEach((indicator, index) => {
      const regex = new RegExp(`([^.!?]*?)\\s+${indicator}\\s+([^.!?]*?)`, 'gi');
      let match;
      while ((match = regex.exec(content)) !== null && relationships.length < 20) {
        relationships.push({
          id: `comparison-${relationships.length}`,
          source: match[1].trim().substring(0, 50),
          target: match[2].trim().substring(0, 50),
          type: 'correlational',
          strength: 0.6
        });
      }
    });

    console.log('✅ Found', relationships.length, 'relationships');
    return relationships;
  }

  private analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    console.log('😊 Analyzing sentiment...');
    
    const positiveWords = [
      'good', 'great', 'excellent', 'success', 'growth', 'increase', 'improve', 
      'better', 'positive', 'advantage', 'benefit', 'effective', 'efficient',
      'outstanding', 'remarkable', 'impressive', 'valuable', 'useful'
    ];
    
    const negativeWords = [
      'bad', 'poor', 'failure', 'decline', 'decrease', 'worse', 'negative', 
      'problem', 'issue', 'challenge', 'difficult', 'ineffective', 'useless',
      'terrible', 'awful', 'disappointing', 'concerning', 'problematic'
    ];

    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => 
      positiveWords.some(pos => word.includes(pos))
    ).length;
    
    const negativeCount = words.filter(word => 
      negativeWords.some(neg => word.includes(neg))
    ).length;

    console.log('📊 Sentiment analysis:', { positiveCount, negativeCount });

    if (positiveCount > negativeCount + 1) return 'positive';
    if (negativeCount > positiveCount + 1) return 'negative';
    return 'neutral';
  }

  private analyzeComplexity(content: string): 'low' | 'medium' | 'high' {
    console.log('🧠 Analyzing content complexity...');
    
    const wordCount = content.split(/\s+/).length;
    const sentenceCount = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
    const avgWordsPerSentence = wordCount / sentenceCount;

    // Check for complex indicators
    const complexIndicators = [
      'however', 'furthermore', 'nevertheless', 'consequently', 'therefore', 
      'moreover', 'additionally', 'specifically', 'particularly', 'essentially',
      'methodology', 'analysis', 'implementation', 'optimization', 'framework'
    ];
    
    const complexityScore = complexIndicators.filter(indicator => 
      content.toLowerCase().includes(indicator)
    ).length;

    // Technical terms
    const technicalTerms = [
      'algorithm', 'data', 'analysis', 'research', 'study', 'methodology',
      'framework', 'implementation', 'optimization', 'correlation', 'regression'
    ];
    
    const technicalScore = technicalTerms.filter(term =>
      content.toLowerCase().includes(term)
    ).length;

    console.log('📊 Complexity metrics:', {
      wordCount,
      avgWordsPerSentence: Math.round(avgWordsPerSentence),
      complexityScore,
      technicalScore
    });

    if (wordCount > 1000 || avgWordsPerSentence > 25 || complexityScore > 5 || technicalScore > 5) {
      return 'high';
    } else if (wordCount > 300 || avgWordsPerSentence > 18 || complexityScore > 2 || technicalScore > 2) {
      return 'medium';
    }
    return 'low';
  }
}

export const contentAnalyzer = ContentAnalyzer.getInstance();
