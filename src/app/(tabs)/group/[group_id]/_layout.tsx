import React from 'react';
import {Stack} from 'expo-router';

export default function GroupStack() {
  return (
    <Stack>
      <Stack.Screen name="details" options={{headerShown: false, title: 'Group Details'}}/>
      <Stack.Screen name="expense" options={{headerShown: false,title: 'Expenses'}}/>
      <Stack.Screen name="update" options={{headerShown: false,title: 'Update group'}}/>
    </Stack>
  );
}