/**
 * data_pre_a1.js — Thư viện 50 bài nghe chuẩn Pre-A1 dành cho lứa tuổi 6-8 (v15.12).
 * Đặc trưng: Câu ngắn, lặp lại tự nhiên, từ vựng trực quan, tốc độ đọc 0.80 - 0.84.
 */

const { SPEAKERS } = require('./speakers_pool');

const PRE_A1_LESSONS = [
  // 1. Animals & Pets
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
    id: 'PL_PREA1_ANIMALS_002',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'animals',
    title: 'A Little Puppy in the Yard',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['child_female_02']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Mia, come here! Look at this little puppy.' },
      { speakerId: 'child_female_02', text: 'Oh, it has long brown ears and a tiny tail!' },
      { speakerId: 'male_child_01', text: 'He is running around the green grass.' },
      { speakerId: 'child_female_02', text: 'He is happy. Good morning, little puppy!' },
      { speakerId: 'male_child_01', text: 'Woof woof! He is barking at us happily.' }
    ],
    languageFunctions: ['identifying pets', 'describing appearances', 'greeting pets'],
    learningObjectives: ['recognize dog, ears, tail', 'use simple sensory adjectives'],
    vocabularyIds: ['VOC_L1_U03_DOG'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_ANIMALS_003',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'animals',
    title: 'The Singing Bird',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'A small blue bird sits on a high green branch. The bird sings a sweet song. Chirp, chirp, chirp! Lily smiles and waves her hand. The little bird flies into the warm sky.' }
    ],
    languageFunctions: ['listening to animal actions', 'sensory descriptions'],
    learningObjectives: ['color blue and green', 'bird action verbs'],
    vocabularyIds: ['VOC_L1_U03_BIRD'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_ANIMALS_004',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'animals',
    title: 'Feeding the Golden Fish',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Mom, can I feed the little fish now?' },
      { speakerId: 'female_mother_01', text: 'Yes, sweetheart. Put a little food into the water.' },
      { speakerId: 'female_child_01', text: 'Look! The fish swims fast with its orange fins.' },
      { speakerId: 'female_mother_01', text: 'It is very hungry today. Good job, Lily!' }
    ],
    languageFunctions: ['asking for permission', 'observing animal feeding'],
    learningObjectives: ['fish, water, food', 'simple instructions'],
    vocabularyIds: ['VOC_L1_U03_FISH'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_ANIMALS_005',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'animals',
    title: 'The Big Grey Elephant',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_02']],
    dialogue: [
      { speakerId: 'narrator_uk_02', text: 'Tom visits the sunny city zoo. He sees a huge grey elephant. The elephant has big ears and a very long nose. It drinks cool water and sprays it high into the air. Tom laughs happily!' }
    ],
    languageFunctions: ['zoo animals', 'describing size and actions'],
    learningObjectives: ['size adjectives big, huge', 'elephant body parts'],
    vocabularyIds: ['VOC_L1_U03_ELEPHANT'],
    repetition: 2
  },

  // 2. Greetings & Self Introduction
  {
    id: 'PL_PREA1_GREETINGS_006',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'greetings',
    title: 'Good Morning, New Friend',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Hello! What is your name?' },
      { speakerId: 'male_child_01', text: 'Hi! My name is Tom. What is your name?' },
      { speakerId: 'female_child_01', text: 'I am Lily. Nice to meet you, Tom!' },
      { speakerId: 'male_child_01', text: 'Nice to meet you too, Lily. Let us play together!' },
      { speakerId: 'female_child_01', text: 'Yes, let us play!' }
    ],
    languageFunctions: ['introducing oneself', 'polite greeting exchanges'],
    learningObjectives: ['ask and answer name', 'friendly interaction'],
    vocabularyIds: ['VOC_L1_U01_HELLO'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_GREETINGS_007',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'greetings',
    title: 'How Are You Today?',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_teacher_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'male_teacher_01', text: 'Good morning, Lily. How are you today?' },
      { speakerId: 'female_child_01', text: 'I am fine, thank you, Mr. David. And you?' },
      { speakerId: 'male_teacher_01', text: 'I am great! Are you ready to sing our song?' },
      { speakerId: 'female_child_01', text: 'Yes, sir! I love singing!' }
    ],
    languageFunctions: ['asking about wellbeing', 'polite reciprocation'],
    learningObjectives: ['how are you, I am fine, thank you'],
    vocabularyIds: ['VOC_L1_U01_FINE'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_GREETINGS_008',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'greetings',
    title: 'Saying Goodbye after School',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'The bell is ringing, Lily! Time to go home.' },
      { speakerId: 'female_child_01', text: 'Goodbye, Tom! Have a nice afternoon.' },
      { speakerId: 'male_child_01', text: 'See you tomorrow at school, Lily!' },
      { speakerId: 'female_child_01', text: 'See you tomorrow! Bye bye!' }
    ],
    languageFunctions: ['farewells', 'expressing polite wishes'],
    learningObjectives: ['goodbye, see you tomorrow'],
    vocabularyIds: ['VOC_L1_U01_GOODBYE'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_GREETINGS_009',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'greetings',
    title: 'Meet My Best Friend Leo',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['child_male_02']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Hi Leo! How old are you?' },
      { speakerId: 'child_male_02', text: 'Hello Lily! I am seven years old. How old are you?' },
      { speakerId: 'female_child_01', text: 'I am seven too! We are in class one B.' },
      { speakerId: 'child_male_02', text: 'Hooray! We are classmates and best friends!' }
    ],
    languageFunctions: ['asking and telling age', 'identifying class'],
    learningObjectives: ['how old are you, numbers six and seven'],
    vocabularyIds: ['VOC_L1_U02_FRIEND'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_GREETINGS_010',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'greetings',
    title: 'Good Afternoon in the Library',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_teacher_01'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'female_teacher_01', text: 'Good afternoon, Tom. Please speak quietly in the library.' },
      { speakerId: 'male_child_01', text: 'Good afternoon, Ms. Sarah. Yes, I will.' },
      { speakerId: 'female_teacher_01', text: 'Here is a colourful picture book for you.' },
      { speakerId: 'male_child_01', text: 'Thank you very much, Ms. Sarah.' }
    ],
    languageFunctions: ['time greeting afternoon', 'polite acknowledgement'],
    learningObjectives: ['good afternoon, library quiet rule'],
    vocabularyIds: ['VOC_L1_U02_BOOK'],
    repetition: 2
  },

  // 3. Family & Home
  {
    id: 'PL_PREA1_FAMILY_011',
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
    id: 'PL_PREA1_FAMILY_012',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'family',
    title: 'Grandpa Tells a Story',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'Grandpa sits in his cosy wooden armchair. Tom and Lily sit on the soft rug. Grandpa opens a big old book with golden stars. He reads a gentle bedtime story. The children listen with bright eyes.' }
    ],
    languageFunctions: ['family roles', 'storytelling routine'],
    learningObjectives: ['grandpa, armchair, rug, bedtime'],
    vocabularyIds: ['VOC_L1_U05_FAMILY'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_FAMILY_013',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'family',
    title: 'Helping Dad in the Kitchen',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['parent_male_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Dad, can I help you set the table?' },
      { speakerId: 'parent_male_01', text: 'Yes, Tom. Please put four spoons and four bowls on the table.' },
      { speakerId: 'male_child_01', text: 'One, two, three, four. Done, Dad!' },
      { speakerId: 'parent_male_01', text: 'Wonderful boy! Dinner is ready soon.' }
    ],
    languageFunctions: ['offering help', 'counting dinner objects'],
    learningObjectives: ['spoons, bowls, table', 'number counting 1 to 4'],
    vocabularyIds: ['VOC_L1_U04_BOWL'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_FAMILY_014',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'home',
    title: 'My Cosy Bedroom',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_02']],
    dialogue: [
      { speakerId: 'narrator_uk_02', text: 'Mia has a bright little bedroom. Her bed has a pink blanket and two soft pillows. A smiling teddy bear sits on the chair. On the white desk, there are colouring pencils and paper. It is a lovely room.' }
    ],
    languageFunctions: ['describing bedroom objects', 'color associations'],
    learningObjectives: ['bed, blanket, pillow, teddy bear'],
    vocabularyIds: ['VOC_L1_U05_BEDROOM'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_FAMILY_015',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'home',
    title: 'Where Is the Teddy Bear?',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Mom, where is my brown teddy bear?' },
      { speakerId: 'female_mother_01', text: 'Is it on the sofa, Lily?' },
      { speakerId: 'female_child_01', text: 'No, it is not on the sofa.' },
      { speakerId: 'female_mother_01', text: 'Look under the small table!' },
      { speakerId: 'female_child_01', text: 'Aha! Here it is. Thank you, Mom!' }
    ],
    languageFunctions: ['asking location', 'prepositions on and under'],
    learningObjectives: ['sofa, table, teddy bear', 'prepositions of place'],
    vocabularyIds: ['VOC_L1_U02_TOY'],
    repetition: 2
  },

  // 4. Food & Drinks
  {
    id: 'PL_PREA1_FOOD_016',
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
    id: 'PL_PREA1_FOOD_017',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'food',
    title: 'Do You Like Ice Cream?',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['child_male_02']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Leo, do you like strawberry ice cream?' },
      { speakerId: 'child_male_02', text: 'Yes, I do! It is cold and delicious. Do you like chocolate?' },
      { speakerId: 'female_child_01', text: 'Yes! Chocolate is my favourite flavour.' },
      { speakerId: 'child_male_02', text: 'Yummy! Let us ask dad for two small cones.' }
    ],
    languageFunctions: ['expressing likes and favourites', 'ice cream flavours'],
    learningObjectives: ['do you like..., yes I do', 'food adjectives cold, delicious'],
    vocabularyIds: ['VOC_L1_U04_ICECREAM'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_FOOD_018',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'food',
    title: 'Drinking Warm Milk',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'Every morning, Tom drinks a white glass of warm milk. It gives him strong bones and good energy. After the milk, he eats a slice of bread with sweet honey. He feels happy and ready for school.' }
    ],
    languageFunctions: ['morning nutrition', 'describing food effects'],
    learningObjectives: ['milk, bread, honey, glass'],
    vocabularyIds: ['VOC_L1_U04_MILK'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_FOOD_019',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'food',
    title: 'A Juicy Sweet Orange',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_female_02'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'child_female_02', text: 'Mom, this orange is round and bright!' },
      { speakerId: 'female_mother_01', text: 'Let me peel the orange peel for you, Mia.' },
      { speakerId: 'child_female_02', text: 'Thank you! It tastes very sweet and juicy.' },
      { speakerId: 'female_mother_01', text: 'Fresh oranges have lots of vitamin C, darling.' }
    ],
    languageFunctions: ['describing fruit tastes', 'sensory words juicy and sweet'],
    learningObjectives: ['orange, round, peel, sweet'],
    vocabularyIds: ['VOC_L1_U04_ORANGE'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_FOOD_020',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'food',
    title: 'Sharing a Sandwich',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Lily, I have two cheese sandwiches in my lunchbox.' },
      { speakerId: 'female_child_01', text: 'They look tasty, Tom.' },
      { speakerId: 'male_child_01', text: 'Here, take one sandwich! Let us share.' },
      { speakerId: 'female_child_01', text: 'Thank you, Tom. You are very kind!' }
    ],
    languageFunctions: ['sharing food politely', 'lunchbox conversation'],
    learningObjectives: ['sandwich, cheese, lunchbox, share'],
    vocabularyIds: ['VOC_L1_U04_SANDWICH'],
    repetition: 2
  },

  // 5. Classroom Objects & School
  {
    id: 'PL_PREA1_CLASSROOM_021',
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
    id: 'PL_PREA1_CLASSROOM_022',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'classroom English',
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
  {
    id: 'PL_PREA1_CLASSROOM_023',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'classroom English',
    title: 'Drawing with Colour Crayons',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_female_02'], SPEAKERS['child_male_02']],
    dialogue: [
      { speakerId: 'child_female_02', text: 'Leo, can I borrow your blue crayon, please?' },
      { speakerId: 'child_male_02', text: 'Here you are, Mia. What are you drawing?' },
      { speakerId: 'child_female_02', text: 'I am drawing the ocean and two small boats.' },
      { speakerId: 'child_male_02', text: 'Your drawing looks beautiful!' },
      { speakerId: 'child_female_02', text: 'Thank you, Leo!' }
    ],
    languageFunctions: ['asking to borrow classroom supplies', 'complimenting art'],
    learningObjectives: ['crayon, blue, borrow, draw'],
    vocabularyIds: ['VOC_L1_U02_CRAYON'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_CLASSROOM_024',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'classroom English',
    title: 'Stand Up and Sit Down',
    contentType: 'classroom conversation',
    speakers: [SPEAKERS['male_teacher_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'male_teacher_01', text: 'Class, please stand up!' },
      { speakerId: 'female_child_01', text: 'We are standing up, Mr. David.' },
      { speakerId: 'male_teacher_01', text: 'Now clap your hands three times! One, two, three.' },
      { speakerId: 'female_child_01', text: 'Clap, clap, clap! That is fun!' },
      { speakerId: 'male_teacher_01', text: 'Excellent. Please sit down quietly.' }
    ],
    languageFunctions: ['total physical response commands', 'counting claps'],
    learningObjectives: ['stand up, sit down, clap hands'],
    vocabularyIds: ['VOC_L1_U01_ACTION'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_CLASSROOM_025',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'classroom English',
    title: 'The Big Green Blackboard',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'In room one, there is a big green board on the wall. Ms. Sarah writes the letter A with white chalk. Tom looks at the board and says letter A loudly. All the children clap their hands with joy.' }
    ],
    languageFunctions: ['alphabet introduction', 'classroom environment'],
    learningObjectives: ['board, chalk, letter, wall'],
    vocabularyIds: ['VOC_L1_U01_ALPHABET'],
    repetition: 2
  },

  // 6. Colors & Toys
  {
    id: 'PL_PREA1_TOYS_026',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'toys',
    title: 'My Fast Red Toy Car',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['child_male_02']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Look at my new toy car, Leo! It is bright red.' },
      { speakerId: 'child_male_02', text: 'Wow, it has four black wheels. Can it go fast?' },
      { speakerId: 'male_child_01', text: 'Yes, watch! Vroom, vroom! Across the floor it goes!' },
      { speakerId: 'child_male_02', text: 'That is super fast! I want to race with my green bus.' }
    ],
    languageFunctions: ['showing new toys', 'describing speed and color'],
    learningObjectives: ['toy car, wheels, red, fast'],
    vocabularyIds: ['VOC_L1_U02_CAR'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_TOYS_027',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'toys',
    title: 'The Pretty Doll in a Pink Dress',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['child_female_02']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Mia, this is my favourite doll. Her name is Rose.' },
      { speakerId: 'child_female_02', text: 'She has curly yellow hair and a lovely pink dress.' },
      { speakerId: 'female_child_01', text: 'She also has shiny little shoes. Do you want to hold her?' },
      { speakerId: 'child_female_02', text: 'Yes, please! She is very sweet.' }
    ],
    languageFunctions: ['introducing dolls', 'describing appearance and clothing'],
    learningObjectives: ['doll, dress, pink, yellow hair'],
    vocabularyIds: ['VOC_L1_U02_DOLL'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_TOYS_028',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'toys',
    title: 'Building a High Wooden Tower',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_02']],
    dialogue: [
      { speakerId: 'narrator_uk_02', text: 'Leo plays with colourful wooden blocks on the rug. One red block, two blue blocks, three yellow blocks. The tower gets higher and higher. Leo smiles proudly. What a tall tower!' }
    ],
    languageFunctions: ['counting blocks', 'describing building progress'],
    learningObjectives: ['blocks, tower, high, tall'],
    vocabularyIds: ['VOC_L1_U02_BLOCKS'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_TOYS_029',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'colors',
    title: 'The Seven Colours of the Rainbow',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Mom, look up in the sky! It is a rainbow!' },
      { speakerId: 'female_mother_01', text: 'How beautiful! Can you see the red, yellow, and blue?' },
      { speakerId: 'female_child_01', text: 'Yes! And green and purple too!' },
      { speakerId: 'female_mother_01', text: 'A rainbow always brings joy after the rain.' }
    ],
    languageFunctions: ['naming colors', 'observing nature phenomenon'],
    learningObjectives: ['rainbow colors red, yellow, blue, green, purple'],
    vocabularyIds: ['VOC_L1_U03_RAINBOW'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_TOYS_030',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'toys',
    title: 'Bouncing a Bright Yellow Ball',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Catch the ball, Lily! Bounce, bounce, bounce!' },
      { speakerId: 'female_child_01', text: 'I caught it, Tom! Here it comes back to you.' },
      { speakerId: 'male_child_01', text: 'Good throw! Let us count our bounces together.' },
      { speakerId: 'female_child_01', text: 'One! Two! Three! Four!' }
    ],
    languageFunctions: ['outdoor ball games', 'counting actions'],
    learningObjectives: ['ball, bounce, catch, throw'],
    vocabularyIds: ['VOC_L1_U01_BALL'],
    repetition: 2
  },

  // 7. Weather & Nature
  {
    id: 'PL_PREA1_WEATHER_031',
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
    id: 'PL_PREA1_WEATHER_032',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'weather',
    title: 'Pitter Patter Raindrops',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Mom, it is raining outside! Look at the window.' },
      { speakerId: 'female_mother_01', text: 'Yes, dear. Put on your yellow raincoat and boots.' },
      { speakerId: 'female_child_01', text: 'Can I carry my colourful umbrella?' },
      { speakerId: 'female_mother_01', text: 'Of course. Now we will stay dry and warm.' }
    ],
    languageFunctions: ['rainy weather clothing', 'rain sound expressions'],
    learningObjectives: ['raincoat, boots, umbrella, rain'],
    vocabularyIds: ['VOC_L1_U03_RAIN'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_WEATHER_033',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'weather',
    title: 'The Cool Autumn Wind',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_02']],
    dialogue: [
      { speakerId: 'narrator_uk_02', text: 'The wind blows gently through the tall trees. Whoosh, whoosh! Yellow and orange leaves dance in the air. Tom picks up a big gold leaf from the path. Autumn is cool and fresh.' }
    ],
    languageFunctions: ['seasonal sensory adjectives', 'autumn leaf movements'],
    learningObjectives: ['wind, leaves, autumn, cool'],
    vocabularyIds: ['VOC_L1_U03_WIND'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_WEATHER_034',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'weather',
    title: 'Fluffy White Clouds',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_female_02'], SPEAKERS['child_male_02']],
    dialogue: [
      { speakerId: 'child_female_02', text: 'Look at that cloud, Leo! What does it look like?' },
      { speakerId: 'child_male_02', text: 'It looks like a big white sheep!' },
      { speakerId: 'child_female_02', text: 'And the one next to it looks like an ice cream cone!' },
      { speakerId: 'child_male_02', text: 'Haha! Watching clouds is so much fun.' }
    ],
    languageFunctions: ['cloud watching imagination', 'similes with like'],
    learningObjectives: ['clouds, sky, sheep, ice cream'],
    vocabularyIds: ['VOC_L1_U03_CLOUD'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_WEATHER_035',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'weather',
    title: 'Cold Winter Snowflake',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'It is very cold outside. Tiny white snowflakes fall from the grey sky. Lily puts on her woollen scarf and red gloves. She touches a snowflake, and it melts gently on her fingertip.' }
    ],
    languageFunctions: ['winter sensations', 'cold weather clothes'],
    learningObjectives: ['snow, snowflake, scarf, gloves, cold'],
    vocabularyIds: ['VOC_L1_U03_SNOW'],
    repetition: 2
  },

  // 8. Body & Clothes
  {
    id: 'PL_PREA1_BODY_036',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'body',
    title: 'Head, Shoulders, Knees and Toes',
    contentType: 'classroom conversation',
    speakers: [SPEAKERS['female_teacher_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'female_teacher_01', text: 'Touch your nose, Lily!' },
      { speakerId: 'female_child_01', text: 'Here is my nose, Ms. Sarah.' },
      { speakerId: 'female_teacher_01', text: 'Now touch your ears and blink your two eyes.' },
      { speakerId: 'female_child_01', text: 'Two ears, two eyes, and one smiling mouth!' },
      { speakerId: 'female_teacher_01', text: 'Wonderful! You know your face very well.' }
    ],
    languageFunctions: ['identifying face and body parts', 'following action prompts'],
    learningObjectives: ['nose, ears, eyes, mouth'],
    vocabularyIds: ['VOC_L1_U02_FACE'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_BODY_037',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'body',
    title: 'Washing Our Little Hands',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_mother_01'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'female_mother_01', text: 'Tom, turn on the tap and use the soap.' },
      { speakerId: 'male_child_01', text: 'Rub, rub, rub with white soap bubbles!' },
      { speakerId: 'female_mother_01', text: 'Count to twenty while washing, my dear.' },
      { speakerId: 'male_child_01', text: 'Ten, eleven... twenty! Now my hands are sparkling clean.' }
    ],
    languageFunctions: ['handwashing routine', 'hygiene vocabulary'],
    learningObjectives: ['soap, bubbles, hands, clean'],
    vocabularyIds: ['VOC_L1_U01_CLEAN'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_CLOTHES_038',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'clothes',
    title: 'My Blue T-shirt and White Cap',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_male_02'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'child_male_02', text: 'Lily, do you like my new sports T-shirt?' },
      { speakerId: 'female_child_01', text: 'Yes, Leo! It is bright blue with a white number seven.' },
      { speakerId: 'child_male_02', text: 'I also have a white baseball cap for the sun.' },
      { speakerId: 'female_child_01', text: 'You look ready to play football!' }
    ],
    languageFunctions: ['describing clothes', 'sports attire'],
    learningObjectives: ['T-shirt, cap, blue, white'],
    vocabularyIds: ['VOC_L1_U05_TSHIRT'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_CLOTHES_039',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'clothes',
    title: 'Tying Shoe Laces',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['parent_male_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Dad, look! I can tie my shoe laces now.' },
      { speakerId: 'parent_male_01', text: 'Show me, Tom. Make a loop and pull it tight.' },
      { speakerId: 'male_child_01', text: 'Loop and pull! Look, a neat bow knot!' },
      { speakerId: 'parent_male_01', text: 'Splendid! You are growing up so fast.' }
    ],
    languageFunctions: ['accomplishing daily task', 'describing steps'],
    learningObjectives: ['shoes, laces, tie, bow'],
    vocabularyIds: ['VOC_L1_U05_SHOES'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_CLOTHES_040',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'clothes',
    title: 'Putting on a Warm Winter Coat',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'Before going out to the park, Mia puts on her thick blue coat. She pulls the zipper up to her chin. Click! Next, she wears two warm mittens. Now she is cosy and ready for outdoor fun.' }
    ],
    languageFunctions: ['dressing up for cold weather', 'sequential actions'],
    learningObjectives: ['coat, zipper, mittens, cosy'],
    vocabularyIds: ['VOC_L1_U05_COAT'],
    repetition: 2
  },

  // 9. Daily Routine & Simple Actions
  {
    id: 'PL_PREA1_ROUTINE_041',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'daily routine',
    title: 'Brushing My Teeth Every Day',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'female_mother_01', text: 'Lily, time to brush your teeth before bed.' },
      { speakerId: 'female_child_01', text: 'I have my little pink toothbrush and mint toothpaste.' },
      { speakerId: 'female_mother_01', text: 'Brush up and down for two whole minutes.' },
      { speakerId: 'female_child_01', text: 'My teeth are shiny white now, Mom!' },
      { speakerId: 'female_mother_01', text: 'Good girl. Sleep tight, sweetheart.' }
    ],
    languageFunctions: ['bedtime hygiene routine', 'parental praise'],
    learningObjectives: ['toothbrush, toothpaste, brush, shine'],
    vocabularyIds: ['VOC_L1_U01_BRUSH'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_ROUTINE_042',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'daily routine',
    title: 'Packing the Schoolbag',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'female_mother_01', text: 'Tom, is your schoolbag packed for tomorrow?' },
      { speakerId: 'male_child_01', text: 'Let me check: English book, maths notebook, and pencil case.' },
      { speakerId: 'female_mother_01', text: 'Do not forget your blue water bottle.' },
      { speakerId: 'male_child_01', text: 'Here it is! All packed and ready.' }
    ],
    languageFunctions: ['checking checklist items', 'evening routine'],
    learningObjectives: ['schoolbag, notebook, pencil case, water bottle'],
    vocabularyIds: ['VOC_L1_U01_BAG'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_ROUTINE_043',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'daily routine',
    title: 'Waking Up with the Rooster',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_02']],
    dialogue: [
      { speakerId: 'narrator_uk_02', text: 'Cock-a-doodle-doo! The rooster crows as the bright golden sun rises. Leo opens his eyes and stretches his arms. He hops out of bed with a big smile. A brand new day has begun!' }
    ],
    languageFunctions: ['morning rising', 'animal sound onomatopoeia'],
    learningObjectives: ['rooster, crow, rise, stretch, awake'],
    vocabularyIds: ['VOC_L1_U01_WAKE'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_ROUTINE_044',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'daily routine',
    title: 'Eating Breakfast Together',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['parent_male_01']],
    dialogue: [
      { speakerId: 'parent_male_01', text: 'Good morning, Lily. Are you hungry?' },
      { speakerId: 'female_child_01', text: 'Good morning, Dad. Yes, my tummy is rumbling.' },
      { speakerId: 'parent_male_01', text: 'We have boiled eggs, warm toast, and fresh milk.' },
      { speakerId: 'female_child_01', text: 'Thank you, Dad. Everything smells delicious.' }
    ],
    languageFunctions: ['expressing hunger politely', 'breakfast items'],
    learningObjectives: ['boiled egg, toast, milk, breakfast'],
    vocabularyIds: ['VOC_L1_U04_EAT'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_ROUTINE_045',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'daily routine',
    title: 'Tidying Up the Toys',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['child_female_02']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Playtime is over, Mia. Let us put the toys into the wooden box.' },
      { speakerId: 'child_female_02', text: 'I will pick up the puzzles and drawing cards.' },
      { speakerId: 'male_child_01', text: 'I will collect the toy cars and train tracks.' },
      { speakerId: 'child_female_02', text: 'Now the living room floor is neat and clean!' }
    ],
    languageFunctions: ['cooperation in tidying', 'cleaning up responsibility'],
    learningObjectives: ['toys, box, pick up, neat, clean'],
    vocabularyIds: ['VOC_L1_U02_CLEANUP'],
    repetition: 2
  },

  // 10. Asking for Things, Courtesy & Locations
  {
    id: 'PL_PREA1_COURTESY_046',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'asking for things',
    title: 'May I Have Some Water, Please?',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['female_teacher_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Excuse me, Ms. Sarah. May I have some water, please?' },
      { speakerId: 'female_teacher_01', text: 'Certainly, Lily. Your water bottle is on the side shelf.' },
      { speakerId: 'female_child_01', text: 'Thank you very much, Ms. Sarah.' },
      { speakerId: 'female_teacher_01', text: 'You are welcome, Lily.' }
    ],
    languageFunctions: ['polite requests with may I', 'courtesy responses'],
    learningObjectives: ['may I have, please, thank you, you are welcome'],
    vocabularyIds: ['VOC_L1_U01_PLEASE'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_COURTESY_047',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'asking where something is',
    title: 'Where Is the Big Yellow Clock?',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['male_teacher_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Mr. David, where is the big clock?' },
      { speakerId: 'male_teacher_01', text: 'Look above the classroom door, Tom.' },
      { speakerId: 'male_child_01', text: 'Ah, I see it! What time is it now?' },
      { speakerId: 'male_teacher_01', text: 'It is ten o’clock. Time for break!' }
    ],
    languageFunctions: ['asking locations with where is', 'telling clock time'],
    learningObjectives: ['clock, door, above, ten o clock'],
    vocabularyIds: ['VOC_L1_U01_TIME'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_COURTESY_048',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'saying thank you',
    title: 'A Birthday Card for Grandma',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_female_02'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'child_female_02', text: 'Mom, I made a birthday card with red flowers for Grandma.' },
      { speakerId: 'female_mother_01', text: 'It is so pretty, Mia! Grandma will be delighted.' },
      { speakerId: 'child_female_02', text: 'I wrote: Happy birthday, Grandma, I love you!' },
      { speakerId: 'female_mother_01', text: 'She will give you a big warm hug.' }
    ],
    languageFunctions: ['birthday greetings', 'expressing love to elders'],
    learningObjectives: ['birthday, card, flowers, hug'],
    vocabularyIds: ['VOC_L1_U05_BIRTHDAY'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_COURTESY_049',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'simple actions',
    title: 'Let Us Dance in the Garden',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Tom, listen to the lively music! Let us dance.' },
      { speakerId: 'male_child_01', text: 'Turn around and jump two times!' },
      { speakerId: 'female_child_01', text: 'Turn around! Jump, jump!' },
      { speakerId: 'male_child_01', text: 'Now freeze and strike a funny pose!' },
      { speakerId: 'female_child_01', text: 'Haha! You look like a silly penguin, Tom!' }
    ],
    languageFunctions: ['dancing instructions', 'physical movement verbs'],
    learningObjectives: ['turn around, jump, freeze, dance'],
    vocabularyIds: ['VOC_L1_U01_DANCE'],
    repetition: 2
  },
  {
    id: 'PL_PREA1_COURTESY_050',
    level: 'Pre-A1',
    ageBand: '6-8',
    topic: 'home',
    title: 'Good Night and Sweet Dreams',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_mother_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'female_mother_01', text: 'It is eight thirty, Lily. Time to turn off the bedside lamp.' },
      { speakerId: 'female_child_01', text: 'Can you tuck me in with my soft blanket, Mom?' },
      { speakerId: 'female_mother_01', text: 'Of course, my little angel. Good night, sleep tight.' },
      { speakerId: 'female_child_01', text: 'Good night, Mom. Sweet dreams!' }
    ],
    languageFunctions: ['bedtime farewells', 'tucking in expressions'],
    learningObjectives: ['good night, sleep tight, sweet dreams, lamp'],
    vocabularyIds: ['VOC_L1_U05_NIGHT'],
    repetition: 2
  }
];

module.exports = { PRE_A1_LESSONS };
