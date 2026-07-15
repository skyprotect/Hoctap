/**
 * English Pro Restructured Course Data & Dynamic Question Generator (v6.8)
 * Bao gồm 100% các bài học chính khóa cho Lớp 1, 4, 6 và các Unit nâng cao (Lớp 2, 5, 7)
 * Độc lập hoàn toàn với dữ liệu môn Toán.
 * Cập nhật phiên bản: 8.4 - Thời gian cập nhật: 11/07/2026 12:45
 */

const EMOJI_FALLBACK = {
    "hello": "👋",
    "goodbye": "👋",
    "name": "📛",
    "what": "❓",
    "you": "👤",
    "book": "📖",
    "pen": "🖊️",
    "ruler": "📏",
    "bag": "🎒",
    "pencil": "✏️",
    "red": "🔴",
    "blue": "🔵",
    "green": "🟢",
    "yellow": "🟡",
    "circle": "⭕",
    "one": "1️⃣",
    "two": "2️⃣",
    "three": "3️⃣",
    "four": "4️⃣",
    "five": "5️⃣",
    "father": "👨",
    "mother": "👩",
    "brother": "👦",
    "sister": "👧",
    "baby": "👶",
    "head": "🙆",
    "face": "👩",
    "hand": "✋",
    "foot": "🦶",
    "hair": "💇",
    "ball": "⚽",
    "doll": "🧸",
    "train": "🚂",
    "car": "🚗",
    "plane": "✈️",
    "dog": "🐶",
    "cat": "🐱",
    "bird": "🐦",
    "duck": "🦆",
    "sun": "☀️",
    "apple": "🍎",
    "banana": "🍌",
    "milk": "🥛",
    "cake": "🍰",
    "water": "💧",
    "run": "🏃",
    "walk": "🚶",
    "jump": "🦘",
    "dance": "💃",
    "sing": "🎤",
    "draw": "🎨",
    "speak": "🗣️",
    "house": "🏠",
    "bedroom": "🛏️",
    "living room": "🛋️",
    "kitchen": "🍳",
    "bathroom": "🚿",
    "bed": "🛏️",
    "table": "table",
    "chair": "🪑",
    "sofa": "🛋️",
    "tv": "📺",
    "shirt": "👕",
    "pants": "👖",
    "dress": "👗",
    "shoes": "👟",
    "hat": "👒",
    "orange": "🍊",
    "grape": "🍇",
    "mango": "🥭",
    "strawberry": "🍓",
    "pear": "🍐",
    "cow": "🐄",
    "horse": "🐎",
    "pig": "🐖",
    "sheep": "🐑",
    "chicken": "🐔",
    "lion": "🦁",
    "tiger": "🐯",
    "elephant": "🐘",
    "monkey": "🐒",
    "zebra": "🦓",
    "sky": "☁️",
    "teacher": "🧑‍🏫",
    "doctor": "🧑‍⚕️",
    "pilot": "🧑‍✈️",
    "cook": "🧑‍🍳",
    "driver": "🧑‍✈️",
    "bus": "🚌",
    "vietnam": "🇻🇳",
    "america": "🇺🇸",
    "england": "🇬🇧",
    "japan": "🇯🇵",
    "malaysia": "🇲🇾",
    "australia": "🇦🇺",
    "vietnamese": "🇻🇳",
    "american": "🇺🇸",
    "english": "🇬🇧",
    "japanese": "🇯🇵",
    "malaysian": "🇲🇾",
    "australian": "🇦🇺",
    "time": "⏰",
    "clock": "🕒",
    "morning": "🌅",
    "afternoon": "☀️",
    "evening": "🌇",
    "monday": "📅",
    "tuesday": "📅",
    "wednesday": "📅",
    "thursday": "📅",
    "friday": "📅",
    "saturday": "📅",
    "sunday": "📅",
    "january": "🗓️",
    "february": "🗓️",
    "march": "🗓️",
    "date": "📅",
    "birthday": "🎂",
    "swim": "🏊",
    "cycle": "🚴",
    "skate": "⛸️",
    "paint": "🎨",
    "chess": "♟️",
    "football": "⚽",
    "maths": "🧮",
    "science": "🔬",
    "art": "🎨",
    "music": "🎵",
    "it": "💻",
    "history": "📚",
    "bakery": "🍞",
    "bookshop": "📚",
    "supermarket": "🛒",
    "pharmacy": "💊",
    "cinema": "🎬",
    "zoo": "🦁",
    "sunny": "☀️",
    "rainy": "🌧️",
    "windy": "💨",
    "cloudy": "☁️",
    "stormy": "⚡",
    "snowy": "❄️",
    "spring": "🌸",
    "summer": "☀️",
    "autumn": "🍂",
    "winter": "❄️",
    "fever": "🤒",
    "headache": "🤕",
    "cough": "😷",
    "sore throat": "🤢",
    "stomach ache": "🤮",
    "hometown": "🏡",
    "village": "🏡",
    "city": "🏙️",
    "island": "🏝️",
    "timetable": "📅",
    "story": "📖",
    "visit": "🎒",
    "dentist": "🧑‍⚕️",
    "medicine": "💊",
    "left": "⬅️",
    "right": "➡️",
    "straight": "⬆️",
    "station": "🚉",
    "astronaut": "🧑‍🚀",
    "calculator": "🧮",
    "compass": "🧭",
    "schoolbag": "🎒",
    "pencil sharpener": "✏️",
    "uniform": "👔",
    "wardrobe": " wardrobe",
    "fridge": " Fridge",
    "cooker": " Cooker",
    "tall": "🧍",
    "short": "🧍",
    "kind": "😇",
    "clever": "💡",
    "friendly": "🤝",
    "creative": "🎨",
    "neighbourhood": "🏡",
    "temple": "⛩️",
    "cathedral": "⛪",
    "suburb": "🏘️",
    "forest": "🌲",
    "mountain": "🏔️",
    "waterfall": "🌊",
    "desert": "🏜️",
    "wish": "✨",
    "fireworks": "🎆",
    "blossom": "🌸",
    "relative": "👨‍👩‍👧‍👦",
    "first footer": "👞",
    "badminton": "🏸",
    "champion": "🏆",
    "stadium": "🏟️",
    "fit": "💪",
    "marathon": "🏃",
    "continent": "🌍",
    "landmark": "🗽",
    "historic": "🏰",
    "modern": "🏙️",
    "peaceful": "🕊️",
    "recycle": "♻️",
    "reuse": "🔄",
    "reduce": "📉",
    "environment": "🌳",
    "plastic": "🍼",
    "hobby": "🎨",
    "gardening": "🪴",
    "coin": "🪙",
    "will": "🔮",
    "calories": "🔥",
    "diet": "🥗",
    "volunteer": "🤝",
    "donate": "🎁",
    "instrument": "🎸",
    "recipe": "📖",
    "monument": "🗿",
    "pedestrian": "🚶",
    "license": "🪪",
    "comedy": "😂",
    "solar": "☀️"
};

const ENGLISH_COURSE_DATA = {
    "1": {
        "levelLabel": "Starters & Lớp 2 Nâng cao",
        "topics": [
            {
                "id": "eng1-t1",
                "title": "Unit 1: In the school playground",
                "subtitle": "Học các từ vựng bắt đầu bằng âm B trong sân trường",
                "vocab": [
                    {
                        "word": "ball",
                        "translation": "quả bóng",
                        "phonetics": "/bɔːl/",
                        "type": "noun",
                        "sentence": "This is my ball.",
                        "sentenceTranslation": "Đây là quả bóng của tớ."
                    },
                    {
                        "word": "bike",
                        "translation": "xe đạp",
                        "phonetics": "/baɪk/",
                        "type": "noun",
                        "sentence": "I ride my bike.",
                        "sentenceTranslation": "Tớ đi xe đạp của tớ."
                    },
                    {
                        "word": "book",
                        "translation": "quyển sách",
                        "phonetics": "/bʊk/",
                        "type": "noun",
                        "sentence": "Open your book, please.",
                        "sentenceTranslation": "Vui lòng mở sách của bạn ra."
                    },
                    {
                        "word": "bill",
                        "translation": "bạn Bill",
                        "phonetics": "/bɪl/",
                        "type": "noun",
                        "sentence": "Hello, I am Bill.",
                        "sentenceTranslation": "Xin chào, tớ là Bill."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What is your name? - My name is Bill.",
                        "vietnamese": "Tên bạn là gì? - Tên tớ là Bill."
                    },
                    {
                        "english": "How do you spell your name? - B-I-L-L.",
                        "vietnamese": "Bạn đánh vần tên như thế nào? - B-I-L-L."
                    }
                ],
                "grammar": "Chào hỏi bằng \"Hello\"/\"Goodbye\", hỏi tên bằng \"What is your name?\" và đánh vần tên.",
                "readingPassageTitle": "My Playground",
                "readingPassage": "Hello! I am Bill. This is my book. I have a new bike and a blue ball. Let's play in the school playground!",
                "questions": {
                    "reading": [
                        {
                            "question": "What is the boy's name?",
                            "options": [
                                "Bill",
                                "Tom",
                                "Nick"
                            ],
                            "answer": "Bill"
                        },
                        {
                            "question": "What color is the ball?",
                            "options": [
                                "Red",
                                "Blue",
                                "Green"
                            ],
                            "answer": "Blue"
                        },
                        {
                            "question": "What does Bill have?",
                            "options": [
                                "A bike and a ball",
                                "A dog",
                                "A cat"
                            ],
                            "answer": "A bike and a ball"
                        }
                    ]
                }
            },
            {
                "id": "eng1-t2",
                "title": "Unit 2: In the dining room",
                "subtitle": "Học từ vựng các vật trong phòng ăn với âm C",
                "vocab": [
                    {
                        "word": "cake",
                        "translation": "bánh ngọt",
                        "phonetics": "/keɪk/",
                        "type": "noun",
                        "sentence": "I eat cake in the dining room.",
                        "sentenceTranslation": "Tớ ăn bánh ngọt trong phòng ăn."
                    },
                    {
                        "word": "car",
                        "translation": "xe ô tô",
                        "phonetics": "/kɑːr/",
                        "type": "noun",
                        "sentence": "This is a small red car.",
                        "sentenceTranslation": "Đây là một chiếc xe ô tô màu đỏ nhỏ."
                    },
                    {
                        "word": "cat",
                        "translation": "con mèo",
                        "phonetics": "/kæt/",
                        "type": "noun",
                        "sentence": "My cat is cute.",
                        "sentenceTranslation": "Chú mèo của tớ thật dễ thương."
                    },
                    {
                        "word": "cup",
                        "translation": "cái chén/tách",
                        "phonetics": "/kʌp/",
                        "type": "noun",
                        "sentence": "The cup is on the table.",
                        "sentenceTranslation": "Cái cốc ở trên bàn."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Is this a car? - Yes, it is.",
                        "vietnamese": "Đây có phải là xe ô tô không? - Đúng vậy."
                    },
                    {
                        "english": "What is this? - It is a cup.",
                        "vietnamese": "Đây là cái gì? - Nó là cái cốc."
                    }
                ],
                "grammar": "Hỏi và trả lời về các đồ vật bằng cấu trúc \"Is this a...?\" và \"What is this?\".",
                "readingPassageTitle": "The Dining Room",
                "readingPassage": "Look at the dining room. There is a small cup. A cute cat is sleeping. I have a sweet cake and a toy car on the table.",
                "questions": {
                    "reading": [
                        {
                            "question": "What is on the table?",
                            "options": [
                                "A cake and a car",
                                "A book",
                                "A pen"
                            ],
                            "answer": "A cake and a car"
                        },
                        {
                            "question": "What is the cat doing?",
                            "options": [
                                "Running",
                                "Sleeping",
                                "Eating"
                            ],
                            "answer": "Sleeping"
                        },
                        {
                            "question": "How is the cup?",
                            "options": [
                                "Big",
                                "Small",
                                "New"
                            ],
                            "answer": "Small"
                        }
                    ]
                }
            },
            {
                "id": "eng1-t3",
                "title": "Unit 3: At the street market",
                "subtitle": "Học từ vựng đi chợ và mua sắm với âm A",
                "vocab": [
                    {
                        "word": "apple",
                        "translation": "quả táo",
                        "phonetics": "/ˈæp.əl/",
                        "type": "noun",
                        "sentence": "Do you have an apple?",
                        "sentenceTranslation": "Bạn có quả táo nào không?"
                    },
                    {
                        "word": "bag",
                        "translation": "cái túi/cặp",
                        "phonetics": "/bæɡ/",
                        "type": "noun",
                        "sentence": "This is my school bag.",
                        "sentenceTranslation": "Đây là cặp sách đi học của tớ."
                    },
                    {
                        "word": "can",
                        "translation": "cái lon",
                        "phonetics": "/kæn/",
                        "type": "noun",
                        "sentence": "I see a can of cola.",
                        "sentenceTranslation": "Tớ nhìn thấy một lon coca."
                    },
                    {
                        "word": "hat",
                        "translation": "cái mũ",
                        "phonetics": "/hæt/",
                        "type": "noun",
                        "sentence": "Put on your hat, please.",
                        "sentenceTranslation": "Vui lòng đội mũ của bạn vào."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Do you have an apple? - Yes, I do.",
                        "vietnamese": "Bạn có quả táo nào không? - Có, tớ có."
                    },
                    {
                        "english": "I have a red bag.",
                        "vietnamese": "Tớ có một chiếc cặp màu đỏ."
                    }
                ],
                "grammar": "Cấu trúc sở hữu \"I have a/an...\" và câu hỏi sở hữu \"Do you have...?\".",
                "readingPassageTitle": "At the Street Market",
                "readingPassage": "We are at the street market. My mother buys an apple. I have a green bag and a yellow hat. We see many cans of soda.",
                "questions": {
                    "reading": [
                        {
                            "question": "Where are they?",
                            "options": [
                                "At the school",
                                "At the street market",
                                "At home"
                            ],
                            "answer": "At the street market"
                        },
                        {
                            "question": "What color is the bag?",
                            "options": [
                                "Red",
                                "Green",
                                "Yellow"
                            ],
                            "answer": "Green"
                        },
                        {
                            "question": "What does the mother buy?",
                            "options": [
                                "An apple",
                                "A hat",
                                "A can"
                            ],
                            "answer": "An apple"
                        }
                    ]
                }
            },
            {
                "id": "eng1-t4",
                "title": "Unit 4: In the bedroom",
                "subtitle": "Học từ vựng các đồ vật trong phòng ngủ với âm D",
                "vocab": [
                    {
                        "word": "desk",
                        "translation": "bàn học",
                        "phonetics": "/desk/",
                        "type": "noun",
                        "sentence": "My dog sits near the desk.",
                        "sentenceTranslation": "Chú chó của tớ ngồi gần bàn học."
                    },
                    {
                        "word": "dog",
                        "translation": "con chó",
                        "phonetics": "/dɒɡ/",
                        "type": "noun",
                        "sentence": "My dog is big.",
                        "sentenceTranslation": "Chú chó của tớ rất to."
                    },
                    {
                        "word": "door",
                        "translation": "cửa ra vào",
                        "phonetics": "/dɔːr/",
                        "type": "noun",
                        "sentence": "Open the door, please.",
                        "sentenceTranslation": "Hãy mở cửa ra."
                    },
                    {
                        "word": "duck",
                        "translation": "con vịt",
                        "phonetics": "/dʌk/",
                        "type": "noun",
                        "sentence": "The yellow duck is swimming.",
                        "sentenceTranslation": "Con vịt vàng đang bơi."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Where is the dog? - It is near the desk.",
                        "vietnamese": "Chú chó ở đâu? - Nó ở gần bàn học."
                    },
                    {
                        "english": "Open the door, please.",
                        "vietnamese": "Vui lòng mở cửa ra."
                    }
                ],
                "grammar": "Hỏi vị trí bằng giới từ \"near\", cấu trúc mệnh lệnh \"Open the...\".",
                "readingPassageTitle": "My Bedroom",
                "readingPassage": "This is my bedroom. I study at my desk. My friendly dog is sleeping near the door. I have a toy duck on the bed.",
                "questions": {
                    "reading": [
                        {
                            "question": "Where is the dog?",
                            "options": [
                                "Under the bed",
                                "Near the door",
                                "On the desk"
                            ],
                            "answer": "Near the door"
                        },
                        {
                            "question": "What is near the door?",
                            "options": [
                                "The dog",
                                "The duck",
                                "The desk"
                            ],
                            "answer": "The dog"
                        },
                        {
                            "question": "What is on the bed?",
                            "options": [
                                "A book",
                                "A toy duck",
                                "A cat"
                            ],
                            "answer": "A toy duck"
                        }
                    ]
                }
            },
            {
                "id": "eng1-t5",
                "title": "Unit 5: At the fish and chip shop",
                "subtitle": "Học từ vựng đồ ăn thức uống với âm I",
                "vocab": [
                    {
                        "word": "chicken",
                        "translation": "thịt gà",
                        "phonetics": "/ˈtʃɪk.ɪn/",
                        "type": "noun",
                        "sentence": "I like chicken and chips.",
                        "sentenceTranslation": "Tớ thích thịt gà và khoai tây chiên."
                    },
                    {
                        "word": "chips",
                        "translation": "khoai tây chiên",
                        "phonetics": "/tʃɪps/",
                        "type": "noun",
                        "sentence": "The chips are hot.",
                        "sentenceTranslation": "Khoai tây chiên đang nóng."
                    },
                    {
                        "word": "fish",
                        "translation": "con cá",
                        "phonetics": "/fɪʃ/",
                        "type": "noun",
                        "sentence": "This is a golden fish.",
                        "sentenceTranslation": "Đây là một con cá vàng."
                    },
                    {
                        "word": "milk",
                        "translation": "sữa",
                        "phonetics": "/mɪlk/",
                        "type": "noun",
                        "sentence": "I drink milk every day.",
                        "sentenceTranslation": "Tớ uống sữa mỗi ngày."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Do you like chicken? - Yes, I do.",
                        "vietnamese": "Bạn có thích thịt gà không? - Có, tớ có."
                    },
                    {
                        "english": "I like fish and chips.",
                        "vietnamese": "Tớ thích cá và khoai tây chiên."
                    }
                ],
                "grammar": "Diễn đạt sở thích bằng động từ \"like\" và câu hỏi \"Do you like...?\".",
                "readingPassageTitle": "At the Shop",
                "readingPassage": "We are at the fish and chip shop. I like chicken and chips. My sister likes fish. We both drink fresh milk.",
                "questions": {
                    "reading": [
                        {
                            "question": "What does the writer like?",
                            "options": [
                                "Chicken and chips",
                                "Fish",
                                "Water"
                            ],
                            "answer": "Chicken and chips"
                        },
                        {
                            "question": "What does the sister like?",
                            "options": [
                                "Chicken",
                                "Fish",
                                "Milk"
                            ],
                            "answer": "Fish"
                        },
                        {
                            "question": "What do they drink?",
                            "options": [
                                "Water",
                                "Milk",
                                "Soda"
                            ],
                            "answer": "Milk"
                        }
                    ]
                }
            },
            {
                "id": "eng1-t6",
                "title": "Unit 6: In the classroom",
                "subtitle": "Học từ vựng đồ dùng học tập trong lớp với âm E",
                "vocab": [
                    {
                        "word": "bell",
                        "translation": "cái chuông",
                        "phonetics": "/bel/",
                        "type": "noun",
                        "sentence": "Listen! The bell is ringing.",
                        "sentenceTranslation": "Nghe kìa! Chuông đang reo."
                    },
                    {
                        "word": "board",
                        "translation": "cái bảng",
                        "phonetics": "/bɔːd/",
                        "type": "noun",
                        "sentence": "Look at the board, please.",
                        "sentenceTranslation": "Hãy nhìn lên bảng."
                    },
                    {
                        "word": "pen",
                        "translation": "cái bút mực",
                        "phonetics": "/pen/",
                        "type": "noun",
                        "sentence": "This is a blue pen.",
                        "sentenceTranslation": "Đây là một chiếc bút mực màu xanh."
                    },
                    {
                        "word": "pencil",
                        "translation": "bút chì",
                        "phonetics": "/ˈpen.səl/",
                        "type": "noun",
                        "sentence": "I draw with a pencil.",
                        "sentenceTranslation": "Tớ vẽ bằng bút chì."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Show me your pen, please.",
                        "vietnamese": "Cho tớ xem bút mực của bạn."
                    },
                    {
                        "english": "Point to the board.",
                        "vietnamese": "Chỉ vào cái bảng."
                    }
                ],
                "grammar": "Câu mệnh lệnh lớp học đơn giản \"Show me...\" và \"Point to...\".",
                "readingPassageTitle": "Our Classroom",
                "readingPassage": "This is my classroom. The board is green. I have a red pen and a long pencil in my bag. We sit down when the bell rings.",
                "questions": {
                    "reading": [
                        {
                            "question": "What color is the board?",
                            "options": [
                                "Black",
                                "Green",
                                "White"
                            ],
                            "answer": "Green"
                        },
                        {
                            "question": "What is in the bag?",
                            "options": [
                                "A pen and a pencil",
                                "A book",
                                "A bell"
                            ],
                            "answer": "A pen and a pencil"
                        },
                        {
                            "question": "When do they sit down?",
                            "options": [
                                "When they eat",
                                "When the bell rings",
                                "When the teacher comes"
                            ],
                            "answer": "When the bell rings"
                        }
                    ]
                }
            },
            {
                "id": "eng1-t7",
                "title": "Unit 7: In the garden",
                "subtitle": "Học từ vựng trong khu vườn nhà với âm G",
                "vocab": [
                    {
                        "word": "garden",
                        "translation": "khu vườn",
                        "phonetics": "/ˈɡɑː.dən/",
                        "type": "noun",
                        "sentence": "We play in the garden.",
                        "sentenceTranslation": "Chúng tớ chơi ở trong vườn."
                    },
                    {
                        "word": "gate",
                        "translation": "cổng vườn",
                        "phonetics": "/ɡeɪt/",
                        "type": "noun",
                        "sentence": "The goat is near the gate.",
                        "sentenceTranslation": "Con dê đang ở gần cổng."
                    },
                    {
                        "word": "girl",
                        "translation": "bạn gái",
                        "phonetics": "/ɡɜːl/",
                        "type": "noun",
                        "sentence": "She is a little girl.",
                        "sentenceTranslation": "Cô bé là một cô gái nhỏ."
                    },
                    {
                        "word": "goat",
                        "translation": "con dê",
                        "phonetics": "/ɡəʊt/",
                        "type": "noun",
                        "sentence": "The goat eats grass.",
                        "sentenceTranslation": "Con dê ăn cỏ."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "This is a beautiful garden.",
                        "vietnamese": "Đây là một khu vườn đẹp."
                    },
                    {
                        "english": "Who is that? - She is a girl.",
                        "vietnamese": "Ai kia? - Cô ấy là một bạn gái."
                    }
                ],
                "grammar": "Giới thiệu bằng \"This is...\" và câu hỏi danh tính \"Who is that?\".",
                "readingPassageTitle": "The Green Garden",
                "readingPassage": "Our house has a big garden. The gate is white. A little girl is playing in the garden. She sees a brown goat eating grass.",
                "questions": {
                    "reading": [
                        {
                            "question": "What is white?",
                            "options": [
                                "The garden",
                                "The gate",
                                "The goat"
                            ],
                            "answer": "The gate"
                        },
                        {
                            "question": "Who is playing?",
                            "options": [
                                "A little girl",
                                "A boy",
                                "A mother"
                            ],
                            "answer": "A little girl"
                        },
                        {
                            "question": "What is the goat doing?",
                            "options": [
                                "Running",
                                "Eating grass",
                                "Sleeping"
                            ],
                            "answer": "Eating grass"
                        }
                    ]
                }
            },
            {
                "id": "eng1-t8",
                "title": "Unit 8: In the park",
                "subtitle": "Học các bộ phận cơ thể và con vật ở công viên với âm H",
                "vocab": [
                    {
                        "word": "hair",
                        "translation": "tóc",
                        "phonetics": "/heər/",
                        "type": "noun",
                        "sentence": "Touch your hair.",
                        "sentenceTranslation": "Hãy chạm vào tóc của bạn."
                    },
                    {
                        "word": "hand",
                        "translation": "bàn tay",
                        "phonetics": "/hænd/",
                        "type": "noun",
                        "sentence": "Show me your hand.",
                        "sentenceTranslation": "Cho tớ xem bàn tay của bạn."
                    },
                    {
                        "word": "head",
                        "translation": "cái đầu",
                        "phonetics": "/hed/",
                        "type": "noun",
                        "sentence": "Point to your head.",
                        "sentenceTranslation": "Chỉ vào đầu của bạn."
                    },
                    {
                        "word": "horse",
                        "translation": "con ngựa",
                        "phonetics": "/hɔːs/",
                        "type": "noun",
                        "sentence": "Look at the brown horse.",
                        "sentenceTranslation": "Nhìn con ngựa màu nâu kìa."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Touch your head.",
                        "vietnamese": "Chạm vào đầu của bạn."
                    },
                    {
                        "english": "Wave your hand.",
                        "vietnamese": "Vẫy bàn tay của bạn."
                    }
                ],
                "grammar": "Mệnh lệnh bộ phận cơ thể \"Touch...\" và \"Wave...\".",
                "readingPassageTitle": "A Day in the Park",
                "readingPassage": "Today we are in the park. I touch my head and wave my hand. We see a beautiful horse. The horse has brown hair.",
                "questions": {
                    "reading": [
                        {
                            "question": "Where are they?",
                            "options": [
                                "At school",
                                "In the park",
                                "At the zoo"
                            ],
                            "answer": "In the park"
                        },
                        {
                            "question": "What does the writer wave?",
                            "options": [
                                "The hand",
                                "The head",
                                "The book"
                            ],
                            "answer": "The hand"
                        },
                        {
                            "question": "What color is the horse's hair?",
                            "options": [
                                "Black",
                                "White",
                                "Brown"
                            ],
                            "answer": "Brown"
                        }
                    ]
                }
            },
            {
                "id": "eng1-t9",
                "title": "Unit 9: In the shop",
                "subtitle": "Học từ vựng các đồ dùng ở cửa hàng với âm O",
                "vocab": [
                    {
                        "word": "clock",
                        "translation": "đồng hồ",
                        "phonetics": "/klɒk/",
                        "type": "noun",
                        "sentence": "There is a clock on the wall.",
                        "sentenceTranslation": "Có một chiếc đồng hồ ở trên tường."
                    },
                    {
                        "word": "lock",
                        "translation": "ổ khóa",
                        "phonetics": "/lɒk/",
                        "type": "noun",
                        "sentence": "The lock is strong.",
                        "sentenceTranslation": "Chiếc ổ khóa rất chắc chắn."
                    },
                    {
                        "word": "mop",
                        "translation": "chổi lau nhà",
                        "phonetics": "/mɒp/",
                        "type": "noun",
                        "sentence": "My mother buys a mop.",
                        "sentenceTranslation": "Mẹ của tớ mua một cây lau nhà."
                    },
                    {
                        "word": "pot",
                        "translation": "cái nồi",
                        "phonetics": "/pɒt/",
                        "type": "noun",
                        "sentence": "The pot is hot.",
                        "sentenceTranslation": "Cái nồi đang nóng."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "There is a clock in the shop.",
                        "vietnamese": "Có một chiếc đồng hồ ở trong cửa hàng."
                    },
                    {
                        "english": "I need a new mop.",
                        "vietnamese": "Tớ cần một cây lau nhà mới."
                    }
                ],
                "grammar": "Cấu trúc miêu tả sự vật \"There is...\" và động từ cần thiết \"need\".",
                "readingPassageTitle": "At the Shop",
                "readingPassage": "We are in the shop. My mother wants to buy a new mop and a red pot. I see a big clock on the wall and a lock on the door.",
                "questions": {
                    "reading": [
                        {
                            "question": "What does the mother want to buy?",
                            "options": [
                                "A mop and a pot",
                                "A clock",
                                "A lock"
                            ],
                            "answer": "A mop and a pot"
                        },
                        {
                            "question": "Where is the clock?",
                            "options": [
                                "On the table",
                                "On the wall",
                                "On the door"
                            ],
                            "answer": "On the wall"
                        },
                        {
                            "question": "What is on the door?",
                            "options": [
                                "A clock",
                                "A lock",
                                "A pot"
                            ],
                            "answer": "A lock"
                        }
                    ]
                }
            },
            {
                "id": "eng1-t10",
                "title": "Unit 10: At the zoo",
                "subtitle": "Học từ vựng động vật ở sở thú với âm M",
                "vocab": [
                    {
                        "word": "monkey",
                        "translation": "con khỉ",
                        "phonetics": "/ˈmʌŋ.ki/",
                        "type": "noun",
                        "sentence": "The monkey climbs the tree.",
                        "sentenceTranslation": "Con khỉ trèo cây."
                    },
                    {
                        "word": "mother",
                        "translation": "mẹ",
                        "phonetics": "/ˈmʌð.ər/",
                        "type": "noun",
                        "sentence": "I love my mother.",
                        "sentenceTranslation": "Tớ yêu mẹ của tớ."
                    },
                    {
                        "word": "mouse",
                        "translation": "con chuột",
                        "phonetics": "/maʊs/",
                        "type": "noun",
                        "sentence": "The mouse is very small.",
                        "sentenceTranslation": "Con chuột rất nhỏ."
                    },
                    {
                        "word": "zoo",
                        "translation": "sở thú",
                        "phonetics": "/zuː/",
                        "type": "noun",
                        "sentence": "Let's go to the zoo.",
                        "sentenceTranslation": "Chúng mình cùng đi sở thú nhé."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "I see a monkey next to the tree.",
                        "vietnamese": "Tớ thấy con khỉ ở cạnh cái cây."
                    },
                    {
                        "english": "This is my mother.",
                        "vietnamese": "Đây là mẹ của tớ."
                    }
                ],
                "grammar": "Mô tả vị trí bằng \"next to\" và giới thiệu người thân.",
                "readingPassageTitle": "Zoo Animals",
                "readingPassage": "My mother takes me to the zoo. We see many animals. Look at that funny monkey! It is next to a tree. Oh, there is a tiny mouse too.",
                "questions": {
                    "reading": [
                        {
                            "question": "Who takes the writer to the zoo?",
                            "options": [
                                "The father",
                                "The mother",
                                "The teacher"
                            ],
                            "answer": "The mother"
                        },
                        {
                            "question": "What is the monkey doing?",
                            "options": [
                                "Sleeping",
                                "Climbing next to a tree",
                                "Running"
                            ],
                            "answer": "Climbing next to a tree"
                        },
                        {
                            "question": "How is the mouse?",
                            "options": [
                                "Big",
                                "Tiny",
                                "Fat"
                            ],
                            "answer": "Tiny"
                        }
                    ]
                }
            },
            {
                "id": "eng1-t11",
                "title": "Unit 11: At the bus stop",
                "subtitle": "Học từ vựng phương tiện ở trạm xe buýt với âm U",
                "vocab": [
                    {
                        "word": "boy",
                        "translation": "bạn trai",
                        "phonetics": "/bɔɪ/",
                        "type": "noun",
                        "sentence": "The boy is running.",
                        "sentenceTranslation": "Cậu bé đang chạy."
                    },
                    {
                        "word": "bus",
                        "translation": "xe buýt",
                        "phonetics": "/bʌs/",
                        "type": "noun",
                        "sentence": "The bus is big and yellow.",
                        "sentenceTranslation": "Xe buýt to và có màu vàng."
                    },
                    {
                        "word": "run",
                        "translation": "chạy",
                        "phonetics": "/rʌn/",
                        "type": "verb",
                        "sentence": "Don't run, walk please.",
                        "sentenceTranslation": "Đừng chạy, vui lòng đi bộ."
                    },
                    {
                        "word": "sun",
                        "translation": "ông mặt trời",
                        "phonetics": "/sʌn/",
                        "type": "noun",
                        "sentence": "The sun is hot today.",
                        "sentenceTranslation": "Hôm nay ông mặt trời rất nóng."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Look at the boy.",
                        "vietnamese": "Hãy nhìn con/cái bạn trai."
                    },
                    {
                        "english": "I have a bus.",
                        "vietnamese": "Tớ có một cái xe buýt."
                    }
                ],
                "grammar": "Học từ vựng về các sự vật trong bài học và sử dụng cấu trúc giao tiếp cơ bản.",
                "readingPassageTitle": "Unit 11 Story",
                "readingPassage": "Today we learn many things about bạn trai. We have a boy and a bus. It is fun and happy!",
                "questions": {
                    "reading": [
                        {
                            "question": "What is the first word?",
                            "options": [
                                "Boy",
                                "Apple",
                                "Pen"
                            ],
                            "answer": "Boy"
                        },
                        {
                            "question": "Is it fun?",
                            "options": [
                                "Yes, it is",
                                "No, it isn't",
                                "Not mentioned"
                            ],
                            "answer": "Yes, it is"
                        },
                        {
                            "question": "What do we have?",
                            "options": [
                                "A boy and a bus",
                                "A dog",
                                "A cat"
                            ],
                            "answer": "A boy and a bus"
                        }
                    ]
                }
            },
            {
                "id": "eng1-t12",
                "title": "Unit 12: At the lake",
                "subtitle": "Học từ vựng phong cảnh hồ nước với âm L",
                "vocab": [
                    {
                        "word": "lake",
                        "translation": "hồ nước",
                        "phonetics": "/leɪk/",
                        "type": "noun",
                        "sentence": "We sit near the lake.",
                        "sentenceTranslation": "Chúng tớ ngồi gần hồ nước."
                    },
                    {
                        "word": "leaf",
                        "translation": "chiếc lá",
                        "phonetics": "/liːf/",
                        "type": "noun",
                        "sentence": "Look at the green leaf.",
                        "sentenceTranslation": "Nhìn chiếc lá màu xanh kìa."
                    },
                    {
                        "word": "lemon",
                        "translation": "quả chanh vàng",
                        "phonetics": "/ˈlem.ən/",
                        "type": "noun",
                        "sentence": "The lemon is sour.",
                        "sentenceTranslation": "Quả chanh này chua."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Look at the lake.",
                        "vietnamese": "Hãy nhìn con/cái hồ nước."
                    },
                    {
                        "english": "I have a leaf.",
                        "vietnamese": "Tớ có một cái chiếc lá."
                    }
                ],
                "grammar": "Học từ vựng về các sự vật trong bài học và sử dụng cấu trúc giao tiếp cơ bản.",
                "readingPassageTitle": "Unit 12 Story",
                "readingPassage": "Today we learn many things about hồ nước. We have a lake and a leaf. It is fun and happy!",
                "questions": {
                    "reading": [
                        {
                            "question": "What is the first word?",
                            "options": [
                                "Lake",
                                "Apple",
                                "Pen"
                            ],
                            "answer": "Lake"
                        },
                        {
                            "question": "Is it fun?",
                            "options": [
                                "Yes, it is",
                                "No, it isn't",
                                "Not mentioned"
                            ],
                            "answer": "Yes, it is"
                        },
                        {
                            "question": "What do we have?",
                            "options": [
                                "A lake and a leaf",
                                "A dog",
                                "A cat"
                            ],
                            "answer": "A lake and a leaf"
                        }
                    ]
                }
            },
            {
                "id": "eng1-t13",
                "title": "Unit 13: In the school canteen",
                "subtitle": "Học từ vựng món ăn ở căng tin với âm N",
                "vocab": [
                    {
                        "word": "banana",
                        "translation": "quả chuối",
                        "phonetics": "/bəˈnɑː.nə/",
                        "type": "noun",
                        "sentence": "I want to eat a banana.",
                        "sentenceTranslation": "Tớ muốn ăn một quả chuối."
                    },
                    {
                        "word": "canteen",
                        "translation": "nhà ăn/căng tin",
                        "phonetics": "/kænˈtiːn/",
                        "type": "noun",
                        "sentence": "Our school has a canteen.",
                        "sentenceTranslation": "Trường chúng tớ có một căng tin."
                    },
                    {
                        "word": "noodles",
                        "translation": "mì sợi",
                        "phonetics": "/ˈnuː.dəlz/",
                        "type": "noun",
                        "sentence": "I have noodles for lunch.",
                        "sentenceTranslation": "Tớ ăn mì sợi cho bữa trưa."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Look at the banana.",
                        "vietnamese": "Hãy nhìn con/cái quả chuối."
                    },
                    {
                        "english": "I have a canteen.",
                        "vietnamese": "Tớ có một cái nhà ăn/căng tin."
                    }
                ],
                "grammar": "Học từ vựng về các sự vật trong bài học và sử dụng cấu trúc giao tiếp cơ bản.",
                "readingPassageTitle": "Unit 13 Story",
                "readingPassage": "Today we learn many things about quả chuối. We have a banana and a canteen. It is fun and happy!",
                "questions": {
                    "reading": [
                        {
                            "question": "What is the first word?",
                            "options": [
                                "Banana",
                                "Apple",
                                "Pen"
                            ],
                            "answer": "Banana"
                        },
                        {
                            "question": "Is it fun?",
                            "options": [
                                "Yes, it is",
                                "No, it isn't",
                                "Not mentioned"
                            ],
                            "answer": "Yes, it is"
                        },
                        {
                            "question": "What do we have?",
                            "options": [
                                "A banana and a canteen",
                                "A dog",
                                "A cat"
                            ],
                            "answer": "A banana and a canteen"
                        }
                    ]
                }
            },
            {
                "id": "eng1-t14",
                "title": "Unit 14: In the toy shop",
                "subtitle": "Học từ vựng đồ chơi ở cửa hàng với âm T",
                "vocab": [
                    {
                        "word": "teddy bear",
                        "translation": "gấu bông",
                        "phonetics": "/ˈted.i ˌbeər/",
                        "type": "noun",
                        "sentence": "I have a cute teddy bear.",
                        "sentenceTranslation": "Tớ có một chú gấu bông dễ thương."
                    },
                    {
                        "word": "tiger",
                        "translation": "con hổ",
                        "phonetics": "/ˈtaɪ.ɡər/",
                        "type": "noun",
                        "sentence": "The tiger is scary.",
                        "sentenceTranslation": "Con hổ thật đáng sợ."
                    },
                    {
                        "word": "top",
                        "translation": "con quay/cù",
                        "phonetics": "/tɒp/",
                        "type": "noun",
                        "sentence": "This is my red top.",
                        "sentenceTranslation": "Đây là con quay màu đỏ của tớ."
                    },
                    {
                        "word": "turtle",
                        "translation": "con rùa",
                        "phonetics": "/ˈtɜː.təl/",
                        "type": "noun",
                        "sentence": "The turtle moves slowly.",
                        "sentenceTranslation": "Con rùa di chuyển chậm chạp."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Look at the teddy bear.",
                        "vietnamese": "Hãy nhìn con/cái gấu bông."
                    },
                    {
                        "english": "I have a tiger.",
                        "vietnamese": "Tớ có một cái con hổ."
                    }
                ],
                "grammar": "Học từ vựng về các sự vật trong bài học và sử dụng cấu trúc giao tiếp cơ bản.",
                "readingPassageTitle": "Unit 14 Story",
                "readingPassage": "Today we learn many things about gấu bông. We have a teddy bear and a tiger. It is fun and happy!",
                "questions": {
                    "reading": [
                        {
                            "question": "What is the first word?",
                            "options": [
                                "Teddy bear",
                                "Apple",
                                "Pen"
                            ],
                            "answer": "Teddy bear"
                        },
                        {
                            "question": "Is it fun?",
                            "options": [
                                "Yes, it is",
                                "No, it isn't",
                                "Not mentioned"
                            ],
                            "answer": "Yes, it is"
                        },
                        {
                            "question": "What do we have?",
                            "options": [
                                "A teddy bear and a tiger",
                                "A dog",
                                "A cat"
                            ],
                            "answer": "A teddy bear and a tiger"
                        }
                    ]
                }
            },
            {
                "id": "eng1-t15",
                "title": "Unit 15: At the football match",
                "subtitle": "Học từ vựng trận đấu bóng đá với âm F",
                "vocab": [
                    {
                        "word": "face",
                        "translation": "khuôn mặt",
                        "phonetics": "/feɪs/",
                        "type": "noun",
                        "sentence": "Wash your face, please.",
                        "sentenceTranslation": "Vui lòng rửa mặt của bạn."
                    },
                    {
                        "word": "father",
                        "translation": "bố",
                        "phonetics": "/ˈfɑː.ðər/",
                        "type": "noun",
                        "sentence": "My father is a doctor.",
                        "sentenceTranslation": "Bố của tớ là bác sĩ."
                    },
                    {
                        "word": "foot",
                        "translation": "bàn chân",
                        "phonetics": "/fʊt/",
                        "type": "noun",
                        "sentence": "Kick the ball with your foot.",
                        "sentenceTranslation": "Sút bóng bằng bàn chân của bạn."
                    },
                    {
                        "word": "football",
                        "translation": "môn bóng đá",
                        "phonetics": "/ˈfʊt.bɔːl/",
                        "type": "noun",
                        "sentence": "We play football at home.",
                        "sentenceTranslation": "Chúng tớ chơi bóng đá ở nhà."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Look at the face.",
                        "vietnamese": "Hãy nhìn con/cái khuôn mặt."
                    },
                    {
                        "english": "I have a father.",
                        "vietnamese": "Tớ có một cái bố."
                    }
                ],
                "grammar": "Học từ vựng về các sự vật trong bài học và sử dụng cấu trúc giao tiếp cơ bản.",
                "readingPassageTitle": "Unit 15 Story",
                "readingPassage": "Today we learn many things about khuôn mặt. We have a face and a father. It is fun and happy!",
                "questions": {
                    "reading": [
                        {
                            "question": "What is the first word?",
                            "options": [
                                "Face",
                                "Apple",
                                "Pen"
                            ],
                            "answer": "Face"
                        },
                        {
                            "question": "Is it fun?",
                            "options": [
                                "Yes, it is",
                                "No, it isn't",
                                "Not mentioned"
                            ],
                            "answer": "Yes, it is"
                        },
                        {
                            "question": "What do we have?",
                            "options": [
                                "A face and a father",
                                "A dog",
                                "A cat"
                            ],
                            "answer": "A face and a father"
                        }
                    ]
                }
            },
            {
                "id": "eng1-t16",
                "title": "Unit 16: At home",
                "subtitle": "Học từ vựng hoạt động thường ngày ở nhà với âm W",
                "vocab": [
                    {
                        "word": "home",
                        "translation": "nhà ở",
                        "phonetics": "/həʊm/",
                        "type": "noun",
                        "sentence": "I am at home now.",
                        "sentenceTranslation": "Bây giờ tớ đang ở nhà."
                    },
                    {
                        "word": "wash",
                        "translation": "rửa",
                        "phonetics": "/wɒʃ/",
                        "type": "verb",
                        "sentence": "Wash your hands before eating.",
                        "sentenceTranslation": "Rửa tay trước khi ăn."
                    },
                    {
                        "word": "window",
                        "translation": "cửa sổ",
                        "phonetics": "/ˈwɪn.dəʊ/",
                        "type": "noun",
                        "sentence": "Close the window, please.",
                        "sentenceTranslation": "Vui lòng đóng cửa sổ lại."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Look at the home.",
                        "vietnamese": "Hãy nhìn con/cái nhà ở."
                    },
                    {
                        "english": "I have a wash.",
                        "vietnamese": "Tớ có một cái rửa."
                    }
                ],
                "grammar": "Học từ vựng về các sự vật trong bài học và sử dụng cấu trúc giao tiếp cơ bản.",
                "readingPassageTitle": "Unit 16 Story",
                "readingPassage": "Today we learn many things about nhà ở. We have a home and a wash. It is fun and happy!",
                "questions": {
                    "reading": [
                        {
                            "question": "What is the first word?",
                            "options": [
                                "Home",
                                "Apple",
                                "Pen"
                            ],
                            "answer": "Home"
                        },
                        {
                            "question": "Is it fun?",
                            "options": [
                                "Yes, it is",
                                "No, it isn't",
                                "Not mentioned"
                            ],
                            "answer": "Yes, it is"
                        },
                        {
                            "question": "What do we have?",
                            "options": [
                                "A home and a wash",
                                "A dog",
                                "A cat"
                            ],
                            "answer": "A home and a wash"
                        }
                    ]
                }
            },
            {
                "id": "eng1-t17",
                "title": "Unit 17: Wild Animals (NÂNG CAO LỚP 2)",
                "subtitle": "Con vật hoang dã tự nhiên",
                "vocab": [
                    {
                        "word": "lion",
                        "translation": "sư tử",
                        "phonetics": "/ˈlaɪ.ən/",
                        "type": "noun",
                        "sentence": "The lion is the king.",
                        "sentenceTranslation": "Sư tử là chúa tể."
                    },
                    {
                        "word": "elephant",
                        "translation": "con voi",
                        "phonetics": "/ˈel.ɪ.fənt/",
                        "type": "noun",
                        "sentence": "The elephant has a trunk.",
                        "sentenceTranslation": "Con voi có một cái vòi."
                    },
                    {
                        "word": "zebra",
                        "translation": "ngựa vằn",
                        "phonetics": "/ˈzeb.rə/",
                        "type": "noun",
                        "sentence": "The zebra has stripes.",
                        "sentenceTranslation": "Ngựa vằn có các sọc."
                    },
                    {
                        "word": "crocodile",
                        "translation": "cá sấu",
                        "phonetics": "/ˈkrɒk.ə.daɪl/",
                        "type": "noun",
                        "sentence": "The crocodile has big teeth.",
                        "sentenceTranslation": "Cá sấu có hàm răng to."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Look at the lion.",
                        "vietnamese": "Hãy nhìn con/cái sư tử."
                    },
                    {
                        "english": "I have a elephant.",
                        "vietnamese": "Tớ có một cái con voi."
                    }
                ],
                "grammar": "Học từ vựng về các sự vật trong bài học và sử dụng cấu trúc giao tiếp cơ bản.",
                "readingPassageTitle": "Unit 17 Story",
                "readingPassage": "Today we learn many things about sư tử. We have a lion and a elephant. It is fun and happy!",
                "questions": {
                    "reading": [
                        {
                            "question": "What is the first word?",
                            "options": [
                                "Lion",
                                "Apple",
                                "Pen"
                            ],
                            "answer": "Lion"
                        },
                        {
                            "question": "Is it fun?",
                            "options": [
                                "Yes, it is",
                                "No, it isn't",
                                "Not mentioned"
                            ],
                            "answer": "Yes, it is"
                        },
                        {
                            "question": "What do we have?",
                            "options": [
                                "A lion and a elephant",
                                "A dog",
                                "A cat"
                            ],
                            "answer": "A lion and a elephant"
                        }
                    ]
                }
            },
            {
                "id": "eng1-t18",
                "title": "Unit 18: Weather & Skies (NÂNG CAO LỚP 2)",
                "subtitle": "Hiện tượng thời tiết và bầu trời",
                "vocab": [
                    {
                        "word": "sunny",
                        "translation": "nắng",
                        "phonetics": "/ˈsʌn.i/",
                        "type": "adjective",
                        "sentence": "It is sunny today.",
                        "sentenceTranslation": "Hôm nay trời nắng."
                    },
                    {
                        "word": "rainy",
                        "translation": "mưa",
                        "phonetics": "/ˈreɪ.ni/",
                        "type": "adjective",
                        "sentence": "We stay home on rainy days.",
                        "sentenceTranslation": "Chúng tớ ở nhà vào những ngày mưa."
                    },
                    {
                        "word": "cloudy",
                        "translation": "nhiều mây",
                        "phonetics": "/ˈklaʊ.di/",
                        "type": "adjective",
                        "sentence": "The sky is cloudy.",
                        "sentenceTranslation": "Bầu trời nhiều mây."
                    },
                    {
                        "word": "windy",
                        "translation": "nhiều gió",
                        "phonetics": "/ˈwɪn.di/",
                        "type": "adjective",
                        "sentence": "It is windy in autumn.",
                        "sentenceTranslation": "Trời nhiều gió vào mùa thu."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Look at the sunny.",
                        "vietnamese": "Hãy nhìn con/cái nắng."
                    },
                    {
                        "english": "I have a rainy.",
                        "vietnamese": "Tớ có một cái mưa."
                    }
                ],
                "grammar": "Học từ vựng về các sự vật trong bài học và sử dụng cấu trúc giao tiếp cơ bản.",
                "readingPassageTitle": "Unit 18 Story",
                "readingPassage": "Today we learn many things about nắng. We have a sunny and a rainy. It is fun and happy!",
                "questions": {
                    "reading": [
                        {
                            "question": "What is the first word?",
                            "options": [
                                "Sunny",
                                "Apple",
                                "Pen"
                            ],
                            "answer": "Sunny"
                        },
                        {
                            "question": "Is it fun?",
                            "options": [
                                "Yes, it is",
                                "No, it isn't",
                                "Not mentioned"
                            ],
                            "answer": "Yes, it is"
                        },
                        {
                            "question": "What do we have?",
                            "options": [
                                "A sunny and a rainy",
                                "A dog",
                                "A cat"
                            ],
                            "answer": "A sunny and a rainy"
                        }
                    ]
                }
            },
            {
                "id": "eng1-t19",
                "title": "Unit 19: Jobs & Occupations (NÂNG CAO LỚP 2)",
                "subtitle": "Các nghề nghiệp phổ biến trong xã hội",
                "vocab": [
                    {
                        "word": "teacher",
                        "translation": "giáo viên",
                        "phonetics": "/ˈtiː.tʃər/",
                        "type": "noun",
                        "sentence": "She is our English teacher.",
                        "sentenceTranslation": "Cô ấy là giáo viên tiếng Anh của chúng tớ."
                    },
                    {
                        "word": "doctor",
                        "translation": "bác sĩ",
                        "phonetics": "/ˈdɒk.tər/",
                        "type": "noun",
                        "sentence": "The doctor helps patients.",
                        "sentenceTranslation": "Bác sĩ giúp đỡ các bệnh nhân."
                    },
                    {
                        "word": "pilot",
                        "translation": "phi công",
                        "phonetics": "/ˈpaɪ.lət/",
                        "type": "noun",
                        "sentence": "The pilot flies the plane.",
                        "sentenceTranslation": "Phi công lái máy bay."
                    },
                    {
                        "word": "singer",
                        "translation": "ca sĩ",
                        "phonetics": "/ˈsɪŋ.ər/",
                        "type": "noun",
                        "sentence": "She is a famous singer.",
                        "sentenceTranslation": "Cô ấy là một ca sĩ nổi tiếng."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Look at the teacher.",
                        "vietnamese": "Hãy nhìn con/cái giáo viên."
                    },
                    {
                        "english": "I have a doctor.",
                        "vietnamese": "Tớ có một cái bác sĩ."
                    }
                ],
                "grammar": "Học từ vựng về các sự vật trong bài học và sử dụng cấu trúc giao tiếp cơ bản.",
                "readingPassageTitle": "Unit 19 Story",
                "readingPassage": "Today we learn many things about giáo viên. We have a teacher and a doctor. It is fun and happy!",
                "questions": {
                    "reading": [
                        {
                            "question": "What is the first word?",
                            "options": [
                                "Teacher",
                                "Apple",
                                "Pen"
                            ],
                            "answer": "Teacher"
                        },
                        {
                            "question": "Is it fun?",
                            "options": [
                                "Yes, it is",
                                "No, it isn't",
                                "Not mentioned"
                            ],
                            "answer": "Yes, it is"
                        },
                        {
                            "question": "What do we have?",
                            "options": [
                                "A teacher and a doctor",
                                "A dog",
                                "A cat"
                            ],
                            "answer": "A teacher and a doctor"
                        }
                    ]
                }
            },
            {
                "id": "eng1-t20",
                "title": "Unit 20: Transports (NÂNG CAO LỚP 2)",
                "subtitle": "Phương tiện giao thông đi lại",
                "vocab": [
                    {
                        "word": "plane",
                        "translation": "máy bay",
                        "phonetics": "/pleɪn/",
                        "type": "noun",
                        "sentence": "We travel by plane.",
                        "sentenceTranslation": "Chúng tớ đi du lịch bằng máy bay."
                    },
                    {
                        "word": "train",
                        "translation": "tàu hỏa",
                        "phonetics": "/treɪn/",
                        "type": "noun",
                        "sentence": "The train is very long.",
                        "sentenceTranslation": "Đoàn tàu rất dài."
                    },
                    {
                        "word": "boat",
                        "translation": "thuyền",
                        "phonetics": "/bəʊt/",
                        "type": "noun",
                        "sentence": "The boat is on the lake.",
                        "sentenceTranslation": "Chiếc thuyền ở trên hồ."
                    },
                    {
                        "word": "truck",
                        "translation": "xe tải",
                        "phonetics": "/trʌk/",
                        "type": "noun",
                        "sentence": "The truck carries goods.",
                        "sentenceTranslation": "Chiếc xe tải chở hàng hóa."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Look at the plane.",
                        "vietnamese": "Hãy nhìn con/cái máy bay."
                    },
                    {
                        "english": "I have a train.",
                        "vietnamese": "Tớ có một cái tàu hỏa."
                    }
                ],
                "grammar": "Học từ vựng về các sự vật trong bài học và sử dụng cấu trúc giao tiếp cơ bản.",
                "readingPassageTitle": "Unit 20 Story",
                "readingPassage": "Today we learn many things about máy bay. We have a plane and a train. It is fun and happy!",
                "questions": {
                    "reading": [
                        {
                            "question": "What is the first word?",
                            "options": [
                                "Plane",
                                "Apple",
                                "Pen"
                            ],
                            "answer": "Plane"
                        },
                        {
                            "question": "Is it fun?",
                            "options": [
                                "Yes, it is",
                                "No, it isn't",
                                "Not mentioned"
                            ],
                            "answer": "Yes, it is"
                        },
                        {
                            "question": "What do we have?",
                            "options": [
                                "A plane and a train",
                                "A dog",
                                "A cat"
                            ],
                            "answer": "A plane and a train"
                        }
                    ]
                }
            }
        ]
    },
    "4": {
        "levelLabel": "Movers & Lớp 5 Nâng cao",
        "topics": [
            {
                "id": "eng4-t1",
                "title": "Unit 1: My friends",
                "subtitle": "Hỏi thăm quê quán và quốc tịch quốc tế",
                "vocab": [
                    {
                        "word": "america",
                        "translation": "nước Hoa Kì",
                        "phonetics": "/əˈmerɪkə/",
                        "type": "noun",
                        "sentence": "He is from America.",
                        "sentenceTranslation": "Cậu ấy đến từ nước Mỹ."
                    },
                    {
                        "word": "australia",
                        "translation": "nước Ô-xtơ-rây-li-a",
                        "phonetics": "/ɒˈstreɪliə/",
                        "type": "noun",
                        "sentence": "They visit Australia.",
                        "sentenceTranslation": "Họ đi thăm nước Úc."
                    },
                    {
                        "word": "britain",
                        "translation": "nước Anh",
                        "phonetics": "/ˈbrɪtn/",
                        "type": "noun",
                        "sentence": "Britain is a beautiful country.",
                        "sentenceTranslation": "Nước Anh là một quốc gia xinh đẹp."
                    },
                    {
                        "word": "japan",
                        "translation": "nước Nhật",
                        "phonetics": "/dʒəˈpæn/",
                        "type": "noun",
                        "sentence": "Akira is from Japan.",
                        "sentenceTranslation": "Akira đến từ nước Nhật."
                    },
                    {
                        "word": "malaysia",
                        "translation": "nước Ma-lay-xi-a",
                        "phonetics": "/məˈleɪziə/, /məˈleɪʒə/",
                        "type": "noun",
                        "sentence": "Kuala Lumpur is the capital of Malaysia.",
                        "sentenceTranslation": "Kuala Lumpur là thủ đô của Malaysia."
                    },
                    {
                        "word": "singapore",
                        "translation": "nước Xin-ga-po",
                        "phonetics": "/ˌsɪŋəˈpɔː(r)/",
                        "type": "noun",
                        "sentence": "Singapore is clean and green.",
                        "sentenceTranslation": "Singapore sạch và xanh."
                    },
                    {
                        "word": "thailand",
                        "translation": "nước Thái Lan",
                        "phonetics": "/ˈtaɪlænd/",
                        "type": "noun",
                        "sentence": "We travel to Thailand by plane.",
                        "sentenceTranslation": "Chúng tớ đi du lịch đến Thái Lan bằng máy bay."
                    },
                    {
                        "word": "viet nam",
                        "translation": "nước Việt Nam",
                        "phonetics": "/ˌviːetˈnɑːm/",
                        "type": "noun",
                        "sentence": "I live in Viet Nam.",
                        "sentenceTranslation": "Tớ sống ở Việt Nam."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Where are you from? - I am from Vietnam.",
                        "vietnamese": "Bạn từ đâu đến? - Tớ đến từ Việt Nam."
                    },
                    {
                        "english": "What nationality are you? - I am Vietnamese.",
                        "vietnamese": "Bạn quốc tịch gì? - Tớ là người Việt Nam."
                    }
                ],
                "grammar": "Cách hỏi và trả lời về quốc gia (Where are you from?) và quốc tịch (What nationality are you?).",
                "readingPassageTitle": "My International Friends",
                "readingPassage": "My name is Linh. I have many friends from different countries. John is from London, England. He is English. Akira is from Tokyo, Japan. He is Japanese. We study English together. We love sharing stories about our countries.",
                "questions": {
                    "reading": [
                        {
                            "question": "Where is John from?",
                            "options": [
                                "Tokyo, Japan",
                                "London, England",
                                "Washington, America"
                            ],
                            "answer": "London, England"
                        },
                        {
                            "question": "What nationality is Akira?",
                            "options": [
                                "English",
                                "Vietnamese",
                                "Japanese"
                            ],
                            "answer": "Japanese"
                        },
                        {
                            "question": "What language do they study together?",
                            "options": [
                                "Japanese",
                                "Vietnamese",
                                "English"
                            ],
                            "answer": "English"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "HhjYnMJgLr4",
                        "title": "Tiếng Anh lớp 4 Unit 1 - Lesson 1 - Trang 10, 11 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "H3sF4HLX6Sg",
                        "title": "Tiếng Anh lớp 4 Unit 1 - Lesson 2 - Trang 12, 13 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "MjE2catG6wE",
                        "title": "Tiếng Anh lớp 4 Unit 1 - Lesson 3 - Trang 14, 15 | Global Success (DỄ HIỂU NHẤT)"
                    }
                ]
            },
            {
                "id": "eng4-t2",
                "title": "Unit 2: Time and daily routines",
                "subtitle": "Nói về thời gian và các thói quen hàng ngày",
                "vocab": [
                    {
                        "word": "at",
                        "translation": "ở",
                        "phonetics": "/ət/, /æt/",
                        "type": "pre",
                        "sentence": "Look at that nice at.",
                        "sentenceTranslation": "Hãy nhìn cái ở đẹp đẽ kia."
                    },
                    {
                        "word": "fifteen",
                        "translation": "số 15",
                        "phonetics": "/fifˈtiːn/",
                        "type": "noun",
                        "sentence": "Look at that nice fifteen.",
                        "sentenceTranslation": "Hãy nhìn cái số 15 đẹp đẽ kia."
                    },
                    {
                        "word": "forty-five",
                        "translation": "số 45",
                        "phonetics": "/ˌfɔːti ˈfaɪv/",
                        "type": "noun",
                        "sentence": "Look at that nice forty-five.",
                        "sentenceTranslation": "Hãy nhìn cái số 45 đẹp đẽ kia."
                    },
                    {
                        "word": "o’clock",
                        "translation": "giờ (dùng sau giờ chẵn, ví dụ: 8 giờ: eight o’clock)",
                        "phonetics": "/əˈklɒk/",
                        "type": "noun",
                        "sentence": "Look at that nice o’clock.",
                        "sentenceTranslation": "Hãy nhìn cái giờ (dùng sau giờ chẵn, ví dụ: 8 giờ: eight o’clock) đẹp đẽ kia."
                    },
                    {
                        "word": "thirty",
                        "translation": "số 30",
                        "phonetics": "/ˈθɜːti/",
                        "type": "noun",
                        "sentence": "Look at that nice thirty.",
                        "sentenceTranslation": "Hãy nhìn cái số 30 đẹp đẽ kia."
                    },
                    {
                        "word": "get up",
                        "translation": "thức dậy",
                        "phonetics": "/get ˈʌp/",
                        "type": "verb",
                        "sentence": "I can get up well.",
                        "sentenceTranslation": "Tớ có thể thức dậy tốt."
                    },
                    {
                        "word": "go (to bed) (v)",
                        "translation": "đi (ngủ)",
                        "phonetics": "/ˈgəʊ (tə ˈbed)/",
                        "type": "noun",
                        "sentence": "Look at that nice go (to bed) (v).",
                        "sentenceTranslation": "Hãy nhìn cái đi (ngủ) đẹp đẽ kia."
                    },
                    {
                        "word": "go (to school) (v)",
                        "translation": "đi (học)",
                        "phonetics": "/ˈgəʊ (tə ˈskuːl)/",
                        "type": "noun",
                        "sentence": "Look at that nice go (to school) (v).",
                        "sentenceTranslation": "Hãy nhìn cái đi (học) đẹp đẽ kia."
                    },
                    {
                        "word": "have (breakfast) (v)",
                        "translation": "dùng (bữa sáng)",
                        "phonetics": "/hæv (ˈbrekfəst)/",
                        "type": "noun",
                        "sentence": "Look at that nice have (breakfast) (v).",
                        "sentenceTranslation": "Hãy nhìn cái dùng (bữa sáng) đẹp đẽ kia."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What time is it? - It's eight o'clock.",
                        "vietnamese": "Mấy giờ rồi? - Bây giờ là 8 giờ."
                    },
                    {
                        "english": "When do you get up? - I get up at six o'clock.",
                        "vietnamese": "Bạn thức dậy khi nào? - Tớ thức dậy lúc 6 giờ."
                    }
                ],
                "grammar": "Hỏi giờ bằng \"What time is it?\" và kể các hoạt động hàng ngày kèm theo giới từ chỉ thời gian \"at\".",
                "readingPassageTitle": "My Day",
                "readingPassage": "I get up at six o'clock in the morning. I have breakfast at six thirty. Then I go to school at seven o'clock. In the afternoon, I do homework. I go to bed at nine forty-five.",
                "questions": {
                    "reading": [
                        {
                            "question": "What time does the writer get up?",
                            "options": [
                                "Six o'clock",
                                "Six thirty",
                                "Seven o'clock"
                            ],
                            "answer": "Six o'clock"
                        },
                        {
                            "question": "When does the writer have breakfast?",
                            "options": [
                                "At six o'clock",
                                "At six thirty",
                                "At seven o'clock"
                            ],
                            "answer": "At six thirty"
                        },
                        {
                            "question": "What time does the writer go to bed?",
                            "options": [
                                "At nine o'clock",
                                "At nine thirty",
                                "At nine forty-five"
                            ],
                            "answer": "At nine forty-five"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "V20RlIAy_Jo",
                        "title": "Tiếng Anh lớp 4 Unit 2 - Lesson 1 - Trang 16, 17 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "fe8AQU7txnI",
                        "title": "Tiếng Anh lớp 4 Unit 2 - Lesson 2 - Trang 18, 19 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "d40LbZfEqxA",
                        "title": "Tiếng Anh lớp 4 Unit 2 - Lesson 3 - Trang 20, 21 | Global Success (DỄ HIỂU NHẤT)"
                    }
                ]
            },
            {
                "id": "eng4-t3",
                "title": "Unit 3: My week",
                "subtitle": "Các thứ trong tuần và lịch trình học tập",
                "vocab": [
                    {
                        "word": "monday",
                        "translation": "thứ Hai",
                        "phonetics": "/ˈmʌndeɪ/",
                        "type": "noun",
                        "sentence": "I have Maths on Monday.",
                        "sentenceTranslation": "Tớ học Toán vào Thứ Hai."
                    },
                    {
                        "word": "tuesday",
                        "translation": "thứ Ba",
                        "phonetics": "/ˈtjuːzdeɪ/",
                        "type": "noun",
                        "sentence": "Tuesday is a busy day.",
                        "sentenceTranslation": "Thứ Ba là một ngày bận rộn."
                    },
                    {
                        "word": "wednesday",
                        "translation": "thứ Tư",
                        "phonetics": "/ˈtjuːzdeɪ/",
                        "type": "noun",
                        "sentence": "We study Music on Wednesday.",
                        "sentenceTranslation": "Chúng tớ học Âm nhạc vào thứ Tư."
                    },
                    {
                        "word": "thursday",
                        "translation": "thứ Năm",
                        "phonetics": "/ˈθɜːzdeɪ/",
                        "type": "noun",
                        "sentence": "Thursday is fine.",
                        "sentenceTranslation": "Thứ Năm thật đẹp trời."
                    },
                    {
                        "word": "friday",
                        "translation": "thứ Sáu",
                        "phonetics": "/ˈfraɪdeɪ/",
                        "type": "noun",
                        "sentence": "School ends early on Friday.",
                        "sentenceTranslation": "Trường học tan sớm vào thứ Sáu."
                    },
                    {
                        "word": "saturday",
                        "translation": "thứ Bảy",
                        "phonetics": "/ˈsætədeɪ/",
                        "type": "noun",
                        "sentence": "I listen to music on Saturdays.",
                        "sentenceTranslation": "Tớ nghe nhạc vào các ngày thứ Bảy."
                    },
                    {
                        "word": "sunday",
                        "translation": "Chủ nhật",
                        "phonetics": "/ˈsʌndeɪ/",
                        "type": "noun",
                        "sentence": "We go to the park on Sundays.",
                        "sentenceTranslation": "Chúng tớ đi công viên vào các ngày Chủ nhật."
                    },
                    {
                        "word": "listen to music",
                        "translation": "nghe nhạc",
                        "phonetics": "/ˈlɪsn tə ˈmjuːzɪk/",
                        "type": "verb",
                        "sentence": "I can listen to music well.",
                        "sentenceTranslation": "Tớ có thể nghe nhạc tốt."
                    },
                    {
                        "word": "study at school",
                        "translation": "học, nghiên cứu ở trường",
                        "phonetics": "/ˈstʌdi ət skuːl/",
                        "type": "verb",
                        "sentence": "I can study at school well.",
                        "sentenceTranslation": "Tớ có thể học, nghiên cứu ở trường tốt."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What day is it today? - It's Monday.",
                        "vietnamese": "Hôm nay là thứ mấy? - Hôm nay là thứ Hai."
                    },
                    {
                        "english": "What do you do on Saturdays? - I play football.",
                        "vietnamese": "Bạn làm gì vào thứ Bảy? - Tớ chơi bóng đá."
                    }
                ],
                "grammar": "Hỏi thứ trong tuần bằng \"What day is it today?\" và hỏi hoạt động \"What do you do on [day]s?\".",
                "readingPassageTitle": "My Busy Week",
                "readingPassage": "Today is Monday. I study at school from Monday to Friday. On Saturday, I do not study. I play football in the afternoon. On Sunday, I stay at home and listen to music.",
                "questions": {
                    "reading": [
                        {
                            "question": "What day is it today?",
                            "options": [
                                "Monday",
                                "Saturday",
                                "Sunday"
                            ],
                            "answer": "Monday"
                        },
                        {
                            "question": "When does the writer play football?",
                            "options": [
                                "On Monday",
                                "On Friday",
                                "On Saturday"
                            ],
                            "answer": "On Saturday"
                        },
                        {
                            "question": "What does the writer do on Sunday?",
                            "options": [
                                "Study at school",
                                "Listen to music",
                                "Play football"
                            ],
                            "answer": "Listen to music"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "uuVrEd0JrX8",
                        "title": "Tiếng Anh lớp 4 Unit 3 - Lesson 1 - Trang 22, 23 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "Clk0r32wz8w",
                        "title": "Tiếng Anh lớp 4 Unit 3: Lesson 2 - Trang 24, 25 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "UPkdUw2RjwM",
                        "title": "Tiếng Anh lớp 4 Unit 3: Lesson 3 - Trang 26, 27 | Global Success (DỄ HIỂU NHẤT)"
                    }
                ]
            },
            {
                "id": "eng4-t4",
                "title": "Unit 4: My birthday party",
                "subtitle": "Cách nói ngày tháng và ngày sinh nhật",
                "vocab": [
                    {
                        "word": "january",
                        "translation": "tháng Một",
                        "phonetics": "/ˈdʒænjuəri/",
                        "type": "noun",
                        "sentence": "New Year is in January.",
                        "sentenceTranslation": "Năm mới vào Tháng Một."
                    },
                    {
                        "word": "february",
                        "translation": "tháng Hai",
                        "phonetics": "/ˈfebruəri/",
                        "type": "noun",
                        "sentence": "February has 28 days.",
                        "sentenceTranslation": "Tháng Hai có 28 ngày."
                    },
                    {
                        "word": "march",
                        "translation": "tháng Ba",
                        "phonetics": "/mɑːtʃ/",
                        "type": "noun",
                        "sentence": "Spring starts in March.",
                        "sentenceTranslation": "Mùa xuân bắt đầu từ Tháng Ba."
                    },
                    {
                        "word": "april",
                        "translation": "tháng Tư",
                        "phonetics": "/ˈstʌdi/",
                        "type": "noun",
                        "sentence": "April is in spring.",
                        "sentenceTranslation": "Tháng Tư là vào mùa xuân."
                    },
                    {
                        "word": "may",
                        "translation": "tháng Năm",
                        "phonetics": "/meɪ/",
                        "type": "noun",
                        "sentence": "School ends in May.",
                        "sentenceTranslation": "Trường học kết thúc vào tháng Năm."
                    },
                    {
                        "word": "birthday",
                        "translation": "ngày sinh",
                        "phonetics": "/ˈbɜːθdeɪ/",
                        "type": "noun",
                        "sentence": "My birthday is coming.",
                        "sentenceTranslation": "Sinh nhật của tớ đang đến gần."
                    },
                    {
                        "word": "chips",
                        "translation": "khoai tây rán",
                        "phonetics": "/tʃɪps/",
                        "type": "noun",
                        "sentence": "Look at that nice chips.",
                        "sentenceTranslation": "Hãy nhìn cái khoai tây rán đẹp đẽ kia."
                    },
                    {
                        "word": "grape",
                        "translation": "quả nho",
                        "phonetics": "/ɡreɪp/",
                        "type": "noun",
                        "sentence": "Look at that nice grape.",
                        "sentenceTranslation": "Hãy nhìn cái quả nho đẹp đẽ kia."
                    },
                    {
                        "word": "jam",
                        "translation": "mứt",
                        "phonetics": "/dʒæm/",
                        "type": "noun",
                        "sentence": "Look at that nice jam.",
                        "sentenceTranslation": "Hãy nhìn cái mứt đẹp đẽ kia."
                    },
                    {
                        "word": "juice",
                        "translation": "nước ép",
                        "phonetics": "/dʒuːs/",
                        "type": "noun",
                        "sentence": "Look at that nice juice.",
                        "sentenceTranslation": "Hãy nhìn cái nước ép đẹp đẽ kia."
                    },
                    {
                        "word": "lemonade",
                        "translation": "nước chanh",
                        "phonetics": "/ˌleməˈneɪd/",
                        "type": "noun",
                        "sentence": "Look at that nice lemonade.",
                        "sentenceTranslation": "Hãy nhìn cái nước chanh đẹp đẽ kia."
                    },
                    {
                        "word": "party",
                        "translation": "buổi tiệc",
                        "phonetics": "/ˈpɑːti/",
                        "type": "noun",
                        "sentence": "Look at that nice party.",
                        "sentenceTranslation": "Hãy nhìn cái buổi tiệc đẹp đẽ kia."
                    },
                    {
                        "word": "water",
                        "translation": "nước",
                        "phonetics": "/ˈwɔːtə(r)/",
                        "type": "noun",
                        "sentence": "Look at that nice water.",
                        "sentenceTranslation": "Hãy nhìn cái nước đẹp đẽ kia."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "When is your birthday? - It's in January.",
                        "vietnamese": "Sinh nhật bạn khi nào? - Vào tháng Giêng."
                    },
                    {
                        "english": "What is the date today? - It's the first of March.",
                        "vietnamese": "Hôm nay là ngày bao nhiêu? - Ngày mùng 1 tháng Ba."
                    }
                ],
                "grammar": "Hỏi ngày sinh nhật bằng \"When is your birthday?\" và hỏi ngày tháng hiện tại \"What is the date today?\".",
                "readingPassageTitle": "Our Birthday Party",
                "readingPassage": "My birthday is in January, on the first. My brother's birthday is in June, on the second. Today is the third of March, so it is my friend's birthday party. We eat cake and sing.",
                "questions": {
                    "reading": [
                        {
                            "question": "When is the writer's birthday?",
                            "options": [
                                "In January",
                                "In June",
                                "In March"
                            ],
                            "answer": "In January"
                        },
                        {
                            "question": "What is the date today?",
                            "options": [
                                "The first of January",
                                "The second of June",
                                "The third of March"
                            ],
                            "answer": "The third of March"
                        },
                        {
                            "question": "Whose birthday is in June?",
                            "options": [
                                "The writer's",
                                "The brother's",
                                "The friend's"
                            ],
                            "answer": "The brother's"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "CtvWZ34RUGg",
                        "title": "Tiếng Anh lớp 4 Unit 4 - Lesson 1 - Trang 28, 29 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "7oIUrNRyyZs",
                        "title": "Tiếng Anh lớp 4 Unit 4 - Lesson 2 - Trang 30, 31 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "yAwKm6fDdaE",
                        "title": "Tiếng Anh lớp 4 Unit 4 - Lesson 3 - Trang 32, 33 | Global Success (DỄ HIỂU NHẤT)"
                    }
                ]
            },
            {
                "id": "eng4-t5",
                "title": "Unit 5: Things we can do",
                "subtitle": "Các hoạt động thể thao và sở thích cá nhân",
                "vocab": [
                    {
                        "word": "can",
                        "translation": "có thể, biết (làm gì)",
                        "phonetics": "/kən/, /kæn/",
                        "type": "verb",
                        "sentence": "I can can well.",
                        "sentenceTranslation": "Tớ có thể có thể, biết (làm gì) tốt."
                    },
                    {
                        "word": "cook",
                        "translation": "nấu ăn",
                        "phonetics": "/kʊk/",
                        "type": "verb",
                        "sentence": "I can cook well.",
                        "sentenceTranslation": "Tớ có thể nấu ăn tốt."
                    },
                    {
                        "word": "play the piano",
                        "translation": "chơi đàn piano",
                        "phonetics": "/pleɪ ðə piˈænəʊ/",
                        "type": "verb",
                        "sentence": "I can play the piano well.",
                        "sentenceTranslation": "Tớ có thể chơi đàn piano tốt."
                    },
                    {
                        "word": "play the guitar",
                        "translation": "chơi đàn ghi-ta",
                        "phonetics": "/pleɪ ðə ɡɪˈtɑː/",
                        "type": "verb",
                        "sentence": "I can play the guitar well.",
                        "sentenceTranslation": "Tớ có thể chơi đàn ghi-ta tốt."
                    },
                    {
                        "word": "ride (a bike) (v)",
                        "translation": "đạp xe",
                        "phonetics": "/raɪd (ə baɪk)/",
                        "type": "noun",
                        "sentence": "Look at that nice ride (a bike) (v).",
                        "sentenceTranslation": "Hãy nhìn cái đạp xe đẹp đẽ kia."
                    },
                    {
                        "word": "ride (a horse) (v)",
                        "translation": "cưỡi ngựa",
                        "phonetics": "/raɪd (ə hɔːs)/",
                        "type": "noun",
                        "sentence": "Look at that nice ride (a horse) (v).",
                        "sentenceTranslation": "Hãy nhìn cái cưỡi ngựa đẹp đẽ kia."
                    },
                    {
                        "word": "roller skate",
                        "translation": "trượt pa tanh",
                        "phonetics": "/ˈrəʊlə skeɪt/",
                        "type": "verb",
                        "sentence": "I can roller skate well.",
                        "sentenceTranslation": "Tớ có thể trượt pa tanh tốt."
                    },
                    {
                        "word": "swim",
                        "translation": "bơi",
                        "phonetics": "/swɪm/",
                        "type": "verb",
                        "sentence": "I swim in the pool.",
                        "sentenceTranslation": "Tớ bơi ở hồ bơi."
                    },
                    {
                        "word": "but",
                        "translation": "nhưng",
                        "phonetics": "/bʌt/",
                        "type": "noun",
                        "sentence": "Look at that nice but.",
                        "sentenceTranslation": "Hãy nhìn cái nhưng đẹp đẽ kia."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What is your hobby? - I like playing chess.",
                        "vietnamese": "Sở thích của bạn là gì? - Tớ thích chơi cờ."
                    },
                    {
                        "english": "Can you swim? - Yes, I can. / No, I can't.",
                        "vietnamese": "Bạn có biết bơi không? - Có, tớ biết. / Không, tớ không biết."
                    }
                ],
                "grammar": "Hỏi sở thích bằng \"What is your hobby?\" và hỏi khả năng bằng \"Can you...?\".",
                "readingPassageTitle": "Our Hobbies",
                "readingPassage": "We have different hobbies. My hobby is playing chess. I can play chess very well. My friend Nam likes music. He can play the guitar, but he cannot play the piano. We can both swim and skate.",
                "questions": {
                    "reading": [
                        {
                            "question": "What is the writer's hobby?",
                            "options": [
                                "Playing chess",
                                "Playing the guitar",
                                "Swimming"
                            ],
                            "answer": "Playing chess"
                        },
                        {
                            "question": "Can Nam play the piano?",
                            "options": [
                                "Yes, he can",
                                "No, he cannot",
                                "We do not know"
                            ],
                            "answer": "No, he cannot"
                        },
                        {
                            "question": "What can they both do?",
                            "options": [
                                "Play chess",
                                "Play the guitar",
                                "Swim and skate"
                            ],
                            "answer": "Swim and skate"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "DFfor4lZp6c",
                        "title": "Tiếng Anh lớp 4 Unit 5 - Lesson 1 - Trang 34, 35 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "YDHFLZDtSwI",
                        "title": "Tiếng Anh lớp 4 Unit 5 - Lesson 2 - Trang 36, 37 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "wNYW0R5nC0Y",
                        "title": "Tiếng Anh lớp 4 Unit 5 - Lesson 3 - Trang 38, 39 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "pPcAiQdsNiM",
                        "title": "Tiếng Anh lớp 4 Review 1 & Extension activities - Trang 40, 43 | Global Success (DỄ HIỂU NHẤT)"
                    }
                ]
            },
            {
                "id": "eng4-t6",
                "title": "Unit 6: Our school facilities",
                "subtitle": "Cơ sở vật chất trường học của chúng ta",
                "vocab": [
                    {
                        "word": "city",
                        "translation": "thành phố",
                        "phonetics": "/ˈsɪti/",
                        "type": "noun",
                        "sentence": "Look at that nice city.",
                        "sentenceTranslation": "Hãy nhìn cái thành phố đẹp đẽ kia."
                    },
                    {
                        "word": "mountains",
                        "translation": "vùng núi",
                        "phonetics": "/ˈmaʊntənz/",
                        "type": "noun",
                        "sentence": "Look at that nice mountains.",
                        "sentenceTranslation": "Hãy nhìn cái vùng núi đẹp đẽ kia."
                    },
                    {
                        "word": "town",
                        "translation": "thị trấn",
                        "phonetics": "/taʊn/",
                        "type": "noun",
                        "sentence": "Look at that nice town.",
                        "sentenceTranslation": "Hãy nhìn cái thị trấn đẹp đẽ kia."
                    },
                    {
                        "word": "village",
                        "translation": "ngôi làng",
                        "phonetics": "/ˈvɪlɪdʒ/",
                        "type": "noun",
                        "sentence": "Look at that nice village.",
                        "sentenceTranslation": "Hãy nhìn cái ngôi làng đẹp đẽ kia."
                    },
                    {
                        "word": "computer room",
                        "translation": "phòng máy tính",
                        "phonetics": "/kəmˈpjuːtə ruːm/",
                        "type": "noun",
                        "sentence": "Look at that nice computer room.",
                        "sentenceTranslation": "Hãy nhìn cái phòng máy tính đẹp đẽ kia."
                    },
                    {
                        "word": "garden",
                        "translation": "vườn",
                        "phonetics": "/ˈɡɑːdn/",
                        "type": "noun",
                        "sentence": "Look at that nice garden.",
                        "sentenceTranslation": "Hãy nhìn cái vườn đẹp đẽ kia."
                    },
                    {
                        "word": "playground",
                        "translation": "sân chơi",
                        "phonetics": "/ˈpleɪɡraʊnd/",
                        "type": "noun",
                        "sentence": "Look at that nice playground.",
                        "sentenceTranslation": "Hãy nhìn cái sân chơi đẹp đẽ kia."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Where is your classroom? - It's on the first floor.",
                        "vietnamese": "Phòng học của bạn ở đâu? - Nó ở tầng một."
                    },
                    {
                        "english": "Is there a gym at your school? - Yes, there is.",
                        "vietnamese": "Có phòng thể chất ở trường bạn không? - Có."
                    }
                ],
                "grammar": "Hỏi vị trí phòng học và hỏi sự hiện hữu bằng \"Is there a...?\".",
                "readingPassageTitle": "My Primary School",
                "readingPassage": "My school is big and new. My classroom is on the second floor. We have a library next to the classroom. There is a large playground and a modern computer room. I like playing in the school yard.",
                "questions": {
                    "reading": [
                        {
                            "question": "Where is the writer's classroom?",
                            "options": [
                                "On the first floor",
                                "On the second floor",
                                "In the gym"
                            ],
                            "answer": "On the second floor"
                        },
                        {
                            "question": "Where is the library?",
                            "options": [
                                "Next to the classroom",
                                "In the computer room",
                                "On the playground"
                            ],
                            "answer": "Next to the classroom"
                        },
                        {
                            "question": "Is there a computer room?",
                            "options": [
                                "Yes, there is",
                                "No, there isn't",
                                "We do not know"
                            ],
                            "answer": "Yes, there is"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "UKqGM0EKQUw",
                        "title": "Tiếng Anh lớp 4 Unit 6 - Lesson 1 - Trang 44, 45 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "JZYMXNVsJOo",
                        "title": "Tiếng Anh lớp 4 Unit 6 - Lesson 2 - Trang 46 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "zINiociIUJk",
                        "title": "Tiếng Anh lớp 4 Unit 6 - Lesson 3 - Trang 47, 49 | Global Success (DỄ HIỂU NHẤT)"
                    }
                ]
            },
            {
                "id": "eng4-t7",
                "title": "Unit 7: Our timetable",
                "subtitle": "Thời khóa biểu và các môn học ở trường",
                "vocab": [
                    {
                        "word": "art",
                        "translation": "môn Mĩ thuật",
                        "phonetics": "/ɑːt/",
                        "type": "noun",
                        "sentence": "Look at that nice art.",
                        "sentenceTranslation": "Hãy nhìn cái môn mĩ thuật đẹp đẽ kia."
                    },
                    {
                        "word": "english",
                        "translation": "môn Tiếng Anh",
                        "phonetics": "/ˈɪŋɡlɪʃ/",
                        "type": "noun",
                        "sentence": "Look at that nice english.",
                        "sentenceTranslation": "Hãy nhìn cái môn tiếng anh đẹp đẽ kia."
                    },
                    {
                        "word": "historyand geography",
                        "translation": "môn Lịch sử và Địa lí",
                        "phonetics": "/ˈhɪstri ænd dʒiˈɒɡrəfi /",
                        "type": "noun",
                        "sentence": "Look at that nice historyand geography.",
                        "sentenceTranslation": "Hãy nhìn cái môn lịch sử và địa lí đẹp đẽ kia."
                    },
                    {
                        "word": "maths",
                        "translation": "môn Toán, toán học",
                        "phonetics": "/mæθs/",
                        "type": "noun",
                        "sentence": "Look at that nice maths.",
                        "sentenceTranslation": "Hãy nhìn cái môn toán, toán học đẹp đẽ kia."
                    },
                    {
                        "word": "music",
                        "translation": "môn Âm nhạc",
                        "phonetics": "/ˈmjuːzɪk/",
                        "type": "noun",
                        "sentence": "Look at that nice music.",
                        "sentenceTranslation": "Hãy nhìn cái môn âm nhạc đẹp đẽ kia."
                    },
                    {
                        "word": "science",
                        "translation": "môn Khoa học",
                        "phonetics": "/ˈsaɪəns/",
                        "type": "noun",
                        "sentence": "Look at that nice science.",
                        "sentenceTranslation": "Hãy nhìn cái môn khoa học đẹp đẽ kia."
                    },
                    {
                        "word": "vietnamese",
                        "translation": "môn Tiếng Việt",
                        "phonetics": "/ˌviːetnəˈmiːz/",
                        "type": "noun",
                        "sentence": "Look at that nice vietnamese.",
                        "sentenceTranslation": "Hãy nhìn cái môn tiếng việt đẹp đẽ kia."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What subjects do you have today? - I have maths and art.",
                        "vietnamese": "Hôm nay bạn có những môn học gì? - Tớ có môn toán và mỹ thuật."
                    },
                    {
                        "english": "When do you have English? - I have it on Mondays.",
                        "vietnamese": "Khi nào bạn có môn Tiếng Anh? - Tớ có vào các ngày thứ Hai."
                    }
                ],
                "grammar": "Hỏi môn học bằng \"What subjects do you have today?\" và hỏi ngày có môn học bằng \"When do you have...?\".",
                "readingPassageTitle": "School Timetable",
                "readingPassage": "I look at my timetable. Today is Monday, so I have Vietnamese, maths, and IT. On Tuesday, I have science, history, and PE. I have my favorite subject, English, on Wednesdays.",
                "questions": {
                    "reading": [
                        {
                            "question": "What subjects does the writer have on Monday?",
                            "options": [
                                "Science and PE",
                                "Vietnamese, maths, and IT",
                                "English and art"
                            ],
                            "answer": "Vietnamese, maths, and IT"
                        },
                        {
                            "question": "When does the writer have English?",
                            "options": [
                                "On Mondays",
                                "On Tuesdays",
                                "On Wednesdays"
                            ],
                            "answer": "On Wednesdays"
                        },
                        {
                            "question": "What is the writer's favorite subject?",
                            "options": [
                                "Maths",
                                "English",
                                "Vietnamese"
                            ],
                            "answer": "English"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "emtG5xmDeIQ",
                        "title": "Tiếng Anh lớp 4 Unit 7 - Lesson 1 - Trang 50, 51 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "KROKzRWfdII",
                        "title": "Tiếng Anh lớp 4 Unit 7 - Lesson 2 - Trang 52, 53 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "TgvInlEWoDo",
                        "title": "Tiếng Anh lớp 4 Unit 7 - Lesson 3 - Trang 54, 55 | Global Success (DỄ HIỂU NHẤT)"
                    }
                ]
            },
            {
                "id": "eng4-t8",
                "title": "Unit 8: My favourite subjects",
                "subtitle": "Các môn học yêu thích và lý do yêu thích",
                "vocab": [
                    {
                        "word": "it (information technology) (n)",
                        "translation": "môn Tin học, môn Công nghệthông tin",
                        "phonetics": "/aɪ ˈtiː/(/ˌɪnfəˌmeɪʃn tekˈnɒlədʒi/)",
                        "type": "noun",
                        "sentence": "Look at that nice it (information technology) (n).",
                        "sentenceTranslation": "Hãy nhìn cái môn tin học, môn công nghệthông tin đẹp đẽ kia."
                    },
                    {
                        "word": "pe (physical education)(n)",
                        "translation": "môn Thể dục, môn Giáo dụcthể chất",
                        "phonetics": "/ˌpiː ˈiː/(/ˌfɪzɪkl edʒuˈkeɪʃn/)",
                        "type": "noun",
                        "sentence": "Look at that nice pe (physical education)(n).",
                        "sentenceTranslation": "Hãy nhìn cái môn thể dục, môn giáo dụcthể chất đẹp đẽ kia."
                    },
                    {
                        "word": "english teacher",
                        "translation": "giáo viên (dạy Tiếng Anh)",
                        "phonetics": "/(ˈɪŋɡlɪʃ) ˈtiːtʃə/",
                        "type": "noun",
                        "sentence": "Look at that nice english teacher.",
                        "sentenceTranslation": "Hãy nhìn cái giáo viên (dạy tiếng anh) đẹp đẽ kia."
                    },
                    {
                        "word": "maths teacher",
                        "translation": "giáo viên (dạy Toán)",
                        "phonetics": "/(mæθs) ˈtiːtʃə/",
                        "type": "noun",
                        "sentence": "Look at that nice maths teacher.",
                        "sentenceTranslation": "Hãy nhìn cái giáo viên (dạy toán) đẹp đẽ kia."
                    },
                    {
                        "word": "because",
                        "translation": "bởi vì",
                        "phonetics": "/bɪˈkɒz/",
                        "type": "noun",
                        "sentence": "Look at that nice because.",
                        "sentenceTranslation": "Hãy nhìn cái bởi vì đẹp đẽ kia."
                    },
                    {
                        "word": "why",
                        "translation": "tại sao",
                        "phonetics": "/waɪ/",
                        "type": "verb",
                        "sentence": "I can why well.",
                        "sentenceTranslation": "Tớ có thể tại sao tốt."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What is your favorite subject? - It's music.",
                        "vietnamese": "Môn học yêu thích của bạn là gì? - Môn âm nhạc."
                    },
                    {
                        "english": "Why do you like it? - Because it is fun.",
                        "vietnamese": "Tại sao bạn thích nó? - Bởi vì nó vui."
                    }
                ],
                "grammar": "Hỏi môn học yêu thích bằng \"What is your favorite subject?\" và hỏi lý do bằng \"Why...?\" - \"Because...\".",
                "readingPassageTitle": "Why I Love Music",
                "readingPassage": "My name is Nam. My favorite subject is music. I like it because it is very fun and easy. My friend Hoa likes science because it is interesting. We do not like history because it is difficult.",
                "questions": {
                    "reading": [
                        {
                            "question": "What is Nam's favorite subject?",
                            "options": [
                                "Music",
                                "Science",
                                "History"
                            ],
                            "answer": "Music"
                        },
                        {
                            "question": "Why does Nam like music?",
                            "options": [
                                "Because it is difficult",
                                "Because it is interesting",
                                "Because it is fun and easy"
                            ],
                            "answer": "Because it is fun and easy"
                        },
                        {
                            "question": "Why does Hoa like science?",
                            "options": [
                                "Because it is fun",
                                "Because it is interesting",
                                "Because it is easy"
                            ],
                            "answer": "Because it is interesting"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "tsulX6_B8iQ",
                        "title": "Tiếng Anh lớp 4 Unit 8 - Lesson 1 - Trang 56, 57 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "r1UK_v4aSbA",
                        "title": "Tiếng Anh lớp 4 Unit 8 - Lesson 2 - Trang 58, 59 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "pSklMEEqgGw",
                        "title": "Tiếng Anh lớp 4 Unit 8 - Lesson 3 - Trang 60, 61 | Global Success (DỄ HIỂU NHẤT)"
                    }
                ]
            },
            {
                "id": "eng4-t9",
                "title": "Unit 9: Our sports day",
                "subtitle": "Ngày hội thể thao của trường em",
                "vocab": [
                    {
                        "word": "june",
                        "translation": "tháng Sáu",
                        "phonetics": "/dʒuːn/",
                        "type": "noun",
                        "sentence": "We have summer holiday in June.",
                        "sentenceTranslation": "Chúng tớ có kỳ nghỉ hè vào tháng Sáu."
                    },
                    {
                        "word": "july",
                        "translation": "tháng Bảy",
                        "phonetics": "/dʒuˈlaɪ/",
                        "type": "noun",
                        "sentence": "It is hot in July.",
                        "sentenceTranslation": "Trời rất nóng vào tháng Bảy."
                    },
                    {
                        "word": "august",
                        "translation": "tháng Tám",
                        "phonetics": "/ɔːˈɡʌst/",
                        "type": "noun",
                        "sentence": "We go back to school in August.",
                        "sentenceTranslation": "Chúng tớ tựu trường vào tháng Tám."
                    },
                    {
                        "word": "september",
                        "translation": "tháng Chín",
                        "phonetics": "/sepˈtembə/",
                        "type": "noun",
                        "sentence": "September is the start of autumn.",
                        "sentenceTranslation": "Tháng Chín là khởi đầu của mùa thu."
                    },
                    {
                        "word": "october",
                        "translation": "tháng Mười",
                        "phonetics": "/ɒkˈtəʊbə/",
                        "type": "noun",
                        "sentence": "October is my favorite month.",
                        "sentenceTranslation": "Tháng Mười là tháng yêu thích của tớ."
                    },
                    {
                        "word": "november",
                        "translation": "tháng Mười Một",
                        "phonetics": "/nəʊˈvembə/",
                        "type": "noun",
                        "sentence": "The weather is cool in November.",
                        "sentenceTranslation": "Thời tiết mát mẻ vào tháng Mười Một."
                    },
                    {
                        "word": "december",
                        "translation": "tháng Mười hai",
                        "phonetics": "/dɪˈsembə/",
                        "type": "noun",
                        "sentence": "Christmas is in December.",
                        "sentenceTranslation": "Giáng sinh là vào tháng Mười Hai."
                    },
                    {
                        "word": "sports day",
                        "translation": "ngày hội thể thao",
                        "phonetics": "/ˈspɔːts deɪ/",
                        "type": "noun",
                        "sentence": "Look at that nice sports day.",
                        "sentenceTranslation": "Hãy nhìn cái ngày hội thể thao đẹp đẽ kia."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What are they doing? - They are playing football.",
                        "vietnamese": "Họ đang làm gì vậy? - Họ đang chơi bóng đá."
                    },
                    {
                        "english": "When is your sports day? - It's in October.",
                        "vietnamese": "Khi nào là ngày hội thể thao của bạn? - Vào tháng Mười."
                    }
                ],
                "grammar": "Hỏi hoạt động đang diễn ra bằng \"What are they doing?\" và hỏi thời gian sự kiện \"When is...?\".",
                "readingPassageTitle": "Sports Day at School",
                "readingPassage": "Our sports day is in October. It is very exciting. Many boys are playing football in the playground. Some girls are playing badminton. I am playing table tennis. We want to win!",
                "questions": {
                    "reading": [
                        {
                            "question": "When is the sports day?",
                            "options": [
                                "In September",
                                "In October",
                                "In November"
                            ],
                            "answer": "In October"
                        },
                        {
                            "question": "What are the boys doing in the playground?",
                            "options": [
                                "Playing badminton",
                                "Playing football",
                                "Playing table tennis"
                            ],
                            "answer": "Playing football"
                        },
                        {
                            "question": "What is the writer doing?",
                            "options": [
                                "Playing football",
                                "Playing badminton",
                                "Playing table tennis"
                            ],
                            "answer": "Playing table tennis"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "mPs0bpGsu3Q",
                        "title": "Tiếng Anh lớp 4 Unit 9 - Lesson 1 - Trang 62, 63 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "Y7IeGZZtBOs",
                        "title": "Tiếng Anh lớp 4 Unit 9 - Lesson 2 - Trang 64, 65 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "gbogn6lK4LA",
                        "title": "Tiếng Anh lớp 4 Unit 9 - Lesson 3 - Trang 66, 67 | Global Success (DỄ HIỂU NHẤT)"
                    }
                ]
            },
            {
                "id": "eng4-t10",
                "title": "Unit 10: Our summer camp",
                "subtitle": "Chuyến đi cắm trại hè vui vẻ",
                "vocab": [
                    {
                        "word": "beach",
                        "translation": "bãi biển",
                        "phonetics": "/biːtʃ/",
                        "type": "noun",
                        "sentence": "Play with sand on the beach.",
                        "sentenceTranslation": "Chơi với cát trên bãi biển."
                    },
                    {
                        "word": "campsite",
                        "translation": "địa điểm cắm trại",
                        "phonetics": "/ˈkæmpsaɪt/",
                        "type": "noun",
                        "sentence": "Look at that nice campsite.",
                        "sentenceTranslation": "Hãy nhìn cái địa điểm cắm trại đẹp đẽ kia."
                    },
                    {
                        "word": "countryside",
                        "translation": "nông thôn, vùng quê",
                        "phonetics": "/ˈkʌntrisaɪd/",
                        "type": "noun",
                        "sentence": "Look at that nice countryside.",
                        "sentenceTranslation": "Hãy nhìn cái nông thôn, vùng quê đẹp đẽ kia."
                    },
                    {
                        "word": "bangkok",
                        "translation": "Băng Cốc (thủ đô của nướcThái Lan)",
                        "phonetics": "/bæŋˈkɒk/",
                        "type": "noun",
                        "sentence": "Look at that nice bangkok.",
                        "sentenceTranslation": "Hãy nhìn cái băng cốc (thủ đô của nướcthái lan) đẹp đẽ kia."
                    },
                    {
                        "word": "sydney",
                        "translation": "Xít-ni (thành phố của nướcÔ-xtơ-rây-li-a)",
                        "phonetics": "/ˈsɪdni/",
                        "type": "noun",
                        "sentence": "Look at that nice sydney.",
                        "sentenceTranslation": "Hãy nhìn cái xít-ni (thành phố của nướcô-xtơ-rây-li-a) đẹp đẽ kia."
                    },
                    {
                        "word": "tokyo",
                        "translation": "Tô-ki-ô (thủ đô của nước Nhật)",
                        "phonetics": "/ˈtəʊkiəʊ/",
                        "type": "noun",
                        "sentence": "Look at that nice tokyo.",
                        "sentenceTranslation": "Hãy nhìn cái tô-ki-ô (thủ đô của nước nhật) đẹp đẽ kia."
                    },
                    {
                        "word": "last",
                        "translation": "trước, lần trước",
                        "phonetics": "/lɑːst/",
                        "type": "adjective",
                        "sentence": "This book is very last.",
                        "sentenceTranslation": "Cuốn sách này rất trước, lần trước."
                    },
                    {
                        "word": "yesterday",
                        "translation": "ngày hôm qua",
                        "phonetics": "/ˈjestədeɪ/",
                        "type": "verb",
                        "sentence": "Where were you yesterday?",
                        "sentenceTranslation": "Hôm qua cậu ở đâu?"
                    },
                    {
                        "word": "at, on, in (+ place) (pre)",
                        "translation": "ở (+ địa điểm)",
                        "phonetics": "/ət/, /ɒn/, /ɪn/ (+/pleɪs/)",
                        "type": "noun",
                        "sentence": "Look at that nice at, on, in (+ place) (pre).",
                        "sentenceTranslation": "Hãy nhìn cái ở (+ địa điểm) đẹp đẽ kia."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Where were you yesterday? - I was at the summer camp.",
                        "vietnamese": "Hôm qua bạn ở đâu? - Tớ đã ở trại hè."
                    },
                    {
                        "english": "What did you do there? - We built a tent.",
                        "vietnamese": "Bạn đã làm gì ở đó? - Chúng tớ đã dựng một cái lều."
                    }
                ],
                "grammar": "Hỏi vị trí trong quá khứ bằng \"Where were you...?\" và hoạt động \"What did you do...?\".",
                "readingPassageTitle": "Fun at Summer Camp",
                "readingPassage": "Yesterday, my class was at the summer camp in the forest. We built a big tent. In the evening, we had a campfire. We sang songs, danced, and played exciting games. It was so much fun!",
                "questions": {
                    "reading": [
                        {
                            "question": "Where was the class yesterday?",
                            "options": [
                                "At the beach",
                                "At the school library",
                                "At the summer camp"
                            ],
                            "answer": "At the summer camp"
                        },
                        {
                            "question": "What did they do in the evening?",
                            "options": [
                                "Built a tent",
                                "Had a campfire, sang, and danced",
                                "Went home"
                            ],
                            "answer": "Had a campfire, sang, and danced"
                        },
                        {
                            "question": "How was the summer camp?",
                            "options": [
                                "Boring",
                                "Hot",
                                "Fun"
                            ],
                            "answer": "Fun"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "9iF5fadvgl0",
                        "title": "Tiếng Anh lớp 4 Unit 10 - Lesson 1 - Trang 68, 69 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "fkH9jQ5XkK0",
                        "title": "Tiếng Anh lớp 4 Unit 10 - Lesson 2 - Trang 68, 69 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "zNzgtlOFpjM",
                        "title": "Tiếng Anh lớp 4 Unit 10 - Lesson 3 - Trang 68, 69 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "huQ_DRvuaZM",
                        "title": "Tiếng Anh lớp 4 Review 2 & Extension activities - Trang 74, 75 | Global Success (DỄ HIỂU NHẤT)"
                    }
                ]
            },
            {
                "id": "eng4-t11",
                "title": "Unit 11: Our food and drink",
                "subtitle": "Đồ ăn thức uống và sở thích ẩm thực",
                "vocab": [
                    {
                        "word": "road",
                        "translation": "con đường, đường phố",
                        "phonetics": "/rəʊd/",
                        "type": "noun",
                        "sentence": "Look at that nice road.",
                        "sentenceTranslation": "Hãy nhìn cái con đường, đường phố đẹp đẽ kia."
                    },
                    {
                        "word": "street",
                        "translation": "phố, đường phố",
                        "phonetics": "/striːt/",
                        "type": "noun",
                        "sentence": "Look at that nice street.",
                        "sentenceTranslation": "Hãy nhìn cái phố, đường phố đẹp đẽ kia."
                    },
                    {
                        "word": "big",
                        "translation": "to, lớn (kích thước)",
                        "phonetics": "/bɪɡ/",
                        "type": "adjective",
                        "sentence": "This book is very big.",
                        "sentenceTranslation": "Cuốn sách này rất to, lớn (kích thước)."
                    },
                    {
                        "word": "busy",
                        "translation": "bận rộn, nhộn nhịp",
                        "phonetics": "/ˈbɪzi/",
                        "type": "adjective",
                        "sentence": "This book is very busy.",
                        "sentenceTranslation": "Cuốn sách này rất bận rộn, nhộn nhịp."
                    },
                    {
                        "word": "live",
                        "translation": "sống",
                        "phonetics": "/lɪv/",
                        "type": "verb",
                        "sentence": "I can live well.",
                        "sentenceTranslation": "Tớ có thể sống tốt."
                    },
                    {
                        "word": "noisy",
                        "translation": "ồn ào, om sòm, huyên náo",
                        "phonetics": "/ˈnɔɪzi/",
                        "type": "adjective",
                        "sentence": "This book is very noisy.",
                        "sentenceTranslation": "Cuốn sách này rất ồn ào, om sòm, huyên náo."
                    },
                    {
                        "word": "quiet",
                        "translation": "yên tĩnh, tĩnh mịch",
                        "phonetics": "/ˈkwaɪət/",
                        "type": "adjective",
                        "sentence": "This book is very quiet.",
                        "sentenceTranslation": "Cuốn sách này rất yên tĩnh, tĩnh mịch."
                    },
                    {
                        "word": "at, in (+ name of the street / road) (pre)",
                        "translation": "ở, tại",
                        "phonetics": "/ət/, /ɪn/",
                        "type": "noun",
                        "sentence": "Look at that nice at, in (+ name of the street / road) (pre).",
                        "sentenceTranslation": "Hãy nhìn cái ở, tại đẹp đẽ kia."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What is your hometown like? - It's quiet and beautiful.",
                        "vietnamese": "Quê hương bạn trông như thế nào? - Nó yên tĩnh và xinh đẹp."
                    },
                    {
                        "english": "Would you like some noodles? - Yes, please.",
                        "vietnamese": "Bạn có muốn dùng một chút mì không? - Có chứ, cảm ơn."
                    }
                ],
                "grammar": "Mô tả địa điểm bằng \"What is [nơi chốn] like?\" và mời ăn uống bằng \"Would you like...?\".",
                "readingPassageTitle": "My Village Hometown",
                "readingPassage": "I live in a big city, but my hometown is a small village near a beautiful island. The village is very quiet and clean. The air is fresh. I love visiting my hometown in the summer.",
                "questions": {
                    "reading": [
                        {
                            "question": "Where is the writer's hometown?",
                            "options": [
                                "In a big city",
                                "In a small village near an island",
                                "In a noisy town"
                            ],
                            "answer": "In a small village near an island"
                        },
                        {
                            "question": "What is the village like?",
                            "options": [
                                "Noisy and crowded",
                                "Quiet, clean, and beautiful",
                                "Boring and hot"
                            ],
                            "answer": "Quiet, clean, and beautiful"
                        },
                        {
                            "question": "How is the air in the village?",
                            "options": [
                                "Noisy",
                                "Crowded",
                                "Fresh"
                            ],
                            "answer": "Fresh"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "INVMQry3Oi8",
                        "title": "Tiếng Anh lớp 4 Unit 11 - Lesson 1 - Trang 6, 7 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "EmYy3aZwBMU",
                        "title": "Tiếng Anh lớp 4 Unit 11 - Lesson 2 - Trang 8, 9 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "doDDlElXLWw",
                        "title": "Tiếng Anh lớp 4 Unit 11 - Lesson 3 - Trang 10, 11 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    }
                ]
            },
            {
                "id": "eng4-t12",
                "title": "Unit 12: Jobs",
                "subtitle": "Các nghề nghiệp của thành viên gia đình",
                "vocab": [
                    {
                        "word": "actor",
                        "translation": "diễn viên (nam)",
                        "phonetics": "/ˈæktə/",
                        "type": "noun",
                        "sentence": "Look at that nice actor.",
                        "sentenceTranslation": "Hãy nhìn cái diễn viên (nam) đẹp đẽ kia."
                    },
                    {
                        "word": "farmer",
                        "translation": "nông dân",
                        "phonetics": "/ˈfɑːmə/",
                        "type": "noun",
                        "sentence": "Look at that nice farmer.",
                        "sentenceTranslation": "Hãy nhìn cái nông dân đẹp đẽ kia."
                    },
                    {
                        "word": "nurse",
                        "translation": "y tá, điều dưỡng viên",
                        "phonetics": "/nɜːs/",
                        "type": "noun",
                        "sentence": "Look at that nice nurse.",
                        "sentenceTranslation": "Hãy nhìn cái y tá, điều dưỡng viên đẹp đẽ kia."
                    },
                    {
                        "word": "office worker",
                        "translation": "nhân viên văn phòng",
                        "phonetics": "/ˈɒfɪs wɜːkə/",
                        "type": "noun",
                        "sentence": "Look at that nice office worker.",
                        "sentenceTranslation": "Hãy nhìn cái nhân viên văn phòng đẹp đẽ kia."
                    },
                    {
                        "word": "policeman",
                        "translation": "cảnh sát (nam)",
                        "phonetics": "/pəˈliːsmən/",
                        "type": "noun",
                        "sentence": "Look at that nice policeman.",
                        "sentenceTranslation": "Hãy nhìn cái cảnh sát (nam) đẹp đẽ kia."
                    },
                    {
                        "word": "factory",
                        "translation": "nhà máy",
                        "phonetics": "/ˈfæktri/",
                        "type": "noun",
                        "sentence": "Look at that nice factory.",
                        "sentenceTranslation": "Hãy nhìn cái nhà máy đẹp đẽ kia."
                    },
                    {
                        "word": "farm",
                        "translation": "trang trại",
                        "phonetics": "/fɑːm/",
                        "type": "noun",
                        "sentence": "Look at that nice farm.",
                        "sentenceTranslation": "Hãy nhìn cái trang trại đẹp đẽ kia."
                    },
                    {
                        "word": "hospital",
                        "translation": "bệnh viện",
                        "phonetics": "/ˈhɒspɪtl/",
                        "type": "noun",
                        "sentence": "Look at that nice hospital.",
                        "sentenceTranslation": "Hãy nhìn cái bệnh viện đẹp đẽ kia."
                    },
                    {
                        "word": "nursing home",
                        "translation": "viện điều dưỡng",
                        "phonetics": "/ˈnɜːsɪŋ həʊm/",
                        "type": "noun",
                        "sentence": "Look at that nice nursing home.",
                        "sentenceTranslation": "Hãy nhìn cái viện điều dưỡng đẹp đẽ kia."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What does your father do? - He is a doctor.",
                        "vietnamese": "Bố của bạn làm nghề gì? - Bố tớ là bác sĩ."
                    },
                    {
                        "english": "Where does he work? - He works in a hospital.",
                        "vietnamese": "Bố bạn làm việc ở đâu? - Bố làm ở một bệnh viện."
                    }
                ],
                "grammar": "Hỏi nghề nghiệp \"What does [ai đó] do?\" và nơi làm việc \"Where does [ai đó] work?\".",
                "readingPassageTitle": "My Family's Jobs",
                "readingPassage": "My father is a driver. He drives a taxi. My mother is a nurse. She works in a big hospital. My older brother is a worker in a factory. I want to be a teacher like my mother.",
                "questions": {
                    "reading": [
                        {
                            "question": "What does the father do?",
                            "options": [
                                "He is a driver",
                                "He is a worker",
                                "He is a doctor"
                            ],
                            "answer": "He is a driver"
                        },
                        {
                            "question": "Where does the mother work?",
                            "options": [
                                "In a factory",
                                "In a taxi",
                                "In a hospital"
                            ],
                            "answer": "In a hospital"
                        },
                        {
                            "question": "What does the brother do?",
                            "options": [
                                "He is a driver",
                                "He is a worker",
                                "He is a teacher"
                            ],
                            "answer": "He is a worker"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "cGO1kCGPn18",
                        "title": "Tiếng Anh lớp 4 Unit 12 - Lesson 1 - Trang 12, 13 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "cl8kqJskk14",
                        "title": "Tiếng Anh lớp 4 Unit 12 - Lesson 2 - Trang 14, 15 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "iJ-0PBaGtik",
                        "title": "Tiếng Anh lớp 4 Unit 12 - Lesson 3 - Trang 16, 17 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    }
                ]
            },
            {
                "id": "eng4-t13",
                "title": "Unit 13: Appearance",
                "subtitle": "Mô tả ngoại hình của mọi người xung quanh",
                "vocab": [
                    {
                        "word": "big",
                        "translation": "to, lớn (kích thước)",
                        "phonetics": "/bɪɡ/",
                        "type": "adjective",
                        "sentence": "This book is very big.",
                        "sentenceTranslation": "Cuốn sách này rất to, lớn (kích thước)."
                    },
                    {
                        "word": "short",
                        "translation": "thấp, ngắn",
                        "phonetics": "/ʃɔːt/",
                        "type": "adjective",
                        "sentence": "This book is very short.",
                        "sentenceTranslation": "Cuốn sách này rất thấp, ngắn."
                    },
                    {
                        "word": "slim",
                        "translation": "mảnh mai",
                        "phonetics": "/slɪm/",
                        "type": "adjective",
                        "sentence": "This book is very slim.",
                        "sentenceTranslation": "Cuốn sách này rất mảnh mai."
                    },
                    {
                        "word": "tall",
                        "translation": "cao",
                        "phonetics": "/tɔːl/",
                        "type": "adjective",
                        "sentence": "This book is very tall.",
                        "sentenceTranslation": "Cuốn sách này rất cao."
                    },
                    {
                        "word": "eyes",
                        "translation": "mắt",
                        "phonetics": "/aɪ/",
                        "type": "noun",
                        "sentence": "Look at that nice eyes.",
                        "sentenceTranslation": "Hãy nhìn cái mắt đẹp đẽ kia."
                    },
                    {
                        "word": "face",
                        "translation": "khuôn mặt",
                        "phonetics": "/feɪs/",
                        "type": "noun",
                        "sentence": "Look at that nice face.",
                        "sentenceTranslation": "Hãy nhìn cái khuôn mặt đẹp đẽ kia."
                    },
                    {
                        "word": "hair",
                        "translation": "tóc",
                        "phonetics": "/heə/",
                        "type": "noun",
                        "sentence": "Look at that nice hair.",
                        "sentenceTranslation": "Hãy nhìn cái tóc đẹp đẽ kia."
                    },
                    {
                        "word": "long",
                        "translation": "dài",
                        "phonetics": "/lɒŋ/",
                        "type": "adjective",
                        "sentence": "This book is very long.",
                        "sentenceTranslation": "Cuốn sách này rất dài."
                    },
                    {
                        "word": "round",
                        "translation": "tròn",
                        "phonetics": "/raʊnd/",
                        "type": "adjective",
                        "sentence": "This book is very round.",
                        "sentenceTranslation": "Cuốn sách này rất tròn."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What does he look like? - He is tall and slim.",
                        "vietnamese": "Cậu ấy trông như thế nào? - Cậu ấy cao và mảnh khảnh."
                    },
                    {
                        "english": "Who is taller? - My brother is taller than me.",
                        "vietnamese": "Ai cao hơn? - Anh trai tớ cao hơn tớ."
                    }
                ],
                "grammar": "Mô tả ngoại hình \"What does [ai đó] look like?\" và so sánh hơn \"[ai đó] is [tính từ-er] than...\".",
                "readingPassageTitle": "My Family Members",
                "readingPassage": "I look at my family photo. My father is tall and strong. My mother is slim and very beautiful. My brother is young and tall. He is taller than me, but I am slimmer than him.",
                "questions": {
                    "reading": [
                        {
                            "question": "What does the father look like?",
                            "options": [
                                "Slim and young",
                                "Tall and strong",
                                "Short and old"
                            ],
                            "answer": "Tall and strong"
                        },
                        {
                            "question": "Who is taller than the writer?",
                            "options": [
                                "The father only",
                                "The mother",
                                "The brother"
                            ],
                            "answer": "The brother"
                        },
                        {
                            "question": "Who is slimmer?",
                            "options": [
                                "The brother",
                                "The writer",
                                "The father"
                            ],
                            "answer": "The writer"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "uNvE7QzUIHs",
                        "title": "Tiếng Anh lớp 4 Unit 13 - Lesson 1 - Trang 18, 19 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "ttDc75fVxek",
                        "title": "Tiếng Anh lớp 4 Unit 13 - Lesson 2 - Trang 20, 21 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "ktHznyO6W6g",
                        "title": "Tiếng Anh lớp 4 Unit 13 - Lesson 3 - Trang 22, 23 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    }
                ]
            },
            {
                "id": "eng4-t14",
                "title": "Unit 14: My favourite food and drink",
                "subtitle": "Món ăn đồ uống yêu thích và sức khỏe",
                "vocab": [
                    {
                        "word": "afternoon",
                        "translation": "buổi chiều",
                        "phonetics": "/ˌɑːftəˈnuːn/",
                        "type": "noun",
                        "sentence": "Look at that nice afternoon.",
                        "sentenceTranslation": "Hãy nhìn cái buổi chiều đẹp đẽ kia."
                    },
                    {
                        "word": "evening",
                        "translation": "buổi tối",
                        "phonetics": "/ˈi:vnɪŋ/",
                        "type": "noun",
                        "sentence": "Look at that nice evening.",
                        "sentenceTranslation": "Hãy nhìn cái buổi tối đẹp đẽ kia."
                    },
                    {
                        "word": "morning",
                        "translation": "buổi sáng",
                        "phonetics": "/ˈmɔ:nɪŋ/",
                        "type": "noun",
                        "sentence": "Look at that nice morning.",
                        "sentenceTranslation": "Hãy nhìn cái buổi sáng đẹp đẽ kia."
                    },
                    {
                        "word": "noon",
                        "translation": "buổi trưa",
                        "phonetics": "/nu:n/",
                        "type": "noun",
                        "sentence": "Look at that nice noon.",
                        "sentenceTranslation": "Hãy nhìn cái buổi trưa đẹp đẽ kia."
                    },
                    {
                        "word": "clean (the floor) (v)",
                        "translation": "lau (sàn nhà)",
                        "phonetics": "/kli:n (ðə flɔː)/",
                        "type": "noun",
                        "sentence": "Look at that nice clean (the floor) (v).",
                        "sentenceTranslation": "Hãy nhìn cái lau (sàn nhà) đẹp đẽ kia."
                    },
                    {
                        "word": "help with the cooking",
                        "translation": "giúp đỡ việc nấu ăn",
                        "phonetics": "/help wɪð ðə ˈkʊkɪŋ/",
                        "type": "verb",
                        "sentence": "I can help with the cooking well.",
                        "sentenceTranslation": "Tớ có thể giúp đỡ việc nấu ăn tốt."
                    },
                    {
                        "word": "wash (the clothes) (v)",
                        "translation": "giặt (quần áo)",
                        "phonetics": "/wɒʃ (ðə ˈkləʊðz) /",
                        "type": "noun",
                        "sentence": "Look at that nice wash (the clothes) (v).",
                        "sentenceTranslation": "Hãy nhìn cái giặt (quần áo) đẹp đẽ kia."
                    },
                    {
                        "word": "wash (the dishes) (v)",
                        "translation": "rửa (bát đĩa)",
                        "phonetics": "/wɒʃ (ðə ˈdɪʃɪz)/",
                        "type": "noun",
                        "sentence": "Look at that nice wash (the dishes) (v).",
                        "sentenceTranslation": "Hãy nhìn cái rửa (bát đĩa) đẹp đẽ kia."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What is your favorite food? - It's chicken.",
                        "vietnamese": "Món ăn yêu thích của bạn là gì? - Đó là thịt gà."
                    },
                    {
                        "english": "What is your favorite drink? - It's orange juice.",
                        "vietnamese": "Đồ uống yêu thích của bạn là gì? - Đó là nước cam."
                    }
                ],
                "grammar": "Hỏi về đồ ăn yêu thích \"What is your favorite food/drink?\" và diễn tả sự lựa chọn.",
                "readingPassageTitle": "My Favorite Meal",
                "readingPassage": "For lunch, I like eating rice with beef and fish. My favorite food is beef. My sister likes chicken and bread. We always drink orange juice and fresh milk after meals. We like drinking water too.",
                "questions": {
                    "reading": [
                        {
                            "question": "What is the writer's favorite food?",
                            "options": [
                                "Beef",
                                "Chicken",
                                "Fish"
                            ],
                            "answer": "Beef"
                        },
                        {
                            "question": "What does the sister like?",
                            "options": [
                                "Beef and rice",
                                "Chicken and bread",
                                "Orange juice"
                            ],
                            "answer": "Chicken and bread"
                        },
                        {
                            "question": "What do they drink after meals?",
                            "options": [
                                "Water only",
                                "Orange juice and fresh milk",
                                "Tea"
                            ],
                            "answer": "Orange juice and fresh milk"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "SsWM5_Xx6TQ",
                        "title": "Tiếng Anh lớp 4 Unit 14 - Lesson 1 - Trang 24, 25 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "E3mX8mlahQc",
                        "title": "Tiếng Anh lớp 4 Unit 14 - Lesson 2 - Trang 26, 27 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "gOHP_hbkL0Y",
                        "title": "Tiếng Anh lớp 4 Unit 14 - Lesson 3 - Trang 28, 29 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    }
                ]
            },
            {
                "id": "eng4-t15",
                "title": "Unit 15: My family",
                "subtitle": "Các thành viên trong gia đình lớn của em",
                "vocab": [
                    {
                        "word": "cinema",
                        "translation": "rạp chiếu phim",
                        "phonetics": "/ˈsɪnəmə/, /ˈsɪnəmɑː/",
                        "type": "noun",
                        "sentence": "Look at that nice cinema.",
                        "sentenceTranslation": "Hãy nhìn cái rạp chiếu phim đẹp đẽ kia."
                    },
                    {
                        "word": "shopping centre",
                        "translation": "trung tâm mua sắm",
                        "phonetics": "/ˈʃɒpɪŋ sentə/",
                        "type": "noun",
                        "sentence": "Look at that nice shopping centre.",
                        "sentenceTranslation": "Hãy nhìn cái trung tâm mua sắm đẹp đẽ kia."
                    },
                    {
                        "word": "sports centre",
                        "translation": "trung tâm thể thao",
                        "phonetics": "/ˈspɔːts sentə/",
                        "type": "noun",
                        "sentence": "Look at that nice sports centre.",
                        "sentenceTranslation": "Hãy nhìn cái trung tâm thể thao đẹp đẽ kia."
                    },
                    {
                        "word": "swimming pool",
                        "translation": "bể bơi",
                        "phonetics": "/ˈswɪmɪŋ puːl/",
                        "type": "noun",
                        "sentence": "Look at that nice swimming pool.",
                        "sentenceTranslation": "Hãy nhìn cái bể bơi đẹp đẽ kia."
                    },
                    {
                        "word": "cook meals",
                        "translation": "nấu ăn",
                        "phonetics": "/ˈkʊk miːls/",
                        "type": "verb",
                        "sentence": "I can cook meals well.",
                        "sentenceTranslation": "Tớ có thể nấu ăn tốt."
                    },
                    {
                        "word": "do yoga",
                        "translation": "tập yoga",
                        "phonetics": "/duː ˈjəʊɡə/",
                        "type": "verb",
                        "sentence": "I can do yoga well.",
                        "sentenceTranslation": "Tớ có thể tập yoga tốt."
                    },
                    {
                        "word": "play tennis",
                        "translation": "chơi quần vợt",
                        "phonetics": "/pleɪ ˈtenɪs/",
                        "type": "verb",
                        "sentence": "I can play tennis well.",
                        "sentenceTranslation": "Tớ có thể chơi quần vợt tốt."
                    },
                    {
                        "word": "watch films",
                        "translation": "xem phim",
                        "phonetics": "/wɒtʃ fɪlms/",
                        "type": "verb",
                        "sentence": "I can watch films well.",
                        "sentenceTranslation": "Tớ có thể xem phim tốt."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "How many people are there in your family? - There are six people.",
                        "vietnamese": "Có bao nhiêu người trong gia đình bạn? - Có 6 người."
                    },
                    {
                        "english": "What do you do together? - We watch TV.",
                        "vietnamese": "Các bạn làm gì cùng nhau? - Chúng tớ xem tivi."
                    }
                ],
                "grammar": "Hỏi số lượng người bằng \"How many people are there...?\" và diễn tả hoạt động chung.",
                "readingPassageTitle": "My Big Family",
                "readingPassage": "There are six people in my family. They are my grandfather, grandmother, father, mother, sister, and me. We live together. In the evening, we always eat dinner and watch TV together. We love each other.",
                "questions": {
                    "reading": [
                        {
                            "question": "How many people are there in the family?",
                            "options": [
                                "Four",
                                "Five",
                                "Six"
                            ],
                            "answer": "Six"
                        },
                        {
                            "question": "Who is in the family?",
                            "options": [
                                "Grandfather, grandmother, father, mother, sister, and the writer",
                                "Uncle and aunt",
                                "Friends"
                            ],
                            "answer": "Grandfather, grandmother, father, mother, sister, and the writer"
                        },
                        {
                            "question": "What do they do together in the evening?",
                            "options": [
                                "Go shopping",
                                "Eat dinner and watch TV",
                                "Play football"
                            ],
                            "answer": "Eat dinner and watch TV"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "FQ_AS8nfk4s",
                        "title": "Tiếng Anh lớp 4 Unit 15 - Lesson 1 - Trang 30, 31 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "8mFH0hColBA",
                        "title": "Tiếng Anh lớp 4 Unit 15 - Lesson 2 - Trang 32, 33 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "wn_E5qV2bwQ",
                        "title": "Tiếng Anh lớp 4 Unit 15 - Lesson 3 - Trang 34, 35 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "EOqo765kZMM",
                        "title": "Tiếng Anh lớp 4 Review 3 & Extension activities - Trang 36, 37 | Global Success (DỄ HIỂU NHẤT)"
                    }
                ]
            },
            {
                "id": "eng4-t16",
                "title": "Unit 16: Weather",
                "subtitle": "Các mùa trong năm và thời tiết tương ứng",
                "vocab": [
                    {
                        "word": "cloudy",
                        "translation": "có mây, nhiều mây",
                        "phonetics": "/ˈklaʊdi/",
                        "type": "adjective",
                        "sentence": "This book is very cloudy.",
                        "sentenceTranslation": "Cuốn sách này rất có mây, nhiều mây."
                    },
                    {
                        "word": "rainy",
                        "translation": "có mưa",
                        "phonetics": "/ˈreɪni/",
                        "type": "adjective",
                        "sentence": "This book is very rainy.",
                        "sentenceTranslation": "Cuốn sách này rất có mưa."
                    },
                    {
                        "word": "sunny",
                        "translation": "có nắng",
                        "phonetics": "/ˈsʌni/",
                        "type": "adjective",
                        "sentence": "This book is very sunny.",
                        "sentenceTranslation": "Cuốn sách này rất có nắng."
                    },
                    {
                        "word": "weather",
                        "translation": "thời tiết",
                        "phonetics": "/ˈweðə/",
                        "type": "noun",
                        "sentence": "Look at that nice weather.",
                        "sentenceTranslation": "Hãy nhìn cái thời tiết đẹp đẽ kia."
                    },
                    {
                        "word": "windy",
                        "translation": "có gió",
                        "phonetics": "/ˈwɪndi/",
                        "type": "adjective",
                        "sentence": "This book is very windy.",
                        "sentenceTranslation": "Cuốn sách này rất có gió."
                    },
                    {
                        "word": "bakery",
                        "translation": "hiệu bánh mì",
                        "phonetics": "/ˈbeɪkəri/",
                        "type": "noun",
                        "sentence": "Look at that nice bakery.",
                        "sentenceTranslation": "Hãy nhìn cái hiệu bánh mì đẹp đẽ kia."
                    },
                    {
                        "word": "bookshop",
                        "translation": "hiệu sách",
                        "phonetics": "/ˈbʊkʃɒp/",
                        "type": "noun",
                        "sentence": "Look at that nice bookshop.",
                        "sentenceTranslation": "Hãy nhìn cái hiệu sách đẹp đẽ kia."
                    },
                    {
                        "word": "food stall",
                        "translation": "quầy hàng thực phẩm",
                        "phonetics": "/fuːd stɔːl/",
                        "type": "noun",
                        "sentence": "Look at that nice food stall.",
                        "sentenceTranslation": "Hãy nhìn cái quầy hàng thực phẩm đẹp đẽ kia."
                    },
                    {
                        "word": "water park",
                        "translation": "công viên nước",
                        "phonetics": "/ˈwɔːtə pɑːk/",
                        "type": "noun",
                        "sentence": "Look at that nice water park.",
                        "sentenceTranslation": "Hãy nhìn cái công viên nước đẹp đẽ kia."
                    },
                    {
                        "word": "supermarket",
                        "translation": "siêu thị",
                        "phonetics": "/ˈsuːpəmɑːkɪt/",
                        "type": "noun",
                        "sentence": "Look at that nice supermarket.",
                        "sentenceTranslation": "Hãy nhìn cái siêu thị đẹp đẽ kia."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What is the weather like in summer? - It is hot.",
                        "vietnamese": "Thời tiết vào mùa hè như thế nào? - Trời nóng."
                    },
                    {
                        "english": "What do you do in winter? - I stay at home.",
                        "vietnamese": "Bạn làm gì vào mùa đông? - Tớ ở nhà."
                    }
                ],
                "grammar": "Hỏi thời tiết theo mùa \"What is the weather like in [mùa]?\" và hoạt động theo thời tiết.",
                "readingPassageTitle": "Four Seasons",
                "readingPassage": "There are four seasons in Vietnam. In spring, the weather is warm. In summer, it is hot and we go swimming. In autumn, the weather is cool. In winter, it is very cold and we wear coats.",
                "questions": {
                    "reading": [
                        {
                            "question": "How is the weather in spring?",
                            "options": [
                                "Hot",
                                "Warm",
                                "Cold"
                            ],
                            "answer": "Warm"
                        },
                        {
                            "question": "What do they do in summer?",
                            "options": [
                                "Go swimming",
                                "Wear coats",
                                "Stay at home"
                            ],
                            "answer": "Go swimming"
                        },
                        {
                            "question": "How is the weather in autumn?",
                            "options": [
                                "Warm",
                                "Hot",
                                "Cool"
                            ],
                            "answer": "Cool"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "StFSCjI2QiQ",
                        "title": "Tiếng Anh lớp 4 Unit 16 - Lesson 1 - Trang 40, 41 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "sEazm6Im8U8",
                        "title": "Tiếng Anh lớp 4 Unit 16 - Lesson 2 - Trang 42, 43 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "7hCrNH_LEVU",
                        "title": "Tiếng Anh lớp 4 Unit 16 - Lesson 3 - Trang 44, 45 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    }
                ]
            },
            {
                "id": "eng4-t17",
                "title": "Unit 17: In the toy shop",
                "subtitle": "Cửa hàng đồ chơi và mô tả động vật",
                "vocab": [
                    {
                        "word": "get (to) (v)",
                        "translation": "đến (địa điểm)",
                        "phonetics": "/ɡet (tə)/",
                        "type": "noun",
                        "sentence": "Look at that nice get (to) (v).",
                        "sentenceTranslation": "Hãy nhìn cái đến (địa điểm) đẹp đẽ kia."
                    },
                    {
                        "word": "go straight",
                        "translation": "đi thẳng",
                        "phonetics": "/ɡəʊ streɪt/",
                        "type": "verb",
                        "sentence": "I can go straight well.",
                        "sentenceTranslation": "Tớ có thể đi thẳng tốt."
                    },
                    {
                        "word": "left",
                        "translation": "bên trái",
                        "phonetics": "/left/",
                        "type": "noun",
                        "sentence": "Look at that nice left.",
                        "sentenceTranslation": "Hãy nhìn cái bên trái đẹp đẽ kia."
                    },
                    {
                        "word": "right",
                        "translation": "bên phải",
                        "phonetics": "/raɪt/",
                        "type": "noun",
                        "sentence": "Look at that nice right.",
                        "sentenceTranslation": "Hãy nhìn cái bên phải đẹp đẽ kia."
                    },
                    {
                        "word": "stop",
                        "translation": "dừng lại",
                        "phonetics": "/stɒp/",
                        "type": "verb",
                        "sentence": "I can stop well.",
                        "sentenceTranslation": "Tớ có thể dừng lại tốt."
                    },
                    {
                        "word": "turn",
                        "translation": "rẽ",
                        "phonetics": "/tɜːn/",
                        "type": "verb",
                        "sentence": "I can turn well.",
                        "sentenceTranslation": "Tớ có thể rẽ tốt."
                    },
                    {
                        "word": "turn left",
                        "translation": "rẽ trái",
                        "phonetics": "/tɜːn ˈleft/",
                        "type": "verb",
                        "sentence": "I can turn left well.",
                        "sentenceTranslation": "Tớ có thể rẽ trái tốt."
                    },
                    {
                        "word": "turn right",
                        "translation": "rẽ phải",
                        "phonetics": "/tɜːn ˈraɪt/",
                        "type": "verb",
                        "sentence": "I can turn right well.",
                        "sentenceTranslation": "Tớ có thể rẽ phải tốt."
                    },
                    {
                        "word": "turn round",
                        "translation": "quay lại, đổi hướng ngược lại",
                        "phonetics": "/tɜːn ˈraʊnd/",
                        "type": "verb",
                        "sentence": "I can turn round well.",
                        "sentenceTranslation": "Tớ có thể quay lại, đổi hướng ngược lại tốt."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What is that animal like? - It is big and scary.",
                        "vietnamese": "Con vật đó trông như thế nào? - Nó to và đáng sợ."
                    },
                    {
                        "english": "Does it have wings? - Yes, it does.",
                        "vietnamese": "Nó có cánh không? - Có, nó có."
                    }
                ],
                "grammar": "Mô tả con vật bằng cấu trúc \"What is [con vật] like?\" và sở hữu bộ phận \"Does it have...?\".",
                "readingPassageTitle": "Animals at Zoo",
                "readingPassage": "I like watching animals. The elephant is big and has a long tail. The tiger is fast and scary. The bird is small and has beautiful wings. The monkey is funny. They are all wonderful.",
                "questions": {
                    "reading": [
                        {
                            "question": "Which animal is big and has a long tail?",
                            "options": [
                                "The bird",
                                "The monkey",
                                "The elephant"
                            ],
                            "answer": "The elephant"
                        },
                        {
                            "question": "Which animal is fast and scary?",
                            "options": [
                                "The tiger",
                                "The monkey",
                                "The bird"
                            ],
                            "answer": "The tiger"
                        },
                        {
                            "question": "What does the bird have?",
                            "options": [
                                "A long tail",
                                "Beautiful wings",
                                "Big ears"
                            ],
                            "answer": "Beautiful wings"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "NuQ4Ljkl8O8",
                        "title": "Tiếng Anh lớp 4 Unit 17 - Lesson 1 - Trang 46, 47 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "ISuI5df8oYU",
                        "title": "Tiếng Anh lớp 4 Unit 17 - Lesson 2 - Trang 48, 49 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "2VmpLYGSDoo",
                        "title": "Tiếng Anh lớp 4 Unit 17 - Lesson 3 - Trang 50, 51 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    }
                ]
            },
            {
                "id": "eng4-t18",
                "title": "Unit 18: At the shopping mall",
                "subtitle": "Trung tâm mua sắm và trang phục",
                "vocab": [
                    {
                        "word": "behind",
                        "translation": "đằng sau",
                        "phonetics": "/bɪˈhaɪnd/",
                        "type": "pre",
                        "sentence": "Look at that nice behind.",
                        "sentenceTranslation": "Hãy nhìn cái đằng sau đẹp đẽ kia."
                    },
                    {
                        "word": "between",
                        "translation": "ở giữa",
                        "phonetics": "/bɪˈtwiːn/",
                        "type": "pre",
                        "sentence": "Look at that nice between.",
                        "sentenceTranslation": "Hãy nhìn cái ở giữa đẹp đẽ kia."
                    },
                    {
                        "word": "near",
                        "translation": "ở gần",
                        "phonetics": "/nɪə/",
                        "type": "pre",
                        "sentence": "Look at that nice near.",
                        "sentenceTranslation": "Hãy nhìn cái ở gần đẹp đẽ kia."
                    },
                    {
                        "word": "opposite",
                        "translation": "đối diện",
                        "phonetics": "/ˈɒpəzɪt/",
                        "type": "pre",
                        "sentence": "Look at that nice opposite.",
                        "sentenceTranslation": "Hãy nhìn cái đối diện đẹp đẽ kia."
                    },
                    {
                        "word": "gift shop",
                        "translation": "cửa hàng quà tặng",
                        "phonetics": "/ˈɡɪft ʃɒp/",
                        "type": "noun",
                        "sentence": "Look at that nice gift shop.",
                        "sentenceTranslation": "Hãy nhìn cái cửa hàng quà tặng đẹp đẽ kia."
                    },
                    {
                        "word": "skirt",
                        "translation": "váy",
                        "phonetics": "/skɜːt/",
                        "type": "noun",
                        "sentence": "Look at that nice skirt.",
                        "sentenceTranslation": "Hãy nhìn cái váy đẹp đẽ kia."
                    },
                    {
                        "word": "dong",
                        "translation": "đồng (đơn vị tiền tệ của Việt Nam)",
                        "phonetics": "/dɒŋ/",
                        "type": "noun",
                        "sentence": "Look at that nice dong.",
                        "sentenceTranslation": "Hãy nhìn cái đồng (đơn vị tiền tệ của việt nam) đẹp đẽ kia."
                    },
                    {
                        "word": "thousand",
                        "translation": "nghìn",
                        "phonetics": "/ˈθaʊznd/",
                        "type": "noun",
                        "sentence": "Look at that nice thousand.",
                        "sentenceTranslation": "Hãy nhìn cái nghìn đẹp đẽ kia."
                    },
                    {
                        "word": "t-shirt",
                        "translation": "áo thun",
                        "phonetics": "/ˈtiː ʃɜːt/",
                        "type": "noun",
                        "sentence": "Look at that nice t-shirt.",
                        "sentenceTranslation": "Hãy nhìn cái áo thun đẹp đẽ kia."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What are you wearing? - I am wearing a blue jacket.",
                        "vietnamese": "Bạn đang mặc gì vậy? - Tớ đang mặc một chiếc áo khoác màu xanh."
                    },
                    {
                        "english": "How much is this t-shirt? - It's fifty thousand dong.",
                        "vietnamese": "Chiếc áo thun này giá bao nhiêu? - 50.000 đồng."
                    }
                ],
                "grammar": "Mô tả trang phục đang mặc bằng \"I am wearing...\" và hỏi giá cả bằng \"How much is/are...?\".",
                "readingPassageTitle": "My New Clothes",
                "readingPassage": "Today is cold. I am wearing a red coat, black trousers, and warm shoes. My sister is wearing a pink dress and white socks. She wants to buy a new skirt. It costs sixty thousand dong.",
                "questions": {
                    "reading": [
                        {
                            "question": "What is the writer wearing today?",
                            "options": [
                                "A t-shirt and shorts",
                                "A red coat, black trousers, and shoes",
                                "A pink dress"
                            ],
                            "answer": "A red coat, black trousers, and shoes"
                        },
                        {
                            "question": "Who is wearing a pink dress?",
                            "options": [
                                "The writer",
                                "The sister",
                                "The mother"
                            ],
                            "answer": "The sister"
                        },
                        {
                            "question": "How much does the sister's skirt cost?",
                            "options": [
                                "Fifty thousand dong",
                                "Sixty thousand dong",
                                "Seventy thousand dong"
                            ],
                            "answer": "Sixty thousand dong"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "a9TTu-gu4Ss",
                        "title": "Tiếng Anh lớp 4 Unit 18 - Lesson 1 - Trang 52, 53 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "XPy2HwNbGkg",
                        "title": "Tiếng Anh lớp 4 Unit 18 - Lesson 2 - Trang 54, 55 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "-JDkvDf7efo",
                        "title": "Tiếng Anh lớp 4 Unit 18 - Lesson 3 - Trang 56, 57 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    }
                ]
            },
            {
                "id": "eng4-t19",
                "title": "Unit 19: Animal world",
                "subtitle": "Thế giới động vật và hành động của loài vật",
                "vocab": [
                    {
                        "word": "beautifully",
                        "translation": "đẹp đẽ",
                        "phonetics": "/ˈbjuːtɪfli/",
                        "type": "verb",
                        "sentence": "I can beautifully well.",
                        "sentenceTranslation": "Tớ có thể đẹp đẽ tốt."
                    },
                    {
                        "word": "crocodile",
                        "translation": "cá sấu Châu Phi, cá sấu",
                        "phonetics": "/ˈkrɒkədaɪl/",
                        "type": "noun",
                        "sentence": "Look at that nice crocodile.",
                        "sentenceTranslation": "Hãy nhìn cái cá sấu châu phi, cá sấu đẹp đẽ kia."
                    },
                    {
                        "word": "dance",
                        "translation": "nhảy, múa",
                        "phonetics": "/dɑːns /",
                        "type": "noun",
                        "sentence": "Look at that nice dance.",
                        "sentenceTranslation": "Hãy nhìn cái nhảy, múa đẹp đẽ kia."
                    },
                    {
                        "word": "giraffe",
                        "translation": "hươu cao cổ",
                        "phonetics": "/dʒəˈrɑːf/",
                        "type": "noun",
                        "sentence": "Look at that nice giraffe.",
                        "sentenceTranslation": "Hãy nhìn cái hươu cao cổ đẹp đẽ kia."
                    },
                    {
                        "word": "hippo",
                        "translation": "hà mã, lợn nước",
                        "phonetics": "/ˈhɪpəʊ/",
                        "type": "noun",
                        "sentence": "Look at that nice hippo.",
                        "sentenceTranslation": "Hãy nhìn cái hà mã, lợn nước đẹp đẽ kia."
                    },
                    {
                        "word": "lion",
                        "translation": "con sư tử",
                        "phonetics": "/ˈlaɪən/",
                        "type": "noun",
                        "sentence": "Look at that nice lion.",
                        "sentenceTranslation": "Hãy nhìn cái con sư tử đẹp đẽ kia."
                    },
                    {
                        "word": "loudly",
                        "translation": "ầm ĩ, inh ỏi",
                        "phonetics": "/ˈlaʊdli/",
                        "type": "verb",
                        "sentence": "I can loudly well.",
                        "sentenceTranslation": "Tớ có thể ầm ĩ, inh ỏi tốt."
                    },
                    {
                        "word": "merrily",
                        "translation": "vui, vui vẻ",
                        "phonetics": "/ˈmerəli/",
                        "type": "verb",
                        "sentence": "I can merrily well.",
                        "sentenceTranslation": "Tớ có thể vui, vui vẻ tốt."
                    },
                    {
                        "word": "quickly",
                        "translation": "nhanh",
                        "phonetics": "/ˈkwɪkli/",
                        "type": "verb",
                        "sentence": "I can quickly well.",
                        "sentenceTranslation": "Tớ có thể nhanh tốt."
                    },
                    {
                        "word": "roar",
                        "translation": "gầm, rống lên (hổ, sư tử …)",
                        "phonetics": "/rɔː/",
                        "type": "verb",
                        "sentence": "I can roar well.",
                        "sentenceTranslation": "Tớ có thể gầm, rống lên (hổ, sư tử …) tốt."
                    },
                    {
                        "word": "run",
                        "translation": "chạy",
                        "phonetics": "/rʌn/",
                        "type": "verb",
                        "sentence": "I can run well.",
                        "sentenceTranslation": "Tớ có thể chạy tốt."
                    },
                    {
                        "word": "sing",
                        "translation": "hát",
                        "phonetics": "/sɪŋ",
                        "type": "verb",
                        "sentence": "I can sing well.",
                        "sentenceTranslation": "Tớ có thể hát tốt."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What did the monkeys do when you were there? - They swung.",
                        "vietnamese": "Lũ khỉ đã làm gì khi bạn ở đó? - Chúng đu dây."
                    },
                    {
                        "english": "I heard the python slide.",
                        "vietnamese": "Tớ đã nghe thấy con trăn trườn."
                    }
                ],
                "grammar": "Mô tả hành động của con vật trong quá khứ bằng thì quá khứ đơn (swung, roared, walked, slid).",
                "readingPassageTitle": "A Trip to the Zoo",
                "readingPassage": "Last weekend, we went to the zoo. We saw many animals. The monkeys swung from tree to tree. The pythons slid quietly on the grass. The tigers roared loudly. We had a great time watching them.",
                "questions": {
                    "reading": [
                        {
                            "question": "When did they go to the zoo?",
                            "options": [
                                "Yesterday",
                                "Last weekend",
                                "Last month"
                            ],
                            "answer": "Last weekend"
                        },
                        {
                            "question": "What did the monkeys do?",
                            "options": [
                                "Roared loudly",
                                "Slid quietly",
                                "Swung from tree to tree"
                            ],
                            "answer": "Swung from tree to tree"
                        },
                        {
                            "question": "How did the pythons move?",
                            "options": [
                                "They jumped",
                                "They slid quietly",
                                "They walked"
                            ],
                            "answer": "They slid quietly"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "_9ZSjzQQb_0",
                        "title": "Tiếng Anh lớp 4 Unit 19 - Lesson 1 - Trang 58, 59 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "wnn8UUYWCgQ",
                        "title": "Tiếng Anh lớp 4 Unit 19 - Lesson 2 - Trang 60, 61 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "LsnGIA08v8s",
                        "title": "Tiếng Anh lớp 4 Unit 19 - Lesson 3 - Trang 62, 63 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    }
                ]
            },
            {
                "id": "eng4-t20",
                "title": "Unit 20: At summer camp",
                "subtitle": "Hoạt động cắm trại hè và kế hoạch tương lai",
                "vocab": [
                    {
                        "word": "build a campfire",
                        "translation": "đốt lửa trại",
                        "phonetics": "/bɪld ə ˈkæmpfaɪə/",
                        "type": "verb",
                        "sentence": "I can build a campfire well.",
                        "sentenceTranslation": "Tớ có thể đốt lửa trại tốt."
                    },
                    {
                        "word": "play card games",
                        "translation": "chơi bài",
                        "phonetics": "/pleɪ ˈkɑːd ɡeɪmz/",
                        "type": "verb",
                        "sentence": "I can play card games well.",
                        "sentenceTranslation": "Tớ có thể chơi bài tốt."
                    },
                    {
                        "word": "put up a tent",
                        "translation": "dựng, cắm trại, lều",
                        "phonetics": "/pʊt ʌp ə ˈtent/",
                        "type": "verb",
                        "sentence": "I can put up a tent well.",
                        "sentenceTranslation": "Tớ có thể dựng, cắm trại, lều tốt."
                    },
                    {
                        "word": "sing songs",
                        "translation": "hát",
                        "phonetics": "/sɪŋ sɒŋz/",
                        "type": "verb",
                        "sentence": "I can sing songs well.",
                        "sentenceTranslation": "Tớ có thể hát tốt."
                    },
                    {
                        "word": "take a photo",
                        "translation": "chụp ảnh",
                        "phonetics": "/teɪk ə ˈfəʊtəʊ/",
                        "type": "verb",
                        "sentence": "I can take a photo well.",
                        "sentenceTranslation": "Tớ có thể chụp ảnh tốt."
                    },
                    {
                        "word": "tell a story",
                        "translation": "kể chuyện",
                        "phonetics": "/tel ə ˈstɔːri/",
                        "type": "verb",
                        "sentence": "I can tell a story well.",
                        "sentenceTranslation": "Tớ có thể kể chuyện tốt."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What are you going to do this summer? - I am going to visit Phu Quoc.",
                        "vietnamese": "Hè này bạn định làm gì? - Tớ định đi thăm Phú Quốc."
                    },
                    {
                        "english": "Where are you going to stay? - In a hotel.",
                        "vietnamese": "Bạn định ở đâu? - Ở trong một khách sạn."
                    }
                ],
                "grammar": "Diễn đạt kế hoạch tương lai bằng cấu trúc \"be going to + V\" (am/is/are going to).",
                "readingPassageTitle": "My Summer Plan",
                "readingPassage": "This summer, my family is going to visit Ha Long Bay. We are going to stay in a hotel near the sea. We are going to go on a boat cruise, eat fresh seafood, and build sandcastles. It will be exciting!",
                "questions": {
                    "reading": [
                        {
                            "question": "Where is the family going to go this summer?",
                            "options": [
                                "To Phu Quoc",
                                "To Ha Long Bay",
                                "To Nha Trang"
                            ],
                            "answer": "To Ha Long Bay"
                        },
                        {
                            "question": "Where are they going to stay?",
                            "options": [
                                "In a camp",
                                "In a hotel near the sea",
                                "In a village"
                            ],
                            "answer": "In a hotel near the sea"
                        },
                        {
                            "question": "What activities are they going to do?",
                            "options": [
                                "Go on a boat cruise, eat seafood, and build sandcastles",
                                "Play chess and study",
                                "Ride bikes"
                            ],
                            "answer": "Go on a boat cruise, eat seafood, and build sandcastles"
                        }
                    ]
                },
                "videos": [
                    {
                        "id": "7cWkEf-MgPg",
                        "title": "Tiếng Anh lớp 4 Unit 20 - Lesson 1 - Trang 64, 65 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "Qg1XcSXKvpQ",
                        "title": "Tiếng Anh lớp 4 Unit 20 - Lesson 2 - Trang 66, 67 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "x1iZdDlYoG8",
                        "title": "Tiếng Anh lớp 4 Unit 20 - Lesson 3 - Trang 68, 69 | Global Success | Tập 2 (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "lwHAtlou8yo",
                        "title": "Tiếng Anh lớp 4 Review 4 & Extension activities - Trang 70, 73 | Global Success (DỄ HIỂU NHẤT)"
                    }
                ]
            }
        ]
    },
    "6": {
        "levelLabel": "KET / PET & Lớp 7 Nâng cao",
        "topics": [
            {
                "id": "eng6-t1",
                "title": "Unit 1: My New School",
                "subtitle": "Học từ vựng trường học và các thì hiện tại",
                "vocab": [
                    {
                        "word": "activity",
                        "translation": "hoạt động",
                        "phonetics": "/ækˈtɪv.ə.ti/",
                        "type": "noun",
                        "sentence": "Outdoor activities are good for our health.",
                        "sentenceTranslation": "Các hoạt động ngoài trời rất tốt cho sức khỏe của chúng ta."
                    },
                    {
                        "word": "art",
                        "translation": "nghệ thuật",
                        "phonetics": "/ɑːt/",
                        "type": "noun",
                        "sentence": "I can see a beautiful art in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người nghệ thuật tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "boarding school",
                        "translation": "trường nội trú",
                        "phonetics": "/ˈbɔː.dɪŋ ˌskuːl/",
                        "type": "noun",
                        "sentence": "Studying at a boarding school helps me become independent.",
                        "sentenceTranslation": "Học tập ở trường nội trú giúp tớ trở nên tự lập."
                    },
                    {
                        "word": "calculator",
                        "translation": "máy tính",
                        "phonetics": "/ˈkæl.kjə.leɪ.tər/",
                        "type": "noun",
                        "sentence": "I have a new calculator for Maths class.",
                        "sentenceTranslation": "Tớ có một chiếc máy tính bỏ túi mới cho tiết học Toán."
                    },
                    {
                        "word": "classmate",
                        "translation": "bạn cùng lớp",
                        "phonetics": "/ˈklɑːs.meɪt/",
                        "type": "noun",
                        "sentence": "Nam is a friendly classmate of mine.",
                        "sentenceTranslation": "Nam là một người bạn cùng lớp rất thân thiện của tớ."
                    },
                    {
                        "word": "compass",
                        "translation": "com-pa",
                        "phonetics": "/ˈkʌm.pəs/",
                        "type": "noun",
                        "sentence": "We use a compass to draw circles in geometry.",
                        "sentenceTranslation": "Chúng tớ dùng com-pa để vẽ các hình tròn trong hình học."
                    },
                    {
                        "word": "favourite",
                        "translation": "được yêu thích",
                        "phonetics": "/ˈfeɪ.vər.ɪt/",
                        "type": "adjective",
                        "sentence": "We want to favourite together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau được yêu thích vào cuối tuần này."
                    },
                    {
                        "word": "help",
                        "translation": "sự giúp đỡ, giúp đỡ",
                        "phonetics": "/help/",
                        "type": "n, v",
                        "sentence": "I can see a beautiful help in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người sự giúp đỡ, giúp đỡ tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "international",
                        "translation": "quốc tế",
                        "phonetics": "/ˌɪn.təˈnæʃ.ən.əl/",
                        "type": "ad",
                        "sentence": "We learn the word \"international\" in our English class.",
                        "sentenceTranslation": "Chúng tớ học từ \"quốc tế\" trong giờ học tiếng Anh."
                    },
                    {
                        "word": "interview",
                        "translation": "cuộc phỏng vấn, phỏng vấn",
                        "phonetics": "/ˈɪn.tə.vjuː/",
                        "type": "n, v",
                        "sentence": "I can see a beautiful interview in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người cuộc phỏng vấn, phỏng vấn tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "knock",
                        "translation": "gõ (cửa)",
                        "phonetics": "/nɒk/",
                        "type": "verb",
                        "sentence": "We want to knock together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau gõ (cửa) vào cuối tuần này."
                    },
                    {
                        "word": "remember",
                        "translation": "nhớ, ghi nhớ",
                        "phonetics": "/rɪˈmem.bər/",
                        "type": "verb",
                        "sentence": "We want to remember together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau nhớ, ghi nhớ vào cuối tuần này."
                    },
                    {
                        "word": "share",
                        "translation": "chia sẻ",
                        "phonetics": "/ʃeər/",
                        "type": "verb",
                        "sentence": "We want to share together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau chia sẻ vào cuối tuần này."
                    },
                    {
                        "word": "smart",
                        "translation": "bảnh bao, gọn gàng",
                        "phonetics": "/smɑːt/",
                        "type": "adjective",
                        "sentence": "We want to smart together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau bảnh bao, gọn gàng vào cuối tuần này."
                    },
                    {
                        "word": "swimming pool",
                        "translation": "bể bơi",
                        "phonetics": "/ˈswɪm.ɪŋ ˌpuːl/",
                        "type": "noun",
                        "sentence": "I can see a beautiful swimming pool in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người bể bơi tuyệt đẹp trong bức tranh này."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What are you doing? - I am studying English in the library.",
                        "vietnamese": "Cậu đang làm gì thế? - Tớ đang học Tiếng Anh trong thư viện."
                    },
                    {
                        "english": "Do you wear uniform on Mondays? - Yes, we do.",
                        "vietnamese": "Các cậu có mặc đồng phục vào thứ Hai không? - Có, chúng tớ có."
                    }
                ],
                "grammar": "<p><strong>A. GRAMMAR</strong></p>\n<p><strong>I. Present simple (Hiện tại đơn)</strong></p>\n<p><strong>1. Hiện tại đơn là gì?</strong></p>\n<p><strong>        Hiện tại đơn </strong>(Simple Present hoặc Present Simple) là một trong 12 thì tiếng Anh được dung để diễn tả hành động xảy ra ở hiện tại, một sự thật hiển nhiên, hành động lặp đi lặp lại, hay những thói quen, tính cách con người. Hiện tại đơn thuộc nhóm thì hiện tại chính trong tiếng Anh cùng với thì hiện tại tiếp diễn và thì hiện tại hoàn thành với vai trò mô tả các trạng thái và hành động diễn ra trong thời điểm hiện tại. </p>\n<p><strong>2. Công thức thì hiện tại đơn</strong></p>\n<p><strong>a. Thể khẳng định</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"22%\">\n<p><strong> </strong></p>\n</td>\n<td valign=\"top\" width=\"31%\">\n<p style=\"text-align:center;\"><strong>Công thức</strong></p>\n</td>\n<td valign=\"top\" width=\"45%\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"22%\">\n<p><strong>Động từ thường</strong></p>\n</td>\n<td valign=\"top\" width=\"31%\">\n<p><strong>S + V(-s/-es) + O/A</strong></p>\n</td>\n<td valign=\"top\" width=\"45%\">\n<p>He reads a book every night. (Anh ấy đọc sách mỗi tối.)</p>\n<p>Natural milk of mamals contains lactose. (Sữa tự nhiên của động vật có vú có chứa đường lactose.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"22%\">\n<p><strong>Động từ tobe</strong></p>\n</td>\n<td valign=\"top\" width=\"31%\">\n<p><strong>S + am / is / are</strong></p>\n</td>\n<td valign=\"top\" width=\"45%\">\n<p>It is a sunny day. (Hôm nay là một ngày nắng.)</p>\n<p>These flowers are beautiful. (Những bông hoa này rất đẹp.)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>b. Thể phủ định</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"22%\">\n<p><strong> </strong></p>\n</td>\n<td valign=\"top\" width=\"31%\">\n<p style=\"text-align:center;\"><strong>Công thức</strong></p>\n</td>\n<td valign=\"top\" width=\"45%\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"22%\">\n<p><strong>Động từ thường</strong></p>\n</td>\n<td valign=\"top\" width=\"31%\">\n<p><strong>S + do/does + not + V + O/A</strong></p>\n</td>\n<td valign=\"top\" width=\"45%\">\n<p>I don’t play football. (Tôi không chơi bóng đá.)</p>\n<p>He doesn’t go to school on Sundays. (Anh ấy không đi học vào ngày chủ nhật.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"22%\">\n<p><strong>Động từ tobe</strong></p>\n</td>\n<td valign=\"top\" width=\"31%\">\n<p><strong>S + am / are / is + not + N/Adj</strong></p>\n</td>\n<td valign=\"top\" width=\"45%\">\n<p>My dad is not a doctor. (Bố tôi không phải là bác sĩ.)</p>\n<p>These books are not interesting. (Những cuốn sách này không thú vị.)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>c. Thể nghi vấn của thì hiện tại đơn</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"22%\">\n\n</td>\n<td valign=\"top\" width=\"32%\">\n<p style=\"text-align:center;\"><strong>Công thức</strong></p>\n</td>\n<td valign=\"top\" width=\"45%\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td rowspan=\"2\" valign=\"top\" width=\"22%\">\n<p><strong>Câu hỏi Yes/ No</strong></p>\n</td>\n<td valign=\"top\" width=\"32%\">\n<p><strong>Q: Do/Does (not) + S + V + O/A?</strong></p>\n<p><strong>A: - Yes, S + do/does.</strong></p>\n<p><strong>- No, S + don’t/doesn’t.</strong></p>\n</td>\n<td valign=\"top\" width=\"45%\">\n<p><strong>Q:</strong> Do you play badminton every Saturday? <em>(Bạn có chơi cầu lông mỗi thứ Bảy không?)</em><br /><strong>A:</strong> No, I don’t. <em>(Không, tôi không chơi.)</em></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"32%\">\n<p><strong>Q: Am / Are / Is (not) + S + N / Adj?</strong></p>\n<p><strong>A: - Yes, S + am / are / is</strong></p>\n<p>- <strong>No, S + am not / aren’t / isn’t</strong></p>\n</td>\n<td valign=\"top\" width=\"45%\">\n<p><strong>Q:</strong> Is this your phone? <em>(Đây có phải điện thoại của bạn không?)</em><br /><strong>A:</strong> Yes, it is. <em>(Đúng vậy.)</em></p>\n</td>\n</tr>\n<tr>\n<td rowspan=\"2\" valign=\"top\" width=\"22%\">\n<p><strong>Câu hỏi bắt đầu bằng Wh- (từ để hỏi)</strong></p>\n</td>\n<td valign=\"top\" width=\"32%\">\n<p><strong>Wh- + do/does (not) + S + V (nguyên thể) …?</strong></p>\n</td>\n<td valign=\"top\" width=\"45%\">\n<p><strong>Q:</strong> What does your father do?<br />(Bố bạn làm nghề gì?)</p>\n<p><strong>Q:</strong> What does she usually eat for breakfast?<br />(Cô ấy thường ăn gì vào bữa sáng?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"32%\">\n<p><strong>Wh- + am/are/is (not) + S + N/Adj?</strong></p>\n</td>\n<td valign=\"top\" width=\"45%\">\n<p><strong>Q:</strong> Where are the best places to eat in this town?<br />(Những nơi ăn ngon nhất trong thị trấn này là ở đâu?)</p>\n<p><strong>Q:</strong> Where is the nearest bookstore?<br />(Nhà sách gần nhất ở đâu?)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>3. Cách dùng của thì hiện tại đơn</strong></p>\n<p><strong>a. Diễn tả những hành động, sự việc diễn ra lặp đi lặp lại, thường xuyên hay một thói quen thường nhật. </strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:  </strong>I brush my teeth twice a day. (Tôi đánh rang hai lần mỗi ngày.)</p>\n<p>           He reads the newspaper every morning. (Anh ấy đọc báo mỗi sáng.)</p>\n<p>             She goes to school by bike. (Cô ấy đi học bằng xe đạp.)</p>\n<p><strong style=\"color: #c00000;\">Lưu ý: </strong><em>Khi diễn tả một lời phàn nàn, ta thường dùng cấu trúc <strong>S + to be + always + Ving</strong> thay vì dùng với thì hiện tại đơn. (Eg. He is always coming to class late, which makes the homeroom teacher annoyed. – Anh ấy luôn đi học trễ, điều đó khiến giáo viên chủ nhiệm bực mình.)</em></p>\n<p><strong>b. Diễn tả một sự thật, một chân lý.</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:  </strong>Water boils at 100 degrees Celsius. (Nước sôi ở 100 độ C.)</p>\n<p>           The Earth orbits the Sun. (Trái Đất quay quanh Mặt Trời.)</p>\n<p>Water covers about 71% of the Earth’s surface, making it one of the most essential resources for life. (Nước bao phủ khoảng 71% bề mặt Trái Đất, khiến nó trở thành một trong những nguồn tài nguyên thiết yếu nhất cho sự sống.)</p>\n<p><strong>c. Diễn tả những sự sắp xếp thời gian, cố định và khó có khả năng thay đổi như lịch tàu, xe, máy bay, lịch học, lịch trình du lịch.</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:  </strong>The museum opens at 8 a.m and closes at 5 p.m on weekdays. (Bảo tàng mở cửa lúc 8 giờ sáng và đóng cửa lúc 5 giờ chiều các ngày trong tuần.)</p>\n<p>           Our tour bus picks up at 6:30 tomorrow morning in front of the hotel. (Xe du lịch đón chúng tôi lúc 6 giờ 30 sáng mai trước khách sạn.)</p>\n<p>           Her flight to Tokyo lands at 6 a.m the day after tomorrow. (Chuyến bay của cô ấy đến Tokyo hạ cánh lúc 6 giờ sáng ngày kia.)</p>\n<p><strong>d. Diễn tả trạng thái, cảm giác cảm xúc của một chủ thể ngay tại thời điểm nói. </strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:  </strong>I feel so tired after that long meeting. (Tôi cảm thấy quá mệt sau buổi họp dài lê thê.)</p>\n<p>           She is very nervous because the exam results are coming out today. (Cô ấy đang rất lo lắng vì hôm nay có kết quả thi.)</p>\n<p>           You look so happy today! Did something good happen? (Hôm nay cậu trông có vẻ vui thế! Có chuyện gì vui à?)</p>\n<p><strong>e. Diễn tả các hướng dẫn, chỉ dẫn</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong> Turn off the lights when you leave the room. (Tắt đèn khi ra khỏi phòng.)</p>\n<p>           Boil the water, then add the noodles and cook for 3 minutes. (Đun sôi nước rồi cho mỳ vào nấu 3 phút.)</p>\n<p>           Take the second left, and the bookstore is on your right. (Rẽ trái ở ngã ba thứ hai, tiệm sách sẽ nằm bên tay phải.)</p>\n<p><strong>f. Sử dụng trong câu điều kiện loại I</strong></p>\n<p>Công thức câu điều kiện loại I, </p>\n<p style=\"text-align:center;\"><strong style=\"background:yellow;\">If + S + V (hiện tại đơn), S + will + V (nguyên mẫu)</strong></p>\n<p>Trong câu điều kiện loại I, mệnh đề chứa <strong>If</strong> sử dụng thì hiện tại đơn. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:  </strong>If it rains tomorrow, we will cancel the picnic. (Nếu mai mưa, chúng ta sẽ hủy buổi picnic.)</p>\n<p>            If my dog sees strangers, it barks. (Nếu con chó của tôi thấy người lạ, nó sẽ sủa.)</p>\n<p>  If you don’t water the plants, they will die. (Nếu bạn không tưới cây, chúng sẽ chết.)</p>\n<p><strong>4. Dấu hiệu nhận biết của thì hiện tại đơn</strong></p>\n<p><strong>a. Trong câu có các trạng từ chỉ tần suất</strong></p>\n<p>- Always/ like clockwork: luôn luôn</p>\n<p>- Usually/ often/ frequently/ regularly: thường xuyên</p>\n<p>- Sometimes/ now and then: thỉnh thoảng</p>\n<p>- Seldom/ hardly: hiếm khi</p>\n<p>- Never: không bao giờ</p>\n<p>- Generally: nhìn chung</p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong>  We often go to the park on Sundays. (Chúng tôi thường đi công viên vào chủ nhật.)</p>\n<p>            They rarely eat out because they prefer home-cooked meals. (Họ hiếm khi ăn ngoài vì thích đồ ăn nhà nấu hơn.)</p>\n<p>            My teacher generally checks homework at the beginning of class. (Cô giáo tôi thường kiểm tra bài tập đầu giờ.)</p>\n<p><strong>b. Trong câu có các cụm từ chỉ sự lặp đi lặp lại. </strong></p>\n<p>- Every day/ week/ month/ year: mỗi ngày, mỗi tuần, mỗi tháng, mỗi năm</p>\n<p>- Daily/ weekly/ monthly/ quarterly/ yearly: hàng ngày, hàng tuần, hàng tháng, hàng quý, hàng năm.</p>\n<p>- Once/ twice/ three/ four times … a day/ week/ month/ year: một lần, hai lần, ba lần, bốn lần … mỗi ngày/ tuần/ tháng/ năm)</p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> I go jogging every morning before school. (Tôi chạy bộ mỗi sáng trước khi đi học.)</p>\n<p>           We hold class meeting weekly to discuss group tasks. (Chúng tôi họp lớp hàng tuần để thảo luận nhiệm vụ nhóm.)</p>\n<p>           She brushes her teeth twice a day. (Cô ấy đánh răng hai lần mỗi ngày.)</p>\n<p><strong>5. Quy tắc chia động từ ở thì hiện tại đơn</strong></p>\n<p><strong>a. Chia động từ thì hiện tại đơn với động từ tobe</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"23%\">\n<p style=\"text-align:center;\"><strong>Thể</strong></p>\n</td>\n<td valign=\"top\" width=\"34%\">\n<p style=\"text-align:center;\"><strong>Công thức</strong></p>\n</td>\n<td valign=\"top\" width=\"41%\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"23%\">\n<p><strong>Khẳng định</strong></p>\n</td>\n<td valign=\"top\" width=\"34%\">\n<p><strong>S + am/is/are + … </strong></p>\n</td>\n<td valign=\"top\" width=\"41%\">\n<p>He is my best friend. (Cậu ấy là bạn thân nhất của tôi.)</p>\n<p>They are in the classroom. (Họ đang ở trong lớp học.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"23%\">\n<p><strong>Phủ định</strong></p>\n</td>\n<td valign=\"top\" width=\"34%\">\n<p><strong>S + am not/ isn’t/ aren’t + …</strong></p>\n</td>\n<td valign=\"top\" width=\"41%\">\n<p>I am not tired. (Tôi không mệt.)</p>\n<p>We aren’t ready yet. (Chúng tôi chưa sẵn sàng)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"23%\">\n<p><strong>Nghi vấn </strong></p>\n</td>\n<td valign=\"top\" width=\"34%\">\n<p><strong>Am/ Is/ Are + S + …?</strong></p>\n</td>\n<td valign=\"top\" width=\"41%\">\n<p>Is she your teacher? (Cô ấy là giáo viên của bạn phải không?)</p>\n<p>Are you from Vietnam? (Bạn đến từ Việt Nam phải không?)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong style=\"color: #c00000;\">Lưu ý:</strong> Cách chia động từ tobe theo chủ ngữ: </p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr>\n<td valign=\"top\" width=\"80%\">\n<p><strong>I </strong></p>\n</td>\n<td valign=\"top\" width=\"19%\">\n<p><strong>am</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"80%\">\n<p><strong>You/ We/ They/ Danh từ đếm được ở số nhiều</strong></p>\n</td>\n<td valign=\"top\" width=\"19%\">\n<p><strong>are</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"80%\">\n<p><strong>He/ She/ It/ Danh từ đếm được ở số ít/ Danh từ không đếm được</strong></p>\n</td>\n<td valign=\"top\" width=\"19%\">\n<p><strong>is</strong></p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>b. Chia động từ thì hiện tại đơn với động từ thường</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"23%\">\n<p style=\"text-align:center;\"><strong>Thể</strong></p>\n</td>\n<td valign=\"top\" width=\"34%\">\n<p style=\"text-align:center;\"><strong>Công thức</strong></p>\n</td>\n<td valign=\"top\" width=\"41%\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"23%\">\n<p><strong>Khẳng định</strong></p>\n</td>\n<td valign=\"top\" width=\"34%\">\n<p><strong>S + V/ Vs/es</strong></p>\n</td>\n<td valign=\"top\" width=\"41%\">\n<p>I play football every Sunday. (Tôi chơi bóng đá mỗi chủ nhật.)</p>\n<p>She watches TV after dinner. (Cô ấy xem tivi sau bữa tối.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"23%\">\n<p><strong>Phủ định</strong></p>\n</td>\n<td valign=\"top\" width=\"34%\">\n<p><strong>S + don’t/ doesn’t + V</strong></p>\n</td>\n<td valign=\"top\" width=\"41%\">\n<p>They don’t like spicy food. (Họ không thích đồ ăn cay.)</p>\n<p>He doesn’t go to school on Saturdays. (Cậu ấy không đi học vào thứ Bảy.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"23%\">\n<p><strong>Nghi vấn</strong></p>\n</td>\n<td valign=\"top\" width=\"34%\">\n<p><strong>Do/ Does + S + V? </strong></p>\n</td>\n<td valign=\"top\" width=\"41%\">\n<p>Do you study English every day? (Bạn có học tiếng Anh mỗi ngày không?)</p>\n<p>Does your sister cook dinner? (Chị/em gái bạn có nấu bữa tối không?)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong style=\"color: #c00000;\">Lưu ý 1: Cách sử dụng trợ động từ theo chủ ngữ:</strong></p>\n<p>• She/ He/ It + <strong>doesn’t </strong>+ …; <strong>Does</strong> + she/ he/ it + …?</p>\n<p>• I/ You/ We/ They + <strong>don’t</strong> + …; <strong>Do</strong> + I/ You/ We/ They + …?</p>\n<p><strong style=\"color: #c00000;\">Lưu ý 2:</strong> <strong>Cách chia động từ theo chủ ngữ:</strong> </p>\n<p>• I/ You/ We/ They + <strong>V</strong></p>\n<p>• She/ He/ It + <strong>Vs/es</strong></p>\n<p><strong>Trong đó:</strong> Thêm “es” vào sau các từ tận cùng là “o,s,x,z,ch,sh”. Thêm “s” vào sau các từ còn lại. </p>\n<p><strong>Ví dụ:</strong>  watch → watches</p>\n<p>fix → fixes</p>\n<p>kiss → kisses</p>\n<p>wash → washes </p>\n<p><strong style=\"color: #c00000;\">Lưu ý 3: Các động từ tận cùng là “y”, trước y là một nguyên âm (u, e, o, a, i) thì giữ nguyên “y” và them “s”. Các động từ tận cùng là “y”, trước y là một phụ âm thì biến đổi “y” thành “ies”.</strong></p>\n<p><strong>Ví dụ:</strong>  Buy → buys</p>\n<p>           Play → plays</p>\n<p>           Fly → flies</p>\n<p>           Study → studies </p>\n<p><strong>II. Adverbs of frequency (Trạng từ chỉ tần xuất)</strong></p>\n<p><strong>1. Trạng từ chỉ tần xuất là gì?</strong></p>\n<p><strong>        Trạng từ chỉ tần suất</strong> (Adverbs of frequency) là những trạng từ thường được dùng để diễn tả mức độ thường xuyên hoặc không thường xuyên của một sự việc hoặc hành động được nhắc đến trong câu. Những trạng từ này thường được dùng để trả lời cho câu hỏi “How often” hoặc “How frequently”. Vì hầu hết các trạng từ chỉ tần suất trong Tiếng Anh thường được áp dụng cho những hành động lặp đi lặp lại, chúng ta sẽ bắt gặp chúng được sử dụng trong thì Hiện tại đơn (Simple Present).</p>\n<p><strong style=\"color: #c00000;\">Ví dụ:  </strong>She usually drinks coffee in the morning. (Cô ấy thường uống cà phê vào buổi sáng.)</p>\n<p>            He sometimes forgets his homework. (Cậy ấy thỉnh thoảng quên bài tập về nhà.)</p>\n<table class=\"MsoTable15Plain1\" border=\"1\">\n<tbody>\n<tr>\n<td valign=\"top\" width=\"23%\">\n<p style=\"text-align:center;\"><strong>Mức độ (%)</strong></p>\n</td>\n<td valign=\"top\" width=\"38%\">\n<p style=\"text-align:center;\"><strong>Trạng từ tần suất</strong></p>\n</td>\n<td valign=\"top\" width=\"37%\">\n<p style=\"text-align:center;\"><strong>Nghĩa của trạng từ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"23%\">\n<p><strong>100</strong></p>\n</td>\n<td valign=\"top\" width=\"38%\">\n<p>Always</p>\n</td>\n<td valign=\"top\" width=\"37%\">\n<p>Luôn</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"23%\">\n<p><strong>90</strong></p>\n</td>\n<td valign=\"top\" width=\"38%\">\n<p>Usually</p>\n</td>\n<td valign=\"top\" width=\"37%\">\n<p>Thường xuyên</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"23%\">\n<p><strong>80</strong></p>\n</td>\n<td valign=\"top\" width=\"38%\">\n<p>Normally/ Generally</p>\n</td>\n<td valign=\"top\" width=\"37%\">\n<p>Thông thường, theo lệ</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"23%\">\n<p><strong>70</strong></p>\n</td>\n<td valign=\"top\" width=\"38%\">\n<p>Often/ Frequently</p>\n</td>\n<td valign=\"top\" width=\"37%\">\n<p>Thường</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"23%\">\n<p><strong>50</strong></p>\n</td>\n<td valign=\"top\" width=\"38%\">\n<p>Sometimes </p>\n</td>\n<td valign=\"top\" width=\"37%\">\n<p>Thỉnh thoảng</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"23%\">\n<p><strong>30</strong></p>\n</td>\n<td valign=\"top\" width=\"38%\">\n<p>Occasionally</p>\n</td>\n<td valign=\"top\" width=\"37%\">\n<p>Thỉnh thoảng lắm, hoặc tùy lúc</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"23%\">\n<p><strong>10</strong></p>\n</td>\n<td valign=\"top\" width=\"38%\">\n<p>Seldom</p>\n</td>\n<td valign=\"top\" width=\"37%\">\n<p>Thỉnh thoảng lắm, tùy lúc</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"23%\">\n<p><strong>5</strong></p>\n</td>\n<td valign=\"top\" width=\"38%\">\n<p>Hardly ever/ rarely</p>\n</td>\n<td valign=\"top\" width=\"37%\">\n<p>Hiếm khi, ít có, bất thường</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"23%\">\n<p><strong>0</strong></p>\n</td>\n<td valign=\"top\" width=\"38%\">\n<p>Never</p>\n</td>\n<td valign=\"top\" width=\"37%\">\n<p>Không bao giờ</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>2. Cách dùng trạng từ chỉ tần xuất</strong></p>\n<p><strong>a. Trạng từ chỉ tần xuất dùng để diễn tả mức độ thường xuyên hoặc không thường xuyên của hành động</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong> He often listens to music while doing his homework. (Anh ấy thường nghe nhạc khi làm bài tập)</p>\n<p>           They sometimes eat dinner at a restaurant on weekends. (Họ thi thoảng ăn tối ở nhà hàng vào cuối tuần.)</p>\n<p>           I rarely skip breakfast because it is important for my health. (Tôi hiếm khi bỏ bữa sáng vì nó quan trọng cho sức khỏe của tôi.)</p>\n<p><strong>b. Trạng từ chỉ tần suất thường được dùng để trả lời cho câu hỏi “Bạn có thường xuyên làm gì đó không?” (How often?)</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:  A: </strong>How often do you go to the gym? (Bạn có thường xuyên đi tập gym không?)</p>\n<p><strong>           B:</strong> Usually, I go to three times a week. (Thường xuyên, tôi đi ba lần mỗi tuần.)</p>\n<p><strong>           A:</strong> How often do they travel abroad? (Họ có thường đi du lịch nước ngoài không?)</p>\n<p><strong>           B:</strong> Seldom, because they are very busy with work. (Hiếm khi, vì họ rất bận rộn với công việc.)</p>\n<p><strong>3. Các vị trí của trạng từ chỉ tần xuất trong câu</strong></p>\n<p><strong>a. Trạng từ chỉ tần xuất đứng sau động từ tobe</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong> He is often tired after work. (Anh ấy thường mệt mỏi sau giờ làm.)</p>\n<p><strong>b. Trạng từ chỉ tần suất đứng trước động từ thường</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong> I usually visit my grandparents on weekends. (Tôi thường xuyên đến thăm ông bà vào cuối tuần.)</p>\n<p><strong>c. Trạng từ chỉ tần suất đứng trước trợ động từ và động từ chính. </strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:  </strong>They have always supported each other in difficult times. (Họ luôn luôn hỗ trợ nhau trong những thời điểm khó khăn.)</p>\n<p><strong>d. Trong ngữ pháp tiếng Anh, trạng từ chỉ tần suất đôi khi đứng ở đầu câu hoặc cuối câu (trừ hardly, ever, never)</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong>  Sometimes, I don’t understand what you are thinking. (Thỉnh thoảng tôi chẳng hiểu bạn đang nghĩ gì.)</p>",
                "readingPassage": "Today is Monday, my first day at my new school. Everything is exciting. Some students are talking in the classroom. My teacher is drawing a map on the board. We are wearing our new school uniforms. I like the school canteen.",
                "readingPassageTitle": "My First School Day",
                "videos": [
                    {
                        "id": "RjlQEuvq0RU",
                        "title": "Tiếng Anh 6 Unit 1: Từ vựng - trang 70 - Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "6N7So6x2q_Y",
                        "title": "Tiếng Anh 6 Unit 1: Getting started trang 6, 7 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "Mkp1oRkm2Sc",
                        "title": "Tiếng Anh 6 Unit 1: A closer look 1 trang 8 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "qGG-oBlaIJA",
                        "title": "Tiếng Anh 6 Unit 1: A closer look 2 trang 9, 10 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "TipC01BPaMg",
                        "title": "Tiếng Anh 6 Unit 1: Communication trang 11 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "1W1Q3pYjd0Y",
                        "title": "Tiếng Anh 6 Unit 1: Skills 1 trang 12 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "PKfCHmevoDk",
                        "title": "Tiếng Anh 6 Unit 1: Skills 2 trang 13 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "V4mkBmkwNDk",
                        "title": "Tiếng Anh 6 Unit 1: Looking back trang 14 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "Ta9wljNqQpU",
                        "title": "Tiếng Anh 6 Unit 1: Project trang 15 Global Success (HAY NHẤT)"
                    }
                ],
                "questions": {
                    "reading": [
                        {
                            "question": "What is the main topic of the passage?",
                            "options": [
                                "Unit 1: My New School",
                                "Playing sports",
                                "Travelling around the world"
                            ],
                            "answer": "Unit 1: My New School"
                        },
                        {
                            "question": "Which word is mentioned in the reading passage?",
                            "options": [
                                "activity",
                                "helicopter",
                                "spaceship"
                            ],
                            "answer": "activity"
                        },
                        {
                            "question": "How does the writer feel about the topic?",
                            "options": [
                                "Excited and happy",
                                "Bored and tired",
                                "Sad"
                            ],
                            "answer": "Excited and happy"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t2",
                "title": "Unit 2: My House",
                "subtitle": "Đồ đạc gia đình và giới từ chỉ vị trí",
                "vocab": [
                    {
                        "word": "between",
                        "translation": "ở giữa",
                        "phonetics": "/bɪˈtwiːn/",
                        "type": "preposition",
                        "sentence": "I can see a beautiful between in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người ở giữa tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "chest of drawers",
                        "translation": "tủ có ngăn kéo",
                        "phonetics": "/ˌtʃest əv ˈdrɔːz/",
                        "type": "noun",
                        "sentence": "I can see a beautiful chest of drawers in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người tủ có ngăn kéo tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "cooker",
                        "translation": "bếp",
                        "phonetics": "/ˈkʊk.ər/",
                        "type": "noun",
                        "sentence": "I can see a beautiful cooker in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người bếp tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "country house",
                        "translation": "nhà ở vùng quê",
                        "phonetics": "/ˌkʌn.tri ˈhaʊs/",
                        "type": "noun",
                        "sentence": "I can see a beautiful country house in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người nhà ở vùng quê tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "crazy",
                        "translation": "kì lạ, lạ thường",
                        "phonetics": "/ˈkreɪ.zi/",
                        "type": "adjective",
                        "sentence": "We want to crazy together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau kì lạ, lạ thường vào cuối tuần này."
                    },
                    {
                        "word": "cupboard",
                        "translation": "tủ đựng bát đĩa, quần áo",
                        "phonetics": "/ˈkʌb.əd/",
                        "type": "noun",
                        "sentence": "I can see a beautiful cupboard in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người tủ đựng bát đĩa, quần áo tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "department store",
                        "translation": "cửa hàng, bách hoá",
                        "phonetics": "/dɪˈpɑːt.mənt ˌstɔːr/",
                        "type": "noun",
                        "sentence": "I can see a beautiful department store in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người cửa hàng, bách hoá tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "dishwasher",
                        "translation": "máy rửa bát",
                        "phonetics": "/ˈdɪʃˌwɒʃ.ər/",
                        "type": "noun",
                        "sentence": "I can see a beautiful dishwasher in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người máy rửa bát tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "flat",
                        "translation": "căn hộ",
                        "phonetics": "/flæt/",
                        "type": "noun",
                        "sentence": "I can see a beautiful flat in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người căn hộ tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "furniture",
                        "translation": "đồ đạc trong nhà",
                        "phonetics": "/ˈfɜː.nɪ.tʃər/",
                        "type": "noun",
                        "sentence": "I can see a beautiful furniture in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người đồ đạc trong nhà tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "hall",
                        "translation": "sảnh",
                        "phonetics": "/hɔːl/",
                        "type": "noun",
                        "sentence": "I can see a beautiful hall in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người sảnh tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "in front of",
                        "translation": "ở đằng trước, phía trước",
                        "phonetics": "/ɪn frʌnt əv/",
                        "type": "preposition",
                        "sentence": "I can see a beautiful in front of in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người ở đằng trước, phía trước tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "next to",
                        "translation": "bên cạnh",
                        "phonetics": "/nekst tuː/",
                        "type": "preposition",
                        "sentence": "I can see a beautiful next to in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người bên cạnh tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "shelf",
                        "translation": "kệ, giá",
                        "phonetics": "/ʃelf/",
                        "type": "noun",
                        "sentence": "I can see a beautiful shelf in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người kệ, giá tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "sink",
                        "translation": "bồn rửa bát",
                        "phonetics": "/sɪŋk/",
                        "type": "noun",
                        "sentence": "I can see a beautiful sink in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người bồn rửa bát tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "strange",
                        "translation": "kì lạ",
                        "phonetics": "/streɪndʒ/",
                        "type": "adjective",
                        "sentence": "We want to strange together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau kì lạ vào cuối tuần này."
                    },
                    {
                        "word": "town house",
                        "translation": "nhà phố",
                        "phonetics": "/ˈtaʊn ˌhaʊs/",
                        "type": "noun",
                        "sentence": "I can see a beautiful town house in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người nhà phố tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "wardrobe",
                        "translation": "tủ đựng quần áo",
                        "phonetics": "/ˈwɔː.drəʊb/",
                        "type": "noun",
                        "sentence": "I can see a beautiful wardrobe in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người tủ đựng quần áo tuyệt đẹp trong bức tranh này."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Where is the cat? - It is under the sofa.",
                        "vietnamese": "Con mèo ở đâu thế? - Nó ở dưới gầm ghế sofa."
                    },
                    {
                        "english": "There is a fridge next to the wardrobe.",
                        "vietnamese": "Có một cái tủ lạnh nằm cạnh cái tủ quần áo."
                    }
                ],
                "grammar": "<p><strong>A. GRAMMAR</strong></p>\n<p><strong>I. Possessive case (Sở hữu cách)</strong></p>\n<p><strong>1. Sở hữu cách là gì?</strong></p>\n<p>        Sở hữu cách là một cấu trúc ngữ pháp tiếng Anh được sử dụng để chỉ quyền sở hữu của một người, vật đối với một người hay một vật khác, giúp ta biết ai/ cái gì sở hữu hoặc thuộc về ai/ cái gì. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:  </strong>Tom’s backpack is very heavy. (Ba lô của Tom rất nặng.)</p>\n<p>            My sister’s room is always clean. (Phòng của chị gái tôi luôn sạch sẽ.)</p>\n<p><span style=\"color: #c00000;\">[Sở hữu cách (possessive’s) có thể được hình thành khi thêm vào dấu nháy đơn (’) cho các danh từ hoặc cụm danh từ.]</span ></p>\n<p><strong>Công thức của sở hữu cách: A’s B. Trong đó: </strong></p>\n<p>• Nếu B là danh từ chỉ người thì B có mối quan hệ nào đó với A</p>\n<p>• Nếu B là danh từ chỉ vật thì B thuộc quyền sở hữu của A</p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> Anna’s brother is a doctor. (Anh trai của Anna là bác sĩ.) =&gt; B là người, có mối quan hệ với A. </p>\n<p>            The dog’s tail is very long. (Cái đuôi của con chó rất dài.) =&gt; B là vật, thuộc quyền sở hữu của A. </p>\n<p><strong>2. Cách dùng sở hữu cách</strong></p>\n<p><strong>a. Đối với danh từ số ít và danh từ số nhiều bất quy tắc</strong></p>\n<p>        Với các danh từ chỉ người hay vật là chủ sở hữu số ít hoặc danh từ số nhiều bất quy tắc, sở hữu cách được them bằng cách đánh dấu <strong>’s </strong>đằng sau. Cách viết sở hữu cách này thường dễ bị nhầm với cách viết tắt của các động từ tobe. Do đó, cần phải hết sức chú ý đến cấu trúc ngữ pháp hay hoàn cảnh sử dụng của câu đó để tránh sai sót. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong> Phong’s school. (Trường của Phong)</p>\n<p>            His children’s toy. (Đồ chơi của tụi nhỏ nhà anh ấy.)</p>\n<p><strong>b. Đối với danh từ số nhiều có quy tắc</strong></p>\n<p>        Khi gặp hầu hết các danh từ số nhiều kết thúc bằng đuôi “<strong>s</strong>”, khi viết sở hữu cách chỉ cần thêm dấu nháy <strong>’</strong> ở phía sau. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> The students’ classroom is on the third floor. (Lớp học của các học sinh nằm ở tầng ba.)</p>\n<p>           Our neighbors’ dogs are very noisy. (Những con chó của những hàng xóm của chúng tôi rất ồn ào.)</p>\n<p><strong>c. Dạng sở hữu cách kép</strong></p>\n<p>        Với công thức sở hữu cách này, sẽ có nhiều hơn một danh từ đóng vai trò là chủ sở hữu. Khi muốn tạo sở hữu cách, chỉ cần thêm <strong>’s</strong> vào sau các danh từ này. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> Nam’s sister’s car is very expensive. (Chiếc xe của chị gái Nam rất đắt tiền.)</p>\n<p>Lisa’s mom’s restaurant is famous for its noodles. (Nhà hàng của mẹ Lisa nổi tiếng vì món mì.)</p>\n<p><strong>3. Những lưu ý khi sử dụng sở hữu cách trong tiếng Anh</strong></p>\n<p><strong>• Khi sử dụng sở hữu cách, bỏ các mạo từ (a, an, the) đứng trước người hay vật bị sở hữu</strong>. </p>\n<p><strong style=\"color: #c00000;\">        Ví dụ:</strong> The phone of my father → My father’s phone. (Điện thoại của bố tôi.)</p>\n<p>          The garden of our neighbors → Our neighbors’ garden. (Khu vườn của hàng xóm của chúng tôi.) </p>\n<p>          The voice of the singer → The singer’s voice. (Giọng của ca sĩ.)</p>\n<p><strong>• Trong những câu trả lời ngắn hay trong các trường hợp không cần trang trọng, có thể bỏ danh từ sau ’s nếu thấy không cần thiết lặp lại. Ngoài ra, nếu vậy bị sở hữu đã quá quen thuộc với cả người nghe và người nói thì cũng có thể bị lược bỏ. </strong></p>\n<p><strong style=\"color: #c00000;\">        Ví dụ:</strong> I think this umbrella is Linh’s. (Tôi nghĩ cái ô này là của Linh.)</p>\n<p>                   That’s not my phone. It’s Nam’s. (Đó không phải là điện thoại của tôi. Nó là của Nam.)</p>\n<p><strong>II. Prepositions of place (Giới từ chỉ nơi chốn)</strong></p>\n<p><strong>1. Giới từ chỉ nơi chốn là gì?</strong></p>\n<p>        Giới từ chỉ nơi chốn <strong>(Prepositions of Place)</strong> là những giới từ dùng để mô tả vị trí, nơi chốn, không gian nhằm cung cấp thông tin, xác định cụ thể vị trí của sự vật, sự việc được nhắc đến. Giới từ chỉ nơi chốn dùng để trả lời cho câu hỏi “where is it?” (Nó ở đâu?) hoặc “where are they?” (họ ở đâu?). Nhờ có loại giới từ này, chúng ta có thể mô tả một cách chính xác và rõ rang về vị trí của chủ thể trong câu. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> She is in the living room. (Cô ấy đang trong phòng khách.)</p>\n<p>            There’s a coffee shop next to the library. (Có quán cà phê ở bên cạnh thư viện.)</p>\n<p><img src=\"../tieng-anh-6-kn/images/ngu-phap-unit-2-290074.PNG\" alt=\"Ngữ pháp Tiếng Anh lớp 6 Global Success Unit 2: My house (hay, chi tiết)\" width=\"548\" height=\"311\" /></p>\n<p><strong>2.</strong> <strong>Các giới từ chỉ nơi chốn thường gặp</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr>\n<td valign=\"top\" width=\"104\">\n<p style=\"text-align:center;\"><strong>Giới từ</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p style=\"text-align:center;\"><strong>Cách dùng</strong></p>\n</td>\n<td valign=\"top\" width=\"296\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"104\">\n<p><strong>In</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>• Chỉ vị trí ở bên trong một không gian khép kín, bị giới hạn. </p>\n<p>• Không gian rộng lớn như quốc gia, thành phố</p>\n<p>• Chỉ phương hướng Đông, Tây, Nam, Bắc. </p>\n<p>• Chi các hàng, các đường thẳng</p>\n<p>• Địa điểm đặc biệt (không kèm mạo từ.)</p>\n</td>\n<td valign=\"top\" width=\"296\">\n<p>• I was born in Thai Binh and grew up in Ho Chi Minh city. (Tôi sinh ra ở Thái Bình và lớn lên ở Sài Gòn. </p>\n<p>• I found an old photo in the box. (Tôi tìm được tấm hình cũ trong cái hộp.)</p>\n<p>• The sun rises in the East and sets in the West. (Mặt trời mọc ở hướng Đông và lặn ở hướng Tây.)</p>\n<p>• The students stood in a row for the school photo. (Học sinh đứng thành hàng để chụp ảnh lớp.)</p>\n<p>• He’s in hospital after the accident. (Cậu ấy đang nằm viện sau tai nạn.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"104\">\n<p><strong>On</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>• Chỉ vị trí ở trên một bề mặt phẳng.</p>\n<p>• Vị trí nằm trên một con đường</p>\n<p>• Trên các tầng</p>\n<p>• Dùng cho các phương tiện giao thông (trừ car, taxi)</p>\n<p>• Chỉ hướng đi</p>\n</td>\n<td valign=\"top\" width=\"296\">\n<p>• The keys are on the table. (Chìa khóa nằm trên bàn.)</p>\n<p>• My school is on Nguyen Trai Street. (Trường của tôi nằm trên đường Nguyễn Trãi.)</p>\n<p>• The restaurant is on the rooftop of the building. (Nhà hàng ở trên sân thượng của tòa nhà.)</p>\n<p>• She’s travelling on a plane to Da Nang now. (Cô ấy đang đi máy bay đến Đà Nẵng.)</p>\n<p>• The restroom is on the right. (Nhà vệ sinh ở bên phải.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"104\">\n<p><strong>At</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>• Xác định vị trí, địa điểm cụ thể</p>\n<p>• Các vị trí như nơi làm việc, trường học</p>\n<p>• Địa chỉ có số nhà cụ thể</p>\n<p>• Dùng nói về các địa điểm như bữa tiệc, sự kiện</p>\n</td>\n<td valign=\"top\" width=\"296\">\n<p>• There is a long queue at the bus stop. (Có một hàng dài người đang chờ ở trạm xe buýt.)</p>\n<p>• She’s at school until 4 p.m. (Cô ấy còn ở trường cho đến 4 giờ.)</p>\n<p>• The bakery is at 25 Le Loi Street, right next to the book store. (Tiếm bánh ở số 25 đường Lê Lợi, ngay cạnh nhà sách.)</p>\n<p>• We had so much fun at the party last night. (Chúng tôi đã rất vui trong bữa tiệc vào tối ngày hôm qua.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"104\">\n<p><strong>Above (phía trên)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>• Diễn tả vị trí ở bên trên nhưng không nhất thiết tiếp xúc với bề mặt như giới từ “on”</p>\n<p>• Dùng để diễn tả vị trí ở bên trên ở trong một danh sách nào đó bất kỳ. </p>\n</td>\n<td valign=\"top\" width=\"296\">\n<p>There is a painting above the bed. (Có một bức tranh treo bên trên giường.)</p>\n<p>There are five people above me in this month’s rankings. (Có 5 người đứng trên tôi trong bảng xếp hạng tháng này.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"104\">\n<p><strong>Among (ở giữa)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Dùng để diễn tả vị trí giữa ba hoặc nhiều hơn. </p>\n</td>\n<td valign=\"top\" width=\"296\">\n<p>Thanh is standing among the crowd. (Thanh đang đứng giữa đám đông.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"104\">\n<p><strong>Between (ở chính giữa)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Dùng để diên tả vị trí nằm giữa hai vật (cần phân biệt với giới từ “among”.)</p>\n</td>\n<td valign=\"top\" width=\"296\">\n<p>There is a small garden between the two buildings. (Có một khu vườn nhỏ nằm giữa hai khu vườn.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"104\">\n<p><strong>Behind (phía sau)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Dùng để diễn tả vị trí ở phía sau, bị che khuất bới một vật.</p>\n</td>\n<td valign=\"top\" width=\"296\">\n<p>She hid the gift behind her back. (Cô ấy giấu món quà sau lưng.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"104\">\n<p><strong>In front of (phía trước)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Dùng để mô tả vị trí ở phía trước một chủ thể bất kỳ.</p>\n</td>\n<td valign=\"top\" width=\"296\">\n<p>Don’t park your bike in front of the gate. (Đừng đỗ xe trước cổng.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"104\">\n<p><strong>Near (gần)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Dùng để diễn tả vị trí gần một chủ thể nào đó. </p>\n</td>\n<td valign=\"top\" width=\"296\">\n<p>My house is near my school, so I usually go to school early. (Nhà của tôi thì gần trường, vì vậy tôi thường đi học sớm.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"104\">\n<p><strong>Inside (ở bên trong)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Dùng diễn tả vị trí ở bên trong, nhưng nhấn mạnh yếu tố là không gian kín. </p>\n</td>\n<td valign=\"top\" width=\"296\">\n<p>There is a bird the cage. (Có một con chim ở trong lồng.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"104\">\n<p><strong>Outside (bên ngoài)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Diễn tả vị trí ở bên ngoài phạm vi của một vật.</p>\n</td>\n<td valign=\"top\" width=\"296\">\n<p>It’s cold outside the house. (Trời lạnh ở bên ngoài nhà.)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>3. Những lưu ý khi sử dụng giới từ chỉ nơi chốn</strong></p>\n<p>• Khi sử dụng giới từ chỉ nơi chốn, hãy chú ý đến ngữ cảnh để dùng đúng từ. <strong>Ví dụ:</strong> giới từ “<strong>in</strong>” dùng để chỉ vị trí trong một không gian kín, “<strong>on</strong>” chỉ vị trí trên bề mặt hoặc “<strong>at</strong>” chỉ một địa điểm cụ thể.</p>\n<p>• Luôn sử dụng giới từ chỉ nơi chốn để mô tả vị trí của chủ thể. <strong>Ví dụ</strong>: “The students are in the library” chứ không phải là “The students are the library.”</p>\n<p>• Chú ý vị trí của giới từ đi kèm trong câu. <strong>Ví dụ</strong>: “The book is on the table” thay vì “The table is on the book.”</p>\n<p>• Thường xuyên luyện tập các bài tập giới từ chỉ nơi chốn để sử dụng linh hoạt trong giao tiếp tiếng Anh. </p>",
                "readingPassage": "My family lives in a small house. It has four rooms. In the kitchen, there is a big white fridge next to the window. My bedroom is small, but it has a nice study desk next to my bed. My clothes are in the wardrobe.",
                "readingPassageTitle": "Our Cozy House",
                "videos": [
                    {
                        "id": "80ZsfbtJ6r8",
                        "title": "Tiếng Anh 6 Unit 2: Từ vựng trang 71 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "r9AOPNASM7Q",
                        "title": "Tiếng Anh 6 Unit 2: Getting started trang 16, 17 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "fgnWOoo3cIQ",
                        "title": "Tiếng Anh 6 Unit 2: A closer look 1 trang 17, 18 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "67amftYpZVM",
                        "title": "Tiếng Anh 6 Unit 2: A closer look 2 trang 18, 19, 20 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "7ZJajfZqLI8",
                        "title": "Tiếng Anh 6 Unit 2: Communication trang 20, 21 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "MlJRB4nyXCI",
                        "title": "Tiếng Anh 6 Unit 2: Skills 1 trang 22 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "opdKeiPiVUU",
                        "title": "Tiếng Anh 6 Unit 2: Skills 2 trang 23 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "0dVwu2fl1-E",
                        "title": "Tiếng Anh 6 Unit 2: Looking back trang 24 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "vNV4qK8G6vU",
                        "title": "Tiếng Anh 6 Unit 2: Project trang 25 Global Success (DỄ HIỂU NHẤT)"
                    }
                ],
                "questions": {
                    "reading": [
                        {
                            "question": "What is the main topic of the passage?",
                            "options": [
                                "Unit 2: My House",
                                "Playing sports",
                                "Travelling around the world"
                            ],
                            "answer": "Unit 2: My House"
                        },
                        {
                            "question": "Which word is mentioned in the reading passage?",
                            "options": [
                                "between",
                                "helicopter",
                                "spaceship"
                            ],
                            "answer": "between"
                        },
                        {
                            "question": "How does the writer feel about the topic?",
                            "options": [
                                "Excited and happy",
                                "Bored and tired",
                                "Sad"
                            ],
                            "answer": "Excited and happy"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t3",
                "title": "Unit 3: My Friends",
                "subtitle": "Mô tả ngoại hình và tính cách của bạn bè",
                "vocab": [
                    {
                        "word": "active",
                        "translation": "hăng hái, năng động",
                        "phonetics": "/ˈæk.tɪv/",
                        "type": "adjective",
                        "sentence": "We want to active together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau hăng hái, năng động vào cuối tuần này."
                    },
                    {
                        "word": "appearance",
                        "translation": "bề ngoài, ngoại hình",
                        "phonetics": "/əˈpɪə.rəns/",
                        "type": "noun",
                        "sentence": "I can see a beautiful appearance in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người bề ngoài, ngoại hình tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "careful",
                        "translation": "cẩn thận",
                        "phonetics": "/ˈkeə.fəl/",
                        "type": "adjective",
                        "sentence": "We want to careful together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau cẩn thận vào cuối tuần này."
                    },
                    {
                        "word": "caring",
                        "translation": "chu đáo, biết quan tâm",
                        "phonetics": "/ˈkeə.rɪŋ/",
                        "type": "adjective",
                        "sentence": "We want to caring together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau chu đáo, biết quan tâm vào cuối tuần này."
                    },
                    {
                        "word": "cheek",
                        "translation": "má",
                        "phonetics": "/tʃiːk/",
                        "type": "noun",
                        "sentence": "I can see a beautiful cheek in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người má tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "clever",
                        "translation": "lanh lợi, thông minh",
                        "phonetics": "/ˈklev.ər/",
                        "type": "adjective",
                        "sentence": "We want to clever together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau lanh lợi, thông minh vào cuối tuần này."
                    },
                    {
                        "word": "confident",
                        "translation": "tự tin",
                        "phonetics": "/ˈkɒn.fɪ.dənt/",
                        "type": "adjective",
                        "sentence": "We want to confident together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau tự tin vào cuối tuần này."
                    },
                    {
                        "word": "creative",
                        "translation": "sáng tạo",
                        "phonetics": "/kriˈeɪ.tɪv/",
                        "type": "adjective",
                        "sentence": "She is a creative student who loves painting.",
                        "sentenceTranslation": "Cô ấy là một học sinh sáng tạo, người rất thích vẽ tranh."
                    },
                    {
                        "word": "friendly",
                        "translation": "thân thiện",
                        "phonetics": "/ˈfrend.li/",
                        "type": "adjective",
                        "sentence": "We want to friendly together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau thân thiện vào cuối tuần này."
                    },
                    {
                        "word": "funny",
                        "translation": "ngộ nghĩnh, khôi hài",
                        "phonetics": "/ˈfʌn.i/",
                        "type": "adjective",
                        "sentence": "We want to funny together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau ngộ nghĩnh, khôi hài vào cuối tuần này."
                    },
                    {
                        "word": "hard-working",
                        "translation": "chăm chỉ",
                        "phonetics": "/ˌhɑːdˈwɜː.kɪŋ/",
                        "type": "adjective",
                        "sentence": "We want to hard-working together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau chăm chỉ vào cuối tuần này."
                    },
                    {
                        "word": "kind",
                        "translation": "tốt bụng",
                        "phonetics": "/kaɪnd/",
                        "type": "adjective",
                        "sentence": "We want to kind together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau tốt bụng vào cuối tuần này."
                    },
                    {
                        "word": "loving",
                        "translation": "giàu tình yêu thương",
                        "phonetics": "/ˈlʌv.ɪŋ/",
                        "type": "adjective",
                        "sentence": "We want to loving together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau giàu tình yêu thương vào cuối tuần này."
                    },
                    {
                        "word": "personality",
                        "translation": "tính cách",
                        "phonetics": "/ˌpɜː.sənˈæl.ə.ti/",
                        "type": "noun",
                        "sentence": "I can see a beautiful personality in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người tính cách tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "shoulder",
                        "translation": "vai",
                        "phonetics": "/ˈʃəʊl.dər/",
                        "type": "noun",
                        "sentence": "I can see a beautiful shoulder in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người vai tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "shy",
                        "translation": "xấu hổ",
                        "phonetics": "/ʃaɪ/",
                        "type": "adjective",
                        "sentence": "We want to shy together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau xấu hổ vào cuối tuần này."
                    },
                    {
                        "word": "slim",
                        "translation": "mảnh khảnh, thanh mảnh",
                        "phonetics": "/slɪm/",
                        "type": "adjective",
                        "sentence": "We want to slim together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau mảnh khảnh, thanh mảnh vào cuối tuần này."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What does she look like? - She has long black hair.",
                        "vietnamese": "Cô ấy trông như thế nào? - Cô ấy có mái tóc đen dài."
                    },
                    {
                        "english": "What is he like? - He is very kind and clever.",
                        "vietnamese": "Tính cách anh ấy thế nào? - Anh ấy rất tốt bụng và thông minh."
                    }
                ],
                "grammar": "<p><strong>A. GRAMMAR</strong></p>\n<p><strong>I. Present continuous (Hiện tại tiếp diễn)</strong></p>\n<p><strong>1. Thì hiện tại tiếp diễn là gì?</strong></p>\n<p>        <strong>Thì hiện tại tiếp diễn (Present Continuous tense)</strong> diễn tả những hành động hoặc sự việc diễn ra tại lúc đó hoặc xung quanh thời điểm nói. Những sự việc, hành động này vẫn chưa chấm dứt và vẫn tiếp tục diễn ra đến thời điểm hiện tại. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> She is cooking dinner in the kitchen. (Cô ấy đang nấu bữa tối trong bếp.)</p>\n<p>            He is talking on the phone. (Anh ấy đang nói chuyện điện thoại.)</p>\n<p>            They are playing football in the yard. (Họ đang chơi bóng đá ngoài sân.)</p>\n<p><strong>2. Công thức của thì hiện tại tiếp diễn </strong></p>\n<p>        Khi muốn đặt câu ở thì hiện tại tiếp diễn, cần nắm rõ cấu trúc ở nhiều dạng khác khác nhau. Cấu trúc thì hiện tại tiếp diễn được chia làm 3 dạng bao gồm: thể khẳng định, phủ định, nghi vấn được tóm tắt bằng bảng dưới đây. </p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"160\">\n<p style=\"text-align:center;\"><strong>Loại câu</strong></p>\n</td>\n<td valign=\"top\" width=\"246\">\n<p style=\"text-align:center;\"><strong>Công thức</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"160\">\n<p><strong>Thể khẳng định</strong></p>\n</td>\n<td valign=\"top\" width=\"246\">\n<p><strong>S + am/is/are + V-ing</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>The children are drawing pictures. (Bọn trẻ đang vẽ tranh.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"160\">\n<p><strong>Thể phủ định</strong></p>\n</td>\n<td valign=\"top\" width=\"246\">\n<p><strong>S + am / is / are + not + Ving</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>I am not watching TV right now. (Tôi đang không xem TV luvs này.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"160\">\n<p><strong>Câu nghi vấn (Yes/No Question)</strong></p>\n</td>\n<td valign=\"top\" width=\"246\">\n<p><strong>Am/ Is/ Are + S + Ving?</strong></p>\n<p><strong>Câu trả lời:</strong></p>\n<p><strong>Yes, S + am/is/are.</strong></p>\n<p><strong>No, S + am/is/are + not.</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>Is she reading a book? (Cô ấy đang đọc sách đúng không?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"160\">\n<p><strong>Câu nghi vấn (WH- question)</strong></p>\n</td>\n<td valign=\"top\" width=\"246\">\n<p><strong>Wh-question + will + S + be + V-ing?</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>What are you doing? (Bạn đang làm gì thế?)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>3. Dấu hiệu nhận biết thì hiện tại tiếp diễn</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"198\">\n<p style=\"text-align:center;\"><strong>Dấu hiệu</strong></p>\n</td>\n<td valign=\"top\" width=\"208\">\n<p style=\"text-align:center;\"><strong>Nhận diện</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p><strong>Trạng từ chỉ thời gian</strong></p>\n</td>\n<td valign=\"top\" width=\"208\">\n<p>• Now</p>\n<p>• right now</p>\n<p>• at the moment</p>\n<p>• at present</p>\n<p>• It’s +giờ cụ thể + now</p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>I’m doing my homework right now. (Tôi đang làm bài tập về nhà ngay bây giờ)</p>\n<p>We are working on a new project at present. (Chúng tôi đang làm một dự án mới hiện tại.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p><strong>Các trạng từ hoặc cụm từ diễn tả tần xuất cao, xuất hiện trong câu diễn tả thói quen gây phiền toái, phàn nàn hoặc một hành vi không mong muốn</strong></p>\n</td>\n<td valign=\"top\" width=\"208\">\n<p>• Always</p>\n<p>• Usually</p>\n<p>• Constantly</p>\n<p>• All the time </p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>She is usually talking during class. (Cô ấy thường xuyên nói chuyện trong lớp .)</p>\n<p>He is constantly complaining about everything. (Cậu ấy liên tục phàn nàn về mọi thứ.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p><strong>Các cụm từ chỉ thời gian xung quanh thời điểm nói</strong></p>\n</td>\n<td valign=\"top\" width=\"208\">\n<p>• These day</p>\n<p>• This month</p>\n<p>• This week</p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>He is studying a lot these days because his exams are coming. (Dạo này cậu ấy học nhiều vì kỳ thi sắp tới.)</p>\n<p>They are not going out much these days. (Dạo này họ không đi chơi nhiều </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p><strong>Các động từ, mệnh lệnh ngắn thu hút sự chú ý</strong></p>\n</td>\n<td valign=\"top\" width=\"208\">\n<p>• Look! Watch!</p>\n<p>• Listen!</p>\n<p>• Keep silent!</p>\n<p>• Watch out!</p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>Watch out! The train is coming. (Coi chừng! Tàu đang tới.)</p>\n<p>Look! They are fighting in the street! (Nhìn kìa! Họ dang đánh nhau ngoài đường kìa!)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>4. Cách sử dụng thì Hiện tại tiếp diễn</strong></p>\n<p><strong>• Diễn tả hành động diễn ra vào thời điểm đang nói. </strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> She is learning English now. (Bây giờ cố ấy đang học tiếng Anh.)</p>\n<p><strong>• Diễn tả một hành động hoặc sự việc đang diễn ra nhưng không nhất thiết xảy ra ngay lúc nói.</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> He is reading “Gone with the wind” (Anh ấy đang đọc “Gone with the wind”)</p>\n<p>            Hoa is looking for a job. (Hoa đang tìm việc)</p>\n<p><strong>• Diễn tả hành động sẽ xảy ra trong tương lại gần, thường là đề cập về kế hoạch đã được lên lịch sẵn. </strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> I’m having dinner with my parents this evening. (Tối nay tôi ăn tối với bố mẹ.)</p>\n<p><strong>• Dùng để diễn tả một sự phàn nàn về hành động nào đó do người khác gây ra khiến người nói bực mình. Trong trường hợp này, câu văn sẽ có các trạng từ chỉ tần suất như continually, always</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> He is constantly leaving dirty dishes in the sink? (Anh ta lúc nào cũng để bát bẩn trong   bồn rửa.)</p>\n<p><strong>5. Cách chia động từ V-ing trong thì Hiện tại tiếp diễn</strong></p>\n<p>• Với các động từ có tận cùng là chữ “e”, quy tắc chia thì hiện tại tiếp diễn là bỏ “e” rồi thêm “-ing”. <strong>Ví dụ:</strong> <em>use → using, pose → posing, leave → leaving, change → changing </em></p>\n<p>• Nếu các động từ có tận cùng là “ee”, khi chuyển sang dạng V-ing thì vẫn giữ nguyên “ee” và thêm đuôi “ing” <em>(knee → kneeing)</em></p>\n<p>• Với các động từ có tận cùng là chữ “ie” thì đổi thành “y” rồi thêm “-ing”. <em>(lie → lying, die → dying)</em></p>\n<p>• Động từ tận cùng là một phụ âm (trừ h,w,x,y), đi trước là một nguyên âm, ta gấp đôi phụ âm trước khi thêm “-ing” <em>(stop→ stopping, begin → beginning, prefer → preferring)</em></p>\n<p><span style=\"color: #c00000;\">• Quy tắc gấp đôi phụ âm rồi mới thêm “-ing”:</span ></p>\n<p>- Nếu động từ có 1 âm tiết kết thúc bằng một phụ âm (trừ h, w, x, y), đi trước là một nguyên âm ta gấp đôi phụ âm trước khi thêm “ing. (<em><strong>stop – stopping; run – running)</strong></em></p>\n<p>- trường hợp kết thúc 2 nguyên âm + 1 phụ âm, thì thêm ing bình thường, không gấp đôi phụ âm.</p>\n<p><em>- Với động từ có HAI âm tiết, tận cùng là MỘT PHỤ ÂM, trước là MỘT NGUYÊN ÂM, trọng âm rơi vào âm tiết thứ HAI → nhân đôi phụ âm cuối rồi thêm “-ing”. Ví dụ: begin – beginning, prefer – preferring, permit – permitting</em>. </p>\n<p>- Nếu trọng âm nhấn vào vị trí âm không phải âm cuối thì không gấp đôi phụ âm: Listen - listening, Happen - happening, enter - entering...</p>\n<p>- Nếu phụ âm kết thúc là \"l\" thì thường người Anh sẽ gấp đôi l còn người Mỹ thì không.</p>\n<p>- <strong style=\"color: #c00000;\">Ví dụ:</strong> Travel  : Anh - Anh là Travelling, Anh - Mỹ là Traveling, cả hai cách viết đều sử dụng được nhé.</p>\n<p><strong>6. Các động từ không chia ở thì hiện tại tiếp diễn </strong></p>\n<p>        Các động từ trạng thái ở bảng sau không được chia ở thì hiện tại tiếp diễn khi chúng là những động từ tĩnh diễn đạt trạng thái, giác quan hoặc tình cảm.</p>\n<table class=\"MsoTable15Plain1\" border=\"1\">\n<tbody>\n<tr>\n<td valign=\"top\" width=\"33%\">\n<p>know (biết)</p>\n</td>\n<td valign=\"top\" width=\"33%\">\n<p>understand (hiểu)</p>\n</td>\n<td valign=\"top\" width=\"32%\">\n<p>have (có)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"33%\">\n<p>believe (tin tưởng)</p>\n</td>\n<td valign=\"top\" width=\"33%\">\n<p>hate (ghét)</p>\n</td>\n<td valign=\"top\" width=\"32%\">\n<p>need (cần)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"33%\">\n<p>hear (nghe)</p>\n</td>\n<td valign=\"top\" width=\"33%\">\n<p>love (yêu)</p>\n</td>\n<td valign=\"top\" width=\"32%\">\n<p>appear (xuất hiện)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"33%\">\n<p>see (nhìn)</p>\n</td>\n<td valign=\"top\" width=\"33%\">\n<p>like (thích)</p>\n</td>\n<td valign=\"top\" width=\"32%\">\n<p>seem (dường như)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"33%\">\n<p>smell (ngửi)</p>\n</td>\n<td valign=\"top\" width=\"33%\">\n<p>want (muốn)</p>\n</td>\n<td valign=\"top\" width=\"32%\">\n<p>taste (nếm)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"33%\">\n<p>wish (ước)</p>\n</td>\n<td valign=\"top\" width=\"33%\">\n<p>sound (nghe có vẻ)</p>\n</td>\n<td valign=\"top\" width=\"32%\">\n<p>own (sở hữu)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p>Nhưng khi chúng là động từ chỉ hành động thì chúng lại được phép dùng ở thì tiếp diễn.</p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong>He has a lot of books. (<strong>KHÔNG DÙNG</strong>: He is having a lot of books)</p>\n<p><strong><em>Tuy nhiên, có thể:</em></strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong>He is having his dinner. (Anh ấy ĐANG ăn tối - hành động ăn đang diễn ra)</p>\n<p><strong>II. Verb “be” and “have” for description (Động từ “be” và “have” dùng để miêu tả)</strong></p>\n<table class=\"MsoNormalTable\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\"> </td>\n<td valign=\"top\">\n<p style=\"text-align:center;\"><strong>Be</strong></p>\n</td>\n<td valign=\"top\">\n<p style=\"text-align:center;\"><strong>Have</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\">\n<p><strong>Cách dùng</strong></p>\n</td>\n<td valign=\"top\">\n<p>Để miêu tả đặc điểm ngoại hình hoặc tính cách.</p>\n</td>\n<td valign=\"top\">\n<p>Để miêu tả ngoại hình (chỉ sự sở hữu).</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\">\n<p><strong>Khẳng định</strong></p>\n</td>\n<td valign=\"top\">\n<p><strong>(+) S + be + adj.</strong></p>\n<p>• Mary is pretty. (Mary rất xinh.)</p>\n<p>• My sister is gentle. (Chị gái tôi rất dịu dàng.)</p>\n</td>\n<td valign=\"top\">\n<p><strong>(+) S + have/ has + (a/ an) + adj + body part.</strong></p>\n<p>• I have long and black hair. (Tôi có mái tóc đen dài.)</p>\n<p>• She has green eyes. (Cô ấy có đôi mắt xanh lục.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\">\n<p><strong>Phủ định</strong></p>\n</td>\n<td valign=\"top\">\n<p><strong>(-) S + be + not + adj.</strong></p>\n<p>• Long isn’t tall. (Long không cao.)</p>\n</td>\n<td valign=\"top\">\n<p><strong>(-) S + don’t/ doesn’t + have + (a/ an) + adj + body part.</strong></p>\n<p>• Peter doesn’t have a big nose. (Peter không có mũi to.)</p>\n<p>• My dogs don’t have fat legs. (Những con chó của tôi không có chân mũm mĩm.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\">\n<p><strong>Nghi vấn</strong></p>\n</td>\n<td valign=\"top\">\n<p><strong>(?) be + S + adj?</strong></p>\n<p><strong>Yes, S + to be.</strong></p>\n<p><strong>No, S + to be + not.</strong></p>\n<p>• Are they slim? (Họ có mảnh mai không?)</p>\n<p>• Yes, they are./No, they aren't. (Có, họ có/Không, họ không)</p>\n<p>• Is Linda clever? (Linda có thông minh không?)</p>\n<p>• Yes, she is./ No, she isn't. (Có, cô ấy có/ Không, cô ấy không?)</p>\n</td>\n<td valign=\"top\">\n<p><strong>(?) Do/ Does + S + have + (a/ an) + adj + body part?</strong></p>\n<p><strong>Yes, S + do/does.</strong></p>\n<p><strong>No, S + do/does + not.</strong></p>\n<p>• Does she have brown eyes? (Cô ấy có đôi mắt nâu phải không?)</p>\n<p>• Yes, she does./ No, she doesn't. (Có, cô ấy có/ Không, cô ấy không?)</p>\n<p>• Do they have long hair? (Họ có mái tóc dài phải không?)</p>\n<p>• Yes, they do./ No, they don't.</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>★ Một số tính từ dùng để miêu tả tính cách.</strong></p>\n<table class=\"MsoNormalTable\" border=\"1\">\n<tbody>\n<tr>\n<td valign=\"top\" width=\"12%\">\n<p>kind</p>\n</td>\n<td valign=\"top\" width=\"16%\">\n<p>= tốt bụng</p>\n</td>\n<td valign=\"top\" width=\"15%\">\n<p>cold</p>\n</td>\n<td valign=\"top\" width=\"19%\">\n<p>= lạnh lùng</p>\n</td>\n<td valign=\"top\" width=\"18%\">\n<p>patient</p>\n</td>\n<td valign=\"top\" width=\"17%\">\n<p>= kiên nhẫn</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"12%\">\n<p>careful</p>\n</td>\n<td valign=\"top\" width=\"16%\">\n<p>= cẩn thận</p>\n</td>\n<td valign=\"top\" width=\"15%\">\n<p>clever</p>\n</td>\n<td valign=\"top\" width=\"19%\">\n<p>= thông minh</p>\n</td>\n<td valign=\"top\" width=\"18%\">\n<p>humorous</p>\n</td>\n<td valign=\"top\" width=\"17%\">\n<p>= hài ước</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"12%\">\n<p>creative</p>\n</td>\n<td valign=\"top\" width=\"16%\">\n<p>= sáng tạo</p>\n</td>\n<td valign=\"top\" width=\"15%\">\n<p>friendly</p>\n</td>\n<td valign=\"top\" width=\"19%\">\n<p>= thân thiện</p>\n</td>\n<td valign=\"bottom\" width=\"18%\">\n<p>hardworking</p>\n</td>\n<td valign=\"bottom\" width=\"17%\">\n<p>= chăm chỉ</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"12%\">\n<p>warm</p>\n</td>\n<td valign=\"top\" width=\"16%\">\n<p>= ấm áp</p>\n</td>\n<td valign=\"top\" width=\"15%\">\n<p>cheerful</p>\n</td>\n<td valign=\"top\" width=\"19%\">\n<p>= vui vẻ</p>\n</td>\n<td valign=\"top\" width=\"18%\">\n<p>honest</p>\n</td>\n<td valign=\"top\" width=\"17%\">\n<p>= trung thực</p>\n</td>\n</tr>\n<tr>\n<td valign=\"bottom\" width=\"12%\">\n<p>polite</p>\n</td>\n<td valign=\"bottom\" width=\"16%\">\n<p>= lịch sự</p>\n</td>\n<td valign=\"bottom\" width=\"15%\">\n<p>easy going</p>\n</td>\n<td valign=\"top\" width=\"19%\">\n<p>= dê gân</p>\n</td>\n<td valign=\"top\" width=\"18%\">\n<p>talkative</p>\n</td>\n<td valign=\"top\" width=\"17%\">\n<p>= hoạt ngôn</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"12%\">\n<p>sociable</p>\n</td>\n<td valign=\"top\" width=\"16%\">\n<p>= hòa đồng</p>\n</td>\n<td valign=\"top\" width=\"15%\">\n<p>confident</p>\n</td>\n<td valign=\"top\" width=\"19%\">\n<p>= tự tin</p>\n</td>\n<td valign=\"top\" width=\"18%\"> </td>\n<td valign=\"top\" width=\"17%\"> </td>\n</tr>\n</tbody>\n</table>\n<p><strong>★ Một vài cụm danh từ phổ biến dùng để miêu tả ngoại hình.</strong></p>\n<table class=\"MsoNormalTable\" border=\"1\">\n<tbody>\n<tr>\n<td valign=\"bottom\">\n<p>an oval face</p>\n</td>\n<td valign=\"bottom\" width=\"268\">\n<p>= khuôn mặt trái xoan</p>\n</td>\n</tr>\n<tr>\n<td valign=\"bottom\">\n<p>a round face</p>\n</td>\n<td valign=\"bottom\" width=\"268\">\n<p>= khuôn mặt tròn</p>\n</td>\n</tr>\n<tr>\n<td valign=\"bottom\">\n<p>a long face</p>\n</td>\n<td valign=\"bottom\" width=\"268\">\n<p>= khuôn mặt dài</p>\n</td>\n</tr>\n<tr>\n<td valign=\"bottom\">\n<p>a square face</p>\n</td>\n<td valign=\"bottom\" width=\"268\">\n<p>= mặt vuông chữ điền</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\">\n<p>short brown hair</p>\n</td>\n<td valign=\"top\" width=\"268\">\n<p>= tóc nâu ngắn</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\">\n<p>long black hair</p>\n</td>\n<td valign=\"top\" width=\"268\">\n<p>= tóc đen dài</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\">\n<p>curly hair</p>\n</td>\n<td valign=\"top\" width=\"268\">\n<p>= tóc xoăn</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\">\n<p>ponytail</p>\n</td>\n<td valign=\"top\" width=\"268\">\n<p>= tóc đuôi ngựa</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\">\n<p>wavy hair</p>\n</td>\n<td valign=\"top\" width=\"268\">\n<p>= tóc xoăn sóng</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\">\n<p>straight hair</p>\n</td>\n<td valign=\"top\" width=\"268\">\n<p>= tóc thẳng</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\">\n<p>long legs</p>\n</td>\n<td valign=\"top\" width=\"268\">\n<p>= đôi chân dài</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\">\n<p>full lips</p>\n</td>\n<td valign=\"top\" width=\"268\">\n<p>= môi đầy đặn</p>\n</td>\n</tr>\n<tr>\n<td valign=\"bottom\">\n<p>thin lips</p>\n</td>\n<td valign=\"bottom\" width=\"268\">\n<p>= môi mỏng</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\">\n<p>small ears</p>\n</td>\n<td valign=\"top\" width=\"268\">\n<p>= tai nhỏ</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\">\n<p>small mouth</p>\n</td>\n<td valign=\"top\" width=\"268\">\n<p>= miệng nhỏ</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\">\n<p>brown eyes</p>\n</td>\n<td valign=\"top\" width=\"268\">\n<p>= mắt nâu</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\">\n<p>small eyes</p>\n</td>\n<td valign=\"top\" width=\"268\">\n<p>= mắt nhỏ</p>\n</td>\n</tr>\n<tr>\n<td valign=\"bottom\">\n<p>big round eyes</p>\n</td>\n<td valign=\"bottom\" width=\"268\">\n<p>= mắt to tròn</p>\n</td>\n</tr>\n</tbody>\n</table>",
                "readingPassage": "My best friend is Nam. He is tall and thin. He has short black hair and big brown eyes. Nam is very friendly. He always helps me with my homework. He is also a creative boy; he loves making paper models.",
                "readingPassageTitle": "My Best Friend Nam",
                "videos": [
                    {
                        "id": "8aFC5ALD1uQ",
                        "title": "Tiếng Anh 6 Unit 3: Từ vựng trang 71 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "CrG7mP2Nc0c",
                        "title": "Tiếng Anh 6 Unit 3: Getting started trang 26, 27 Global Success(DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "rMdkrPptedo",
                        "title": "Tiếng Anh 6 Unit 3: A closer look 1 trang 28, 29 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "P1o7e1ziAUw",
                        "title": "Tiếng Anh 6 Unit 3: A closer look 2 trang 29, 30 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "xwlWyIhF5ow",
                        "title": "Tiếng Anh 6 Unit 3: Communication trang 31 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "75P-qpXmbYg",
                        "title": "Tiếng Anh 6 Unit 3: Skills 1 trang 32 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "Ee7jECCaEqA",
                        "title": "Tiếng Anh 6 Unit 3: Skills 2 trang 33 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "xdT5IJXNZEc",
                        "title": "Tiếng Anh 6 Unit 3: Looking back trang 34 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "h5c3dAzdIT4",
                        "title": "Tiếng Anh 6 Unit 3: Project trang 35 Global Success (DỄ HIỂU NHẤT)"
                    }
                ],
                "questions": {
                    "reading": [
                        {
                            "question": "What is the main topic of the passage?",
                            "options": [
                                "Unit 3: My Friends",
                                "Playing sports",
                                "Travelling around the world"
                            ],
                            "answer": "Unit 3: My Friends"
                        },
                        {
                            "question": "Which word is mentioned in the reading passage?",
                            "options": [
                                "active",
                                "helicopter",
                                "spaceship"
                            ],
                            "answer": "active"
                        },
                        {
                            "question": "How does the writer feel about the topic?",
                            "options": [
                                "Excited and happy",
                                "Bored and tired",
                                "Sad"
                            ],
                            "answer": "Excited and happy"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t4",
                "title": "Unit 4: My Neighbourhood",
                "subtitle": "Mô tả khu phố và cách so sánh tính từ",
                "vocab": [
                    {
                        "word": "art gallery",
                        "translation": "phòng trưng bày các tác phẩm nghệ thuật",
                        "phonetics": "/ˈɑːt ˌɡæl.ər.i/",
                        "type": "noun",
                        "sentence": "I can see a beautiful art gallery in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người phòng trưng bày các tác phẩm nghệ thuật tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "busy",
                        "translation": "nhộn nhịp, náo nhiệt",
                        "phonetics": "/ˈbɪz.i/",
                        "type": "adjective",
                        "sentence": "We want to busy together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau nhộn nhịp, náo nhiệt vào cuối tuần này."
                    },
                    {
                        "word": "cathedral",
                        "translation": "nhà thờ lớn, thánh đường",
                        "phonetics": "/kəˈθiː.drəl/",
                        "type": "noun",
                        "sentence": "There is a beautiful historic cathedral in the city center.",
                        "sentenceTranslation": "Có một nhà thờ lớn cổ kính và xinh đẹp ở trung tâm thành phố."
                    },
                    {
                        "word": "cross",
                        "translation": "đi ngang qua, qua, vượt",
                        "phonetics": "/krɒs/",
                        "type": "verb",
                        "sentence": "We want to cross together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau đi ngang qua, qua, vượt vào cuối tuần này."
                    },
                    {
                        "word": "dislike",
                        "translation": "không thích, ghét",
                        "phonetics": "/dɪˈslaɪk/",
                        "type": "verb",
                        "sentence": "We want to dislike together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau không thích, ghét vào cuối tuần này."
                    },
                    {
                        "word": "famous",
                        "translation": "nổi tiếng",
                        "phonetics": "/ˈfeɪ.məs/",
                        "type": "adjective",
                        "sentence": "We want to famous together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau nổi tiếng vào cuối tuần này."
                    },
                    {
                        "word": "faraway",
                        "translation": "xa xôi, xa",
                        "phonetics": "/ˌfɑː.rəˈweɪ/",
                        "type": "adjective",
                        "sentence": "We want to faraway together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau xa xôi, xa vào cuối tuần này."
                    },
                    {
                        "word": "finally",
                        "translation": "cuối cùng",
                        "phonetics": "/ˈfaɪ.nəl.i/",
                        "type": "adverb",
                        "sentence": "We want to finally together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau cuối cùng vào cuối tuần này."
                    },
                    {
                        "word": "narrow",
                        "translation": "hẹp, chật hẹp",
                        "phonetics": "/ˈnær.əʊ/",
                        "type": "adjective",
                        "sentence": "We want to narrow together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau hẹp, chật hẹp vào cuối tuần này."
                    },
                    {
                        "word": "outdoor",
                        "translation": "ngoài trời",
                        "phonetics": "/ˈaʊtˌdɔːr/",
                        "type": "adjective",
                        "sentence": "We want to outdoor together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau ngoài trời vào cuối tuần này."
                    },
                    {
                        "word": "railway station",
                        "translation": "ga tàu hỏa",
                        "phonetics": "/ˈreɪl.weɪ ˌsteɪ.ʃən/",
                        "type": "noun",
                        "sentence": "I can see a beautiful railway station in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người ga tàu hỏa tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "sandy",
                        "translation": "có cát, phủ cát",
                        "phonetics": "/ˈsæn.dɪ/",
                        "type": "adjective",
                        "sentence": "We want to sandy together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau có cát, phủ cát vào cuối tuần này."
                    },
                    {
                        "word": "square",
                        "translation": "quảng trường",
                        "phonetics": "/skweər/",
                        "type": "noun",
                        "sentence": "I can see a beautiful square in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người quảng trường tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "suburb",
                        "translation": "khu vực ngoại ô",
                        "phonetics": "/ˈsʌb.ɜːb/",
                        "type": "noun",
                        "sentence": "I can see a beautiful suburb in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người khu vực ngoại ô tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "turning",
                        "translation": "chỗ ngoặt, chỗ rẽ",
                        "phonetics": "/ˈtɜː.nɪŋ/",
                        "type": "noun",
                        "sentence": "I can see a beautiful turning in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người chỗ ngoặt, chỗ rẽ tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "workshop",
                        "translation": "phân xưởng (sản xuất, sửa chữa)",
                        "phonetics": "/ˈwɜːk.ʃɒp/",
                        "type": "noun",
                        "sentence": "I can see a beautiful workshop in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người phân xưởng (sản xuất, sửa chữa) tuyệt đẹp trong bức tranh này."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What is the neighbourhood like? - It's quiet and beautiful.",
                        "vietnamese": "Khu phố đó như thế nào? - Nó rất yên tĩnh và đẹp đẽ."
                    },
                    {
                        "english": "The streets in the suburb are wider than those in the city.",
                        "vietnamese": "Đường phố ở ngoại ô rộng rãi hơn đường phố ở thành phố."
                    }
                ],
                "grammar": "<p><strong>A. GRAMMAR</strong></p>\n<p><strong>I. Comparative adjectives (So sánh hơn của tính từ) </strong></p>\n<p><strong>1. So sánh hơn của tính từ là gì?</strong></p>\n<p>        Dạng so sánh hơn của tính từ thuộc cấu trúc so sánh hơn nói chung trong tiếng Anh. Đây là cấu trúc dùng để mô tả một đối tượng vượt trội, nổi bật hơn về một đặc điểm nào đó trong khi so sánh hai đối tượng với nhau. Với so sánh hơn của tính từ, các đặc điểm này được thể hiện bởi các tính từ trong câu. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong> He is taller than his younger brother. (Anh ấy cao hơn em trai của mình.)</p>\n<p>           This assignment is more interesting than the previous one. (Bài tập này thú vị hơn bài trước.)</p>\n<p><strong>2. Phân biệt tính từ ngắn và tính dài </strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"332\">\n<p style=\"text-align:center;\"><strong>Tính từ ngắn (Short adjectives)</strong></p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p style=\"text-align:center;\"><strong>Tính từ dài (Long adjectives)</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p>Là tính từ có một âm tiết</p>\n<p><strong>Ví dụ:</strong> tall, long, short, hard, …</p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>Là tính từ có 2 âm tiết trở lên</p>\n<p><strong>Ví dụ:</strong> beautiful, friendly, humorous, … </p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>3. Cấu trúc so sánh hơn với tính từ</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"332\">\n<p style=\"text-align:center;\"><strong>Đối với tính từ ngắn</strong></p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p style=\"text-align:center;\"><strong>Đối với tính từ dài</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p><strong>S + tobe +adj + er + than +S2</strong></p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p><strong>S + tobe + more + adj +than + S2</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p>Với tính từ ngắn, thêm đuôi “er” vào sau tính từ.</p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>Với tính từ dài, thêm “more” vào trước tính từ. </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong></p>\n<p>- My house is bigger than yours. (Nhà của tôi lớn hơn nhà của bạn.)</p>\n<p>- Today is hotter than yesterday. (Hôm nay nóng hơn hôm qua.)</p>\n<p>- This test is easier than the last one. (Bài kiểm tra này dễ hơn bài trước.)</p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>- He is more careful than before. (Anh ấy cẩn than hơn trước.)</p>\n<p>- This movie is more exciting than I expected. (Bộ phim này hồi hộp hơn tôi tưởng.)</p>\n<p>- The new teacher is more friendly than the old one. (Cô giáo mới thân thiện hơn cô giáo cũ. </p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>4. Cách thêm đuôi “er” vào tính từ ngắn </strong></p>\n<p><strong>• Đối với nhữn tính từ có một âm tiết, chỉ cần thêm hậu tố  “-er” vào sau các từ đó. </strong></p>\n<p><strong style=\"color: #c00000;\">            Ví dụ:  </strong>High → higher</p>\n<p>                        Cold → colder</p>\n<p>                        Large → larger</p>\n<p><strong>• Đối với các tính từ kết thúc bởi “y”, dù có 2 âm tiết vẫn là tính từ ngắn, những tính từ kết thúc bằng -y, chuyển -y thành -I và sau đó thêm hậu tố er</strong></p>\n<p><strong style=\"color: #c00000;\">            Ví dụ:</strong> Happy → happier</p>\n<p>                        Heavy → heavier</p>\n<p>                        Crazy → crazier</p>\n<p><strong>• Đối với những tính từ kết thúc bằng một phụ âm, đứng trước là một nguyên âm, cần gấp đôi phụ âm cuối, và sau đó thêm hậu tố “er”</strong></p>\n<p><strong style=\"color: #c00000;\">            Ví dụ:</strong>  Hot → hotter </p>\n<p>                        Big → bigger</p>\n<p>                        Fat → fatter</p>\n<p><strong>• Đối với tính từ kết thúc bởi nguyên âm “e”, khi muốn so sánh hơn, chỉ cần thêm đuôi “r”</strong></p>\n<p><strong style=\"color: #c00000;\">            Ví dụ:</strong>  Nice → nicer</p>\n<p><strong>• Các tính từ dưới đây dùng \"more\"</strong></p>\n<p>- Tính từ kết thúc bằng \"-ful\" hoặc \"less\": careful, helpful; useful;...</p>\n<p>- Tinh từ kết thúc bằng \"-ing\" hoặc \"-ed\": boring; willing; annoyed; surprised;...</p>\n<p>- Các tính từ khác: afraid; certain; correct; eager; exact; famous; foolish; frequent; modern; nervous; normal; recent;...</p>\n<p><strong>• Một số tính từ có hai âm tiết kết thúc bằng “et, ow, le, er, y” thì áp dụng quy tắc thêm đuôi như tính từ ngắn. </strong></p>\n<p><strong style=\"color: #c00000;\">           Ví dụ:  </strong>Quiet → quieter</p>\n<p>                       Clever → cleverer</p>\n<p>                       Narrow → narrower</p>\n<p><strong>5. Một số tính từ đặc biệt trong so sánh hơn</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"167\">\n<p align=\"center\"><strong>Tính từ</strong></p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p align=\"center\"><strong>So sánh hơn</strong></p>\n</td>\n<td valign=\"top\" width=\"305\">\n<p align=\"center\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"167\">\n<p>Good </p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p>better</p>\n</td>\n<td valign=\"top\" width=\"305\">\n<p>This restaurant is better than the one we went to last week. (Nhà hàng này tốt hơn cái chúng ta đã đi tuần trước.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"167\">\n<p>Bad</p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p>worse</p>\n</td>\n<td valign=\"top\" width=\"305\">\n<p>His attitude is worse than yours. (Thái độ của anh ta tệ hơn của anh.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"167\">\n<p>Much/ many</p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p>more</p>\n</td>\n<td valign=\"top\" width=\"305\">\n<p>She has more books than her brother. (Cô ấy có nhiều sách hơn anh trai mình.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"167\">\n<p>Far</p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p>farther / further</p>\n</td>\n<td valign=\"top\" width=\"305\">\n<p>My house is farther than yours from the school. (Nhà tôi xa trường hơn nhà bạn.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"167\">\n<p>Little </p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p>less</p>\n</td>\n<td valign=\"top\" width=\"305\">\n<p>I have less time than you to finish this assignment. (Tôi có ít thời gian hơn bạn để hoàn thành bài tập này.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"167\">\n<p>Few</p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p>fewer</p>\n</td>\n<td valign=\"top\" width=\"305\">\n<p>Tom made fewer mistakes than Jerry on the test. (Tom ít mắc lỗi hơn Jerry trong bài kiểm tra.)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong style=\"color: #c00000;\">Lưu ý: Phân biệt “older” và “elder”</strong></p>\n<p>        “Older” và “elder” đều dùng được như hai tính từ so sánh hơn khi muốn so sánh tuổi tác của hai đối tượng. Tuy nhiên, “elder” được dùng khi muốn so sánh tuổi của các thành viên trong gia đình. “Elder” không được dùng trong mẫu câu “elder than”.</p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p>Trong mẫu câu so sánh hơn với “than”, luôn dùng “older”</p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>My brother is older than me. =&gt; đúng</p>\n<p>My brother is elder than me. =&gt; sai</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p>Khi so sánh hai vật, luôn dùng “older”.</p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>This house is older than all the others in the street.</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p>Khi so sánh hai người, cần cân nhắc xem hai người có cùng gia đình không.</p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p><strong>Nếu cùng gia đình: </strong></p>\n<p>My elder brother doesn’t live with my parents.</p>\n<p><strong>Nếu không cùng gia đình:</strong></p>\n<p>The older girl is taking care of the younger. </p>\n</td>\n</tr>\n</tbody>\n</table>",
                "readingPassage": "I live in a peaceful suburb of Hanoi. My neighbourhood is much quieter than the city center. The air is fresh and there are many trees. We have a historic temple and a large park, but there are no big supermarkets.",
                "readingPassageTitle": "My Neighbourhood",
                "videos": [
                    {
                        "id": "4p2BcCbFVh4",
                        "title": "Tiếng Anh 6 Unit 4: Từ vựng trang 71 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "-T18ojjdYPo",
                        "title": "Tiếng Anh 6 Unit 4: Getting started trang 38, 39 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "TDGsjWdMoQc",
                        "title": "Tiếng Anh 6 Unit 4: A closer look 1 trang 40 Global Success - Cô Hoa (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "YWjq4h23ZEc",
                        "title": "Tiếng Anh 6 Unit 4: A closer look 2 trang 41, 42 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "ns_gf0j2vrs",
                        "title": "Tiếng Anh 6 Unit 4: Communication trang 43 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "dXcS4TXT9PM",
                        "title": "Tiếng Anh 6 Unit 4: Skills 1 trang 44 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "lu0I7v6PlxQ",
                        "title": "Tiếng Anh 6 Unit 4: Skills 2 trang 45 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "rZzSkKBcxbA",
                        "title": "Tiếng Anh 6 Unit 4: Looking back trang 46 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "1t411GtnaY8",
                        "title": "Tiếng Anh 6 Unit 4: Project trang 47 Global Success (DỄ HIỂU NHẤT)"
                    }
                ],
                "questions": {
                    "reading": [
                        {
                            "question": "What is the main topic of the passage?",
                            "options": [
                                "Unit 4: My Neighbourhood",
                                "Playing sports",
                                "Travelling around the world"
                            ],
                            "answer": "Unit 4: My Neighbourhood"
                        },
                        {
                            "question": "Which word is mentioned in the reading passage?",
                            "options": [
                                "art gallery",
                                "helicopter",
                                "spaceship"
                            ],
                            "answer": "art gallery"
                        },
                        {
                            "question": "How does the writer feel about the topic?",
                            "options": [
                                "Excited and happy",
                                "Bored and tired",
                                "Sad"
                            ],
                            "answer": "Excited and happy"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t5",
                "title": "Unit 5: Natural Wonders of the World",
                "subtitle": "Kỳ quan thiên nhiên và cách so sánh nhất",
                "vocab": [
                    {
                        "word": "amazing",
                        "translation": "tuyệt vời",
                        "phonetics": "/əˈmeɪ.zɪŋ/",
                        "type": "adjective",
                        "sentence": "We want to amazing together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau tuyệt vời vào cuối tuần này."
                    },
                    {
                        "word": "backpack",
                        "translation": "ba-lô",
                        "phonetics": "/ˈbæk.pæk/",
                        "type": "noun",
                        "sentence": "I can see a beautiful backpack in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người ba-lô tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "boat",
                        "translation": "con thuyền",
                        "phonetics": "/bəʊt/",
                        "type": "noun",
                        "sentence": "I can see a beautiful boat in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người con thuyền tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "compass",
                        "translation": "la bàn",
                        "phonetics": "/ˈkʌm.pəs/",
                        "type": "noun",
                        "sentence": "We use a compass to draw circles in geometry.",
                        "sentenceTranslation": "Chúng tớ dùng com-pa để vẽ các hình tròn trong hình học."
                    },
                    {
                        "word": "desert",
                        "translation": "sa mạc",
                        "phonetics": "/ˈdez.ət/",
                        "type": "noun",
                        "sentence": "I can see a beautiful desert in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người sa mạc tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "island",
                        "translation": "đảo, hòn đảo",
                        "phonetics": "/ˈaɪ.lənd/",
                        "type": "noun",
                        "sentence": "I can see a beautiful island in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người đảo, hòn đảo tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "join in",
                        "translation": "tham gia",
                        "phonetics": "/dʒɔɪn/",
                        "type": "verb",
                        "sentence": "We want to join in together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau tham gia vào cuối tuần này."
                    },
                    {
                        "word": "landscape",
                        "translation": "phong cảnh",
                        "phonetics": "/ˈlænd.skeɪp/",
                        "type": "noun",
                        "sentence": "I can see a beautiful landscape in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người phong cảnh tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "litter",
                        "translation": "vứt rác (bừa bãi)",
                        "phonetics": "/ˈlɪt.ər/",
                        "type": "verb",
                        "sentence": "We want to litter together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau vứt rác (bừa bãi) vào cuối tuần này."
                    },
                    {
                        "word": "man-made",
                        "translation": "nhân tạo",
                        "phonetics": "/ˌmænˈmeɪd/",
                        "type": "adjective",
                        "sentence": "We want to man-made together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau nhân tạo vào cuối tuần này."
                    },
                    {
                        "word": "mount",
                        "translation": "núi, đồi, đỉnh",
                        "phonetics": "/maʊnt/",
                        "type": "noun",
                        "sentence": "I can see a beautiful mount in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người núi, đồi, đỉnh tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "mountain range",
                        "translation": "dãy núi",
                        "phonetics": "/ˈmaʊn.tɪn ˌreɪndʒ/",
                        "type": "noun",
                        "sentence": "I can see a beautiful mountain range in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người dãy núi tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "natural wonder",
                        "translation": "kì quan thiên nhiên",
                        "phonetics": "/ˈnætʃ.ər.əl ˈwʌn.dər/",
                        "type": "noun",
                        "sentence": "I can see a beautiful natural wonder in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người kì quan thiên nhiên tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "plaster",
                        "translation": "băng, gạc y tế",
                        "phonetics": "/ˈplɑː.stər/",
                        "type": "noun",
                        "sentence": "I can see a beautiful plaster in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người băng, gạc y tế tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "rock",
                        "translation": "tản đá, phiến đá",
                        "phonetics": "/rɒk/",
                        "type": "noun",
                        "sentence": "I can see a beautiful rock in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người tản đá, phiến đá tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "show",
                        "translation": "(sự) trình diễn",
                        "phonetics": "/ʃəʊ/",
                        "type": "n, v",
                        "sentence": "I can see a beautiful show in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người (sự) trình diễn tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "suncream",
                        "translation": "kem chống nắng",
                        "phonetics": "/ˈsʌn ˌkriːm/",
                        "type": "noun",
                        "sentence": "I can see a beautiful suncream in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người kem chống nắng tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "waterfall",
                        "translation": "thác nước",
                        "phonetics": "/ˈwɔː.tə.fɔːl/",
                        "type": "noun",
                        "sentence": "The waterfall in the forest is breathtaking.",
                        "sentenceTranslation": "Thác nước ở trong rừng đẹp đến nghẹt thở."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Which is the highest mountain in Vietnam? - Fansipan.",
                        "vietnamese": "Ngọn núi nào cao nhất Việt Nam? - Fansipan."
                    },
                    {
                        "english": "You must wear sports shoes when climbing the mountain.",
                        "vietnamese": "Bạn bắt buộc phải đi giày thể thao khi leo núi."
                    }
                ],
                "grammar": "<p><strong>A. GRAMMAR</strong></p>\n<p><strong>I. Countable and uncountable nouns (Danh từ đếm được và danh từ không đếm được)</strong></p>\n<p>        Trong tiếng Anh, danh từ không đơn thuần là những từ dùng để gọi tên sự vật. Danh từ được chia thành nhiều loại, trong đó danh từ đếm được và không đếm được là hai loại cơ bản nhất.</p>\n<p><strong>1. Danh từ đếm được và không đếm được là gì?</strong></p>\n<p><strong>1.1. Danh từ đếm được (Countable nouns) </strong></p>\n<p><strong>a. Định nghĩa </strong></p>\n<p><strong>        Danh từ đếm được (Countable nouns) </strong>là những danh từ chỉ người, vật, sự việc hoặc khái niệm có thể đếm được. Danh từ đếm được có thể được dùng với số lượng bằng số hoặc bằng các từ chỉ số lượng (như a, an, one, two, three, …) cũng như các lượng từ (some, many, a few, a couple of, a lot of, a number of …). Danh từ đếm được thường có dạng số ít và số nhiều. </p>\n<p><strong>• Dạng số ít:</strong> là những danh từ đếm được chỉ một sự vật, hiện tượng, duy nhất. Danh từ đếm được số ít thường được dùng với mạo từ <strong>a/an</strong></p>\n<p><strong style=\"color: #c00000;\">           Ví dụ:</strong> a pen, a cup, an onion, a dress, a bag, … </p>\n<p><strong>• Dạng số nhiều:</strong> là những danh từ đếm được chỉ nhiều sự vật, hiện tượng. Danh từ đếm được số nhiều thường được chuyển sang từ danh từ đếm được số ít bằng cách thêm “<strong>s</strong>” hoặc “<strong>es</strong>” vào tận cùng của danh từ. </p>\n<p>- Nếu danh từ kết thúc bằng: <strong>s, sh, ch, x, o</strong> khi chuyển sang số nhiều thì cần thêm “<strong>es</strong>”</p>\n<p>- Nếu danh từ có tận cùng là “<strong>y</strong>” thì khi chuyển sang số nhiều sẽ đổi “<strong>y</strong>” thành “<strong>i</strong>” và thêm “<strong>es</strong>”.</p>\n<p>- Đối với các danh từ có tận cùng là “<strong>fe, f, ff</strong>” thì ta sẽ bỏ đi và thêm “<strong>ves</strong>” vào cuối câu. </p>\n<p><strong style=\"color: #c00000;\">             Ví dụ:</strong> buses, boxes, cities, babies, knives, wives</p>\n<p><strong>b. Một số danh từ bất quy tắc thường gặp</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"221\">\n<p><strong>Danh từ số ít</strong></p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p><strong>Danh từ số nhiều</strong></p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p><strong>Nghĩa</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"221\">\n<p>Man </p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Men </p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Đàn ông </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"221\">\n<p>Woman</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Women</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Phụ nữ </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"221\">\n<p>Child </p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Children</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Đứa trẻ</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"221\">\n<p>Sheep</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Sheep</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Cừu</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"221\">\n<p>Tooth</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Teeth</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Răng </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"221\">\n<p>Fish</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Fish</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Cá </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"221\">\n<p>Bacterium</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Bacteria</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Vi khuẩn </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"221\">\n<p>Foot</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Feet</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Bàn chân</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"221\">\n<p>Mouse</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Mice</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Con chuột</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"221\">\n<p>Person</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>People</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Con người</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"221\">\n<p>Ox</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Oxen </p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Con bò đực </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"221\">\n<p>Deer </p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Deer </p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Con hưu</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"221\">\n<p>Louse </p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Lice </p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Con rận </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"221\">\n<p>Goose </p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Geese </p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Con ngỗng </p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>1.2. Danh từ không đếm được (Uncountable nouns)</strong> </p>\n<p><strong>a. Định nghĩa </strong></p>\n<p><strong>        Danh từ không đếm được (Uncountable nouns)</strong> là những thứ không thể đếm được một cách cụ thể, thường là những khái niệm trừu tượng hoặc hiện tượng tự nhiên. Danh từ không đếm được được chia làm 5 nhóm điển hình: </p>\n<p><strong>• Danh từ chỉ khái niệm trừu tượng:</strong> help (sự giúp đỡ), knowledge (kiến thức, sự hiểu biết), advice (lời khuyên), information (thông tin), …</p>\n<p><strong>• Danh từ chỉ đồ ăn: </strong>meat (thịt), rice (gạo), water (nước), … </p>\n<p><strong>• Danh từ chỉ hiện tượng tự nhiên:</strong> rain (mưa), snow (tuyết), heat (nhiệt độ), wind (gió), …</p>\n<p><strong>• Danh từ chỉ hoạt động: </strong>walking (đi bộ), cooking (nấu ăn), sleeping (đi ngủ), …</p>\n<p><strong>• Danh từ chỉ môn học, lĩnh vực nhất định:</strong> music (âm nhạc), mathematics (môn toán), history (lịch sử), … </p>\n<p><strong>b. Các lượng từ đi với danh từ không đếm được</strong></p>\n<p>        Tuy các danh từ không đếm được không thể đếm được trực tiếp bằng số, nhưng bạn vẫn có thể biểu thị số lượng của chúng bằng những cách khác nhau. Khi muốn cụ thể hóa về số lượng của một danh từ không đếm được, ta có thể sử dụng cấu trúc: </p>\n<p style=\"text-align:center;\"><strong style=\"background: yellow;\">Số lượng + Đơn vị đo lường + of + danh từ không đếm được</strong></p>\n<p><strong style=\"color: #c00000;\">Một số cách diễn đạt về định lượng phổ biến: </strong></p>\n<p><strong>• </strong>Sử dụng lượng từ: some, any, much, a great deal of, a bit of</p>\n<p><strong>• </strong>Sử dụng đơn vị đo lường: kilograms, grams, pounds</p>\n<p><strong>• </strong>Sử dụng đơn vị đo thể tích: liters, gallons, cups</p>\n<p><strong>• </strong>Sử dụng đơn vị đo độ dài: meters, feet, inches</p>\n<p><strong>• </strong>Sử dụng các danh từ như: piece, slice, bar, loaf, bottle, can, box...</p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"332\">\n<p align=\"center\"><strong>Cách diễn đạt</strong></p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p align=\"center\"><strong>Ý nghĩa</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p>Some water</p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>Một ít nước</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p>Little hope</p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>Ít hy vọng</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p>A bit of cheese</p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>Một chút phô mai</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p>Two kilograms of rice</p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>Hai kilogam gạo</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p>A cup of coffee</p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>Một cốc cà phê</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p>A piece of advice</p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>Một lời khuyên</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p>A loaf of bread</p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>Một ổ bánh mỳ</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p>A tube of toothpaste</p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>Một tuýp kem đánh răng</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p>A scoop of ice cream</p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>Một muỗng kem</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p>A peal of laughter</p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>Một tràng cười</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p>A clove of garlic</p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>Một nhánh tỏi</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>2. Những trường hợp đặc biệt của danh từ đếm được và không đếm được</strong></p>\n<p>        Trong tiếng Anh, một số danh từ có thể dùng được cả ở dạng đếm được và không đếm được, và ý nghĩa của chúng sẽ thay đổi tùy vào từng ngữ cảnh cụ thể. Đây là điểm ngữ pháp thú vị nhưng cũng dễ gây nhầm lẫn, vì vậy cần hết sức lưu ý cẩn thận khi sử dụng. </p>\n<p><strong>• Hair</strong></p>\n<p>- <strong>Danh từ không đếm được:</strong> chỉ toàn bộ mái tóc trên đầu. (She has a long hair – Cô ấy có một mái tóc dài.)</p>\n<p>- <strong>Danh từ đếm được:</strong> chỉ từng sợi tóc riêng biệt. (I saw a few gray hairs on my father’s head – Tôi nhìn thấy một vài sợi tóc muối tiêu trên đầu bố tôi.)</p>\n<p><strong>• Room</strong></p>\n<p>- <strong>Danh từ không đếm được:</strong> chỉ không gian bất kỳ. (There is room for no more than three cars. – Chỉ có không gian cho tối đa ba chiếc xe.)</p>\n<p>- <strong>Danh từ đếm được:</strong> chỉ căn phòng. (There are 4 rooms in my house. – Có 4 phòng trong nhà tôi.)</p>\n<p><strong>• Time </strong></p>\n<p>- <strong>Danh từ không đếm được:</strong> chỉ thời gian. (I don’t have enough time to finish this project. – Tôi không có đủ thời gian để hoàn thành dự án này.)</p>\n<p>- <strong>Danh từ đếm được:</strong> chỉ khoảng thời gian, vô số lần. (I have read this book three times. – Tôi đã đọc cuốn sách này 3 lần.)</p>\n<p><strong>3. Cách phân biệt danh từ đếm được và không đếm được</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"221\">\n<p style=\"text-align:center;\"><strong>Đặc điểm</strong></p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p style=\"text-align:center;\"><strong>Danh từ đếm được</strong></p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p style=\"text-align:center;\"><strong>Danh từ không đếm được</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"221\">\n<p><strong>Hình thái </strong></p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Gồm có hai dạng: Danh từ đếm được số ít và số nhiều</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Chỉ có một dạng, thường là số ít</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"221\">\n<p><strong>Mạo từ</strong></p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Thường đứng sau mạo từ “a/an”</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Thường đứng sau mạo từ “the” hoặc một danh từ khác</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"221\">\n<p><strong>Cách định lượng</strong></p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Đi kèm các từ chỉ số đếm </p>\n<p>Ví dụ: two dogs, five fingers</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Đi kèm các danh từ chỉ đơn vị đo lường</p>\n<p>Ví dụ:  a cup of coffee, two kilograms of rice</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"221\">\n<p><strong>Dùng với lượng từ</strong></p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Đi cùng “a few, few, many + danh từ số nhiều đếm được.</p>\n<p>Ví dụ: many students, a few books</p>\n</td>\n<td valign=\"top\" width=\"221\">\n<p>Đi cùng a little, little, much, a little bit + danh từ không đếm được</p>\n<p>Ví dụ: a little bit of sugar, much money, little milk</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong style=\"color: #c00000;\">Lưu ý:</strong> </p>\n<p><strong>• Trong tiếng Anh, có một số trường hợp danh từ không đếm được nhưng kết thúc bằng đuôi “s” dễ gây nhầm lẫn trong quá trình xác định danh từ. Sau đây là ví dụ về một số trường hợp cần lưu ý: </strong></p>\n<p>- News: tin tức</p>\n<p>- Linguistics: Ngôn ngữ học</p>\n<p>- Mathematics: môn Toán</p>\n<p>- Physics: môn Vật lý</p>\n<p>- Athletics: Điền kinh</p>\n<p><strong>• Ngoài ra, trong tiếng Anh cũng có một số danh từ luôn ở dạng số nhiều (danh từ đặc biệt). Ví dụ:</strong></p>\n<p>- Sunglasses /ˈsʌnˌglæsɪz/: Kính râm</p>\n<p>- Scissors /ˈsɪzərz/: Cây kéo</p>\n<p>- Tweezers /ˈtwizərz/: Cái nhíp</p>\n<p>- Binoculars /bəˈnɑkjələrz/: Ống nhòm</p>\n<p>- Refreshments /rəˈfrɛʃmənts/: Đồ uống giải khát</p>\n<p>- Headquarters /ˈhɛdˌkwɔrtərz/: Trụ sở chính</p>\n<p>- Premises /ˈprɛməsəz/: Cơ sở</p>\n<p>- Gymnastics /ʤɪmˈnæstɪks/: Thể dục</p>\n<p>- Congratulations /kənˌgræʧəˈleɪʃənz/: Chúc mừng</p>\n<p>- Clothes /kloʊðz/: Quần áo</p>\n<p>- Jeans /ʤinz/: Quần jean</p>\n<p>- Shorts /ʃɔrts/: Quần short</p>\n<p>- Trousers /ˈtraʊzərz/: Quần dài</p>\n<p>- Underpants /ˈʌndərˌpænts/: Quần lót</p>\n<p>- Tights /taɪts/: Quần bó</p>\n<p>- Stockings /ˈstɑkɪŋz/: Vớ</p>\n<p>- Pajamas /pəˈʤɑməz/: Đồ ngủ</p>\n<p>- Braces /ˈbreɪsəz/: Niềng răng</p>\n<p>- Goods /gʊdz/: Các mặt hàng</p>\n<p>- Odds /ɑdz/: Tỷ lệ cược</p>\n<p>- Troops /trups/: Quân</p>\n<p>- Scales /skeɪlz/: Quy mô</p>\n<p>- Intestines /ɪnˈtɛstənz/: Ruột</p>\n<p>- Acoustics /əˈkustɪks/: Âm học</p>\n<p>- Manners /ˈmænərz/: Tác phong</p>\n<p>- Ethics /ˈɛθɪks/: Đạo đức</p>\n<p>- Mathematics /ˌmæθəˈmætɪks/: Toán học</p>\n<p><strong>II. Modal verb: must / mustn’t (Động từ tình thái “must” và “mustn’t”)</strong></p>\n<p><strong>1. Must là gì? </strong></p>\n<p><strong>        Must </strong>là động từ tình thái hay còn gọi là động từ khuyết thiếu, đóng vai trò như một trợ động từ dùng để bổ trợ cho động từ chính trong câu. “Must” mang nhiều ý nghĩa khác nhau (phụ thuộc vào ngữ cảnh) như “phải”, “cần phải”, “chắc hẳn là”. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong>  You must wear a helmet when riding a motorbike. (Bạn phải đội mũ bảo hiểm khi đi xe máy.)</p>\n<p>            Students must submit their assignments by Friday. (Học sinh cần phải nộp bài trước thứ Sáu.)</p>\n<p>            That must be her new boyfriend. They’re always together. (Chắc hẳn đó là bạn trai mới của cô ấy. Họ luôn đi cùng nhau.)</p>\n<p><strong>2. Cấu trúc của “must” trong tiếng Anh</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"19%\">\n<p align=\"center\"><strong>Thể câu</strong></p>\n</td>\n<td valign=\"top\" width=\"39%\">\n<p align=\"center\"><strong>Công thức</strong></p>\n</td>\n<td valign=\"top\" width=\"40%\">\n<p align=\"center\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"19%\">\n<p><strong>Khẳng định</strong></p>\n</td>\n<td valign=\"top\" width=\"39%\">\n<p><strong>S + must + V (nguyên thể)</strong></p>\n</td>\n<td valign=\"top\" width=\"40%\">\n<p>All passengers must fasten their seat belts. (Tất cả các hành khách phải thắt dây an toàn.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"19%\">\n<p><strong>Phủ định</strong></p>\n</td>\n<td valign=\"top\" width=\"39%\">\n<p><strong>S + must not (mustn’t) + V (nguyên thể)</strong></p>\n</td>\n<td valign=\"top\" width=\"40%\">\n<p>You mustn’t stay up to late, it’s bad for you. (Bạn không được thức khuya, việc đó không tốt cho bạn.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"19%\">\n<p><strong>Nghi vấn </strong></p>\n</td>\n<td valign=\"top\" width=\"39%\">\n<p><strong>Must + S + V (nguyên thể)?</strong></p>\n</td>\n<td valign=\"top\" width=\"40%\">\n<p>Must we attend the meeting? (Chúng ta phải tham dự cuộc họp à?)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong style=\"color: #c00000;\">Lưu ý: </strong></p>\n<p>• Mọi chủ thể đều dùng chung một hình thái của động từ khuyết thiếu này là “must”.</p>\n<p>• “Must” đứng một mình, không thể sử dụng kèm với động từ khuyết thiếu khác. </p>\n<p>• Dạng phủ định là “must not / musn’t”, không sử dụng trợ động từ đi kèm. </p>\n<p>• Sử dụng dạng đầy đủ “must not” trong bối cảnh trang trọng hoặc khi muốn nhấn mạnh điều gì đó. (<em>You must not enter this area without proper authorization. – Bạn không được phép vào khu vực này nếu không có sự cho phép.)</em></p>\n<p>• Dạng nghi vấn của “must” không sử dụng trợ động từ đi kèm. </p>\n<p><strong>3. Must + gì?</strong></p>\n<p><strong>3.1. Cấu trúc Must + V</strong></p>\n<p>Trong các loại cấu trúc với “must” thì cấu trúc Must + V xuất hiện phổ biến hơn cả. Trong đó, cấu trúc này xuất hiện trong các tình huống sau: </p>\n<p><img src=\"../tieng-anh-6-kn/images/ngu-phap-unit-5-290077.PNG\" alt=\"Ngữ pháp Tiếng Anh lớp 6 Global Success Unit 5: Natural Wonders of the world (hay, chi tiết)\" width=\"546\" height=\"270\" /></p>\n<p><strong>a. Cấu trúc Must + V thể hiện một nghĩa vụ hoặc nhiệm vụ cá nhân mà người nói cho là quan trọng. </strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong>  I must finish writing the literature review before meeting my supervisor tomorrow. (Tôi phải hoàn thành phần tổng quan tài liệu trước khi gặp giảng viên hướng dẫn vào ngày mai.)</p>\n<p>           You must remember to bring your student ID if you want to enter the library during the exam week. (Bạn phải nhớ mang theo thẻ sinh viên nếu muốn vào thư viện trong tuần thi.)</p>\n<p>           We must submit the group project by 11:59 PM tonight, or it won’t be graded. (Chúng ta phải nộp bài tập nhóm trước 11:59 tối nay, nếu không sẽ không được chấm điểm.)</p>\n<p><strong>b. Cấu trúc Must + V được dùng để nhấn mạnh một ý kiến hay sự cầ thiết của một việc làm, một hành động nào đó. </strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:  </strong>We must take immediate action to reduce plastic waste before it’s too late. (Chúng ta phải hành động ngay lập tức để giảm rác thải nhựa trước khi quá muộn.)</p>\n<p>           Students must understand the importance of academic integrity in all their assignments. (Học sinh phải hiểu tầm quan trọng của tính trung thực trong học thuật đối với mọi bài tập của mình.)</p>\n<p>           You mus learn to manage your time better if you want to balance school and personal life. (Bạn phải học cách quản lý thời gian tốt hơn nếu muốn cân bằng giữa việc học và cuộc sống cá nhân.)</p>\n<p><strong>c. “Must have” với chức năng thể hiện một giả định hay một lập luận có căn cứ: S + must have + Vpii</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:  </strong>She looks exhausted this morning. She must have stayed up all night to finish the report. (Cô ấy trông kiệt sức sáng nay. Chắc hẳn cô ấy đã thức cả đêm để hoàn thành bản báo cáo.)</p>\n<p>           There’s water all over the kichen floor. Someone must have forgotten to turn off the tap. (Sàn bếp toàn là nước. Chắc ai đó đã quên không khóa vòi nước.)</p>\n<p>           They arrived late to the meeting. They must have gotten stuck in traffic. (Họ đến cuộc họp muộn. Chắc hẳn họ bị kẹt xe.)</p>\n<p><strong>d. Cấu trúc Must còn có thể được dùng để đưa ra một lời đề nghị hay một lời khuyên nào đó mà người nói rất muốn làm. </strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:  </strong>You must try the Bún chả when you’re in Hanoi – it’s absolutely delicious! (Bạn nhất định phải thử bún chả khi đến Hà Nội – món đó rất ngon!)</p>\n<p>           You must read this book on queer theory, it completely changed the way I see gender and indentity. (Bạn phải đọc cuốn sách này về lý thuyết queer, nó thực sự thay đổi cách tôi nhìn nhận về giới và bản sắc.)</p>\n<p>           We must go see the fireworks this weekend, it’s the last show of the year! (Chúng ta nhất định phải đi xem pháo hoa cuối tuần này, đó là buổi bắn cuối cùng củ3.2a năm.)</p>\n<p><strong>3.2. Cấu trúc Must be</strong></p>\n<p>Trong khi cấu trúc Must + V mang ý nghĩa “phải làm gì” hay “chắc chắn nên làm gì” thì cấu trúc Must be lại được dùng để đưa ra một lời suy luận, mang nghĩa “hẳn là”. Trong đó, “Must be” có 3 cách dùng: </p>\n<p><img src=\"../tieng-anh-6-kn/images/ngu-phap-unit-5-290078.PNG\" alt=\"Ngữ pháp Tiếng Anh lớp 6 Global Success Unit 5: Natural Wonders of the world (hay, chi tiết)\" width=\"549\" height=\"284\" /></p>\n<p><strong>a. Must be + Tính từ (Hẳn là)</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• She keeps yawning and rubbing her eyes. She must be tired after staying up late last night. (Cô ấy cứ ngáp và dụi mắt liên tục. Hẳn là mệt sau khi thức khuya đêm qua.)</p>\n<p>• Linh is smiling a lot today. She must be very happy. (Linh cưới rất nhiều vào ngày hôm nay. Chắc hẳn bạn ấy đang rất vui.)</p>\n<p>• He hasn’t replied to any messages since this morning. He must be really busy with work. (Từ sáng đến giờ anh ấy chưa trả lời tin nhắn nào cả. Hẳn là đang rất bận với công việc.)</p>\n<p><strong>b. Must be + Danh từ (Hẳn là ai, cái gì)</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• That must be the new math teacher. Everyone is talking about her. (Kia hẳn là cô giáo dạy toán mới. Ai cũng đang nói về cô ấy.)</p>\n<p>• He must be a soccer player, he’s always practicing on the field after school. (Cậu ấy hẳn là một cầu thủ bóng đá, cậu ấy luôn tập luyện trên sân sau giờ học.)</p>\n<p>• This must be our science book. It has our school’s name on the cover. (Cuốn này hẳn là sách khoa học của chúng ta. Trên bìa có tên trường của chúng ta.)</p>\n<p><strong>c. Must be + Ving (Hẳn đang làm gì)</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• It’s so noisy in the music room. They must be practicing for the school concert. (Phòng nhạc ồn quá. Họ hẳn đang luyện tập cho buổi biểu diễn của trường.)</p>\n<p>• Look! The lights are still on in the classroom. The teacher must be teaching. (Nhìn kìa! Đèn trong lớp vẫn còn sáng. Cô giáo hẳn đang dạy học.)</p>\n<p><strong>4. Cấu trúc Mustn’t</strong></p>\n<p>Mustn’t (viết tắt của Must not) được sử dụng trong hai trường hợp chính: </p>\n<p><strong>a. Ngăn cấm người khác không được làm gì</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• You must not talk during the exam. (Bạn không được nói chuyện trong lúc làm bài kiểm tra.) </p>\n<p>• Students must not run in the hallway. (Học sinh không được chạy trong hành lang.)</p>\n<p>• We must not touch the animals at the zoo. (Chúng ta không được chạm vào các con vật trong sở thú.)</p>\n<p><strong>b. Nói về một sự việc hoặc một tình trạng không thể chấp nhận được. </strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• There must not be any bullying at school. (Không được có hành vi bắt nạt nào ở trường.)</p>\n<p>• There must not be any cheating during tests. (Không được có sự gian lận nào trong các bài kiểm tra.)</p>",
                "readingPassage": "Vietnam has many natural wonders. Fansipan is the highest mountain in the country. Ha Long Bay has beautiful islands and caves. If you travel there, you must bring a camera to take photos of the wonderful views.",
                "readingPassageTitle": "Wonders of Vietnam",
                "videos": [
                    {
                        "id": "AHiSx9N0orI",
                        "title": "Tiếng Anh 6 Unit 5: Từ vựng trang 71 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "2K_ZWZySyfo",
                        "title": "Tiếng Anh 6 Unit 5: A closer look 2 trang 51, 52 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "hLTnyBTDvVk",
                        "title": "Tiếng Anh 6 Unit 5: Communication trang 53 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "QNlMPdEqfVg",
                        "title": "Tiếng Anh 6 Unit 5: Skills 1 trang 54 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "7RL9HrQj2ZQ",
                        "title": "Tiếng Anh 6 Unit 5: Skills 2 trang 55 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "008pw6-76BA",
                        "title": "Tiếng Anh 6 Unit 5: Looking back trang 56 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "we8MDkn6fAg",
                        "title": "Tiếng Anh 6 Unit 5: Project trang 57 Global Success (HAY NHẤT)"
                    }
                ],
                "questions": {
                    "reading": [
                        {
                            "question": "What is the main topic of the passage?",
                            "options": [
                                "Unit 5: Natural Wonders of the World",
                                "Playing sports",
                                "Travelling around the world"
                            ],
                            "answer": "Unit 5: Natural Wonders of the World"
                        },
                        {
                            "question": "Which word is mentioned in the reading passage?",
                            "options": [
                                "amazing",
                                "helicopter",
                                "spaceship"
                            ],
                            "answer": "amazing"
                        },
                        {
                            "question": "How does the writer feel about the topic?",
                            "options": [
                                "Excited and happy",
                                "Bored and tired",
                                "Sad"
                            ],
                            "answer": "Excited and happy"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t6",
                "title": "Unit 6: Our Tet Holiday",
                "subtitle": "Ngày tết cổ truyền và dự định tương lai",
                "vocab": [
                    {
                        "word": "behave",
                        "translation": "đối xử, cư xử",
                        "phonetics": "/bɪˈheɪv/",
                        "type": "verb",
                        "sentence": "We want to behave together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau đối xử, cư xử vào cuối tuần này."
                    },
                    {
                        "word": "celebrate",
                        "translation": "kỉ niệm",
                        "phonetics": "/ˈsel.ə.breɪt/",
                        "type": "verb",
                        "sentence": "We want to celebrate together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau kỉ niệm vào cuối tuần này."
                    },
                    {
                        "word": "cheer",
                        "translation": "chúc mừng",
                        "phonetics": "/tʃɪər/",
                        "type": "verb",
                        "sentence": "We want to cheer together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau chúc mừng vào cuối tuần này."
                    },
                    {
                        "word": "decorate",
                        "translation": "trang hoàng",
                        "phonetics": "/ˈdek.ə.reɪt/",
                        "type": "verb",
                        "sentence": "We want to decorate together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau trang hoàng vào cuối tuần này."
                    },
                    {
                        "word": "family gathering",
                        "translation": "sum họp gia đình",
                        "phonetics": "/ˈfæm.əl.i ˈɡæð.ər.ɪŋ/",
                        "type": "noun",
                        "sentence": "I can see a beautiful family gathering in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người sum họp gia đình tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "firework",
                        "translation": "pháo hoa",
                        "phonetics": "/ˈfaɪə.wɜːk/",
                        "type": "noun",
                        "sentence": "I can see a beautiful firework in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người pháo hoa tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "fun",
                        "translation": "sự vui đùa, vui vẻ",
                        "phonetics": "/fʌn/",
                        "type": "noun",
                        "sentence": "I can see a beautiful fun in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người sự vui đùa, vui vẻ tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "luck",
                        "translation": "điều may mắn",
                        "phonetics": "/lʌk/",
                        "type": "noun",
                        "sentence": "I can see a beautiful luck in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người điều may mắn tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "lucky money",
                        "translation": "tiền lì xì",
                        "phonetics": "/ˈlʌk.i ˈmʌn.i/",
                        "type": "noun",
                        "sentence": "I can see a beautiful lucky money in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người tiền lì xì tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "mochi rice cake",
                        "translation": "bánh gạo mochi",
                        "phonetics": "/ˈməʊ.tʃi ˈraɪs ˌkeɪk/",
                        "type": "noun",
                        "sentence": "I can see a beautiful mochi rice cake in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người bánh gạo mochi tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "relative",
                        "translation": "bà con (họ hàng)",
                        "phonetics": "/ˈrel.ə.tɪv/",
                        "type": "noun",
                        "sentence": "I can see a beautiful relative in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người bà con (họ hàng) tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "strike",
                        "translation": "đánh, điểm",
                        "phonetics": "/straɪk/",
                        "type": "verb",
                        "sentence": "We want to strike together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau đánh, điểm vào cuối tuần này."
                    },
                    {
                        "word": "temple",
                        "translation": "ngôi đền",
                        "phonetics": "/ˈtem.pəl/",
                        "type": "noun",
                        "sentence": "Many people visit the temple during holidays.",
                        "sentenceTranslation": "Nhiều người đi viếng đền chùa trong các dịp lễ tết."
                    },
                    {
                        "word": "throw",
                        "translation": "ném, vứt",
                        "phonetics": "/θrəʊ/",
                        "type": "verb",
                        "sentence": "We want to throw together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau ném, vứt vào cuối tuần này."
                    },
                    {
                        "word": "welcome",
                        "translation": "chào đón",
                        "phonetics": "/ˈwel.kəm/",
                        "type": "verb",
                        "sentence": "We want to welcome together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau chào đón vào cuối tuần này."
                    },
                    {
                        "word": "wish",
                        "translation": "điều ước, ước, chúc",
                        "phonetics": "/wɪʃ/",
                        "type": "n, v",
                        "sentence": "I can see a beautiful wish in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người điều ước, ước, chúc tuyệt đẹp trong bức tranh này."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What should you do at Tet? - We should visit our grandparents.",
                        "vietnamese": "Chúng ta nên làm gì vào dịp Tết? - Chúng ta nên đi thăm ông bà."
                    },
                    {
                        "english": "I will buy peach blossoms tomorrow.",
                        "vietnamese": "Tớ sẽ đi mua hoa đào vào ngày mai."
                    }
                ],
                "grammar": "<p><strong>A. GRAMMAR</strong></p>\n<p><strong>I. Should / Shouldn’t for advice (Should và Shouldn’t dùng để đưa ra lời khuyên)</strong></p>\n<p><strong>1. Định nghĩa</strong></p>\n<p><strong>        “Should” </strong>là một động từ khuyết thiếu (modal verb) trong tiếng Anh, được sử dụng để đưa ra lời khuyên, gợi ý, thể hiện nghĩa vụ hoặc kỳ vọng. Nó được dùng trong các tình huống mà người nói muốn thể hiện ý kiến cá nhân hoặc hướng dẫn người khác làm gì đó. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• You should eat more vegetables to stay healthy. (Bạn nên ăn nhiều rau để giữ sức khỏe.)</p>\n<p>• He should get more sleep if he wants to concentrate better. (Cậu ấy nên ngủ nhiều hơn nếu muốn tập trung tốt hơn.)</p>\n<p>• People should respect the environment. (Mọi người nên trân trọng môi trường.)</p>\n<p><strong>2. Các công thức của “Should”</strong></p>\n<p><strong>a. Cấu trúc should + bare infinitive</strong></p>\n<p>        Cấu trúc <strong>“should + động từ nguyên mẫu không “to” (bare infinitive)</strong> là một trong những dạng cấu trúc thường gặp trong tiếng Anh. Cấu trúc này được sử dụng để đưa ra lời khuyên, đề xuất, thể hiện nghĩa vụ hoặc điều mà người nói kỳ vọng sẽ xảy ra. Nó thường xuất hiện trong các tình huống khi người nói muốn bày tỏ quan điểm cá nhân hoặc hướng dẫn người khác nên làm gì. Dưới đây là 4 dạng câu cơ bản dùng với “should”:</p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"151\">\n<p style=\"text-align:center;\"><strong>LOẠI CÂU</strong></p>\n</td>\n<td valign=\"top\" width=\"255\">\n<p style=\"text-align:center;\"><strong>CÔNG THỨC</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p style=\"text-align:center;\"><strong>VÍ DỤ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Khẳng định</strong></p>\n</td>\n<td valign=\"top\" width=\"255\">\n<p><strong>S + should + V (bare infinitive)</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>You should drink more water every day. (Bạn nên uống nhiều nước hơn mỗi ngày.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Phủ định</strong></p>\n</td>\n<td valign=\"top\" width=\"255\">\n<p><strong>S + should not (shouldn’t) + V</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>He shouldn’t skip breakfast. (Cậu ấy không nên bỏ bữa sáng.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Nghi vấn </strong></p>\n</td>\n<td valign=\"top\" width=\"255\">\n<p><strong>Should + subject + V?</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>Should we take umbrella today? (Chúng ta có nên mang ô hôm nay không?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Wh - How</strong></p>\n</td>\n<td valign=\"top\" width=\"255\">\n<p><strong>Wh-How + should + S + V?</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>What should I do if I lose my phone? (Tôi nên làm gì nếu bị mất điện thoại?)</p>\n<p>How should we prepare for the test? (Chúng ta nên chuẩn bị cho bài kiểm tra như thế nào?)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>b. Cấu trúc should + have + past participle </strong></p>\n<p>        Cấu trúc <strong>“should + have + past participle”</strong> (quá khứ phân từ) được sử dụng để diễn tả một hành động mà đáng lẽ ra nên làm trong quá khứ nhưng đã không làm, hoặc một tình huống mong đợi trong quá khứ nhưng đã không xảy ra. Nói cách khác, đây là cách thể hiện sự tiếc nuối hoặc phê phán về một sự việc đã xảy ra. </p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"151\">\n<p style=\"text-align:center;\"><strong>LOẠI CÂU</strong></p>\n</td>\n<td valign=\"top\" width=\"255\">\n<p style=\"text-align:center;\"><strong>CÔNG THỨC</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p style=\"text-align:center;\"><strong>VÍ DỤ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Khẳng định</strong></p>\n</td>\n<td valign=\"top\" width=\"255\">\n<p><strong>S + should + have + V3 (past participate)</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>You should have studied harder for the exam. (Bạn lẽ ra nên học chăm hơn cho kỳ thi.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Phủ định</strong></p>\n</td>\n<td valign=\"top\" width=\"255\">\n<p><strong>S + should not (shouldn’t) have + V3 (past participle)</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>She shouldn’t have lied to her parents. (Cô ấy lẽ ra không nên nói dối bố mẹ.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Nghi vấn </strong></p>\n</td>\n<td valign=\"top\" width=\"255\">\n<p><strong>Should + subject + have + V3?</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>Should we have left earlier? (Chúng ta có phải lẽ ra nên rời đi sớm hơn không?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Wh - How</strong></p>\n</td>\n<td valign=\"top\" width=\"255\">\n<p><strong>Wh – How + should + Subject + V3?</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>What should I have said in that situation? (Tôi lẽ ra nên nói gì trong tình huống đó?)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>c. Cấu trúc should + be + Ving </strong></p>\n<p>        Cấu trúc “<strong>should + be + Ving</strong>” được sử dụng để diễn tả những hành động mà lẽ ra đang nên xảy ra tại thời điểm hiện tại hoặc trong một khoảng thời gian cụ thể. Nó thường được sử dụng để đưa ra lời khuyên hoặc nhận xét về những việc nên làm hoặc không nên làm vào lúc này. </p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"151\">\n<p style=\"text-align:center;\"><strong>LOẠI CÂU</strong></p>\n</td>\n<td valign=\"top\" width=\"255\">\n<p style=\"text-align:center;\"><strong>CÔNG THỨC</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p style=\"text-align:center;\"><strong>VÍ DỤ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Khẳng định</strong></p>\n</td>\n<td valign=\"top\" width=\"255\">\n<p><strong>S + should + be + Ving</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>You should be doing your homework now. (Bây giờ bạn nên đang làm bài tập về nhà.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Phủ định</strong></p>\n</td>\n<td valign=\"top\" width=\"255\">\n<p><strong>S + should + not + be + Ving</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>He shouldn’t be watching TV so late at night. (Cậu ấy không nên đang xem TV khuya như vậy.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Nghi vấn </strong></p>\n</td>\n<td valign=\"top\" width=\"255\">\n<p><strong>Should + S + be + Ving?</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>Should you be eating so much junk food? (Bạn có nên đang ăn nhiều đồ ăn vặt như vậy không?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Wh - How</strong></p>\n</td>\n<td valign=\"top\" width=\"255\">\n<p><strong>Wh-How + should + subject + be + Ving?</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>What should you be doing at this moment to improve your skills? (Bạn nên đang làm gì vào lúc này để cảu thiên kỹ năng của mình?)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>II. Some / any for amount </strong></p>\n<p><strong>1. “Some” và “any” là gì?</strong></p>\n<p>        “<strong>Some</strong>” và “<strong>any</strong>” là các lượng từ trong tiếng Anh, có nghĩa là “một số, một vài”. Thông thường “some” và “any”diễn tả số lượng không xác định, nhưng không phải là số ít (như “few” và “a few”) hoặc số nhiều (như “many” hoặc “a lot of”). </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:  </strong>I have some friends in Hanoi. (Tôi có vài người bạn ở Hà Nội.)</p>\n<p>            Would you like some coffee? (Bạn có muốn một ít cà phê không?)</p>\n<p>            I don’t have any money left. (Tôi không còn chút tiền nào.)</p>\n<p>            Are there any bananas in the fridge? (Có quả chuối nào trong tủ lạnh không?)</p>\n<p><strong>2. Cách dùng “some”</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"293\">\n<p style=\"text-align:center;\"><strong>CÁCH DÙNG</strong></p>\n</td>\n<td valign=\"top\" width=\"371\">\n<p style=\"text-align:center;\"><strong>VÍ DỤ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"293\">\n<p>Sử dụng “some” trong câu khẳng định, diễn tả một số lượng không xác định, nhưng không phải là số ít hay số nhiều.</p>\n</td>\n<td valign=\"top\" width=\"371\">\n<p>She bought some oranges from the supermarket. (Cô ấy đã mua vài quả cam ở siêu thị.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"293\">\n<p>Sử dụng “some” trong câu hỏi mang tính lời mời, đề nghị</p>\n</td>\n<td valign=\"top\" width=\"371\">\n<p>Would you like some tea? (Bạn có muốn uống chút trà không?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"293\">\n<p>Một số câu hỏi nghi vấn dùng “some” trong trường hợp mong câu trả lời “Yes”</p>\n</td>\n<td valign=\"top\" width=\"371\">\n<p>Did you buy some flowers for the party? (Bạn đã mua ít hoa cho bữa tiệc chứ?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"293\">\n<p>“Some” đứng ở đầu câu thể hiện trạng thái tức giận, nhấn mạnh vào câu nói</p>\n</td>\n<td valign=\"top\" width=\"371\">\n<p>Some people just don’t know how to behave! (Một số người đúng là không biết cư xử gì cả!)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"293\">\n<p>Các cụm từ đi với some: some time, something, somewhere, someone</p>\n</td>\n<td valign=\"top\" width=\"371\">\n<p>I need some time to think. (Tôi cần chút thời gian để suy nghĩ.)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>3. Cách dùng “any”</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"293\">\n<p style=\"text-align:center;\"><strong>CÁCH DÙNG</strong></p>\n</td>\n<td valign=\"top\" width=\"371\">\n<p style=\"text-align:center;\"><strong>VÍ DỤ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"293\">\n<p>Sử dụng “any” trong câu phủ định để diễn tả không có một số lượng cụ thể. </p>\n</td>\n<td valign=\"top\" width=\"371\">\n<p>She doesn’t eat any meat. (Cô ấy không ăn chút thịt nào cả.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"293\">\n<p>Sử dụng “any” trong câu nghi vấn.</p>\n</td>\n<td valign=\"top\" width=\"371\">\n<p>Is there any milk in the fridge? (Trong tủ lạnh còn sữa không?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"293\">\n<p>“Any” dùng trong câu khẳng định mang nghĩa phủ định hoặc dùng trong câu “If”</p>\n</td>\n<td valign=\"top\" width=\"371\">\n<p>You can choose any seat you like. (Bạn có thể chọn bất kỳ chỗ ngồi nào bạn thích.)</p>\n<p>If you need any help, let me know. (Nếu bạn cần giúp đỡ gì, hãy cho tôi biết.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"293\">\n<p>Ban / Avoid / Forbid / Prevent + Any = Không làm gì đó</p>\n</td>\n<td valign=\"top\" width=\"371\">\n<p>The rule forbids any smoking inside the building. (Nội quy cấm hoàn toàn việc hút thuốc trong tòa nhà.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"293\">\n<p>Các cụm từ đi với “any”: anytime, anything, anyone, anywhere</p>\n</td>\n<td valign=\"top\" width=\"371\">\n<p>Call me anytime you need. (Gọi cho tôi bất cứ khi nào bạn cần.)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>4. Điểm giống và khác nhau trong cách dùng “some” và “any”</strong></p>\n<p><strong>a. Giống nhau</strong></p>\n<p>        “<strong>Some</strong>” và “<strong>Any</strong>” mang nghĩa một vài, một ít và được dùng cho số lượng không xác dịnh hoặc không cần biết số lượng. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:  </strong>We need some paper for the printer. (Chúng ta cần một ít giấy cho máy in.)</p>\n<p>            I didn’t see any books on the shelf. (Tôi không thấy quyển sách nào trên kệ cả.)</p>\n<p><strong>b. Khác nhau</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"332\">\n<p style=\"text-align:center;\"><strong>Some</strong></p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p style=\"text-align:center;\"><strong>Any</strong></p>\n</td>\n</tr>\n<tr>\n<td rowspan=\"4\" valign=\"top\" width=\"332\">\n<p><strong>Dùng trong câu khẳng định</strong></p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p><strong>Dùng trong câu phủ định</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> I don’t have any money left. (Tôi không còn chút tiền nào cả.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p><strong>Dùng trong câu khẳng định mang nghĩa “bất kì, bất cứ”</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> Any student can join the club. (Bất kỳ học sinh nào cũng có thể tham gia câu lạc bộ.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p><strong>Dùng trong câu hỏi nghi vấn </strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> Have you seen any good movies lately? (Bạn đã xem bất kỳ bộ phim hay nào gần đây chưa?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p><strong>Dùng trong câu khẳng định mang tính phủ định. </strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> They finished the race without making any mistaks. (Họ hoàn thành cuộc đua mà không mắc bất kỳ sai lầm nào.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p><strong>Dùng trong câu hỏi (lời mời, yêu cầu, đề nghị)</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> Would you like some orange juice? (Bạn có muốn uống một chút nước cam không?)</p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p><strong>Dùng trong câu hỏi nghi vấn (mang nghĩa còn bao nhiêu)</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> Are there any cookies left on the plate? (Có còn cái bánh quy nào trên đĩa không?)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong style=\"color: #c00000;\">Lưu ý: </strong><em>Nếu trong câu trước đã có danh từ xác định thì ở câu sau, ta có thể dùng some và any mà không cần danh từ phía sau.</em> </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• I made cookies. Would you like some? (Tôi mới làm bánh quy. Bạn có muốn ăn vài cái không?)</p>\n<p>• I asked her if she had books about art. She said she didn’t have any. (Cô ấy nói là cô ấy không có quyển nào cả.)</p>",
                "readingPassage": "Tet is the most important festival in Vietnam. Before Tet, people clean and decorate their houses. During Tet, family members gather together. Children usually receive lucky money in red envelopes. We should make good wishes to everyone.",
                "readingPassageTitle": "Tet in Vietnam",
                "videos": [
                    {
                        "id": "QU-QxAbI8BI",
                        "title": "Tiếng Anh 6 Unit 6: Từ vựng trang 71 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "x2t1gcHeer8",
                        "title": "Tiếng Anh 6 Unit 6: Getting started trang 58, 59 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "Msqhuz1pEl0",
                        "title": "Tiếng Anh 6 Unit 6: A closer look 1 trang 60 Global success - Cô Thanh Hoa (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "yaJkVt4GzTU",
                        "title": "Tiếng Anh 6 Unit 6: A closer look 2 trang 61, 62 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "rGqXepgf_xg",
                        "title": "Tiếng Anh 6 Unit 6: Communication trang 63 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "9zy2ZgYRqhM",
                        "title": "Tiếng Anh 6 Unit 6: Skills 1 trang 64, 65 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "bR_xjNVvdvg",
                        "title": "Tiếng Anh 6 Unit 6: Skills 2 trang 65 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "xmlxTq86Q5g",
                        "title": "Tiếng Anh 6 Unit 6: Looking back trang 66 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "TBW_4UlQ84o",
                        "title": "Tiếng Anh 6 Unit 6: Project trang 67 Global Success (DỄ HIỂU NHẤT)"
                    }
                ],
                "questions": {
                    "reading": [
                        {
                            "question": "What is the main topic of the passage?",
                            "options": [
                                "Unit 6: Our Tet Holiday",
                                "Playing sports",
                                "Travelling around the world"
                            ],
                            "answer": "Unit 6: Our Tet Holiday"
                        },
                        {
                            "question": "Which word is mentioned in the reading passage?",
                            "options": [
                                "behave",
                                "helicopter",
                                "spaceship"
                            ],
                            "answer": "behave"
                        },
                        {
                            "question": "How does the writer feel about the topic?",
                            "options": [
                                "Excited and happy",
                                "Bored and tired",
                                "Sad"
                            ],
                            "answer": "Excited and happy"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t7",
                "title": "Unit 7: Television",
                "subtitle": "Các chương trình truyền hình và từ để hỏi",
                "vocab": [
                    {
                        "word": "animated (film)",
                        "translation": "hoạt hình",
                        "phonetics": "/ˈæn.ɪ.meɪ.tɪd/",
                        "type": "adjective",
                        "sentence": "We want to animated (film) together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau hoạt hình vào cuối tuần này."
                    },
                    {
                        "word": "cartoon",
                        "translation": "phim hoạt hình",
                        "phonetics": "/kɑːˈtuːn/",
                        "type": "noun",
                        "sentence": "I watch cartoons on Disney channel on Sundays.",
                        "sentenceTranslation": "Tớ hay xem phim hoạt hình trên kênh Disney vào các ngày Chủ Nhật."
                    },
                    {
                        "word": "channel",
                        "translation": "kênh (truyền hình)",
                        "phonetics": "/ˈtʃæn.əl/",
                        "type": "noun",
                        "sentence": "I can see a beautiful channel in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người kênh (truyền hình) tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "character",
                        "translation": "nhân vật",
                        "phonetics": "/ˈkær.ək.tər/",
                        "type": "noun",
                        "sentence": "I can see a beautiful character in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người nhân vật tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "clever",
                        "translation": "không ngoan, thông minh",
                        "phonetics": "/ˈklev.ər/",
                        "type": "adjective",
                        "sentence": "We want to clever together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau không ngoan, thông minh vào cuối tuần này."
                    },
                    {
                        "word": "clip",
                        "translation": "đoạn phim ngắn",
                        "phonetics": "/klɪp/",
                        "type": "noun",
                        "sentence": "I can see a beautiful clip in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người đoạn phim ngắn tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "comedy",
                        "translation": "phim hài",
                        "phonetics": "/ˈkɒm.ə.di/",
                        "type": "noun",
                        "sentence": "I can see a beautiful comedy in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người phim hài tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "compete",
                        "translation": "thi đấu",
                        "phonetics": "/kəmˈpiːt/",
                        "type": "verb",
                        "sentence": "We want to compete together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau thi đấu vào cuối tuần này."
                    },
                    {
                        "word": "cute",
                        "translation": "xinh xắn",
                        "phonetics": "/kjuːt/",
                        "type": "adjective",
                        "sentence": "We want to cute together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau xinh xắn vào cuối tuần này."
                    },
                    {
                        "word": "dolphin",
                        "translation": "cá heo",
                        "phonetics": "/ˈdɒl.fɪn/",
                        "type": "noun",
                        "sentence": "I can see a beautiful dolphin in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người cá heo tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "educate",
                        "translation": "giáo dục",
                        "phonetics": "/ˈedʒ.u.keɪt/",
                        "type": "verb",
                        "sentence": "We want to educate together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau giáo dục vào cuối tuần này."
                    },
                    {
                        "word": "educational",
                        "translation": "mang tính giáo dục",
                        "phonetics": "/ˌedʒ.ʊˈkeɪ.ʃən.əl/",
                        "type": "adjective",
                        "sentence": "This television programme is highly educational for kids.",
                        "sentenceTranslation": "Chương trình truyền hình này mang tính giáo dục rất cao cho trẻ nhỏ."
                    },
                    {
                        "word": "funny",
                        "translation": "buồn cười, ngộ nghĩnh",
                        "phonetics": "/ˈfʌn.i/",
                        "type": "adjective",
                        "sentence": "We want to funny together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau buồn cười, ngộ nghĩnh vào cuối tuần này."
                    },
                    {
                        "word": "(TV) guide",
                        "translation": "chương trình TV",
                        "phonetics": "/ɡaɪd/",
                        "type": "noun",
                        "sentence": "I can see a beautiful (tv) guide in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người chương trình TV tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "live",
                        "translation": "(truyền) trực tiếp",
                        "phonetics": "/laɪv/",
                        "type": "adjective",
                        "sentence": "We want to live together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau (truyền) trực tiếp vào cuối tuần này."
                    },
                    {
                        "word": "programme",
                        "translation": "chương trình (truyền hình)",
                        "phonetics": "/ˈprəʊ.ɡræm/",
                        "type": "noun",
                        "sentence": "I can see a beautiful programme in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người chương trình (truyền hình) tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "talent show",
                        "translation": "cuộc thi tài năng trên truyền hình",
                        "phonetics": "/ˈtæl.ənt ˌʃəʊ/",
                        "type": "noun",
                        "sentence": "I can see a beautiful talent show in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người cuộc thi tài năng trên truyền hình tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "viewer",
                        "translation": "người xem (TV)",
                        "phonetics": "/ˈvjuː.ər/",
                        "type": "noun",
                        "sentence": "I can see a beautiful viewer in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người người xem (TV) tuyệt đẹp trong bức tranh này."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What is your favorite TV programme? - I like science programmes.",
                        "vietnamese": "Chương trình truyền hình yêu thích của cậu là gì? - Tớ thích chương trình khoa học."
                    },
                    {
                        "english": "Why do you like this channel? - Because it is educational.",
                        "vietnamese": "Tại sao cậu thích kênh này? - Bởi vì nó mang tính giáo dục."
                    }
                ],
                "grammar": "<p><strong>A. GRAMMAR</strong></p>\n<p><strong>I. H/Wh-questions (Câu hỏi với từ để hỏi)</strong></p>\n<p>        Trong tiếng Anh, khi chúng ta cần câu hỏi rõ rang và cần có câu trả lời cụ thể, ta dùng câu hỏi với các từ để hỏi. Loại câu này còn được gọi là câu hỏi trực tiếp (direct questions). </p>\n<p><strong>1. Các từ để hỏi trong tiếng Anh</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"141\">\n<p style=\"text-align:center;\"><strong>Từ để hỏi</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p style=\"text-align:center;\"><strong>Cách dùng</strong></p>\n</td>\n<td valign=\"top\" width=\"257\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p><strong>Who (Ai – Chức năng chủ ngữ)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Sử dụng để hỏi về danh tính hoặc người thực hiện một hành động. </p>\n</td>\n<td valign=\"top\" width=\"257\">\n<p>Who is calling you? (Ai đang gọi bạn vậy?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p><strong>Whom (Ai – Chức năng tân ngữ)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Sử dụng trong câu hỏi khi đối tượng của câu là người.</p>\n</td>\n<td valign=\"top\" width=\"257\">\n<p>Whom did you invite to the party? (Bạn đã mời ai đến bữa tiệc?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p><strong>What (Cái gì)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Sử dụng để hỏi về thông tin hoặc mô tả về một vật thể hoặc sự việc. </p>\n</td>\n<td valign=\"top\" width=\"257\">\n<p>What is your favorite color? (Màu sắc yêu thích của bạn là gì?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p><strong>Whose (Của ai)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Sử dụng để hỏi về sở hữu hoặc quyền sở hữu của một vật thể hoặc người. </p>\n</td>\n<td valign=\"top\" width=\"257\">\n<p>Whose book is this? (Đây là sách của ai vậy?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p><strong>Where (Ở đâu)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Sử dụng để hỏi về vị trí hoặc nơi chốn một sự việc diễn ra.</p>\n</td>\n<td valign=\"top\" width=\"257\">\n<p>Where do you live? (Bạn sống ở đâu vậy.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p><strong>Which (Cái nào – Hỏi về sự lựa chọn)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Sử dụng để hỏi về lựa chọn hoặc sự so sánh giữa nhiều tùy chọn. </p>\n</td>\n<td valign=\"top\" width=\"257\">\n<p>Which dress do you prefer, the red one or the blue one? (Bạn thích chiếc váy nào hơn, cái màu đỏ hay cái màu xanh?</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p><strong>When (Khi nào)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Sử dụng để hỏi về thời gian hoặc khoảng thời gian diễn ra một sự kiện. </p>\n</td>\n<td valign=\"top\" width=\"257\">\n<p>When is your birthday? (Sinh nhật của bạn là khi nào?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p><strong>Why (Tại sao)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Sử dụng để hỏi về lý do hoặc nguyên nhân của một hành động, sự việc. </p>\n</td>\n<td valign=\"top\" width=\"257\">\n<p>Why are are you late? (Tại sao lại đến muộn.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p><strong>How (Thế nào)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Sử dụng để hỏi về cách thức, tình trạng, hoặc mức độ của hành động. sự vật. </p>\n</td>\n<td valign=\"top\" width=\"257\">\n<p>How do you go to school? (Bạn đến trường bằng cách nào?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p><strong>How much (Bao nhiêu, giá tiền, số lượng)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Sử dụng để hỏi về giá tiền hoặc số lượng không đếm được. </p>\n</td>\n<td valign=\"top\" width=\"257\">\n<p>How much does it cost? (Cái này giá bao nhiêu?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p><strong>How many (Bao nhiêu, số lượng)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Sử dụng để hỏi về số lượng đếm được. </p>\n</td>\n<td valign=\"top\" width=\"257\">\n<p>How many brothers do you have? (Bạn có mấy anh em trai?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p><strong>How long (Bao lâu)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Sử dụng để hỏi về độ dài thời gian. </p>\n</td>\n<td valign=\"top\" width=\"257\">\n<p>How long does it take to get there? (Mất bao lâu để đến đó?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p><strong>How far (Bao xa)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Sử dụng để hỏi về khoảng cách.</p>\n</td>\n<td valign=\"top\" width=\"257\">\n<p>How far is your school from your house? (Trường bạn cách nhà bao xa?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p><strong>How old (Bao nhiêu tuổi)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Sử dụng để hỏi về tuổi tác. </p>\n</td>\n<td valign=\"top\" width=\"257\">\n<p>How old is she? (Cô ấy bao nhiêu tuổi rồi?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p><strong>How often (Thường xuyên thế nào)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Sử dụng để hỏi về tần xuất của một hành động. </p>\n</td>\n<td valign=\"top\" width=\"257\">\n<p>How often do you exercise? (Bạn có thường xuyên tập thể dục không?</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p><strong>What time (Mấy giờ)</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>Sử dụng để hỏi về thời gian cụ thể trong ngày. </p>\n</td>\n<td valign=\"top\" width=\"257\">\n<p>What time does the movie start? Phim bắt đầu lúc mấy giờ. </p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>2. Các cấu trúc câu hỏi WH thường gặp</strong></p>\n<p><strong>a. Nguyên tắc đặt câu hỏi</strong></p>\n<p>• Nếu chưa có trợ động từ thì phải mượn trợ động từ: <strong>do / does/ did</strong></p>\n<p>• Nếu trợ động từ sẵn có (<strong>am/ is/ are/ can, will, shall, could/ would</strong>) thì đảo chúng ra trước  chủ ngữ, không mượn <strong>do/ does/ did</strong> nữa. </p>\n<p><strong>b. Cấu trúc thông thường của loai câu hỏi Wh – questions</strong></p>\n<p>Thông thường, việc đặt câu với <strong>Wh</strong> được chia thành 2 loại:</p>\n<p>• <strong>Loại 1:</strong> Có trợ động từ / động từ khuyết thiếu</p>\n<p>• <strong>Loại 2:</strong> Không có trợ động từ/ động từ khuyết thiếu</p>\n<p><strong>* Cấu trúc câu hỏi Wh dùng trợ động từ và động từ khuyết thiếu</strong></p>\n<p style=\"text-align:center;\"><strong style=\"background: yellow;\">Từ để hỏi (Wh) + trợ động từ/động từ khuyết thiếu (not) + chủ ngữ + vị ngữ …?</strong></p>\n<p>Với cách đặt câu hỏi này, ta sẽ dùng <strong>trợ động từ</strong> – <em>be, do, have,</em><strong>… </strong>hoặc <strong>động từ khuyết thiếu</strong> (modal verb) – <em>can, should, must…</em> và động từ ở dạng tương ứng. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:  What do you usually do on weekends? (Bạn thường làm gì vào cuối tuần?)</strong></p>\n<p><strong>            How can we improve our English speaking skills? (Làm thế nào chúng ta có thể cái thiện kỹ năng nói tiếng Anh?)</strong></p>\n<p><strong>            Why did she cancel the meeting? (Tại sao cô ấy hủy cuộc họp?)</strong></p>\n<p><strong>* Cấu trúc câu hỏi Wh không dùng trợ động từ và động từ khuyết thiếu</strong></p>\n<p style=\"text-align:center;\"><strong style=\"background: yellow;\">Chủ ngữ + Động từ?</strong></p>\n<p>Khi các từ để hỏi như “<strong>What, which, whose, who</strong>” đóng vai trò chủ ngữ hoặc là một phần của chủ ngữ thì không cần thêm trợ động từ cho câu.</p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong>  Who broke the window? (Ai đã làm vỡ của sổ vậy?)</p>\n<p>            What caused the delay? (Cái gì đã gây ra sự chậm trễ?)</p>\n<p>            Which student won the first prize? (Học sinh nào đã giành giải nhất?)</p>\n<p><strong>II. Conjunctions (Liên từ)</strong></p>\n<p><strong>1. Liên từ là gì?</strong></p>\n<p><strong>        Liên từ (Conjunction)</strong> là các từ được dùng để nối 2 từ, cụm từ hoặc mệnh đề lại với nhau, từ đó tạo nên sự mạch lạc và logic cho toàn bộ câu văn. Ngoài ra, người viết có thể áp dụng liên từ để nhấn mạnh các mối quan hệ tương phản, so sánh hoặc nhân quả để giúp phần bài viết của mình trở nên thu hút hơn. </p>\n<p><strong>2. Phân loại</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"132\">\n<p style=\"text-align:center;\"> </p>\n</td>\n<td valign=\"top\" width=\"283\">\n<p style=\"text-align:center;\"><strong>Liên từ đẳng lập</strong></p>\n</td>\n<td valign=\"top\" width=\"249\">\n<p style=\"text-align:center;\"><strong>Liên từ phụ thuộc</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"132\">\n<p><strong>Chức năng</strong></p>\n</td>\n<td valign=\"top\" width=\"283\">\n<p>Dùng để nối các từ, cụm từ cùng một loại, hoặc các mệnh đề ngang hàng nhau (tính từ với tính từ, danh từ với danh từ…)</p>\n</td>\n<td valign=\"top\" width=\"249\">\n<p>Dùng để nối cụm từ, nhóm từ hoặc mệnh đề có chức năng khác nhau – mệnh đề phụ với mệnh đề chính trong câu.</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"132\">\n<p><strong>Vị trí</strong></p>\n</td>\n<td valign=\"top\" width=\"283\">\n<p>- Luôn luôn đứng giữa 2 từ hoặc 2 mệnh đề mà nó liên kết.</p>\n<p>- Nếu nối các mệnh đề độc lập thì luôn có dấu phẩy đứng trước liên từ. </p>\n\n</td>\n<td valign=\"top\" width=\"249\">\n<p>- Thường đứng đầu mệnh đề phụ,</p>\n<p>- Mệnh đề phụ thuộc có thể đứng trước hoặc sau mệnh đề chính nhưng phải luôn được bắt đầu bằng một liên từ. </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"132\">\n<p><strong>Các liên từ</strong></p>\n</td>\n<td valign=\"top\" width=\"283\">\n<p>- Chỉ sự thêm vào: and (và)</p>\n<p>- Chỉ sự tương phản đối lập: but (nhưng)</p>\n<p>- Chỉ kết quả: so (vì vậy, cho nên)</p>\n<p>- Chỉ sự lựa chọn: or (hoặc)</p>\n</td>\n<td valign=\"top\" width=\"249\">\n<p>- Chỉ nguyên nhân, lý do; because (Bởi vì)</p>\n<p>- Chỉ hai hành động trái ngược nhau về mặt logic: although (mặc dù)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"132\">\n<p><strong>Ví dụ</strong></p>\n</td>\n<td valign=\"top\" width=\"283\">\n<p>- I’ll come and see you soon.</p>\n<p>- His mother won’t be there, but his father might. </p>\n</td>\n<td valign=\"top\" width=\"249\">\n<p>- Last night we came late because it rained heavily.</p>\n<p>- Although the car is old, it is still. </p>\n</td>\n</tr>\n</tbody>\n</table>",
                "readingPassage": "Television plays an important part in our daily lives. There are many channels for children, like Disney Channel and VTV7. VTV7 has many educational programmes. I watch it every evening because it helps me learn new things.",
                "readingPassageTitle": "Television and Learning",
                "videos": [
                    {
                        "id": "_ASFHATp_y4",
                        "title": "Tiếng Anh 6 Unit 7: Từ vựng trang 70 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "hvd0GbwilWA",
                        "title": "Tiếng Anh lớp 6 Unit 7: Getting started - trang 6, 7 | Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "YBdhCbs8NN4",
                        "title": "Tiếng Anh 6 Unit 7: A closer look 1 trang 8 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "uWCIMN5JRHo",
                        "title": "Tiếng Anh 6 Unit 7: A closer look 2 trang 9, 10 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "VAIAmPjrokw",
                        "title": "Tiếng Anh 6 Unit 7: Communication trang 11 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "GKUp3vM3dvc",
                        "title": "Tiếng Anh 6 Unit 7: Skills 1 trang 12, 13 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "OZrI-tz4xsI",
                        "title": "Tiếng Anh 6 Unit 7: Skills 2 trang 13 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "t7u_nD7mCvY",
                        "title": "Tiếng Anh 6 Unit 7: Looking back trang 14 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "6FHHAWNt-SM",
                        "title": "Tiếng Anh 6 Unit 7: Project trang 15 Global Success (HAY NHẤT)"
                    }
                ],
                "questions": {
                    "reading": [
                        {
                            "question": "What is the main topic of the passage?",
                            "options": [
                                "Unit 7: Television",
                                "Playing sports",
                                "Travelling around the world"
                            ],
                            "answer": "Unit 7: Television"
                        },
                        {
                            "question": "Which word is mentioned in the reading passage?",
                            "options": [
                                "animated (film)",
                                "helicopter",
                                "spaceship"
                            ],
                            "answer": "animated (film)"
                        },
                        {
                            "question": "How does the writer feel about the topic?",
                            "options": [
                                "Excited and happy",
                                "Bored and tired",
                                "Sad"
                            ],
                            "answer": "Excited and happy"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t8",
                "title": "Unit 8: Sports and Games",
                "subtitle": "Thể dục thể thao và thì quá khứ đơn",
                "vocab": [
                    {
                        "word": "aerobics",
                        "translation": "thể dục nhịp điệu",
                        "phonetics": "/eəˈrəʊ.bɪks/",
                        "type": "noun",
                        "sentence": "I can see a beautiful aerobics in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người thể dục nhịp điệu tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "career",
                        "translation": "nghề nghiệp, sự nghiệp",
                        "phonetics": "/kəˈrɪər/",
                        "type": "noun",
                        "sentence": "I can see a beautiful career in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người nghề nghiệp, sự nghiệp tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "competition",
                        "translation": "cuộc đua",
                        "phonetics": "/ˌkɒm.pəˈtɪʃ.ən/",
                        "type": "noun",
                        "sentence": "I can see a beautiful competition in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người cuộc đua tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "congratulation",
                        "translation": "lời chúc mừng",
                        "phonetics": "/kənˌɡrætʃ.əˈleɪ.ʃən/",
                        "type": "noun",
                        "sentence": "I can see a beautiful congratulation in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người lời chúc mừng tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "equipment",
                        "translation": "thiết bị, dụng cụ",
                        "phonetics": "/ɪˈkwɪp.mənt/",
                        "type": "noun",
                        "sentence": "I can see a beautiful equipment in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người thiết bị, dụng cụ tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "fantastic",
                        "translation": "tuyệt",
                        "phonetics": "/fænˈtæs.tɪk/",
                        "type": "adjective",
                        "sentence": "We want to fantastic together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau tuyệt vào cuối tuần này."
                    },
                    {
                        "word": "fit",
                        "translation": "mạnh khoẻ",
                        "phonetics": "/fɪt/",
                        "type": "adjective",
                        "sentence": "We want to fit together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau mạnh khoẻ vào cuối tuần này."
                    },
                    {
                        "word": "goggles",
                        "translation": "kính bơi",
                        "phonetics": "/ˈɡɒɡ.əlz/",
                        "type": "noun",
                        "sentence": "I can see a beautiful goggles in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người kính bơi tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "gym",
                        "translation": "trung tâm thể dục thể thao",
                        "phonetics": "/dʒɪm/",
                        "type": "noun",
                        "sentence": "I can see a beautiful gym in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người trung tâm thể dục thể thao tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "karate",
                        "translation": "môn võ ka-ra-te",
                        "phonetics": "/kəˈrɑː.ti/",
                        "type": "noun",
                        "sentence": "I can see a beautiful karate in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người môn võ ka-ra-te tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "last",
                        "translation": "kéo dài",
                        "phonetics": "/lɑːst/",
                        "type": "verb",
                        "sentence": "We want to last together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau kéo dài vào cuối tuần này."
                    },
                    {
                        "word": "marathon",
                        "translation": "cuộc đua ma-ra-tông",
                        "phonetics": "/ˈmær.ə.θən/",
                        "type": "noun",
                        "sentence": "My uncle ran a full marathon last year.",
                        "sentenceTranslation": "Chú của tớ đã chạy hết một cuộc đua marathon đầy đủ vào năm ngoái."
                    },
                    {
                        "word": "racket",
                        "translation": "cái vợt (cầu lông ...)",
                        "phonetics": "/ˈræk.ɪt/",
                        "type": "noun",
                        "sentence": "I can see a beautiful racket in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người cái vợt (cầu lông ...) tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "score",
                        "translation": "ghi bàn, ghi điểm",
                        "phonetics": "/skɔːr/",
                        "type": "verb",
                        "sentence": "We want to score together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau ghi bàn, ghi điểm vào cuối tuần này."
                    },
                    {
                        "word": "shoot",
                        "translation": "bắn, bắn súng",
                        "phonetics": "/ʃuːt/",
                        "type": "verb",
                        "sentence": "We want to shoot together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau bắn, bắn súng vào cuối tuần này."
                    },
                    {
                        "word": "sporty",
                        "translation": "khỏe mạnh, dáng thể thao",
                        "phonetics": "/ˈspɔː.ti/",
                        "type": "adjective",
                        "sentence": "We want to sporty together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau khỏe mạnh, dáng thể thao vào cuối tuần này."
                    },
                    {
                        "word": "take place",
                        "translation": "xảy ra, được tổ chức",
                        "phonetics": "/teɪk pleɪs/",
                        "type": "verb",
                        "sentence": "We want to take place together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau xảy ra, được tổ chức vào cuối tuần này."
                    },
                    {
                        "word": "tournament",
                        "translation": "giải đấu",
                        "phonetics": "/ˈtʊə.nə.mənt/",
                        "type": "noun",
                        "sentence": "I can see a beautiful tournament in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người giải đấu tuyệt đẹp trong bức tranh này."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Did you win the match yesterday? - Yes, we did.",
                        "vietnamese": "Hôm qua các cậu có thắng trận đấu không? - Có, chúng tớ thắng."
                    },
                    {
                        "english": "Keep fit by playing sports every day.",
                        "vietnamese": "Hãy giữ dáng khỏe mạnh bằng cách chơi thể thao mỗi ngày."
                    }
                ],
                "grammar": "<p><strong>A. GRAMMAR</strong></p>\n<p><strong>I. Past simple (Quá khứ đơn)</strong></p>\n<p><strong>1. Thì quá khứ đơn là gì?</strong></p>\n<p>        Thì <strong>quá khứ đơn</strong> (còn gọi là <strong>Past simple</strong> hay <strong>Simple past tense</strong>) là thì mô tả hành động, sự việc hoặc một sự kiện đã diễn ra và kết thúc tại một thời điểm xác định trong quá khứ. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong>  She visited her grandmother last weekend. (Cô ấy đã đến thăm bà của mình cuối tuần trước.)</p>\n<p><strong>            </strong>They watched a movie yesterday evening. (Họ đã xem một phim vào tối hôm qua.)</p>\n<p><strong>2. Công thức thì quá khứ đơn</strong></p>\n<p>        Công thức thì quá khứ đơn được chia thành 2 dạng: <strong>động từ tobe</strong> và <strong>động từ thường. </strong>Mỗi trường hợp đều có công thức riêng. </p>\n<p><strong>a. Công thức thì quá khứ đơn với động từ tobe</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"151\">\n<p style=\"text-align:center;\"><strong>Loại câu</strong></p>\n</td>\n<td valign=\"top\" width=\"302\">\n<p style=\"text-align:center;\"><strong>Công thức với động từ To-be</strong></p>\n</td>\n<td valign=\"top\" width=\"211\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Thể khẳng định</strong></p>\n</td>\n<td valign=\"top\" width=\"302\">\n<p><strong>I/He/She/It + Was + …</strong></p>\n<p><strong>We/You/They + Were + …</strong></p>\n</td>\n<td valign=\"top\" width=\"211\">\n<p>I was at home last night. (Tôi đã ở nhà vào tối qua.)</p>\n<p>They were happy with the results. (Họ đã hài long với kết quả.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Thể phủ định</strong></p>\n</td>\n<td valign=\"top\" width=\"302\">\n<p><strong>I/ He/ She/ It + was not (wasn’t) + …</strong></p>\n<p><strong>We/ You/ They + were not (weren’t) + …</strong></p>\n</td>\n<td valign=\"top\" width=\"211\">\n<p>She wasn’t at school yesterday. (Cô ấy đã không ở trường ngày hôm qua.)</p>\n<p>We weren’t ready for the test. (Chúng tôi đã không sẵn sàng cho bài kiểm tra.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Câu nghi vấn (Yes/No Question)</strong></p>\n</td>\n<td valign=\"top\" width=\"302\">\n<p><strong>Was (wasn’t) + I/He/She/It + …?</strong></p>\n<p><strong>Were (weren’t) +We/You/They +…?</strong></p>\n<p><strong>Câu trả lời:</strong></p>\n<p><strong>Yes, S + was/were </strong></p>\n<p><strong>No, S + wasn’t/weren’t</strong></p>\n</td>\n<td valign=\"top\" width=\"211\">\n<p>Was he tired after work?<br />- Yes, he was. / No, he wasn’t.</p>\n<p>Were you at the meeting?<br />- Yes, I was. / No, I wasn’t.</p>\n\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Câu nghi vấn (WH – question)</strong></p>\n</td>\n<td valign=\"top\" width=\"302\">\n<p><strong>When/Where/Why/What/How + was/ were + S (+ not) +…?</strong></p>\n</td>\n<td valign=\"top\" width=\"211\">\n<p>Where were you last weekend?</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>b. Công thức thì quá khứ đơn với động từ thường</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"151\">\n<p style=\"text-align:center;\"><strong>Loại câu</strong></p>\n</td>\n<td valign=\"top\" width=\"302\">\n<p style=\"text-align:center;\"><strong>Công thức với động từ thường</strong></p>\n</td>\n<td valign=\"top\" width=\"211\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Thể khẳng định</strong></p>\n</td>\n<td valign=\"top\" width=\"302\">\n<p><strong>S + V-ed/ V2 (+O)</strong></p>\n</td>\n<td valign=\"top\" width=\"211\">\n<p>I finished my homework before dinner. (Tôi đã hoàn thành bài tập về nhà trước bữa tối.)</p>\n<p>They built a new house last year. (Họ đã xây một ngôi nhà mới vào năm ngoái.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Thể phủ định</strong></p>\n</td>\n<td valign=\"top\" width=\"302\">\n<p><strong>S + did not + V-inf (+O)</strong></p>\n</td>\n<td valign=\"top\" width=\"211\">\n<p>He didn’t go to school yesterday. (Anh ấy đã không đi học hôm qua.)</p>\n<p>We didn’t eat breakfast this morning. (Chúng tôi đã không ăn sáng nay.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Câu nghi vấn (Yes/No question)</strong></p>\n</td>\n<td valign=\"top\" width=\"302\">\n<p><strong>Did + S + V-inf</strong></p>\n<p><strong>Was/Were + S + …?</strong></p>\n<p><strong>Câu trả lời:</strong></p>\n<p><strong>Yes, S + did/was/were.</strong></p>\n<p><strong>No, S + didn’t/wasn’t/weren’t.</strong></p>\n</td>\n<td valign=\"top\" width=\"211\">\n<p><strong>Did you call your friend yesterday?</strong><br />- Yes, I did. / No, I didn’t.</p>\n<p><strong>Did they enjoy the concert?</strong><br />- Yes, they did. / No, they didn’t.</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Câu nghi vấn (WH-question)</strong></p>\n</td>\n<td valign=\"top\" width=\"302\">\n<p><strong>When/Where/Why/What/How + did + S + (not) + V-inf + (O)?</strong></p>\n</td>\n<td valign=\"top\" width=\"211\">\n<p>When did she arrive at the airport? (Cô ấy đã đến sân bay vào khi nào?)</p>\n<p>What did you see at the museum? (Bạn đã thấy gì ở bảo tàng?)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>3. Dấu hiệu nhận biết thì quá khứ đơn</strong></p>\n<p>• Các từ <strong>yesterday, ago, last (week, year, month), in the past, the day befor</strong>e.</p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong>  She graduated two years ago. (Cô ấy đã tốt nghiệp hai năm trước.)</p>\n<p>           We traveled to Da Lat last summer. (Chúng tôi đi du lịch Đà Lạt vào hè năm ngoái.)</p>\n<p>• Những khoảng thời gian đã qua trong ngày (<strong>today, this morning, this afternoon</strong>).</p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong>  I met her at the bus stop this morning. (Tôi đã gặp cô ấy ở trạm xe buýt vào sáng nay.)</p>\n<p>• Khi trong câu có “<strong>for + khoảng thời gian trong quá khứ</strong>”</p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong> I worked there for two months before quitting. (Tôi đã làm việc ở đây hai tháng trước khi nghỉ việc.)</p>\n<p>• Câu mang hàm ý các thói quen ở quá khứ và không còn ở hiện tại: <strong>used to</strong> </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong>  I used to play badminton every weekend. (Tôi đã từng chơi cầu lông  mỗi cuối tuần.)</p>\n<p>• Sau các cấu trúc như:<strong> as if, as though</strong> (như thể là), <strong>it’s time</strong> (đã đến lúc), <strong>if only</strong>, <strong>wish</strong> (ước gì), <strong>would sooner/ rather</strong> (thích hơn).</p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong>  She looks as if she knew everything. (Cô ấy trông như thể cô ấy đã biết hết về mọi thứ rồi vậy. </p>\n<p><strong>4. Cách dùng thì quá khứ đơn trong tiếng Anh</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"50%\">\n<p style=\"text-align:center;\"><strong>Cách dùng</strong></p>\n</td>\n<td valign=\"top\" width=\"50%\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"50%\">\n<p><strong>Diễn tả những hành động xảy ra và kết thúc hoàn toàn trong quá khứ. </strong></p>\n</td>\n<td valign=\"top\" width=\"50%\">\n<p>She visited Paris in 2018. (Cô ấy đã thăm Paris vào năm 2018.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"50%\">\n<p><strong>Diễn tả một hành động (thói quen) lặp đi lặp lại trong quá khứ.</strong></p>\n</td>\n<td valign=\"top\" width=\"50%\">\n<p>He always got up at 5 a.m when he was a soldier. (Anh ấy luôn thức dậy vào lúc 5 giờ sáng khi anh ấy từng là một người lính.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"50%\">\n<p><strong>Diễn tả một hành động xen vào một hành động đang diễn ra trong quá khứ.</strong></p>\n<p><strong style=\"color: #c00000;\">Lưu ý: Với hành động đang diễn ra ta chia thì Quá khứ tiếp diễn, hành động xen vào hành động khác được chia thì Quá khứ đơn)</strong></p>\n</td>\n<td valign=\"top\" width=\"50%\">\n<p>They were sleeping when the phone rang. (Họ đang ngủ thì điện thoại kêu.)</p>\n<p>The children were playing football when their mother came back home. (Bọn trẻ đang chơi đá bóng thì mẹ của chúng trở về nhà.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"50%\">\n<p><strong>Diễn đạt một chuỗi bao gồm các hành động xảy ra liên tiếp trong quá khứ. </strong></p>\n</td>\n<td valign=\"top\" width=\"50%\">\n<p>He opened the door, turned on the lights, and sat down. (Anh ấy mở cửa, bật đèn lên và ngồi xuống.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"50%\">\n<p><strong>Dùng trong câu ước không có thật. </strong></p>\n</td>\n<td valign=\"top\" width=\"50%\">\n<p>I wished I owned a villa. (Tôi ước tôi sở hữu một căn villa.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"50%\">\n<p><strong>Dùng trong câu điều kiện loại II (câu điều kiện không có thật ở hiện tại.)</strong></p>\n</td>\n<td valign=\"top\" width=\"50%\">\n<p>If he were taller, he could play basketball. (Nếu anh ấy cao hơn, anh ấy có thể chơi được bóng rổ.)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>5. Cách chia động từ ở thì quá khứ đơn</strong></p>\n<p><strong>a. Đối với động từ tobe</strong></p>\n<p>• <strong>Was: </strong>ngôi thứ nhất số ít, ngôi thứ ba số ít (I, he, she, it)</p>\n<p>• <strong>Were</strong>: ngôi thứ nhất số nhiều, ngôi thứ hai, ngôi thứ ba số nhiều (we, you, they)</p>\n<p><strong>b. Đối với động từ thường (V2)</strong></p>\n<p>• Ta thêm “<strong>ed</strong>” vào đuôi những động từ có quy tắc: want → wanted, turn → turned,...</p>\n<p>• Thêm “<strong>d</strong>” vào những động từ đã có tận cùng là “<strong>e</strong>”: Agree → Agreed, smile →smiled,...</p>\n<p>• Động từ đuôi “<strong>y</strong>”, ta chuyển thành “<strong>i</strong>” rồi thêm “<strong>ed</strong>”: study → studied, cry → cried,...</p>\n<p>• Động từ có <strong>MỘT</strong> âm tiết, tận cùng là một phụ âm, trước phụ âm là một nguyên âm, ta gấp đôi phụ âm cuối rồi thêm “-ed”.</p>\n<p><strong style=\"color: #c00000;\">Lưu ý: NGOẠI LỆ: commit – committed, travel – travelled, prefer – preferred</strong></p>\n<p>• <strong>Động từ tận cùng là “y”: </strong></p>\n<p>- Nếu trước “y” là một nguyên âm (a,e,i,o,u) ta giữ nguyên “y” và cộng thêm “ed” như bình thường. (Eg. Play – played, stay – stayed)</p>\n<p>- Nếu trước “y” là phụ âm (còn lại) ta đổi “y” thành “i +ed”. (Eg. Study – studied. Cry – cried)</p>\n<p><strong>c. Đối với động từ bất quy tắc</strong></p>\n<p>        Bên cạnh những động từ có quy tắc thêm “-ed”, có một số động từ khác đòi hỏi người học phải ghi nhớ thuộc lòng mà không có bất kỳ quy tắc chia thì nào. Những động từ đó trong quá khứ đơn được gọi là “động từ bất quy tắc.) Dưới đây là một số động từ bất quy tắc thường hay gặp.</p>\n<table class=\"MsoNormalTable\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td width=\"32%\">\n<p style=\"text-align:center;\"><strong>Động từ</strong></p>\n</td>\n<td width=\"34%\">\n<p style=\"text-align:center;\"><strong>Thể quá khứ đơn (V2)</strong></p>\n</td>\n<td width=\"33%\">\n<p style=\"text-align:center;\"><strong>Nghĩa</strong></p>\n</td>\n</tr>\n<tr>\n<td width=\"32%\">\n<p style=\"text-align:center;\">Begin</p>\n</td>\n<td width=\"34%\">\n<p style=\"text-align:center;\">Began</p>\n</td>\n<td width=\"33%\">\n<p style=\"text-align:center;\">Bắt đầu</p>\n</td>\n</tr>\n<tr>\n<td width=\"32%\">\n<p style=\"text-align:center;\">Come</p>\n</td>\n<td width=\"34%\">\n<p style=\"text-align:center;\">Came</p>\n</td>\n<td width=\"33%\">\n<p style=\"text-align:center;\">Đi đến</p>\n</td>\n</tr>\n<tr>\n<td width=\"32%\">\n<p style=\"text-align:center;\">Do</p>\n</td>\n<td width=\"34%\">\n<p style=\"text-align:center;\">Did</p>\n</td>\n<td width=\"33%\">\n<p style=\"text-align:center;\">Làm</p>\n</td>\n</tr>\n<tr>\n<td width=\"32%\">\n<p style=\"text-align:center;\">Eat</p>\n</td>\n<td width=\"34%\">\n<p style=\"text-align:center;\">Ate</p>\n</td>\n<td width=\"33%\">\n<p style=\"text-align:center;\">Ăn</p>\n</td>\n</tr>\n<tr>\n<td width=\"32%\">\n<p style=\"text-align:center;\">Find</p>\n</td>\n<td width=\"34%\">\n<p style=\"text-align:center;\">Found</p>\n</td>\n<td width=\"33%\">\n<p style=\"text-align:center;\">Tìm thấy</p>\n</td>\n</tr>\n<tr>\n<td width=\"32%\">\n<p style=\"text-align:center;\">Give</p>\n</td>\n<td width=\"34%\">\n<p style=\"text-align:center;\">Gave</p>\n</td>\n<td width=\"33%\">\n<p style=\"text-align:center;\">Cho</p>\n</td>\n</tr>\n<tr>\n<td width=\"32%\">\n<p style=\"text-align:center;\">Have</p>\n</td>\n<td width=\"34%\">\n<p style=\"text-align:center;\">Had</p>\n</td>\n<td width=\"33%\">\n<p style=\"text-align:center;\">Có</p>\n</td>\n</tr>\n<tr>\n<td width=\"32%\">\n<p style=\"text-align:center;\">Keep</p>\n</td>\n<td width=\"34%\">\n<p style=\"text-align:center;\">Kept</p>\n</td>\n<td width=\"33%\">\n<p style=\"text-align:center;\">Giữ</p>\n</td>\n</tr>\n<tr>\n<td width=\"32%\">\n<p style=\"text-align:center;\">Leave</p>\n</td>\n<td width=\"34%\">\n<p style=\"text-align:center;\">Left</p>\n</td>\n<td width=\"33%\">\n<p style=\"text-align:center;\">Ra đi</p>\n</td>\n</tr>\n<tr>\n<td width=\"32%\">\n<p style=\"text-align:center;\">Meet</p>\n</td>\n<td width=\"34%\">\n<p style=\"text-align:center;\">Met</p>\n</td>\n<td width=\"33%\">\n<p style=\"text-align:center;\">Gặp mặt</p>\n</td>\n</tr>\n<tr>\n<td width=\"32%\">\n<p style=\"text-align:center;\">Pay</p>\n</td>\n<td width=\"34%\">\n<p style=\"text-align:center;\">Paid</p>\n</td>\n<td width=\"33%\">\n<p style=\"text-align:center;\">Trả</p>\n</td>\n</tr>\n<tr>\n<td width=\"32%\">\n<p style=\"text-align:center;\">Read</p>\n</td>\n<td width=\"34%\">\n<p style=\"text-align:center;\">Read</p>\n</td>\n<td width=\"33%\">\n<p style=\"text-align:center;\">Đọc</p>\n</td>\n</tr>\n<tr>\n<td width=\"32%\">\n<p style=\"text-align:center;\">Sing</p>\n</td>\n<td width=\"34%\">\n<p style=\"text-align:center;\">Sang</p>\n</td>\n<td width=\"33%\">\n<p style=\"text-align:center;\">Ca hát</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>II. Imperatives (Câu mệnh lệnh)</strong></p>\n<p><strong>1. Khái niệm về câu mệnh lệnh trong tiếng Anh (Imperative clauses)</strong></p>\n<p>       Câu mệnh lệnh là câu dùng để sai khiến, ra lệnh hay yêu cầu người khác làm hay không làm một việc gì đó. Hay nó còn một tên gọi khác là “câu cầu khiến” và thường theo sau bởi từ please. Câu mệnh lệnh thường không có chủ ngữ và chủ ngữ của câu mệnh lệnh được ngầm hiểu là you. </p>\n<p><strong>2. Câu mệnh lệnh trực tiếp</strong></p>\n<p><strong>a. Đứng đầu câu là động từ nguyên mẫu không có “to”, không có chủ ngữ. Trong câu có thể có kèm theo từ “please” ở đầu hoặc cuối câu thể hiện ý trang trọng, lịch sự.<br /></strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong></p>\n<p>• Enjoy your meal.  (Ăn ngon miệng nhé.)</p>\n<p>• Stop talking and open your books. (Ngừng nói chuyện và mở sách ra.)</p>\n<p>• Be quiet. (Trật tự nào.)</p>\n<p>• Stop here, please. (Làm ơn dừng tại đây.)</p>\n<p><strong>b. Đứng đầu câu là một danh từ riêng hoặc đại từ nhằm xác định cụ thể đối tượng được nói đến trong câu mệnh lệnh</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong></p>\n<p>• David, hurry up. (Nhanh lên David)</p>\n<p>• Tom, stand up. The others stay sitting. (Tom đứng lên, các bạn khác vẫn ngồi tại chỗ)</p>\n<p><strong>3. Dạng phủ định của Câu mệnh lệnh</strong></p>\n<p>• <em>Với câu mệnh lệnh trực tiếp, chỉ cần thêm “don’t” vào trước động từ  thường/ động từ tobe hoặc “no” trước danh động từ.</em><br /><strong>Công thức</strong>: <strong>Don’t/ Do not + </strong><em>động từ nguyễn mẫu + tân ngữ</em></p>\n<p>• <em>Với câu mệnh lệnh gián tiếp, chỉ cần thêm “not” vào trước “to” là được.</em></p>\n<p><strong>Công thức</strong>: <em>order/ ask/ say/ tell somebody <strong>not</strong> to do something</em></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong></p>\n<p>• Don’t turn on the light when you go out. (Đừng tắt đèn khi anh đi ra ngoài.)</p>\n<p>• Don’t forget your promise. (Đừng thất hứa nhé.)</p>",
                "readingPassage": "Last Saturday, my school held a big sports event. We played badminton and table tennis. Our team won the badminton match and became the school champion. We felt very proud and tired after running so much.",
                "readingPassageTitle": "School Sports Day",
                "videos": [
                    {
                        "id": "vxDJ3rmL2bY",
                        "title": "Tiếng Anh 6 Unit 8: Từ vựng trang 70 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "fJ0IbIp3ATc",
                        "title": "Tiếng Anh 6 Unit 8: Getting started trang 16, 17 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "GcCgv2jD07s",
                        "title": "Tiếng Anh 6 Unit 8: A closer look 1 trang 18 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "bLJltJIZrJ4",
                        "title": "Tiếng Anh 6 Unit 8: A closer look 2 trang 19, 20 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "MfbhfYaOvD4",
                        "title": "Tiếng Anh 6 Unit 8: Communication trang 21 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "zjMtaZmM2jU",
                        "title": "Tiếng Anh 6 Unit 8: Skills 1 trang 22 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "6gOq3G3Zswo",
                        "title": "Tiếng Anh 6 Unit 8: Skills 2 trang 23 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "yg5Fis_2RcE",
                        "title": "Tiếng Anh 6 Unit 8: Looking back trang 24 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "gcRpZ5l0Hwk",
                        "title": "Tiếng Anh 6 Unit 8: Project trang 25 Global Success (DỄ HIỂU NHẤT)"
                    }
                ],
                "questions": {
                    "reading": [
                        {
                            "question": "What is the main topic of the passage?",
                            "options": [
                                "Unit 8: Sports and Games",
                                "Playing sports",
                                "Travelling around the world"
                            ],
                            "answer": "Unit 8: Sports and Games"
                        },
                        {
                            "question": "Which word is mentioned in the reading passage?",
                            "options": [
                                "aerobics",
                                "helicopter",
                                "spaceship"
                            ],
                            "answer": "aerobics"
                        },
                        {
                            "question": "How does the writer feel about the topic?",
                            "options": [
                                "Excited and happy",
                                "Bored and tired",
                                "Sad"
                            ],
                            "answer": "Excited and happy"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t9",
                "title": "Unit 9: Cities of the World",
                "subtitle": "Các thành phố trên thế giới và hiện tại hoàn thành",
                "vocab": [
                    {
                        "word": "(river) bank",
                        "translation": "bờ (sông)",
                        "phonetics": "/bæŋk/",
                        "type": "noun",
                        "sentence": "I can see a beautiful (river) bank in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người bờ (sông) tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "crowded",
                        "translation": "đông đúc",
                        "phonetics": "/ˈkraʊ.dɪd/",
                        "type": "adjective",
                        "sentence": "We want to crowded together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau đông đúc vào cuối tuần này."
                    },
                    {
                        "word": "floating market",
                        "translation": "chợ nổi",
                        "phonetics": "/ˈfləʊ.tɪŋ ˈmɑː.kɪt/",
                        "type": "noun",
                        "sentence": "I can see a beautiful floating market in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người chợ nổi tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "helpful",
                        "translation": "sẵn sàng giúp đỡ",
                        "phonetics": "/ˈhelp.fəl/",
                        "type": "adjective",
                        "sentence": "We want to helpful together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau sẵn sàng giúp đỡ vào cuối tuần này."
                    },
                    {
                        "word": "helmet",
                        "translation": "mũ bảo hiểm",
                        "phonetics": "/ˈhel.mət/",
                        "type": "noun",
                        "sentence": "I can see a beautiful helmet in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người mũ bảo hiểm tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "landmark",
                        "translation": "địa điểm, công trình thu hút du khách",
                        "phonetics": "/ˈlænd.mɑːk/",
                        "type": "noun",
                        "sentence": "The Eiffel Tower is a famous landmark in Paris.",
                        "sentenceTranslation": "Tháp Eiffel là một địa danh nổi tiếng ở Paris."
                    },
                    {
                        "word": "(city) map",
                        "translation": "sơ đồ thành phố",
                        "phonetics": "/mæp/",
                        "type": "noun",
                        "sentence": "I can see a beautiful (city) map in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người sơ đồ thành phố tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "palace",
                        "translation": "cung điện",
                        "phonetics": "/ˈpæl.ɪs/",
                        "type": "noun",
                        "sentence": "I can see a beautiful palace in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người cung điện tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "possessive",
                        "translation": "(tính từ) sở hữu",
                        "phonetics": "/pəˈzes.ɪv/",
                        "type": "adjective",
                        "sentence": "We want to possessive together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau (tính từ) sở hữu vào cuối tuần này."
                    },
                    {
                        "word": "possessive",
                        "translation": "(đại từ) sở hữu",
                        "phonetics": "/pəˈzes.ɪv/",
                        "type": "pro",
                        "sentence": "We learn the word \"possessive\" in our English class.",
                        "sentenceTranslation": "Chúng tớ học từ \"(đại từ) sở hữu\" trong giờ học tiếng Anh."
                    },
                    {
                        "word": "postcard",
                        "translation": "bưu thiếp",
                        "phonetics": "/ˈpəʊst.kɑːd/",
                        "type": "noun",
                        "sentence": "I can see a beautiful postcard in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người bưu thiếp tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "rent",
                        "translation": "thuê",
                        "phonetics": "/rent/",
                        "type": "verb",
                        "sentence": "We want to rent together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau thuê vào cuối tuần này."
                    },
                    {
                        "word": "Royal Palace",
                        "translation": "Cung điện Hoàng gia",
                        "phonetics": "/ˈrɔɪ.əl ˈpæl.ɪs/",
                        "type": "noun",
                        "sentence": "I can see a beautiful royal palace in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người Cung điện Hoàng gia tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "shell",
                        "translation": "vỏ sò",
                        "phonetics": "/ʃel/",
                        "type": "noun",
                        "sentence": "I can see a beautiful shell in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người vỏ sò tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "stall",
                        "translation": "gian hàng",
                        "phonetics": "/stɔːl/",
                        "type": "noun",
                        "sentence": "I can see a beautiful stall in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người gian hàng tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "street food",
                        "translation": "đường phố",
                        "phonetics": "/ˈstriːt ˌfuːd/",
                        "type": "noun",
                        "sentence": "I can see a beautiful street food in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người đường phố tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "Times Square",
                        "translation": "Quảng trường Thời đại",
                        "phonetics": "/ˈtaɪmz skweər/",
                        "type": "noun",
                        "sentence": "I can see a beautiful times square in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người Quảng trường Thời đại tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "tower",
                        "translation": "tháp",
                        "phonetics": "/taʊər/",
                        "type": "noun",
                        "sentence": "I can see a beautiful tower in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người tháp tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "vacation",
                        "translation": "kì nghỉ (hè)",
                        "phonetics": "/veɪˈkeɪ.ʃən/",
                        "type": "noun",
                        "sentence": "I can see a beautiful vacation in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người kì nghỉ (hè) tuyệt đẹp trong bức tranh này."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Have you ever been to London? - Yes, I have been there once.",
                        "vietnamese": "Cậu đã từng đến London bao giờ chưa? - Có, tớ từng đến đó một lần."
                    },
                    {
                        "english": "Which city is more modern, New York or London?",
                        "vietnamese": "Thành phố nào hiện đại hơn, New York hay London?"
                    }
                ],
                "grammar": "<p><strong>A. GRAMMAR</strong></p>\n<p><strong>I. Possessive adjectives (Tính từ sở hữu)</strong></p>\n<p><strong>1. Tính từ sở hữu là gì?</strong></p>\n<p><strong>        Tính từ sở hữu (Possessive Adjectives) </strong>là những từ được sử dụng để chỉ sự sở hữu của một danh từ nào đó. Chúng thường đứng trước danh từ để bổ nghĩa cho danh từ đó, giúp người đọc hoặc người nghe hiểu được danh từ đó thuộc về ai, cái gì. Các tính từ sở hữu phổ biến trong tiếng Anh thường bao gồm: My, your, his, her, its, our, your, their. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong> My mother is a teacher. (Mẹ tôi là giáo viên.)</p>\n<p>            Your shoes are under the table. (Giày của bạn ở dưới bàn.)</p>\n<p>            She is reading her favorite book. (Cô ấy đang đọc quyển sách yêu thích của cô ấy.)</p>\n<p><strong>2. Những tính từ sở hữu phổ biến trong tiếng Anh</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"170\">\n<p style=\"text-align:center;\"><strong>Đại từ nhân xưng</strong></p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p style=\"text-align:center;\"><strong>Tính từ sở hữu</strong></p>\n</td>\n<td valign=\"top\" width=\"305\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"170\">\n<p><strong>I </strong></p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p><strong>My </strong></p>\n</td>\n<td valign=\"top\" width=\"305\">\n<p>I lost my keys this morning. (Tôi làm mất chìa khóa của mình sáng nay.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"170\">\n<p><strong>We </strong></p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p><strong>Our </strong></p>\n</td>\n<td valign=\"top\" width=\"305\">\n<p>We love our family. (Chúng tôi yêu gia đình của mình.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"170\">\n<p><strong>You </strong></p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p><strong>Your </strong></p>\n</td>\n<td valign=\"top\" width=\"305\">\n<p>Is this your bag? (Đây có phải cái túi của bạn không?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"170\">\n<p><strong>They </strong></p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p><strong>Their </strong></p>\n</td>\n<td valign=\"top\" width=\"305\">\n<p>Their children are polite. (Những đứa trẻ của họ rất lễ phép.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"170\">\n<p><strong>He </strong></p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p><strong>His</strong></p>\n</td>\n<td valign=\"top\" width=\"305\">\n<p>He forgot his umbrella. (Anh ấy quên cái ô của mình.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"170\">\n<p><strong>She </strong></p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p><strong>Her</strong></p>\n</td>\n<td valign=\"top\" width=\"305\">\n<p>She is wearing her new dress. (Cô ấy đang mặc chiếc váy mới của cô ấy.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"170\">\n<p><strong>It </strong></p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p><strong>Its </strong></p>\n</td>\n<td valign=\"top\" width=\"305\">\n<p>The cat is licking its tail. (Con mèo đang liếm cái đuôi của nó.)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>3. Cấu trúc và vị trí của tính từ sở hữu</strong></p>\n<p>        Tính từ sở hữu luôn được đặt trước danh từ trong câu nhằm nhấn mạnh sự sở hữu của danh từ đó. </p>\n<p style=\"text-align:center;\"><strong style=\"background: yellow;\">Possessive adjectives + Nouns</strong></p>\n<p><strong>4. Cách sử dụng tính từ sở hữu trong tiếng Anh</strong></p>\n<p><strong>a. Dùng để chỉ một cái gì thuộc về ai đó</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong> My boyfriend and I are going to the movies tonight. (Tôi và bạn trai sẽ đi xem phim tối nay.)</p>\n<p>           Our favorite song just played on the radio. (Bài hát yêu thích của chúng tôi vừa được phát trên radio.)</p>\n<p><strong>b. Dùng để chỉ về bộ phận con người</strong></p>\n<p>        Các tính từ sở hữu trong tiếng Anh thường được dùng để chỉ về bộ phận của cơ thể người  hoặc miêu tả về hình dáng bên ngoài. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> Our backs hurt after the long hike. (Lưng của chúng tôi bị đau sau khi leo núi.)</p>\n<p>            Their faces look tired. (Khuôn mặt của họ trông mệt mỏi.)</p>\n<p><strong>c. Được dùng dựa trên danh từ nhân xưng, không dựa vào số lượng của danh từ</strong></p>\n<p>        Trong tiếng Anh, các tính từ sở hữu thường được dùng tùy vào các danh từ nhân xưng , không phụ thuộc vào số lượng của danh từ dù là nhiều hay ít. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong>  My friend is kind. → My friends are kind.</p>\n<p>            Her book is interesting. → Her books are interesting. </p>\n<p><strong>d. Được thay thế bởi mạo từ “the”</strong></p>\n<p>        Trong một vài trường hợp ngoại lệ, ta có thể dùng mạo từ “the” để thay thế chp tính từ sở hữu, điển hình là trong những câu chứa giới từ “<strong>in</strong>” hoặc các thành ngữ phổ biến. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong>  She was hit in her face. → She was hit in the face. (Cô ấy bị đánh vào mặt.)</p>\n<p>           They looked me in my eyes. → They looked me in the eyes. (Họ nhìn thẳng vào mắt tôi.) </p>\n<p><strong>5. Lưu ý khi sử dụng tính từ sở hữu trong tiếng Anh </strong></p>\n<p><strong>a. Đảm bảo sự hòa hợp giữa chủ ngữ và tính từ sở hữu </strong></p>\n<p>        Các tính từ sở hữu trong tiếng Anh được dùng tương ứng với các đại từ nhân xưng. Nó sẽ không phụ thuộc vào vật sở hữu. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> “His” (của cậu ấy) tương ứng với “he (cậu ấy)” và không phụ thuộc vào vật mà “she” sở hữu. (She goes to school with her classmate – Cô ấy đến trường với bạn cùng lớp của cô ấy.)</p>\n<p><strong>b. Chú ý phân biệt giữa tính từ sở hữu và đại từ sở hữu. </strong></p>\n<p>        Trong tiếng Anh, tính từ sở hữu và đại từ sở hữu rất dễ nhầm lẫn. Vì vậy, cần hết sức cẩn thận khi sử dụng. Và điều quan trọng nhất là cần phân biệt được chứng năng của chúng. </p>\n<p>• Tính từ sở hữu để chỉ một người, một vật sở hữu của danh từ. (my dog, my book, …)</p>\n<p>• Đại từ sở hữu dùng thay thế chp danh từ ở trong câu, nhằm hạn chế nhắc lại. </p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"198\">\n<p style=\"text-align:center;\"><strong>Đại từ nhân xưng</strong></p>\n</td>\n<td valign=\"top\" width=\"227\">\n<p style=\"text-align:center;\"><strong>Tính từ sở hữu</strong></p>\n</td>\n<td valign=\"top\" width=\"239\">\n<p style=\"text-align:center;\"><strong>Đại từ sở hữu</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p>I </p>\n</td>\n<td valign=\"top\" width=\"227\">\n<p>My</p>\n</td>\n<td valign=\"top\" width=\"239\">\n<p>Mine </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p>We</p>\n</td>\n<td valign=\"top\" width=\"227\">\n<p>Our</p>\n</td>\n<td valign=\"top\" width=\"239\">\n<p>Our</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p>You</p>\n</td>\n<td valign=\"top\" width=\"227\">\n<p>Your</p>\n</td>\n<td valign=\"top\" width=\"239\">\n<p>Yours</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p>He </p>\n</td>\n<td valign=\"top\" width=\"227\">\n<p>His</p>\n</td>\n<td valign=\"top\" width=\"239\">\n<p>His</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p>She </p>\n</td>\n<td valign=\"top\" width=\"227\">\n<p>Her</p>\n</td>\n<td valign=\"top\" width=\"239\">\n<p>Hers</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p>It </p>\n</td>\n<td valign=\"top\" width=\"227\">\n<p>Its </p>\n</td>\n<td valign=\"top\" width=\"239\">\n<p>Its </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p>They </p>\n</td>\n<td valign=\"top\" width=\"227\">\n<p>Their </p>\n</td>\n<td valign=\"top\" width=\"239\">\n<p>Theirs </p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>c. Không dùng với mạo từ: không sử dung mạo từ (a, an, the) trước tính từ sở hữu</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• <strong>Sai:</strong> The my book is new.</p>\n<p>• <strong>Đúng:</strong> My book is new.</p>\n<p><strong>d. Sử dụng sai “its” và “it’s”</strong></p>\n<p>        Trường hợp “its (tính từ sở hữu) và “it’s” (viết tắt của “it is” hoặc “it has” thường dễ thấy trong khi làm bải tập về tính từ sở hữu và đại từ sở hữu. Cách để không sử dụng nhầm giữ hai từ này, hãy luôn kiểm tra ngữ cảnh để sử dụng đúng. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• <strong>Sai:</strong> The dog wagged it’s tail.</p>\n<p>• <strong>Đúng:</strong> The dog wagged its tail. </p>\n<p><strong>e. Lỗi lạm dụng “her” và “his” cho động vật không rõ giới tính. </strong></p>\n<p>        Trong tiếng Anh, khi giới tính động vật không rõ hoặc không quan trọng, ta sử dụng tính từ sở hữu là “its”. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• <strong>Sai</strong>: The bird is in his cage. </p>\n<p>• <strong>Đúng</strong>: The bird is in its cage. </p>\n<p><strong>II. Possessive Pronouns (Đại từ sở hữu)</strong></p>\n<p><strong>1. Đại từ sở hữu là gì?</strong></p>\n<p><strong>        Đại từ sở hữu</strong> (possessive pronoun) là những từ dùng để diễn đạt sự sở hữu hoặc quyền sở hữu của một người hay một nhóm người đối với một vật, người hoặc khái niệm cụ thể. Chúng có vai trò thay thế cụm danh từ dài, tránh lặp lại từ và làm cho câu văn ngắn gọn hơn nhưng vẫn đảm bảo ý nghĩa đầy đủ. </p>\n<p>        Khác với tính từ sở hữu (possessive adjectives), đại từ sở hữu có thể đứng một mình mà không cần danh từ đi kèm. Điều này không chỉ giúp câu văn trở nên mượt mà hơn mà còn nâng cao khả năng biểu đạt của người nói hoặc viết. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong> This pen is mine. (Cây bút này là của tôi.)</p>\n<p>            The toys are theirs. (Mấy món đồ chơi đó là của họ.)</p>\n<p><strong>2. Những đại từ sở hữu phổ biến trong tiếng Anh</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"85\">\n<p style=\"text-align:center;\"><strong>Đại từ nhân xưng</strong></p>\n</td>\n<td valign=\"top\" width=\"85\">\n<p style=\"text-align:center;\"><strong>Đại từ sở hữu</strong></p>\n</td>\n<td valign=\"top\" width=\"94\">\n<p style=\"text-align:center;\"><strong>Dịch nghĩa</strong></p>\n</td>\n<td valign=\"top\" width=\"198\">\n<p style=\"text-align:center;\"><strong>Cách sử dụng</strong></p>\n</td>\n<td valign=\"top\" width=\"201\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"85\">\n<p><strong>I</strong></p>\n</td>\n<td valign=\"top\" width=\"85\">\n<p><strong>mine</strong></p>\n</td>\n<td valign=\"top\" width=\"94\">\n<p><strong>Của tôi</strong></p>\n</td>\n<td valign=\"top\" width=\"198\">\n<p>Dùng thay thế cụm danh từ thuộc sở hữu của “tôi”.</p>\n</td>\n<td valign=\"top\" width=\"201\">\n<p>This hat is mine. (Chiếc mũ này là của tôi.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"85\">\n<p><strong>You </strong></p>\n</td>\n<td valign=\"top\" width=\"85\">\n<p><strong>yours</strong></p>\n</td>\n<td valign=\"top\" width=\"94\">\n<p><strong>Của bạn</strong></p>\n</td>\n<td valign=\"top\" width=\"198\">\n<p>Dùng để chỉ vật hoặc thứ thuộc sở hữu của “bạn” hoặc “các bạn”.</p>\n</td>\n<td valign=\"top\" width=\"201\">\n<p>That book is yours. (Cuốn sách kia là của bạn.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"85\">\n<p><strong>He </strong></p>\n</td>\n<td valign=\"top\" width=\"85\">\n<p><strong>his</strong></p>\n</td>\n<td valign=\"top\" width=\"94\">\n<p><strong>Của anh ấy</strong></p>\n</td>\n<td valign=\"top\" width=\"198\">\n<p>Dùng để chỉ quyền sở hữu của một nam giới.</p>\n</td>\n<td valign=\"top\" width=\"201\">\n<p>This jacket is his. (Cái áo khoác này là của anh ấy.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"85\">\n<p><strong>She </strong></p>\n</td>\n<td valign=\"top\" width=\"85\">\n<p><strong>hers</strong></p>\n</td>\n<td valign=\"top\" width=\"94\">\n<p><strong>Của cô ấy</strong></p>\n</td>\n<td valign=\"top\" width=\"198\">\n<p>Dùng để chỉ quyền sở hữu của một nữ giới.</p>\n</td>\n<td valign=\"top\" width=\"201\">\n<p>The handbag is hers. (Cái túi xách là của cô ấy.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"85\">\n<p><strong>It </strong></p>\n</td>\n<td valign=\"top\" width=\"85\">\n<p><strong>its</strong></p>\n</td>\n<td valign=\"top\" width=\"94\">\n<p><strong>Của nó</strong></p>\n</td>\n<td valign=\"top\" width=\"198\">\n<p>Dùng khi nói về quyền sở hữu của một vật hoặc động vật không xác định giới tính.</p>\n</td>\n<td valign=\"top\" width=\"201\">\n<p>I have a bunny, this carrot is its. (Tôi có một con thỏ, củ cà rốt này là của nó.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"85\">\n<p><strong>We </strong></p>\n</td>\n<td valign=\"top\" width=\"85\">\n<p><strong>ours</strong></p>\n</td>\n<td valign=\"top\" width=\"94\">\n<p><strong>Của chúng tôi</strong></p>\n</td>\n<td valign=\"top\" width=\"198\">\n<p>Dùng để nói về những thứ thuộc sở hữu của “chúng tôi”.</p>\n</td>\n<td valign=\"top\" width=\"201\">\n<p>This house is ours. (Ngôi nhà này là của chúng tôi.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"85\">\n<p><strong>They </strong></p>\n</td>\n<td valign=\"top\" width=\"85\">\n<p><strong>theirs</strong></p>\n</td>\n<td valign=\"top\" width=\"94\">\n<p><strong>Của họ</strong></p>\n</td>\n<td valign=\"top\" width=\"198\">\n<p>Dùng để thay thế danh từ thuộc về “họ”.</p>\n</td>\n<td valign=\"top\" width=\"201\">\n<p>These bikes are theirs. (Những chiếc xe đạp này là của họ.)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong style=\"color: #c00000;\">Lưu ý: </strong><em>“His” và “its” có hình thức giống nhau giữa hai loại đại từ là đại từ sở hữu (possessive pronouns) và tính từ sở hữu (possessive adjective). Tuy nhiên, tính từ sở hữu thì không đứng một mình và theo sau dó luôn là một danh từ. Còn đại từ sở hữu có thể đứng một mình  mà không cần danh từ theo sau. Bạn nên hết sức lưu ý để phân biệt các từ loại này. </em></p>\n<p><strong>3. Vị trí của đại từ sở hữu</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"151\">\n<p style=\"text-align:center;\"><strong>Vị trí</strong></p>\n</td>\n<td valign=\"top\" width=\"255\">\n<p style=\"text-align:center;\"><strong>Cấu trúc</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Chủ ngữ </strong></p>\n</td>\n<td valign=\"top\" width=\"255\">\n<p><strong>Đại từ sở hữu + V (+O)</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>My report was quite short, but yours is ten pages long. (Bản báo cáo của tôi thì khá ngắn, còn của bạn thì dài tới tận 10 trang.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Tân ngữ </strong></p>\n</td>\n<td valign=\"top\" width=\"255\">\n<p><strong>S + V + [đại từ sở hữu]</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>I forgot to bring my notebook, so I borrowed yours. (Tôi quên mang theo vở, nên mượn vở của bạn nhé.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"151\">\n<p><strong>Sau giới từ</strong></p>\n</td>\n<td valign=\"top\" width=\"255\">\n<p><strong>S + V + cụm giới từ (+O)</strong></p>\n<p><strong>Cụm giới từ = [giới từ + đại từ sở hữu]</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>We put your shoes next to mine. (Tôi để giày của bạn kế giày của tôi rồi nhé.)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>4. Cách dùng đại từ sở hữu</strong></p>\n<p><strong>a. Cách dùng như cụm danh từ</strong></p>\n<p>        Trong trường hợp này, <strong>possessive pronoun</strong> là loại sở hữu tuyệt đối mà không cần bất kỳ danh từ nào theo sau để bổ nghĩa. Vì vậy, đại từ sở hữu thường đứng một mình để chỉ sự sở hữu. Khi đó, ngữ cảnh thường đã xác định rõ vật thể hoặc đối tượng mà đại từ đang ám chỉ. Đây cũng là điểm phân biệt loại đại từ này với tính từ sở hữu. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong>  “Is this your water bottle?” (Đây có phải chai nước của bạn không?)</p>\n<p>            “No, it’s hers.” (Không, nó là của cô ấy.)</p>\n<p>Trong ví dụ này, “hers” thay thế cho “her water bottle” đã được ngầm hiểu từ câu hỏi, giúp tránh lặp lại mà vẫn rõ nghĩa.)</p>\n<p><strong>b. Cách dùng như tính từ sở hữu</strong></p>\n<p>        Giống như tính từ sở hữu, đại từ sở hữu (possessive pronouns) cũng có những cách sử dụng khác. Ví dụ như chúng có thể được sử dụng để thể hiện nguồn gốc hoặc mối quan hệ đặc biệt. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• <strong>Nguồn gốc (origin): </strong><em>Paris is their hometown, but Hanoi is ours. (Paris là quê hương của họ, còn Hà Nội là của chúng ta.)</em></p>\n<p>        Từ <strong>“ours”</strong> ở đây thay thế cho <strong>“our hometown”</strong> (quê hương của chúng ta). Người nói đang so sánh nơi họ sinh ra/lớn lên với một nhóm khác (họ = they), cho thấy mối liên hệ về <strong>nguồn gốc</strong>.</p>\n<p>• <strong>Mối quan hệ (relationship): </strong><em>Nam introduced his cousin to the group, and I introduced mine. (Nam giới thiệu em họ của anh ấy với cả nhóm, và tôi cũng giới thiệu em họ của mình.)</em></p>\n<p>            Từ <strong>“mine”</strong> thay thế cho <strong>“my cousin”</strong> (em họ của tôi). Câu này thể hiện <strong>mối quan hệ gia đình</strong> giữa người nói và một người khác, nhưng không phải “sở hữu” theo nghĩa vật chất — mà là mối liên kết huyết thống hoặc thân quen.</p>\n<p><strong>5. Lưu ý khi sử dụng đại từ sở hữu</strong></p>\n<p><strong>a. Không dùng đại từ sở hữu kèm với danh từ</strong></p>\n<p>        Một trong những lỗi phổ biến nhất là sử dụng đại từ sở hữu cùng với danh từ dẫn đến sai ngữ pháp. Nếu đã dùng đại từ sở hữu, danh từ phía sau không cần thiết nữa. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• <strong>Sai:</strong>      This mine book. </p>\n<p>• <strong>Đúng: </strong>This is my book. (Đây là cuốn sách của tôi.)</p>\n<p>                    This book is mine. (Cuốn sách này là của tôi.)</p>\n<p><strong>b. Chỉ dùng đại từ sở hữu khi danh từ đã được nhắc đến trước đó. </strong></p>\n<p>        Đại từ sở hữu chỉ nên được sử dụng khi danh từ mà nó thay thế đã được đề cập trong ngữ cảnh hoặc câu trước đó. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• <strong>Sai:</strong>      Hers is expensive. (Của cô ấy thì đắt tiền.) → Không rõ cái gì đắt tiền. Câu thiếu ngữ cảnh, gây khó hiểu. </p>\n<p>• <strong>Đúng</strong>:   She bought a dress yesterday. Hers is expensive. (Cô ấy đã mua một chiếc váy hôm qua. Váy của cô ấy thì đắt tiền.) → “Hers” ở đây thay thế cho “her dress”, là danh từ đã được nhắc tới trước đó → rõ ràng, đúng ngữ pháp. </p>\n<p><strong>c. Tránh nhầm lẫn với đại từ nhân xưng. </strong></p>\n<p>        Đại từ sở hữu không thể thay thế vai trò của đại từ nhân xưng (I, you, he, she, …) Do đó, cần cẩn thân để tránh nhầm lẫn giữa hai loại đại từ này. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• <strong>Sai:</strong>      Yours is going to study abroad.</p>\n<p>• <strong>Đúng:</strong> You are going to study abroad. </p>\n<p>                    “You” là đại từ nhân xưng, đóng vai trò chủ ngữ cho động từ “are going”. </p>",
                "readingPassage": "I have travelled to many historic cities in Vietnam, like Hue and Hanoi. However, I have never been to any cities in other continents. My dream is to visit Tokyo. I want to see its modern landmarks and bullet trains.",
                "readingPassageTitle": "My Travelling Dreams",
                "videos": [
                    {
                        "id": "35iZV1GpdUw",
                        "title": "Tiếng Anh 6 Unit 9: Từ vựng trang 70, 71 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "jRCBpAZHELQ",
                        "title": "Tiếng Anh 6 Unit 9: Getting started trang 26, 27 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "qt5amgWq9Ug",
                        "title": "Tiếng Anh 6 Unit 9: A closer look 1 trang 28 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "OsB_geqUHCE",
                        "title": "Tiếng Anh 6 Unit 9: A closer look 2 trang 29, 30 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "klOj56weBT0",
                        "title": "Tiếng Anh 6 Unit 9: Communication trang 30, 31 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "FNDobh41nUw",
                        "title": "Tiếng Anh 6 Unit 9: Skills 1 trang 32 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "7To-KnLUoTU",
                        "title": "Tiếng Anh 6 Unit 9: Skills 2 trang 33 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "e2LULBae0J4",
                        "title": "Tiếng Anh 6 Unit 9: Looking back trang 34 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "54h5n0QZQQU",
                        "title": "Tiếng Anh 6 Unit 9: Project trang 35 Global Success (HAY NHẤT)"
                    }
                ],
                "questions": {
                    "reading": [
                        {
                            "question": "What is the main topic of the passage?",
                            "options": [
                                "Unit 9: Cities of the World",
                                "Playing sports",
                                "Travelling around the world"
                            ],
                            "answer": "Unit 9: Cities of the World"
                        },
                        {
                            "question": "Which word is mentioned in the reading passage?",
                            "options": [
                                "(river) bank",
                                "helicopter",
                                "spaceship"
                            ],
                            "answer": "(river) bank"
                        },
                        {
                            "question": "How does the writer feel about the topic?",
                            "options": [
                                "Excited and happy",
                                "Bored and tired",
                                "Sad"
                            ],
                            "answer": "Excited and happy"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t10",
                "title": "Unit 10: Our Houses in the Future",
                "subtitle": "Nhà cửa tương lai và động từ khuyết thiếu will/might",
                "vocab": [
                    {
                        "word": "appliance",
                        "translation": "thiết bị",
                        "phonetics": "/əˈplaɪ.əns/",
                        "type": "noun",
                        "sentence": "I can see a beautiful appliance in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người thiết bị tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "cottage",
                        "translation": "nhà tranh",
                        "phonetics": "/ˈkɒt.ɪdʒ/",
                        "type": "noun",
                        "sentence": "I can see a beautiful cottage in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người nhà tranh tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "dishwasher",
                        "translation": "máy rửa bát",
                        "phonetics": "/ˈdɪʃˌwɒʃ.ər/",
                        "type": "noun",
                        "sentence": "I can see a beautiful dishwasher in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người máy rửa bát tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "dry",
                        "translation": "làm khô, sấy khô",
                        "phonetics": "/draɪ/",
                        "type": "verb",
                        "sentence": "We want to dry together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau làm khô, sấy khô vào cuối tuần này."
                    },
                    {
                        "word": "electric cooker",
                        "translation": "bếp điện",
                        "phonetics": "/iˈlek.trɪk ˈkʊk.ər/",
                        "type": "noun",
                        "sentence": "I can see a beautiful electric cooker in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người bếp điện tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "helicopter",
                        "translation": "máy bay lên thẳng",
                        "phonetics": "/ˈhel.ɪˌkɒp.tər/",
                        "type": "noun",
                        "sentence": "I can see a beautiful helicopter in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người máy bay lên thẳng tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "hi-tech",
                        "translation": "công nghệ cao",
                        "phonetics": "/ˈhɑɪˈtek/",
                        "type": "adjective",
                        "sentence": "We want to hi-tech together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau công nghệ cao vào cuối tuần này."
                    },
                    {
                        "word": "housework",
                        "translation": "công việc nhà",
                        "phonetics": "/ˈhaʊs.wɜːk/",
                        "type": "noun",
                        "sentence": "I can see a beautiful housework in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người công việc nhà tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "location",
                        "translation": "địa điểm",
                        "phonetics": "/ləʊˈkeɪ.ʃən/",
                        "type": "noun",
                        "sentence": "I can see a beautiful location in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người địa điểm tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "look after",
                        "translation": "trông nom, chăm sóc",
                        "phonetics": "/lʊk ˈɑːf.tər/",
                        "type": "verb",
                        "sentence": "We want to look after together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau trông nom, chăm sóc vào cuối tuần này."
                    },
                    {
                        "word": "ocean",
                        "translation": "đại dương",
                        "phonetics": "/ˈəʊ.ʃən/",
                        "type": "noun",
                        "sentence": "I can see a beautiful ocean in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người đại dương tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "outside",
                        "translation": "ngoài",
                        "phonetics": "/ˌaʊtˈsaɪd/",
                        "type": "adverb",
                        "sentence": "We want to outside together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau ngoài vào cuối tuần này."
                    },
                    {
                        "word": "solar energy",
                        "translation": "năng lượng mặt trời",
                        "phonetics": "/ˈsəʊ.lər ˈen.ə.dʒi/",
                        "type": "noun",
                        "sentence": "I can see a beautiful solar energy in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người năng lượng mặt trời tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "space",
                        "translation": "không gian vũ trụ",
                        "phonetics": "/speɪs/",
                        "type": "noun",
                        "sentence": "I can see a beautiful space in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người không gian vũ trụ tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "super",
                        "translation": "siêu đẳng",
                        "phonetics": "/ˈsuː.pər/",
                        "type": "adjective",
                        "sentence": "We want to super together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau siêu đẳng vào cuối tuần này."
                    },
                    {
                        "word": "type",
                        "translation": "kiểu, loại",
                        "phonetics": "/taɪp/",
                        "type": "noun",
                        "sentence": "I can see a beautiful type in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người kiểu, loại tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "UFO (Unidentified Flying Object)",
                        "translation": "vật thể bay, đĩa bay không xác định",
                        "phonetics": "/ˌjuː.efˈəʊ/",
                        "type": "noun",
                        "sentence": "I can see a beautiful ufo (unidentified flying object) in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người vật thể bay, đĩa bay không xác định tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "washing machine",
                        "translation": "máy giặt",
                        "phonetics": "/ˈwɒʃ.ɪŋ məˌʃiːn/",
                        "type": "noun",
                        "sentence": "I can see a beautiful washing machine in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người máy giặt tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "wireless",
                        "translation": "không dây",
                        "phonetics": "/ˈwaɪə.ləs/",
                        "type": "adjective",
                        "sentence": "We want to wireless together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau không dây vào cuối tuần này."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What will your future house be like? - It will be a smart house on the moon.",
                        "vietnamese": "Ngôi nhà tương lai của cậu sẽ như thế nào? - Nó sẽ là một ngôi nhà thông minh trên mặt trăng."
                    },
                    {
                        "english": "We might have robot helpers in our houses.",
                        "vietnamese": "Chúng ta có lẽ sẽ có những trợ lý robot ở trong nhà."
                    }
                ],
                "grammar": "<p><strong>A. GRAMMAR</strong></p>\n<p><strong>I. Future simple (Tương lai đơn)</strong></p>\n<p><strong>1. Thì tương lai đơn là gì?</strong></p>\n<p><strong>        Thì tương lai đơn</strong> (<strong>Simple Future Tense</strong>) dùng để diễn tả một quyết định, kế hoạch tự phát sẽ xảy ra trong tương lai. Ngoài ra, bạn cũng có thể áp dụng thì này để đưa ra một dự án, lời mời hoặc một đề nghị lịch sự. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong>  I will call you when I arrive. (Tôi sẽ gọi cho bạn sau khi tôi đến)</p>\n<p>            She will help you with your homework. (Cô ấy sẽ giúp bạn làm bài tập về nhà.)</p>\n<p>            We will not (won’t) be late for the meeting. (Chúng tôi sẽ không đến trễ cuộc họp dâu.)</p>\n<p><strong>2. Công thức của thì tương lai đơn</strong>. </p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"160\">\n<p style=\"text-align:center;\"><strong>Loại câu</strong></p>\n</td>\n<td valign=\"top\" width=\"246\">\n<p style=\"text-align:center;\"><strong>Động từ to be</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p style=\"text-align:center;\"><strong>Động từ thường</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"160\">\n<p><strong>Thể khẳng định</strong></p>\n</td>\n<td valign=\"top\" width=\"246\">\n<p><strong>S + will + be + N/Adj</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong>She will be a doctor in the future. (Cô ấy sẽ là một bác sĩ trong tương lai.)</p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p><strong>S + will + V-inf + O</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong>We will finish the project next week. (Chúng tôi sẽ hoàn thành dự án vào tuần sau.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"160\">\n<p><strong>Thể phủ định</strong></p>\n</td>\n<td valign=\"top\" width=\"246\">\n<p><strong>S + will not (won’t) + be + N/Adj</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> She won’t be at home tomorrow. (Cô ấy sẽ không có ở nhà vào ngày mai. </p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p><strong>S + will not + V-inf</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> They won’t join the meeting next week. (Họ sẽ không tham gia cuộc họp vào tuần sau. </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"160\">\n<p><strong>Câu nghi vấn (Yes/No Question)</strong></p>\n</td>\n<td valign=\"top\" width=\"246\">\n<p><strong>Will + S + be + N/ Adj?</strong></p>\n<p><strong>Câu trả lời: Yes, S + will / No, S + won’t. </strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong>Will she be happy with the gift? (Cô ấy sẽ vui với món quà chứ?)</p>\n<p><strong> </strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p><strong>Will + S + Vinf?</strong></p>\n<p><strong>Câu trả lời: Yes, S + will. / No, S + won’t. </strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong>Will you call me tonight. (Bạn sẽ gọi cho tôi tối nay chứ?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"160\">\n<p><strong>Câu nghi vấn (WH-question)</strong></p>\n</td>\n<td valign=\"top\" width=\"246\">\n<p><strong>Wh-word + will + S + V-inf?</strong></p>\n<p><strong>Câu trả lời: S + will + V (bare-inf)</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ</strong>: How will she come home next month?</p>\n<p>When will he go to work? (Khi nào anh ấy sẽ đi làm?)</p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p><strong> </strong></p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>3. Cách sử dụng thì tương lai đơn</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"321\">\n<p style=\"text-align:center;\"><strong>Cách dùng</strong></p>\n</td>\n<td valign=\"top\" width=\"343\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"321\">\n<p><strong>Diễn tả một hành động xảy ra sau thời điểm nói hoặc một thời điểm trong tương lai. </strong></p>\n</td>\n<td valign=\"top\" width=\"343\">\n<p>I’m tired. I will take a nap before dinner. (Tôi bị mêt. Tôi sẽ chợp mắt một chút trước bữa tối.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"321\">\n<p><strong>Diễn tả một dự đoán không có cơ sở, căn cứ</strong></p>\n</td>\n<td valign=\"top\" width=\"343\">\n<p>He will probably win the competition. (Có lẽ anh ấy sẽ thắng cuộc thi.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"321\">\n<p><strong>Dùng để đưa ra yêu cầu hay lời mời</strong></p>\n</td>\n<td valign=\"top\" width=\"343\">\n<p>Will you come to my birthday party this weekend? (Bạn sẽ đến sinh nhật mình vào cuối tuần này chứ?)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"321\">\n<p><strong>Dùng để đưa ra một lời hứa</strong></p>\n</td>\n<td valign=\"top\" width=\"343\">\n<p>Don’t worry, I will keep your secret. (Đừng lo, mình sẽ giữ bí mật cho bạn.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"321\">\n<p><strong>Dùng để đưa ra một lời cảnh báo</strong></p>\n</td>\n<td valign=\"top\" width=\"343\">\n<p>Watch out! You will break the vase!</p>\n<p>(Cẩn thận! Bạn sẽ làm vỡ cái bình đấy!)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"321\">\n<p><strong>Dùng để đưa ra một lời đề nghị giúp đỡ </strong></p>\n</td>\n<td valign=\"top\" width=\"343\">\n<p>I’ll carry those boxes for you. They look heavy. (Để mình mang những cái hộp đó giúp bạn. Chúng trông nặng đấy.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"321\">\n<p><strong>Dùng trong câu điều kiện loại 1</strong></p>\n</td>\n<td valign=\"top\" width=\"343\">\n<p>If she studies hard, she will pass the exam. (Nếu cô ấy học chăm, cô ấy sẽ đậu kỳ thi.)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>4. Dấu hiệu nhận biết thì tương lai đơn</strong></p>\n<p><strong>a. Trong câu có chứa trạng từ thời gian: </strong></p>\n<p>• “in” + thời gian: in 5 minutes </p>\n<p>• Next day/week/month/year</p>\n<p>• Tomorrow</p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong> I will call you in five minutes. (Tôi sẽ gọi cho bạn trong 5 phút nữa.)</p>\n<p>            She will move to Hanoi next month. (Cô ấy sẽ chuyển đến Hà Nội vào tháng sau.)</p>\n<p>            They will start the new project tomorrow. (Họ sẽ bắt đầu dự án mới vào ngày mai.)</p>\n<p><strong>b. Trong câu có những động từ chỉ khả năng xảy ra</strong></p>\n<p>• Think/ suppose/ believe/ guess</p>\n<p>• Promise</p>\n<p>• Probably</p>\n<p>• Perhaps </p>\n<p>• Hope, expect</p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong>  We hope he will pass the exam. (Chúng tôi hi vọng anh ấy sẽ vượt qua kỳ thi cuối kỳ.)</p>\n<p>            I expect the weather will be nice tomorrow. (Tôi mong đợi thời tiết sẽ đẹp vào ngày mai.)</p>\n<p>            She promises she will return the book next week. (Cô ấy hứa sẽ trả sách vào tuần sau.)</p>\n<p>            I believe they will get married soon. (Tôi tin rằng họ sẽ sớm kết hôn.)</p>\n<p><strong>5. So sánh giữa thì Tương lai đơn và Tương lai gần</strong></p>\n<p>        Thì tương lai đơn và thì tương lai gần là hai thì rất dễ gây nhầm lẫn cho nhiều người học tiếng Anh. Để phân biệt hai thì này, chúng ta cần lưu ý đến những yếu tố sau: </p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"332\">\n<p style=\"text-align:center;\"><strong>Thì Tương lai đơn</strong></p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p style=\"text-align:center;\"><strong>Thì Tương lai gần</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p>Tương lai đơn được sử dụng để mô tả các hành động tự phát ngay thời điểm nói mà không có căn cứ, cơ sở rõ ràng. </p>\n<p><strong>Công thức: S + will + be + N/Adj</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> I suppose he will be late again. (Tôi cho là anh ấy lại đến trễ nữa.)</p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>Tương lai gần (be going to) được dùng để mô tả những hành động đã được lên kế hoạch và lịch trình trước thời điểm nói, có căn cứ rõ ràng. </p>\n<p><strong>Công thức: S + be + going to + V-inf</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> We are going to have a meeting at 8:00 AM</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>6. Các cấu trúc tương tự nói về tương lai</strong></p>\n<p><strong>a. Cấu trúc: S + look forward to + Ving/ Noun</strong></p>\n<p>• <strong>Cách dùng: </strong>thể hiện một sự mong đợi về một sự kiện trong tương lai. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ</strong>: She looks forward to starting her new job. (Cô ấy rất mong bắt đầu công việc mới.)</p>\n<p>            We look forward to the concert. (Chúng tôi mong chờ buổi hòa nhạc.)</p>\n<p><strong>b. Cấu trúc: S + hope + to V</strong></p>\n<p>• <strong>Cách dùng: </strong>thể hiện mong muốn hoặc hành động của người nói về sự việc sẽ diễn ra trong tương lai. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong>  I hope to for this book to become a bestseller. (Tôi hi vọng cuốn sách này sẽ trở thành sách bán chạy nhất.)</p>\n<p>           I hope to to travel to Japan next year. (Tôi hi vọng sẽ đi Nhật vào năm sau.)</p>\n<p><strong>c. Cấu trúc: Be to + V-inf</strong></p>\n<p>• <strong>Cách dùng: </strong>thể hiện một hành động hoặc một sự kiện cụ thể được lên kế hoạch hoặc sắp đặt để diễn ra trong tương lai. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong>  All students are to submit their reports by Friday. (Tất cả học sinh sẽ phải nộp báo cáo trước thứ Sáu.)</p>\n<p>           The new law is to take effect from July 1<sup>st</sup>. (Luật mới sẽ có hiệu lực từ này 1 tháng 7. </p>\n<p><strong>d. Cấu trúc: Be likely to + V-inf</strong></p>\n<p>• <strong>Cách dùng:</strong> Diễn đạt một sự việc hoặc một điều gì đó có thể xảy ra trong tương lai. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong>  It is likely to rain this evening. (Có khả năng trời sẽ mưa vào tối nay.)</p>\n<p>            They are likely to win the championship. (Họ có thể sẽ giành chức vô địch.)</p>\n<p><strong>e. Cấu trúc: Be sure/ bound/certain to + V-inf</strong></p>\n<p>• <strong>Cách dùng:</strong> diễn đạt một hành động, sự kiện chắc chắn sẽ xảy ra trong tương lai.</p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> She is sure to pass the exam. (Cô ấy chắc chắn sẽ vượt qua kỳ thi.)</p>\n<p>           They are bound to arrive late if they don’t leave now. (Họ chắc chắn sẽ đến trễ nếu không đi ngay bây giờ.)</p>\n<p><strong>II. <em>Might</em> for future possibility</strong></p>\n<p><strong>1. Giới thiệu</strong></p>\n<p>        Trong ngữ pháp tiếng Anh, “<strong>might</strong>” là một động từ khiếm khuyết (modal verb), thường được dùng để diễn đạt khả năng xảy ra của một sự việc. Mặc dù “<strong>might</strong>”cũng có thể dùng cho hiện tại hoặc quá khứ tùy vào ngữ cảnh, trong phần này, chúng ta chỉ tập trung vào cách dùng “<strong>might</strong>” để diễn tả khả năng xảy ra trong tương lai. </p>\n<p>        Việc hiểu và sử dụng đúng “<strong>might</strong>” giúp người học có thể diễn đạt được những tình huống chưa chắc chắn, nói một cách nhẹ nhàng, lịch sự hơn về những việc có thể xảy ra trong tương lai. </p>\n<p><strong>2. Cấu trúc ngữ pháp </strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr>\n<td valign=\"top\" width=\"283\" style=\"background: rgb(197, 224, 179);\">\n<p><strong>Dạng khẳng định</strong></p>\n</td>\n<td valign=\"top\" width=\"381\">\n<p><strong>S + might + V-infinitive</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"283\" style=\"background: rgb(197, 224, 179);\">\n<p><strong>Dạng phủ định</strong></p>\n</td>\n<td valign=\"top\" width=\"381\">\n<p><strong>S + might not + V-infinitive </strong></p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• I might go to the party tonight. (Tôi có thể sẽ đi dự tiệc tối nay.)</p>\n<p>• She might travel to Japan next summer. (Cô ấy có thể sẽ đi Nhật vào mùa hè tới.)</p>\n<p>• They might not finish the project on time. (Họ có thể sẽ không hoàn thành dự án đúng hạn.)</p>\n<p><strong style=\"color: #c00000;\">Lưu ý: </strong></p>\n<p>• <em>“Might” luôn đi với động từ nguyên thể không “to” (bare infinitive).</em></p>\n<p>• <em>Dạng phủ định là “Might not” hoặc “mightn’t” (mightn’t là cách nói trang trọng, phổ biến trong tiếng Anh-Anh hơn là tiếng Anh-Mỹ.)</em></p>\n<p><strong>3. Cách dùng của <em>might</em> để nói về khả năng trong tương lai</strong></p>\n<p><strong>a. Diễn tả sự không chắc chắn </strong></p>\n<p><strong>        “Might” </strong>được dùng khi người nói không chắc chắn 100% điều gì đó sẽ xảy ra. Nó biểu hiện rằng điều đó có khả năng xảy ra, nhưng không chắc chắn. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• It might rain tomorrow. (Trời có thể sẽ mưa vào ngày mai.)</p>\n<p>• He might be come to the meeting. (Anh ấy có thể sẽ đến buổi họp.)</p>\n<p>• We might be late. (Chúng ta có thể sẽ trễ.)</p>\n<p><strong>b. Dự đoán</strong></p>\n<p>        “Might” cũng được dùng để dự đoán các sự việc trong tương lai với mức độ chắc chắn thấp. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• The team might win the championship. (Đội đó có thể thắng giải vô địch.)</p>\n<p>• Prices might increase next month. (Giá cả có thể sẽ tang vào tháng sau.)</p>\n<p><strong>c. Đưa ra gợi ý một cách nhẹ nhàng</strong></p>\n<p>        Trong một số trường hợp, “<strong>might</strong>” còn được dùng để đưa ra lời khuyên hoặc đề xuất một cách nhẹ nhàng, lịch sự. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• You might want to check your work again. (Bạn có thể muốn kiểm tra lại bài của mình.)</p>\n<p>• You might consider studying abroad. (Bạn có thể cân nhắc việc du học.)</p>\n<p><strong>4. So sánh Might, May và Will</strong></p>\n<p>        Ba động từ khiếm khuyết <em>Might, May</em> và <em>Will</em> đều được dùng để nói về khả năng trong tương lai, nhưng mức độ chắc chắn là khác nhau. </p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"189\">\n<p style=\"text-align:center;\"><strong>Modal Verb</strong></p>\n</td>\n<td valign=\"top\" width=\"246\">\n<p style=\"text-align:center;\"><strong>Mức độ chắc chắn</strong></p>\n</td>\n<td valign=\"top\" width=\"230\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"189\">\n<p><strong>Will </strong></p>\n</td>\n<td valign=\"top\" width=\"246\">\n<p>Chắc chắn cao</p>\n</td>\n<td valign=\"top\" width=\"230\">\n<p>She will come tomorrow. (Cô ấy sẽ đến vào ngày mai.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"189\">\n<p><strong>May</strong></p>\n</td>\n<td valign=\"top\" width=\"246\">\n<p>Có thể xảy ra</p>\n</td>\n<td valign=\"top\" width=\"230\">\n<p>He may come. (Anh ấy có thể sẽ đến.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"189\">\n<p><strong>Might</strong></p>\n</td>\n<td valign=\"top\" width=\"246\">\n<p>Khả năng thấp hơn</p>\n</td>\n<td valign=\"top\" width=\"230\">\n<p>It might rain. (Trời có thể sẽ mưa.)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>5. Ví dụ trong các ngữ cảnh thực tế</strong></p>\n<p><strong>a. Hôi thoại hằng ngày</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong></p>\n<p><strong>A</strong>: Are you coming to the picnic? (Bạn có đi picnic không?)</p>\n<p><strong>B</strong>: I’m not sure. I <strong>might come</strong>. (Tôi chưa chắc, có thể tôi sẽ đi.)</p>\n<p>She <strong>might not feel</strong> well tomorrow. (Ngày mai cô ấy có thể sẽ không thấy khỏe.)</p>\n<p><strong>b. Trong văn viết học thuật hoặc trang trọng</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong></p>\n<p>• The results <strong>might indicate</strong> a change in behavior. (Kết quả có thể cho thấy sự thay đổi hành vi.)</p>\n<p>• There <strong>might be</strong> delays due to bad weather. (Có thể sẽ có sự chậm trễ do thời tiết xấu.)</p>\n<p><strong>6. Dạng phủ định: Might not / Mightn’t</strong></p>\n<p>Dạng phủ định dùng để diễn tả điều khó có thể xảy ra trong tương lai. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• We might not have time to visit the museum. (Chúng ta có thể sẽ không có thời gian đi tham quan bảo tàng.)</p>\n<p>• She mightn’t join the contest. (Cô ấy có thể sẽ không tham gia cuộc thi.)</p>\n<p><strong style=\"color: #c00000;\">*Lưu ý:</strong> “<strong><em>Mightn’t</em></strong><em>” là cách nói trang trọng, thường gặp trong tiếng Anh-Anh hơn là tiếng Anh-Mỹ. </em></p>",
                "readingPassage": "In the future, I will live in a modern smart house on the moon. It will have solar energy panels. There might be some robot helpers to clean the floors, cook meals, and wash clothes. My house will be very eco-friendly.",
                "readingPassageTitle": "My Future House",
                "videos": [
                    {
                        "id": "2JiUD3RMmcA",
                        "title": "Tiếng Anh 6 Unit 10: Từ vựng trang 71 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "oAARyuEiP_s",
                        "title": "Tiếng Anh 6 Unit 10: Getting started trang 38, 39 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "BbAV1-agyss",
                        "title": "Tiếng Anh 6 Unit 10: A closer look 1 trang 40 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "ZeYrVCVztsE",
                        "title": "Tiếng Anh 6 Unit 10: A closer look 2 trang 41, 42 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "n-Dl33K6cug",
                        "title": "Tiếng Anh 6 Unit 10: Communication trang 43 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "xIv0CEQOjzg",
                        "title": "Tiếng Anh 6 Unit 10: Skills 1 trang 44 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "bLOuNNdzjGQ",
                        "title": "Tiếng Anh 6 Unit 10: Skills 2 trang 45 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "j1ISy_tHBE8",
                        "title": "Tiếng Anh 6 Unit 10: Looking back trang 46 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "pHeLoRdh9do",
                        "title": "Tiếng Anh 6 Unit 10: Project trang 47 Global Success - Cô Thanh Hoa (DỄ HIỂU NHẤT)"
                    }
                ],
                "questions": {
                    "reading": [
                        {
                            "question": "What is the main topic of the passage?",
                            "options": [
                                "Unit 10: Our Houses in the Future",
                                "Playing sports",
                                "Travelling around the world"
                            ],
                            "answer": "Unit 10: Our Houses in the Future"
                        },
                        {
                            "question": "Which word is mentioned in the reading passage?",
                            "options": [
                                "appliance",
                                "helicopter",
                                "spaceship"
                            ],
                            "answer": "appliance"
                        },
                        {
                            "question": "How does the writer feel about the topic?",
                            "options": [
                                "Excited and happy",
                                "Bored and tired",
                                "Sad"
                            ],
                            "answer": "Excited and happy"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t11",
                "title": "Unit 11: Our Greener World",
                "subtitle": "Bảo vệ môi trường và câu điều kiện loại 1",
                "vocab": [
                    {
                        "word": "be in need",
                        "translation": "cần",
                        "phonetics": "/biː in niːd/",
                        "type": "verb",
                        "sentence": "We want to be in need together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau cần vào cuối tuần này."
                    },
                    {
                        "word": "charity",
                        "translation": "từ thiện",
                        "phonetics": "/ˈtʃær.ə.ti/",
                        "type": "noun",
                        "sentence": "I can see a beautiful charity in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người từ thiện tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "container",
                        "translation": "đồ đựng",
                        "phonetics": "/kənˈteɪ.nər/",
                        "type": "noun",
                        "sentence": "I can see a beautiful container in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người đồ đựng tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "do a survey",
                        "translation": "thực hiện khảo sát",
                        "phonetics": "/du: ə ˈsɜː.veɪ/",
                        "type": "verb",
                        "sentence": "We want to do a survey together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau thực hiện khảo sát vào cuối tuần này."
                    },
                    {
                        "word": "environment",
                        "translation": "môi trường",
                        "phonetics": "/ɪnˈvaɪ.rən.mənt/",
                        "type": "noun",
                        "sentence": "We should protect the environment by planting more trees.",
                        "sentenceTranslation": "Chúng ta nên bảo vệ môi trường bằng cách trồng thêm nhiều cây xanh."
                    },
                    {
                        "word": "exchange",
                        "translation": "trao đổi",
                        "phonetics": "/ɪksˈtʃeɪndʒ/",
                        "type": "verb",
                        "sentence": "We want to exchange together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau trao đổi vào cuối tuần này."
                    },
                    {
                        "word": "fair",
                        "translation": "hội chợ",
                        "phonetics": "/feər/",
                        "type": "noun",
                        "sentence": "I can see a beautiful fair in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người hội chợ tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "go green",
                        "translation": "sống xanh (thân thiện môi trường)",
                        "phonetics": "/ɡəʊ ɡriːn/",
                        "type": "noun",
                        "sentence": "I can see a beautiful go green in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người sống xanh (thân thiện môi trường) tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "instead of",
                        "translation": "thay cho",
                        "phonetics": "/ɪnˈsted ˌəv/",
                        "type": "preposition",
                        "sentence": "I can see a beautiful instead of in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người thay cho tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "pick up",
                        "translation": "nhặt (rác), đón",
                        "phonetics": "/pɪk ʌp/",
                        "type": "verb",
                        "sentence": "We want to pick up together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau nhặt (rác), đón vào cuối tuần này."
                    },
                    {
                        "word": "president",
                        "translation": "chủ tịch",
                        "phonetics": "/ˈprez.ɪ.dənt/",
                        "type": "noun",
                        "sentence": "I can see a beautiful president in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người chủ tịch tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "recycle",
                        "translation": "tái chế",
                        "phonetics": "/ˌriːˈsaɪ.kəl/",
                        "type": "verb",
                        "sentence": "Please recycle plastic bottles to reduce waste.",
                        "sentenceTranslation": "Hãy tái chế những chai nhựa để giảm thiểu lượng rác thải."
                    },
                    {
                        "word": "recycling bin",
                        "translation": "thùng đựng rác tái chế",
                        "phonetics": "/ˌriːˈsaɪ.klɪŋ bin/",
                        "type": "noun",
                        "sentence": "I can see a beautiful recycling bin in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người thùng đựng rác tái chế tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "reduce",
                        "translation": "giảm",
                        "phonetics": "/rɪˈdʒuːs/",
                        "type": "verb",
                        "sentence": "Try to reduce the amount of electricity you use.",
                        "sentenceTranslation": "Hãy cố gắng cắt giảm lượng điện năng mà con sử dụng."
                    },
                    {
                        "word": "reuse",
                        "translation": "tái sử dụng",
                        "phonetics": "/ˌriːˈjuːz/",
                        "type": "verb",
                        "sentence": "We can reuse empty bottles as flower vases.",
                        "sentenceTranslation": "Chúng ta có thể tái sử dụng những chiếc chai rỗng để làm bình cắm hoa."
                    },
                    {
                        "word": "reusable",
                        "translation": "có thể dùng lại được",
                        "phonetics": "/ˌriːˈjuː.zə.bəl/",
                        "type": "adjective",
                        "sentence": "We want to reusable together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau có thể dùng lại được vào cuối tuần này."
                    },
                    {
                        "word": "rubbish",
                        "translation": "rác",
                        "phonetics": "/ˈrʌb.ɪʃ/",
                        "type": "noun",
                        "sentence": "I can see a beautiful rubbish in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người rác tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "tip",
                        "translation": "mẹo, cách",
                        "phonetics": "/tɪp/",
                        "type": "noun",
                        "sentence": "I can see a beautiful tip in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người mẹo, cách tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "wrap",
                        "translation": "gói, bọc",
                        "phonetics": "/ræp/",
                        "type": "verb",
                        "sentence": "We want to wrap together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau gói, bọc vào cuối tuần này."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "If we recycle paper, we will save trees.",
                        "vietnamese": "Nếu chúng ta tái chế giấy, chúng ta sẽ cứu được nhiều cây xanh."
                    },
                    {
                        "english": "We should reduce the use of plastic bags.",
                        "vietnamese": "Chúng ta nên cắt giảm sử dụng túi nilon."
                    }
                ],
                "grammar": "<p><strong>A. GRAMMAR </strong></p>\n<p><strong>I. Articles (Mạo từ)</strong></p>\n<p><strong>1. Mạo từ là gì?</strong></p>\n<p><strong>        Mạo từ (Articles)</strong> là một loại từ đứng trước danh từ và cho biết danh từ ấy đang nhắc tới một đối tượng xác định hay là đối tượng không xác định. Mạo từ không phải là một loại từ riêng biệt bởi người ta thường xem nó như một bộ phận của tính từ và được sử dụng để bổ nghĩa cho danh từ chỉ đơn vị. </p>\n<p>        Chúng ta có thể sử dụng mạo từ “<strong>the</strong>” khi danh từ đó đang chỉ đối tượng hoặc sự vật nào đó mà cả người nói và người nghe đều hiểu. Còn khi nói về một đối tượng chung hoặc chưa xác định thì người ta sẽ dùng mạo từ bất định là “<strong>a</strong>” hoặc “<strong>an</strong>”. Hai mạo từ “<strong>a</strong>” và “<strong>an</strong>” thường được dùng với những danh từ thỏa mãn tiêu chí như: </p>\n<p>• Đếm được</p>\n<p>• Số ít</p>\n<p>• Chỉ sự vật</p>\n<p>• Chưa xác định rõ, sự vật chung chung</p>\n<p><strong>2. Phân biệt cách sử dụng mạo từ “A, An” và “The”</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"332\">\n<p style=\"text-align:center;\"><strong>A / An</strong></p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p style=\"text-align:center;\"><strong>The</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p>• Đối tượng này được nhắc đến lần đầu tiên trong bài.</p>\n<p>• Nhắc đến một đối tượng chung chung, chưa xác định được.</p>\n<p>• A / An chỉ sử dụng cho danh từ đếm được. </p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>• Đối tượng này đã được đề cập đến trước đó trong bài.</p>\n<p>• Nhắc đến một đối tượng cụ thể, đã xác định được.</p>\n<p>• The có thể sử dụng đối với danh từ đếm được và danh từ không đếm được.</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> She saw a man standing outside. (Cô ấy trông thấy một người đàn ôn đứng ở bên ngoài.)</p>\n<p>→ Người nghe không biết người đàn ông đó là ai. Đây là một đối tượng chưa xác định. </p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> I saw a dog in the park. The dog was barking loudly. (Tôi trông thấy một con chó ở trong công viên. Con chó đó sủa ầm ĩ lên.)</p>\n<p>→ “A dog” là lần đầu tiên được nhắc đến. Sau đó, khi người nói đề cập lại, dùng “the dog” để nói về chính con chó đó. Lúc này, cả người nghe và người nói đều xác định được đối tượng là con chó rồi. </p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>3. Cách dùng mạo từ xác định “The”</strong></p>\n<p>        “<strong>The</strong>” được dùng trước các danh từ nói chung nhằm chỉ đối tượng mà người nói cho rằng người nghe đã biết đến. Các đối tượng này đã được xác định cụ thể về đặc điểm, tính chất hay được đề cập đến trước đó. </p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"332\">\n<p style=\"text-align:center;\"><strong>Cách dùng</strong></p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p><strong>Dùng “the” trước danh từ được cho là duy nhất. </strong></p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>• The sun (mặt trời)</p>\n<p>• The sea (biển cả)</p>\n<p>• The world (thế giới)</p>\n<p>• The moon (mặt trăng)</p>\n<p>• The sun rises in the east and sets in the west. (Mặt trời mọc ở phía đông và lặn ở phía tây.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p><strong>Dùng mạo từ “The” trước danh từ mà người nói đã đề cập đến trước đó. </strong></p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>She bought a book at the bookstore. The book is about ancient history. </p>\n<p>→ “A book” là lần đầu nhắc đến, “the book” nói lại cuốn sách đó. </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p><strong>Dùng “The” đứng trước so sánh cực cấp. The + first (thứ nhất), second (thứ nhì), only (duy nhất) … khi các từ tiếng Anh này được dùng như tính từ / đại từ. </strong></p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>• The first floor (Tầng đầu tiên)</p>\n<p>• The only case (Trường hợp duy nhất)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p><strong>Dùng mạo từ “the” trước tính từ nhằm chỉ một nhóm đối tượng mang đặc điểm của tính từ đó. </strong></p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>• The poor (người nghèo)</p>\n<p>• The old (người già)</p>\n<p>• The rich (người giàu)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p><strong>Dùng “the” với hình thứ so sánh nhất.</strong></p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>• That was the most exciting movie I’ve ever seen. </p>\n<p>• Mount Everest is the highest mountain in the world. </p>\n<p>• She is the best singer in our school.</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p><strong>Dùng mạo từ “the” trước các nhạc cụ âm nhạc nói chung.</strong></p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>• The piano</p>\n<p>• The guitar</p>\n<p>• The trumpet</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p><strong>Dùng mạo từ “the” trước các (cụm) danh từ riêng ở dạng có số nhiều hoặc trong thành phần có các danh từ chung. </strong></p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>• The Republic of Korea</p>\n<p>• The United Kingdom</p>\n<p>• The United States</p>\n<p>• The Russian Federation</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p><strong>Dùng mạo từ “the” trong tên các tờ báo.</strong></p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>• The Times </p>\n<p>• The Washington Post</p>\n<p>• The New York Times </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p><strong>Dùng mạo từ “the” trước họ trong tên riêng để chỉ một gia đình, dòng họ.</strong></p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>• The Smiths </p>\n<p>• The Jacksons</p>\n<p>• The Obamas</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"332\">\n<p><strong>Dùng mạo từ “the” với các địa điểm công cộng. </strong></p>\n</td>\n<td valign=\"top\" width=\"332\">\n<p>• The library</p>\n<p>• The mall</p>\n<p>• The park</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>4. Cách dùng mạo từ xác định “A/ An”</strong></p>\n<p>        “<strong>A</strong>” và “<strong>an</strong>” là hai mạo từ bất định được dùng trước danh từ đếm được số ít khi người nói muốn đề cấp đến một sự vật hoặc đối tượng chưa được xác định rõ ràng, hoặc đây là lần đầu tiên đối tượng đó được nhắc đến trong cuộc trò chuyện. Do vây, người nghe hoặc người đọc thường chưa biết chính xác đối tượng đó là gì. </p>\n<p>• Mạo từ “<strong>An</strong>” được sử dụng khi từ đứng ngay sau bắt đầu bằng một nguyên âm “<strong>u, e, o, a, i</strong>” hoặc phát âm bắt đầu bằng nguyên âm. </p>\n<p>• Mạo từ “A” được dùng khi từ theo sau bắt đầu bằng phụ âm hoặc phát âm bắt đầu bằng âm phụ âm. </p>\n<p><strong>a. Mạo từ “A”: </strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"302\">\n<p style=\"text-align:center;\"><strong>Cách dùng</strong></p>\n</td>\n<td valign=\"top\" width=\"362\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"302\">\n<p><strong>A + danh từ bắt đầu bằng “uni” và “eu”</strong></p>\n</td>\n<td valign=\"top\" width=\"362\">\n<p>Từ “university”, mặc dù được bắt đầu bằng ký tự chữ viết nguyên âm “u”, tuy nhiên xét về phiên âm lại bắt đầu bằng phụ âm “j”, do vậy từ này sẽ kilđi với “a”.</p>\n<p>A union (tổ chức), A university (trường đại học), A eulogy (lời ca ngợi) …</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"302\">\n<p><strong>A + đơn vị phân số </strong></p>\n</td>\n<td valign=\"top\" width=\"362\">\n<p>I’ll be there in a half hour</p>\n<p>He drank a third of the bottle. </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"302\">\n<p><strong>A +half / half ghép với N khác</strong></p>\n</td>\n<td valign=\"top\" width=\"362\">\n<p>My mom bought a half kilo of bananas. (Mẹ tôi mua nửa cân chuối.)</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"302\">\n<p><strong>A dùng trong thành ngữ tiếng Anh chỉ số lượng nhất định “a lot of/ a couple / a dozen</strong></p>\n</td>\n<td valign=\"top\" width=\"362\">\n<p>We need a couple of chairs for the meeting.</p>\n<p>She gave me a lot of advice.</p>\n<p>They ordered a dozen cupcakes for the party.</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"302\">\n<p><strong>A + số đếm nhất định (hàng ngàn, hàng trăm)</strong></p>\n</td>\n<td valign=\"top\" width=\"362\">\n<p>They planted a thousand trees in the forest.</p>\n<p>He ran a thousand meters without stopping.</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>b. Mạo từ “An”</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"302\">\n<p style=\"text-align:center;\"><strong>Cách dùng</strong></p>\n</td>\n<td valign=\"top\" width=\"362\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"302\">\n<p><strong>An + nguyên âm “a, e, i, o”</strong></p>\n<p><strong>An + từ bắt đầu bằng u</strong></p>\n<p><strong>An + từ bắt đầu bằng h câm</strong></p>\n</td>\n<td valign=\"top\" width=\"362\">\n<p>An apple, an orange, an egg</p>\n<p>An umbrella (một cái ô)</p>\n<p>An hour (một tiếng)</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>5. Những trường hợp không sử dụng mạo từ “A / An / The”</strong></p>\n<p><strong>a. Không dùng trước các danh từ không đếm được hoặc danh từ số nhiều.</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• <strong>Đúng:</strong> Dog are covered with soft fur.</p>\n<p>• <strong>Sai:</strong> A dogs are covered with soft fur. </p>\n<p><strong>b. Không dùng trước danh từ chỉ các bữa ăn, trừ khi có tính từ đứng trước các tên gọi đó. </strong></p>\n<p>• <strong>Đúng:</strong> We usually have breakfast at 7 a.m.</p>\n<p>• <strong>Sai:</strong> We usually have a breakfast at 7 a.m.</p>\n<p><strong>c. Không dùng trước đại từ sở hữu hoặc tính từ</strong></p>\n<p>• <strong>Đúng: </strong>That is my car</p>\n<p>• <strong>Sai:</strong> That is a my car. </p>\n<p><strong>d. Không dùng trước tên một ngôn ngữ (English, France, Korean, …)</strong></p>\n<p>• <strong>Đúng:</strong> I have learned English for 5 years. </p>\n<p>• <strong>Sai:</strong> I have learned the English for 5 years. </p>\n<p><strong>e. Không dùng trước tên một quốc gia, tiểu bang, quần đảo hay hành tinh. </strong></p>\n<p>• <strong>Đúng:</strong> She traveled to Japan last summer. </p>\n<p>• <strong>Sai:</strong> She traveled to the Japan last summer. </p>\n<p><strong style=\"color: #c00000;\"><em>Lưu ý:</em></strong> <em>Đối với một quốc gia được tạo thành từ các tiểu bang như Hoa Kỳ, ta có thể dùng “the” phía trước, điển hình như The United States. </em></p>\n<p><strong>f. Không dùng trước tước hiệu</strong></p>\n<p>• <strong>Đúng:</strong> President Donald Trump</p>\n<p>• <strong>Sai:</strong> The President Joe Biden. </p>\n<p><strong>6. Những lỗi sai thường gặp khi sử dụng mạo từ</strong></p>\n<p><strong>a. Nhầm lẫn cách dùng giữa mạo từ “A” và “An”</strong></p>\n<p>        Dù mạo từ <strong>A</strong> và <strong>An</strong> đều được sử dụng cho danh từ đếm được số ít, “<strong>A</strong>” sẽ được dùng cho các danh từ bắt đầu bằng phụ âm còn “<strong>An</strong>” sẽ được dùng cho các danh từ bắt đầu bằng nguyên âm. Vì thế, hãy lưu ý phân biệt cách dùng dựa trên cách phát âm của các danh từ, thay vì chú ý đến chữ cái đầu tiên của danh từ đó. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• Từ “umbrella” được phát âm là /ʌmˈbrel.ə/. Âm /ʌ/ được xem là một nguyên âm. Vì thế, bạn cần đặt mạo từ “An” trước danh từ - An umbrella”, không phải là “a umbrella”. </p>\n<p>• Từ “university” được phát âm là /ˌjuː.nɪˈvɜː.sə.ti/. Âm /j/ được xem là một phụ âm.  Vì thế, bạn cần đặt mạo từ “A” trước danh từ - “A university”.</p>\n<p><strong>b. Không thêm mạo từ đối với những danh từ đi kèm tính từ</strong></p>\n<p>        Trong Tiếng Anh, chúng ta sẽ thường dùng các cụm danh từ được tạo thành bởi <strong>tính từ + danh từ</strong> để giúp câu văn đa dạng hơn về ngữ pháp. Tuy nhiên, khi cụm danh từ quá dài và phức tạp, các bạn thường có xu hướng quên thêm mạo từ khi cần thiết. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• They bought a luxurious apartment with a stunning view.</p>\n<p>• She visited a remote village with a rich cultural heritage. </p>\n<p>• He dreams of living in a peaceful town with friendly people </p>\n<p><strong>c. Không dùng mạo từ “The” trước các địa điểm công cộng</strong></p>\n<p>        Đối với các địa điểm công cộng quen thuộc với mọi người, cần lưu ý sử dụng mạo từ “The” trong mọi trường hợp. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• I bought a bar of soap in the supermarket.</p>\n<p>• The library is open every day. </p>\n<p><strong>d. Sử dụng mạo từ “The” trong những câu nhận xét chung</strong></p>\n<p>        Khi muốn nhận xét một cách chung chung về toàn bộ một loại sự vật (không chỉ một phần cụ thể), ta không dùng “<strong>the</strong>”. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• Books can open your mind. (Nói chung về sách, không phải những cuốn sách cụ thể nào đó.)</p>\n<p>• Cats are independent animals. (Đề cập đến loài mèo nói chung.)</p>\n<p><strong>II. First conditional (Câu điều kiện loại 1)</strong></p>\n<p><strong>1. Câu điều kiện loại 1 là gì?</strong></p>\n<p><strong>        Câu điều kiện loại 1 (First conditional)</strong> được dùng để dự đoán những hành động, sự việc, tình huống có thể xảy ra trong tương lai khi đã có một điều kiện nhất định xảy ra trước. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• If it rains tomorrow, we will stay at home. (Nếu ngày mai trời mưa, chúng tôi sẽ ở nhà.)</p>\n<p>• If you study hard, you will pass the exam. (Nếu bạn học chăm chỉ, bạn sẽ vượt qua kỳ thi.)</p>\n<p>• If she calls me, I will answer. (Nếu cô ấy gọi cho tôi, tôi sẽ nghe máy.)</p>\n<p><strong>2. Công thức câu điều kiện loại 1</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"198\">\n<p style=\"text-align:center;\"><strong> </strong></p>\n</td>\n<td valign=\"top\" width=\"236\">\n<p style=\"text-align:center;\"><strong>Mệnh đề If</strong></p>\n</td>\n<td valign=\"top\" width=\"230\">\n<p style=\"text-align:center;\"><strong>Mệnh đề chính</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p style=\"text-align:center;\"><strong>Cấu trúc</strong></p>\n</td>\n<td valign=\"top\" width=\"236\">\n<p>If + S + V(s/es)</p>\n</td>\n<td valign=\"top\" width=\"230\">\n<p>S + will / won’t + Vo</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p style=\"text-align:center;\"><strong>Nhóm thì</strong></p>\n</td>\n<td valign=\"top\" width=\"236\">\n<p>Thì hiện tại đơn</p>\n</td>\n<td valign=\"top\" width=\"230\">\n<p>Thì tương lai đơn</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n<td colspan=\"2\" valign=\"top\" width=\"466\">\n<p>If I get a role in the film, I will be famous. </p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong style=\"color: #c00000;\">Lưu ý: </strong></p>\n<p>• Ở mệnh đề chính, với những trường hợp đặc biệt “<strong>will</strong>” có thể được chuyển đổi thành các động từ khiếm khuyết khác như “<strong>must</strong>”, “<strong>should</strong>”, “<strong>have to</strong>”, “<strong>ought to</strong>”, “<strong>can</strong>”, “<strong>may</strong>”. </p>\n<p>• Khi mệnh đề “<strong>if</strong>” đứng trước mệnh đề chính, chúng ta cần dùng dấu phẩy ngăn cách 2 mệnh đề. Tuy nhiên, nếu mệnh đề chính đứng trước mệnh đề “<strong>if</strong>”, chúng ta không cần dùng dấu phẩy. </p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong>If it gets cold tonight, we will light the fireplace. </p>\n<p>           We will light the fireplace if it gets cold tonight.</p>\n<p><strong>3. Công thức câu điều kiện loại 1 dạng phủ định</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"198\">\n<p style=\"text-align:center;\"> </p>\n</td>\n<td valign=\"top\" width=\"236\">\n<p style=\"text-align:center;\"><strong>Mệnh đề If not</strong></p>\n</td>\n<td valign=\"top\" width=\"230\">\n<p style=\"text-align:center;\"><strong>Mệnh đề chính</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p style=\"text-align:center;\"><strong>Cấu trúc</strong></p>\n</td>\n<td valign=\"top\" width=\"236\">\n<p>If + S + not (tobe not /don’t/doesn’t) + Vo</p>\n</td>\n<td valign=\"top\" width=\"230\">\n<p>S + will/won’t + V</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p style=\"text-align:center;\"><strong>Nhóm thì</strong></p>\n</td>\n<td valign=\"top\" width=\"236\">\n<p>Thì hiện tại đơn</p>\n</td>\n<td valign=\"top\" width=\"230\">\n<p>Thì tương lai đơn</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n<td colspan=\"2\" valign=\"top\" width=\"466\">\n<p>If I don’t have enough money, I won’t buy a new Iphone.</p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong style=\"color: #c00000;\">Lưu ý<em>: </em></strong><em>Có thể thay thế “<strong>If not</strong>” thành “<strong>Unless</strong>”</em></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> If you don’t hurry, you will miss the bus. → Unless you hurry, you will miss the bus. (Nếu bạn không nhanh lên, bạn sẽ lỡ chuyến xe buýt.)</p>\n<p><strong>4. Công thức đảo ngữ câu điều kiện loại 1</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"198\">\n<p style=\"text-align:center;\"> </p>\n</td>\n<td valign=\"top\" width=\"236\">\n<p style=\"text-align:center;\"><strong>Mệnh đề điều kiện đảo ngữ</strong></p>\n</td>\n<td valign=\"top\" width=\"230\">\n<p style=\"text-align:center;\"><strong>Mệnh đề chính</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p style=\"text-align:center;\"><strong>Cấu trúc</strong></p>\n</td>\n<td valign=\"top\" width=\"236\">\n<p>Should + S + (not) + Vo</p>\n</td>\n<td valign=\"top\" width=\"230\">\n<p>S + will/won’t + Vo</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p style=\"text-align:center;\"><strong>Nhóm thì</strong></p>\n</td>\n<td valign=\"top\" width=\"236\">\n<p>Thì hiện tại đơn</p>\n</td>\n<td valign=\"top\" width=\"230\">\n<p>Thì tương lai đơn</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"198\">\n<p style=\"text-align:center;\"><strong>Ví dụ</strong></p>\n</td>\n<td colspan=\"2\" valign=\"top\" width=\"466\">\n<p>If she doesn’t arrive on time, we will leave without her.</p>\n<p>→ Should she not arrive on time, we will leave without her. </p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong style=\"color: #c00000;\"><em>Lưu ý:</em></strong> <em>“<strong>Should</strong>” được dùng trong đảo ngữ câu điều kiện loại 1 không mang nghĩa là “nên” mà vẫn giữ nguyên ý nghĩa vốn có của mệnh đề “if”. </em></p>\n<p><strong>5. Các trường hợp sử dụng câu điều kiện loại 1</strong></p>\n<p><strong>• Dùng để chỉ về các sự việc, hành động có thể xảy ra ở cả hiện tại hoặc tương lai</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> If it doesn’t rain this afternoon, we will go for a walk. (Nếu chiều nay trời không mưa, chúng ta sẽ đi dạo.)</p>\n<p><strong>• Dùng với mục đích gợi ý hoặc đề nghị</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> If you bring your laptop, I’ll help you with your assignment. (Nếu bạn mang máy tính xách tay theo, tôi sẽ giúp bạn làm bài tập.)</p>\n<p><strong>• Dùng trong trường hợp muốn cảnh báo hoặc đe dọa</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong> If you don’t wear your seatbelt, you’ll get a fine. (Nếu bạn không thắt dây an toàn, bạn sẽ bị phạt.)</p>",
                "readingPassage": "Our environment is in danger because of rubbish. We must act to make the world greener. If we reduce plastic use and reuse bags, we will make our city cleaner. Recycling paper is also a good way to protect forests.",
                "readingPassageTitle": "Save the Planet",
                "videos": [
                    {
                        "id": "pg-i2GC89WE",
                        "title": "Tiếng Anh 6 Unit 11: Từ vựng trang 71 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "FC5ZXAq5c60",
                        "title": "Tiếng Anh 6 Unit 11: Getting started trang 48, 49 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "U9qN5sicXj0",
                        "title": "Tiếng Anh 6 Unit 11: A closer look 1 trang 50, 51 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "kwxWY948jNw",
                        "title": "Tiếng Anh 6 Unit 11: A closer look 2 trang 51, 52 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "RonXI-CEhas",
                        "title": "Tiếng Anh 6 Unit 11: Communication trang 53 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "rKT9JOwNBnE",
                        "title": "Tiếng Anh 6 Unit 11:  Skills 1 trang 54 Global Success (DỄ HIỂU NHẤT)"
                    }
                ],
                "questions": {
                    "reading": [
                        {
                            "question": "What is the main topic of the passage?",
                            "options": [
                                "Unit 11: Our Greener World",
                                "Playing sports",
                                "Travelling around the world"
                            ],
                            "answer": "Unit 11: Our Greener World"
                        },
                        {
                            "question": "Which word is mentioned in the reading passage?",
                            "options": [
                                "be in need",
                                "helicopter",
                                "spaceship"
                            ],
                            "answer": "be in need"
                        },
                        {
                            "question": "How does the writer feel about the topic?",
                            "options": [
                                "Excited and happy",
                                "Bored and tired",
                                "Sad"
                            ],
                            "answer": "Excited and happy"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t12",
                "title": "Unit 12: Robots",
                "subtitle": "Người máy robot và cấu trúc động từ chỉ khả năng",
                "vocab": [
                    {
                        "word": "age",
                        "translation": "độ tuổi",
                        "phonetics": "/eɪdʒ/",
                        "type": "noun",
                        "sentence": "I can see a beautiful age in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người độ tuổi tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "broken",
                        "translation": "bị hỏng, bị vỡ",
                        "phonetics": "/ˈbrəʊ.kən/",
                        "type": "adjective",
                        "sentence": "We want to broken together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau bị hỏng, bị vỡ vào cuối tuần này."
                    },
                    {
                        "word": "choice",
                        "translation": "sự lựa chọn",
                        "phonetics": "/tʃɔɪs/",
                        "type": "noun",
                        "sentence": "I can see a beautiful choice in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người sự lựa chọn tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "do the dishes",
                        "translation": "rửa bát, đĩa",
                        "phonetics": "/du ðə dɪʃes/",
                        "type": "verb",
                        "sentence": "We want to do the dishes together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau rửa bát, đĩa vào cuối tuần này."
                    },
                    {
                        "word": "do the washing",
                        "translation": "giặt giũ quần áo",
                        "phonetics": "/du ðə ˈwɒʃ.ɪŋ/",
                        "type": "verb",
                        "sentence": "We want to do the washing together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau giặt giũ quần áo vào cuối tuần này."
                    },
                    {
                        "word": "feelings",
                        "translation": "cảm xúc, tình cảm",
                        "phonetics": "/ˈfiː.lɪŋz/",
                        "type": "noun",
                        "sentence": "I can see a beautiful feelings in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người cảm xúc, tình cảm tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "guard",
                        "translation": "bảo vệ, người canh gác",
                        "phonetics": "/ɡɑːd/",
                        "type": "v, n",
                        "sentence": "I can see a beautiful guard in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người bảo vệ, người canh gác tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "height",
                        "translation": "chiều cao",
                        "phonetics": "/haɪt/",
                        "type": "noun",
                        "sentence": "I can see a beautiful height in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người chiều cao tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "iron",
                        "translation": "là, ủi (quần áo)",
                        "phonetics": "/aɪrn/",
                        "type": "verb",
                        "sentence": "We want to iron together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau là, ủi (quần áo) vào cuối tuần này."
                    },
                    {
                        "word": "pick",
                        "translation": "hái, thu hoạch (hoa, quả,…)",
                        "phonetics": "/pɪk/",
                        "type": "verb",
                        "sentence": "We want to pick together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau hái, thu hoạch (hoa, quả,…) vào cuối tuần này."
                    },
                    {
                        "word": "planet",
                        "translation": "hành tinh",
                        "phonetics": "/ˈplæn.ɪt/",
                        "type": "noun",
                        "sentence": "I can see a beautiful planet in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người hành tinh tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "price",
                        "translation": "giá, số tiền mua hoặc bán",
                        "phonetics": "/praɪs/",
                        "type": "noun",
                        "sentence": "I can see a beautiful price in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người giá, số tiền mua hoặc bán tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "put away",
                        "translation": "cất, dọn",
                        "phonetics": "/put əˈweɪ/",
                        "type": "verb",
                        "sentence": "We want to put away together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau cất, dọn vào cuối tuần này."
                    },
                    {
                        "word": "repair",
                        "translation": "sửa chữa",
                        "phonetics": "/rɪˈpeər/",
                        "type": "verb",
                        "sentence": "We want to repair together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau sửa chữa vào cuối tuần này."
                    },
                    {
                        "word": "robot",
                        "translation": "người máy",
                        "phonetics": "/ˈrəʊ.bɒt/",
                        "type": "noun",
                        "sentence": "Robots will help humans clean the house.",
                        "sentenceTranslation": "Robot sẽ giúp con người dọn dẹp nhà cửa."
                    },
                    {
                        "word": "space station",
                        "translation": "trạm vũ trụ",
                        "phonetics": "/ˈspeɪs ˌsteɪ.ʃən/",
                        "type": "noun",
                        "sentence": "I can see a beautiful space station in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người trạm vũ trụ tuyệt đẹp trong bức tranh này."
                    },
                    {
                        "word": "useful",
                        "translation": "hữu ích",
                        "phonetics": "/ˈjuːs.fəl/",
                        "type": "adjective",
                        "sentence": "We want to useful together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau hữu ích vào cuối tuần này."
                    },
                    {
                        "word": "water",
                        "translation": "tưới nước",
                        "phonetics": "/ˈwɔː.tər/",
                        "type": "verb",
                        "sentence": "We want to water together this weekend.",
                        "sentenceTranslation": "Chúng tớ muốn cùng nhau tưới nước vào cuối tuần này."
                    },
                    {
                        "word": "weight",
                        "translation": "trọng lượng",
                        "phonetics": "/weɪt/",
                        "type": "noun",
                        "sentence": "I can see a beautiful weight in this picture.",
                        "sentenceTranslation": "Tớ có thể nhìn thấy một chiếc/người trọng lượng tuyệt đẹp trong bức tranh này."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What can the robot do? - It can wash dishes and cook meals.",
                        "vietnamese": "Robot có thể làm gì? - Nó có thể rửa bát đĩa và nấu ăn."
                    },
                    {
                        "english": "Will robots be able to talk to humans? - Yes, they will.",
                        "vietnamese": "Liệu robot có thể nói chuyện được với con người không? - Có, chúng có thể."
                    }
                ],
                "grammar": "<p><strong>A. GRAMMAR</strong></p>\n<p><strong>I. Superlatives of adjectives (So sánh hơn nhất)</strong></p>\n<p><strong>1. So sánh hơn nhất trong tiếng Anh là gì?</strong></p>\n<p><strong>        So sánh nhất trong tiếng Anh</strong> được gọi là Superlative, là cấu trúc được sử dụng khi so sánh giữa nhiều vật hoặc hiện tượng nào đó. Trong đó, một sự vật hoặc hiện tượng có tính chất nổi bật nhất trong những sự vật, hiện tượng còn lại. Nhóm đối tượng trong so sánh nhất phải có ít nhất 3 đối tượng trở lên.</p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• Mount Everest is the highest mountain in the world. (Everest là ngọn núi cao nhất thế giới.) </p>\n<p>• This is the most interesting book I have ever read. (Đây là cuốn sách thú vị nhất mà tôi từng đọc.)</p>\n<p>• She is kindest person in our class. (Cô ấy là người tốt bụng nhất trong lớp chúng tôi.)</p>\n<p><strong>2. Cấu trúc so sánh nhất với tính từ</strong></p>\n<p><strong>a. Với tính từ ngắn </strong></p>\n<p style=\"text-align:center;\"><strong style=\"background:yellow;\">S+ be + the + adj-est</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• Mai is the most beautiful girl in this class. (Mai là cô gái xinh đẹp nhất lớp.)</p>\n<p>• Nhung is the shortest of the three sisters. (Nhung là người thấp nhất trong ba chị em.)</p>\n<p><strong style=\"color: #c00000;\">Lưu ý:</strong> <em>Trong so sánh nhất, hai giới từ “in” và “of” thường hay được sử dụng. Chúng ta dùng “of” khi chỉ về số lượng, dùng “in” khi chỉ về nơi chốn. </em></p>\n<p><strong>b. Với tính từ dài</strong></p>\n<p style=\"text-align:center;\"><strong style=\"background:yellow;\">S + be + the + most + adj …</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ: </strong></p>\n<p>• The lion is the most dangerous animal of the three. (Sư tử là loài nguy hiểm nhất trong ba loài này.)</p>\n<p>• The brown dress is the most expensive. (Chiếc váy màu nâu là đắt nhất.)</p>\n<p><strong>3. Cách thêm đuôi -er, -est của tính từ ngắn </strong></p>\n<p><strong>a. Với tính từ ngắn kết thúc bằng -y: Trong câu so sánh hơn ta bỏ -y thay bằng -ier, trong câu so sánh nhất ta bỏ -y thay bằng – iest.</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong></p>\n<p>• You are look happier than your husband. What’s happen? (Bạn trông vui vẻ hơn anh chồng nhiều đấy. Có chuyện gì thế?)</p>\n<p>• You are reading the funniest example in the world (Bạn đang đọc ví dụ buồn cười nhất thế giới đây)</p>\n<p><strong>b. Với tính từ ngắn kết thúc bằng -e: Trong câu so sánh hơn: Thêm -r vào sau cùng, Trong câu so sánh nhất, thêm -st vào sau cùng</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong></p>\n<p>• Your crush looks nicer than your ex. (Crush hiện tại của bạn trông tuyệt vời hơn tình cũ đó)</p>\n<p>• My crush is always the nicest on my heart (Crush của tôi lúc nào cũng là tuyệt vời nhất trong tim tôi rồi)</p>\n<p><strong>c.Với tính từ ngắn có nguyên âm đứng trước phụ âm sau cùng: Trong câu so sánh hơn và so sánh nhất sẽ cần gấp đôi phụ âm và thêm theo quy tắc như thông thường.</strong></p>\n<p><strong style=\"color: #c00000;\">Ví dụ:</strong></p>\n<p>• My thumb is bigger than my pinky (Ngón tay cái của mình to hơn ngón út)</p>\n<p>• My house is the biggest in this town (Ngôi nhà tôi to nhất ở thành phố này)</p>\n<p><strong>4. Các tính từ bất quy tắc trong cấu trúc so sánh</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"141\">\n<p style=\"text-align:center;\"><strong>Từ</strong></p>\n</td>\n<td valign=\"top\" width=\"198\">\n<p style=\"text-align:center;\"><strong>So sánh hơn</strong></p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p style=\"text-align:center;\"><strong>So sánh nhất</strong></p>\n</td>\n<td valign=\"top\" width=\"135\">\n<p style=\"text-align:center;\"><strong>Nghĩa</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p>Good/ Well</p>\n</td>\n<td valign=\"top\" width=\"198\">\n<p>Better</p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p>best</p>\n</td>\n<td valign=\"top\" width=\"135\">\n<p>Tốt</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p>Bad</p>\n</td>\n<td valign=\"top\" width=\"198\">\n<p>Worse</p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p>Worst</p>\n</td>\n<td valign=\"top\" width=\"135\">\n<p>Tệ </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p>Far</p>\n</td>\n<td valign=\"top\" width=\"198\">\n<p>Farther/ Further</p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p>The farthest/ the furthest </p>\n</td>\n<td valign=\"top\" width=\"135\">\n<p>Xa </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p>Much/ Many</p>\n</td>\n<td valign=\"top\" width=\"198\">\n<p>More/ Much</p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p>Most</p>\n</td>\n<td valign=\"top\" width=\"135\">\n<p>Nhiều </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p>Little </p>\n</td>\n<td valign=\"top\" width=\"198\">\n<p>Less </p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p>Least </p>\n</td>\n<td valign=\"top\" width=\"135\">\n<p>Ít </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p>Old </p>\n</td>\n<td valign=\"top\" width=\"198\">\n<p>Older/ elder</p>\n</td>\n<td valign=\"top\" width=\"189\">\n<p>Oldest/ Eldest </p>\n</td>\n<td valign=\"top\" width=\"135\">\n<p>Già </p>\n</td>\n</tr>\n</tbody>\n</table>\n<p><strong>5. Tính từ dùng được ở cả 2 dạng “-er/-est” và “more/ most”</strong></p>\n<table class=\"MsoTableGrid\" border=\"1\">\n<tbody>\n<tr style=\"background: rgb(197, 224, 179);\">\n<td valign=\"top\" width=\"141\">\n<p style=\"text-align:center;\"><strong>Từ</strong></p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p style=\"text-align:center;\"><strong>So sánh nhất</strong></p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p style=\"text-align:center;\"><strong>Nghĩa</strong></p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p>Clever</p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>The cleverest/ The most clever</p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>Thông thái </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p>Gentle </p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>The gentlest/ The most gentle </p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>Nhẹ nhàng</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p>Friendly </p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>The friendliest/ The most friendly</p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>Thân thiện</p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p>Quiet</p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>The quietest/ The most quiet</p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>Im lặng </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p>Simple </p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>The simplest/ The most simple </p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>Đơn giản </p>\n</td>\n</tr>\n<tr>\n<td valign=\"top\" width=\"141\">\n<p>Narrow </p>\n</td>\n<td valign=\"top\" width=\"265\">\n<p>The narrowest/ The most narrow</p>\n</td>\n<td valign=\"top\" width=\"258\">\n<p>Chật hẹp</p>\n</td>\n</tr>\n</tbody>\n</table>",
                "readingPassage": "Robots will play an important role in our daily lives. In the future, house robots will be able to do chores like washing dishes and making bed. Teacher robots will help children learn languages, and doctor robots will take care of patients.",
                "readingPassageTitle": "Robots in Our Lives",
                "videos": [
                    {
                        "id": "nO2LKe-K_tI",
                        "title": "Tiếng Anh 6 Unit 12: Getting started trang 58, 59 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "jW01T2v_q9g",
                        "title": "Tiếng Anh 6 Unit 12: A closer look 1 trang 60 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "k5T49YjY27g",
                        "title": "Tiếng Anh 6 Unit 12: A closer look 2 trang 61, 62 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "9g0ZJ531uHk",
                        "title": "Tiếng Anh 6 Unit 12: Communication trang 63 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "T_7_fB1Tf4w",
                        "title": "Tiếng Anh 6 Unit 12: Skills 1 trang 64 Global Success (DỄ HIỂU NHẤT)"
                    },
                    {
                        "id": "0k54Xb5v7a8",
                        "title": "Tiếng Anh 6 Unit 12: Looking back trang 66 Global Success (HAY NHẤT)"
                    },
                    {
                        "id": "L2G5Y9c_0u0",
                        "title": "Tiếng Anh 6 Unit 12: Project trang 67 Global Success (DỄ HIỂU NHẤT)"
                    }
                ],
                "questions": {
                    "reading": [
                        {
                            "question": "What is the main topic of the passage?",
                            "options": [
                                "Unit 12: Robots",
                                "Playing sports",
                                "Travelling around the world"
                            ],
                            "answer": "Unit 12: Robots"
                        },
                        {
                            "question": "Which word is mentioned in the reading passage?",
                            "options": [
                                "age",
                                "helicopter",
                                "spaceship"
                            ],
                            "answer": "age"
                        },
                        {
                            "question": "How does the writer feel about the topic?",
                            "options": [
                                "Excited and happy",
                                "Bored and tired",
                                "Sad"
                            ],
                            "answer": "Excited and happy"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t13",
                "title": "Unit 13: Hobbies & Benefits (NÂNG CAO LỚP 7)",
                "subtitle": "Sở thích và những lợi ích cho sức khỏe",
                "vocab": [
                    {
                        "word": "gardening",
                        "translation": "làm vườn",
                        "phonetics": "/ˈɡɑː.dən.ɪŋ/",
                        "type": "noun",
                        "sentence": "Gardening is my main hobby.",
                        "sentenceTranslation": "Làm vườn là sở thích chính của tớ."
                    },
                    {
                        "word": "stamp",
                        "translation": "con tem thư",
                        "phonetics": "/stæmp/",
                        "type": "noun",
                        "sentence": "He collects old postage stamps.",
                        "sentenceTranslation": "Cậu ấy sưu tập tem thư cổ."
                    },
                    {
                        "word": "coin",
                        "translation": "đồng xu",
                        "phonetics": "/kɔɪn/",
                        "type": "noun",
                        "sentence": "He has a collection of coins.",
                        "sentenceTranslation": "Cậu ấy có một bộ sưu tập đồng xu."
                    },
                    {
                        "word": "health",
                        "translation": "sức khỏe",
                        "phonetics": "/helθ/",
                        "type": "noun",
                        "sentence": "Jogging is good for your health.",
                        "sentenceTranslation": "Chạy bộ rất tốt cho sức khỏe của bạn."
                    },
                    {
                        "word": "creative",
                        "translation": "sáng tạo",
                        "phonetics": "/kriˈeɪ.tɪv/",
                        "type": "adjective",
                        "sentence": "Painting makes you creative.",
                        "sentenceTranslation": "Vẽ tranh giúp con trở nên sáng tạo."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What are the benefits of gardening? - It helps me relax.",
                        "vietnamese": "Lợi ích của việc làm vườn là gì? - Nó giúp tớ thư giãn đầu óc."
                    },
                    {
                        "english": "She enjoys collecting stamps on Sundays.",
                        "vietnamese": "Cô ấy thích sưu tập tem vào những ngày Chủ Nhật."
                    }
                ],
                "grammar": "Cách sử dụng danh động từ (Gerunds: V-ing) đóng vai trò làm chủ ngữ hoặc tân ngữ sau các động từ bày tỏ cảm xúc (like, enjoy, love, hate).",
                "readingPassage": "Collecting stamps is an interesting hobby. It is not only fun but also educational because you can learn about different countries. My sister loves collecting stamps, while I prefer gardening. Gardening keeps me fit.",
                "readingPassageTitle": "Interesting Hobbies",
                "questions": {
                    "reading": [
                        {
                            "question": "Why is collecting stamps educational?",
                            "options": [
                                "Because it is expensive",
                                "Because you can learn about different countries",
                                "Because it is difficult"
                            ],
                            "answer": "Because you can learn about different countries"
                        },
                        {
                            "question": "What is the sister's hobby?",
                            "options": [
                                "Gardening",
                                "Collecting stamps",
                                "Cooking"
                            ],
                            "answer": "Collecting stamps"
                        },
                        {
                            "question": "What is the benefit of gardening for the writer?",
                            "options": [
                                "It makes him creative",
                                "It keeps him fit",
                                "It is boring"
                            ],
                            "answer": "It keeps him fit"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t14",
                "title": "Unit 14: Health & Calories (NÂNG CAO LỚP 7)",
                "subtitle": "Dinh dưỡng, lượng calo và lối sống lành mạnh",
                "vocab": [
                    {
                        "word": "calories",
                        "translation": "lượng calo/năng lượng",
                        "phonetics": "/ˈkæl.ər.iz/",
                        "type": "noun",
                        "sentence": "Apples have low calories.",
                        "sentenceTranslation": "Quả táo chứa lượng calo thấp."
                    },
                    {
                        "word": "diet",
                        "translation": "chế độ ăn uống/ăn kiêng",
                        "phonetics": "/ˈdaɪ.ət/",
                        "type": "noun",
                        "sentence": "A healthy diet is important.",
                        "sentenceTranslation": "Một chế độ ăn uống lành mạnh rất quan trọng."
                    },
                    {
                        "word": "lifestyle",
                        "translation": "lối sống/cách sống",
                        "phonetics": "/ˈlaɪf.staɪl/",
                        "type": "noun",
                        "sentence": "He has an active lifestyle.",
                        "sentenceTranslation": "Cậu ấy có một lối sống năng động."
                    },
                    {
                        "word": "disease",
                        "translation": "bệnh tật/dịch bệnh",
                        "phonetics": "/dɪˈziːz/",
                        "type": "noun",
                        "sentence": "Eat garlic to prevent disease.",
                        "sentenceTranslation": "Hãy ăn tỏi để phòng ngừa bệnh tật."
                    },
                    {
                        "word": "fit",
                        "translation": "sự vừa vặn/khỏe mạnh",
                        "phonetics": "/fɪt/",
                        "type": "adjective",
                        "sentence": "I exercise to stay fit.",
                        "sentenceTranslation": "Tớ tập thể dục để giữ cơ thể khỏe mạnh."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "You should eat less junk food, or you will gain weight.",
                        "vietnamese": "Cậu nên ăn ít đồ ăn nhanh thôi, nếu không cậu sẽ bị tăng cân đấy."
                    },
                    {
                        "english": "We need calories to run and study every day.",
                        "vietnamese": "Chúng ta cần calo để chạy bộ và học tập mỗi ngày."
                    }
                ],
                "grammar": "Cách sử dụng câu ghép với các liên từ chỉ sự tương phản, nguyên nhân hoặc kết quả (and, but, or, so).",
                "readingPassage": "To live a healthy life, we must pay attention to our diet. We should eat plenty of fresh vegetables and fish. Junk food contains too many calories and sugar, so we should avoid it. Active lifestyle prevents diseases.",
                "readingPassageTitle": "A Healthy Diet",
                "questions": {
                    "reading": [
                        {
                            "question": "What should we eat plenty of?",
                            "options": [
                                "Junk food and sugar",
                                "Fresh vegetables and fish",
                                "Cakes"
                            ],
                            "answer": "Fresh vegetables and fish"
                        },
                        {
                            "question": "Why should we avoid junk food?",
                            "options": [
                                "Because it has too many calories and sugar",
                                "Because it is expensive",
                                "Because it is sour"
                            ],
                            "answer": "Because it has too many calories and sugar"
                        },
                        {
                            "question": "What is the benefit of an active lifestyle?",
                            "options": [
                                "It makes us tired",
                                "It prevents diseases",
                                "It has no benefit"
                            ],
                            "answer": "It prevents diseases"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t15",
                "title": "Unit 15: Community Service (NÂNG CAO LỚP 7)",
                "subtitle": "Hoạt động tình nguyện giúp đỡ cộng đồng",
                "vocab": [
                    {
                        "word": "volunteer",
                        "translation": "tình nguyện viên/tình nguyện",
                        "phonetics": "/ˌvɒl.ənˈtɪər/",
                        "type": "noun/verb",
                        "sentence": "We volunteer at the library.",
                        "sentenceTranslation": "Chúng tớ làm tình nguyện ở thư viện."
                    },
                    {
                        "word": "donate",
                        "translation": "hiến tặng/quyên góp",
                        "phonetics": "/dəʊˈneɪt/",
                        "type": "verb",
                        "sentence": "Donate books to poor children.",
                        "sentenceTranslation": "Quyên góp sách cho trẻ em nghèo."
                    },
                    {
                        "word": "clean-up",
                        "translation": "dọn dẹp vệ sinh",
                        "phonetics": "/ˈkliːn.ʌp/",
                        "type": "noun",
                        "sentence": "We joined the park clean-up.",
                        "sentenceTranslation": "Chúng tớ đã tham gia dọn dẹp công viên."
                    },
                    {
                        "word": "shelter",
                        "translation": "nhà tình thương/nơi trú ẩn",
                        "phonetics": "/ˈʃel.tər/",
                        "type": "noun",
                        "sentence": "A shelter for homeless dogs.",
                        "sentenceTranslation": "Nhà tình thương dành cho những chú chó vô gia cư."
                    },
                    {
                        "word": "homeless",
                        "translation": "vô gia cư",
                        "phonetics": "/ˈhəʊm.ləs/",
                        "type": "adjective",
                        "sentence": "They help homeless people.",
                        "sentenceTranslation": "Họ giúp đỡ những người vô gia cư."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Have you ever done volunteer work? - Yes, I have donated books.",
                        "vietnamese": "Cậu đã từng làm công việc tình nguyện nào chưa? - Có, tớ từng quyên góp sách."
                    },
                    {
                        "english": "Last weekend, we cleaned up the local park.",
                        "vietnamese": "Cuối tuần trước, chúng tớ đã dọn dẹp công viên của địa phương."
                    }
                ],
                "grammar": "Phân biệt cách sử dụng Thì Hiện tại hoàn thành (trải nghiệm không thời gian cụ thể) và Thì Quá khứ đơn (hành động đã chấm dứt, có thời gian xác định).",
                "readingPassage": "Our school has a volunteer club. We have done many community services since last year. We have donated warm clothes to children in mountainous areas. Last Sunday, we organized a beach clean-up event.",
                "readingPassageTitle": "Our Volunteer Club",
                "questions": {
                    "reading": [
                        {
                            "question": "What has the club donated to mountainous children?",
                            "options": [
                                "Textbooks",
                                "Warm clothes",
                                "Money"
                            ],
                            "answer": "Warm clothes"
                        },
                        {
                            "question": "When did they clean up the beach?",
                            "options": [
                                "Since last year",
                                "Last Sunday",
                                "Next week"
                            ],
                            "answer": "Last Sunday"
                        },
                        {
                            "question": "What is the text about?",
                            "options": [
                                "A travel trip",
                                "Our volunteer club and community services",
                                "A beach holiday"
                            ],
                            "answer": "Our volunteer club and community services"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t16",
                "title": "Unit 16: Music & Arts (NÂNG CAO LỚP 7)",
                "subtitle": "Nghệ thuật, nhạc cụ và các cấu trúc so sánh",
                "vocab": [
                    {
                        "word": "music",
                        "translation": "âm nhạc",
                        "phonetics": "/ˈmjuː.zɪk/",
                        "type": "noun",
                        "sentence": "Music makes me happy.",
                        "sentenceTranslation": "Âm nhạc làm tớ thấy vui vẻ."
                    },
                    {
                        "word": "instrument",
                        "translation": "nhạc cụ âm nhạc",
                        "phonetics": "/ˈɪn.strə.mənt/",
                        "type": "noun",
                        "sentence": "The guitar is my instrument.",
                        "sentenceTranslation": "Đàn ghi-ta là nhạc cụ của tớ."
                    },
                    {
                        "word": "concert",
                        "translation": "buổi hòa nhạc",
                        "phonetics": "/ˈkɒn.sət/",
                        "type": "noun",
                        "sentence": "We went to a rock concert.",
                        "sentenceTranslation": "Chúng tớ đã đi xem một buổi hòa nhạc rock."
                    },
                    {
                        "word": "artist",
                        "translation": "họa sĩ/nghệ sĩ",
                        "phonetics": "/ˈɑː.tɪst/",
                        "type": "noun",
                        "sentence": "The artist painted a portrait.",
                        "sentenceTranslation": "Họa sĩ đã vẽ một bức chân dung."
                    },
                    {
                        "word": "gallery",
                        "translation": "phòng triển lãm tranh",
                        "phonetics": "/ˈɡæl.ər.i/",
                        "type": "noun",
                        "sentence": "There are many photos in the gallery.",
                        "sentenceTranslation": "Có rất nhiều ảnh trong phòng triển lãm."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Classical music is not as exciting as rock music.",
                        "vietnamese": "Nhạc cổ điển thì không sôi động bằng nhạc rock."
                    },
                    {
                        "english": "Her painting style is different from mine.",
                        "vietnamese": "Phong cách vẽ tranh của cô ấy khác với của tớ."
                    }
                ],
                "grammar": "Cấu trúc so sánh bằng 'as + adj + as', so sánh không bằng 'not as... as' và sự khác biệt 'different from'.",
                "readingPassage": "I love playing musical instruments. I can play the piano and the guitar. My friend Lan says she doesn't like piano because it is not as modern as the guitar. Her music taste is quite different from mine.",
                "readingPassageTitle": "Music Taste",
                "questions": {
                    "reading": [
                        {
                            "question": "What instruments can the writer play?",
                            "options": [
                                "Violin and drums",
                                "Piano and guitar",
                                "Flute"
                            ],
                            "answer": "Piano and guitar"
                        },
                        {
                            "question": "Why doesn't Lan like the piano?",
                            "options": [
                                "Because it is too big",
                                "Because it is not as modern as the guitar",
                                "Because it is boring"
                            ],
                            "answer": "Because it is not as modern as the guitar"
                        },
                        {
                            "question": "How is Lan's music taste compared to the writer's?",
                            "options": [
                                "It is the same",
                                "It is quite different from the writer's",
                                "It is better"
                            ],
                            "answer": "It is quite different from the writer's"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t17",
                "title": "Unit 17: Vietnamese Food & Drinks (NÂNG CAO LỚP 7)",
                "subtitle": "Ẩm thực Việt Nam và lượng từ danh từ",
                "vocab": [
                    {
                        "word": "noodle",
                        "translation": "mì/phở/bún",
                        "phonetics": "/ˈnuː.dəl/",
                        "type": "noun",
                        "sentence": "Pho is a famous Vietnamese noodle soup.",
                        "sentenceTranslation": "Phở là món phở nước nổi tiếng của Việt Nam."
                    },
                    {
                        "word": "soup",
                        "translation": "canh/nước súp/nước lèo",
                        "phonetics": "/suːp/",
                        "type": "noun",
                        "sentence": "The soup is hot.",
                        "sentenceTranslation": "Nước súp rất nóng."
                    },
                    {
                        "word": "recipe",
                        "translation": "công thức nấu ăn",
                        "phonetics": "/ˈres.ɪ.pi/",
                        "type": "noun",
                        "sentence": "Follow the soup recipe.",
                        "sentenceTranslation": "Hãy làm theo công thức nấu súp."
                    },
                    {
                        "word": "ingredient",
                        "translation": "nguyên liệu chế biến",
                        "phonetics": "/ɪnˈɡriː.di.ənt/",
                        "type": "noun",
                        "sentence": "Beef is the main ingredient.",
                        "sentenceTranslation": "Thịt bò là nguyên liệu chính."
                    },
                    {
                        "word": "turmeric",
                        "translation": "củ nghệ/bột nghệ",
                        "phonetics": "/ˈtɜː.mər.ɪk/",
                        "type": "noun",
                        "sentence": "Turmeric gives yellow color.",
                        "sentenceTranslation": "Nghệ tạo ra màu vàng."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "How much milk do you need? - I need a bottle of milk.",
                        "vietnamese": "Con cần bao nhiêu sữa? - Con cần một chai sữa."
                    },
                    {
                        "english": "Do we have any turmeric left? - No, we don't have any.",
                        "vietnamese": "Chúng ta còn lại chút nghệ nào không? - Không, chúng ta không còn chút nào."
                    }
                ],
                "grammar": "Phân biệt Danh từ đếm được và không đếm được đi kèm các lượng từ 'some, any, how much, how many'.",
                "readingPassage": "Pho is the most famous food in Vietnam. To make a bowl of beef Pho, we need some beef, rice noodles, and a hot broth soup. The recipe is not simple. We also need some green onions and spices.",
                "readingPassageTitle": "Famous Beef Pho",
                "questions": {
                    "reading": [
                        {
                            "question": "What is Pho?",
                            "options": [
                                "A cake",
                                "The most famous food in Vietnam",
                                "A drink"
                            ],
                            "answer": "The most famous food in Vietnam"
                        },
                        {
                            "question": "What ingredients do we need to make beef Pho?",
                            "options": [
                                "Beef, rice noodles, and hot broth soup",
                                "Pork and bread",
                                "Milk and sugar"
                            ],
                            "answer": "Beef, rice noodles, and hot broth soup"
                        },
                        {
                            "question": "Is the recipe of Pho simple?",
                            "options": [
                                "Yes, very simple",
                                "No, it is not simple",
                                "It is easy"
                            ],
                            "answer": "No, it is not simple"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t18",
                "title": "Unit 18: First University in VN (NÂNG CAO LỚP 7)",
                "subtitle": "Văn Miếu Quốc Tử Giám và thể bị động",
                "vocab": [
                    {
                        "word": "temple",
                        "translation": "ngôi đền/Văn Miếu",
                        "phonetics": "/ˈtem.pəl/",
                        "type": "noun",
                        "sentence": "The Temple of Literature is old.",
                        "sentenceTranslation": "Văn Miếu rất cổ kính."
                    },
                    {
                        "word": "scholar",
                        "translation": "học giả/nhà nho",
                        "phonetics": "/ˈskɒl.ər/",
                        "type": "noun",
                        "sentence": "Many scholars visited here.",
                        "sentenceTranslation": "Nhiều học giả đã ghé thăm nơi đây."
                    },
                    {
                        "word": "monument",
                        "translation": "bia đá/đài kỷ niệm",
                        "phonetics": "/ˈmɒn.jə.mənt/",
                        "type": "noun",
                        "sentence": "The monument is historic.",
                        "sentenceTranslation": "Bia đá mang tính lịch sử."
                    },
                    {
                        "word": "stone",
                        "translation": "đá/bia đá tiến sĩ",
                        "phonetics": "/stəʊn/",
                        "type": "noun",
                        "sentence": "The stone tablets are carved.",
                        "sentenceTranslation": "Những tấm bia đá được khắc chữ."
                    },
                    {
                        "word": "imperial",
                        "translation": "thuộc hoàng gia/triều đình",
                        "phonetics": "/ɪmˈpɪə.ri.əl/",
                        "type": "adjective",
                        "sentence": "The Imperial Academy.",
                        "sentenceTranslation": "Quốc Tử Giám."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Where was the Temple of Literature built? - It was built in Hanoi.",
                        "vietnamese": "Văn Miếu được xây dựng ở đâu? - Nó được xây dựng ở Hà Nội."
                    },
                    {
                        "english": "Doctor's stone tablets were recognized by UNESCO.",
                        "vietnamese": "Các bia đá tiến sĩ đã được công nhận bởi UNESCO."
                    }
                ],
                "grammar": "Giới thiệu cấu trúc Thể bị động (Passive Voice) ở thì Quá khứ đơn (S + was/were + V3/ed).",
                "readingPassage": "The Temple of Literature is the first university in Vietnam. It was built in 1070 under King Ly Thanh Tong. Doctor's stone tablets were erected on the backs of stone turtles to honor the scholars of the country.",
                "readingPassageTitle": "Vietnam's First University",
                "questions": {
                    "reading": [
                        {
                            "question": "What is the Temple of Literature?",
                            "options": [
                                "A modern museum",
                                "The first university in Vietnam",
                                "A hotel"
                            ],
                            "answer": "The first university in Vietnam"
                        },
                        {
                            "question": "When was it built?",
                            "options": [
                                "In 1070",
                                "In 1970",
                                "Last year"
                            ],
                            "answer": "In 1070"
                        },
                        {
                            "question": "Where were the doctor's stone tablets erected?",
                            "options": [
                                "On the walls",
                                "On the backs of stone turtles",
                                "In the classrooms"
                            ],
                            "answer": "On the backs of stone turtles"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t19",
                "title": "Unit 19: Traffic & Safety (NÂNG CAO LỚP 7)",
                "subtitle": "Luật an toàn giao thông và thói quen quá khứ",
                "vocab": [
                    {
                        "word": "pedestrian",
                        "translation": "người đi bộ",
                        "phonetics": "/pəˈdes.tri.ən/",
                        "type": "noun",
                        "sentence": "Pedestrians walk on sidewalks.",
                        "sentenceTranslation": "Người đi bộ đi trên vỉa hè."
                    },
                    {
                        "word": "passenger",
                        "translation": "hành khách xe tàu",
                        "phonetics": "/ˈpæs.ən.dʒər/",
                        "type": "noun",
                        "sentence": "Passengers board the train.",
                        "sentenceTranslation": "Hành khách bước lên tàu hỏa."
                    },
                    {
                        "word": "license",
                        "translation": "bằng lái/giấy phép",
                        "phonetics": "/ˈlaɪ.səns/",
                        "type": "noun",
                        "sentence": "You need a driving license.",
                        "sentenceTranslation": "Bạn cần có bằng lái xe."
                    },
                    {
                        "word": "fine",
                        "translation": "tiền phạt vi phạm",
                        "phonetics": "/faɪn/",
                        "type": "noun/verb",
                        "sentence": "Pay a fine for speeding.",
                        "sentenceTranslation": "Nộp phạt vì chạy quá tốc độ."
                    },
                    {
                        "word": "road",
                        "translation": "con đường/lộ trình",
                        "phonetics": "/rəʊd/",
                        "type": "noun",
                        "sentence": "Cross the road safely.",
                        "sentenceTranslation": "Băng qua đường một cách an toàn."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "I used to ride a tricycle when I was a child.",
                        "vietnamese": "Tớ từng đi xe đạp ba bánh khi còn nhỏ."
                    },
                    {
                        "english": "It is about two kilometers from my house to school.",
                        "vietnamese": "Khoảng cách từ nhà tớ đến trường là khoảng hai ki-lô-mét."
                    }
                ],
                "grammar": "Sử dụng cấu trúc chỉ thói quen trong quá khứ 'used to + V' và cấu trúc chỉ khoảng cách 'It is + [khoảng cách] + from... to...'.",
                "readingPassage": "Traffic in big cities is very busy and sometimes dangerous. There are many passengers on the buses. Pedestrians must use the zebra crossing. I used to walk to school, but now I go by bus because it is further.",
                "readingPassageTitle": "Traffic Safety",
                "questions": {
                    "reading": [
                        {
                            "question": "How is the traffic in big cities?",
                            "options": [
                                "Quiet",
                                "Busy and sometimes dangerous",
                                "Slow"
                            ],
                            "answer": "Busy and sometimes dangerous"
                        },
                        {
                            "question": "What must pedestrians use to cross the street?",
                            "options": [
                                "The highway",
                                "The zebra crossing",
                                "The sidewalk"
                            ],
                            "answer": "The zebra crossing"
                        },
                        {
                            "question": "How did the writer use to go to school?",
                            "options": [
                                "By bus",
                                "By car",
                                "He used to walk"
                            ],
                            "answer": "He used to walk"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t20",
                "title": "Unit 20: Films & Reviews (NÂNG CAO LỚP 7)",
                "subtitle": "Các thể loại phim và tính từ chỉ thái độ",
                "vocab": [
                    {
                        "word": "comedy",
                        "translation": "phim hài kịch",
                        "phonetics": "/ˈkɒm.ə.di/",
                        "type": "noun",
                        "sentence": "The comedy made us laugh.",
                        "sentenceTranslation": "Bộ phim hài kịch khiến chúng tớ bật cười."
                    },
                    {
                        "word": "action",
                        "translation": "phim hành động",
                        "phonetics": "/ˈæk.ʃən/",
                        "type": "noun/adjective",
                        "sentence": "Action films are exciting.",
                        "sentenceTranslation": "Phim hành động rất gay cấn."
                    },
                    {
                        "word": "director",
                        "translation": "đạo diễn bộ phim",
                        "phonetics": "/daɪˈrek.tər/",
                        "type": "noun",
                        "sentence": "The director made a masterpiece.",
                        "sentenceTranslation": "Đạo diễn đã làm ra một kiệt tác."
                    },
                    {
                        "word": "review",
                        "translation": "đánh giá/nhận xét",
                        "phonetics": "/rɪˈvjuː/",
                        "type": "noun/verb",
                        "sentence": "Write a film review.",
                        "sentenceTranslation": "Hãy viết một bài đánh giá phim."
                    },
                    {
                        "word": "boring",
                        "translation": "tẻ nhạt/chán ngắt",
                        "phonetics": "/ˈbɔː.rɪŋ/",
                        "type": "adjective",
                        "sentence": "The film was very boring.",
                        "sentenceTranslation": "Bộ phim đó rất tẻ nhạt."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Although the film was long, I didn't feel bored.",
                        "vietnamese": "Mặc dù phim rất dài nhưng tớ không hề thấy chán."
                    },
                    {
                        "english": "What did critics say in the review? - They said it was exciting.",
                        "vietnamese": "Các nhà phê bình nói gì trong bài đánh giá? - Họ nói nó rất hay."
                    }
                ],
                "grammar": "Cách phân biệt tính từ đuôi -ed và -ing (bored vs. boring) và cách dùng liên từ nhượng bộ 'although / despite'.",
                "readingPassage": "Last night, I watched a new action film directed by a famous artist. Although the film had some boring scenes, the ending was very exciting. Most reviews on the internet are positive.",
                "readingPassageTitle": "Movie Night",
                "questions": {
                    "reading": [
                        {
                            "question": "What kind of film did the writer watch?",
                            "options": [
                                "A comedy",
                                "An action film",
                                "A cartoon"
                            ],
                            "answer": "An action film"
                        },
                        {
                            "question": "How was the ending of the film?",
                            "options": [
                                "Boring",
                                "Exciting",
                                "Sad"
                            ],
                            "answer": "Exciting"
                        },
                        {
                            "question": "How are most reviews of the film on the internet?",
                            "options": [
                                "Negative",
                                "Positive",
                                "Bad"
                            ],
                            "answer": "Positive"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t21",
                "title": "Unit 21: Energy Sources (NÂNG CAO LỚP 7)",
                "subtitle": "Nguồn năng lượng và tương lai tiếp diễn",
                "vocab": [
                    {
                        "word": "energy",
                        "translation": "năng lượng",
                        "phonetics": "/ˈen.ə.dʒi/",
                        "type": "noun",
                        "sentence": "Save energy at home.",
                        "sentenceTranslation": "Hãy tiết kiệm năng lượng ở nhà."
                    },
                    {
                        "word": "solar",
                        "translation": "thuộc mặt trời/thái dương",
                        "phonetics": "/ˈsəʊ.lər/",
                        "type": "adjective",
                        "sentence": "Solar panels produce clean power.",
                        "sentenceTranslation": "Các tấm pin mặt trời tạo ra điện sạch."
                    },
                    {
                        "word": "wind",
                        "translation": "gió tự nhiên",
                        "phonetics": "/wɪnd/",
                        "type": "noun",
                        "sentence": "Wind is a renewable energy.",
                        "sentenceTranslation": "Năng lượng gió là năng lượng tái tạo."
                    },
                    {
                        "word": "coal",
                        "translation": "than đá",
                        "phonetics": "/kəʊl/",
                        "type": "noun",
                        "sentence": "Coal is a fossil fuel.",
                        "sentenceTranslation": "Than đá là một nhiên liệu hóa thạch."
                    },
                    {
                        "word": "source",
                        "translation": "nguồn phát/nguồn gốc",
                        "phonetics": "/sɔːs/",
                        "type": "noun",
                        "sentence": "Water is a source of life.",
                        "sentenceTranslation": "Nước là nguồn gốc của sự sống."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "What will we be doing at this time next year? - We will be using solar energy.",
                        "vietnamese": "Vào thời gian này năm sau chúng ta sẽ đang làm gì? - Chúng ta sẽ đang sử dụng năng lượng mặt trời."
                    },
                    {
                        "english": "Coal is a non-renewable source of energy.",
                        "vietnamese": "Than đá là nguồn năng lượng không tái tạo được."
                    }
                ],
                "grammar": "Giới thiệu Thì Tương lai tiếp diễn (Future Continuous: S + will be + V-ing) diễn tả hành động đang xảy ra tại một thời điểm xác định trong tương lai.",
                "readingPassage": "Fossil fuels like coal are running out. In the future, we will be using more green energy sources. Wind and solar power will be used to protect our environment. Everyone should save energy starting today.",
                "readingPassageTitle": "Energy of the Future",
                "questions": {
                    "reading": [
                        {
                            "question": "What is coal according to the passage?",
                            "options": [
                                "A renewable energy source",
                                "A fossil fuel that is running out",
                                "Solar power"
                            ],
                            "answer": "A fossil fuel that is running out"
                        },
                        {
                            "question": "What energy will we be using more in the future?",
                            "options": [
                                "Coal",
                                "Green energy sources like wind and solar",
                                "Fossil fuels"
                            ],
                            "answer": "Green energy sources like wind and solar"
                        },
                        {
                            "question": "What should everyone do starting today?",
                            "options": [
                                "Use more coal",
                                "Save energy",
                                "Cut down trees"
                            ],
                            "answer": "Save energy"
                        }
                    ]
                }
            },
            {
                "id": "eng6-t22",
                "title": "Unit 22: Future Transport (NÂNG CAO LỚP 7)",
                "subtitle": "Phương tiện tương lai và đại từ sở hữu",
                "vocab": [
                    {
                        "word": "driverless",
                        "translation": "không người lái/tự động",
                        "phonetics": "/ˈdraɪ.və.ləs/",
                        "type": "adjective",
                        "sentence": "A driverless car is very safe.",
                        "sentenceTranslation": "Một chiếc xe không người lái rất an toàn."
                    },
                    {
                        "word": "eco-friendly",
                        "translation": "thân thiện môi trường",
                        "phonetics": "/ˌiː.kəʊˈfrend.li/",
                        "type": "adjective",
                        "sentence": "Electric buses are eco-friendly.",
                        "sentenceTranslation": "Xe buýt điện rất thân thiện với môi trường."
                    },
                    {
                        "word": "hyperloop",
                        "translation": "tàu siêu tốc hyperloop",
                        "phonetics": "/ˈhaɪ.pə.luːp/",
                        "type": "noun",
                        "sentence": "The hyperloop travels at high speed.",
                        "sentenceTranslation": "Tàu siêu tốc hyperloop chạy với tốc độ cực cao."
                    },
                    {
                        "word": "flying",
                        "translation": "đang bay/biết bay",
                        "phonetics": "/ˈflaɪ.ɪŋ/",
                        "type": "adjective/noun",
                        "sentence": "A flying taxi in the city.",
                        "sentenceTranslation": "Một chiếc taxi bay trong thành phố."
                    },
                    {
                        "word": "crash",
                        "translation": "tai nạn va chạm/đâm xe",
                        "phonetics": "/kræʃ/",
                        "type": "noun/verb",
                        "sentence": "Avoid a traffic crash.",
                        "sentenceTranslation": "Hãy tránh các tai nạn giao thông."
                    }
                ],
                "sentencePatterns": [
                    {
                        "english": "Is that flying car yours? - No, it is theirs.",
                        "vietnamese": "Chiếc xe bay đó là của bạn hả? - Không, nó là của họ."
                    },
                    {
                        "english": "If driverless cars become popular, there will be fewer crashes.",
                        "vietnamese": "Nếu xe tự lái trở nên phổ biến thì sẽ có ít vụ va chạm hơn."
                    }
                ],
                "grammar": "Cách sử dụng các Đại từ sở hữu (mine, yours, his, hers, ours, theirs) để tránh lặp lại danh từ và ôn luyện câu điều kiện loại 1.",
                "readingPassage": "Our future transports will be very different. Most cars will be driverless and eco-friendly. We will see flying taxis in the sky. Hyperloop trains will carry passengers between cities in just a few minutes.",
                "readingPassageTitle": "Transports in 2050",
                "questions": {
                    "reading": [
                        {
                            "question": "What is special about future cars?",
                            "options": [
                                "They will use coal",
                                "They will be driverless and eco-friendly",
                                "They will be slow"
                            ],
                            "answer": "They will be driverless and eco-friendly"
                        },
                        {
                            "question": "Where will we see flying taxis?",
                            "options": [
                                "Under the sea",
                                "In the sky",
                                "On train tracks"
                            ],
                            "answer": "In the sky"
                        },
                        {
                            "question": "What transport will connect cities in minutes?",
                            "options": [
                                "Bicycles",
                                "Electric buses",
                                "Hyperloop trains"
                            ],
                            "answer": "Hyperloop trains"
                        }
                    ]
                }
            }
        ]
    }
};

function getWordEmoji(word) {
    const clean = word.toLowerCase().trim();
    return EMOJI_FALLBACK[clean] || "⭐";
}


const ENG6_T1_READING_GRAMMAR_QUESTIONS = [
    {
        type: "choice",
        questionText: "My mother likes chocolate, but she _________ like biscuits. (Chọn trợ động từ phù hợp)",
        correctAnswer: "doesn't",
        options: ["doesn't", "don't", "does", "do"],
        solutionHtml: "Chủ ngữ là 'she' (ngôi thứ ba số ít) và câu mang nghĩa phủ định đối lập ('but she...'), do đó ta dùng trợ động từ <b>'doesn't'</b>."
    },
    {
        type: "choice",
        questionText: "_________ the children wear your uniform at your school? (Chọn trợ động từ phù hợp)",
        correctAnswer: "Do",
        options: ["Do", "Does", "Don't", "Doesn't"],
        solutionHtml: "Chủ ngữ là 'the children' (danh từ số nhiều), câu hỏi Yes/No ở thì hiện tại đơn cần dùng trợ động từ <b>'Do'</b> đứng đầu."
    },
    {
        type: "choice",
        questionText: "Lynn’s father watches badminton on TV, but he _________ watch judo. (Chọn trợ động từ phù hợp)",
        correctAnswer: "doesn't",
        options: ["doesn't", "don't", "does", "do"],
        solutionHtml: "Chủ ngữ là 'he' (ngôi thứ ba số ít), câu phủ định dùng <b>'doesn't'</b>."
    },
    {
        type: "choice",
        questionText: "Where _________ the Masons buy their fruits? (Chọn trợ động từ phù hợp)",
        correctAnswer: "do",
        options: ["do", "does", "don't", "doesn't"],
        solutionHtml: "Chủ ngữ là 'the Masons' (gia đình nhà Mason - số nhiều), câu hỏi dùng trợ động từ <b>'do'</b>."
    },
    {
        type: "choice",
        questionText: "_________ the cat like to sleep on the sofa? (Chọn trợ động từ phù hợp)",
        correctAnswer: "Does",
        options: ["Does", "Do", "Doesn't", "Don't"],
        solutionHtml: "Chủ ngữ là 'the cat' (số ít), câu hỏi Yes/No dùng trợ động từ <b>'Does'</b>."
    },
    {
        type: "choice",
        questionText: "Dogs love bones, but they _________ love cheese. (Chọn trợ động từ phù hợp)",
        correctAnswer: "don't",
        options: ["don't", "doesn't", "do", "does"],
        solutionHtml: "Chủ ngữ là 'they' (số nhiều), câu phủ định dùng <b>'don't'</b>."
    },
    {
        type: "choice",
        questionText: "Where _________ Sam and Ben hide their pocket money? (Chọn trợ động từ phù hợp)",
        correctAnswer: "do",
        options: ["do", "does", "don't", "doesn't"],
        solutionHtml: "Sam and Ben là chủ ngữ số nhiều (2 người), câu hỏi Wh- dùng trợ động từ <b>'do'</b>."
    },
    {
        type: "choice",
        questionText: "We eat pizza, but we _________ eat hamburgers. (Chọn trợ động từ phù hợp)",
        correctAnswer: "don't",
        options: ["don't", "doesn't", "do", "does"],
        solutionHtml: "Chủ ngữ là 'we' (số nhiều), câu phủ định dùng <b>'don't'</b>."
    },
    {
        type: "choice",
        questionText: "_________ Mrs. Miller read magazines? (Chọn trợ động từ phù hợp)",
        correctAnswer: "Does",
        options: ["Does", "Do", "Doesn't", "Don't"],
        solutionHtml: "Mrs. Miller là chủ ngữ số ít, câu hỏi Yes/No dùng trợ động từ <b>'Does'</b>."
    },
    {
        type: "choice",
        questionText: "_________ the boys play cricket outside? (Chọn trợ động từ phù hợp)",
        correctAnswer: "Do",
        options: ["Do", "Does", "Don't", "Doesn't"],
        solutionHtml: "Chủ ngữ là 'the boys' (số nhiều), câu hỏi dùng trợ động từ <b>'Do'</b>."
    },
    {
        type: "choice",
        questionText: "Please _________ play with my food. (Chọn từ phù hợp)",
        correctAnswer: "don't",
        options: ["don't", "doesn't", "not", "no"],
        solutionHtml: "Cấu trúc câu mệnh lệnh phủ định (yêu cầu ai đó không làm gì): <b>'Please don't + V'</b>."
    },
    {
        type: "choice",
        questionText: "She _________ the cleaning three times a week. (Chọn dạng đúng của động từ do)",
        correctAnswer: "does",
        options: ["does", "do", "doing", "did"],
        solutionHtml: "Chủ ngữ là 'She' (số ít), động từ 'do' tận cùng là 'o' nên thêm 'es' thành <b>'does'</b>."
    },
    {
        type: "choice",
        questionText: "We _________ go out very much because we have a baby. (Chọn trợ động từ phù hợp)",
        correctAnswer: "don't",
        options: ["don't", "doesn't", "not", "no"],
        solutionHtml: "Chủ ngữ là 'We' (số nhiều), câu phủ định dùng trợ động từ <b>'don't'</b>."
    },
    {
        type: "choice",
        questionText: "I _________ want to talk about my neighborhood any more. (Chọn trợ động từ phù hợp)",
        correctAnswer: "don't",
        options: ["don't", "doesn't", "do", "does"],
        solutionHtml: "Chủ ngữ là 'I' dùng trợ động từ phủ định <b>'don't'</b>."
    },
    {
        type: "choice",
        questionText: "How much _________ it cost to phone overseas? (Chọn trợ động từ phù hợp)",
        correctAnswer: "does",
        options: ["does", "do", "don't", "doesn't"],
        solutionHtml: "Chủ ngữ là 'it' (ngôi thứ ba số ít), câu hỏi Wh- dùng trợ động từ <b>'does'</b>."
    },
    {
        type: "choice",
        questionText: "We sometimes _________ books. (Chọn dạng đúng của động từ)",
        correctAnswer: "read",
        options: ["read", "reads", "reading", "to read"],
        solutionHtml: "Chủ ngữ là 'We' (số nhiều), động từ ở thì hiện tại đơn giữ nguyên: <b>'read'</b>."
    },
    {
        type: "choice",
        questionText: "Emily _________ to the art club. (Chọn dạng đúng của động từ)",
        correctAnswer: "goes",
        options: ["goes", "go", "going", "went"],
        solutionHtml: "Emily là chủ ngữ số ít, động từ 'go' tận cùng là 'o' thêm 'es' thành <b>'goes'</b>."
    },
    {
        type: "choice",
        questionText: "It often _________ on Sundays. (Chọn dạng đúng của động từ)",
        correctAnswer: "rains",
        options: ["rains", "rain", "raining", "rained"],
        solutionHtml: "Chủ ngữ 'It' số ít, động từ 'rain' thêm 's' thành <b>'rains'</b>."
    },
    {
        type: "choice",
        questionText: "Pete and his sister _________ the family car. (Chọn dạng đúng của động từ)",
        correctAnswer: "wash",
        options: ["wash", "washes", "washing", "washed"],
        solutionHtml: "Pete and his sister là chủ ngữ số nhiều (2 người), động từ giữ nguyên: <b>'wash'</b>."
    },
    {
        type: "choice",
        questionText: "I always _________ to the bus stop. (Chọn dạng đúng của động từ)",
        correctAnswer: "hurry",
        options: ["hurry", "hurries", "hurrying", "hurried"],
        solutionHtml: "Chủ ngữ là 'I' động từ giữ nguyên ở thì hiện tại đơn: <b>'hurry'</b>."
    },
    {
        type: "choice",
        questionText: "She _________ four languages. (Chọn dạng đúng của động từ)",
        correctAnswer: "speaks",
        options: ["speaks", "speak", "speaking", "spoke"],
        solutionHtml: "Chủ ngữ là 'She' số ít, động từ 'speak' thêm 's' thành <b>'speaks'</b>."
    },
    {
        type: "choice",
        questionText: "Jane is a teacher. She _________ English. (Chọn dạng đúng của động từ)",
        correctAnswer: "teaches",
        options: ["teaches", "teach", "teaching", "teacher"],
        solutionHtml: "Chủ ngữ là 'She' số ít, động từ 'teach' tận cùng là 'ch' thêm 'es' thành <b>'teaches'</b>."
    },
    {
        type: "choice",
        questionText: "Those shoes _________ too much. (Chọn dạng đúng của động từ)",
        correctAnswer: "cost",
        options: ["cost", "costs", "costing", "costed"],
        solutionHtml: "Chủ ngữ 'Those shoes' là danh từ số nhiều, động từ giữ nguyên: <b>'cost'</b>."
    },
    {
        type: "choice",
        questionText: "My sister _________ to the library once a week. (Chọn dạng đúng của động từ)",
        correctAnswer: "goes",
        options: ["goes", "go", "going", "goes to"],
        solutionHtml: "Chủ ngữ 'My sister' số ít, động từ 'go' thêm 'es' thành <b>'goes'</b>."
    },
    {
        type: "choice",
        questionText: "We both _________ to the radio in the morning. (Chọn dạng đúng của động từ)",
        correctAnswer: "listen",
        options: ["listen", "listens", "listening", "listened"],
        solutionHtml: "Chủ ngữ 'We' số nhiều, động từ giữ nguyên: <b>'listen'</b>."
    },
    {
        type: "choice",
        questionText: "They ________ hockey at school. (Chọn dạng đúng của động từ)",
        correctAnswer: "play",
        options: ["play", "plays", "playing", "played"],
        solutionHtml: "Chủ ngữ 'They' số nhiều, động từ ở hiện tại đơn giữ nguyên: <b>'play'</b>."
    },
    {
        type: "choice",
        questionText: "She ________ poems. (Chọn dạng đúng của động từ)",
        correctAnswer: "doesn't write",
        options: ["doesn't write", "don't write", "not write", "doesn't writes"],
        solutionHtml: "Chủ ngữ 'She' số ít, câu phủ định động từ thường dùng <b>'doesn't + V nguyên thể'</b>."
    },
    {
        type: "choice",
        questionText: "_________ you _________ English? (Chọn dạng đúng của động từ)",
        correctAnswer: "Do - speak",
        options: ["Do - speak", "Does - speak", "Do - speaks", "Does - speaks"],
        solutionHtml: "Chủ ngữ 'you' dùng trợ động từ <b>'Do'</b> và động từ giữ nguyên mẫu <b>'speak'</b>."
    },
    {
        type: "choice",
        questionText: "My parents _________ fish. (Chọn dạng đúng của động từ)",
        correctAnswer: "don't like",
        options: ["don't like", "doesn't like", "not like", "don't likes"],
        solutionHtml: "Chủ ngữ 'My parents' số nhiều, câu phủ định dùng <b>'don't + V'</b>."
    },
    {
        type: "choice",
        questionText: "_________ Ann _________ any hobbies? (Chọn dạng đúng của động từ)",
        correctAnswer: "Does - have",
        options: ["Does - have", "Does - has", "Do - have", "Do - has"],
        solutionHtml: "Ann là chủ ngữ số ít, câu hỏi dùng trợ động từ <b>'Does'</b> và động từ nguyên thể <b>'have'</b>."
    },
    {
        type: "choice",
        questionText: "Andy’s brother _________ in a big building. (Chọn dạng đúng của động từ)",
        correctAnswer: "works",
        options: ["works", "work", "working", "worked"],
        solutionHtml: "Chủ ngữ 'Andy's brother' số ít, động từ 'work' thêm 's' thành <b>'works'</b>."
    },
    {
        type: "choice",
        questionText: "_________ Jim and Joe _________ the flowers every week? (Chọn dạng đúng của động từ)",
        correctAnswer: "Do - water",
        options: ["Do - water", "Does - water", "Do - waters", "Does - waters"],
        solutionHtml: "Jim and Joe là chủ ngữ số nhiều (2 người), câu hỏi dùng <b>'Do'</b> và động từ nguyên thể <b>'water'</b>."
    },
    {
        type: "choice",
        questionText: "Yvonne’s mother _________ a motorbike. (Chọn dạng đúng của động từ)",
        correctAnswer: "doesn't ride",
        options: ["doesn't ride", "don't ride", "not ride", "doesn't rides"],
        solutionHtml: "Chủ ngữ 'Yvonne's mother' số ít, phủ định dùng trợ động từ <b>'doesn't'</b> và động từ nguyên mẫu <b>'ride'</b>."
    },
    {
        type: "choice",
        questionText: "_________ Elisabeth _________ the door? (Chọn dạng đúng của động từ)",
        correctAnswer: "Does - knock",
        options: ["Does - knock", "Do - knock", "Does - knocks", "Do - knocks"],
        solutionHtml: "Elisabeth là chủ ngữ số ít, câu hỏi dùng trợ động từ <b>'Does'</b> và động từ nguyên mẫu <b>'knock'</b>."
    },
    {
        type: "choice",
        questionText: "What _________ you _________ in the school canteen? (Chọn dạng đúng của động từ)",
        correctAnswer: "do - buy",
        options: ["do - buy", "does - buy", "do - buys", "does - buys"],
        solutionHtml: "Chủ ngữ là 'you', câu hỏi Wh- dùng trợ động từ <b>'do'</b> và động từ nguyên mẫu <b>'buy'</b>."
    }
];

const ENG6_T1_WRITING_GRAMMAR_QUESTIONS = [
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp trạng từ tần suất vào đúng vị trí)<br/><i>Ý nghĩa: Anh ấy thỉnh thoảng chơi gôn vào các ngày Chủ nhật.</i>",
        correctAnswer: "He sometimes plays golf on Sundays.",
        wordPool: ["He", "sometimes", "plays", "golf", "on", "Sundays."],
        solutionHtml: "Trạng từ chỉ tần suất 'sometimes' đứng trước động từ thường 'plays'."
    },
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp trạng từ tần suất vào đúng vị trí)<br/><i>Ý nghĩa: Thời tiết luôn xấu vào tháng Mười một.</i>",
        correctAnswer: "The weather is always bad in November.",
        wordPool: ["The", "weather", "is", "always", "bad", "in", "November."],
        solutionHtml: "Trạng từ chỉ tần suất 'always' đứng sau động từ tobe 'is'."
    },
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp trạng từ tần suất vào đúng vị trí)<br/><i>Ý nghĩa: Chúng tôi hiếm khi ăn cá vào bữa tối.</i>",
        correctAnswer: "We seldom have fish for dinner.",
        wordPool: ["We", "seldom", "have", "fish", "for", "dinner."],
        solutionHtml: "Trạng từ chỉ tần suất 'seldom' đứng trước động từ thường 'have'."
    },
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp trạng từ tần suất vào đúng vị trí)<br/><i>Ý nghĩa: Peter thường không thức dậy trước 7 giờ.</i>",
        correctAnswer: "Peter doesn't usually get up before seven.",
        wordPool: ["Peter", "doesn't", "usually", "get", "up", "before", "seven."],
        solutionHtml: "Trạng từ chỉ tần suất 'usually' đứng trước động từ thường 'get up' và sau trợ động từ 'doesn't'."
    },
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp trạng từ tần suất vào đúng vị trí)<br/><i>Ý nghĩa: Họ không bao giờ xem TV vào buổi chiều.</i>",
        correctAnswer: "They never watch TV in the afternoon.",
        wordPool: ["They", "never", "watch", "TV", "in", "the", "afternoon."],
        solutionHtml: "Trạng từ chỉ tần suất 'never' đứng trước động từ thường 'watch'."
    },
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp trạng từ tần suất vào đúng vị trí)<br/><i>Ý nghĩa: Anh trai tôi, Tony, hiếm khi đi phỏng vấn muộn.</i>",
        correctAnswer: "My brother Tony is rarely late for interview.",
        wordPool: ["My", "brother", "Tony", "is", "rarely", "late", "for", "interview."],
        solutionHtml: "Trạng từ chỉ tần suất 'rarely' đứng sau động từ tobe 'is'."
    },
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp trạng từ tần suất vào đúng vị trí)<br/><i>Ý nghĩa: Anh ấy luôn giúp đỡ bố mình.</i>",
        correctAnswer: "He always helps his father.",
        wordPool: ["He", "always", "helps", "his", "father."],
        solutionHtml: "Trạng từ chỉ tần suất 'always' đứng trước động từ thường 'helps'."
    },
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp từ thành câu hỏi đúng)<br/><i>Ý nghĩa: Bạn có thường đi mua sắm không?</i>",
        correctAnswer: "How often do you go shopping?",
        wordPool: ["How", "often", "do", "you", "go", "shopping?"],
        solutionHtml: "Cấu trúc hỏi tần suất: 'How often + do/does + S + V?'"
    },
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp trạng từ tần suất vào đúng vị trí)<br/><i>Ý nghĩa: Tôi hiếm khi làm bài tập về nhà sau giờ học.</i>",
        correctAnswer: "I hardly do my homework after school.",
        wordPool: ["I", "hardly", "do", "my", "homework", "after", "school."],
        solutionHtml: "Trạng từ chỉ tần suất 'hardly' đứng trước động từ thường 'do'."
    },
    {
        type: "writing",
        questionText: "Put the words in the correct order to make a sentence: (Sắp xếp trạng từ tần suất vào đúng vị trí)<br/><i>Ý nghĩa: Xe buýt trường học đến lúc 7 giờ mỗi ngày.</i>",
        correctAnswer: "The school bus arrives at seven every day.",
        wordPool: ["The", "school", "bus", "arrives", "at", "seven", "every", "day."],
        solutionHtml: "Cụm từ chỉ tần suất 'every day' đứng cuối câu."
    },
    {
        type: "writing_completion",
        questionText: "Write the correct present simple form of the verb 'have' (cho chủ ngữ he/she/it): (Viết dạng chia đúng của động từ)",
        correctAnswer: "has",
        solutionHtml: "Động từ 'have' biến đổi thành bất quy tắc <b>'has'</b> ở ngôi thứ ba số ít."
    },
    {
        type: "writing_completion",
        questionText: "Write the correct present simple form of the verb 'try' (cho chủ ngữ he/she/it): (Viết dạng chia đúng của động từ)",
        correctAnswer: "tries",
        solutionHtml: "Động từ 'try' tận cùng là 'y' đi sau phụ âm 'r', ta đổi 'y' thành 'ies' ➔ <b>'tries'</b>."
    },
    {
        type: "writing_completion",
        questionText: "Write the correct present simple form of the verb 'go' (cho chủ ngữ he/she/it): (Viết dạng chia đúng của động từ)",
        correctAnswer: "goes",
        solutionHtml: "Động từ 'go' tận cùng là 'o', ta thêm 'es' ➔ <b>'goes'</b>."
    },
    {
        type: "writing_completion",
        questionText: "Write the correct present simple form of the verb 'do' (cho chủ ngữ he/she/it): (Viết dạng chia đúng của động từ)",
        correctAnswer: "does",
        solutionHtml: "Động từ 'do' tận cùng là 'o', ta thêm 'es' ➔ <b>'does'</b>."
    }
];

// ==========================================================================
// KHO CÂU HỎI NGỮ PHÁP CHUYÊN ĐỀ PHỤ VỤ TÍCH HỢP TOÀN DIỆN CHO TẤT CẢ CÁC UNIT
// ==========================================================================
const ENGLISH_GRAMMAR_TOPIC_QUESTIONS = {
    "to_be": [
        {
            type: "choice",
            questionText: "Hello! My name _________ Linh. (Chọn động từ To Be phù hợp)",
            correctAnswer: "is",
            options: ["is", "am", "are", "be"],
            solutionHtml: "My name là danh từ số ít ngôi thứ ba, đi với động từ tobe là <b>'is'</b>."
        },
        {
            type: "choice",
            questionText: "How _________ you today? - I am fine, thank you. (Chọn từ phù hợp)",
            correctAnswer: "are",
            options: ["are", "is", "am", "be"],
            solutionHtml: "Chủ ngữ là 'you' đi với động từ tobe <b>'are'</b> trong câu hỏi thăm sức khỏe."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Họ là học sinh mới.</i>",
            correctAnswer: "They are new students.",
            wordPool: ["They", "are", "new", "students."],
            solutionHtml: "Cấu trúc: S + tobe + adj + noun. Họ là học sinh mới."
        },
        {
            type: "choice",
            questionText: "We _________ happy to learn English together. (Chọn động từ phù hợp)",
            correctAnswer: "are",
            options: ["are", "is", "am", "be"],
            solutionHtml: "Chủ ngữ 'We' (chúng tôi - số nhiều) đi với động từ tobe <b>'are'</b>."
        }
    ],
    "articles": [
        {
            type: "choice",
            questionText: "This is _________ book. (Chọn mạo từ phù hợp)",
            correctAnswer: "a",
            options: ["a", "an", "the", "some"],
            solutionHtml: "Danh từ 'book' bắt đầu bằng phụ âm 'b' nên dùng mạo từ <b>'a'</b>."
        },
        {
            type: "choice",
            questionText: "Do you have _________ apple? (Chọn mạo từ phù hợp)",
            correctAnswer: "an",
            options: ["an", "a", "the", "any"],
            solutionHtml: "Danh từ 'apple' bắt đầu bằng nguyên âm 'a' nên dùng mạo từ <b>'an'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp các từ thành câu đúng)<br/><i>Ý nghĩa: Tôi có một cục tẩy màu xanh lá cây.</i>",
            correctAnswer: "I have a green eraser.",
            wordPool: ["I", "have", "a", "green", "eraser."],
            solutionHtml: "Mạo từ 'a' đứng trước tính từ 'green' bổ nghĩa cho danh từ 'eraser'."
        },
        {
            type: "choice",
            questionText: "My father is _________ English teacher. (Chọn mạo từ phù hợp)",
            correctAnswer: "an",
            options: ["an", "a", "the", "one"],
            solutionHtml: "English bắt đầu bằng nguyên âm 'E' (/ɪ/), nên dùng mạo từ <b>'an'</b>."
        }
    ],
    "demonstratives": [
        {
            type: "choice",
            questionText: "Look at _________ birds up there in the sky! (Chọn từ phù hợp)",
            correctAnswer: "those",
            options: ["those", "these", "this", "that"],
            solutionHtml: "Birds là số nhiều và ở xa (up there in the sky) nên dùng từ chỉ định <b>'those'</b>."
        },
        {
            type: "choice",
            questionText: "Is _________ your pen here? - Yes, it is. (Chọn từ phù hợp)",
            correctAnswer: "this",
            options: ["this", "that", "these", "those"],
            solutionHtml: "Vật ở gần (here) và là số ít nên dùng chỉ định từ <b>'this'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Đây là những cuốn sách của tôi.</i>",
            correctAnswer: "These are my books.",
            wordPool: ["These", "are", "my", "books."],
            solutionHtml: "Cấu trúc chỉ định số nhiều ở gần: These are + danh từ số nhiều."
        },
        {
            type: "choice",
            questionText: "_________ pencil in my hand is yellow. (Chọn từ phù hợp)",
            correctAnswer: "This",
            options: ["This", "That", "These", "Those"],
            solutionHtml: "Cái bút chì ở gần (in my hand - trong tay tôi) số ít nên dùng <b>'This'</b>."
        }
    ],
    "plural_nouns": [
        {
            type: "choice",
            questionText: "How many _________ are there on the desk? (Chọn từ phù hợp)",
            correctAnswer: "books",
            options: ["books", "book", "a book", "books-style"],
            solutionHtml: "Sau cấu trúc 'How many' phải là danh từ đếm được số nhiều: <b>'books'</b>."
        },
        {
            type: "choice",
            questionText: "There are three _________ in the room. (Chọn từ phù hợp)",
            correctAnswer: "children",
            options: ["children", "childs", "child", "childrens"],
            solutionHtml: "Danh từ số nhiều bất quy tắc của 'child' là <b>'children'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp các từ thành câu đúng)<br/><i>Ý nghĩa: Có 5 cái bút màu đỏ trên bàn.</i>",
            correctAnswer: "There are five red pens on the desk.",
            wordPool: ["There", "are", "five", "red", "pens", "on", "the", "desk."],
            solutionHtml: "Cấu trúc: There are + [số lượng] + [tính từ] + [danh từ số nhiều] + [vị trí]."
        },
        {
            type: "choice",
            questionText: "He has four _________ (Chọn từ phù hợp)",
            correctAnswer: "boxes",
            options: ["boxes", "boxs", "boxes-style", "box"],
            solutionHtml: "Danh từ 'box' tận cùng là 'x', khi chuyển sang số nhiều ta thêm 'es' thành <b>'boxes'</b>."
        }
    ],
    "possessive": [
        {
            type: "choice",
            questionText: "I am a student. _________ name is Bill. (Chọn tính từ sở hữu phù hợp)",
            correctAnswer: "My",
            options: ["My", "I", "Mine", "Me"],
            solutionHtml: "Chủ ngữ là 'I' thì tính từ sở hữu tương ứng bổ nghĩa cho danh từ name là <b>'My'</b>."
        },
        {
            type: "choice",
            questionText: "She likes _________ school very much. (Chọn tính từ sở hữu phù hợp)",
            correctAnswer: "her",
            options: ["her", "his", "your", "its"],
            solutionHtml: "Chủ ngữ là 'She' (cô ấy) thì dùng tính từ sở hữu tương ứng là <b>'her'</b> (của cô ấy)."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp các từ thành câu đúng)<br/><i>Ý nghĩa: Tên của bạn là gì?</i>",
            correctAnswer: "What is your name?",
            wordPool: ["What", "is", "your", "name?"],
            solutionHtml: "Câu hỏi tên: What + is + tính từ sở hữu + name?"
        },
        {
            type: "choice",
            questionText: "He lives with _________ parents in the city. (Chọn tính từ sở hữu phù hợp)",
            correctAnswer: "his",
            options: ["his", "him", "he", "her"],
            solutionHtml: "Chủ ngữ là 'He' (anh ấy) thì tính từ sở hữu là <b>'his'</b> (của anh ấy)."
        }
    ],
    "modal_can": [
        {
            type: "choice",
            questionText: "A bird _________ fly, but a dog cannot. (Chọn động từ phù hợp)",
            correctAnswer: "can",
            options: ["can", "cannot", "must", "should"],
            solutionHtml: "Chim biết bay (chỉ khả năng) nên dùng động từ khuyết thiếu <b>'can'</b>."
        },
        {
            type: "choice",
            questionText: "_________ you swim? - Yes, I can. (Chọn từ phù hợp)",
            correctAnswer: "Can",
            options: ["Can", "Do", "Are", "Will"],
            solutionHtml: "Câu trả lời kết thúc bằng 'I can', nên câu hỏi bắt đầu bằng động từ khuyết thiếu <b>'Can'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Tôi có thể chơi đàn guitar.</i>",
            correctAnswer: "I can play the guitar.",
            wordPool: ["I", "can", "play", "the", "guitar."],
            solutionHtml: "Cấu trúc: S + can + V nguyên mẫu + O. Tôi có thể chơi guitar."
        },
        {
            type: "choice",
            questionText: "They _________ speak English very well. (Chọn từ phù hợp)",
            correctAnswer: "can",
            options: ["can", "are", "do", "must"],
            solutionHtml: "Diễn đạt khả năng nói tiếng Anh trôi chảy dùng trợ động từ khuyết thiếu <b>'can'</b>."
        }
    ],
    "like_ving": [
        {
            type: "choice",
            questionText: "She likes _________ to music in her free time. (Chọn từ phù hợp)",
            correctAnswer: "listening",
            options: ["listening", "listen", "to listening", "listened"],
            solutionHtml: "Sau động từ chỉ sở thích 'like' ta dùng động từ thêm đuôi -ing: <b>'listening'</b>."
        },
        {
            type: "choice",
            questionText: "Do you like _________ football? (Chọn từ phù hợp)",
            correctAnswer: "playing",
            options: ["playing", "plays", "play", "played"],
            solutionHtml: "Cấu trúc hỏi sở thích: Like + V-ing ➔ <b>'playing'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp các từ thành câu đúng)<br/><i>Ý nghĩa: Chúng tôi thích học tiếng Anh.</i>",
            correctAnswer: "We like learning English.",
            wordPool: ["We", "like", "learning", "English."],
            solutionHtml: "Cấu trúc: S + like + V-ing + O. Chúng tôi thích học tiếng Anh."
        },
        {
            type: "choice",
            questionText: "My brother likes _________ books. (Chọn từ phù hợp)",
            correctAnswer: "reading",
            options: ["reading", "read", "reads", "to reading"],
            solutionHtml: "Thích đọc sách: likes + V-ing ➔ <b>'reading'</b>."
        }
    ],
    "present_continuous": [
        {
            type: "choice",
            questionText: "Look! The children _________ in the garden. (Chọn dạng động từ phù hợp)",
            correctAnswer: "are playing",
            options: ["are playing", "is playing", "play", "played"],
            solutionHtml: "Câu có từ nhận biết 'Look!' chỉ hành động đang diễn ra. Chủ ngữ 'The children' số nhiều nên chia <b>'are playing'</b>."
        },
        {
            type: "choice",
            questionText: "She _________ a blue dress today. (Chọn dạng động từ phù hợp)",
            correctAnswer: "is wearing",
            options: ["is wearing", "wear", "wears", "are wearing"],
            solutionHtml: "Diễn tả hành động mặc đồ hôm nay (hành động tạm thời) dùng thì Hiện tại tiếp diễn: <b>'is wearing'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Bây giờ bạn đang làm gì thế?</i>",
            correctAnswer: "What are you doing now?",
            wordPool: ["What", "are", "you", "doing", "now?"],
            solutionHtml: "Cấu trúc câu hỏi thì Hiện tại tiếp diễn: Wh- + am/is/are + S + V-ing + now?"
        },
        {
            type: "choice",
            questionText: "What _________ he doing now? - He is reading. (Chọn từ phù hợp)",
            correctAnswer: "is",
            options: ["is", "are", "am", "does"],
            solutionHtml: "Chủ ngữ 'he' số ít đi kèm trợ động từ <b>'is'</b> trong thì Hiện tại tiếp diễn."
        }
    ],
    "prepositions_place": [
        {
            type: "choice",
            questionText: "The book is _________ the table. (Chọn giới từ phù hợp)",
            correctAnswer: "on",
            options: ["on", "in", "under", "next"],
            solutionHtml: "Quyển sách nằm trên bề mặt bàn nên dùng giới từ <b>'on'</b>."
        },
        {
            type: "choice",
            questionText: "There is a big tree _________ of my house. (Chọn giới từ phù hợp)",
            correctAnswer: "in front",
            options: ["in front", "behind", "next to", "opposite"],
            solutionHtml: "Đi kèm với 'of' tạo thành cụm giới từ chỉ vị trí phía trước là: <b>'in front of'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Con mèo ở dưới cái ghế.</i>",
            correctAnswer: "The cat is under the chair.",
            wordPool: ["The", "cat", "is", "under", "the", "chair."],
            solutionHtml: "Cấu trúc miêu tả vị trí: S + tobe + giới từ chỉ vị trí + the + danh từ."
        },
        {
            type: "choice",
            questionText: "The library is _________ to the classroom. (Chọn giới từ phù hợp)",
            correctAnswer: "next",
            options: ["next", "near", "opposite", "behind"],
            solutionHtml: "Giới từ đi với 'to' để chỉ bên cạnh là: <b>'next to'</b>."
        }
    ],
    "present_simple_verbs": [
        {
            type: "choice",
            questionText: "He _________ to school every day. (Chọn dạng động từ phù hợp)",
            correctAnswer: "goes",
            options: ["goes", "go", "going", "went"],
            solutionHtml: "Thì hiện tại đơn chỉ thói quen 'every day', chủ ngữ 'He' số ít nên động từ 'go' thêm 'es' thành <b>'goes'</b>."
        },
        {
            type: "choice",
            questionText: "They _________ like chocolate. (Chọn trợ động từ phủ định phù hợp)",
            correctAnswer: "don't",
            options: ["don't", "doesn't", "not", "no"],
            solutionHtml: "Chủ ngữ 'They' số nhiều, câu phủ định thì hiện tại đơn dùng trợ động từ <b>'don't'</b>."
        },
        {
            type: "choice",
            questionText: "_________ she watch TV in the evening? (Chọn trợ động từ phù hợp)",
            correctAnswer: "Does",
            options: ["Does", "Do", "Is", "Are"],
            solutionHtml: "Câu hỏi Yes/No chủ ngữ 'she' số ít, động từ thường 'watch' nên dùng trợ động từ <b>'Does'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp các từ thành câu đúng)<br/><i>Ý nghĩa: Chúng tôi ăn sáng lúc 6 giờ.</i>",
            correctAnswer: "We have breakfast at six o'clock.",
            wordPool: ["We", "have", "breakfast", "at", "six", "o'clock."],
            solutionHtml: "Cấu trúc: S + V + O + cụm thời gian. We have breakfast at six o'clock."
        },
        {
            type: "choice",
            questionText: "She _________ her homework after school. (Chọn dạng động từ do phù hợp)",
            correctAnswer: "does",
            options: ["does", "do", "doing", "did"],
            solutionHtml: "Chủ ngữ 'She' số ít, động từ 'do' chia ở hiện tại đơn thành <b>'does'</b>."
        }
    ],
    "adverbs_frequency": [
        {
            type: "choice",
            questionText: "He is _________ late for school. He is a good student. (Chọn trạng từ tần suất phù hợp)",
            correctAnswer: "never",
            options: ["never", "always", "sometimes", "usually"],
            solutionHtml: "Học sinh giỏi thì không bao giờ đi học muộn, chọn trạng từ chỉ tần suất phủ định tuyệt đối: <b>'never'</b>."
        },
        {
            type: "choice",
            questionText: "How _________ do you go swimming? - Twice a week. (Chọn từ phù hợp)",
            correctAnswer: "often",
            options: ["often", "sometimes", "usually", "never"],
            solutionHtml: "Câu hỏi về tần suất: <b>'How often + do/does + S + V?'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Anh ấy luôn luôn giúp đỡ mẹ mình.</i>",
            correctAnswer: "He always helps his mother.",
            wordPool: ["He", "always", "helps", "his", "mother."],
            solutionHtml: "Trạng từ chỉ tần suất 'always' đứng trước động từ thường 'helps'."
        },
        {
            type: "choice",
            questionText: "We _________ play football on Sundays. (Chọn trạng từ phù hợp)",
            correctAnswer: "usually",
            options: ["usually", "are", "did", "have"],
            solutionHtml: "Trạng từ tần suất chỉ thói quen thường xuyên đứng trước động từ thường: <b>'usually'</b>."
        }
    ],
    "prepositions_time": [
        {
            type: "choice",
            questionText: "My birthday is _________ January. (Chọn giới từ phù hợp)",
            correctAnswer: "in",
            options: ["in", "on", "at", "to"],
            solutionHtml: "Trước các tháng trong năm dùng giới từ <b>'in'</b>."
        },
        {
            type: "choice",
            questionText: "We have English class _________ Mondays. (Chọn giới từ phù hợp)",
            correctAnswer: "on",
            options: ["on", "in", "at", "by"],
            solutionHtml: "Trước các thứ trong tuần dùng giới từ <b>'on'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp các từ thành câu đúng)<br/><i>Ý nghĩa: Tôi thức dậy lúc 6 giờ.</i>",
            correctAnswer: "I get up at six o'clock.",
            wordPool: ["I", "get", "up", "at", "six", "o'clock."],
            solutionHtml: "Trước giờ chẵn cụ thể ta dùng giới từ chỉ thời gian là <b>'at'</b>."
        },
        {
            type: "choice",
            questionText: "He watches TV _________ the evening. (Chọn giới từ phù hợp)",
            correctAnswer: "in",
            options: ["in", "on", "at", "to"],
            solutionHtml: "Cụm từ chỉ các buổi trong ngày: <b>'in the evening'</b>."
        }
    ],
    "should_shouldn't": [
        {
            type: "choice",
            questionText: "You _________ eat too much candy. It's bad for your teeth. (Chọn từ khuyên bảo phù hợp)",
            correctAnswer: "shouldn't",
            options: ["shouldn't", "should", "must", "can"],
            solutionHtml: "Ăn kẹo nhiều có hại cho răng nên khuyên không nên làm: <b>'shouldn't'</b>."
        },
        {
            type: "choice",
            questionText: "He has a cough. He _________ see a doctor. (Chọn từ khuyên bảo phù hợp)",
            correctAnswer: "should",
            options: ["should", "shouldn't", "can't", "mustn't"],
            solutionHtml: "Bị ho thì khuyên nên đi khám bác sĩ, dùng động từ khuyết thiếu đưa ra lời khuyên: <b>'should'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Bạn nên đánh răng mỗi ngày.</i>",
            correctAnswer: "You should brush your teeth every day.",
            wordPool: ["You", "should", "brush", "your", "teeth", "every", "day."],
            solutionHtml: "Cấu trúc khuyên bảo: S + should + V nguyên mẫu + O. Bạn nên đánh răng mỗi ngày."
        },
        {
            type: "choice",
            questionText: "What _________ I do to keep fit? (Chọn từ phù hợp)",
            correctAnswer: "should",
            options: ["should", "must", "can", "am"],
            solutionHtml: "Hỏi xin lời khuyên: 'What should + S + V?' ➔ dùng <b>'should'</b>."
        }
    ],
    "past_simple": [
        {
            type: "choice",
            questionText: "We _________ at home yesterday. (Chọn động từ To Be quá khứ phù hợp)",
            correctAnswer: "were",
            options: ["were", "was", "are", "been"],
            solutionHtml: "Thời gian quá khứ 'yesterday', chủ ngữ 'We' số nhiều nên dùng tobe quá khứ là <b>'were'</b>."
        },
        {
            type: "choice",
            questionText: "He _________ his homework last night. (Chọn dạng động từ do quá khứ)",
            correctAnswer: "did",
            options: ["did", "does", "do", "done"],
            solutionHtml: "Thời gian quá khứ 'last night', động từ 'do' biến đổi thành quá khứ là <b>'did'</b>."
        },
        {
            type: "choice",
            questionText: "She _________ a new book last week. (Chọn dạng động từ buy quá khứ)",
            correctAnswer: "bought",
            options: ["bought", "buy", "buys", "buying"],
            solutionHtml: "Động từ bất quy tắc 'buy' chuyển sang quá khứ đơn là <b>'bought'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Họ không đi học ngày hôm qua.</i>",
            correctAnswer: "They did not go to school yesterday.",
            wordPool: ["They", "did", "not", "go", "to", "school", "yesterday."],
            solutionHtml: "Câu phủ định quá khứ đơn: S + did + not + V-inf. Họ không đi học hôm qua."
        }
    ],
    "comparatives": [
        {
            type: "choice",
            questionText: "My house is _________ than your house. (Chọn tính từ so sánh phù hợp)",
            correctAnswer: "bigger",
            options: ["bigger", "big", "more big", "biggest"],
            solutionHtml: "So sánh hơn của tính từ ngắn 'big' nhân đôi phụ âm cuối 'g' thêm 'er' thành <b>'bigger'</b>."
        },
        {
            type: "choice",
            questionText: "This book is _________ than that book. (Chọn tính từ so sánh phù hợp)",
            correctAnswer: "more interesting",
            options: ["more interesting", "interesting", "interestinger", "most interesting"],
            solutionHtml: "Interesting là tính từ dài, cấu trúc so sánh hơn: <b>'more + tính từ dài + than'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Đọc sách tốt hơn chơi trò chơi.</i>",
            correctAnswer: "Reading books is better than playing games.",
            wordPool: ["Reading", "books", "is", "better", "than", "playing", "games."],
            solutionHtml: "So sánh hơn bất quy tắc của tính từ 'good/well' là <b>'better'</b>."
        },
        {
            type: "choice",
            questionText: "He is _________ than his brother. (Chọn tính từ so sánh phù hợp)",
            correctAnswer: "taller",
            options: ["taller", "tall", "more tall", "tallest"],
            solutionHtml: "So sánh hơn của tính từ ngắn 'tall' là <b>'taller'</b>."
        }
    ],
    "future_plans": [
        {
            type: "choice",
            questionText: "We _________ going to visit Hanoi next summer. (Chọn động từ phù hợp)",
            correctAnswer: "are",
            options: ["are", "is", "am", "will"],
            solutionHtml: "Cấu trúc tương lai gần 'be going to V', chủ ngữ 'We' số nhiều đi với động từ tobe <b>'are'</b>."
        },
        {
            type: "choice",
            questionText: "What _________ you do tomorrow? - I will stay at home. (Chọn trợ động từ phù hợp)",
            correctAnswer: "will",
            options: ["will", "do", "are", "shall"],
            solutionHtml: "Hỏi về kế hoạch tương lai đơn với 'tomorrow', trả lời 'I will' nên câu hỏi dùng trợ động từ <b>'will'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Họ sẽ chơi bóng đá vào ngày mai.</i>",
            correctAnswer: "They are going to play football tomorrow.",
            wordPool: ["They", "are", "going", "to", "play", "football", "tomorrow."],
            solutionHtml: "Cấu trúc diễn tả dự định/kế hoạch: S + am/is/are + going to + V-inf."
        },
        {
            type: "choice",
            questionText: "I _________ think it will rain tomorrow. (Chọn trợ động từ phủ định phù hợp)",
            correctAnswer: "don't",
            options: ["don't", "doesn't", "will not", "am not"],
            solutionHtml: "Diễn tả ý kiến cá nhân về tương lai dùng cấu trúc 'I don't think it will V'."
        }
    ],
    "must_mustn't": [
        {
            type: "choice",
            questionText: "You _________ speak loudly in the library. (Chọn từ phù hợp)",
            correctAnswer: "mustn't",
            options: ["mustn't", "must", "should", "can"],
            solutionHtml: "Nội quy cấm đoán trong thư viện (không được phép): <b>'mustn't'</b>."
        },
        {
            type: "choice",
            questionText: "We _________ do our homework before class. (Chọn từ phù hợp)",
            correctAnswer: "must",
            options: ["must", "mustn't", "needn't", "shouldn't"],
            solutionHtml: "Nhiệm vụ bắt buộc phải hoàn thành dùng động từ khuyết thiếu chỉ nghĩa bắt buộc: <b>'must'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Bạn phải tuân thủ luật lệ giao thông.</i>",
            correctAnswer: "You must obey the traffic rules.",
            wordPool: ["You", "must", "obey", "the", "traffic", "rules."],
            solutionHtml: "Cấu trúc bắt buộc: S + must + V-inf. Bạn phải tuân thủ luật lệ giao thông."
        },
        {
            type: "choice",
            questionText: "Students _________ cheat in the exams. (Chọn từ khuyết thiếu phù hợp)",
            correctAnswer: "mustn't",
            options: ["mustn't", "must", "should", "needn't"],
            solutionHtml: "Gian lận thi cử là điều cấm kỵ tuyệt đối đối với học sinh, dùng <b>'mustn't'</b>."
        }
    ],
    "first_conditional": [
        {
            type: "choice",
            questionText: "If it rains tomorrow, we _________ stay at home. (Chọn dạng động từ phù hợp)",
            correctAnswer: "will",
            options: ["will", "would", "are", "do"],
            solutionHtml: "Câu điều kiện loại 1: Mệnh đề If dùng hiện tại đơn (rains), mệnh đề chính dùng tương lai đơn <b>'will + V'</b>."
        },
        {
            type: "choice",
            questionText: "If you _________ hard, you will pass the exam. (Chọn dạng động từ phù hợp)",
            correctAnswer: "study",
            options: ["study", "studies", "will study", "studied"],
            solutionHtml: "Mệnh đề If của câu điều kiện loại 1 chia thì hiện tại đơn, chủ ngữ 'you' nên động từ giữ nguyên là <b>'study'</b>."
        },
        {
            type: "writing",
            questionText: "Put the words in the correct order: (Sắp xếp từ thành câu đúng)<br/><i>Ý nghĩa: Nếu cô ấy đến, chúng tôi sẽ đi chơi.</i>",
            correctAnswer: "If she comes, we will go out.",
            wordPool: ["If", "she", "comes,", "we", "will", "go", "out."],
            solutionHtml: "Cấu trúc điều kiện loại 1: If + S + V(s/es), S + will + V-inf."
        },
        {
            type: "choice",
            questionText: "What will you do if you _________ free? (Chọn dạng động từ tobe phù hợp)",
            correctAnswer: "are",
            options: ["are", "is", "am", "will be"],
            solutionHtml: "Mệnh đề If dùng hiện tại đơn của To Be với chủ ngữ 'you' là <b>'are'</b>."
        }
    ]
};

function getGrammarTopicByUnitId(unitId) {
    const map = {
        // Lớp 1 (eng1-...)
        "eng1-t1": "to_be",
        "eng1-t2": "articles",
        "eng1-t3": "to_be",
        "eng1-t4": "plural_nouns",
        "eng1-t5": "possessive",
        "eng1-t6": "to_be",
        "eng1-t7": "to_be",
        "eng1-t8": "modal_can",
        "eng1-t9": "like_ving",
        "eng1-t10": "modal_can",
        "eng1-t11": "present_continuous",
        "eng1-t12": "prepositions_place",
        "eng1-t13": "prepositions_place",
        "eng1-t14": "present_continuous",
        "eng1-t15": "like_ving",
        "eng1-t16": "plural_nouns",
        "eng1-t17": "to_be",
        "eng1-t18": "to_be",
        "eng1-t19": "like_ving",
        "eng1-t20": "modal_can",

        // Lớp 4 (eng4-...)
        "eng4-t1": "to_be",
        "eng4-t2": "present_simple_verbs",
        "eng4-t3": "like_ving",
        "eng4-t4": "adverbs_frequency",
        "eng4-t5": "present_simple_verbs",
        "eng4-t6": "present_simple_verbs",
        "eng4-t7": "present_continuous",
        "eng4-t8": "present_simple_verbs",
        "eng4-t9": "like_ving",
        "eng4-t10": "prepositions_time",
        "eng4-t11": "prepositions_time",
        "eng4-t12": "prepositions_time",
        "eng4-t13": "should_shouldn't",
        "eng4-t14": "past_simple",
        "eng4-t15": "comparatives",
        "eng4-t16": "should_shouldn't",
        "eng4-t17": "past_simple",
        "eng4-t18": "past_simple",
        "eng4-t19": "past_simple",
        "eng4-t20": "future_plans",
        "eng4-t21": "past_simple",
        "eng4-t22": "prepositions_place",
        "eng4-t23": "past_simple",
        "eng4-t24": "future_plans",

        // Lớp 6 (eng6-...)
        "eng6-t1": "present_simple_verbs",
        "eng6-t2": "prepositions_place",
        "eng6-t3": "present_simple_verbs",
        "eng6-t4": "comparatives",
        "eng6-t5": "must_mustn't",
        "eng6-t6": "present_simple_verbs",
        "eng6-t7": "present_simple_verbs",
        "eng6-t8": "present_simple_verbs",
        "eng6-t9": "present_simple_verbs",
        "eng6-t10": "plural_nouns",
        "eng6-t11": "present_simple_verbs",
        "eng6-t12": "future_plans",
        "eng6-t13": "like_ving",
        "eng6-t14": "future_plans",
        "eng6-t15": "prepositions_place",
        "eng6-t16": "first_conditional"
    };
    return map[unitId] || "present_simple_verbs";
}

function generateEnglishQuestions(classLevel, topicId, skill) {
    const classData = ENGLISH_COURSE_DATA[classLevel];
    if (!classData) return [];
    
    const topic = classData.topics.find(t => t.id === topicId);
    if (!topic) return [];

    const questions = [];
    const vocabList = topic.vocab; // 5 từ vựng của bài học
    const patterns = topic.sentencePatterns; // 2 mẫu câu
    
    // Thuật toán xáo trộn mảng ngẫu nhiên
    const shuffleArray = (arr) => arr.slice().sort(() => Math.random() - 0.5);

    // Lấy danh sách từ nhiễu từ tất cả các topic khác cùng khối lớp để tránh trùng lặp
    const getDistractors = (correctWord, count = 3) => {
        const allWords = [];
        classData.topics.forEach(t => {
            t.vocab.forEach(v => {
                if (v.word.toLowerCase() !== correctWord.toLowerCase()) {
                    allWords.push(v.word);
                }
            });
        });
        const shuffed = shuffleArray([...new Set(allWords)]);
        return shuffed.slice(0, count);
    };

    if (skill === 'listening') {
        // DẠNG 1: Nghe chọn tranh (4 câu cho 4 từ vựng đầu tiên)
        for (let i = 0; i < Math.min(4, vocabList.length); i++) {
            const v = vocabList[i];
            const distractors = getDistractors(v.word, 3);
            const options = shuffleArray([v.word, ...distractors]);
            
            questions.push({
                type: "listening",
                category: "listening",
                questionText: `Listen and choose the correct picture: (Nghe và chọn hình đúng)`,
                listeningText: v.word,
                correctAnswer: v.word,
                options: options,
                solutionHtml: `Từ <b>'${v.word}'</b> nghĩa là: <b>${v.translation}</b>.`
            });
        }

        // DẠNG 2: Nghe điền từ/Chính tả (4 câu cho cả 4 từ vựng)
        for (let i = 0; i < Math.min(4, vocabList.length); i++) {
            const v = vocabList[i];
            questions.push({
                type: "listening",
                category: "listening",
                questionText: `Listen and type the word you hear: (Nghe và gõ lại từ)`,
                listeningText: v.word,
                correctAnswer: v.word,
                options: null, // Trống options để hiển thị Input gõ chữ
                solutionHtml: `Chính tả đúng của từ là: <b>${v.word}</b> (${v.translation}).`
            });
        }

        // DẠNG 3: Nghe hiểu câu đàm thoại (2 câu lấy từ 2 mẫu câu)
        patterns.forEach(p => {
            const qText = p.english.split(' - ')[0]; // Lấy phần câu hỏi
            const aText = p.english.split(' - ')[1] || p.english; // Lấy câu trả lời
            
            // Tìm các câu trả lời nhiễu từ các pattern khác của lớp học
            const otherAnswers = [];
            classData.topics.forEach(t => {
                t.sentencePatterns.forEach(sp => {
                    const ans = sp.english.split(' - ')[1] || sp.english;
                    if (ans !== aText) otherAnswers.push(ans);
                });
            });
            const distractors = shuffleArray([...new Set(otherAnswers)]).slice(0, 3);
            const options = shuffleArray([aText, ...distractors]);

            questions.push({
                type: "listening",
                category: "listening",
                questionText: `Listen to the question and choose the best response: (Nghe câu hỏi và chọn phản hồi đúng)`,
                listeningText: qText,
                correctAnswer: aText,
                options: options,
                solutionHtml: `Câu hỏi: <i>"${qText}"</i>. Phản hồi hợp lý nhất là: <b>"${aText}"</b>.`
            });
        });

        // DẠNG 4: Nghe câu giao tiếp và viết lại chính tả (2 câu) để đảm bảo tối thiểu 10 câu cho các bài 3 từ vựng
        patterns.forEach(p => {
            const text = p.english.split(' - ')[1] || p.english;
            questions.push({
                type: "listening",
                category: "listening",
                questionText: `Listen and type the sentence you hear: (Nghe và gõ lại câu)`,
                listeningText: text,
                correctAnswer: text,
                options: null,
                solutionHtml: `Câu đúng là: <b>"${text}"</b> (nghĩa là: ${p.vietnamese}).`
            });
        });

        // DẠNG 5: Nghe hiểu đoạn văn / hội thoại (Listening Comprehension)
        if (topic.questions && topic.questions.reading && topic.questions.reading.length > 0) {
            topic.questions.reading.forEach(rq => {
                questions.push({
                    type: "listening_passage",
                    category: "listening",
                    questionText: `Listen to the passage and choose the correct answer: (Nghe đoạn văn/hội thoại và chọn câu trả lời đúng)<br/><br/><b>Question: ${rq.question}</b>`,
                    listeningText: topic.readingPassage,
                    correctAnswer: rq.answer,
                    options: rq.options,
                    passageTitle: topic.readingPassageTitle,
                    solutionHtml: `<b>Đoạn văn/Cuộc hội thoại nghe được:</b><br/><i>"${topic.readingPassage}"</i><br/><br/>Đáp án đúng là: <b>${rq.answer}</b>.`
                });
            });
        }
    } 
    else if (skill === 'speaking') {
        // DẠNG 1: Phát âm từ vựng đơn lẻ (4 câu)
        const shufVocab = shuffleArray(vocabList);
        for (let i = 0; i < Math.min(4, shufVocab.length); i++) {
            const v = shufVocab[i];
            questions.push({
                type: "speaking",
                category: "speaking",
                questionText: `Read this word aloud: (Đọc to từ vựng sau)`,
                speakingText: v.word,
                correctAnswer: v.word,
                solutionHtml: `Từ <b>'${v.word}'</b> phát âm là: <b>${v.phonetics}</b>.`
            });
        }
        // DẠNG 2: Phát âm câu ví dụ chứa từ vựng (4 câu)
        for (let i = 0; i < Math.min(4, shufVocab.length); i++) {
            const v = shufVocab[i];
            questions.push({
                type: "speaking",
                category: "speaking",
                questionText: `Read this sentence aloud: (Đọc to câu ví dụ sau)`,
                speakingText: v.sentence,
                correctAnswer: v.sentence,
                solutionHtml: `Câu: <i>"${v.sentence}"</i>.<br/>Ý nghĩa: <b>${v.sentenceTranslation}</b>.`
            });
        }
        // DẠNG 3: Phát âm mẫu câu giao tiếp (2 câu)
        patterns.forEach(p => {
            const cleanText = p.english.replace(/ - /g, " ");
            questions.push({
                type: "speaking",
                category: "speaking",
                questionText: `Speak this sentence: (Đọc to câu giao tiếp sau)`,
                speakingText: cleanText,
                correctAnswer: cleanText,
                solutionHtml: `Mẫu câu: <i>"${p.english}"</i>.<br/>Ý nghĩa: <b>${p.vietnamese}</b>.`
            });
        });

        // DẠNG 4: Phát âm câu hỏi giao tiếp riêng biệt (2 câu) để đảm bảo tối thiểu 10 câu cho các bài 3 từ vựng
        patterns.forEach(p => {
            const parts = p.english.split(' - ');
            if (parts.length > 1) {
                const qPart = parts[0];
                questions.push({
                    type: "speaking",
                    category: "speaking",
                    questionText: `Read this question aloud: (Đọc to câu hỏi sau)`,
                    speakingText: qPart,
                    correctAnswer: qPart,
                    solutionHtml: `Câu hỏi: <i>"${qPart}"</i>.`
                });
            } else {
                const text = p.english;
                questions.push({
                    type: "speaking",
                    category: "speaking",
                    questionText: `Speak this sentence: (Đọc to câu giao tiếp sau)`,
                    speakingText: text,
                    correctAnswer: text,
                    solutionHtml: `Mẫu câu: <i>"${text}"</i>.`
                });
            }
        });
    } 
    else if (skill === 'reading') {
        if (topicId === 'eng6-t1') {
            questions.push(...ENG6_T1_READING_GRAMMAR_QUESTIONS.map(q => ({ ...q, category: 'grammar' })));
        } else {
            const gTopic = getGrammarTopicByUnitId(topicId);
            const gQuestions = ENGLISH_GRAMMAR_TOPIC_QUESTIONS[gTopic] || [];
            const readGQs = gQuestions.filter(q => q.type === 'choice').map(q => ({ ...q, category: 'grammar' }));
            questions.push(...readGQs);
        }

        // DẠNG 1: Trắc nghiệm nghĩa từ vựng (4 câu)
        const shufVocab = shuffleArray(vocabList);
        for (let i = 0; i < Math.min(4, shufVocab.length); i++) {
            const v = shufVocab[i];
            const otherMeanings = [];
            classData.topics.forEach(t => {
                t.vocab.forEach(vc => {
                    if (vc.translation !== v.translation) {
                        otherMeanings.push(vc.translation);
                    }
                });
            });
            const distractors = shuffleArray([...new Set(otherMeanings)]).slice(0, 3);
            const options = shuffleArray([v.translation, ...distractors]);

            questions.push({
                type: "choice",
                category: "vocabulary",
                questionText: `What does the word "${v.word}" mean? (Từ "${v.word}" nghĩa là gì?)`,
                correctAnswer: v.translation,
                options: options,
                solutionHtml: `Từ <b>'${v.word}'</b> có nghĩa tiếng Việt là: <b>${v.translation}</b>.`
            });
        }

        // DẠNG 2: Đọc điền từ vào câu khuyết của từ vựng (3 câu)
        const clVocab = shuffleArray(vocabList).slice(0, 3);
        clVocab.forEach(v => {
            const escapedWord = v.word.replace(/[.*+?^${}()|[\\\]]/g, '\\$$');
            const patternReg = new RegExp(`\\b${escapedWord}\\b`, 'gi');
            const questionStr = v.sentence.replace(patternReg, "_______");
            const distractors = getDistractors(v.word, 3);
            const options = shuffleArray([v.word, ...distractors]);

            questions.push({
                type: "choice",
                category: "vocabulary",
                questionText: `Choose the best word to complete the sentence:<br/><b>${questionStr}</b>`,
                correctAnswer: v.word,
                options: options,
                solutionHtml: `Câu hoàn chỉnh: <b>"${v.sentence}"</b>.<br/>Dịch: <i>${v.sentenceTranslation}</i>.`
            });
        });

        // DẠNG 3: Đọc hiểu đoạn văn trả lời câu hỏi (3 câu lấy từ cấu hình bài học)
        if (topic.questions && topic.questions.reading && topic.questions.reading.length > 0) {
            topic.questions.reading.forEach(rq => {
                questions.push({
                    type: "reading_passage",
                    category: "reading",
                    questionText: rq.question,
                    passageText: topic.readingPassage,
                    correctAnswer: rq.answer,
                    options: rq.options,
                    vocabList: vocabList,
                    solutionHtml: `Dựa vào đoạn văn <b>"${topic.readingPassageTitle}"</b>, đáp án đúng là: <b>${rq.answer}</b>.`
                });
            });
        } else {
            // Fallback dịch nghĩa câu mẫu nếu không có đoạn văn
            patterns.forEach(p => {
                const otherVi = classData.topics.flatMap(t => t.sentencePatterns.map(sp => sp.vietnamese)).filter(x => x !== p.vietnamese);
                const distractors = shuffleArray([...new Set(otherVi)]).slice(0, 2);
                const options = shuffleArray([p.vietnamese, ...distractors]);

                questions.push({
                    type: "choice",
                    category: "reading",
                    questionText: `What is the Vietnamese translation of: "<b>${p.english}</b>"?`,
                    correctAnswer: p.vietnamese,
                    options: options,
                    solutionHtml: `Câu <b>"${p.english}"</b> dịch nghĩa là: <b>"${p.vietnamese}"</b>.`
                });
            });
        }
    } 
    else if (skill === 'writing') {
        if (topicId === 'eng6-t1') {
            questions.push(...ENG6_T1_WRITING_GRAMMAR_QUESTIONS.map(q => ({ ...q, category: 'grammar' })));
        } else {
            const gTopic = getGrammarTopicByUnitId(topicId);
            const gQuestions = ENGLISH_GRAMMAR_TOPIC_QUESTIONS[gTopic] || [];
            const writeGQs = gQuestions.filter(q => q.type === 'writing' || q.type === 'choice').map(q => ({ ...q, category: 'grammar' }));
            questions.push(...writeGQs);
        }

        // DẠNG 1: Sắp xếp chữ cái - Spelling (4 câu cho 4 từ vựng)
        const shufVocab = shuffleArray(vocabList);
        for (let i = 0; i < Math.min(4, shufVocab.length); i++) {
            const v = shufVocab[i];
            const cleanWord = v.word.toLowerCase();
            let scrambled = cleanWord.split('').sort(() => Math.random() - 0.5).join('-');
            if (scrambled === cleanWord.split('').join('-')) {
                scrambled = cleanWord.split('').reverse().join('-');
            }

            questions.push({
                type: "writing",
                category: "vocabulary",
                questionText: `Arrange the letters to make a correct word: (Sắp xếp chữ cái thành từ đúng)`,
                scrambledLetters: scrambled.toUpperCase(), // Dùng vẽ giao diện chữ cái 3D nổi bật
                correctAnswer: v.word,
                wordPool: scrambled.split('-'), // Dùng làm nút kéo thả bấm chọn
                solutionHtml: `Từ đúng là: <b>${v.word}</b> (nghĩa là: ${v.translation}).`
            });
        }

        // DẠNG 2: Sắp xếp từ thành câu hoàn chỉnh - Word Scramble (4 câu cho 4 câu ví dụ)
        for (let i = 0; i < Math.min(4, shufVocab.length); i++) {
            const v = shufVocab[i];
            const sentence = v.sentence;
            const words = sentence.trim().split(/\s+/).filter(w => w.length > 0);
            const wordPool = shuffleArray(words);

            questions.push({
                type: "writing",
                category: "writing",
                questionText: `Put the words in the correct order to make a sentence: (Sắp xếp các từ thành câu đúng)<br/><i>Meaning: ${v.sentenceTranslation}</i>`,
                correctAnswer: sentence,
                wordPool: wordPool,
                solutionHtml: `Câu đúng là: <b>"${sentence}"</b>.`
            });
        }

        // DẠNG 3: Hoàn thành đối thoại / Viết lại câu gợi ý (2 câu từ 2 mẫu câu)
        patterns.forEach(p => {
            const parts = p.english.split(' - ');
            const promptStr = parts[0];
            const targetAns = parts[1] || p.english;
            const words = targetAns.trim().split(/\s+/).filter(w => w.length > 0);

            questions.push({
                type: "writing",
                category: "writing",
                questionText: `Complete the dialogue: (Hoàn thành câu đối thoại)<br/>A: <b>${promptStr}</b><br/>B: [____] ?<br/><i>Meaning: ${p.vietnamese}</i>`,
                correctAnswer: targetAns,
                wordPool: shuffleArray(words),
                solutionHtml: `Câu trả lời đúng hoàn chỉnh là: <b>"${targetAns}"</b>.`
            });
        });
    }

    // Xáo trộn ngẫu nhiên và lấy đúng 15 câu hỏi để trẻ kiểm tra đầy đủ, đa giác quan
    return shuffleArray(questions).slice(0, 15);
}



// ==========================================================================
const IOE_STATIC_QUESTIONS = {
    "1": {
        "pronunciation": [
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. bag", "B. cat", "C. father", "D. apple"], correctAnswer: "C. father", solutionHtml: "Âm 'a' trong father là /ɑː/, còn lại là /æ/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. book", "B. foot", "C. door", "D. look"], correctAnswer: "C. door", solutionHtml: "Âm 'oo' trong door là /ɔː/, còn lại là /ʊ/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. name", "B. baby", "C. cake", "D. dad"], correctAnswer: "D. dad", solutionHtml: "Âm 'a' trong dad là /æ/, còn lại là /eɪ/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. red", "B. pen", "C. bed", "D. green"], correctAnswer: "D. green", solutionHtml: "Âm 'ee' trong green là /iː/, còn lại là /e/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. sun", "B. run", "C. blue", "D. duck"], correctAnswer: "C. blue", solutionHtml: "Âm 'u' trong blue là /uː/, còn lại là /ʌ/." }
        ],
        "grammar": [
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>What _______ your name?</b>", options: ["A. is", "B. am", "C. are", "D. be"], correctAnswer: "A. is", solutionHtml: "Cấu trúc hỏi tên: What is your name?" },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>I _______ fine, thank you.</b>", options: ["A. is", "B. am", "C. are", "D. be"], correctAnswer: "B. am", solutionHtml: "Chủ ngữ I đi với am: I am fine." },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>This is _______ apple.</b>", options: ["A. a", "B. an", "C. the", "D. two"], correctAnswer: "B. an", solutionHtml: "Apple bắt đầu bằng nguyên âm nên dùng 'an'." },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>How old _______ you?</b>", options: ["A. is", "B. am", "C. are", "D. be"], correctAnswer: "C. are", solutionHtml: "Hỏi tuổi: How old are you?" },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>I have _______ pencil.</b>", options: ["A. a", "B. an", "C. two", "D. many"], correctAnswer: "A. a", solutionHtml: "Pencil bắt đầu bằng phụ âm nên dùng 'a'." }
        ]
    },
    "4": {
        "pronunciation": [
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. time", "B. milk", "C. high", "D. fine"], correctAnswer: "B. milk", solutionHtml: "Âm 'i' trong milk là /ɪ/, các từ khác là /aɪ/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. sunny", "B. summer", "C. busy", "D. spring"], correctAnswer: "C. busy", solutionHtml: "Chữ 's' trong busy phát âm là /z/, còn lại là /s/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. head", "B. beach", "C. clean", "D. repeat"], correctAnswer: "A. head", solutionHtml: "Âm 'ea' trong head phát âm là /e/, còn lại là /iː/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. clock", "B. morning", "C. coffee", "D. doctor"], correctAnswer: "B. morning", solutionHtml: "Âm 'or' trong morning phát âm là /ɔː/, các từ khác là /ɒ/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. school", "B. chess", "C. chip", "D. chair"], correctAnswer: "A. school", solutionHtml: "Chữ 'ch' trong school phát âm là /k/, các từ khác là /tʃ/." }
        ],
        "grammar": [
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>Where _______ you from?</b>", options: ["A. is", "B. am", "C. are", "D. do"], correctAnswer: "C. are", solutionHtml: "Cấu trúc hỏi quê quán: Where are you from?" },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>What _______ she like doing? - She likes swimming.</b>", options: ["A. is", "B. do", "C. does", "D. are"], correctAnswer: "C. does", solutionHtml: "Hỏi sở thích chủ ngữ số ít: What does she like doing?" },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>He _______ to school every day.</b>", options: ["A. go", "B. goes", "C. going", "D. went"], correctAnswer: "B. goes", solutionHtml: "Hiện tại đơn chủ ngữ số ít: He goes to school." },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>_______ is your birthday? - It's in January.</b>", options: ["A. When", "B. Where", "C. What", "D. Who"], correctAnswer: "A. When", solutionHtml: "Hỏi khi nào thì dùng 'When'." },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>We _______ at home yesterday.</b>", options: ["A. is", "B. was", "C. were", "D. are"], correctAnswer: "C. were", solutionHtml: "Quá khứ đơn của be với chủ ngữ We là 'were'." }
        ]
    },
    "6": {
        "pronunciation": [
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. creative", "B. compass", "C. canteen", "D. calculator"], correctAnswer: "A. creative", solutionHtml: "Chữ 'c' trong creative phát âm là /kr/, các từ khác là /k/ kết hợp nguyên âm đơn." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. forest", "B. temple", "C. cathedral", "D. subtraction"], correctAnswer: "A. forest", solutionHtml: "Âm phát âm khác biệt." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. modern", "B. border", "C. short", "D. sport"], correctAnswer: "A. modern", solutionHtml: "Âm 'o' trong modern phát âm là /ɒ/, còn lại là /ɔː/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. clean", "B. heavy", "C. weather", "D. head"], correctAnswer: "A. clean", solutionHtml: "Âm 'ea' trong clean phát âm là /iː/, các từ khác phát âm là /e/." },
            { questionText: "Smart Monkey! Choose the word that has a different sound: (Chọn từ có âm khác biệt)", options: ["A. recycling", "B. cycling", "C. city", "D. sky"], correctAnswer: "D. sky", solutionHtml: "Chữ 'y' trong sky phát âm là /aɪ/, còn lại là /ɪ/." }
        ],
        "grammar": [
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>There _______ a big bookshelf and two chairs in my room.</b>", options: ["A. is", "B. am", "C. are", "D. be"], correctAnswer: "A. is", solutionHtml: "Cấu trúc 'There is' đi với danh từ số ít đứng đầu tiên (a big bookshelf)." },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>Linh is very _______. She is always drawing and painting.</b>", options: ["A. friendly", "B. creative", "C. clever", "D. kind"], correctAnswer: "B. creative", solutionHtml: "Hay vẽ tranh và tô màu là sáng tạo (creative)." },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>_______ you like to go to the canteen with me? - Yes, I'd love to.</b>", options: ["A. Will", "B. Do", "C. Would", "D. Can"], correctAnswer: "C. Would", solutionHtml: "Cấu trúc mời mọc lịch sự: Would you like to...?" },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>My neighbourhood is _______ than your neighbourhood.</b>", options: ["A. noisy", "B. noisier", "C. more noisy", "D. noisyest"], correctAnswer: "B. noisier", solutionHtml: "So sánh hơn của tính từ ngắn 'noisy' là 'noisier'." },
            { questionText: "Defeat the Dragon! Choose the best option:<br/><b>You _______ speak loudly in the library. It is a quiet place.</b>", options: ["A. must", "B. mustn't", "C. can", "D. shouldn't"], correctAnswer: "B. mustn't", solutionHtml: "Quy định cấm đoán trong thư viện dùng 'mustn't'." }
        ]
    }
};
// ==========================================================================

function generateIoeQuestions(classLevel, topicId) {
    const classData = ENGLISH_COURSE_DATA[classLevel];
    if (!classData) return [];

    const allTopics = classData.topics;
    const topicIndex = allTopics.findIndex(t => t.id === topicId);
    if (topicIndex === -1) return [];

    // Gom từ vựng và mẫu câu tích lũy đến bài hiện tại
    const cumulativeVocab = [];
    const cumulativePatterns = [];
    for (let i = 0; i <= topicIndex; i++) {
        cumulativeVocab.push(...allTopics[i].vocab);
        cumulativePatterns.push(...allTopics[i].sentencePatterns);
    }

    const shuffleArray = (arr) => arr.slice().sort(() => Math.random() - 0.5);

    const questions = [];

    // 1. DẠNG 1: Leave Me Alone (Loại bỏ ký tự thừa) - 4 câu
    const shufVocab1 = shuffleArray(cumulativeVocab);
    const selectedVocab1 = shufVocab1.slice(0, Math.min(4, shufVocab1.length));
    selectedVocab1.forEach(v => {
        const word = v.word.toLowerCase();
        // Chọn một chữ cái ngẫu nhiên khác với các chữ trong từ để chèn vào
        const chars = "abcdefghijklmnopqrstuvwxyz";
        let extraChar = "x";
        for (let i = 0; i < 20; i++) {
            const temp = chars[Math.floor(Math.random() * chars.length)];
            if (!word.includes(temp)) {
                extraChar = temp;
                break;
            }
        }
        // Chèn vào vị trí ngẫu nhiên ở giữa từ (index 1 đến length-1)
        const insertIndex = Math.floor(Math.random() * (word.length - 1)) + 1;
        const scrambled = word.slice(0, insertIndex) + extraChar + word.slice(insertIndex);

        questions.push({
            type: "ioe_leave_alone",
            word: v.word,
            scrambled: scrambled,
            extraChar: extraChar,
            extraIndex: insertIndex,
            questionText: "Leave me alone! Click on the extra letter to remove it: (Bấm vào chữ cái thừa để loại bỏ)",
            solutionHtml: `Từ đúng là: <b>${v.word}</b> (${v.translation}). Chữ cái thừa là <b>${extraChar.toUpperCase()}</b>.`
        });
    });

    // 2. DẠNG 2: Fill in the Blank (Điền chữ cái khuyết) - 4 câu
    const shufVocab2 = shuffleArray(cumulativeVocab);
    const selectedVocab2 = shufVocab2.slice(0, Math.min(4, shufVocab2.length));
    selectedVocab2.forEach(v => {
        const word = v.word.toLowerCase();
        // Chọn 1 index ngẫu nhiên để ẩn đi (tránh chữ đầu tiên)
        const hideIndex = Math.floor(Math.random() * (word.length - 1)) + 1;
        const missingChar = word[hideIndex];
        const template = word.slice(0, hideIndex) + "_" + word.slice(hideIndex + 1);

        questions.push({
            type: "ioe_fill_blank",
            word: v.word,
            template: template,
            missingChar: missingChar,
            questionText: `Fill in the missing letter to complete the word: (Điền chữ cái còn thiếu vào từ)<br/><b style="font-size:1.6rem; color:#2563eb; letter-spacing: 2px;">${template.toUpperCase()}</b> &nbsp;(${v.translation})`,
            solutionHtml: `Từ đúng hoàn chỉnh là: <b>${v.word}</b> (${v.translation}). Chữ cái còn thiếu là <b>${missingChar.toUpperCase()}</b>.`
        });
    });

    // 3. DẠNG 3: Cool Pair Matching (Cặp đôi hoàn hảo) - 4 câu
    for (let m = 0; m < 4; m++) {
        const shufVocab3 = shuffleArray(cumulativeVocab);
        const selectedVocab3 = shufVocab3.slice(0, Math.min(5, shufVocab3.length));
        
        let pairs = selectedVocab3.map(v => ({ eng: v.word, vi: v.translation }));
        if (pairs.length < 5) {
            const backupWords = classData.topics.flatMap(t => t.vocab).map(v => ({ eng: v.word, vi: v.translation }));
            const filteredBackup = backupWords.filter(bw => !pairs.some(p => p.eng === bw.eng));
            pairs.push(...shuffleArray(filteredBackup).slice(0, 5 - pairs.length));
        }

        questions.push({
            type: "ioe_pair_matching",
            pairs: pairs,
            questionText: "Cool Pair Matching! Match the English words with their correct Vietnamese meanings: (Ghép cặp từ tiếng Anh với nghĩa tiếng Việt tương ứng)",
            solutionHtml: "Hoàn thành ghép cặp chính xác tất cả các từ vựng."
        });
    }

    const staticClassKey = classLevel === "1" || classLevel === "2" ? "1" :
                           classLevel === "4" || classLevel === "5" ? "4" : "6";
    const staticData = IOE_STATIC_QUESTIONS[staticClassKey] || IOE_STATIC_QUESTIONS["6"];

    // 4. DẠNG 4: Smart Monkey (Phát âm) - 4 câu
    const shufPron = shuffleArray(staticData.pronunciation);
    const selectedPron = shufPron.slice(0, 4);
    selectedPron.forEach(q => {
        questions.push({
            type: "ioe_choice",
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            solutionHtml: q.solutionHtml
        });
    });

    // 5. DẠNG 5: Defeat the Dragon (Ngữ pháp trắc nghiệm) - 4 câu
    const shufGram = shuffleArray(staticData.grammar);
    const selectedGram = shufGram.slice(0, 4);
    selectedGram.forEach(q => {
        questions.push({
            type: "ioe_dragon",
            questionText: q.questionText,
            options: q.options,
            correctAnswer: q.correctAnswer,
            solutionHtml: q.solutionHtml
        });
    });

    return shuffleArray(questions).slice(0, 20);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        EMOJI_FALLBACK,
        ENGLISH_COURSE_DATA,
        getWordEmoji,
        generateEnglishQuestions,
        generateIoeQuestions
    };
} else {
    window.ENGLISH_COURSE_DATA = ENGLISH_COURSE_DATA;
    window.getWordEmoji = getWordEmoji;
    window.generateEnglishQuestions = generateEnglishQuestions;
    window.generateIoeQuestions = generateIoeQuestions;
}
