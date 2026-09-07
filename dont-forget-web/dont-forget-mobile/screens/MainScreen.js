import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import useTodoStore from '../store/todoStore'; // ⭐ 우리가 만든 통제실 불러오기!
import React, { useState, useEffect } from 'react';

export default function MainScreen() {
  const [inputText, setInputText] = useState(''); // 입력창 텍스트 임시 저장소
  
  // 통제실에서 데이터(todos)랑 행동 지침들 쏙쏙 빼오기
  const { todos, addTodo, toggleTodo, deleteTodo, fetchTodos } = useTodoStore(); 

  // 화면이 켜질 때 서버에서 데이터(todos) 불러오기
  useEffect(() => {
    fetchTodos();
  }, []);


  // 추가 버튼 눌렀을 때 실행될 함수
  const handleAdd = () => {
    if (inputText.trim() === '') return; // 빈칸 꼼수 입력 방지
    addTodo(inputText); // 창고에 할 일 추가 명령
    setInputText(''); // 입력창 깔끔하게 비워주기
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>오늘의 할 일 📝</Text>

      {/* 할 일 입력창 & 추가 버튼 묶음 */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="새로운 할 일을 입력하세요"
          placeholderTextColor="#888"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>추가</Text>
        </TouchableOpacity>
      </View>

      {/* 할 일 리스트를 화면에 쫙 뿌려주는 모바일의 꽃 FlatList! */}
      <FlatList
        data={todos} // 뿌려줄 데이터는 통제실에서 가져온 todos
        keyExtractor={(item) => item.id} // 각 항목의 고유 열쇠는 id
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            {/* 텍스트 영역 (누르면 완료 토글) */}
            <TouchableOpacity onPress={() => toggleTodo(item.id)} style={styles.todoTextContainer}>
              <Text style={[styles.todoText, item.done && styles.todoTextDone]}>
                {item.done ? '✅ ' : '⬜ '}{item.text}
              </Text>
            </TouchableOpacity>
            
            {/* 삭제 버튼 */}
            <TouchableOpacity onPress={() => deleteTodo(item.id)} style={styles.deleteButton}>
              <Text style={styles.deleteButtonText}>❌</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

// 다크모드 스타일링
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 20 },
  inputContainer: { flexDirection: 'row', marginBottom: 20 },
  input: { flex: 1, backgroundColor: '#1e1e1e', color: '#fff', padding: 15, borderRadius: 8, fontSize: 16 },
  addButton: { backgroundColor: '#3b82f6', padding: 15, borderRadius: 8, marginLeft: 10, justifyContent: 'center' },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  todoItem: { flexDirection: 'row', backgroundColor: '#1e1e1e', padding: 15, borderRadius: 8, marginBottom: 10, alignItems: 'center', justifyContent: 'space-between' },
  todoTextContainer: { flex: 1 },
  todoText: { color: '#fff', fontSize: 16 },
  todoTextDone: { color: '#888', textDecorationLine: 'line-through' },
  deleteButton: { padding: 5 },
  deleteButtonText: { fontSize: 16 }
});