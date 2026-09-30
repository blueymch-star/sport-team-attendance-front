/**
 * 國小校隊現場秒點名 - 線上版主控制器 (frontApp.js)
 * 專為手機操場/球館點名設計，具備：
 * 1. 離線可用 (Offline-First, 內建預設名冊與 LocalStorage 快取)
 * 2. 雲端 Google Apps Script (GAS) 雙向即時同步
 * 3. 晨操 (08:00~08:40) / 午訓 (12:40~13:20) 雙時段切換
 * 4. ⚡ 一鍵全員出席、🚫 標記今日無訓練
 */

window.frontApp = {
  currentTeam: 'track', // 'track' | 'volleyball'
  selectedPeriod: 'morning', // 'morning' | 'noon'
  selectedDate: '9/1',
  currentYearMonth: '2026-09',
  searchQuery: '',
  selectedGrade: 'all',
  gasUrl: 'https://script.google.com/macros/s/AKfycbyejfRz1PAHcyfJ6uQNdOcw8xwjMNM1J8dsab_i3b3ak3_nobTyrwvWcUSubfImd6Fb/exec',
  isSyncing: false,

  // 預設備份名冊 (若無雲端連線時使用)
  defaultStudents: {
    "track": [
        {
            "no": 1,
            "name": "王筱雯",
            "class": "6年乙班",
            "grade": "6年",
            "gender": "女"
        },
        {
            "no": 2,
            "name": "柯雨婕",
            "class": "6年丁班",
            "grade": "6年",
            "gender": "女"
        },
        {
            "no": 3,
            "name": "楊昕翰",
            "class": "6年甲班",
            "grade": "6年",
            "gender": "男"
        },
        {
            "no": 4,
            "name": "汪碩澄",
            "class": "6年乙班",
            "grade": "6年",
            "gender": "男"
        },
        {
            "no": 5,
            "name": "陳昱年",
            "class": "6年丁班",
            "grade": "6年",
            "gender": "男"
        },
        {
            "no": 6,
            "name": "柯旻佑",
            "class": "6年丁班",
            "grade": "6年",
            "gender": "男"
        },
        {
            "no": 7,
            "name": "詹元廷",
            "class": "6年戊班",
            "grade": "6年",
            "gender": "男"
        },
        {
            "no": 8,
            "name": "黃婉媃",
            "class": "5年甲班",
            "grade": "5年",
            "gender": "女"
        },
        {
            "no": 9,
            "name": "吳芷媃",
            "class": "5年甲班",
            "grade": "5年",
            "gender": "女"
        },
        {
            "no": 10,
            "name": "張芯僑",
            "class": "5年乙班",
            "grade": "5年",
            "gender": "女"
        },
        {
            "no": 11,
            "name": "蔡妤臻",
            "class": "5年乙班",
            "grade": "5年",
            "gender": "女"
        },
        {
            "no": 12,
            "name": "張云瑄",
            "class": "5年乙班",
            "grade": "5年",
            "gender": "女"
        },
        {
            "no": 13,
            "name": "宋玉玲",
            "class": "5年乙班",
            "grade": "5年",
            "gender": "女"
        },
        {
            "no": 14,
            "name": "張芷柔",
            "class": "5年丙班",
            "grade": "5年",
            "gender": "女"
        },
        {
            "no": 15,
            "name": "吳艾恩",
            "class": "5年丁班",
            "grade": "5年",
            "gender": "女"
        },
        {
            "no": 16,
            "name": "高梓茜",
            "class": "5年丁班",
            "grade": "5年",
            "gender": "女"
        },
        {
            "no": 17,
            "name": "林芷歆",
            "class": "5年乙班",
            "grade": "5年",
            "gender": "女"
        },
        {
            "no": 18,
            "name": "陳劭昆",
            "class": "5年甲班",
            "grade": "5年",
            "gender": "男"
        },
        {
            "no": 19,
            "name": "江昆霖",
            "class": "5年乙班",
            "grade": "5年",
            "gender": "男"
        },
        {
            "no": 20,
            "name": "黃韋辰",
            "class": "5年乙班",
            "grade": "5年",
            "gender": "男"
        },
        {
            "no": 21,
            "name": "陳祤承",
            "class": "5年乙班",
            "grade": "5年",
            "gender": "男"
        },
        {
            "no": 22,
            "name": "蔡沐辰",
            "class": "5年丙班",
            "grade": "5年",
            "gender": "男"
        },
        {
            "no": 23,
            "name": "許書禕",
            "class": "5年丙班",
            "grade": "5年",
            "gender": "男"
        },
        {
            "no": 24,
            "name": "潘仕強",
            "class": "5年丁班",
            "grade": "5年",
            "gender": "男"
        },
        {
            "no": 25,
            "name": "鄧旭呈",
            "class": "5年戊班",
            "grade": "5年",
            "gender": "男"
        },
        {
            "no": 26,
            "name": "呂謹安",
            "class": "5年戊班",
            "grade": "5年",
            "gender": "男"
        }
    ],
    "volleyball": [
        {
            "no": 1,
            "name": "江柏彥",
            "class": "6年乙班",
            "grade": "6年",
            "gender": "男"
        },
        {
            "no": 2,
            "name": "韓宥能",
            "class": "6年乙班",
            "grade": "6年",
            "gender": "男"
        },
        {
            "no": 3,
            "name": "李國詣",
            "class": "6年丁班",
            "grade": "6年",
            "gender": "男"
        },
        {
            "no": 4,
            "name": "陳宥綸",
            "class": "6年戊班",
            "grade": "6年",
            "gender": "男"
        },
        {
            "no": 5,
            "name": "顏羽萱",
            "class": "6年丙班",
            "grade": "6年",
            "gender": "女"
        },
        {
            "no": 6,
            "name": "康凌唯",
            "class": "6年丙班",
            "grade": "6年",
            "gender": "女"
        },
        {
            "no": 7,
            "name": "方楀喬",
            "class": "6年戊班",
            "grade": "6年",
            "gender": "女"
        },
        {
            "no": 8,
            "name": "王裕碩",
            "class": "5年丙班",
            "grade": "5年",
            "gender": "男"
        },
        {
            "no": 9,
            "name": "高伯昇",
            "class": "5年丁班",
            "grade": "5年",
            "gender": "男"
        },
        {
            "no": 10,
            "name": "林昱宏",
            "class": "5年戊班",
            "grade": "5年",
            "gender": "男"
        },
        {
            "no": 11,
            "name": "孫妤芯",
            "class": "5年甲班",
            "grade": "5年",
            "gender": "女"
        },
        {
            "no": 12,
            "name": "蔡珮均",
            "class": "5年乙班",
            "grade": "5年",
            "gender": "女"
        },
        {
            "no": 13,
            "name": "李秉芸",
            "class": "5年乙班",
            "grade": "5年",
            "gender": "女"
        },
        {
            "no": 14,
            "name": "蘇巧臻",
            "class": "5年丙班",
            "grade": "5年",
            "gender": "女"
        },
        {
            "no": 15,
            "name": "洪慧英",
            "class": "5年丁班",
            "grade": "5年",
            "gender": "女"
        },
        {
            "no": 16,
            "name": "張巧霓",
            "class": "5年戊班",
            "grade": "5年",
            "gender": "女"
        },
        {
            "no": 17,
            "name": "姜皓偉",
            "class": "4年甲班",
            "grade": "4年",
            "gender": "男"
        },
        {
            "no": 18,
            "name": "賴奕晟",
            "class": "4年丙班",
            "grade": "4年",
            "gender": "男"
        },
        {
            "no": 19,
            "name": "張庭宇",
            "class": "4年丙班",
            "grade": "4年",
            "gender": "男"
        },
        {
            "no": 20,
            "name": "張定軒",
            "class": "4年丙班",
            "grade": "4年",
            "gender": "男"
        },
        {
            "no": 21,
            "name": "王御翟",
            "class": "4年丁班",
            "grade": "4年",
            "gender": "男"
        },
        {
            "no": 22,
            "name": "徐彥凱",
            "class": "4年丁班",
            "grade": "4年",
            "gender": "男"
        },
        {
            "no": 23,
            "name": "潘家芯",
            "class": "4年丙班",
            "grade": "4年",
            "gender": "女"
        },
        {
            "no": 24,
            "name": "劉欣怡",
            "class": "4年丙班",
            "grade": "4年",
            "gender": "女"
        },
        {
            "no": 25,
            "name": "吳羽睎",
            "class": "4年丁班",
            "grade": "4年",
            "gender": "女"
        }
    ]
},

  defaultMatrices: {"track": {"王筱雯": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "事病假"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "柯雨婕": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "出席", "noon": "出席"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "今日無訓練", "noon": "出席"}}, "楊昕翰": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "無故缺席", "noon": "今日無訓練"}, "9/4": {"morning": "今日無訓練", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "無故缺席"}, "9/8": {"morning": "無故缺席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "無故缺席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "事病假", "noon": "事病假"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "無故缺席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "汪碩澄": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "無故缺席", "noon": "今日無訓練"}, "9/4": {"morning": "事病假", "noon": "事病假"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/21": {"morning": "無故缺席", "noon": "無故缺席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "事病假", "noon": "出席"}}, "陳昱年": {"9/1": {"morning": "無故缺席", "noon": "今日無訓練"}, "9/2": {"morning": "無故缺席", "noon": "今日無訓練"}, "9/4": {"morning": "無故缺席", "noon": "無故缺席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "無故缺席", "noon": "無故缺席"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "無故缺席", "noon": "今日無訓練"}, "9/30": {"morning": "今日無訓練", "noon": "出席"}}, "柯旻佑": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "無故缺席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "事病假", "noon": "出席"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "無故缺席", "noon": "今日無訓練"}, "9/30": {"morning": "今日無訓練", "noon": "出席"}}, "詹元廷": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "事病假"}, "9/7": {"morning": "今日無訓練", "noon": "事病假"}, "9/8": {"morning": "事病假", "noon": "今日無訓練"}, "9/9": {"morning": "事病假", "noon": "今日無訓練"}, "9/10": {"morning": "事病假", "noon": "今日無訓練"}, "9/11": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "出席", "noon": "出席"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/30": {"morning": "今日無訓練", "noon": "出席"}}, "黃婉媃": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "出席", "noon": "出席"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "吳芷媃": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "事病假", "noon": "今日無訓練"}, "9/11": {"morning": "事病假", "noon": "事病假"}, "9/14": {"morning": "事病假", "noon": "今日無訓練"}, "9/15": {"morning": "事病假", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "出席", "noon": "出席"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "張芯僑": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "出席", "noon": "出席"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "蔡妤臻": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "出席", "noon": "事病假"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "事病假", "noon": "出席"}}, "張云瑄": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "出席", "noon": "出席"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "宋玉玲": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/18": {"morning": "出席", "noon": "出席"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "出席"}, "9/30": {"morning": "出席", "noon": "出席"}}, "張芷柔": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "事病假"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "事病假", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "出席", "noon": "出席"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "吳艾恩": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "出席", "noon": "出席"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "高梓茜": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/18": {"morning": "出席", "noon": "出席"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "出席"}, "9/30": {"morning": "出席", "noon": "出席"}}, "林芷歆": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "陳劭昆": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "出席", "noon": "出席"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "江昆霖": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "出席", "noon": "出席"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "黃韋辰": {"9/1": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/2": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/4": {"morning": "今日無訓練", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/9": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/10": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/11": {"morning": "今日無訓練", "noon": "出席"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "出席", "noon": "出席"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/30": {"morning": "今日無訓練", "noon": "出席"}}, "陳祤承": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "出席", "noon": "出席"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "事病假", "noon": "今日無訓練"}, "9/30": {"morning": "事病假", "noon": "出席"}}, "蔡沐辰": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "出席", "noon": "出席"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "許書禕": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "事病假", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "出席", "noon": "出席"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "潘仕強": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "事病假"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "出席", "noon": "出席"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "鄧旭呈": {"9/7": {"morning": "今日無訓練", "noon": "無故缺席"}, "9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/18": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/21": {"morning": "無故缺席", "noon": "無故缺席"}, "9/29": {"morning": "出席", "noon": "出席"}, "9/30": {"morning": "出席", "noon": "出席"}}, "呂謹安": {"9/1": {"morning": "出席", "noon": "今日無訓練"}, "9/2": {"morning": "出席", "noon": "今日無訓練"}, "9/4": {"morning": "出席", "noon": "出席"}, "9/7": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "出席", "noon": "今日無訓練"}, "9/9": {"morning": "出席", "noon": "今日無訓練"}, "9/10": {"morning": "出席", "noon": "今日無訓練"}, "9/11": {"morning": "出席", "noon": "出席"}, "9/14": {"morning": "出席", "noon": "今日無訓練"}, "9/15": {"morning": "出席", "noon": "今日無訓練"}, "9/16": {"morning": "出席", "noon": "今日無訓練"}, "9/18": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/21": {"morning": "出席", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}}, "volleyball": {"江柏彥": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "韓宥能": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "李國詣": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/17": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "陳宥綸": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "顏羽萱": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "事病假"}, "9/15": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/17": {"morning": "今日無訓練", "noon": "事病假"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "康凌唯": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "方楀喬": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "無故缺席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "今日無訓練", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "王裕碩": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "事病假"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "高伯昇": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "林昱宏": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "孫妤芯": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "蔡珮均": {"8/31": {"morning": "今日無訓練", "noon": "事病假"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "李秉芸": {"8/31": {"morning": "今日無訓練", "noon": "事病假"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "事病假"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "事病假"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "事病假"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "蘇巧臻": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "洪慧英": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "張巧霓": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "今日無訓練"}, "9/30": {"morning": "出席", "noon": "出席"}}, "姜皓偉": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "無故缺席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "出席", "noon": "出席"}, "9/30": {"morning": "出席", "noon": "出席"}}, "賴奕晟": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "今日無訓練", "noon": "出席"}, "9/30": {"morning": "出席", "noon": "出席"}}, "張庭宇": {"8/31": {"morning": "今日無訓練", "noon": "事病假"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "無故缺席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "今日無訓練", "noon": "出席"}, "9/30": {"morning": "出席", "noon": "出席"}}, "張定軒": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "今日無訓練", "noon": "出席"}, "9/30": {"morning": "出席", "noon": "出席"}}, "王御翟": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "今日無訓練", "noon": "出席"}, "9/30": {"morning": "出席", "noon": "出席"}}, "徐彥凱": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "今日無訓練", "noon": "出席"}, "9/30": {"morning": "出席", "noon": "出席"}}, "潘家芯": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "今日無訓練", "noon": "出席"}, "9/30": {"morning": "出席", "noon": "出席"}}, "劉欣怡": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "出席"}, "9/3": {"morning": "今日無訓練", "noon": "出席"}, "9/8": {"morning": "今日無訓練", "noon": "出席"}, "9/10": {"morning": "今日無訓練", "noon": "出席"}, "9/15": {"morning": "今日無訓練", "noon": "出席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "今日無訓練", "noon": "出席"}, "9/30": {"morning": "出席", "noon": "出席"}}, "吳羽睎": {"8/31": {"morning": "今日無訓練", "noon": "出席"}, "9/1": {"morning": "今日無訓練", "noon": "事病假"}, "9/3": {"morning": "今日無訓練", "noon": "無故缺席"}, "9/8": {"morning": "今日無訓練", "noon": "無故缺席"}, "9/10": {"morning": "今日無訓練", "noon": "無故缺席"}, "9/15": {"morning": "今日無訓練", "noon": "無故缺席"}, "9/17": {"morning": "今日無訓練", "noon": "出席"}, "9/29": {"morning": "今日無訓練", "noon": "出席"}, "9/30": {"morning": "出席", "noon": "出席"}}}},

  defaultDates: {
    track: ['9/1', '9/2', '9/4', '9/7', '9/8', '9/9', '9/10', '9/11', '9/14', '9/15', '9/16', '9/18', '9/21', '9/29', '9/30'],
    volleyball: ['8/31', '9/1', '9/3', '9/8', '9/10', '9/15', '9/17', '9/29', '9/30']
  },

  init() {
    // 自動升級名冊快取版本 (清理舊快取，載入真實學校代表隊名冊)
    const ROSTER_CACHE_VER = '2026_09_30_real_roster_v6';
    if (localStorage.getItem('roster_cache_version') !== ROSTER_CACHE_VER) {
      localStorage.removeItem('students_track');
      localStorage.removeItem('students_volleyball');
      localStorage.removeItem('attendance_matrix_track_2026-09');
      localStorage.removeItem('attendance_matrix_volleyball_2026-09');
      localStorage.setItem('roster_cache_version', ROSTER_CACHE_VER);
    }

    this.gasUrl = localStorage.getItem('elementary_sports_gas_url') || 'https://script.google.com/macros/s/AKfycbyejfRz1PAHcyfJ6uQNdOcw8xwjMNM1J8dsab_i3b3ak3_nobTyrwvWcUSubfImd6Fb/exec';
    const savedTeam = localStorage.getItem('last_active_team');
    if (savedTeam && (savedTeam === 'track' || savedTeam === 'volleyball')) {
      this.currentTeam = savedTeam;
    }

    const dates = this.getTrainingDates(this.currentTeam);
    this.selectedDate = dates.length > 0 ? dates[0] : '9/1';

    this.renderTabs();
    this.renderPeriod();
    this.renderDates();
    this.renderGradeFilter();
    this.renderStudents();
    this.updateStats();

    // 背景嘗試與雲端同步
    if (this.gasUrl) {
      this.syncWithCloud(true);
    }
  },

  filterCleanStudents(teamId, list) {
    if (!Array.isArray(list)) return [];
    if (teamId === 'track') {
      const removed = new Set(['林筠珊', '韓宥能', '許文豪', '顏羽萱', '康凌唯', '方楀喬']);
      let seenDeng = false;
      return list.filter(s => {
        if (!s || !s.name) return false;
        const name = s.name.trim();
        if (removed.has(name)) return false;
        if (name === '鄧旭呈' || name === '鄭旭呈') {
          if (seenDeng) return false;
          seenDeng = true;
          s.name = '鄧旭呈';
          s.class = '5年戊班';
        }
        return true;
      }).map((s, idx) => ({ ...s, no: idx + 1 }));
    } else if (teamId === 'volleyball') {
      return list.filter(s => s && s.name && s.name.trim() !== '蔡昀芯')
                 .map((s, idx) => ({ ...s, no: idx + 1 }));
    }
    return list;
  },

  getStudents(teamId = this.currentTeam) {
    const key = `students_${teamId}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return this.filterCleanStudents(teamId, parsed);
        }
      }
    } catch (e) {}
    return this.filterCleanStudents(teamId, this.defaultStudents[teamId] || []);
  },

  saveStudents(teamId, students) {
    const cleaned = this.filterCleanStudents(teamId, students);
    localStorage.setItem(`students_${teamId}`, JSON.stringify(cleaned));
  },

  getTrainingDates(teamId = this.currentTeam) {
    const key = `training_dates_${teamId}_${this.currentYearMonth}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return this.defaultDates[teamId] || ['9/1'];
  },

  saveTrainingDates(teamId, dates) {
    localStorage.setItem(`training_dates_${teamId}_${this.currentYearMonth}`, JSON.stringify(dates));
  },

  getMatrix(teamId = this.currentTeam) {
    const key = `attendance_matrix_${teamId}_${this.currentYearMonth}`;
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    if (this.currentYearMonth === '2026-09') {
      try {
        const fallback9m = localStorage.getItem(`attendance_matrix_${teamId}_9m`);
        if (fallback9m) return JSON.parse(fallback9m);
      } catch (e) {}
      if (this.defaultMatrices && this.defaultMatrices[teamId]) {
        return JSON.parse(JSON.stringify(this.defaultMatrices[teamId]));
      }
    }
    return {};
  },

  saveMatrix(teamId, matrix) {
    const key = `attendance_matrix_${teamId}_${this.currentYearMonth}`;
    localStorage.setItem(key, JSON.stringify(matrix));
    if (this.currentYearMonth === '2026-09') {
      localStorage.setItem(`attendance_matrix_${teamId}_9m`, JSON.stringify(matrix));
    }
  },

  getStatus(matrix, studentName, date, period) {
    if (matrix && matrix[studentName] && matrix[studentName][date]) {
      const cell = matrix[studentName][date];
      if (typeof cell === 'object' && cell !== null && cell[period]) {
        return cell[period];
      }
      if (typeof cell === 'string') return cell;
    }
    if (date === '9/29') return '今日無訓練';
    return '出席';
  },

  setStatus(matrix, studentName, date, period, status) {
    if (!matrix[studentName]) matrix[studentName] = {};
    const cell = matrix[studentName][date];
    if (typeof cell !== 'object' || cell === null) {
      const fb = (typeof cell === 'string') ? cell : '出席';
      matrix[studentName][date] = { morning: fb, noon: fb };
    }
    matrix[studentName][date][period] = status;
  },

  getAbsenceCount(matrix, studentName, dates) {
    if (!matrix || !matrix[studentName]) return 0;
    let count = 0;
    dates.forEach(d => {
      const cell = matrix[studentName][d];
      if (typeof cell === 'object' && cell !== null) {
        if (cell.morning === '無故缺席') count++;
        if (cell.noon === '無故缺席') count++;
      } else if (cell === '無故缺席') {
        count += 2;
      }
    });
    return count;
  },

  // ----------------- UI 渲染 -----------------

  renderTabs() {
    const isTrack = this.currentTeam === 'track';
    const tabTrack = document.getElementById('tab-track');
    const tabVb = document.getElementById('tab-volleyball');

    if (tabTrack && tabVb) {
      if (isTrack) {
        tabTrack.className = 'py-2.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition bg-blue-600 text-white shadow-sm';
        tabVb.className = 'py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2 transition';
      } else {
        tabTrack.className = 'py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:text-slate-900 flex items-center justify-center gap-2 transition';
        tabVb.className = 'py-2.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition bg-amber-600 text-white shadow-sm';
      }
    }
  },

  renderPeriod() {
    const isMorning = this.selectedPeriod === 'morning';
    const btnM = document.getElementById('period-morning');
    const btnN = document.getElementById('period-noon');

    if (btnM && btnN) {
      if (isMorning) {
        btnM.className = 'flex-1 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition bg-amber-500 text-white shadow-xs';
        btnN.className = 'flex-1 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 transition';
      } else {
        btnM.className = 'flex-1 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center justify-center gap-1.5 transition';
        btnN.className = 'flex-1 py-2 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition bg-indigo-600 text-white shadow-xs';
      }
    }
  },

  renderDates() {
    const container = document.getElementById('date-strip-container');
    if (!container) return;
    const dates = this.getTrainingDates(this.currentTeam);

    if (!dates.includes(this.selectedDate)) {
      this.selectedDate = dates.length > 0 ? dates[0] : '9/1';
    }

    container.innerHTML = dates.map(d => {
      const isSelected = d === this.selectedDate;
      return `
        <button onclick="window.frontApp.switchDate('${d}')" class="shrink-0 px-3.5 py-1.5 rounded-xl text-center font-bold text-xs transition border ${
          isSelected 
            ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-300' 
            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
        }">
          <div class="text-[9px] font-normal opacity-75">${this.getDateWeekday(d)}</div>
          <div class="text-xs font-black">${d}</div>
        </button>
      `;
    }).join('');
  },

  renderGradeFilter() {
    const container = document.getElementById('grade-filter-pills');
    if (!container) return;
    const grades = [
      { key: 'all', label: '全部' },
      { key: '3年', label: '3年' },
      { key: '4年', label: '4年' },
      { key: '5年', label: '5年' },
      { key: '6年', label: '6年' }
    ];

    container.innerHTML = grades.map(g => `
      <button onclick="window.frontApp.filterGrade('${g.key}')" class="px-2 py-1 rounded-lg text-[11px] font-bold transition shrink-0 ${
        this.selectedGrade === g.key ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }">
        ${g.label}
      </button>
    `).join('');
  },

  renderStudents() {
    const container = document.getElementById('students-card-list');
    if (!container) return;

    let students = this.getStudents(this.currentTeam);
    const matrix = this.getMatrix(this.currentTeam);
    const dates = this.getTrainingDates(this.currentTeam);
    const curDate = this.selectedDate;
    const curPeriod = this.selectedPeriod;
    const otherPeriod = curPeriod === 'morning' ? 'noon' : 'morning';
    const otherPeriodName = curPeriod === 'morning' ? '午訓' : '晨操';

    if (this.selectedGrade !== 'all') {
      students = students.filter(s => s.grade === this.selectedGrade || s.class.includes(this.selectedGrade));
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      students = students.filter(s => s.name.toLowerCase().includes(q) || s.class.toLowerCase().includes(q));
    }

    if (students.length === 0) {
      container.innerHTML = `
        <div class="bg-white rounded-2xl p-8 text-center text-slate-400 border border-slate-200">
          <span class="text-3xl block mb-1">🔍</span>
          <p class="font-bold text-xs">無符合條件的隊員</p>
        </div>
      `;
      return;
    }

    container.innerHTML = students.map((s, idx) => {
      const currentStatus = this.getStatus(matrix, s.name, curDate, curPeriod);
      const otherStatus = this.getStatus(matrix, s.name, curDate, otherPeriod);
      const absenceCount = this.getAbsenceCount(matrix, s.name, dates);
      const isWarning = absenceCount >= 3;

      return `
        <div class="bg-white rounded-2xl p-3 border ${currentStatus === '無故缺席' ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'} shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div class="flex items-center space-x-2.5">
            <div class="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-500 shrink-0">
              ${s.no || (idx + 1)}
            </div>
            <div>
              <div class="flex items-center space-x-1.5">
                <span class="text-base font-black text-slate-900">${s.name}</span>
                <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  ${s.class}
                </span>
                <span class="text-[11px] ${s.gender === '男' ? 'text-blue-500' : 'text-pink-500'} font-bold">
                  ${s.gender || ''}
                </span>
                ${isWarning ? `
                  <span class="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                    ⚠️ 缺席 ${absenceCount} 次
                  </span>
                ` : ''}
              </div>
              <div class="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                <span>當前：<b class="text-slate-700">${curDate} ${curPeriod === 'morning' ? '晨操' : '午訓'}</b></span>
                <span>·</span>
                <span>${otherPeriodName}：<b class="${this.getStatusTextColor(otherStatus)}">${otherStatus}</b></span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-4 gap-1 sm:w-72 shrink-0">
            <button onclick="window.frontApp.updateStatus('${s.name}', '出席')" class="py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 active:scale-95 ${
              currentStatus === '出席'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-300'
                : 'bg-slate-50 hover:bg-emerald-50 text-slate-700 border-slate-200'
            }">
              <span class="text-xs">🟢</span>
              <span>出席</span>
            </button>

            <button onclick="window.frontApp.updateStatus('${s.name}', '事病假')" class="py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 active:scale-95 ${
              currentStatus === '事病假'
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs ring-2 ring-amber-300'
                : 'bg-slate-50 hover:bg-amber-50 text-slate-700 border-slate-200'
            }">
              <span class="text-xs">🟡</span>
              <span>請假</span>
            </button>

            <button onclick="window.frontApp.updateStatus('${s.name}', '無故缺席')" class="py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 active:scale-95 ${
              currentStatus === '無故缺席'
                ? 'bg-rose-600 text-white border-rose-600 shadow-xs ring-2 ring-rose-300'
                : 'bg-slate-50 hover:bg-rose-50 text-slate-700 border-slate-200'
            }">
              <span class="text-xs">🔴</span>
              <span>缺席</span>
            </button>

            <button onclick="window.frontApp.updateStatus('${s.name}', '今日無訓練')" class="py-2 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1 active:scale-95 ${
              currentStatus === '今日無訓練'
                ? 'bg-slate-600 text-white border-slate-600 shadow-xs ring-2 ring-slate-300'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200'
            }">
              <span class="text-xs">⚪</span>
              <span class="text-[10px]">無訓練</span>
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  updateStats() {
    const students = this.getStudents(this.currentTeam);
    const matrix = this.getMatrix(this.currentTeam);
    const curDate = this.selectedDate;
    const curPeriod = this.selectedPeriod;

    let present = 0, leave = 0, absent = 0, notrain = 0;

    students.forEach(s => {
      const st = this.getStatus(matrix, s.name, curDate, curPeriod);
      if (st === '出席') present++;
      else if (st === '事病假') leave++;
      else if (st === '無故缺席') absent++;
      else if (st === '今日無訓練') notrain++;
      else present++;
    });

    const elP = document.getElementById('stat-present');
    const elL = document.getElementById('stat-leave');
    const elA = document.getElementById('stat-absent');
    const elN = document.getElementById('stat-notrain');

    if (elP) elP.textContent = present;
    if (elL) elL.textContent = leave;
    if (elA) elA.textContent = absent;
    if (elN) elN.textContent = notrain;
  },

  // ----------------- 互動操作 -----------------

  switchTeam(teamId) {
    this.currentTeam = teamId;
    localStorage.setItem('last_active_team', teamId);
    const dates = this.getTrainingDates(teamId);
    if (!dates.includes(this.selectedDate)) {
      this.selectedDate = dates.length > 0 ? dates[0] : '9/1';
    }
    this.renderTabs();
    this.renderDates();
    this.renderStudents();
    this.updateStats();

    if (this.gasUrl) {
      this.syncWithCloud(true);
    }
  },

  switchPeriod(period) {
    this.selectedPeriod = period;
    this.renderPeriod();
    this.renderStudents();
    this.updateStats();
  },

  switchDate(date) {
    this.selectedDate = date;
    this.renderDates();
    this.renderStudents();
    this.updateStats();
  },

  onSearch(val) {
    this.searchQuery = val;
    this.renderStudents();
  },

  filterGrade(grade) {
    this.selectedGrade = grade;
    this.renderGradeFilter();
    this.renderStudents();
  },

  updateStatus(studentName, status) {
    const matrix = this.getMatrix(this.currentTeam);
    this.setStatus(matrix, studentName, this.selectedDate, this.selectedPeriod, status);
    this.saveMatrix(this.currentTeam, matrix);

    this.renderStudents();
    this.updateStats();

    // 觸發背景非阻塞同步至 Google 試算表
    this.pushRecordToGas({ [studentName]: status });
  },

  markAllPresent() {
    const students = this.getStudents(this.currentTeam);
    const matrix = this.getMatrix(this.currentTeam);
    const records = {};

    students.forEach(s => {
      this.setStatus(matrix, s.name, this.selectedDate, this.selectedPeriod, '出席');
      records[s.name] = '出席';
    });

    this.saveMatrix(this.currentTeam, matrix);
    this.renderStudents();
    this.updateStats();

    this.pushRecordToGas(records);
  },

  markAllNoTraining() {
    const students = this.getStudents(this.currentTeam);
    const matrix = this.getMatrix(this.currentTeam);
    const records = {};

    students.forEach(s => {
      this.setStatus(matrix, s.name, this.selectedDate, this.selectedPeriod, '今日無訓練');
      records[s.name] = '今日無訓練';
    });

    this.saveMatrix(this.currentTeam, matrix);
    this.renderStudents();
    this.updateStats();

    this.pushRecordToGas(records);
  },

  // ----------------- 雲端 Google Apps Script 同步 -----------------

  async syncWithCloud(silent = false) {
    if (!this.gasUrl) {
      if (!silent) alert('尚未設定 Google Apps Script Web App 網址！\n請點擊右上角 ⚙️ 進行設定。');
      return;
    }

    this.setSyncingState(true, '同步中...');

    try {
      // 1. 從 GAS 拉取最新資料 (隊員、矩陣、訓練日)
      const url = `${this.gasUrl}?action=getAll&team=${this.currentTeam}&ym=${this.currentYearMonth}`;
      const res = await fetch(url);
      const json = await res.json();

      if (json && json.success) {
        if (json.students && json.students.length > 0) {
          this.saveStudents(this.currentTeam, json.students);
        }
        if (json.matrix && Object.keys(json.matrix).length > 0) {
          // 合併本機與雲端矩陣 (以最新為準)
          const localMatrix = this.getMatrix(this.currentTeam);
          const merged = Object.assign({}, localMatrix, json.matrix);
          this.saveMatrix(this.currentTeam, merged);
        }
        if (json.dates && json.dates.length > 0) {
          this.saveTrainingDates(this.currentTeam, json.dates);
        }

        this.renderDates();
        this.renderStudents();
        this.updateStats();
        this.setSyncingState(false, '雲端已同步');
        if (!silent) alert('🎉 已成功從 Google 試算表拉取最新名冊與點名資料！');
      } else {
        throw new Error(json.error || '連線錯誤');
      }
    } catch (e) {
      console.warn('雲端同步失敗，已轉為本地離線模式：', e);
      this.setSyncingState(false, '離線儲存');
      if (!silent) alert('無法連線至 Google 試算表，資料已安全保存在手機 LocalStorage！\n請檢查網路或 GAS 部署權限是否設為「所有人」。');
    }
  },

  async pushRecordToGas(records) {
    if (!this.gasUrl) return;

    this.setSyncingState(true, '傳送中...');

    const payload = {
      action: 'saveAttendance',
      team: this.currentTeam,
      ym: this.currentYearMonth,
      date: this.selectedDate,
      period: this.selectedPeriod,
      records: records
    };

    try {
      await fetch(this.gasUrl, {
        method: 'POST',
        mode: 'no-cors', // 避開 GAS CORS 重定向問題
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      this.setSyncingState(false, '已上傳雲端');
    } catch (e) {
      console.warn('回傳 GAS 失敗，已暫存於手機 LocalStorage：', e);
      this.setSyncingState(false, '本地暫存');
    }
  },

  setSyncingState(isSyncing, text) {
    this.isSyncing = isSyncing;
    const syncText = document.getElementById('sync-text');
    const syncIcon = document.getElementById('sync-icon');
    const footerStatus = document.getElementById('footer-sync-status');
    const footerPulse = document.getElementById('footer-pulse');

    if (syncText) syncText.textContent = text;
    if (syncIcon) syncIcon.textContent = isSyncing ? '⏳' : '☁️';
    if (footerStatus) footerStatus.textContent = `${text} · ${this.currentTeam === 'track' ? '田徑隊' : '排球隊'}`;
    if (footerPulse) {
      footerPulse.className = isSyncing ? 'w-2 h-2 rounded-full bg-amber-400 animate-ping' : 'w-2 h-2 rounded-full bg-emerald-400 animate-pulse';
    }
  },

  openConfigModal() {
    const modal = document.getElementById('config-modal');
    const input = document.getElementById('input-gas-url');
    if (input) input.value = this.gasUrl;
    if (modal) modal.classList.remove('hidden');
  },

  closeConfigModal() {
    const modal = document.getElementById('config-modal');
    if (modal) modal.classList.add('hidden');
  },

  saveConfig() {
    const input = document.getElementById('input-gas-url');
    if (input) {
      this.gasUrl = input.value.trim();
      localStorage.setItem('elementary_sports_gas_url', this.gasUrl);
      this.closeConfigModal();
      if (this.gasUrl) {
        this.syncWithCloud(false);
      } else {
        alert('已清除雲端網址，切換為「手機本地離線模式」！');
      }
    }
  },

  async testGasConnection() {
    const input = document.getElementById('input-gas-url');
    const url = input ? input.value.trim() : '';
    if (!url) {
      alert('請先輸入 Google Apps Script 網址！');
      return;
    }
    try {
      const res = await fetch(`${url}?action=ping`);
      const json = await res.json();
      if (json && json.success) {
        alert(`✅ 連線成功！\n試算表名稱：${json.spreadsheetName || '已連線'}`);
      } else {
        alert('⚠️ 連線異常：' + (json.error || '未返回預期格式'));
      }
    } catch (e) {
      alert('❌ 無法連線至該網址！\n請檢查：\n1. 部署時「誰可以存取」是否選為「所有人 (Anyone)」？\n2. 網址結尾是否為 /exec？\n錯誤訊息：' + e.message);
    }
  },

  // ----------------- 輔助函式 -----------------

  getDateWeekday(dateStr) {
    try {
      const parts = dateStr.split('/');
      const m = parseInt(parts[0], 10);
      const d = parseInt(parts[1], 10);
      const year = 2026;
      const dateObj = new Date(year, m - 1, d);
      const days = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];
      return days[dateObj.getDay()] || '';
    } catch (e) {
      return '';
    }
  },

  getStatusTextColor(st) {
    if (st === '事病假') return 'text-amber-600 font-bold';
    if (st === '無故缺席') return 'text-rose-600 font-bold';
    if (st === '今日無訓練') return 'text-slate-400';
    return 'text-emerald-600 font-bold';
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.frontApp.init();
});
