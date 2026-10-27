const mongoose = require("mongoose");
const tierDailyCounterSchema = new mongoose.Schema({ userId: { type: String, required: true }, dayKey: { type: String, required: true }, count: { type: Number, min: 0, max: 3, default: 0 } }, { timestamps: true });
tierDailyCounterSchema.index({ userId: 1, dayKey: 1 }, { unique: true, name: "unique_user_tier_day" });
module.exports = mongoose.model("TierDailyCounter", tierDailyCounterSchema);
