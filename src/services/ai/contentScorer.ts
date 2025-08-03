import type { ContentInput, ContentScoring, PresentationApproach, ExtractedData } from '../../types';

export interface ScoringMetrics {
  complexity: number;        // 0-1: Simple concepts vs complex relationships
  dataRichness: number;     // 0-1: Text-heavy vs data/numbers heavy
  narrativeFlow: number;    // 0-1: Fragmented vs clear story progression
  temporalElements: number; // 0-1: Static vs time-based information
  quantitativeData: number; // 0-1: Qualitative vs quantitative focus
  conceptualDepth: number;  // 0-1: Surface-level vs deep analysis required
  actionability: number;    // 0-1: Informational vs requires decisions/actions
  audienceLevel: number;    // 0-1: General audience vs expert/technical
}

export interface ContentCharacteristics {
  wordCount: number;
  sentenceComplexity: number;
  technicalTerms: string[];
  dataPoints: number;
  timeReferences: number;
  actionWords: number;
  questionCount: number;
  listStructures: number;
}

export class ContentScorer {
  private static instance: ContentScorer;
  
  static getInstance(): ContentScorer {
    if (!ContentScorer.instance) {
      ContentScorer.instance = new ContentScorer();
    }
    return ContentScorer.instance;
  }

  async scoreContent(content: ContentInput, extractedData: ExtractedData): Promise<ScoringMetrics> {
    const characteristics = this.analyzeCharacteristics(content.content);
    
    return {
      complexity: this.calculateComplexity(characteristics, extractedData),
      dataRichness: this.calculateDataRichness(characteristics, extractedData),
      narrativeFlow: this.calculateNarrativeFlow(characteristics, content.content),
      temporalElements: this.calculateTemporalElements(extractedData),
      quantitativeData: this.calculateQuantitativeData(extractedData),
      conceptualDepth: this.calculateConceptualDepth(characteristics, content.content),
      actionability: this.calculateActionability(content.content),
      audienceLevel: this.calculateAudienceLevel(characteristics)
    };
  }

  private analyzeCharacteristics(content: string): ContentCharacteristics {
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    // Technical terms detection
    const technicalIndicators = [
      'algorithm', 'methodology', 'framework', 'implementation', 'optimization',
      'analysis', 'correlation', 'regression', 'hypothesis', 'variable',
      'coefficient', 'statistical', 'empirical', 'quantitative', 'qualitative'
    ];
    
    const technicalTerms = words.filter(word => 
      technicalIndicators.some(term => 
        word.toLowerCase().includes(term.toLowerCase())
      )
    );

    // Time references
    const timeIndicators = [
      'january', 'february', 'march', 'april', 'may', 'june',
      'july', 'august', 'september', 'october', 'november', 'december',
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
      'yesterday', 'today', 'tomorrow', 'week', 'month', 'year',
      'before', 'after', 'during', 'since', 'until', 'timeline'
    ];
    
    const timeReferences = content.toLowerCase().split(/\s+/).filter(word =>
      timeIndicators.includes(word) || /\b(19|20)\d{2}\b/.test(word)
    ).length;

    // Action words
    const actionWords = [
      'implement', 'execute', 'develop', 'create', 'build', 'design',
      'analyze', 'evaluate', 'assess', 'review', 'improve', 'optimize',
      'should', 'must', 'need', 'require', 'recommend', 'suggest'
    ];
    
    const actionCount = words.filter(word =>
      actionWords.some(action => word.toLowerCase().includes(action))
    ).length;

    // List structures
    const listStructures = (content.match(/^\s*[-•*]\s/gm) || []).length +
                          (content.match(/^\s*\d+\.\s/gm) || []).length;

    return {
      wordCount: words.length,
      sentenceComplexity: words.length / sentences.length,
      technicalTerms,
      dataPoints: (content.match(/\d+/g) || []).length,
      timeReferences,
      actionWords: actionCount,
      questionCount: (content.match(/\?/g) || []).length,
      listStructures
    };
  }

  private calculateComplexity(chars: ContentCharacteristics, data: ExtractedData): number {
    let complexity = 0;
    
    // Sentence complexity (longer sentences = more complex)
    complexity += Math.min(chars.sentenceComplexity / 25, 0.3);
    
    // Technical terms density
    complexity += Math.min(chars.technicalTerms.length / chars.wordCount * 10, 0.3);
    
    // Relationship complexity
    complexity += Math.min(data.relationships.length / 10, 0.2);
    
    // Conceptual depth from key points
    const conceptualIndicators = ['however', 'furthermore', 'consequently', 'nevertheless'];
    const conceptualWords = data.keyPoints.join(' ').toLowerCase();
    const conceptualScore = conceptualIndicators.filter(indicator => 
      conceptualWords.includes(indicator)
    ).length;
    complexity += Math.min(conceptualScore / 5, 0.2);
    
    return Math.min(complexity, 1);
  }

  private calculateDataRichness(chars: ContentCharacteristics, data: ExtractedData): number {
    let richness = 0;
    
    // Number of data points
    richness += Math.min(data.dataPoints.length / 10, 0.4);
    
    // Numerical density in text
    richness += Math.min(chars.dataPoints / chars.wordCount * 20, 0.3);
    
    // Variety of data types
    const dataTypes = new Set(data.dataPoints.map(d => d.category));
    richness += Math.min(dataTypes.size / 5, 0.3);
    
    return Math.min(richness, 1);
  }

  private calculateNarrativeFlow(chars: ContentCharacteristics, content: string): number {
    let flow = 0;
    
    // Transition words indicating flow
    const transitionWords = [
      'first', 'second', 'third', 'finally', 'then', 'next', 'after',
      'before', 'meanwhile', 'subsequently', 'therefore', 'thus', 'hence'
    ];
    
    const transitions = content.toLowerCase().split(/\s+/).filter(word =>
      transitionWords.includes(word)
    ).length;
    
    flow += Math.min(transitions / chars.wordCount * 50, 0.4);
    
    // Paragraph structure (more paragraphs = better flow)
    const paragraphs = content.split(/\n\s*\n/).length;
    flow += Math.min(paragraphs / 10, 0.3);
    
    // Question-answer patterns
    flow += Math.min(chars.questionCount / 5, 0.3);
    
    return Math.min(flow, 1);
  }

  private calculateTemporalElements(data: ExtractedData): number {
    let temporal = 0;
    
    // Time-based data points
    const timeData = data.dataPoints.filter(d => 
      d.category === 'year' || d.category === 'date'
    );
    temporal += Math.min(timeData.length / 5, 0.5);
    
    // Temporal relationships
    const temporalRels = data.relationships.filter(r => r.type === 'temporal');
    temporal += Math.min(temporalRels.length / 3, 0.5);
    
    return Math.min(temporal, 1);
  }

  private calculateQuantitativeData(data: ExtractedData): number {
    let quantitative = 0;
    
    // Numerical data points
    const numericalData = data.dataPoints.filter(d => 
      typeof d.value === 'number' && d.category !== 'year'
    );
    quantitative += Math.min(numericalData.length / 8, 0.6);
    
    // Statistical indicators
    const statKeywords = ['average', 'mean', 'median', 'percentage', 'ratio', 'correlation'];
    const statCount = data.keyPoints.join(' ').toLowerCase().split(/\s+/).filter(word =>
      statKeywords.some(stat => word.includes(stat))
    ).length;
    quantitative += Math.min(statCount / 5, 0.4);
    
    return Math.min(quantitative, 1);
  }

  private calculateConceptualDepth(chars: ContentCharacteristics, content: string): number {
    let depth = 0;
    
    // Abstract concepts
    const abstractWords = [
      'concept', 'theory', 'principle', 'framework', 'paradigm',
      'philosophy', 'methodology', 'approach', 'strategy', 'model'
    ];
    
    const abstractCount = content.toLowerCase().split(/\s+/).filter(word =>
      abstractWords.some(abs => word.includes(abs))
    ).length;
    
    depth += Math.min(abstractCount / chars.wordCount * 20, 0.4);
    
    // Technical term density
    depth += Math.min(chars.technicalTerms.length / chars.wordCount * 15, 0.3);
    
    // Word length (longer words often indicate complexity)
    const avgWordLength = content.split(/\s+/).reduce((sum, word) => 
      sum + word.length, 0
    ) / chars.wordCount;
    depth += Math.min((avgWordLength - 4) / 6, 0.3);
    
    return Math.min(depth, 1);
  }

  private calculateActionability(content: string): number {
    let actionability = 0;
    
    // Imperative verbs
    const imperatives = [
      'implement', 'execute', 'develop', 'create', 'build', 'design',
      'analyze', 'evaluate', 'review', 'improve', 'optimize', 'consider',
      'should', 'must', 'need', 'require', 'recommend', 'suggest'
    ];
    
    const actionCount = content.toLowerCase().split(/\s+/).filter(word =>
      imperatives.some(imp => word.includes(imp))
    ).length;
    
    actionability += Math.min(actionCount / content.split(/\s+/).length * 20, 0.5);
    
    // Decision points
    const decisionWords = ['choose', 'decide', 'select', 'option', 'alternative'];
    const decisionCount = content.toLowerCase().split(/\s+/).filter(word =>
      decisionWords.some(dec => word.includes(dec))
    ).length;
    
    actionability += Math.min(decisionCount / 10, 0.3);
    
    // Future tense (indicates planning/action)
    const futureIndicators = ['will', 'shall', 'going to', 'plan to', 'intend to'];
    const futureCount = futureIndicators.filter(indicator =>
      content.toLowerCase().includes(indicator)
    ).length;
    
    actionability += Math.min(futureCount / 5, 0.2);
    
    return Math.min(actionability, 1);
  }

  private calculateAudienceLevel(chars: ContentCharacteristics): number {
    let level = 0;
    
    // Technical term density (higher = more expert audience)
    level += Math.min(chars.technicalTerms.length / chars.wordCount * 10, 0.4);
    
    // Sentence complexity
    level += Math.min((chars.sentenceComplexity - 10) / 20, 0.3);
    
    // Jargon indicators
    const jargonWords = [
      'leverage', 'synergy', 'paradigm', 'optimization', 'methodology',
      'implementation', 'infrastructure', 'scalability', 'architecture'
    ];
    
    const jargonCount = chars.technicalTerms.filter(term =>
      jargonWords.some(jargon => term.toLowerCase().includes(jargon))
    ).length;
    
    level += Math.min(jargonCount / 5, 0.3);
    
    return Math.min(level, 1);
  }
}

export const contentScorer = ContentScorer.getInstance();
