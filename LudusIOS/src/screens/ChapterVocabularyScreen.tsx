import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../styles/colors';
import {typography} from '../styles/typography';
import {commonStyles} from '../styles/commonStyles';
import {useNavigation, useRoute, useFocusEffect} from '@react-navigation/native';

interface VocabularyWord {
  id: string;
  latin: string;
  english: string;
  partOfSpeech: string;
  gender?: string;
  declension?: string;
  conjugation?: string;
  isKnown: boolean;
}

const ChapterVocabularyScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {chapterId, chapterName, curriculumName, color} = route.params as any;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  
  // Mock data - in real app would be fetched based on chapterId
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([
    { id: '1', latin: 'puella', english: 'girl', partOfSpeech: 'noun', gender: 'f', declension: '1st', isKnown: true },
    { id: '2', latin: 'puer', english: 'boy', partOfSpeech: 'noun', gender: 'm', declension: '2nd', isKnown: true },
    { id: '3', latin: 'aqua', english: 'water', partOfSpeech: 'noun', gender: 'f', declension: '1st', isKnown: false },
    { id: '4', latin: 'liber', english: 'book', partOfSpeech: 'noun', gender: 'm', declension: '2nd', isKnown: false },
    { id: '5', latin: 'amare', english: 'to love', partOfSpeech: 'verb', conjugation: '1st', isKnown: true },
    { id: '6', latin: 'videre', english: 'to see', partOfSpeech: 'verb', conjugation: '2nd', isKnown: false },
    { id: '7', latin: 'magnus', english: 'great, large', partOfSpeech: 'adjective', isKnown: true },
    { id: '8', latin: 'bonus', english: 'good', partOfSpeech: 'adjective', isKnown: false },
  ]);
  
  const knownCount = vocabulary.filter(word => word.isKnown).length;
  const progress = Math.round((knownCount / vocabulary.length) * 100);
  
  // Animate screen entrance and set status bar
  useFocusEffect(
    React.useCallback(() => {
      // Set status bar style for this screen
      StatusBar.setBarStyle('dark-content', true);
      
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
  
  const toggleWordKnown = (wordId: string) => {
    setVocabulary(prev => 
      prev.map(word => 
        word.id === wordId ? {...word, isKnown: !word.isKnown} : word
      )
    );
  };
  
  const renderVocabularyCard = (word: VocabularyWord) => {
    return (
      <TouchableOpacity
        key={word.id}
        style={[styles.wordCard, word.isKnown && styles.wordCardKnown]}
        onPress={() => toggleWordKnown(word.id)}
      >
        <View style={styles.wordHeader}>
          <View style={styles.wordInfo}>
            <Text style={[styles.latinWord, word.isKnown && styles.wordKnownText]}>
              {word.latin}
            </Text>
            <Text style={[styles.englishWord, word.isKnown && styles.wordKnownText]}>
              {word.english}
            </Text>
          </View>
          <Icon 
            name={word.isKnown ? "checkmark-circle" : "checkmark-circle-outline"} 
            size={24} 
            color={word.isKnown ? color : colors.neutral.lightGray} 
          />
        </View>
        
        <View style={styles.badgeContainer}>
          <View style={[commonStyles.badge, styles.partOfSpeechBadge]}>
            <Text style={commonStyles.badgeText}>{word.partOfSpeech}</Text>
          </View>
          {word.gender && (
            <View style={commonStyles.badge}>
              <Text style={commonStyles.badgeText}>{word.gender}</Text>
            </View>
          )}
          {word.declension && (
            <View style={commonStyles.badge}>
              <Text style={commonStyles.badgeText}>{word.declension} decl</Text>
            </View>
          )}
          {word.conjugation && (
            <View style={commonStyles.badge}>
              <Text style={commonStyles.badgeText}>{word.conjugation} conj</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={colors.neutral.darkGray} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerSubtitle}>{curriculumName}</Text>
            <Text style={styles.headerTitle}>{chapterName}</Text>
          </View>
        </View>
        
        {/* Progress Summary */}
        <View style={styles.progressSummary}>
          <View style={styles.progressStats}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={[styles.progressValue, {color}]}>{progress}%</Text>
          </View>
          <View style={styles.progressStats}>
            <Text style={styles.progressLabel}>Known</Text>
            <Text style={styles.progressValue}>{knownCount}/{vocabulary.length}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.studyButton, {backgroundColor: color}]}
            onPress={() => {
              navigation.navigate('FlashcardSession' as never, {
                chapterId,
                chapterName,
                curriculumName,
              } as never);
            }}
          >
            <Icon name="school-outline" size={20} color={colors.neutral.white} />
            <Text style={styles.studyButtonText}>Study Chapter</Text>
          </TouchableOpacity>
        </View>
        
        {/* Vocabulary List */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Vocabulary ({vocabulary.length} words)</Text>
          <View style={styles.vocabularyList}>
            {vocabulary.map(renderVocabularyCard)}
          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h3,
    color: colors.neutral.darkGray,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.neutral.gray,
    marginBottom: 2,
  },
  progressSummary: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
    gap: 16,
  },
  progressStats: {
    flex: 1,
  },
  progressLabel: {
    ...typography.caption,
    color: colors.neutral.gray,
    marginBottom: 4,
  },
  progressValue: {
    ...typography.h3,
    color: colors.neutral.darkGray,
  },
  studyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 6,
  },
  studyButtonText: {
    ...typography.button,
    color: colors.neutral.white,
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    backgroundColor: colors.neutral.lightBackground,
  },
  sectionTitle: {
    ...typography.h4,
    color: colors.neutral.darkGray,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  vocabularyList: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  wordCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  wordCardKnown: {
    backgroundColor: colors.neutral.lightBackground,
    borderColor: colors.neutral.lightBackground,
    shadowOpacity: 0.05,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  wordInfo: {
    flex: 1,
  },
  latinWord: {
    ...typography.h4,
    color: colors.neutral.darkGray,
    marginBottom: 2,
  },
  englishWord: {
    ...typography.body,
    color: colors.neutral.gray,
  },
  wordKnownText: {
    opacity: 0.6,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  partOfSpeechBadge: {
    backgroundColor: colors.neutral.lightBackground,
  },
});

export default ChapterVocabularyScreen;