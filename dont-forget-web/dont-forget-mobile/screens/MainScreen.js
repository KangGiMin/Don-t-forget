import React, { useState, useEffect } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";
import useTodoStore from "../store/todoStore";

export default function MainScreen() {
  const [inputText, setInputText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  // 1. 중앙 통제실(Zustand)에서 데이터랑 통신 함수들 싹 다 꺼내오기!
  const {
    todos,
    fetchTodos,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    clearTodos,
  } = useTodoStore();

  // 2. 화면이 딱 처음 켜질 때, 서버에서 내 할 일 목록 불러오기
  useEffect(() => {
    clearTodos();
    fetchTodos().catch((error) => {
      Alert.alert("목록 조회 실패", error.message);
    });
  }, [clearTodos, fetchTodos]);

  // 3. 할 일 추가 버튼 눌렀을 때 동작하는 함수
  const handleAdd = async () => {
    if (!inputText.trim()) return;

    try {
      await addTodo(inputText);
      setInputText("");
    } catch (error) {
      Alert.alert("할 일 추가 실패", error.message);
    }
  };

  const handleToggle = async (todo) => {
    try {
      await toggleTodo(todo._id, todo.completed);
    } catch (error) {
      Alert.alert("완료 상태 수정 실패", error.message);
    }
  };

  const handleSaveEdit = async (id) => {
    if (!editText.trim()) {
      Alert.alert("입력 확인", "할 일 내용을 입력해 주세요.");
      return;
    }

    try {
      await updateTodo(id, { text: editText.trim() });
      setEditingId(null);
      setEditText("");
    } catch (error) {
      Alert.alert("할 일 수정 실패", error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
    } catch (error) {
      Alert.alert("할 일 삭제 실패", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      clearTodos();
      await signOut(auth);
    } catch (error) {
      Alert.alert("로그아웃 실패", error.message);
    }
  };

  // 4. 리스트의 항목을 하나하나 예쁘게 그려주는 공장장 함수
  const renderItem = ({ item }) => (
    <View style={styles.todoItem}>
      <View style={{ flex: 1 }}>
        {editingId === item._id ? (
          <>
            <TextInput
              style={styles.input}
              value={editText}
              onChangeText={setEditText}
              autoFocus
            />
            <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
              <TouchableOpacity onPress={() => handleSaveEdit(item._id)}>
                <Text style={styles.addButtonText}>저장</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setEditingId(null);
                  setEditText("");
                }}
              >
                <Text style={styles.todoText}>취소</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <TouchableOpacity onPress={() => handleToggle(item)}>
            <Text
              style={[styles.todoText, item.completed && styles.todoTextDone]}
            >
              {item.completed ? "✅" : "⬜"} {item.text}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {editingId !== item._id && (
        <TouchableOpacity
          onPress={() => {
            setEditingId(item._id);
            setEditText(item.text);
          }}
          style={styles.deleteButton}
        >
          <Text style={styles.todoText}>수정</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={() => handleDelete(item._id)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>내 할 일 목록 📝</Text>
        <TouchableOpacity onPress={handleLogout} accessibilityRole="button">
          <Text style={styles.logoutText}>로그아웃</Text>
        </TouchableOpacity>
      </View>

      {/* 상단: 새로운 할 일 입력창과 추가 버튼 */}
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

      {/* 하단: 데이터 배열(todos)을 받아서 화면에 쫙 뿌려주는 FlatList */}
      <FlatList
        data={todos}
        keyExtractor={(item) => String(item._id)}
        renderItem={renderItem}
      />
    </View>
  );
}

// 흑화 다크모드 스타일링 완벽 이식 🖤
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoutText: {
    color: "#93c5fd",
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: "#1e1e1e",
    color: "#ffffff",
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#333",
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#3b82f6",
    padding: 15,
    borderRadius: 8,
    justifyContent: "center",
  },
  addButtonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  todoItem: {
    flexDirection: "row",
    backgroundColor: "#1e1e1e",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
  todoTextContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  todoText: {
    color: "#ffffff",
    fontSize: 16,
    marginLeft: 10,
  },
  todoTextDone: {
    color: "#888888",
    textDecorationLine: "line-through", // 완료 시 취소선 쫙!
  },
  deleteButton: {
    padding: 5,
  },
  deleteButtonText: {
    fontSize: 18,
  },
});
