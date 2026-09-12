/**
 * data_a1.js — Thư viện 70 bài nghe chuẩn A1 dành cho lứa tuổi 8-10 (v15.12).
 * Đặc trưng: Hội thoại đời thường, mẩu chuyện nhỏ, tốc độ đọc 0.85 - 0.88, ngữ cảnh tự nhiên.
 */

const { SPEAKERS } = require('./speakers_pool');

const A1_LESSONS = [
  // 1. School Life & Classmates (1-10)
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
    id: 'PL_A1_SCHOOL_002',
    level: 'A1',
    ageBand: '8-10',
    topic: 'school',
    title: 'Science Experiment in the Lab',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_teacher_01'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'female_teacher_01', text: 'Today we will observe how green plant seeds grow, children.' },
      { speakerId: 'male_child_01', text: 'Ms. Sarah, do we need sunlight and water for the seeds?' },
      { speakerId: 'female_teacher_01', text: 'Yes, Tom! Place two small bean seeds on the moist cotton wool.' },
      { speakerId: 'male_child_01', text: 'Will they sprout tiny green roots tomorrow?' },
      { speakerId: 'female_teacher_01', text: 'In two or three days, we will see little sprouts emerging.' }
    ],
    languageFunctions: ['talking about science experiments', 'asking predictive questions'],
    learningObjectives: ['seed, sunlight, cotton wool, sprout'],
    vocabularyIds: ['VOC_L4_U10_SCIENCE'],
    repetition: 2
  },
  {
    id: 'PL_A1_SCHOOL_003',
    level: 'A1',
    ageBand: '8-10',
    topic: 'school',
    title: 'The Art Club Project',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['child_female_02']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Mia, which club did you join this term?' },
      { speakerId: 'child_female_02', text: 'I joined the Friday afternoon art club! We are painting pottery vases.' },
      { speakerId: 'female_child_01', text: 'That sounds exciting. What colours are you painting on your vase?' },
      { speakerId: 'child_female_02', text: 'Ocean blue with little golden fish swimming on the sides.' },
      { speakerId: 'female_child_01', text: 'Can I visit the art room to see it after school?' },
      { speakerId: 'child_female_02', text: 'Of course, I would love to show you!' }
    ],
    languageFunctions: ['talking about school clubs', 'describing creative hobbies'],
    learningObjectives: ['art club, pottery vase, painting, colours'],
    vocabularyIds: ['VOC_L4_U05_ART'],
    repetition: 2
  },
  {
    id: 'PL_A1_SCHOOL_004',
    level: 'A1',
    ageBand: '8-10',
    topic: 'school',
    title: 'Borrowing a Book from the Library',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_teacher_01'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'male_teacher_01', text: 'Good morning, Tom. Did you find an interesting book today?' },
      { speakerId: 'male_child_01', text: 'Yes, Mr. David! I found an illustrated atlas about solar system planets.' },
      { speakerId: 'male_teacher_01', text: 'Splendid choice. Please hand me your student library card.' },
      { speakerId: 'male_child_01', text: 'Here it is, sir. How long can I borrow this book?' },
      { speakerId: 'male_teacher_01', text: 'You can keep it for two weeks. Remember to keep the pages clean.' },
      { speakerId: 'male_child_01', text: 'I will take great care of it. Thank you, Mr. David!' }
    ],
    languageFunctions: ['library borrowing procedure', 'asking duration'],
    learningObjectives: ['atlas, solar system, borrow, library card'],
    vocabularyIds: ['VOC_L4_U02_LIBRARY'],
    repetition: 2
  },
  {
    id: 'PL_A1_SCHOOL_005',
    level: 'A1',
    ageBand: '8-10',
    topic: 'school',
    title: 'A Noisy Playground at Recess',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'At ten o’clock, the school bell chimes for morning recess. Hundreds of happy students rush out to the wide playground. Some boys kick a black and white football near the goalposts. Three girls skip rope while singing a cheerful rhyme. Laughter fills the warm sunshine until the bell rings again.' }
    ],
    languageFunctions: ['describing recess activities', 'playground games'],
    learningObjectives: ['recess, chime, skip rope, goalposts'],
    vocabularyIds: ['VOC_L4_U08_PLAYGROUND'],
    repetition: 2
  },
  {
    id: 'PL_A1_SCHOOL_006',
    level: 'A1',
    ageBand: '8-10',
    topic: 'school',
    title: 'Our School Garden',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Tom, look at the cherry tomatoes in our vegetable garden!' },
      { speakerId: 'male_child_01', text: 'They turned bright red! We planted the seeds three months ago.' },
      { speakerId: 'female_child_01', text: 'Ms. Sarah said we can pick them during science class this afternoon.' },
      { speakerId: 'male_child_01', text: 'Let us bring two baskets so we do not crush them.' },
      { speakerId: 'female_child_01', text: 'I cannot wait to taste our homegrown sweet tomatoes!' }
    ],
    languageFunctions: ['discussing gardening outcomes', 'planning harvesting'],
    learningObjectives: ['vegetable garden, cherry tomatoes, pick, baskets'],
    vocabularyIds: ['VOC_L4_U11_GARDEN'],
    repetition: 2
  },
  {
    id: 'PL_A1_SCHOOL_007',
    level: 'A1',
    ageBand: '8-10',
    topic: 'school',
    title: 'The School Music Band',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_male_02'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'child_male_02', text: 'Lily, are you practicing the recorder for the school concert?' },
      { speakerId: 'female_child_01', text: 'Yes, Leo! Our teacher taught us a lovely traditional folk song.' },
      { speakerId: 'child_male_02', text: 'I am playing the side drum in the rhythm section.' },
      { speakerId: 'female_child_01', text: 'Drumming must be exciting! Is it difficult to keep the steady beat?' },
      { speakerId: 'child_male_02', text: 'It takes practice, but when we play together in harmony, it sounds marvelous!' }
    ],
    languageFunctions: ['talking about musical instruments', 'preparing for concerts'],
    learningObjectives: ['recorder, drum, rhythm, concert, beat'],
    vocabularyIds: ['VOC_L4_U05_MUSIC'],
    repetition: 2
  },
  {
    id: 'PL_A1_SCHOOL_008',
    level: 'A1',
    ageBand: '8-10',
    topic: 'school',
    title: 'Choosing Classroom Duties',
    contentType: 'classroom conversation',
    speakers: [SPEAKERS['female_teacher_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'female_teacher_01', text: 'Who would like to be our classroom monitor this week, children?' },
      { speakerId: 'female_child_01', text: 'I would like to help, Ms. Sarah.' },
      { speakerId: 'female_teacher_01', text: 'Thank you, Lily. You will help hand out notebooks and check attendance.' },
      { speakerId: 'female_child_01', text: 'I will make sure everything is orderly and neat.' },
      { speakerId: 'female_teacher_01', text: 'I appreciate your responsibility and helpfulness.' }
    ],
    languageFunctions: ['volunteering for classroom duties', 'teacher appreciation'],
    learningObjectives: ['classroom monitor, attendance, notebooks, duty'],
    vocabularyIds: ['VOC_L4_U01_DUTY'],
    repetition: 2
  },
  {
    id: 'PL_A1_SCHOOL_009',
    level: 'A1',
    ageBand: '8-10',
    topic: 'school',
    title: 'A Rainy Lunch Break Indoors',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_02']],
    dialogue: [
      { speakerId: 'narrator_uk_02', text: 'Because heavy rain poured over the school courtyard, children stayed indoors during lunch break. Tom and Leo set up a wooden chessboard near the window. Mia and Lily enjoyed reading comic books on colourful floor cushions. The classroom felt cosy and peaceful.' }
    ],
    languageFunctions: ['indoor lunch activities', 'narrating weather adaptation'],
    learningObjectives: ['rain poured, chessboard, cushions, cosy'],
    vocabularyIds: ['VOC_L4_U08_CHESS'],
    repetition: 2
  },
  {
    id: 'PL_A1_SCHOOL_010',
    level: 'A1',
    ageBand: '8-10',
    topic: 'school',
    title: 'Visiting the Computer Room',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_teacher_01'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'male_teacher_01', text: 'Please take your seats at the numbered desks, everyone.' },
      { speakerId: 'male_child_01', text: 'Mr. David, what software program are we learning today?' },
      { speakerId: 'male_teacher_01', text: 'We will practice typing short English sentences and searching educational pictures.' },
      { speakerId: 'male_child_01', text: 'Can we save our typed stories into our student folder?' },
      { speakerId: 'male_teacher_01', text: 'Yes, each of you has your own private learning folder.' }
    ],
    languageFunctions: ['computer lab instructions', 'digital literacy vocabulary'],
    learningObjectives: ['typing, keyboard, folder, software'],
    vocabularyIds: ['VOC_L4_U02_COMPUTER'],
    repetition: 2
  },

  // 2. Daily Routines & Morning Habits (11-20)
  {
    id: 'PL_A1_ROUTINE_011',
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
    id: 'PL_A1_ROUTINE_012',
    level: 'A1',
    ageBand: '8-10',
    topic: 'daily routines',
    title: 'Morning Stretching Exercises',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['parent_male_01'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'parent_male_01', text: 'Good morning, Tom! Ready for our ten-minute balcony stretching?' },
      { speakerId: 'male_child_01', text: 'Yes, Dad! The morning air feels so crisp and refreshing.' },
      { speakerId: 'parent_male_01', text: 'Reach your hands up high toward the clouds, then touch your toes.' },
      { speakerId: 'male_child_01', text: 'One, two, three! I can touch my toes easily now.' },
      { speakerId: 'parent_male_01', text: 'Daily exercise keeps our bodies energetic and healthy throughout the day.' }
    ],
    languageFunctions: ['morning fitness routine', 'stretching commands'],
    learningObjectives: ['stretching, balcony, crisp air, toes'],
    vocabularyIds: ['VOC_L4_U08_EXERCISE'],
    repetition: 2
  },
  {
    id: 'PL_A1_ROUTINE_013',
    level: 'A1',
    ageBand: '8-10',
    topic: 'daily routines',
    title: 'An Evening Homework Routine',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Mom, I finished my maths calculations and English vocabulary homework.' },
      { speakerId: 'female_mother_01', text: 'Well done, Lily. Did you review the irregular spelling words?' },
      { speakerId: 'female_child_01', text: 'Yes, I wrote each difficult word three times in my study notebook.' },
      { speakerId: 'female_mother_01', text: 'Excellent study habit! You may play with your puzzles for thirty minutes now.' },
      { speakerId: 'female_child_01', text: 'Thank you, Mom! I love solving jigsaw puzzles.' }
    ],
    languageFunctions: ['reporting homework completion', 'study habits'],
    learningObjectives: ['homework, calculations, spelling, review'],
    vocabularyIds: ['VOC_L4_U01_HOMEWORK'],
    repetition: 2
  },
  {
    id: 'PL_A1_ROUTINE_014',
    level: 'A1',
    ageBand: '8-10',
    topic: 'daily routines',
    title: 'Packing Healthy Snacks',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_female_02'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'child_female_02', text: 'Mom, what can I take for snack time at school tomorrow?' },
      { speakerId: 'female_mother_01', text: 'How about some sliced crisp cucumbers and sweet red grapes?' },
      { speakerId: 'child_female_02', text: 'That sounds tasty! Can we also add a small box of roasted almonds?' },
      { speakerId: 'female_mother_01', text: 'Certainly. Fresh fruits and nuts provide wonderful stamina for your afternoon classes.' },
      { speakerId: 'child_female_02', text: 'I will pack them neatly into my reusable lunch container.' }
    ],
    languageFunctions: ['choosing healthy snacks', 'planning school nutrition'],
    learningObjectives: ['cucumbers, grapes, almonds, stamina'],
    vocabularyIds: ['VOC_L4_U04_SNACK'],
    repetition: 2
  },
  {
    id: 'PL_A1_ROUTINE_015',
    level: 'A1',
    ageBand: '8-10',
    topic: 'daily routines',
    title: 'Bedtime Reading Habit',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'Every evening at eight o’clock, Tom brushes his teeth, turns on his warm bedside lamp, and reads a chapter of an adventure novel. Reading before sleeping calms his mind and enriches his imagination. After twenty minutes, he closes his book, turns off the light, and drifts into peaceful dreams.' }
    ],
    languageFunctions: ['evening wind-down routine', 'benefits of reading'],
    learningObjectives: ['bedside lamp, chapter, adventure novel, peaceful'],
    vocabularyIds: ['VOC_L4_U01_READ'],
    repetition: 2
  },
  {
    id: 'PL_A1_ROUTINE_016',
    level: 'A1',
    ageBand: '8-10',
    topic: 'daily routines',
    title: 'Caring for a Houseplant',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['parent_male_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Dad, look! The green fern on our windowsill looks a little dry.' },
      { speakerId: 'parent_male_01', text: 'Good observation, Lily. Fetch the blue watering can from the kitchen.' },
      { speakerId: 'female_child_01', text: 'How much water should I pour on the soil?' },
      { speakerId: 'parent_male_01', text: 'Just enough to moisten the roots without overflowing the saucer.' },
      { speakerId: 'female_child_01', text: 'There you go, little plant! Drink up and stay healthy.' }
    ],
    languageFunctions: ['houseplant maintenance', 'careful water pouring'],
    learningObjectives: ['fern, windowsill, watering can, soil'],
    vocabularyIds: ['VOC_L4_U11_PLANT'],
    repetition: 2
  },
  {
    id: 'PL_A1_ROUTINE_017',
    level: 'A1',
    ageBand: '8-10',
    topic: 'daily routines',
    title: 'Walking the Dog in the Afternoon',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Mom, I am going to take Rocky for his afternoon stroll around the park.' },
      { speakerId: 'female_mother_01', text: 'Remember to attach his red leash and take plastic waste bags, Tom.' },
      { speakerId: 'male_child_01', text: 'I already have them in my jacket pocket.' },
      { speakerId: 'female_mother_01', text: 'Stay on the pedestrian walkway and do not let him run near the roadway.' },
      { speakerId: 'male_child_01', text: 'I will be very cautious. See you in twenty minutes, Mom!' }
    ],
    languageFunctions: ['pet care routine', 'pedestrian safety awareness'],
    learningObjectives: ['leash, stroll, walkway, cautious'],
    vocabularyIds: ['VOC_L4_U07_WALK'],
    repetition: 2
  },
  {
    id: 'PL_A1_ROUTINE_018',
    level: 'A1',
    ageBand: '8-10',
    topic: 'daily routines',
    title: 'Organizing the Desk Drawer',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_female_02'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'child_female_02', text: 'Lily, look how tidy my desk drawer looks with these small wooden dividers!' },
      { speakerId: 'female_child_01', text: 'Wow, you separated your paperclips, erasers, and sticky notes so neatly.' },
      { speakerId: 'child_female_02', text: 'Now whenever I need a highlighter or glue stick, I can find it in two seconds.' },
      { speakerId: 'female_child_01', text: 'I should organize my messy drawer like that this Saturday.' }
    ],
    languageFunctions: ['desk organization', 'appreciating tidiness'],
    learningObjectives: ['drawer, dividers, paperclips, highlighters'],
    vocabularyIds: ['VOC_L4_U01_TIDY'],
    repetition: 2
  },
  {
    id: 'PL_A1_ROUTINE_019',
    level: 'A1',
    ageBand: '8-10',
    topic: 'daily routines',
    title: 'A Healthy Morning Smoothie',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_male_02'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'child_male_02', text: 'Mom, what ingredients are inside this creamy purple smoothie?' },
      { speakerId: 'female_mother_01', text: 'Fresh ripe bananas, dark blueberries, Greek yoghurt, and a dash of honey.' },
      { speakerId: 'child_male_02', text: 'It tastes delightfully sweet and chilled!' },
      { speakerId: 'female_mother_01', text: 'Smoothies are a fantastic way to consume vitamins before starting a long school day.' }
    ],
    languageFunctions: ['describing beverage ingredients', 'healthy breakfast options'],
    learningObjectives: ['smoothie, blueberries, yoghurt, vitamins'],
    vocabularyIds: ['VOC_L4_U04_DRINK'],
    repetition: 2
  },
  {
    id: 'PL_A1_ROUTINE_020',
    level: 'A1',
    ageBand: '8-10',
    topic: 'daily routines',
    title: 'Sorting the Household Laundry',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Mom, how do we sort these clothes before washing?' },
      { speakerId: 'female_mother_01', text: 'Place all white shirts into the white basket, and bright colours into the blue basket.' },
      { speakerId: 'female_child_01', text: 'Why do we separate them, Mom?' },
      { speakerId: 'female_mother_01', text: 'So colourful dyes will not bleed onto our crisp white shirts.' },
      { speakerId: 'female_child_01', text: 'I understand now! Sorting is easy and helpful.' }
    ],
    languageFunctions: ['sorting household items', 'learning home chores'],
    learningObjectives: ['laundry, separate, dye, basket'],
    vocabularyIds: ['VOC_L4_U01_CHORE'],
    repetition: 2
  },

  // 3. Hobbies & Sports (21-30)
  {
    id: 'PL_A1_HOBBIES_021',
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
    id: 'PL_A1_HOBBIES_022',
    level: 'A1',
    ageBand: '8-10',
    topic: 'sports',
    title: 'Swimming Lessons on Saturday',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_male_02'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'child_male_02', text: 'Tom, can you swim freestyle yet?' },
      { speakerId: 'male_child_01', text: 'Yes, our swim coach taught us the arm strokes and breathing techniques.' },
      { speakerId: 'child_male_02', text: 'I am still learning to kick my legs steadily with a floating kickboard.' },
      { speakerId: 'male_child_01', text: 'Keep practicing every week! Swimming makes your back and arms strong.' },
      { speakerId: 'child_male_02', text: 'I really love splashing in the cool blue pool water.' }
    ],
    languageFunctions: ['swimming progress', 'sports encouragement'],
    learningObjectives: ['freestyle, kickboard, strokes, coach'],
    vocabularyIds: ['VOC_L4_U08_SWIM'],
    repetition: 2
  },
  {
    id: 'PL_A1_HOBBIES_023',
    level: 'A1',
    ageBand: '8-10',
    topic: 'sports',
    title: 'A Thrilling Table Tennis Rally',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['child_female_02']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Your serve was so fast, Mia! It bounced right on the edge of the green table.' },
      { speakerId: 'child_female_02', text: 'Thank you, Lily! But your backhand return was incredible too.' },
      { speakerId: 'female_child_01', text: 'What is the score now?' },
      { speakerId: 'child_female_02', text: 'It is eight to seven. Let us play one more exciting game!' },
      { speakerId: 'female_child_01', text: 'Get ready for my spin serve!' }
    ],
    languageFunctions: ['scoring games', 'sportsmanship and compliments'],
    learningObjectives: ['table tennis, serve, rally, score, backhand'],
    vocabularyIds: ['VOC_L4_U08_PINGPONG'],
    repetition: 2
  },
  {
    id: 'PL_A1_HOBBIES_024',
    level: 'A1',
    ageBand: '8-10',
    topic: 'hobbies',
    title: 'Building a Miniature Wooden Ship',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['parent_male_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Dad, which wooden piece should we glue next on our model ship?' },
      { speakerId: 'parent_male_01', text: 'Carefully attach the main mast in the centre of the deck, Tom.' },
      { speakerId: 'male_child_01', text: 'It requires steady hands and patience.' },
      { speakerId: 'parent_male_01', text: 'Indeed, crafting models teaches us precision and perseverance.' },
      { speakerId: 'male_child_01', text: 'When it is finished, we can place it on our living room shelf.' }
    ],
    languageFunctions: ['model crafting', 'learning patience and precision'],
    learningObjectives: ['miniature, mast, deck, precision'],
    vocabularyIds: ['VOC_L4_U05_CRAFT'],
    repetition: 2
  },
  {
    id: 'PL_A1_HOBBIES_025',
    level: 'A1',
    ageBand: '8-10',
    topic: 'hobbies',
    title: 'Collecting Colourful Stamps',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'Lily has a thick black album filled with colourful postage stamps from around the globe. Some stamps feature wildlife, while others depict historic sailing ships and ancient castles. Her grandfather brought her two rare stamps from London last week. Lily carefully arranges them with small silver tweezers.' }
    ],
    languageFunctions: ['stamp collection hobby', 'describing international motifs'],
    learningObjectives: ['postage stamps, album, tweezers, castles'],
    vocabularyIds: ['VOC_L4_U05_COLLECT'],
    repetition: 2
  },
  {
    id: 'PL_A1_HOBBIES_026',
    level: 'A1',
    ageBand: '8-10',
    topic: 'sports',
    title: 'Riding Bicycles in the Park',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Lily, let us ride our bikes along the paved path near the lake.' },
      { speakerId: 'female_child_01', text: 'Make sure our bike helmets are strapped securely first, Tom.' },
      { speakerId: 'male_child_01', text: 'Checked! Look, a gentle breeze is rippling the clear water.' },
      { speakerId: 'female_child_01', text: 'Pedaling under these blooming shade trees feels delightful!' },
      { speakerId: 'male_child_01', text: 'Let us ring our bike bells when passing pedestrians: Ring, ring!' }
    ],
    languageFunctions: ['bicycle safety rules', 'enjoying nature cycling'],
    learningObjectives: ['bicycle, helmet, paved path, bell'],
    vocabularyIds: ['VOC_L4_U07_BIKE'],
    repetition: 2
  },
  {
    id: 'PL_A1_HOBBIES_027',
    level: 'A1',
    ageBand: '8-10',
    topic: 'hobbies',
    title: 'Playing the Acoustic Guitar',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_male_02'], SPEAKERS['male_teacher_01']],
    dialogue: [
      { speakerId: 'child_male_02', text: 'Mr. David, my fingertips felt slightly sore after pressing the guitar strings.' },
      { speakerId: 'male_teacher_01', text: 'That is completely normal for beginners, Leo. Soon your fingers will get used to it.' },
      { speakerId: 'child_male_02', text: 'Listen to this simple melody I learned yesterday!' },
      { speakerId: 'male_teacher_01', text: 'That has a clean rhythm and tone. Keep practicing your chord changes daily.' },
      { speakerId: 'child_male_02', text: 'I want to play a song for my family on New Year’s Eve.' }
    ],
    languageFunctions: ['musical instrument practice', 'teacher encouragement'],
    learningObjectives: ['guitar, strings, chords, melody, rhythm'],
    vocabularyIds: ['VOC_L4_U05_GUITAR'],
    repetition: 2
  },
  {
    id: 'PL_A1_HOBBIES_028',
    level: 'A1',
    ageBand: '8-10',
    topic: 'sports',
    title: 'Shooting Baskets on the Court',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['child_male_02']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Leo, pass the orange basketball over here!' },
      { speakerId: 'child_male_02', text: 'Catch, Tom! Now aim for the hoop with a high arc.' },
      { speakerId: 'male_child_01', text: 'Swish! Right through the net without touching the rim!' },
      { speakerId: 'child_male_02', text: 'What an incredible shot! Two points for our team.' },
      { speakerId: 'male_child_01', text: 'Basketball is such a fast and exhilarating sport.' }
    ],
    languageFunctions: ['basketball terminology', 'sports action excitement'],
    learningObjectives: ['basketball, hoop, swish, rim, points'],
    vocabularyIds: ['VOC_L4_U08_BASKETBALL'],
    repetition: 2
  },
  {
    id: 'PL_A1_HOBBIES_029',
    level: 'A1',
    ageBand: '8-10',
    topic: 'hobbies',
    title: 'Baking Chocolate Chip Cookies',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Mom, the cookie dough is mixed smoothly now.' },
      { speakerId: 'female_mother_01', text: 'Now gently fold in the dark chocolate chips, Lily.' },
      { speakerId: 'female_child_01', text: 'Can I spoon little round dough balls onto the baking sheet?' },
      { speakerId: 'female_mother_01', text: 'Yes, leave small spaces between them so they have room to expand.' },
      { speakerId: 'female_child_01', text: 'The sweet aroma from the warm oven is making me so hungry!' }
    ],
    languageFunctions: ['baking instructions', 'baking steps and terms'],
    learningObjectives: ['dough, chocolate chips, baking sheet, oven'],
    vocabularyIds: ['VOC_L4_U04_BAKE'],
    repetition: 2
  },
  {
    id: 'PL_A1_HOBBIES_030',
    level: 'A1',
    ageBand: '8-10',
    topic: 'hobbies',
    title: 'Bird Watching with Binoculars',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_02']],
    dialogue: [
      { speakerId: 'narrator_uk_02', text: 'On Sunday mornings, Mia walks quietly through the botanical garden carrying small binoculars. She spots a tiny hummingbird with iridescent green feathers drinking nectar from a red flower. She writes its name and time in her pocket field journal. Nature watching fills her heart with calm wonder.' }
    ],
    languageFunctions: ['observing nature', 'keeping field journals'],
    learningObjectives: ['binoculars, hummingbird, nectar, field journal'],
    vocabularyIds: ['VOC_L4_U11_BIRDWATCH'],
    repetition: 2
  },

  // 4. Shopping, Food & Dining (31-40)
  {
    id: 'PL_A1_SHOPPING_031',
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
    id: 'PL_A1_SHOPPING_032',
    level: 'A1',
    ageBand: '8-10',
    topic: 'shopping',
    title: 'Buying Fresh Fruits at the Market',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_mother_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'female_mother_01', text: 'Lily, let us choose a ripe watermelon for dessert.' },
      { speakerId: 'female_child_01', text: 'How can we tell if the watermelon is sweet and juicy, Mom?' },
      { speakerId: 'female_mother_01', text: 'Look for a warm yellowish belly spot and tap it gently with your knuckle.' },
      { speakerId: 'female_child_01', text: 'This large one makes a deep hollow sound!' },
      { speakerId: 'female_mother_01', text: 'That is the perfect one. Let us weigh it at the fruit counter.' }
    ],
    languageFunctions: ['selecting quality produce', 'market dialogue'],
    learningObjectives: ['watermelon, ripe, hollow sound, weigh'],
    vocabularyIds: ['VOC_L4_U04_MARKET'],
    repetition: 2
  },
  {
    id: 'PL_A1_SHOPPING_033',
    level: 'A1',
    ageBand: '8-10',
    topic: 'shopping',
    title: 'Ordering Juice at a Cafe',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_teacher_01'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'male_teacher_01', text: 'Welcome to Sunshine Cafe! What would you like to drink today, young man?' },
      { speakerId: 'male_child_01', text: 'Could I have a cup of fresh passion fruit juice with less ice, please?' },
      { speakerId: 'male_teacher_01', text: 'Certainly! Would you like a slice of lemon cake with that?' },
      { speakerId: 'male_child_01', text: 'No, thank you, just the juice for me today.' },
      { speakerId: 'male_teacher_01', text: 'That will be three dollars, please. Have a seat and I will bring it over.' }
    ],
    languageFunctions: ['ordering beverages politely', 'customizing orders'],
    learningObjectives: ['passion fruit juice, less ice, slice of cake'],
    vocabularyIds: ['VOC_L4_U04_CAFE'],
    repetition: 2
  },
  {
    id: 'PL_A1_SHOPPING_034',
    level: 'A1',
    ageBand: '8-10',
    topic: 'shopping',
    title: 'Selecting a New Backpack',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_male_02'], SPEAKERS['parent_male_01']],
    dialogue: [
      { speakerId: 'child_male_02', text: 'Dad, I really like this navy blue backpack with padded shoulder straps.' },
      { speakerId: 'parent_male_01', text: 'Let us inspect the zippers and internal compartments, Leo.' },
      { speakerId: 'child_male_02', text: 'It has a padded pocket for notebooks and side mesh for water bottles.' },
      { speakerId: 'parent_male_01', text: 'The material is waterproof and sturdy. It will last the whole academic year.' },
      { speakerId: 'child_male_02', text: 'Thank you, Dad! I cannot wait to use it on Monday.' }
    ],
    languageFunctions: ['evaluating product features', 'shopping for school supplies'],
    learningObjectives: ['backpack, padded straps, waterproof, compartments'],
    vocabularyIds: ['VOC_L4_U01_BACKPACK'],
    repetition: 2
  },
  {
    id: 'PL_A1_SHOPPING_035',
    level: 'A1',
    ageBand: '8-10',
    topic: 'shopping',
    title: 'At the Bakery Counter',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Mom, the bakery display smells heavenly!' },
      { speakerId: 'female_mother_01', text: 'Would you like two crusty French baguettes or soft butter rolls?' },
      { speakerId: 'female_child_01', text: 'Butter rolls, please! They are so fluffy and warm.' },
      { speakerId: 'female_mother_01', text: 'Let us also get a box of raisin cookies for Grandpa.' },
      { speakerId: 'female_child_01', text: 'Grandpa will be so pleased with the afternoon treat!' }
    ],
    languageFunctions: ['bakery transactions', 'describing bread textures'],
    learningObjectives: ['baguette, butter rolls, fluffy, bakery'],
    vocabularyIds: ['VOC_L4_U04_BAKERY'],
    repetition: 2
  },
  {
    id: 'PL_A1_FOOD_036',
    level: 'A1',
    ageBand: '8-10',
    topic: 'food',
    title: 'Cooking Warm Rice and Vegetables',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Mom, can you teach me how to rinse the white rice grains?' },
      { speakerId: 'female_mother_01', text: 'Swirl the rice gently in cool water two times, then drain carefully.' },
      { speakerId: 'male_child_01', text: 'Then we add water up to the first finger line?' },
      { speakerId: 'female_mother_01', text: 'Exactly right! Close the cooker lid and press cook.' },
      { speakerId: 'male_child_01', text: 'Cooking everyday meals is like fun science!' }
    ],
    languageFunctions: ['explaining cooking techniques', 'traditional rice preparation'],
    learningObjectives: ['rinse, rice grains, drain, cooker lid'],
    vocabularyIds: ['VOC_L4_U04_RICE'],
    repetition: 2
  },
  {
    id: 'PL_A1_FOOD_037',
    level: 'A1',
    ageBand: '8-10',
    topic: 'food',
    title: 'Making a Colorful Fruit Salad',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_female_02'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'child_female_02', text: 'Lily, look at our big glass bowl of fruit salad!' },
      { speakerId: 'female_child_01', text: 'We have red strawberries, golden mango cubes, green kiwi, and purple grapes.' },
      { speakerId: 'child_female_02', text: 'Let us drizzle a little creamy honey yoghurt over the top.' },
      { speakerId: 'female_child_01', text: 'It looks like a festive edible rainbow!' },
      { speakerId: 'child_female_02', text: 'Let us serve small bowls for everyone in the garden.' }
    ],
    languageFunctions: ['describing food assembly', 'colourful food presentation'],
    learningObjectives: ['fruit salad, mango cubes, drizzle, kiwi'],
    vocabularyIds: ['VOC_L4_U04_SALAD'],
    repetition: 2
  },
  {
    id: 'PL_A1_SHOPPING_038',
    level: 'A1',
    ageBand: '8-10',
    topic: 'shopping',
    title: 'Checking Out at the Supermarket',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_mother_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'female_mother_01', text: 'Lily, please place the carton of eggs on the conveyor belt.' },
      { speakerId: 'female_child_01', text: 'I am handling them very gently so none crack.' },
      { speakerId: 'female_mother_01', text: 'Here are our reusable cloth shopping bags.' },
      { speakerId: 'female_child_01', text: 'Reusing cloth bags helps reduce plastic waste in our oceans.' },
      { speakerId: 'female_mother_01', text: 'Smart thinking, my dear!' }
    ],
    languageFunctions: ['supermarket checkout', 'environmental shopping habits'],
    learningObjectives: ['conveyor belt, carton, reusable bags, checkout'],
    vocabularyIds: ['VOC_L4_U04_GROCERY'],
    repetition: 2
  },
  {
    id: 'PL_A1_FOOD_039',
    level: 'A1',
    ageBand: '8-10',
    topic: 'food',
    title: 'A Sunday Family Barbecue',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'On Sunday evening, Tom’s family gathered in the backyard for a warm barbecue. Father grilled savoury corn on the cob and chicken skewers over gentle charcoal embers. Mother prepared a crisp garden salad, while Tom set paper napkins on the picnic table. The delicious smoky scent brought everyone together with happy smiles.' }
    ],
    languageFunctions: ['describing outdoor family meals', 'sensory barbecue words'],
    learningObjectives: ['barbecue, skewers, corn on the cob, charcoal embers'],
    vocabularyIds: ['VOC_L4_U04_MEAL'],
    repetition: 2
  },
  {
    id: 'PL_A1_SHOPPING_040',
    level: 'A1',
    ageBand: '8-10',
    topic: 'shopping',
    title: 'Buying a Birthday Gift for a Classmate',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Lily, what gift should we buy for Sam’s ninth birthday?' },
      { speakerId: 'female_child_01', text: 'He loves astronomy and stars. What about this luminous 3D globe puzzle?' },
      { speakerId: 'male_child_01', text: 'That is brilliant! It glows in the dark and shows all the constellations.' },
      { speakerId: 'female_child_01', text: 'Let us ask the shopkeeper to wrap it in shiny starry paper.' },
      { speakerId: 'male_child_01', text: 'Sam will be overjoyed when he unwraps it at his party.' }
    ],
    languageFunctions: ['selecting gifts for peers', 'gift wrapping requests'],
    learningObjectives: ['gift, globe puzzle, constellations, wrap'],
    vocabularyIds: ['VOC_L4_U05_GIFT'],
    repetition: 2
  },

  // 5. Transportation, Travel & Places (41-50)
  {
    id: 'PL_A1_TRANSPORT_041',
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
    id: 'PL_A1_TRANSPORT_042',
    level: 'A1',
    ageBand: '8-10',
    topic: 'transport',
    title: 'Catching the City Electric Tram',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['parent_male_01'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'parent_male_01', text: 'Hold my hand, Tom. The electric tram is approaching the station platform.' },
      { speakerId: 'male_child_01', text: 'Look how modern and quiet it is, Dad!' },
      { speakerId: 'parent_male_01', text: 'Step aboard carefully. Tap our smart travel card on the sensor.' },
      { speakerId: 'male_child_01', text: 'Beep! The green light turned on.' },
      { speakerId: 'parent_male_01', text: 'Let us find two seats near the window to watch the city streets.' }
    ],
    languageFunctions: ['public transport boarding', 'smart card payment'],
    learningObjectives: ['electric tram, platform, sensor, smart card'],
    vocabularyIds: ['VOC_L4_U07_TRAM'],
    repetition: 2
  },
  {
    id: 'PL_A1_TRANSPORT_043',
    level: 'A1',
    ageBand: '8-10',
    topic: 'visiting places',
    title: 'A Day at the Ancient Castle',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'Last Saturday, Mia visited an ancient stone castle atop a misty hill. She crossed a deep moat over a wooden drawbridge. Inside the great stone hall, knight armours stood silently along the wall. From the highest tower, Mia looked across green meadows and felt like a medieval princess.' }
    ],
    languageFunctions: ['historical landmark visits', 'castle architectural terms'],
    learningObjectives: ['castle, moat, drawbridge, knight armour, tower'],
    vocabularyIds: ['VOC_L4_U06_CASTLE'],
    repetition: 2
  },
  {
    id: 'PL_A1_TRANSPORT_044',
    level: 'A1',
    ageBand: '8-10',
    topic: 'directions',
    title: 'Asking for Directions to the Post Office',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['male_teacher_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Excuse me, sir. Could you tell me where the central post office is?' },
      { speakerId: 'male_teacher_01', text: 'Walk straight along Elm Street for two blocks, then turn left at the traffic light.' },
      { speakerId: 'female_child_01', text: 'Is it opposite the community library?' },
      { speakerId: 'male_teacher_01', text: 'Yes, exactly! It is a red brick building with a blue postbox in front.' },
      { speakerId: 'female_child_01', text: 'Thank you very much for your clear directions!' }
    ],
    languageFunctions: ['asking and giving street directions', 'identifying landmarks'],
    learningObjectives: ['walk straight, turn left, traffic light, opposite'],
    vocabularyIds: ['VOC_L4_U07_DIRECTIONS'],
    repetition: 2
  },
  {
    id: 'PL_A1_TRANSPORT_045',
    level: 'A1',
    ageBand: '8-10',
    topic: 'transport',
    title: 'Riding a River Ferry Boat',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Lily, look at the white seagulls following our river ferry!' },
      { speakerId: 'female_child_01', text: 'They glide so gracefully in the cool breeze.' },
      { speakerId: 'male_child_01', text: 'The ferry is crossing the wide river to the old trading port.' },
      { speakerId: 'female_child_01', text: 'Wearing orange life vests keeps everyone secure on the water.' },
      { speakerId: 'male_child_01', text: 'The view of the suspension bridge from the water is breathtaking.' }
    ],
    languageFunctions: ['water transport experience', 'observing nature on water'],
    learningObjectives: ['ferry, seagulls, life vest, bridge, glide'],
    vocabularyIds: ['VOC_L4_U07_FERRY'],
    repetition: 2
  },
  {
    id: 'PL_A1_TRANSPORT_046',
    level: 'A1',
    ageBand: '8-10',
    topic: 'visiting places',
    title: 'Exploring the Dinosaur Museum',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_male_02'], SPEAKERS['female_teacher_01']],
    dialogue: [
      { speakerId: 'child_male_02', text: 'Ms. Sarah, is that enormous skeleton a Tyrannosaurus Rex?' },
      { speakerId: 'female_teacher_01', text: 'Yes, Leo! Notice its sharp teeth and powerful hind legs.' },
      { speakerId: 'child_male_02', text: 'How many millions of years ago did dinosaurs inhabit our earth?' },
      { speakerId: 'female_teacher_01', text: 'Over sixty-five million years ago during the prehistoric era.' },
      { speakerId: 'child_male_02', text: 'Fossils reveal so many amazing prehistoric mysteries!' }
    ],
    languageFunctions: ['museum exploration', 'scientific inquiry into fossils'],
    learningObjectives: ['dinosaur, skeleton, fossils, prehistoric'],
    vocabularyIds: ['VOC_L4_U10_MUSEUM'],
    repetition: 2
  },
  {
    id: 'PL_A1_TRANSPORT_047',
    level: 'A1',
    ageBand: '8-10',
    topic: 'visiting places',
    title: 'A Visit to the Botanical Greenhouse',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_02']],
    dialogue: [
      { speakerId: 'narrator_uk_02', text: 'Under a grand glass dome, tropical ferns and towering palm trees thrive in warm humid air. Colourful butterflies flutter among exotic purple orchids. Lily walks along the stone path, marvelling at giant water lilies floating in the central pond. It felt like stepping into an enchanting rainforest.' }
    ],
    languageFunctions: ['botanical garden description', 'sensory greenhouse imagery'],
    learningObjectives: ['greenhouse, glass dome, orchids, butterflies, rainforest'],
    vocabularyIds: ['VOC_L4_U11_BOTANICAL'],
    repetition: 2
  },
  {
    id: 'PL_A1_TRANSPORT_048',
    level: 'A1',
    ageBand: '8-10',
    topic: 'transport',
    title: 'Traveling by Country Train',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_female_02'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'child_female_02', text: 'Mom, the train is passing through rolling green pastures!' },
      { speakerId: 'female_mother_01', text: 'Look outside, Mia! Can you spot black and white dairy cows grazing?' },
      { speakerId: 'child_female_02', text: 'Yes, and a wooden red barn near a winding stream.' },
      { speakerId: 'female_mother_01', text: 'Train journeys allow us to relax and appreciate pastoral scenery.' },
      { speakerId: 'child_female_02', text: 'The rhythmic sound of the rails is so soothing: clack-clack, clack-clack.' }
    ],
    languageFunctions: ['countryside train travel', 'describing landscapes'],
    learningObjectives: ['pastures, barn, rails, countryside'],
    vocabularyIds: ['VOC_L4_U07_TRAIN'],
    repetition: 2
  },
  {
    id: 'PL_A1_TRANSPORT_049',
    level: 'A1',
    ageBand: '8-10',
    topic: 'visiting places',
    title: 'Watching Animals at the Farm Sanctuary',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['parent_male_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Dad, can I pet this fluffy white sheep?' },
      { speakerId: 'parent_male_01', text: 'Reach out gently, Tom, so you do not startle her.' },
      { speakerId: 'male_child_01', text: 'Her wool feels so dense and warm! What do sheep eat?' },
      { speakerId: 'parent_male_01', text: 'They graze on fresh green grass, clover, and sweet hay.' },
      { speakerId: 'male_child_01', text: 'Farm animals are so gentle when treated with kindness.' }
    ],
    languageFunctions: ['interacting with farm animals', 'animal welfare'],
    learningObjectives: ['farm sanctuary, sheep, wool, clover, gentle'],
    vocabularyIds: ['VOC_L4_U03_FARM'],
    repetition: 2
  },
  {
    id: 'PL_A1_TRANSPORT_050',
    level: 'A1',
    ageBand: '8-10',
    topic: 'directions',
    title: 'Finding the Playground Swings',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['child_male_02']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Leo, where did the new playground swings get installed?' },
      { speakerId: 'child_male_02', text: 'They are past the sandbox, right behind the wooden climbing frame.' },
      { speakerId: 'female_child_01', text: 'Let us race over and see who can swing the highest!' },
      { speakerId: 'child_male_02', text: 'Remember to check if anyone is walking nearby before swinging.' },
      { speakerId: 'female_child_01', text: 'Safety first! Here we go!' }
    ],
    languageFunctions: ['navigating playground layout', 'outdoor play safety'],
    learningObjectives: ['swings, sandbox, climbing frame, swing high'],
    vocabularyIds: ['VOC_L4_U08_SWING'],
    repetition: 2
  },

  // 6. Social Situations, Friends & Events (51-60)
  {
    id: 'PL_A1_SOCIAL_051',
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
  {
    id: 'PL_A1_SOCIAL_052',
    level: 'A1',
    ageBand: '8-10',
    topic: 'social situations',
    title: 'A Surprise Birthday Party',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_female_02'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'child_female_02', text: 'Lily, keep your voice low! Leo is coming through the front door in three minutes.' },
      { speakerId: 'female_child_01', text: 'Are the festive balloons hung and the birthday cake candles ready?' },
      { speakerId: 'child_female_02', text: 'Yes, everyone hide behind the sofa and curtains!' },
      { speakerId: 'female_child_01', text: 'Shh! Here he comes! One, two, three...' },
      { speakerId: 'child_female_02', text: 'SURPRISE! Happy ninth birthday, Leo!' }
    ],
    languageFunctions: ['coordinating surprises', 'celebrating birthdays'],
    learningObjectives: ['surprise party, candles, balloons, hide'],
    vocabularyIds: ['VOC_L4_U05_PARTY'],
    repetition: 2
  },
  {
    id: 'PL_A1_SOCIAL_053',
    level: 'A1',
    ageBand: '8-10',
    topic: 'social situations',
    title: 'Resolving a Small Disagreement',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['child_male_02']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Leo, we both want to use the red coloured markers right now.' },
      { speakerId: 'child_male_02', text: 'How about I use the blue marker first while you finish your red border?' },
      { speakerId: 'male_child_01', text: 'Then in five minutes, we can swap markers peacefully.' },
      { speakerId: 'child_male_02', text: 'That is a fair solution. Sharing makes drawing enjoyable for both of us.' },
      { speakerId: 'male_child_01', text: 'Deal! Thanks for being so understanding.' }
    ],
    languageFunctions: ['conflict resolution', 'sharing and compromise'],
    learningObjectives: ['swap, fair solution, compromise, share'],
    vocabularyIds: ['VOC_L4_U02_SHARE'],
    repetition: 2
  },
  {
    id: 'PL_A1_SOCIAL_054',
    level: 'A1',
    ageBand: '8-10',
    topic: 'asking for help',
    title: 'Asking for Help with a Heavy Box',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['male_teacher_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Excuse me, Mr. David. Could you give me a hand with this box of art supplies?' },
      { speakerId: 'male_teacher_01', text: 'Gladly, Lily. It looks quite bulky for one person to carry.' },
      { speakerId: 'female_child_01', text: 'Thank you. We need to take it to classroom three B on the ground floor.' },
      { speakerId: 'male_teacher_01', text: 'You hold one handle and I will lift the other. Teamwork makes lifting easy.' },
      { speakerId: 'female_child_01', text: 'I appreciate your assistance, Mr. David!' }
    ],
    languageFunctions: ['requesting physical help', 'teamwork coordination'],
    learningObjectives: ['give a hand, bulky, handle, teamwork'],
    vocabularyIds: ['VOC_L4_U01_HELP'],
    repetition: 2
  },
  {
    id: 'PL_A1_SOCIAL_055',
    level: 'A1',
    ageBand: '8-10',
    topic: 'social situations',
    title: 'Visiting a Sick Friend',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['child_male_02']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Hello Leo! How are you feeling today?' },
      { speakerId: 'child_male_02', text: 'Hi Tom. My fever is gone, but my throat still tickles a bit.' },
      { speakerId: 'male_child_01', text: 'I brought you the science homework sheets and our classroom cartoon drawings.' },
      { speakerId: 'child_male_02', text: 'You are so thoughtful, Tom! Thank you for thinking of me.' },
      { speakerId: 'male_child_01', text: 'Get well soon, buddy. We miss playing tag with you at recess.' }
    ],
    languageFunctions: ['expressing empathy to sick friends', 'delivering homework support'],
    learningObjectives: ['fever, throat, thoughtful, get well soon'],
    vocabularyIds: ['VOC_L4_U09_HEALTH'],
    repetition: 2
  },
  {
    id: 'PL_A1_SOCIAL_056',
    level: 'A1',
    ageBand: '8-10',
    topic: 'social situations',
    title: 'Welcoming a New Classmate',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['child_female_02']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Hi, I saw you sitting alone. Are you Anna from Da Nang?' },
      { speakerId: 'child_female_02', text: 'Yes, hello. My family moved here last weekend.' },
      { speakerId: 'female_child_01', text: 'Welcome to our school! Would you like to eat lunch with our group?' },
      { speakerId: 'child_female_02', text: 'I would appreciate that so much. Everything feels so new and unfamiliar.' },
      { speakerId: 'female_child_01', text: 'Do not worry, we will introduce you to all our friends.' }
    ],
    languageFunctions: ['inclusive welcoming behaviour', 'easing transition anxiety'],
    learningObjectives: ['welcome, moved, unfamiliar, introduce'],
    vocabularyIds: ['VOC_L4_U01_WELCOME'],
    repetition: 2
  },
  {
    id: 'PL_A1_SOCIAL_057',
    level: 'A1',
    ageBand: '8-10',
    topic: 'social situations',
    title: 'Apologizing for an Accidental Bump',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_male_02'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'child_male_02', text: 'Oh, I am terribly sorry, Lily! I was running and accidentally dropped your pencil box.' },
      { speakerId: 'female_child_01', text: 'Do not worry, Leo. It was an accident.' },
      { speakerId: 'child_male_02', text: 'Let me help you pick up all the coloured pencils from the floor.' },
      { speakerId: 'female_child_01', text: 'Thank you. None of the leads are broken, so everything is fine.' },
      { speakerId: 'child_male_02', text: 'I will walk more carefully in the hallway from now on.' }
    ],
    languageFunctions: ['sincere apologies', 'forgiving accidents politely'],
    learningObjectives: ['terribly sorry, accident, leads, hallway'],
    vocabularyIds: ['VOC_L4_U01_SORRY'],
    repetition: 2
  },
  {
    id: 'PL_A1_SOCIAL_058',
    level: 'A1',
    ageBand: '8-10',
    topic: 'social situations',
    title: 'Planning a Weekend Picnic',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Tom, the weather forecast predicts sunshine for this Sunday!' },
      { speakerId: 'male_child_01', text: 'Should we arrange a picnic by the botanical garden lake?' },
      { speakerId: 'female_child_01', text: 'Yes! I can bring tuna sandwiches, sliced apples, and orange juice.' },
      { speakerId: 'male_child_01', text: 'I will bring a large checked blanket, a football, and badminton rackets.' },
      { speakerId: 'female_child_01', text: 'Let us meet by the main park fountain at ten in the morning.' }
    ],
    languageFunctions: ['planning collaborative outdoor events', 'assigning food and equipment'],
    learningObjectives: ['weather forecast, picnic, checked blanket, fountain'],
    vocabularyIds: ['VOC_L4_U08_PICNIC'],
    repetition: 2
  },
  {
    id: 'PL_A1_SOCIAL_059',
    level: 'A1',
    ageBand: '8-10',
    topic: 'social situations',
    title: 'Congratulating a Friend on Winning a Badge',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_male_02'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'child_male_02', text: 'Lily, congratulations on earning the Golden Maths Star badge!' },
      { speakerId: 'female_child_01', text: 'Thank you so much, Leo! I solved fifty geometry challenges this week.' },
      { speakerId: 'child_male_02', text: 'You worked consistently hard every evening. You truly deserve it!' },
      { speakerId: 'female_child_01', text: 'Your encouraging words mean a lot to me. Let us celebrate with fruit smoothies!' }
    ],
    languageFunctions: ['praising peer achievements', 'celebrating academic milestones'],
    learningObjectives: ['congratulations, badge, deserve, consistently'],
    vocabularyIds: ['VOC_L4_U01_BADGE'],
    repetition: 2
  },
  {
    id: 'PL_A1_SOCIAL_060',
    level: 'A1',
    ageBand: '8-10',
    topic: 'social situations',
    title: 'Saying Goodbye to a Visiting Cousin',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['child_female_02']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Mia, I am going to miss having you stay at our house this summer.' },
      { speakerId: 'child_female_02', text: 'I had the best vacation with you, Lily! We baked cookies and rode bikes every day.' },
      { speakerId: 'female_child_01', text: 'Will you call me on the tablet every weekend?' },
      { speakerId: 'child_female_02', text: 'Of course! Have a wonderful school year, my favourite cousin.' },
      { speakerId: 'female_child_01', text: 'Safe travels home! Give Auntie a warm hug from me.' }
    ],
    languageFunctions: ['fond farewells', 'maintaining long-distance connection'],
    learningObjectives: ['vacation, miss you, safe travels, cousin'],
    vocabularyIds: ['VOC_L4_U05_COUSIN'],
    repetition: 2
  },

  // 7. Weather, Seasons & Environment (61-70)
  {
    id: 'PL_A1_WEATHER_061',
    level: 'A1',
    ageBand: '8-10',
    topic: 'weather',
    title: 'A Sudden Summer Thunderstorm',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Mom, dark charcoal clouds are gathering rapidly in the western sky!' },
      { speakerId: 'female_mother_01', text: 'Quick, let us close all balcony windows before the gusty wind arrives.' },
      { speakerId: 'male_child_01', text: 'Flash! Look at that bright lightning bolt across the horizon.' },
      { speakerId: 'female_mother_01', text: 'Rumble! Thunder follows right after. We are safe and warm inside.' },
      { speakerId: 'male_child_01', text: 'The heavy rain will refresh our thirsty garden trees.' }
    ],
    languageFunctions: ['storm safety awareness', 'natural weather sequence lightning and thunder'],
    learningObjectives: ['thunderstorm, lightning, thunder, gusty wind'],
    vocabularyIds: ['VOC_L4_U18_STORM'],
    repetition: 2
  },
  {
    id: 'PL_A1_WEATHER_062',
    level: 'A1',
    ageBand: '8-10',
    topic: 'weather',
    title: 'Spring Blossoms in the Orchard',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'When spring arrived, fruit trees in the valley orchard burst into delicate pink and white blossoms. Busy honeybees buzzed from flower to flower, collecting sweet nectar. Gentle morning dew sparkled like tiny diamonds on the fresh grass. Springtime breathed new life and hope into the countryside.' }
    ],
    languageFunctions: ['springtime imagery', 'ecological interactions bees and blossoms'],
    learningObjectives: ['orchard, blossoms, honeybees, nectar, dew'],
    vocabularyIds: ['VOC_L4_U18_SPRING'],
    repetition: 2
  },
  {
    id: 'PL_A1_WEATHER_063',
    level: 'A1',
    ageBand: '8-10',
    topic: 'weather',
    title: 'A Scorching Hot Summer Afternoon',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_male_02'], SPEAKERS['parent_male_01']],
    dialogue: [
      { speakerId: 'child_male_02', text: 'Dad, the thermometer on the wall reads thirty-six degrees Celsius!' },
      { speakerId: 'parent_male_01', text: 'It is scorching hot today, Leo. Make sure you drink lots of water throughout the afternoon.' },
      { speakerId: 'child_male_02', text: 'Can we turn on the electric fan and pull down the sunshades?' },
      { speakerId: 'parent_male_01', text: 'Yes, keeping direct sunlight out helps our living room remain comfortably cool.' },
      { speakerId: 'child_male_02', text: 'Eating a slice of chilled watermelon will also cool us down nicely.' }
    ],
    languageFunctions: ['heatwave precautions', 'measuring temperature'],
    learningObjectives: ['thermometer, degrees Celsius, scorching, sunshades'],
    vocabularyIds: ['VOC_L4_U18_SUMMER'],
    repetition: 2
  },
  {
    id: 'PL_A1_WEATHER_064',
    level: 'A1',
    ageBand: '8-10',
    topic: 'weather',
    title: 'Golden Autumn Foliage',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['female_teacher_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Ms. Sarah, why do tree leaves change color in autumn?' },
      { speakerId: 'female_teacher_01', text: 'As daylight hours shorten and weather cools, trees conserve their energy for winter.' },
      { speakerId: 'female_child_01', text: 'The bright red maple leaves look magnificent on the ground.' },
      { speakerId: 'female_teacher_01', text: 'We can collect dried autumn leaves to make nature collages in art class.' },
      { speakerId: 'female_child_01', text: 'I will pick up ten golden leaves after school!' }
    ],
    languageFunctions: ['scientific explanations of autumn', 'art with nature materials'],
    learningObjectives: ['autumn, foliage, conserve, maple leaves, collage'],
    vocabularyIds: ['VOC_L4_U18_AUTUMN'],
    repetition: 2
  },
  {
    id: 'PL_A1_WEATHER_065',
    level: 'A1',
    ageBand: '8-10',
    topic: 'weather',
    title: 'Building a Snowman in Winter',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['child_female_02']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Mia, let us roll three big snowballs for our snowman’s body!' },
      { speakerId: 'child_female_02', text: 'Here is a large one for the base, a medium one for the torso, and a small one for the head.' },
      { speakerId: 'male_child_01', text: 'I brought two shiny black coal lumps for eyes and an orange carrot for the nose.' },
      { speakerId: 'child_female_02', text: 'Let us wrap my old red woollen scarf around his neck.' },
      { speakerId: 'male_child_01', text: 'He looks like a jolly, friendly winter gentleman!' }
    ],
    languageFunctions: ['winter crafts', 'building a snowman sequential steps'],
    learningObjectives: ['snowman, coal, carrot nose, woollen scarf'],
    vocabularyIds: ['VOC_L4_U18_WINTER'],
    repetition: 2
  },
  {
    id: 'PL_A1_WEATHER_066',
    level: 'A1',
    ageBand: '8-10',
    topic: 'environment',
    title: 'Planting a Tree in the Community Park',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['parent_male_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Dad, how deep should we dig the hole for this young oak sapling?' },
      { speakerId: 'parent_male_01', text: 'About forty centimetres deep so its roots have plenty of loose fertile soil.' },
      { speakerId: 'male_child_01', text: 'I will pat down the dark soil gently around the stem.' },
      { speakerId: 'parent_male_01', text: 'Trees purify our city air and provide shelter for songbirds for generations.' },
      { speakerId: 'male_child_01', text: 'I will water this little oak every weekend and watch it grow tall.' }
    ],
    languageFunctions: ['tree planting instructions', 'environmental stewardship'],
    learningObjectives: ['sapling, fertile soil, purify air, shelter'],
    vocabularyIds: ['VOC_L4_U11_TREE'],
    repetition: 2
  },
  {
    id: 'PL_A1_WEATHER_067',
    level: 'A1',
    ageBand: '8-10',
    topic: 'environment',
    title: 'Saving Water at Home',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Mom, I turn off the tap while soaping my hands and brushing teeth.' },
      { speakerId: 'female_mother_01', text: 'That saves many litres of clean drinking water every week, Lily.' },
      { speakerId: 'female_child_01', text: 'We also use rainwater from the garden barrel to water our potted flowers.' },
      { speakerId: 'female_mother_01', text: 'Conserving water is essential for protecting our natural planet.' },
      { speakerId: 'female_child_01', text: 'Small daily actions truly create a significant positive difference!' }
    ],
    languageFunctions: ['water conservation habits', 'ecological responsibility'],
    learningObjectives: ['conserve, tap, rainwater, barrel, essential'],
    vocabularyIds: ['VOC_L4_U11_WATER'],
    repetition: 2
  },
  {
    id: 'PL_A1_WEATHER_068',
    level: 'A1',
    ageBand: '8-10',
    topic: 'environment',
    title: 'A Clean-Up Drive on the Riverbank',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_male_02'], SPEAKERS['male_teacher_01']],
    dialogue: [
      { speakerId: 'child_male_02', text: 'Mr. David, we collected three sacks of discarded plastic bottles from the riverbank.' },
      { speakerId: 'male_teacher_01', text: 'Outstanding effort, Leo! Plastic debris harms river fish and waterbirds.' },
      { speakerId: 'child_male_02', text: 'Will these plastic bottles be transported to the recycling factory?' },
      { speakerId: 'male_teacher_01', text: 'Yes, they will be shredded, cleaned, and turned into recycled park benches.' },
      { speakerId: 'child_male_02', text: 'That gives old rubbish a brand new useful purpose!' }
    ],
    languageFunctions: ['community cleanup volunteerism', 'recycling lifecycle'],
    learningObjectives: ['riverbank, debris, shredded, recycled benches'],
    vocabularyIds: ['VOC_L4_U11_CLEANUP'],
    repetition: 2
  },
  {
    id: 'PL_A1_WEATHER_069',
    level: 'A1',
    ageBand: '8-10',
    topic: 'environment',
    title: 'Turning Off Lights to Conserve Electricity',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['parent_male_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Dad, I switched off the ceiling lights in the dining room when we left.' },
      { speakerId: 'parent_male_01', text: 'Thank you for remembering, Tom. Saving electricity reduces carbon emissions.' },
      { speakerId: 'male_child_01', text: 'Can we open the curtains during daytime instead of using lamps?' },
      { speakerId: 'parent_male_01', text: 'Natural sunlight is healthier for our eyes and costs zero energy.' },
      { speakerId: 'male_child_01', text: 'I will be our family energy-saving detective!' }
    ],
    languageFunctions: ['energy efficiency habits', 'carbon emission awareness'],
    learningObjectives: ['switch off, electricity, carbon emissions, natural light'],
    vocabularyIds: ['VOC_L4_U11_ENERGY'],
    repetition: 2
  },
  {
    id: 'PL_A1_WEATHER_070',
    level: 'A1',
    ageBand: '8-10',
    topic: 'environment',
    title: 'The Wonderful World of Honeybees',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'Honeybees are small creatures with immense ecological importance. By flying among millions of blossoms each summer day, they pollinate fruit trees, wildflowers, and farm crops. Without industrious bees, many delicious fruits would not grow. Protecting nature means cherishing even the smallest creatures.' }
    ],
    languageFunctions: ['biodiversity appreciation', 'role of pollinators in nature'],
    learningObjectives: ['honeybees, pollinate, crops, industrious, cherishing'],
    vocabularyIds: ['VOC_L4_U11_BEES'],
    repetition: 2
  }
];

module.exports = { A1_LESSONS };
