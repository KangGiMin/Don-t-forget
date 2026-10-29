const Todo = require("../todos/Todo");
const Routine = require("./Routine");
const { validateRule } = require("./validators/validateRoutine");
const { validTimeZone, isValidDateKey, nextRoutineOccurrence } = require("../../shared/dateTime");

exports.createRoutine = async (req, res) => {
  try {
    const data = validateRule(req.body);
    const candidate = { ...data };
    const next = nextRoutineOccurrence(candidate, new Date(Date.now() - 1000));
    if (!next) return res.status(400).json({ success: false, message: "반복 조건에 맞는 다음 날짜가 없습니다." });
    const routine = await Routine.create({ userId: req.auth.uid, ...data, nextRunAt: next.runAt });
    return res.status(201).json({ success: true, routine });
  } catch (error) { return res.status(400).json({ success: false, message: error.message || "루틴을 저장하지 못했습니다." }); }
};
exports.getRoutines = async (req, res) => {
  try { const routines = await Routine.find({ userId: req.auth.uid }).sort({ active: -1, nextRunAt: 1 }); return res.json({ success: true, routines }); }
  catch (_) { return res.status(500).json({ success: false, message: "루틴을 불러오지 못했습니다." }); }
};
exports.updateRoutine = async (req, res) => {
  try {
    const routine = await Routine.findOne({ _id: req.params.id, userId: req.auth.uid });
    if (!routine) return res.status(404).json({ success: false, message: "루틴을 찾을 수 없습니다." });
    if (req.body.active === false) { routine.active = false; await routine.save(); return res.json({ success: true, routine }); }
    const data = validateRule({ ...routine.toObject(), ...req.body });
    const next = nextRoutineOccurrence(data, new Date(Date.now() - 1000));
    if (!next) return res.status(400).json({ success: false, message: "다음 실행 날짜가 없습니다." });
    Object.assign(routine, data, { active: true, nextRunAt: next.runAt });
    await routine.save();
    return res.json({ success: true, routine });
  } catch (error) { return res.status(400).json({ success: false, message: error.message || "루틴을 수정하지 못했습니다." }); }
};
exports.deleteRoutine = async (req, res) => {
  try {
    const routine = await Routine.findOneAndDelete({ _id: req.params.id, userId: req.auth.uid });
    if (!routine) return res.status(404).json({ success: false, message: "루틴을 찾을 수 없습니다." });
    return res.json({ success: true });
  } catch (_) { return res.status(400).json({ success: false, message: "루틴을 삭제하지 못했습니다." }); }
};
