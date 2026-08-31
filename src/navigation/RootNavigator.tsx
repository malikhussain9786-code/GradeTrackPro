import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { HomeScreen } from '../screens/universities/HomeScreen';
import { UniversityInfoScreen } from '../screens/universities/UniversityInfoScreen';
import { SgpaCourseEntryScreen } from '../screens/calculator/SgpaCourseEntryScreen';
import { SgpaResultScreen } from '../screens/calculator/SgpaResultScreen';
import { CgpaEntryScreen } from '../screens/calculator/CgpaEntryScreen';
import { CgpaResultScreen } from '../screens/calculator/CgpaResultScreen';
import { SemesterListScreen } from '../screens/calculator/SemesterListScreen';
import { MainTabNavigator } from './MainTabNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="UniversityInfo" component={UniversityInfoScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="SgpaCourseEntry" component={SgpaCourseEntryScreen} />
      <Stack.Screen name="SgpaResult" component={SgpaResultScreen} />
      <Stack.Screen name="CgpaEntry" component={CgpaEntryScreen} />
      <Stack.Screen name="CgpaResult" component={CgpaResultScreen} />
      <Stack.Screen name="SemesterList" component={SemesterListScreen} />
    </Stack.Navigator>
  );
}
