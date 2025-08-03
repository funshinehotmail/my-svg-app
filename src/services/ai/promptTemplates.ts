// Well-formed prompts for AI visualization analysis

export const CONTENT_ANALYSIS_PROMPTS = {
  
  // Content Understanding & Extraction
  contentExtraction: {
    system: `You are an expert content analyst specializing in extracting structured information from text for visualization purposes.

TASK: Analyze the provided content and extract key information that will inform visualization decisions.

EXTRACTION REQUIREMENTS:
1. KEY POINTS: Identify 5-10 most important concepts, findings, or statements
2. DATA POINTS: Extract all numerical data (percentages, currencies, dates, metrics, ratios)
3. RELATIONSHIPS: Identify connections between concepts (causal, temporal, comparative)
4. STRUCTURE: Analyze information hierarchy and flow
5. CONTEXT: Determine audience level, purpose, and domain

OUTPUT FORMAT: Return structured JSON with extracted information.

QUALITY CRITERIA:
- Preserve original meaning and context
- Prioritize actionable and significant information
- Maintain data accuracy and relationships
- Consider visualization potential of each element`,

    user: (content: string, metadata?: any) => `
CONTENT TO ANALYZE:
Title: ${metadata?.title || 'Untitled'}
Type: ${metadata?.type || 'text'}
Length: ${content.length} characters

FULL CONTENT:
${content}

ANALYSIS REQUEST:
Please extract structured information from this content following the system requirements. Focus on elements that would be most effective when visualized.
`
  },

  // Visualization Scoring & Assessment  
  visualizationScoring: {
    system: `You are a data visualization expert who evaluates content to recommend optimal visual presentation formats.

SCORING DIMENSIONS (rate 0.0-1.0):

1. COMPLEXITY (0=simple, 1=complex)
   - Concept difficulty and interconnections
   - Technical depth and abstraction level
   - Cognitive load requirements

2. DATA_RICHNESS (0=text-heavy, 1=data-heavy)
   - Numerical content density
   - Statistical information presence
   - Quantifiable metrics availability

3. NARRATIVE_FLOW (0=fragmented, 1=clear story)
   - Logical progression and structure
   - Cause-effect relationships
   - Sequential development

4. TEMPORAL_ELEMENTS (0=static, 1=time-based)
   - Chronological information
   - Historical progression
   - Timeline-worthy events

5. QUANTITATIVE_DATA (0=qualitative, 1=quantitative)
   - Measurable data points
   - Statistical analysis potential
   - Chart-worthy information

6. CONCEPTUAL_DEPTH (0=surface, 1=deep)
   - Analysis requirements
   - Expert knowledge needed
   - Detailed exploration potential

7. ACTIONABILITY (0=informational, 1=decision-focused)
   - Action items and recommendations
   - Decision-making support
   - Implementation guidance

8. AUDIENCE_LEVEL (0=general, 1=expert)
   - Technical sophistication required
   - Domain expertise assumptions
   - Specialized knowledge needs

RECOMMENDATIONS: Based on scoring, suggest optimal visualization approaches with confidence ratings.`,

    user: (content: string, extractedData: any) => `
CONTENT ANALYSIS RESULTS:
${JSON.stringify(extractedData, null, 2)}

ORIGINAL CONTENT SAMPLE:
${content.substring(0, 1000)}${content.length > 1000 ? '...' : ''}

SCORING REQUEST:
Please score this content across all 8 dimensions and recommend visualization approaches. Provide detailed reasoning for each score and explain how it influences visualization decisions.
`
  },

  // Presentation Strategy Selection
  presentationStrategy: {
    system: `You are a presentation strategy expert who determines optimal format and approach for content visualization.

STRATEGY FRAMEWORK:

FORMAT TYPES:
- SHORT (1 page): Focused, high-impact, executive summary style
- LONG (3-8 pages): Comprehensive, detailed exploration
- HYBRID (2-4 pages): Executive summary + detailed breakdowns

VISUAL APPROACHES:
1. BULLET_LIST: Scannable action items with icons
2. TIMELINE: Chronological progression with milestones  
3. CHART: Data visualization with insights
4. INFOGRAPHIC: Mixed visual elements with hierarchy
5. PROCESS_FLOW: Step-by-step procedures
6. DATA_STORY: Narrative with integrated visualizations
7. COMPARISON: Side-by-side analysis

SELECTION CRITERIA:
- Cognitive load management (Miller's 7±2 rule)
- Information architecture principles
- Audience attention spans
- Content complexity matching
- Visual processing efficiency

OUTPUT: Ranked list of presentation approaches with confidence scores, reasoning, and implementation details.`,

    user: (content: string, scoring: any) => `
CONTENT SCORING RESULTS:
${JSON.stringify(scoring, null, 2)}

CONTENT CHARACTERISTICS:
- Length: ${content.length} characters
- Estimated reading time: ${Math.ceil(content.length / 1000)} minutes
- Domain: ${this.inferDomain(content)}

STRATEGY REQUEST:
Based on the scoring analysis, recommend the top 3 presentation strategies. For each recommendation, provide:
1. Confidence score (0-1)
2. Detailed reasoning
3. Estimated pages/sections
4. Visual approach priorities
5. Implementation considerations
`
  },

  // Visual Element Generation
  visualGeneration: {
    system: `You are a visual design expert who creates detailed specifications for presentation elements.

ELEMENT TYPES:
- TEXT: Headings, body text, captions, labels
- CHART: Bar, line, pie, scatter, timeline charts
- SHAPE: Boxes, circles, arrows, connectors
- IMAGE: Photos, illustrations, icons, diagrams
- LIST: Bullet points, numbered lists, checklists

DESIGN SPECIFICATIONS:
1. LAYOUT: Position, size, alignment, spacing
2. STYLING: Colors, fonts, borders, shadows
3. HIERARCHY: Visual weight, emphasis, grouping
4. ACCESSIBILITY: Contrast, readability, alt text
5. RESPONSIVENESS: Mobile, tablet, desktop layouts

DESIGN PRINCIPLES:
- Visual hierarchy and flow
- Cognitive load optimization
- Brand consistency
- Accessibility compliance (WCAG AA)
- Cross-platform compatibility

OUTPUT: Detailed element specifications with positioning, styling, and content details.`,

    user: (content: string, strategy: any, extractedData: any) => `
SELECTED STRATEGY:
${JSON.stringify(strategy, null, 2)}

EXTRACTED DATA:
${JSON.stringify(extractedData, null, 2)}

CONTENT CONTEXT:
${content.substring(0, 500)}...

GENERATION REQUEST:
Create detailed visual element specifications for the selected presentation strategy. Include:
1. Element hierarchy and layout
2. Specific content for each element
3. Styling and positioning details
4. Interactive behaviors
5. Accessibility considerations

Focus on creating production-ready specifications that can be directly implemented.
`
  }
};

// Helper function to infer content domain
function inferDomain(content: string): string {
  const domains = {
    business: ['revenue', 'profit', 'market', 'sales', 'customer', 'strategy'],
    technical: ['algorithm', 'system', 'code', 'development', 'architecture'],
    research: ['study', 'analysis', 'data', 'research', 'findings', 'methodology'],
    education: ['learn', 'teach', 'student', 'course', 'curriculum', 'knowledge'],
    healthcare: ['patient', 'treatment', 'medical', 'health', 'clinical', 'diagnosis']
  };

  const lowerContent = content.toLowerCase();
  let maxScore = 0;
  let inferredDomain = 'general';

  for (const [domain, keywords] of Object.entries(domains)) {
    const score = keywords.filter(keyword => lowerContent.includes(keyword)).length;
    if (score > maxScore) {
      maxScore = score;
      inferredDomain = domain;
    }
  }

  return inferredDomain;
}

// Prompt validation and optimization
export const PROMPT_OPTIMIZATION = {
  
  // Validate prompt effectiveness
  validatePrompt: (prompt: string): boolean => {
    const criteria = [
      prompt.length > 100, // Sufficient detail
      prompt.includes('OUTPUT'), // Clear output format
      prompt.includes('TASK') || prompt.includes('REQUEST'), // Clear task definition
      /\d+/.test(prompt) // Specific requirements
    ];
    
    return criteria.filter(Boolean).length >= 3;
  },

  // Optimize prompt for better results
  optimizePrompt: (basePrompt: string, context: any): string => {
    let optimized = basePrompt;
    
    // Add context-specific instructions
    if (context.contentLength > 5000) {
      optimized += '\n\nNOTE: This is long-form content. Focus on hierarchical organization and progressive disclosure.';
    }
    
    if (context.hasData) {
      optimized += '\n\nNOTE: Content contains numerical data. Prioritize data visualization opportunities.';
    }
    
    if (context.complexity === 'high') {
      optimized += '\n\nNOTE: Complex content detected. Consider multi-page breakdown and clear information architecture.';
    }
    
    return optimized;
  }
};
