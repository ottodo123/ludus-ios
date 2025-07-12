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
import {useNavigation, useRoute, useFocusEffect} from '@react-navigation/native';

interface Language {
  id: string;
  name: string;
  flag: string;
  description: string;
}

const LanguageSelectionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {currentLanguage, onLanguageSelect} = route.params as any;
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  
  const languages: Language[] = [
    {
      id: 'latin',
      name: 'Latin',
      flag: '🏛️',
      description: 'Classical Latin language and literature',
    },
    {
      id: 'greek',
      name: 'Ancient Greek',
      flag: '🏺',
      description: 'Classical Greek language and texts',
    },
    {
      id: 'french',
      name: 'French',
      flag: '🇫🇷',
      description: 'Modern French language',
    },
    {
      id: 'german',
      name: 'German',
      flag: '🇩🇪',
      description: 'Modern German language',
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
  
  const handleLanguageSelect = (language: Language) => {
    if (onLanguageSelect) {
      onLanguageSelect(language.name);
    }
    navigation.goBack();
  };
  
  const renderLanguageOption = (language: Language) => {
    const isSelected = currentLanguage === language.name;
    
    return (
      <TouchableOpacity
        key={language.id}
        style={[styles.languageCard, isSelected && styles.languageCardActive]}
        onPress={() => handleLanguageSelect(language)}
      >
        <View style={styles.languageHeader}>
          <View style={styles.languageInfo}>
            <Text style={styles.languageFlag}>{language.flag}</Text>
            <View style={styles.languageDetails}>
              <Text style={[styles.languageName, isSelected && styles.languageNameActive]}>
                {language.name}
              </Text>
              <Text style={styles.languageDescription}>{language.description}</Text>
            </View>
          </View>
          <View style={styles.languageSelection}>
            {isSelected ? (
              <View style={styles.selectedIndicator}>
                <Icon name="checkmark-circle" size={24} color={colors.primary.blue} />
              </View>
            ) : (
              <View style={styles.unselectedIndicator}>
                <View style={styles.unselectedCircle} />
              </View>
            )}
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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={colors.neutral.darkGray} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Select Language</Text>
            <Text style={styles.headerSubtitle}>Choose your study language</Text>
          </View>
        </View>
        
        {/* Language Options */}
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.languagesList}>
            <Text style={styles.sectionTitle}>Available Languages</Text>
            {languages.map(renderLanguageOption)}
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
  sectionTitle: {
    ...typography.h4,
    color: colors.neutral.darkGray,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  languagesList: {
    paddingBottom: 32,
  },
  languageCard: {
    backgroundColor: colors.neutral.white,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageCardActive: {
    borderColor: colors.primary.blue,
    backgroundColor: colors.primary.lightBlue,
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  languageFlag: {
    fontSize: 32,
    marginRight: 16,
    width: 40,
    textAlign: 'center',
  },
  languageDetails: {
    flex: 1,
  },
  languageName: {
    ...typography.h4,
    color: colors.neutral.darkGray,
    marginBottom: 4,
  },
  languageNameActive: {
    color: colors.primary.darkBlue,
    fontWeight: '600',
  },
  languageDescription: {
    ...typography.bodySmall,
    color: colors.neutral.gray,
  },
  languageSelection: {
    marginLeft: 12,
  },
  selectedIndicator: {
    // Icon handles its own styling
  },
  unselectedIndicator: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unselectedCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.neutral.lightGray,
  },
});

export default LanguageSelectionScreen;