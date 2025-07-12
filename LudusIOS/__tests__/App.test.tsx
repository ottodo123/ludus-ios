/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-safe-area-context', () => {
  const inset = {top: 0, right: 0, bottom: 0, left: 0};
  return {
    SafeAreaProvider: ({children}: any) => children,
    SafeAreaConsumer: ({children}: any) => children(inset),
    SafeAreaView: ({children}: any) => children,
    useSafeAreaInsets: () => inset,
  };
});
jest.mock('react-native-screens', () => ({
  enableScreens: jest.fn(),
}));
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({children}: any) => children,
}));
jest.mock('@react-navigation/bottom-tabs', () => ({
  createBottomTabNavigator: () => ({
    Navigator: ({children}: any) => children,
    Screen: () => null,
  }),
}));

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
