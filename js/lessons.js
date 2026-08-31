// Tệp chứa cấu hình danh sách bài học, chương trình học và video YouTube tương ứng
const SUBTOPIC_VIDEOS = {
    "bai-1-d1": "ojvCobTP-0k",
    "bai-1-d2": "Y0LOwciyU_k",
    "bai-1-d3": "y4USd4stIMY",
    "bai-1-d4": "Zo1u39UcrVE",
    "bai-2-d1": "QfW2CQTtvM4",
    "bai-2-d2": "RiAR4vJSgBI",
    "bai-2-d3": "rbrYiyRNHwM",
    "bai-2-d4": "yMhmXoDLyvs",
    "bai-3-d1": "ojvCobTP-0k",
    "bai-3-d2": "y3G_FO5iMpU",
    "bai-3-d3": "D94NLpT8Qzg",
    "bai-4-d1": "loWJ_rLpHgo",
    "bai-4-d2": "KwKl6kXujuk",
    "bai-4-d3": "ppjTnBHhtXU",
    "bai-5-d1": "jouYaEcHs6c",
    "bai-5-d2": "KwKl6kXujuk",
    "bai-5-d3": "U_zLh1uKCAA",
    "bai-6-d1": "itPy2qxjr1s",
    "bai-6-d2": "y97azz6zHQ8",
    "bai-6-d3": "xjW3PYc6HNs",
    "bai-7-d1": "rRtHl3wWw0Q",
    "bai-7-d2": "67mH2yuFBZw",
    "bai-7-d3": "KwKl6kXujuk",
    "bai-8-d1": "9ssHXGSh1_g",
    "bai-8-d2": "Ve5yE91cQH4",
    "bai-8-d3": "l9NPGv8ObwQ",
    "bai-9-d1": "8iKz2Q-0AXE",
    "bai-9-d2": "hpBNTo2mUSU",
    "bai-9-d3": "l9NPGv8ObwQ",
    "bai-10-d1": "9OyzS54vbps",
    "bai-10-d2": "IhzvsVqCL3M",
    "bai-10-d3": "IhzvsVqCL3M",
    "bai-11-d1": "APbwP0XX2a0",
    "bai-11-d2": "Bjb0TAHepuM",
    "bai-11-d3": "LGCa8EWBwmE",
    "bai-12-d1": "3j4dQJ5coXE",
    "bai-12-d2": "-MxOATha82Y",
    "bai-12-d3": "e_GxjE0-EOM",
    "bai-13-d1": "ppjTnBHhtXU",
    "bai-13-d2": "kxziRt6Y6PM",
    "bai-13-d3": "Cab-HRzszJU",
    "bai-14-d1": "G-aEBty43Oo",
    "bai-14-d2": "H7POaeTMxsk",
    "bai-14-d3": "ppjTnBHhtXU",
    "bai-15-d1": "juniMrBi0E0",
    "bai-15-d2": "9FUuh9U-Oy4",
    "bai-15-d3": "vG8StiRSEpc",
    "bai-16-d1": "Q7D-5HXZ-FE",
    "bai-16-d2": "67mH2yuFBZw",
    "bai-16-d3": "wjczaQEHxb4",
    "bai-17-d1": "TXH05lguUqI",
    "bai-17-d2": "KwKl6kXujuk",
    "bai-17-d3": "bO3ANS4FEIA",
    "bai-18-d1": "wGt3XicQcsU",
    "bai-18-d2": "wGt3XicQcsU",
    "bai-18-d3": "9g3WAUockz4",
    "bai-19-d1": "XgK0N7HZtWQ",
    "bai-19-d2": "XgK0N7HZtWQ",
    "bai-19-d3": "Cb16XRY2hvI",
    "bai-20-d1": "KRoWdz1iOew",
    "bai-20-d2": "8lAH8t4K628",
    "bai-20-d3": "O4Ylt5tDwas",
    "bai-21-d1": "FjOoJanifI0",
    "bai-21-d2": "MxzzbS27PWs",
    "bai-21-d3": "RGHxNyFkFT0",
    "bai-22-d1": "WY7fb9YyLuI",
    "bai-22-d2": "3Oj35-duSDs",
    "bai-22-d3": "hl52yipFOJY",
    "bai-23-d1": "nF3fn7Tf6fg",
    "bai-23-d2": "NS6bj4vIqqA",
    "bai-23-d3": "NS6bj4vIqqA",
    "bai-24-d1": "sU7tKkH3_Ko",
    "bai-24-d2": "Md1fDqNtlMc",
    "bai-24-d3": "Md1fDqNtlMc",
    "bai-25-d1": "HyIXyixQQ5s",
    "bai-25-d2": "aCQll-ofz1o",
    "bai-25-d3": "aCQll-ofz1o",
    "bai-26-d1": "SP6VZOKSYJE",
    "bai-26-d2": "3VBcRJoYekk",
    "bai-26-d3": "3VBcRJoYekk",
    "bai-27-d1": "MZK6kiw9pyE",
    "bai-27-d2": "MrRmD_iAf9M",
    "bai-27-d3": "MrRmD_iAf9M",
    "bai-28-d1": "ciWYSN_qZNM",
    "bai-28-d2": "jpWVhHQYZFQ",
    "bai-28-d3": "ciWYSN_qZNM",
    "bai-29-d1": "Km9yyBXTCO8",
    "bai-29-d2": "ciWYSN_qZNM",
    "bai-29-d3": "ciWYSN_qZNM",
    "bai-30-d1": "ciWYSN_qZNM",
    "bai-30-d2": "EOri0vYnINw",
    "bai-30-d3": "gGXVtSk9I9c",
    "bai-31-d1": "8Fw8gTsJPCw",
    "bai-31-d2": "Ea_yiEF4Ou4",
    "bai-31-d3": "Ea_yiEF4Ou4",
    "bai-32-d1": "gaJ9BHjI04M",
    "bai-32-d2": "nF3fn7Tf6fg",
    "bai-32-d3": "oNCner81vOo",
    "bai-33-d1": "t86tXtdnmhc",
    "bai-33-d2": "gaJ9BHjI04M",
    "bai-33-d3": "t86tXtdnmhc",
    "bai-34-d1": "gaJ9BHjI04M",
    "bai-34-d2": "ajwHBKCkj08",
    "bai-34-d3": "ajwHBKCkj08",
    "bai-35-d1": "gaJ9BHjI04M",
    "bai-35-d2": "EOri0vYnINw",
    "bai-35-d3": "FtVG_MJofKM",
    "bai-36-d1": "gaJ9BHjI04M",
    "bai-36-d2": "Sxcs3ZVOXDs",
    "bai-36-d3": "Sxcs3ZVOXDs",
    "bai-37-d1": "gaJ9BHjI04M",
    "bai-37-d2": "MoyxkvZuh1o",
    "bai-37-d3": "MoyxkvZuh1o",
    "bai-38-d1": "YTTuwpZaTlQ",
    "bai-38-d2": "9FUuh9U-Oy4",
    "bai-38-d3": "YTTuwpZaTlQ",
    "bai-39-d1": "vIp0oLDgoRY",
    "bai-39-d2": "vIp0oLDgoRY",
    "bai-39-d3": "vIp0oLDgoRY",
    "bai-40-d1": "Gy1coyDF40E",
    "bai-40-d2": "Gy1coyDF40E",
    "bai-40-d3": "Gy1coyDF40E",
    "bai-41-d1": "VzwoZf9KzuM",
    "bai-41-d2": "VzwoZf9KzuM",
    "bai-41-d3": "VzwoZf9KzuM",
    "bai-42-d1": "emwqHKMjPEw",
    "bai-42-d2": "gaJ9BHjI04M",
    "bai-42-d3": "emwqHKMjPEw",
    "bai-43-d1": "Zs-BaHzZ63w",
    "bai-43-d2": "Zs-BaHzZ63w",
    "bai-43-d3": "Zs-BaHzZ63w",
    "bai-6-d4": "2-nAso1FvJQ",
    "bai-6-d5": "5vnoqRMWGYg",
    "bai-7-d4": "1r8qtrezxY8",
    "bai-16-d5": "l9NPGv8ObwQ",
    "bai-4-d4": "eUWntZ7I_R4",
    "bai-13-d4": "SfDt2YPhKos",
    "bai-16-d4": "KwKl6kXujuk",
    "bai-16-d6": "IKOHh_31HDg"
};

const SYSTEM_SUBJECTS = {
    "math": {
        "id": "math",
        "name": "Toán Học",
        "icon": "fa-calculator",
        "themeClass": "math-mode",
        "supportedClasses": ["1", "4", "6"]
    },
    "english": {
        "id": "english",
        "name": "Tiếng Anh",
        "icon": "fa-language",
        "themeClass": "english-mode",
        "supportedClasses": ["1", "4", "6"]
    }
};

const COURSE_DATA = [
    {
        "id": "l1-chuong-1",
        "class": "1",
        "semester": 1,
        "title": "Chủ đề 1: Các số từ 0 đến 10",
        "subtitle": "Nhận biết, đọc viết các số từ 0 đến 10, đếm và so sánh số lượng",
        "lessons": [
            {
                "id": "l1-bai-1",
                "title": "Bài 1: Các số 0, 1, 2, 3, 4, 5",
                "youtubeId": "5yuXocWiNpk",
                "questionType": "l1-cac-so-0-5",
                "theoryHtml": "<h4>1. Nhận biết và đọc viết số</h4><p>Học cách đọc, viết các số: $0, 1, 2, 3, 4, 5$.</p><h4>2. Đếm số lượng</h4><p>Quan sát số lượng đồ vật trong hình vẽ để đếm đúng từ 0 đến 5.</p>",
                "subtopics": [
                    { "id": "l1-bai-1-d1", "title": "Đếm và nhận biết số từ 0 đến 5", "level": "co-ban", "questionType": "l1-cac-so-0-5-d1", "youtubeId": "5yuXocWiNpk" }
                ]
            },
            {
                "id": "l1-bai-2",
                "title": "Bài 2: Các số 6, 7, 8, 9, 10",
                "youtubeId": "3DgJBllp2Iw",
                "questionType": "l1-cac-so-6-10",
                "theoryHtml": "<h4>1. Nhận biết và đọc viết số</h4><p>Học cách đọc, viết các số tiếp theo: $6, 7, 8, 9, 10$.</p><h4>2. Đếm số lượng</h4><p>Đếm số lượng đồ vật tương ứng với các số từ 6 đến 10.</p>",
                "subtopics": [
                    { "id": "l1-bai-2-d1", "title": "Đếm và nhận biết số từ 6 đến 10", "level": "co-ban", "questionType": "l1-cac-so-6-10-d1", "youtubeId": "3DgJBllp2Iw" }
                ]
            },
            {
                "id": "l1-bai-3",
                "title": "Bài 3: Nhiều hơn, ít hơn, bằng nhau",
                "youtubeId": "_bHds6wAhWk",
                "questionType": "l1-nhieu-it-bang",
                "theoryHtml": "<h4>1. Nhiều hơn, ít hơn</h4><p>So sánh số lượng hai nhóm đồ vật bằng cách ghép cặp một-một.</p><h4>2. Bằng nhau</h4><p>Khi mỗi đồ vật nhóm này đều ghép đôi được với một đồ vật nhóm kia và không thừa ra.</p>",
                "subtopics": [
                    { "id": "l1-bai-3-d1", "title": "Nhận biết nhiều hơn, ít hơn, bằng nhau", "level": "co-ban", "questionType": "l1-nhieu-it-bang-d1", "youtubeId": "_bHds6wAhWk" }
                ]
            },
            {
                "id": "l1-bai-4",
                "title": "Bài 4: So sánh số",
                "youtubeId": "b1diDoUy15c",
                "questionType": "l1-so-sanh-so",
                "theoryHtml": "<h4>1. Dấu so sánh</h4><p>Sử dụng các ký hiệu: $>$ (lớn hơn), $<$ (bé hơn), $=$ (bằng).</p><h4>2. So sánh các số trong phạm vi 10</h4><p>Ví dụ: $5 > 3$, $2 < 6$, $7 = 7$.</p>",
                "subtopics": [
                    { "id": "l1-bai-4-d1", "title": "So sánh hai số trong phạm vi 10", "level": "co-ban", "questionType": "l1-so-sanh-so-d1", "youtubeId": "b1diDoUy15c" },
                    { "id": "l1-bai-4-d2", "title": "Sắp xếp thứ tự các số trong phạm vi 10", "level": "nang-cao", "questionType": "l1-so-sanh-so-d2", "youtubeId": "b1diDoUy15c" }
                ]
            },
            {
                "id": "l1-bai-5",
                "title": "Bài 5: Mấy và mấy",
                "youtubeId": "WmuzWnroaIs",
                "questionType": "l1-may-va-may",
                "theoryHtml": "<h4>1. Tách số</h4><p>Tách một số thành tổng của hai số khác. Ví dụ: số 5 gồm 4 và 1, hoặc 3 và 2.</p><h4>2. Gộp số</h4><p>Gộp hai số để được một số lớn hơn. Ví dụ: gộp 3 và 2 được 5.</p>",
                "subtopics": [
                    { "id": "l1-bai-5-d1", "title": "Tách và gộp số trong phạm vi 10", "level": "co-ban", "questionType": "l1-may-va-may-d1", "youtubeId": "WmuzWnroaIs" }
                ]
            },
            {
                "id": "l1-bai-6",
                "title": "Bài 6: Luyện tập chung",
                "youtubeId": "mLKig2Q7v4Q",
                "questionType": "l1-luyen-tap-c1",
                "theoryHtml": "<h4>Luyện tập ôn tập tổng hợp</h4><p>Ôn tập đếm số, so sánh số và tách gộp số trong phạm vi 10.</p>",
                "subtopics": [
                    { "id": "l1-bai-6-d1", "title": "Ôn tập tổng hợp về số trong phạm vi 10", "level": "co-ban", "questionType": "l1-luyen-tap-c1-d1", "youtubeId": "mLKig2Q7v4Q" },
                    { "id": "l1-bai-6-d2", "title": "Bài toán logic tư duy về số", "level": "kho", "questionType": "l1-luyen-tap-c1-d2", "youtubeId": "mLKig2Q7v4Q" }
                ]
            }
        ]
    },
    {
        "id": "l1-chuong-2",
        "class": "1",
        "semester": 1,
        "title": "Chủ đề 2: Làm quen với một số hình phẳng",
        "subtitle": "Hình vuông, hình tròn, hình tam giác, hình chữ nhật và lắp ghép hình",
        "lessons": [
            {
                "id": "l1-bai-7",
                "title": "Bài 7: Hình vuông, hình tròn, hình tam giác, hình chữ nhật",
                "youtubeId": "BgBrIthWiz8",
                "questionType": "l1-hinh-phang",
                "theoryHtml": "<h4>1. Nhận biết hình phẳng</h4><p>Nhận biết hình dáng của hình vuông, hình tròn, hình tam giác, hình chữ nhật.</p>",
                "subtopics": [
                    { "id": "l1-bai-7-d1", "title": "Nhận diện hình vuông, hình tròn, hình tam giác, hình chữ nhật", "level": "co-ban", "questionType": "l1-hinh-phang-d1", "youtubeId": "BgBrIthWiz8" }
                ]
            },
            {
                "id": "l1-bai-8",
                "title": "Bài 8: Thực hành lắp ghép, xếp hình",
                "youtubeId": "7fqL5tYoEns",
                "questionType": "l1-xep-hinh",
                "theoryHtml": "<h4>Thực hành lắp ghép, xếp hình</h4><p>Sử dụng các hình phẳng đã học để ghép thành các hình mới (nhà, cây, con vật...).</p>",
                "subtopics": [
                    { "id": "l1-bai-8-d1", "title": "Đếm số lượng hình phẳng trong một hình ghép", "level": "nang-cao", "questionType": "l1-xep-hinh-d1", "youtubeId": "7fqL5tYoEns" }
                ]
            },
            {
                "id": "l1-bai-9",
                "title": "Bài 9: Luyện tập chung",
                "youtubeId": "bBUGJtqZwi0",
                "questionType": "l1-luyen-tap-c2",
                "theoryHtml": "<h4>Luyện tập hình phẳng</h4><p>Ôn tập nhận biết hình phẳng và đếm hình phẳng.</p>",
                "subtopics": [
                    { "id": "l1-bai-9-d1", "title": "Nhận biết và đếm hình phẳng nâng cao", "level": "nang-cao", "questionType": "l1-luyen-tap-c2-d1", "youtubeId": "bBUGJtqZwi0" }
                ]
            }
        ]
    },
    {
        "id": "l1-chuong-3",
        "class": "1",
        "semester": 1,
        "title": "Chủ đề 3: Phép cộng, phép trừ trong phạm vi 10",
        "subtitle": "Phép cộng, trừ, bảng cộng trừ phạm vi 10 và ứng dụng giải toán",
        "lessons": [
            {
                "id": "l1-bai-10",
                "title": "Bài 10: Phép cộng trong phạm vi 10",
                "youtubeId": "UC1AclTCyVw",
                "questionType": "l1-cong-pham-vi-10",
                "theoryHtml": "<h4>1. Khái niệm phép cộng</h4><p>Gộp hai nhóm đồ vật lại với nhau. Sử dụng dấu $+$ và dấu $=$.</p><h4>2. Phép cộng trong phạm vi 10</h4><p>Ví dụ: $3 + 2 = 5$, $6 + 4 = 10$.</p>",
                "subtopics": [
                    { "id": "l1-bai-10-d1", "title": "Thực hiện phép cộng trong phạm vi 10", "level": "co-ban", "questionType": "l1-cong-pham-vi-10-d1", "youtubeId": "UC1AclTCyVw" },
                    { "id": "l1-bai-10-d2", "title": "Tìm số thích hợp trong phép cộng dạng ô trống", "level": "nang-cao", "questionType": "l1-cong-pham-vi-10-d2", "youtubeId": "UC1AclTCyVw" }
                ]
            },
            {
                "id": "l1-bai-11",
                "title": "Bài 11: Phép trừ trong phạm vi 10",
                "youtubeId": "WNqXJqrgBcs",
                "questionType": "l1-tru-pham-vi-10",
                "theoryHtml": "<h4>1. Khái niệm phép trừ</h4><p>Bớt đi một số đồ vật từ một nhóm ban đầu. Sử dụng dấu $-$ và dấu $=$.</p><h4>2. Phép trừ trong phạm vi 10</h4><p>Ví dụ: $5 - 2 = 3$, $10 - 7 = 3$.</p>",
                "subtopics": [
                    { "id": "l1-bai-11-d1", "title": "Thực hiện phép trừ trong phạm vi 10", "level": "co-ban", "questionType": "l1-tru-pham-vi-10-d1", "youtubeId": "WNqXJqrgBcs" },
                    { "id": "l1-bai-11-d2", "title": "Tìm số thích hợp trong phép trừ dạng ô trống", "level": "nang-cao", "questionType": "l1-tru-pham-vi-10-d2", "youtubeId": "WNqXJqrgBcs" }
                ]
            },
            {
                "id": "l1-bai-12",
                "title": "Bài 12: Bảng cộng, bảng trừ trong phạm vi 10",
                "youtubeId": "0R8wmWgiBP0",
                "questionType": "l1-bang-cong-tru-10",
                "theoryHtml": "<h4>Bảng cộng trừ phạm vi 10</h4><p>Học thuộc lòng bảng cộng và bảng trừ trong phạm vi 10 để tính toán nhanh.</p>",
                "subtopics": [
                    { "id": "l1-bai-12-d1", "title": "Tính toán nhanh với bảng cộng trừ phạm vi 10", "level": "co-ban", "questionType": "l1-bang-cong-tru-10-d1", "youtubeId": "0R8wmWgiBP0" },
                    { "id": "l1-bai-12-d2", "title": "So sánh giá trị của hai biểu thức phép tính", "level": "nang-cao", "questionType": "l1-bang-cong-tru-10-d2", "youtubeId": "0R8wmWgiBP0" }
                ]
            },
            {
                "id": "l1-bai-13",
                "title": "Bài 13: Luyện tập chung",
                "youtubeId": "HUIE3AlNeBY",
                "questionType": "l1-luyen-tap-c3",
                "theoryHtml": "<h4>Luyện tập phép cộng, phép trừ phạm vi 10</h4><p>Ôn luyện kỹ năng tính toán cộng trừ và giải các bài toán đố đơn giản.</p>",
                "subtopics": [
                    { "id": "l1-bai-13-d1", "title": "Tính toán dãy tính có 2 phép tính (cộng, trừ liên tiếp)", "level": "nang-cao", "questionType": "l1-luyen-tap-c3-d1", "youtubeId": "HUIE3AlNeBY" },
                    { "id": "l1-bai-13-d2", "title": "Bài toán đố vui logic nhiều bước tính", "level": "kho", "questionType": "l1-luyen-tap-c3-d2", "youtubeId": "HUIE3AlNeBY" }
                ]
            }
        ]
    },
    {
        "id": "l1-chuong-4",
        "class": "1",
        "semester": 1,
        "title": "Chủ đề 4: Làm quen với một số hình khối",
        "subtitle": "Khối lập phương, khối hộp chữ nhật, vị trí và định hướng không gian",
        "lessons": [
            {
                "id": "l1-bai-14",
                "title": "Bài 14: Khối lập phương, khối hộp chữ nhật",
                "youtubeId": "6g7KKbH01XM",
                "questionType": "l1-hinh-khoi",
                "theoryHtml": "<h4>1. Khối lập phương</h4><p>Hình khối có 6 mặt là hình vuông bằng nhau (ví dụ: xúc xắc, rubik).</p><h4>2. Khối hộp chữ nhật</h4><p>Hình khối có các mặt là hình chữ nhật (ví dụ: hộp sữa, viên gạch).</p>",
                "subtopics": [
                    { "id": "l1-bai-14-d1", "title": "Nhận diện khối lập phương, khối hộp chữ nhật trong thực tế", "level": "co-ban", "questionType": "l1-hinh-khoi-d1", "youtubeId": "6g7KKbH01XM" }
                ]
            },
            {
                "id": "l1-bai-15",
                "title": "Bài 15: Vị trí, định hướng trong không gian",
                "youtubeId": "t-qF5Pu0-KI",
                "questionType": "l1-vi-tri-khong-gian",
                "theoryHtml": "<h4>Vị trí trong không gian</h4><p>Xác định các vị trí: Trên - Dưới, Trước - Sau, Trái - Phải, Ở giữa.</p>",
                "subtopics": [
                    { "id": "l1-bai-15-d1", "title": "Nhận biết vị trí trái, phải, trên, dưới, trước, sau", "level": "co-ban", "questionType": "l1-vi-tri-khong-gian-d1", "youtubeId": "t-qF5Pu0-KI" }
                ]
            },
            {
                "id": "l1-bai-16",
                "title": "Bài 16: Luyện tập chung",
                "youtubeId": "ub1vg4wB7WU",
                "questionType": "l1-luyen-tap-c4",
                "theoryHtml": "<h4>Luyện tập hình khối và vị trí</h4><p>Ôn tập nhận biết khối lập phương, khối hộp chữ nhật và xác định vị trí.</p>",
                "subtopics": [
                    { "id": "l1-bai-16-d1", "title": "Đếm số lượng khối lập phương ghép thành hình", "level": "nang-cao", "questionType": "l1-luyen-tap-c4-d1", "youtubeId": "ub1vg4wB7WU" }
                ]
            }
        ]
    },
    {
        "id": "l1-chuong-5",
        "class": "1",
        "semester": 1,
        "title": "Chủ đề 5: Ôn tập học kì 1",
        "subtitle": "Hệ thống hóa kiến thức học kì I về số, hình học và phép tính phạm vi 10",
        "lessons": [
            {
                "id": "l1-bai-17",
                "title": "Bài 17: Ôn tập các số trong phạm vi 10",
                "youtubeId": "Q3_VY4sw8Tc",
                "questionType": "l1-on-tap-so-10",
                "theoryHtml": "<h4>Ôn tập số phạm vi 10</h4><p>Ôn lại thứ tự số, đọc viết số, đếm số và cấu tạo số trong phạm vi 10.</p>",
                "subtopics": [
                    { "id": "l1-bai-17-d1", "title": "Trắc nghiệm tổng hợp số phạm vi 10", "level": "co-ban", "questionType": "l1-on-tap-so-10-d1", "youtubeId": "Q3_VY4sw8Tc" }
                ]
            },
            {
                "id": "l1-bai-18",
                "title": "Bài 18: Ôn tập phép cộng, phép trừ trong phạm vi 10",
                "youtubeId": "8JO4WJBM-K0",
                "questionType": "l1-on-tap-phep-tinh-10",
                "theoryHtml": "<h4>Ôn tập phép tính phạm vi 10</h4><p>Ôn lại các phép cộng trừ và bài toán đố giải bằng phép tính cộng trừ trong phạm vi 10.</p>",
                "subtopics": [
                    { "id": "l1-bai-18-d1", "title": "Trắc nghiệm tổng hợp phép tính phạm vi 10", "level": "co-ban", "questionType": "l1-on-tap-phep-tinh-10-d1", "youtubeId": "8JO4WJBM-K0" }
                ]
            },
            {
                "id": "l1-bai-19",
                "title": "Bài 19: Ôn tập hình học",
                "youtubeId": "de27fm2kg8k",
                "questionType": "l1-on-tap-hinh-hoc",
                "theoryHtml": "<h4>Ôn tập hình học học kì 1</h4><p>Ôn lại hình phẳng, hình khối và định hướng vị trí không gian.</p>",
                "subtopics": [
                    { "id": "l1-bai-19-d1", "title": "Trắc nghiệm tổng hợp hình học", "level": "co-ban", "questionType": "l1-on-tap-hinh-hoc-d1", "youtubeId": "de27fm2kg8k" }
                ]
            },
            {
                "id": "l1-bai-20",
                "title": "Bài 20: Ôn tập chung",
                "youtubeId": "W7cE9A7Y46o",
                "questionType": "l1-on-tap-chung-hk1",
                "theoryHtml": "<h4>Ôn tập chung học kì I</h4><p>Đánh giá tổng hợp kiến thức toán học trong cả Học kì I.</p>",
                "subtopics": [
                    { "id": "l1-bai-20-d1", "title": "Đề thi thử học kì I - Câu hỏi tổng hợp", "level": "nang-cao", "questionType": "l1-on-tap-chung-hk1-d1", "youtubeId": "W7cE9A7Y46o" },
                    { "id": "l1-bai-20-d2", "title": "Đề thi thử học kì I - Câu hỏi logic tư duy", "level": "kho", "questionType": "l1-on-tap-chung-hk1-d2", "youtubeId": "W7cE9A7Y46o" }
                ]
            }
        ]
    },
    {
        "id": "l1-chuong-6",
        "class": "1",
        "semester": 2,
        "title": "Chủ đề 6: Các số đến 100",
        "subtitle": "Chữ số hàng chục và hàng đơn vị, đọc viết so sánh các số trong phạm vi 100",
        "lessons": [
            {
                "id": "l1-bai-21",
                "title": "Bài 21: Số có hai chữ số",
                "youtubeId": "0Lsk-ZgIoeg",
                "questionType": "l1-so-hai-chu-so",
                "theoryHtml": "<h4>1. Đọc viết số có hai chữ số</h4><p>Học cách đọc viết các số từ 11 đến 99. Chữ số bên trái biểu thị hàng chục, bên phải biểu thị hàng đơn vị.</p><h4>2. Cấu tạo số</h4><p>Ví dụ: Số 25 gồm 2 chục và 5 đơn vị. Viết là: $25 = 20 + 5$.</p>",
                "subtopics": [
                    { "id": "l1-bai-21-d1", "title": "Nhận biết hàng chục và hàng đơn vị của số có hai chữ số", "level": "co-ban", "questionType": "l1-so-hai-chu-so-d1", "youtubeId": "0Lsk-ZgIoeg" }
                ]
            },
            {
                "id": "l1-bai-22",
                "title": "Bài 22: So sánh số có hai chữ số",
                "youtubeId": "UKxM2Of8cN0",
                "questionType": "l1-so-sanh-so-100",
                "theoryHtml": "<h4>Quy tắc so sánh số có hai chữ số</h4><p>Bước 1: So sánh chữ số hàng chục. Số nào có chữ số hàng chục lớn hơn thì lớn hơn.</p><p>Bước 2: Nếu hàng chục bằng nhau, so sánh chữ số hàng đơn vị. Số nào có chữ số hàng đơn vị lớn hơn thì lớn hơn.</p>",
                "subtopics": [
                    { "id": "l1-bai-22-d1", "title": "So sánh hai số trong phạm vi 100", "level": "co-ban", "questionType": "l1-so-sanh-so-100-d1", "youtubeId": "UKxM2Of8cN0" },
                    { "id": "l1-bai-22-d2", "title": "Sắp xếp thứ tự các số trong phạm vi 100", "level": "nang-cao", "questionType": "l1-so-sanh-so-100-d2", "youtubeId": "UKxM2Of8cN0" }
                ]
            },
            {
                "id": "l1-bai-23",
                "title": "Bài 23: Bảng các số từ 1 đến 100",
                "youtubeId": "SGqTnGz5dQ0",
                "questionType": "l1-bang-so-100",
                "theoryHtml": "<h4>Bảng số từ 1 đến 100</h4><p>Tìm hiểu cấu trúc bảng số, quy luật điền số và thứ tự của các số từ 1 đến 100.</p>",
                "subtopics": [
                    { "id": "l1-bai-23-d1", "title": "Điền số thích hợp vào bảng số hoặc dãy số quy luật", "level": "co-ban", "questionType": "l1-bang-so-100-d1", "youtubeId": "SGqTnGz5dQ0" }
                ]
            },
            {
                "id": "l1-bai-24",
                "title": "Bài 24: Luyện tập chung",
                "youtubeId": "Q7LJ1JM_PsI",
                "questionType": "l1-luyen-tap-c6",
                "theoryHtml": "<h4>Luyện tập số phạm vi 100</h4><p>Tổng hợp kỹ năng đọc viết, phân tích cấu tạo và so sánh số có hai chữ số.</p>",
                "subtopics": [
                    { "id": "l1-bai-24-d1", "title": "Trắc nghiệm tổng hợp số phạm vi 100", "level": "co-ban", "questionType": "l1-luyen-tap-c6-d1", "youtubeId": "Q7LJ1JM_PsI" }
                ]
            }
        ]
    },
    {
        "id": "l1-chuong-7",
        "class": "1",
        "semester": 2,
        "title": "Chủ đề 7: Độ dài và đo độ dài",
        "subtitle": "So sánh độ dài trực quan và đo độ dài bằng đơn vị tự quy ước và xăng-ti-mét",
        "lessons": [
            {
                "id": "l1-bai-25",
                "title": "Bài 25: Dài hơn, ngắn hơn",
                "youtubeId": "BzvoBtMGtBs",
                "questionType": "l1-dai-ngan",
                "theoryHtml": "<h4>So sánh độ dài trực quan</h4><p>Đặt hai vật sát cạnh nhau, so sánh đầu mút còn lại để nhận biết vật nào dài hơn, vật nào ngắn hơn.</p>",
                "subtopics": [
                    { "id": "l1-bai-25-d1", "title": "So sánh độ dài dài hơn, ngắn hơn của các vật", "level": "co-ban", "questionType": "l1-dai-ngan-d1", "youtubeId": "BzvoBtMGtBs" }
                ]
            },
            {
                "id": "l1-bai-26",
                "title": "Bài 26: Đơn vị đo độ dài",
                "youtubeId": "MKKPJzAOaTs",
                "questionType": "l1-don-vi-do",
                "theoryHtml": "<h4>1. Đo bằng đơn vị tự quy ước</h4><p>Sử dụng gang tay, sải tay, bước chân hoặc ghim giấy để đo độ dài.</p><h4>2. Xăng-ti-mét (cm)</h4><p>Xăng-ti-mét là một đơn vị đo độ dài chuẩn. Viết tắt là $cm$. Dùng thước có vạch chia cm để đo.</p>",
                "subtopics": [
                    { "id": "l1-bai-26-d1", "title": "Đọc độ dài các vật theo vạch thước thẳng xăng-ti-mét", "level": "co-ban", "questionType": "l1-don-vi-do-d1", "youtubeId": "MKKPJzAOaTs" }
                ]
            },
            {
                "id": "l1-bai-27",
                "title": "Bài 27: Thực hành ước lượng và đo độ dài",
                "youtubeId": "Qk5_rWbUWRM",
                "questionType": "l1-thuc-hanh-do",
                "theoryHtml": "<h4>Thực hành ước lượng</h4><p>Rèn luyện tư duy ước lượng độ dài các đồ vật xung quanh (sách vở, hộp bút) trước khi thực hiện đo chính xác.</p>",
                "subtopics": [
                    { "id": "l1-bai-27-d1", "title": "Ước lượng và tính toán số đo cm", "level": "nang-cao", "questionType": "l1-thuc-hanh-do-d1", "youtubeId": "Qk5_rWbUWRM" }
                ]
            },
            {
                "id": "l1-bai-28",
                "title": "Bài 28: Luyện tập chung",
                "youtubeId": "jY4QR0UVQvs",
                "questionType": "l1-luyen-tap-c7",
                "theoryHtml": "<h4>Luyện tập đo độ dài</h4><p>Ôn tập tính toán các phép cộng trừ kèm theo đơn vị đo $cm$.</p>",
                "subtopics": [
                    { "id": "l1-bai-28-d1", "title": "Tính toán và so sánh số đo độ dài có kèm đơn vị cm", "level": "co-ban", "questionType": "l1-luyen-tap-c7-d1", "youtubeId": "jY4QR0UVQvs" }
                ]
            }
        ]
    },
    {
        "id": "l1-chuong-8",
        "class": "1",
        "semester": 2,
        "title": "Chủ đề 8: Phép cộng, phép trừ trong phạm vi 100",
        "subtitle": "Các phép tính cộng trừ không nhớ cho số có 2 chữ số trong phạm vi 100",
        "lessons": [
            {
                "id": "l1-bai-29",
                "title": "Bài 29: Phép cộng số có hai chữ số với số có một chữ số",
                "youtubeId": "FPQYzmi5tTI",
                "questionType": "l1-cong-2cs-1cs",
                "theoryHtml": "<h4>Đặt tính rồi tính phép cộng</h4><p>Đặt tính thẳng cột: hàng đơn vị thẳng hàng đơn vị, hàng chục thẳng hàng chục. Cộng từ phải sang trái (cộng hàng đơn vị trước, giữ nguyên hàng chục).</p>",
                "subtopics": [
                    { "id": "l1-bai-29-d1", "title": "Thực hiện phép cộng số có 2 chữ số với số có 1 chữ số", "level": "co-ban", "questionType": "l1-cong-2cs-1cs-d1", "youtubeId": "FPQYzmi5tTI" }
                ]
            },
            {
                "id": "l1-bai-30",
                "title": "Bài 30: Phép cộng số có hai chữ số với số có hai chữ số",
                "youtubeId": "hE7aRmOQBuI",
                "questionType": "l1-cong-2cs-2cs",
                "theoryHtml": "<h4>Đặt tính phép cộng hai số có 2 chữ số</h4><p>Đặt thẳng cột hàng đơn vị thẳng đơn vị, chục thẳng chục. Cộng đơn vị với đơn vị, cộng chục với chục.</p><p>Ví dụ: $34 + 25 = 59$.</p>",
                "subtopics": [
                    { "id": "l1-bai-30-d1", "title": "Thực hiện phép cộng hai số có 2 chữ số (không nhớ)", "level": "co-ban", "questionType": "l1-cong-2cs-2cs-d1", "youtubeId": "hE7aRmOQBuI" },
                    { "id": "l1-bai-30-d2", "title": "Tìm số thích hợp trong phép cộng hai chữ số dạng ô trống", "level": "nang-cao", "questionType": "l1-cong-2cs-2cs-d2", "youtubeId": "hE7aRmOQBuI" }
                ]
            },
            {
                "id": "l1-bai-31",
                "title": "Bài 31: Phép trừ số có hai chữ số cho số có một chữ số",
                "youtubeId": "p0t-2AE0PRg",
                "questionType": "l1-tru-2cs-1cs",
                "theoryHtml": "<h4>Quy tắc đặt tính phép trừ</h4><p>Đặt thẳng cột hàng đơn vị. Trừ hàng đơn vị trước, giữ nguyên hàng chục của số bị trừ.</p>",
                "subtopics": [
                    { "id": "l1-bai-31-d1", "title": "Thực hiện phép trừ số có 2 chữ số cho số có 1 chữ số", "level": "co-ban", "questionType": "l1-tru-2cs-1cs-d1", "youtubeId": "p0t-2AE0PRg" }
                ]
            },
            {
                "id": "l1-bai-32",
                "title": "Bài 32: Phép trừ số có hai chữ số cho số có hai chữ số",
                "youtubeId": "ecsFqK8xUNI",
                "questionType": "l1-tru-2cs-2cs",
                "theoryHtml": "<h4>Đặt tính phép trừ hai số có 2 chữ số</h4><p>Đặt thẳng cột. Thực hiện trừ hàng đơn vị cho hàng đơn vị, hàng chục cho hàng chục.</p><p>Ví dụ: $57 - 24 = 33$.</p>",
                "subtopics": [
                    { "id": "l1-bai-32-d1", "title": "Thực hiện phép trừ hai số có 2 chữ số (không nhớ)", "level": "co-ban", "questionType": "l1-tru-2cs-2cs-d1", "youtubeId": "ecsFqK8xUNI" },
                    { "id": "l1-bai-32-d2", "title": "Tìm số thích hợp trong phép trừ hai chữ số dạng ô trống", "level": "nang-cao", "questionType": "l1-tru-2cs-2cs-d2", "youtubeId": "ecsFqK8xUNI" }
                ]
            },
            {
                "id": "l1-bai-33",
                "title": "Bài 33: Luyện tập chung",
                "youtubeId": "BycQu6PI4M8",
                "questionType": "l1-luyen-tap-c8",
                "theoryHtml": "<h4>Luyện tập phép tính phạm vi 100</h4><p>Ôn tập cộng trừ không nhớ phạm vi 100 và ứng dụng giải toán có lời văn.</p>",
                "subtopics": [
                    { "id": "l1-bai-33-d1", "title": "So sánh biểu thức phép tính trong phạm vi 100", "level": "nang-cao", "questionType": "l1-luyen-tap-c8-d1", "youtubeId": "BycQu6PI4M8" },
                    { "id": "l1-bai-33-d2", "title": "Bài toán giải có lời văn một bước tính cộng trừ", "level": "kho", "questionType": "l1-luyen-tap-c8-d2", "youtubeId": "BycQu6PI4M8" }
                ]
            }
        ]
    },
    {
        "id": "l1-chuong-9",
        "class": "1",
        "semester": 2,
        "title": "Chủ đề 9: Thời gian. Giờ và lịch",
        "subtitle": "Đọc giờ đúng trên mặt đồng hồ và nhận biết các ngày trong tuần",
        "lessons": [
            {
                "id": "l1-bai-34",
                "title": "Bài 34: Xem giờ đúng trên đồng hồ",
                "youtubeId": "HoSX5C_sw58",
                "questionType": "l1-xem-gio",
                "theoryHtml": "<h4>Xem giờ đúng</h4><p>Đồng hồ có kim ngắn chỉ giờ, kim dài chỉ phút.</p><p>Khi kim dài (kim phút) chỉ thẳng vào số $12$, kim ngắn chỉ vào số nào thì đồng hồ chỉ đúng bấy nhiêu giờ.</p>",
                "subtopics": [
                    { "id": "l1-bai-34-d1", "title": "Đọc giờ đúng trên mặt đồng hồ kim", "level": "co-ban", "questionType": "l1-xem-gio-d1", "youtubeId": "HoSX5C_sw58" }
                ]
            },
            {
                "id": "l1-bai-35",
                "title": "Bài 35: Ngày trong tuần",
                "youtubeId": "6LU6oqIMLmI",
                "questionType": "l1-ngay-trong-tuan",
                "theoryHtml": "<h4>Các ngày trong tuần</h4><p>Một tuần lễ có 7 ngày: Thứ Hai, Thứ Ba, Thứ Tư, Thứ Năm, Thứ Sáu, Thứ Bảy, Chủ Nhật.</p>",
                "subtopics": [
                    { "id": "l1-bai-35-d1", "title": "Xác định thứ tự ngày trong tuần và hôm qua, hôm nay, ngày mai", "level": "co-ban", "questionType": "l1-ngay-trong-tuan-d1", "youtubeId": "6LU6oqIMLmI" }
                ]
            },
            {
                "id": "l1-bai-36",
                "title": "Bài 36: Thực hành xem lịch và giờ",
                "youtubeId": "5aSgzci6zws",
                "questionType": "l1-thuc-hanh-lich",
                "theoryHtml": "<h4>Thực hành xem tờ lịch tờ giờ</h4><p>Đọc số ngày trên tờ lịch block và xác định hoạt động phù hợp với khung giờ đúng trong ngày.</p>",
                "subtopics": [
                    { "id": "l1-bai-36-d1", "title": "Xác định ngày trên tờ lịch block và xem giờ hoạt động", "level": "nang-cao", "questionType": "l1-thuc-hanh-lich-d1", "youtubeId": "5aSgzci6zws" }
                ]
            },
            {
                "id": "l1-bai-37",
                "title": "Bài 37: Luyện tập chung",
                "youtubeId": "IPWrJtRV0R8",
                "questionType": "l1-luyen-tap-c9",
                "theoryHtml": "<h4>Luyện tập thời gian và lịch</h4><p>Tổng hợp câu hỏi về đọc đồng hồ và lịch tuần lễ.</p>",
                "subtopics": [
                    { "id": "l1-bai-37-d1", "title": "Trắc nghiệm tổng hợp đồng hồ và lịch", "level": "co-ban", "questionType": "l1-luyen-tap-c9-d1", "youtubeId": "IPWrJtRV0R8" }
                ]
            }
        ]
    },
    {
        "id": "l1-chuong-10",
        "class": "1",
        "semester": 2,
        "title": "Chủ đề 10: Ôn tập cuối năm",
        "subtitle": "Hệ thống hóa toàn bộ chương trình Toán Lớp 1 chuẩn bị lên Lớp 2",
        "lessons": [
            {
                "id": "l1-bai-38",
                "title": "Bài 38: Ôn tập các số và phép tính trong phạm vi 10",
                "youtubeId": "pjDPMIZ7hmk",
                "questionType": "l1-on-tap-cuoi-nam-10",
                "theoryHtml": "<h4>Ôn tập tổng hợp học kì I</h4><p>Ôn tập số và tính toán cộng trừ phạm vi 10.</p>",
                "subtopics": [
                    { "id": "l1-bai-38-d1", "title": "Đề ôn tập tổng hợp số và phép tính phạm vi 10", "level": "co-ban", "questionType": "l1-on-tap-cuoi-nam-10-d1", "youtubeId": "pjDPMIZ7hmk" }
                ]
            },
            {
                "id": "l1-bai-39",
                "title": "Bài 39: Ôn tập các số và phép tính trong phạm vi 100",
                "youtubeId": "dGMIbMk2am4",
                "questionType": "l1-on-tap-cuoi-nam-100",
                "theoryHtml": "<h4>Ôn tập tổng hợp số và tính phạm vi 100</h4><p>Ôn tập số có hai chữ số, phép cộng, phép trừ không nhớ trong phạm vi 100.</p>",
                "subtopics": [
                    { "id": "l1-bai-39-d1", "title": "Đề ôn tập phép tính cộng trừ không nhớ phạm vi 100", "level": "co-ban", "questionType": "l1-on-tap-cuoi-nam-100-d1", "youtubeId": "dGMIbMk2am4" }
                ]
            },
            {
                "id": "l1-bai-40",
                "title": "Bài 40: Ôn tập hình học và đo lường",
                "youtubeId": "V25ov82R74Y",
                "questionType": "l1-on-tap-cuoi-nam-hinh",
                "theoryHtml": "<h4>Ôn tập hình học và đo lường cuối năm</h4><p>Ôn tập hình phẳng, hình khối, đo độ dài cm, thời gian đồng hồ và tờ lịch block.</p>",
                "subtopics": [
                    { "id": "l1-bai-40-d1", "title": "Đề ôn tập tổng hợp hình học và đo lường", "level": "co-ban", "questionType": "l1-on-tap-cuoi-nam-hinh-d1", "youtubeId": "V25ov82R74Y" }
                ]
            },
            {
                "id": "l1-bai-41",
                "title": "Bài 41: Ôn tập chung",
                "youtubeId": "Hl0I96iPXiw",
                "questionType": "l1-on-tap-chung-cuoi-nam",
                "theoryHtml": "<h4>Đề khảo sát năng lực cuối năm</h4><p>Hệ thống hóa toàn bộ năng lực toán học của học sinh Lớp 1 chuẩn bị vững bước lên Lớp 2.</p>",
                "subtopics": [
                    { "id": "l1-bai-41-d1", "title": "Đề thi thử học kì II - Đề số 1 (Tổng hợp)", "level": "nang-cao", "questionType": "l1-on-tap-chung-cuoi-nam-d1", "youtubeId": "Hl0I96iPXiw" },
                    { "id": "l1-bai-41-d2", "title": "Đề thi thử học kì II - Đề số 2 (Phát triển tư duy logic)", "level": "kho", "questionType": "l1-on-tap-chung-cuoi-nam-d2", "youtubeId": "Hl0I96iPXiw" }
                ]
            }
        ]
    },
    {
        "id": "chuong-1",
        "semester": 1,
        "title": "Chương I: Tập hợp các số tự nhiên",
        "subtitle": "Tập hợp, các phép tính cơ bản, lũy thừa và thứ tự thực hiện phép tính",
        "lessons": [
            {
                "id": "bai-1",
                "title": "Bài 1: Tập hợp",
                "youtubeId": "gUtIhlCluwI",
                "questionType": "tap-hop",
                "theoryHtml": "<h4>1. Khái niệm</h4><p>Tập hợp gồm các phần tử nằm trong cặp ngoặc nhọn $\\{\\}$. Ký hiệu $x \\in A$ ($x$ thuộc $A$), $y \\notin A$ ($y$ không thuộc $A$).</p><h4>2. Cách mô tả</h4><p>Cách 1: Liệt kê phần tử. Ví dụ $A = \\{1; 2; 3; 4\\}$.<br>Cách 2: Chỉ ra tính chất đặc trưng. Ví dụ $A = \\{x \\in \\mathbb{N} \\mid x < 5\\}$.</p>",
                "subtopics": [
                    {
                        "id": "bai-1-d1",
                        "title": "Dạng 1: Mô tả một tập hợp cho trước",
                        "level": "co-ban",
                        "questionType": "tap-hop-d1",
                        "youtubeId": "ojvCobTP-0k",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Mô tả một tập hợp cho trước</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-1-d2",
                        "title": "Dạng 2: Quan hệ giữa phần tử và tập hợp",
                        "level": "co-ban",
                        "questionType": "tap-hop-d2",
                        "youtubeId": "Y0LOwciyU_k",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Quan hệ giữa phần tử và tập hợp</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-1-d3",
                        "title": "Dạng 3: Tìm số phần tử của tập hợp",
                        "level": "nang-cao",
                        "questionType": "tap-hop-d3",
                        "youtubeId": "y4USd4stIMY",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Tìm số phần tử của tập hợp</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-1-d4",
                        "title": "Dạng 4: Minh họa tập hợp cho trước bằng biểu đồ Ven",
                        "level": "kho",
                        "questionType": "tap-hop-d4",
                        "youtubeId": "Zo1u39UcrVE",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 4: Minh họa tập hợp cho trước bằng biểu đồ Ven</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-2",
                "title": "Bài 2: Cách ghi số tự nhiên",
                "youtubeId": "ov_6dV59DSQ",
                "questionType": "ghi-so-tu-nhien",
                "theoryHtml": "<h4>1. Hệ thập phân</h4><p>Sử dụng 10 chữ số từ 0 đến 9. Giá trị chữ số phụ thuộc vị trí: $\\overline{ab} = 10a + b$; $\\overline{abc} = 100a + 10b + c$.</p><h4>2. Số La Mã</h4><p>Chữ số cơ bản: I ($1$), V ($5$), X ($10$). Quy tắc ghép chữ số: IV ($4$), IX ($9$), XIV ($14$), XXIV ($24$).</p>",
                "subtopics": [
                    {
                        "id": "bai-2-d1",
                        "title": "Dạng 1: Ghi các số tự nhiên, phân biệt số và chữ số, giá trị của chữ số",
                        "level": "co-ban",
                        "questionType": "ghi-so-tu-nhien-d1",
                        "youtubeId": "QfW2CQTtvM4",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Ghi các số tự nhiên, phân biệt số và chữ số, giá trị của chữ số</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-2-d2",
                        "title": "Dạng 2: Viết số tự nhiên theo yêu cầu cho trước",
                        "level": "nang-cao",
                        "questionType": "ghi-so-tu-nhien-d2",
                        "youtubeId": "RiAR4vJSgBI",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Viết số tự nhiên theo yêu cầu cho trước</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-2-d3",
                        "title": "Dạng 3: Xác định sự tăng giảm giá trị của một số khi thêm một chữ số vào số đó",
                        "level": "kho",
                        "questionType": "ghi-so-tu-nhien-d3",
                        "youtubeId": "rbrYiyRNHwM",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Xác định sự tăng giảm giá trị của một số khi thêm một chữ số vào số đó</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-2-d4",
                        "title": "Dạng 4: Đọc và viết các chữ số bằng La Mã",
                        "level": "co-ban",
                        "questionType": "ghi-so-tu-nhien-d4",
                        "youtubeId": "yMhmXoDLyvs",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 4: Đọc và viết các chữ số bằng La Mã</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-3",
                "title": "Bài 3: Thứ tự trong tập hợp các số tự nhiên",
                "youtubeId": "HDvDI8o__IY",
                "questionType": "tap-hop-thu-tu",
                "theoryHtml": "<h4>1. So sánh hai số tự nhiên</h4><p>Trong hai số tự nhiên khác nhau, luôn có một số nhỏ hơn số kia. Nếu $a < b$, trên tia số điểm $a$ nằm bên trái điểm $b$.</p><h4>2. Ký hiệu $\\le$ và $\\ge$</h4><p>$a \\le b$ nghĩa là $a < b$ hoặc $a = b$.<br>Tập hợp số tự nhiên là $\\mathbb{N} = \\{0; 1; 2; ...\\}$, tập $\\mathbb{N}^* = \\{1; 2; 3; ...\\}$.</p>",
                "subtopics": [
                    {
                        "id": "bai-3-d1",
                        "title": "Dạng 1: Biểu diễn tập hợp các số tự nhiên thỏa mãn điều kiện cho trước",
                        "level": "co-ban",
                        "questionType": "tap-hop-thu-tu",
                        "youtubeId": "ojvCobTP-0k",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Biểu diễn tập hợp các số tự nhiên thỏa mãn điều kiện cho trước</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-3-d2",
                        "title": "Dạng 2: Biểu diễn số tự nhiên trên trục số",
                        "level": "co-ban",
                        "questionType": "tap-hop-thu-tu",
                        "youtubeId": "y3G_FO5iMpU",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Biểu diễn số tự nhiên trên trục số</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-3-d3",
                        "title": "Dạng 3: Đếm số hoặc chữ số",
                        "level": "nang-cao",
                        "questionType": "tap-hop-thu-tu",
                        "youtubeId": "D94NLpT8Qzg",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Đếm số hoặc chữ số</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-4",
                "title": "Bài 4: Phép cộng và phép trừ số tự nhiên",
                "youtubeId": "NKTbkIdTdpc",
                "questionType": "cong-tru-so-tu-nhien",
                "theoryHtml": "<h4>1. Phép cộng</h4><p>$a + b = c$ (số hạng + số hạng = tổng). Tính chất: Giao hoán $a+b = b+a$; Kết hợp $(a+b)+c = a+(b+c)$.</p><h4>2. Phép trừ</h4><p>$a - b = c$ (số bị trừ - số trừ = hiệu). Phép trừ chỉ thực hiện được trong $\\mathbb{N}$ nếu $a \\ge b$.</p>",
                "subtopics": [
                    {
                        "id": "bai-4-d1",
                        "title": "Dạng 1: Thực hiện phép tính cộng trừ các số tự nhiên",
                        "level": "co-ban",
                        "questionType": "cong-tru-so-tu-nhien",
                        "youtubeId": "loWJ_rLpHgo",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Thực hiện phép tính cộng trừ các số tự nhiên</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-4-d2",
                        "title": "Dạng 2: Tìm số hoặc chữ số chưa biết trong phép tính",
                        "level": "nang-cao",
                        "questionType": "cong-tru-so-tu-nhien",
                        "youtubeId": "KwKl6kXujuk",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Tìm số hoặc chữ số chưa biết trong phép tính</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-4-d3",
                        "title": "Dạng 3: Các bài toán thực tế sử dụng phép cộng và phép trừ",
                        "level": "co-ban",
                        "questionType": "cong-tru-so-tu-nhien",
                        "youtubeId": "ppjTnBHhtXU",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Các bài toán thực tế sử dụng phép cộng và phép trừ</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-4-d4",
                        "title": "Dạng 4: Tính tổng của dãy số tự nhiên cách đều",
                        "level": "kho",
                        "questionType": "cong-tru-so-tu-nhien",
                        "youtubeId": "eUWntZ7I_R4",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 4: Tính tổng của dãy số tự nhiên cách đều</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-5",
                "title": "Bài 5: Phép nhân và phép chia số tự nhiên",
                "youtubeId": "jyckLAGo1Hw",
                "questionType": "nhan-chia-so-tu-nhien",
                "theoryHtml": "<h4>1. Phép nhân</h4><p>$a \\cdot b = d$ (thừa số $\\cdot$ thừa số = tích). Tính chất: Giao hoán, kết hợp, phân phối của phép nhân đối với phép cộng: $a(b+c) = ab + ac$.</p><h4>2. Phép chia</h4><p>Phép chia hết: $a = b \\cdot q$.<br>Phép chia có dư: $a = b \\cdot q + r$ (với $0 < r < b$).</p>",
                "subtopics": [
                    {
                        "id": "bai-5-d1",
                        "title": "Dạng 1: Thực hiện phép nhân, phép chia các số tự nhiên",
                        "level": "co-ban",
                        "questionType": "nhan-chia-so-tu-nhien",
                        "youtubeId": "jouYaEcHs6c",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Thực hiện phép nhân, phép chia các số tự nhiên</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-5-d2",
                        "title": "Dạng 2: Tìm số chưa biết trong phép tính",
                        "level": "nang-cao",
                        "questionType": "nhan-chia-so-tu-nhien",
                        "youtubeId": "KwKl6kXujuk",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Tìm số chưa biết trong phép tính</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-5-d3",
                        "title": "Dạng 3: Các bài toán thực tế về phép nhân, phép chia",
                        "level": "kho",
                        "questionType": "nhan-chia-so-tu-nhien",
                        "youtubeId": "U_zLh1uKCAA",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Các bài toán thực tế về phép nhân, phép chia</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "lt-c1-1",
                "title": "Luyện tập chung (Bài 1 - Bài 5)",
                "youtubeId": "",
                "questionType": "luyen-tap-chung-c1-1",
                "theoryHtml": "<h4>Luyện tập tổng hợp</h4><p>Trộn lẫn các câu hỏi về tập hợp, số La Mã, so sánh số tự nhiên và thực hiện phép tính cộng trừ nhân chia trong tập hợp số tự nhiên $\\mathbb{N}$.</p>",
                "subtopics": []
            },
            {
                "id": "bai-6",
                "title": "Bài 6: Lũy thừa với số mũ tự nhiên",
                "youtubeId": "HhEu0rfVclw",
                "questionType": "luy-thua",
                "theoryHtml": "<h4>1. Định nghĩa lũy thừa</h4><p>Lũy thừa bậc $n$ của số tự nhiên $a$ là tích của $n$ thừa số bằng nhau: $a^n = a \\cdot a \\cdot ... \\cdot a$ ($n$ thừa số $a$). Quy ước $a^1 = a$, $a^0 = 1$ ($a \\neq 0$).</p><h4>2. Nhân và chia hai lũy thừa cùng cơ số</h4><p>Nhân: $a^m \\cdot a^n = a^{m+n}$<br>Chia: $a^m : a^n = a^{m-n}$ ($a \\neq 0, m \\ge n$).</p>",
                "subtopics": [
                    {
                        "id": "bai-6-d1",
                        "title": "Dạng 1: Tìm cơ số, số mũ của một lũy thừa cho trước",
                        "level": "co-ban",
                        "questionType": "luy-thua",
                        "youtubeId": "itPy2qxjr1s",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Tìm cơ số, số mũ của một lũy thừa cho trước</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-6-d2",
                        "title": "Dạng 2: Viết kết quả dưới dạng một lũy thừa",
                        "level": "co-ban",
                        "questionType": "luy-thua",
                        "youtubeId": "y97azz6zHQ8",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Viết kết quả dưới dạng một lũy thừa</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-6-d3",
                        "title": "Dạng 3: Bài tập liên qua đến a bình phương, a lập phương",
                        "level": "nang-cao",
                        "questionType": "luy-thua",
                        "youtubeId": "xjW3PYc6HNs",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Bài tập liên qua đến a bình phương, a lập phương</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-6-d4",
                        "title": "Dạng 4: Thực hiện phép nhân, phép chia các lũy thừa cùng cơ số",
                        "level": "co-ban",
                        "questionType": "luy-thua",
                        "youtubeId": "2-nAso1FvJQ",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 4: Thực hiện phép nhân, phép chia các lũy thừa cùng cơ số</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-6-d5",
                        "title": "Dạng 5: Các bài toán thực tế sử dụng lũy thừa",
                        "level": "kho",
                        "questionType": "luy-thua",
                        "youtubeId": "5vnoqRMWGYg",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 5: Các bài toán thực tế sử dụng lũy thừa</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-7",
                "title": "Bài 7: Thứ tự thực hiện các phép tính",
                "youtubeId": "2dD3C3soRGg",
                "questionType": "thu-tu-phep-tinh",
                "theoryHtml": "<h4>Thứ tự thực hiện phép tính</h4><p>1. Đối với biểu thức không có dấu ngoặc: Lũy thừa $\\rightarrow$ Nhân và chia $\\rightarrow$ Cộng và trừ.<br>2. Đối với biểu thức có dấu ngoặc: Ngoặc tròn $($ $) \\rightarrow$ Ngoặc vuông $[$ $] \\rightarrow$ Ngoặc nhọn $\\{$ $\\}$.</p>",
                "subtopics": [
                    {
                        "id": "bai-7-d1",
                        "title": "Dạng 1: Thực hiện phép tính theo thứ tự",
                        "level": "co-ban",
                        "questionType": "thu-tu-phep-tinh",
                        "youtubeId": "rRtHl3wWw0Q",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Thực hiện phép tính theo thứ tự</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-7-d2",
                        "title": "Dạng 2: Lập biểu thức có chứa chữ và tính giá trị biểu thức",
                        "level": "nang-cao",
                        "questionType": "thu-tu-phep-tinh",
                        "youtubeId": "67mH2yuFBZw",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Lập biểu thức có chứa chữ và tính giá trị biểu thức</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-7-d3",
                        "title": "Dạng 3: Tìm số chưa biết trong phép tính",
                        "level": "nang-cao",
                        "questionType": "thu-tu-phep-tinh",
                        "youtubeId": "KwKl6kXujuk",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Tìm số chưa biết trong phép tính</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-7-d4",
                        "title": "Dạng 4: So sánh giá trị của hai biểu thức số",
                        "level": "kho",
                        "questionType": "thu-tu-phep-tinh",
                        "youtubeId": "1r8qtrezxY8",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 4: So sánh giá trị của hai biểu thức số</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "lt-c1-2",
                "title": "Luyện tập chung (Lũy thừa & Phép tính)",
                "youtubeId": "",
                "questionType": "luyen-tap-chung-c1-2",
                "theoryHtml": "<h4>Luyện tập tổng hợp</h4><p>Ôn tập các phép tính lũy thừa, quy tắc nhân/chia lũy thừa cùng cơ số và thứ tự thực hiện các phép tính phức tạp có chứa dấu ngoặc.</p>",
                "subtopics": []
            },
            {
                "id": "kt-c1",
                "title": "Bài tập cuối chương I",
                "youtubeId": "",
                "questionType": "cuoi-chuong-1",
                "theoryHtml": "<h4>Kiểm tra tổng hợp Chương I</h4><p>Đánh giá toàn diện kiến thức Chương I bao gồm tập hợp, ghi số tự nhiên, các phép toán số tự nhiên, lũy thừa và thứ tự thực hiện phép tính.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "chuong-2",
        "semester": 1,
        "title": "Chương II: Tính chia hết trong tập hợp các số tự nhiên",
        "subtitle": "Quan hệ chia hết, dấu hiệu chia hết, số nguyên tố, ước chung và bội chung",
        "lessons": [
            {
                "id": "bai-8",
                "title": "Bài 8: Quan hệ chia hết và tính chất",
                "youtubeId": "CAd3j9cHw0c",
                "questionType": "quan-he-chia-het",
                "theoryHtml": "<h4>1. Khái niệm</h4><p>Số tự nhiên $a$ chia hết cho số tự nhiên $b$ ($b \\neq 0$) ký hiệu là $a \\space \\vdots \\space b$. Ngược lại ký hiệu $a \\space \\not\\vdots \\space b$. Khi đó $a$ là bội của $b$, $b$ là ước của $a$.</p><h4>2. Tính chất chia hết của một tổng</h4><p>Nếu $a \\space \\vdots \\space m$ và $b \\space \\vdots \\space m$ thì $(a+b) \\space \\vdots \\space m$.<br>Nếu $a \\space \\not\\vdots \\space m$ và $b \\space \\vdots \\space m$ thì $(a+b) \\space \\not\\vdots \\space m$.</p>",
                "subtopics": [
                    {
                        "id": "bai-8-d1",
                        "title": "Dạng 1: Quan hệ chia hết và tính chất",
                        "level": "co-ban",
                        "questionType": "quan-he-chia-het",
                        "youtubeId": "9ssHXGSh1_g",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Quan hệ chia hết và tính chất</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-8-d2",
                        "title": "Dạng 2: Tìm ước và bội của một số tự nhiên",
                        "level": "co-ban",
                        "questionType": "quan-he-chia-het",
                        "youtubeId": "Ve5yE91cQH4",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Tìm ước và bội của một số tự nhiên</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-8-d3",
                        "title": "Dạng 3: Bài toán thực tế về quan hệ chia hết",
                        "level": "nang-cao",
                        "questionType": "quan-he-chia-het",
                        "youtubeId": "l9NPGv8ObwQ",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Bài toán thực tế về quan hệ chia hết</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-9",
                "title": "Bài 9: Dấu hiệu chia hết",
                "youtubeId": "Mrw1giZyqX8",
                "questionType": "dau-hieu-chia-het",
                "theoryHtml": "<h4>Dấu hiệu chia hết cho 2, 5, 3, 9</h4><p>- Cho 2: Chữ số tận cùng là chẵn ($0, 2, 4, 6, 8$).<br>- Cho 5: Chữ số tận cùng là $0$ hoặc $5$.<br>- Cho 9: Tổng các chữ số chia hết cho 9.<br>- Cho 3: Tổng các chữ số chia hết cho 3.</p>",
                "subtopics": [
                    {
                        "id": "bai-9-d1",
                        "title": "Dạng 1: Dấu hiệu chia hết cho 2, 5, 3, 9",
                        "level": "co-ban",
                        "questionType": "dau-hieu-chia-het",
                        "youtubeId": "8iKz2Q-0AXE",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Dấu hiệu chia hết cho 2, 5, 3, 9</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-9-d2",
                        "title": "Dạng 2: Lập số chia hết từ các chữ số cho trước",
                        "level": "nang-cao",
                        "questionType": "dau-hieu-chia-het",
                        "youtubeId": "hpBNTo2mUSU",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Lập số chia hết từ các chữ số cho trước</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-9-d3",
                        "title": "Dạng 3: Bài toán thực tế về dấu hiệu chia hết",
                        "level": "kho",
                        "questionType": "dau-hieu-chia-het",
                        "youtubeId": "l9NPGv8ObwQ",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Bài toán thực tế về dấu hiệu chia hết</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-10",
                "title": "Bài 10: Số nguyên tố",
                "youtubeId": "2BUUS-uTWBg",
                "questionType": "so-nguyen-to",
                "theoryHtml": "<h4>Số nguyên tố và Hợp số</h4><p>- <b>Số nguyên tố</b> là số tự nhiên lớn hơn 1, chỉ có hai ước là 1 và chính nó. Ví dụ: $2, 3, 5, 7, 11...$<br>- <b>Hợp số</b> là số tự nhiên lớn hơn 1, có nhiều hơn hai ước. Ví dụ: $4, 6, 8, 9...$</p>",
                "subtopics": [
                    {
                        "id": "bai-10-d1",
                        "title": "Dạng 1: Nhận biết số nguyên tố, hợp số",
                        "level": "co-ban",
                        "questionType": "so-nguyen-to",
                        "youtubeId": "9OyzS54vbps",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Nhận biết số nguyên tố, hợp số</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-10-d2",
                        "title": "Dạng 2: Phân tích một số ra thừa số nguyên tố",
                        "level": "co-ban",
                        "questionType": "so-nguyen-to",
                        "youtubeId": "IhzvsVqCL3M",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Phân tích một số ra thừa số nguyên tố</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-10-d3",
                        "title": "Dạng 3: Tìm ước thông qua phân tích ra thừa số nguyên tố",
                        "level": "nang-cao",
                        "questionType": "so-nguyen-to",
                        "youtubeId": "IhzvsVqCL3M",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Tìm ước thông qua phân tích ra thừa số nguyên tố</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "lt-c2-1",
                "title": "Luyện tập chung (Dấu hiệu chia hết & Số nguyên tố)",
                "youtubeId": "",
                "questionType": "luyen-tap-chung-c2-1",
                "theoryHtml": "<h4>Luyện tập ôn tập kiến thức</h4><p>Rèn luyện kỹ năng phân biệt số nguyên tố, hợp số và áp dụng các dấu hiệu chia hết cho 2, 5, 3, 9 để giải các bài toán nhanh.</p>",
                "subtopics": []
            },
            {
                "id": "bai-11",
                "title": "Bài 11: Ước chung. Ước chung lớn nhất",
                "youtubeId": "mWtYss5u7_s",
                "questionType": "ucln",
                "theoryHtml": "<h4>Ước chung lớn nhất (ƯCLN)</h4><p>ƯCLN của hai hay nhiều số là số lớn nhất trong tập hợp các ước chung của các số đó. Ký hiệu là ƯCLN($a, b$).</p><h4>Cách tìm ƯCLN bằng phân tích ra thừa số nguyên tố</h4><p>Bước 1: Phân tích mỗi số ra thừa số nguyên tố.<br>Bước 2: Chọn các thừa số nguyên tố chung.<br>Bước 3: Lập tích các thừa số đã chọn, mỗi thừa số lấy với số mũ nhỏ nhất.</p>",
                "subtopics": [
                    {
                        "id": "bai-11-d1",
                        "title": "Dạng 1: Tìm ước chung và ƯCLN",
                        "level": "co-ban",
                        "questionType": "ucln",
                        "youtubeId": "APbwP0XX2a0",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Tìm ước chung và ƯCLN</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-11-d2",
                        "title": "Dạng 2: Rút gọn phân số về tối giản",
                        "level": "co-ban",
                        "questionType": "ucln",
                        "youtubeId": "Bjb0TAHepuM",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Rút gọn phân số về tối giản</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-11-d3",
                        "title": "Dạng 3: Bài toán thực tế ứng dụng ƯCLN",
                        "level": "nang-cao",
                        "questionType": "ucln",
                        "youtubeId": "LGCa8EWBwmE",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Bài toán thực tế ứng dụng ƯCLN</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-12",
                "title": "Bài 12: Bội chung. Bội chung nhỏ nhất",
                "youtubeId": "DvWTK48e7Hw",
                "questionType": "bcnn",
                "theoryHtml": "<h4>Bội chung nhỏ nhất (BCNN)</h4><p>BCNN của hai hay nhiều số là số nhỏ nhất khác 0 trong tập hợp các bội chung của các số đó. Ký hiệu là BCNN($a, b$).</p><h4>Cách tìm BCNN</h4><p>Phân tích ra thừa số nguyên tố, chọn các thừa số nguyên tố chung và riêng, lập tích với số mũ lớn nhất của mỗi thừa số.</p>",
                "subtopics": [
                    {
                        "id": "bai-12-d1",
                        "title": "Dạng 1: Tìm bội chung và BCNN",
                        "level": "co-ban",
                        "questionType": "bcnn",
                        "youtubeId": "3j4dQJ5coXE",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Tìm bội chung và BCNN</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-12-d2",
                        "title": "Dạng 2: Quy đồng mẫu số các phân số",
                        "level": "co-ban",
                        "questionType": "bcnn",
                        "youtubeId": "-MxOATha82Y",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Quy đồng mẫu số các phân số</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-12-d3",
                        "title": "Dạng 3: Bài toán thực tế ứng dụng BCNN",
                        "level": "nang-cao",
                        "questionType": "bcnn",
                        "youtubeId": "e_GxjE0-EOM",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Bài toán thực tế ứng dụng BCNN</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "lt-c2-2",
                "title": "Luyện tập chung (ƯCLN & BCNN)",
                "youtubeId": "",
                "questionType": "luyen-tap-chung-c2-2",
                "theoryHtml": "<h4>Luyện tập ƯC, BC, ƯCLN, BCNN</h4><p>Ứng dụng tìm ước chung lớn nhất và bội chung nhỏ nhất để giải các bài toán quy đồng mẫu số và toán thực tế chia nhóm, chia quà.</p>",
                "subtopics": []
            },
            {
                "id": "kt-c2",
                "title": "Bài tập cuối chương II",
                "youtubeId": "",
                "questionType": "cuoi-chuong-2",
                "theoryHtml": "<h4>Kiểm tra tổng hợp Chương II</h4><p>Đánh giá toàn bộ kiến thức về quan hệ chia hết, dấu hiệu chia hết, số nguyên tố, phân tích ra thừa số nguyên tố, tìm ƯCLN và BCNN.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "chuong-3",
        "semester": 1,
        "title": "Chương III: Số nguyên",
        "subtitle": "Số nguyên âm, số nguyên dương, so sánh số nguyên và các phép tính cộng trừ nhân chia số nguyên",
        "lessons": [
            {
                "id": "bai-13",
                "title": "Bài 13: Tập hợp các số nguyên",
                "youtubeId": "CGoCjPhhF5w",
                "questionType": "tap-hop-so-nguyen",
                "theoryHtml": "<h4>Tập hợp số nguyên $\\mathbb{Z}$</h4><p>Gồm các số nguyên âm $\\{..., -3; -2; -1\\}$, số 0 và các số nguyên dương $\\{1; 2; 3; ...\\}$. Ký hiệu: $\\mathbb{Z} = \\{..., -2; -1; 0; 1; 2; ...\\}$.</p><h4>So sánh số nguyên</h4><p>Số nguyên âm luôn nhỏ hơn 0 và nhỏ hơn số nguyên dương. So sánh hai số âm: số nào có phần tự nhiên lớn hơn thì nhỏ hơn (Ví dụ $-5 < -3$).</p>",
                "subtopics": [
                    {
                        "id": "bai-13-d1",
                        "title": "Dạng 1: Các bài toán thực tế về số nguyên âm",
                        "level": "co-ban",
                        "questionType": "tap-hop-so-nguyen",
                        "youtubeId": "ppjTnBHhtXU",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Các bài toán thực tế về số nguyên âm</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-13-d2",
                        "title": "Dạng 2: Biểu diễn số nguyên trên trục số",
                        "level": "co-ban",
                        "questionType": "tap-hop-so-nguyen",
                        "youtubeId": "kxziRt6Y6PM",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Biểu diễn số nguyên trên trục số</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-13-d3",
                        "title": "Dạng 3: So sánh các số nguyên",
                        "level": "co-ban",
                        "questionType": "tap-hop-so-nguyen",
                        "youtubeId": "Cab-HRzszJU",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: So sánh các số nguyên</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-13-d4",
                        "title": "Dạng 4: Tìm số nguyên với điều kiện cho trước",
                        "level": "nang-cao",
                        "questionType": "tap-hop-so-nguyen",
                        "youtubeId": "SfDt2YPhKos",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 4: Tìm số nguyên với điều kiện cho trước</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-14",
                "title": "Bài 14: Phép cộng và phép trừ số nguyên",
                "youtubeId": "5kRbQiDTd6A",
                "questionType": "cong-tru-so-nguyen",
                "theoryHtml": "<h4>1. Phép cộng</h4><p>- Cùng dấu âm: $(-x)+(-y) = -(x+y)$.<br>- Khác dấu: Lấy số lớn trừ số nhỏ (ở phần tự nhiên) rồi đặt trước kết quả dấu của số có phần tự nhiên lớn hơn.</p><h4>2. Phép trừ</h4><p>Muốn trừ số nguyên $a$ cho số nguyên $b$, ta cộng $a$ với số đối của $b$: $a - b = a + (-b)$. Quy tắc: trừ của trừ thành cộng: $a - (-b) = a + b$.</p>",
                "subtopics": [
                    {
                        "id": "bai-14-d1",
                        "title": "Dạng 1: Xác định phần dấu và phần số tự nhiên. Tìm số đối",
                        "level": "co-ban",
                        "questionType": "cong-tru-so-nguyen",
                        "youtubeId": "G-aEBty43Oo",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Xác định phần dấu và phần số tự nhiên. Tìm số đối</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-14-d2",
                        "title": "Dạng 2: Cộng, trừ hai số nguyên",
                        "level": "co-ban",
                        "questionType": "cong-tru-so-nguyen",
                        "youtubeId": "H7POaeTMxsk",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Cộng, trừ hai số nguyên</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-14-d3",
                        "title": "Dạng 3: Các bài toán về phép cộng, phép trừ số nguyên trong thực tế",
                        "level": "nang-cao",
                        "questionType": "cong-tru-so-nguyen",
                        "youtubeId": "ppjTnBHhtXU",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Các bài toán về phép cộng, phép trừ số nguyên trong thực tế</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-15",
                "title": "Bài 15: Quy tắc dấu ngoặc",
                "youtubeId": "vG8StiRSEpc",
                "questionType": "dau-ngoac",
                "theoryHtml": "<h4>Quy tắc dấu ngoặc</h4><p>- Khi bỏ dấu ngoặc có dấu \"+\" đằng trước, ta giữ nguyên dấu của các số hạng trong ngoặc: $a + (b - c) = a + b - c$.<br>- Khi bỏ dấu ngoặc có dấu \"-\" đằng trước, ta phải đổi dấu tất cả các số hạng trong ngoặc: $a - (b - c) = a - b + c$.</p>",
                "subtopics": [
                    {
                        "id": "bai-15-d1",
                        "title": "Dạng 1: Quy tắc dấu ngoặc",
                        "level": "co-ban",
                        "questionType": "dau-ngoac",
                        "youtubeId": "juniMrBi0E0",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Quy tắc dấu ngoặc</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-15-d2",
                        "title": "Dạng 2: Tính nhanh, tính hợp lí",
                        "level": "nang-cao",
                        "questionType": "dau-ngoac",
                        "youtubeId": "9FUuh9U-Oy4",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Tính nhanh, tính hợp lí</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "lt-c3-1",
                "title": "Luyện tập chung (Phép cộng & trừ số nguyên)",
                "youtubeId": "",
                "questionType": "luyen-tap-chung-c3-1",
                "theoryHtml": "<h4>Luyện tập phép cộng trừ số nguyên</h4><p>Rèn luyện tính toán cộng trừ số nguyên cùng dấu, khác dấu, áp dụng quy tắc dấu ngoặc để tính toán hợp lý và nhanh chóng.</p>",
                "subtopics": []
            },
            {
                "id": "bai-16",
                "title": "Bài 16: Phép nhân số nguyên",
                "youtubeId": "eS3gwJAe_hA",
                "questionType": "nhan-so-nguyen",
                "theoryHtml": "<h4>Nhân hai số nguyên</h4><p>- Nhân hai số nguyên cùng dấu: Tích là số dương. Ví dụ $(-3) \\cdot (-5) = 15$. Quy tắc: $(-) \\cdot (-) = (+)$.<br>- Nhân hai số nguyên khác dấu: Tích là số âm. Ví dụ $(-3) \\cdot 5 = -15$. Quy tắc: $(-) \\cdot (+) = (-)$.</p>",
                "subtopics": [
                    {
                        "id": "bai-16-d1",
                        "title": "Dạng 1: Thực hiện phép tính nhân số nguyên",
                        "level": "co-ban",
                        "questionType": "nhan-so-nguyen",
                        "youtubeId": "Q7D-5HXZ-FE",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Thực hiện phép tính nhân số nguyên</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-16-d2",
                        "title": "Dạng 2: Tính giá trị biểu thức",
                        "level": "co-ban",
                        "questionType": "nhan-so-nguyen",
                        "youtubeId": "67mH2yuFBZw",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Tính giá trị biểu thức</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-16-d3",
                        "title": "Dạng 3: Rút gọn biểu thức",
                        "level": "nang-cao",
                        "questionType": "nhan-so-nguyen",
                        "youtubeId": "wjczaQEHxb4",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Rút gọn biểu thức</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-16-d4",
                        "title": "Dạng 4: Tìm số chưa biết",
                        "level": "nang-cao",
                        "questionType": "nhan-so-nguyen",
                        "youtubeId": "KwKl6kXujuk",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 4: Tìm số chưa biết</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-16-d5",
                        "title": "Dạng 5: Bài toán có lời văn",
                        "level": "nang-cao",
                        "questionType": "nhan-so-nguyen",
                        "youtubeId": "l9NPGv8ObwQ",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 5: Bài toán có lời văn</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-16-d6",
                        "title": "Dạng 6: Tìm cặp số nguyên (x, y) thỏa mãn x.y = a",
                        "level": "kho",
                        "questionType": "nhan-so-nguyen",
                        "youtubeId": "IKOHh_31HDg",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 6: Tìm cặp số nguyên (x, y) thỏa mãn x.y = a</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-17",
                "title": "Bài 17: Phép chia hết. Ước và bội của một số nguyên",
                "youtubeId": "0mOTVCu3VKQ",
                "questionType": "chia-het-uoc-boi-so-nguyen",
                "theoryHtml": "<h4>Phép chia hết và Ước, Bội số nguyên</h4><p>Cho $a, b \\in \\mathbb{Z}$ ($b \\neq 0$). Nếu có số nguyên $q$ sao cho $a = b \\cdot q$ thì ta nói $a$ chia hết cho $b$ ($a \\space \\vdots \\space b$). Khi đó $a$ là bội của $b$, $b$ là ước của $a$.</p><h4>Ví dụ</h4><p>Các ước của $6$ là: $\\{1; -1; 2; -2; 3; -3; 6; -6\\}$.</p>",
                "subtopics": [
                    {
                        "id": "bai-17-d1",
                        "title": "Dạng 1: Tìm các ước và bội của một số nguyên",
                        "level": "co-ban",
                        "questionType": "chia-het-uoc-boi-so-nguyen",
                        "youtubeId": "TXH05lguUqI",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Tìm các ước và bội của một số nguyên</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-17-d2",
                        "title": "Dạng 2: Tìm số chưa biết",
                        "level": "nang-cao",
                        "questionType": "chia-het-uoc-boi-so-nguyen",
                        "youtubeId": "KwKl6kXujuk",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Tìm số chưa biết</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-17-d3",
                        "title": "Dạng 3: Tìm số nguyên thỏa mãn điều kiện chia hết",
                        "level": "kho",
                        "questionType": "chia-het-uoc-boi-so-nguyen",
                        "youtubeId": "bO3ANS4FEIA",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Tìm số nguyên thỏa mãn điều kiện chia hết</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "lt-c3-2",
                "title": "Luyện tập chung (Nhân chia & Ước bội số nguyên)",
                "youtubeId": "",
                "questionType": "luyen-tap-chung-c3-2",
                "theoryHtml": "<h4>Luyện tập tổng hợp</h4><p>Ôn luyện các quy tắc nhân số nguyên cùng dấu/khác dấu, phép chia hết và cách tìm tập hợp các ước và bội của một số nguyên.</p>",
                "subtopics": []
            },
            {
                "id": "kt-c3",
                "title": "Bài tập cuối chương III",
                "youtubeId": "",
                "questionType": "cuoi-chuong-3",
                "theoryHtml": "<h4>Kiểm tra tổng hợp Chương III</h4><p>Đánh giá toàn diện kiến thức Chương III về tập hợp số nguyên, phép cộng, trừ, nhân, chia số nguyên, quy tắc dấu ngoặc và tìm ước, bội số nguyên.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "chuong-4",
        "semester": 1,
        "title": "Chương IV: Một số hình phẳng trong thực tế",
        "subtitle": "Nhận biết các hình tam giác đều, hình vuông, lục giác đều, hình chữ nhật, hình thoi, bình hành, thang cân",
        "lessons": [
            {
                "id": "bai-18",
                "title": "Bài 18: Hình tam giác đều. Hình vuông. Hình lục giác đều",
                "youtubeId": "9g3WAUockz4",
                "questionType": "hinh-hoc-chuong-4",
                "theoryHtml": "<h4>1. Tam giác đều</h4><p>Có 3 cạnh bằng nhau, 3 góc bằng nhau và bằng $60^\\circ$.</p><h4>2. Hình vuông</h4><p>Có 4 cạnh bằng nhau, 4 góc vuông, 2 đường chéo bằng nhau.</p><h4>3. Hình lục giác đều</h4><p>Có 6 cạnh bằng nhau, 6 góc bằng nhau, 3 đường chéo chính bằng nhau.</p>",
                "subtopics": [
                    {
                        "id": "bai-18-d1",
                        "title": "Dạng 1: Nhận dạng tam giác đều, hình vuông, lục giác đều",
                        "level": "co-ban",
                        "questionType": "hinh-hoc-chuong-4",
                        "youtubeId": "wGt3XicQcsU",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Nhận dạng tam giác đều, hình vuông, lục giác đều</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-18-d2",
                        "title": "Dạng 2: Vẽ tam giác đều, hình vuông, lục giác đều",
                        "level": "nang-cao",
                        "questionType": "hinh-hoc-chuong-4",
                        "youtubeId": "wGt3XicQcsU",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Vẽ tam giác đều, hình vuông, lục giác đều</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-19",
                "title": "Bài 19: Hình chữ nhật. Hình thoi. Hình bình hành. Hình thang cân",
                "youtubeId": "Cb16XRY2hvI",
                "questionType": "hinh-hoc-2-chuong-4",
                "theoryHtml": "<h4>Đặc điểm các hình</h4><p>- <b>Hình chữ nhật:</b> Có 4 góc vuông, các cạnh đối song song và bằng nhau, 2 đường chéo bằng nhau.<br>- <b>Hình thoi:</b> Có 4 cạnh bằng nhau, các cạnh đối song song, 2 đường chéo vuông góc.<br>- <b>Hình bình hành:</b> Các cạnh đối song song và bằng nhau, các góc đối bằng nhau.<br>- <b>Hình thang cân:</b> Hai cạnh bên bằng nhau, hai góc kề một đáy bằng nhau, hai đường chéo bằng nhau.</p>",
                "subtopics": [
                    {
                        "id": "bai-19-d1",
                        "title": "Dạng 1: Nhận dạng hình chữ nhật, hình thoi, hình bình hành, hình thang cân",
                        "level": "co-ban",
                        "questionType": "hinh-hoc-2-chuong-4",
                        "youtubeId": "XgK0N7HZtWQ",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Nhận dạng hình chữ nhật, hình thoi, hình bình hành, hình thang cân</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-19-d2",
                        "title": "Dạng 2: Vẽ hình chữ nhật, hình thoi, hình bình hành, hình thang cân",
                        "level": "nang-cao",
                        "questionType": "hinh-hoc-2-chuong-4",
                        "youtubeId": "XgK0N7HZtWQ",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Vẽ hình chữ nhật, hình thoi, hình bình hành, hình thang cân</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-20",
                "title": "Bài 20: Chu vi và diện tích của một số tứ giác đã học",
                "youtubeId": "BqbSUW8Yj8o",
                "questionType": "chu-vi-dien-tich",
                "theoryHtml": "<h4>Công thức tính Chu vi (C) và Diện tích (S)</h4><p>- <b>Hình vuông:</b> $C = 4a$, $S = a^2$.<br>- <b>Hình chữ nhật:</b> $C = 2(a+b)$, $S = a \\cdot b$.<br>- <b>Hình thoi:</b> $S = \\frac{1}{2} m \\cdot n$ (hai đường chéo).<br>- <b>Hình bình hành:</b> $S = a \\cdot h$ (cạnh đáy $\\cdot$ chiều cao).<br>- <b>Hình thang:</b> $S = \\frac{1}{2} (a+b) \\cdot h$ (tổng hai đáy $\\cdot$ chiều cao chia đôi).</p>",
                "subtopics": [
                    {
                        "id": "bai-20-d1",
                        "title": "Dạng 1: Một số bài toán thực tế về hình vuông, hình chữ nhật",
                        "level": "co-ban",
                        "questionType": "chu-vi-dien-tich",
                        "youtubeId": "KRoWdz1iOew",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Một số bài toán thực tế về hình vuông, hình chữ nhật</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-20-d2",
                        "title": "Dạng 2: Tính chu vi và diện tích của hình thoi",
                        "level": "co-ban",
                        "questionType": "chu-vi-dien-tich",
                        "youtubeId": "8lAH8t4K628",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Tính chu vi và diện tích của hình thoi</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-20-d3",
                        "title": "Dạng 3: Tính chu vi và diện tích của hình bình hành, hình thang cân",
                        "level": "nang-cao",
                        "questionType": "chu-vi-dien-tich",
                        "youtubeId": "O4Ylt5tDwas",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Tính chu vi và diện tích của hình bình hành, hình thang cân</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "lt-c4",
                "title": "Luyện tập chung (Chu vi & Diện tích các hình)",
                "youtubeId": "",
                "questionType": "luyen-tap-chung-c4",
                "theoryHtml": "<h4>Luyện tập tính Chu vi & Diện tích</h4><p>Rèn luyện áp dụng các công thức tính chu vi và diện tích hình vuông, hình chữ nhật, hình thoi, hình bình hành, hình thang để giải các bài toán thực tế.</p>",
                "subtopics": []
            },
            {
                "id": "kt-c4",
                "title": "Bài tập cuối chương IV",
                "youtubeId": "",
                "questionType": "cuoi-chuong-4",
                "theoryHtml": "<h4>Kiểm tra tổng hợp Chương IV</h4><p>Đánh giá toàn diện kiến thức Chương IV về nhận biết các loại hình phẳng cơ bản và tính toán chu vi, diện tích các hình tứ giác đã học.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "chuong-5",
        "semester": 1,
        "title": "Chương V: Tính đối xứng của hình phẳng trong tự nhiên",
        "subtitle": "Hình có trục đối xứng, hình có tâm đối xứng trong đời sống và hình học",
        "lessons": [
            {
                "id": "bai-21",
                "title": "Bài 21: Hình có trục đối xứng",
                "youtubeId": "RGHxNyFkFT0",
                "questionType": "truc-doi-xung",
                "theoryHtml": "<h4>Hình có trục đối xứng</h4><p>Một hình có trục đối xứng nếu có một đường thẳng chia đôi hình đó thành hai phần đối xứng mà khi gấp hình theo đường thẳng ấy thì hai phần chồng khít lên nhau. Đường thẳng đó là <b>trục đối xứng</b>.</p><h4>Ví dụ</h4><p>Hình tròn có vô số trục đối xứng (mọi đường kính). Hình vuông có 4 trục đối xứng. Tam giác đều có 3 trục đối xứng.</p>",
                "subtopics": [
                    {
                        "id": "bai-21-d1",
                        "title": "Dạng 1: Nhận biết trục đối xứng và số trục đối xứng của hình cơ bản",
                        "level": "co-ban",
                        "questionType": "truc-doi-xung",
                        "youtubeId": "FjOoJanifI0",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Nhận biết trục đối xứng và số trục đối xứng của hình cơ bản</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-21-d2",
                        "title": "Dạng 2: Nhận biết tính đối xứng (trục đối xứng) trong tự nhiên",
                        "level": "nang-cao",
                        "questionType": "truc-doi-xung",
                        "youtubeId": "MxzzbS27PWs",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Nhận biết tính đối xứng (trục đối xứng) trong tự nhiên</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-22",
                "title": "Bài 22: Hình có tâm đối xứng",
                "youtubeId": "hl52yipFOJY",
                "questionType": "tam-doi-xung",
                "theoryHtml": "<h4>Hình có tâm đối xứng</h4><p>Một hình có tâm đối xứng nếu có một điểm $O$ sao cho khi quay hình đó nửa vòng ($180^\\circ$) quanh điểm $O$, ta được hình mới chồng khít lên hình ban đầu. Điểm $O$ là <b>tâm đối xứng</b>.</p><h4>Ví dụ</h4><p>Hình bình hành, hình chữ nhật, hình thoi, hình vuông, hình lục giác đều và hình tròn đều có tâm đối xứng.</p>",
                "subtopics": [
                    {
                        "id": "bai-22-d1",
                        "title": "Dạng 1: Nhận biết tâm đối xứng của hình cơ bản",
                        "level": "co-ban",
                        "questionType": "tam-doi-xung",
                        "youtubeId": "WY7fb9YyLuI",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Nhận biết tâm đối xứng của hình cơ bản</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-22-d2",
                        "title": "Dạng 2: Nhận biết tính đối xứng (tâm đối xứng) trong tự nhiên",
                        "level": "nang-cao",
                        "questionType": "tam-doi-xung",
                        "youtubeId": "3Oj35-duSDs",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Nhận biết tính đối xứng (tâm đối xứng) trong tự nhiên</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "lt-c5",
                "title": "Luyện tập chung (Trục đối xứng & Tâm đối xứng)",
                "youtubeId": "",
                "questionType": "luyen-tap-chung-c5",
                "theoryHtml": "<h4>Luyện tập đối xứng</h4><p>Ôn tập nhận biết các hình có trục đối xứng, số trục đối xứng và các hình có tâm đối xứng trong toán học cũng như trong thế giới tự nhiên.</p>",
                "subtopics": []
            },
            {
                "id": "kt-c5",
                "title": "Bài tập cuối chương V",
                "youtubeId": "",
                "questionType": "cuoi-chuong-5",
                "theoryHtml": "<h4>Kiểm tra tổng hợp Chương V</h4><p>Đánh giá toàn diện kiến thức Chương V về tính đối xứng: phân biệt hình có trục đối xứng, hình có tâm đối xứng và ứng dụng nhận biết trong thực tế.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "chuong-6",
        "semester": 2,
        "title": "Chương VI: Phân số",
        "subtitle": "Khái niệm phân số, so sánh, phép toán cộng trừ nhân chia và các bài toán thực tế",
        "lessons": [
            {
                "id": "bai-23",
                "title": "Bài 23: Mở rộng phân số. Phân số bằng nhau",
                "youtubeId": "NS6bj4vIqqA",
                "questionType": "phan-so-bang-nhau",
                "theoryHtml": "<h4>1. Khái niệm phân số</h4><p>Ta gọi $\\frac{a}{b}$ (với $a, b \\in \\mathbb{Z}, b \\neq 0$) là phân số, $a$ là tử số và $b$ là mẫu số.</p><h4>2. Hai phân số bằng nhau</h4><p>Hai phân số $\\frac{a}{b}$ và $\\frac{c}{d}$ gọi là bằng nhau nếu $a \\cdot d = b \\cdot c$.</p><h4>3. Tính chất cơ bản của phân số</h4><p>$\\frac{a}{b} = \\frac{a \\cdot m}{b \\cdot m}$ ($m \\in \\mathbb{Z}, m \\neq 0$); $\\frac{a}{b} = \\frac{a : n}{b : n}$ ($n$ là ước chung).</p>",
                "subtopics": [
                    {
                        "id": "bai-23-d1",
                        "title": "Dạng 1: Mở rộng phân số. Phân số bằng nhau",
                        "level": "co-ban",
                        "questionType": "phan-so-bang-nhau",
                        "youtubeId": "nF3fn7Tf6fg",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Mở rộng phân số. Phân số bằng nhau</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-24",
                "title": "Bài 24: So sánh phân số. Hỗn số dương",
                "youtubeId": "Md1fDqNtlMc",
                "questionType": "so-sanh-phan-so",
                "theoryHtml": "<h4>1. Quy đồng mẫu nhiều phân số</h4><p>Bước 1: Tìm BCNN của các mẫu (mẫu số chung).<br>Bước 2: Tìm thừa số phụ của mỗi mẫu.<br>Bước 3: Nhân tử và mẫu của mỗi phân số với thừa số phụ tương ứng.</p><h4>2. So sánh phân số</h4><p>- Cùng mẫu dương: Tử lớn hơn thì phân số lớn hơn.<br>- Khác mẫu: Quy đồng về cùng mẫu dương rồi so sánh tử.</p><h4>3. Hỗn số dương</h4><p>Viết phân số lớn hơn 1 dưới dạng $q\\frac{r}{b}$ (với $q$ là thương, $r$ là số dư của phép chia tử cho mẫu).</p>",
                "subtopics": [
                    {
                        "id": "bai-24-d1",
                        "title": "Dạng 1: So sánh phân số. Hỗn số dương",
                        "level": "co-ban",
                        "questionType": "so-sanh-phan-so",
                        "youtubeId": "sU7tKkH3_Ko",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: So sánh phân số. Hỗn số dương</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "lt-c6-1",
                "title": "Luyện tập chung (Bài 23 - Bài 24)",
                "youtubeId": "",
                "questionType": "luyen-tap-chung-c6-1",
                "theoryHtml": "<h4>Luyện tập tổng hợp</h4><p>Ôn tập rút gọn phân số, tìm phân số bằng nhau, quy đồng mẫu số và so sánh các phân số, hỗn số dương.</p>",
                "subtopics": []
            },
            {
                "id": "bai-25",
                "title": "Bài 25: Phép cộng và phép trừ phân số",
                "youtubeId": "aCQll-ofz1o",
                "questionType": "cong-tru-phan-so",
                "theoryHtml": "<h4>1. Phép cộng phân số</h4><p>- Cùng mẫu: $\\frac{a}{m} + \\frac{b}{m} = \\frac{a+b}{m}$.<br>- Khác mẫu: Quy đồng mẫu rồi cộng tử, giữ nguyên mẫu chung.</p><h4>2. Số đối</h4><p>Số đối của phân số $\\frac{a}{b}$ là $-\\frac{a}{b}$. Ta có $\\frac{a}{b} + \\left(-\\frac{a}{b}\\right) = 0$.</p><h4>3. Phép trừ phân số</h4><p>$\\frac{a}{b} - \\frac{c}{d} = \\frac{a}{b} + \\left(-\\frac{c}{d}\\right)$.</p>",
                "subtopics": [
                    {
                        "id": "bai-25-d1",
                        "title": "Dạng 1: Phép cộng và phép trừ phân số",
                        "level": "co-ban",
                        "questionType": "cong-tru-phan-so",
                        "youtubeId": "HyIXyixQQ5s",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Phép cộng và phép trừ phân số</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-26",
                "title": "Bài 26: Phép nhân và phép chia phân số",
                "youtubeId": "3VBcRJoYekk",
                "questionType": "nhan-chia-phan-so",
                "theoryHtml": "<h4>1. Phép nhân phân số</h4><p>$\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}$. Muốn nhân một số nguyên với một phân số, ta nhân số nguyên đó với tử và giữ nguyên mẫu.</p><h4>2. Số nghịch đảo</h4><p>Số nghịch đảo của phân số $\\frac{a}{b}$ ($a, b \\neq 0$) là $\\frac{b}{a}$.</p><h4>3. Phép chia phân số</h4><p>$\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c}$ ($c \\neq 0$).</p>",
                "subtopics": [
                    {
                        "id": "bai-26-d1",
                        "title": "Dạng 1: Phép nhân và phép chia phân số",
                        "level": "co-ban",
                        "questionType": "nhan-chia-phan-so",
                        "youtubeId": "SP6VZOKSYJE",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Phép nhân và phép chia phân số</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-27",
                "title": "Bài 27: Hai bài toán về phân số",
                "youtubeId": "MrRmD_iAf9M",
                "questionType": "hai-bai-toan-phan-so",
                "theoryHtml": "<h4>1. Tìm giá trị phân số của một số cho trước</h4><p>Muốn tìm $\\frac{m}{n}$ của số $a$ cho trước, ta tính $a \\cdot \\frac{m}{n}$ (với $m, n \\in \\mathbb{N}, n \\neq 0$).</p><h4>2. Tìm một số khi biết giá trị phân số của nó</h4><p>Muốn tìm một số khi biết $\\frac{m}{n}$ của nó bằng $b$, ta tính $b : \\frac{m}{n}$ (với $m, n \\in \\mathbb{N}^*$).</p>",
                "subtopics": [
                    {
                        "id": "bai-27-d1",
                        "title": "Dạng 1: Hai bài toán về phân số",
                        "level": "co-ban",
                        "questionType": "hai-bai-toan-phan-so",
                        "youtubeId": "MZK6kiw9pyE",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Hai bài toán về phân số</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "lt-c6-2",
                "title": "Luyện tập chung (Các phép tính Phân số)",
                "youtubeId": "",
                "questionType": "luyen-tap-chung-c6-2",
                "theoryHtml": "<h4>Luyện tập tổng hợp các phép tính</h4><p>Thực hiện các phép tính cộng, trừ, nhân, chia phân số có dấu ngoặc và thứ tự thực hiện phép tính; giải các bài toán thực tế sử dụng phân số.</p>",
                "subtopics": []
            },
            {
                "id": "kt-c6",
                "title": "Bài tập cuối chương VI",
                "youtubeId": "",
                "questionType": "cuoi-chuong-6",
                "theoryHtml": "<h4>Kiểm tra tổng hợp Chương VI</h4><p>Đánh giá toàn diện kiến thức Chương VI bao gồm phân số bằng nhau, rút gọn, so sánh, hỗn số, các phép toán phân số và toán đố thực tế.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "chuong-7",
        "semester": 2,
        "title": "Chương VII: Số thập phân",
        "subtitle": "Số thập phân, các phép toán số thập phân, làm tròn, tỉ số và tỉ số phần trăm",
        "lessons": [
            {
                "id": "bai-28",
                "title": "Bài 28: Số thập phân",
                "youtubeId": "4ylM53Hp5d4",
                "questionType": "so-thap-phan",
                "theoryHtml": "<h4>1. Khái niệm số thập phân</h4><p>Phân số thập phân là phân số có mẫu là lũy thừa của 10. Số thập phân gồm hai phần:<br>- Phần số nguyên (viết bên trái dấu phẩy).<br>- Phần thập phân (viết bên phải dấu phẩy).</p><h4>2. Số đối của số thập phân</h4><p>Hai số thập phân gọi là đối nhau nếu chúng biểu diễn hai phân số đối nhau. Ví dụ số đối của $1,2$ là $-1,2$.</p>",
                "subtopics": [
                    {
                        "id": "bai-28-d1",
                        "title": "Dạng 1: Phân số thập phân, số thập phân dương, số thập phân âm, số đối",
                        "level": "co-ban",
                        "questionType": "so-thap-phan",
                        "youtubeId": "ciWYSN_qZNM",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Phân số thập phân, số thập phân dương, số thập phân âm, số đối</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-28-d2",
                        "title": "Dạng 2: So sánh hai số thập phân",
                        "level": "co-ban",
                        "questionType": "so-thap-phan",
                        "youtubeId": "jpWVhHQYZFQ",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: So sánh hai số thập phân</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-28-d3",
                        "title": "Dạng 3: Bài toán liên quan đến số thập phân trong thực tiễn",
                        "level": "nang-cao",
                        "questionType": "so-thap-phan",
                        "youtubeId": "ciWYSN_qZNM",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Bài toán liên quan đến số thập phân trong thực tiễn</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-29",
                "title": "Bài 29: Tính toán với số thập phân",
                "youtubeId": "KfdwK2qJXwo",
                "questionType": "tinh-so-thap-phan",
                "theoryHtml": "<h4>Tính toán số thập phân</h4><p>1. Cộng, trừ hai số thập phân: thực hiện như số tự nhiên, đặt dấu phẩy thẳng hàng.<br>2. Nhân hai số thập phân: nhân như số tự nhiên rồi đếm tổng số chữ số thập phân để đặt dấu phẩy.<br>3. Chia số thập phân: đưa về chia cho số tự nhiên bằng cách dời dấu phẩy.</p>",
                "subtopics": [
                    {
                        "id": "bai-29-d1",
                        "title": "Dạng 1: Thực hiện phép tính cộng, trừ, nhân, chia số thập phân",
                        "level": "co-ban",
                        "questionType": "tinh-so-thap-phan",
                        "youtubeId": "Km9yyBXTCO8",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Thực hiện phép tính cộng, trừ, nhân, chia số thập phân</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-29-d2",
                        "title": "Dạng 2: Tính giá trị biểu thức với số thập phân",
                        "level": "nang-cao",
                        "questionType": "tinh-so-thap-phan",
                        "youtubeId": "ciWYSN_qZNM",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Tính giá trị biểu thức với số thập phân</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-29-d3",
                        "title": "Dạng 3: Bài toán thực tế liên quan đến phép tính số thập phân",
                        "level": "kho",
                        "questionType": "tinh-so-thap-phan",
                        "youtubeId": "ciWYSN_qZNM",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Bài toán thực tế liên quan đến phép tính số thập phân</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-30",
                "title": "Bài 30: Làm tròn và ước lượng",
                "youtubeId": "gGXVtSk9I9c",
                "questionType": "lam-tron-uoc-luong",
                "theoryHtml": "<h4>1. Quy tắc làm tròn số</h4><p>- Nếu chữ số đầu tiên bỏ đi nhỏ hơn 5, ta giữ nguyên chữ số hàng làm tròn.<br>- Nếu chữ số đầu tiên bỏ đi lớn hơn hoặc bằng 5, ta cộng thêm 1 vào chữ số hàng làm tròn.</p><h4>2. Ước lượng kết quả</h4><p>Sử dụng làm tròn số để ước lượng nhanh kết quả các phép tính phức tạp trong thực tế.</p>",
                "subtopics": [
                    {
                        "id": "bai-30-d1",
                        "title": "Dạng 1: Làm tròn số thập phân",
                        "level": "co-ban",
                        "questionType": "lam-tron-uoc-luong",
                        "youtubeId": "ciWYSN_qZNM",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Làm tròn số thập phân</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-30-d2",
                        "title": "Dạng 2: Ước lượng kết quả phép tính",
                        "level": "nang-cao",
                        "questionType": "lam-tron-uoc-luong",
                        "youtubeId": "EOri0vYnINw",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Ước lượng kết quả phép tính</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-31",
                "title": "Bài 31: Một số bài toán về tỉ số và tỉ số phần trăm",
                "youtubeId": "8Fw8gTsJPCw",
                "questionType": "ti-so-phan-tram",
                "theoryHtml": "<h4>1. Tỉ số của hai số</h4><p>Tỉ số của $a$ và $b$ ($b \\neq 0$) là thương của phép chia $a$ cho $b$, ký hiệu là $a : b$ hoặc $\\frac{a}{b}$.</p><h4>2. Tỉ số phần trăm</h4><p>Tỉ số phần trăm của $a$ và $b$ là $\\frac{a \\cdot 100}{b}\\%$.</p><h4>3. Tìm giá trị phần trăm</h4><p>Muốn tìm $p\\%$ của số $a$, ta tính $a \\cdot \\frac{p}{100}$. Muốn tìm một số khi biết $p\\%$ của nó bằng $b$, ta tính $b : \\frac{p}{100}$.</p>",
                "subtopics": [
                    {
                        "id": "bai-31-d1",
                        "title": "Dạng 1: Tính tỉ số, tỉ số phần trăm của hai số, hai đại lượng",
                        "level": "co-ban",
                        "questionType": "ti-so-phan-tram",
                        "youtubeId": "",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Tính tỉ số, tỉ số phần trăm của hai số, hai đại lượng</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-31-d2",
                        "title": "Dạng 2: Tính giá trị phần trăm của một số cho trước",
                        "level": "co-ban",
                        "questionType": "ti-so-phan-tram",
                        "youtubeId": "Ea_yiEF4Ou4",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Tính giá trị phần trăm của một số cho trước</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-31-d3",
                        "title": "Dạng 3: Tìm một số khi biết giá trị phần trăm của số đó",
                        "level": "nang-cao",
                        "questionType": "ti-so-phan-tram",
                        "youtubeId": "Ea_yiEF4Ou4",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Tìm một số khi biết giá trị phần trăm của số đó</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "lt-c7",
                "title": "Luyện tập chung (Số thập phân & Tỉ số)",
                "youtubeId": "",
                "questionType": "luyen-tap-chung-c7",
                "theoryHtml": "<h4>Luyện tập tổng hợp</h4><p>Ôn luyện tính toán số thập phân, quy tắc làm tròn số và các bài toán tính tỉ số phần trăm trong đời sống.</p>",
                "subtopics": []
            },
            {
                "id": "kt-c7",
                "title": "Bài tập cuối chương VII",
                "youtubeId": "",
                "questionType": "cuoi-chuong-7",
                "theoryHtml": "<h4>Kiểm tra tổng hợp Chương VII</h4><p>Đánh giá toàn diện kiến thức Chương VII bao gồm số thập phân, tính toán, làm tròn số và các bài toán tỉ số phần trăm thực tế.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "chuong-8",
        "semester": 2,
        "title": "Chương VIII: Những hình hình học cơ bản",
        "subtitle": "Điểm, đường thẳng, tia, đoạn thẳng, trung điểm, góc và số đo góc",
        "lessons": [
            {
                "id": "bai-32",
                "title": "Bài 32: Điểm và đường thẳng",
                "youtubeId": "oNCner81vOo",
                "questionType": "diem-duong-thang",
                "theoryHtml": "<h4>1. Điểm thuộc đường thẳng</h4><p>Điểm $A$ thuộc đường thẳng $d$ ký hiệu là $A \\in d$. Điểm $B$ không thuộc đường thẳng $d$ ký hiệu là $B \\notin d$.</p><h4>2. Ba điểm thẳng hàng</h4><p>Khi ba điểm cùng thuộc một đường thẳng, ta nói chúng thẳng hàng. Trong ba điểm thẳng hàng, có một và chỉ một điểm nằm giữa hai điểm còn lại.</p>",
                "subtopics": [
                    {
                        "id": "bai-32-d1",
                        "title": "Dạng 1: Nhận biết quan hệ điểm thuộc/không thuộc, 3 điểm thẳng hàng",
                        "level": "co-ban",
                        "questionType": "diem-duong-thang",
                        "youtubeId": "gaJ9BHjI04M",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Nhận biết quan hệ điểm thuộc/không thuộc, 3 điểm thẳng hàng</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-32-d2",
                        "title": "Dạng 2: Hai đường thẳng cắt nhau, song song, trùng nhau",
                        "level": "nang-cao",
                        "questionType": "diem-duong-thang",
                        "youtubeId": "nF3fn7Tf6fg",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Hai đường thẳng cắt nhau, song song, trùng nhau</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-33",
                "title": "Bài 33: Điểm nằm giữa hai điểm. Tia",
                "youtubeId": "t86tXtdnmhc",
                "questionType": "tia-hinh-hoc",
                "theoryHtml": "<h4>1. Điểm nằm giữa hai điểm</h4><p>If điểm $M$ nằm giữa hai điểm $A$ và $B$ thì $AM + MB = AB$.</p><h4>2. Khái niệm tia</h4><p>Hình gồm điểm $O$ và một phần đường thẳng bị chia ra bởi điểm $O$ gọi là một tia gốc $O$. Hai tia chung gốc tạo thành một đường thẳng gọi là hai tia đối nhau.</p>",
                "subtopics": [
                    {
                        "id": "bai-33-d1",
                        "title": "Dạng 1: Điểm nằm giữa hai điểm",
                        "level": "co-ban",
                        "questionType": "tia-hinh-hoc",
                        "youtubeId": "",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Điểm nằm giữa hai điểm</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-33-d2",
                        "title": "Dạng 2: Nhận biết tia, hai tia đối nhau",
                        "level": "nang-cao",
                        "questionType": "tia-hinh-hoc",
                        "youtubeId": "gaJ9BHjI04M",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Nhận biết tia, hai tia đối nhau</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-34",
                "title": "Bài 34: Đoạn thẳng. Độ dài đoạn thẳng",
                "youtubeId": "ajwHBKCkj08",
                "questionType": "doan-thang",
                "theoryHtml": "<h4>1. Đoạn thẳng</h4><p>Đoạn thẳng $AB$ là hình gồm điểm $A$, điểm $B$ và tất cả các điểm nằm giữa $A$ và $B$. Hai điểm $A, B$ gọi là hai đầu mút.</p><h4>2. Độ dài đoạn thẳng</h4><p>Mỗi đoạn thẳng có một độ dài lớn hơn 0. Nếu $M$ nằm giữa $A$ và $B$ thì $AM + MB = AB$.</p>",
                "subtopics": [
                    {
                        "id": "bai-34-d1",
                        "title": "Dạng 1: Nhận biết đoạn thẳng, đo độ dài đoạn thẳng",
                        "level": "co-ban",
                        "questionType": "doan-thang",
                        "youtubeId": "gaJ9BHjI04M",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Nhận biết đoạn thẳng, đo độ dài đoạn thẳng</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-34-d2",
                        "title": "Dạng 2: So sánh độ dài đoạn thẳng",
                        "level": "co-ban",
                        "questionType": "doan-thang",
                        "youtubeId": "",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: So sánh độ dài đoạn thẳng</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-34-d3",
                        "title": "Dạng 3: Tính độ dài đoạn thẳng",
                        "level": "nang-cao",
                        "questionType": "doan-thang",
                        "youtubeId": "",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Tính độ dài đoạn thẳng</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-35",
                "title": "Bài 35: Trung điểm của đoạn thẳng",
                "youtubeId": "FtVG_MJofKM",
                "questionType": "trung-diem",
                "theoryHtml": "<h4>Trung điểm của đoạn thẳng</h4><p>Trung điểm $I$ của đoạn thẳng $AB$ là điểm nằm giữa $A, B$ và cách đều hai điểm $A, B$ ($IA = IB = \\frac{AB}{2}$).</p>",
                "subtopics": [
                    {
                        "id": "bai-35-d1",
                        "title": "Dạng 1: Nhận biết trung điểm của đoạn thẳng",
                        "level": "co-ban",
                        "questionType": "trung-diem",
                        "youtubeId": "gaJ9BHjI04M",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Nhận biết trung điểm của đoạn thẳng</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-35-d2",
                        "title": "Dạng 2: Tính độ dài đoạn thẳng (sử dụng trung điểm)",
                        "level": "nang-cao",
                        "questionType": "trung-diem",
                        "youtubeId": "EOri0vYnINw",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Tính độ dài đoạn thẳng (sử dụng trung điểm)</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "lt-c8-1",
                "title": "Luyện tập chung (Điểm, Đường thẳng & Đoạn thẳng)",
                "youtubeId": "",
                "questionType": "luyen-tap-chung-c8-1",
                "theoryHtml": "<h4>Luyện tập tổng hợp phần 1</h4><p>Ôn tập nhận biết điểm thuộc đường thẳng, tia đối, tính độ dài đoạn thẳng và xác định trung điểm của đoạn thẳng.</p>",
                "subtopics": []
            },
            {
                "id": "bai-36",
                "title": "Bài 36: Góc",
                "youtubeId": "Sxcs3ZVOXDs",
                "questionType": "goc",
                "theoryHtml": "<h4>Khái niệm Góc</h4><p>Góc là hình gồm hai tia chung gốc. Gốc chung là đỉnh của góc, hai tia là hai cạnh của góc. Góc bẹt là góc có hai cạnh là hai tia đối nhau.</p>",
                "subtopics": [
                    {
                        "id": "bai-36-d1",
                        "title": "Dạng 1: Nhận biết góc, đỉnh và cạnh của góc. Góc bẹt",
                        "level": "co-ban",
                        "questionType": "goc",
                        "youtubeId": "gaJ9BHjI04M",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Nhận biết góc, đỉnh và cạnh của góc. Góc bẹt</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-36-d2",
                        "title": "Dạng 2: Điểm trong một góc",
                        "level": "nang-cao",
                        "questionType": "goc",
                        "youtubeId": "",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Điểm trong một góc</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-37",
                "title": "Bài 37: Số đo góc",
                "youtubeId": "MoyxkvZuh1o",
                "questionType": "so-do-goc",
                "theoryHtml": "<h4>1. Đo góc</h4><p>Mỗi góc có một số đo xác định lớn hơn 0. Số đo của góc bẹt là $180^\\circ$.</p><h4>2. Phân loại góc</h4><p>- Góc vuông: có số đo bằng $90^\\circ$.<br>- Góc nhọn: số đo lớn hơn $0^\\circ$ và nhỏ hơn $90^\\circ$.<br>- Góc tù: số đo lớn hơn $90^\\circ$ và nhỏ hơn $180^\\circ$.</p>",
                "subtopics": [
                    {
                        "id": "bai-37-d1",
                        "title": "Dạng 1: Nhận biết khái niệm số đo góc và cách đo góc",
                        "level": "co-ban",
                        "questionType": "so-do-goc",
                        "youtubeId": "gaJ9BHjI04M",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Nhận biết khái niệm số đo góc và cách đo góc</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-37-d2",
                        "title": "Dạng 2: Các góc đặc biệt (góc vuông, góc nhọn, góc tù)",
                        "level": "nang-cao",
                        "questionType": "so-do-goc",
                        "youtubeId": "",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Các góc đặc biệt (góc vuông, góc nhọn, góc tù)</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "lt-c8-2",
                "title": "Luyện tập chung (Góc & Số đo góc)",
                "youtubeId": "",
                "questionType": "luyen-tap-chung-c8-2",
                "theoryHtml": "<h4>Luyện tập tổng hợp phần 2</h4><p>Rèn luyện đo góc, gọi tên góc và đỉnh, nhận dạng các góc nhọn, vuông, tù, bẹt trong thực tế vẽ hình.</p>",
                "subtopics": []
            },
            {
                "id": "kt-c8",
                "title": "Bài tập cuối chương VIII",
                "youtubeId": "",
                "questionType": "cuoi-chuong-8",
                "theoryHtml": "<h4>Kiểm tra tổng hợp Chương VIII</h4><p>Đánh giá toàn diện kiến thức hình học cơ bản bao gồm điểm, đường thẳng, tia, trung điểm đoạn thẳng, góc và số đo góc.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "chuong-9",
        "semester": 2,
        "title": "Chương IX: Dữ liệu và xác suất thực nghiệm",
        "subtitle": "Thu thập dữ liệu, biểu đồ tranh, biểu đồ cột, biểu đồ cột kép và xác suất thực nghiệm",
        "lessons": [
            {
                "id": "bai-38",
                "title": "Bài 38: Dữ liệu và thu thập dữ liệu",
                "youtubeId": "YTTuwpZaTlQ",
                "questionType": "thu-thap-du-lieu",
                "theoryHtml": "<h4>1. Dữ liệu và số liệu</h4><p>Các thông tin thu thập được như số, chữ, hình ảnh, ký hiệu... được gọi là dữ liệu. Dữ liệu là số được gọi là số liệu.</p><h4>2. Thu thập dữ liệu</h4><p>Ta có thể thu thập dữ liệu bằng nhiều cách khác nhau như: quan sát, làm thí nghiệm, lập bảng hỏi (phỏng vấn, điều tra), hoặc tìm kiếm tài liệu từ các nguồn có sẵn.</p><h4>3. Tính hợp lý của dữ liệu</h4><p>Để đánh giá tính hợp lý của dữ liệu, ta cần đối chiếu dữ liệu với các tiêu chí toán học đơn giản hoặc thực tế khách quan.</p>",
                "subtopics": [
                    {
                        "id": "bai-38-d1",
                        "title": "Dạng 1: Phân loại dữ liệu số và dữ liệu không phải là số",
                        "level": "co-ban",
                        "questionType": "thu-thap-du-lieu",
                        "youtubeId": "",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Phân loại dữ liệu số và dữ liệu không phải là số</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-38-d2",
                        "title": "Dạng 2: Xét tính hợp lí của dữ liệu",
                        "level": "nang-cao",
                        "questionType": "thu-thap-du-lieu",
                        "youtubeId": "9FUuh9U-Oy4",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Xét tính hợp lí của dữ liệu</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-39",
                "title": "Bài 39: Bảng thống kê và biểu đồ tranh",
                "youtubeId": "vIp0oLDgoRY",
                "questionType": "bang-thong-ke-bieu-do-tranh",
                "theoryHtml": "<h4>1. Bảng thống kê</h4><p>Bảng thống kê là một bảng chứa các dữ liệu số liệu được sắp xếp một cách khoa học giúp dễ dàng đọc hiểu, đối chiếu và phân tích thông tin.</p><h4>2. Biểu đồ tranh</h4><p>Biểu đồ tranh sử dụng các biểu tượng hoặc hình ảnh để biểu diễn dữ liệu thống kê. Chú ý đọc kỹ phần chú giải ở cuối biểu đồ để biết mỗi biểu tượng đại diện cho bao nhiêu đối tượng.</p>",
                "subtopics": [
                    {
                        "id": "bai-39-d1",
                        "title": "Dạng 1: Gọi tên bảng dữ liệu ban đầu, xác định đối tượng thống kê",
                        "level": "co-ban",
                        "questionType": "bang-thong-ke-bieu-do-tranh",
                        "youtubeId": "",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Gọi tên bảng dữ liệu ban đầu, xác định đối tượng thống kê</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-39-d2",
                        "title": "Dạng 2: Lập bảng thống kê tương ứng với bảng dữ liệu ban đầu",
                        "level": "co-ban",
                        "questionType": "bang-thong-ke-bieu-do-tranh",
                        "youtubeId": "",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Lập bảng thống kê tương ứng với bảng dữ liệu ban đầu</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-39-d3",
                        "title": "Dạng 3: Một số bảng thống kê trong cuộc sống",
                        "level": "co-ban",
                        "questionType": "bang-thong-ke-bieu-do-tranh",
                        "youtubeId": "",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 3: Một số bảng thống kê trong cuộc sống</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-39-d4",
                        "title": "Dạng 4: Đọc biểu đồ tranh",
                        "level": "co-ban",
                        "questionType": "bang-thong-ke-bieu-do-tranh",
                        "youtubeId": "",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 4: Đọc biểu đồ tranh</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-39-d5",
                        "title": "Dạng 5: Vẽ biểu đồ tranh",
                        "level": "nang-cao",
                        "questionType": "bang-thong-ke-bieu-do-tranh",
                        "youtubeId": "",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 5: Vẽ biểu đồ tranh</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-39-d6",
                        "title": "Dạng 6: Các bài toán ứng dụng biểu đồ tranh trong cuộc sống",
                        "level": "kho",
                        "questionType": "bang-thong-ke-bieu-do-tranh",
                        "youtubeId": "",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 6: Các bài toán ứng dụng biểu đồ tranh trong cuộc sống</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-40",
                "title": "Bài 40: Biểu đồ cột",
                "youtubeId": "Gy1coyDF40E",
                "questionType": "bieu-do-cot",
                "theoryHtml": "<h4>1. Biểu đồ cột</h4><p>Biểu đồ cột dùng các cột hình chữ nhật có chiều rộng bằng nhau để biểu diễn dữ liệu thống kê của các đối tượng. Chiều cao của các cột biểu diễn số lượng/giá trị tương ứng của các đối tượng đó.</p><h4>2. Đọc biểu đồ cột</h4><p>Để đọc biểu đồ cột, ta nhìn vào đỉnh cột và đối chiếu theo chiều ngang sang trục đứng (trục tung) để tìm số liệu tương ứng.</p>",
                "subtopics": [
                    {
                        "id": "bai-40-d1",
                        "title": "Dạng 1: Đọc, mô tả và phân tích dữ liệu từ biểu đồ cột",
                        "level": "co-ban",
                        "questionType": "bieu-do-cot",
                        "youtubeId": "",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Đọc, mô tả và phân tích dữ liệu từ biểu đồ cột</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-40-d2",
                        "title": "Dạng 2: Lập bảng thông kê, vẽ và hoàn thiện biểu đồ cột",
                        "level": "nang-cao",
                        "questionType": "bieu-do-cot",
                        "youtubeId": "",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Lập bảng thông kê, vẽ và hoàn thiện biểu đồ cột</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-41",
                "title": "Bài 41: Biểu đồ cột kép",
                "youtubeId": "VzwoZf9KzuM",
                "questionType": "bieu-do-cot-kep",
                "theoryHtml": "<h4>1. Biểu đồ cột kép</h4><p>Biểu đồ cột kép biểu diễn các cặp cột hình chữ nhật cạnh nhau thể hiện số liệu của hai nhóm đối tượng trên cùng một danh mục (ví dụ: nam và nữ, năm nay và năm trước...) để dễ so sánh trực quan.</p><h4>2. Cách đọc biểu đồ cột kép</h4><p>Mỗi nhóm cột có màu sắc hoặc hoa văn khác nhau (được ghi rõ ở phần chú giải). Cách đọc tương tự biểu đồ cột đơn: đối chiếu đỉnh cột sang trục đứng.</p>",
                "subtopics": [
                    {
                        "id": "bai-41-d1",
                        "title": "Dạng 1: Đọc, mô tả và phân tích dữ liệu từ biểu đồ cột kép",
                        "level": "co-ban",
                        "questionType": "bieu-do-cot-kep",
                        "youtubeId": "",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Đọc, mô tả và phân tích dữ liệu từ biểu đồ cột kép</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-41-d2",
                        "title": "Dạng 2: Lập bảng thống kê, vẽ và hoàn thiện biểu đồ cột kép",
                        "level": "nang-cao",
                        "questionType": "bieu-do-cot-kep",
                        "youtubeId": "",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Lập bảng thống kê, vẽ và hoàn thiện biểu đồ cột kép</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "lt-c9-1",
                "title": "Luyện tập chung (Thống kê số liệu)",
                "youtubeId": "",
                "questionType": "luyen-tap-chung-c9-1",
                "theoryHtml": "<h4>Luyện tập ôn tập Thống kê</h4><p>Rèn luyện đọc hiểu bảng thống kê, biểu đồ tranh, vẽ và phân tích biểu đồ cột, cột kép để rút ra nhận xét.</p>",
                "subtopics": []
            },
            {
                "id": "bai-42",
                "title": "Bài 42: Kết quả có thể và sự kiện trong trò chơi, thí nghiệm",
                "youtubeId": "emwqHKMjPEw",
                "questionType": "ket-qua-co-the",
                "theoryHtml": "<h4>1. Kết quả có thể</h4><p>Khi thực hiện một trò chơi hoặc một thí nghiệm ngẫu nhiên, ta không thể biết trước kết quả nào sẽ xảy ra, nhưng có thể liệt kê được tất cả các kết quả có thể xảy ra của nó.</p><h4>2. Sự kiện</h4><p>Sự kiện là một kết quả hoặc một nhóm kết quả xảy ra. Một sự kiện có thể xảy ra (không chắc chắn), chắc chắn xảy ra hoặc không thể xảy ra khi thực hiện trò chơi/thí nghiệm.</p>",
                "subtopics": [
                    {
                        "id": "bai-42-d1",
                        "title": "Dạng 1: Liệt kê các kết quả có thể xảy ra của trò chơi, thí nghiệm",
                        "level": "co-ban",
                        "questionType": "ket-qua-co-the",
                        "youtubeId": "",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Liệt kê các kết quả có thể xảy ra của trò chơi, thí nghiệm</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    },
                    {
                        "id": "bai-42-d2",
                        "title": "Dạng 2: Nhận biết một sự kiện trong trò chơi có thể xảy ra",
                        "level": "nang-cao",
                        "questionType": "ket-qua-co-the",
                        "youtubeId": "gaJ9BHjI04M",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 2: Nhận biết một sự kiện trong trò chơi có thể xảy ra</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "bai-43",
                "title": "Bài 43: Xác suất thực nghiệm",
                "youtubeId": "Zs-BaHzZ63w",
                "questionType": "xac-suat-thuc-nghiem",
                "theoryHtml": "<h4>1. Xác suất thực nghiệm</h4><p>Xác suất thực nghiệm của một sự kiện sau nhiều lần thực nghiệm bằng tỉ số giữa số lần sự kiện đó xảy ra và tổng số lần thực hiện thử nghiệm.</p><h4>2. Công thức tính</h4><p>Xác suất thực nghiệm = $\\frac{\\text{Số lần sự kiện xảy ra}}{\\text{Tổng số lần thực hiện thử nghiệm}}$. Kết quả là một phân số có giá trị từ 0 đến 1.</p>",
                "subtopics": [
                    {
                        "id": "bai-43-d1",
                        "title": "Dạng 1: Biểu diễn khả năng xảy ra của sự kiện theo xác suất thực nghiệm",
                        "level": "co-ban",
                        "questionType": "xac-suat-thuc-nghiem",
                        "youtubeId": "",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững phương pháp giải chi tiết cho dạng toán: <b>Dạng 1: Biểu diễn khả năng xảy ra của sự kiện theo xác suất thực nghiệm</b>.</p><p>Học sinh hãy theo dõi kỹ video bài giảng đính kèm và thực hiện các bài tập tự luyện.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Xem chi tiết ví dụ minh họa và hướng dẫn giải trong video bài giảng đính kèm dạng toán này.</p></div>"
                    }
                ]
            },
            {
                "id": "lt-c9-2",
                "title": "Luyện tập chung (Xác suất thực nghiệm)",
                "youtubeId": "",
                "questionType": "luyen-tap-chung-c9-2",
                "theoryHtml": "<h4>Luyện tập ôn tập Xác suất</h4><p>Tính toán xác suất thực nghiệm khi tung đồng xu, gieo xúc xắc hoặc lấy thẻ từ hộp kín trong nhiều lượt chơi.</p>",
                "subtopics": []
            },
            {
                "id": "kt-c9",
                "title": "Bài tập cuối chương IX",
                "youtubeId": "",
                "questionType": "cuoi-chuong-9",
                "theoryHtml": "<h4>Kiểm tra tổng hợp Chương IX</h4><p>Đánh giá toàn diện kiến thức về thu thập phân loại dữ liệu, bảng số liệu, đọc biểu đồ cột/cột kép và tính xác suất thực nghiệm.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "l4-chuong-1",
        "class": "4",
        "semester": 1,
        "title": "Chương 1: Ôn tập và bổ sung",
        "subtitle": "Ôn tập số đến 100 000, phép tính, số chẵn lẻ, biểu thức chứa chữ và giải toán",
        "lessons": [
            {
                "id": "l4-bai-1",
                "title": "Bài 1: Ôn tập các số đến 100 000",
                "youtubeId": "eXNM7teL8SQ",
                "questionType": "l4-on-tap-100k",
                "theoryHtml": "<h4>1. Đọc và viết số đến 100 000</h4><p>Để đọc các số đến 100 000, ta đọc từ trái sang phải, từ hàng cao nhất đến hàng thấp nhất (hàng chục nghìn, hàng nghìn, hàng trăm, hàng chục, hàng đơn vị).</p><h4>2. Cấu tạo số</h4><p>Số gồm các hàng: Chục nghìn, Nghìn, Trăm, Chục, Đơn vị. Ví dụ: $32\\,507 = 30\\,000 + 2\\,000 + 500 + 7$.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-1-v1",
                        "title": "Bài giảng: Ôn tập các số đến 100000 -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Ôn tập các số đến 100000 -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-on-tap-100k",
                        "level": "co-ban",
                        "youtubeId": "eXNM7teL8SQ"
                    },
                    {
                        "id": "l4-bai-1-v2",
                        "title": "Ôn tập các số đến 100 000",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Ôn tập các số đến 100 000</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-on-tap-100k",
                        "level": "nang-cao",
                        "youtubeId": "FxWLzL3NdGc"
                    }
                ]
            },
            {
                "id": "l4-bai-2",
                "title": "Bài 2: Ôn tập các phép tính trong phạm vi 100 000",
                "youtubeId": "qP3CdK4WtcA",
                "questionType": "l4-phep-tinh-100k",
                "theoryHtml": "<h4>1. Phép cộng và phép trừ</h4><p>Đặt tính thẳng cột: hàng đơn vị thẳng hàng đơn vị, hàng chục thẳng hàng chục... và thực hiện cộng/trừ từ phải sang trái (lưu ý có nhớ).</p><h4>2. Phép nhân và phép chia</h4><p>Thực hiện nhân từ phải sang trái. Phép chia thực hiện từ trái sang phải.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-2-v1",
                        "title": "Bài giảng: Ôn tập các phép tính trong phạm vi 100 000 -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Ôn tập các phép tính trong phạm vi 100 000 -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-phep-tinh-100k",
                        "level": "co-ban",
                        "youtubeId": "qP3CdK4WtcA"
                    },
                    {
                        "id": "l4-bai-2-v2",
                        "title": "Tiết 1: Ôn tập các phép tính trong phạm vi 100000",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Ôn tập các phép tính trong phạm vi 100 000</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-phep-tinh-100k",
                        "level": "nang-cao",
                        "youtubeId": "J0H8WUmaIRk"
                    },
                    {
                        "id": "l4-bai-2-v3",
                        "title": "Tiết 2: Ôn tập các phép tính trong phạm vi 100000",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Ôn tập các phép tính trong phạm vi 100 000</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-phep-tinh-100k",
                        "level": "kho",
                        "youtubeId": "bEnnlKvO0So"
                    }
                ]
            },
            {
                "id": "l4-bai-3",
                "title": "Bài 3: Số chẵn, số lẻ",
                "youtubeId": "SQl_i5lvhN4",
                "questionType": "l4-so-chan-le",
                "theoryHtml": "<h4>1. Số chẵn</h4><p>Các số có chữ số tận cùng là $0; 2; 4; 6; 8$ gọi là số chẵn. Ví dụ: $12; 40; 98$ là số chẵn.</p><h4>2. Số lẻ</h4><p>Các số có chữ số tận cùng là $1; 3; 5; 7; 9$ gọi là số lẻ. Ví dụ: $15; 27; 99$ là số lẻ.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-3-v1",
                        "title": "Số chẵn số lẻ -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Số chẵn số lẻ -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "l4-so-chan-le",
                        "level": "co-ban",
                        "youtubeId": "SQl_i5lvhN4"
                    }
                ]
            },
            {
                "id": "l4-bai-4",
                "title": "Bài 4: Biểu thức chứa chữ",
                "youtubeId": "7aov0pQnKVo",
                "questionType": "l4-bieu-thuc-chu",
                "theoryHtml": "<h4>1. Khái niệm</h4><p>Biểu thức chứa chữ là biểu thức gồm số, các phép tính và chữ (biến). Ví dụ: $a + 5$, $a - b$, $a + b + c$.</p><h4>2. Cách tính giá trị biểu thức</h4><p>Thế giá trị của chữ vào biểu thức rồi thực hiện phép tính. Ví dụ: nếu $a = 3$ thì giá trị của $a + 5$ là $3 + 5 = 8$.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-4-v1",
                        "title": "Bài giảng: Biểu thức chứa chữ -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Biểu thức chứa chữ -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-bieu-thuc-chu",
                        "level": "co-ban",
                        "youtubeId": "7aov0pQnKVo"
                    },
                    {
                        "id": "l4-bai-4-v2",
                        "title": "Tiết 1: Biểu thức chứa chữ",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Biểu thức chứa chữ</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-bieu-thuc-chu",
                        "level": "nang-cao",
                        "youtubeId": "7w_vWEBh3wc"
                    },
                    {
                        "id": "l4-bai-4-v3",
                        "title": "Tiết 2: Biểu thức chứa chữ",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Biểu thức chứa chữ</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-bieu-thuc-chu",
                        "level": "kho",
                        "youtubeId": "4ZwVzOBMjr0"
                    },
                    {
                        "id": "l4-bai-4-v4",
                        "title": "Tiết 3: Biểu thức chứa chữ",
                        "methodology": "<h4>Phương pháp giải (Vận dụng cao)</h4><p>Giải các bài toán đố thực tế có lời văn hoặc các bài toán tư duy phát triển từ kiến thức: <b>Biểu thức chứa chữ</b>.</p><p>Yêu cầu học sinh phân tích đề bài tỉ mỉ và tính toán cẩn thận.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lập biểu thức toán học biểu diễn mối quan hệ thực tế trong đề bài, sau đó thực hiện tính toán để đưa ra kết luận chính xác.</p></div>",
                        "questionType": "l4-bieu-thuc-chu",
                        "level": "kho",
                        "youtubeId": "lpzfwMqXdXs"
                    }
                ]
            },
            {
                "id": "l4-bai-5",
                "title": "Bài 5: Giải bài toán có ba bước tính",
                "youtubeId": "Sikx8JqWUbM",
                "questionType": "l4-toan-ba-buoc-tinh",
                "theoryHtml": "<h4>Giải bài toán có ba bước tính</h4><p>Là bài toán thực tế yêu cầu ta phân tích và thực hiện tuần tự ba phép tính toán học khác nhau mới tìm ra được kết quả cuối cùng. Học sinh cần đọc kỹ đề bài để tóm tắt chính xác các bước trung gian.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-5-v1",
                        "title": "Giải bài toán có ba bước tính -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Giải bài toán có ba bước tính -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "l4-toan-ba-buoc-tinh",
                        "level": "co-ban",
                        "youtubeId": "Sikx8JqWUbM"
                    }
                ]
            },
            {
                "id": "l4-lt-c1",
                "title": "Luyện tập chung (Chương 1)",
                "youtubeId": "u8I9fGoASus",
                "questionType": "luyen-tap-chung-l4-c1",
                "theoryHtml": "<h4>Luyện tập tổng hợp</h4><p>Ôn tập lại các kiến thức trọng tâm của Chương 1 bao gồm số chẵn/số lẻ, tính giá trị biểu thức chứa chữ và giải bài toán có 3 bước tính.</p>",
                "subtopics": [
                    {
                        "id": "l4-lt-c1-v1",
                        "title": "Luyện tập chung -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Luyện tập chung -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "luyen-tap-chung-l4-c1",
                        "level": "co-ban",
                        "youtubeId": "u8I9fGoASus"
                    }
                ]
            },
            {
                "id": "l4-kt-c1",
                "title": "Bài tập cuối chương I",
                "youtubeId": "",
                "questionType": "cuoi-chuong-l4-1",
                "theoryHtml": "<h4>Kiểm tra tổng hợp Chương I</h4><p>Đánh giá năng lực của học sinh về ôn tập số và các phép toán, số chẵn lẻ, biểu thức chứa chữ và giải bài toán 3 bước tính.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "l4-chuong-2",
        "class": "4",
        "semester": 1,
        "title": "Chương 2: Góc và đơn vị đo góc",
        "subtitle": "Đo góc, góc nhọn, góc tù, góc bẹt",
        "lessons": [
            {
                "id": "l4-bai-7",
                "title": "Bài 7: Đo góc, đơn vị đo góc",
                "youtubeId": "iTra__4dcck",
                "questionType": "l4-do-goc",
                "theoryHtml": "<h4>1. Đơn vị đo góc</h4><p>Đơn vị đo góc là độ, ký hiệu là $^\\circ$ (ví dụ: $90^\\circ$, $60^\\circ$).</p><h4>2. Dùng thước đo góc</h4><p>Đặt tâm thước trùng với đỉnh của góc, một cạnh của góc đi qua vạch $0$ độ, cạnh còn lại chỉ vào số độ tương ứng trên thước.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-7-v1",
                        "title": "Đo góc đơn vị đo góc -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Đo góc đơn vị đo góc -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "l4-do-goc",
                        "level": "co-ban",
                        "youtubeId": "iTra__4dcck"
                    }
                ]
            },
            {
                "id": "l4-bai-8",
                "title": "Bài 8: Góc nhọn, góc tù, góc bẹt",
                "youtubeId": "EqYxBe7I9iE",
                "questionType": "l4-phan-loai-goc",
                "theoryHtml": "<h4>Phân loại các góc</h4><p>- <b>Góc vuông</b>: bằng $90^\\circ$.<br/>- <b>Góc nhọn</b>: bé hơn góc vuông (bé hơn $90^\\circ$).<br/>- <b>Góc tù</b>: lớn hơn góc vuông và bé hơn góc bẹt (lớn hơn $90^\\circ$ và bé hơn $180^\\circ$).<br/>- <b>Góc bẹt</b>: bằng hai góc vuông (bằng $180^\\circ$).</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-8-v1",
                        "title": "Bài giảng: Góc nhọn, góc tù, góc bẹt -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Góc nhọn, góc tù, góc bẹt -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-phan-loai-goc",
                        "level": "co-ban",
                        "youtubeId": "EqYxBe7I9iE"
                    },
                    {
                        "id": "l4-bai-8-v2",
                        "title": "Góc nhọn, góc tù, góc bẹt",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Góc nhọn, góc tù, góc bẹt</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-phan-loai-goc",
                        "level": "nang-cao",
                        "youtubeId": "y-Wxx3ujhgA"
                    }
                ]
            },
            {
                "id": "l4-kt-c2",
                "title": "Bài tập cuối chương II",
                "youtubeId": "",
                "questionType": "cuoi-chuong-l4-2",
                "theoryHtml": "<h4>Kiểm tra tổng hợp Chương II</h4><p>Đánh giá khả năng đo góc, phân biệt góc nhọn, góc vuông, góc tù và góc bẹt trong các hình học thực tế.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "l4-chuong-3",
        "class": "4",
        "semester": 1,
        "title": "Chương 3: Số có nhiều chữ số",
        "subtitle": "Số có 6 chữ số, hàng và lớp, làm tròn số, so sánh số và dãy số tự nhiên",
        "lessons": [
            {
                "id": "l4-bai-10",
                "title": "Bài 10: Số có sáu chữ số. Số 1 000 000",
                "youtubeId": "IjuNuRdDj3g",
                "questionType": "l4-so-sau-chu-so",
                "theoryHtml": "<h4>1. Số có 6 chữ số</h4><p>Gồm các hàng: Trăm nghìn, Chục nghìn, Nghìn, Trăm, Chục, Đơn vị. Ví dụ: $120\\,350$.</p><h4>2. Số 1 000 000 (Một triệu)</h4><p>Là số bé nhất có 7 chữ số, đứng liền sau số $999\\,999$.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-10-v1",
                        "title": "Bài giảng: Số có sáu chữ số. Số 1000000 -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Số có sáu chữ số. Số 1000000 -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-so-sau-chu-so",
                        "level": "co-ban",
                        "youtubeId": "IjuNuRdDj3g"
                    },
                    {
                        "id": "l4-bai-10-v2",
                        "title": "Số có sáu chữ số. Số 1 000 000",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Số có sáu chữ số. Số 1 000 000</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-so-sau-chu-so",
                        "level": "nang-cao",
                        "youtubeId": "DVrZZt8EfEA"
                    }
                ]
            },
            {
                "id": "l4-bai-11",
                "title": "Bài 11: Hàng và lớp",
                "youtubeId": "NmUNng4lQM4",
                "questionType": "l4-hang-va-lop",
                "theoryHtml": "<h4>Phân biệt Hàng và Lớp</h4><p>- <b>Lớp đơn vị</b> gồm các hàng: Hàng trăm, hàng chục, hàng đơn vị.<br/>- <b>Lớp nghìn</b> gồm các hàng: Hàng trăm nghìn, hàng chục nghìn, hàng nghìn.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-11-v1",
                        "title": "Bài giảng: Hàng và lớp -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Hàng và lớp -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-hang-va-lop",
                        "level": "co-ban",
                        "youtubeId": "NmUNng4lQM4"
                    },
                    {
                        "id": "l4-bai-11-v2",
                        "title": "Hàng và lớp",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Hàng và lớp</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-hang-va-lop",
                        "level": "nang-cao",
                        "youtubeId": "L8aRGIh7pis"
                    }
                ]
            },
            {
                "id": "l4-bai-12",
                "title": "Bài 12: Các số trong phạm vi lớp triệu",
                "youtubeId": "fXImOwljvQE",
                "questionType": "l4-lop-trieu",
                "theoryHtml": "<h4>Lớp triệu</h4><p>Gồm các hàng: Hàng trăm triệu, hàng chục triệu, hàng triệu. Lớp triệu đứng bên trái lớp nghìn.</p><h4>Cách đọc</h4><p>Đọc như đọc số có ba chữ số rồi kèm theo tên lớp (ví dụ: ba trăm triệu, hai mươi triệu...).</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-12-v1",
                        "title": "Bài giảng: Các số trong phạm vi lớp triệu -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Các số trong phạm vi lớp triệu -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-lop-trieu",
                        "level": "co-ban",
                        "youtubeId": "fXImOwljvQE"
                    },
                    {
                        "id": "l4-bai-12-v2",
                        "title": "Triệu và lớp triệu",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Các số trong phạm vi lớp triệu</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-lop-trieu",
                        "level": "nang-cao",
                        "youtubeId": "MLsGx9r-vCE"
                    },
                    {
                        "id": "l4-bai-12-v3",
                        "title": "Triệu và lớp triệu",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Các số trong phạm vi lớp triệu</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-lop-trieu",
                        "level": "kho",
                        "youtubeId": "UbRN_YayHgY"
                    }
                ]
            },
            {
                "id": "l4-bai-13",
                "title": "Bài 13: Làm tròn số đến hàng trăm nghìn",
                "youtubeId": "uaIK2HxX0us",
                "questionType": "l4-lam-tron-tram-nghin",
                "theoryHtml": "<h4>Quy tắc làm tròn số</h4><p>Khi làm tròn số đến hàng trăm nghìn, ta so sánh chữ số ở hàng chục nghìn với 5:</p><ul><li>Nếu chữ số đó bé hơn 5 thì làm tròn xuống (giữ nguyên chữ số hàng trăm nghìn, các chữ số sau thay bằng 0).</li><li>Nếu chữ số đó lớn hơn hoặc bằng 5 thì làm tròn lên (thêm 1 vào chữ số hàng trăm nghìn, các chữ số sau thay bằng 0).</li></ul>",
                "subtopics": [
                    {
                        "id": "l4-bai-13-v1",
                        "title": "Làm tròn số đến hàng trăm nghìn -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Làm tròn số đến hàng trăm nghìn -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "l4-lam-tron-tram-nghin",
                        "level": "co-ban",
                        "youtubeId": "uaIK2HxX0us"
                    }
                ]
            },
            {
                "id": "l4-bai-14",
                "title": "Bài 14: So sánh các số có nhiều chữ số",
                "youtubeId": "bKuCJOvOLUQ",
                "questionType": "l4-so-sanh-nhieu-chu-so",
                "theoryHtml": "<h4>Quy tắc so sánh</h4><p>1. Số nào có nhiều chữ số hơn thì lớn hơn.<br/>2. Nếu hai số có cùng số chữ số, ta so sánh các cặp chữ số ở cùng một hàng kể từ trái sang phải cho đến khi tìm thấy chữ số khác nhau.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-14-v1",
                        "title": "Bài giảng: So sánh các số có nhiều chữ số -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>So sánh các số có nhiều chữ số -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-so-sanh-nhieu-chu-so",
                        "level": "co-ban",
                        "youtubeId": "bKuCJOvOLUQ"
                    },
                    {
                        "id": "l4-bai-14-v2",
                        "title": "So sánh các số có nhiều chữ số",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>So sánh các số có nhiều chữ số</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-so-sanh-nhieu-chu-so",
                        "level": "nang-cao",
                        "youtubeId": "3n6d-lVyhOM"
                    },
                    {
                        "id": "l4-bai-14-v3",
                        "title": "So sánh và xếp thứ tự các số tự nhiên",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>So sánh các số có nhiều chữ số</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-so-sanh-nhieu-chu-so",
                        "level": "kho",
                        "youtubeId": "85tUi2fOB1Y"
                    }
                ]
            },
            {
                "id": "l4-bai-15",
                "title": "Bài 15: Làm quen với dãy số tự nhiên",
                "youtubeId": "CX0gDRGz7z0",
                "questionType": "l4-day-so-tu-nhien",
                "theoryHtml": "<h4>Dãy số tự nhiên</h4><p>Các số $0; 1; 2; 3; 4; 5...$ xếp theo thứ tự từ bé đến lớn tạo thành dãy số tự nhiên.</p><p>Số 0 là số tự nhiên bé nhất. Không có số tự nhiên lớn nhất vì ta luôn tìm được số đứng liền sau của nó bằng cách cộng thêm 1.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-15-v1",
                        "title": "Bài giảng: Làm quen với dãy số tự nhiên -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Làm quen với dãy số tự nhiên -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-day-so-tu-nhien",
                        "level": "co-ban",
                        "youtubeId": "CX0gDRGz7z0"
                    },
                    {
                        "id": "l4-bai-15-v2",
                        "title": "Làm quen với dãy số tự nhiên",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Làm quen với dãy số tự nhiên</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-day-so-tu-nhien",
                        "level": "nang-cao",
                        "youtubeId": "F_YCkk6pqK8"
                    },
                    {
                        "id": "l4-bai-15-v3",
                        "title": "Viết số tự nhiên trong hệ thập phân",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Làm quen với dãy số tự nhiên</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-day-so-tu-nhien",
                        "level": "kho",
                        "youtubeId": "ZmWi0Gv_9Tc"
                    }
                ]
            },
            {
                "id": "l4-lt-c3",
                "title": "Luyện tập chung (Chương 3)",
                "youtubeId": "5NqbFsZfs6s",
                "questionType": "luyen-tap-chung-l4-c3",
                "theoryHtml": "<h4>Luyện tập tổng hợp</h4><p>Ôn tập cách đọc viết số lớn, xác định hàng và lớp, làm tròn số đến hàng trăm nghìn và thứ tự so sánh các số tự nhiên.</p>",
                "subtopics": [
                    {
                        "id": "l4-lt-c3-v1",
                        "title": "Luyện tập chung -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Luyện tập chung -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "luyen-tap-chung-l4-c3",
                        "level": "co-ban",
                        "youtubeId": "5NqbFsZfs6s"
                    }
                ]
            },
            {
                "id": "l4-kt-c3",
                "title": "Bài tập cuối chương III",
                "youtubeId": "",
                "questionType": "cuoi-chuong-l4-3",
                "theoryHtml": "<h4>Kiểm tra tổng hợp Chương III</h4><p>Đánh giá tổng quát về số có nhiều chữ số, hàng và lớp, so sánh và làm tròn số trong lớp triệu.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "l4-chuong-4",
        "class": "4",
        "semester": 1,
        "title": "Chương 4: Một số đơn vị đo đại lượng",
        "subtitle": "Yến, tạ, tấn, đề-xi-mét vuông, mét vuông, mi-li-mét vuông, giây, thế kỉ",
        "lessons": [
            {
                "id": "l4-bai-17",
                "title": "Bài 17: Yến, tạ, tấn",
                "youtubeId": "c7l7q3gkafo",
                "questionType": "l4-yen-ta-tan",
                "theoryHtml": "<h4>1. Các đơn vị đo khối lượng lớn</h4><p>- 1 yến = $10$ kg.<br/>- 1 tạ = $10$ yến = $100$ kg.<br/>- 1 tấn = $10$ tạ = $1000$ kg.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-17-v1",
                        "title": "Bài giảng: Yến tạ tấn -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Yến tạ tấn -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-yen-ta-tan",
                        "level": "co-ban",
                        "youtubeId": "c7l7q3gkafo"
                    },
                    {
                        "id": "l4-bai-17-v2",
                        "title": "Yến, tạ, tấn",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Yến, tạ, tấn</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-yen-ta-tan",
                        "level": "nang-cao",
                        "youtubeId": "ICdaRlFgjGU"
                    },
                    {
                        "id": "l4-bai-17-v3",
                        "title": "Bảng đơn vị đo khối lượng",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Yến, tạ, tấn</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-yen-ta-tan",
                        "level": "kho",
                        "youtubeId": "UfycxCYmQsM"
                    }
                ]
            },
            {
                "id": "l4-bai-18",
                "title": "Bài 18: Đề-xi-mét vuông, mét vuông, mi-li-mét vuông",
                "youtubeId": "myyWSJnZF8g",
                "questionType": "l4-don-vi-dien-tich",
                "theoryHtml": "<h4>Các đơn vị đo diện tích</h4><p>- 1 $m^2$ = $100$ $dm^2$.<br/>- 1 $dm^2$ = $100$ $cm^2$.<br/>- 1 $cm^2$ = $100$ $mm^2$.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-18-v1",
                        "title": "Bài giảng: Đề-xi-mét vuông. Mét vuông. Mi-li-mét vuông -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Đề-xi-mét vuông. Mét vuông. Mi-li-mét vuông -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-don-vi-dien-tich",
                        "level": "co-ban",
                        "youtubeId": "myyWSJnZF8g"
                    },
                    {
                        "id": "l4-bai-18-v2",
                        "title": "Đề - xi - mét vuông",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Đề-xi-mét vuông, mét vuông, mi-li-mét vuông</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-don-vi-dien-tich",
                        "level": "nang-cao",
                        "youtubeId": "hKaGENh-OE0"
                    },
                    {
                        "id": "l4-bai-18-v3",
                        "title": "Mét vuông",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Đề-xi-mét vuông, mét vuông, mi-li-mét vuông</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-don-vi-dien-tich",
                        "level": "kho",
                        "youtubeId": "rfBflNAONmE"
                    },
                    {
                        "id": "l4-bai-18-v4",
                        "title": "Ki-lô-mét vuông",
                        "methodology": "<h4>Phương pháp giải (Vận dụng cao)</h4><p>Giải các bài toán đố thực tế có lời văn hoặc các bài toán tư duy phát triển từ kiến thức: <b>Đề-xi-mét vuông, mét vuông, mi-li-mét vuông</b>.</p><p>Yêu cầu học sinh phân tích đề bài tỉ mỉ và tính toán cẩn thận.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lập biểu thức toán học biểu diễn mối quan hệ thực tế trong đề bài, sau đó thực hiện tính toán để đưa ra kết luận chính xác.</p></div>",
                        "questionType": "l4-don-vi-dien-tich",
                        "level": "kho",
                        "youtubeId": "Lyj7LClNFUM"
                    }
                ]
            },
            {
                "id": "l4-bai-19",
                "title": "Bài 19: Giây, thế kỉ",
                "youtubeId": "a60y1ERp6Wc",
                "questionType": "l4-giay-the-ki",
                "theoryHtml": "<h4>Đơn vị đo thời gian</h4><p>- 1 phút = $60$ giây.<br/>- 1 thế kỉ = $100$ năm.<br/>- Cách xác định thế kỉ: Ví dụ năm $1945$ thuộc thế kỉ $XX$ (thế kỉ 20), năm $2000$ thuộc thế kỉ $XX$, năm $2026$ thuộc thế kỉ $XXI$ (thế kỉ 21).</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-19-v1",
                        "title": "Bài giảng: Giây thế kỉ -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Giây thế kỉ -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-giay-the-ki",
                        "level": "co-ban",
                        "youtubeId": "a60y1ERp6Wc"
                    },
                    {
                        "id": "l4-bai-19-v2",
                        "title": "Giây, thế kỉ",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Giây, thế kỉ</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-giay-the-ki",
                        "level": "nang-cao",
                        "youtubeId": "pkzMvxcPhqo"
                    }
                ]
            },
            {
                "id": "l4-lt-c4",
                "title": "Luyện tập chung (Chương 4)",
                "youtubeId": "Id86WD2JPfA",
                "questionType": "luyen-tap-chung-l4-c4",
                "theoryHtml": "<h4>Luyện tập đại lượng</h4><p>Rèn luyện kỹ năng quy đổi các đơn vị đo khối lượng (yến, tạ, tấn), diện tích ($m^2, dm^2, mm^2$) và thời gian (giây, thế kỉ).</p>",
                "subtopics": [
                    {
                        "id": "l4-lt-c4-v1",
                        "title": "Luyện tập chung -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Luyện tập chung -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "luyen-tap-chung-l4-c4",
                        "level": "co-ban",
                        "youtubeId": "Id86WD2JPfA"
                    }
                ]
            },
            {
                "id": "l4-kt-c4",
                "title": "Bài tập cuối chương IV",
                "youtubeId": "",
                "questionType": "cuoi-chuong-l4-4",
                "theoryHtml": "<h4>Kiểm tra tổng hợp Chương IV</h4><p>Đánh giá năng lực của học sinh về quy đổi đơn vị đo khối lượng, đo diện tích và thời gian.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "l4-chuong-5",
        "class": "4",
        "semester": 1,
        "title": "Chương 5: Phép cộng và phép trừ",
        "subtitle": "Phép cộng và trừ số có nhiều chữ số, tính chất phép cộng, toán tổng hiệu",
        "lessons": [
            {
                "id": "l4-bai-22",
                "title": "Bài 22: Phép cộng các số có nhiều chữ số",
                "youtubeId": "zcqHJgMR1rU",
                "questionType": "l4-cong-nhieu-chu-so",
                "theoryHtml": "<h4>Phép cộng nhiều chữ số</h4><p>Đặt tính sao cho các chữ số ở cùng một hàng thẳng cột với nhau. Thực hiện cộng từ phải sang trái (có nhớ sang hàng tiếp theo nếu tổng hàng lớn hơn hoặc bằng 10).</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-22-v1",
                        "title": "Bài giảng: Phép cộng các số có nhiều chữ số -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Phép cộng các số có nhiều chữ số -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-cong-nhieu-chu-so",
                        "level": "co-ban",
                        "youtubeId": "zcqHJgMR1rU"
                    },
                    {
                        "id": "l4-bai-22-v2",
                        "title": "Phép cộng các số có nhiều chữ số",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Phép cộng các số có nhiều chữ số</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-cong-nhieu-chu-so",
                        "level": "nang-cao",
                        "youtubeId": "805KvcaCPTo"
                    }
                ]
            },
            {
                "id": "l4-bai-23",
                "title": "Bài 23: Phép trừ các số có nhiều chữ số",
                "youtubeId": "iFQkCkCz9E8",
                "questionType": "l4-tru-nhieu-chu-so",
                "theoryHtml": "<h4>Phép trừ nhiều chữ số</h4><p>Đặt tính thẳng hàng, thẳng cột. Thực hiện trừ từ phải sang trái. Nếu hàng đó không trừ được, ta mượn 1 chục ở hàng liền trước và nhớ trả lại vào số trừ ở hàng tiếp theo.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-23-v1",
                        "title": "Bài giảng: Phép trừ các số có nhiều chữ số -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Phép trừ các số có nhiều chữ số -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-tru-nhieu-chu-so",
                        "level": "co-ban",
                        "youtubeId": "iFQkCkCz9E8"
                    },
                    {
                        "id": "l4-bai-23-v2",
                        "title": "Phép trừ các số có nhiều chữ số",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Phép trừ các số có nhiều chữ số</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-tru-nhieu-chu-so",
                        "level": "nang-cao",
                        "youtubeId": "2n5h4uL8pDU"
                    }
                ]
            },
            {
                "id": "l4-bai-24",
                "title": "Bài 24: Tính chất giao hoán và kết hợp của phép cộng",
                "youtubeId": "N4c875NU6LY",
                "questionType": "l4-tinh-chat-cong",
                "theoryHtml": "<h4>1. Tính chất giao hoán</h4><p>Khi đổi chỗ các số hạng trong một tổng thì tổng không thay đổi: $a + b = b + a$.</p><h4>2. Tính chất kết hợp</h4><p>Khi cộng một tổng hai số với số thứ ba, ta có thể cộng số thứ nhất với tổng của số thứ hai và số thứ ba: $(a + b) + c = a + (b + c)$.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-24-v1",
                        "title": "Bài giảng: Tính chất giao hoán và kết hợp của phép cộng -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Tính chất giao hoán và kết hợp của phép cộng -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-tinh-chat-cong",
                        "level": "co-ban",
                        "youtubeId": "N4c875NU6LY"
                    },
                    {
                        "id": "l4-bai-24-v2",
                        "title": "Tiết 1: Tính chất giao hoán và kết hợp của phép cộng",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Tính chất giao hoán và kết hợp của phép cộng</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-tinh-chat-cong",
                        "level": "nang-cao",
                        "youtubeId": "UU1cDxpmj6U"
                    },
                    {
                        "id": "l4-bai-24-v3",
                        "title": "Tiết 2: Tính chất giao hoán và kết hợp của phép cộng",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Tính chất giao hoán và kết hợp của phép cộng</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-tinh-chat-cong",
                        "level": "kho",
                        "youtubeId": "Z2vSDmNAQT8"
                    }
                ]
            },
            {
                "id": "l4-bai-25",
                "title": "Bài 25: Tìm hai số biết tổng và hiệu của hai số đó",
                "youtubeId": "17WRdriRRSY",
                "questionType": "l4-tong-hieu",
                "theoryHtml": "<h4>Bài toán Tổng - Hiệu</h4><p>Công thức tính:</p><ul><li><b>Số lớn</b> = $(\\text{Tổng} + \\text{Hiệu}) : 2$</li><li><b>Số bé</b> = $(\\text{Tổng} - \\text{Hiệu}) : 2$</li></ul>",
                "subtopics": [
                    {
                        "id": "l4-bai-25-v1",
                        "title": "Bài giảng: Tìm hai số biết tổng và hiệu của hai số đó -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Tìm hai số biết tổng và hiệu của hai số đó -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-tong-hieu",
                        "level": "co-ban",
                        "youtubeId": "17WRdriRRSY"
                    },
                    {
                        "id": "l4-bai-25-v2",
                        "title": "Tìm hai số biết tổng và hiệu của hai số đó - K���t nối tri thức",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Tìm hai số biết tổng và hiệu của hai số đó</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-tong-hieu",
                        "level": "nang-cao",
                        "youtubeId": "rzSb51UVhac"
                    }
                ]
            },
            {
                "id": "l4-kt-c5",
                "title": "Bài tập cuối chương V",
                "youtubeId": "",
                "questionType": "cuoi-chuong-l4-5",
                "theoryHtml": "<h4>Kiểm tra tổng hợp Chương V</h4><p>Đánh giá năng lực của học sinh về phép cộng trừ số lớn, áp dụng tính chất phép cộng để tính nhanh và giải bài toán Tìm hai số biết tổng và hiệu.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "l4-chuong-6",
        "class": "4",
        "semester": 1,
        "title": "Chương 6: Đường thẳng vuông góc. Đường thẳng song song",
        "subtitle": "Hai đường thẳng vuông góc, song song, hình bình hành và hình thoi",
        "lessons": [
            {
                "id": "l4-bai-27",
                "title": "Bài 27: Hai đường thẳng vuông góc",
                "youtubeId": "yP9mbAJ1790",
                "questionType": "l4-duong-vuong-goc",
                "theoryHtml": "<h4>Đường thẳng vuông góc</h4><p>Hai đường thẳng cắt nhau tạo thành 4 góc vuông được gọi là hai đường thẳng vuông góc với nhau. Ta có thể dùng ê-ke để kiểm tra tính vuông góc.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-27-v1",
                        "title": "Bài giảng: Hai đường thẳng vuông góc -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Hai đường thẳng vuông góc -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-duong-vuong-goc",
                        "level": "co-ban",
                        "youtubeId": "yP9mbAJ1790"
                    },
                    {
                        "id": "l4-bai-27-v2",
                        "title": "Hai đường thẳng vuông góc",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Hai đường thẳng vuông góc</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-duong-vuong-goc",
                        "level": "nang-cao",
                        "youtubeId": "ZcN6zuMdiFM"
                    },
                    {
                        "id": "l4-bai-27-v3",
                        "title": "Thực hành và trải nghiệm vẽ hai đường thẳng vuông góc",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Hai đường thẳng vuông góc</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-duong-vuong-goc",
                        "level": "kho",
                        "youtubeId": "iaZCByafPz0"
                    }
                ]
            },
            {
                "id": "l4-bai-29",
                "title": "Bài 29: Hai đường thẳng song song",
                "youtubeId": "pCXAKiP3xvU",
                "questionType": "l4-duong-song-song",
                "theoryHtml": "<h4>Đường thẳng song song</h4><p>Hai đường thẳng song song là hai đường thẳng cùng nằm trên một mặt phẳng và không bao giờ cắt nhau dù kéo dài mãi.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-29-v1",
                        "title": "Bài giảng: Hai đường thẳng song song -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Hai đường thẳng song song -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-duong-song-song",
                        "level": "co-ban",
                        "youtubeId": "pCXAKiP3xvU"
                    },
                    {
                        "id": "l4-bai-29-v2",
                        "title": "Hai đường th��ng song song",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Hai đường thẳng song song</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-duong-song-song",
                        "level": "nang-cao",
                        "youtubeId": "OH9A6iaUdxA"
                    },
                    {
                        "id": "l4-bai-29-v3",
                        "title": "Thực hành và trải nghiệm vẽ hai đường thẳng song song",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Hai đường thẳng song song</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-duong-song-song",
                        "level": "kho",
                        "youtubeId": "9g3uzr0LR9M"
                    }
                ]
            },
            {
                "id": "l4-bai-31",
                "title": "Bài 31: Hình bình hành, hình thoi",
                "youtubeId": "Eh6QZN_k_5c",
                "questionType": "l4-binh-hanh-thoi",
                "theoryHtml": "<h4>1. Hình bình hành</h4><p>Có 2 cặp cạnh đối diện song song và bằng nhau.</p><h4>2. Hình thoi</h4><p>Có 2 cặp cạnh đối diện song song và 4 cạnh bằng nhau.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-31-v1",
                        "title": "Bài giảng: Hình bình hành hình thoi -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Hình bình hành hình thoi -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-binh-hanh-thoi",
                        "level": "co-ban",
                        "youtubeId": "Eh6QZN_k_5c"
                    },
                    {
                        "id": "l4-bai-31-v2",
                        "title": "Tiết 1: Hình bình hành, hình thoi",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Hình bình hành, hình thoi</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-binh-hanh-thoi",
                        "level": "nang-cao",
                        "youtubeId": "1dzh00ZuhVE"
                    },
                    {
                        "id": "l4-bai-31-v3",
                        "title": "Tiết 2: Hình bình hành, hình thoi",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Hình bình hành, hình thoi</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-binh-hanh-thoi",
                        "level": "kho",
                        "youtubeId": "Se74OiBis0k"
                    },
                    {
                        "id": "l4-bai-31-v4",
                        "title": "Diện tích hình thoi",
                        "methodology": "<h4>Phương pháp giải (Vận dụng cao)</h4><p>Giải các bài toán đố thực tế có lời văn hoặc các bài toán tư duy phát triển từ kiến thức: <b>Hình bình hành, hình thoi</b>.</p><p>Yêu cầu học sinh phân tích đề bài tỉ mỉ và tính toán cẩn thận.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lập biểu thức toán học biểu diễn mối quan hệ thực tế trong đề bài, sau đó thực hiện tính toán để đưa ra kết luận chính xác.</p></div>",
                        "questionType": "l4-binh-hanh-thoi",
                        "level": "kho",
                        "youtubeId": "WcyCMr0hkhA"
                    },
                    {
                        "id": "l4-bai-31-v5",
                        "title": "Thực hành vẽ hình chữ nhật",
                        "methodology": "<h4>Phương pháp giải (Vận dụng cao)</h4><p>Giải các bài toán đố thực tế có lời văn hoặc các bài toán tư duy phát triển từ kiến thức: <b>Hình bình hành, hình thoi</b>.</p><p>Yêu cầu học sinh phân tích đề bài tỉ mỉ và tính toán cẩn thận.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lập biểu thức toán học biểu diễn mối quan hệ thực tế trong đề bài, sau đó thực hiện tính toán để đưa ra kết luận chính xác.</p></div>",
                        "questionType": "l4-binh-hanh-thoi",
                        "level": "kho",
                        "youtubeId": "bfpU8Y12XZU"
                    },
                    {
                        "id": "l4-bai-31-v6",
                        "title": "Thực hành vẽ hình vuông",
                        "methodology": "<h4>Phương pháp giải (Vận dụng cao)</h4><p>Giải các bài toán đố thực tế có lời văn hoặc các bài toán tư duy phát triển từ kiến thức: <b>Hình bình hành, hình thoi</b>.</p><p>Yêu cầu học sinh phân tích đề bài tỉ mỉ và tính toán cẩn thận.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lập biểu thức toán học biểu diễn mối quan hệ thực tế trong đề bài, sau đó thực hiện tính toán để đưa ra kết luận chính xác.</p></div>",
                        "questionType": "l4-binh-hanh-thoi",
                        "level": "kho",
                        "youtubeId": "MOp4KI4wYwM"
                    }
                ]
            },
            {
                "id": "l4-kt-c6",
                "title": "Bài tập cuối chương VI",
                "youtubeId": "",
                "questionType": "cuoi-chuong-l4-6",
                "theoryHtml": "<h4>Kiểm tra tổng hợp Chương VI</h4><p>Đánh giá năng lực nhận biết đường thẳng vuông góc, song song, tính chất hình bình hành và hình thoi.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "l4-chuong-7",
        "class": "4",
        "semester": 1,
        "title": "Chương 7: Ôn tập học kì 1",
        "subtitle": "Ôn tập tổng hợp kiến thức kì 1",
        "lessons": [
            {
                "id": "l4-bai-33",
                "title": "Bài 33: Ôn tập các số đến lớp triệu",
                "youtubeId": "g6_s9Y1Y-RM",
                "questionType": "luyen-tap-chung-l4-c7-1",
                "theoryHtml": "<h4>Ôn tập số học</h4><p>Hệ thống lại cách đọc viết số tự nhiên, xác định hàng và lớp, so sánh số và làm tròn số lớn.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-33-v1",
                        "title": "Ôn tập các số đến lớp triệu -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Ôn tập các số đến lớp triệu -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "luyen-tap-chung-l4-c7-1",
                        "level": "co-ban",
                        "youtubeId": "g6_s9Y1Y-RM"
                    }
                ]
            },
            {
                "id": "l4-bai-34",
                "title": "Bài 34: Ôn tập phép cộng, phép trừ",
                "youtubeId": "5Gklqx75qSI",
                "questionType": "luyen-tap-chung-l4-c7-2",
                "theoryHtml": "<h4>Ôn tập phép tính</h4><p>Ôn tập cộng trừ số lớn và giải các bài toán đố thực tế (tìm hai số khi biết tổng và hiệu).</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-34-v1",
                        "title": "Ôn tập phép cộng phép trừ -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Ôn tập phép cộng phép trừ -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "luyen-tap-chung-l4-c7-2",
                        "level": "co-ban",
                        "youtubeId": "5Gklqx75qSI"
                    }
                ]
            },
            {
                "id": "l4-bai-35",
                "title": "Bài 35: Ôn tập hình học",
                "youtubeId": "c19o_QqWxZo",
                "questionType": "luyen-tap-chung-l4-c7-3",
                "theoryHtml": "<h4>Ôn tập hình học</h4><p>Củng cố kỹ năng phân loại góc, đường thẳng song song, vuông góc, hình bình hành và hình thoi.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-35-v1",
                        "title": "Ôn tập hình học -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Ôn tập hình học -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "luyen-tap-chung-l4-c7-3",
                        "level": "co-ban",
                        "youtubeId": "c19o_QqWxZo"
                    }
                ]
            },
            {
                "id": "l4-bai-36",
                "title": "Bài 36: Ôn tập đo lường",
                "youtubeId": "bygm8_ajvLc",
                "questionType": "luyen-tap-chung-l4-c7-4",
                "theoryHtml": "<h4>Ôn tập đo lường</h4><p>Hệ thống lại bảng đơn vị đo khối lượng (yến, tạ, tấn), diện tích ($m^2, dm^2, mm^2$) và thời gian (giây, thế kỉ).</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-36-v1",
                        "title": "Ôn tập đo lường -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Ôn tập đo lường -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "luyen-tap-chung-l4-c7-4",
                        "level": "co-ban",
                        "youtubeId": "bygm8_ajvLc"
                    }
                ]
            },
            {
                "id": "l4-bai-37",
                "title": "Bài 37: Ôn tập chung",
                "youtubeId": "",
                "questionType": "cuoi-chuong-l4-7",
                "theoryHtml": "<h4>Đề kiểm tra ôn tập học kì 1</h4><p>Kiểm tra tổng hợp kiến thức toán lớp 4 trong học kì 1 để chuẩn bị cho kì thi chính thức.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "l4-chuong-8",
        "class": "4",
        "semester": 2,
        "title": "Chương 8: Phép nhân và phép chia",
        "subtitle": "Nhân chia số có nhiều chữ số, tính chất phép nhân, trung bình cộng và bài toán rút về đơn vị",
        "lessons": [
            {
                "id": "l4-bai-38",
                "title": "Bài 38: Nhân với số có một chữ số",
                "youtubeId": "SHfVY30H0Ko",
                "questionType": "l4-nhan-mot-chu-so",
                "theoryHtml": "<h4>Nhân với số có một chữ số</h4><p>Đặt tính thẳng cột. Nhân thừa số có một chữ số lần lượt với từng chữ số của thừa số kia từ phải sang trái (lưu ý số có nhớ).</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-38-v1",
                        "title": "Bài giảng: Nhân với số có một chữ số -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Nhân với số có một chữ số -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-nhan-mot-chu-so",
                        "level": "co-ban",
                        "youtubeId": "SHfVY30H0Ko"
                    },
                    {
                        "id": "l4-bai-38-v2",
                        "title": "Nhân với số có một chữ số",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Nhân với số có một chữ số</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-nhan-mot-chu-so",
                        "level": "nang-cao",
                        "youtubeId": "p-21vGpT2_0"
                    },
                    {
                        "id": "l4-bai-38-v3",
                        "title": "Nhân một số với một tổng",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Nhân với số có một chữ số</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-nhan-mot-chu-so",
                        "level": "kho",
                        "youtubeId": "y-vsk7YgkxY"
                    },
                    {
                        "id": "l4-bai-38-v4",
                        "title": "Nhân một số với một hiệu",
                        "methodology": "<h4>Phương pháp giải (Vận dụng cao)</h4><p>Giải các bài toán đố thực tế có lời văn hoặc các bài toán tư duy phát triển từ kiến thức: <b>Nhân với số có một chữ số</b>.</p><p>Yêu cầu học sinh phân tích đề bài tỉ mỉ và tính toán cẩn thận.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lập biểu thức toán học biểu diễn mối quan hệ thực tế trong đề bài, sau đó thực hiện tính toán để đưa ra kết luận chính xác.</p></div>",
                        "questionType": "l4-nhan-mot-chu-so",
                        "level": "kho",
                        "youtubeId": "SZSanwzDBgo"
                    },
                    {
                        "id": "l4-bai-38-v5",
                        "title": "Nhân với số có ba chữ số",
                        "methodology": "<h4>Phương pháp giải (Vận dụng cao)</h4><p>Giải các bài toán đố thực tế có lời văn hoặc các bài toán tư duy phát triển từ kiến thức: <b>Nhân với số có một chữ số</b>.</p><p>Yêu cầu học sinh phân tích đề bài tỉ mỉ và tính toán cẩn thận.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lập biểu thức toán học biểu diễn mối quan hệ thực tế trong đề bài, sau đó thực hiện tính toán để đưa ra kết luận chính xác.</p></div>",
                        "questionType": "l4-nhan-mot-chu-so",
                        "level": "kho",
                        "youtubeId": "0W7PavD1gsc"
                    },
                    {
                        "id": "l4-bai-38-v6",
                        "title": "Nhân với số có ba chữ số",
                        "methodology": "<h4>Phương pháp giải (Vận dụng cao)</h4><p>Giải các bài toán đố thực tế có lời văn hoặc các bài toán tư duy phát triển từ kiến thức: <b>Nhân với số có một chữ số</b>.</p><p>Yêu cầu học sinh phân tích đề bài tỉ mỉ và tính toán cẩn thận.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lập biểu thức toán học biểu diễn mối quan hệ thực tế trong đề bài, sau đó thực hiện tính toán để đưa ra kết luận chính xác.</p></div>",
                        "questionType": "l4-nhan-mot-chu-so",
                        "level": "kho",
                        "youtubeId": "FUTuz3s4IZg"
                    },
                    {
                        "id": "l4-bai-38-v7",
                        "title": "Nhân với số có tận cùng là chữ số 0",
                        "methodology": "<h4>Phương pháp giải (Vận dụng cao)</h4><p>Giải các bài toán đố thực tế có lời văn hoặc các bài toán tư duy phát triển từ kiến thức: <b>Nhân với số có một chữ số</b>.</p><p>Yêu cầu học sinh phân tích đề bài tỉ mỉ và tính toán cẩn thận.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lập biểu thức toán học biểu diễn mối quan hệ thực tế trong đề bài, sau đó thực hiện tính toán để đưa ra kết luận chính xác.</p></div>",
                        "questionType": "l4-nhan-mot-chu-so",
                        "level": "kho",
                        "youtubeId": "SeTnUiiiqDE"
                    }
                ]
            },
            {
                "id": "l4-bai-39",
                "title": "Bài 39: Chia cho số có một chữ số",
                "youtubeId": "m_zYKnohIzo",
                "questionType": "l4-chia-mot-chu-so",
                "theoryHtml": "<h4>Chia cho số có một chữ số</h4><p>Thực hiện chia từ trái sang phải. Mỗi lượt chia gồm ba bước: chia, nhân và trừ để tìm số dư.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-39-v1",
                        "title": "Bài giảng: Chia cho số có một chữ số -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Chia cho số có một chữ số -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-chia-mot-chu-so",
                        "level": "co-ban",
                        "youtubeId": "m_zYKnohIzo"
                    },
                    {
                        "id": "l4-bai-39-v2",
                        "title": "Chia cho số có một chữ số",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Chia cho số có một chữ số</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-chia-mot-chu-so",
                        "level": "nang-cao",
                        "youtubeId": "S4OxK3-stcI"
                    },
                    {
                        "id": "l4-bai-39-v3",
                        "title": "Chia một tổng cho một số",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Chia cho số có một chữ số</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-chia-mot-chu-so",
                        "level": "kho",
                        "youtubeId": "2rD6GO0qqSo"
                    },
                    {
                        "id": "l4-bai-39-v4",
                        "title": "Chia một số cho một tích",
                        "methodology": "<h4>Phương pháp giải (Vận dụng cao)</h4><p>Giải các bài toán đố thực tế có lời văn hoặc các bài toán tư duy phát triển từ kiến thức: <b>Chia cho số có một chữ số</b>.</p><p>Yêu cầu học sinh phân tích đề bài tỉ mỉ và tính toán cẩn thận.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lập biểu thức toán học biểu diễn mối quan hệ thực tế trong đề bài, sau đó thực hiện tính toán để đưa ra kết luận chính xác.</p></div>",
                        "questionType": "l4-chia-mot-chu-so",
                        "level": "kho",
                        "youtubeId": "B1GrclE6dcY"
                    },
                    {
                        "id": "l4-bai-39-v5",
                        "title": "Chia một tích cho một số",
                        "methodology": "<h4>Phương pháp giải (Vận dụng cao)</h4><p>Giải các bài toán đố thực tế có lời văn hoặc các bài toán tư duy phát triển từ kiến thức: <b>Chia cho số có một chữ số</b>.</p><p>Yêu cầu học sinh phân tích đề bài tỉ mỉ và tính toán cẩn thận.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lập biểu thức toán học biểu diễn mối quan hệ thực tế trong đề bài, sau đó thực hiện tính toán để đưa ra kết luận chính xác.</p></div>",
                        "questionType": "l4-chia-mot-chu-so",
                        "level": "kho",
                        "youtubeId": "kcDaOc3MC4c"
                    },
                    {
                        "id": "l4-bai-39-v6",
                        "title": "Chia cho số có ba chữ số",
                        "methodology": "<h4>Phương pháp giải (Vận dụng cao)</h4><p>Giải các bài toán đố thực tế có lời văn hoặc các bài toán tư duy phát triển từ kiến thức: <b>Chia cho số có một chữ số</b>.</p><p>Yêu cầu học sinh phân tích đề bài tỉ mỉ và tính toán cẩn thận.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lập biểu thức toán học biểu diễn mối quan hệ thực tế trong đề bài, sau đó thực hiện tính toán để đưa ra kết luận chính xác.</p></div>",
                        "questionType": "l4-chia-mot-chu-so",
                        "level": "kho",
                        "youtubeId": "9EEWxQrpFr0"
                    }
                ]
            },
            {
                "id": "l4-bai-40",
                "title": "Bài 40: Tính chất giao hoán và kết hợp của phép nhân",
                "youtubeId": "ub-s0RU_dPc",
                "questionType": "l4-tinh-chat-nhan",
                "theoryHtml": "<h4>1. Tính chất giao hoán</h4><p>Khi đổi chỗ các thừa số trong một tích thì tích không thay đổi: $a \\cdot b = b \\cdot a$.</p><h4>2. Tính chất kết hợp</h4><p>Khi nhân một tích hai số với số thứ ba, ta có thể nhân số thứ nhất với tích của số thứ hai và số thứ ba: $(a \\cdot b) \\cdot c = a \\cdot (b \\cdot c)$.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-40-v1",
                        "title": "Bài giảng: Tính chất giao hoán và kết hợp của phép nhân -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Tính chất giao hoán và kết hợp của phép nhân -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-tinh-chat-nhan",
                        "level": "co-ban",
                        "youtubeId": "ub-s0RU_dPc"
                    },
                    {
                        "id": "l4-bai-40-v2",
                        "title": "Tiết 1: Tính chất giao hoán và kết hợp của phép nhân",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Tính chất giao hoán và kết hợp của phép nhân</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-tinh-chat-nhan",
                        "level": "nang-cao",
                        "youtubeId": "YDjxZGiWohU"
                    },
                    {
                        "id": "l4-bai-40-v3",
                        "title": "Tiết 2: Tính chất giao hoán và kết hợp của phép nhân",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Tính chất giao hoán và kết hợp của phép nhân</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-tinh-chat-nhan",
                        "level": "kho",
                        "youtubeId": "hOkeElZjGaA"
                    }
                ]
            },
            {
                "id": "l4-bai-41",
                "title": "Bài 41: Nhân, chia với 10, 100, 1 000, ...",
                "youtubeId": "2ZkinlcRrvU",
                "questionType": "l4-nhan-chia-10-100",
                "theoryHtml": "<h4>Nhân chia nhẩm với 10, 100, 1000</h4><p>- Khi nhân số tự nhiên với 10, 100, 1000... ta chỉ việc viết thêm 1, 2, 3... chữ số 0 vào bên phải số đó.<br/>- Khi chia số tròn chục, tròn trăm, tròn nghìn... cho 10, 100, 1000... ta chỉ việc bỏ bớt đi 1, 2, 3... chữ số 0 ở bên phải số đó.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-41-v1",
                        "title": "Bài giảng: Nhân chia với 10, 100, 1000 -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Nhân chia với 10, 100, 1000 -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-nhan-chia-10-100",
                        "level": "co-ban",
                        "youtubeId": "2ZkinlcRrvU"
                    },
                    {
                        "id": "l4-bai-41-v2",
                        "title": "Nhân, chia với 10, 100, 1000,...",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Nhân, chia với 10, 100, 1 000, ...</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-nhan-chia-10-100",
                        "level": "nang-cao",
                        "youtubeId": "1InQwIIR44k"
                    }
                ]
            },
            {
                "id": "l4-bai-42",
                "title": "Bài 42: Tính chất phân phối của phép nhân đối với phép cộng",
                "youtubeId": "IqcWUMjdgPg",
                "questionType": "l4-nhan-phan-phoi",
                "theoryHtml": "<h4>Tính chất phân phối</h4><p>Muốn nhân một số với một tổng, ta có thể nhân số đó với từng số hạng của tổng, rồi cộng các kết quả lại với nhau: $a \\cdot (b + c) = a \\cdot b + a \\cdot c$.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-42-v1",
                        "title": "Tính chất phân phối của phép nhân đối với phép cộng -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Tính chất phân phối của phép nhân đối với phép cộng -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "l4-nhan-phan-phoi",
                        "level": "co-ban",
                        "youtubeId": "IqcWUMjdgPg"
                    }
                ]
            },
            {
                "id": "l4-bai-43",
                "title": "Bài 43: Nhân với số có hai chữ số",
                "youtubeId": "MlMJMpbbBts",
                "questionType": "l4-nhan-hai-chu-so",
                "theoryHtml": "<h4>Quy tắc nhân với số có 2 chữ số</h4><p>1. Tính tích riêng thứ nhất (nhân chữ số hàng đơn vị).<br/>2. Tính tích riêng thứ hai (nhân chữ số hàng chục), viết tích riêng thứ hai lùi sang bên trái một cột so với tích riêng thứ nhất.<br/>3. Cộng hai tích riêng lại với nhau.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-43-v1",
                        "title": "Bài giảng: Nhân với số có hai chữ số -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Nhân với số có hai chữ số -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-nhan-hai-chu-so",
                        "level": "co-ban",
                        "youtubeId": "MlMJMpbbBts"
                    },
                    {
                        "id": "l4-bai-43-v2",
                        "title": "Nhân với số có hai chữ số",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Nhân với số có hai chữ số</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-nhan-hai-chu-so",
                        "level": "nang-cao",
                        "youtubeId": "9iiH9KXEvxE"
                    },
                    {
                        "id": "l4-bai-43-v3",
                        "title": "Giới thiệu nhân nhẩm số có hai chữ số với 11",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Nhân với số có hai chữ số</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-nhan-hai-chu-so",
                        "level": "kho",
                        "youtubeId": "PXaKckIn4Uw"
                    }
                ]
            },
            {
                "id": "l4-bai-44",
                "title": "Bài 44: Chia cho số có hai chữ số",
                "youtubeId": "S6Ys1k5iS1M",
                "questionType": "l4-chia-hai-chu-so",
                "theoryHtml": "<h4>Chia cho số có hai chữ số</h4><p>Đặt tính chia tương tự chia cho số có một chữ số. Sử dụng phương pháp làm tròn số để ước lượng thương nhanh hơn.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-44-v1",
                        "title": "Bài giảng: Chia cho số có hai chữ số -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Chia cho số có hai chữ số -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-chia-hai-chu-so",
                        "level": "co-ban",
                        "youtubeId": "S6Ys1k5iS1M"
                    },
                    {
                        "id": "l4-bai-44-v2",
                        "title": "Chia cho số có hai chữ số",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Chia cho số có hai chữ số</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-chia-hai-chu-so",
                        "level": "nang-cao",
                        "youtubeId": "22cjSPARsQA"
                    },
                    {
                        "id": "l4-bai-44-v3",
                        "title": "Chia cho số có hai chữ số",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Chia cho số có hai chữ số</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-chia-hai-chu-so",
                        "level": "kho",
                        "youtubeId": "5BZych1vnvU"
                    },
                    {
                        "id": "l4-bai-44-v4",
                        "title": "Chia cho số có hai chữ số",
                        "methodology": "<h4>Phương pháp giải (Vận dụng cao)</h4><p>Giải các bài toán đố thực tế có lời văn hoặc các bài toán tư duy phát triển từ kiến thức: <b>Chia cho số có hai chữ số</b>.</p><p>Yêu cầu học sinh phân tích đề bài tỉ mỉ và tính toán cẩn thận.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lập biểu thức toán học biểu diễn mối quan hệ thực tế trong đề bài, sau đó thực hiện tính toán để đưa ra kết luận chính xác.</p></div>",
                        "questionType": "l4-chia-hai-chu-so",
                        "level": "kho",
                        "youtubeId": "zRN8SJXgdEo"
                    },
                    {
                        "id": "l4-bai-44-v5",
                        "title": "Chia hai số có tận cùng là các chữ số 0",
                        "methodology": "<h4>Phương pháp giải (Vận dụng cao)</h4><p>Giải các bài toán đố thực tế có lời văn hoặc các bài toán tư duy phát triển từ kiến thức: <b>Chia cho số có hai chữ số</b>.</p><p>Yêu cầu học sinh phân tích đề bài tỉ mỉ và tính toán cẩn thận.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lập biểu thức toán học biểu diễn mối quan hệ thực tế trong đề bài, sau đó thực hiện tính toán để đưa ra kết luận chính xác.</p></div>",
                        "questionType": "l4-chia-hai-chu-so",
                        "level": "kho",
                        "youtubeId": "fbHM9rrMT2Q"
                    },
                    {
                        "id": "l4-bai-44-v6",
                        "title": "Thương có chữ số 0",
                        "methodology": "<h4>Phương pháp giải (Vận dụng cao)</h4><p>Giải các bài toán đố thực tế có lời văn hoặc các bài toán tư duy phát triển từ kiến thức: <b>Chia cho số có hai chữ số</b>.</p><p>Yêu cầu học sinh phân tích đề bài tỉ mỉ và tính toán cẩn thận.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lập biểu thức toán học biểu diễn mối quan hệ thực tế trong đề bài, sau đó thực hiện tính toán để đưa ra kết luận chính xác.</p></div>",
                        "questionType": "l4-chia-hai-chu-so",
                        "level": "kho",
                        "youtubeId": "apaOBfT_bVk"
                    }
                ]
            },
            {
                "id": "l4-bai-46",
                "title": "Bài 46: Tìm số trung bình cộng",
                "youtubeId": "Kxy4SKvgKe4",
                "questionType": "l4-trung-binh-cong",
                "theoryHtml": "<h4>Số trung bình cộng</h4><p>Muốn tìm số trung bình cộng của nhiều số, ta tính tổng của các số đó, rồi chia tổng đó cho số các số hạng:</p><div class='formula-highlight'><p>$\\text{Trung bình cộng} = \\text{Tổng các số} : \\text{Số lượng các số}$</p></div>",
                "subtopics": [
                    {
                        "id": "l4-bai-46-v1",
                        "title": "Bài giảng: Tìm số trung bình cộng -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Tìm số trung bình cộng -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-trung-binh-cong",
                        "level": "co-ban",
                        "youtubeId": "Kxy4SKvgKe4"
                    },
                    {
                        "id": "l4-bai-46-v2",
                        "title": "Tìm số trung bình cộng",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Tìm số trung bình cộng</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-trung-binh-cong",
                        "level": "nang-cao",
                        "youtubeId": "C_9HsoUu-A0"
                    }
                ]
            },
            {
                "id": "l4-bai-47",
                "title": "Bài 47: Bài toán liên quan đến rút về đơn vị",
                "youtubeId": "0qPMm-hgao8",
                "questionType": "l4-rut-ve-don-vi",
                "theoryHtml": "<h4>Bài toán rút về đơn vị</h4><p>Quy trình giải thường gồm 2 bước:</p><ul><li><b>Bước 1</b>: Tìm giá trị của 1 phần bằng nhau (thực hiện phép chia).</li><li><b>Bước 2</b>: Tìm giá trị của nhiều phần bằng nhau theo yêu cầu đề bài (thực hiện phép nhân).</li></ul>",
                "subtopics": [
                    {
                        "id": "l4-bai-47-v1",
                        "title": "Bài toán liên quan đến rút về đơn vị -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Bài toán liên quan đến rút về đơn vị -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "l4-rut-ve-don-vi",
                        "level": "co-ban",
                        "youtubeId": "0qPMm-hgao8"
                    }
                ]
            },
            {
                "id": "l4-lt-c8",
                "title": "Luyện tập chung (Chương 8)",
                "youtubeId": "pGadHn87ofE",
                "questionType": "luyen-tap-chung-l4-c8",
                "theoryHtml": "<h4>Luyện tập tổng hợp</h4><p>Ôn tập phép nhân phép chia số có nhiều chữ số, toán trung bình cộng và toán rút về đơn vị.</p>",
                "subtopics": [
                    {
                        "id": "l4-lt-c8-v1",
                        "title": "Luyện tập chung -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Luyện tập chung -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "luyen-tap-chung-l4-c8",
                        "level": "co-ban",
                        "youtubeId": "pGadHn87ofE"
                    }
                ]
            },
            {
                "id": "l4-kt-c8",
                "title": "Bài tập cuối chương VIII",
                "youtubeId": "",
                "questionType": "cuoi-chuong-l4-8",
                "theoryHtml": "<h4>Kiểm tra tổng hợp Chương VIII</h4><p>Đánh giá năng lực của học sinh về các phép tính nhân, chia, áp dụng tính chất tính nhanh, tìm số trung bình cộng và giải bài toán rút về đơn vị.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "l4-chuong-9",
        "class": "4",
        "semester": 2,
        "title": "Chương 9: Làm quen với yếu tố thống kê, xác suất",
        "subtitle": "Dãy số liệu thống kê, biểu đồ cột, số lần xuất hiện của sự kiện",
        "lessons": [
            {
                "id": "l4-bai-49",
                "title": "Bài 49: Dãy số liệu thống kê",
                "youtubeId": "2mg2VJa-Wms",
                "questionType": "l4-thong-ke",
                "theoryHtml": "<h4>Dãy số liệu thống kê</h4><p>Là một dãy các số liệu được thu thập và sắp xếp theo một thứ tự nhất định. Ta có thể đọc, so sánh các số liệu để phân tích thông tin thực tế.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-49-v1",
                        "title": "Dãy số liệu thống kê -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Dãy số liệu thống kê -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "l4-thong-ke",
                        "level": "co-ban",
                        "youtubeId": "2mg2VJa-Wms"
                    }
                ]
            },
            {
                "id": "l4-bai-50",
                "title": "Bài 50: Biểu đồ cột",
                "youtubeId": "u71xvw4RNlQ",
                "questionType": "l4-bieu-do-cot",
                "theoryHtml": "<h4>Biểu đồ cột</h4><p>Biểu diễn số liệu thống kê trực quan bằng các cột chữ nhật. Trục ngang biểu diễn các đối tượng, trục đứng biểu diễn số lượng của các đối tượng tương ứng.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-50-v1",
                        "title": "Bài giảng: Biểu đồ cột -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Biểu đồ cột -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-bieu-do-cot",
                        "level": "co-ban",
                        "youtubeId": "u71xvw4RNlQ"
                    },
                    {
                        "id": "l4-bai-50-v2",
                        "title": "Biểu đồ cột",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Biểu đồ cột</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-bieu-do-cot",
                        "level": "nang-cao",
                        "youtubeId": "cqOalMTqYxM"
                    },
                    {
                        "id": "l4-bai-50-v3",
                        "title": "Biểu đồ",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Biểu đồ cột</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-bieu-do-cot",
                        "level": "kho",
                        "youtubeId": "AXfvUXjC2XY"
                    }
                ]
            },
            {
                "id": "l4-bai-51",
                "title": "Bài 51: Số lần xuất hiện của một sự kiện",
                "youtubeId": "aaVhVlawAfk",
                "questionType": "l4-su-kien",
                "theoryHtml": "<h4>Khả năng xuất hiện sự kiện</h4><p>Khi thực hiện một thử nghiệm ngẫu nhiên (ví dụ tung đồng xu, gieo xúc xắc, rút thẻ), một sự kiện có thể xảy ra hoặc không xảy ra. Ta đếm số lần sự kiện đó xuất hiện trong tổng số lần thử nghiệm.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-51-v1",
                        "title": "Số lần xuất hiện của một sự kiện -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Số lần xuất hiện của một sự kiện -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "l4-su-kien",
                        "level": "co-ban",
                        "youtubeId": "aaVhVlawAfk"
                    }
                ]
            },
            {
                "id": "l4-kt-c9",
                "title": "Bài tập cuối chương IX",
                "youtubeId": "",
                "questionType": "cuoi-chuong-l4-9",
                "theoryHtml": "<h4>Kiểm tra tổng hợp Chương IX</h4><p>Đánh giá năng lực của học sinh về đọc phân tích dãy số liệu, biểu đồ cột và dự đoán khả năng xảy ra của sự kiện.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "l4-chuong-10",
        "class": "4",
        "semester": 2,
        "title": "Chương 10: Phân số",
        "subtitle": "Khái niệm phân số, phân số và phép chia, tính chất cơ bản, rút gọn, quy đồng và so sánh phân số",
        "lessons": [
            {
                "id": "l4-bai-53",
                "title": "Bài 53: Khái niệm phân số",
                "youtubeId": "Vt2t7BXjO4A",
                "questionType": "l4-khai-niem-phan-so",
                "theoryHtml": "<h4>Khái niệm phân số</h4><p>Mỗi phân số gồm tử số và mẫu số. Tử số là số tự nhiên viết trên gạch ngang. Mẫu số là số tự nhiên khác 0 viết dưới gạch ngang.</p><p>Ví dụ: $\\frac{3}{4}$ đọc là ba phần tư, tử số là 3, mẫu số là 4.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-53-v1",
                        "title": "Bài giảng: Khái niệm phân số -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Khái niệm phân số -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-khai-niem-phan-so",
                        "level": "co-ban",
                        "youtubeId": "Vt2t7BXjO4A"
                    },
                    {
                        "id": "l4-bai-53-v2",
                        "title": "Khái niệm phân số",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Khái niệm phân số</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-khai-niem-phan-so",
                        "level": "nang-cao",
                        "youtubeId": "XBLL9DXfdeM"
                    }
                ]
            },
            {
                "id": "l4-bai-54",
                "title": "Bài 54: Phân số và phép chia số tự nhiên",
                "youtubeId": "LGYPpQw8uhk",
                "questionType": "l4-phan-so-chia-so-tu-nhien",
                "theoryHtml": "<h4>Phép chia và Phân số</h4><p>Thương của phép chia số tự nhiên cho một số tự nhiên khác 0 có thể viết dưới dạng một phân số, tử số là số bị trừ (số bị chia) và mẫu số là số chia:</p><div class='formula-highlight'><p>$a : b = \\frac{a}{b}$ (với $b \\neq 0$)</p></div>",
                "subtopics": [
                    {
                        "id": "l4-bai-54-v1",
                        "title": "Bài giảng: Phân số và phép chia số tự nhiên -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Phân số và phép chia số tự nhiên -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-phan-so-chia-so-tu-nhien",
                        "level": "co-ban",
                        "youtubeId": "LGYPpQw8uhk"
                    },
                    {
                        "id": "l4-bai-54-v2",
                        "title": "Tiết 1: Phân số và phép chia số tự nhiên",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Phân số và phép chia số tự nhiên</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-phan-so-chia-so-tu-nhien",
                        "level": "nang-cao",
                        "youtubeId": "D0KCy2IQXIA"
                    },
                    {
                        "id": "l4-bai-54-v3",
                        "title": "Tiết 2: Phân số và phép chia số tự nhiên",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Phân số và phép chia số tự nhiên</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-phan-so-chia-so-tu-nhien",
                        "level": "kho",
                        "youtubeId": "-qHAwrELYg8"
                    }
                ]
            },
            {
                "id": "l4-bai-55",
                "title": "Bài 55: Tính chất cơ bản của phân số",
                "youtubeId": "oyUNSDj3SgM",
                "questionType": "l4-tinh-chat-phan-so",
                "theoryHtml": "<h4>Tính chất cơ bản của phân số</h4><ul><li>Nếu nhân cả tử số và mẫu số của một phân số với cùng một số tự nhiên khác 0 thì được một phân số bằng phân số đã cho.</li><li>Nếu chia cả tử số và mẫu số của một phân số cho cùng một số tự nhiên khác 0 (nếu chúng cùng chia hết) thì được một phân số bằng phân số đã cho.</li></ul>",
                "subtopics": [
                    {
                        "id": "l4-bai-55-v1",
                        "title": "Bài giảng: Tính chất cơ bản của phân số -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Tính chất cơ bản của phân số -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-tinh-chat-phan-so",
                        "level": "co-ban",
                        "youtubeId": "oyUNSDj3SgM"
                    },
                    {
                        "id": "l4-bai-55-v2",
                        "title": "Phân số bằng nhau",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Tính chất cơ bản của phân số</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-tinh-chat-phan-so",
                        "level": "nang-cao",
                        "youtubeId": "4Bw8CporvAw"
                    }
                ]
            },
            {
                "id": "l4-bai-56",
                "title": "Bài 56: Rút gọn phân số",
                "youtubeId": "pqD6WtKqfJc",
                "questionType": "l4-rut-gon-phan-so",
                "theoryHtml": "<h4>Rút gọn phân số</h4><p>Là cách tìm phân số bằng phân số đã cho nhưng có tử số và mẫu số bé hơn. Ta chia cả tử số và mẫu số cho cùng một số tự nhiên khác 0 lớn hơn 1 mà chúng cùng chia hết cho số đó, lặp lại cho tới khi được <b>phân số tối giản</b>.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-56-v1",
                        "title": "Bài giảng: Rút gọn phân số -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Rút gọn phân số -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-rut-gon-phan-so",
                        "level": "co-ban",
                        "youtubeId": "pqD6WtKqfJc"
                    },
                    {
                        "id": "l4-bai-56-v2",
                        "title": "Rút gọn phân số",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Rút gọn phân số</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-rut-gon-phan-so",
                        "level": "nang-cao",
                        "youtubeId": "c0thGlyVsqA"
                    }
                ]
            },
            {
                "id": "l4-bai-57",
                "title": "Bài 57: Quy đồng mẫu số các phân số",
                "youtubeId": "XIOMLMqvq5I",
                "questionType": "l4-quy-dong-phan-so",
                "theoryHtml": "<h4>Quy đồng mẫu số</h4><p>Là đưa các phân số về cùng một mẫu số chung. Quy tắc:</p><ul><li>Tìm mẫu số chung (thường là tích hai mẫu số hoặc mẫu số lớn hơn nếu chia hết cho mẫu số bé).</li><li>Nhân cả tử và mẫu của từng phân số với thừa số phụ tương ứng.</li></ul>",
                "subtopics": [
                    {
                        "id": "l4-bai-57-v1",
                        "title": "Bài giảng: Quy đồng mẫu số các phân số -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Quy đồng mẫu số các phân số -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-quy-dong-phan-so",
                        "level": "co-ban",
                        "youtubeId": "XIOMLMqvq5I"
                    },
                    {
                        "id": "l4-bai-57-v2",
                        "title": "Tiết 1: Quy đồng mẫu số các phân số",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Quy đồng mẫu số các phân số</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-quy-dong-phan-so",
                        "level": "nang-cao",
                        "youtubeId": "-hUsK06XQv8"
                    },
                    {
                        "id": "l4-bai-57-v3",
                        "title": "Tiết 2: Quy đồng mẫu số các phân số",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Quy đồng mẫu số các phân số</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-quy-dong-phan-so",
                        "level": "kho",
                        "youtubeId": "onHDIQH4T48"
                    }
                ]
            },
            {
                "id": "l4-bai-58",
                "title": "Bài 58: So sánh phân số",
                "youtubeId": "K6jmYB5o3wI",
                "questionType": "l4-so-sanh-phan-so",
                "theoryHtml": "<h4>Các quy tắc so sánh phân số</h4><ul><li><b>Cùng mẫu số</b>: Phân số nào có tử số lớn hơn thì phân số đó lớn hơn.</li><li><b>Cùng tử số</b>: Phân số nào có mẫu số bé hơn thì phân số đó lớn hơn.</li><li><b>Khác mẫu số</b>: Ta quy đồng mẫu số các phân số đó rồi so sánh tử số.</li></ul>",
                "subtopics": [
                    {
                        "id": "l4-bai-58-v1",
                        "title": "Bài giảng: So sánh phân số -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>So sánh phân số -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-so-sanh-phan-so",
                        "level": "co-ban",
                        "youtubeId": "K6jmYB5o3wI"
                    },
                    {
                        "id": "l4-bai-58-v2",
                        "title": "Tiết 1: So sánh phân số",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>So sánh phân số</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-so-sanh-phan-so",
                        "level": "nang-cao",
                        "youtubeId": "2lTxkHQfGl4"
                    },
                    {
                        "id": "l4-bai-58-v3",
                        "title": "Tiết 2: So sánh phân số",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>So sánh phân số</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-so-sanh-phan-so",
                        "level": "kho",
                        "youtubeId": "HeE21iI6f2Y"
                    }
                ]
            },
            {
                "id": "l4-lt-c10",
                "title": "Luyện tập chung (Chương 10)",
                "youtubeId": "lSrAuST3-qs",
                "questionType": "luyen-tap-chung-l4-c10",
                "theoryHtml": "<h4>Luyện tập tổng hợp phân số</h4><p>Rèn luyện kỹ năng rút gọn phân số, quy đồng mẫu số và so sánh các phân số bằng nhiều cách khác nhau.</p>",
                "subtopics": [
                    {
                        "id": "l4-lt-c10-v1",
                        "title": "Luyện tập chung -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Luyện tập chung -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "luyen-tap-chung-l4-c10",
                        "level": "co-ban",
                        "youtubeId": "lSrAuST3-qs"
                    }
                ]
            },
            {
                "id": "l4-kt-c10",
                "title": "Bài tập cuối chương X",
                "youtubeId": "",
                "questionType": "cuoi-chuong-l4-10",
                "theoryHtml": "<h4>Kiểm tra tổng hợp Chương X</h4><p>Đánh giá năng lực của học sinh về phân số, mối liên hệ với phép chia, tính chất cơ bản, quy đồng, rút gọn và so sánh phân số.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "l4-chuong-11",
        "class": "4",
        "semester": 2,
        "title": "Chương 11: Phép cộng, phép trừ phân số",
        "subtitle": "Cộng và trừ phân số cùng mẫu và khác mẫu",
        "lessons": [
            {
                "id": "l4-bai-60",
                "title": "Bài 60: Phép cộng phân số",
                "youtubeId": "zLew9X9s1NM",
                "questionType": "l4-cong-phan-so",
                "theoryHtml": "<h4>1. Phép cộng cùng mẫu số</h4><p>Cộng tử số với tử số và giữ nguyên mẫu số: $\\frac{a}{m} + \\frac{b}{m} = \\frac{a+b}{m}$.</p><h4>2. Phép cộng khác mẫu số</h4><p>Quy đồng mẫu số các phân số đó, rồi thực hiện cộng hai phân số đã được quy đồng.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-60-v1",
                        "title": "Bài giảng: Phép cộng phân số -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Phép cộng phân số -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-cong-phan-so",
                        "level": "co-ban",
                        "youtubeId": "zLew9X9s1NM"
                    },
                    {
                        "id": "l4-bai-60-v2",
                        "title": "Phép cộng phân số",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Phép cộng phân số</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-cong-phan-so",
                        "level": "nang-cao",
                        "youtubeId": "mo2NUfRlibc"
                    }
                ]
            },
            {
                "id": "l4-bai-61",
                "title": "Bài 61: Phép trừ phân số",
                "youtubeId": "E3u_Gxv2CDE",
                "questionType": "l4-tru-phan-so",
                "theoryHtml": "<h4>1. Phép trừ cùng mẫu số</h4><p>Trừ tử số của phân số thứ nhất cho tử số của phân số thứ hai và giữ nguyên mẫu số: $\\frac{a}{m} - \\frac{b}{m} = \\frac{a-b}{m}$.</p><h4>2. Phép trừ khác mẫu số</h4><p>Quy đồng mẫu số các phân số đó, rồi thực hiện trừ hai phân số đã được quy đồng.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-61-v1",
                        "title": "Bài giảng: Phép trừ phân số -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Phép trừ phân số -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-tru-phan-so",
                        "level": "co-ban",
                        "youtubeId": "E3u_Gxv2CDE"
                    },
                    {
                        "id": "l4-bai-61-v2",
                        "title": "Tiết 1: Phép trừ phân số",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Phép trừ phân số</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-tru-phan-so",
                        "level": "nang-cao",
                        "youtubeId": "TKnkkkwikfA"
                    },
                    {
                        "id": "l4-bai-61-v3",
                        "title": "Tiết 2: Phép trừ phân số",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Phép trừ phân số</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-tru-phan-so",
                        "level": "kho",
                        "youtubeId": "CHF61_zVwiU"
                    }
                ]
            },
            {
                "id": "l4-kt-c11",
                "title": "Bài tập cuối chương XI",
                "youtubeId": "",
                "questionType": "cuoi-chuong-l4-11",
                "theoryHtml": "<h4>Kiểm tra tổng hợp Chương XI</h4><p>Đánh giá năng lực cộng và trừ phân số của học sinh (cả trường hợp cùng mẫu số và khác mẫu số).</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "l4-chuong-12",
        "class": "4",
        "semester": 2,
        "title": "Chương 12: Phép nhân, phép chia phân số",
        "subtitle": "Nhân chia phân số, tìm phân số của một số",
        "lessons": [
            {
                "id": "l4-bai-63",
                "title": "Bài 63: Phép nhân phân số",
                "youtubeId": "aUdLuH5LDnI",
                "questionType": "l4-nhan-phan-so",
                "theoryHtml": "<h4>Phép nhân phân số</h4><p>Muốn nhân hai phân số, ta lấy tử số nhân với tử số, mẫu số nhân với mẫu số:</p><div class='formula-highlight'><p>$\\frac{a}{b} \\cdot \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}$</p></div>",
                "subtopics": [
                    {
                        "id": "l4-bai-63-v1",
                        "title": "Bài giảng: Phép nhân phân số -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Phép nhân phân số -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-nhan-phan-so",
                        "level": "co-ban",
                        "youtubeId": "aUdLuH5LDnI"
                    },
                    {
                        "id": "l4-bai-63-v2",
                        "title": "Phép nhân phân số",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Phép nhân phân số</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-nhan-phan-so",
                        "level": "nang-cao",
                        "youtubeId": "bnUIOACFLU8"
                    }
                ]
            },
            {
                "id": "l4-bai-64",
                "title": "Bài 64: Phép chia phân số",
                "youtubeId": "SKUQJqzg_p4",
                "questionType": "l4-chia-phan-so",
                "theoryHtml": "<h4>Phép chia phân số</h4><p>Muốn chia một phân số cho một phân số khác, ta lấy phân số thứ nhất nhân với phân số thứ hai đảo ngược:</p><div class='formula-highlight'><p>$\\frac{a}{b} : \\frac{c}{d} = \\frac{a}{b} \\cdot \\frac{d}{c} = \\frac{a \\cdot d}{b \\cdot c}$</p></div>",
                "subtopics": [
                    {
                        "id": "l4-bai-64-v1",
                        "title": "Bài giảng: Phép chia phân số -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Phép chia phân số -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-chia-phan-so",
                        "level": "co-ban",
                        "youtubeId": "SKUQJqzg_p4"
                    },
                    {
                        "id": "l4-bai-64-v2",
                        "title": "Phép chia phân số",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Phép chia phân số</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-chia-phan-so",
                        "level": "nang-cao",
                        "youtubeId": "cSbCKSzFZk4"
                    }
                ]
            },
            {
                "id": "l4-bai-65",
                "title": "Bài 65: Tìm phân số của một số",
                "youtubeId": "TopRtq_JI74",
                "questionType": "l4-tim-phan-so-cua-so",
                "theoryHtml": "<h4>Tìm phân số của một số</h4><p>Muốn tìm $\\frac{m}{n}$ của số $A$, ta lấy số $A$ nhân với phân số $\\frac{m}{n}$:</p><div class='formula-highlight'><p>$\\text{Giá trị} = A \\cdot \\frac{m}{n}$</p></div>",
                "subtopics": [
                    {
                        "id": "l4-bai-65-v1",
                        "title": "Bài giảng: Tìm phân số của một số -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Xem bài giảng lý thuyết chính thức <b>Tìm phân số của một số -</b> để nắm bắt kiến thức nền tảng.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-tim-phan-so-cua-so",
                        "level": "co-ban",
                        "youtubeId": "TopRtq_JI74"
                    },
                    {
                        "id": "l4-bai-65-v2",
                        "title": "Tìm phân số của một số",
                        "methodology": "<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>Tìm phân số của một số</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>",
                        "questionType": "l4-tim-phan-so-cua-so",
                        "level": "nang-cao",
                        "youtubeId": "mWj4IUUAI9M"
                    },
                    {
                        "id": "l4-bai-65-v3",
                        "title": "Giới thiệu tỉ số",
                        "methodology": "<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>Tìm phân số của một số</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>",
                        "questionType": "l4-tim-phan-so-cua-so",
                        "level": "kho",
                        "youtubeId": "gGUMbERkMEM"
                    },
                    {
                        "id": "l4-bai-65-v4",
                        "title": "Tỉ lệ bản đồ",
                        "methodology": "<h4>Phương pháp giải (Vận dụng cao)</h4><p>Giải các bài toán đố thực tế có lời văn hoặc các bài toán tư duy phát triển từ kiến thức: <b>Tìm phân số của một số</b>.</p><p>Yêu cầu học sinh phân tích đề bài tỉ mỉ và tính toán cẩn thận.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lập biểu thức toán học biểu diễn mối quan hệ thực tế trong đề bài, sau đó thực hiện tính toán để đưa ra kết luận chính xác.</p></div>",
                        "questionType": "l4-tim-phan-so-cua-so",
                        "level": "kho",
                        "youtubeId": "1Ad-TOftvng"
                    },
                    {
                        "id": "l4-bai-65-v5",
                        "title": "Ứng dụng của tỉ lệ bản đồ",
                        "methodology": "<h4>Phương pháp giải (Vận dụng cao)</h4><p>Giải các bài toán đố thực tế có lời văn hoặc các bài toán tư duy phát triển từ kiến thức: <b>Tìm phân số của một số</b>.</p><p>Yêu cầu học sinh phân tích đề bài tỉ mỉ và tính toán cẩn thận.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lập biểu thức toán học biểu diễn mối quan hệ thực tế trong đề bài, sau đó thực hiện tính toán để đưa ra kết luận chính xác.</p></div>",
                        "questionType": "l4-tim-phan-so-cua-so",
                        "level": "kho",
                        "youtubeId": "5mGWg1qJk1M"
                    },
                    {
                        "id": "l4-bai-65-v6",
                        "title": "Ứng dụng của tỉ lệ bản đồ",
                        "methodology": "<h4>Phương pháp giải (Vận dụng cao)</h4><p>Giải các bài toán đố thực tế có lời văn hoặc các bài toán tư duy phát triển từ kiến thức: <b>Tìm phân số của một số</b>.</p><p>Yêu cầu học sinh phân tích đề bài tỉ mỉ và tính toán cẩn thận.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lập biểu thức toán học biểu diễn mối quan hệ thực tế trong đề bài, sau đó thực hiện tính toán để đưa ra kết luận chính xác.</p></div>",
                        "questionType": "l4-tim-phan-so-cua-so",
                        "level": "kho",
                        "youtubeId": "65x02XNEEvo"
                    }
                ]
            },
            {
                "id": "l4-lt-c12",
                "title": "Luyện tập chung (Chương 12)",
                "youtubeId": "p1u2iXjbLXc",
                "questionType": "luyen-tap-chung-l4-c12",
                "theoryHtml": "<h4>Luyện tập tổng hợp</h4><p>Ôn tập các phép toán nhân, chia phân số và giải bài toán Tìm phân số của một số thực tế.</p>",
                "subtopics": [
                    {
                        "id": "l4-lt-c12-v1",
                        "title": "Luyện tập chung -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Luyện tập chung -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "luyen-tap-chung-l4-c12",
                        "level": "co-ban",
                        "youtubeId": "p1u2iXjbLXc"
                    }
                ]
            },
            {
                "id": "l4-kt-c12",
                "title": "Bài tập cuối chương XII",
                "youtubeId": "",
                "questionType": "cuoi-chuong-l4-12",
                "theoryHtml": "<h4>Đánh giá tổng hợp Chương XII</h4><p>Đánh giá năng lực của học sinh về phép tính nhân, chia phân số và giải bài toán Tìm phân số của một số.</p>",
                "subtopics": []
            }
        ]
    },
    {
        "id": "l4-chuong-13",
        "class": "4",
        "semester": 2,
        "title": "Chương 13: Ôn tập cuối năm",
        "subtitle": "Ôn tập tổng lực kiến thức Toán lớp 4",
        "lessons": [
            {
                "id": "l4-bai-67",
                "title": "Bài 67: Ôn tập số tự nhiên",
                "youtubeId": "0YVkH4uPhns",
                "questionType": "luyen-tap-chung-l4-c13-1",
                "theoryHtml": "<h4>Ôn tập số tự nhiên</h4><p>Củng cố lại toàn bộ kiến thức về cấu tạo số tự nhiên trong phạm vi lớp triệu, hàng và lớp, so sánh và làm tròn số.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-67-v1",
                        "title": "Ôn tập số tự nhiên -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Ôn tập số tự nhiên -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "luyen-tap-chung-l4-c13-1",
                        "level": "co-ban",
                        "youtubeId": "0YVkH4uPhns"
                    }
                ]
            },
            {
                "id": "l4-bai-68",
                "title": "Bài 68: Ôn tập phép tính với số tự nhiên",
                "youtubeId": "C6OHRBxoCuA",
                "questionType": "luyen-tap-chung-l4-c13-2",
                "theoryHtml": "<h4>Ôn tập phép tính số tự nhiên</h4><p>Hệ thống lại các phép cộng, trừ, nhân, chia số tự nhiên, các tính chất phép toán, toán tìm trung bình cộng và bài toán tổng hiệu.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-68-v1",
                        "title": "Ôn tập phép tính với số tự nhiên -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Ôn tập phép tính với số tự nhiên -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "luyen-tap-chung-l4-c13-2",
                        "level": "co-ban",
                        "youtubeId": "C6OHRBxoCuA"
                    }
                ]
            },
            {
                "id": "l4-bai-69",
                "title": "Bài 69: Ôn tập phân số",
                "youtubeId": "fGNIxYkp4Dk",
                "questionType": "luyen-tap-chung-l4-c13-3",
                "theoryHtml": "<h4>Ôn tập phân số</h4><p>Củng cố lại khái niệm phân số, rút gọn phân số, quy đồng mẫu số và các quy tắc so sánh phân số.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-69-v1",
                        "title": "Ôn tập phân số -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Ôn tập phân số -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "luyen-tap-chung-l4-c13-3",
                        "level": "co-ban",
                        "youtubeId": "fGNIxYkp4Dk"
                    }
                ]
            },
            {
                "id": "l4-bai-70",
                "title": "Bài 70: Ôn tập phép tính với phân số",
                "youtubeId": "sdiUEu8Mmb0",
                "questionType": "luyen-tap-chung-l4-c13-4",
                "theoryHtml": "<h4>Ôn tập phép tính phân số</h4><p>Ôn tập cộng, trừ, nhân, chia phân số, tính giá trị biểu thức và giải bài toán tìm phân số của một số.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-70-v1",
                        "title": "Ôn tập phép tính với phân số -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Ôn tập phép tính với phân số -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "luyen-tap-chung-l4-c13-4",
                        "level": "co-ban",
                        "youtubeId": "sdiUEu8Mmb0"
                    }
                ]
            },
            {
                "id": "l4-bai-71",
                "title": "Bài 71: Ôn tập hình học và đo lường",
                "youtubeId": "AADqwdqO19A",
                "questionType": "luyen-tap-chung-l4-c13-5",
                "theoryHtml": "<h4>Ôn tập hình học & Đo lường</h4><p>Củng cố các nhận biết về góc, đường thẳng song song/vuông góc, hình bình hành, hình thoi và đổi các đơn vị đo khối lượng, diện tích, thời gian.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-71-v1",
                        "title": "Ôn tập hình học và đo lường -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Ôn tập hình học và đo lường -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "luyen-tap-chung-l4-c13-5",
                        "level": "co-ban",
                        "youtubeId": "AADqwdqO19A"
                    }
                ]
            },
            {
                "id": "l4-bai-72",
                "title": "Bài 72: Ôn tập một số yếu tố thống kê và xác suất",
                "youtubeId": "sctnhwQG7Hw",
                "questionType": "luyen-tap-chung-l4-c13-6",
                "theoryHtml": "<h4>Ôn tập thống kê & xác suất</h4><p>Ôn tập dãy số liệu thống kê, đọc biểu đồ cột và dự đoán kết quả của một sự kiện ngẫu nhiên.</p>",
                "subtopics": [
                    {
                        "id": "l4-bai-72-v1",
                        "title": "Ôn tập một số yếu tố thống kê và xác suất -",
                        "methodology": "<h4>Phương pháp giải</h4><p>Nắm vững lý thuyết bằng cách theo dõi bài giảng <b>Ôn tập một số yếu tố thống kê và xác suất -</b>.</p>",
                        "example": "<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng các kiến thức trong bài học để giải bài tập ví dụ trong video.</p></div>",
                        "questionType": "luyen-tap-chung-l4-c13-6",
                        "level": "co-ban",
                        "youtubeId": "sctnhwQG7Hw"
                    }
                ]
            },
            {
                "id": "l4-bai-73",
                "title": "Bài 73: Ôn tập chung",
                "youtubeId": "",
                "questionType": "cuoi-chuong-l4-13",
                "theoryHtml": "<h4>Đề thi thử ôn tập cuối năm học lớp 4</h4><p>Đề thi bao quát toàn bộ nội dung chương trình Toán lớp 4 để giúp học sinh tự tin bước vào kì thi học kì 2.</p>",
                "subtopics": []
            }
        ]
    },
];

// Tích hợp dữ liệu Tiếng Anh từ english_data.js (chuyển đổi Object sang Array cấu trúc chương bài học)
if (typeof ENGLISH_COURSE_DATA !== 'undefined') {
    Object.keys(ENGLISH_COURSE_DATA).forEach(grade => {
        const gradeData = ENGLISH_COURSE_DATA[grade];
        if (gradeData && gradeData.topics) {
            COURSE_DATA.push({
                title: `English Grade ${grade}`,
                subject: "english",
                class: grade,
                lessons: gradeData.topics.map(t => ({
                    id: t.id,
                    title: t.title,
                    questionType: `english-${grade}`,
                    vocabulary: t.vocab.map(v => ({ word: v.word, ipa: v.phonetics, meaning: v.translation, sentence: v.sentence, sentenceTranslation: v.sentenceTranslation })),
                    sentencePatterns: t.sentencePatterns.map(p => ({ pattern: p.english, meaning: p.vietnamese })),
                    grammar: { title: "Grammar Lab", rule: t.grammar, example: "" },
                    videos: t.videos || [],
                    readingPassage: t.readingPassage || "",
                    readingPassageTitle: t.readingPassageTitle || "",
                    questions: t.questions || {}
                }))
            });
        }
    });
}

function getLessonById(lessonId) {
    for (const chapter of COURSE_DATA) {
        const lesson = chapter.lessons.find(l => l.id === lessonId);
        if (lesson) return { ...lesson, chapterTitle: chapter.title };
    }
    return null;
}

function populateSubtopics() {
    COURSE_DATA.forEach(chapter => {
        const subject = chapter.subject || "math";
        chapter.lessons.forEach(lesson => {
            const isExamOrReview = lesson.questionType.startsWith("cuoi-chuong") || 
                                   lesson.questionType.startsWith("luyen-tap-chung") || 
                                   lesson.questionType.startsWith("english-review") ||
                                   lesson.id.startsWith("kt-") ||
                                   lesson.id.includes("-review");
            if (isExamOrReview) {
                lesson.subtopics = [];
                return;
            }

            if (lesson.subtopics && lesson.subtopics.length > 0) {
                return;
            }

            const titleWord = lesson.title.split(': ')[1] || lesson.title;
            if (subject === "english") {
                // Sinh subtopics cho môn Tiếng Anh đột phá 3 kỹ năng chính
                const defaultVid = (lesson.videos && lesson.videos.length > 0) ? lesson.videos[0].id : "";
                lesson.subtopics = [
                    {
                        id: `${lesson.id}-d1`,
                        title: `Dạng 1: Listening Arena - Luyện nghe từ vựng`,
                        methodology: `<h4>Phương pháp rèn luyện Nghe</h4><p>Học sinh nhấn vào các biểu tượng từ vựng để lắng nghe cách phát âm chuẩn bản xứ, sau đó tham gia các bài thử thách Nghe và chọn tranh tương ứng.</p>`,
                        example: `<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Nghe âm đọc 'book' và chọn đúng cuốn sách trong số các đáp án hiển thị.</p></div>`,
                        questionType: lesson.questionType,
                        level: "co-ban",
                        youtubeId: defaultVid
                    },
                    {
                        id: `${lesson.id}-d2`,
                        title: `Dạng 2: Speaking Altar - Đọc to câu thần chú`,
                        methodology: `<h4>Phương pháp rèn luyện Nói</h4><p>Hãy nghe giọng đọc mẫu của hệ thống, nhấn nút Micro và đọc to rõ ràng từ vựng/mẫu câu hiển thị để kích hoạt phép thuật diệt quái vật.</p>`,
                        example: `<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lắng nghe máy đọc 'I write a book' và nhấn Micro đọc lại thật chuẩn xác.</p></div>`,
                        questionType: lesson.questionType,
                        level: "nang-cao",
                        youtubeId: defaultVid
                    },
                    {
                        id: `${lesson.id}-d3`,
                        title: `Dạng 3: Reading & Writing Quest - Đọc hiểu & Viết từ`,
                        methodology: `<h4>Phương pháp rèn luyện Đọc & Viết</h4><p>Học sinh đọc đoạn văn chỉ dẫn hoặc gõ chính xác các chữ cái còn thiếu của từ vựng bay trên quái vật để bảo vệ lâu đài.</p>`,
                        example: `<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Nhìn từ khuyết 'b_ll' và gõ chữ 'a' để tháp bắn đạn tiêu diệt quái.</p></div>`,
                        questionType: lesson.questionType,
                        level: "kho",
                        youtubeId: defaultVid
                    }
                ];
            } else {
                // Sinh 3 dạng bài môn Toán như cũ
                lesson.subtopics = [
                    {
                        id: `${lesson.id}-d1`,
                        title: `Dạng 1: Kiến thức cơ bản về ${titleWord}`,
                        methodology: `<h4>Phương pháp giải (Cơ bản)</h4><p>Nắm vững các định nghĩa, khái niệm và công thức cốt lõi liên quan đến: <b>${titleWord}</b>.</p><p>Học sinh hãy xem kỹ tóm tắt lý thuyết SGK bên dưới để ghi nhớ các quy tắc nhận biết cơ bản.</p>`,
                        example: `<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Áp dụng trực tiếp định nghĩa và công thức cơ bản trong sách giáo khoa để giải quyết dạng toán nhận biết.</p></div>`,
                        questionType: lesson.questionType,
                        level: "co-ban",
                        youtubeId: SUBTOPIC_VIDEOS[`${lesson.id}-d1`] || ""
                    },
                    {
                        id: `${lesson.id}-d2`,
                        title: `Dạng 2: Thông hiểu & Tính toán về ${titleWord}`,
                        methodology: `<h4>Phương pháp giải (Thông hiểu)</h4><p>Vận dụng các công thức và tính chất toán học để thực hiện tính toán, biến đổi biểu thức hoặc giải bài toán tìm ẩn số của: <b>${titleWord}</b>.</p>`,
                        example: `<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Phân tích dữ kiện bài toán, áp dụng thứ tự thực hiện phép tính hoặc quy tắc biến đổi để giải ra đáp số.</p></div>`,
                        questionType: lesson.questionType,
                        level: "nang-cao",
                        youtubeId: SUBTOPIC_VIDEOS[`${lesson.id}-d2`] || ""
                    },
                    {
                        id: `${lesson.id}-d3`,
                        title: `Dạng 3: Vận dụng cao & Bài toán thực tế về ${titleWord}`,
                        methodology: `<h4>Phương pháp giải (Vận dụng cao)</h4><p>Giải các bài toán đố thực tế có lời văn hoặc các bài toán tư duy phát triển từ kiến thức: <b>${titleWord}</b>.</p><p>Yêu cầu học sinh phân tích đề bài tỉ mỉ và tính toán cẩn thận.</p>`,
                        example: `<h4>Ví dụ minh họa</h4><div class='formula-highlight'><p>Lập biểu thức toán học biểu diễn mối quan hệ thực tế trong đề bài, sau đó thực hiện tính toán để đưa ra kết luận chính xác.</p></div>`,
                        questionType: lesson.questionType,
                        level: "kho",
                        youtubeId: SUBTOPIC_VIDEOS[`${lesson.id}-d3`] || ""
                    }
                ];
            }
        });
    });
}

// Tự động gọi để khởi tạo subtopics cho toàn bộ giáo trình
populateSubtopics();


