export const TODO_CATEGORIES = [
  { value: "업무", optionLabel: "catWork", filterLabel: "catWorkTxt" },
  { value: "공부", optionLabel: "catStudy", filterLabel: "catStudyTxt" },
  { value: "개인", optionLabel: "catPersonal", filterLabel: "catPersonalTxt" },
  { value: "기타", optionLabel: "catOther", filterLabel: "catOtherTxt" },
];

export const TODO_FILTERS = [
  { value: "전체", label: "catAll" },
  ...TODO_CATEGORIES.map(({ value, filterLabel }) => ({ value, label: filterLabel })),
];



