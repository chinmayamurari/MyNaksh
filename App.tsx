/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView, Text } from 'react-native-gesture-handler';
import Animated,{useAnimatedStyle, useSharedValue, withSpring,} from 'react-native-reanimated';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

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
  const safeAreaInsets = useSafeAreaInsets();
  const offset = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offset.value }],
    };
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {
        offset.value = withSpring(offset.value + 100);
      }}>
        <Animated.View style={[styles.box,animatedStyle]}>
        <Text>Click me</Text>
        </Animated.View>
      </TouchableOpacity>
      <NewAppScreen
        templateFileName="App.tsx"
        safeAreaInsets={safeAreaInsets}
      />
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
