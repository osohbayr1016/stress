import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";
import {
  Brain,
  Clock,
  ShieldCheck,
  Activity,
  HeartHandshake,
  Sparkles,
  Zap,
  Users,
  Target,
  CloudRain,
  Compass,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Home,
  Menu,
  X,
  BookOpen,
  Award,
  Smile,
  FileText,
  UserCheck,
} from "lucide-react";

const quizQuestions = [
  {
    q: "Ойрын үед та хэр зэрэг амархан бухимдаж, уурлаж байна вэ?",
    options: [
      { text: "Бараг үгүй / Хэвийн", score: 0 },
      { text: "Заримдаа / Дунд зэрэг", score: 1 },
      { text: "Маш их / Тогтмол", score: 2 },
    ],
  },
  {
    q: "Шөнө нойр хулжих, эсвэл ойр ойрхон сэрж сэтгэл түгших шинж тэмдэг илэрч байна уу?",
    options: [
      { text: "Илэрдэггүй", score: 0 },
      { text: "Хааяа илэрдэг", score: 1 },
      { text: "Байнга илэрдэг", score: 2 },
    ],
  },
  {
    q: "Анхаарал төвлөрөх чадвар буурч, ажил/хичээлийн бүтээмж муудсан уу?",
    options: [
      { text: "Үгүй, хэвийн байгаа", score: 0 },
      { text: "Бага зэрэг нөлөөлсөн", score: 1 },
      { text: "Тийм, маш их нөлөөлсөн", score: 2 },
    ],
  },
  {
    q: "Сэтгэл зүйн дарамтаас үүдэлтэй бие махбодын өөрчлөлт (булчин чангарах, зүрх дэлсэх) илэрч байна уу?",
    options: [
      { text: "Үгүй, илэрдэггүй", score: 0 },
      { text: "Заримдаа илэрдэг", score: 1 },
      { text: "Байнга илэрдэг", score: 2 },
    ],
  },
];

// Information config for Mega Menu / Router list
const topicPages = [
  {
    id: "definition",
    path: "/definition",
    num: "01",
    title: "Стресс гэж юу вэ?",
    desc: 'Аюул болон дарамтад үзүүлж буй бидний бие махбодын "Тэмц эсвэл Зугт" биологийн хамгаалалтын механизм.',
    icon: <Brain size={22} />,
    duration: "2 мин унших",
  },
  {
    id: "management",
    path: "/management",
    num: "02",
    title: "Стресс зохицуулалт",
    desc: "Стрессийг удирдах, түүний амьдрал болон эрүүл мэндэд үзүүлэх өндөр ач холбогдлууд.",
    icon: <HeartHandshake size={22} />,
    duration: "3 мин унших",
  },
  {
    id: "causes",
    path: "/causes",
    num: "03",
    title: "Стресс үүсэх шалтгаан",
    desc: "Ажил, сургууль, нийгэм, хувийн хүчин зүйл болон орчны стресс үүсгэгч хүчин зүйлс.",
    icon: <Zap size={22} />,
    duration: "3 мин унших",
  },
  {
    id: "duration",
    path: "/duration",
    num: "04",
    title: "Стресс үргэлжлэх хугацаа",
    desc: "Түр зуурын цочмог стресс (Acute) болон удаан хугацааны архаг стресс (Chronic) ялгаа, хор нөлөө.",
    icon: <Clock size={22} />,
    duration: "2 мин унших",
  },
  {
    id: "prevention",
    path: "/prevention",
    num: "05",
    title: "Урьдчилан сэргийлэх",
    desc: "Цагийн менежмент, дасгал хөдөлгөөн, татгалзаж сурах болон эрүүл амьдралын зөв хэвшил.",
    icon: <ShieldCheck size={22} />,
    duration: "3 мин унших",
  },
  {
    id: "breathing",
    path: "/breathing",
    num: "06",
    title: "Амьсгалын дасгал",
    desc: "4-7-8 амьсгалын дасгалаар зүрхний цохилтыг удаашруулж, бие махбодоо хэдхэн минутад тайвшруулах.",
    icon: <Compass size={22} />,
    duration: "4 мин дасгал",
  },
];

const pagesOrder = [
  "/",
  "/definition",
  "/management",
  "/causes",
  "/duration",
  "/prevention",
  "/breathing",
];

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visitedPages, setVisitedPages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("visited_pages") || "[]");
    } catch {
      return [];
    }
  });

  // Quiz states
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizResult, setQuizResult] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("stress_quiz_result")) || null;
    } catch {
      return null;
    }
  });

  // Certificate state
  const [studentName, setStudentName] = useState(() => {
    return localStorage.getItem("student_name") || "";
  });
  const [showCertificate, setShowCertificate] = useState(false);

  const handleQuizAnswer = (points) => {
    const nextScore = quizScore + points;
    setQuizScore(nextScore);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      let level = "Бага стресс";
      let desc =
        "Таны стрессийн түвшин одоогоор хэвийн хэмжээнд байна. Эрүүл зөв дадал хэвшлийг хадгалж, сэргийлэх модулийг уншихыг зөвлөж байна.";
      let recPath = "/prevention";
      let recTitle = "Модуль 05: Урьдчилан сэргийлэх";

      if (nextScore >= 6) {
        level = "Өндөр стресс";
        desc =
          "Танд маш өндөр стресс, ачаалал хуримтлагджээ. Амьсгалын интерактив дасгал болон даван туулах аргуудыг нэн даруй хэрэгжүүлэхийг зөвлөж байна.";
        recPath = "/breathing";
        recTitle = "Модуль 06: Амьсгалын дасгал";
      } else if (nextScore >= 3) {
        level = "Дунд зэргийн стресс";
        desc =
          "Танд тодорхой хэмжээний сэтгэл зүйн дарамт, стресс үүссэн байна. Стресс менежмент болон зохицуулах аргуудыг судалж эхлээрэй.";
        recPath = "/management";
        recTitle = "Модуль 02: Стресс зохицуулалт";
      }

      const result = { level, desc, recPath, recTitle, score: nextScore };
      setQuizResult(result);
      localStorage.setItem("stress_quiz_result", JSON.stringify(result));
      setQuizActive(false);
    }
  };

  const resetQuiz = () => {
    setQuizActive(true);
    setCurrentQuestion(0);
    setQuizScore(0);
  };

  const location = useLocation();
  const navigate = useNavigate();

  const markTopicVisited = (path) => {
    if (!topicPages.some((page) => page.path === path)) return;
    setVisitedPages((prev) => {
      if (prev.includes(path)) return prev;
      const updated = [...prev, path];
      localStorage.setItem("visited_pages", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    const path = location.pathname;
    const frame = requestAnimationFrame(() => {
      markTopicVisited(path);
    });
    return () => cancelAnimationFrame(frame);
  }, [location.pathname]);

  // Page Routing Navigation Helper
  const navigateTo = (path) => {
    navigate(path);
    setMenuOpen(false);
    markTopicVisited(path);
  };

  const getPageInfo = (path) => {
    const idx = pagesOrder.indexOf(path);
    return {
      index: idx,
      next: idx < pagesOrder.length - 1 ? pagesOrder[idx + 1] : null,
      prev: idx > 0 ? pagesOrder[idx - 1] : null,
    };
  };

  const { next: nextPage, prev: prevPage } = getPageInfo(location.pathname);

  const getNavProgress = () => {
    const idx = pagesOrder.indexOf(location.pathname);
    if (idx === -1) return 0;
    return (idx / (pagesOrder.length - 1)) * 100;
  };

  // Visited progress metrics
  const totalTopics = topicPages.length;
  const completedTopicsCount = visitedPages.filter((p) =>
    topicPages.some((tp) => tp.path === p),
  ).length;
  const progressPercent = Math.round(
    (completedTopicsCount / totalTopics) * 100,
  );

  // Shared subpage footer navigator
  const renderPageFooter = () => {
    return (
      <div className="page-navigation-footer">
        <button className="sec-btn" onClick={() => navigateTo(prevPage || "/")}>
          <ChevronLeft size={18} /> Өмнөх модуль
        </button>
        <button className="sec-btn" onClick={() => navigateTo("/")}>
          <Home size={16} /> Сургалтын танхим руу
        </button>
        {nextPage ? (
          <button className="cta-btn" onClick={() => navigateTo(nextPage)}>
            Дараагийн модуль <ChevronRight size={18} />
          </button>
        ) : (
          <button className="cta-btn" onClick={() => navigateTo("/")}>
            Сургалт дуусгах <ChevronRight size={18} />
          </button>
        )}
      </div>
    );
  };

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4, ease: "easeOut" },
  };

  return (
    <div className="app-container">
      {/* Background Animated Gradient Mesh */}
      <div className="bg-mesh">
        <div className="mesh-circle mesh-circle-1"></div>
        <div className="mesh-circle mesh-circle-2"></div>
        <div className="mesh-circle mesh-circle-3"></div>
      </div>

      {/* Sticky Header Navbar */}
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navigateTo("/")}>
          <Brain size={26} />
          <span>STRESS.mn Академи</span>
        </div>
        <div className="nav-links">
          <button
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => navigateTo("/")}
          >
            Сургалтын танхим
          </button>
          {topicPages.map((page) => (
            <button
              key={page.id}
              className={`nav-link ${location.pathname === page.path ? "active" : ""}`}
              onClick={() => navigateTo(page.path)}
            >
              Модуль {page.num}
            </button>
          ))}
        </div>
        <div className="nav-controls">
          {/* Informative Progress Hub Badge */}
          <div className="nav-progress-badge" onClick={() => setMenuOpen(true)}>
            <div className="progress-badge-ring">
              <svg width="28" height="28" viewBox="0 0 36 36">
                <path
                  className="ring-bg"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="3"
                />
                <path
                  className="ring-fill"
                  strokeDasharray={`${progressPercent}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="progress-badge-text">{progressPercent}%</span>
            </div>
          </div>

          {/* Hamburger Drawer Toggle Button */}
          <button
            className="menu-toggle-btn"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${getNavProgress()}%` }}
          ></div>
        </div>
      </nav>

      {/* INFORMATIVE MEGA DRAWER NAVIGATION */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <motion.div
              className="drawer-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer Container */}
            <motion.div
              className="drawer-container"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
            >
              <div className="drawer-header">
                <div className="drawer-brand">
                  <BookOpen size={22} style={{ color: "var(--accent)" }} />
                  <span>Хөтөлбөрийн явц</span>
                </div>
                <button
                  className="drawer-close"
                  onClick={() => setMenuOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Progress Summary Section */}
              <div className="drawer-progress-box">
                <div className="dp-meta">
                  <span className="dp-label">Таны судалсан явц</span>
                  <span className="dp-count">
                    {completedTopicsCount} / {totalTopics} модуль
                  </span>
                </div>
                <div className="dp-bar-bg">
                  <div
                    className="dp-bar-fill"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <p className="dp-slogan">
                  {progressPercent === 100
                    ? "Баяр хүргэе! Та стресс бууруулах хөтөлбөрийг 100% судалж дуусгалаа. Сертификатаа татаж авна уу."
                    : "Сургалтын дараах модулиудыг судалж, стресс менежментийн сертификатаа аваарай."}
                </p>
              </div>

              {/* Info about the Info Grid */}
              <div className="drawer-items-list">
                {topicPages.map((page) => {
                  const isCurrent = location.pathname === page.path;
                  const isVisited = visitedPages.includes(page.path);

                  let badgeText = "Судлаагүй";
                  let badgeClass = "badge-unread";
                  if (isCurrent) {
                    badgeText = "Судалж байна";
                    badgeClass = "badge-current";
                  } else if (isVisited) {
                    badgeText = "Судалж дууссан";
                    badgeClass = "badge-visited";
                  }

                  return (
                    <div
                      key={page.id}
                      className={`drawer-card ${isCurrent ? "active" : ""} ${isVisited ? "visited" : ""}`}
                      onClick={() => navigateTo(page.path)}
                    >
                      <div className="dc-header">
                        <span className="dc-num">Модуль {page.num}</span>
                        <span className="dc-icon-box">{page.icon}</span>
                        <span className={`dc-badge ${badgeClass}`}>
                          {badgeText}
                        </span>
                      </div>
                      <div className="dc-body">
                        <h4 className="dc-title">{page.title}</h4>
                        <p className="dc-desc">{page.desc}</p>
                      </div>
                      <div className="dc-footer">
                        <span className="dc-time">{page.duration}</span>
                        <ChevronRight size={14} className="dc-arrow" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Multi-page routing layout area */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div key="home" className="page-wrapper" {...pageVariants}>
                <div className="page-container">
                  {/* Home Hero - Course Header */}
                  <div className="home-hero">
                    <span className="home-tag">
                      <Sparkles size={16} />
                      Мэргэжлийн онлайн курс
                    </span>
                    <h1 className="home-title">
                      Стресс Менежмент & Сэтгэл Зүйн Эрүүл Мэнд
                    </h1>
                    <p className="home-description">
                      Шинжлэх ухааны үндэслэлтэй арга зүй, интерактив сорил
                      болон дасгалуудаар дамжуулан сэтгэл зүйн тэсвэр хатуужлаа
                      нэмэгдүүлж, өдөр тутмын стрессээ зөв удирдан сураарай.
                    </p>
                    <div className="hero-cta-group">
                      <button
                        className="cta-btn primary-hero-btn"
                        onClick={() => navigateTo("/definition")}
                      >
                        1-р Модулиас эхлэх <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Interactive Assessment & Course Progress Hub */}
                  <div className="course-hub-grid">
                    <div className="hub-card">
                      <div className="hub-card-header">
                        <FileText
                          size={22}
                          style={{ color: "var(--primary)" }}
                        />
                        <h3>Стрессийн түвшин тодорхойлох сорил</h3>
                      </div>
                      <div
                        className={`hub-card-body ${quizActive ? "quiz-active-body" : ""}`}
                      >
                        {quizActive ? (
                          <>
                            <span className="quiz-progress-lbl">
                              Асуулт {currentQuestion + 1} /{" "}
                              {quizQuestions.length}
                            </span>
                            <p className="quiz-question-txt">
                              {quizQuestions[currentQuestion].q}
                            </p>
                            <div className="quiz-options-list">
                              {quizQuestions[currentQuestion].options.map(
                                (opt, idx) => (
                                  <button
                                    key={idx}
                                    className="quiz-opt-btn"
                                    onClick={() => handleQuizAnswer(opt.score)}
                                  >
                                    {opt.text}
                                  </button>
                                ),
                              )}
                            </div>
                          </>
                        ) : quizResult ? (
                          <>
                            <div className="result-badge-container">
                              Үр дүн:
                              <span
                                className={`result-level-badge ${
                                  quizResult.score >= 6
                                    ? "high-stress"
                                    : quizResult.score >= 3
                                      ? "mid-stress"
                                      : "low-stress"
                                }`}
                              >
                                {quizResult.level}
                              </span>
                            </div>
                            <p className="quiz-result-desc">{quizResult.desc}</p>
                            <div className="quiz-recommendation-box">
                              <span className="rec-lbl">Зөвлөмж</span>
                              <button
                                className="rec-btn-link"
                                onClick={() => navigateTo(quizResult.recPath)}
                              >
                                {quizResult.recTitle}{" "}
                                <ChevronRight size={16} />
                              </button>
                            </div>
                            <button
                              className="sec-btn"
                              onClick={resetQuiz}
                              style={{ marginTop: "1rem" }}
                            >
                              Дахин өгөх
                            </button>
                          </>
                        ) : (
                          <>
                            <p>
                              4 асуултаар стрессийн түвшинг тодоройлж, танд
                              тохирсон модульд чиглүүлнэ.
                            </p>
                            <button className="cta-btn" onClick={resetQuiz}>
                              Сорил эхлүүлэх <ChevronRight size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="hub-card">
                      <div className="hub-card-header">
                        <Award size={22} style={{ color: "var(--accent)" }} />
                        <h3>Сургалтын сертификат</h3>
                      </div>
                      <div className="hub-card-body">
                        <div className="cert-progress-wrapper">
                          <div className="cert-progress-meta">
                            <span>Модулийн явц</span>
                            <span>
                              {completedTopicsCount} / {totalTopics}
                            </span>
                          </div>
                          <div className="cert-progress-bar-bg">
                            <div
                              className="cert-progress-bar-fill"
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>
                        </div>
                        {progressPercent === 100 ? (
                          <div className="cert-unlocked-msg">
                            <p className="unlocked-lbl">
                              Сертификат нээгдлээ!
                            </p>
                            <div className="name-input-wrapper">
                              <input
                                className="student-name-input"
                                placeholder="Суралцагчийн нэрээ оруулна уу"
                                value={studentName}
                                onChange={(e) => {
                                  setStudentName(e.target.value);
                                  localStorage.setItem(
                                    "student_name",
                                    e.target.value,
                                  );
                                }}
                              />
                            </div>
                            <button
                              className="cta-btn"
                              onClick={() => setShowCertificate(true)}
                            >
                              Сертификат харах <Award size={18} />
                            </button>
                          </div>
                        ) : (
                          <div className="cert-locked-msg">
                            <p>
                              Бүх 6 модулиудыг судалсны дараа төгсөлтийн
                              сертификатаа авах боломжтой.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Course Syllabus / Modules Grid */}
                  <div className="syllabus-header-section">
                    <span className="section-tag">
                      <BookOpen size={16} /> Курсын хөтөлбөр
                    </span>
                    <h2 className="syllabus-title">
                      Сургалтын үндсэн 6 модуль
                    </h2>
                    <p className="syllabus-subtitle">
                      Хичээл бүрийг дарааллын дагуу судалж, дадлага ажлуудыг
                      тогтмол хийхийг зөвлөж байна.
                    </p>
                  </div>

                  <div className="dashboard-grid">
                    {topicPages.map((page) => (
                      <div
                        key={page.id}
                        className="db-card"
                        onClick={() => navigateTo(page.path)}
                      >
                        <div className="db-card-image-box">
                          <span className="db-card-overlay">
                            Модуль {page.num}
                          </span>
                          <img
                            src={`/${page.id}.png`}
                            alt={page.title}
                            className="db-card-image"
                          />
                        </div>
                        <div className="db-card-content">
                          <h3 className="db-card-title">{page.title}</h3>
                          <p className="db-card-desc">{page.desc}</p>
                          <span className="db-card-footer">
                            Судалж эхлэх ({page.duration}){" "}
                            <ChevronRight size={16} />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Instructors & Why this Course Section */}
                  <div className="instructors-section">
                    <div className="ins-header">
                      <span className="section-tag">
                        <UserCheck size={16} /> Мэргэжилтэн багш нар
                      </span>
                      <h2 className="ins-title">Хэн заах вэ?</h2>
                    </div>
                    <div className="ins-grid">
                      <div className="ins-card">
                        <div className="ins-avatar-placeholder">
                          <Smile size={28} />
                        </div>
                        <div className="ins-info">
                          <h4>Доктор Г. Ариунзаяа</h4>
                          <p className="ins-role">Сэтгэл зүйн эмч</p>
                          <p className="ins-bio">
                            15+ жилийн туршлагатай сэтгэл зүйн эмч. Стресс
                            менежмент, когнитив зан үйлийн эмчилгээний чиглэлээр
                            мэргэшсэн.
                          </p>
                        </div>
                      </div>
                      <div className="ins-card">
                        <div className="ins-avatar-placeholder">
                          <Brain size={28} />
                        </div>
                        <div className="ins-info">
                          <h4>Проф. Б. Энхтуяа</h4>
                          <p className="ins-role">Сэтгэл зүйн судлаач</p>
                          <p className="ins-bio">
                            МУИС-ийн Сэтгэл зүй, Боловсролын Сургалтын
                            Төвийн профессор. Стрессийн биологийн механизм,
                            урьдчилан сэргийлэх арга зүйн судалгаа хөтөлдөг.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certificate Modal Lightbox */}
                <AnimatePresence>
                  {showCertificate && (
                    <motion.div
                      className="modal-overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowCertificate(false)}
                    >
                      <motion.div
                        className="certificate-modal-content"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="modal-close-btn"
                          onClick={() => setShowCertificate(false)}
                        >
                          <X size={24} />
                        </button>

                        <div className="certificate-frame">
                          <div className="cert-border-double">
                            <div className="cert-body-inner">
                              <div className="cert-header">
                                <Award size={56} className="cert-medal-icon" />
                                <h2>ТӨГСӨЛТИЙН СЕРТИФИКАТ</h2>
                                <p className="cert-sub">
                                  STRESS.MN ОНЛАЙН СУРГАЛТЫН АКАДЕМИ
                                </p>
                              </div>

                              <div className="cert-content">
                                <p className="cert-txt-light">
                                  Энэхүү гэрчилгээг стресс зохицуулалтын цогц
                                  курсыг амжилттай судалж төгссөн
                                </p>
                                <h1 className="cert-student-name">
                                  {studentName || "[Суралцагчийн нэр]"}
                                </h1>
                                <p className="cert-txt-light">
                                  анд стресс менежмент болон сэтгэл зүйн тэсвэр
                                  хатуужлын үндсэн онол, интерактив аргуудыг
                                  амжилттай эзэмшсэн тул олгов.
                                </p>
                              </div>

                              <div className="cert-footer">
                                <div className="cert-sign">
                                  <div className="sign-line"></div>
                                  <p>Хөтөлбөрийн удирдагч</p>
                                  <span>Доктор Г. Ариунзаяа</span>
                                </div>
                                <div className="cert-date">
                                  <div className="sign-line"></div>
                                  <p>Олгосон огноо</p>
                                  <span>{new Date().toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            }
          />

          <Route
            path="/definition"
            element={
              <motion.div
                key="definition"
                className="page-wrapper"
                {...pageVariants}
              >
                <div className="page-container">
                  <div className="content-grid">
                    <div className="section-content">
                      <span className="section-tag">
                        <Activity size={16} /> Модуль 01
                      </span>
                      <h1 className="section-title">Стресс гэж юу вэ?</h1>
                      <p className="section-description">
                        Стресс гэдэг нь гадны ямар нэгэн ачаалал, дарамтад
                        үзүүлж буй бидний сэтгэл зүй болон бие махбодын
                        биологийн хариу үйлдэл юм. Аюул эсвэл хүндрэлтэй
                        тулгарах үед тархи "Тэмц эсвэл Зугт" (Fight-or-Flight)
                        горимыг идэвхжүүлж, адреналин болон кортизол дааврыг
                        цусанд шахдаг. Энэ нь зүрхний цохилт, цусны даралтыг
                        ихэсгэж, биднийг аюулаас хамгаалахад дайчилж өгдөг
                        төрөлхийн систем юм.
                      </p>
                    </div>
                    <div className="section-visual-container">
                      <div className="visual-image-wrapper">
                        <img
                          src="/definition.png"
                          alt="Definition"
                          className="visual-image"
                        />
                      </div>
                    </div>
                  </div>
                  {renderPageFooter()}
                </div>
              </motion.div>
            }
          />

          <Route
            path="/management"
            element={
              <motion.div
                key="management"
                className="page-wrapper"
                {...pageVariants}
              >
                <div className="page-container">
                  <span className="section-tag">
                    <HeartHandshake size={16} /> Модуль 02
                  </span>
                  <h1
                    className="section-title"
                    style={{ marginBottom: "2rem" }}
                  >
                    Стресс зохицуулалт ба Ач холбогдол
                  </h1>

                  <div className="management-grid" style={{ marginTop: "0" }}>
                    <div className="management-card">
                      <h3 className="management-card-title">
                        <Compass size={22} /> СТРЕССИЙГ ЗОХИЦУУЛАХ ГЭЖ ЮУ ВЭ?
                      </h3>
                      <div className="management-list">
                        <div className="management-item">
                          <span className="management-bullet">
                            <CheckCircle2 size={16} />
                          </span>
                          <p>
                            Стресс нь өдөр тутмын амьдралын шаардлага,
                            өөрчлөлтөд өгч буй бие махбод болон оюун санааны
                            хариу үйлдэл бөгөөд түүнийг зөв зохицуулах нь
                            амьдралын чухал хэсэг юм.
                          </p>
                        </div>
                        <div className="management-item">
                          <span className="management-bullet">
                            <CheckCircle2 size={16} />
                          </span>
                          <p>
                            Стресс үргэлж сөрөг байдаггүй, заримдаа зорилгодоо
                            хүрэх эрч хүч, хөдөлгөх хүч (эерэг хариу үйлдэл)
                            болдог.
                          </p>
                        </div>
                        <div className="management-item">
                          <span className="management-bullet">
                            <CheckCircle2 size={16} />
                          </span>
                          <p>
                            Стрессийг зохицуулах нь түүний шинж тэмдэг,
                            шалтгааныг тогтоож, даван туулах урт хугацааны
                            төлөвлөгөө боловсруулахаас эхэлнэ.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="management-card">
                      <h3 className="management-card-title">
                        <TrendingUp size={22} /> СТРЕССИЙГ ЗОХИЦУУЛАХ НЬ ЯАГААД
                        ЧУХАЛ ВЭ?
                      </h3>
                      <div className="management-list">
                        <div className="management-item">
                          <span className="management-bullet">
                            <AlertTriangle
                              size={16}
                              style={{ color: "#eab308" }}
                            />
                          </span>
                          <p>
                            Хэт стресс нь хүний зан араншин, эрүүл мэнд,
                            харилцаа, ажил сурлагад сөрөг нөлөө үзүүлдэг тул
                            амьдралаа зөв удирдахын тулд зохицуулж сурах
                            шаардлагатай.
                          </p>
                        </div>
                        <div className="management-item">
                          <span className="management-bullet">
                            <AlertTriangle
                              size={16}
                              style={{ color: "#ef4444" }}
                            />
                          </span>
                          <p>
                            Удирдах боломжгүй стресс нь хуримтлагдсаар бие болон
                            сэтгэцийн хүнд өвчлөл (зүрхний өвчин, сэтгэл гутрал
                            г.м) үүсгэх эрсдэлтэй.
                          </p>
                        </div>
                        <div className="management-item">
                          <span className="management-bullet">
                            <Lightbulb size={16} style={{ color: "#06b6d4" }} />
                          </span>
                          <p>
                            Стрессийг амжилттай зохицуулснаар амьдралыг эерэгээр
                            харах чадвар болон бүтээлч байдлаа хадгалж үлддэг.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {renderPageFooter()}
                </div>
              </motion.div>
            }
          />

          <Route
            path="/causes"
            element={<CausesPage renderPageFooter={renderPageFooter} />}
          />

          <Route
            path="/duration"
            element={<DurationPage renderPageFooter={renderPageFooter} />}
          />

          <Route
            path="/prevention"
            element={
              <motion.div
                key="prevention"
                className="page-wrapper"
                {...pageVariants}
              >
                <div className="content-grid">
                  <div className="section-content">
                    <span className="section-tag">
                      <ShieldCheck size={16} /> Модуль 05
                    </span>
                    <h1 className="section-title">
                      Урьдчилан сэргийлэх аргууд
                    </h1>
                    <p className="section-description">
                      Эрүүл дадал хэвшил нь стрессийг хуримтлуулахгүй байхад
                      хамгийн их тусалдаг. Сэргийлэх үндсэн 4 чиглэл:
                    </p>

                    <div className="habit-grid">
                      <div className="habit-item">
                        <span className="habit-check">
                          <ShieldCheck size={16} />
                        </span>
                        <div className="habit-text">
                          <h4>Цагийн менежмент</h4>
                          <p>Ажлуудаа төлөвлөх, ач холбогдлоор нь эрэмбэлэх.</p>
                        </div>
                      </div>
                      <div className="habit-item">
                        <span className="habit-check">
                          <ShieldCheck size={16} />
                        </span>
                        <div className="habit-text">
                          <h4>Дасгал хөдөлгөөн</h4>
                          <p>
                            Тогтмол алхах, дасгал хийж кортизол дааврыг
                            бууруулах.
                          </p>
                        </div>
                      </div>
                      <div className="habit-item">
                        <span className="habit-check">
                          <ShieldCheck size={16} />
                        </span>
                        <div className="habit-text">
                          <h4>Татгалзаж сурах</h4>
                          <p>
                            Бусдад "Үгүй" гэж хэлж сурах, хэт их үүрэг амлалт
                            үүрэхгүй байх.
                          </p>
                        </div>
                      </div>
                      <div className="habit-item">
                        <span className="habit-check">
                          <ShieldCheck size={16} />
                        </span>
                        <div className="habit-text">
                          <h4>Нойр ба Хооллолт</h4>
                          <p>Өдөрт 7-8 цаг тогтмол унтах, эрүүл хооллох.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="section-visual-container">
                    <div className="visual-image-wrapper">
                      <img
                        src="/prevention.png"
                        alt="Prevention"
                        className="visual-image"
                      />
                    </div>
                  </div>
                </div>
                {renderPageFooter()}
              </motion.div>
            }
          />

          <Route
            path="/breathing"
            element={<BreathingPage renderPageFooter={renderPageFooter} />}
          />
        </Routes>
      </AnimatePresence>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-text">
          &copy; {new Date().getFullYear()} STRESS.mn. Бүх эрх хуулиар
          хамгаалагдсан. Сэтгэцийн эрүүл мэндийн интерактив суваг.
        </div>
        <button className="back-to-top" onClick={() => navigateTo("/")}>
          Хянах самбарт буцах
        </button>
      </footer>
    </div>
  );
}

// ----------------------------------------------------
// DEDICATED PAGE COMPONENTS WITH INTERNAL STATES
// ----------------------------------------------------

function CausesPage({ renderPageFooter }) {
  const [activeCause, setActiveCause] = useState(0);

  const causesDetails = [
    {
      title: "Ажил & Хичээлийн ачаалал",
      icon: <Target className="cause-icon" size={24} />,
      desc: "Цаг тулсан чухал даалгаврууд, ажлын хэт их шаардлага, амжилтад хүрэх дарамт болон ирээдүйн карьертаа санаа зовних зэрэг нь хамгийн түгээмэл стресс үүсгэгч юм.",
    },
    {
      title: "Нийгмийн харилцаа",
      icon: <Users className="cause-icon" size={24} />,
      desc: "Гэр бүл, найз нөхөд, хамт олны дунд үүсэх үл ойлголцол, маргаан, эсвэл нийгмээс тусгаарлагдаж ганцаардах мэдрэмж нь сэтгэл зүйн гүн дарамт үүсгэдэг.",
    },
    {
      title: "Хувийн хүчин зүйлс",
      icon: <Brain className="cause-icon" size={24} />,
      desc: "Өөртөө итгэлгүй байдал, хэтэрхий өндөр шаардлага тавьж төгс байхыг тэмүүлэх (perfectionism), бодит бус хүлээлт үүсгэх зэрэг хувь хүний хандлагууд дотоод стрессийг үүсгэдэг.",
    },
    {
      title: "Орчин тойрон",
      icon: <CloudRain className="cause-icon" size={24} />,
      desc: "Дуу чимээний бохирдол, агаарын бохирдол, замын түгжрэл, орон байрны тохь тухгүй байдал болон хүрээлэн буй орчны таагүй уур амьсгал нь биднийг аажмаар сульдуулдаг.",
    },
  ];

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4, ease: "easeOut" },
  };

  return (
    <motion.div key="causes" className="page-wrapper" {...pageVariants}>
      <div className="page-container">
        <div className="content-grid">
          <div className="section-content">
            <span className="section-tag">
              <AlertTriangle size={16} /> Модуль 03
            </span>
            <h1 className="section-title">Стресс юунаас болж үүсдэг вэ?</h1>
            <p className="section-description">
              Стресс үүсгэгчийг "Стрессорууд" гэдэг. Доорх картууд дээр дарж,
              тэдгээрийн дэлгэрэнгүй шалтгаануудыг баруун талын 3D зурагтай
              холбон судална уу.
            </p>

            <div className="causes-grid">
              {causesDetails.map((cause, idx) => (
                <div
                  key={idx}
                  className={`cause-card ${idx === activeCause ? "active" : ""}`}
                  onClick={() => {
                    setActiveCause(idx);
                  }}
                >
                  <div className="cause-header">
                    <span className="cause-icon-box">{cause.icon}</span>
                    <h4>{cause.title}</h4>
                  </div>
                  <p className="cause-desc">{cause.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="section-visual-container">
            <div className="visual-image-wrapper">
              <img
                src="/causes.png"
                alt="Causes Visual"
                className="visual-image"
                style={{ filter: `hue-rotate(${activeCause * 45}deg)` }}
              />
            </div>
          </div>
        </div>
        {renderPageFooter()}
      </div>
    </motion.div>
  );
}

function DurationPage({ renderPageFooter }) {
  const [durationTab, setDurationTab] = useState("acute");

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4, ease: "easeOut" },
  };

  return (
    <motion.div key="duration" className="page-wrapper" {...pageVariants}>
      <div className="page-container">
        <div className="content-grid">
          <div className="section-content">
            <span className="section-tag">
              <Clock size={16} /> Модуль 04
            </span>
            <h1 className="section-title">Стресс хэр удаан үргэлжилдэг вэ?</h1>
            <p className="section-description">
              Стрессийг үргэлжлэх хугацаагаар нь хоёр ангилдаг. Төрлийг сонгон
              эрүүл мэндийн нөлөөг уншина уу.
            </p>

            <div className="duration-toggle">
              <button
                className={`toggle-btn ${durationTab === "acute" ? "active" : ""}`}
                onClick={() => {
                  setDurationTab("acute");
                }}
              >
                Цочмог стресс (Acute)
              </button>
              <button
                className={`toggle-btn ${durationTab === "chronic" ? "active" : ""}`}
                onClick={() => {
                  setDurationTab("chronic");
                }}
              >
                Архаг стресс (Chronic)
              </button>
            </div>

            <div className="duration-details">
              {durationTab === "acute" ? (
                <div>
                  <div className="duration-item">
                    <span className="duration-bullet">
                      <Clock size={16} />
                    </span>
                    <div className="duration-item-text">
                      <h4>Түр зуурын үргэлжлэх хугацаа</h4>
                      <p>
                        Хэдэн минутаас хэдэн цаг. Илтгэл, шалгалт зэрэг
                        нөхцөлүүд дуусахад бие эргээд хэвийн болдог.
                      </p>
                    </div>
                  </div>
                  <div className="duration-item" style={{ marginTop: "1rem" }}>
                    <span className="duration-bullet">
                      <Zap size={16} />
                    </span>
                    <div className="duration-item-text">
                      <h4>Илрэх шинж тэмдэг</h4>
                      <p>
                        Зүрхний хурдан цохилт, гар хөлрөх, ам хуурайших, богино
                        хугацааны сандрал.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="duration-item">
                    <span className="duration-bullet">
                      <Clock size={16} />
                    </span>
                    <div className="duration-item-text">
                      <h4>Урт хугацааны үргэлжлэх хугацаа</h4>
                      <p>
                        Хэдэн сараас хэдэн жил. Санхүүгийн асуудал, гэр бүлийн
                        урт хугацааны маргаанаас үүснэ.
                      </p>
                    </div>
                  </div>
                  <div className="duration-item" style={{ marginTop: "1rem" }}>
                    <span className="duration-bullet">
                      <Zap size={16} />
                    </span>
                    <div className="duration-item-text">
                      <h4>Эрүүл мэндийн хор уршиг</h4>
                      <p>
                        Дархлааг маш ихээр сулруулна. Цусны даралт ихсэх, зүрх
                        судасны өвчлөл, сэтгэл гутрал.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="section-visual-container">
            <div className="visual-image-wrapper">
              <img
                src="/duration.png"
                alt="Duration Visual"
                className="visual-image"
                style={{
                  transform:
                    durationTab === "chronic"
                      ? "rotate(180deg) scale(1.05)"
                      : "rotate(0deg) scale(1.05)",
                  transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </div>
          </div>
        </div>
        {renderPageFooter()}
      </div>
    </motion.div>
  );
}

function BreathingPage({ renderPageFooter }) {
  const [breathingState, setBreathingState] = useState("idle"); // idle, inhale, hold, exhale
  const [breathTimer, setBreathTimer] = useState(0);
  const breathingInterval = useRef(null);

  const startBreathing = () => {
    if (breathingState !== "idle") {
      clearInterval(breathingInterval.current);
      setBreathingState("idle");
      setBreathTimer(0);
      return;
    }
    setBreathingState("inhale");
    setBreathTimer(4);
  };

  useEffect(() => {
    if (breathingState === "idle") {
      if (breathingInterval.current) clearInterval(breathingInterval.current);
      return;
    }

    breathingInterval.current = setInterval(() => {
      setBreathTimer((prev) => {
        if (prev <= 1) {
          if (breathingState === "inhale") {
            setBreathingState("hold");
            return 7;
          } else if (breathingState === "hold") {
            setBreathingState("exhale");
            return 8;
          } else if (breathingState === "exhale") {
            setBreathingState("inhale");
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(breathingInterval.current);
  }, [breathingState]);

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.4, ease: "easeOut" },
  };

  return (
    <motion.div key="breathing" className="page-wrapper" {...pageVariants}>
      <div className="page-container">
        <div className="content-grid">
          <div className="section-content">
            <span className="section-tag">
              <Compass size={16} /> Модуль 06
            </span>
            <h1 className="section-title">4-7-8 амьсгалын техник</h1>
            <p className="section-description">
              Энэ дасгал нь мэдрэлийн системийг тайвшруулна. Хамар чихээрээ 4
              сек амьсгал аваад, 7 сек амьсгалаа барьж, дараа нь амаараа 8 сек
              турш сүүдэр мэт алгуурхан гаргана.
            </p>
            <div className="btn-group" style={{ marginTop: "2rem" }}>
              <button className="cta-btn" onClick={startBreathing}>
                {breathingState === "idle"
                  ? "Дасгалыг эхлүүлэх"
                  : "Дасгалыг зогсоох"}
              </button>
            </div>
          </div>

          <div className="section-visual-container">
            <div className="breathing-box">
              <div className="breathing-bubble-outer">
                <motion.div
                  className="breathing-bubble"
                  animate={{
                    scale:
                      breathingState === "inhale"
                        ? 1.45
                        : breathingState === "exhale"
                          ? 0.95
                          : breathingState === "hold"
                            ? 1.45
                            : 1.0,
                    boxShadow:
                      breathingState === "hold"
                        ? "0 0 70px rgba(6, 182, 212, 0.7)"
                        : breathingState === "inhale"
                          ? "0 0 50px rgba(168, 85, 247, 0.5)"
                          : "0 0 30px rgba(99, 102, 241, 0.3)",
                  }}
                  transition={{
                    duration:
                      breathingState === "inhale"
                        ? 4
                        : breathingState === "hold"
                          ? 7
                          : breathingState === "exhale"
                            ? 8
                            : 1,
                    ease: "easeInOut",
                  }}
                >
                  <div className="breathing-bubble-inner"></div>
                  <span className="breathing-text">
                    {breathingState === "idle" && "АМЬСГАЛ"}
                    {breathingState === "inhale" && "АВАХ"}
                    {breathingState === "hold" && "БАРЬ"}
                    {breathingState === "exhale" && "ГАРГА"}
                  </span>
                </motion.div>
              </div>

              <div className="breathing-instruction">
                {breathingState === "idle" &&
                  "Хэмнэлийг дагаж дасгал хийнэ үү."}
                {breathingState === "inhale" &&
                  "Гүнзгий амьсгал аваарай... (4 секунд)"}
                {breathingState === "hold" &&
                  "Амьсгалаа дотроо барина уу... (7 секунд)"}
                {breathingState === "exhale" &&
                  "Амаараа алгуур гаргана... (8 секунд)"}
              </div>

              {breathingState !== "idle" && (
                <div className="breathing-timer">{breathTimer} сек</div>
              )}
            </div>
          </div>
        </div>
        {renderPageFooter()}
      </div>
    </motion.div>
  );
}

export default App;
