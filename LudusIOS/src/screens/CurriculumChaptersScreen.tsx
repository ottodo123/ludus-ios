import React, {useRef} from 'react';
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

interface Chapter {
  id: string;
  name: string;
  wordCount: number;
  progress: number;
}

const CurriculumChaptersScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {curriculumId, curriculumName, color} = route.params as any;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  
  // Mock data - in real app would be fetched based on curriculumId
  const chapters: Chapter[] = [
    { id: '1', name: 'Chapter 1: Introduction', wordCount: 45, progress: 80 },
    { id: '2', name: 'Chapter 2: Basic Phrases', wordCount: 38, progress: 65 },
    { id: '3', name: 'Chapter 3: Family & Home', wordCount: 52, progress: 40 },
    { id: '4', name: 'Chapter 4: Daily Life', wordCount: 41, progress: 20 },
    { id: '5', name: 'Chapter 5: Numbers & Time', wordCount: 36, progress: 0 },
    { id: '6', name: 'Chapter 6: Food & Drink', wordCount: 48, progress: 0 },
  ];
  
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
  
  const handleChapterPress = (chapter: Chapter) => {
    navigation.navigate('ChapterVocabulary' as never, {
      chapterId: chapter.id,
      chapterName: chapter.name,
      curriculumName,
      color,
    } as never);
  };
  
  const renderChapterCard = (chapter: Chapter) => {
    return (
      <TouchableOpacity
        key={chapter.id}
        style={styles.chapterCard}
        onPress={() => handleChapterPress(chapter)}
      >
        <View style={styles.chapterHeader}>
          <View style={styles.chapterInfo}>
            <Text style={styles.chapterName}>{chapter.name}</Text>
            <Text style={styles.wordCount}>{chapter.wordCount} words</Text>
          </View>
          <Icon name="chevron-forward" size={20} color={colors.neutral.gray} />
        </View>
        
        {chapter.progress > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${chapter.progress}%`, backgroundColor: color }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{chapter.progress}%</Text>
          </View>
        )}
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
            <Text style={styles.headerTitle}>{curriculumName}</Text>
            <Text style={styles.headerSubtitle}>Select a chapter to study</Text>
          </View>
        </View>
        
        {/* Chapters List */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.chaptersList}>
            {chapters.map(renderChapterCard)}
          </View>
          
          {/* Study All Button */}
          <TouchableOpacity 
            style={[styles.studyAllButton, { backgroundColor: color }]}
            onPress={() => {
              navigation.navigate('FlashcardSession' as never, {
                curriculumId,
                curriculumName,
                mode: 'all-chapters',
              } as never);
            }}
          >
            <Icon name="school-outline" size={20} color={colors.neutral.white} />
            <Text style={styles.studyAllText}>Study All Chapters</Text>
          </TouchableOpacity>
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
    ...typography.h2,
    color: colors.neutral.darkGray,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.neutral.gray,
    marginTop: 2,
  },
  content: {
    flex: 1,
    backgroundColor: colors.neutral.lightBackground,
  },
  chaptersList: {
    padding: 16,
    gap: 12,
  },
  chapterCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chapterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chapterInfo: {
    flex: 1,
  },
  chapterName: {
    ...typography.h4,
    color: colors.neutral.darkGray,
    marginBottom: 4,
  },
  wordCount: {
    ...typography.bodySmall,
    color: colors.neutral.gray,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: colors.neutral.lightBackground,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    ...typography.caption,
    color: colors.neutral.gray,
    minWidth: 35,
    textAlign: 'right',
  },
  studyAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginBottom: 32,
    borderRadius: 12,
    gap: 8,
  },
  studyAllText: {
    ...typography.button,
    color: colors.neutral.white,
    fontWeight: '600',
  },
});

export default CurriculumChaptersScreen;