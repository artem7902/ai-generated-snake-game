import './global.css';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native';
import { GameScreen } from './src/screens/GameScreen';

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-[#1a1a2e]">
      <GameScreen />
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
