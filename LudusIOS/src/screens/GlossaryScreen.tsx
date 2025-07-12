import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  SafeAreaView,
  Animated,
  PanResponder,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../styles/colors';
import {typography} from '../styles/typography';
import {commonStyles} from '../styles/commonStyles';
import {useNavigation, useFocusEffect} from '@react-navigation/native';

interface WordResult {
  id: string;
  latin: string;
  english: string;
  partOfSpeech: string;
  frequency?: string;
  gender?: string;
  declension?: string;
  conjugation?: string;
}

interface Session {
  id: string;
  name: string;
  wordCount: number;
  color: string;
}

const GlossaryScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState<'latin' | 'english'>('latin');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSessionPicker, setShowSessionPicker] = useState(false);
  const [savedWords, setSavedWords] = useState<WordResult[]>([]);
  const [searchResults, setSearchResults] = useState<WordResult[]>([]);
  const [currentSession, setCurrentSession] = useState<Session>({
    id: '1',
    name: 'General Study',
    wordCount: 0,
    color: colors.primary.blue,
  });
  const [sessions] = useState<Session[]>([
    { id: '2', name: 'Caesar Chapter 1', wordCount: 12, color: '#8b5cf6' },
    { id: '3', name: 'Cicero Vocab', wordCount: 8, color: '#06b6d4' },
    { id: '1', name: 'General Study', wordCount: 0, color: colors.primary.blue },
  ]);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  const screenFadeAnim = useRef(new Animated.Value(0)).current;
  const screenTranslateY = useRef(new Animated.Value(20)).current;
  
  // Animate screen entrance
  useFocusEffect(
    React.useCallback(() => {
      Animated.parallel([
        Animated.timing(screenFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(screenTranslateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      
      return () => {
        screenFadeAnim.setValue(0);
        screenTranslateY.setValue(20);
      };
    }, [])
  );

  // Pan responder for swipe to close
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Only respond to downward swipes
        return gestureState.dy > 10 && Math.abs(gestureState.dx) < 50;
      },
      onPanResponderMove: (evt, gestureState) => {
        // Update slide position as user drags
        if (gestureState.dy > 0) {
          slideAnim.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        // If dragged down more than 100px or velocity is high, close modal
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          closeSessionPicker();
        } else {
          // Snap back to open position
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Mock data for demonstration
  const mockResults: WordResult[] = [
    {
      id: '1',
      latin: 'amare',
      english: 'to love',
      partOfSpeech: 'verb',
      conjugation: '1st',
    },
    {
      id: '2',
      latin: 'puella',
      english: 'girl',
      partOfSpeech: 'noun',
      gender: 'f',
      declension: '1st',
    },
    {
      id: '3',
      latin: 'magnus',
      english: 'great, large',
      partOfSpeech: 'adjective',
      frequency: 'common',
    },
  ];

  const handleSearch = () => {
    // Mock search - in real app would call API
    if (searchQuery.length > 0) {
      setSearchResults(mockResults);
    } else {
      setSearchResults([]);
    }
  };

  const toggleSaveWord = (word: WordResult) => {
    if (savedWords.find(w => w.id === word.id)) {
      setSavedWords(savedWords.filter(w => w.id !== word.id));
    } else {
      setSavedWords([...savedWords, word]);
    }
  };

  const handleSessionSwitch = () => {
    setShowSessionPicker(true);
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSessionPicker = () => {
    // Animate out
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowSessionPicker(false);
    });
  };

  const selectSession = (session: Session) => {
    setCurrentSession(session);
    closeSessionPicker();
  };

  const handleNewSession = () => {
    // TODO: Show new session creation modal
    console.log('Create new session');
  };

  const renderWordCard = ({item}: {item: WordResult}) => {
    const isSaved = savedWords.find(w => w.id === item.id);
    
    return (
      <View style={styles.wordCard}>
        <View style={styles.wordHeader}>
          <Text style={styles.latinWord}>{item.latin}</Text>
          <TouchableOpacity onPress={() => toggleSaveWord(item)}>
            <Icon
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={24}
              color={colors.primary.blue}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.englishWord}>{item.english}</Text>
        <View style={styles.badgeContainer}>
          <View style={[commonStyles.badge, styles.partOfSpeechBadge]}>
            <Text style={commonStyles.badgeText}>{item.partOfSpeech}</Text>
          </View>
          {item.gender && (
            <View style={commonStyles.badge}>
              <Text style={commonStyles.badgeText}>{item.gender}</Text>
            </View>
          )}
          {item.declension && (
            <View style={commonStyles.badge}>
              <Text style={commonStyles.badgeText}>{item.declension} decl</Text>
            </View>
          )}
          {item.conjugation && (
            <View style={commonStyles.badge}>
              <Text style={commonStyles.badgeText}>{item.conjugation} conj</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[commonStyles.container, styles.safeAreaContainer]}>
      <Animated.View 
        style={[
          {flex: 1},
          {
            opacity: screenFadeAnim,
            transform: [{translateY: screenTranslateY}],
          },
        ]}
      >
        <View style={styles.searchContainer}>
        {isSearchFocused && (
          <View style={styles.searchModeContainer}>
            <TouchableOpacity
              style={[
                styles.searchModeButton,
                searchMode === 'latin' && styles.searchModeButtonActive,
              ]}
              onPress={() => setSearchMode('latin')}>
              <Text
                style={[
                  styles.searchModeText,
                  searchMode === 'latin' && styles.searchModeTextActive,
                ]}>
                Latin → English
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.searchModeButton,
                searchMode === 'english' && styles.searchModeButtonActive,
              ]}
              onPress={() => setSearchMode('english')}>
              <Text
                style={[
                  styles.searchModeText,
                  searchMode === 'english' && styles.searchModeTextActive,
                ]}>
                English → Latin
              </Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color={colors.neutral.lightGray} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${searchMode === 'latin' ? 'Latin' : 'English'} words...`}
            placeholderTextColor={colors.neutral.lightGray}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={20} color={colors.neutral.lightGray} />
            </TouchableOpacity>
          )}
          <View style={styles.searchBarDivider} />
          <TouchableOpacity 
            style={styles.bookmarkButtonInline}
            onPress={() => navigation.navigate('SavedWords' as never)}
          >
            <Icon 
              name="bookmarks" 
              size={20} 
              color={savedWords.length > 0 ? colors.primary.blue : colors.neutral.lightGray} 
            />
            {savedWords.length > 0 && (
              <View style={styles.bookmarkBadgeInline}>
                <Text style={styles.bookmarkBadgeText}>{savedWords.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={searchResults}
        renderItem={renderWordCard}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.resultsContainer}
        ListEmptyComponent={
          searchQuery.length > 0 && searchResults.length === 0 ? (
            <Text style={styles.emptyText}>No results found</Text>
          ) : null
        }
      />

      {/* Compact Session Bar */}
      <TouchableOpacity 
        style={styles.compactSessionBar}
        onPress={handleSessionSwitch}
      >
        <View style={[styles.sessionDot, { backgroundColor: currentSession.color }]} />
        <Text style={styles.compactSessionName}>
          {currentSession.name} ({savedWords.length})
        </Text>
        <Icon name="chevron-down" size={14} color={colors.neutral.gray} />
      </TouchableOpacity>


      </Animated.View>

      {/* Session Picker Modal - Moved outside animated view to cover entire screen */}
      {showSessionPicker && (
        <Animated.View 
          style={[
            styles.modalOverlayFullScreen,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.modalBackdrop}
            activeOpacity={1}
            onPress={closeSessionPicker}
          />
          <Animated.View 
            style={[
              styles.sessionPickerModal,
              {
                transform: [{ translateY: slideAnim }],
              }
            ]}
            {...panResponder.panHandlers}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Switch Session</Text>
              <TouchableOpacity onPress={closeSessionPicker}>
                <Icon name="close" size={24} color={colors.neutral.darkGray} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.sessionList}>
              {/* Add New Session Button */}
              <TouchableOpacity
                style={styles.addSessionOption}
                onPress={() => {
                  closeSessionPicker();
                  setTimeout(() => handleNewSession(), 250);
                }}
              >
                <View style={styles.addSessionIcon}>
                  <Icon name="add" size={14} color={colors.primary.blue} />
                </View>
                <Text style={styles.addSessionText}>Add New Session</Text>
              </TouchableOpacity>
              
              {sessions.map(session => (
                <TouchableOpacity
                  key={session.id}
                  style={[
                    styles.sessionOption,
                    currentSession.id === session.id && styles.sessionOptionActive
                  ]}
                  onPress={() => selectSession(session)}
                >
                  <View style={[styles.sessionOptionDot, {backgroundColor: session.color}]} />
                  <View style={styles.sessionOptionInfo}>
                    <Text style={styles.sessionOptionName}>
                      {session.name} ({session.wordCount})
                    </Text>
                  </View>
                  {currentSession.id === session.id && (
                    <Icon name="checkmark" size={20} color={colors.primary.blue} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: colors.neutral.white,
  },
  searchContainer: {
    backgroundColor: colors.neutral.white,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  searchModeContainer: {
    flexDirection: 'row',
    backgroundColor: colors.neutral.lightBackground,
    borderRadius: 8,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  searchModeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  searchModeButtonActive: {
    backgroundColor: colors.neutral.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchModeText: {
    ...typography.bodySmall,
    color: colors.neutral.gray,
  },
  searchModeTextActive: {
    color: colors.primary.blue,
    fontWeight: '600',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.neutral.lightBackground,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginHorizontal: 16,
    gap: 8,
    minHeight: 44,
  },
  searchBarDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.neutral.border,
    marginHorizontal: 4,
  },
  bookmarkButtonInline: {
    padding: 4,
    position: 'relative',
  },
  bookmarkBadgeInline: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: colors.primary.blue,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  bookmarkBadgeText: {
    ...typography.caption,
    color: colors.neutral.white,
    fontSize: 10,
    fontWeight: '600',
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    color: colors.neutral.darkGray,
    paddingVertical: 0,
    paddingTop: 0,
    paddingBottom: 0,
    margin: 0,
    lineHeight: 20, // Force consistent line height
    height: 20, // Match the line height
    textAlignVertical: 'center',
    includeFontPadding: false,
  },
  resultsContainer: {
    paddingVertical: 8,
  },
  wordCard: {
    ...commonStyles.card,
  },
  wordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  latinWord: {
    ...typography.h3,
    color: colors.neutral.darkGray,
  },
  englishWord: {
    ...typography.body,
    color: colors.neutral.gray,
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  partOfSpeechBadge: {
    backgroundColor: colors.neutral.lightBackground,
  },
  emptyText: {
    ...typography.body,
    color: colors.neutral.lightGray,
    textAlign: 'center',
    marginTop: 40,
  },
  compactSessionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.neutral.white,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
    gap: 8,
  },
  sessionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  compactSessionName: {
    ...typography.body,
    color: colors.neutral.darkGray,
    fontWeight: '600',
    flex: 1,
  },
  addSessionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
    gap: 12,
  },
  addSessionIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary.lightBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSessionText: {
    ...typography.bodySmall,
    color: colors.primary.blue,
    fontWeight: '600',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalOverlayFullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sessionPickerModal: {
    backgroundColor: colors.neutral.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  modalTitle: {
    ...typography.h3,
    color: colors.neutral.darkGray,
  },
  sessionList: {
    paddingHorizontal: 20,
  },
  sessionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
    gap: 12,
  },
  sessionOptionActive: {
    backgroundColor: colors.primary.lightBlue,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  sessionOptionDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  sessionOptionInfo: {
    flex: 1,
  },
  sessionOptionName: {
    ...typography.bodySmall,
    color: colors.neutral.darkGray,
    fontWeight: '600',
  },
});

export default GlossaryScreen;