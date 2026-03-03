// State
const state = {
    recipientName: '',
    eventType: '',
    customEventName: '',
    customEventEmoji: '🎉',
    customHobbies: '',
    relationType: 'friend',
    messageTone: 'balanced',
    selectedHobbies: [],
    userMessage: '',
    designPreference: '',
    generatedMessage: '',
    yearsTogether: '',
    photoData: null,
    isSpouse: false
};

const DRAFT_STORAGE_KEY = 'soulvest_card_draft_v1';
const MESSAGE_HISTORY_KEY = 'soulvest_message_history_v1';
const AI_ENDPOINT_STORAGE_KEY = 'soulvest_ai_base_url_v1';

// Message templates for each event
const messageTemplates = {
    birthday: [
        `Happy Birthday, {name}! 🎉 May your special day be filled with {hobbies_adjective} moments and unforgettable memories. Here's to another year of adventures!`,
        `Dear {name}, Wishing you the happiest of birthdays! May this year bring you endless {hobbies_adjective} experiences and all the joy your heart can hold. Celebrate yourself! 🎂`,
        `{name}, it's your special day! 🎈 I know how much you love {hobbies_list}. Make this birthday absolutely {hobbies_adjective}. Have the most wonderful time!`,
        `To {name} on your birthday - may your day be as {hobbies_adjective} as you are! Here's to making more incredible memories. Happy Birthday! 🎁`,
        `Happy Birthday, {name}! 🌟 Celebrating you and all the {hobbies_adjective} moments we share. Wishing you a year full of joy and unforgettable adventures!`
    ],
    award: [
        `Congratulations, {name}! 🏅 Winning {event_name} is a proud milestone. Wishing you many more {hobbies_adjective} achievements ahead!`,
        `{name}, what an amazing achievement! 🎉 You truly deserve {event_name}. Keep shining and inspiring everyone around you!`,
        `Big congratulations, {name}! 🌟 {event_name} is proof of your hard work and talent. Wishing you even more success!`,
        `So proud of you, {name}! 🏆 On your {event_name}, may this moment open doors to bigger dreams and {hobbies_adjective} wins.`,
        `Dear {name}, heartfelt wishes on {event_name}! ✨ Your dedication has paid off beautifully. Celebrate this special moment!`
    ],
    anniversary: [
        `To {name}, our amazing partner for {years} beautiful years! 💕 Here's to a lifetime of {hobbies_adjective} moments, endless love, and countless memories. Happy Anniversary!`,
        `{years} years of love, laughter, and {hobbies_adjective} adventures together! 🎉 {name}, thank you for making every moment special. Happy Anniversary!`,
        `Happy Anniversary, {name}! 💑 {years} years ago, we chose each other, and every day since has been {hobbies_adjective}. Here's to forever!`,
        `Celebrating {years} years with you, {name}! 💖 Every moment - whether {hobbies_list} or just being together - is precious. Happy Anniversary!`,
        `{years} years, countless {hobbies_adjective} memories, and a love that grows stronger every day. {name}, you're my forever. Happy Anniversary! ❤️`
    ],
    anniversaryFriend: [
        `Wishing you both a wonderful {years} years of marriage, {name}! 💑 May your love story continue to be filled with {hobbies_adjective} moments and endless happiness. Happy Anniversary!`,
        `{years} beautiful years together! 🎉 {name}, here's to celebrating your amazing journey with your spouse. Wishing you both all the {hobbies_adjective} adventures ahead!`,
        `Happy Anniversary, {name}! 💕 {years} years of love and laughter - what a beautiful milestone! Wishing you both continued joy and {hobbies_adjective} memories together!`,
        `Celebrating {years} years of your beautiful marriage, {name}! 💖 May your bond continue to grow stronger with each {hobbies_adjective} moment you share!`,
        `{years} years and still going strong! 🌟 {name}, wishing you and your spouse many more {hobbies_adjective} years of love, laughter, and beautiful memories together!`
    ],
    wedding: [
        `{name}, as you begin this new chapter! 💍 May your marriage be filled with {hobbies_adjective} adventures, endless laughter, and unconditional love. Congratulations!`,
        `Wishing you both a lifetime of {hobbies_adjective} moments and beautiful memories as husband and wife! 💕 May your love story be magical. Congratulations!`,
        `To the happy couple! 🎉 May your marriage be as {hobbies_adjective} as your love, with adventures in {hobbies_list} and beyond. Wishing you all the happiness!`,
        `Dear {name}, congratulations on your wedding! 💒 Here's to a lifetime together filled with {hobbies_adjective} experiences and endless love. Best wishes!`,
        `{name}, what a joy to celebrate your wedding! 💐 May your marriage be filled with {hobbies_adjective} surprises, deep love, and beautiful moments!`
    ],
    graduation: [
        `Congratulations, {name}! 🎓 You did it! Your dedication inspires us all. Here's to a future filled with {hobbies_adjective} achievements and incredible opportunities!`,
        `{name}, you've worked so hard! 🏆 As you embark on your next adventure, may it be as {hobbies_adjective} and successful as you are. Congratulations!`,
        `Dear {name}, graduation day is here! 🎉 Your bright future is just beginning. Wishing you success, happiness, and {hobbies_adjective} journeys ahead!`,
        `To the graduate, {name}! 📚 You've shown incredible {hobbies_adjective} spirit and determination. The world is ready for your amazing contributions!`,
        `{name}, what an achievement! 🌟 Here's to this milestone and all the {hobbies_adjective} adventures ahead. Congratulations, graduate!`
    ],
    newjob: [
        `Congratulations on your new job, {name}! 🚀 An exciting new chapter! Wishing you success, growth, and {hobbies_adjective} experiences in this role. You've got this!`,
        `{name}, new job, who dis? 😎 So excited for this amazing opportunity! May your days be filled with {hobbies_adjective} achievements and professional growth. Best wishes!`,
        `Welcome to your new adventure, {name}! 🎯 Your talent and passion will shine bright. Here's to {hobbies_adjective} milestones and incredible success!`,
        `Dear {name}, congratulations on your new job! 🌈 Wishing you every success as you bring your {hobbies_adjective} energy and skills to this role!`,
        `{name}, your new job is lucky to have you! 💼 Here's to an amazing journey filled with growth, {hobbies_adjective} accomplishments, and well-deserved success!`
    ],
    housewarming: [
        `Welcome home, {name}! 🏠 May your new space be filled with {hobbies_adjective} memories, laughter, and love. Making countless beautiful moments here!`,
        `{name}, congratulations on your new home! 🔑 Wishing you years of happiness, {hobbies_adjective} gatherings, and cherished memories here. Welcome home!`,
        `What an exciting chapter, {name}! 🏡 May your home be filled with {hobbies_adjective} adventures, warm gatherings, and endless joy. Congratulations!`,
        `To {name} in your new home! 🎉 Here's to creating {hobbies_adjective} memories, hosting wonderful moments, and building a life full of happiness. Welcome!`,
        `{name}, welcome to your sanctuary! ✨ May this home be filled with {hobbies_adjective} experiences, laughter, and the love of family and friends!`
    ],
    promotion: [
        `{name}, you absolutely deserve this! 🎉 Congratulations on your promotion! Here's to more {hobbies_adjective} achievements, greater success, and recognition!`,
        `Congratulations on your promotion, {name}! 🚀 Your hard work and {hobbies_adjective} approach paid off! Wishing you continued success in your new role!`,
        `{name}, so thrilled for you! 🏆 Your promotion is well-deserved. Here's to reaching new heights and experiencing even more {hobbies_adjective} victories!`,
        `Wonderful news about your promotion, {name}! 💼 You've earned this success. Wishing you an amazing journey full of growth and {hobbies_adjective} triumphs!`,
        `{name}, congratulations! ⭐ Your new role is lucky to have someone as talented and {hobbies_adjective} as you. Here's to your continued success!`
    ],
    retirement: [
        `{name}, welcome to this wonderful chapter! 🌅 Retirement is here! May your days be filled with {hobbies_adjective} adventures, relaxation, and all you love. Enjoy!`,
        `Congratulations on your retirement, {name}! 🎊 You've earned this time for {hobbies_adjective} pursuits and beautiful memories. Here's to a life well-lived!`,
        `{name}, time to celebrate YOU! 🏖️ Retirement looks amazing on you. May it be filled with {hobbies_adjective} experiences, peace, and all you deserve!`,
        `Dear {name}, happy retirement! 🌴 You've worked so hard. Now for {hobbies_adjective} adventures and the life you've dreamed of. Enjoy every second!`,
        `{name}, retirement begins! ✨ May your days be as {hobbies_adjective} as you've always hoped. Wishing you health, happiness, and endless joy!`
    ],
    babyshower: [
        `{name}, a bundle of joy is on the way! 👶 May your journey be filled with {hobbies_adjective} moments, unconditional love, and endless blessings!`,
        `Congratulations, {name}! 🎉 How exciting! Here's to a pregnancy and parenting journey filled with {hobbies_adjective} memories and precious moments!`,
        `{name}, how wonderful you're expecting! 💕 May your journey be as {hobbies_adjective} and beautiful as you are. Congratulations on this blessing!`,
        `To {name} on this special occasion! 👼 Wishing you a wonderful pregnancy and a lifetime of {hobbies_adjective} moments with your little one!`,
        `{name}, a baby on the way! 🌈 How thrilling! May you experience {hobbies_adjective} joy, beautiful memories, and all the love parenthood brings!`
    ],
    getwell: [
        `{name}, sending healing thoughts and {hobbies_adjective} vibes! 💙 Wishing you a speedy recovery and {hobbies_list} moments to look forward to. Get well soon!`,
        `Dear {name}, thinking of you. 🌟 May you heal quickly and feel surrounded by love. Here's to better, healthier, {hobbies_adjective} days ahead!`,
        `{name}, wishing you a swift recovery! 💪 Your strength and {hobbies_adjective} spirit will get you through. Looking forward to your smile again!`,
        `Sending healing wishes, {name}! ❤️ Rest and recover well. Soon you'll enjoy all the {hobbies_adjective} things you love. Get well soon!`,
        `{name}, we're rooting for you! 🌻 Wishing you a speedy recovery and a return to health and {hobbies_adjective} happiness. You've got this!`
    ],
    exam: [
        `Best of luck, {name}! 📚 Remember, your hard work and dedication will pay off. Stay positive and give it your best shot!`,
        `Dear {name}, believe in yourself and all that you are. You are capable of amazing things. Wishing you success in your exams! 🌟`,
        `You’ve prepared well, {name}. Now it’s time to shine! Keep calm, stay focused, and do your best. Good luck on your exams! ✨`,
        `{name}, exams are just stepping stones to your dreams. Trust your preparation and go for it! Sending you lots of positive vibes! 💪`,
        `Wishing you all the best, {name}! May your efforts be rewarded and your confidence soar. You’ve got this! 🚀`
    ],
    valentines: [
        `Happy Valentine's Day, {name}! 💘 May your day be filled with love, joy, and {hobbies_adjective} moments together. You are cherished!`,
        `Dear {name}, sending you all my love this Valentine's Day! 💖 Wishing you {hobbies_adjective} adventures and sweet memories.`,
        `To {name}, you make every day special! 🌹 Happy Valentine's Day! May your heart be full of happiness and {hobbies_adjective} experiences.`,
        `Happy Valentine's Day, {name}! 💝 Here's to celebrating love, friendship, and all the {hobbies_adjective} things we share.`,
        `Dear {name}, wishing you a magical Valentine's Day! May it be filled with {hobbies_adjective} surprises and endless affection.`
    ],
    diwali: [
        `Happy Diwali, {name}! 🪔 May your life shine with {hobbies_adjective} joy, prosperity, and beautiful new beginnings.`,
        `{name}, wishing you and your family a bright and blessed Diwali! ✨ May this festival fill your home with happiness and peace.`,
        `May the lights of Diwali bring success, health, and {hobbies_adjective} memories to you, {name}! 🌟`
    ],
    holi: [
        `Happy Holi, {name}! 🎨 May your life be filled with vibrant colors, laughter, and {hobbies_adjective} celebrations.`,
        `{name}, wishing you a joyful Holi full of fun, love, and unforgettable moments with loved ones! 🌈`,
        `Let this Holi paint your year with happiness and success, {name}! Have a colorful and {hobbies_adjective} celebration!`
    ],
    eid: [
        `Eid Mubarak, {name}! 🌙 May this blessed day bring you peace, prosperity, and {hobbies_adjective} happiness.`,
        `{name}, sending warm Eid wishes to you and your family. May your heart be filled with gratitude and joy. ✨`,
        `On this Eid, may Allah bless you with health, love, and {hobbies_adjective} moments, {name}. Eid Mubarak!`
    ],
    christmas: [
        `Merry Christmas, {name}! 🎄 May your holiday season be filled with {hobbies_adjective} joy, love, and warmth.`,
        `{name}, wishing you peace, happiness, and magical moments this Christmas and always! 🎁`,
        `May your Christmas sparkle with laughter, family time, and {hobbies_adjective} memories, {name}!`
    ],
    newyear: [
        `Happy New Year, {name}! 🎉 Wishing you a year full of {hobbies_adjective} opportunities, success, and happiness.`,
        `{name}, may this New Year bring fresh energy, positivity, and wonderful memories with your loved ones. ✨`,
        `Cheers to a bright and {hobbies_adjective} year ahead, {name}! Happy New Year! 🥳`
    ],
    navratri: [
        `Happy Navratri, {name}! 🙏 May Maa Durga bless you with strength, peace, and {hobbies_adjective} joy.`,
        `{name}, wishing you nine nights of devotion, celebration, and divine blessings. Happy Navratri! 🌸`,
        `May this Navratri fill your life with positivity and {hobbies_adjective} energy, {name}!`
    ],
    dussehra: [
        `Happy Dussehra, {name}! 🏹 May good always triumph in your life and bring {hobbies_adjective} success.`,
        `{name}, wishing you courage, happiness, and victory in every step this Dussehra. ✨`,
        `May this Dussehra inspire new beginnings and {hobbies_adjective} moments for you, {name}.`
    ],
    ganeshchaturthi: [
        `Happy Ganesh Chaturthi, {name}! 🐘 May Lord Ganesha remove obstacles and bless you with {hobbies_adjective} prosperity.`,
        `{name}, wishing you and your family joy, wisdom, and abundance this Ganesh Chaturthi! 🙏`,
        `Ganpati Bappa Morya! May your life be filled with happiness and {hobbies_adjective} blessings, {name}.`
    ],
    rakshabandhan: [
        `Happy Raksha Bandhan, {name}! 🎀 Celebrating the beautiful bond of love, trust, and lifelong support.`,
        `{name}, may this Rakhi bring warmth, happiness, and {hobbies_adjective} memories with family.`,
        `Wishing you a joyful Raksha Bandhan filled with love and togetherness, {name}! 💖`
    ],
    janmashtami: [
        `Happy Janmashtami, {name}! 🦚 May Lord Krishna bless you with peace, love, and {hobbies_adjective} joy.`,
        `{name}, wishing you a divine and cheerful Janmashtami filled with devotion and celebration. 🙏`,
        `May this Janmashtami bring harmony, happiness, and {hobbies_adjective} blessings into your life, {name}.`
    ],
    onam: [
        `Happy Onam, {name}! 🌼 May this harvest festival bring abundance, happiness, and {hobbies_adjective} celebrations.`,
        `{name}, wishing you and your family a prosperous Onam filled with joy and togetherness.`,
        `May your Onam be as colorful and {hobbies_adjective} as your dreams, {name}! 🌾`
    ],
    pongal: [
        `Happy Pongal, {name}! 🌾 Wishing you prosperity, health, and {hobbies_adjective} happiness this festive season.`,
        `{name}, may this Pongal bring sweet moments, new hopes, and joyful celebrations with loved ones.`,
        `Wishing you a bright and bountiful Pongal, {name}! ✨`
    ],
    lohri: [
        `Happy Lohri, {name}! 🔥 May this festival fill your life with warmth, joy, and {hobbies_adjective} blessings.`,
        `{name}, wishing you a vibrant Lohri full of celebration, music, and happiness!`,
        `May the Lohri bonfire bring positivity and success to your year, {name}! 🎉`
    ]
};

const customEventTemplates = [
    `Happy {event_name}, {name}! {event_emoji} Wishing you a day filled with {hobbies_adjective} joy and unforgettable moments.`,
    `{name}, sending warm wishes for your {event_name}! {event_emoji} May this occasion bring you {hobbies_adjective} memories and happiness.`,
    `Celebrating {event_name} with you, {name}! {event_emoji} Here's to {hobbies_adjective} moments and all the good things ahead.`,
    `{name}, best wishes on your {event_name}! {event_emoji} Hope your day is full of love, laughter, and {hobbies_adjective} vibes.`,
    `To {name} on your {event_name} {event_emoji} — wishing you a truly {hobbies_adjective} celebration and beautiful memories.`
];

const eventDisplayNames = {
    birthday: 'Birthday',
    award: 'Award Achievement',
    valentines: "Valentine's Day",
    anniversary: 'Wedding Anniversary',
    wedding: 'Wedding',
    graduation: 'Graduation',
    newjob: 'New Job',
    housewarming: 'House Warming',
    promotion: 'Promotion',
    retirement: 'Retirement',
    babyshower: 'Baby Shower',
    getwell: 'Get Well',
    exam: 'Exam Wishes',
    diwali: 'Diwali',
    holi: 'Holi',
    eid: 'Eid',
    christmas: 'Christmas',
    newyear: 'New Year',
    navratri: 'Navratri',
    dussehra: 'Dussehra',
    ganeshchaturthi: 'Ganesh Chaturthi',
    rakshabandhan: 'Raksha Bandhan',
    janmashtami: 'Janmashtami',
    onam: 'Onam',
    pongal: 'Pongal',
    lohri: 'Lohri',
    custom: 'Special Event'
};

const festivalEvents = new Set([
    'diwali', 'holi', 'eid', 'christmas', 'newyear', 'navratri', 'dussehra',
    'ganeshchaturthi', 'rakshabandhan', 'janmashtami', 'onam', 'pongal', 'lohri'
]);

const festivalWarmClosings = {
    diwali: 'Warm wishes to you and your family this Diwali! 🪔',
    holi: 'Warm wishes for a joyful and colorful Holi! 🎨',
    eid: 'Warm wishes for peace and blessings this Eid! 🌙',
    christmas: 'Warm wishes for a merry and peaceful Christmas! 🎄',
    newyear: 'Warm wishes for a bright and successful New Year! 🎆',
    navratri: 'Warm wishes for a blessed Navratri celebration! 🙏',
    dussehra: 'Warm wishes for victory and happiness this Dussehra! 🏹',
    ganeshchaturthi: 'Warm wishes for prosperity and wisdom this Ganesh Chaturthi! 🐘',
    rakshabandhan: 'Warm wishes for love and togetherness this Raksha Bandhan! 🎀',
    janmashtami: 'Warm wishes for peace and joy this Janmashtami! 🦚',
    onam: 'Warm wishes for a prosperous and joyful Onam! 🌼',
    pongal: 'Warm wishes for abundance and happiness this Pongal! 🌾',
    lohri: 'Warm wishes for warmth and celebration this Lohri! 🔥'
};

const festivalImageTheme = {
    diwali: { emoji: '🪔', c1: '#ff9a3c', c2: '#ffcc70' },
    holi: { emoji: '🎨', c1: '#ff6fd8', c2: '#6ec3f4' },
    eid: { emoji: '🌙', c1: '#1d976c', c2: '#93f9b9' },
    christmas: { emoji: '🎄', c1: '#0f9b0f', c2: '#ff512f' },
    newyear: { emoji: '🎆', c1: '#667eea', c2: '#764ba2' },
    navratri: { emoji: '🙏', c1: '#ff9966', c2: '#ff5e62' },
    dussehra: { emoji: '🏹', c1: '#f7971e', c2: '#ffd200' },
    ganeshchaturthi: { emoji: '🐘', c1: '#f12711', c2: '#f5af19' },
    rakshabandhan: { emoji: '🎀', c1: '#f953c6', c2: '#b91d73' },
    janmashtami: { emoji: '🦚', c1: '#4facfe', c2: '#00f2fe' },
    onam: { emoji: '🌼', c1: '#f6d365', c2: '#fda085' },
    pongal: { emoji: '🌾', c1: '#d4fc79', c2: '#96e6a1' },
    lohri: { emoji: '🔥', c1: '#f46b45', c2: '#eea849' }
};

// Hobby descriptors

// Hobby to theme mapping
const hobbyThemes = {
    'Music': {
        gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
        emoji: '🎶',
        tagline: 'Feel the Rhythm',
        overlay: 'musical-notes' // for future SVG/CSS overlay
    },
    'Reading': {
        gradient: 'linear-gradient(135deg, #f5e9da 0%, #e0c3fc 100%)',
        emoji: '📖',
        tagline: 'A New Chapter',
        overlay: 'books' // for future SVG/CSS overlay
    },
    'Cooking': {
        gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
        emoji: '🍕🍫',
        tagline: 'Delicious Moments',
        overlay: 'food' // for future SVG/CSS overlay
    },
    'Travel': {
        gradient: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
        emoji: '✈️',
        tagline: 'Adventure Awaits',
        overlay: 'map' // for future SVG/CSS overlay
    },
    'Sports': {
        gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
        emoji: '🏆⚽',
        tagline: 'Game On!',
        overlay: 'sports' // for future SVG/CSS overlay
    }
    // Add more as needed
};
const hobbiesDescriptors = {
    'Reading': { adjective: 'thoughtful', plural: 'reading and relaxation' },
    'Gaming': { adjective: 'exciting', plural: 'gaming adventures' },
    'Sports': { adjective: 'active', plural: 'sports' },
    'Music': { adjective: 'musical', plural: 'music' },
    'Cooking': { adjective: 'delicious', plural: 'cooking' },
    'Travel': { adjective: 'adventurous', plural: 'travel' },
    'Art': { adjective: 'creative', plural: 'art' },
    'Photography': { adjective: 'picturesque', plural: 'photography' },
    'Fitness': { adjective: 'energetic', plural: 'fitness' },
    'Movies': { adjective: 'entertaining', plural: 'movies' },
    'Writing': { adjective: 'expressive', plural: 'writing' },
    'Meditation': { adjective: 'calm', plural: 'meditation' },
    'Drawing': { adjective: 'artistic', plural: 'drawing' },
    'Yoga': { adjective: 'peaceful', plural: 'yoga' },
    'Motivation': { adjective: 'motivated', plural: 'motivation' },
    'Healthy Eating': { adjective: 'healthy', plural: 'healthy eating' },
    'Sports': { adjective: 'active', plural: 'sports' },
    'Walking': { adjective: 'refreshing', plural: 'walking' },
    'Planning': { adjective: 'organized', plural: 'planning' },
    'Relaxation': { adjective: 'relaxing', plural: 'relaxation' }
};

const defaultDescriptor = { adjective: 'wonderful', plural: 'special moments' };

// Hobbies by event
const hobbyOptions = {
    birthday: ['Reading', 'Gaming', 'Sports', 'Music', 'Cooking', 'Travel', 'Art', 'Photography', 'Fitness', 'Movies', 'Painting', 'Dancing', 'Yoga', 'Hiking', 'Swimming', 'Gardening', 'Crafts', 'Writing', 'Singing', 'Cycling'],
    award: ['Music', 'Dance', 'Sports', 'Public Speaking', 'Leadership', 'Creativity', 'Writing', 'Art', 'Technology', 'Academics', 'Performance', 'Innovation', 'Research', 'Teamwork', 'Discipline'],
    valentines: ['Romantic Dinners', 'Music', 'Art', 'Cooking', 'Travel', 'Photography', 'Dancing', 'Gardening', 'Movies', 'Painting', 'Writing', 'Singing', 'Spa & Wellness', 'Gift Giving', 'Nature Walks', 'Crafts', 'Yoga', 'Meditation', 'Picnics', 'Board Games'],
    anniversary: ['Cooking', 'Travel', 'Music', 'Art', 'Wine Tasting', 'Dancing', 'Gardening', 'Hiking', 'Spa & Wellness', 'Movies', 'Romantic Dinners', 'Photography', 'Beach Walks', 'Painting', 'Yoga', 'Meditation', 'Concerts', 'Singing', 'Museums', 'Book Clubs'],
    wedding: ['Travel', 'Cooking', 'Gardening', 'Wine', 'Art', 'Music', 'Fitness', 'Photography', 'Hiking', 'Spa', 'Beach', 'Camping', 'Yoga', 'Volunteering', 'Dancing', 'Theater', 'Singing', 'Sports', 'Reading', 'Adventure'],
    graduation: ['Career', 'Travel', 'Reading', 'Technology', 'Sports', 'Art', 'Music', 'Volunteering', 'Networking', 'Adventure', 'Entrepreneurship', 'Leadership', 'Innovation', 'Writing', 'Photography', 'Public Speaking', 'Coding', 'Research', 'Teaching'],
    newjob: ['Career', 'Reading', 'Technology', 'Networking', 'Fitness', 'Leadership', 'Innovation', 'Team Building', 'Professional Dev', 'Mentoring', 'Public Speaking', 'Coding', 'Communication', 'Creativity', 'Strategy'],
    housewarming: ['Gardening', 'Cooking', 'Interior Design', 'DIY', 'Entertaining', 'Art', 'Music', 'Fitness', 'Technology', 'Plants', 'Home Decor', 'Hosting', 'Renovation', 'Painting', 'Woodworking', 'Photography', 'Organization'],
    promotion: ['Career', 'Leadership', 'Technology', 'Networking', 'Professional Dev', 'Reading', 'Mentoring', 'Innovation', 'Public Speaking', 'Strategy', 'Management', 'Coaching', 'Team Building', 'Communication'],
    retirement: ['Travel', 'Gardening', 'Reading', 'Cooking', 'Crafts', 'Hiking', 'Volunteer', 'Photography', 'Relaxation', 'Painting', 'Writing', 'Golf', 'Fishing', 'Yoga', 'Meditation', 'Woodworking', 'Museums', 'Beach'],
    babyshower: ['Parenting', 'Family', 'Reading', 'Crafting', 'Photography', 'Cooking', 'Baby Products', 'Child Development', 'Storytelling', 'Music for Kids', 'Singing', 'Art & Crafts', 'Organization', 'Bonding'],
    getwell: ['Reading', 'Movies', 'Music', 'Meditation', 'Cooking', 'Art', 'Nature', 'Relaxation', 'Yoga', 'Gardening', 'Photography', 'Singing', 'Gentle Sports', 'Tea', 'Painting', 'Writing', 'Walks'],
    exam: ['Reading', 'Writing', 'Meditation', 'Music', 'Drawing', 'Yoga', 'Motivation', 'Healthy Eating', 'Sports', 'Walking', 'Planning', 'Relaxation'],
    diwali: ['Family Gatherings', 'Home Decoration', 'Sweets', 'Puja', 'Rangoli', 'Music', 'Festive Shopping', 'Photography', 'Cooking', 'Lighting Diyas'],
    holi: ['Colors', 'Music', 'Dance', 'Sweets', 'Family Gatherings', 'Photography', 'Outdoor Fun', 'Travel', 'Festive Food', 'Celebration'],
    eid: ['Prayer', 'Family Time', 'Charity', 'Festive Food', 'Traditional Wear', 'Photography', 'Community Gatherings', 'Cooking', 'Sweets', 'Travel'],
    christmas: ['Family Time', 'Gifts', 'Decorations', 'Cooking', 'Music', 'Travel', 'Photography', 'Baking', 'Prayer', 'Celebration'],
    newyear: ['Goal Setting', 'Travel', 'Parties', 'Fitness', 'Family Time', 'Music', 'Celebration', 'Planning', 'Photography', 'Self Improvement'],
    navratri: ['Garba', 'Dandiya', 'Devotion', 'Music', 'Traditional Wear', 'Fasting', 'Photography', 'Family Time', 'Dance', 'Celebration'],
    dussehra: ['Tradition', 'Family Gatherings', 'Festive Food', 'Community Events', 'Prayer', 'Celebration', 'Photography', 'Travel', 'Cultural Programs'],
    ganeshchaturthi: ['Puja', 'Modak', 'Family Time', 'Decoration', 'Music', 'Community Gatherings', 'Photography', 'Tradition', 'Art & Crafts'],
    rakshabandhan: ['Family Bonding', 'Gift Giving', 'Sweets', 'Celebration', 'Photography', 'Tradition', 'Cooking', 'Travel'],
    janmashtami: ['Devotion', 'Bhajans', 'Fasting', 'Temple Visit', 'Family Gatherings', 'Festive Food', 'Photography', 'Celebration'],
    onam: ['Pookalam', 'Onam Sadhya', 'Boat Race', 'Family Gatherings', 'Traditional Wear', 'Photography', 'Cooking', 'Dance'],
    pongal: ['Harvest Celebration', 'Traditional Cooking', 'Family Time', 'Decoration', 'Travel', 'Cultural Events', 'Photography'],
    lohri: ['Bonfire', 'Music', 'Dance', 'Festive Food', 'Family Gatherings', 'Celebration', 'Photography', 'Tradition']
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateHobbies();
    applyEventPresetFromUrl();
    initializeDraftFeature();
    renderMessageHistory();
    updateAIConfigStatus();
});

function applyEventPresetFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const presetEvent = (params.get('event') || '').toLowerCase().trim();
    const allowedEvents = new Set([
        'birthday', 'award', 'valentines', 'anniversary', 'wedding', 'graduation', 'newjob',
        'housewarming', 'promotion', 'retirement', 'babyshower', 'getwell', 'exam',
        'diwali', 'holi', 'eid', 'christmas', 'newyear', 'navratri', 'dussehra',
        'ganeshchaturthi', 'rakshabandhan', 'janmashtami', 'onam', 'pongal', 'lohri', 'custom'
    ]);

    if (!allowedEvents.has(presetEvent)) {
        return;
    }

    const eventTypeField = document.getElementById('eventType');
    if (!eventTypeField) {
        return;
    }

    eventTypeField.value = presetEvent;

    if (presetEvent === 'custom') {
        const customEventName = params.get('customEventName') || params.get('eventName') || 'Festival';
        const customEventEmoji = params.get('emoji') || '🎉';

        const customEventNameField = document.getElementById('customEventName');
        if (customEventNameField) {
            customEventNameField.value = customEventName;
        }

        const customEventEmojiField = document.getElementById('customEventEmoji');
        if (customEventEmojiField) {
            customEventEmojiField.value = customEventEmoji;
        }
    }

    updateHobbies();
}

function initializeDraftFeature() {
    const watchedElements = [
        { id: 'recipientName', eventType: 'input' },
        { id: 'eventType', eventType: 'change' },
        { id: 'yearsTogether', eventType: 'input' },
        { id: 'isSpouse', eventType: 'change' },
        { id: 'customEventName', eventType: 'input' },
        { id: 'customEventEmoji', eventType: 'input' },
        { id: 'customHobbies', eventType: 'input' },
        { id: 'relationType', eventType: 'change' },
        { id: 'messageTone', eventType: 'change' },
        { id: 'userMessage', eventType: 'input' },
        { id: 'designPreference', eventType: 'input' }
    ];

    watchedElements.forEach(({ id, eventType }) => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener(eventType, saveDraft);
        }
    });

    updateRestoreDraftButtonState();
}

function saveDraft() {
    try {
        const checkedHobbies = Array.from(document.querySelectorAll('#hobbiesContainer input[type="checkbox"]:checked')).map(cb => cb.value);
        const payload = {
            recipientName: document.getElementById('recipientName')?.value?.trim() || '',
            eventType: document.getElementById('eventType')?.value || '',
            customEventName: document.getElementById('customEventName')?.value?.trim() || '',
            customEventEmoji: document.getElementById('customEventEmoji')?.value?.trim() || '🎉',
            customHobbies: document.getElementById('customHobbies')?.value?.trim() || '',
            relationType: document.getElementById('relationType')?.value || 'friend',
            messageTone: document.getElementById('messageTone')?.value || 'balanced',
            selectedHobbies: checkedHobbies,
            userMessage: document.getElementById('userMessage')?.value?.trim() || '',
            designPreference: document.getElementById('designPreference')?.value?.trim() || '',
            yearsTogether: document.getElementById('yearsTogether')?.value?.trim() || '',
            isSpouse: document.getElementById('isSpouse')?.checked || false,
            updatedAt: Date.now()
        };

        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
        updateRestoreDraftButtonState();
    } catch (error) {
        console.warn('Draft save failed:', error);
    }
}

function restoreDraft() {
    try {
        const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
        if (!savedDraft) {
            showMessage('No saved draft found', 'error');
            updateRestoreDraftButtonState();
            return;
        }

        const draft = JSON.parse(savedDraft);
        document.getElementById('recipientName').value = draft.recipientName || '';
        document.getElementById('eventType').value = draft.eventType || '';
        const customEventNameField = document.getElementById('customEventName');
        if (customEventNameField) {
            customEventNameField.value = draft.customEventName || '';
        }
        const customEventEmojiField = document.getElementById('customEventEmoji');
        if (customEventEmojiField) {
            customEventEmojiField.value = draft.customEventEmoji || '🎉';
        }
        const customHobbiesField = document.getElementById('customHobbies');
        if (customHobbiesField) {
            customHobbiesField.value = draft.customHobbies || '';
        }
        const relationTypeField = document.getElementById('relationType');
        if (relationTypeField) {
            relationTypeField.value = draft.relationType || 'friend';
        }
        const messageToneField = document.getElementById('messageTone');
        if (messageToneField) {
            messageToneField.value = draft.messageTone || 'balanced';
        }
        document.getElementById('userMessage').value = draft.userMessage || '';
        document.getElementById('designPreference').value = draft.designPreference || '';

        const yearsField = document.getElementById('yearsTogether');
        if (yearsField) {
            yearsField.value = draft.yearsTogether || '';
        }

        const isSpouseField = document.getElementById('isSpouse');
        if (isSpouseField) {
            isSpouseField.checked = Boolean(draft.isSpouse);
        }

        updateHobbies();

        const selectedHobbies = Array.isArray(draft.selectedHobbies) ? draft.selectedHobbies : [];
        const hobbyCheckboxes = document.querySelectorAll('#hobbiesContainer input[type="checkbox"]');
        hobbyCheckboxes.forEach(checkbox => {
            checkbox.checked = selectedHobbies.includes(checkbox.value);
        });

        updateSelectedHobbies();
        showMessage('Draft restored successfully!', 'success');
        updateRestoreDraftButtonState();
    } catch (error) {
        showMessage('Could not restore draft', 'error');
    }
}

function clearDraft() {
    const hasDraft = Boolean(localStorage.getItem(DRAFT_STORAGE_KEY));
    if (!hasDraft) {
        showMessage('No saved draft found', 'error');
        updateRestoreDraftButtonState();
        return;
    }

    const confirmed = confirm('Clear your saved draft? This cannot be undone.');
    if (!confirmed) {
        return;
    }

    localStorage.removeItem(DRAFT_STORAGE_KEY);
    updateRestoreDraftButtonState();
    showMessage('Saved draft cleared', 'success');
}

function getMessageHistory() {
    try {
        const raw = localStorage.getItem(MESSAGE_HISTORY_KEY);
        const history = raw ? JSON.parse(raw) : [];
        return Array.isArray(history) ? history : [];
    } catch (error) {
        return [];
    }
}

function addMessageToHistory(messageText) {
    const normalized = (messageText || '').trim();
    if (!normalized) return;

    const current = getMessageHistory();
    const deduped = current.filter(item => item.text !== normalized);
    deduped.unshift({ text: normalized, createdAt: Date.now() });
    const trimmed = deduped.slice(0, 5);
    localStorage.setItem(MESSAGE_HISTORY_KEY, JSON.stringify(trimmed));
    renderMessageHistory();
}

function renderMessageHistory() {
    const container = document.getElementById('messageHistoryList');
    if (!container) return;

    const history = getMessageHistory();
    if (!history.length) {
        container.innerHTML = '<p style="color: #999; margin: 0;">No recent messages yet</p>';
        return;
    }

    container.innerHTML = history.map((item, index) => {
        const safeText = item.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `
            <div style="padding: 10px; border: 1px solid #ddd; border-radius: 8px; margin-bottom: 8px; background: #fafafa;">
                <p style="margin: 0 0 8px 0; color: #444; line-height: 1.4;">${safeText}</p>
                <button class="btn-secondary" style="padding: 6px 10px; font-size: 0.85em;" onclick="reuseHistoryMessage(${index})">Use This</button>
            </div>
        `;
    }).join('');
}

function reuseHistoryMessage(index) {
    const history = getMessageHistory();
    const item = history[index];
    if (!item) {
        showMessage('Selected history item is not available', 'error');
        return;
    }

    const userMessageField = document.getElementById('userMessage');
    if (userMessageField) {
        userMessageField.value = item.text;
    }
    state.userMessage = item.text;
    state.generatedMessage = item.text;
    saveDraft();
    showMessage('Message loaded from history', 'success');
}

function updateRestoreDraftButtonState() {
    const restoreButton = document.getElementById('restoreDraftBtn');
    const clearButton = document.getElementById('clearDraftBtn');
    if (!restoreButton) return;

    const hasDraft = Boolean(localStorage.getItem(DRAFT_STORAGE_KEY));
    restoreButton.disabled = !hasDraft;
    restoreButton.style.opacity = hasDraft ? '1' : '0.6';
    restoreButton.style.cursor = hasDraft ? 'pointer' : 'not-allowed';

    if (clearButton) {
        clearButton.disabled = !hasDraft;
        clearButton.style.opacity = hasDraft ? '1' : '0.6';
        clearButton.style.cursor = hasDraft ? 'pointer' : 'not-allowed';
    }

    updateDraftStatusText();
}

function updateDraftStatusText() {
    const draftStatusEl = document.getElementById('draftStatus');
    if (!draftStatusEl) return;

    const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!savedDraft) {
        draftStatusEl.textContent = 'No draft saved yet';
        return;
    }

    try {
        const draft = JSON.parse(savedDraft);
        if (!draft.updatedAt) {
            draftStatusEl.textContent = 'Draft saved';
            return;
        }

        const formattedDate = new Date(draft.updatedAt).toLocaleString();
        draftStatusEl.textContent = `Last saved: ${formattedDate}`;
    } catch (error) {
        draftStatusEl.textContent = 'Draft saved';
    }
}

function updateMessageTone() {
    const isSpouse = document.getElementById('isSpouse').checked;
    state.isSpouse = isSpouse;
}

function updateHobbies() {
    const eventType = document.getElementById('eventType').value;
    state.eventType = eventType;
    console.log('updateHobbies eventType:', eventType);
    console.log('hobbyOptions keys:', Object.keys(hobbyOptions));
    console.log('hobbies for event:', hobbyOptions[eventType]);
    
    const container = document.getElementById('hobbiesContainer');
    const anniversaryGroup = document.getElementById('anniversaryYearGroup');
    const customEventGroup = document.getElementById('customEventGroup');
    
    if (eventType === 'anniversary') {
        anniversaryGroup.classList.remove('hidden');
    } else {
        anniversaryGroup.classList.add('hidden');
    }

    if (customEventGroup) {
        customEventGroup.classList.remove('hidden');
    }
    
    container.innerHTML = '';
    if (!eventType) {
        container.innerHTML = '<p style="color: #999;">Select an event first</p>';
        saveDraft();
        return;
    }

    let hobbies = hobbyOptions[eventType] || [];
    if (eventType === 'custom' || eventType === 'award') {
        const customHobbiesInput = document.getElementById('customHobbies')?.value || '';
        const parsedHobbies = customHobbiesInput
            .split(',')
            .map(item => item.trim())
            .filter(Boolean);
        hobbies = parsedHobbies.length > 0 ? [...new Set(parsedHobbies)] : ['Celebration', 'Family', 'Friends', 'Music', 'Travel', 'Food'];
    }

    hobbies.forEach(hobby => {
        const label = document.createElement('label');
        label.className = 'checkbox-item';
        label.innerHTML = `<input type="checkbox" value="${hobby}" onchange="updateSelectedHobbies()"><span>${hobby}</span>`;
        container.appendChild(label);
    });

    saveDraft();
}

function updateSelectedHobbies() {
    const checkboxes = document.querySelectorAll('#hobbiesContainer input[type="checkbox"]:checked');
    state.selectedHobbies = Array.from(checkboxes).map(cb => cb.value);
    saveDraft();
}

function handlePhotoUpload() {
    const file = document.getElementById('photoFile').files[0];
    if (!file) {
        state.photoData = null;
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        state.photoData = e.target.result;
        saveDraft();
        if (state.generatedMessage) {
            renderCard();
        }
    };
    reader.readAsDataURL(file);
}

function startSpeechToText() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert('Speech recognition not supported');
        return;
    }
    
    const recognition = new SpeechRecognition();
    const button = event.target;
    button.classList.add('recording');
    button.textContent = '🎤 Listening...';
    
    recognition.onend = () => {
        button.classList.remove('recording');
        button.textContent = '🎤 Speak Message';
    };
    
    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        document.getElementById('userMessage').value += ' ' + transcript;
    };
    
    recognition.start();
}

function getSelectedAIProvider() {
    return document.getElementById('aiProvider')?.value || 'auto';
}

function getAIBaseUrl() {
    const configured = (localStorage.getItem(AI_ENDPOINT_STORAGE_KEY) || '').trim();
    if (!configured) return '';
    return configured.replace(/\/$/, '');
}

function buildAIUrl(path) {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const base = getAIBaseUrl();
    return base ? `${base}${normalizedPath}` : normalizedPath;
}

function configureAIEndpoint() {
    const current = getAIBaseUrl();
    const value = prompt('Set AI server URL (leave empty to use local /api). Example: https://your-ai-backend.vercel.app', current);
    if (value === null) {
        return;
    }

    const trimmed = value.trim();
    if (!trimmed) {
        localStorage.removeItem(AI_ENDPOINT_STORAGE_KEY);
        updateAIConfigStatus();
        showMessage('AI server reset to local /api', 'success');
        return;
    }

    localStorage.setItem(AI_ENDPOINT_STORAGE_KEY, trimmed.replace(/\/$/, ''));
    updateAIConfigStatus();
    showMessage('AI server saved', 'success');
}

function updateAIConfigStatus() {
    const status = document.getElementById('aiConfigStatus');
    if (!status) return;

    const base = getAIBaseUrl();
    status.textContent = base
        ? `AI server: ${base}`
        : 'AI server: local (/api). Use Set AI Server if your backend is hosted separately.';
}

function hydrateStateFromForm() {
    state.recipientName = document.getElementById('recipientName')?.value.trim() || '';
    state.eventType = document.getElementById('eventType')?.value || '';
    state.userMessage = document.getElementById('userMessage')?.value.trim() || '';
    state.designPreference = document.getElementById('designPreference')?.value.trim() || '';
    state.customEventName = document.getElementById('customEventName')?.value.trim() || '';
    state.customEventEmoji = document.getElementById('customEventEmoji')?.value.trim() || '🎉';
    state.customHobbies = document.getElementById('customHobbies')?.value.trim() || '';
    state.relationType = document.getElementById('relationType')?.value || 'friend';
    state.messageTone = document.getElementById('messageTone')?.value || 'balanced';
    state.yearsTogether = document.getElementById('yearsTogether')?.value.trim() || '';
    state.selectedHobbies = Array.from(
        document.querySelectorAll('#hobbiesContainer input[type="checkbox"]:checked')
    ).map(cb => cb.value);

    const isSpouseCheckbox = document.getElementById('isSpouse');
    if (isSpouseCheckbox) {
        state.isSpouse = isSpouseCheckbox.checked;
    }
}

function buildAIPayload() {
    return {
        provider: getSelectedAIProvider(),
        recipientName: state.recipientName,
        eventType: state.eventType,
        eventDisplayName: getEventDisplayName(),
        relationType: state.relationType,
        messageTone: state.messageTone,
        selectedHobbies: state.selectedHobbies,
        userMessage: state.userMessage,
        designPreference: state.designPreference
    };
}

async function requestAIMessage(payload) {
    const data = await callAIEndpoint('/api/generate-message', payload);
    const aiMessage = (data.message || '').trim();
    if (!aiMessage) {
        throw new Error('AI returned an empty message');
    }
    return { message: aiMessage, providerUsed: data.providerUsed || 'provider' };
}

async function requestAIImage(payload) {
    const data = await callAIEndpoint('/api/generate-image', payload);
    if (!data.imageDataUrl) {
        throw new Error('AI returned no image');
    }
    return { imageDataUrl: data.imageDataUrl, providerUsed: data.providerUsed || 'provider' };
}

async function callAIEndpoint(path, payload) {
    let response;
    try {
        response = await fetch(buildAIUrl(path), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
    } catch (error) {
        throw new Error('Unable to reach AI service right now. Please try again.');
    }

    let data = {};
    try {
        data = await response.json();
    } catch (error) {
        data = {};
    }

    if (!response.ok) {
        throw new Error(data.error || `Request failed with status ${response.status}`);
    }

    return data;
}

async function generateAIMessage() {
    hydrateStateFromForm();

    if (!state.recipientName) {
        showMessage('Enter recipient name before AI generation', 'error');
        return;
    }

    if (!state.eventType) {
        showMessage('Select event type before AI generation', 'error');
        return;
    }

    showMessage('Generating AI message...', 'loading');

    try {
        const payload = buildAIPayload();
        const data = await requestAIMessage(payload);
        const aiMessage = data.message;

        state.generatedMessage = aiMessage;
        state.userMessage = aiMessage;
        const userMessageField = document.getElementById('userMessage');
        if (userMessageField) {
            userMessageField.value = aiMessage;
        }

        addMessageToHistory(aiMessage);
        saveDraft();

        if (state.eventType && state.recipientName) {
            renderCard();
            document.getElementById('exportButtons')?.classList.remove('hidden');
            showSharingAndGallery();
        }

        showMessage(`AI message ready (${data.providerUsed || 'provider'})`, 'success');
    } catch (error) {
        showMessage(`AI message failed: ${error.message}`, 'error');
    }
}

async function generateAIImage() {
    hydrateStateFromForm();

    if (!state.recipientName) {
        showMessage('Enter recipient name before AI image generation', 'error');
        return;
    }

    if (!state.eventType) {
        showMessage('Select event type before AI image generation', 'error');
        return;
    }

    showMessage('Generating AI image...', 'loading');

    try {
        const payload = buildAIPayload();
        const data = await requestAIImage(payload);

        state.photoData = data.imageDataUrl;
        if (!state.generatedMessage) {
            state.generatedMessage = state.userMessage || generateMessage();
        }

        renderCard();
        document.getElementById('exportButtons')?.classList.remove('hidden');
        showSharingAndGallery();
        showMessage(`AI image ready (${data.providerUsed || 'provider'})`, 'success');
    } catch (error) {
        showMessage(`AI image failed: ${error.message}`, 'error');
    }
}

function generateMessage() {
    // For anniversary, select templates based on sender type
    let templateKey = state.eventType;
    if (state.eventType === 'anniversary' && !state.isSpouse) {
        templateKey = 'anniversaryFriend';
    } else if (state.eventType === 'custom') {
        templateKey = 'custom';
    }

    const templates = templateKey === 'custom'
        ? customEventTemplates
        : (messageTemplates[templateKey] || messageTemplates[state.eventType] || []);
    if (!templates.length) return 'Wishing you all the best!';
    
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    let hobbiesAdjective = 'wonderful';
    let hobbiesList = 'special moments';
    
    if (state.selectedHobbies.length > 0) {
        const firstHobby = state.selectedHobbies[0];
        const descriptor = hobbiesDescriptors[firstHobby] || defaultDescriptor;
        hobbiesAdjective = descriptor.adjective;
        hobbiesList = state.selectedHobbies.slice(0, 2).join(' and ');
    }
    
    let message = template
        .replace(/{name}/g, state.recipientName)
        .replace(/{event_name}/g, getEventDisplayName())
        .replace(/{event_emoji}/g, state.customEventEmoji || '🎉')
        .replace(/{hobbies_adjective}/g, hobbiesAdjective)
        .replace(/{hobbies_list}/g, hobbiesList)
        .replace(/{years}/g, state.yearsTogether || '');
    
    message = message.replace(/\{\{/g, '{').replace(/\}\}/g, '}').replace(/\s+/g, ' ').trim();

        if (festivalEvents.has(state.eventType)) {
                const warmClosing = festivalWarmClosings[state.eventType];
                if (warmClosing && !message.includes(warmClosing)) {
                        message = `${message} ${warmClosing}`.trim();
                }
        }

    return applyToneToMessage(message);
}

function getFestivalImageData(eventType) {
        const theme = festivalImageTheme[eventType];
        if (!theme) return null;

        const festivalName = getEventDisplayName();
        const festivalAccents = {
            diwali: ['✨', '🕯️'],
            holi: ['🌈', '🎉'],
            eid: ['⭐', '🕌'],
            christmas: ['🎁', '❄️'],
            newyear: ['🥳', '🎊'],
            navratri: ['🌸', '🪔'],
            dussehra: ['🏹', '✨'],
            ganeshchaturthi: ['🙏', '🌼'],
            rakshabandhan: ['💖', '🎁'],
            janmashtami: ['🪈', '🌟'],
            onam: ['🌼', '🍃'],
            pongal: ['🌾', '☀️'],
            lohri: ['🔥', '🎶']
        };

        const title = (festivalName || 'Festival Wishes').replace(/[<>&]/g, '').slice(0, 30);
        const accents = festivalAccents[eventType] || ['✨', '🎉'];
        const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="560" height="560" viewBox="0 0 560 560">
    <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${theme.c1}"/>
            <stop offset="100%" stop-color="${theme.c2}"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="30%" r="65%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.28"/>
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
    </defs>
    <rect width="560" height="560" rx="28" fill="url(#g)"/>
    <rect width="560" height="560" rx="28" fill="url(#glow)"/>
    <circle cx="105" cy="105" r="58" fill="#ffffff" fill-opacity="0.14"/>
    <circle cx="462" cy="458" r="74" fill="#ffffff" fill-opacity="0.12"/>
    <rect x="58" y="150" width="444" height="260" rx="24" fill="#ffffff" fill-opacity="0.14" stroke="#ffffff" stroke-opacity="0.35"/>
    <text x="28%" y="25%" text-anchor="middle" font-size="38" font-family="Segoe UI Emoji, Segoe UI, Arial">${accents[0]}</text>
    <text x="72%" y="25%" text-anchor="middle" font-size="38" font-family="Segoe UI Emoji, Segoe UI, Arial">${accents[1]}</text>
    <text x="50%" y="44%" text-anchor="middle" font-size="118" font-family="Segoe UI Emoji, Segoe UI, Arial">${theme.emoji}</text>
    <text x="50%" y="58%" text-anchor="middle" font-size="42" font-weight="700" fill="#ffffff" font-family="Segoe UI, Arial">${title}</text>
    <text x="50%" y="67.5%" text-anchor="middle" font-size="23" fill="#ffffff" opacity="0.97" font-family="Segoe UI, Arial">Festive wishes from SoulVest</text>
</svg>`;

        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getEventFallbackImageData(eventType) {
    const festivalImage = getFestivalImageData(eventType);
    if (festivalImage) {
        return festivalImage;
    }

    const eventImageTheme = {
        birthday: { emoji: '🎂', c1: '#f093fb', c2: '#f5576c', accents: ['🎈', '🎁'] },
        award: { emoji: '🏅', c1: '#f6d365', c2: '#fda085', accents: ['🏆', '👏'] },
        valentines: { emoji: '💌', c1: '#ff5f6d', c2: '#ffc371', accents: ['🌹', '💖'] },
        anniversary: { emoji: '💑', c1: '#ffafbd', c2: '#ffc3a0', accents: ['🥂', '✨'] },
        wedding: { emoji: '💍', c1: '#fffbd5', c2: '#b7f8db', accents: ['💐', '🎊'] },
        graduation: { emoji: '🎓', c1: '#43e97b', c2: '#38f9d7', accents: ['📘', '🎉'] },
        newjob: { emoji: '🚀', c1: '#4facfe', c2: '#00f2fe', accents: ['💼', '⭐'] },
        housewarming: { emoji: '🏠', c1: '#fff5e1', c2: '#ffe4e1', accents: ['🪴', '🕯️'] },
        promotion: { emoji: '🏆', c1: '#f7971e', c2: '#ffd200', accents: ['📈', '🎖️'] },
        retirement: { emoji: '🏖️', c1: '#a8edea', c2: '#fed6e3', accents: ['🌴', '☀️'] },
        babyshower: { emoji: '👶', c1: '#fbc2eb', c2: '#a6c1ee', accents: ['🍼', '🧸'] },
        getwell: { emoji: '💙', c1: '#cfd9df', c2: '#e2ebf0', accents: ['🌼', '☀️'] },
        exam: { emoji: '📚', c1: '#fceabb', c2: '#f8b500', accents: ['✍️', '🌟'] },
        custom: { emoji: state.customEventEmoji || '🎉', c1: '#667eea', c2: '#764ba2', accents: ['✨', '🎊'] }
    };

    const theme = eventImageTheme[eventType] || { emoji: '✨', c1: '#667eea', c2: '#764ba2', accents: ['✨', '🎉'] };
    const eventName = getEventDisplayName();
    const safeName = (eventName || 'Special Event').replace(/[<>&]/g, '').slice(0, 28);
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="560" height="560" viewBox="0 0 560 560">
    <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="${theme.c1}"/>
            <stop offset="100%" stop-color="${theme.c2}"/>
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="30%" r="65%">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.28"/>
            <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </radialGradient>
    </defs>
    <rect width="560" height="560" rx="28" fill="url(#g)"/>
    <rect width="560" height="560" rx="28" fill="url(#glow)"/>
    <circle cx="102" cy="104" r="56" fill="#ffffff" fill-opacity="0.14"/>
    <circle cx="462" cy="456" r="76" fill="#ffffff" fill-opacity="0.12"/>
    <rect x="58" y="150" width="444" height="260" rx="24" fill="#ffffff" fill-opacity="0.14" stroke="#ffffff" stroke-opacity="0.35"/>
    <text x="28%" y="25%" text-anchor="middle" font-size="38" font-family="Segoe UI Emoji, Segoe UI, Arial">${theme.accents[0]}</text>
    <text x="72%" y="25%" text-anchor="middle" font-size="38" font-family="Segoe UI Emoji, Segoe UI, Arial">${theme.accents[1]}</text>
    <text x="50%" y="44%" text-anchor="middle" font-size="118" font-family="Segoe UI Emoji, Segoe UI, Arial">${theme.emoji}</text>
    <text x="50%" y="58%" text-anchor="middle" font-size="42" font-weight="700" fill="#ffffff" font-family="Segoe UI, Arial">${safeName}</text>
    <text x="50%" y="67.5%" text-anchor="middle" font-size="23" fill="#ffffff" opacity="0.97" font-family="Segoe UI, Arial">Special wishes from SoulVest</text>
</svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const onlineImageKeywords = {
    birthday: 'birthday celebration balloons cake party',
    award: 'award ceremony trophy winner celebration achievement',
    valentines: 'valentine romantic flowers hearts',
    anniversary: 'anniversary couple celebration flowers',
    wedding: 'wedding celebration flowers decor',
    graduation: 'graduation cap celebration confetti',
    newjob: 'office success celebration',
    housewarming: 'new home cozy decor celebration',
    promotion: 'career success celebration office',
    retirement: 'retirement beach travel celebration',
    babyshower: 'baby shower pastel celebration',
    getwell: 'flowers wellness calm',
    exam: 'study books success motivation',
    diwali: 'diwali lights diyas rangoli festival',
    holi: 'holi colors festival celebration',
    eid: 'eid moon lanterns celebration',
    christmas: 'christmas tree lights celebration',
    newyear: 'new year fireworks celebration',
    navratri: 'navratri garba festive celebration',
    dussehra: 'dussehra festival celebration',
    ganeshchaturthi: 'ganesh chaturthi festival decoration',
    rakshabandhan: 'raksha bandhan festival celebration',
    janmashtami: 'janmashtami festival celebration',
    onam: 'onam pookalam festival celebration',
    pongal: 'pongal harvest festival celebration',
    lohri: 'lohri bonfire festival celebration',
    custom: 'festival celebration decoration background'
};

function buildWikimediaSearchUrl(eventType) {
    const eventName = getEventDisplayName();
    const keyword = onlineImageKeywords[eventType] || `${eventName} festival celebration decoration`;
    const searchQuery = encodeURIComponent(`${keyword} filetype:bitmap`);
    return `https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrnamespace=6&gsrlimit=10&gsrsearch=${searchQuery}&prop=imageinfo&iiprop=url|mime&iiurlwidth=1024`;
}

function scoreTitleRelevance(title, eventType) {
    const normalizedTitle = (title || '').toLowerCase();
    const eventName = getEventDisplayName().toLowerCase();
    const keyText = (onlineImageKeywords[eventType] || `${eventType} ${eventName}`).toLowerCase();
    const tokens = keyText.split(/\s+/).filter(token => token.length > 3);

    let score = 0;
    for (const token of tokens) {
        if (normalizedTitle.includes(token)) {
            score += 1;
        }
    }
    return score;
}

function pickBestWikimediaImageUrl(pages, eventType) {
    if (!pages || typeof pages !== 'object') return null;

    const ranked = Object.values(pages)
        .map(page => {
            const info = page?.imageinfo?.[0] || {};
            const imageUrl = info.thumburl || info.url || '';
            const mimeType = info.mime || '';
            return {
                imageUrl,
                mimeType,
                score: scoreTitleRelevance(page?.title, eventType)
            };
        })
        .filter(item => item.imageUrl && item.mimeType.startsWith('image/'))
        .sort((a, b) => b.score - a.score);

    return ranked[0]?.imageUrl || null;
}

async function fetchWithTimeout(url, timeoutMs = 9000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
        return await fetch(url, { signal: controller.signal, cache: 'no-store' });
    } finally {
        clearTimeout(timeoutId);
    }
}

function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(new Error('Failed to convert image blob'));
        reader.readAsDataURL(blob);
    });
}

async function getOnlineEventImageData(eventType) {
    try {
        const searchResponse = await fetchWithTimeout(buildWikimediaSearchUrl(eventType));
        if (!searchResponse.ok) return null;

        const data = await searchResponse.json();
        const imageUrl = pickBestWikimediaImageUrl(data?.query?.pages, eventType);
        if (!imageUrl) return null;

        const imageResponse = await fetchWithTimeout(imageUrl);
        if (!imageResponse.ok) return null;

        const contentType = imageResponse.headers.get('content-type') || '';
        if (!contentType.startsWith('image/')) return null;

        const imageBlob = await imageResponse.blob();
        const dataUrl = await blobToDataUrl(imageBlob);
        if (typeof dataUrl === 'string' && dataUrl.startsWith('data:image/')) {
            return dataUrl;
        }
    } catch (error) {
        return null;
    }

    return null;
}

async function generateCard() {
    hydrateStateFromForm();
    
    if (!state.recipientName) {
        showMessage('Please enter recipient name', 'error');
        return;
    }
    
    if (!state.eventType) {
        showMessage('Please select an event type', 'error');
        return;
    }

    if ((state.eventType === 'custom' || state.eventType === 'award') && !state.customEventName) {
        showMessage('Please enter an event name', 'error');
        return;
    }
    
    if (state.eventType === 'anniversary') {
        const yearsTogether = document.getElementById('yearsTogether')?.value.trim();
        if (yearsTogether) {
            state.yearsTogether = yearsTogether;
        } else {
            state.yearsTogether = '';
        }
    }
    
    showMessage('Generating card...', 'loading');
    
    try {
        let messageMode = 'manual';
        let imageMode = state.photoData ? 'uploaded photo' : 'none';

        if (!state.userMessage) {
            showMessage('Generating message...', 'loading');
            try {
                const aiMessage = await requestAIMessage(buildAIPayload());
                state.generatedMessage = aiMessage.message;
                state.userMessage = aiMessage.message;
                const userMessageField = document.getElementById('userMessage');
                if (userMessageField) {
                    userMessageField.value = aiMessage.message;
                }
                messageMode = `AI (${aiMessage.providerUsed})`;
            } catch (error) {
                state.generatedMessage = generateMessage();
                messageMode = 'template fallback';
            }
        } else {
            state.generatedMessage = applyToneToMessage(state.userMessage);
        }

        if (!state.photoData) {
            showMessage('Preparing image...', 'loading');
            try {
                const aiImage = await requestAIImage(buildAIPayload());
                state.photoData = aiImage.imageDataUrl;
                imageMode = `AI (${aiImage.providerUsed})`;
            } catch (error) {
                showMessage('Finalizing image...', 'loading');
                const shouldUseOnlineFallback = state.eventType === 'custom';

                if (shouldUseOnlineFallback) {
                    const onlineImage = await getOnlineEventImageData(state.eventType);
                    if (onlineImage) {
                        state.photoData = onlineImage;
                        imageMode = 'online image';
                    }
                }

                if (!state.photoData) {
                    const fallbackImage = getEventFallbackImageData(state.eventType);
                    if (fallbackImage) {
                        state.photoData = fallbackImage;
                        imageMode = 'event fallback';
                    }
                }
            }
        }

        addMessageToHistory(state.generatedMessage);
        
        renderCard();
        showMessage('Card generated successfully! ✨', 'success');
        document.getElementById('exportButtons').classList.remove('hidden');
        showSharingAndGallery();
    } catch (error) {
        showMessage('Error: ' + error.message, 'error');
    }
}

function renderCard() {
    // Hobby+event theme blending: if hobby selected and mapped, blend with event; else use event
    let designTheme = null;
    const matchHobbyTheme = document.getElementById('matchHobbyTheme') ? document.getElementById('matchHobbyTheme').checked : true;
    // Event themes
    const valentinesThemes = [
        { gradient: 'linear-gradient(135deg, #ff5f6d 0%, #ffc371 100%)', emoji: '💌', tagline: 'Classic Romantic: Roses & Hearts' },
        { gradient: 'linear-gradient(135deg, #6a0572 0%, #ab1a1a 100%)', emoji: '🌹', tagline: 'Elegant & Sophisticated: Orchids & Candles' },
        { gradient: 'linear-gradient(135deg, #f857a6 0%, #ff5858 100%)', emoji: '🎉', tagline: 'Playful & Fun: Balloons & Candy' },
        { gradient: 'linear-gradient(135deg, #8ec5fc 0%, #e0c3fc 100%)', emoji: '🌌', tagline: 'Soulful & Modern: Abstract & Digital' }
    ];
    const eventThemes = {
        valentines: () => valentinesThemes[Math.floor(Math.random() * valentinesThemes.length)],
        birthday: () => ({ gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', emoji: '🎂', tagline: 'Fun & Festive' }),
        award: () => ({ gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', emoji: '🏅', tagline: 'Pride & Achievement' }),
        anniversary: () => ({ gradient: 'linear-gradient(135deg, #ffafbd 0%, #ffc3a0 100%)', emoji: '💑', tagline: 'Cherished Memories' }),
        wedding: () => ({ gradient: 'linear-gradient(135deg, #fffbd5 0%, #b7f8db 100%)', emoji: '💍', tagline: 'Elegant & Joyful' }),
        graduation: () => ({ gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', emoji: '🎓', tagline: 'Bright Future' }),
        newjob: () => ({ gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', emoji: '🚀', tagline: 'New Beginnings' }),
        housewarming: () => ({ gradient: 'linear-gradient(135deg, #fff5e1 0%, #ffe4e1 100%)', emoji: '🏠', tagline: 'Warm & Welcoming' }),
        promotion: () => ({ gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', emoji: '🏆', tagline: 'Success & Achievement' }),
        retirement: () => ({ gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', emoji: '🏖️', tagline: 'Relax & Enjoy' }),
        babyshower: () => ({ gradient: 'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)', emoji: '👶', tagline: 'Joyful Arrival' }),
        getwell: () => ({ gradient: 'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)', emoji: '💙', tagline: 'Healing & Hope' }),
        exam: () => ({ gradient: 'linear-gradient(135deg, #fceabb 0%, #f8b500 100%)', emoji: '📚', tagline: 'Best of Luck!' }),
        diwali: () => ({ gradient: 'linear-gradient(135deg, #ff9a3c 0%, #ffcc70 100%)', emoji: '🪔', tagline: 'Light, Joy & Prosperity' }),
        holi: () => ({ gradient: 'linear-gradient(135deg, #ff6fd8 0%, #6ec3f4 50%, #8be15d 100%)', emoji: '🎨', tagline: 'Colors of Celebration' }),
        eid: () => ({ gradient: 'linear-gradient(135deg, #1d976c 0%, #93f9b9 100%)', emoji: '🌙', tagline: 'Peace & Blessings' }),
        christmas: () => ({ gradient: 'linear-gradient(135deg, #0f9b0f 0%, #ff512f 100%)', emoji: '🎄', tagline: 'Joyful Holiday Spirit' }),
        newyear: () => ({ gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', emoji: '🎆', tagline: 'Fresh Start & New Dreams' }),
        navratri: () => ({ gradient: 'linear-gradient(135deg, #ff9966 0%, #ff5e62 100%)', emoji: '🙏', tagline: 'Devotion & Celebration' }),
        dussehra: () => ({ gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)', emoji: '🏹', tagline: 'Victory of Good' }),
        ganeshchaturthi: () => ({ gradient: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)', emoji: '🐘', tagline: 'Wisdom & Prosperity' }),
        rakshabandhan: () => ({ gradient: 'linear-gradient(135deg, #f953c6 0%, #b91d73 100%)', emoji: '🎀', tagline: 'Bond of Love' }),
        janmashtami: () => ({ gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', emoji: '🦚', tagline: 'Divine Joy' }),
        onam: () => ({ gradient: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)', emoji: '🌼', tagline: 'Harvest & Happiness' }),
        pongal: () => ({ gradient: 'linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%)', emoji: '🌾', tagline: 'Prosperity & Harvest' }),
        lohri: () => ({ gradient: 'linear-gradient(135deg, #f46b45 0%, #eea849 100%)', emoji: '🔥', tagline: 'Warmth & Celebration' }),
        custom: () => ({ gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', emoji: state.customEventEmoji || '🎉', tagline: `${getEventDisplayName()} Celebration` })
    };
    // If hobby-based theme is enabled and a mapped hobby is selected, blend hobby and event theme
    let hobbyTheme = null;
    if (matchHobbyTheme && state.selectedHobbies && state.selectedHobbies.length > 0) {
        for (const hobby of state.selectedHobbies) {
            if (hobbyThemes[hobby]) {
                hobbyTheme = hobbyThemes[hobby];
                break;
            }
        }
    }
    let eventTheme = eventThemes[state.eventType] ? eventThemes[state.eventType]() : null;
    if (hobbyTheme && eventTheme) {
        // Blend: use hobby gradient, hobby emoji + event emoji, hobby tagline + event tagline
        designTheme = {
            gradient: hobbyTheme.gradient,
            emoji: hobbyTheme.emoji + ' ' + eventTheme.emoji,
            tagline: hobbyTheme.tagline + ' | ' + eventTheme.tagline
        };
    } else if (hobbyTheme) {
        designTheme = hobbyTheme;
    } else if (eventTheme) {
        designTheme = eventTheme;
    } else {
        designTheme = parseDesignPreference(state.designPreference);
    }
    const cardPreview = document.getElementById('cardPreview');
    cardPreview.style.background = designTheme.gradient;
    
    let photoHTML = '';
    if (state.photoData) {
        photoHTML = `<div style="margin: 20px auto; text-align: center;"><img src="${state.photoData}" style="width: 280px; height: 280px; object-fit: cover; border-radius: 15px; border: 4px solid rgba(255,255,255,0.5); box-shadow: 0 8px 16px rgba(0,0,0,0.3);"></div>`;
    } else if (festivalEvents.has(state.eventType)) {
        const generatedFestivalImage = getFestivalImageData(state.eventType);
        if (generatedFestivalImage) {
            photoHTML = `<div style="margin: 20px auto; text-align: center;"><img src="${generatedFestivalImage}" alt="${getEventDisplayName()} greeting" style="width: 280px; height: 280px; object-fit: cover; border-radius: 15px; border: 4px solid rgba(255,255,255,0.5); box-shadow: 0 8px 16px rgba(0,0,0,0.3);"></div>`;
        }
    }
    
    // Customize header based on event type
    let headerText = `${state.eventType.charAt(0).toUpperCase() + state.eventType.slice(1)} for ${state.recipientName}`;
    const headerEmoji = designTheme.emoji;
    
    const eventGreetings = {
        birthday: `Happy Birthday ${state.recipientName}!`,
        award: `Congratulations ${state.recipientName}!`,
        valentines: `Happy Valentine's Day ${state.recipientName}!`,
        anniversary: `Happy Wedding Anniversary ${state.recipientName}!`,
        wedding: `Happy Wedding ${state.recipientName}!`,
        graduation: `Congratulations ${state.recipientName}!`,
        newjob: `Welcome ${state.recipientName}!`,
        housewarming: `Welcome Home ${state.recipientName}!`,
        promotion: `Congratulations ${state.recipientName}!`,
        retirement: `Happy Retirement ${state.recipientName}!`,
        babyshower: `Congratulations ${state.recipientName}!`,
        getwell: `Get Well Soon ${state.recipientName}!`,
        exam: `Best of Luck in Your Exams, ${state.recipientName}!`,
        diwali: `Happy Diwali ${state.recipientName}!`,
        holi: `Happy Holi ${state.recipientName}!`,
        eid: `Eid Mubarak ${state.recipientName}!`,
        christmas: `Merry Christmas ${state.recipientName}!`,
        newyear: `Happy New Year ${state.recipientName}!`,
        navratri: `Happy Navratri ${state.recipientName}!`,
        dussehra: `Happy Dussehra ${state.recipientName}!`,
        ganeshchaturthi: `Happy Ganesh Chaturthi ${state.recipientName}!`,
        rakshabandhan: `Happy Raksha Bandhan ${state.recipientName}!`,
        janmashtami: `Happy Janmashtami ${state.recipientName}!`,
        onam: `Happy Onam ${state.recipientName}!`,
        pongal: `Happy Pongal ${state.recipientName}!`,
        lohri: `Happy Lohri ${state.recipientName}!`,
        custom: `Happy ${getEventDisplayName()} ${state.recipientName}!`
    };
    
    headerText = eventGreetings[state.eventType] || headerText;
    
    cardPreview.innerHTML = `
        <div class="card-header">
            <h2>${headerEmoji} ${headerText}</h2>
        </div>
        <div class="card-body">
            ${photoHTML}
            <div class="card-message">${state.generatedMessage}</div>
        </div>
        <div class="card-footer">
            <p>${designTheme.tagline}</p>
            <p style="margin-top: 10px; font-size: 0.9em; font-style: italic; opacity: 0.9;">💖 Made with love using Soulvest Card</p>
        </div>
    `;
    
    // Hide sample cards gallery and show export/sharing sections
    const sampleGallery = document.getElementById('sampleCardsGallery');
    if (sampleGallery) {
        sampleGallery.style.display = 'none';
    }
}

function getEventDisplayName() {
    if (state.eventType === 'custom' || state.eventType === 'award') {
        return state.customEventName || 'Special Event';
    }
    return eventDisplayNames[state.eventType] || state.eventType || 'Special Event';
}

function getEventTag() {
    return getEventDisplayName().replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '') || 'SpecialEvent';
}

function applyToneToMessage(message) {
    if (!message) return message;

    const relationLabels = {
        friend: 'friend',
        family: 'family member',
        spouse: 'partner',
        colleague: 'colleague',
        mentor: 'mentor'
    };

    let tunedMessage = message;

    if (state.relationType && state.relationType !== 'friend') {
        const relationLabel = relationLabels[state.relationType] || state.relationType;
        tunedMessage = `${tunedMessage} You are such a wonderful ${relationLabel}.`;
    }

    switch (state.messageTone) {
        case 'heartfelt':
            tunedMessage = `${tunedMessage} Sending you lots of love and warm wishes always.`;
            break;
        case 'playful':
            tunedMessage = `${tunedMessage} 😄🎉`; 
            break;
        case 'formal':
            tunedMessage = tunedMessage
                .replace(/\bYou're\b/g, 'You are')
                .replace(/\bI\'m\b/g, 'I am')
                .replace(/\bHere\'s\b/g, 'Here is')
                .replace(/\bcan\'t\b/gi, 'cannot');
            break;
        case 'short': {
            const firstSentence = tunedMessage.split(/(?<=[.!?])\s+/)[0] || tunedMessage;
            tunedMessage = firstSentence.length > 160 ? `${firstSentence.slice(0, 157)}...` : firstSentence;
            break;
        }
        default:
            break;
    }

    return tunedMessage.replace(/\s+/g, ' ').trim();
}

function generateAnotherMessage() {
    state.recipientName = document.getElementById('recipientName').value.trim();
    state.eventType = document.getElementById('eventType').value;
    state.customEventName = document.getElementById('customEventName')?.value.trim() || '';
    state.customEventEmoji = document.getElementById('customEventEmoji')?.value.trim() || '🎉';
    state.relationType = document.getElementById('relationType')?.value || 'friend';
    state.messageTone = document.getElementById('messageTone')?.value || 'balanced';

    if (!state.recipientName || !state.eventType) {
        showMessage('Fill recipient and event before regenerating message', 'error');
        return;
    }

    if ((state.eventType === 'custom' || state.eventType === 'award') && !state.customEventName) {
        showMessage('Please enter an event name', 'error');
        return;
    }

    const message = generateMessage();
    state.generatedMessage = message;
    document.getElementById('userMessage').value = message;
    addMessageToHistory(message);
    renderCard();
    showMessage('New message suggestion generated!', 'success');
}

function copyMessageText() {
    const message = state.generatedMessage || document.getElementById('userMessage')?.value?.trim();
    if (!message) {
        showMessage('No message available to copy', 'error');
        return;
    }

    navigator.clipboard.writeText(message).then(() => {
        showMessage('Message copied to clipboard!', 'success');
    }).catch(() => {
        showMessage('Could not copy message', 'error');
    });
}

function exportCardData() {
    try {
        const payload = {
            recipientName: document.getElementById('recipientName')?.value?.trim() || '',
            eventType: document.getElementById('eventType')?.value || '',
            customEventName: document.getElementById('customEventName')?.value?.trim() || '',
            customEventEmoji: document.getElementById('customEventEmoji')?.value?.trim() || '🎉',
            customHobbies: document.getElementById('customHobbies')?.value?.trim() || '',
            relationType: document.getElementById('relationType')?.value || 'friend',
            messageTone: document.getElementById('messageTone')?.value || 'balanced',
            selectedHobbies: Array.from(document.querySelectorAll('#hobbiesContainer input[type="checkbox"]:checked')).map(cb => cb.value),
            userMessage: document.getElementById('userMessage')?.value?.trim() || '',
            designPreference: document.getElementById('designPreference')?.value?.trim() || '',
            yearsTogether: document.getElementById('yearsTogether')?.value?.trim() || '',
            isSpouse: document.getElementById('isSpouse')?.checked || false,
            exportedAt: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `soulvest-card-data-${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(url);
        showMessage('Card data exported!', 'success');
    } catch (error) {
        showMessage('Could not export card data', 'error');
    }
}

function importCardData() {
    const importInput = document.getElementById('importCardDataFile');
    if (!importInput) {
        showMessage('Import input not found', 'error');
        return;
    }
    importInput.value = '';
    importInput.click();
}

function handleImportCardData(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
        try {
            const payload = JSON.parse(loadEvent.target.result);
            document.getElementById('recipientName').value = payload.recipientName || '';
            document.getElementById('eventType').value = payload.eventType || '';

            const customEventNameField = document.getElementById('customEventName');
            if (customEventNameField) {
                customEventNameField.value = payload.customEventName || '';
            }
            const customEventEmojiField = document.getElementById('customEventEmoji');
            if (customEventEmojiField) {
                customEventEmojiField.value = payload.customEventEmoji || '🎉';
            }
            const customHobbiesField = document.getElementById('customHobbies');
            if (customHobbiesField) {
                customHobbiesField.value = payload.customHobbies || '';
            }

            const relationTypeField = document.getElementById('relationType');
            if (relationTypeField) {
                relationTypeField.value = payload.relationType || 'friend';
            }
            const messageToneField = document.getElementById('messageTone');
            if (messageToneField) {
                messageToneField.value = payload.messageTone || 'balanced';
            }

            document.getElementById('userMessage').value = payload.userMessage || '';
            document.getElementById('designPreference').value = payload.designPreference || '';

            const yearsField = document.getElementById('yearsTogether');
            if (yearsField) {
                yearsField.value = payload.yearsTogether || '';
            }
            const isSpouseField = document.getElementById('isSpouse');
            if (isSpouseField) {
                isSpouseField.checked = Boolean(payload.isSpouse);
            }

            updateHobbies();

            const selectedHobbies = Array.isArray(payload.selectedHobbies) ? payload.selectedHobbies : [];
            const hobbyCheckboxes = document.querySelectorAll('#hobbiesContainer input[type="checkbox"]');
            hobbyCheckboxes.forEach(checkbox => {
                checkbox.checked = selectedHobbies.includes(checkbox.value);
            });
            updateSelectedHobbies();
            saveDraft();
            showMessage('Card data imported successfully!', 'success');
        } catch (error) {
            showMessage('Invalid card data file', 'error');
        }
    };
    reader.readAsText(file);
}

function parseDesignPreference(text) {
    const themes = {
        elegant: { gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)', emoji: '✨', tagline: 'Elegant & Refined' },
        colorful: { gradient: 'linear-gradient(135deg, #e74c3c 0%, #f39c12 50%, #27ae60 100%)', emoji: '🌈', tagline: 'Vibrant & Joyful' },
        minimalist: { gradient: 'linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%)', emoji: '⚪', tagline: 'Simple & Pure' },
        romantic: { gradient: 'linear-gradient(135deg, #e91e63 0%, #ff6090 100%)', emoji: '💕', tagline: 'Romantic & Sweet' },
        nature: { gradient: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)', emoji: '🌿', tagline: 'Fresh & Natural' },
        professional: { gradient: 'linear-gradient(135deg, #2980b9 0%, #3498db 100%)', emoji: '💼', tagline: 'Professional & Strong' },
        fun: { gradient: 'linear-gradient(135deg, #f39c12 0%, #ff6b6b 100%)', emoji: '🎉', tagline: 'Fun & Playful' },
        night: { gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', emoji: '🌙', tagline: 'Dark & Mysterious' }
    };
    
    const textLower = text.toLowerCase();
    for (const [key, theme] of Object.entries(themes)) {
        if (textLower.includes(key)) return theme;
    }
    
    return { gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', emoji: '✨', tagline: 'Special & Memorable' };
}

async function downloadPNG() {
    try {
        const canvas = await html2canvas(document.getElementById('cardPreview'), { 
            scale: 3,
            backgroundColor: null,
            useCORS: true,
            allowTaint: true,
            imageTimeout: 0
        });
        const link = document.createElement('a');
        link.download = `${state.recipientName}_card.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        showMessage('Downloaded PNG! (High Quality)', 'success');
    } catch (error) {
        showMessage('Error downloading', 'error');
    }
}

async function downloadPDF() {
    try {
        const canvas = await html2canvas(document.getElementById('cardPreview'), { 
            scale: 3,
            backgroundColor: null,
            useCORS: true,
            allowTaint: true,
            imageTimeout: 0
        });
        if (!window.jsPDF) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            document.head.appendChild(script);
            await new Promise(resolve => script.onload = resolve);
        }
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 277);
        pdf.save(`${state.recipientName}_card.pdf`);
        showMessage('Downloaded PDF! (High Quality)', 'success');
    } catch (error) {
        showMessage('Error: Try PNG instead', 'error');
    }
}

function showMessage(msg, type) {
    const alertEl = document.getElementById('messageAlert');
    alertEl.className = type === 'error' ? 'error-message' : (type === 'success' ? 'success-message' : 'loading');
    alertEl.textContent = msg;
    
    if (type !== 'loading') {
        setTimeout(() => {
            alertEl.textContent = '';
            alertEl.className = '';
        }, 3000);
    }
}

// FAQ toggle
function toggleFAQ(questionEl) {
    const answerEl = questionEl.nextElementSibling;
    if (!answerEl || !answerEl.classList.contains('faq-answer')) {
        return;
    }

    questionEl.classList.toggle('active');
    answerEl.classList.toggle('show');
}

// Show sharing and gallery sections when card is generated
function showSharingAndGallery() {
    document.getElementById('sharingSection').classList.remove('hidden');
    document.getElementById('eventGallery').classList.remove('hidden');
    const quickActions = document.getElementById('quickActionsGroup');
    if (quickActions) {
        quickActions.classList.remove('hidden');
    }
}

// Social Media Sharing Functions
function shareOnFacebook() {
    const eventName = getEventDisplayName();
    const text = `Check out this beautiful ${eventName} card I created for ${state.recipientName}! Created with SoulVest Card Generator 💖`;
    const url = `https://www.facebook.com/sharer/sharer.php?quote=${encodeURIComponent(text)}&hashtag=%23SoulVest`;
    window.open(url, 'facebook-share', 'width=600,height=400');
}

function shareOnInstagram() {
    const eventName = getEventDisplayName();
    const text = `Created a personalized ${eventName} card for ${state.recipientName}! 🎉✨ Made with love using SoulVest Card Generator 💖\n\nDownload the card and share it on Instagram!\n\n#SoulVest #PersonalizedCards #${getEventTag()} #SpreadLove #GiftIdeas`;
    alert('📱 Instagram Sharing:\n\n1. Download your card as PNG\n2. Open Instagram app\n3. Create a new post\n4. Upload the downloaded card image\n5. Copy this caption:\n\n' + text);
    // Automatically copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
        console.log('Caption copied to clipboard!');
    }).catch(err => {
        console.log('Copy caption manually');
    });
}

function shareOnWhatsApp() {
    const eventName = getEventDisplayName();
    const text = `Hi! 👋 I created a beautiful personalized ${eventName} card for ${state.recipientName}! 🎉 Check it out - made with SoulVest Card Generator! 💖`;
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
}

function shareViaEmail() {
    const eventName = getEventDisplayName();
    const subject = `Beautiful ${eventName} Card for ${state.recipientName}`;
    const body = `Hi!\n\nI created a personalized ${eventName} card for ${state.recipientName} using SoulVest Card Generator!\n\nMessage: ${state.generatedMessage || state.userMessage}\n\nDownload your card as PNG or PDF!\n\nMade with 💖\nSoulVest Card Generator`;
    const url = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = url;
}

function shareOnLinkedIn() {
    const eventName = getEventDisplayName();
    const text = `Excited to share that I just created a personalized ${eventName} card using SoulVest Card Generator! 🎉 It's amazing how personalized digital greetings can bring people closer. Check it out! 💖 #PersonalizedCards #GiftCards`;
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=soulvest.com`;
    window.open(url, 'linkedin-share', 'width=600,height=400');
}

// Quick Event Selection
function quickSelectEvent(eventType, clickedElement) {
    document.getElementById('eventType').value = eventType;
    updateHobbies();
    document.getElementById('recipientName').focus();
    
    // Visual feedback
    const badges = document.querySelectorAll('.event-badge');
    badges.forEach(badge => badge.classList.remove('selected'));
    if (clickedElement) {
        clickedElement.classList.add('selected');
    }
}

