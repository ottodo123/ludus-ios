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
import {useFocusEffect} from '@react-navigation/native';

interface GrammarTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
}

const GrammarScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  
  const grammarTopics: GrammarTopic[] = [
    {
      id: '1',
      title: 'Noun Declensions',
      description: 'Learn the five declensions and their cases',
      icon: 'library-outline',
      color: '#3b82f6',
      difficulty: 'Beginner',
      progress: 85,
    },
    {
      id: '2',
      title: 'Verb Conjugations',
      description: 'Master the four conjugations and tenses',
      icon: 'flash-outline',
      color: '#10b981',
      difficulty: 'Beginner',
      progress: 70,
    },
    {
      id: '3',
      title: 'Adjective Agreement',
      description: 'Understand how adjectives agree with nouns',
      icon: 'checkmark-circle-outline',
      color: '#f59e0b',
      difficulty: 'Intermediate',
      progress: 45,
    },
    {
      id: '4',
      title: 'Passive Voice',
      description: 'Learn passive constructions and forms',
      icon: 'swap-horizontal-outline',
      color: '#8b5cf6',
      difficulty: 'Intermediate',
      progress: 30,
    },
    {
      id: '5',
      title: 'Subjunctive Mood',
      description: 'Master the subjunctive in all its uses',
      icon: 'help-circle-outline',
      color: '#ef4444',
      difficulty: 'Advanced',
      progress: 15,
    },
    {
      id: '6',
      title: 'Conditional Sentences',
      description: 'Understand conditions and their constructions',
      icon: 'git-branch-outline',
      color: '#06b6d4',
      difficulty: 'Advanced',
      progress: 0,
    },
  ];
  
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
  
  const filteredTopics = selectedDifficulty === 'All' 
    ? grammarTopics 
    : grammarTopics.filter(topic => topic.difficulty === selectedDifficulty);
  
  // Animate screen entrance and set status bar
  useFocusEffect(
    React.useCallback(() => {
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
  
  const renderTopicCard = (topic: GrammarTopic) => {
    return (
      <TouchableOpacity
        key={topic.id}
        style={styles.topicCard}
        onPress={() => {
          // TODO: Navigate to grammar topic detail
          console.log('Navigate to', topic.title);
        }}
      >
        <View style={styles.topicHeader}>
          <View style={[styles.topicIcon, {backgroundColor: topic.color + '20'}]}>
            <Icon name={topic.icon} size={24} color={topic.color} />
          </View>
          <View style={styles.topicInfo}>
            <Text style={styles.topicTitle}>{topic.title}</Text>
            <Text style={styles.topicDescription}>{topic.description}</Text>
          </View>
          <Icon name="chevron-forward" size={20} color={colors.neutral.gray} />
        </View>
        
        <View style={styles.topicFooter}>
          <View style={[styles.difficultyBadge, styles[`difficulty${topic.difficulty}` as keyof typeof styles]]}>
            <Text style={[styles.difficultyText, styles[`difficulty${topic.difficulty}Text` as keyof typeof styles]]}>
              {topic.difficulty}
            </Text>
          </View>
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>{topic.progress}%</Text>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${topic.progress}%`, backgroundColor: topic.color }
                ]} 
              />
            </View>
          </View>
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
          <Text style={styles.headerTitle}>Grammar</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Icon name="search-outline" size={24} color={colors.neutral.darkGray} />
          </TouchableOpacity>
        </View>
        
        {/* Stats Overview */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>6</Text>
            <Text style={styles.statLabel}>Topics</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>41%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Mastered</Text>
          </View>
        </View>
        
        {/* Difficulty Filter */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {difficulties.map(difficulty => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.filterButton,
                  selectedDifficulty === difficulty && styles.filterButtonActive
                ]}
                onPress={() => setSelectedDifficulty(difficulty)}
              >
                <Text style={[
                  styles.filterText,
                  selectedDifficulty === difficulty && styles.filterTextActive
                ]}>
                  {difficulty}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        {/* Topics List */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topicsList}>
            {filteredTopics.map(renderTopicCard)}
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
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.neutral.darkGray,
  },
  searchButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.white,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    ...typography.h2,
    color: colors.primary.blue,
    marginBottom: 4,
  },
  statLabel: {
    ...typography.caption,
    color: colors.neutral.gray,
  },
  filterContainer: {
    backgroundColor: colors.neutral.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  filterScroll: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: colors.neutral.lightBackground,
  },
  filterButtonActive: {
    backgroundColor: colors.primary.blue,
  },
  filterText: {
    ...typography.bodySmall,
    color: colors.neutral.gray,
    fontWeight: '500',
  },
  filterTextActive: {
    color: colors.neutral.white,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: colors.neutral.lightBackground,
  },
  topicsList: {
    padding: 16,
    gap: 12,
  },
  topicCard: {
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
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  topicIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  topicInfo: {
    flex: 1,
  },
  topicTitle: {
    ...typography.h4,
    color: colors.neutral.darkGray,
    marginBottom: 2,
  },
  topicDescription: {
    ...typography.bodySmall,
    color: colors.neutral.gray,
  },
  topicFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyBeginner: {
    backgroundColor: colors.neutral.lightBackground,
  } as any,
  difficultyIntermediate: {
    backgroundColor: '#fef3c7',
  } as any,
  difficultyAdvanced: {
    backgroundColor: '#fecaca',
  } as any,
  difficultyText: {
    ...typography.caption,
    fontWeight: '600',
    fontSize: 11,
  },
  difficultyBeginnerText: {
    color: colors.neutral.gray,
  } as any,
  difficultyIntermediateText: {
    color: '#d97706',
  } as any,
  difficultyAdvancedText: {
    color: '#dc2626',
  } as any,
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressText: {
    ...typography.caption,
    color: colors.neutral.gray,
    minWidth: 35,
    textAlign: 'right',
  },
  progressBar: {
    width: 60,
    height: 6,
    backgroundColor: colors.neutral.lightBackground,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
});

export default GrammarScreen;