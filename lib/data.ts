// ─── SCHOOL INFO ────────────────────────────────────────────────────────────
export const SCHOOL_INFO = {
  name: "Anupam Vidya Sadan",
  tagline: "Nurturing Minds, Shaping Futures",
  description:
    "A premier educational institution in the heart of Nepal, committed to academic excellence, moral values, and holistic development of every student since 1998.",
  estYear: 1998,
  address: "Lazimpat, Kathmandu, Bagmati Province, Nepal",
  phone: "+977-01-4412345",
  email: "info@anupamvidyasadan.edu.np",
  website: "www.anupamvidyasadan.edu.np",
  social: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    youtube: "https://youtube.com",
    instagram: "https://instagram.com",
  },
};

// ─── NAVIGATION ─────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Notices", href: "/notices" },
  { label: "Contact", href: "/contact" },
];

export const QUICK_ACTIONS = [
  {
    label: "ERP",
    href: "https://nervous-carson-f39e40.netlify.app/",
    icon: "🗂️",
  },
  { label: "LMS", href: "https://sara-school.netlify.app/", icon: "📚" },
  { label: "Online Class", href: "https://anupam.edu.np/online_class", icon: "🎓" },
];

// ─── NOTICE POPUP ────────────────────────────────────────────────────────────
export const POPUP_NOTICE = {
  title: "Admission Open – 2081/82",
  body: "Anupam Vidya Sadan is pleased to announce admissions for the academic year 2081/82 (2024/25). Limited seats available for Grades 1–10. Early registration is encouraged. Please visit the school office or call us for details.",
  date: "Chaitra 15, 2081",
  badge: "Important Notice",
};

// ─── PRINCIPAL ───────────────────────────────────────────────────────────────
export const PRINCIPAL = {
  name: "Dr. Sunita Shrestha",
  title: "Principal & Founder",
  image:
    "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop",
  quote:
    "Education is not the filling of a bucket, but the lighting of a fire. At Anupam Vidya Sadan, we ignite curiosity and build character alongside academic brilliance.",
  message:
    "With more than two decades of experience in shaping young minds, our school stands as a beacon of quality education rooted in Nepali values. We blend modern pedagogy with timeless wisdom to prepare students for a rapidly changing world.",
};

// ─── FACILITIES ──────────────────────────────────────────────────────────────
export const FACILITIES = [
  {
    id: 1,
    title: "Library",
    description:
      "A vast collection of Nepali and international books, digital resources, and reading spaces that inspire a love for learning.",
    icon: "📖",
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: 2,
    title: "Science Lab",
    description:
      "Fully equipped physics, chemistry, and biology laboratories with modern instruments to bring science to life.",
    icon: "🔬",
    color: "from-teal-500 to-cyan-600",
  },
  {
    id: 3,
    title: "Computer Lab",
    description:
      "State-of-the-art computer lab with high-speed internet, ensuring every student is digitally literate and future-ready.",
    icon: "💻",
    color: "from-violet-500 to-purple-600",
  },
  {
    id: 4,
    title: "Sports Ground",
    description:
      "Spacious ground for cricket, football, volleyball and athletics — promoting health, teamwork, and sportsmanship.",
    icon: "⚽",
    color: "from-green-500 to-emerald-600",
  },
  {
    id: 5,
    title: "Safe Environment",
    description:
      "CCTV-monitored campus, trained staff, and clear protocols ensure a secure and nurturing environment for all students.",
    icon: "🛡️",
    color: "from-orange-500 to-amber-600",
  },
  {
    id: 6,
    title: "Creative Activities",
    description:
      "Art, music, dance, and drama programmes that nurture creativity and help students discover their unique talents.",
    icon: "🎨",
    color: "from-pink-500 to-rose-600",
  },
];

// ─── NEWS / NOTICES ──────────────────────────────────────────────────────────
export const NEWS_POSTS = [
  {
    id: 1,
    slug: "annual-sports-day-2024",
    title: "Annual Sports Day 2081 – A Day of Champions",
    excerpt:
      "Students from all grades competed with great spirit in this year's Annual Sports Day held at our school grounds on Falgun 20.",
    content: `
      <p>Anupam Vidya Sadan held its much-anticipated Annual Sports Day on Falgun 20, 2081, with students, parents, and staff joining in joyful celebration of athletics and teamwork.</p>
      <p>The event featured competitive races, team sports, and individual athletic events across all grade levels. Special recognition was given to students who demonstrated exceptional sportsmanship and perseverance.</p>
      <h2>Highlights of the Day</h2>
      <p>The 100m sprint was the most thrilling event, with Grade 9 student Arjun Tamang setting a new school record. The girls' relay team from Grade 8 also gave an outstanding performance, winning gold.</p>
      <p>Principal Dr. Sunita Shrestha addressed the gathering, emphasizing that sports build character, discipline, and resilience — values at the heart of Anupam Vidya Sadan's mission.</p>
      <h2>Prize Distribution</h2>
      <p>Chief Guest Mr. Ramesh Karki, a noted educationist, distributed prizes to winners across all categories. Every participant received a certificate of participation.</p>
      <p>The event concluded with a cultural programme by students of the primary section, delighting parents and staff alike.</p>
    `,
    image:
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=500&fit=crop",
    category: "Events",
    date: "Falgun 20, 2081",
    author: "School Administration",
  },
  {
    id: 2,
    slug: "board-exam-results-2081",
    title: "Outstanding SEE Results – 98% Distinction Pass Rate",
    excerpt:
      "Our Grade 10 students have once again made the school proud with exceptional results in the SEE examinations.",
    content: `
      <p>We are thrilled to announce that students of Anupam Vidya Sadan achieved outstanding results in the Secondary Education Examination (SEE) 2081, with a 98% distinction pass rate — our highest ever.</p>
      <p>Seventeen students scored a perfect GPA of 4.0, and the school's overall average GPA stood at 3.87, ranking us among the top schools in Bagmati Province.</p>
      <h2>Top Achievers</h2>
      <p>Priya Adhikari topped the school with a GPA of 4.0 across all subjects. Her dedication and consistent hard work serve as an inspiration to all students.</p>
      <p>Principal Dr. Sunita Shrestha congratulated all students and extended heartfelt thanks to the teaching faculty for their relentless efforts.</p>
    `,
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=500&fit=crop",
    category: "Academics",
    date: "Ashadh 10, 2081",
    author: "Exam Department",
  },
  {
    id: 3,
    slug: "new-science-lab-inauguration",
    title: "New Digital Science Laboratory Inaugurated",
    excerpt:
      "The school proudly opens its brand-new, fully-equipped digital science laboratory — a milestone for science education.",
    content: `
      <p>Anupam Vidya Sadan proudly inaugurated its new state-of-the-art Digital Science Laboratory on Baisakh 5, 2081. The lab is equipped with modern instruments, digital microscopes, and smart boards for interactive learning.</p>
      <p>The inauguration was graced by the presence of distinguished guests from the education sector and parents who have long supported the school's infrastructure development.</p>
    `,
    image:
      "https://images.unsplash.com/photo-1532094349884-543559196e14?w=800&h=500&fit=crop",
    category: "Infrastructure",
    date: "Baisakh 5, 2081",
    author: "School Administration",
  },
  {
    id: 4,
    slug: "notice-admission-open-2082",
    title: "Admission Open for Academic Year 2081/82",
    excerpt:
      "Applications are now open for all grades for the upcoming academic session. Apply before Chaitra 30 to secure your seat.",
    content: `
      <p>Anupam Vidya Sadan invites applications from motivated students for admission to Classes 1 through 10 for the academic year 2081/82.</p>
      <p>Interested students must submit their application along with previous academic records, birth certificate, and two passport-size photographs at the school office.</p>
      <h2>Admission Schedule</h2>
      <p>Application deadline: Chaitra 30, 2081. Entrance test: Baisakh 5, 2082. Results announcement: Baisakh 10, 2082.</p>
    `,
    image:
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=500&fit=crop",
    category: "Notice",
    date: "Chaitra 1, 2081",
    author: "Admission Office",
  },
  {
    id: 5,
    slug: "inter-school-quiz-competition",
    title: "Students Win Gold at Inter-School Quiz Competition",
    excerpt:
      "Our students brought home gold from the Bagmati Province Inter-School General Knowledge Quiz held in Hetauda.",
    content: `
      <p>A team of four students from Anupam Vidya Sadan represented the school at the Bagmati Province Inter-School Quiz Competition and emerged victorious, winning the gold award.</p>
      <p>The competition saw participation from 48 schools across the province, making the achievement all the more impressive.</p>
    `,
    image:
      "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?w=800&h=500&fit=crop",
    category: "Achievements",
    date: "Magh 14, 2081",
    author: "Student Affairs",
  },
  {
    id: 6,
    slug: "teacher-training-programme",
    title: "Faculty Completes Modern Pedagogy Training",
    excerpt:
      "All teaching staff completed a 5-day professional development workshop on child-centred and technology-integrated teaching methods.",
    content: `
      <p>In our continued commitment to teaching excellence, the entire faculty of Anupam Vidya Sadan recently completed a comprehensive five-day training on modern pedagogical approaches.</p>
      <p>The workshop, conducted by experts from Tribhuvan University's Faculty of Education, covered child-centred learning, digital tools integration, formative assessment, and inclusive education strategies.</p>
    `,
    image:
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=500&fit=crop",
    category: "Faculty",
    date: "Poush 22, 2081",
    author: "Principal Office",
  },
];

export const NEWS_CATEGORIES = [
  "All",
  "Events",
  "Academics",
  "Notice",
  "Achievements",
  "Infrastructure",
  "Faculty",
];

// ─── GALLERY ─────────────────────────────────────────────────────────────────
export const GALLERY_IMAGES = [];

export const GALLERY_CATEGORIES = [
  "All",
  "Campus",
  "Events",
  "Academic",
  "Facilities",
  "Achievements",
  "Sports",
  "Faculty",
];

// ─── STATS ───────────────────────────────────────────────────────────────────
export const STATS = [
  { label: "Years of Excellence", value: "25+", icon: "🏛️" },
  { label: "Students Enrolled", value: "1,200+", icon: "👨‍🎓" },
  { label: "Qualified Teachers", value: "60+", icon: "👩‍🏫" },
  { label: "Pass Rate", value: "99%", icon: "🏆" },
];

// ─── SCHOOL VALUES ───────────────────────────────────────────────────────────
export const VALUES = [
  {
    title: "Academic Excellence",
    description:
      "We hold the highest standards in curriculum delivery and student achievement.",
    icon: "📐",
  },
  {
    title: "Moral Integrity",
    description:
      "Character and values are as important as grades in shaping responsible citizens.",
    icon: "⚖️",
  },
  {
    title: "Inclusive Learning",
    description:
      "Every student is unique; our approach celebrates diversity and individual strengths.",
    icon: "🤝",
  },
  {
    title: "Community Spirit",
    description:
      "We foster a warm, supportive community among students, teachers, and families.",
    icon: "🌱",
  },
];
