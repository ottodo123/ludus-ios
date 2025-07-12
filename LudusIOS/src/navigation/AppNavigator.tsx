import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../styles/colors';

import GlossaryScreen from '../screens/GlossaryScreen';
import GrammarScreen from '../screens/GrammarScreen';
import FlashcardsScreen from '../screens/FlashcardsScreen';
import SentenceGeneratorScreen from '../screens/SentenceGeneratorScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LanguageSelectionScreen from '../screens/LanguageSelectionScreen';
import StudyScreen from '../screens/StudyScreen';
import SavedWordsScreen from '../screens/SavedWordsScreen';
import FlashcardsSettingsScreen from '../screens/FlashcardsSettingsScreen';
import CurriculumChaptersScreen from '../screens/CurriculumChaptersScreen';
import ChapterVocabularyScreen from '../screens/ChapterVocabularyScreen';
import SentenceGeneratorSettingsScreen from '../screens/SentenceGeneratorSettingsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const GlossaryStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen name="GlossaryMain" component={GlossaryScreen} />
      <Stack.Screen name="SavedWords" component={SavedWordsScreen} />
    </Stack.Navigator>
  );
};

const FlashcardsStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen name="FlashcardsMain" component={FlashcardsScreen} />
      <Stack.Screen name="CurriculumChapters" component={CurriculumChaptersScreen} />
      <Stack.Screen name="ChapterVocabulary" component={ChapterVocabularyScreen} />
      <Stack.Screen name="Study" component={StudyScreen} />
      <Stack.Screen name="FlashcardsSettings" component={FlashcardsSettingsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
    </Stack.Navigator>
  );
};

const SentenceGeneratorStack = () => {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen name="SentenceGeneratorMain" component={SentenceGeneratorScreen} />
      <Stack.Screen name="SentenceGeneratorSettings" component={SentenceGeneratorSettingsScreen} />
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary.blue,
          tabBarInactiveTintColor: colors.neutral.lightGray,
          tabBarStyle: {
            backgroundColor: colors.neutral.white,
            borderTopWidth: 1,
            borderTopColor: colors.neutral.border,
            paddingBottom: 34, // Add safe area padding for iPhone home indicator
            paddingTop: 5,
            height: 90, // Increase height to accommodate safe area
          },
          headerStyle: {
            backgroundColor: colors.neutral.white,
            borderBottomWidth: 1,
            borderBottomColor: colors.neutral.border,
          },
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
            color: colors.neutral.darkGray,
          },
          lazy: false, // Pre-load all tabs for smoother transitions
        }}>
        <Tab.Screen
          name="Glossary"
          component={GlossaryStack}
          options={{
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <Icon name="book-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Grammar"
          component={GrammarScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <Icon name="library-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Flashcards"
          component={FlashcardsStack}
          options={{
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <Icon name="albums-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Sentences"
          component={SentenceGeneratorStack}
          options={{
            headerShown: false,
            tabBarIcon: ({color, size}) => (
              <Icon name="create-outline" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;