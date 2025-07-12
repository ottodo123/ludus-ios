import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../styles/colors';
import {typography} from '../styles/typography';
import {commonStyles} from '../styles/commonStyles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import { SentenceGeneratorService } from '../services/sentenceGenerator';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isTyping?: boolean;
  hasNewWord?: boolean;
}

interface Settings {
  wordsMode: 'study' | 'learn';
  difficulty: 'easy' | 'medium' | 'hard';
  focusVocab: string[];
  focusGrammar: string[];
}

const SentenceGeneratorScreen = () => {
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m powered by Claude AI and can help you generate authentic Latin sentences using your vocabulary and grammar preferences. Just tell me what kind of sentence you\'d like, or click "Compose" for a quick start!',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [settings, setSettings] = useState<Settings>({
    wordsMode: 'study',
    difficulty: 'medium',
    focusVocab: [],
    focusGrammar: [],
  });
  
  const scrollViewRef = useRef<ScrollView>(null);
  
  const mockSentenceResponses = [
    'Here\'s a sentence using your vocabulary:\n\n**Puella aquam amat.**\n*The girl loves water.*',
    'I\'ve created this for you:\n\n**Magnus puer librum legit.**\n*The big boy reads a book.*',
    'Using your words, here\'s a sentence:\n\n**Bona mater filiam vocat.**\n*The good mother calls her daughter.*',
    'Here\'s what I generated:\n\n**Dominus servos in agro videt.**\n*The master sees the slaves in the field.*',
  ];

  const mockLearnModeResponses = [
    'Here\'s a sentence with a new word:\n\n**Poeta carmina scribit.**\n*The poet writes songs.*\n\nNew word: **poeta** (poet)',
    'Learning something new:\n\n**Nauta navem gubernat.**\n*The sailor steers the ship.*\n\nNew word: **nauta** (sailor)',
    'Let\'s try this:\n\n**Medicus aegrotum curat.**\n*The doctor heals the sick person.*\n\nNew word: **medicus** (doctor)',
    'Here\'s a new sentence:\n\n**Agricola agrum colit.**\n*The farmer cultivates the field.*\n\nNew word: **agricola** (farmer)',
  ];

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const sendMessage = async () => {
    const messageText = inputText.trim();
    if (messageText === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };

    const typingMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: '',
      isUser: false,
      timestamp: new Date(),
      isTyping: true,
    };

    setMessages(prev => [...prev, userMessage, typingMessage]);
    setInputText('');

    try {
      // Call real AI service
      const result = await SentenceGeneratorService.generateSentence({
        wordsMode: settings.wordsMode,
        difficulty: settings.difficulty,
        focusVocab: settings.focusVocab,
        focusGrammar: settings.focusGrammar,
        customPrompt: messageText,
      });

      let responseText = '';
      if (result.success && result.data) {
        responseText = `**Latin:** ${result.data.sentence}\n\n**English:** ${result.data.translation}`;
        if (result.data.explanation) {
          responseText += `\n\n**Grammar:** ${result.data.explanation}`;
        }
      } else {
        responseText = `Sorry, I encountered an error generating your sentence: ${result.error || 'Unknown error'}`;
      }
      
      const botMessage = {
        id: (Date.now() + 2).toString(),
        text: responseText,
        isUser: false,
        timestamp: new Date(),
        hasNewWord: settings.wordsMode === 'learn',
      };
      
      setMessages(prev => prev.filter(msg => !msg.isTyping).concat(botMessage));
    } catch (error) {
      const errorMessage = {
        id: (Date.now() + 2).toString(),
        text: 'Sorry, I\'m having trouble connecting to generate sentences right now. Please try again later.',
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => prev.filter(msg => !msg.isTyping).concat(errorMessage));
    }
  };
  
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

  const renderMessage = (message: Message) => {
    if (message.isTyping) {
      return (
        <View key={message.id} style={[styles.messageContainer, styles.botMessageContainer]}>
          <View style={styles.botMessage}>
            <View style={styles.typingIndicator}>
              <View style={styles.typingDot} />
              <View style={[styles.typingDot, styles.typingDotDelay1]} />
              <View style={[styles.typingDot, styles.typingDotDelay2]} />
            </View>
          </View>
        </View>
      );
    }

    return (
      <View 
        key={message.id} 
        style={[
          styles.messageContainer,
          message.isUser ? styles.userMessageContainer : styles.botMessageContainer
        ]}
      >
        <View style={[
          styles.messageBubble,
          message.isUser ? styles.userMessage : styles.botMessage
        ]}>
          <Text style={[
            styles.messageText,
            message.isUser ? styles.userMessageText : styles.botMessageText
          ]}>
            {message.text}
          </Text>
          {message.hasNewWord && !message.isUser && (
            <TouchableOpacity 
              style={styles.addWordButton}
              onPress={() => {
                // TODO: Add word to saved list functionality
                console.log('Add word to saved list');
              }}
            >
              <Icon name="bookmark-outline" size={16} color={colors.primary.blue} />
              <Text style={styles.addWordText}>Add to Saved</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.timestamp}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    );
  };

  const SettingsModal = () => (
    <View style={styles.settingsOverlay}>
      <View style={styles.settingsModal}>
        <View style={styles.settingsHeader}>
          <Text style={styles.settingsTitle}>Generator Settings</Text>
          <TouchableOpacity onPress={() => setShowSettings(false)}>
            <Icon name="close" size={24} color={colors.neutral.darkGray} />
          </TouchableOpacity>
        </View>

        <View style={styles.settingSection}>
          <Text style={styles.settingLabel}>Words to Use</Text>
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
              ? 'Uses only words from your daily review catalog'
              : 'Slowly introduces new words as you learn'
            }
          </Text>
        </View>

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
        </View>


        <TouchableOpacity
          style={styles.settingsSaveButton}
          onPress={() => setShowSettings(false)}
        >
          <Text style={styles.settingsSaveText}>Done</Text>
        </TouchableOpacity>
      </View>
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
        <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <Icon name="sparkles" size={20} color={colors.primary.blue} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Sentence Generator</Text>
              <Text style={styles.headerSubtitle}>AI Latin Tutor</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => navigation.navigate('SentenceGeneratorSettings' as never)}
          >
            <Icon name="settings-outline" size={24} color={colors.neutral.darkGray} />
          </TouchableOpacity>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Compose Button */}
        <View style={styles.composeContainer}>
          <TouchableOpacity 
            style={styles.composeButton}
            onPress={() => {
              const message = 'Generate a Latin sentence for me to practice.';
              setInputText(message);
              // Auto-send the compose request
              setTimeout(() => sendMessage(), 100);
            }}
          >
            <Icon name="create-outline" size={20} color={colors.neutral.white} />
            <Text style={styles.composeButtonText}>Compose</Text>
          </TouchableOpacity>
        </View>

        {/* Input */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Ask me to generate a sentence..."
              placeholderTextColor={colors.neutral.lightGray}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                inputText.trim() === '' && styles.sendButtonDisabled
              ]}
              onPress={sendMessage}
              disabled={inputText.trim() === ''}
            >
              <Icon 
                name="send" 
                size={20} 
                color={inputText.trim() === '' ? colors.neutral.lightGray : colors.neutral.white} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary.lightBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.h4,
    color: colors.neutral.darkGray,
  },
  headerSubtitle: {
    ...typography.caption,
    color: colors.neutral.gray,
  },
  settingsButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messageContainer: {
    marginVertical: 8,
  },
  userMessageContainer: {
    alignItems: 'flex-end',
  },
  botMessageContainer: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userMessage: {
    backgroundColor: colors.primary.blue,
    borderBottomRightRadius: 4,
  },
  botMessage: {
    backgroundColor: colors.neutral.lightBackground,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    ...typography.body,
    lineHeight: 20,
  },
  userMessageText: {
    color: colors.neutral.white,
  },
  botMessageText: {
    color: colors.neutral.darkGray,
  },
  timestamp: {
    ...typography.caption,
    color: colors.neutral.lightGray,
    marginTop: 4,
    marginHorizontal: 16,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.neutral.gray,
  },
  typingDotDelay1: {
    opacity: 0.7,
  },
  typingDotDelay2: {
    opacity: 0.4,
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.neutral.lightBackground,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  textInput: {
    flex: 1,
    ...typography.body,
    color: colors.neutral.darkGray,
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.neutral.border,
  },
  addWordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: colors.primary.lightBlue,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  addWordText: {
    ...typography.caption,
    color: colors.primary.blue,
    fontWeight: '600',
  },
  composeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  composeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary.blue,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    gap: 8,
  },
  composeButtonText: {
    ...typography.button,
    color: colors.neutral.white,
    fontWeight: '600',
  },
});

export default SentenceGeneratorScreen;