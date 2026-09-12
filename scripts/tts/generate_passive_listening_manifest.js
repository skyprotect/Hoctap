const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '../..');
const MANIFEST_PATH = path.join(ROOT_DIR, 'sounds', 'english', 'passive-listening-manifest.json');
const PASSIVE_AUDIO_DIR = path.join(ROOT_DIR, 'sounds', 'english', 'passive');
const PASSIVE_IMG_DIR = path.join(ROOT_DIR, 'images', 'english', 'passive');

fs.mkdirSync(PASSIVE_AUDIO_DIR, { recursive: true });
fs.mkdirSync(PASSIVE_IMG_DIR, { recursive: true });

// Hệ thống Speaker Identity chuẩn xác dựa trên Kokoro Voices đã kiểm định
const SPEAKERS = {
  'female_child_01': { id: 'female_child_01', name: 'Lily', role: 'child', gender: 'female', voice: 'af_bella', speed: 0.88, style: 'cheerful and clear' },
  'male_child_01': { id: 'male_child_01', name: 'Tom', role: 'child', gender: 'male', voice: 'am_michael', speed: 0.88, style: 'curious and lively' },
  'female_teacher_01': { id: 'female_teacher_01', name: 'Ms. Sarah', role: 'teacher', gender: 'female', voice: 'af_sarah', speed: 0.90, style: 'encouraging and clear' },
  'male_teacher_01': { id: 'male_teacher_01', name: 'Mr. David', role: 'teacher', gender: 'male', voice: 'am_adam', speed: 0.90, style: 'warm and articulate' },
  'female_mother_01': { id: 'female_mother_01', name: 'Mother', role: 'parent', gender: 'female', voice: 'af_nicole', speed: 0.92, style: 'gentle and caring' },
  'narrator_uk_01': { id: 'narrator_uk_01', name: 'Emma', role: 'narrator', gender: 'female', voice: 'bf_emma', speed: 0.95, style: 'expressive British storyteller' },
  'narrator_uk_02': { id: 'narrator_uk_02', name: 'George', role: 'narrator', gender: 'male', voice: 'bm_george', speed: 0.95, style: 'warm British gentleman' }
};

// 18 bài nghe chuẩn hóa bao quát 16 chủ đề CEFR Young Learners
const LESSONS = [
  // ==================== PRE-A1 (STARTERS-ALIGNED: 35s - 75s) ====================
  {
    id: 'PL_PREA1_ANIMALS_001',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'animals',
    title: 'Look at the Cute Cat',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['male_teacher_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Look, Mr. David! It is a cat.' },
      { speakerId: 'male_teacher_01', text: 'Yes, Lily! It is a little brown cat. Is it sleeping?' },
      { speakerId: 'female_child_01', text: 'No, it is playing with a red ball.' },
      { speakerId: 'male_teacher_01', text: 'How cute! Do you like cats, Lily?' },
      { speakerId: 'female_child_01', text: 'Yes, I love cats very much!' }
    ],
    languageFunctions: ['identifying animals', 'describing actions', 'expressing simple likes'],
    learningObjectives: ['recognize cat and ball', 'understand simple yes/no questions'],
    vocabularyIds: ['VOC_L1_U01_BALL'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_CLASSROOM_002',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'classroom English',
    title: 'In the Classroom',
    contentType: 'classroom conversation',
    speakers: [SPEAKERS['female_teacher_01'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'female_teacher_01', text: 'Good morning, class! Open your books, please.' },
      { speakerId: 'male_child_01', text: 'Good morning, Ms. Sarah! Which page, please?' },
      { speakerId: 'female_teacher_01', text: 'Page ten, Tom. Look at the picture.' },
      { speakerId: 'male_child_01', text: 'I see a school and three trees.' },
      { speakerId: 'female_teacher_01', text: 'Very good! Now listen carefully.' }
    ],
    languageFunctions: ['greeting teacher', 'following classroom instructions', 'asking for clarification'],
    learningObjectives: ['understand classroom commands', 'identify page numbers'],
    vocabularyIds: ['VOC_L1_U01_BOOK'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_FAMILY_003',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'family',
    title: 'My Happy Family',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Mom, where is baby brother?' },
      { speakerId: 'female_mother_01', text: 'He is in the living room with dad, sweetheart.' },
      { speakerId: 'female_child_01', text: 'Is he playing with his toy train?' },
      { speakerId: 'female_mother_01', text: 'Yes, he is! Come and drink your milk, Lily.' },
      { speakerId: 'female_child_01', text: 'Thank you, Mom!' }
    ],
    languageFunctions: ['asking about family members', 'giving polite thanks'],
    learningObjectives: ['recognize family members', 'understand room locations'],
    vocabularyIds: ['VOC_L1_U05_MOTHER'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_FOOD_004',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'food',
    title: 'Apples and Bananas',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Lily, what fruit do you want for snack?' },
      { speakerId: 'female_child_01', text: 'I want a red apple, Tom! What about you?' },
      { speakerId: 'male_child_01', text: 'I like yellow bananas. They are sweet and healthy.' },
      { speakerId: 'female_child_01', text: 'Let us wash our hands before eating!' },
      { speakerId: 'male_child_01', text: 'Great idea! Wash, wash, wash!' }
    ],
    languageFunctions: ['asking about food preferences', 'suggesting hygiene routine'],
    learningObjectives: ['identify fruits', 'understand snack time vocabulary'],
    vocabularyIds: ['VOC_L1_U04_APPLE'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_WEATHER_005',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'weather',
    title: 'A Sunny Morning',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'The sun is shining in the blue sky. It is a bright, sunny morning. Birds are singing in the garden. Little Billy wears a yellow hat and smiles. Billy rides his red bike in the playground. It is a wonderful day to play outside!' }
    ],
    languageFunctions: ['describing simple weather', 'narrating outdoor activity'],
    learningObjectives: ['understand weather adjectives sunny and bright'],
    vocabularyIds: ['VOC_L1_U01_BIKE'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_HOME_006',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'home',
    title: 'Where is My Pencil?',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['male_teacher_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Excuse me, Mr. David. Where is my pencil?' },
      { speakerId: 'male_teacher_01', text: 'Is it inside your schoolbag, Lily?' },
      { speakerId: 'female_child_01', text: 'Let me look. Ah, yes! It is under my ruler!' },
      { speakerId: 'male_teacher_01', text: 'Well done! Always keep your desk tidy.' },
      { speakerId: 'female_child_01', text: 'Yes, sir. Thank you!' }
    ],
    languageFunctions: ['asking location of objects', 'using prepositions inside and under'],
    learningObjectives: ['prepositions of place', 'school stationery items'],
    vocabularyIds: ['VOC_L1_U02_PENCIL'],
    repetition: 2
  },

  // ==================== A1 (MOVERS-ALIGNED: 60s - 130s) ====================
  {
    id: 'PL_A1_SCHOOL_001',
    level: 'A1',
    ageBand: '8-10',
    topic: 'school',
    title: 'First Day at School',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Hello! My name is Tom. Are you in class four A?' },
      { speakerId: 'female_child_01', text: 'Hi Tom, I am Lily. Yes, I am! This is my first day here.' },
      { speakerId: 'male_child_01', text: 'Welcome to our school! Our classroom is on the second floor. It has big windows and colourful posters.' },
      { speakerId: 'female_child_01', text: 'That sounds wonderful! Where is the school library?' },
      { speakerId: 'male_child_01', text: 'It is next to the computer room. We can go there together after lunch.' },
      { speakerId: 'female_child_01', text: 'Thank you, Tom. You are very friendly!' }
    ],
    languageFunctions: ['introducing oneself', 'describing school facilities', 'giving directions in school'],
    learningObjectives: ['understand school locations next to and on the second floor'],
    vocabularyIds: ['VOC_L6_U01_CLASSMATE'],
    repetition: 2
  },
  {
    id: 'PL_A1_DAILY_ROUTINES_002',
    level: 'A1',
    ageBand: '8-10',
    topic: 'daily routines',
    title: 'Tom’s Busy Morning',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_mother_01'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'female_mother_01', text: 'Wake up, Tom! It is seven o’clock. Time for school.' },
      { speakerId: 'male_child_01', text: 'Good morning, Mom. I am getting up now.' },
      { speakerId: 'female_mother_01', text: 'Remember to brush your teeth and put on your uniform.' },
      { speakerId: 'male_child_01', text: 'I already brushed my teeth! What do we have for breakfast?' },
      { speakerId: 'female_mother_01', text: 'Warm milk, toast, and eggs. Come to the kitchen when you are ready.' },
      { speakerId: 'male_child_01', text: 'Yummy! I will be ready in two minutes.' }
    ],
    languageFunctions: ['telling the time', 'talking about morning habits', 'discussing breakfast'],
    learningObjectives: ['understand routine verbs wake up, brush teeth, put on uniform'],
    vocabularyIds: ['VOC_L6_U01_UNIFORM'],
    repetition: 2
  },
  {
    id: 'PL_A1_HOBBIES_003',
    level: 'A1',
    ageBand: '8-10',
    topic: 'hobbies',
    title: 'What Is Your Favourite Hobby?',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Tom, what do you usually do at the weekend?' },
      { speakerId: 'male_child_01', text: 'I love playing badminton with my brother in the park. How about you?' },
      { speakerId: 'female_child_01', text: 'I enjoy drawing pictures and reading storybooks. Sometimes I help my mom in the garden.' },
      { speakerId: 'male_child_01', text: 'Gardening is great! Can you show me your drawings tomorrow?' },
      { speakerId: 'female_child_01', text: 'Sure! I drew a picture of a rainbow and a little puppy.' }
    ],
    languageFunctions: ['talking about free-time activities', 'expressing interest in hobbies'],
    learningObjectives: ['vocabulary for hobbies: badminton, drawing, reading, gardening'],
    vocabularyIds: ['VOC_L6_U08_BADMINTON'],
    repetition: 2
  },
  {
    id: 'PL_A1_TRANSPORT_004',
    level: 'A1',
    ageBand: '8-10',
    topic: 'transport',
    title: 'How Do You Go to School?',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_teacher_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'female_teacher_01', text: 'Lily, how do you travel to school every morning?' },
      { speakerId: 'female_child_01', text: 'I usually take the yellow school bus with my friends.' },
      { speakerId: 'female_teacher_01', text: 'Does it take a long time?' },
      { speakerId: 'female_child_01', text: 'About fifteen minutes. When the weather is sunny, my dad rides a bicycle with me.' },
      { speakerId: 'female_teacher_01', text: 'Riding a bicycle is good exercise and eco-friendly!' },
      { speakerId: 'female_child_01', text: 'Yes, and we always wear safety helmets.' }
    ],
    languageFunctions: ['asking and answering about transportation', 'talking about safety rules'],
    learningObjectives: ['means of transport: bus, bicycle', 'safety phrase wear helmets'],
    vocabularyIds: ['VOC_L4_U07_BUS'],
    repetition: 2
  },
  {
    id: 'PL_A1_SHOPPING_005',
    level: 'A1',
    ageBand: '8-10',
    topic: 'shopping',
    title: 'At the Bookshop',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_teacher_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'male_teacher_01', text: 'Hello Lily! Can I help you find something in the bookshop?' },
      { speakerId: 'female_child_01', text: 'Yes, please, Mr. David. I am looking for a compass and an English dictionary.' },
      { speakerId: 'male_teacher_01', text: 'The stationery corner is on your right. The drawing compasses are next to the rulers.' },
      { speakerId: 'female_child_01', text: 'How much is this blue compass?' },
      { speakerId: 'male_teacher_01', text: 'It is two dollars. It is very sturdy and safe for geometry class.' },
      { speakerId: 'female_child_01', text: 'I will take it, please! Thank you for your help.' }
    ],
    languageFunctions: ['asking for items in a shop', 'asking for prices', 'polite shopping transactions'],
    learningObjectives: ['phrases how much is..., can I help you'],
    vocabularyIds: ['VOC_L6_U01_COMPASS'],
    repetition: 2
  },
  {
    id: 'PL_A1_SOCIAL_006',
    level: 'A1',
    ageBand: '8-10',
    topic: 'social situations',
    title: 'Inviting a Friend to Play',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Hey Lily! Are you free this Saturday afternoon?' },
      { speakerId: 'female_child_01', text: 'Yes, I am! Why do you ask, Tom?' },
      { speakerId: 'male_child_01', text: 'We are organizing a mini football match at the school playground. Would you like to join us?' },
      { speakerId: 'female_child_01', text: 'I would love to! Can my cousin come along too?' },
      { speakerId: 'male_child_01', text: 'Of course! The more, the merrier. We will meet at three o’clock.' },
      { speakerId: 'female_child_01', text: 'Awesome! See you on Saturday!' }
    ],
    languageFunctions: ['making invitations', 'accepting invitations', 'setting meeting times'],
    learningObjectives: ['would you like to join', 'see you on Saturday'],
    vocabularyIds: ['VOC_L6_U08_CHAMPION'],
    repetition: 2
  },

  // ==================== A2 (FLYERS-ALIGNED: 90s - 180s) ====================
  {
    id: 'PL_A2_MINI_STORY_001',
    level: 'A2',
    ageBand: '10-12',
    topic: 'mini stories',
    title: 'The Lost Puppy in the Park',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'One sunny afternoon, Ben and his sister Emma were walking through Green Park. Near the big oak tree, they heard a soft whimpering sound. Behind a green bush, they discovered a tiny brown puppy with a red collar. The puppy was shivering and seemed lost. Emma checked the shiny silver tag on its collar and found a telephone number. Ben used his mother’s phone to dial the number immediately. Within ten minutes, a worried elderly lady named Mrs. Clark arrived. She was overjoyed to see her beloved puppy, Toby, safe and sound. To thank the children, she offered them delicious homemade cookies and praised their kindness.' }
    ],
    languageFunctions: ['narrating past events', 'describing problem and resolution in a story'],
    learningObjectives: ['past continuous and past simple', 'vocabulary for feelings and resolution'],
    vocabularyIds: ['VOC_L4_U13_PARK'],
    repetition: 2
  },
  {
    id: 'PL_A2_FOOD_002',
    level: 'A2',
    ageBand: '10-12',
    topic: 'food',
    title: 'Cooking Pho Soup with Grandpa',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['male_teacher_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Mr. David, my grandfather taught me how to cook traditional beef pho soup last Sunday!' },
      { speakerId: 'male_teacher_01', text: 'That sounds fascinating, Tom! What ingredients did you need for the broth?' },
      { speakerId: 'male_child_01', text: 'We simmered beef bones for over four hours with ginger, cinnamon, star anise, and roasted onions.' },
      { speakerId: 'male_teacher_01', text: 'No wonder it smells so aromatic! Did you prepare the fresh rice noodles as well?' },
      { speakerId: 'male_child_01', text: 'Yes, we warmed the noodles, added tender beef slices, and garnished with spring onions and fresh herbs.' },
      { speakerId: 'male_teacher_01', text: 'Cooking traditional meals is a wonderful way to preserve our cultural heritage, Tom.' }
    ],
    languageFunctions: ['explaining cooking recipes', 'describing sequential steps', 'appreciating culinary culture'],
    learningObjectives: ['cooking verbs: simmer, roast, garnish', 'ingredients: broth, ginger, noodles'],
    vocabularyIds: ['VOC_L6_U05_SOUP', 'VOC_L6_U05_NOODLE'],
    repetition: 2
  },
  {
    id: 'PL_A2_ENVIRONMENT_003',
    level: 'A2',
    ageBand: '10-12',
    topic: 'school',
    title: 'Our Green School Project',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_teacher_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'female_teacher_01', text: 'Good morning, Lily. How is our school recycling campaign progressing this week?' },
      { speakerId: 'female_child_01', text: 'Good morning, Ms. Sarah. We have already collected over five hundred plastic bottles and forty kilograms of used paper.' },
      { speakerId: 'female_teacher_01', text: 'That is remarkable! What are the students planning to do with all those recyclable materials?' },
      { speakerId: 'female_child_01', text: 'The art club will transform the plastic bottles into self-watering flowerpots for our rooftop garden. And we will send the paper to the local recycling plant.' },
      { speakerId: 'female_teacher_01', text: 'Small eco-friendly actions can truly make a huge difference in protecting our environment. Keep up the brilliant work!' },
      { speakerId: 'female_child_01', text: 'Thank you, Ms. Sarah. We want our school to be as clean and green as possible.' }
    ],
    languageFunctions: ['reporting project progress', 'discussing environmental solutions', 'encouraging teamwork'],
    learningObjectives: ['vocabulary for recycling: plastic bottles, recyclable materials, self-watering, eco-friendly'],
    vocabularyIds: ['VOC_L6_U11_RECYCLE', 'VOC_L6_U11_ENVIRONMENT'],
    repetition: 2
  },
  {
    id: 'PL_A2_TRAVEL_004',
    level: 'A2',
    ageBand: '10-12',
    topic: 'transport',
    title: 'A Journey by High-Speed Train',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Lily, have you ever travelled on an express high-speed train?' },
      { speakerId: 'female_child_01', text: 'Yes, I traveled from Da Nang to Nha Trang with my family last summer holiday.' },
      { speakerId: 'male_child_01', text: 'Was the journey comfortable? How fast did it travel?' },
      { speakerId: 'female_child_01', text: 'It was super smooth and quiet! The scenery outside the large glass windows looked breathtaking, with lush mountains on one side and the blue ocean on the other.' },
      { speakerId: 'male_child_01', text: 'I hope modern trains will connect all our major cities in the future. It is so much faster than buses.' },
      { speakerId: 'female_child_01', text: 'I agree, and trains generate significantly less carbon pollution than airplanes.' }
    ],
    languageFunctions: ['sharing past travel experiences', 'comparing modes of transport', 'expressing opinions on future technology'],
    learningObjectives: ['present perfect and past simple travel expressions', 'describing scenic landscapes'],
    vocabularyIds: ['VOC_L6_U12_PASSENGER'],
    repetition: 2
  },
  {
    id: 'PL_A2_HISTORIC_005',
    level: 'A2',
    ageBand: '10-12',
    topic: 'social situations',
    title: 'Visiting the Temple of Literature',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['narrator_uk_02'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'narrator_uk_02', text: 'Welcome to Hanoi, young man. Are you visiting the historic Temple of Literature today?' },
      { speakerId: 'male_child_01', text: 'Yes, sir! Our history teacher assigned us a research task about Vietnam’s first national university.' },
      { speakerId: 'narrator_uk_02', text: 'You will find eighty-two stone turtle stelae erected here, honouring brilliant scholars from centuries ago.' },
      { speakerId: 'male_child_01', text: 'It is so serene here despite being located in the middle of a bustling modern city.' },
      { speakerId: 'narrator_uk_02', text: 'Indeed. It stands as an enduring monument to the value of education, perseverance, and respect for knowledge.' },
      { speakerId: 'male_child_01', text: 'I feel inspired to study harder after seeing how ancient scholars dedicated their lives to learning.' }
    ],
    languageFunctions: ['discussing historical landmarks', 'expressing respect for cultural heritage', 'reflective thinking'],
    learningObjectives: ['historical terms: landmark, scholar, monument, ancient, heritage'],
    vocabularyIds: ['VOC_L6_U06_SCHOLAR', 'VOC_L6_U06_MONUMENT'],
    repetition: 2
  },
  {
    id: 'PL_A2_WEATHER_006',
    level: 'A2',
    ageBand: '10-12',
    topic: 'weather',
    title: 'Four Seasons Around the World',
    contentType: 'story passage',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'Throughout the year, our planet experiences magnificent seasonal changes. In spring, nature awakens with vibrant blooming blossoms and fresh green shoots. Summer brings warmth and long daylight hours, ideal for outdoor adventures and beach trips. When autumn arrives, tree leaves turn into brilliant shades of gold, amber, and crimson before gently falling. Finally, winter covers high mountains in sparkling white snow. Each unique season offers distinct weather patterns, teaching us to appreciate the ever-changing harmony of the natural world.' }
    ],
    languageFunctions: ['describing cyclical nature of seasons', 'using descriptive sensory adjectives'],
    learningObjectives: ['four seasons vocabulary', 'nature harmony expressions'],
    vocabularyIds: ['VOC_L4_U18_SPRING', 'VOC_L4_U18_SUMMER', 'VOC_L4_U18_AUTUMN', 'VOC_L4_U18_WINTER'],
    repetition: 2
  }
];

const manifest = {};

LESSONS.forEach(l => {
  const audioFilename = `${l.id.toLowerCase()}.mp3`;
  const relativeAudioPath = `sounds/english/passive/${audioFilename}`;
  const heroImageFilename = `${l.id.toLowerCase()}_hero.svg`;
  const relativeImagePath = `images/english/passive/${heroImageFilename}`;

  // Ghép toàn văn bản transcript
  const transcriptText = l.dialogue.map(d => `${d.text}`).join(' ');

  manifest[l.id] = {
    id: l.id,
    level: l.level,
    ageBand: l.ageBand,
    topic: l.topic,
    title: l.title,
    contentType: l.contentType,
    durationSec: 0, // sẽ cập nhật sau khi sinh audio thực tế
    speakers: l.speakers,
    transcript: l.dialogue,
    transcriptText: transcriptText,
    languageFunctions: l.languageFunctions,
    learningObjectives: l.learningObjectives,
    vocabularyIds: l.vocabularyIds,
    audioFile: relativeAudioPath,
    visualAssets: {
      heroImage: relativeImagePath
    },
    repetition: l.repetition || 2
  };
});

fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');
console.log(`Đã khởi tạo passive listening manifest với ${Object.keys(manifest).length} bài nghe tại: ${MANIFEST_PATH}`);
