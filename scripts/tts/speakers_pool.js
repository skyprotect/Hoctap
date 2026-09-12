/**
 * speakers_pool.js — Định nghĩa Speaker Identity Pool thống nhất cho Passive Listening (v15.12).
 * Sử dụng đúng các giọng đọc Kokoro ONNX đã được kiểm định thực tế trong models/kokoro/voices.bin:
 * ['af', 'af_bella', 'af_nicole', 'af_sarah', 'af_sky', 'am_adam', 'am_michael', 'bf_emma', 'bf_isabella', 'bm_george', 'bm_lewis']
 */

const SPEAKERS = {
  // Trẻ em (Children)
  'female_child_01': {
    id: 'female_child_01',
    name: 'Lily',
    role: 'child',
    gender: 'female',
    voice: 'af_bella',
    speed: 0.82,
    style: 'cheerful, sweet and clear'
  },
  'male_child_01': {
    id: 'male_child_01',
    name: 'Tom',
    role: 'child',
    gender: 'male',
    voice: 'am_michael',
    speed: 0.82,
    style: 'curious, lively and energetic'
  },
  'child_female_02': {
    id: 'child_female_02',
    name: 'Mia',
    role: 'child',
    gender: 'female',
    voice: 'af_sky',
    speed: 0.83,
    style: 'gentle, bright and friendly'
  },
  'child_male_02': {
    id: 'child_male_02',
    name: 'Leo',
    role: 'child',
    gender: 'male',
    voice: 'am_michael',
    speed: 0.83,
    style: 'enthusiastic and playful'
  },
  'child_female_03': {
    id: 'child_female_03',
    name: 'Anna',
    role: 'child',
    gender: 'female',
    voice: 'af',
    speed: 0.84,
    style: 'smart, neat and expressive'
  },

  // Giáo viên (Teachers)
  'female_teacher_01': {
    id: 'female_teacher_01',
    name: 'Ms. Sarah',
    role: 'teacher',
    gender: 'female',
    voice: 'af_sarah',
    speed: 0.88,
    style: 'encouraging, warm and articulate'
  },
  'male_teacher_01': {
    id: 'male_teacher_01',
    name: 'Mr. David',
    role: 'teacher',
    gender: 'male',
    voice: 'am_adam',
    speed: 0.88,
    style: 'patient, clear and friendly'
  },

  // Phụ huynh (Parents)
  'female_mother_01': {
    id: 'female_mother_01',
    name: 'Mother',
    role: 'parent',
    gender: 'female',
    voice: 'af_nicole',
    speed: 0.86,
    style: 'loving, gentle and caring'
  },
  'parent_male_01': {
    id: 'parent_male_01',
    name: 'Father',
    role: 'parent',
    gender: 'male',
    voice: 'bm_george',
    speed: 0.88,
    style: 'warm, supportive British father'
  },

  // Người dẫn chuyện / Kể chuyện (Narrators)
  'narrator_uk_01': {
    id: 'narrator_uk_01',
    name: 'Emma',
    role: 'narrator',
    gender: 'female',
    voice: 'bf_emma',
    speed: 0.88,
    style: 'expressive British storyteller'
  },
  'narrator_uk_02': {
    id: 'narrator_uk_02',
    name: 'Isabella',
    role: 'narrator',
    gender: 'female',
    voice: 'bf_isabella',
    speed: 0.88,
    style: 'gentle, melodic British narrator'
  },
  'narrator_uk_03': {
    id: 'narrator_uk_03',
    name: 'Lewis',
    role: 'narrator',
    gender: 'male',
    voice: 'bm_lewis',
    speed: 0.88,
    style: 'knowledgeable, calm British storyteller'
  },
  'narrator_uk_04': {
    id: 'narrator_uk_04',
    name: 'George',
    role: 'narrator',
    gender: 'male',
    voice: 'bm_george',
    speed: 0.88,
    style: 'warm, classic British gentleman'
  }
};

module.exports = {
  SPEAKERS,
  CHARACTERS: SPEAKERS,
  VALID_KOKORO_VOICES: [
    'af', 'af_bella', 'af_nicole', 'af_sarah', 'af_sky',
    'am_adam', 'am_michael',
    'bf_emma', 'bf_isabella',
    'bm_george', 'bm_lewis'
  ]
};
