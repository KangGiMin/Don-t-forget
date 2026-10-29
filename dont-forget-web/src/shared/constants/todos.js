export const TODO_CATEGORIES = [
  { value: "근무", emoji: "💼", optionLabel: "catWork", filterLabel: "catWorkTxt" },
  { value: "운동", emoji: "🏃", optionLabel: "catExercise", filterLabel: "catExerciseTxt" },
  { value: "예약", emoji: "📅", optionLabel: "catReservation", filterLabel: "catReservationTxt" },
  { value: "공부", emoji: "📚", optionLabel: "catStudy", filterLabel: "catStudyTxt" },
  { value: "약속", emoji: "🧑‍🤝‍🧑", optionLabel: "catAppointment", filterLabel: "catAppointmentTxt" },
  { value: "학교생활", emoji: "🏫", optionLabel: "catSchoolLife", filterLabel: "catSchoolLife" },
  { value: "개발/프로젝트", emoji: "🧑‍💻", optionLabel: "catDevelopmentProjects", filterLabel: "catDevelopmentProjects" },
  { value: "집안일", emoji: "🏠", optionLabel: "catHousehold", filterLabel: "catHousehold" },
  { value: "쇼핑", emoji: "🛒", optionLabel: "catShopping", filterLabel: "catShopping" },
  { value: "숙제/과제", emoji: "📖", optionLabel: "catHomework", filterLabel: "catHomework" },
  { value: "친목/모임", emoji: "👥", optionLabel: "catSocial", filterLabel: "catSocial" },
  { value: "기타", emoji: "✨", optionLabel: "catOther", filterLabel: "catOtherTxt" },
];

export const TODO_FILTERS = [
  { value: "전체", label: "catAll", emoji: "" },
  ...TODO_CATEGORIES.map(({ value, emoji, filterLabel }) => ({ value, label: filterLabel, emoji })),
];
