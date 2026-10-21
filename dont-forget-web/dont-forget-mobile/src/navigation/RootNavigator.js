import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import LoginScreen from "../features/auth/screens/LoginScreen";
import SignupScreen from "../features/auth/screens/SignupScreen";
import FindIdScreen from "../features/auth/screens/FindIdScreen";
import FindPasswordScreen from "../features/auth/screens/FindPasswordScreen";
import MainScreen from "../features/todos/screens/MainScreen";
import ProfileScreen from "../features/profile/screens/ProfileScreen";
import ContactAdminScreen from "../features/admin/screens/ContactAdminScreen";
import { auth } from "../services/firebase/firebase";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [user, setUser] = useState(undefined);
  useEffect(() => onAuthStateChanged(auth, setUser), []);

  if (user === undefined) {
    return <View style={styles.loading}><ActivityIndicator color="#3b82f6" size="large" /></View>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator key={user ? "authenticated" : "guest"} screenOptions={{ headerShown: false }}>
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
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: "#121212", justifyContent: "center", alignItems: "center" },
});
