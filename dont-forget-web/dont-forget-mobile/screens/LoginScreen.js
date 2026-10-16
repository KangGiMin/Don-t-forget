import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

export default function LoginScreen() {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async () => {
    const normalizedEmail = email.trim();
    if (!normalizedEmail || password.length < 6) {
      Alert.alert('입력 확인', '이메일과 6자 이상의 비밀번호를 입력해 주세요.');
      return;
    }
    if (isSigningUp && !name.trim()) {
      Alert.alert('입력 확인', '이름을 입력해 주세요.');
      return;
    }

    setBusy(true);
    try {
      if (isSigningUp) {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          normalizedEmail,
          password,
        );
        await updateProfile(user, { displayName: name.trim() });
      } else {
        await signInWithEmailAndPassword(auth, normalizedEmail, password);
      }
    } catch (error) {
      console.error('모바일 인증 실패:', error);
      Alert.alert(
        isSigningUp ? '회원가입 실패' : '로그인 실패',
        '입력한 정보를 확인한 뒤 다시 시도해 주세요.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Don't Forget</Text>
      <Text style={styles.subtitle}>
        {isSigningUp ? '새 계정을 만들어 보세요.' : '다시 온 걸 환영해요.'}
      </Text>

      {isSigningUp && (
        <TextInput
          style={styles.input}
          placeholder="이름"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="이메일"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호 (6자 이상)"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete={isSigningUp ? 'new-password' : 'current-password'}
      />

      <TouchableOpacity
        style={[styles.button, busy && styles.disabledButton]}
        onPress={handleSubmit}
        disabled={busy}
      >
        <Text style={styles.buttonText}>
          {busy ? '처리 중...' : isSigningUp ? '회원가입' : '로그인'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setIsSigningUp((value) => !value)}
        disabled={busy}
      >
        <Text style={styles.switchText}>
          {isSigningUp ? '이미 계정이 있나요? 로그인' : '계정이 없나요? 회원가입'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

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
    marginBottom: 32,
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
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    padding: 16,
    alignItems: 'center',
  },
  switchText: {
    color: '#93c5fd',
  },
});
