import React from 'react';
import {View, Text, StyleSheet, DevSettings} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

// Enable Fast Refresh in dev mode
if (__DEV__) {
  if (DevSettings) {
    DevSettings.addMenuItem('Enable Fast Refresh', () => {
      console.log('Fast Refresh enabled');
    });
  }
}


const SHOW_TEST = false; // Change to true to see test screen

const TestApp = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>LUDUS iOS App is Running!</Text>
      <Text style={styles.subtitle}>The app has 3 screens:</Text>
      <Text style={styles.item}>1. Glossary (with search)</Text>
      <Text style={styles.item}>2. Flashcards (with curriculum folders)</Text>
      <Text style={styles.item}>3. Sentence Generator (coming soon)</Text>
      <Text style={styles.info}>Change SHOW_TEST to false in App.tsx to see the real app</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 10,
    color: '#666',
  },
  item: {
    fontSize: 16,
    marginVertical: 5,
    color: '#666',
  },
  info: {
    fontSize: 14,
    marginTop: 20,
    color: '#999',
    textAlign: 'center',
  },
});

const App = () => {
  if (SHOW_TEST) {
    return <TestApp />;
  }
  return <AppNavigator />;
};

export default App;
