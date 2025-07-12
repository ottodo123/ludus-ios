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
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../styles/colors';
import {typography} from '../styles/typography';
import {commonStyles} from '../styles/commonStyles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  isUnlocked: boolean;
  date?: string;
}

const ProfileScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('Latin');
  
  const userStats = {
    name: 'Otto',
    level: 'Intermediate',
    streak: 7,
    totalWords: 423,
    wordsLearned: 308,
    studyTime: '142h',
    joinDate: 'January 2024',
  };
  
  const achievements: Achievement[] = [
    {
      id: '1',
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: 'footsteps-outline',
      isUnlocked: true,
      date: 'Jan 15, 2024',
    },
    {
      id: '2',
      title: 'Word Master',
      description: 'Learn 100 vocabulary words',
      icon: 'library-outline',
      isUnlocked: true,
      date: 'Feb 3, 2024',
    },
    {
      id: '3',
      title: 'Grammar Guru',
      description: 'Complete all beginner grammar topics',
      icon: 'school-outline',
      isUnlocked: true,
      date: 'Mar 12, 2024',
    },
    {
      id: '4',
      title: 'Streak Master',
      description: 'Study for 7 days in a row',
      icon: 'flame-outline',
      isUnlocked: true,
      date: 'Mar 20, 2024',
    },
    {
      id: '5',
      title: 'Sentence Builder',
      description: 'Generate 50 sentences',
      icon: 'construct-outline',
      isUnlocked: false,
    },
    {
      id: '6',
      title: 'Latin Scholar',
      description: 'Complete all advanced topics',
      icon: 'trophy-outline',
      isUnlocked: false,
    },
  ];
  
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
  
  const renderStatCard = (title: string, value: string, icon: string, color: string) => (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, {backgroundColor: color + '20'}]}>
        <Icon name={icon} size={16} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
  
  const renderSettingItem = (title: string, subtitle: string, value: boolean, onToggle: (value: boolean) => void) => (
    <View style={styles.settingItem}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{false: colors.neutral.lightGray, true: colors.primary.lightBlue}}
        thumbColor={value ? colors.primary.blue : colors.neutral.white}
      />
    </View>
  );
  
  const renderAchievement = (achievement: Achievement) => (
    <View key={achievement.id} style={[styles.achievementItem, !achievement.isUnlocked && styles.achievementLocked]}>
      <View style={[styles.achievementIcon, !achievement.isUnlocked && styles.achievementIconLocked]}>
        <Icon 
          name={achievement.icon} 
          size={24} 
          color={achievement.isUnlocked ? colors.primary.blue : colors.neutral.lightGray} 
        />
      </View>
      <View style={styles.achievementInfo}>
        <Text style={[styles.achievementTitle, !achievement.isUnlocked && styles.achievementTitleLocked]}>
          {achievement.title}
        </Text>
        <Text style={styles.achievementDescription}>{achievement.description}</Text>
        {achievement.date && (
          <Text style={styles.achievementDate}>{achievement.date}</Text>
        )}
      </View>
      {achievement.isUnlocked && (
        <Icon name="checkmark-circle" size={20} color={colors.primary.blue} />
      )}
    </View>
  );
  
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
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Icon name="settings-outline" size={24} color={colors.neutral.darkGray} />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* User Info */}
          <View style={styles.userSection}>
            <View style={styles.avatar}>
              <Icon name="person" size={24} color={colors.neutral.white} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{userStats.name}</Text>
              <Text style={styles.userLevel}>{userStats.level} • Member since {userStats.joinDate}</Text>
            </View>
            <TouchableOpacity 
              style={styles.languageSelector}
              onPress={() => navigation.navigate('LanguageSelection' as never, {
                currentLanguage: selectedLanguage,
                onLanguageSelect: setSelectedLanguage,
              } as never)}
            >
              <Text style={styles.languageText}>{selectedLanguage}</Text>
              <Icon name="chevron-forward" size={16} color={colors.neutral.gray} />
            </TouchableOpacity>
          </View>
          
          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {renderStatCard('Day Streak', userStats.streak.toString(), 'flame-outline', '#f59e0b')}
            {renderStatCard('Words Learned', userStats.wordsLearned.toString(), 'library-outline', '#10b981')}
            {renderStatCard('Study Time', userStats.studyTime, 'time-outline', '#3b82f6')}
            {renderStatCard('Total Words', userStats.totalWords.toString(), 'list-outline', '#8b5cf6')}
          </View>
          
          {/* Progress Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Learning Progress</Text>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>Vocabulary Mastery</Text>
                <Text style={styles.progressPercentage}>
                  {Math.round((userStats.wordsLearned / userStats.totalWords) * 100)}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${(userStats.wordsLearned / userStats.totalWords) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressSubtext}>
                {userStats.wordsLearned} of {userStats.totalWords} words learned
              </Text>
            </View>
          </View>
          
          {/* Achievements */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsList}>
              {achievements.map(renderAchievement)}
            </View>
          </View>
          
          {/* Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Settings</Text>
            <View style={styles.settingsCard}>
              {renderSettingItem(
                'Notifications',
                'Get notified about your progress',
                notifications,
                setNotifications
              )}
              {renderSettingItem(
                'Study Reminders',
                'Daily reminders to keep your streak',
                studyReminders,
                setStudyReminders
              )}
              {renderSettingItem(
                'Dark Mode',
                'Switch to dark theme',
                darkMode,
                setDarkMode
              )}
            </View>
          </View>
          
          {/* Actions */}
          <View style={styles.section}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="share-outline" size={20} color={colors.primary.blue} />
              <Text style={styles.actionButtonText}>Share Progress</Text>
              <Icon name="chevron-forward" size={16} color={colors.neutral.gray} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="help-circle-outline" size={20} color={colors.primary.blue} />
              <Text style={styles.actionButtonText}>Help & Support</Text>
              <Icon name="chevron-forward" size={16} color={colors.neutral.gray} />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="information-circle-outline" size={20} color={colors.primary.blue} />
              <Text style={styles.actionButtonText}>About Ludus</Text>
              <Icon name="chevron-forward" size={16} color={colors.neutral.gray} />
            </TouchableOpacity>
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
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    backgroundColor: colors.neutral.lightBackground,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    ...typography.h3,
    color: colors.neutral.darkGray,
    marginBottom: 2,
  },
  userLevel: {
    ...typography.bodySmall,
    color: colors.neutral.gray,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.lightBackground,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  languageText: {
    ...typography.bodySmall,
    color: colors.neutral.darkGray,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.neutral.white,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValue: {
    ...typography.h4,
    color: colors.neutral.darkGray,
    marginBottom: 2,
    fontWeight: '600',
  },
  statTitle: {
    ...typography.caption,
    color: colors.neutral.gray,
    textAlign: 'center',
    fontSize: 11,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.neutral.darkGray,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  progressCard: {
    backgroundColor: colors.neutral.white,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressTitle: {
    ...typography.h4,
    color: colors.neutral.darkGray,
  },
  progressPercentage: {
    ...typography.h4,
    color: colors.primary.blue,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.neutral.lightBackground,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary.blue,
    borderRadius: 4,
  },
  progressSubtext: {
    ...typography.caption,
    color: colors.neutral.gray,
  },
  achievementsList: {
    backgroundColor: colors.neutral.white,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  achievementLocked: {
    opacity: 0.6,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary.lightBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  achievementIconLocked: {
    backgroundColor: colors.neutral.lightBackground,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.neutral.darkGray,
    marginBottom: 2,
  },
  achievementTitleLocked: {
    color: colors.neutral.gray,
  },
  achievementDescription: {
    ...typography.caption,
    color: colors.neutral.gray,
    marginBottom: 2,
  },
  achievementDate: {
    ...typography.caption,
    color: colors.neutral.lightGray,
    fontSize: 11,
  },
  settingsCard: {
    backgroundColor: colors.neutral.white,
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body,
    color: colors.neutral.darkGray,
    marginBottom: 2,
  },
  settingSubtitle: {
    ...typography.caption,
    color: colors.neutral.gray,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.white,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    ...typography.body,
    color: colors.neutral.darkGray,
    flex: 1,
    marginLeft: 12,
  },
});

export default ProfileScreen;