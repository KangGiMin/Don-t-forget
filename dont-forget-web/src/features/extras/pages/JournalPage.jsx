import { useEffect, useState } from "react";
import { useLanguage } from "@/shared/i18n/LanguageContext";
import { getFeatureText } from "@/shared/i18n/featureTranslations";
import { getTodayString } from "@/shared/utils/date";
import { deleteJournal, getJournals, saveJournal } from "../api/extraApi";
import "./FeaturePages.css";
export default function JournalPage() {
  const { lang } = useLanguage(); const t = getFeatureText(lang);
  const [date, setDate] = useState(getTodayString()); const [title, setTitle] = useState(""); const [content, setContent] = useState(""); const [message, setMessage] = useState(""); const [saved, setSaved] = useState(false);
  useEffect(() => { let active = true; getJournals(date).then((result) => { if (!active) return; const journal = result.journals?.[0]; setTitle(journal?.title || ""); setContent(journal?.content || ""); setSaved(Boolean(journal)); setMessage(""); }); return () => { active = false; }; }, [date]);
  const submit = async (event) => { event.preventDefault(); const result = await saveJournal({ date, title, content }); if (result.success) { setSaved(true); setMessage(t.journalSaved); } else setMessage(result.message || t.saveFailed); };
  const remove = async () => { const result = await deleteJournal(date); if (result.success) { setTitle(""); setContent(""); setSaved(false); setMessage(""); } };
  return <main className="feature-page"><header className="feature-page-header"><a href="/todo">‹</a><div><p>REFLECT & REMEMBER</p><h1>{t.journalTitle}</h1></div></header>
    <form className="feature-card feature-form" onSubmit={submit}><label>{t.routineStart}<input type="date" value={date} onChange={(event) => setDate(event.target.value)} /></label><label>{t.journalTitlePlaceholder}<input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={120} /></label><label>{t.journalBody}<textarea value={content} onChange={(event) => setContent(event.target.value)} maxLength={20000} rows={12} required /></label>{message ? <p role="status" className="feature-message">{message}</p> : null}<div className="feature-actions"><button className="feature-primary" type="submit">{t.journalSave}</button>{saved ? <button type="button" onClick={remove}>{t.commonDelete}</button> : null}</div></form>
  </main>;
}
