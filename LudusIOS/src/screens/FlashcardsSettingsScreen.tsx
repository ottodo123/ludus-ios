import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../styles/colors';
import {typography} from '../styles/typography';
import {commonStyles} from '../styles/commonStyles';
import {useNavigation} from '@react-navigation/native';

interface CurriculumSettings {
  [key: string]: {
    enabled: boolean;
    chapters: {[key: string]: boolean};
  };
}

const FlashcardsSettingsScreen = () => {
  const navigation = useNavigation();
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [curriculumSettings, setCurriculumSettings] = useState<CurriculumSettings>({
    ludus: {
      enabled: true,
      chapters: {
        l1: true,
        l2: true,
        l3: true,
        l4: false,
        l5: false,
      },
    },
    caesar: {
      enabled: true,
      chapters: {
        c1: true,
        c2: true,
        c3: true,
        c4: false,
        c5: false,
      },
    },
    cicero: {
      enabled: true,
      chapters: {
        ci1: true,
        ci2: true,
        ci3: false,
        ci4: false,
      },
    },
    vergil: {
      enabled: false,
      chapters: {
        v1: false,
        v2: false,
        v3: false,
        v4: false,
      },
    },
  });

  const curriculumData = [
    {
      id: 'ludus',
      title: 'Ludus',
      icon: 'school-outline',
      color: colors.primary.blue,
      chapters: [
        { id: 'l1', name: 'Chapter 1: Familia' },
        { id: 'l2', name: 'Chapter 2: Schola' },
        { id: 'l3', name: 'Chapter 3: Cibus' },
        { id: 'l4', name: 'Chapter 4: Domus' },
        { id: 'l5', name: 'Chapter 5: Natura' },
      ],
    },
    {
      id: 'caesar',
      title: 'Caesar',
      icon: 'shield-outline',
      color: '#8b5cf6',
      chapters: [
        { id: 'c1', name: 'Book I: Helvetii' },
        { id: 'c2', name: 'Book I: Ariovistus' },
        { id: 'c3', name: 'Book II: Belgae' },
        { id: 'c4', name: 'Book III: Naval Battle' },
        { id: 'c5', name: 'Book IV: Germans' },
      ],
    },
    {
      id: 'cicero',
      title: 'Cicero',
      icon: 'megaphone-outline',
      color: '#06b6d4',
      chapters: [
        { id: 'ci1', name: 'In Catilinam I' },
        { id: 'ci2', name: 'In Catilinam II' },
        { id: 'ci3', name: 'Pro Archia' },
        { id: 'ci4', name: 'Letters to Atticus' },
      ],
    },
    {
      id: 'vergil',
      title: 'Vergil',
      icon: 'book-outline',
      color: '#10b981',
      chapters: [
        { id: 'v1', name: 'Book I: Storm & Carthage' },
        { id: 'v2', name: 'Book II: Fall of Troy' },
        { id: 'v3', name: 'Book IV: Dido' },
        { id: 'v4', name: 'Book VI: Underworld' },
      ],
    },
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const toggleCurriculum = (curriculumId: string, enabled: boolean) => {
    setCurriculumSettings(prev => ({
      ...prev,
      [curriculumId]: {
        ...prev[curriculumId],
        enabled,
        // If disabling, disable all chapters too
        chapters: enabled 
          ? prev[curriculumId].chapters 
          : Object.keys(prev[curriculumId].chapters).reduce((acc, key) => ({
              ...acc,
              [key]: false
            }), {})
      }
    }));
  };

  const toggleChapter = (curriculumId: string, chapterId: string, enabled: boolean) => {
    setCurriculumSettings(prev => {
      const newChapters = {
        ...prev[curriculumId].chapters,
        [chapterId]: enabled
      };
      
      // Check if any chapter is enabled
      const anyChapterEnabled = Object.values(newChapters).some(val => val);
      
      return {
        ...prev,
        [curriculumId]: {
          enabled: anyChapterEnabled,
          chapters: newChapters
        }
      };
    });
  };

  const saveSettings = () => {
    // TODO: Save settings to storage
    navigation.goBack();
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
        <Text style={styles.headerTitle}>Daily Review Settings</Text>
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={saveSettings}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionDescription}>
          Choose which chapters to include in your daily review. Only chapters with due cards will appear in your review session.
        </Text>

        {/* Curriculum Sections */}
        {curriculumData.map(curriculum => {
          const isExpanded = expandedSections.includes(curriculum.id);
          const settings = curriculumSettings[curriculum.id];

          return (
            <View key={curriculum.id} style={styles.curriculumSection}>
              <TouchableOpacity
                style={styles.curriculumHeader}
                onPress={() => toggleSection(curriculum.id)}
                activeOpacity={0.7}
              >
                <View style={styles.curriculumLeft}>
                  <View style={[styles.iconContainer, {backgroundColor: curriculum.color + '20'}]}>
                    <Icon name={curriculum.icon} size={20} color={curriculum.color} />
                  </View>
                  <Text style={styles.curriculumTitle}>{curriculum.title}</Text>
                </View>
                <View style={styles.curriculumRight}>
                  <Switch
                    value={settings.enabled}
                    onValueChange={(value) => toggleCurriculum(curriculum.id, value)}
                    trackColor={{ false: colors.neutral.border, true: curriculum.color }}
                    thumbColor={colors.neutral.white}
                    ios_backgroundColor={colors.neutral.border}
                  />
                  <Icon 
                    name={isExpanded ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color={colors.neutral.gray} 
                    style={styles.chevron}
                  />
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.chaptersContainer}>
                  {curriculum.chapters.map(chapter => (
                    <View key={chapter.id} style={styles.chapterRow}>
                      <Text style={[
                        styles.chapterName,
                        !settings.enabled && styles.chapterNameDisabled
                      ]}>
                        {chapter.name}
                      </Text>
                      <Switch
                        value={settings.chapters[chapter.id]}
                        onValueChange={(value) => toggleChapter(curriculum.id, chapter.id, value)}
                        trackColor={{ false: colors.neutral.border, true: curriculum.color }}
                        thumbColor={colors.neutral.white}
                        ios_backgroundColor={colors.neutral.border}
                        disabled={!settings.enabled}
                      />
                    </View>
                  ))}
                </View>
              )}
            </View>
          );
        })}

        {/* Additional Settings */}
        <View style={styles.additionalSettings}>
          <Text style={styles.additionalSettingsTitle}>Review Options</Text>
          
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Include overdue cards</Text>
              <Text style={styles.settingDescription}>
                Cards that were due on previous days
              </Text>
            </View>
            <Switch
              value={true}
              trackColor={{ false: colors.neutral.border, true: colors.primary.blue }}
              thumbColor={colors.neutral.white}
              ios_backgroundColor={colors.neutral.border}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Mix all chapters</Text>
              <Text style={styles.settingDescription}>
                Shuffle cards from different chapters together
              </Text>
            </View>
            <Switch
              value={true}
              trackColor={{ false: colors.neutral.border, true: colors.primary.blue }}
              thumbColor={colors.neutral.white}
              ios_backgroundColor={colors.neutral.border}
            />
          </View>
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
  saveButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  saveButtonText: {
    ...typography.button,
    color: colors.primary.blue,
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  sectionDescription: {
    ...typography.body,
    color: colors.neutral.gray,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 22,
  },
  curriculumSection: {
    backgroundColor: colors.neutral.white,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  curriculumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  curriculumLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  curriculumTitle: {
    ...typography.h4,
    color: colors.neutral.darkGray,
  },
  curriculumRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chevron: {
    marginLeft: 4,
  },
  chaptersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
  },
  chapterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingLeft: 48,
  },
  chapterName: {
    ...typography.bodySmall,
    color: colors.neutral.darkGray,
    flex: 1,
  },
  chapterNameDisabled: {
    color: colors.neutral.lightGray,
  },
  additionalSettings: {
    marginTop: 24,
    marginHorizontal: 16,
    marginBottom: 32,
  },
  additionalSettingsTitle: {
    ...typography.h4,
    color: colors.neutral.darkGray,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.neutral.border,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    ...typography.bodySmall,
    color: colors.neutral.darkGray,
    fontWeight: '600',
    marginBottom: 4,
  },
  settingDescription: {
    ...typography.caption,
    color: colors.neutral.gray,
    lineHeight: 18,
  },
});

export default FlashcardsSettingsScreen;