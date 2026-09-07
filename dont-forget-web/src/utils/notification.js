// 1. 브라우저한테 알림 권한을 요청하는 함수
export const requestNotificationPermission = () => {

  // 브라우저가 알림 기능을 지원하는지 확인
  if ('Notification' in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('알림 권한 획득 완료! 😎');
      }
    });
  }
};

// 2. 띠링~ 하고 실제 알림을 쏴주는 함수
export const sendNotification = (title, body) => {

  // 권한이 '허용(granted)' 상태일 때만 알림을 보냄
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body: body,
      icon: '/favicon.png', // 알림 옆에 뜰 앱 아이콘
    });
  }
};