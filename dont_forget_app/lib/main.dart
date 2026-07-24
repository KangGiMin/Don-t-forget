import 'package:flutter/material.dart';
import 'services/api_service.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Don\'t Forget API Test',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const TodoTestScreen(),
    );
  }
}

class TodoTestScreen extends StatefulWidget {
  const TodoTestScreen({super.key});

  @override
  State<TodoTestScreen> createState() => _TodoTestScreenState();
}

class _TodoTestScreenState extends State<TodoTestScreen> {
  final String testUserId = 'test_user_123';
  
  List<dynamic> todos = [];
  bool isLoading = false;
  final TextEditingController _todoController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetchTodos();
  }

  // 1. Todo 목록 불러오기
  Future<void> _fetchTodos() async {
    setState(() => isLoading = true);
    try {
      final fetchedTodos = await ApiService.getTodos(testUserId);
      setState(() {
        todos = fetchedTodos;
      });
    } catch (e) {
      _showSnackBar('데이터 불러오기 실패: $e');
    } finally {
      setState(() => isLoading = false);
    }
  }

  // 2. 새 Todo 추가
  Future<void> _addTodo() async {
    if (_todoController.text.trim().isEmpty) return;

    try {
      final newTodoData = {
        'user_id': testUserId,
        'title': _todoController.text.trim(),
        'content': 'Flutter 앱에서 추가된 할 일',
        'due_date': DateTime.now().add(const Duration(days: 1)).toIso8601String(),
        'priority': 'MEDIUM',
      };

      await ApiService.createTodo(newTodoData);
      _todoController.clear();
      _fetchTodos(); 
    } catch (e) {
      _showSnackBar('Todo 추가 실패: $e');
    }
  }

  // 3. Todo 완료/미완료 토글 (수정 UPDATE)
  Future<void> _toggleTodoStatus(String todoId, bool currentStatus) async {
    try {
      await ApiService.updateTodo(todoId, {
        'is_completed': !currentStatus,
      });
      _fetchTodos(); // 상태 변경 후 목록 갱신
    } catch (e) {
      _showSnackBar('상태 변경 실패: $e');
    }
  }

  // 4. Todo 삭제 (DELETE)
  Future<void> _deleteTodo(String todoId) async {
    try {
      await ApiService.deleteTodo(todoId);
      _fetchTodos(); // 삭제 후 목록 갱신
      _showSnackBar('할 일이 삭제되었습니다!');
    } catch (e) {
      _showSnackBar('삭제 실패: $e');
    }
  }

  void _showSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(message)),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Don\'t Forget API 연동 테스트'),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _fetchTodos,
          )
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            // 입력창 영역
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _todoController,
                    decoration: const InputDecoration(
                      labelText: '새 할 일 입력',
                      border: OutlineInputBorder(),
                    ),
                  ),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                  onPressed: _addTodo,
                  style: ElevatedButton.styleFrom(padding: const EdgeInsets.all(16)),
                  child: const Text('추가'),
                ),
              ],
            ),
            const SizedBox(height: 20),
            // 목록 영역
            Expanded(
              child: isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : todos.isEmpty
                      ? const Center(child: Text('등록된 할 일이 없습니다.'))
                      : ListView.builder(
                          itemCount: todos.length,
                          itemBuilder: (context, index) {
                            final item = todos[index];
                            final bool isCompleted = item['is_completed'] ?? false;
                            final String todoId = item['id'].toString();

                            return Card(
                              child: ListTile(
                                // 체크박스로 완료 처리
                                leading: Checkbox(
                                  value: isCompleted,
                                  onChanged: (_) => _toggleTodoStatus(todoId, isCompleted),
                                ),
                                title: Text(
                                  item['title'] ?? '',
                                  style: TextStyle(
                                    decoration: isCompleted
                                        ? TextDecoration.lineThrough
                                        : TextDecoration.none,
                                    color: isCompleted ? Colors.grey : Colors.black,
                                  ),
                                ),
                                subtitle: Text(item['content'] ?? ''),
                                // 쓰레기통 버튼으로 삭제 처리
                                trailing: IconButton(
                                  icon: const Icon(Icons.delete, color: Colors.redAccent),
                                  onPressed: () => _deleteTodo(todoId),
                                ),
                              ),
                            );
                          },
                        ),
            ),
          ],
        ),
      ),
    );
  }
}