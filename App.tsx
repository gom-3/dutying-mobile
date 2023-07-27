import React from 'react';
import { StatusBar } from 'expo-status-bar';
import Router from './src/pages/Router';

export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <Router />
    </>
  );
}
