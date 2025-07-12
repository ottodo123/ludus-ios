import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  SectionList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../styles/colors';
import {typography} from '../styles/typography';
import {commonStyles} from '../styles/commonStyles';
import {useNavigation} from '@react-navigation/native';

interface SavedWord {
  id: string;
  latin: string;
  english: string;
  partOfSpeech: string;
  sessionId: string;
  dateAdded: Date;
}

interface Session {
  id: string;
  name: string;
  color: string;
  words: SavedWord[];
}

const SavedWordsScreen = () => {
  const navigation = useNavigation();
  const [expandedSessions, setExpandedSessions] = useState<string[]>(['1', '2', '3']);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // Mock data - convert to SectionList format
  const mockSessions: Session[] = [
    {
      id: '1',
      name: 'General Study',
      color: colors.primary.blue,
      words: [
        {
          id: 'w1',
          latin: 'amare',
          english: 'to love',
          partOfSpeech: 'verb',
          sessionId: '1',
          dateAdded: new Date(),
        },
        {
          id: 'w2',
          latin: 'puella',
          english: 'girl',
          partOfSpeech: 'noun',
          sessionId: '1',
          dateAdded: new Date(),
        },
      ],
    },
    {
      id: '2',
      name: 'Caesar Chapter 1',
      color: '#8b5cf6',
      words: [
        {
          id: 'w3',
          latin: 'bellum',
          english: 'war',
          partOfSpeech: 'noun',
          sessionId: '2',
          dateAdded: new Date(),
        },
        {
          id: 'w4',
          latin: 'Gallia',
          english: 'Gaul',
          partOfSpeech: 'noun',
          sessionId: '2',
          dateAdded: new Date(),
        },
        {
          id: 'w5',
          latin: 'dividere',
          english: 'to divide',
          partOfSpeech: 'verb',
          sessionId: '2',
          dateAdded: new Date(),
        },
      ],
    },
    {
      id: '3',
      name: 'Cicero Vocab',
      color: '#06b6d4',
      words: [
        {
          id: 'w6',
          latin: 'oratio',
          english: 'speech',
          partOfSpeech: 'noun',
          sessionId: '3',
          dateAdded: new Date(),
        },
      ],
    },
  ];

  // Transform sessions to SectionList format
  const sections = mockSessions.map(session => ({
    ...session,
    data: session.words, // SectionList expects 'data' property
  }));

  const toggleSession = (sessionId: string) => {
    setExpandedSessions(prev =>
      prev.includes(sessionId)
        ? prev.filter(id => id !== sessionId)
        : [...prev, sessionId]
    );
  };

  const toggleWordSelection = (wordId: string) => {
    setSelectedWords(prev =>
      prev.includes(wordId)
        ? prev.filter(id => id !== wordId)
        : [...prev, wordId]
    );
  };

  const startStudySession = (sessionId: string) => {
    // Navigate to study screen with this session's words
    console.log('Start studying session:', sessionId);
  };

  const renderSessionHeader = ({section}: {section: any}) => (
    <TouchableOpacity
      style={styles.sessionHeader}
      onPress={() => toggleSession(section.id)}
      activeOpacity={0.7}
    >
      <View style={styles.sessionHeaderLeft}>
        <View style={[styles.sessionColorDot, {backgroundColor: section.color}]} />
        <Text style={styles.sessionTitle}>{section.name}</Text>
        <View style={styles.wordCountBadge}>
          <Text style={styles.wordCountText}>{section.data.length}</Text>
        </View>
      </View>
      <Icon
        name={expandedSessions.includes(section.id) ? 'chevron-up' : 'chevron-down'}
        size={20}
        color={colors.neutral.gray}
      />
    </TouchableOpacity>
  );

  const renderWord = ({item, section}: {item: SavedWord; section: any}) => {
    if (!expandedSessions.includes(section.id)) return null;

    return (
      <TouchableOpacity
        style={[
          styles.wordItem,
          isSelectionMode && selectedWords.includes(item.id) && styles.wordItemSelected
        ]}
        onPress={() => isSelectionMode && toggleWordSelection(item.id)}
        onLongPress={() => {
          setIsSelectionMode(true);
          toggleWordSelection(item.id);
        }}
        activeOpacity={0.7}
      >
        {isSelectionMode && (
          <View style={styles.checkbox}>
            {selectedWords.includes(item.id) && (
              <Icon name="checkmark" size={16} color={colors.primary.blue} />
            )}
          </View>
        )}
        <View style={styles.wordContent}>
          <Text style={styles.latinText}>{item.latin}</Text>
          <Text style={styles.englishText}>{item.english}</Text>
          <Text style={styles.partOfSpeechText}>{item.partOfSpeech}</Text>
        </View>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => console.log('Remove word:', item.id)}
        >
          <Icon name="close-circle" size={20} color={colors.neutral.lightGray} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const totalWords = sections.reduce((sum, section) => sum + section.data.length, 0);

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
        <Text style={styles.headerTitle}>Saved Words</Text>
        <View style={styles.headerRight}>
          <Text style={styles.totalCount}>{totalWords} total</Text>
        </View>
      </View>

      {/* Selection Mode Actions */}
      {isSelectionMode && (
        <View style={styles.selectionBar}>
          <TouchableOpacity
            style={styles.selectionAction}
            onPress={() => {
              setIsSelectionMode(false);
              setSelectedWords([]);
            }}
          >
            <Text style={styles.selectionActionText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.selectionCount}>
            {selectedWords.length} selected
          </Text>
          <TouchableOpacity
            style={styles.selectionAction}
            onPress={() => console.log('Move words')}
          >
            <Icon name="folder-outline" size={20} color={colors.primary.blue} />
            <Text style={styles.selectionActionText}>Move</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sessions List */}
      <ScrollView contentContainerStyle={styles.listContainer}>
        {sections.map((section) => (
          <View key={section.id}>
            {renderSessionHeader({section})}
            {expandedSessions.includes(section.id) && 
              section.data.map((item) => (
                <View key={item.id}>
                  {renderWord({item, section})}
                </View>
              ))
            }
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalCount: {
    ...typography.bodySmall,
    color: colors.neutral.gray,
  },
  selectionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.primary.lightBlue,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary.blue,
  },
  selectionAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  selectionActionText: {
    ...typography.bodySmall,
    color: colors.primary.blue,
    fontWeight: '600',
  },
  selectionCount: {
    ...typography.bodySmall,
    color: colors.primary.darkBlue,
  },
  listContainer: {
    paddingBottom: 20,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.neutral.lightBackground,
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  sessionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sessionColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sessionTitle: {
    ...typography.h4,
    color: colors.neutral.darkGray,
  },
  wordCountBadge: {
    backgroundColor: colors.neutral.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  wordCountText: {
    ...typography.caption,
    color: colors.neutral.gray,
    fontWeight: '600',
  },
  wordItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  wordItemSelected: {
    backgroundColor: colors.primary.lightBlue,
    marginHorizontal: 0,
    paddingHorizontal: 32,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.primary.blue,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wordContent: {
    flex: 1,
  },
  latinText: {
    ...typography.bodySmall,
    color: colors.neutral.darkGray,
    fontWeight: '600',
  },
  englishText: {
    ...typography.caption,
    color: colors.neutral.gray,
    marginTop: 2,
  },
  partOfSpeechText: {
    ...typography.caption,
    color: colors.neutral.lightGray,
    fontStyle: 'italic',
    marginTop: 2,
  },
  removeButton: {
    padding: 4,
  },
});

export default SavedWordsScreen;