import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { StatusBar } from "expo-status-bar";
import LoginScreen from "../features/auth/screens/LoginScreen";
import SignupScreen from "../features/auth/screens/SignupScreen";
import FindIdScreen from "../features/auth/screens/FindIdScreen";
import FindPasswordScreen from "../features/auth/screens/FindPasswordScreen";
import MainScreen from "../features/todos/screens/MainScreen";
import ProfileScreen from "../features/profile/screens/ProfileScreen";
import ContactAdminScreen from "../features/admin/screens/ContactAdminScreen";
import { auth } from "../services/firebase/firebase";
import { ThemeProvider, useTheme } from "../shared/theme/ThemeContext";

const Stack = createNativeStackNavigator();

function NavigatorContent() {
  const [user, setUser] = useState(undefined);
  const { colors, resolvedTheme } = useTheme();
  useEffect(() => onAuthStateChanged(auth, setUser), []);

  if (user === undefined) return <View style={[styles.loading, { backgroundColor: colors.background }]}><ActivityIndicator color={colors.primary} size="large" /></View>;

  return (
    <>
      <StatusBar style={resolvedTheme === "dark" ? "light" : "dark"} backgroundColor={colors.background} />
      <NavigationContainer>
      <Stack.Navigator key={user ? "authenticated" : "guest"} screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background }, animation: "fade" }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={MainScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="ContactAdmin" component={ContactAdminScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="FindId" component={FindIdScreen} />
            <Stack.Screen name="FindPassword" component={FindPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function RootNavigator() { return <ThemeProvider><NavigatorContent /></ThemeProvider>; }

const styles = StyleSheet.create({ loading: { flex: 1, justifyContent: "center", alignItems: "center" } });
