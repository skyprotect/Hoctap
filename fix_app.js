const fs = require('fs');
let content = fs.readFileSync('js/app.js', 'utf8');

// 1. Fix mergeStudentState
const oldMerge = `    mergeStudentState: function(localState, cloudState) {
        if (!localState) return cloudState || {};
        if (!cloudState) return localState || {};

        const merged = { ...cloudState, ...localState };

        const localTime = new Date(localState.lastUpdated || 0).getTime();
        const cloudTime = new Date(cloudState.lastUpdated || 0).getTime();

        // 1. Số dư XP (Shared Currency Balance): Ưu tiên mốc thời gian mới nhất (lastUpdated) để giữ đúng số XP bị trừ khi mua đồ/đổi thẻ/nhắn tin AI
        if (localTime > cloudTime) {
            merged._sharedXp = (localState._sharedXp !== undefined) ? localState._sharedXp : (localState.xp || 0);`;

const newMerge = `    mergeStudentState: function(localState, cloudState) {
        if (!localState) return cloudState || {};
        if (!cloudState) return localState || {};

        const localTime = new Date(localState.lastUpdated || 0).getTime();
        const cloudTime = new Date(cloudState.lastUpdated || 0).getTime();

        // Lấy state mới hơn làm gốc để tránh việc dữ liệu cũ ghi đè dữ liệu mới
        const merged = localTime > cloudTime ? { ...cloudState, ...localState } : { ...localState, ...cloudState };

        // 1. Số dư XP (Shared Currency Balance): Ưu tiên mốc thời gian mới nhất (lastUpdated) để giữ đúng số XP bị trừ khi mua đồ/đổi thẻ/nhắn tin AI
        if (localTime > cloudTime) {
            merged._sharedXp = (localState._sharedXp !== undefined) ? localState._sharedXp : (localState.xp || 0);`;

content = content.replace(oldMerge, newMerge);

// 2. Fix 350 to 2000 in Math
const oldBadge = `    upgradeGoldBadge: function(badgeId) {
        const currentXp = this.state.xp || 0;
        const cost = 350;
        if (currentXp < cost) {`;
const newBadge = `    upgradeGoldBadge: function(badgeId) {
        const currentXp = this.state.xp || 0;
        const cost = 2000;
        if (currentXp < cost) {`;
content = content.replace(oldBadge, newBadge);

// 3. Fix 350 to 2000 in English
const oldSkill = `    upgradeGoldSkill: function(skillId) {
        const currentXp = this.state.englishXp || 0;
        const cost = 350;
        if (currentXp < cost) {`;
const newSkill = `    upgradeGoldSkill: function(skillId) {
        const currentXp = this.state.englishXp || 0;
        const cost = 2000;
        if (currentXp < cost) {`;
content = content.replace(oldSkill, newSkill);

content = content.split('Mạ vàng (350 XP)').join('Mạ vàng (2000 XP)');

fs.writeFileSync('js/app.js', content, 'utf8');
console.log('Done!');
