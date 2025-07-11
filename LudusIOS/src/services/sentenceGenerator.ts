interface GenerateSentenceRequest {
  wordsMode: 'study' | 'learn';
  difficulty: 'easy' | 'medium' | 'hard';
  focusVocab: string[];
  focusGrammar: string[];
  customPrompt?: string;
}

interface GenerateSentenceResponse {
  success: boolean;
  data?: {
    sentence: string;
    translation: string;
    explanation?: string;
  };
  error?: string;
}

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000'  // Development
  : 'https://your-deployed-backend.railway.app';  // Production

export class SentenceGeneratorService {
  static async generateSentence(settings: GenerateSentenceRequest): Promise<GenerateSentenceResponse> {
    try {
      const prompt = this.buildPrompt(settings);
      
      const response = await fetch(`${API_BASE_URL}/api/generate-sentence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate sentence');
      }

      // Parse the Claude response to extract sentence, translation, etc.
      return this.parseClaudeResponse(result.data.generated_text);
      
    } catch (error) {
      console.error('Sentence generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private static buildPrompt(settings: GenerateSentenceRequest): string {
    const modeDescription = settings.wordsMode === 'study'
      ? 'using only words from daily review (including suspended words) and selected grammar concepts'
      : 'introducing one word or grammar concept at a time';

    const difficultyDescription = {
      easy: 'simple sentences with basic vocabulary and grammar',
      medium: 'moderate complexity with varied sentence structures',
      hard: 'complex sentences with advanced grammar and vocabulary'
    }[settings.difficulty];

    let prompt = `Generate a Latin sentence ${modeDescription}. The difficulty should be ${settings.difficulty}: ${difficultyDescription}.`;

    if (settings.focusVocab.length > 0) {
      prompt += `\n\nFocus on vocabulary from: ${settings.focusVocab.join(', ')}`;
    }

    if (settings.focusGrammar.length > 0) {
      prompt += `\n\nEmphasize these grammar concepts: ${settings.focusGrammar.join(', ')}`;
    }

    prompt += `\n\nPlease provide:
1. A Latin sentence
2. English translation
3. Brief explanation of grammar concepts used

Format your response as:
**Latin:** [sentence]
**English:** [translation]
**Grammar:** [explanation]`;

    return prompt;
  }

  private static parseClaudeResponse(response: string): GenerateSentenceResponse {
    try {
      // Parse the formatted response from Claude
      const latinMatch = response.match(/\*\*Latin:\*\*\s*(.+?)(?=\*\*|$)/s);
      const englishMatch = response.match(/\*\*English:\*\*\s*(.+?)(?=\*\*|$)/s);
      const grammarMatch = response.match(/\*\*Grammar:\*\*\s*(.+?)(?=\*\*|$)/s);

      if (!latinMatch || !englishMatch) {
        throw new Error('Could not parse response format');
      }

      return {
        success: true,
        data: {
          sentence: latinMatch[1].trim(),
          translation: englishMatch[1].trim(),
          explanation: grammarMatch?.[1]?.trim() || '',
        },
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to parse generated content',
      };
    }
  }
}