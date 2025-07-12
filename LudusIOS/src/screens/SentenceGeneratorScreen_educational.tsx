import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  Animated,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../styles/colors';
import {typography} from '../styles/typography';
import {commonStyles} from '../styles/commonStyles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

interface GeneratedSentence {
  id: string;
  latin: string;
  english: string;
  vocabulary: {word: string; meaning: string; partOfSpeech: string}[];
  grammar: string[];
  timestamp: Date;
}

interface Settings {
  wordsMode: 'study' | 'learn';
  difficulty: 'easy' | 'medium' | 'hard';
  selectedLists: string[];
}

const SentenceGeneratorScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  
  const [currentSentence, setCurrentSentence] = useState<GeneratedSentence | null>(null);
  const [recentSentences, setRecentSentences] = useState<GeneratedSentence[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  
  // Settings will be loaded from storage in real app
  const settings: Settings = {
    wordsMode: 'study',
    difficulty: 'medium',
    selectedLists: [],
  };

  const mockSentences: GeneratedSentence[] = [
    {
      id: '1',
      latin: 'Puella aquam amat.',
      english: 'The girl loves water.',
      vocabulary: [
        { word: 'puella', meaning: 'girl', partOfSpeech: 'noun' },
        { word: 'aquam', meaning: 'water (acc.)', partOfSpeech: 'noun' },
        { word: 'amat', meaning: 'loves', partOfSpeech: 'verb' },
      ],
      grammar: ['Present tense', 'Accusative direct object', '1st conjugation verb'],
      timestamp: new Date(),
    },
    {
      id: '2',
      latin: 'Magnus puer librum legit.',
      english: 'The big boy reads a book.',
      vocabulary: [
        { word: 'magnus', meaning: 'big, great', partOfSpeech: 'adjective' },
        { word: 'puer', meaning: 'boy', partOfSpeech: 'noun' },
        { word: 'librum', meaning: 'book (acc.)', partOfSpeech: 'noun' },
        { word: 'legit', meaning: 'reads', partOfSpeech: 'verb' },
      ],
      grammar: ['Present tense', 'Adjective agreement', '3rd conjugation verb'],
      timestamp: new Date(),
    },
    {
      id: '3',
      latin: 'Bona mater filiam vocat.',
      english: 'The good mother calls her daughter.',
      vocabulary: [
        { word: 'bona', meaning: 'good', partOfSpeech: 'adjective' },
        { word: 'mater', meaning: 'mother', partOfSpeech: 'noun' },
        { word: 'filiam', meaning: 'daughter (acc.)', partOfSpeech: 'noun' },
        { word: 'vocat', meaning: 'calls', partOfSpeech: 'verb' },
      ],
      grammar: ['Present tense', '1st conjugation verb', 'Family vocabulary'],
      timestamp: new Date(),
    },
  ];

  const availableWords = [
    'puella', 'puer', 'mater', 'pater', 'filius', 'filia',
    'aqua', 'liber', 'casa', 'villa', 'ager', 'silva',
    'amat', 'legit', 'vocat', 'videt', 'audit', 'scribit',
    'magnus', 'parvus', 'bonus', 'malus', 'novus', 'antiquus'
  ];

  // Animate screen entrance
  useFocusEffect(
    React.useCallback(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      return () => {
        fadeAnim.setValue(0);
        translateY.setValue(20);
      };
    }, [])
  );

  const generateSentence = async () => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    
    // Simulate generation delay
    setTimeout(() => {
      const randomSentence = mockSentences[Math.floor(Math.random() * mockSentences.length)];
      const newSentence: GeneratedSentence = {
        ...randomSentence,
        id: Date.now().toString(),
        timestamp: new Date(),
      };
      
      setCurrentSentence(newSentence);
      setRecentSentences(prev => [newSentence, ...prev.slice(0, 4)]);
      setIsGenerating(false);
    }, 2000);
  };

  const toggleWordSelection = (word: string) => {
    setSelectedWords(prev => 
      prev.includes(word) 
        ? prev.filter(w => w !== word)
        : [...prev, word]
    );
  };

  const generateWithSelectedWords = () => {
    if (selectedWords.length === 0) {
      generateSentence();
      return;
    }
    
    // In real app, this would generate using selected words
    generateSentence();
  };

  const saveWordToList = (word: string, meaning: string) => {
    // TODO: Save word to user's vocabulary list
    console.log('Saved word:', word, meaning);
  };

  const renderCurrentSentence = () => {
    if (!currentSentence && !isGenerating) {
      return (
        <View style={styles.emptyState}>
          <Icon name="document-text-outline" size={48} color={colors.neutral.lightGray} />
          <Text style={styles.emptyTitle}>Generate Your First Sentence</Text>
          <Text style={styles.emptyDescription}>
            Create Latin sentences using your vocabulary to practice grammar and word usage
          </Text>
        </View>
      );
    }

    if (isGenerating) {
      return (
        <View style={styles.generatingState}>
          <ActivityIndicator size="large" color={colors.primary.blue} />
          <Text style={styles.generatingText}>Generating sentence...</Text>
        </View>
      );
    }

    if (!currentSentence) return null;

    return (
      <View style={styles.sentenceCard}>
        <View style={styles.sentenceHeader}>
          <Text style={styles.latinSentence}>{currentSentence.latin}</Text>
          <TouchableOpacity 
            style={styles.pronounceButton}
            onPress={() => console.log('Pronounce')}
          >
            <Icon name="volume-high-outline" size={20} color={colors.primary.blue} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.englishTranslation}>{currentSentence.english}</Text>
        
        <View style={styles.vocabularySection}>
          <Text style={styles.sectionTitle}>Vocabulary</Text>
          {currentSentence.vocabulary.map((vocab, index) => (
            <View key={index} style={styles.vocabularyItem}>
              <View style={styles.vocabularyLeft}>
                <Text style={styles.vocabularyWord}>{vocab.word}</Text>
                <Text style={styles.vocabularyMeaning}>{vocab.meaning}</Text>
                <View style={styles.partOfSpeechBadge}>
                  <Text style={styles.partOfSpeechText}>{vocab.partOfSpeech}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.saveWordButton}
                onPress={() => saveWordToList(vocab.word, vocab.meaning)}
              >
                <Icon name="bookmark-outline" size={18} color={colors.primary.blue} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.grammarSection}>
          <Text style={styles.sectionTitle}>Grammar Notes</Text>
          {currentSentence.grammar.map((note, index) => (
            <View key={index} style={styles.grammarNote}>
              <Icon name="school-outline" size={16} color={colors.neutral.gray} />
              <Text style={styles.grammarText}>{note}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          {flex: 1},
          {
            opacity: fadeAnim,
            transform: [{translateY}],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sentence Generator</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => navigation.navigate('SentenceGeneratorSettings' as never)}
          >
            <Icon name="settings-outline" size={24} color={colors.neutral.darkGray} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Current Sentence Display */}
          {renderCurrentSentence()}

          {/* Generation Controls */}
          <View style={styles.controlsSection}>
            <Text style={styles.controlsTitle}>Generation Options</Text>
            
            {/* Prompt Input */}
            <View style={styles.promptSection}>
              <Text style={styles.promptLabel}>Custom prompt (optional)</Text>
              <TextInput
                style={styles.promptInput}
                placeholder="e.g., Create a sentence about family"
                placeholderTextColor={colors.neutral.lightGray}
                value={prompt}
                onChangeText={setPrompt}
                multiline
              />
            </View>

            {/* Word Selection */}
            <View style={styles.wordSelectionSection}>
              <Text style={styles.wordSelectionLabel}>Include specific words</Text>
              <View style={styles.wordTags}>
                {availableWords.slice(0, 12).map(word => (
                  <TouchableOpacity
                    key={word}
                    style={[
                      styles.wordTag,
                      selectedWords.includes(word) && styles.wordTagSelected
                    ]}
                    onPress={() => toggleWordSelection(word)}
                  >
                    <Text style={[
                      styles.wordTagText,
                      selectedWords.includes(word) && styles.wordTagTextSelected
                    ]}>
                      {word}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Generate Button */}
            <TouchableOpacity
              style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
              onPress={generateWithSelectedWords}
              disabled={isGenerating}
            >
              <Icon 
                name="create-outline" 
                size={20} 
                color={colors.neutral.white} 
              />
              <Text style={styles.generateButtonText}>
                {isGenerating ? 'Generating...' : 'Generate Sentence'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Recent Sentences */}
          {recentSentences.length > 0 && (
            <View style={styles.recentSection}>
              <Text style={styles.recentTitle}>Recent Sentences</Text>
              {recentSentences.map((sentence, index) => (
                <TouchableOpacity
                  key={sentence.id}
                  style={styles.recentSentenceItem}
                  onPress={() => setCurrentSentence(sentence)}
                >
                  <Text style={styles.recentLatin}>{sentence.latin}</Text>
                  <Text style={styles.recentEnglish}>{sentence.english}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.lightBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.neutral.darkGray,
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.neutral.darkGray,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDescription: {
    ...typography.body,
    color: colors.neutral.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  generatingState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  generatingText: {
    ...typography.body,
    color: colors.neutral.gray,
    marginTop: 16,
  },
  sentenceCard: {
    backgroundColor: colors.neutral.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sentenceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  latinSentence: {
    ...typography.h3,
    color: colors.neutral.darkGray,
    flex: 1,
    marginRight: 12,
  },
  pronounceButton: {
    padding: 4,
  },
  englishTranslation: {
    ...typography.body,
    color: colors.neutral.gray,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.neutral.darkGray,
    marginBottom: 12,
  },
  vocabularySection: {
    marginBottom: 20,
  },
  vocabularyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  vocabularyLeft: {
    flex: 1,
  },
  vocabularyWord: {
    ...typography.bodySmall,
    color: colors.neutral.darkGray,
    fontWeight: '600',
    marginBottom: 2,
  },
  vocabularyMeaning: {
    ...typography.caption,
    color: colors.neutral.gray,
    marginBottom: 4,
  },
  partOfSpeechBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.neutral.lightBackground,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  partOfSpeechText: {
    ...typography.caption,
    color: colors.neutral.gray,
    fontSize: 10,
  },
  saveWordButton: {
    padding: 8,
  },
  grammarSection: {
    // no additional margin needed
  },
  grammarNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  grammarText: {
    ...typography.caption,
    color: colors.neutral.gray,
    flex: 1,
  },
  controlsSection: {
    backgroundColor: colors.neutral.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
  },
  controlsTitle: {
    ...typography.h4,
    color: colors.neutral.darkGray,
    marginBottom: 16,
  },
  promptSection: {
    marginBottom: 20,
  },
  promptLabel: {
    ...typography.bodySmall,
    color: colors.neutral.darkGray,
    fontWeight: '600',
    marginBottom: 8,
  },
  promptInput: {
    ...typography.body,
    color: colors.neutral.darkGray,
    backgroundColor: colors.neutral.lightBackground,
    borderRadius: 8,
    padding: 12,
    minHeight: 44,
    maxHeight: 80,
    textAlignVertical: 'top',
  },
  wordSelectionSection: {
    marginBottom: 20,
  },
  wordSelectionLabel: {
    ...typography.bodySmall,
    color: colors.neutral.darkGray,
    fontWeight: '600',
    marginBottom: 12,
  },
  wordTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wordTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.neutral.lightBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  wordTagSelected: {
    backgroundColor: colors.primary.lightBlue,
    borderColor: colors.primary.blue,
  },
  wordTagText: {
    ...typography.caption,
    color: colors.neutral.gray,
    fontWeight: '500',
  },
  wordTagTextSelected: {
    color: colors.primary.darkBlue,
    fontWeight: '600',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.blue,
    paddingVertical: 14,
    borderRadius: 8,
    gap: 8,
  },
  generateButtonDisabled: {
    backgroundColor: colors.neutral.lightGray,
  },
  generateButtonText: {
    ...typography.button,
    color: colors.neutral.white,
    fontWeight: '600',
  },
  recentSection: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  recentTitle: {
    ...typography.h4,
    color: colors.neutral.darkGray,
    marginBottom: 12,
  },
  recentSentenceItem: {
    backgroundColor: colors.neutral.white,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  recentLatin: {
    ...typography.bodySmall,
    color: colors.neutral.darkGray,
    fontWeight: '600',
    marginBottom: 4,
  },
  recentEnglish: {
    ...typography.caption,
    color: colors.neutral.gray,
    fontStyle: 'italic',
  },
});

export default SentenceGeneratorScreen;