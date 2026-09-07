import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';

// ⭐ 1. 길잡이 역할을 할 { navigation } 딱 하나만 제대로 받아오기!
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('로그인 시도:', email, password);
    // ⭐ 2. 버튼 누르면 'Main' 화면으로 날아가라고 명령!
    navigation.navigate('Main'); 
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Don't Forget</Text>
      <Text style={styles.subtitle}>다시 온 걸 환영해! 👋</Text>

      {/* 이메일 입력칸 */}
      <TextInput
        style={styles.input}
        placeholder="이메일을 입력하세요"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      {/* 비밀번호 입력칸 */}
      <TextInput
        style={styles.input}
        placeholder="비밀번호를 입력하세요"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry 
      />

      {/* 로그인 버튼 */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>로그인</Text>
      </TouchableOpacity>
    </View>
  ); // 여기서 함수(화면 렌더링) 끝!
}

// ⭐ 3. 스타일은 반드시 화면 함수 바깥(아래)에 둬야 해!
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', 
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#aaaaaa',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#3b82f6', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});