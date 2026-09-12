/**
 * data_a2.js — Thư viện 65 bài nghe chuẩn A2 dành cho lứa tuổi 10-12 (v15.12).
 * Đặc trưng: Mẩu chuyện sinh động, câu ghép tự nhiên, tình huống phong phú, tốc độ đọc 0.88 - 0.92.
 */

const { SPEAKERS } = require('./speakers_pool');

const A2_LESSONS = [
  // 1. Mini Stories & Problem/Solution (1-15)
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
    id: 'PL_A2_MINI_STORY_002',
    level: 'A2',
    ageBand: '10-12',
    topic: 'mini stories',
    title: 'The Secret Attic Treasure',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_02']],
    dialogue: [
      { speakerId: 'narrator_uk_02', text: 'While helping their grandmother organize the dusty attic during summer holiday, Leo and his sister found a carved cedar chest beneath an antique wool quilt. When they turned the brass key, the lid creaked open, revealing vintage postcards, a nautical brass compass, and a leather journal dated nineteen twenty-five. The handwritten entries described thrilling seafaring voyages across the Atlantic. Grandma smiled warmly and shared fascinating tales about their great-grandfather who was a master ship captain.' }
    ],
    languageFunctions: ['historical discovery narrative', 'describing vintage heirlooms'],
    learningObjectives: ['attic, cedar chest, nautical compass, seafaring voyages'],
    vocabularyIds: ['VOC_L6_U06_TREASURE'],
    repetition: 2
  },
  {
    id: 'PL_A2_MINI_STORY_003',
    level: 'A2',
    ageBand: '10-12',
    topic: 'mini stories',
    title: 'Rescuing an Injured Sea Turtle',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'During an early morning stroll on a sandy coastline, Tom and his father noticed a sea turtle entangled in a discarded fishing net near the shoreline. Recognizing the urgency, Father phoned the local marine rescue hotline while Tom shielded the frightened creature from the intensifying sun with wet towels. Two marine biologists arrived with specialized shears, gently liberated the turtle, and confirmed she was healthy. Together, they watched her paddle joyfully back into turquoise ocean waves.' }
    ],
    languageFunctions: ['marine wildlife rescue narrative', 'environmental responsibility'],
    learningObjectives: ['entangled, marine rescue, shears, turquoise waves'],
    vocabularyIds: ['VOC_L6_U11_TURTLE'],
    repetition: 2
  },
  {
    id: 'PL_A2_MINI_STORY_004',
    level: 'A2',
    ageBand: '10-12',
    topic: 'mini stories',
    title: 'A Stormy Night in the Mountain Cabin',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_03']],
    dialogue: [
      { speakerId: 'narrator_uk_03', text: 'Lightning illuminated towering pine trees as a fierce mountain storm swept across the alpine valley. Inside the cosy log cabin, wind rattled the double-glazed window panes, but a roaring stone fireplace cast a comforting amber glow over the pine floor. Lily and her parents brewed herbal tea, played acoustic board games, and shared whimsical folklore until the rain subsided into a quiet midnight drizzle.' }
    ],
    languageFunctions: ['atmospheric storytelling', 'sensory contrast outdoor storm and indoor warmth'],
    learningObjectives: ['illuminated, alpine valley, double-glazed, folklore'],
    vocabularyIds: ['VOC_L6_U12_CABIN'],
    repetition: 2
  },
  {
    id: 'PL_A2_MINI_STORY_005',
    level: 'A2',
    ageBand: '10-12',
    topic: 'mini stories',
    title: 'The Great Bicycle Wheel Mystery',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['child_male_02']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Leo, every time I pumped air into my bicycle tyre this week, it went completely flat within twenty minutes!' },
      { speakerId: 'child_male_02', text: 'Did you submerge the rubber inner tube in a bucket of water to locate the puncture?' },
      { speakerId: 'male_child_01', text: 'Let us try that right now. Look! Tiny air bubbles are escaping near this small seam.' },
      { speakerId: 'child_male_02', text: 'Aha! There is a microscopic thorn embedded in the outer tread. Let us sand the area and apply a rubber patch.' },
      { speakerId: 'male_child_01', text: 'Following logical diagnostic steps makes solving mechanical problems so satisfying.' }
    ],
    languageFunctions: ['troubleshooting mechanical problems', 'sequential repair steps'],
    learningObjectives: ['inner tube, puncture, microscopic thorn, patch'],
    vocabularyIds: ['VOC_L6_U07_REPAIR'],
    repetition: 2
  },
  {
    id: 'PL_A2_MINI_STORY_006',
    level: 'A2',
    ageBand: '10-12',
    topic: 'mini stories',
    title: 'The Young Inventor’s Solar Car',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_female_02'], SPEAKERS['male_teacher_01']],
    dialogue: [
      { speakerId: 'child_female_02', text: 'Mr. David, my solar-powered miniature rover is finally moving across the school courtyard!' },
      { speakerId: 'male_teacher_01', text: 'Brilliant engineering, Mia! How did you connect the photovoltaic panel to the electric motor?' },
      { speakerId: 'child_female_02', text: 'I soldered two copper wires to a miniature gearbox that drives the rear rubber wheels when sunlight strikes the silicon cells.' },
      { speakerId: 'male_teacher_01', text: 'Clean renewable energy in action! You should definitely submit this prototype to the regional science fair.' },
      { speakerId: 'child_female_02', text: 'I am thrilled to demonstrate how sunlight can generate clean mechanical motion.' }
    ],
    languageFunctions: ['explaining scientific mechanisms', 'renewable energy innovation'],
    learningObjectives: ['photovoltaic panel, soldered, gearbox, prototype'],
    vocabularyIds: ['VOC_L6_U10_INVENTOR'],
    repetition: 2
  },
  {
    id: 'PL_A2_MINI_STORY_007',
    level: 'A2',
    ageBand: '10-12',
    topic: 'mini stories',
    title: 'Finding the Ancient Milestone',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'While hiking along an overgrown ridge path in the northern hills, Arthur and his hiking club stumbled upon a moss-covered granite milestone partially hidden by ferns. Scraping away the velvety moss, they deciphered Roman numerals and an ancient Latin inscription indicating distance to a medieval marketplace. Arthur marked the precise GPS coordinates on his handheld device to notify regional archaeologists. History was literally resting beneath their footsteps.' }
    ],
    languageFunctions: ['archaeological discovery narration', 'outdoor exploration'],
    learningObjectives: ['granite milestone, deciphered, inscription, archaeologists'],
    vocabularyIds: ['VOC_L6_U06_ANCIENT'],
    repetition: 2
  },
  {
    id: 'PL_A2_MINI_STORY_008',
    level: 'A2',
    ageBand: '10-12',
    topic: 'mini stories',
    title: 'The Missing Library Book Found',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['female_teacher_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Ms. Sarah, remember the missing hardback encyclopaedia on world architecture?' },
      { speakerId: 'female_teacher_01', text: 'Yes, Lily, we had searched every shelf in the reference section without success.' },
      { speakerId: 'female_child_01', text: 'I discovered it tucked behind the geography atlases on the lower revolving stand!' },
      { speakerId: 'female_teacher_01', text: 'Someone must have misplaced it there accidentally. Thank you for your sharp observant eyes.' },
      { speakerId: 'female_child_01', text: 'Now students working on the ancient wonders project can consult it again.' }
    ],
    languageFunctions: ['reporting recovered items', 'library organization'],
    learningObjectives: ['hardback encyclopaedia, reference section, observant, consult'],
    vocabularyIds: ['VOC_L6_U02_ENCYCLOPEDIA'],
    repetition: 2
  },
  {
    id: 'PL_A2_MINI_STORY_009',
    level: 'A2',
    ageBand: '10-12',
    topic: 'mini stories',
    title: 'The Community Garden Harvest Festival',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_02']],
    dialogue: [
      { speakerId: 'narrator_uk_02', text: 'Autumn transformed the neighbourhood community allotment into a bounty of vibrant produce. Residents of all ages gathered beneath fairy lights to celebrate the annual harvest. Baskets were piled high with heirloom pumpkins, sweet purple figs, and aromatic rosemary. Children bobbed for apples in wooden barrels while elders judged the homemade berry pies. Community gardening had forged bonds of friendship across diverse generations.' }
    ],
    languageFunctions: ['describing community celebrations', 'harvest traditions'],
    learningObjectives: ['community allotment, bounty, heirloom pumpkins, forged bonds'],
    vocabularyIds: ['VOC_L6_U11_HARVEST'],
    repetition: 2
  },
  {
    id: 'PL_A2_MINI_STORY_010',
    level: 'A2',
    ageBand: '10-12',
    topic: 'mini stories',
    title: 'An Unexpected Encounter with a Deer',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_03']],
    dialogue: [
      { speakerId: 'narrator_uk_03', text: 'Early on a misty Saturday dawn, Tom was jogging quietly along a forest trail when he heard twigs snap ahead. Halting in his tracks, he caught sight of a majestic wild deer with magnificent branching antlers standing thirty paces away. The animal turned its velvet eyes towards Tom, pausing gracefully before bounding soundlessly into the dense emerald canopy. Tom stood breathless, awed by the sheer majesty of wild creatures.' }
    ],
    languageFunctions: ['wildlife encounter narrative', 'sensory stillness and awe'],
    learningObjectives: ['majestic deer, branching antlers, paces, emerald canopy'],
    vocabularyIds: ['VOC_L6_U12_WILDLIFE'],
    repetition: 2
  },
  {
    id: 'PL_A2_MINI_STORY_011',
    level: 'A2',
    ageBand: '10-12',
    topic: 'mini stories',
    title: 'Overcoming Stage Fright at the Speech Contest',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['female_teacher_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Ms. Sarah, my knees were trembling before walking onto the auditorium stage.' },
      { speakerId: 'female_teacher_01', text: 'Stage nervousness happens to even seasoned public speakers, Lily. How did you calm your breath?' },
      { speakerId: 'female_child_01', text: 'I remembered your advice: took three deep diaphragm breaths, smiled warmly at the audience, and focused on my message about ocean conservation.' },
      { speakerId: 'female_teacher_01', text: 'Your delivery was persuasive, articulate, and deeply moving. You earned second prize with flying colours!' },
      { speakerId: 'female_child_01', text: 'Facing my fear has given me so much newfound confidence!' }
    ],
    languageFunctions: ['discussing stage fright coping strategies', 'praising public speaking achievement'],
    learningObjectives: ['stage nervousness, diaphragm breaths, persuasive, articulate'],
    vocabularyIds: ['VOC_L6_U01_SPEECH'],
    repetition: 2
  },
  {
    id: 'PL_A2_MINI_STORY_012',
    level: 'A2',
    ageBand: '10-12',
    topic: 'mini stories',
    title: 'The Stray Kitten Behind the Bakery',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'Every afternoon near the bakery alley, an abandoned calico kitten scavenged for scraps under wooden pallets. Mia observed her timid behaviour and brought clean water and nutrient-rich kitten kibble every day. Over two patient weeks, the wary kitten gradually approached, until one sunny morning she purred softly and rubbed against Mia’s sneakers. Mia’s parents agreed to adopt her, naming her Cinnamon.' }
    ],
    languageFunctions: ['pet rescue narrative', 'developing trust through patience'],
    learningObjectives: ['scavenged, pallets, kibble, wary, adopted'],
    vocabularyIds: ['VOC_L6_U03_RESCUE'],
    repetition: 2
  },
  {
    id: 'PL_A2_MINI_STORY_013',
    level: 'A2',
    ageBand: '10-12',
    topic: 'mini stories',
    title: 'The Great Astronomy Campout',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_02']],
    dialogue: [
      { speakerId: 'narrator_uk_02', text: 'Far away from metropolitan light pollution, the sixth-grade science club pitched canvas tents on a high grassy plateau. Through a high-powered reflecting telescope, students gazed in awe at Saturn’s luminous rings and the shimmering spiral arms of the Andromeda galaxy. As midnight arrived, meteor streaks flashed across the obsidian sky, igniting enthusiastic gasps from the young stargazers.' }
    ],
    languageFunctions: ['astronomy camp narrative', 'scientific celestial observations'],
    learningObjectives: ['light pollution, reflecting telescope, Andromeda, meteor streaks'],
    vocabularyIds: ['VOC_L6_U10_ASTRONOMY'],
    repetition: 2
  },
  {
    id: 'PL_A2_MINI_STORY_014',
    level: 'A2',
    ageBand: '10-12',
    topic: 'mini stories',
    title: 'Fixing the Classroom Projector',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['female_teacher_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Ms. Sarah, the overhead projector screen displays a flickering yellow tint instead of clear slides.' },
      { speakerId: 'female_teacher_01', text: 'Could it be a loose connection on the video input cable, Tom?' },
      { speakerId: 'male_child_01', text: 'Let me inspect the display port cable. Ah, one thumb screw had vibrated loose on the adapter.' },
      { speakerId: 'female_teacher_01', text: 'Tighten it gently, please. Look, the high-definition slide presentation has restored perfectly!' },
      { speakerId: 'male_child_01', text: 'Troubleshooting technical glitches is all about careful observation.' }
    ],
    languageFunctions: ['resolving technical classroom glitches', 'cables and adapters'],
    learningObjectives: ['flickering, video cable, thumb screw, adapter, glitches'],
    vocabularyIds: ['VOC_L6_U02_PROJECTOR'],
    repetition: 2
  },
  {
    id: 'PL_A2_MINI_STORY_015',
    level: 'A2',
    ageBand: '10-12',
    topic: 'mini stories',
    title: 'The Pottery Wheel Challenge',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_03']],
    dialogue: [
      { speakerId: 'narrator_uk_03', text: 'Shaping a damp lump of grey clay on a spinning pottery wheel proved harder than Mia anticipated. Twice the clay wobbled off-centre and collapsed into a clumsy spiral. Taking a deep breath, she wet her palms, stabilized her elbows firmly against her knees, and gently pressed her thumbs into the spinning centre. Slowly, a symmetrical curved vase emerged under her guiding hands.' }
    ],
    languageFunctions: ['crafting resilience narrative', 'pottery techniques'],
    learningObjectives: ['pottery wheel, clay wobbled, off-centre, symmetrical vase'],
    vocabularyIds: ['VOC_L6_U05_POTTERY'],
    repetition: 2
  },

  // 2. Food Culture & Culinary Heritage (16-25)
  {
    id: 'PL_A2_FOOD_016',
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
    id: 'PL_A2_FOOD_017',
    level: 'A2',
    ageBand: '10-12',
    topic: 'food',
    title: 'Baking Sourdough Bread from Scratch',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_female_02'], SPEAKERS['parent_male_01']],
    dialogue: [
      { speakerId: 'child_female_02', text: 'Uncle George, how does natural sourdough starter make bread rise without commercial yeast?' },
      { speakerId: 'parent_male_01', text: 'Wild airborne yeast and beneficial lactobacilli ferment together, creating carbon dioxide bubbles that expand the dough, Mia.' },
      { speakerId: 'child_female_02', text: 'The dough feels elastic and alive as we knead it on the marble counter.' },
      { speakerId: 'parent_male_01', text: 'When baked inside a heavy cast-iron Dutch oven, the crust turns blistered, golden, and deeply crispy.' },
      { speakerId: 'child_female_02', text: 'The scientific chemistry of artisanal baking is truly extraordinary!' }
    ],
    languageFunctions: ['explaining sourdough fermentation', 'baking equipment and chemistry'],
    learningObjectives: ['sourdough starter, ferment, knead, Dutch oven, artisanal'],
    vocabularyIds: ['VOC_L6_U05_SOURDOUGH'],
    repetition: 2
  },
  {
    id: 'PL_A2_FOOD_018',
    level: 'A2',
    ageBand: '10-12',
    topic: 'food',
    title: 'Preparing Traditional Green Tea in Japan',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['female_teacher_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Ms. Sarah, I watched an elegant documentary about the Japanese tea ceremony.' },
      { speakerId: 'female_teacher_01', text: 'It is a mindful art form rooted in harmony, respect, purity, and tranquillity.' },
      { speakerId: 'female_child_01', text: 'The master used a carved bamboo whisk to whip vibrant green matcha powder into a fine frothy foam.' },
      { speakerId: 'female_teacher_01', text: 'Every deliberate gesture invites the guest to appreciate the present moment and peaceful company.' },
      { speakerId: 'female_child_01', text: 'It demonstrates that even simple refreshments can be elevated into profound cultural rituals.' }
    ],
    languageFunctions: ['discussing cultural tea traditions', 'mindfulness and ceremony'],
    learningObjectives: ['tea ceremony, bamboo whisk, matcha powder, frothy, tranquillity'],
    vocabularyIds: ['VOC_L6_U05_TEA'],
    repetition: 2
  },
  {
    id: 'PL_A2_FOOD_019',
    level: 'A2',
    ageBand: '10-12',
    topic: 'food',
    title: 'Exploring an Italian Olive Grove',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'Across sun-drenched Tuscan hillsides, silvery olive trees have flourished for centuries. During the late autumn harvest, farmers spread durable mesh nets beneath ancient gnarled trunks to catch hand-raked green and violet olives. Within hours of harvesting, the olives are cold-pressed in granite mills, producing emerald extra virgin oil renowned for its peppery fragrance and heart-healthy nutrients.' }
    ],
    languageFunctions: ['agricultural harvesting processes', 'culinary geography'],
    learningObjectives: ['olive grove, Tuscan, cold-pressed, extra virgin oil, fragrance'],
    vocabularyIds: ['VOC_L6_U05_OLIVE'],
    repetition: 2
  },
  {
    id: 'PL_A2_FOOD_020',
    level: 'A2',
    ageBand: '10-12',
    topic: 'food',
    title: 'The Art of Handmade Fresh Pasta',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Mom, how do we make authentic tagliatelle pasta ribbons from basic semolina flour?' },
      { speakerId: 'female_mother_01', text: 'Form a mound of golden semolina, hollow a crater in the middle, and crack three fresh eggs inside.' },
      { speakerId: 'male_child_01', text: 'Now we incorporate the flour gradually with a fork, correct?' },
      { speakerId: 'female_mother_01', text: 'Yes, then knead vigorously until smooth and roll paper-thin sheets through the manual pasta crank.' },
      { speakerId: 'male_child_01', text: 'Fresh handmade pasta cooks in just two minutes and tastes wonderfully tender!' }
    ],
    languageFunctions: ['culinary step-by-step guidance', 'pasta making techniques'],
    learningObjectives: ['tagliatelle, semolina, knead vigorously, pasta crank'],
    vocabularyIds: ['VOC_L6_U05_PASTA'],
    repetition: 2
  },
  {
    id: 'PL_A2_FOOD_021',
    level: 'A2',
    ageBand: '10-12',
    topic: 'food',
    title: 'Cultivating Tropical Spices',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_male_02'], SPEAKERS['male_teacher_01']],
    dialogue: [
      { speakerId: 'child_male_02', text: 'Mr. David, why were exotic spices like black pepper and nutmeg historically so precious?' },
      { speakerId: 'male_teacher_01', text: 'Centuries ago, spices were rare, difficult to transport across vast oceans, and vital for preserving meats and flavouring banquets.' },
      { speakerId: 'child_male_02', text: 'Did spice maritime routes lead to major voyages of global geographical discovery?' },
      { speakerId: 'male_teacher_01', text: 'Indeed, maritime expeditions seeking cinnamon, cloves, and cardamom reshaped international trade routes and world history.' },
      { speakerId: 'child_male_02', text: 'Now we can find those historic spices right in our kitchen pantry!' }
    ],
    languageFunctions: ['historical context of culinary spices', 'trade route history'],
    learningObjectives: ['spices, nutmeg, maritime routes, cardamom, pantry'],
    vocabularyIds: ['VOC_L6_U05_SPICE'],
    repetition: 2
  },
  {
    id: 'PL_A2_FOOD_022',
    level: 'A2',
    ageBand: '10-12',
    topic: 'food',
    title: 'The Science of Fermented Foods',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['child_female_02']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Mia, did you know that yoghurt, kimchi, and sourdough bread are all fermented foods?' },
      { speakerId: 'child_female_02', text: 'Yes, friendly microscopic organisms like probiotics convert sugars into natural acids.' },
      { speakerId: 'female_child_01', text: 'That process not only creates distinct tangy flavours but also supports healthy digestion and our immune system.' },
      { speakerId: 'child_female_02', text: 'Traditional cultures invented fermentation centuries ago before artificial refrigeration existed.' },
      { speakerId: 'female_child_01', text: 'Ancient food preservation wisdom remains profoundly relevant today.' }
    ],
    languageFunctions: ['discussing nutritional science', 'fermentation biology'],
    learningObjectives: ['fermented, probiotics, tangy, digestion, preservation'],
    vocabularyIds: ['VOC_L6_U05_FERMENT'],
    repetition: 2
  },
  {
    id: 'PL_A2_FOOD_023',
    level: 'A2',
    ageBand: '10-12',
    topic: 'food',
    title: 'Healthy Eating: The Mediterranean Diet',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_02']],
    dialogue: [
      { speakerId: 'narrator_uk_02', text: 'Nutritionists around the world frequently praise the Mediterranean diet as one of the healthiest dietary patterns. It emphasizes plentiful seasonal vegetables, legumes, whole grains, fragrant extra virgin olive oil, and ocean fish rich in omega-three fatty acids. Beyond nutritious ingredients, the Mediterranean lifestyle cherishes lingering meals shared with family and friends, cultivating both physical vitality and emotional contentment.' }
    ],
    languageFunctions: ['evaluating dietary lifestyles', 'health and wellbeing'],
    learningObjectives: ['Mediterranean diet, legumes, omega-three, physical vitality'],
    vocabularyIds: ['VOC_L6_U04_DIET'],
    repetition: 2
  },
  {
    id: 'PL_A2_FOOD_024',
    level: 'A2',
    ageBand: '10-12',
    topic: 'food',
    title: 'Designing a School Vegetarian Menu',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Lily, for our health project, what plant-based dishes should we propose for Meatless Mondays in the cafeteria?' },
      { speakerId: 'female_child_01', text: 'How about a hearty lentil and roasted pumpkin curry served with fragrant jasmine brown rice?' },
      { speakerId: 'male_child_01', text: 'That is rich in plant protein and dietary fibre. We could also offer grilled vegetable panini sandwiches.' },
      { speakerId: 'female_child_01', text: 'And for dessert, chilled chia seed pudding with fresh tropical mango chunks!' },
      { speakerId: 'male_child_01', text: 'Students will realize vegetarian meals can be vibrant, satisfying, and environmentally conscious.' }
    ],
    languageFunctions: ['collaborative menu design', 'nutritional analysis of plant-based foods'],
    learningObjectives: ['plant-based, lentil curry, dietary fibre, chia pudding'],
    vocabularyIds: ['VOC_L6_U04_MENU'],
    repetition: 2
  },
  {
    id: 'PL_A2_FOOD_025',
    level: 'A2',
    ageBand: '10-12',
    topic: 'food',
    title: 'The Journey of Cocoa Beans into Chocolate',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'The transformation of bitter cocoa pods into velvety chocolate is an intricate artisanal craft. Farmers harvest colourful pods from the shaded trunks of cacao trees, fermenting the beans inside banana leaves before sun-drying them on elevated wooden racks. At processing facilities, beans are roasted, shelled into cocoa nibs, ground into smooth cocoa liquor, and patiently conched with cocoa butter and cane sugar to develop decadent confectionery.' }
    ],
    languageFunctions: ['industrial and artisanal manufacturing stages', 'agricultural processing'],
    learningObjectives: ['cacao trees, fermenting, cocoa nibs, conched, decadent'],
    vocabularyIds: ['VOC_L6_U05_COCOA'],
    repetition: 2
  },

  // 3. Environmental Projects & Sustainability (26-38)
  {
    id: 'PL_A2_ENVIRONMENT_026',
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
    id: 'PL_A2_ENVIRONMENT_027',
    level: 'A2',
    ageBand: '10-12',
    topic: 'environment',
    title: 'Installing Solar Panels on the School Roof',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['male_teacher_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Mr. David, look at the solar photovoltaic arrays being installed on our school gymnasium roof!' },
      { speakerId: 'male_teacher_01', text: 'Yes, Tom. Those sixty solar panels will generate over thirty percent of our school’s daily electrical energy.' },
      { speakerId: 'male_child_01', text: 'Will our science classes be able to monitor the real-time energy generation on an interactive digital dashboard?' },
      { speakerId: 'male_teacher_01', text: 'Precisely. We can study how cloud cover, ambient temperature, and sun angles influence electrical output.' },
      { speakerId: 'male_child_01', text: 'Harnessing renewable energy right at our school makes sustainable science so meaningful.' }
    ],
    languageFunctions: ['renewable energy monitoring', 'scientific application of solar technology'],
    learningObjectives: ['photovoltaic arrays, real-time dashboard, ambient temperature, sustainable'],
    vocabularyIds: ['VOC_L6_U11_SOLAR'],
    repetition: 2
  },
  {
    id: 'PL_A2_ENVIRONMENT_028',
    level: 'A2',
    ageBand: '10-12',
    topic: 'environment',
    title: 'Eliminating Single-Use Plastics',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_female_02'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'child_female_02', text: 'Lily, did you hear that our school cafeteria banned disposable plastic straws and styrofoam containers?' },
      { speakerId: 'female_child_01', text: 'I noticed! Everyone is bringing reusable stainless steel water bottles and silicone snack pouches now.' },
      { speakerId: 'child_female_02', text: 'Single-use plastics take over four hundred years to decompose in landfills and often contaminate marine ecosystems.' },
      { speakerId: 'female_child_01', text: 'Replacing disposables with durable alternatives is a straightforward habit that prevents immense pollution.' },
      { speakerId: 'child_female_02', text: 'I am designing informational posters to remind students to refuse unnecessary plastic packaging.' }
    ],
    languageFunctions: ['discussing plastic pollution reduction', 'advocating sustainable consumption'],
    learningObjectives: ['banned, styrofoam, decompose, marine ecosystems, durable'],
    vocabularyIds: ['VOC_L6_U11_PLASTIC'],
    repetition: 2
  },
  {
    id: 'PL_A2_ENVIRONMENT_029',
    level: 'A2',
    ageBand: '10-12',
    topic: 'environment',
    title: 'The Magic of Backyard Composting',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['parent_male_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Dad, how do vegetable kitchen scraps transform into nutrient-dense compost soil?' },
      { speakerId: 'parent_male_01', text: 'In our compost bin, microorganisms and earthworms break down organic matter when balanced with dry leaves and aerated with a pitchfork.' },
      { speakerId: 'male_child_01', text: 'So eggshells, banana peels, and coffee grounds do not belong in landfill rubbish bins?' },
      { speakerId: 'parent_male_01', text: 'Exactly right. Returning organic nutrients to the garden soil nurtures our flowers without chemical fertilizers.' },
      { speakerId: 'male_child_01', text: 'It completes a natural closed-loop ecological cycle in our own backyard.' }
    ],
    languageFunctions: ['explaining biological decomposition', 'closed-loop gardening practices'],
    learningObjectives: ['compost bin, aerated, pitchfork, organic nutrients, closed-loop'],
    vocabularyIds: ['VOC_L6_U11_COMPOST'],
    repetition: 2
  },
  {
    id: 'PL_A2_ENVIRONMENT_030',
    level: 'A2',
    ageBand: '10-12',
    topic: 'environment',
    title: 'Protecting Urban Pollinator Habitats',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'To counter the decline of native insects in sprawling concrete suburbs, the young environmentalist guild planted a wildflower corridor along railway embankments. They selected drought-tolerant native perennials, lavender, and milkweed. Within months, endangered bumblebees, iridescent hoverflies, and monarch butterflies populated the blossoming meadows. Providing urban green sanctuaries proved that nature can re-establish itself alongside bustling cities.' }
    ],
    languageFunctions: ['urban ecology initiatives', 'pollinator biodiversity'],
    learningObjectives: ['pollinator corridor, drought-tolerant, perennials, sanctuaries'],
    vocabularyIds: ['VOC_L6_U11_POLLINATOR'],
    repetition: 2
  },
  {
    id: 'PL_A2_ENVIRONMENT_031',
    level: 'A2',
    ageBand: '10-12',
    topic: 'environment',
    title: 'Conserving Mangrove Forests Along the Coast',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['male_teacher_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Mr. David, why are coastal mangrove wetlands so vital for protecting shoreline communities?' },
      { speakerId: 'male_teacher_01', text: 'Their dense tangled root systems dissipate ferocious storm surges, prevent beach erosion, and trap sediment runoff.' },
      { speakerId: 'female_child_01', text: 'Do they also serve as nurseries for juvenile marine species?' },
      { speakerId: 'male_teacher_01', text: 'Yes, crabs, shrimp, and young fish shelter among the underwater roots from larger predators.' },
      { speakerId: 'female_child_01', text: 'Furthermore, mangroves sequester incredible quantities of carbon dioxide from the atmosphere!' }
    ],
    languageFunctions: ['ecological benefits of wetlands', 'marine conservation'],
    learningObjectives: ['mangrove wetlands, dissipate storm surges, nurseries, sequester carbon'],
    vocabularyIds: ['VOC_L6_U11_MANGROVE'],
    repetition: 2
  },
  {
    id: 'PL_A2_ENVIRONMENT_032',
    level: 'A2',
    ageBand: '10-12',
    topic: 'environment',
    title: 'The Miracle of Clean Wind Energy',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_03']],
    dialogue: [
      { speakerId: 'narrator_uk_03', text: 'Standing atop windswept coastal headlands, towering white wind turbines rotate their massive composite blades with silent grace. Each aerodynamic rotation converts the kinetic momentum of ocean breezes into electrical power transmitted to inland power grids. Without consuming fossil fuels or producing greenhouse emissions, wind farms illuminate entire towns cleanly and indefinitely.' }
    ],
    languageFunctions: ['wind power engineering', 'renewable energy generation'],
    learningObjectives: ['wind turbines, composite blades, kinetic momentum, power grids'],
    vocabularyIds: ['VOC_L6_U11_WINDPOWER'],
    repetition: 2
  },
  {
    id: 'PL_A2_ENVIRONMENT_033',
    level: 'A2',
    ageBand: '10-12',
    topic: 'environment',
    title: 'Rainwater Harvesting at Home',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['parent_male_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Dad, our new rainwater harvesting tank is completely full after last night’s downpour!' },
      { speakerId: 'parent_male_01', text: 'That five-hundred-litre cistern collects runoff from our roof gutters through a stainless mesh filter.' },
      { speakerId: 'male_child_01', text: 'Can we connect the garden hose to water the fruit trees and wash our bicycles?' },
      { speakerId: 'parent_male_01', text: 'Yes, utilizing harvested non-potable water conserves municipal treated tap water substantially.' },
      { speakerId: 'male_child_01', text: 'Every drop of rainwater we capture reduces strain on city reservoirs.' }
    ],
    languageFunctions: ['water conservation technology', 'home engineering'],
    learningObjectives: ['harvesting tank, cistern, gutters, non-potable, reservoirs'],
    vocabularyIds: ['VOC_L6_U11_RAINWATER'],
    repetition: 2
  },
  {
    id: 'PL_A2_ENVIRONMENT_034',
    level: 'A2',
    ageBand: '10-12',
    topic: 'environment',
    title: 'Preserving Coral Reef Biodiversity',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_02']],
    dialogue: [
      { speakerId: 'narrator_uk_02', text: 'Beneath sunlit tropical waters, coral reefs constitute the underwater rainforests of our planet. Although covering less than one percent of the ocean floor, they shelter a quarter of all marine life. Rising ocean temperatures threaten these delicate calcium carbonate structures with coral bleaching. Global conservation initiatives are planting heat-resilient coral fragments to regenerate damaged barrier reefs and protect marine ecosystems.' }
    ],
    languageFunctions: ['marine biodiversity conservation', 'coral bleaching threats'],
    learningObjectives: ['coral reefs, calcium carbonate, bleaching, heat-resilient fragments'],
    vocabularyIds: ['VOC_L6_U11_CORAL'],
    repetition: 2
  },
  {
    id: 'PL_A2_ENVIRONMENT_035',
    level: 'A2',
    ageBand: '10-12',
    topic: 'environment',
    title: 'A Green Commute: Cycling to School',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_male_02'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'child_male_02', text: 'Tom, since our town opened the dedicated bicycle greenway, dozens of students pedal to school daily!' },
      { speakerId: 'male_child_01', text: 'It separates bicycles completely from motor vehicle traffic, making the four-kilometre commute safe and pleasant.' },
      { speakerId: 'child_male_02', text: 'Plus, active cycling in the morning wakes up our brains and provides wonderful cardiovascular exercise.' },
      { speakerId: 'male_child_01', text: 'And fewer passenger cars dropping off children outside school gates means cleaner air for everyone.' },
      { speakerId: 'child_male_02', text: 'Active green commuting benefits health, environment, and community safety simultaneously.' }
    ],
    languageFunctions: ['sustainable urban mobility', 'health benefits of cycling'],
    learningObjectives: ['greenway, commute, cardiovascular, passenger cars, simultaneously'],
    vocabularyIds: ['VOC_L6_U07_COMMUTE'],
    repetition: 2
  },
  {
    id: 'PL_A2_ENVIRONMENT_036',
    level: 'A2',
    ageBand: '10-12',
    topic: 'environment',
    title: 'Upcycling Waste into Creative Art',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['child_female_02']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Mia, look at our eco-art sculpture made entirely out of discarded cardboard and bottle caps!' },
      { speakerId: 'child_female_02', text: 'It looks like an intricate robotic dragon! How did you fasten the wings together?' },
      { speakerId: 'female_child_01', text: 'We used twisted jute twine and water-based biodegradable paste instead of synthetic toxic glues.' },
      { speakerId: 'child_female_02', text: 'Upcycling proves that waste materials can be reimagined into captivating artistic creations.' },
      { speakerId: 'female_child_01', text: 'It inspires everyone to view potential in items they would otherwise discard.' }
    ],
    languageFunctions: ['upcycling creativity', 'sustainable artistic mediums'],
    learningObjectives: ['upcycling, discarded, jute twine, biodegradable, reimagined'],
    vocabularyIds: ['VOC_L6_U05_UPCYCLE'],
    repetition: 2
  },
  {
    id: 'PL_A2_ENVIRONMENT_037',
    level: 'A2',
    ageBand: '10-12',
    topic: 'environment',
    title: 'Protecting Dark Skies from Light Pollution',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['male_teacher_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Mr. David, why is it so difficult to observe the Milky Way from our city backyards?' },
      { speakerId: 'male_teacher_01', text: 'Excessive and unshielded urban artificial illumination scatters across night skies, creating light pollution.' },
      { speakerId: 'male_child_01', text: 'Does light pollution disrupt nocturnal wildlife and migrating birds as well?' },
      { speakerId: 'male_teacher_01', text: 'Indeed, migrating birds navigate by starlight and can become fatally disoriented by bright skyscrapers.' },
      { speakerId: 'male_child_01', text: 'Installing downward-shielded streetlights can restore night skies and protect nocturnal animals.' }
    ],
    languageFunctions: ['astronomical conservation', 'effects of light pollution on wildlife'],
    learningObjectives: ['unshielded illumination, nocturnal, disoriented, downward-shielded'],
    vocabularyIds: ['VOC_L6_U10_DARKSKY'],
    repetition: 2
  },
  {
    id: 'PL_A2_ENVIRONMENT_038',
    level: 'A2',
    ageBand: '10-12',
    topic: 'environment',
    title: 'Reforestation in Deforested Hills',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'Decades after timber logging denuded the highlands, a cooperative regional reforestation project restored native biodiversity. Volunteers and forestry rangers planted thousands of indigenous broadleaf saplings along steep slopes. As trees grew, their intricate root matrices anchored loose topsoil, preventing devastating monsoon mudslides and welcoming back endangered hornbills and gibbons to canopied sanctuaries.' }
    ],
    languageFunctions: ['reforestation environmental narrative', 'restoring ecosystem balance'],
    learningObjectives: ['timber logging, denuded, indigenous saplings, root matrices, mudslides'],
    vocabularyIds: ['VOC_L6_U11_FOREST'],
    repetition: 2
  },

  // 4. Travel, Geography & Cultural Landmarks (39-52)
  {
    id: 'PL_A2_TRAVEL_039',
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
    id: 'PL_A2_HISTORIC_040',
    level: 'A2',
    ageBand: '10-12',
    topic: 'social situations',
    title: 'Visiting the Temple of Literature',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['narrator_uk_04'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'narrator_uk_04', text: 'Welcome to Hanoi, young man. Are you visiting the historic Temple of Literature today?' },
      { speakerId: 'male_child_01', text: 'Yes, sir! Our history teacher assigned us a research task about Vietnam’s first national university.' },
      { speakerId: 'narrator_uk_04', text: 'You will find eighty-two stone turtle stelae erected here, honouring brilliant scholars from centuries ago.' },
      { speakerId: 'male_child_01', text: 'It is so serene here despite being located in the middle of a bustling modern city.' },
      { speakerId: 'narrator_uk_04', text: 'Indeed. It stands as an enduring monument to the value of education, perseverance, and respect for knowledge.' },
      { speakerId: 'male_child_01', text: 'I feel inspired to study harder after seeing how ancient scholars dedicated their lives to learning.' }
    ],
    languageFunctions: ['discussing historical landmarks', 'expressing respect for cultural heritage', 'reflective thinking'],
    learningObjectives: ['historical terms: landmark, scholar, monument, ancient, heritage'],
    vocabularyIds: ['VOC_L6_U06_SCHOLAR', 'VOC_L6_U06_MONUMENT'],
    repetition: 2
  },
  {
    id: 'PL_A2_WEATHER_041',
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
  },
  {
    id: 'PL_A2_TRAVEL_042',
    level: 'A2',
    ageBand: '10-12',
    topic: 'visiting places',
    title: 'Navigating an International Airport',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['parent_male_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Dad, where do we verify our flight boarding gate on the digital departure boards?' },
      { speakerId: 'parent_male_01', text: 'Check our three-digit flight number, Tom. It shows Gate B twenty-four is boarding in forty minutes.' },
      { speakerId: 'male_child_01', text: 'Do we proceed through airport security screening first?' },
      { speakerId: 'parent_male_01', text: 'Yes, place your jacket, carry-on backpack, and boarding pass into the plastic trays.' },
      { speakerId: 'male_child_01', text: 'Navigating large airports is straightforward when you pay attention to directional signage.' }
    ],
    languageFunctions: ['airport procedures', 'reading departure flight monitors'],
    learningObjectives: ['departure boards, boarding gate, security screening, carry-on'],
    vocabularyIds: ['VOC_L6_U12_AIRPORT'],
    repetition: 2
  },
  {
    id: 'PL_A2_TRAVEL_043',
    level: 'A2',
    ageBand: '10-12',
    topic: 'visiting places',
    title: 'Exploring Ha Long Bay on a Wooden Junk',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'Gliding silently across emerald waters, traditional wooden junk boats weave among thousands of limestone karsts rising dramatically from Ha Long Bay. Mia stood on the upper sundeck as morning mist parted to unveil hidden sea caves adorned with stalactites. Local fishermen rowed wooden sampans alongside floating pearl farming villages, showcasing centuries of harmonious maritime life.' }
    ],
    languageFunctions: ['geographical landmark appreciation', 'describing limestone karst formations'],
    learningObjectives: ['wooden junk, limestone karsts, stalactites, sampans'],
    vocabularyIds: ['VOC_L6_U06_HALONG'],
    repetition: 2
  },
  {
    id: 'PL_A2_TRAVEL_044',
    level: 'A2',
    ageBand: '10-12',
    topic: 'visiting places',
    title: 'A Stroll Through the Lantern City of Hoi An',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Mom, as dusk falls, thousands of handmade silk lanterns are illuminating the cobblestone streets of Hoi An!' },
      { speakerId: 'female_mother_01', text: 'Notice the historic architecture blending Vietnamese wooden shophouses with Japanese bridges and French balconies.' },
      { speakerId: 'female_child_01', text: 'Can we release a little candle flower lantern onto the gentle Hoai River?' },
      { speakerId: 'female_mother_01', text: 'Yes, it is a poetic tradition to wish for peace and prosperity for our family.' },
      { speakerId: 'female_child_01', text: 'The golden reflections on the dark river look like a dreamscape.' }
    ],
    languageFunctions: ['cultural heritage exploration', 'sensory evening descriptions'],
    learningObjectives: ['silk lanterns, cobblestone, shophouses, prosperity, reflections'],
    vocabularyIds: ['VOC_L6_U06_HOIAN'],
    repetition: 2
  },
  {
    id: 'PL_A2_TRAVEL_045',
    level: 'A2',
    ageBand: '10-12',
    topic: 'visiting places',
    title: 'Trekking Terraced Rice Fields in Sapa',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_02']],
    dialogue: [
      { speakerId: 'narrator_uk_02', text: 'Carved tier by tier into steep highland mountainsides, Sapa’s emerald terraced rice fields cascade into mist-shrouded valleys. Tom hiked along narrow earthen dikes alongside local guides wearing intricately embroidered indigo jackets. Crystal mountain cascades irrigated each tier through gravity-fed bamboo aqueducts, illustrating extraordinary indigenous agricultural engineering.' }
    ],
    languageFunctions: ['highland geography narration', 'indigenous agricultural wisdom'],
    learningObjectives: ['terraced fields, earthen dikes, indigo, bamboo aqueducts'],
    vocabularyIds: ['VOC_L6_U06_SAPA'],
    repetition: 2
  },
  {
    id: 'PL_A2_TRAVEL_046',
    level: 'A2',
    ageBand: '10-12',
    topic: 'visiting places',
    title: 'Discovering the Grand Canyon',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_male_02'], SPEAKERS['parent_male_01']],
    dialogue: [
      { speakerId: 'child_male_02', text: 'Dad, standing on the rim of the Grand Canyon makes me feel like a tiny speck in the universe!' },
      { speakerId: 'parent_male_01', text: 'Over millions of years, the Colorado River carved through two billion years of exposed geological strata.' },
      { speakerId: 'child_male_02', text: 'Look at the brilliant bands of red sandstone, yellow limestone, and dark shale.' },
      { speakerId: 'parent_male_01', text: 'The natural world writes its timeless history directly onto these colossal canyon walls.' },
      { speakerId: 'child_male_02', text: 'It is a humbling reminder of nature’s immense geological power.' }
    ],
    languageFunctions: ['geological scale appreciation', 'describing natural wonders'],
    learningObjectives: ['canyon rim, geological strata, sandstone, shale, colossal'],
    vocabularyIds: ['VOC_L6_U06_CANYON'],
    repetition: 2
  },
  {
    id: 'PL_A2_TRAVEL_047',
    level: 'A2',
    ageBand: '10-12',
    topic: 'visiting places',
    title: 'Visiting the Maritime Lighthouse',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_03']],
    dialogue: [
      { speakerId: 'narrator_uk_03', text: 'Perched upon a jagged granite headland, the historic white lighthouse has guided seafaring vessels safely through treacherous coastal reefs since eighteen eighty. Lily climbed one hundred and sixty spiralling cast-iron stairs to the glass lantern room. The massive faceted Fresnel lens revolved steadily, sending a brilliant beacon forty kilometres across crashing Atlantic waves.' }
    ],
    languageFunctions: ['maritime heritage narrative', 'lighthouse optics and safety'],
    learningObjectives: ['lighthouse, headland, spiralling stairs, Fresnel lens, beacon'],
    vocabularyIds: ['VOC_L6_U07_LIGHTHOUSE'],
    repetition: 2
  },
  {
    id: 'PL_A2_TRAVEL_048',
    level: 'A2',
    ageBand: '10-12',
    topic: 'visiting places',
    title: 'A Ride in a Hot Air Balloon',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['parent_male_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Dad, as the burner blasts hot air into the colourful nylon envelope, we are gently lifting off the ground!' },
      { speakerId: 'parent_male_01', text: 'Look down, Lily! Roads, patchwork farmland, and meandering rivers resemble an intricate quilt.' },
      { speakerId: 'female_child_01', text: 'There is no engine noise up here, only absolute silence floating with the wind currents.' },
      { speakerId: 'parent_male_01', text: 'Seeing the earth from a bird’s perspective reveals how interconnected everything is.' },
      { speakerId: 'female_child_01', text: 'This peaceful sunrise flight is an unforgettable experience.' }
    ],
    languageFunctions: ['aerial experience descriptions', 'ballooning mechanics'],
    learningObjectives: ['hot air balloon, burner, patchworks, meandering, perspective'],
    vocabularyIds: ['VOC_L6_U12_BALLOON'],
    repetition: 2
  },
  {
    id: 'PL_A2_TRAVEL_049',
    level: 'A2',
    ageBand: '10-12',
    topic: 'visiting places',
    title: 'The Great Wall of China',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['male_teacher_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Mr. David, the Great Wall snakes across rugged ridgelines as far as the eye can see!' },
      { speakerId: 'male_teacher_01', text: 'It spans over twenty-one thousand kilometres, constructed by generations of builders across ancient dynasties.' },
      { speakerId: 'male_child_01', text: 'How did soldiers send warning signals between watchtowers before modern telecommunications?' },
      { speakerId: 'male_teacher_01', text: 'They ignited smoke signals by day and blazing beacons by night to relay emergency alerts across vast distances.' },
      { speakerId: 'male_child_01', text: 'The sheer magnitude of ancient human endurance and architecture is astounding.' }
    ],
    languageFunctions: ['monumental architecture discussion', 'ancient communication systems'],
    learningObjectives: ['Great Wall, ridgelines, watchtowers, smoke signals, beacons'],
    vocabularyIds: ['VOC_L6_U06_GREATWALL'],
    repetition: 2
  },
  {
    id: 'PL_A2_TRAVEL_050',
    level: 'A2',
    ageBand: '10-12',
    topic: 'visiting places',
    title: 'Walking Across the Golden Gate Bridge',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'Suspended above the swirling waters of San Francisco Bay, the colossal international orange towers of the Golden Gate Bridge pierced morning ocean fog. Pedestrians and cyclists traversed the pedestrian walkway, feeling the rhythmic sway of steel suspension cables anchored deep into bedrock. Below, massive container ships glided out toward the Pacific Ocean.' }
    ],
    languageFunctions: ['modern engineering marvels', 'suspension bridge features'],
    learningObjectives: ['suspension bridge, pierced fog, cables, bedrock, container ships'],
    vocabularyIds: ['VOC_L6_U07_BRIDGE'],
    repetition: 2
  },
  {
    id: 'PL_A2_TRAVEL_051',
    level: 'A2',
    ageBand: '10-12',
    topic: 'visiting places',
    title: 'The Enigmatic Pyramids of Giza',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_male_02'], SPEAKERS['narrator_uk_04']],
    dialogue: [
      { speakerId: 'child_male_02', text: 'Sir, how did ancient Egyptian builders align the Great Pyramid so precisely with cardinal true north?' },
      { speakerId: 'narrator_uk_04', text: 'Astronomers used stellar alignments of circum-polar stars to achieve remarkable mathematical accuracy four millennia ago.' },
      { speakerId: 'child_male_02', text: 'And each limestone block weighs an average of over two tonnes!' },
      { speakerId: 'narrator_uk_04', text: 'Ramps, rollers, levers, and organized teamwork enabled them to erect monuments that have endured for thousands of years.' },
      { speakerId: 'child_male_02', text: 'Ancient civilisations possessed profound mathematical and engineering genius.' }
    ],
    languageFunctions: ['inquiring into ancient civilisations', 'astronomical alignment'],
    learningObjectives: ['pyramids, cardinal north, stellar alignments, limestone blocks'],
    vocabularyIds: ['VOC_L6_U06_PYRAMID'],
    repetition: 2
  },
  {
    id: 'PL_A2_TRAVEL_052',
    level: 'A2',
    ageBand: '10-12',
    topic: 'visiting places',
    title: 'The Underground Wonders of Phong Nha Caves',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_02']],
    dialogue: [
      { speakerId: 'narrator_uk_02', text: 'Drifting on a silent electric boat deep into the cavernous depths of Phong Nha Cave, visitors entered a subterranean cathedral of mineral architecture. Massive calcified stalactites hung from soaring ceilings, while crystalline underground rivers carved labyrinthine tunnels through ancient limestone. Illuminated by warm spotlights, the cave revealed millions of years of patient geological artistry.' }
    ],
    languageFunctions: ['subterranean exploration narration', 'geological cave features'],
    learningObjectives: ['cavernous depths, subterranean, calcified, labyrinthine'],
    vocabularyIds: ['VOC_L6_U06_PHONGNHA'],
    repetition: 2
  },

  // 5. Future Plans, Opinions & Community Life (53-65)
  {
    id: 'PL_A2_COMMUNITY_053',
    level: 'A2',
    ageBand: '10-12',
    topic: 'community',
    title: 'Volunteering at the Local Animal Shelter',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['child_female_02']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Mia, what duties did you help with during your volunteer shift at the animal sanctuary?' },
      { speakerId: 'child_female_02', text: 'I filled fresh water bowls, washed bedding blankets, and brushed friendly rescued kittens.' },
      { speakerId: 'female_child_01', text: 'Did any families arrive to adopt pets today?' },
      { speakerId: 'child_female_02', text: 'Yes, an enthusiastic family adopted a three-legged rescue dog named Buster! Seeing him find a loving home was heartwarming.' },
      { speakerId: 'female_child_01', text: 'I would love to join your volunteer team next Saturday.' }
    ],
    languageFunctions: ['discussing volunteer work', 'animal shelter compassion'],
    learningObjectives: ['volunteer shift, animal sanctuary, adopted, heartwarming'],
    vocabularyIds: ['VOC_L6_U03_VOLUNTEER'],
    repetition: 2
  },
  {
    id: 'PL_A2_COMMUNITY_054',
    level: 'A2',
    ageBand: '10-12',
    topic: 'future plans',
    title: 'What Career Would You Choose?',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['female_child_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Lily, have you thought about what career you might pursue when you grow up?' },
      { speakerId: 'female_child_01', text: 'I dream of becoming a marine marine biologist researching coral restoration and protecting ocean biodiversity.' },
      { speakerId: 'male_child_01', text: 'That aligns wonderfully with your passion for scuba diving and environmental science!' },
      { speakerId: 'female_child_01', text: 'What about you, Tom? Are you still interested in aeronautical engineering?' },
      { speakerId: 'male_child_01', text: 'Yes, I want to design solar-powered electric airplanes that produce zero carbon emissions.' }
    ],
    languageFunctions: ['expressing future aspirations and career choices', 'connecting interests to professions'],
    learningObjectives: ['career aspirations, marine biologist, aeronautical engineering, emissions'],
    vocabularyIds: ['VOC_L6_U01_CAREER'],
    repetition: 2
  },
  {
    id: 'PL_A2_COMMUNITY_055',
    level: 'A2',
    ageBand: '10-12',
    topic: 'simple opinions',
    title: 'Paper Books Versus Digital E-Readers',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_female_02'], SPEAKERS['child_male_02']],
    dialogue: [
      { speakerId: 'child_female_02', text: 'Leo, do you prefer reading traditional printed books or using digital tablet e-readers?' },
      { speakerId: 'child_male_02', text: 'I appreciate physical books because of the tactile feel of turning paper pages and the scent of ink.' },
      { speakerId: 'child_female_02', text: 'I understand, but e-readers allow you to store hundreds of novels in a lightweight device and adjust font sizes easily.' },
      { speakerId: 'child_male_02', text: 'True, both mediums have distinct advantages depending on whether you are studying at home or travelling abroad.' },
      { speakerId: 'child_female_02', text: 'The most important thing is developing a lifelong passion for reading.' }
    ],
    languageFunctions: ['comparing technological vs traditional mediums', 'balanced debate and opinions'],
    learningObjectives: ['tactile, e-readers, adjust font, mediums, lifelong passion'],
    vocabularyIds: ['VOC_L6_U02_EREADER'],
    repetition: 2
  },
  {
    id: 'PL_A2_COMMUNITY_056',
    level: 'A2',
    ageBand: '10-12',
    topic: 'community',
    title: 'Organizing a Neighbourhood Book Exchange',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['male_child_01'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'male_child_01', text: 'Mom, our street installed a weatherproof Little Free Library wooden box by the bus stop!' },
      { speakerId: 'female_mother_01', text: 'How does the community book exchange function, Tom?' },
      { speakerId: 'male_child_01', text: 'Anyone can take a book to read for free, and leave another book they have already finished for neighbours to enjoy.' },
      { speakerId: 'female_mother_01', text: 'What a generous initiative to encourage neighbourhood literacy and friendship.' },
      { speakerId: 'male_child_01', text: 'I am donating three exciting mystery novels I read last term.' }
    ],
    languageFunctions: ['community book exchange concept', 'neighbourhood sharing initiatives'],
    learningObjectives: ['weatherproof, book exchange, literacy, donating, mystery'],
    vocabularyIds: ['VOC_L6_U02_LITTLELIBRARY'],
    repetition: 2
  },
  {
    id: 'PL_A2_COMMUNITY_057',
    level: 'A2',
    ageBand: '10-12',
    topic: 'healthy habits',
    title: 'The Importance of Restful Sleep',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['female_teacher_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Ms. Sarah, why do we need eight to ten hours of quality sleep every night?' },
      { speakerId: 'female_teacher_01', text: 'During deep sleep cycles, our brain consolidates memories learned throughout the day and releases essential growth hormones.' },
      { speakerId: 'female_child_01', text: 'Does lack of sleep make it harder to concentrate on complex maths problems?' },
      { speakerId: 'female_teacher_01', text: 'Yes, chronic fatigue weakens attention span, problem-solving abilities, and physical immune defense.' },
      { speakerId: 'female_child_01', text: 'I will make sure to turn off my tablet screens thirty minutes before bedtime.' }
    ],
    languageFunctions: ['understanding sleep biology', 'optimizing cognitive performance'],
    learningObjectives: ['sleep cycles, consolidates, growth hormones, fatigue, immune defense'],
    vocabularyIds: ['VOC_L6_U09_SLEEP'],
    repetition: 2
  },
  {
    id: 'PL_A2_COMMUNITY_058',
    level: 'A2',
    ageBand: '10-12',
    topic: 'simple opinions',
    title: 'Individual Sports Versus Team Sports',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_male_02'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'child_male_02', text: 'Tom, do you gain more personal growth playing team sports like football or individual sports like swimming?' },
      { speakerId: 'male_child_01', text: 'Team sports teach crucial cooperation, verbal communication, and trusting teammates under competitive pressure.' },
      { speakerId: 'child_male_02', text: 'On the other hand, individual sports foster intense self-discipline, mental focus, and personal accountability.' },
      { speakerId: 'male_child_01', text: 'Combining both experiences offers the most well-rounded athletic and character development.' },
      { speakerId: 'child_male_02', text: 'True sportsmanship transcends whether you compete as an individual or part of a squad.' }
    ],
    languageFunctions: ['analyzing sports psychology', 'balanced comparative reasoning'],
    learningObjectives: ['cooperation, self-discipline, accountability, sportsmanship'],
    vocabularyIds: ['VOC_L6_U08_SPORTSMANSHIP'],
    repetition: 2
  },
  {
    id: 'PL_A2_COMMUNITY_059',
    level: 'A2',
    ageBand: '10-12',
    topic: 'community',
    title: 'Emergency Fire Drill at School',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_teacher_01'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'female_teacher_01', text: 'Class, the loud continuous alarm signal indicates a mandatory school emergency fire drill.' },
      { speakerId: 'male_child_01', text: 'Should we leave all backpacks and proceed in a single file line through the designated fire exit?' },
      { speakerId: 'female_teacher_01', text: 'Yes, walk calmly and quickly without running, pushing, or shouting.' },
      { speakerId: 'male_child_01', text: 'Everyone is assembling on the open sports oval under classroom banners.' },
      { speakerId: 'female_teacher_01', text: 'Clear drills ensure everyone remains disciplined and safe during genuine emergencies.' }
    ],
    languageFunctions: ['emergency evacuation protocols', 'calm procedural compliance'],
    learningObjectives: ['mandatory, fire drill, designated exit, sports oval, disciplined'],
    vocabularyIds: ['VOC_L6_U01_FIREDRILL'],
    repetition: 2
  },
  {
    id: 'PL_A2_COMMUNITY_060',
    level: 'A2',
    ageBand: '10-12',
    topic: 'future plans',
    title: 'Designing an Eco-Friendly City of the Future',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_female_02'], SPEAKERS['male_child_01']],
    dialogue: [
      { speakerId: 'child_female_02', text: 'Tom, for our future urban planning model, what innovative architectural ideas should we integrate?' },
      { speakerId: 'male_child_01', text: 'Vertical forest skyscrapers covered in purifying foliage, and subterranean high-speed magnetic transit systems.' },
      { speakerId: 'child_female_02', text: 'We should designate zero-emission pedestrian plazas surrounded by rooftop solar arrays and rain gardens.' },
      { speakerId: 'male_child_01', text: 'Every residential building could generate its own geothermal cooling and compost all organic kitchen waste.' },
      { speakerId: 'child_female_02', text: 'Visualizing sustainable smart cities inspires us to engineer greener real-world solutions today.' }
    ],
    languageFunctions: ['visionary urban design discussion', 'smart eco-cities concepts'],
    learningObjectives: ['urban planning, vertical forest, magnetic transit, geothermal cooling'],
    vocabularyIds: ['VOC_L6_U11_CITYFUTURE'],
    repetition: 2
  },
  {
    id: 'PL_A2_COMMUNITY_061',
    level: 'A2',
    ageBand: '10-12',
    topic: 'simple opinions',
    title: 'Screen Time Balance for Students',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['parent_male_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Dad, how can students strike a healthy balance between educational digital screens and real-world outdoor play?' },
      { speakerId: 'parent_male_01', text: 'Follow the twenty-twenty-twenty guideline: every twenty minutes, look at an object twenty feet away for twenty seconds.' },
      { speakerId: 'female_child_01', text: 'That relaxes eye muscles and prevents digital visual fatigue.' },
      { speakerId: 'parent_male_01', text: 'Furthermore, balance screen sessions with tactile activities like playing musical instruments, gardening, or sports.' },
      { speakerId: 'female_child_01', text: 'Digital technology is a potent tool when mastered with mindful restraint.' }
    ],
    languageFunctions: ['digital wellness strategies', 'eye strain prevention'],
    learningObjectives: ['guideline, visual fatigue, tactile activities, mindful restraint'],
    vocabularyIds: ['VOC_L6_U09_SCREENTIME'],
    repetition: 2
  },
  {
    id: 'PL_A2_COMMUNITY_062',
    level: 'A2',
    ageBand: '10-12',
    topic: 'community',
    title: 'Revitalizing the Historic Town Square',
    contentType: 'mini story',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'Faced with declining foot traffic, the town council pedestrianized the historic central market square, replacing asphalt roadways with weathered granite pavers. Local craftsmen restored vintage iron street lanterns, while artisan florists planted fragrant climbing roses on classical facades. On weekend mornings, acoustic musicians strummed guitars as open-air farmers markets bustled with lively conversation.' }
    ],
    languageFunctions: ['urban renewal narrative', 'pedestrianization and heritage revival'],
    learningObjectives: ['pedestrianized, granite pavers, artisan florists, facades'],
    vocabularyIds: ['VOC_L6_U06_TOWNSQUARE'],
    repetition: 2
  },
  {
    id: 'PL_A2_COMMUNITY_063',
    level: 'A2',
    ageBand: '10-12',
    topic: 'healthy habits',
    title: 'The Nutritional Power of Hydration',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['child_male_02'], SPEAKERS['female_mother_01']],
    dialogue: [
      { speakerId: 'child_male_02', text: 'Mom, why is drinking sufficient fresh water so crucial during sports tournaments?' },
      { speakerId: 'female_mother_01', text: 'Over sixty percent of our human body consists of water. Sweating during athletic exertion depletes fluids and vital electrolytes.' },
      { speakerId: 'child_male_02', text: 'Can mild dehydration cause fatigue and painful muscle cramps?' },
      { speakerId: 'female_mother_01', text: 'Indeed, sipping water regularly maintains peak physical endurance, mental alertness, and temperature regulation.' },
      { speakerId: 'child_male_02', text: 'I will keep my stainless water bottle refilled at every game interval.' }
    ],
    languageFunctions: ['athletic hydration science', 'physiological explanations'],
    learningObjectives: ['sufficient, exertion, electrolytes, dehydration, cramps'],
    vocabularyIds: ['VOC_L6_U09_HYDRATION'],
    repetition: 2
  },
  {
    id: 'PL_A2_COMMUNITY_064',
    level: 'A2',
    ageBand: '10-12',
    topic: 'simple opinions',
    title: 'Why Learning Foreign Languages Matters',
    contentType: 'two-person dialogue',
    speakers: [SPEAKERS['female_child_01'], SPEAKERS['male_teacher_01']],
    dialogue: [
      { speakerId: 'female_child_01', text: 'Mr. David, why does learning a second language expand our intellectual horizons so profoundly?' },
      { speakerId: 'male_teacher_01', text: 'Acquiring a new language restructures cognitive flexibility, sharpens problem-solving, and unlocks deeper empathy for diverse world cultures.' },
      { speakerId: 'female_child_01', text: 'It allows us to converse directly with people across different continents and appreciate international literature in its original voice.' },
      { speakerId: 'male_teacher_01', text: 'Language is fundamentally a bridge uniting human hearts across borders.' },
      { speakerId: 'female_child_01', text: 'Practicing English listening daily feels like embarking on a worldwide cultural journey!' }
    ],
    languageFunctions: ['philosophical appreciation of language learning', 'cognitive and cultural benefits'],
    learningObjectives: ['intellectual horizons, cognitive flexibility, empathy, bridge'],
    vocabularyIds: ['VOC_L6_U01_LANGUAGE'],
    repetition: 2
  },
  {
    id: 'PL_A2_COMMUNITY_065',
    level: 'A2',
    ageBand: '10-12',
    topic: 'community',
    title: 'Reflecting on Personal Growth Across the Year',
    contentType: 'story passage',
    speakers: [SPEAKERS['narrator_uk_01']],
    dialogue: [
      { speakerId: 'narrator_uk_01', text: 'As the final month of the academic year arrived, students reflected upon their individual journeys of growth, perseverance, and discovery. They remembered initial hesitations when facing demanding maths equations, intricate spelling lists, or public speaking presentations. By applying consistent effort, embracing mistakes as valuable learning milestones, and supporting one another with kindness, they had transformed challenges into triumphs. With heads held high and hearts full of enthusiasm, they stood ready to embrace new horizons.' }
    ],
    languageFunctions: ['reflective essay passage', 'celebrating academic and personal resilience'],
    learningObjectives: ['perseverance, initial hesitations, milestones, triumphs, new horizons'],
    vocabularyIds: ['VOC_L6_U01_GROWTH'],
    repetition: 2
  }
];

module.exports = { A2_LESSONS };
