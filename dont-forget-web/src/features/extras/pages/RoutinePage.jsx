import { useEffect, useState } from "react";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import { getFeatureText } from "@/shared/i18n/featureTranslations";
import { getTodayString } from "@/shared/utils/date";
import { createRoutine, deleteRoutine, getRoutines, updateRoutine } from "../api/extraApi";
import "./FeaturePages.css";

const WEEK_DAYS = [0, 1, 2, 3, 4, 5, 6];
export default function RoutinePage() {
  const { lang } = useLanguage(); const t = getFeatureText(lang);
  const [routines, setRoutines] = useState([]); const [text, setText] = useState(""); const [category, setCategory] = useState("근무");
  const [frequency, setFrequency] = useState("daily"); const [weekdays, setWeekdays] = useState([1, 2, 3, 4, 5]);
  const [startDate, setStartDate] = useState(getTodayString()); const [endDate, setEndDate] = useState(""); const [dueTime, setDueTime] = useState("23:59"); const [message, setMessage] = useState("");
  const refresh = async () => { const result = await getRoutines(); if (result.success) setRoutines(result.routines); };
  useEffect(() => { refresh(); }, []);
  const submit = async (event) => { event.preventDefault(); const result = await createRoutine({ text, category, frequency, weekdays, startDate, endDate: endDate || null, dueTime, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Seoul", reminderOffsets: [] }); if (!result.success) return setMessage(result.message || t.saveFailed); setText(""); setMessage(""); refresh(); };
  const toggleDay = (day) => setWeekdays((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day]);
  return <main className="feature-page"><header className="feature-page-header"><a href="/todo">‹</a><div><p>REPEAT & PLAN</p><h1>{t.routinesTitle}</h1></div></header>
    <form className="feature-card feature-form" onSubmit={submit}><label>{t.routineName}<input value={text} onChange={(event) => setText(event.target.value)} maxLength={200} required /></label>
      <label>{t.category}<select value={category} onChange={(event) => setCategory(event.target.value)}>{[["근무","💼"],["운동","🏃"],["예약","📅"],["공부","📚"],["약속","🤝"],["기타","✨"]].map(([value,emoji]) => <option key={value} value={value}>{emoji} {value}</option>)}</select></label>
      <div className="feature-inline"><label>{t.time}<input type="time" value={dueTime} onChange={(event) => setDueTime(event.target.value)} required /></label><div className="feature-toggle"><button type="button" className={frequency === "daily" ? "selected" : ""} onClick={() => setFrequency("daily")}>{t.routineDaily}</button><button type="button" className={frequency === "weekly" ? "selected" : ""} onClick={() => setFrequency("weekly")}>{t.routineWeekly}</button></div></div>
      {frequency === "weekly" ? <fieldset className="weekday-picker"><legend>{t.routineWeekdays}</legend>{WEEK_DAYS.map((day) => <button key={day} type="button" className={weekdays.includes(day) ? "selected" : ""} onClick={() => toggleDay(day)}>{t.weekdays[day]}</button>)}</fieldset> : null}
      <div className="feature-inline"><label>{t.routineStart}<input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} required /></label><label>{t.routineEnd}<input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></label></div>
      {message ? <p role="alert" className="feature-message">{message}</p> : null}<button className="feature-primary" type="submit">＋ {t.routineCreate}</button></form>
    <section className="feature-list">{routines.length ? routines.map((routine) => <article className="feature-card feature-row" key={routine._id}><div><strong>{routine.text}</strong><p>{routine.frequency === "daily" ? t.routineDaily : `${t.routineWeekly} · ${routine.weekdays.map((day) => t.weekdays[day]).join(", ")}`} · {routine.dueTime}</p></div><div className="feature-actions"><button type="button" onClick={async () => { await updateRoutine(routine._id, { active: !routine.active }); refresh(); }}>{routine.active ? t.routinePause : t.routineActive}</button><button type="button" onClick={async () => { await deleteRoutine(routine._id); refresh(); }}>{t.commonDelete}</button></div></article>) : <p className="feature-empty">{t.routineNone}</p>}</section>
  </main>;
}
