import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import appLogo from "./assets/images/app_logo_1782364864211.jpg";
import { 
  Send, 
  Phone, 
  Mail, 
  Facebook, 
  Instagram, 
  CheckCircle, 
  Plane, 
  Compass, 
  Copy, 
  Check, 
  CheckCheck,
  Clock, 
  Bell,
  BellOff,
  AlertTriangle,
  Sparkles,
  Briefcase,
  Search,
  Globe,
  ExternalLink,
  FileText,
  User,
  ArrowLeft,
  ChevronLeft,
  ShoppingBag,
  Tag,
  PlusCircle,
  Filter,
  Share2,
  Camera,
  X,
  MapPin,
  DollarSign,
  RotateCcw,
  Sun,
  Moon,
  Heart,
  BookOpen,
  Settings,
  Image,
  Printer,
  PenTool,
  Calendar,
  Star,
  MessageSquare,
  Ban,
  Calculator,
  Coins
} from "lucide-react";
import { Message, OfficeInfo, JobAd, MarketAd } from "./types";

interface SignaturePadProps {
  label: string;
  onSave: (dataUrl: string) => void;
  onClear: () => void;
  savedDataUrl: string;
  language: "ar" | "en";
}

const SignaturePad = ({ label, onSave, onClear, savedDataUrl, language }: SignaturePadProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (savedDataUrl) {
      const img = new window.Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = savedDataUrl;
    }
  }, [savedDataUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const preventDefaultTouch = (e: TouchEvent) => {
      if (e.target === canvas) {
        e.preventDefault();
      }
    };

    canvas.addEventListener("touchstart", preventDefaultTouch, { passive: false });
    canvas.addEventListener("touchmove", preventDefaultTouch, { passive: false });

    return () => {
      canvas.removeEventListener("touchstart", preventDefaultTouch);
      canvas.removeEventListener("touchmove", preventDefaultTouch);
    };
  }, []);

  const getCoords = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ("touches" in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coords = getCoords(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#18181b";
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const coords = getCoords(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    onSave(canvas.toDataURL());
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onClear();
  };

  return (
    <div className="flex flex-col gap-2 p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
      <div className="flex justify-between items-center">
        <span className="text-[10px] font-bold text-zinc-300 flex items-center gap-1">
          <PenTool className="h-3 w-3 text-[#c5a059]" />
          {label}
        </span>
        <button
          type="button"
          onClick={clearCanvas}
          className="text-[9px] text-rose-400 hover:text-rose-300 transition-colors cursor-pointer flex items-center gap-1"
        >
          <RotateCcw className="h-2.5 w-2.5" />
          {language === "ar" ? "مسح" : "Clear"}
        </button>
      </div>
      <div className="relative border border-zinc-850 bg-white rounded-lg overflow-hidden h-28 sm:h-32 shadow-inner">
        <canvas
          ref={canvasRef}
          width={400}
          height={160}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-full cursor-crosshair touch-none"
        />
        {!savedDataUrl && (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-400 pointer-events-none text-[9px] select-none font-medium text-center px-4">
            {language === "ar" ? "ارسم التوقيع بيدك هنا بالماوس أو الشاشة" : "Draw your signature here with mouse or touch"}
          </div>
        )}
      </div>
    </div>
  );
};

const DEFAULT_OFFICE_INFO: OfficeInfo = {
  name: "أبو مجد الحداد للسفريات",
  phone: "+967775012242",
  email: "what775012242@outlook.sa",
  facebook: "ابومجد الحداد خدمات سفريات وسياحه",
  instagram: "وجدان الحداد-ابومجدالحداد",
  services: [
    "🎫 استخراج تأشيرات سفر وإنجاز المعاملات القنصلية",
    "✈️ حجوزات تذاكر طيران دولية ومحلية لجميع الوجهات",
    "🌍 تنظيم رحلات سياحية وتخليص معاملات الأيادي العاملة",
    "🏨 حجز فنادق وبرامج سياحية متكاملة بأسعار مميزة",
    "💼 خدمات السفر والمعاملات وتسهيل الفيزا"
  ]
};

const QUICK_PROMPTS = [
  { text: "🛫 ما هي متطلبات تأشيرة العمل / الزيارة؟", label: "متطلبات التأشيرة" },
  { text: "🎫 أريد الاستفسار عن حجز طيران إلى السعودية", label: "حجوزات طيران" },
  { text: "🌍 هل تتوفر لديكم برامج سياحية وعروض عطلات؟", label: "البرامج السياحية" },
  { text: "📞 ما هي أوقات العمل وكيفية التواصل المباشر معكم؟", label: "التواصل والمواعيد" }
];

const FLIGHT_BOOKING_PORTALS = [
  {
    name: "الخطوط الجوية اليمنية (Yemenia)",
    url: "https://www.yemenia.com",
    type: "طيران وطني يمني",
    description: "الناقل الوطني للجمهورية اليمنية لحجز الرحلات، والاطلاع على جداول الرحلات المباشرة، وأسعار التذاكر.",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
  },
  {
    name: "الخطوط الجوية السعودية (Saudia)",
    url: "https://www.saudia.com",
    type: "طيران وطني سعودي",
    description: "المنصة الرسمية للخطوط السعودية لحجز الرحلات الدولية والداخلية، وإصدار بطاقات صعود الطائرة وإدارة الحجوزات.",
    badgeColor: "bg-blue-500/10 text-blue-400 border border-blue-500/20"
  },
  {
    name: "طيران ناس (Flynas)",
    url: "https://www.flynas.com",
    type: "طيران اقتصادي رائد",
    description: "الناقل الوطني الاقتصادي السعودي، يقدم رحلات يومية بأسعار منافسة وجودة متميزة في الشرق الأوسط.",
    badgeColor: "bg-amber-500/10 text-amber-400 border border-amber-500/20"
  },
  {
    name: "طيران أديل (Flyadeal)",
    url: "https://www.flyadeal.com",
    type: "طيران اقتصادي سعودي",
    description: "شركة الطيران الاقتصادي التابعة للمؤسسة العامة للخطوط السعودية لتقديم رحلات بأسعار تنافسية ومريحة.",
    badgeColor: "bg-purple-500/10 text-purple-400 border border-purple-500/20"
  },
  {
    name: "العربية للطيران (Air Arabia)",
    url: "https://www.airarabia.com",
    type: "طيران اقتصادي إقليمي",
    description: "أول طيران اقتصادي في الشرق الأوسط، يربط مطارات المنطقة برحلات منخفضة التكلفة وموثوقية عالية.",
    badgeColor: "bg-rose-500/10 text-rose-400 border border-rose-500/20"
  }
];

const LABOR_SPECIALTIES = [
  "سائق خاص / سائق شاحنة",
  "عاملة منزلية / مربية",
  "طباخ / طاهي",
  "مهندس مدني / معماري / كهرباء",
  "أخصائي تقني / مبرمج / مصمم",
  "طبيب / ممرض / أخصائي صحي",
  "محاسب / كاتب حسابات",
  "مندوب مبيعات / تسويق",
  "كهربائي تمديدات / فني صيانة",
  "سباك / فني صحي",
  "مليس / بناي / نجار مسلح",
  "عامل شحن وتفريغ",
  "حارس أمن / منشآت",
  "عامل زراعي / منسق حدائق"
];

const parseAdDate = (timestampStr: string): Date => {
  if (!timestampStr) return new Date();
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  let clean = timestampStr;
  for (let i = 0; i < 10; i++) {
    clean = clean.replace(new RegExp(arabicDigits[i], "g"), i.toString());
  }
  clean = clean.replace(/[^\d\/\-\:\s]/g, "").trim();
  const parts = clean.split(/[\/\-]/);
  if (parts.length === 3) {
    const p0 = parseInt(parts[0], 10);
    const p1 = parseInt(parts[1], 10);
    const p2 = parseInt(parts[2], 10);
    if (p0 > 1000) return new Date(p0, p1 - 1, p2);
    else if (p2 > 1000) return new Date(p2, p1 - 1, p0);
  }
  const parsed = Date.parse(clean);
  if (!isNaN(parsed)) return new Date(parsed);
  return new Date();
};

const sortJobAdsByDate = (ads: JobAd[], order: "newest" | "oldest" | "last24h"): JobAd[] => {
  const indexedAds = ads.map((ad, idx) => ({ ad, idx }));
  const sorted = [...indexedAds].sort((a, b) => {
    const dateA = parseAdDate(a.ad.timestamp).getTime();
    const dateB = parseAdDate(b.ad.timestamp).getTime();
    if (dateA !== dateB) return order === "oldest" ? dateA - dateB : dateB - dateA;
    return a.idx - b.idx;
  });
  let result = sorted.map(item => item.ad);
  if (order === "last24h") {
    const now = new Date();
    const twentyFourHoursAgo = now.getTime() - 24 * 60 * 60 * 1000;
    result = result.filter(ad => {
      const adDate = parseAdDate(ad.timestamp);
      return adDate.toDateString() === now.toDateString() || adDate.getTime() >= twentyFourHoursAgo;
    });
  }
  return result;
};

const sortMarketAdsByDate = (ads: MarketAd[], order: "newest" | "oldest" | "last24h"): MarketAd[] => {
  const indexedAds = ads.map((ad, idx) => ({ ad, idx }));
  const sorted = [...indexedAds].sort((a, b) => {
    const dateA = parseAdDate(a.ad.timestamp).getTime();
    const dateB = parseAdDate(b.ad.timestamp).getTime();
    if (dateA !== dateB) return order === "oldest" ? dateA - dateB : dateB - dateA;
    return a.idx - b.idx;
  });
  let result = sorted.map(item => item.ad);
  if (order === "last24h") {
    const now = new Date();
    const twentyFourHoursAgo = now.getTime() - 24 * 60 * 60 * 1000;
    result = result.filter(ad => {
      const adDate = parseAdDate(ad.timestamp);
      return adDate.toDateString() === now.toDateString() || adDate.getTime() >= twentyFourHoursAgo;
    });
  }
  return result;
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "model",
      text: "مرحباً بك في **أبو مجد الحداد للسفريات والخدمات السياحية**! ✈\n\nأنا مساعدك الذكي هنا للإجابة على جميع استفساراتك حول:\n- **تأشيرات السفر والمعاملات**\n- **حجوزات الطيران وأفضل الأسعار**\n- **الرحلات السياحية**\n\nكيف يمكنني مساعدتك اليوم؟ تفضل بطرح سؤالك مباشرة أو اختر أحد الاستفسارات الجاهزة أدناه! 👇",
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [office, setOffice] = useState<OfficeInfo>(DEFAULT_OFFICE_INFO);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [copiedShareId, setCopiedShareId] = useState<string | null>(null);

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("theme");
      return saved !== "light";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
        document.documentElement.style.colorScheme = "dark";
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        document.documentElement.style.colorScheme = "light";
        localStorage.setItem("theme", "light");
      }
    } catch (e) {
      console.error(e);
    }
  }, [isDarkMode]);

  const getJobShareText = (ad: JobAd) => {
    return `📋 *إعلان وظيفة / طلب عمل جديد*\n\n` +
           `👤 *الاسم:* ${ad.name}\n` +
           `💼 *التخصص:* ${ad.specialty}\n` +
           `📍 *الموقع:* ${ad.country}\n` +
           `⭐ *الخبرة:* ${ad.experience || 'غير محدد'}\n` +
           `💰 *الراتب:* ${ad.salary || 'غير محدد'}\n\n` +
           `📝 *التفاصيل:* ${ad.details}\n\n` +
           `📞 *للتواصل:* ${ad.phone}\n\n` +
           `🌐 *عبر أبو مجد الحداد للسفريات:* ${window.location.origin}`;
  };

  const getMarketShareText = (ad: MarketAd) => {
    const typeText = ad.type === "sell" ? "عرض بيع" : "طلب شراء";
    return `🛒 *إعلان جديد في سوق بيع وشراء الخدمات والسلع*\n\n` +
           `🏷️ *النوع:* ${typeText}\n` +
           `🗂️ *القسم:* ${ad.category}\n` +
           `📢 *العنوان:* ${ad.title}\n\n` +
           `📝 *المواصفات والتفاصيل:* ${ad.details}\n\n` +
           `💰 *القيمة/السعر:* ${ad.price}\n` +
           `📍 *الموقع:* ${ad.location}\n` +
           `👤 *المعلن:* ${ad.name}\n` +
           `📞 *رقم الجوال:* ${ad.phone}\n\n` +
           `🌐 *منشور عبر بوابة أبو مجد الحداد للسفريات:* ${window.location.origin}`;
  };

  const handleShareAd = (text: string, adId: string, destination: "whatsapp" | "telegram" | "copy") => {
    if (destination === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
    } else if (destination === "telegram") {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin)}&text=${encodeURIComponent(text)}`, "_blank");
    } else {
      navigator.clipboard.writeText(text);
      setCopiedShareId(adId);
      setTimeout(() => setCopiedShareId(null), 3500);
    }
  };

  const matchesJobAd = (ad: JobAd) => {
    const isEmployerTab = jobsSubTab === "employers";
    if (ad.type !== (isEmployerTab ? "employer" : "seeker") && !(isEmployerTab && ad.type === "external")) return false;
    if (selectedSpecialtyFilter !== "all" && ad.specialty !== selectedSpecialtyFilter) return false;
    if (jobLocationFilter !== "all") {
      if (!ad.country) return false;
      const locLower = ad.country.toLowerCase();
      if (jobLocationFilter === "saudi") {
        if (!locLower.includes("سعود") && !locLower.includes("رياض") && !locLower.includes("جدة") && !locLower.includes("saudi")) return false;
      } else if (jobLocationFilter === "yemen") {
        if (!locLower.includes("يمن") && !locLower.includes("صنعاء") && !locLower.includes("عدن") && !locLower.includes("yemen")) return false;
      } else if (jobLocationFilter === "uae") {
        if (!locLower.includes("إمارات") && !locLower.includes("دبي") && !locLower.includes("أبوظبي") && !locLower.includes("uae") && !locLower.includes("dubai")) return false;
      } else if (jobLocationFilter === "qatar") {
        if (!locLower.includes("قطر") && !locLower.includes("الدوحة") && !locLower.includes("qatar")) return false;
      } else if (jobLocationFilter === "oman") {
        if (!locLower.includes("عمان") && !locLower.includes("مسقط") && !locLower.includes("oman")) return false;
      } else if (jobLocationFilter === "other") {
        const isStandard = ["سعود", "يمن", "إمارات", "قطر", "عمان", "saudi", "yemen", "uae", "qatar", "oman"].some(sl => locLower.includes(sl));
        if (isStandard) return false;
      }
    }
    if (jobSalaryFilter !== "all") {
      if (!ad.salary) return jobSalaryFilter === "unspecified";
      const numbers = ad.salary.match(/\d+/g)?.map(Number) || [];
      if (numbers.length === 0) {
        const isUnspecifiedText = ["اتفاق", "غير", "محدد", "negotiable", "agreement"].some(kw => ad.salary?.toLowerCase().includes(kw));
        return jobSalaryFilter === "unspecified" && isUnspecifiedText;
      }
      const salVal = numbers[0];
      if (jobSalaryFilter === "under_2000" && salVal >= 2000) return false;
      if (jobSalaryFilter === "2000_4000" && (salVal < 2000 || salVal > 4000)) return false;
      if (jobSalaryFilter === "4000_6000" && (salVal < 4000 || salVal > 6000)) return false;
      if (jobSalaryFilter === "above_6000" && salVal <= 6000) return false;
      if (jobSalaryFilter === "unspecified") return false;
    }
    if (jobSearchQuery.trim() !== "") {
      const query = jobSearchQuery.toLowerCase().trim();
      const matchesName = ad.name?.toLowerCase().includes(query);
      const matchesSpecialty = ad.specialty?.toLowerCase().includes(query);
      const matchesDetails = ad.details?.toLowerCase().includes(query);
      const matchesCountry = ad.country?.toLowerCase().includes(query);
      const matchesExperience = ad.experience?.toLowerCase().includes(query);
      const matchesSalary = ad.salary?.toLowerCase().includes(query);
      if (!matchesName && !matchesSpecialty && !matchesDetails && !matchesCountry && !matchesExperience && !matchesSalary) return false;
    }
    return true;
  };

  const [activeSidebarTab, setActiveSidebarTab] = useState<"info" | "jobs" | "mofa" | "trade" | "favorites" | "chats" | "flights">("info");
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});
  const [translatingIds, setTranslatingIds] = useState<Record<string, boolean>>({});
  const [translationErrors, setTranslationErrors] = useState<Record<string, string>>({});
  const [activeTranslations, setActiveTranslations] = useState<Record<string, boolean>>({});

  const handleTranslate = async (id: string, textToTranslate: string) => {
    if (translatedTexts[id]) {
      setActiveTranslations(prev => ({ ...prev, [id]: !prev[id] }));
      return;
    }
    setTranslatingIds(prev => ({ ...prev, [id]: true }));
    setTranslationErrors(prev => ({ ...prev, [id]: "" }));
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToTranslate }),
      });
      if (!response.ok) throw new Error("فشلت عملية الترجمة");
      const data = await response.json();
      if (data.translatedText) {
        setTranslatedTexts(prev => ({ ...prev, [id]: data.translatedText }));
        setActiveTranslations(prev => ({ ...prev, [id]: true }));
      } else throw new Error("لم يتم إرجاع أي نص مترجم");
    } catch (err: any) {
      console.error(err);
      setTranslationErrors(prev => ({ ...prev, [id]: "عذراً، تعذرت الترجمة بالذكاء الاصطناعي حالياً." }));
    } finaly {
      setTranslatingIds(prev => ({ ...prev, [id]: false }));
    }
  };

  const [favoritedJobIds, setFavoritedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("fav_job_ids");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [favoritedMarketIds, setFavoritedMarketIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("fav_market_ids");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem("fav_job_ids", JSON.stringify(favoritedJobIds)); } catch (e) { console.error(e); }
  }, [favoritedJobIds]);

  useEffect(() => {
    try { localStorage.setItem("fav_market_ids", JSON.stringify(favoritedMarketIds)); } catch (e) { console.error(e); }
  }, [favoritedMarketIds]);

  const toggleJobFavorite = (id: string) => {
    setFavoritedJobIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const toggleMarketFavorite = (id: string) => {
    setFavoritedMarketIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const [jobsSearch, setJobsSearch] = useState("");
  const [jobAds, setJobAds] = useState<JobAd[]>([]);
  const [jobsSubTab, setJobsSubTab] = useState<"employers" | "seekers">("employers");
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState<string>("all");
  const [jobLocationFilter, setJobLocationFilter] = useState<string>("all");
  const [jobSalaryFilter, setJobSalaryFilter] = useState<string>("all");
  const [jobSearchQuery, setJobSearchQuery] = useState<string>("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [jobDateSort, setJobDateSort] = useState<"newest" | "oldest" | "last24h">("newest");

  const [selectedReadingAd, setSelectedReadingAd] = useState<{
    title: string;
    specialty: string;
    content: string;
    isTranslation: boolean;
  } | null>(null);
  const [readingFontSize, setReadingFontSize] = useState<"lg" | "xl" | "2xl" | "3xl">("xl");

  const [sectionLoadingProgress, setSectionLoadingProgress] = useState<number>(0);
  const [isSectionLoading, setIsSectionLoading] = useState<boolean>(false);

  const [isDataSavingMode, setIsDataSavingMode] = useState<boolean>(() => {
    return localStorage.getItem("data_saving_mode") === "true";
  });
  const [loadedImageIds, setLoadedImageIds] = useState<Record<string, boolean>>({});
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  
  const [invoiceTargetAd, setInvoiceTargetAd] = useState<MarketAd | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState<boolean>(false);
  const [invoiceBuyerName, setInvoiceBuyerName] = useState<string>("");
  const [invoiceBuyerPhone, setInvoiceBuyerPhone] = useState<string>("");
  const [invoiceRefNo, setInvoiceRefNo] = useState<string>("");
  const [invoiceDate, setInvoiceDate] = useState<string>("");
  const [invoiceBasePrice, setInvoiceBasePrice] = useState<string>("0");
  const [invoiceDiscount, setInvoiceDiscount] = useState<string>("0");
  const [invoiceExtraFee, setInvoiceExtraFee] = useState<string>("0");
  const [invoiceNotes, setInvoiceNotes] = useState<string>("هذه الفاتورة أولية وغير ملزمة، تم توليدها لتسهيل عملية توثيق الاتفاق المبدئي بين الأطراف.");
  const [invoiceBuyerSignature, setInvoiceBuyerSignature] = useState<string>("");
  const [invoiceSellerSignature, setInvoiceSellerSignature] = useState<string>("");
  const [invoiceBuyerSignatureDate, setInvoiceBuyerSignatureDate] = useState<string>("");
  const [invoiceSellerSignatureDate, setInvoiceSellerSignatureDate] = useState<string>("");

  const handleOpenInvoiceWizard = (ad: MarketAd) => {
    setInvoiceTargetAd(ad);
    setInvoiceBuyerName("");
    setInvoiceBuyerPhone("");
    setInvoiceBuyerSignature("");
    setInvoiceSellerSignature("");
    setInvoiceBuyerSignatureDate("");
    setInvoiceSellerSignatureDate("");
    setInvoiceRefNo(`PRO-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`);
    setInvoiceDate(new Date().toISOString().split("T")[0]);
    const numeric = extractNumericPrice(ad.price);
    setInvoiceBasePrice(numeric.toString() || "0");
    setInvoiceDiscount("0");
    setInvoiceExtraFee("0");
    setInvoiceNotes("هذه الفاتورة أولية وغير ملزمة، تم توليدها لتسهيل عملية توثيق الاتفاق المبدئي بين الأطراف وسداد الرسوم أو حجز المنتج.");
    setIsInvoiceModalOpen(true);
  };

  const [userRatings, setUserRatings] = useState<Record<string, number[]>>(() => {
    try {
      const saved = localStorage.getItem("advertiser_user_ratings");
      return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });

  useEffect(() => {
    localStorage.setItem("advertiser_user_ratings", JSON.stringify(userRatings));
  }, [userRatings]);

  const getAdvertiserRating = (phone: string) => {
    const defaultSeeds: Record<string, { sum: number; count: number }> = {
      "+966501234567": { sum: 72, count: 15 },
      "+966555987654": { sum: 47, count: 10 },
      "+967733445566": { sum: 26, count: 6 },
      "+96771234567": { sum: 39, count: 8 },
      "+967771112223": { sum: 36, count: 8 },
      "+967775012242": { sum: 108, count: 22 },
      "+967738465200": { sum: 89, count: 19 },
    };
    const seed = defaultSeeds[phone] || { sum: 0, count: 0 };
    const custom = userRatings[phone] || [];
    const totalSum = seed.sum + custom.reduce((a, b) => a + b, 0);
    const totalCount = seed.count + custom.length;
    if (totalCount === 0) return { average: 0, count: 0 };
    return {
      average: Math.round((totalSum / totalCount) * 10) / 10,
      count: totalCount
    };
  };

  const [isRatingModalOpen, setIsRatingModalOpen] = useState<boolean>(false);
  const [ratingTargetName, setRatingTargetName] = useState<string>("");
  const [ratingTargetPhone, setRatingTargetPhone] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [ratingSuccess, setRatingSuccess] = useState<boolean>(false);

  const handleOpenRatingModal = (name: string, phone: string) => {
    setRatingTargetName(name);
    setRatingTargetPhone(phone);
    setSelectedRating(5);
    setHoverRating(0);
    setRatingSuccess(false);
    setIsRatingModalOpen(true);
  };

  const handleSubmittingRating = () => {
    if (!ratingTargetPhone) return;
    const current = userRatings[ratingTargetPhone] || [];
    const updated = { ...userRatings, [ratingTargetPhone]: [...current, selectedRating] };
    setUserRatings(updated);
    setRatingSuccess(true);
    setTimeout(() => {
      setIsRatingModalOpen(false);
      setRatingSuccess(false);
    }, 1500);
  };

  const [myPhone, setMyPhone] = useState<string>(() => {
    return localStorage.getItem("u2u_my_phone") || "+967770001111";
  });
  const [myName, setMyName] = useState<string>(() => {
    return localStorage.getItem("u2u_my_name") || "زائر المهام والمشاريع";
  });
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [blockedList, setBlockedList] = useState<{ blockerPhone: string; blockedPhone: string }[]>([]);
  const [activeChatPartner, setActiveChatPartner] = useState<{ phone: string; name: string; adId?: string; adTitle?: string } | null>(null);
  const [u2uInputMessage, setU2uInputMessage] = useState<string>("");
  const [isSendingU2UMessage, setIsSendingU2UMessage] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem("u2u_my_phone", myPhone);
    localStorage.setItem("u2u_my_name", myName);
  }, [myPhone, myName]);

  const fetchChats = async () => {
    try {
      const res = await fetch(`/api/chats?phone=${encodeURIComponent(myPhone)}`);
      if (res.ok) {
        const data = await res.json();
        setChatMessages(data);
      }
      const blocksRes = await fetch("/api/chats/blocks");
      if (blocksRes.ok) {
        const blocksData = await blocksRes.json();
        setBlockedList(blocksData);
      }
      if (activeChatPartner) {
        await fetch("/api/chats/read", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ myPhone, partnerPhone: activeChatPartner.phone })
        });
      }
    } catch (err) { console.error("Error fetching chats:", err); }
  };

  const handleToggleBlockPartner = async (partnerPhone: string) => {
    const isCurrentlyBlocked = blockedList.some(b => b.blockerPhone === myPhone && b.blockedPhone === partnerPhone);
    const endpoint = isCurrentlyBlocked ? "/api/chats/unblock" : "/api/chats/block";
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blockerPhone: myPhone, blockedPhone: partnerPhone })
      });
      if (res.ok) {
        const data = await res.json();
        setBlockedList(data.blockedUsers);
      }
    } catch (err) { console.error("Error toggling block:", err); }
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 3000);
    return () => clearInterval(interval);
  }, [myPhone]);

  useEffect(() => {
    if (activeChatPartner) fetchChats();
  }, [activeChatPartner]);

  const handleSendU2UMessage = async () => {
    if (!u2uInputMessage.trim() || !activeChatPartner) return;
    setIsSendingU2UMessage(true);
    try {
      const payload = {
        senderPhone: myPhone,
        senderName: myName,
        receiverPhone: activeChatPartner.phone,
        receiverName: activeChatPartner.name,
        text: u2uInputMessage.trim(),
        adId: activeChatPartner.adId,
        adTitle: activeChatPartner.adTitle
      };
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setU2uInputMessage("");
        await fetchChats();
      }
    } catch (err) { console.error("Error sending message:", err); }
    finally { setIsSendingU2UMessage(false); }
  };

  const handleStartChat = (receiverPhone: string, receiverName: string, adId?: string, adTitle?: string) => {
    let currentMyPhone = myPhone;
    if (myPhone === receiverPhone) {
      currentMyPhone = receiverPhone === "+967770001111" ? "+967771112222" : "+967770001111";
      setMyPhone(currentMyPhone);
    }
    setActiveChatPartner({ phone: receiverPhone, name: receiverName, adId, adTitle });
    setActiveSidebarTab("chats");
  };

  useEffect(() => {
    localStorage.setItem("data_saving_mode", isDataSavingMode ? "true" : "false");
  }, [isDataSavingMode]);
  
  const [isPublishingAd, setIsPublishingAd] = useState(false);
  const [newAdForm, setNewAdForm] = useState({
    name: "", phone: "", specialty: "سائق خاص / سائق شاحنة", country: "", details: "", salary: "", experience: "", image: ""
  });
  const [adPublishSuccess, setAdPublishSuccess] = useState(false);
  const [adPublishError, setAdPublishError] = useState<string | null>(null);

  const [marketAds, setMarketAds] = useState<MarketAd[]>([]);
  const [marketSearch, setMarketSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [marketTypeFilter, setMarketTypeFilter] = useState<"all" | "sell" | "buy">("all");
  const [marketDateSort, setMarketDateSort] = useState<"newest" | "oldest" | "last24h">("newest");
  const [isPublishingMarketAd, setIsPublishingMarketAd] = useState(false);
  const [newMarketAdForm, setNewMarketAdForm] = useState({
    type: "sell" as "sell" | "buy", category: "تأشيرات وإقامات", title: "", details: "", price: "", location: "", name: "", phone: "", image: ""
  });
  const [marketPublishSuccess, setMarketPublishSuccess] = useState(false);
  const [marketPublishError, setMarketPublishError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, formType: "job" | "market") => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("حجم الصورة كبير جداً. يرجى اختيار صورة أقل من 2 ميجابايت لضمان سرعة التحميل.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      if (formType === "job") setNewAdForm(prev => ({ ...prev, image: base64 }));
      else setNewMarketAdForm(prev => ({ ...prev, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const [myPublishedAds, setMyPublishedAds] = useState<{ id: string; title: string; publishedAt: string }[]>(() => {
    try {
      const stored = localStorage.getItem("user_published_market_ads");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const getDaysElapsed = (publishedAtStr: string) => {
    const diffMs = Date.now() - new Date(publishedAtStr).getTime();
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  };

  const handleDeleteMarketAd = async (id: string) => {
    try {
      const res = await fetch(`/api/market/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMarketAds(prev => prev.filter(ad => ad.id !== id));
        setMyPublishedAds(prev => {
          const updated = prev.filter(item => item.id !== id);
          localStorage.setItem("user_published_market_ads", JSON.stringify(updated));
          return updated;
        });
      } else alert("فشل حذف الإعلان من الخادم");
    } catch (err) { console.error("Error deleting market ad:", err); }
  };

  const handleExtendMarketAd = async (id: string) => {
    try {
      const res = await fetch(`/api/market/${id}/extend`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setMarketAds(prev => prev.map(ad => ad.id === id ? { ...ad, timestamp: data.ad.timestamp } : ad));
        setMyPublishedAds(prev => {
          const updated = prev.map(item => item.id === id ? { ...item, publishedAt: new Date().toISOString() } : item);
          localStorage.setItem("user_published_market_ads", JSON.stringify(updated));
          return updated;
        });
      } else alert("فشل تمديد الإعلان");
    } catch (err) { console.error("Error extending market ad:", err); }
  };

  const handleSimulate30Days = (id: string) => {
    setMyPublishedAds(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          const thirtyOneDaysAgo = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);
          return { ...item, publishedAt: thirtyOneDaysAgo.toISOString() };
        }
        return item;
      });
      localStorage.setItem("user_published_market_ads", JSON.stringify(updated));
      return updated;
    });
  };

  const extractNumericPrice = (priceStr: string): number => {
    if (!priceStr) return 0;
    const cleaned = priceStr.replace(/,/g, "").match(/\d+(\.\d+)?/);
    return cleaned ? parseFloat(cleaned[0]) : 0;
  };

  const getPriceCurrency = (priceStr: string): string => {
    if (!priceStr) return "ريال يمني";
    const str = priceStr.toLowerCase();
    if (str.includes("$") || str.includes("dollar") || str.includes("دولار")) return "دولار أمريكي ($)";
    if (str.includes("سعودي") || str.includes("ر.س") || str.includes("sar") || str.includes("ر. س")) return "ريال سعودي";
    return "ريال يمني";
  };

  const [mofaAppNumber, setMofaAppNumber] = useState("");
  const [mofaPassportNumber, setMofaPassportNumber] = useState("");
  const [mofaVisaType, setMofaVisaType] = useState("عمل");
  const [mofaLoading, setMofaLoading] = useState(false);
  const [mofaResult, setMofaResult] = useState<any | null>(null);

  const [estVisaType, setEstVisaType] = useState("عمل");
  const [estCountry, setEstCountry] = useState("السعودية");
  const [estApplicants, setEstApplicants] = useState(1);
  const [estMedical, setEstMedical] = useState(false);
  const [estAuth, setEstAuth] = useState(false);
  const [estTranslation, setEstTranslation] = useState(false);
  const [estInsurance, setEstInsurance] = useState(false);
  const [estCurrency, setEstCurrency] = useState("SAR");

  const ESTIMATOR_VISA_TYPES = [
    { key: "عمل", label: "تأشيرة عمل (مهنية)", base: 2000 },
    { key: "عائلية", label: "تأشيرة زيارة عائلية", base: 500 },
    { key: "شخصية", label: "تأشيرة زيارة شخصية", base: 600 },
    { key: "إقامة", label: "تأشيرة إقامة / عائلية", base: 1200 },
    { key: "تمديد", label: "تأشيرة تمديد خروج وعودة", base: 400 },
    { key: "سياحية", label: "تأشيرة سياحية", base: 450 }
  ];

  const ESTIMATOR_COUNTRIES = [
    { key: "السعودية", label: "المملكة العربية السعودية 🇸🇦", extra: 0 },
    { key: "الإمارات", label: "الإمارات العربية المتحدة 🇦🇪", extra: 150 },
    { key: "قطر", label: "دولة قطر 🇶🇦", extra: 200 },
    { key: "عمان", label: "سلطنة عمان 🇴🇲", extra: 100 },
    { key: "البحرين", label: "مملكة البحرين 🇧🇭", extra: 100 },
    { key: "الكويت", label: "دولة الكويت 🇰🇼", extra: 150 }
  ];

  const [language] = useState<"ar" | "en">("ar");

  useEffect(() => {
    try { localStorage.setItem("app_language", "ar"); } catch (e) { console.error(e); }
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
  }, []);

  const t = (arText: string, enText: string) => language === "ar" ? arText : enText;
  
  const [mofaTrackedRequests, setMofaTrackedRequests] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("mofa_tracked_requests");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [activeMofaNotification, setActiveMofaNotification] = useState<any | null>(null);

  useEffect(() => {
    localStorage.setItem("mofa_tracked_requests", JSON.stringify(mofaTrackedRequests));
  }, [mofaTrackedRequests]);

  const handleToggleTrackMofaRequest = (request: { appNumber: string; passportNumber: string; visaType: string; statusText: string }) => {
    const isTracked = mofaTrackedRequests.some(r => r.appNumber === request.appNumber);
    if (isTracked) {
      setMofaTrackedRequests(prev => prev.filter(r => r.appNumber !== request.appNumber));
    } else {
      const newTracked = {
        appNumber: request.appNumber,
        passportNumber: request.passportNumber,
        visaType: request.visaType,
        currentStatus: request.statusText,
        lastChecked: new Date().toLocaleTimeString("ar-YE", { hour: '2-digit', minute: '2-digit' }),
        history: [{ status: request.statusText, date: new Date().toLocaleDateString("ar-YE") }]
      };
      setMofaTrackedRequests(prev => [...prev, newTracked]);
    }
  };

  const handleSimulateStatusChange = (appNumber: string, nextStatusIndex?: number) => {
    const statuses = [
      "قيد الدراسة والمراجعة في القسم القنصلي",
      "تم تدقيق المستندات بنجاح في القنصلية 🔎",
      "تم إصدار التأشيرة بنجاح وطباعتها على جواز السفر 🎉",
      "يُرجى مراجعة المكتب لاستكمال صور الجواز الأصلية ⚠️"
    ];
    setMofaTrackedRequests(prev => {
      return prev.map(req => {
        if (req.appNumber === appNumber) {
          const currentIndex = statuses.indexOf(req.currentStatus);
          const nextIndex = nextStatusIndex !== undefined ? nextStatusIndex : (currentIndex + 1) % statuses.length;
          const newStatus = statuses[nextIndex];
          const oldStatus = req.currentStatus;
          setActiveMofaNotification({
            id: Math.random().toString(),
            appNumber: req.appNumber,
            oldStatus: oldStatus,
            newStatus: newStatus,
            visaType: req.visaType
          });
          if (mofaResult && mofaResult.appNumber === appNumber) {
            setMofaResult((prev: any) => ({
              ...prev,
              statusText: newStatus,
              subStatus: "تم التحديث آلياً من نظام التتبع والإشعارات البرمجية الذكي.",
              steps: [
                ...prev.steps.slice(0, 3),
                { name: newStatus, status: nextIndex === 2 ? "completed" : "active", date: "تحديث فوري" }
              ]
            }));
          }
          return {
            ...req,
            currentStatus: newStatus,
            lastChecked: new Date().toLocaleTimeString("ar-YE", { hour: '2-digit', minute: '2-digit' }),
            history: [...req.history, { status: newStatus, date: new Date().toLocaleDateString("ar-YE") }]
          };
        }
        return req;
      });
    });
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const triggerFetchWithProgress = () => {
    setIsSectionLoading(true);
    setSectionLoadingProgress(15);
    const interval = setInterval(() => {
      setSectionLoadingProgress(prev => {
        if (prev >= 85) { clearInterval(interval); return prev; }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    const fetchJobs = fetch("/api/jobs")
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(data => { if (Array.isArray(data) && data.length > 0) setJobAds(data); else throw new Error(); })
      .catch(() => {
        setJobAds([
          { id: "ext-1", type: "external", name: "موقع مرجان للوظائف", title: "مطلوب مهندس مدني خبرة 5 سنوات", phone: "", specialty: "هندسة مدنية", country: "السعودية (الرياض)", details: "شركة مقاولات كبرى في الرياض تطلب مهندس مدني خبرة لا تقل عن 5 سنوات في الإشراف على المشاريع التجارية. رواتب مجزية وتأمين طبي.", timestamp: new Date().toLocaleDateString("ar-EG", { year: 'numeric', month: 'short', day: 'numeric' }), url: "https://mourjan.com/jobs/12345" },
          { id: "ext-2", type: "external", name: "وظائف العرب", title: "مطلوب محاسب مالي مقيم", phone: "", specialty: "محاسبة ومالية", country: "الإمارات (دبي)", details: "مطلوب بشكل عاجل محاسب مالي يجيد العمل على برامج ERP وإعداد التقارير الضريبية. يفضل من لديه إقامة قابلة للتحويل في دبي.", timestamp: new Date(Date.now() - 86400000).toLocaleDateString("ar-EG", { year: 'numeric', month: 'short', day: 'numeric' }), url: "https://arabjobs.com/job/67890" }
        ]);
      });

    const fetchMarket = fetch("/api/market")
      .then(res => { if (res.ok) return res.json(); throw new Error(); })
      .then(data => setMarketAds(data))
      .catch(err => console.error(err));

    Promise.all([fetchJobs, fetchMarket]).then(() => {
      clearInterval(interval);
      setSectionLoadingProgress(100);
      setTimeout(() => { setIsSectionLoading(false); setSectionLoadingProgress(0); }, 400);
    });
  };

  useEffect(() => { triggerFetchWithProgress(); }, [activeSidebarTab, jobsSubTab]);

  const [seenJobIds, setSeenJobIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("seen_job_ids");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const [seenMarketIds, setSeenMarketIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("seen_market_ids");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    if (activeSidebarTab === "jobs" && jobAds.length > 0) {
      setSeenJobIds(prev => {
        const currentIds = jobAds.map(ad => ad.id);
        if (currentIds.some(id => !prev.includes(id))) {
          const updated = Array.from(new Set([...prev, ...currentIds]));
          localStorage.setItem("seen_job_ids", JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }
  }, [activeSidebarTab, jobAds.length]);

  useEffect(() => {
    if (activeSidebarTab === "trade" && marketAds.length > 0) {
      setSeenMarketIds(prev => {
        const currentIds = marketAds.map(ad => ad.id);
        if (currentIds.some(id => !prev.includes(id))) {
          const updated = Array.from(new Set([...prev, ...currentIds]));
          localStorage.setItem("seen_market_ids", JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }
  }, [activeSidebarTab, marketAds.length]);

  const hasUnseenJobs = jobAds.some(ad => !seenJobIds.includes(ad.id));
  const hasUnseenMarket = marketAds.some(ad => !seenMarketIds.includes(ad.id));

  const handlePublishAdSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newAdForm.name.trim() || !newAdForm.phone.trim() || !newAdForm.country.trim() || !newAdForm.details.trim()) {
      setAdPublishError("الرجاء تعبئة جميع الحقول الأساسية المطلوبة.");
      return;
    }
    setAdPublishError(null);
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: jobsSubTab === "seekers" ? "seeker" : "employer",
          name: newAdForm.name, phone: newAdForm.phone, specialty: newAdForm.specialty, country: newAdForm.country, details: newAdForm.details, salary: newAdForm.salary, experience: newAdForm.experience, image: newAdForm.image || undefined
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "فشل نشر الإعلان");
      setJobAds(prev => [data, ...prev]);
      setAdPublishSuccess(true);
      setNewAdForm({ name: "", phone: "", specialty: "سائق خاص / سائق شاحنة", country: "", details: "", salary: "", experience: "", image: "" });
      setTimeout(() => { setAdPublishSuccess(false); setIsPublishingAd(false); }, 3000);
    } catch (err: any) { setAdPublishError(err.message || "عذراً، حدث خطأ أثناء نشر الإعلان."); }
  };

  const handlePublishMarketAdSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMarketAdForm.title.trim() || !newMarketAdForm.details.trim() || !newMarketAdForm.price.trim() || !newMarketAdForm.location.trim() || !newMarketAdForm.name.trim() || !newMarketAdForm.phone.trim()) {
      setMarketPublishError("الرجاء تعبئة جميع الحقول المطلوبة.");
      return;
    }
    setMarketPublishError(null);
    try {
      const response = await fetch("/api/market", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMarketAdForm)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "فشل نشر الإعلان");
      setMarketAds(prev => [data, ...prev]);
      const publishInfo = { id: data.id, title: data.title, publishedAt: new Date().toISOString() };
      setMyPublishedAds(prev => {
        const updated = [publishInfo, ...prev];
        localStorage.setItem("user_published_market_ads", JSON.stringify(updated));
        return updated;
      });
      setMarketPublishSuccess(true);
      setNewMarketAdForm({ type: "sell", category: "تأشيرات وإقامات", title: "", details: "", price: "", location: "", name: "", phone: "", image: "" });
      setTimeout(() => { setMarketPublishSuccess(false); setIsPublishingMarketAd(false); }, 3000);
    } catch (err: any) { setMarketPublishError(err.message || "عذراً، حدث خطأ أثناء نشر الإعلان."); }
  };

  useEffect(() => {
    fetch("/api/office-info")
      .then(res => { if (res.ok) return res.json(); throw new Error(); })
      .then(data => setOffice(data))
      .catch(() => { setOffice(DEFAULT_OFFICE_INFO); });
  }, []);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, isLoading]);

  // ==================== التعديل السحري والربط المباشر بجميني من الاستضافة الجاهزة ====================
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    setActiveSidebarTab("info");
    setTimeout(() => {
      const element = document.getElementById("chat_section");
      if (element) element.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    if (!textToSend) setInputText("");
    setIsLoading(true);
    setError(null);

    try {
      // سحب المفتاح السري المدمج من منصة Render بشكل آمن تماماً
      const renderApiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!renderApiKey) {
        throw new Error("لم يتم العثور على مفتاح الـ API في البيئة. يرجى التأكد من كتابة المفتاح في Render كمتغير بيئي باسم VITE_GEMINI_API_KEY.");
      }

      // الاتصال المباشر برابط سيرفر جميني الرسمي بدلاً من المسار الوهمي المفقود
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${renderApiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `أنت مساعد ذكي مخصص لمكتب أبو مجد للخدمات والسفريات. أجب العميل بلطف وبصيغة مهنية ممتازة. الاستفسار هو: ${text}` }]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error("فشلت عملية الاتصال بخادم جميني، يرجى مراجعة صلاحية المفتاح في منصة الاستضافة.");
      }

      const data = await response.json();
      const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أستطع معالجة الرد حالياً.";

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: replyText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "عذراً، حدث خطأ أثناء الاتصال بالذكاء الاصطناعي.");
    } finally {
      setIsLoading(false);
    }
  };
  // ====================================================================================

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyContact = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleMofaQuerySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!mofaAppNumber.trim() || !mofaPassportNumber.trim()) return;
    setMofaLoading(true);
    setMofaResult(null);
    setTimeout(() => {
      setMofaLoading(false);
      setMofaResult({
        appNumber: mofaAppNumber, passportNumber: mofaPassportNumber, visaType: mofaVisaType,
        statusText: "قيد الدراسة والمراجعة في القسم القنصلي", subStatus: "تم التحقق من سداد الرسوم والربط بالتأمين الصحي بنجاح.",
        timestamp: new Date().toLocaleDateString("ar-YE", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        steps: [
          { name: "تقديم الطلب وتسجيله إلكترونياً", status: "completed", date: "تمت بنجاح" },
          { name: "سداد الرسوم وتفعيل التأمين الطبي المعتمد", status: "completed", date: "تم الدفع والربط" },
          { name: "التدقيق والمطابقة لدى الممثلية / السفارة", status: "active", date: "قيد المراجعة الفنية" },
          { name: "تصدير وطباعة التأشيرة على الجواز", status: "pending", date: "بانتظار الموافقة" }
        ]
      });
    }, 1500);
  };

  const renderMessageText = (text: string, isUser: boolean) => {
    return text.split("\n").map((line, lineIdx) => {
      const isBullet = line.trim().startsWith("- ") || line.trim().startsWith("* ");
      const cleanLine = isBullet ? line.replace(/^[-*]\s+/, "") : line;
      const parts = cleanLine.split(/\*\*([\s\S]*?)\*\*/g);
      const renderedLine = parts.map((part, partIdx) => {
        if (partIdx % 2 === 1) return <strong key={partIdx} className={`font-bold ${isUser ? "text-zinc-950 font-extrabold" : "text-[#c5a059] font-semibold"}`}>{part}</strong>;
        return part;
      });
      if (isBullet) return <li key={lineIdx} className={`mr-5 list-disc list-outside mb-1 ${isUser ? "text-zinc-950" : "text-zinc-300"}`}>{renderedLine}</li>;
      return <p key={lineIdx} className={`mb-2 leading-relaxed last:mb-0 ${isUser ? "text-zinc-950" : "text-zinc-300"}`}>{renderedLine}</p>;
    });
  };

  const filteredPortals = FLIGHT_BOOKING_PORTALS.filter(p => 
    p.name.toLowerCase().includes(jobsSearch.toLowerCase()) || p.type.toLowerCase().includes(jobsSearch.toLowerCase()) || p.description.toLowerCase().includes(jobsSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#f4f4f5] flex flex-col font-sans" id="app_root">
      <AnimatePresence>
        {isSectionLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed top-0 left-0 right-0 z-50 h-1 bg-zinc-950/20">
            <div className="h-full bg-gradient-to-r from-[#c5a059] via-amber-500 to-[#c5a059] shadow-[0_0_8px_#c5a059] transition-all duration-300 ease-out" style={{ width: `${sectionLoadingProgress}%` }} />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeMofaNotification && (
          <motion.div initial={{ opacity: 0, y: -50, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20, scale: 0.95 }} className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 max-w-md bg-[#0f0f12] border-2 border-amber-500/80 rounded-2xl p-4 shadow-[0_12px_40px_-12px_rgba(197,160,89,0.3)] text-right" dir="rtl">
            <div className="flex gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-amber-500/10 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059] animate-bounce"><Bell className="h-5 w-5" /></div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] bg-amber-500/15 text-[#c5a059] px-2 py-0.5 rounded-full font-bold">تحديث حالة التأشيرة تلقائياً 🔔</span>
                  <button onClick={() => setActiveMofaNotification(null)} className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 rounded-lg hover:bg-zinc-800"><X className="h-4 w-4" /></button>
                </div>
                <h5 className="text-xs font-extrabold text-zinc-100 mt-2">تغيرت حالة الطلب رقم ({activeMofaNotification.appNumber})</h5>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">معاملة <span className="text-zinc-200 font-bold">{activeMofaNotification.visaType}</span> انتقلت حالتها الآن إلى:</p>
                <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-850 mt-2 text-xs font-bold text-emerald-400 flex items-center gap-1.5 justify-start">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>{activeMofaNotification.newStatus}</span>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <button onClick={() => {
                    setActiveSidebarTab("mofa"); setMofaAppNumber(activeMofaNotification.appNumber); setMofaVisaType(activeMofaNotification.visaType);
                    setMofaResult({
                      appNumber: activeMofaNotification.appNumber, visaType: activeMofaNotification.visaType, statusText: activeMofaNotification.newStatus, subStatus: "تم الاستعلام التلقائي عبر التتبع الذكي.",
                      steps: [{ name: "تقديم الطلب وتسجيله إلكترونياً", status: "completed", date: "تمت بنجاح" }, { name: "سداد الرسوم وتفعيل التأمين الطبي المعتمد", status: "completed", date: "تم الدفع والربط" }, { name: "التدقيق والمطابقة لدى الممثلية / السفارة", status: "completed", date: "منجز" }, { name: activeMofaNotification.newStatus, status: "active", date: "تحديث فوري" }]
                    });
                    setActiveMofaNotification(null);
                  }} className="text-[10px] font-bold bg-[#c5a059] hover:bg-amber-500 text-black px-3 py-1.5 rounded-lg transition-all">عرض التفاصيل بالكامل</button>
                  <button onClick={() => setActiveMofaNotification(null)} className="text-[10px] font-bold text-zinc-400 hover:text-zinc-200 px-2 py-1.5">تجاهل</button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className="bg-[#0f0f12] border-b border-zinc-800 py-5 px-6 sm:px-10 sticky top-0 z-40" id="app_header">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#c5a059]/40 bg-[#0c0c0e] flex items-center justify-center shadow-lg relative group shrink-0">
              <img src={appLogo} alt={t("شعار أبو مجد", "Abu Majd Logo")} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" referrerPolicy="no-referrer" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#fefefe] flex items-center gap-2">{language === "ar" ? office.name : "Abu Majd Al-Haddad Travel"}</h1>
              <p className="text-xs text-[#c5a059] font-medium uppercase tracking-widest mt-0.5">{t("التميز في خدمات السفر والسياحة والتوظيف والخدمات العامة", "Excellence in Travel, Tourism, Recruitment, and General Services")}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center sm:items-end">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{t("الحالة", "Status")}</span>
              <span className="flex items-center gap-2 text-xs text-emerald-400 font-medium"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>{t("متصل الآن لخدمتكم", "Online to serve you")}</span>
            </div>
            <button onClick={() => setIsDarkMode(!isDarkMode)} type="button" className="p-2 rounded-full border border-zinc-700/80 bg-zinc-900/30 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-inner" id="theme_toggle_btn">
              {isDarkMode ? <Sun className="h-4 w-4 text-[#c5a059]" /> : <Moon className="h-4 w-4 text-amber-500" />}
            </button>
            <button onClick={() => setIsSettingsOpen(true)} type="button" className="p-2 rounded-full border border-zinc-700/80 bg-zinc-900/30 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-inner gap-1" id="app_settings_btn">
              <Settings className="h-4 w-4 text-[#c5a059] hover:rotate-45 transition-transform duration-300" />
            </button>
            <a href={`https://wa.me/${office.phone.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="px-5 py-2 rounded-full border border-zinc-700 hover:bg-zinc-800 text-sm font-medium transition-all text-zinc-100 hover:text-white">{t("اتصل بنا", "Contact Us")}</a>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6" id="main_content">
        <section className="lg:col-span-1 flex flex-col gap-6" id="office_sidebar">
          <div className="bg-[#0f0f12] rounded-2xl shadow-xl border border-zinc-800 overflow-hidden flex flex-col">
            <div className="flex border-b border-zinc-800 bg-[#0c0c0e]/45 p-1 gap-0.5 overflow-x-auto scrollbar-none">
              <button onClick={() => setActiveSidebarTab("info")} className={`flex-1 py-2 px-1 text-[9px] sm:text-xs font-bold text-center rounded-xl transition-all flex items-center justify-center gap-0.5 shrink-0 cursor-pointer ${activeSidebarTab === "info" ? "bg-zinc-800 text-[#c5a059] shadow-inner" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"}`}><Compass className="h-3.5 w-3.5" />{t("أبو مجد", "Abu Majd")}</button>
              <button onClick={() => setActiveSidebarTab("flights")} className={`flex-1 py-2 px-1 text-[9px] sm:text-xs font-bold text-center rounded-xl transition-all flex items-center justify-center gap-0.5 shrink-0 cursor-pointer ${activeSidebarTab === "flights" ? "bg-zinc-800 text-[#c5a059] shadow-inner" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"}`}><Plane className="h-3.5 w-3.5" />{t("طيران", "Flights")}</button>
              <button onClick={() => setActiveSidebarTab("jobs")} className={`flex-1 py-2 px-1 text-[9px] sm:text-xs font-bold text-center rounded-xl transition-all flex items-center justify-center gap-0.5 shrink-0 cursor-pointer relative ${activeSidebarTab === "jobs" ? "bg-zinc-800 text-[#c5a059] shadow-inner" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"}`}><div className="relative flex items-center justify-center gap-0.5"><Briefcase className="h-3.5 w-3.5" /><span>{t("التوظيف", "Jobs")}</span>{hasUnseenJobs && <span className="absolute -top-1 -right-2 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 animate-pulse"></span></span>}</div></button>
              <button onClick={() => setActiveSidebarTab("trade")} className={`flex-1 py-2 px-1 text-[9px] sm:text-xs font-bold text-center rounded-xl transition-all flex items-center justify-center gap-0.5 shrink-0 cursor-pointer relative ${activeSidebarTab === "trade" ? "bg-zinc-800 text-[#c5a059] shadow-inner" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"}`}><div className="relative flex items-center justify-center gap-0.5"><ShoppingBag className="h-3.5 w-3.5" /><span>{t("بيع وشراء", "Market")}</span>{hasUnseenMarket && <span className="absolute -top-1 -right-2 flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 animate-pulse"></span></span>}</div></button>
              <button onClick={() => setActiveSidebarTab("mofa")} className={`flex-1 py-2 px-1 text-[9px] sm:text-xs font-bold text-center rounded-xl transition-all flex items-center justify-center gap-0.5 shrink-0 cursor-pointer ${activeSidebarTab === "mofa" ? "bg-zinc-800 text-[#c5a059] shadow-inner" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"}`}><Search className="h-3.5 w-3.5" />{t("الخارجية", "MOFA")}</button>
              <button onClick={() => setActiveSidebarTab("favorites")} className={`flex-1 py-2 px-1 text-[9px] sm:text-xs font-bold text-center rounded-xl transition-all flex items-center justify-center gap-0.5 shrink-0 cursor-pointer relative ${activeSidebarTab === "favorites" ? "bg-zinc-800 text-[#c5a059] shadow-inner" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"}`}><div className="relative flex items-center justify-center gap-0.5"><Heart className={`h-3.5 w-3.5 ${favoritedJobIds.length + favoritedMarketIds.length > 0 ? "fill-rose-500 text-rose-500 animate-pulse" : ""}`} /><span>{t("المفضلة", "Favorites")}</span>{favoritedJobIds.length + favoritedMarketIds.length > 0 && <span className="text-[8px] bg-[#c5a059] text-black font-extrabold px-1 rounded-full min-w-[14px] text-center font-mono">{favoritedJobIds.length + favoritedMarketIds.length}</span>}</div></button>
              <button onClick={() => setActiveSidebarTab("chats")} className={`flex-1 py-2 px-1 text-[9px] sm:text-xs font-bold text-center rounded-xl transition-all flex items-center justify-center gap-0.5 shrink-0 cursor-pointer relative ${activeSidebarTab === "chats" ? "bg-zinc-800 text-[#c5a059] shadow-inner" : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"}`}><div className="relative flex items-center justify-center gap-0.5"><MessageSquare className="h-3.5 w-3.5" /><span>{t("الدردشات", "Chats")}</span></div></button>
            </div>

            <div className="p-5 flex-1 min-h-[360px]">
              {activeSidebarTab === "info" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-5">
                  <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 rounded-2xl border border-zinc-800 shadow-xl flex flex-col gap-4 text-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 via-[#c5a059] to-amber-600"></div>
                    <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-[#c5a059] shadow-2xl bg-black relative">
                      <img src={appLogo} alt={t("الهوية الرسمية لأبو مجد", "Abu Majd Official Identity")} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" referrerPolicy="no-referrer" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h4 className="text-sm font-extrabold text-zinc-100 uppercase tracking-wide">أبو مجد للسفريات والسياحة</h4>
                      <p className="text-[10px] text-[#c5a059] font-bold">خدمات السفر والسياحة وتخليص المعاملات والأيادي العاملة</p>
                    </div>
                    <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-900 flex flex-col gap-2 font-mono text-xs text-zinc-300">
                      <div className="flex items-center justify-between text-[11px] border-b border-zinc-900 pb-1.5"><span className="text-zinc-500 font-sans">الرقم الرئيسي:</span><a href="tel:775012242" className="text-emerald-400 font-extrabold hover:underline">775012242</a></div>
                      <div className="flex items-center justify-between text-[11px]"><span className="text-zinc-500 font-sans">الرقم الإضافي:</span><a href="tel:738465200" className="text-emerald-400 font-extrabold hover:underline">738465200</a></div>
                    </div>
                    <p className="text-[10px] text-zinc-500 leading-relaxed">الوكيل المعتمد والأمثل لتسهيل كافة إجراءات سفركم ومعاملاتكم بأعلى درجات الدقة والسرعة.</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#c5a059] mb-2">عن أبو مجد الحداد</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">رائد ومتخصص في تقديم أرقى خدمات السفر والسياحة وتسهيل معاملات الفيزا والتأشيرات لمختلف دول العالم بأعلى درجات الكفاءة والموثوقية.</p>
                  </div>
                  <hr className="border-zinc-800/60" />
                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">بيانات التواصل السريع</span>
                    <div className="flex items-center justify-between p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/80">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-[#c5a059]/10 text-[#c5a059] p-2 rounded-lg border border-[#c5a059]/10"><Phone className="h-3.5 w-3.5" /></div>
                        <div>
                          <p className="text-[10px] text-zinc-500">الهاتف والواتساب</p>
                          <p className="text-xs font-bold text-zinc-200 direction-ltr mt-0.5">{office.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => copyContact(office.phone, "الهاتف")} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-md transition-colors">{copiedText === "الهاتف" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}</button>
                        <a href={`https://wa.me/${office.phone.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="text-[10px] font-extrabold text-black bg-[#c5a059] hover:bg-[#8e6e3c] px-2.5 py-1.5 rounded-lg shadow-xs transition-colors">مراسلة</a>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/80">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-[#c5a059]/10 text-[#c5a059] p-2 rounded-lg border border-[#c5a059]/10"><Mail className="h-3.5 w-3.5" /></div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] text-zinc-500">البريد الإلكتروني</p>
                          <p className="text-xs font-bold text-zinc-200 truncate block max-w-[120px] mt-0.5">{office.email}</p>
                        </div>
                      </div>
                      <button onClick={() => copyContact(office.email, "البريد")} className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-md transition-colors">{copiedText === "البريد" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}</button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">صفحات التواصل الاجتماعي</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 p-2 bg-zinc-900/30 border border-zinc-800/80 rounded-lg text-zinc-300">
                        <Facebook className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                        <div className="overflow-hidden">
                          <p className="text-[8px] text-zinc-500 font-bold uppercase">فيسبوك</p>
                          <p className="text-[10px] font-semibold truncate text-zinc-200" title={office.facebook}>{office.facebook}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-zinc-900/30 border border-zinc-800/80 rounded-lg text-zinc-300">
                        <Instagram className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                        <div className="overflow-hidden">
                          <p className="text-[8px] text-zinc-500 font-bold uppercase">إنستغرام</p>
                          <p className="text-[10px] font-semibold truncate text-zinc-200" title={office.instagram}>{office.instagram}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSidebarTab === "flights" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-extrabold text-[#c5a059] flex items-center gap-1.5"><Plane className="h-4 w-4" />منصات ومواقع الطيران الرسمية</h3>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">روابط حجز طيران مباشرة ومتابعة الرحلات الجوية عبر خطوط الطيران الوطنية والإقليمية المعتمدة:</p>
                  </div>
                  <div className="sticky top-0 z-10 bg-[#0c0c0e] pt-1 pb-3 -mx-1 px-1">
                    <div className="relative">
                      <Search className="absolute right-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                      <input type="text" value={jobsSearch} onChange={(e) => setJobsSearch(e.target.value)} placeholder="ابحث عن شركة طيران..." className="w-full text-xs bg-zinc-900 border border-zinc-800 pr-9 pl-3 py-2 rounded-xl text-zinc-200 focus:outline-hidden focus:border-[#c5a059] transition-all shadow-md" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 pr-1">
                    {filteredPortals.length > 0 ? (
                      filteredPortals.map((portal, idx) => (
                        <div key={idx} className="p-3 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800 rounded-xl transition-all flex flex-col gap-2 group">
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <h4 className="text-xs font-extrabold text-[#c5a059] group-hover:text-amber-300 transition-colors">{portal.name}</h4>
                              <span className={`inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded-md ${portal.badgeColor}`}>{portal.type}</span>
                            </div>
                            <a href={portal.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-zinc-400 hover:text-[#c5a059] flex items-center gap-0.5 font-bold transition-colors">زيارة<ExternalLink className="h-2.5 w-2.5" /></a>
                          </div>
                          <p className="text-[11px] text-zinc-400 leading-relaxed font-normal">{portal.description}</p>
                          <div className="flex justify-end pt-1">
                            <button onClick={() => handleSendMessage(`أريد حجز رحلة طيران عبر شركة "${portal.name}". هل يمكن لأبو مجد استعراض أفضل الأسعار، المواعيد المتاحة، والتأكيد الفوري للحجز؟`)} className="text-[9px] text-[#c5a059]/90 hover:text-white bg-[#c5a059]/10 hover:bg-[#c5a059] border border-[#c5a059]/20 px-2 py-1 rounded-md flex items-center gap-1 transition-all font-bold cursor-pointer"><Sparkles className="h-2.5 w-2.5" />استفسر واحجز عبر الذكاء الاصطناعي</button>
                          </div>
                        </div>
                      ))
                    ) : <div className="text-center py-6 text-xs text-zinc-500">لا توجد شركات طيران مطابقة لبحثك.</div>}
                  </div>
                </motion.div>
              )}

              {activeSidebarTab === "jobs" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                  <div className="flex bg-zinc-950/65 p-1 rounded-xl gap-1 border border-zinc-800">
                    <button onClick={() => { setJobsSubTab("employers"); setIsPublishingAd(false); }} className={`flex-1 py-1.5 text-[10px] font-bold text-center rounded-lg transition-all cursor-pointer ${jobsSubTab === "employers" ? "bg-[#c5a059] text-black shadow-md font-extrabold" : "text-zinc-400 hover:text-zinc-200"}`}>طلب عمالة</button>
                    <button onClick={() => { setJobsSubTab("seekers"); setIsPublishingAd(false); }} className={`flex-1 py-1.5 text-[10px] font-bold text-center rounded-lg transition-all cursor-pointer ${jobsSubTab === "seekers" ? "bg-[#c5a059] text-black shadow-md font-extrabold" : "text-zinc-400 hover:text-zinc-200"}`}>طلب عمل</button>
                  </div>
                  {(jobsSubTab === "employers" || jobsSubTab === "seekers") && (
                    <div className="flex flex-col gap-4">
                      {isPublishingAd ? (
                        <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handlePublishAdSubmit} className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col gap-3">
                          <h4 className="text-xs font-bold text-[#c5a059] flex items-center gap-1"><Sparkles className="h-3 w-3 animate-pulse" />{jobsSubTab === "employers" ? "نشر طلب عمالة جديد (لأصحاب العمل)" : "نشر طلب عمل جديد (للباحثين)"}</h4>
                          {adPublishSuccess ? (
                            <div className="bg-emerald-950/40 border border-emerald-900/50 p-3 rounded-xl text-center flex flex-col items-center justify-center gap-1 text-emerald-300 text-xs">
                              <CheckCircle className="h-5 w-5 text-emerald-400 animate-bounce" />
                              <p className="font-bold">تم نشر الإعلان بنجاح!</p>
                            </div>
                          ) : (
                            <>
                              {adPublishError && <div className="bg-rose-950/40 border border-rose-900/50 p-2 rounded-lg text-rose-300 text-[10px]">{adPublishError}</div>}
                              <div>
                                <label className="block text-[9px] text-zinc-400 font-bold mb-1">الاسم الكامل / الجهة المعلنة *</label>
                                <input type="text" required value={newAdForm.name} onChange={(e) => setNewAdForm({ ...newAdForm, name: e.target.value })} className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2.5 py-2 rounded-lg text-zinc-255 focus:outline-hidden focus:border-[#c5a059]" />
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[9px] text-zinc-400 font-bold mb-1">رقم جوال للتواصل *</label>
                                  <input type="text" required value={newAdForm.phone} onChange={(e) => setNewAdForm({ ...newAdForm, phone: e.target.value })} className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2.5 py-2 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059] direction-ltr" />
                                </div>
                                <div>
                                  <label className="block text-[9px] text-zinc-400 font-bold mb-1">الموقع أو بلد العمل المطلوب *</label>
                                  <input type="text" required value={newAdForm.country} onChange={(e) => setNewAdForm({ ...newAdForm, country: e.target.value })} className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2.5 py-2 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059]" />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[9px] text-zinc-400 font-bold mb-1">تخصص العمالة والمهن *</label>
                                <select value={newAdForm.specialty} onChange={(e) => setNewAdForm({ ...newAdForm, specialty: e.target.value })} className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2 py-2 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059]">
                                  {LABOR_SPECIALTIES.map((spec, i) => <option key={i} value={spec}>{spec}</option>)}
                                </select>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[9px] text-zinc-400 font-bold mb-1">الراتب المتوقع أو المعروض</label>
                                  <input type="text" value={newAdForm.salary} onChange={(e) => setNewAdForm({ ...newAdForm, salary: e.target.value })} className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2.5 py-2 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059]" />
                                </div>
                                <div>
                                  <label className="block text-[9px] text-zinc-400 font-bold mb-1">سنوات الخبرة</label>
                                  <input type="text" value={newAdForm.experience} onChange={(e) => setNewAdForm({ ...newAdForm, experience: e.target.value })} className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2.5 py-2 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059]" />
                                </div>
                              </div>
                              <div>
                                <label className="block text-[9px] text-zinc-400 font-bold mb-1">تفاصيل الإعلان أو الشروط الإضافية *</label>
                                <textarea required rows={3} value={newAdForm.details} onChange={(e) => setNewAdForm({ ...newAdForm, details: e.target.value })} className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2.5 py-2 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059] resize-none" />
                              </div>
                              <div>
                                <label className="block text-[9px] text-zinc-400 font-bold mb-1">إضافة صورة للإعلان (اختياري)</label>
                                <div className="border border-dashed border-zinc-800 rounded-lg p-2 bg-[#0c0c0e] flex flex-col items-center justify-center gap-1.5 transition-all hover:border-[#c5a059]/40 relative min-h-[60px]">
                                  {newAdForm.image ? (
                                    <div className="relative w-full flex items-center justify-between bg-zinc-900/60 p-1.5 rounded-md border border-zinc-800">
                                      <div className="flex items-center gap-2">
                                        <img src={newAdForm.image} alt="معاينة" className="h-10 w-10 object-cover rounded-md border border-zinc-700" referrerPolicy="no-referrer" />
                                        <span className="text-[10px] text-zinc-300 font-medium">صورة مضافة بنجاح</span>
                                      </div>
                                      <button type="button" onClick={() => setNewAdForm(prev => ({ ...prev, image: "" }))} className="p-1 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-black rounded-md transition-all cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                                    </div>
                                  ) : (
                                    <label className="w-full flex flex-col items-center justify-center py-2 cursor-pointer">
                                      <div className="flex items-center gap-1.5 text-zinc-400 hover:text-[#c5a059] transition-colors"><Camera className="h-4 w-4" /><span className="text-[10px] font-bold">اضغط هنا لإرفاق صورة</span></div>
                                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "job")} className="hidden" />
                                    </label>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2 justify-end mt-1">
                                <button type="button" onClick={() => setIsPublishingAd(false)} className="px-3 py-2 border border-zinc-800 hover:bg-zinc-800 rounded-lg text-zinc-400 text-[10px] font-bold cursor-pointer">إلغاء</button>
                                <button type="submit" className="px-4 py-2 bg-[#c5a059] hover:bg-amber-500 text-black rounded-lg text-[10px] font-bold cursor-pointer">حفظ ونشر الإعلان</button>
                              </div>
                            </>
                          )}
                        </motion.form>
                      ) : (
                        <>
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-[11px] font-bold text-zinc-300">{jobsSubTab === "employers" ? "لوحة طالبي العمالة (أصحاب العمل):" : "لوحة طالبي العمل (الوظائف المتاحة):"}</span>
                            <button onClick={() => setIsPublishingAd(true)} className="px-3 py-1.5 bg-[#c5a059]/10 hover:bg-[#c5a059] text-[#c5a059] hover:text-black border border-[#c5a059]/20 hover:border-transparent text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"><Sparkles className="h-3 w-3" />أنشئ إعلانك الآن</button>
                          </div>
                          <div className="sticky top-0 z-10 flex flex-col gap-2.5 bg-[#0c0c0e] pt-1 pb-3 -mx-1 px-1">
                            <div className="flex flex-col gap-2.5 bg-zinc-900/90 backdrop-blur-md p-3 rounded-xl border border-zinc-850 shadow-md">
                              <div className="flex gap-2 items-center">
                                <div className="relative flex-1">
                                  <Search className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                                  <input type="text" value={jobSearchQuery} onChange={(e) => setJobSearchQuery(e.target.value)} placeholder="ابحث بالاسم، التخصص، أو البلد..." className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 pr-8 pl-8 py-2 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059] transition-all placeholder:text-zinc-600" />
                                  {jobSearchQuery && <button type="button" onClick={() => setJobSearchQuery("")} className="absolute left-2.5 top-2.5 text-zinc-500 hover:text-zinc-300"><X className="h-3.5 w-3.5" /></button>}
                                </div>
                                <button onClick={() => setShowAdvancedFilters(!showAdvancedFilters)} className={`px-3 py-2 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${showAdvancedFilters || selectedSpecialtyFilter !== "all" || jobLocationFilter !== "all" || jobSalaryFilter !== "all" || jobDateSort !== "newest" ? "bg-[#c5a059]/20 border-[#c5a059] text-[#c5a059]" : "bg-[#0c0c0e] border-zinc-800 text-zinc-400 hover:text-zinc-200"}`}><Filter className="h-3.5 w-3.5" /></button>
                              </div>
                              <AnimatePresence>
                                {showAdvancedFilters && (
                                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                                      <div className="flex flex-col gap-1">
                                        <span className="text-[8px] text-zinc-500 font-bold flex items-center gap-1"><Briefcase className="h-2.5 w-2.5 text-[#c5a059]" />تخصص العمالة:</span>
                                        <select value={selectedSpecialtyFilter} onChange={(e) => setSelectedSpecialtyFilter(e.target.value)} className="w-full text-[10px] bg-[#0c0c0e] border border-[#1b1b22] px-1.5 py-1.5 rounded-lg text-zinc-300 focus:outline-hidden focus:border-[#c5a059]">
                                          <option value="all">كل التخصصات</option>
                                          {LABOR_SPECIALTIES.map((spec, i) => <option key={i} value={spec}>{spec}</option>)}
                                        </select>
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <span className="text-[8px] text-zinc-500 font-bold flex items-center gap-1"><MapPin className="h-2.5 w-2.5 text-[#c5a059]" />موقع العمل:</span>
                                        <select value={jobLocationFilter} onChange={(e) => setJobLocationFilter(e.target.value)} className="w-full text-[10px] bg-[#0c0c0e] border border-[#1b1b22] px-1.5 py-1.5 rounded-lg text-zinc-300 focus:outline-hidden focus:border-[#c5a059]">
                                          <option value="all">كل المواقع</option>
                                          <option value="saudi">السعودية 🇸🇦</option>
                                          <option value="yemen">اليمن 🇾🇪</option>
                                        </select>
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <span className="text-[8px] text-zinc-500 font-bold flex items-center gap-1"><DollarSign className="h-2.5 w-2.5 text-[#c5a059]" />الراتب:</span>
                                        <select value={jobSalaryFilter} onChange={(e) => setJobSalaryFilter(e.target.value)} className="w-full text-[10px] bg-[#0c0c0e] border border-[#1b1b22] px-1.5 py-1.5 rounded-lg text-zinc-300 focus:outline-hidden focus:border-[#c5a059]">
                                          <option value="all">الكل</option>
                                        </select>
                                      </div>
                                      <div className="flex flex-col gap-1">
                                        <span className="text-[8px] text-zinc-500 font-bold flex items-center gap-1"><Clock className="h-2.5 w-2.5 text-[#c5a059]" />النشر:</span>
                                        <select value={jobDateSort} onChange={(e) => setJobDateSort(e.target.value as any)} className="w-full text-[10px] bg-[#0c0c0e] border border-[#1b1b22] px-1.5 py-1.5 rounded-lg text-zinc-300 focus:outline-hidden focus:border-[#c5a059]">
                                          <option value="newest">الأحدث</option>
                                        </select>
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>

                          <div className="flex flex-col gap-3 pr-1">
                            {sortJobAdsByDate(jobAds.filter(matchesJobAd), jobDateSort).length > 0 ? (
                              sortJobAdsByDate(jobAds.filter(matchesJobAd), jobDateSort).map((ad) => (
                                <div key={ad.id} className="p-3 bg-[#111115] hover:bg-zinc-900 border border-zinc-850 rounded-xl transition-all flex flex-col gap-2.5 group">
                                  <div className="flex justify-between items-start gap-1">
                                    <div>
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <h4 className="text-xs font-extrabold text-[#c5a059] group-hover:text-amber-300 transition-colors">{ad.title || ad.name}</h4>
                                        {ad.title && <span className="text-[9px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded-md border border-zinc-800">{ad.name}</span>}
                                        <button type="button" onClick={() => handleOpenRatingModal(ad.name, ad.phone)} className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-[8px] font-bold cursor-pointer transition-all">
                                          <Star className="h-2.5 w-2.5 fill-amber-400 stroke-amber-400" />
                                          <span>{getAdvertiserRating(ad.phone).count > 0 ? getAdvertiserRating(ad.phone).average : "جديد"}</span>
                                        </button>
                                      </div>
                                      <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">{ad.specialty}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <button type="button" onClick={() => toggleJobFavorite(ad.id)} className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"><Heart className={`h-3.5 w-3.5 ${favoritedJobIds.includes(ad.id) ? "fill-rose-500 text-rose-500" : "text-zinc-500"}`} /></button>
                                      <span className="text-[9px] text-zinc-500 font-medium whitespace-nowrap">{ad.timestamp}</span>
                                    </div>
                                  </div>
                                  <p className="text-[11px] text-zinc-300 leading-relaxed font-normal bg-zinc-950/20 p-2 rounded-lg border border-zinc-850/60">
                                    {activeTranslations[ad.id] && translatedTexts[ad.id] ? <span>{translatedTexts[ad.id]}</span> : ad.details}
                                  </p>
                                  <div className="flex gap-2 justify-end pt-1 flex-wrap">
                                    <button type="button" onClick={() => handleTranslate(ad.id, ad.details)} className="text-[9px] bg-zinc-800 px-2.5 py-1.5 rounded-md border border-zinc-700/30 text-zinc-300">ترجمة للعربية</button>
                                    {ad.phone && <button type="button" onClick={() => handleStartChat(ad.phone, ad.name, ad.id, `وظيفة: ${ad.specialty}`)} className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1.5 rounded-md">دردشة فورية 💬</button>}
                                    <button onClick={() => handleSendMessage(`أريد الاستفسار عن إعلان ${ad.title || ad.name}`)} className="text-[9px] bg-[#c5a059] text-black px-2.5 py-1.5 rounded-md font-bold">اسأل المساعد الذكي</button>
                                  </div>
                                </div>
                              ))
                            ) : <div className="text-center py-10 text-xs text-zinc-500">لا توجد إعلانات مطابقة.</div>}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {activeSidebarTab === "mofa" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-extrabold text-[#c5a059] flex items-center gap-1.5"><Search className="h-4 w-4" />استعلام المعاملات ووزارة الخارجية السعودية</h3>
                  </div>
                  {!mofaResult && !mofaLoading && (
                    <form onSubmit={handleMofaQuerySubmit} className="flex flex-col gap-3">
                      <div>
                        <label className="block text-[10px] text-zinc-400 font-bold mb-1">رقم الطلب بوزارة الخارجية (MOFA)</label>
                        <input type="text" required value={mofaAppNumber} onChange={(e) => setMofaAppNumber(e.target.value.replace(/\D/g, ''))} placeholder="مثال: 49204818" className="w-full text-xs bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-zinc-200 focus:outline-hidden focus:border-[#c5a059]" />
                      </div>
                      <div>
                        <label className="block text-[10px] text-zinc-400 font-bold mb-1">رقم جواز السفر</label>
                        <input type="text" required value={mofaPassportNumber} onChange={(e) => setMofaPassportNumber(e.target.value.toUpperCase().trim())} placeholder="مثال: Y123456" className="w-full text-xs bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-zinc-200 focus:outline-hidden focus:border-[#c5a059] uppercase" />
                      </div>
                      <button type="submit" className="w-full bg-gradient-to-r from-[#c5a059] to-[#8e6e3c] text-black text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 shadow-md">بدء استعلام قنصلي فوري</button>
                    </form>
                  )}
                  {mofaLoading && <div className="py-12 flex flex-col items-center justify-center"><div className="w-10 h-10 border-2 border-[#c5a059] border-t-transparent animate-spin rounded-full"></div></div>}
                  {mofaResult && (
                    <div className="bg-zinc-900 p-4 border border-zinc-800 rounded-xl flex flex-col gap-2">
                      <h4 className="text-xs font-bold text-zinc-100">حالة الطلب: <span className="text-amber-400">{mofaResult.statusText}</span></h4>
                      <p className="text-[10px] text-zinc-400">{mofaResult.subStatus}</p>
                      <button onClick={() => setMofaResult(null)} className="mt-2 text-xs bg-zinc-800 py-1 rounded text-zinc-400">استعلام جديد</button>
                    </div>
                  )}
                </motion.div>
              )}

              {activeSidebarTab === "trade" && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                  <div className="flex gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-900">
                    <button type="button" onClick={() => setIsPublishingMarketAd(false)} className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-lg ${!isPublishingMarketAd ? "bg-zinc-850 text-[#c5a059]" : "text-zinc-500"}`}>تصفح الإعلانات ({marketAds.length})</button>
                    <button type="button" onClick={() => setIsPublishingMarketAd(true)} className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-lg ${isPublishingMarketAd ? "bg-zinc-850 text-[#c5a059]" : "text-zinc-500"}`}>انشر إعلانك مجاناً</button>
                  </div>
                  {!isPublishingMarketAd && (
                    <div className="flex flex-col gap-3">
                      {marketAds.map(ad => (
                        <div key={ad.id} className="p-3 bg-[#111115] border border-zinc-850 rounded-xl flex flex-col gap-2">
                          <h4 className="text-xs font-bold text-zinc-100">{ad.title}</h4>
                          <p className="text-[11px] text-zinc-300 bg-zinc-950/30 p-2 rounded-lg">{ad.details}</p>
                          <div className="flex justify-between items-center text-[10px] text-zinc-400">
                            <span>القيمة: <span className="text-amber-400 font-bold">{ad.price}</span></span>
                            <span>المعلن: {ad.name}</span>
                          </div>
                          <div className="flex gap-2 justify-end mt-1">
                            {ad.phone && <button type="button" onClick={() => handleStartChat(ad.phone, ad.name, ad.id, `منتج: ${ad.title}`)} className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-lg">دردشة فورية</button>}
                            <button type="button" onClick={() => handleOpenInvoiceWizard(ad)} className="text-[9px] bg-zinc-900 text-[#c5a059] border border-zinc-800 px-2 py-1 rounded-lg">فاتورة أولية</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeSidebarTab === "chats" && (
                <div className="p-4 text-center text-zinc-500 text-xs">لوحة التراسل والدردشات النشطة بين المستخدمين.</div>
              )}
            </div>
          </div>
        </section>

        <section className="lg:col-span-2 flex flex-col bg-[#0f0f12] rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden h-[600px] sm:h-[680px]" id="chat_section">
          <div className="bg-[#0f0f12] text-[#fefefe] p-4 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#c5a059]/40 bg-[#0c0c0e] flex items-center justify-center shadow-md">
                <img src={appLogo} alt="لوجو" className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-bold text-sm sm:text-base text-[#fefefe]">{t("مساعد أبو مجد الذكي", "Abu Majd Smart Assistant")}</h2>
                <p className="text-[10px] text-zinc-500">متصل الآن - مدعوم بالذكاء الاصطناعي الآمن</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0c0c0e] flex flex-col gap-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[85%] rounded-2xl p-4 shadow-xl relative ${msg.role === "user" ? "bg-[#c5a059] text-black" : "bg-zinc-900 text-zinc-200"}`}>
                  <div className="text-sm break-words leading-relaxed">{renderMessageText(msg.text, msg.role === "user")}</div>
                </div>
              </div>
            ))}
            {isLoading && <div className="text-xs text-zinc-500 animate-pulse">المساعد الذكي يكتب الآن...</div>}
            {error && <div className="bg-rose-950/40 p-3 rounded-xl border border-rose-900/50 text-rose-300 text-xs">{error}</div>}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 bg-[#0f0f12] border-t border-zinc-800">
            <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
              <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} disabled={isLoading} placeholder="اكتب استفسارك هنا..." className="flex-1 text-sm bg-zinc-900 border border-zinc-800 focus:border-[#c5a059] px-4 py-3.5 rounded-xl text-[#fefefe]" />
              <button type="submit" disabled={!inputText.trim() || isLoading} className="bg-gradient-to-r from-[#c5a059] to-[#8e6e3c] text-black font-bold px-6 rounded-xl flex items-center justify-center gap-2">إرسال</button>
            </form>
          </div>
        </section>
      </main>

      {isInvoiceModalOpen && invoiceTargetAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl max-w-md w-full text-right">
            <h3 className="text-sm font-bold text-[#c5a059] mb-4">معاينة الفاتورة الأولية لـ {invoiceTargetAd.title}</h3>
            <p className="text-xs text-zinc-300 mb-2">اسم المشتري: {invoiceBuyerName || "عميل افتراضي"}</p>
            <p className="text-xs text-zinc-300 mb-4">القيمة المحسوبة: {invoiceBasePrice} ر.س</p>
            <div className="flex gap-2">
              <button onClick={() => window.print()} className="flex-1 bg-[#c5a059] text-black font-bold py-2 rounded-lg text-xs">طباعة / حفظ PDF</button>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="flex-1 bg-zinc-800 text-zinc-400 py-2 rounded-lg text-xs">إغلاق</button>
            </div>
          </div>
        </div>
      )}

      {isRatingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 text-center max-w-sm w-full">
            <h3 className="text-sm font-bold text-zinc-100 mb-2">تقييم المعلن: {ratingTargetName}</h3>
            <div className="flex gap-2 justify-center my-4">
              {[1, 2, 3, 4, 5].map(num => (
                <button key={num} onClick={() => setSelectedRating(num)} className={`text-xl ${selectedRating >= num ? "text-amber-400" : "text-zinc-650"}`}>★</button>
              ))}
            </div>
            <button onClick={handleSubmittingRating} className="w-full bg-amber-400 text-black font-bold py-2 rounded-lg text-xs">تأكيد التقييم</button>
          </div>
        </div>
      )}

      <footer className="bg-[#09090b] text-zinc-500 py-6 px-6 border-t border-zinc-900 text-center text-xs mt-auto">
        <p>© {new Date().getFullYear()} {office.name}. جميع الحقوق محفوظة.</p>
      </footer>
    </div>
  );
}

