export const TODO_CATEGORIES = [
  { value: "근무", emoji: "💼", optionLabel: "catWork", filterLabel: "catWorkTxt" },
  { value: "운동", emoji: "🏃", optionLabel: "catExercise", filterLabel: "catExerciseTxt" },
  { value: "예약", emoji: "📅", optionLabel: "catReservation", filterLabel: "catReservationTxt" },
  { value: "공부", emoji: "📚", optionLabel: "catStudy", filterLabel: "catStudyTxt" },
  { value: "약속", emoji: "🧑‍🤝‍🧑", optionLabel: "catAppointment", filterLabel: "catAppointmentTxt" },
  { value: "기타", emoji: "✨", optionLabel: "catOther", filterLabel: "catOtherTxt" },
];

export const TODO_FILTERS = [
  { value: "전체", label: "catAll", emoji: "" },
  ...TODO_CATEGORIES.map(({ value, emoji, filterLabel }) => ({ value, label: filterLabel, emoji })),
];
