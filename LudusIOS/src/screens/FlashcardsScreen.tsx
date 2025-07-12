import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../styles/colors';
import {typography} from '../styles/typography';
import {commonStyles} from '../styles/commonStyles';
import {useFocusEffect} from '@react-navigation/native';

interface Chapter {
  id: string;
  name: string;
  totalCards: number;
  dueCards: number;
  progress: number;
}

interface CurriculumFolder {
  id: string;
  title: string;
  description: string;
  totalCards: number;
  dueCards: number;
  progress: number;
  icon: string;
  color: string;
  chapters: Chapter[];
}

const FlashcardsScreen = ({navigation}: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  // Removed expandedFolders state as we now navigate to separate page

  // Restore tab bar when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      const parent = navigation.getParent();
      if (parent) {
        parent.setOptions({
          tabBarStyle: {
            backgroundColor: colors.neutral.white,
            borderTopWidth: 1,
            borderTopColor: colors.neutral.border,
            paddingBottom: 34,
            paddingTop: 5,
            height: 90,
          }
        });
      }
      
      // Animate screen entrance
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
        // Reset animations when leaving
        fadeAnim.setValue(0);
        translateY.setValue(20);
      };
    }, [navigation, fadeAnim, translateY])
  );

  const curriculumFolders: CurriculumFolder[] = [
    {
      id: 'ludus',
      title: 'Ludus',
      description: 'Basic Latin vocabulary',
      totalCards: 150,
      dueCards: 12,
      progress: 0.65,
      icon: 'school-outline',
      color: colors.primary.blue,
      chapters: [
        { id: 'l1', name: 'Chapter 1: Familia', totalCards: 30, dueCards: 5, progress: 0.8 },
        { id: 'l2', name: 'Chapter 2: Schola', totalCards: 35, dueCards: 3, progress: 0.7 },
        { id: 'l3', name: 'Chapter 3: Cibus', totalCards: 28, dueCards: 4, progress: 0.6 },
        { id: 'l4', name: 'Chapter 4: Domus', totalCards: 32, dueCards: 0, progress: 0.5 },
        { id: 'l5', name: 'Chapter 5: Natura', totalCards: 25, dueCards: 0, progress: 0.4 },
      ],
    },
    {
      id: 'caesar',
      title: 'Caesar',
      description: 'De Bello Gallico vocabulary',
      totalCards: 200,
      dueCards: 8,
      progress: 0.45,
      icon: 'shield-outline',
      color: '#8b5cf6',
      chapters: [
        { id: 'c1', name: 'Book I: Helvetii', totalCards: 45, dueCards: 3, progress: 0.6 },
        { id: 'c2', name: 'Book I: Ariovistus', totalCards: 40, dueCards: 2, progress: 0.5 },
        { id: 'c3', name: 'Book II: Belgae', totalCards: 38, dueCards: 3, progress: 0.4 },
        { id: 'c4', name: 'Book III: Naval Battle', totalCards: 42, dueCards: 0, progress: 0.3 },
        { id: 'c5', name: 'Book IV: Germans', totalCards: 35, dueCards: 0, progress: 0.2 },
      ],
    },
    {
      id: 'cicero',
      title: 'Cicero',
      description: 'Orations and letters',
      totalCards: 180,
      dueCards: 15,
      progress: 0.3,
      icon: 'megaphone-outline',
      color: '#06b6d4',
      chapters: [
        { id: 'ci1', name: 'In Catilinam I', totalCards: 50, dueCards: 8, progress: 0.4 },
        { id: 'ci2', name: 'In Catilinam II', totalCards: 45, dueCards: 5, progress: 0.3 },
        { id: 'ci3', name: 'Pro Archia', totalCards: 35, dueCards: 2, progress: 0.25 },
        { id: 'ci4', name: 'Letters to Atticus', totalCards: 50, dueCards: 0, progress: 0.2 },
      ],
    },
    {
      id: 'vergil',
      title: 'Vergil',
      description: 'Aeneid vocabulary',
      totalCards: 220,
      dueCards: 0,
      progress: 0.2,
      icon: 'book-outline',
      color: '#10b981',
      chapters: [
        { id: 'v1', name: 'Book I: Storm & Carthage', totalCards: 55, dueCards: 0, progress: 0.3 },
        { id: 'v2', name: 'Book II: Fall of Troy', totalCards: 60, dueCards: 0, progress: 0.2 },
        { id: 'v3', name: 'Book IV: Dido', totalCards: 50, dueCards: 0, progress: 0.15 },
        { id: 'v4', name: 'Book VI: Underworld', totalCards: 55, dueCards: 0, progress: 0.1 },
      ],
    },
  ];

  const dailyGoal = {
    completed: 12,
    target: 20,
  };

  const totalDueCards = curriculumFolders.reduce((total, folder) => total + folder.dueCards, 0);

  const renderProgressBar = (progress: number) => {
    return (
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, {width: `${progress * 100}%`}]} />
      </View>
    );
  };

  const handleCurriculumPress = (folder: CurriculumFolder) => {
    navigation.navigate('CurriculumChapters' as never, {
      curriculumId: folder.id,
      curriculumName: folder.title,
      color: folder.color,
    } as never);
  };

  // renderChapter removed - chapters now shown on separate page

  const renderCurriculumCard = (folder: CurriculumFolder) => {
    return (
      <View key={folder.id} style={styles.curriculumCard}>
        <TouchableOpacity 
          style={styles.cardHeaderTouchable}
          onPress={() => handleCurriculumPress(folder)}
          activeOpacity={0.7}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconContainer, {backgroundColor: folder.color + '20'}]}>
              <Icon name={folder.icon} size={24} color={folder.color} />
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>{folder.title}</Text>
              <Text style={styles.cardDescription}>{folder.description}</Text>
            </View>
            <View style={styles.cardHeaderRight}>
              {folder.dueCards > 0 && (
                <View style={styles.dueBadge}>
                  <Text style={styles.dueBadgeText}>{folder.dueCards}</Text>
                </View>
              )}
              <Icon 
                name="chevron-forward" 
                size={20} 
                color={colors.neutral.gray} 
              />
            </View>
          </View>
          
          <View style={styles.cardStats}>
            <Text style={styles.statsText}>
              {Math.floor(folder.progress * folder.totalCards)} / {folder.totalCards} cards learned
            </Text>
            {renderProgressBar(folder.progress)}
          </View>
        </TouchableOpacity>
        
        {/* Chapters now displayed on separate page */}
      </View>
    );
  };

  const renderSavedListsCards = () => {
    const savedLists = [
      {
        id: '1',
        name: 'General Study',
        wordCount: 12,
        lastModified: '2 days ago',
        color: colors.primary.blue,
      },
      {
        id: '2',
        name: 'Caesar Chapter 1',
        wordCount: 8,
        lastModified: '1 week ago',
        color: '#8b5cf6',
      },
      {
        id: '3',
        name: 'Cicero Vocab',
        wordCount: 5,
        lastModified: '2 weeks ago',
        color: '#06b6d4',
      },
    ];

    return savedLists.map(list => (
      <TouchableOpacity 
        key={list.id} 
        style={styles.savedListCard}
        onPress={() => navigation.navigate('Glossary', {screen: 'SavedWords', params: {sessionId: list.id}})}
      >
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, {backgroundColor: list.color + '20'}]}>
            <Icon name="bookmarks" size={24} color={list.color} />
          </View>
          <View style={styles.cardTitleContainer}>
            <Text style={styles.cardTitle}>{list.name}</Text>
            <Text style={styles.cardDescription}>{list.wordCount} words • {list.lastModified}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.studyButton}
          onPress={() => navigation.navigate('Study', {sessionId: list.id})}
        >
          <Text style={styles.studyButtonText}>
            Study {list.wordCount} words
          </Text>
          <Icon 
            name="arrow-forward" 
            size={20} 
            color={colors.neutral.white} 
          />
        </TouchableOpacity>
      </TouchableOpacity>
    ));
  };

  return (
    <SafeAreaView style={commonStyles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Flashcards</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('Profile' as never)}
          >
            <Icon name="person-outline" size={24} color={colors.neutral.darkGray} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => navigation.navigate('FlashcardsSettings')}
          >
            <Icon name="settings-outline" size={24} color={colors.neutral.darkGray} />
          </TouchableOpacity>
        </View>
      </View>
      <Animated.ScrollView
        style={{
          opacity: fadeAnim,
          transform: [{translateY}],
        }} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {/* Daily Review Section */}
        <TouchableOpacity 
          style={[styles.dailyReviewCard, totalDueCards === 0 && styles.dailyReviewDisabled]}
          onPress={() => totalDueCards > 0 && navigation.navigate('Study', {curriculumTitle: 'Daily Review'})}
          disabled={totalDueCards === 0}
        >
          <View style={styles.dailyReviewHeader}>
            <View style={styles.dailyReviewInfo}>
              <Text style={styles.dailyReviewTitle}>Daily Review</Text>
              <Text style={styles.dailyReviewSubtitle}>
                {totalDueCards > 0 ? `${totalDueCards} cards due today` : 'All caught up!'}
              </Text>
            </View>
            <View style={styles.dailyReviewRightSection}>
              <View style={styles.streakStatValue}>
                <Icon name="flame" size={20} color="#f97316" />
                <Text style={styles.statValue}>7</Text>
              </View>
              <Icon 
                name="arrow-forward" 
                size={24} 
                color={totalDueCards > 0 ? colors.primary.blue : colors.neutral.lightGray} 
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* Statistics Overview */}
        <View style={styles.statsOverview}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>580</Text>
            <Text style={styles.statLabel}>Total Cards</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{totalDueCards}</Text>
            <Text style={styles.statLabel}>Due Today</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>73%</Text>
            <Text style={styles.statLabel}>Mastery</Text>
          </View>
        </View>

        {/* Curriculum Folders */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Curriculum</Text>
            <TouchableOpacity style={styles.sectionAction}>
              <Text style={styles.sectionActionText}>Manage</Text>
              <Icon name="chevron-forward" size={16} color={colors.primary.blue} />
            </TouchableOpacity>
          </View>
          {curriculumFolders.map(renderCurriculumCard)}
        </View>

        {/* Saved Lists */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Lists</Text>
            <TouchableOpacity 
              style={styles.sectionAction}
              onPress={() => navigation.navigate('Glossary', {screen: 'SavedWords'})}
            >
              <Text style={styles.sectionActionText}>View All</Text>
              <Icon name="chevron-forward" size={16} color={colors.primary.blue} />
            </TouchableOpacity>
          </View>
          {renderSavedListsCards()}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name="add-circle-outline" size={24} color={colors.primary.blue} />
            <Text style={styles.quickActionText}>Create Custom List</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.quickActionButton}>
            <Icon name="stats-chart-outline" size={24} color={colors.primary.blue} />
            <Text style={styles.quickActionText}>View Statistics</Text>
          </TouchableOpacity>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.neutral.darkGray,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    padding: 8,
  },
  scrollContent: {
    paddingBottom: 100, // Add extra padding at bottom for tab bar
  },
  dailyReviewCard: {
    ...commonStyles.card,
    backgroundColor: colors.primary.lighterBlue,
    borderWidth: 2,
    borderColor: colors.primary.blue,
  },
  dailyReviewDisabled: {
    backgroundColor: colors.neutral.lightBackground,
    borderColor: colors.neutral.border,
  },
  dailyReviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dailyReviewInfo: {
    flex: 1,
  },
  dailyReviewTitle: {
    ...typography.h3,
    color: colors.primary.darkBlue,
    marginBottom: 4,
  },
  dailyReviewSubtitle: {
    ...typography.body,
    color: colors.primary.blue,
  },
  dailyReviewRightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakStatValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.neutral.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary.blue,
    borderRadius: 4,
  },
  statsOverview: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.white,
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: colors.neutral.darkGray,
  },
  statLabel: {
    ...typography.caption,
    color: colors.neutral.lightGray,
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.neutral.border,
    marginVertical: 8,
  },
  sectionContainer: {
    marginTop: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.neutral.darkGray,
  },
  sectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sectionActionText: {
    ...typography.buttonSmall,
    color: colors.primary.blue,
  },
  curriculumCard: {
    ...commonStyles.card,
  },
  savedListCard: {
    ...commonStyles.card,
  },
  cardHeaderTouchable: {
    // Empty style, just for the touchable wrapper
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  cardTitle: {
    ...typography.h4,
    color: colors.neutral.darkGray,
  },
  cardDescription: {
    ...typography.bodySmall,
    color: colors.neutral.gray,
    marginTop: 2,
  },
  dueBadge: {
    backgroundColor: colors.primary.blue,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  dueBadgeText: {
    ...typography.buttonSmall,
    color: colors.neutral.white,
  },
  cardStats: {
    marginBottom: 12,
  },
  statsText: {
    ...typography.caption,
    color: colors.neutral.gray,
    marginBottom: 6,
  },
  studyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.blue,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  studyButtonDisabled: {
    backgroundColor: colors.neutral.lightBackground,
  },
  studyButtonText: {
    ...typography.button,
    color: colors.neutral.white,
  },
  studyButtonTextDisabled: {
    color: colors.neutral.lightGray,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral.white,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    gap: 8,
  },
  quickActionText: {
    ...typography.buttonSmall,
    color: colors.primary.blue,
  },
  chaptersContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginHorizontal: -12,
    borderRadius: 8,
  },
  chapterLeft: {
    flex: 1,
  },
  chapterName: {
    ...typography.bodySmall,
    color: colors.neutral.darkGray,
    fontWeight: '600',
    marginBottom: 4,
  },
  chapterStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  chapterStatsText: {
    ...typography.caption,
    color: colors.neutral.gray,
  },
  chapterDueBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  chapterDueBadgeText: {
    ...typography.caption,
    color: colors.neutral.white,
    fontWeight: '600',
    fontSize: 11,
  },
});

export default FlashcardsScreen;