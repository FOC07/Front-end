import React, { useContext, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/Dashboard';
import TaskScreen from './src/screens/TaskScreen';

import { AuthProvider, AuthContext } from './src/context/authContext';

const NavigationWrapper = () => {
  const { userToken, isLoading } = useContext(AuthContext);

  const [screen, setScreen] = useState("dashboard"); // 👈 inicia directo en dashboard

  // 🔄 Loading inicial
  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#39A900" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  // 🔐 No logueado
  if (!userToken) {
    return <LoginScreen />;
  }

  // ✅ DASHBOARD DIRECTO
  if (screen === "dashboard") {
    return <DashboardScreen goToTasks={() => setScreen("tasks")} />;
  }

  // 📋 TASKS
  if (screen === "tasks") {
    return <TaskScreen goBack={() => setScreen("dashboard")} />;
  }

  return null;
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationWrapper />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});