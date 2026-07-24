import 'dart:convert';
import 'package:http/http.dart' as http;
import 'api_config.dart';

class ApiService {
  // 1. 유저 회원가입 / 저장 API
  static Future<Map<String, dynamic>> saveUser(Map<String, dynamic> userData) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.users),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(userData),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('유저 정보 저장 실패: ${response.statusCode}');
      }
    } catch (e) {
      print('saveUser Error: $e');
      rethrow;
    }
  }

  // 2. 특정 유저의 모든 Todo 목록 불러오기 API
  static Future<List<dynamic>> getTodos(String userId) async {
    try {
      final response = await http.get(
        Uri.parse('${ApiConfig.todos}/user/$userId'),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data['todos'] ?? [];
      } else {
        throw Exception('Todo 목록 불러오기 실패: ${response.statusCode}');
      }
    } catch (e) {
      print('getTodos Error: $e');
      rethrow;
    }
  }

  // 3. 새로운 Todo 생성 API
  static Future<Map<String, dynamic>> createTodo(Map<String, dynamic> todoData) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.todos),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(todoData),
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Todo 생성 실패: ${response.statusCode}');
      }
    } catch (e) {
      print('createTodo Error: $e');
      rethrow;
    }
  }

  // 4. Todo 상태/내용 수정 API (완료 처리 등)
  static Future<Map<String, dynamic>> updateTodo(String todoId, Map<String, dynamic> updateData) async {
    try {
      final response = await http.put(
        Uri.parse('${ApiConfig.todos}/$todoId'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(updateData),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Todo 수정 실패: ${response.statusCode}');
      }
    } catch (e) {
      print('updateTodo Error: $e');
      rethrow;
    }
  }

  // 5. Todo 삭제 API
  static Future<Map<String, dynamic>> deleteTodo(String todoId) async {
    try {
      final response = await http.delete(
        Uri.parse('${ApiConfig.todos}/$todoId'),
      );

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      } else {
        throw Exception('Todo 삭제 실패: ${response.statusCode}');
      }
    } catch (e) {
      print('deleteTodo Error: $e');
      rethrow;
    }
  }
}