/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView, } from 'react-native-gesture-handler';

import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import AppRouter from './src/AppRouter';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <GestureHandlerRootView style={{ flex: 1 }}>
      <AppContent />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

function AppContent() {


  return (
    <View style={styles.container}>
     <AppRouter/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box:{marginVertical:50,
    borderRadius:12,
    height:100,
    width:100,
     backgroundColor:'red',
     justifyContent:'center',
     alignItems:'center'}
});

export default App;
