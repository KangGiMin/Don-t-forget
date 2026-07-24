class ApiConfig {
  // 💡 안드로이드 에뮬레이터 테스트 시에는 'http://10.0.2.2:5000/api'
  // 💡 Chrome 웹 테스트 시에는 'http://localhost:5000/api'
  static const String baseUrl = 'http://localhost:5000/api';
  
  // 엔드포인트 모음
  static const String users = '$baseUrl/users';
  static const String todos = '$baseUrl/todos';
  static const String categories = '$baseUrl/categories';
}