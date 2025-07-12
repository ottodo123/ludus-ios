import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const TestScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>App is running!</Text>
      <Text style={styles.text}>All three screens are available:</Text>
      <Text style={styles.text}>1. Glossary</Text>
      <Text style={styles.text}>2. Flashcards</Text>
      <Text style={styles.text}>3. Sentences</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default TestScreen;