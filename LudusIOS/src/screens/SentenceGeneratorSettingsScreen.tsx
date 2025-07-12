import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../styles/colors';
import {typography} from '../styles/typography';
import {commonStyles} from '../styles/commonStyles';
import {useNavigation} from '@react-navigation/native';

interface Settings {
  wordsMode: 'study' | 'learn';
  difficulty: 'easy' | 'medium' | 'hard';
  focusVocab: string[];
  focusGrammar: string[];
}

interface VocabSource {
  id: string;
  name: string;
  type: 'curriculum' | 'chapter' | 'list';
  wordCount: number;
  lastStudied: string;
}

interface GrammarConcept {
  id: string;
  name: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lastStudied: string;
}

const SentenceGeneratorSettingsScreen = () => {
  const navigation = useNavigation();
  const [settings, setSettings] = useState<Settings>({
    wordsMode: 'study',
    difficulty: 'medium',
    focusVocab: [],
    focusGrammar: [],
  });

  // Mock vocabulary sources
  const vocabSources: VocabSource[] = [
    { id: 'caesar-1', name: 'Caesar Chapter 1', type: 'chapter', wordCount: 45, lastStudied: '2024-07-11' },
    { id: 'caesar-2', name: 'Caesar Chapter 2', type: 'chapter', wordCount: 38, lastStudied: '2024-07-09' },
    { id: 'virgil-1', name: 'Virgil Book I', type: 'chapter', wordCount: 52, lastStudied: '2024-07-08' },
    { id: 'daily-review', name: 'Daily Review', type: 'list', wordCount: 120, lastStudied: '2024-07-10' },
    { id: 'family-vocab', name: 'Family & Home', type: 'list', wordCount: 28, lastStudied: '2024-07-05' },
    { id: 'time-numbers', name: 'Time & Numbers', type: 'list', wordCount: 31, lastStudied: '2024-07-03' },
  ].sort((a, b) => new Date(b.lastStudied).getTime() - new Date(a.lastStudied).getTime());

  // Mock grammar concepts
  const grammarConcepts: GrammarConcept[] = [
    { id: 'nom-acc', name: 'Nominative & Accusative', category: 'Cases', difficulty: 'beginner', lastStudied: '2024-07-11' },
    { id: 'gen-dat-abl', name: 'Genitive, Dative & Ablative', category: 'Cases', difficulty: 'intermediate', lastStudied: '2024-07-10' },
    { id: 'present-tense', name: 'Present Tense', category: 'Verbs', difficulty: 'beginner', lastStudied: '2024-07-08' },
    { id: 'perfect-tense', name: 'Perfect Tense', category: 'Verbs', difficulty: 'intermediate', lastStudied: '2024-07-07' },
    { id: 'subjunctive', name: 'Subjunctive Mood', category: 'Verbs', difficulty: 'advanced', lastStudied: '2024-07-06' },
    { id: 'adj-agreement', name: 'Adjective Agreement', category: 'Adjectives', difficulty: 'beginner', lastStudied: '2024-07-04' },
    { id: 'passive-voice', name: 'Passive Voice', category: 'Verbs', difficulty: 'intermediate', lastStudied: '2024-07-02' },
    { id: 'conditionals', name: 'Conditional Sentences', category: 'Syntax', difficulty: 'advanced', lastStudied: '2024-06-30' },
  ].sort((a, b) => new Date(b.lastStudied).getTime() - new Date(a.lastStudied).getTime());


  const toggleVocabSource = (sourceId: string) => {
    setSettings(prev => ({
      ...prev,
      focusVocab: prev.focusVocab.includes(sourceId)
        ? prev.focusVocab.filter(id => id !== sourceId)
        : [...prev.focusVocab, sourceId]
    }));
  };

  const toggleGrammarConcept = (conceptId: string) => {
    setSettings(prev => ({
      ...prev,
      focusGrammar: prev.focusGrammar.includes(conceptId)
        ? prev.focusGrammar.filter(id => id !== conceptId)
        : [...prev.focusGrammar, conceptId]
    }));
  };

  const renderVocabSource = (source: VocabSource) => {
    const isSelected = settings.focusVocab.includes(source.id);
    return (
      <TouchableOpacity
        key={source.id}
        style={[styles.selectionCard, isSelected && styles.selectionCardActive]}
        onPress={() => toggleVocabSource(source.id)}
      >
        <View style={styles.selectionHeader}>
          <View style={styles.selectionInfo}>
            <Text style={[styles.selectionTitle, isSelected && styles.selectionTitleActive]}>
              {source.name}
            </Text>
            <Text style={styles.selectionSubtitle}>
              {source.wordCount} words • {source.type}
            </Text>
          </View>
          <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
            {isSelected && <Icon name="checkmark" size={16} color={colors.neutral.white} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderGrammarConcept = (concept: GrammarConcept) => {
    const isSelected = settings.focusGrammar.includes(concept.id);
    const difficultyColors = {
      beginner: '#10b981',
      intermediate: '#f59e0b', 
      advanced: '#ef4444'
    };
    
    return (
      <TouchableOpacity
        key={concept.id}
        style={[styles.selectionCard, isSelected && styles.selectionCardActive]}
        onPress={() => toggleGrammarConcept(concept.id)}
      >
        <View style={styles.selectionHeader}>
          <View style={styles.selectionInfo}>
            <Text style={[styles.selectionTitle, isSelected && styles.selectionTitleActive]}>
              {concept.name}
            </Text>
            <View style={styles.conceptMeta}>
              <Text style={styles.selectionSubtitle}>{concept.category}</Text>
              <View style={[styles.difficultyBadge, {backgroundColor: difficultyColors[concept.difficulty]}]}>
                <Text style={styles.difficultyBadgeText}>{concept.difficulty}</Text>
              </View>
            </View>
          </View>
          <View style={[styles.checkbox, isSelected && styles.checkboxActive]}>
            {isSelected && <Icon name="checkmark" size={16} color={colors.neutral.white} />}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color={colors.neutral.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Generator Settings</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Words Mode Section */}
        <View style={styles.settingSection}>
          <Text style={styles.settingLabel}>Composition Mode</Text>
          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                settings.wordsMode === 'study' && styles.segmentButtonActive
              ]}
              onPress={() => setSettings(prev => ({...prev, wordsMode: 'study'}))}
            >
              <Text style={[
                styles.segmentText,
                settings.wordsMode === 'study' && styles.segmentTextActive
              ]}>
                Study
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.segmentButton,
                settings.wordsMode === 'learn' && styles.segmentButtonActive
              ]}
              onPress={() => setSettings(prev => ({...prev, wordsMode: 'learn'}))}
            >
              <Text style={[
                styles.segmentText,
                settings.wordsMode === 'learn' && styles.segmentTextActive
              ]}>
                Learn
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.settingDescription}>
            {settings.wordsMode === 'study' 
              ? 'Uses only words from your daily review (including suspended words) and selected grammar concepts'
              : 'Introduces one word or grammar concept at a time'
            }
          </Text>
        </View>

        {/* Difficulty Section */}
        <View style={styles.settingSection}>
          <Text style={styles.settingLabel}>Difficulty</Text>
          <View style={styles.difficultyButtons}>
            {(['easy', 'medium', 'hard'] as const).map(level => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.difficultyButton,
                  settings.difficulty === level && styles.difficultyButtonActive
                ]}
                onPress={() => setSettings(prev => ({...prev, difficulty: level}))}
              >
                <Text style={[
                  styles.difficultyText,
                  settings.difficulty === level && styles.difficultyTextActive
                ]}>
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.settingDescription}>
            {settings.difficulty === 'easy' && 'Simple sentences with basic vocabulary and grammar'}
            {settings.difficulty === 'medium' && 'Moderate complexity with varied sentence structures'}
            {settings.difficulty === 'hard' && 'Complex sentences with advanced grammar and vocabulary'}
          </Text>
        </View>

        {/* Focus Vocab Section */}
        <View style={styles.settingSection}>
          <Text style={styles.settingLabel}>Focus Vocab</Text>
          <Text style={styles.settingDescription}>
            Select specific chapters or lists to focus on
          </Text>
          <ScrollView 
            style={styles.scrollableSelection}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.selectionContainer}>
              {vocabSources.map(renderVocabSource)}
            </View>
          </ScrollView>
          {settings.focusVocab.length > 0 && (
            <Text style={styles.selectionSummary}>
              {settings.focusVocab.length} source{settings.focusVocab.length !== 1 ? 's' : ''} selected
            </Text>
          )}
        </View>

        {/* Focus Grammar Section */}
        <View style={styles.settingSection}>
          <Text style={styles.settingLabel}>Focus Grammar</Text>
          <Text style={styles.settingDescription}>
            Select specific grammar concepts to emphasize
          </Text>
          <ScrollView 
            style={styles.scrollableSelection}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.selectionContainer}>
              {grammarConcepts.map(renderGrammarConcept)}
            </View>
          </ScrollView>
          {settings.focusGrammar.length > 0 && (
            <Text style={styles.selectionSummary}>
              {settings.focusGrammar.length} concept{settings.focusGrammar.length !== 1 ? 's' : ''} selected
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.neutral.darkGray,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
    backgroundColor: colors.neutral.lightBackground,
  },
  settingSection: {
    backgroundColor: colors.neutral.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingLabel: {
    ...typography.h4,
    color: colors.neutral.darkGray,
    marginBottom: 8,
  },
  settingDescription: {
    ...typography.bodySmall,
    color: colors.neutral.gray,
    marginTop: 8,
    lineHeight: 18,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.lightBackground,
    borderRadius: 8,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentButtonActive: {
    backgroundColor: colors.neutral.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    ...typography.bodySmall,
    color: colors.neutral.gray,
    fontWeight: '500',
  },
  segmentTextActive: {
    color: colors.primary.blue,
    fontWeight: '600',
  },
  difficultyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: colors.neutral.lightBackground,
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  difficultyButtonActive: {
    backgroundColor: colors.primary.lightBlue,
    borderColor: colors.primary.blue,
  },
  difficultyText: {
    ...typography.bodySmall,
    color: colors.neutral.gray,
    fontWeight: '500',
  },
  difficultyTextActive: {
    color: colors.primary.darkBlue,
    fontWeight: '600',
  },
  scrollableSelection: {
    maxHeight: 300,
    marginTop: 12,
  },
  selectionContainer: {
    gap: 8,
  },
  selectionCard: {
    backgroundColor: colors.neutral.lightBackground,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  selectionCardActive: {
    backgroundColor: colors.primary.lightBlue,
    borderColor: colors.primary.blue,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectionInfo: {
    flex: 1,
  },
  selectionTitle: {
    ...typography.bodySmall,
    color: colors.neutral.darkGray,
    fontWeight: '600',
    marginBottom: 2,
  },
  selectionTitleActive: {
    color: colors.primary.darkBlue,
  },
  selectionSubtitle: {
    ...typography.caption,
    color: colors.neutral.gray,
  },
  conceptMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  difficultyBadgeText: {
    ...typography.caption,
    color: colors.neutral.white,
    fontSize: 10,
    fontWeight: '600',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.neutral.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkboxActive: {
    backgroundColor: colors.primary.blue,
    borderColor: colors.primary.blue,
  },
  selectionSummary: {
    ...typography.caption,
    color: colors.primary.blue,
    marginTop: 8,
    fontWeight: '600',
  },
});

export default SentenceGeneratorSettingsScreen;