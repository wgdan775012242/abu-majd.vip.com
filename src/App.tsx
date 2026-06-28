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

  // Initialize and load saved drawing
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

  // Use useEffect to register non-passive touch listeners
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
    
    // Scale client coords to internal canvas coordinate space
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
    ctx.strokeStyle = "#18181b"; // Dark zinc signature color
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
  
  // Replace Arabic-Indic numerals with standard Western digits
  const arabicDigits = "٠١٢٣٤٥٦٧٨٩";
  let clean = timestampStr;
  for (let i = 0; i < 10; i++) {
    clean = clean.replace(new RegExp(arabicDigits[i], "g"), i.toString());
  }
  
  // Remove any non-alphanumeric characters except digits, slashes, hyphens, colons, or spaces
  clean = clean.replace(/[^\d\/\-\:\s]/g, "").trim();
  
  const parts = clean.split(/[\/\-]/);
  if (parts.length === 3) {
    const p0 = parseInt(parts[0], 10);
    const p1 = parseInt(parts[1], 10);
    const p2 = parseInt(parts[2], 10);
    
    if (p0 > 1000) {
      // YYYY/MM/DD
      return new Date(p0, p1 - 1, p2);
    } else if (p2 > 1000) {
      // DD/MM/YYYY
      return new Date(p2, p1 - 1, p0);
    }
  }
  
  const parsed = Date.parse(clean);
  if (!isNaN(parsed)) {
    return new Date(parsed);
  }
  
  return new Date();
};

const sortJobAdsByDate = (
  ads: JobAd[],
  order: "newest" | "oldest" | "last24h"
): JobAd[] => {
  const indexedAds = ads.map((ad, idx) => ({ ad, idx }));

  const sorted = [...indexedAds].sort((a, b) => {
    const dateA = parseAdDate(a.ad.timestamp).getTime();
    const dateB = parseAdDate(b.ad.timestamp).getTime();

    if (dateA !== dateB) {
      if (order === "oldest") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    }

    // Stable sort falling back to index order
    return a.idx - b.idx;
  });

  let result = sorted.map(item => item.ad);

  if (order === "last24h") {
    const now = new Date();
    const twentyFourHoursAgo = now.getTime() - 24 * 60 * 60 * 1000;
    
    result = result.filter(ad => {
      const adDate = parseAdDate(ad.timestamp);
      const isToday = adDate.toDateString() === now.toDateString();
      return isToday || adDate.getTime() >= twentyFourHoursAgo;
    });
  }

  return result;
};

const sortMarketAdsByDate = (
  ads: MarketAd[],
  order: "newest" | "oldest" | "last24h"
): MarketAd[] => {
  const indexedAds = ads.map((ad, idx) => ({ ad, idx }));

  const sorted = [...indexedAds].sort((a, b) => {
    const dateA = parseAdDate(a.ad.timestamp).getTime();
    const dateB = parseAdDate(b.ad.timestamp).getTime();

    if (dateA !== dateB) {
      if (order === "oldest") {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    }

    // Stable sort falling back to index order
    return a.idx - b.idx;
  });

  let result = sorted.map(item => item.ad);

  if (order === "last24h") {
    const now = new Date();
    const twentyFourHoursAgo = now.getTime() - 24 * 60 * 60 * 1000;
    
    result = result.filter(ad => {
      const adDate = parseAdDate(ad.timestamp);
      const isToday = adDate.toDateString() === now.toDateString();
      return isToday || adDate.getTime() >= twentyFourHoursAgo;
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
      return saved !== "light"; // default is dark mode (true)
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
    // 1. Subtab Check (employer vs seeker)
    const isEmployerTab = jobsSubTab === "employers";
    if (ad.type !== (isEmployerTab ? "employer" : "seeker") && !(isEmployerTab && ad.type === "external")) {
      return false;
    }

    // 2. Specialty Check
    if (selectedSpecialtyFilter !== "all" && ad.specialty !== selectedSpecialtyFilter) {
      return false;
    }

    // 3. Location Check
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

    // 4. Salary Range Check
    if (jobSalaryFilter !== "all") {
      if (!ad.salary) {
        if (jobSalaryFilter === "unspecified") return true;
        return false;
      }
      const numbers = ad.salary.match(/\d+/g)?.map(Number) || [];
      if (numbers.length === 0) {
        const isUnspecifiedText = ["اتفاق", "غير", "محدد", "negotiable", "agreement"].some(kw => ad.salary?.toLowerCase().includes(kw));
        if (jobSalaryFilter === "unspecified" && isUnspecifiedText) return true;
        return false;
      }
      const salVal = numbers[0];
      if (jobSalaryFilter === "under_2000") {
        if (salVal >= 2000) return false;
      } else if (jobSalaryFilter === "2000_4000") {
        if (salVal < 2000 || salVal > 4000) return false;
      } else if (jobSalaryFilter === "4000_6000") {
        if (salVal < 4000 || salVal > 6000) return false;
      } else if (jobSalaryFilter === "above_6000") {
        if (salVal <= 6000) return false;
      } else if (jobSalaryFilter === "unspecified") {
        return false;
      }
    }

    // 5. Free-Text Search Check
    if (jobSearchQuery.trim() !== "") {
      const query = jobSearchQuery.toLowerCase().trim();
      const matchesName = ad.name?.toLowerCase().includes(query);
      const matchesSpecialty = ad.specialty?.toLowerCase().includes(query);
      const matchesDetails = ad.details?.toLowerCase().includes(query);
      const matchesCountry = ad.country?.toLowerCase().includes(query);
      const matchesExperience = ad.experience?.toLowerCase().includes(query);
      const matchesSalary = ad.salary?.toLowerCase().includes(query);

      if (!matchesName && !matchesSpecialty && !matchesDetails && !matchesCountry && !matchesExperience && !matchesSalary) {
        return false;
      }
    }

    return true;
  };

  // Sidebar Tab Switcher State
  const [activeSidebarTab, setActiveSidebarTab] = useState<"info" | "jobs" | "mofa" | "trade" | "favorites" | "chats" | "flights">("info");

  // Translation States
  const [translatedTexts, setTranslatedTexts] = useState<Record<string, string>>({});
  const [translatingIds, setTranslatingIds] = useState<Record<string, boolean>>({});
  const [translationErrors, setTranslationErrors] = useState<Record<string, string>>({});
  const [activeTranslations, setActiveTranslations] = useState<Record<string, boolean>>({});

  const handleTranslate = async (id: string, textToTranslate: string) => {
    if (translatedTexts[id]) {
      setActiveTranslations(prev => ({
        ...prev,
        [id]: !prev[id]
      }));
      return;
    }

    setTranslatingIds(prev => ({ ...prev, [id]: true }));
    setTranslationErrors(prev => ({ ...prev, [id]: "" }));

    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: textToTranslate }),
      });

      if (!response.ok) {
        throw new Error("فشلت عملية الترجمة");
      }

      const data = await response.json();
      if (data.translatedText) {
        setTranslatedTexts(prev => ({ ...prev, [id]: data.translatedText }));
        setActiveTranslations(prev => ({ ...prev, [id]: true }));
      } else {
        throw new Error("لم يتم إرجاع أي نص مترجم");
      }
    } catch (err: any) {
      console.error(err);
      setTranslationErrors(prev => ({ ...prev, [id]: "عذراً، تعذرت الترجمة بالذكاء الاصطناعي حالياً." }));
    } finally {
      setTranslatingIds(prev => ({ ...prev, [id]: false }));
    }
  };

  // Favorites States & LocalStorage Sync
  const [favoritedJobIds, setFavoritedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("fav_job_ids");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [favoritedMarketIds, setFavoritedMarketIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("fav_market_ids");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("fav_job_ids", JSON.stringify(favoritedJobIds));
    } catch (e) {
      console.error(e);
    }
  }, [favoritedJobIds]);

  useEffect(() => {
    try {
      localStorage.setItem("fav_market_ids", JSON.stringify(favoritedMarketIds));
    } catch (e) {
      console.error(e);
    }
  }, [favoritedMarketIds]);

  const toggleJobFavorite = (id: string) => {
    setFavoritedJobIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const toggleMarketFavorite = (id: string) => {
    setFavoritedMarketIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Jobs Search Filter State
  const [jobsSearch, setJobsSearch] = useState("");

  // Job Board States
  const [jobAds, setJobAds] = useState<JobAd[]>([]);
  const [jobsSubTab, setJobsSubTab] = useState<"employers" | "seekers">("employers");
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState<string>("all");
  const [jobLocationFilter, setJobLocationFilter] = useState<string>("all");
  const [jobSalaryFilter, setJobSalaryFilter] = useState<string>("all");
  const [jobSearchQuery, setJobSearchQuery] = useState<string>("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);
  const [jobDateSort, setJobDateSort] = useState<"newest" | "oldest" | "last24h">("newest");

  // Reading Mode State
  const [selectedReadingAd, setSelectedReadingAd] = useState<{
    title: string;
    specialty: string;
    content: string;
    isTranslation: boolean;
  } | null>(null);
  const [readingFontSize, setReadingFontSize] = useState<"lg" | "xl" | "2xl" | "3xl">("xl");

  // Section Loading Progress State
  const [sectionLoadingProgress, setSectionLoadingProgress] = useState<number>(0);
  const [isSectionLoading, setIsSectionLoading] = useState<boolean>(false);

  // Data Saving Mode States
  const [isDataSavingMode, setIsDataSavingMode] = useState<boolean>(() => {
    return localStorage.getItem("data_saving_mode") === "true";
  });
  const [loadedImageIds, setLoadedImageIds] = useState<Record<string, boolean>>({});
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  
  // Pro-forma Invoice States
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
    // Extract base price as digits for initial numerical editing
    const numeric = extractNumericPrice(ad.price);
    setInvoiceBasePrice(numeric.toString() || "0");
    setInvoiceDiscount("0");
    setInvoiceExtraFee("0");
    setInvoiceNotes("هذه الفاتورة أولية وغير ملزمة، تم توليدها لتسهيل عملية توثيق الاتفاق المبدئي بين الأطراف وسداد الرسوم أو حجز المنتج.");
    setIsInvoiceModalOpen(true);
  };

  // Advertiser Ratings State
  const [userRatings, setUserRatings] = useState<Record<string, number[]>>(() => {
    try {
      const saved = localStorage.getItem("advertiser_user_ratings");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("advertiser_user_ratings", JSON.stringify(userRatings));
  }, [userRatings]);

  const getAdvertiserRating = (phone: string) => {
    const defaultSeeds: Record<string, { sum: number; count: number }> = {
      "+966501234567": { sum: 72, count: 15 }, // 4.8
      "+966555987654": { sum: 47, count: 10 }, // 4.7
      "+967733445566": { sum: 26, count: 6 },  // 4.3
      "+967771234567": { sum: 39, count: 8 },  // 4.9
      "+967771112223": { sum: 36, count: 8 },  // 4.5
      "+967775012242": { sum: 108, count: 22 }, // 4.9
      "+967738465200": { sum: 89, count: 19 }, // 4.7
    };

    const seed = defaultSeeds[phone] || { sum: 0, count: 0 };
    const custom = userRatings[phone] || [];
    
    const totalSum = seed.sum + custom.reduce((a, b) => a + b, 0);
    const totalCount = seed.count + custom.length;

    if (totalCount === 0) {
      return { average: 0, count: 0 };
    }

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
    const updated = {
      ...userRatings,
      [ratingTargetPhone]: [...current, selectedRating]
    };
    setUserRatings(updated);
    setRatingSuccess(true);
    setTimeout(() => {
      setIsRatingModalOpen(false);
      setRatingSuccess(false);
    }, 1500);
  };

  // User to User Chat States
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
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
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
    } catch (err) {
      console.error("Error toggling block:", err);
    }
  };

  useEffect(() => {
    fetchChats();
    const interval = setInterval(fetchChats, 3000);
    return () => clearInterval(interval);
  }, [myPhone]);

  useEffect(() => {
    if (activeChatPartner) {
      fetchChats();
    }
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
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setIsSendingU2UMessage(false);
    }
  };

  const handleStartChat = (receiverPhone: string, receiverName: string, adId?: string, adTitle?: string) => {
    // If the receiver's phone is the same as the user's phone, use a default alternate phone for current user to avoid self-chat
    let currentMyPhone = myPhone;
    if (myPhone === receiverPhone) {
      currentMyPhone = receiverPhone === "+967770001111" ? "+967771112222" : "+967770001111";
      setMyPhone(currentMyPhone);
    }
    
    setActiveChatPartner({
      phone: receiverPhone,
      name: receiverName,
      adId,
      adTitle
    });
    setActiveSidebarTab("chats");
  };

  useEffect(() => {
    localStorage.setItem("data_saving_mode", isDataSavingMode ? "true" : "false");
  }, [isDataSavingMode]);
  
  // Job publishing states
  const [isPublishingAd, setIsPublishingAd] = useState(false);
  const [newAdForm, setNewAdForm] = useState({
    name: "",
    phone: "",
    specialty: "سائق خاص / سائق شاحنة",
    country: "",
    details: "",
    salary: "",
    experience: "",
    image: ""
  });
  const [adPublishSuccess, setAdPublishSuccess] = useState(false);
  const [adPublishError, setAdPublishError] = useState<string | null>(null);

  // Buy and Sell Market States
  const [marketAds, setMarketAds] = useState<MarketAd[]>([]);
  const [marketSearch, setMarketSearch] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");
  const [marketTypeFilter, setMarketTypeFilter] = useState<"all" | "sell" | "buy">("all");
  const [marketDateSort, setMarketDateSort] = useState<"newest" | "oldest" | "last24h">("newest");
  const [isPublishingMarketAd, setIsPublishingMarketAd] = useState(false);
  const [newMarketAdForm, setNewMarketAdForm] = useState({
    type: "sell" as "sell" | "buy",
    category: "تأشيرات وإقامات",
    title: "",
    details: "",
    price: "",
    location: "",
    name: "",
    phone: "",
    image: ""
  });
  const [marketPublishSuccess, setMarketPublishSuccess] = useState(false);
  const [marketPublishError, setMarketPublishError] = useState<string | null>(null);

  // Convert uploaded image file to Base64 helper
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
      if (formType === "job") {
        setNewAdForm(prev => ({ ...prev, image: base64 }));
      } else {
        setNewMarketAdForm(prev => ({ ...prev, image: base64 }));
      }
    };
    reader.readAsDataURL(file);
  };

  // User's own published market ads for tracking and 30-day notifications
  const [myPublishedAds, setMyPublishedAds] = useState<{ id: string; title: string; publishedAt: string }[]>(() => {
    try {
      const stored = localStorage.getItem("user_published_market_ads");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
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
      } else {
        alert("فشل حذف الإعلان من الخادم");
      }
    } catch (err) {
      console.error("Error deleting market ad:", err);
    }
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
      } else {
        alert("فشل تمديد الإعلان");
      }
    } catch (err) {
      console.error("Error extending market ad:", err);
    }
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
    if (str.includes("$") || str.includes("dollar") || str.includes("دولار")) {
      return "دولار أمريكي ($)";
    }
    if (str.includes("سعودي") || str.includes("ر.س") || str.includes("sar") || str.includes("ر. س")) {
      return "ريال سعودي";
    }
    return "ريال يمني";
  };

  // MOFA Query State
  const [mofaAppNumber, setMofaAppNumber] = useState("");
  const [mofaPassportNumber, setMofaPassportNumber] = useState("");
  const [mofaVisaType, setMofaVisaType] = useState("عمل");
  const [mofaLoading, setMofaLoading] = useState(false);
  const [mofaResult, setMofaResult] = useState<any | null>(null);

  // Visa Cost Estimator States & Lookup Data
  const [estVisaType, setEstVisaType] = useState("عمل");
  const [estCountry, setEstCountry] = useState("السعودية");
  const [estApplicants, setEstApplicants] = useState(1);
  const [estMedical, setEstMedical] = useState(false);
  const [estAuth, setEstAuth] = useState(false);
  const [estTranslation, setEstTranslation] = useState(false);
  const [estInsurance, setEstInsurance] = useState(false);
  const [estCurrency, setEstCurrency] = useState("SAR"); // SAR, USD, YER

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

  // Multi-language Translation State
  const [language] = useState<"ar" | "en">("ar");

  // Save language preference to localStorage and document layout
  useEffect(() => {
    try {
      localStorage.setItem("app_language", "ar");
    } catch (e) {
      console.error(e);
    }
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
  }, []);

  // Dynamic Translation Helper
  const t = (arText: string, enText: string) => {
    return language === "ar" ? arText : enText;
  };
  
  // Programmatic MOFA Visa Tracking & Notifications
  const [mofaTrackedRequests, setMofaTrackedRequests] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem("mofa_tracked_requests");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // State to handle triggered visual notifications/banners
  const [activeMofaNotification, setActiveMofaNotification] = useState<{
    id: string;
    appNumber: string;
    oldStatus: string;
    newStatus: string;
    visaType: string;
  } | null>(null);

  // Auto-save tracked requests to localStorage
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

          // Trigger in-app glowing notification
          setActiveMofaNotification({
            id: Math.random().toString(),
            appNumber: req.appNumber,
            oldStatus: oldStatus,
            newStatus: newStatus,
            visaType: req.visaType
          });

          // Also update the currently viewed mofaResult if it is the same appNumber
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

  // Fetch fresh job ads and market ads with loading progress animation
  const triggerFetchWithProgress = () => {
    setIsSectionLoading(true);
    setSectionLoadingProgress(15);
    
    const interval = setInterval(() => {
      setSectionLoadingProgress(prev => {
        if (prev >= 85) {
          clearInterval(interval);
          return prev;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    const fetchJobs = fetch("/api/jobs")
      .then(res => {
        if (!res.ok) throw new Error("فشل في الاتصال بالخادم");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setJobAds(data);
        } else {
          console.warn("البيانات المستلمة فارغة، سيتم الإبقاء على البيانات الوهمية.");
          throw new Error("Empty data");
        }
      })
      .catch(err => {
        console.error("خطأ في جلب الوظائف:", err.message);
        // Fallback mock scraped data
        setJobAds([
          {
            id: "ext-1",
            type: "external",
            name: "موقع مرجان للوظائف",
            title: "مطلوب مهندس مدني خبرة 5 سنوات",
            phone: "",
            specialty: "هندسة مدنية",
            country: "السعودية (الرياض)",
            details: "شركة مقاولات كبرى في الرياض تطلب مهندس مدني خبرة لا تقل عن 5 سنوات في الإشراف على المشاريع التجارية. رواتب مجزية وتأمين طبي.",
            timestamp: new Date().toLocaleDateString("ar-EG", { year: 'numeric', month: 'short', day: 'numeric' }),
            url: "https://mourjan.com/jobs/12345"
          },
          {
            id: "ext-2",
            type: "external",
            name: "وظائف العرب",
            title: "مطلوب محاسب مالي مقيم",
            phone: "",
            specialty: "محاسبة ومالية",
            country: "الإمارات (دبي)",
            details: "مطلوب بشكل عاجل محاسب مالي يجيد العمل على برامج ERP وإعداد التقارير الضريبية. يفضل من لديه إقامة قابلة للتحويل في دبي.",
            timestamp: new Date(Date.now() - 86400000).toLocaleDateString("ar-EG", { year: 'numeric', month: 'short', day: 'numeric' }),
            url: "https://arabjobs.com/job/67890"
          },
          {
            id: "ext-3",
            type: "external",
            name: "موقع مرجان للوظائف",
            title: "مطلوب شيف شرقي لمطعم راقي",
            phone: "",
            specialty: "مطاعم وفندقة",
            country: "السعودية (جدة)",
            details: "مطعم شرقي في جدة يبحث عن شيف متخصص في المشاوي والمقبلات الشامية. توفير سكن ومواصلات وراتب يحدد بعد المقابلة.",
            timestamp: new Date(Date.now() - 172800000).toLocaleDateString("ar-EG", { year: 'numeric', month: 'short', day: 'numeric' }),
            url: "https://mourjan.com/jobs/112233"
          }
        ]);
      });

    const fetchMarket = fetch("/api/market")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then(data => setMarketAds(data))
      .catch(err => console.error("فشل تحميل إعلانات البيع والشراء:", err));

    Promise.all([fetchJobs, fetchMarket]).then(() => {
      clearInterval(interval);
      setSectionLoadingProgress(100);
      setTimeout(() => {
        setIsSectionLoading(false);
        setSectionLoadingProgress(0);
      }, 400);
    });
  };

  // Fetch when activeSidebarTab or jobsSubTab changes to show progress bar
  useEffect(() => {
    triggerFetchWithProgress();
  }, [activeSidebarTab, jobsSubTab]);

  // Notification badge states for unseen items
  const [seenJobIds, setSeenJobIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("seen_job_ids");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [seenMarketIds, setSeenMarketIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("seen_market_ids");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Mark jobs as seen when user is on the jobs tab
  useEffect(() => {
    if (activeSidebarTab === "jobs" && jobAds.length > 0) {
      setSeenJobIds(prev => {
        const currentIds = jobAds.map(ad => ad.id);
        const hasNewToMark = currentIds.some(id => !prev.includes(id));
        if (hasNewToMark) {
          const updated = Array.from(new Set([...prev, ...currentIds]));
          localStorage.setItem("seen_job_ids", JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
    }
  }, [activeSidebarTab, jobAds.length]);

  // Mark market ads as seen when user is on the trade tab
  useEffect(() => {
    if (activeSidebarTab === "trade" && marketAds.length > 0) {
      setSeenMarketIds(prev => {
        const currentIds = marketAds.map(ad => ad.id);
        const hasNewToMark = currentIds.some(id => !prev.includes(id));
        if (hasNewToMark) {
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          type: jobsSubTab === "seekers" ? "seeker" : "employer",
          name: newAdForm.name,
          phone: newAdForm.phone,
          specialty: newAdForm.specialty,
          country: newAdForm.country,
          details: newAdForm.details,
          salary: newAdForm.salary,
          experience: newAdForm.experience,
          image: newAdForm.image || undefined
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "فشل نشر الإعلان");
      }

      setJobAds(prev => [data, ...prev]);
      setAdPublishSuccess(true);
      
      // Reset form fields
      setNewAdForm({
        name: "",
        phone: "",
        specialty: "سائق خاص / سائق شاحنة",
        country: "",
        details: "",
        salary: "",
        experience: "",
        image: ""
      });

      setTimeout(() => {
        setAdPublishSuccess(false);
        setIsPublishingAd(false);
      }, 3000);
    } catch (err: any) {
      setAdPublishError(err.message || "عذراً، حدث خطأ أثناء نشر الإعلان.");
    }
  };

  const handlePublishMarketAdSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (
      !newMarketAdForm.title.trim() || 
      !newMarketAdForm.details.trim() || 
      !newMarketAdForm.price.trim() || 
      !newMarketAdForm.location.trim() || 
      !newMarketAdForm.name.trim() || 
      !newMarketAdForm.phone.trim()
    ) {
      setMarketPublishError("الرجاء تعبئة جميع الحقول المطلوبة.");
      return;
    }

    setMarketPublishError(null);
    try {
      const response = await fetch("/api/market", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newMarketAdForm)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "فشل نشر الإعلان");
      }

      setMarketAds(prev => [data, ...prev]);
      
      // Save newly created ad to the user's published list
      const publishInfo = {
        id: data.id,
        title: data.title,
        publishedAt: new Date().toISOString()
      };
      setMyPublishedAds(prev => {
        const updated = [publishInfo, ...prev];
        localStorage.setItem("user_published_market_ads", JSON.stringify(updated));
        return updated;
      });

      setMarketPublishSuccess(true);
      
      // Reset form fields
      setNewMarketAdForm({
        type: "sell",
        category: "تأشيرات وإقامات",
        title: "",
        details: "",
        price: "",
        location: "",
        name: "",
        phone: "",
        image: ""
      });

      setTimeout(() => {
        setMarketPublishSuccess(false);
        setIsPublishingMarketAd(false);
      }, 3000);
    } catch (err: any) {
      setMarketPublishError(err.message || "عذراً، حدث خطأ أثناء نشر الإعلان.");
    }
  };

  // Fetch fresh office info from server if available
  useEffect(() => {
    fetch("/api/office-info")
      .then(res => {
        if (res.ok) return res.json();
        throw new Error();
      })
      .then(data => setOffice(data))
      .catch(() => {
        // Fallback to local default if server is starting or has issues
        setOffice(DEFAULT_OFFICE_INFO);
      });
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);
 
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    // Switch tab to info and scroll to chatbot immediately
    setActiveSidebarTab("info");
    setTimeout(() => {
      const element = document.getElementById("chat_section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
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
      // Filter out system welcome internally or map conversation history
      const history = messages
        .filter(msg => msg.id !== "welcome")
        .map(msg => ({
          role: msg.role,
          text: msg.text
        }));

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (apiKey) {
        // Direct call to Gemini API if the environment variable is present (for Render static hosting)
        const systemInstructionText = `معلومات أبو مجد الحداد للسفريات:
- الهاتف: +967775012242
- البريد الإلكتروني: what775012242@outlook.sa
- فيسبوك: ابومجد الحداد خدمات سفريات وسياحه
- إنستغرام: وجدان الحداد-ابومجدالحداد
- الخدمات: تأشيرات، حجوزات طيران، خدمات سياحية، وسفر.

بصفتك مساعداً ذكياً لأبو مجد الحداد للسفريات والخدمات السياحية، أجب على رسالة المستخدم بصورة مهنية وودية للغاية وباللغة العربية.
أنت تدعم أيضاً توجيه المستخدمين لروابط التوظيف السعودية الهامة وتذاكر الطيران، كن مختصراً ومفيداً في إجاباتك.`;

        const formattedHistory = history.map((msg: any) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        }));

        const payload = {
          system_instruction: {
            parts: { text: systemInstructionText }
          },
          contents: [
            ...formattedHistory,
            {
              role: "user",
              parts: [{ text: text }]
            }
          ]
        };

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error?.message || "فشل الاتصال بـ Gemini API");
        }

        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "عذراً، لم أتمكن من توليد رد.";
        
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: replyText,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);

      } else {
        // Fallback to the backend API if no VITE_GEMINI_API_KEY is found
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: text,
            history: history
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "فشل الاتصال بالخادم الذكي");
        }

        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "model",
          text: data.reply,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "عذراً، لم نتمكن من الاتصال بالخادم الذكي حالياً. يرجى التحقق من إعداد مفتاح GEMINI_API_KEY.");
    } finally {
      setIsLoading(false);
    }
  };

      // Simple bold replacement (**text**)
      const parts = cleanLine.split(/\*\*([\s\S]*?)\*\*/g);
      const renderedLine = parts.map((part, partIdx) => {
        if (partIdx % 2 === 1) {
          return (
            <strong 
              key={partIdx} 
              className={`font-bold ${isUser ? "text-zinc-950 font-extrabold" : "text-[#c5a059] font-semibold"}`}
            >
              {part}
            </strong>
          );
        }
        return part;
      });

      if (isBullet) {
        return (
          <li key={lineIdx} className={`mr-5 list-disc list-outside mb-1 ${isUser ? "text-zinc-950" : "text-zinc-300"}`}>
            {renderedLine}
          </li>
        );
      }

      return (
        <p key={lineIdx} className={`mb-2 leading-relaxed last:mb-0 ${isUser ? "text-zinc-950" : "text-zinc-300"}`}>
          {renderedLine}
        </p>
      );
    });
  };

  const filteredPortals = FLIGHT_BOOKING_PORTALS.filter(p => 
    p.name.toLowerCase().includes(jobsSearch.toLowerCase()) || 
    p.type.toLowerCase().includes(jobsSearch.toLowerCase()) ||
    p.description.toLowerCase().includes(jobsSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-[#f4f4f5] flex flex-col font-sans" id="app_root">
      {/* Visual Section Loading Progress Bar */}
      <AnimatePresence>
        {isSectionLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 h-1 bg-zinc-950/20"
          >
            <div 
              className="h-full bg-gradient-to-r from-[#c5a059] via-amber-500 to-[#c5a059] shadow-[0_0_8px_#c5a059] transition-all duration-300 ease-out"
              style={{ width: `${sectionLoadingProgress}%` }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Tracked MOFA Status Change Notification Toast */}
      <AnimatePresence>
        {activeMofaNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 max-w-md bg-[#0f0f12] border-2 border-amber-500/80 rounded-2xl p-4 shadow-[0_12px_40px_-12px_rgba(197,160,89,0.3)] text-right"
            dir="rtl"
          >
            <div className="flex gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-amber-500/10 border border-[#c5a059]/30 flex items-center justify-center text-[#c5a059] animate-bounce">
                <Bell className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] bg-amber-500/15 text-[#c5a059] px-2 py-0.5 rounded-full font-bold">تحديث حالة التأشيرة تلقائياً 🔔</span>
                  <button 
                    onClick={() => setActiveMofaNotification(null)}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors p-0.5 rounded-lg hover:bg-zinc-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <h5 className="text-xs font-extrabold text-zinc-100 mt-2">تغيرت حالة الطلب رقم ({activeMofaNotification.appNumber})</h5>
                <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                  معاملة <span className="text-zinc-200 font-bold">{activeMofaNotification.visaType}</span> انتقلت حالتها الآن إلى:
                </p>
                <div className="bg-zinc-950/80 p-2.5 rounded-xl border border-zinc-850 mt-2 text-xs font-bold text-emerald-400 flex items-center gap-1.5 justify-start">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>{activeMofaNotification.newStatus}</span>
                </div>
                <div className="flex justify-end gap-2 mt-3">
                  <button
                    onClick={() => {
                      setActiveSidebarTab("mofa");
                      setMofaAppNumber(activeMofaNotification.appNumber);
                      setMofaVisaType(activeMofaNotification.visaType);
                      setMofaResult({
                        appNumber: activeMofaNotification.appNumber,
                        visaType: activeMofaNotification.visaType,
                        statusText: activeMofaNotification.newStatus,
                        subStatus: "تم الاستعلام التلقائي عبر التتبع الذكي.",
                        steps: [
                          { name: "تقديم الطلب وتسجيله إلكترونياً", status: "completed", date: "تمت بنجاح" },
                          { name: "سداد الرسوم وتفعيل التأمين الطبي المعتمد", status: "completed", date: "تم الدفع والربط" },
                          { name: "التدقيق والمطابقة لدى الممثلية / السفارة", status: "completed", date: "منجز" },
                          { name: activeMofaNotification.newStatus, status: "active", date: "تحديث فوري" }
                        ]
                      });
                      setActiveMofaNotification(null);
                    }}
                    className="text-[10px] font-bold bg-[#c5a059] hover:bg-amber-500 text-black px-3 py-1.5 rounded-lg transition-all"
                  >
                    عرض التفاصيل بالكامل
                  </button>
                  <button
                    onClick={() => setActiveMofaNotification(null)}
                    className="text-[10px] font-bold text-zinc-400 hover:text-zinc-200 px-2 py-1.5"
                  >
                    تجاهل
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upper Brand Header Bar */}
      <header className="bg-[#0f0f12] border-b border-zinc-800 py-5 px-6 sm:px-10 sticky top-0 z-40" id="app_header">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#c5a059]/40 bg-[#0c0c0e] flex items-center justify-center shadow-lg relative group shrink-0">
              <img 
                src={appLogo} 
                alt={t("شعار أبو مجد", "Abu Majd Logo")} 
                className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#fefefe] flex items-center gap-2">
                {language === "ar" ? office.name : "Abu Majd Al-Haddad Travel"}
              </h1>
              <p className="text-xs text-[#c5a059] font-medium uppercase tracking-widest mt-0.5">
                {t("التميز في خدمات السفر والسياحة والتوظيف والخدمات العامة", "Excellence in Travel, Tourism, Recruitment, and General Services")}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center sm:items-end">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">{t("الحالة", "Status")}</span>
              <span className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {t("متصل الآن لخدمتكم", "Online to serve you")}
              </span>
            </div>

            {/* Theme Toggle Switch */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              type="button"
              className="p-2 rounded-full border border-zinc-700/80 bg-zinc-900/30 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-inner"
              title={isDarkMode ? t("التبديل إلى الوضع النهاري (النهار)", "Switch to Light Mode") : t("التبديل إلى الوضع الليلي (الليل)", "Switch to Dark Mode")}
              id="theme_toggle_btn"
            >
              {isDarkMode ? (
                <Sun className="h-4 w-4 text-[#c5a059]" />
              ) : (
                <Moon className="h-4 w-4 text-amber-500" />
              )}
            </button>

            {/* App Settings Toggle */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              type="button"
              className="p-2 rounded-full border border-zinc-700/80 bg-zinc-900/30 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-inner gap-1"
              title={t("إعدادات التطبيق وتوفير البيانات", "App Settings & Data Saving")}
              id="app_settings_btn"
            >
              <Settings className="h-4 w-4 text-[#c5a059] hover:rotate-45 transition-transform duration-300" />
            </button>

            <a 
              href={`https://wa.me/${office.phone.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full border border-zinc-700 hover:bg-zinc-800 text-sm font-medium transition-all text-zinc-100 hover:text-white"
            >
              {t("اتصل بنا", "Contact Us")}
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6" id="main_content">
        
        {/* Left column (Office metadata, Services, Jobs, and MOFA tracking) */}
        <section className="lg:col-span-1 flex flex-col gap-6" id="office_sidebar">
          
          {/* Main Interactive Tab Controller */}
          <div className="bg-[#0f0f12] rounded-2xl shadow-xl border border-zinc-800 overflow-hidden flex flex-col">
            {/* Elegant Tab Headers */}
            <div className="flex border-b border-zinc-800 bg-[#0c0c0e]/45 p-1 gap-0.5 overflow-x-auto scrollbar-none">
              <button 
                onClick={() => setActiveSidebarTab("info")}
                className={`flex-1 py-2 px-1 text-[9px] sm:text-xs font-bold text-center rounded-xl transition-all flex items-center justify-center gap-0.5 shrink-0 cursor-pointer ${
                  activeSidebarTab === "info" 
                    ? "bg-zinc-800 text-[#c5a059] shadow-inner" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                <Compass className="h-3.5 w-3.5" />
                {t("أبو مجد", "Abu Majd")}
              </button>
              
              <button 
                onClick={() => setActiveSidebarTab("flights")}
                className={`flex-1 py-2 px-1 text-[9px] sm:text-xs font-bold text-center rounded-xl transition-all flex items-center justify-center gap-0.5 shrink-0 cursor-pointer ${
                  activeSidebarTab === "flights" 
                    ? "bg-zinc-800 text-[#c5a059] shadow-inner" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                <Plane className="h-3.5 w-3.5" />
                {t("طيران", "Flights")}
              </button>

              <button 
                onClick={() => setActiveSidebarTab("jobs")}
                className={`flex-1 py-2 px-1 text-[9px] sm:text-xs font-bold text-center rounded-xl transition-all flex items-center justify-center gap-0.5 shrink-0 cursor-pointer relative ${
                  activeSidebarTab === "jobs" 
                    ? "bg-zinc-800 text-[#c5a059] shadow-inner" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                <div className="relative flex items-center justify-center gap-0.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>{t("التوظيف", "Jobs")}</span>
                  {hasUnseenJobs && (
                    <span className="absolute -top-1 -right-2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 animate-pulse"></span>
                    </span>
                  )}
                </div>
              </button>

              <button 
                onClick={() => setActiveSidebarTab("trade")}
                className={`flex-1 py-2 px-1 text-[9px] sm:text-xs font-bold text-center rounded-xl transition-all flex items-center justify-center gap-0.5 shrink-0 cursor-pointer relative ${
                  activeSidebarTab === "trade" 
                    ? "bg-zinc-800 text-[#c5a059] shadow-inner" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                <div className="relative flex items-center justify-center gap-0.5">
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>{t("بيع وشراء", "Market")}</span>
                  {hasUnseenMarket && (
                    <span className="absolute -top-1 -right-2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 animate-pulse"></span>
                    </span>
                  )}
                </div>
              </button>
              
              <button 
                onClick={() => setActiveSidebarTab("mofa")}
                className={`flex-1 py-2 px-1 text-[9px] sm:text-xs font-bold text-center rounded-xl transition-all flex items-center justify-center gap-0.5 shrink-0 cursor-pointer ${
                  activeSidebarTab === "mofa" 
                    ? "bg-zinc-800 text-[#c5a059] shadow-inner" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                <Search className="h-3.5 w-3.5" />
                {t("الخارجية", "MOFA")}
              </button>

              <button 
                onClick={() => setActiveSidebarTab("favorites")}
                className={`flex-1 py-2 px-1 text-[9px] sm:text-xs font-bold text-center rounded-xl transition-all flex items-center justify-center gap-0.5 shrink-0 cursor-pointer relative ${
                  activeSidebarTab === "favorites" 
                    ? "bg-zinc-800 text-[#c5a059] shadow-inner" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                <div className="relative flex items-center justify-center gap-0.5">
                  <Heart className={`h-3.5 w-3.5 ${favoritedJobIds.length + favoritedMarketIds.length > 0 ? "fill-rose-500 text-rose-500 animate-pulse" : ""}`} />
                  <span>{t("المفضلة", "Favorites")}</span>
                  {favoritedJobIds.length + favoritedMarketIds.length > 0 && (
                    <span className="text-[8px] bg-[#c5a059] text-black font-extrabold px-1 rounded-full min-w-[14px] text-center font-mono">
                      {favoritedJobIds.length + favoritedMarketIds.length}
                    </span>
                  )}
                </div>
              </button>

              <button 
                onClick={() => setActiveSidebarTab("chats")}
                className={`flex-1 py-2 px-1 text-[9px] sm:text-xs font-bold text-center rounded-xl transition-all flex items-center justify-center gap-0.5 shrink-0 cursor-pointer relative ${
                  activeSidebarTab === "chats" 
                    ? "bg-zinc-800 text-[#c5a059] shadow-inner" 
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                <div className="relative flex items-center justify-center gap-0.5">
                  <MessageSquare className="h-3.5 w-3.5" />
                  <span>{t("الدردشات", "Chats")}</span>
                </div>
              </button>
            </div>

            {/* TAB CONTENT PANEL */}
            <div className="p-5 flex-1 min-h-[360px]">
              
              {/* TAB 1: OFFICE INFO & CONTACTS */}
              {activeSidebarTab === "info" && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-5"
                >
                  {/* Brand Card Showcase */}
                  <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 rounded-2xl border border-zinc-800 shadow-xl flex flex-col gap-4 text-center relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-600 via-[#c5a059] to-amber-600"></div>
                    
                    {/* Visual Emblem Circle */}
                    <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-[#c5a059] shadow-2xl bg-black relative">
                      <img 
                        src={appLogo} 
                        alt={t("الهوية الرسمية لأبو مجد", "Abu Majd Official Identity")} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <h4 className="text-sm font-extrabold text-zinc-100 uppercase tracking-wide">أبو مجد للسفريات والسياحة</h4>
                      <p className="text-[10px] text-[#c5a059] font-bold">خدمات السفر والسياحة وتخليص المعاملات والأيادي العاملة</p>
                    </div>

                    {/* Visual Card Numbers matching the exact physical card */}
                    <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-900 flex flex-col gap-2 font-mono text-xs text-zinc-300">
                      <div className="flex items-center justify-between text-[11px] border-b border-zinc-900 pb-1.5">
                        <span className="text-zinc-500 font-sans">الرقم الرئيسي:</span>
                        <a href="tel:775012242" className="text-emerald-400 font-extrabold hover:underline">775012242</a>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-500 font-sans">الرقم الإضافي:</span>
                        <a href="tel:738465200" className="text-emerald-400 font-extrabold hover:underline">738465200</a>
                      </div>
                    </div>

                    <p className="text-[10px] text-zinc-500 leading-relaxed">
                      الوكيل المعتمد والأمثل لتسهيل كافة إجراءات سفركم ومعاملاتكم بأعلى درجات الدقة والسرعة.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-[#c5a059] mb-2">عن أبو مجد الحداد</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      رائد ومتخصص في تقديم أرقى خدمات السفر والسياحة وتسهيل معاملات الفيزا والتأشيرات لمختلف دول العالم بأعلى درجات الكفاءة والموثوقية.
                    </p>
                  </div>

                  <hr className="border-zinc-800/60" />

                  <div className="flex flex-col gap-3">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">بيانات التواصل السريع</span>
                    
                    {/* Whatsapp / Phone Dial */}
                    <div className="flex items-center justify-between p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/80">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-[#c5a059]/10 text-[#c5a059] p-2 rounded-lg border border-[#c5a059]/10">
                          <Phone className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="text-[10px] text-zinc-500">الهاتف والواتساب</p>
                          <p className="text-xs font-bold text-zinc-200 direction-ltr mt-0.5">{office.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => copyContact(office.phone, "الهاتف")}
                          className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-md transition-colors"
                          title="نسخ الرقم"
                        >
                          {copiedText === "الهاتف" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                        <a 
                          href={`https://wa.me/${office.phone.replace("+", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] font-extrabold text-black bg-[#c5a059] hover:bg-[#8e6e3c] px-2.5 py-1.5 rounded-lg shadow-xs transition-colors"
                        >
                          مراسلة
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center justify-between p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/80">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-[#c5a059]/10 text-[#c5a059] p-2 rounded-lg border border-[#c5a059]/10">
                          <Mail className="h-3.5 w-3.5" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-[10px] text-zinc-500">البريد الإلكتروني</p>
                          <p className="text-xs font-bold text-zinc-200 truncate block max-w-[120px] mt-0.5">{office.email}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => copyContact(office.email, "البريد")}
                        className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-md transition-colors"
                        title="نسخ البريد"
                      >
                        {copiedText === "البريد" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Social Channels */}
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

              {/* TAB: FLIGHT BOOKING PORTALS */}
              {activeSidebarTab === "flights" && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-extrabold text-[#c5a059] flex items-center gap-1.5">
                      <Plane className="h-4 w-4" />
                      منصات ومواقع الطيران الرسمية
                    </h3>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      روابط حجز طيران مباشرة ومتابعة الرحلات الجوية عبر خطوط الطيران الوطنية والإقليمية المعتمدة:
                    </p>
                  </div>

                  {/* Search bar inside Flight portals */}
                  <div className="sticky top-0 z-10 bg-[#0c0c0e] pt-1 pb-3 -mx-1 px-1">
                    <div className="relative">
                      <Search className="absolute right-3 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                      <input 
                        type="text" 
                        value={jobsSearch}
                        onChange={(e) => setJobsSearch(e.target.value)}
                        placeholder="ابحث عن شركة طيران..." 
                        className="w-full text-xs bg-zinc-900 border border-zinc-800 pr-9 pl-3 py-2 rounded-xl text-zinc-200 focus:outline-hidden focus:border-[#c5a059] transition-all shadow-md"
                      />
                    </div>
                  </div>

                  {/* Portals list */}
                  <div className="flex flex-col gap-3 pr-1">
                    {filteredPortals.length > 0 ? (
                      filteredPortals.map((portal, idx) => (
                        <div 
                          key={idx} 
                          className="p-3 bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800 rounded-xl transition-all flex flex-col gap-2 group"
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <h4 className="text-xs font-extrabold text-[#c5a059] group-hover:text-amber-300 transition-colors">
                                {portal.name}
                              </h4>
                              <span className={`inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded-md ${portal.badgeColor}`}>
                                {portal.type}
                              </span>
                            </div>
                            
                            <a 
                              href={portal.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-[10px] text-zinc-400 hover:text-[#c5a059] flex items-center gap-0.5 font-bold transition-colors"
                              title="زيارة الموقع الرسمي"
                            >
                              زيارة
                              <ExternalLink className="h-2.5 w-2.5" />
                            </a>
                          </div>

                          <p className="text-[11px] text-zinc-400 leading-relaxed font-normal">
                            {portal.description}
                          </p>

                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => {
                                handleSendMessage(`أريد حجز رحلة طيران عبر شركة "${portal.name}". هل يمكن لأبو مجد استعراض أفضل الأسعار، المواعيد المتاحة، والتأكيد الفوري للحجز؟`);
                              }}
                              className="text-[9px] text-[#c5a059]/90 hover:text-white bg-[#c5a059]/10 hover:bg-[#c5a059] border border-[#c5a059]/20 px-2 py-1 rounded-md flex items-center gap-1 transition-all font-bold cursor-pointer"
                            >
                              <Sparkles className="h-2.5 w-2.5" />
                              استفسر واحجز عبر الذكاء الاصطناعي
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-xs text-zinc-500">
                        لا توجد شركات طيران مطابقة لبحثك.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* TAB 2: SAUDI EMPLOYMENT PORTALS & CUSTOM JOB BOARD */}
              {activeSidebarTab === "jobs" && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-4"
                >
                  {/* Elegant Interactive Sub-Tabs Group */}
                  <div className="flex bg-zinc-950/65 p-1 rounded-xl gap-1 border border-zinc-800">
                    <button
                      onClick={() => { setJobsSubTab("employers"); setIsPublishingAd(false); }}
                      className={`flex-1 py-1.5 text-[10px] font-bold text-center rounded-lg transition-all cursor-pointer ${
                        jobsSubTab === "employers"
                          ? "bg-[#c5a059] text-black shadow-md font-extrabold"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      طلب عمالة
                    </button>
                    <button
                      onClick={() => { setJobsSubTab("seekers"); setIsPublishingAd(false); }}
                      className={`flex-1 py-1.5 text-[10px] font-bold text-center rounded-lg transition-all cursor-pointer ${
                        jobsSubTab === "seekers"
                          ? "bg-[#c5a059] text-black shadow-md font-extrabold"
                          : "text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      طلب عمل
                    </button>
                  </div>

                  {/* CONTENT SUB-TAB 2 & 3: EMPLOYERS (LOOKING FOR LABOR) OR SEEKERS (LOOKING FOR JOBS) */}
                  {(jobsSubTab === "employers" || jobsSubTab === "seekers") && (
                    <div className="flex flex-col gap-4">
                      {isPublishingAd ? (
                        <motion.form 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onSubmit={handlePublishAdSubmit}
                          className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col gap-3"
                        >
                          <h4 className="text-xs font-bold text-[#c5a059] flex items-center gap-1">
                            <Sparkles className="h-3 w-3 animate-pulse" />
                            {jobsSubTab === "employers" ? "نشر طلب عمالة جديد (لأصحاب العمل)" : "نشر طلب عمل جديد (للباحثين)"}
                          </h4>

                          {adPublishSuccess ? (
                            <div className="bg-emerald-950/40 border border-emerald-900/50 p-3 rounded-xl text-center flex flex-col items-center justify-center gap-1 text-emerald-300 text-xs">
                              <CheckCircle className="h-5 w-5 text-emerald-400 animate-bounce" />
                              <p className="font-bold">تم نشر الإعلان بنجاح!</p>
                              <p className="text-[10px] text-zinc-400">سيظهر إعلانك فوراً في لوحة التوظيف والفرص.</p>
                            </div>
                          ) : (
                            <>
                              {adPublishError && (
                                <div className="bg-rose-950/40 border border-rose-900/50 p-2 rounded-lg text-rose-300 text-[10px]">
                                  {adPublishError}
                                </div>
                              )}

                              <div>
                                <label className="block text-[9px] text-zinc-400 font-bold mb-1">الاسم الكامل / الجهة المعلنة *</label>
                                <input
                                  type="text"
                                  required
                                  value={newAdForm.name}
                                  onChange={(e) => setNewAdForm({ ...newAdForm, name: e.target.value })}
                                  placeholder={jobsSubTab === "employers" ? "مثال: شركة الرواد للمقاولات" : "مثال: م. علي صالح اليافعي"}
                                  className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2.5 py-2 rounded-lg text-zinc-255 focus:outline-hidden focus:border-[#c5a059]"
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[9px] text-zinc-400 font-bold mb-1">رقم جوال للتواصل *</label>
                                  <input
                                    type="text"
                                    required
                                    value={newAdForm.phone}
                                    onChange={(e) => setNewAdForm({ ...newAdForm, phone: e.target.value })}
                                    placeholder="مثال: +966501234567"
                                    className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2.5 py-2 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059] direction-ltr"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] text-zinc-400 font-bold mb-1">الموقع أو بلد العمل المطلوب *</label>
                                  <input
                                    type="text"
                                    required
                                    value={newAdForm.country}
                                    onChange={(e) => setNewAdForm({ ...newAdForm, country: e.target.value })}
                                    placeholder={jobsSubTab === "employers" ? "مثال: السعودية (المنطقة الشرقية)" : "مثال: اليمن (صنعاء)"}
                                    className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2.5 py-2 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059]"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] text-zinc-400 font-bold mb-1">تخصص العمالة والمهن *</label>
                                <select
                                  value={newAdForm.specialty}
                                  onChange={(e) => setNewAdForm({ ...newAdForm, specialty: e.target.value })}
                                  className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2 py-2 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059]"
                                >
                                  {LABOR_SPECIALTIES.map((spec, i) => (
                                    <option key={i} value={spec}>{spec}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="block text-[9px] text-zinc-400 font-bold mb-1">الراتب المتوقع أو المعروض</label>
                                  <input
                                    type="text"
                                    value={newAdForm.salary}
                                    onChange={(e) => setNewAdForm({ ...newAdForm, salary: e.target.value })}
                                    placeholder="مثال: 4000 ريال سعودي"
                                    className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2.5 py-2 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059]"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] text-zinc-400 font-bold mb-1">سنوات الخبرة</label>
                                  <input
                                    type="text"
                                    value={newAdForm.experience}
                                    onChange={(e) => setNewAdForm({ ...newAdForm, experience: e.target.value })}
                                    placeholder="مثال: 3 سنوات / 10 سنوات"
                                    className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2.5 py-2 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059]"
                                  />
                                </div>
                              </div>

                              <div>
                                <label className="block text-[9px] text-zinc-400 font-bold mb-1">تفاصيل الإعلان أو الشروط الإضافية *</label>
                                <textarea
                                  required
                                  rows={3}
                                  value={newAdForm.details}
                                  onChange={(e) => setNewAdForm({ ...newAdForm, details: e.target.value })}
                                  placeholder={jobsSubTab === "employers" ? "أدخل المتطلبات المهنية، طبيعة المهام، وشروط نقل الكفالة أو إصدار التأشيرة..." : "اذكر تفاصيل مهاراتك، المؤهل التعليمي، وتفضيلات السفر والتعاقد..."}
                                  className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2.5 py-2 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059] resize-none"
                                ></textarea>
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
                                      <button
                                        type="button"
                                        onClick={() => setNewAdForm(prev => ({ ...prev, image: "" }))}
                                        className="p-1 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-black rounded-md transition-all cursor-pointer"
                                        title="حذف الصورة"
                                      >
                                        <X className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <label className="w-full flex flex-col items-center justify-center py-2 cursor-pointer">
                                      <div className="flex items-center gap-1.5 text-zinc-400 hover:text-[#c5a059] transition-colors">
                                        <Camera className="h-4 w-4" />
                                        <span className="text-[10px] font-bold">اضغط هنا لإرفاق صورة</span>
                                      </div>
                                      <span className="text-[8px] text-zinc-500 mt-0.5">صيغ: PNG, JPG, WebP (أقل من 2MB)</span>
                                      <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => handleFileChange(e, "job")}
                                        className="hidden"
                                      />
                                    </label>
                                  )}
                                </div>
                              </div>

                              <div className="flex gap-2 justify-end mt-1">
                                <button
                                  type="button"
                                  onClick={() => setIsPublishingAd(false)}
                                  className="px-3 py-2 border border-zinc-800 hover:bg-zinc-800 rounded-lg text-zinc-400 text-[10px] font-bold cursor-pointer"
                                >
                                  إلغاء
                                </button>
                                <button
                                  type="submit"
                                  className="px-4 py-2 bg-[#c5a059] hover:bg-amber-500 text-black rounded-lg text-[10px] font-bold cursor-pointer"
                                >
                                  حفظ ونشر الإعلان
                                </button>
                              </div>
                            </>
                          )}
                        </motion.form>
                      ) : (
                        <>
                          {/* Top Heading & Launch Ad creation button */}
                          <div className="flex justify-between items-center gap-2">
                            <span className="text-[11px] font-bold text-zinc-300">
                              {jobsSubTab === "employers" ? "لوحة طالبي العمالة (أصحاب العمل):" : "لوحة طالبي العمل (الوظائف المتاحة):"}
                            </span>
                            <button
                              onClick={() => setIsPublishingAd(true)}
                              className="px-3 py-1.5 bg-[#c5a059]/10 hover:bg-[#c5a059] text-[#c5a059] hover:text-black border border-[#c5a059]/20 hover:border-transparent text-[10px] font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                            >
                              <Sparkles className="h-3 w-3" />
                              أنشئ إعلانك الآن
                            </button>
                          </div>

                          {/* Advanced Search and Filters Panel */}
                          <div className="sticky top-0 z-10 flex flex-col gap-2.5 bg-[#0c0c0e] pt-1 pb-3 -mx-1 px-1">
                            <div className="flex flex-col gap-2.5 bg-zinc-900/90 backdrop-blur-md p-3 rounded-xl border border-zinc-850 shadow-md">
                              {/* Search Query Input and Filter Toggle */}
                              <div className="flex gap-2 items-center">
                                <div className="relative flex-1">
                                <Search className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-zinc-500" />
                                <input
                                  type="text"
                                  value={jobSearchQuery}
                                  onChange={(e) => setJobSearchQuery(e.target.value)}
                                  placeholder="ابحث بالاسم، التخصص، أو البلد..."
                                  className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 pr-8 pl-8 py-2 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059] transition-all placeholder:text-zinc-600"
                                />
                                {jobSearchQuery && (
                                  <button
                                    type="button"
                                    onClick={() => setJobSearchQuery("")}
                                    className="absolute left-2.5 top-2.5 text-zinc-500 hover:text-zinc-300"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                              <button
                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                className={`px-3 py-2 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                                  showAdvancedFilters || selectedSpecialtyFilter !== "all" || jobLocationFilter !== "all" || jobSalaryFilter !== "all" || jobDateSort !== "newest"
                                    ? "bg-[#c5a059]/20 border-[#c5a059] text-[#c5a059]" 
                                    : "bg-[#0c0c0e] border-zinc-800 text-zinc-400 hover:text-zinc-200"
                                }`}
                                title="فلاتر البحث المتقدمة"
                              >
                                <Filter className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline text-xs">تصفية</span>
                              </button>
                            </div>

                            {/* Filters Grid - Expandable */}
                            <AnimatePresence>
                              {showAdvancedFilters && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                                    {/* Specialty Select */}
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[8px] text-zinc-500 font-bold flex items-center gap-1">
                                        <Briefcase className="h-2.5 w-2.5 text-[#c5a059]" />
                                        تخصص العمالة:
                                      </span>
                                      <select
                                        value={selectedSpecialtyFilter}
                                        onChange={(e) => setSelectedSpecialtyFilter(e.target.value)}
                                        className="w-full text-[10px] bg-[#0c0c0e] border border-[#1b1b22] px-1.5 py-1.5 rounded-lg text-zinc-300 focus:outline-hidden focus:border-[#c5a059]"
                                      >
                                        <option value="all">كل التخصصات</option>
                                        {LABOR_SPECIALTIES.map((spec, i) => (
                                          <option key={i} value={spec}>{spec}</option>
                                        ))}
                                      </select>
                                    </div>

                                    {/* Location Select */}
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[8px] text-zinc-500 font-bold flex items-center gap-1">
                                        <MapPin className="h-2.5 w-2.5 text-[#c5a059]" />
                                        موقع العمل:
                                      </span>
                                      <select
                                        value={jobLocationFilter}
                                        onChange={(e) => setJobLocationFilter(e.target.value)}
                                        className="w-full text-[10px] bg-[#0c0c0e] border border-[#1b1b22] px-1.5 py-1.5 rounded-lg text-zinc-300 focus:outline-hidden focus:border-[#c5a059]"
                                      >
                                        <option value="all">كل المواقع</option>
                                        <option value="saudi">السعودية 🇸🇦</option>
                                        <option value="yemen">اليمن 🇾🇪</option>
                                        <option value="uae">الإمارات 🇦🇪</option>
                                        <option value="qatar">قطر 🇶🇦</option>
                                        <option value="oman">عمان 🇴🇲</option>
                                        <option value="other">أخرى 🌐</option>
                                      </select>
                                    </div>

                                    {/* Salary Range Select */}
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[8px] text-zinc-500 font-bold flex items-center gap-1">
                                        <DollarSign className="h-2.5 w-2.5 text-[#c5a059]" />
                                        الراتب:
                                      </span>
                                      <select
                                        value={jobSalaryFilter}
                                        onChange={(e) => setJobSalaryFilter(e.target.value)}
                                        className="w-full text-[10px] bg-[#0c0c0e] border border-[#1b1b22] px-1.5 py-1.5 rounded-lg text-zinc-300 focus:outline-hidden focus:border-[#c5a059]"
                                      >
                                        <option value="all">الكل</option>
                                        <option value="under_2000">أقل من 2000</option>
                                        <option value="2000_4000">2000 - 4000</option>
                                        <option value="4000_6000">4000 - 6000</option>
                                        <option value="above_6000">أكثر من 6000</option>
                                        <option value="unspecified">غير محدد</option>
                                      </select>
                                    </div>

                                    {/* Date Sort/Filter Select */}
                                    <div className="flex flex-col gap-1">
                                      <span className="text-[8px] text-zinc-500 font-bold flex items-center gap-1">
                                        <Clock className="h-2.5 w-2.5 text-[#c5a059]" />
                                        النشر:
                                      </span>
                                      <select
                                        value={jobDateSort}
                                        onChange={(e) => setJobDateSort(e.target.value as any)}
                                        className="w-full text-[10px] bg-[#0c0c0e] border border-[#1b1b22] px-1.5 py-1.5 rounded-lg text-zinc-300 focus:outline-hidden focus:border-[#c5a059]"
                                      >
                                        <option value="newest">الأحدث</option>
                                        <option value="oldest">الأقدم</option>
                                        <option value="last24h">آخر 24 ساعة</option>
                                      </select>
                                    </div>
                                  </div>

                                  {/* Clear Filters Button */}
                                  {(selectedSpecialtyFilter !== "all" || jobLocationFilter !== "all" || jobSalaryFilter !== "all" || jobSearchQuery !== "" || jobDateSort !== "newest") && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setSelectedSpecialtyFilter("all");
                                        setJobLocationFilter("all");
                                        setJobSalaryFilter("all");
                                        setJobSearchQuery("");
                                        setJobDateSort("newest");
                                      }}
                                      className="w-full mt-3 text-[9px] font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 py-1.5 rounded-md flex items-center justify-center gap-1 transition-colors cursor-pointer"
                                    >
                                      <RotateCcw className="h-2.5 w-2.5" />
                                      إعادة ضبط جميع الفلاتر
                                    </button>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                            </div>
                          </div>

                          {/* Render Active Ad list */}
                          <div className="flex flex-col gap-3 pr-1">
                            {sortJobAdsByDate(jobAds.filter(matchesJobAd), jobDateSort).length > 0 ? (
                              sortJobAdsByDate(jobAds.filter(matchesJobAd), jobDateSort)
                                .map((ad) => (
                                  <div 
                                    key={ad.id} 
                                    className="p-3 bg-[#111115] hover:bg-zinc-900 border border-zinc-850 rounded-xl transition-all flex flex-col gap-2.5 group"
                                  >
                                    <div className="flex justify-between items-start gap-1">
                                      <div>
                                        <div className="flex items-center gap-1.5 flex-wrap">
                                          <h4 className="text-xs font-extrabold text-[#c5a059] group-hover:text-amber-300 transition-colors">
                                            {ad.title || ad.name}
                                          </h4>
                                          {ad.title && (
                                            <span className="text-[9px] text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded-md border border-zinc-800">
                                              {ad.name}
                                            </span>
                                          )}
                                          <button
                                            type="button"
                                            onClick={() => handleOpenRatingModal(ad.name, ad.phone)}
                                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-[8px] font-bold cursor-pointer transition-all"
                                            title="انقر لتقييم مصداقية هذا المعلن"
                                          >
                                            <Star className="h-2.5 w-2.5 fill-amber-400 stroke-amber-400" />
                                            <span>{getAdvertiserRating(ad.phone).count > 0 ? getAdvertiserRating(ad.phone).average : "جديد (قيّم)"}</span>
                                            {getAdvertiserRating(ad.phone).count > 0 && <span className="text-zinc-500 text-[7px]">({getAdvertiserRating(ad.phone).count})</span>}
                                          </button>
                                        </div>
                                        <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                                          {ad.specialty}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1.5">
                                        <button
                                          type="button"
                                          onClick={() => toggleJobFavorite(ad.id)}
                                          className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                                          title={favoritedJobIds.includes(ad.id) ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                                        >
                                          <Heart 
                                            className={`h-3.5 w-3.5 transition-all ${
                                              favoritedJobIds.includes(ad.id) 
                                                ? "fill-rose-500 text-rose-500 scale-110" 
                                                : "text-zinc-500 hover:scale-105"
                                            }`} 
                                          />
                                        </button>
                                        <span className="text-[9px] text-zinc-500 font-medium whitespace-nowrap">
                                          {ad.timestamp}
                                        </span>
                                      </div>
                                    </div>

                                    <p className="text-[11px] text-zinc-300 leading-relaxed font-normal bg-zinc-950/20 p-2 rounded-lg border border-zinc-850/60">
                                      {activeTranslations[ad.id] && translatedTexts[ad.id] ? (
                                        <span className="block">
                                          <span className="text-[9px] font-bold text-amber-400 block mb-1">✨ ترجمة الذكاء الاصطناعي (العربية):</span>
                                          {translatedTexts[ad.id].length > 120 ? (
                                            <>
                                              {translatedTexts[ad.id].substring(0, 120)}...{" "}
                                              <button
                                                type="button"
                                                onClick={() => setSelectedReadingAd({
                                                  title: ad.name,
                                                  specialty: ad.specialty,
                                                  content: translatedTexts[ad.id],
                                                  isTranslation: true
                                                })}
                                                className="text-[#c5a059] hover:text-amber-400 underline font-bold cursor-pointer inline-flex items-center gap-0.5 ml-1"
                                              >
                                                وضع القراءة 📖
                                              </button>
                                            </>
                                          ) : (
                                            translatedTexts[ad.id]
                                          )}
                                        </span>
                                      ) : (
                                        ad.details.length > 120 ? (
                                          <>
                                            {ad.details.substring(0, 120)}...{" "}
                                            <button
                                              type="button"
                                              onClick={() => setSelectedReadingAd({
                                                title: ad.name,
                                                specialty: ad.specialty,
                                                content: ad.details,
                                                isTranslation: false
                                              })}
                                              className="text-[#c5a059] hover:text-amber-400 underline font-bold cursor-pointer inline-flex items-center gap-0.5 ml-1"
                                            >
                                              وضع القراءة 📖
                                            </button>
                                          </>
                                        ) : (
                                          ad.details
                                        )
                                      )}
                                    </p>

                                    {translationErrors[ad.id] && (
                                      <div className="text-[9px] text-rose-400 px-2 py-1 bg-rose-500/10 border border-rose-500/20 rounded-md">
                                        ⚠️ {translationErrors[ad.id]}
                                      </div>
                                    )}

                                    {ad.image && (
                                      <div className="w-full overflow-hidden rounded-lg border border-zinc-800 bg-black/30 flex items-center justify-center min-h-[120px] max-h-[200px] p-4">
                                        {isDataSavingMode && !loadedImageIds[ad.id] ? (
                                          <div className="flex flex-col items-center justify-center gap-2 text-center py-4 w-full">
                                            <div className="p-3 bg-zinc-900 rounded-full border border-zinc-800 text-[#c5a059] shadow-inner">
                                              <Image className="h-5 w-5 opacity-85" />
                                            </div>
                                            <div>
                                              <p className="text-[10px] text-zinc-400 font-bold">تم إيقاف التحميل التلقائي للصور</p>
                                              <p className="text-[9px] text-zinc-500 mt-0.5">وضع توفير البيانات مفعل لتوفير الاستهلاك</p>
                                            </div>
                                            <button
                                              type="button"
                                              onClick={() => setLoadedImageIds(prev => ({ ...prev, [ad.id]: true }))}
                                              className="mt-1 text-xs font-bold text-black bg-[#c5a059] hover:bg-amber-500 px-4 py-1.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                                            >
                                              <Image className="h-3.5 w-3.5" />
                                              تحميل الصورة
                                            </button>
                                          </div>
                                        ) : (
                                          <img 
                                            src={ad.image} 
                                            alt="مرفق الإعلان" 
                                            className="max-h-[200px] w-auto object-contain select-none"
                                            referrerPolicy="no-referrer"
                                          />
                                        )}
                                      </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400 bg-zinc-900/30 p-1.5 rounded-lg border border-zinc-850/40">
                                      <div>📍 الموقع: <span className="font-bold text-zinc-200">{ad.country}</span></div>
                                      <div>💼 الخبرة: <span className="font-bold text-zinc-200">{ad.experience || "غير محدد"}</span></div>
                                      <div className="col-span-2 mt-0.5 border-t border-zinc-850/30 pt-0.5">💰 الراتب: <span className="font-bold text-emerald-400">{ad.salary || "غير محدد"}</span></div>
                                    </div>

                                    {copiedShareId === ad.id && (
                                      <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] py-1 px-2 rounded-lg text-center font-bold animate-pulse">
                                        ✓ تم نسخ نص وتفاصيل الإعلان بنجاح لمشاركته!
                                      </div>
                                    )}

                                    <div className="flex gap-2 justify-end pt-1 flex-wrap">
                                      {/* Reading Mode option */}
                                      {(ad.details.length > 120 || (activeTranslations[ad.id] && (translatedTexts[ad.id]?.length || 0) > 120)) && (
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const isTranslation = !!(activeTranslations[ad.id] && translatedTexts[ad.id]);
                                            setSelectedReadingAd({
                                              title: ad.name,
                                              specialty: ad.specialty,
                                              content: isTranslation ? translatedTexts[ad.id] : ad.details,
                                              isTranslation
                                            });
                                          }}
                                          className="text-[9px] font-bold text-zinc-300 bg-zinc-850/90 hover:bg-zinc-800 hover:text-[#c5a059] px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-all cursor-pointer border border-zinc-800"
                                        >
                                          <BookOpen className="h-2.5 w-2.5" />
                                          وضع القراءة 📖
                                        </button>
                                      )}

                                      {/* AI Translation Button */}
                                      <button
                                        type="button"
                                        onClick={() => handleTranslate(ad.id, ad.details)}
                                        className={`text-[9px] font-bold px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-all cursor-pointer border ${
                                          activeTranslations[ad.id]
                                            ? "bg-[#c5a059]/20 border-[#c5a059]/50 text-amber-300 hover:bg-[#c5a059]/30"
                                            : "bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700/30 text-zinc-300"
                                        }`}
                                        disabled={translatingIds[ad.id]}
                                      >
                                        <Globe className={`h-2.5 w-2.5 ${translatingIds[ad.id] ? "animate-spin text-[#c5a059]" : ""}`} />
                                        {translatingIds[ad.id] 
                                          ? "جاري الترجمة..." 
                                          : activeTranslations[ad.id] 
                                            ? "عرض النص الأصلي" 
                                            : "ترجمة للعربية"}
                                      </button>

                                      {/* Share Option */}
                                      <div className="relative group/share">
                                        <button
                                          type="button"
                                          className="text-[9px] font-bold text-zinc-300 bg-zinc-800/80 hover:bg-zinc-700 px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-all cursor-pointer border border-zinc-700/30"
                                        >
                                          <Share2 className="h-2.5 w-2.5 text-zinc-400" />
                                          مشاركة الإعلان
                                        </button>
                                        <div className="absolute bottom-full left-0 mb-1.5 hidden group-hover/share:flex flex-col bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 shadow-2xl z-50 min-w-[130px]">
                                          <button
                                            type="button"
                                            onClick={() => handleShareAd(getJobShareText(ad), ad.id, "whatsapp")}
                                            className="text-[9px] text-zinc-300 hover:text-emerald-400 hover:bg-zinc-900 px-2 py-1.5 rounded-md text-right cursor-pointer flex items-center justify-between font-extrabold"
                                          >
                                            <span>واتساب</span>
                                            <span className="text-emerald-500 text-[10px]">🟢</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleShareAd(getJobShareText(ad), ad.id, "telegram")}
                                            className="text-[9px] text-zinc-300 hover:text-sky-400 hover:bg-zinc-900 px-2 py-1.5 rounded-md text-right cursor-pointer flex items-center justify-between font-extrabold"
                                          >
                                            <span>تليجرام</span>
                                            <span className="text-sky-500 text-[10px]">🔵</span>
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleShareAd(getJobShareText(ad), ad.id, "copy")}
                                            className="text-[9px] text-[#c5a059] hover:text-amber-300 hover:bg-zinc-900 px-2 py-1.5 rounded-md text-right cursor-pointer flex items-center justify-between font-extrabold border-t border-zinc-900 mt-1 pt-1"
                                          >
                                            <span>نسخ النص جاهزاً</span>
                                            <span>📋</span>
                                          </button>
                                        </div>
                                      </div>

                                      {ad.url && (
                                        <a
                                          href={ad.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[9px] font-bold bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-black border border-sky-500/20 px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-all cursor-pointer"
                                        >
                                          <ExternalLink className="h-2.5 w-2.5" />
                                          الذهاب للمصدر للتقديم
                                        </a>
                                      )}

                                      {/* Inner App Chat Link */}
                                      {ad.phone && (
                                        <button
                                          type="button"
                                          onClick={() => handleStartChat(ad.phone, ad.name, ad.id, `وظيفة: ${ad.specialty}`)}
                                          className="text-[9px] font-bold bg-amber-500/10 hover:bg-[#c5a059] text-amber-400 hover:text-black border border-amber-500/20 px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-all cursor-pointer"
                                        >
                                          <MessageSquare className="h-2.5 w-2.5" />
                                          دردشة فورية 💬
                                        </button>
                                      )}

                                      {/* Phone direct call / WhatsApp link */}
                                      {ad.phone && (
                                        <a
                                          href={`https://wa.me/${ad.phone.replace("+", "").replace(/\s+/g, '')}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-[9px] font-bold bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/20 px-2 py-1.5 rounded-md flex items-center gap-1 transition-all"
                                        >
                                          <Phone className="h-2.5 w-2.5" />
                                          تواصل بالواتساب
                                        </a>
                                      )}

                                      {/* AI Query trigger button */}
                                      <button
                                        onClick={() => {
                                          handleSendMessage(`أريد الاستفسار بالذكاء الاصطناعي عن إعلان "${ad.title || ad.name}" المتخصص في "${ad.specialty}" من موقع "${ad.country}". هل يمكن لأبو مجد مساعدتي في إنهاء التأشيرة أو ربطي معهم؟`);
                                        }}
                                        className="text-[9px] font-bold text-black bg-[#c5a059] hover:bg-[#8e6e3c] px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-all cursor-pointer font-bold"
                                      >
                                        <Sparkles className="h-2.5 w-2.5" />
                                        اسأل المساعد الذكي
                                      </button>
                                    </div>
                                  </div>
                                ))
                            ) : (
                              <div className="text-center py-10 text-xs text-zinc-500 flex flex-col items-center justify-center gap-1">
                                <Briefcase className="h-6 w-6 text-zinc-700 animate-pulse" />
                                <span>لا توجد إعلانات مطابقة حالياً بالتخصص المختار.</span>
                                <button
                                  onClick={() => setIsPublishingAd(true)}
                                  className="text-[#c5a059] hover:underline font-bold mt-1 text-[10px] cursor-pointer"
                                >
                                  كن أول من ينشر إعلانه هنا!
                                </button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                </motion.div>
              )}

              {/* TAB 3: MOFA VISA APPLICATION QUERY TOOL */}
              {activeSidebarTab === "mofa" && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-extrabold text-[#c5a059] flex items-center gap-1.5">
                      <Search className="h-4 w-4" />
                      استعلام المعاملات ووزارة الخارجية السعودية
                    </h3>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      أدخل بيانات المعاملة أو الطلب المقدم لوزارة الخارجية لمتابعة حالة التأشيرة الحالية عبر محاكاة ذكية للربط القنصلي:
                    </p>
                  </div>

                  {!mofaResult && !mofaLoading && (
                    <form onSubmit={handleMofaQuerySubmit} className="flex flex-col gap-3">
                      <div>
                        <label className="block text-[10px] text-zinc-400 font-bold mb-1">رقم الطلب بوزارة الخارجية (MOFA)</label>
                        <input 
                          type="text" 
                          required
                          value={mofaAppNumber}
                          onChange={(e) => setMofaAppNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="مثال: 49204818" 
                          className="w-full text-xs bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-zinc-200 focus:outline-hidden focus:border-[#c5a059]"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-zinc-400 font-bold mb-1">رقم جواز السفر</label>
                        <input 
                          type="text" 
                          required
                          value={mofaPassportNumber}
                          onChange={(e) => setMofaPassportNumber(e.target.value.toUpperCase().trim())}
                          placeholder="مثال: Y123456" 
                          className="w-full text-xs bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-zinc-200 focus:outline-hidden focus:border-[#c5a059] uppercase"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-zinc-400 font-bold mb-1">نوع التأشيرة / المعاملة</label>
                        <select 
                          value={mofaVisaType}
                          onChange={(e) => setMofaVisaType(e.target.value)}
                          className="w-full text-xs bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-xl text-zinc-200 focus:outline-hidden focus:border-[#c5a059]"
                        >
                          <option value="تأشيرة عمل (مهنية)">تأشيرة عمل (مهنية)</option>
                          <option value="تأشيرة زيارة عائلية">تأشيرة زيارة عائلية</option>
                          <option value="تأشيرة زيارة شخصية">تأشيرة زيارة شخصية</option>
                          <option value="تأشيرة إقامة / عائلية">تأشيرة إقامة / عائلية</option>
                          <option value="تأشيرة تمديد خروج وعودة">تأشيرة تمديد خروج وعودة</option>
                        </select>
                      </div>

                      <button 
                        type="submit"
                        className="w-full mt-1 bg-gradient-to-r from-[#c5a059] to-[#8e6e3c] text-black text-xs font-bold py-2.5 rounded-xl hover:scale-102 transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                      >
                        <Sparkles className="h-3.5 w-3.5" />
                        بدء استعلام قنصلي فوري
                      </button>
                    </form>
                  )}

                  {/* Active Tracked Requests Summary list (shown if no active single result is selected) */}
                  {!mofaResult && !mofaLoading && mofaTrackedRequests.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-zinc-850 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-[#c5a059] flex items-center gap-1.5">
                          <Bell className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                          الطلبات والـتأشيرات قيد المتابعة والتدقيق ({mofaTrackedRequests.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm("هل أنت متأكد من إلغاء متابعة جميع الطلبات؟")) {
                              setMofaTrackedRequests([]);
                            }
                          }}
                          className="text-[9px] text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                        >
                          إلغاء الكل
                        </button>
                      </div>

                      <div className="flex flex-col gap-2">
                        {mofaTrackedRequests.map((req) => (
                          <div 
                            key={req.appNumber}
                            className="bg-zinc-900/60 p-3 rounded-xl border border-zinc-850 hover:border-zinc-800 transition-all text-right flex flex-col gap-2"
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-zinc-200">طلب رقم: <span className="font-mono text-amber-400">{req.appNumber}</span></span>
                                <span className="text-[9px] text-zinc-500 mt-0.5">نوع المعاملة: {req.visaType} | جواز: <span className="uppercase font-mono">{req.passportNumber}</span></span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setMofaAppNumber(req.appNumber);
                                  setMofaPassportNumber(req.passportNumber);
                                  setMofaVisaType(req.visaType);
                                  setMofaResult({
                                    appNumber: req.appNumber,
                                    passportNumber: req.passportNumber,
                                    visaType: req.visaType,
                                    statusText: req.currentStatus,
                                    subStatus: "تم تحميل البيانات من ذاكرة تتبع المعاملات.",
                                    steps: [
                                      { name: "تقديم الطلب وتسجيله إلكترونياً", status: "completed", date: "منجز" },
                                      { name: "سداد الرسوم وتفعيل التأمين الطبي المعتمد", status: "completed", date: "منجز" },
                                      { name: "التدقيق والمطابقة لدى الممثلية / السفارة", status: "completed", date: "منجز" },
                                      { name: req.currentStatus, status: "active", date: `آخر فحص: ${req.lastChecked}` }
                                    ]
                                  });
                                }}
                                className="text-[9px] bg-zinc-800 hover:bg-zinc-750 text-zinc-300 px-2 py-1 rounded border border-zinc-700 font-bold cursor-pointer"
                              >
                                عرض الطلب
                              </button>
                            </div>

                            <div className="bg-zinc-950/60 p-2 rounded-lg border border-zinc-900/40 flex justify-between items-center text-[10px]">
                              <div className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                                <span className="text-zinc-400">الحالة الأخيرة:</span>
                                <span className="text-zinc-200 font-bold">{req.currentStatus}</span>
                              </div>
                              <span className="text-[8px] text-zinc-500 font-mono">تحديث: {req.lastChecked}</span>
                            </div>

                            {/* Micro Simulator trigger from the general list! */}
                            <div className="flex justify-between items-center pt-1 mt-0.5 border-t border-zinc-900/60">
                              <span className="text-[8px] text-zinc-500">جرب محاكاة حدوث تغيير الآن:</span>
                              <div className="flex gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSimulateStatusChange(req.appNumber, 2)}
                                  className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/15 text-[8px] font-bold px-2 py-0.5 rounded transition-colors cursor-pointer"
                                >
                                  إصدار التأشيرة 🎉
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSimulateStatusChange(req.appNumber, 3)}
                                  className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/15 text-[8px] font-bold px-2 py-0.5 rounded transition-colors cursor-pointer"
                                >
                                  مراجعة مستندات ⚠️
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMofaTrackedRequests(prev => prev.filter(r => r.appNumber !== req.appNumber));
                                  }}
                                  className="text-zinc-500 hover:text-zinc-300 text-[8px] font-bold px-1.5 py-0.5 cursor-pointer"
                                  title="إيقاف المتابعة"
                                >
                                  إلغاء
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Loading State */}
                  {mofaLoading && (
                    <div className="py-12 flex flex-col items-center justify-center gap-3">
                      <div className="w-10 h-10 rounded-full border-2 border-zinc-800 border-t-2 border-t-[#c5a059] animate-spin"></div>
                      <p className="text-[11px] text-[#c5a059] font-bold text-center animate-pulse px-4">
                        جاري تهيئة قناة الاتصال الآمن بسيرفرات الممثلية والقنصلية بوزارة الخارجية السعودية...
                      </p>
                    </div>
                  )}

                  {/* Query Result Card */}
                  {mofaResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-4"
                    >
                      {/* Top Header result */}
                      <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex flex-col gap-1 text-center">
                        <div className="mx-auto bg-amber-500/10 text-[#c5a059] p-1.5 rounded-full border border-[#c5a059]/15">
                          <FileText className="h-4 w-4" />
                        </div>
                        <h4 className="text-xs font-bold text-zinc-100 mt-1">حالة الطلب: <span className="text-amber-400">{mofaResult.statusText}</span></h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">{mofaResult.subStatus}</p>
                      </div>

                      {/* Detail list */}
                      <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/80 flex flex-col gap-2 text-xs text-zinc-300">
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500 text-[10px]">رقم الطلب (MOFA):</span>
                          <span className="font-mono text-zinc-100 font-bold select-all">{mofaResult.appNumber}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500 text-[10px]">رقم الجواز:</span>
                          <span className="font-mono text-zinc-100 font-bold uppercase select-all">{mofaResult.passportNumber}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-500 text-[10px]">نوع المعاملة:</span>
                          <span className="text-zinc-100 font-bold">{mofaResult.visaType}</span>
                        </div>
                      </div>

                      {/* Subscription Notification Toggle Widget */}
                      {(() => {
                        const isCurrentlyTracked = mofaTrackedRequests.some(r => r.appNumber === mofaResult.appNumber);
                        return (
                          <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-zinc-850 flex flex-col gap-2.5 text-right" dir="rtl">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-1.5 text-zinc-300 font-bold text-[11px]">
                                <Bell className={`h-3.5 w-3.5 ${isCurrentlyTracked ? "text-amber-400 animate-pulse" : "text-zinc-500"}`} />
                                <span>إشعارات المتابعة وتنبيهات التغيير آلياً</span>
                              </div>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                                isCurrentlyTracked ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-zinc-950 text-zinc-500"
                              }`}>
                                {isCurrentlyTracked ? "نشط ومتابع" : "غير مفعل"}
                              </span>
                            </div>
                            
                            <p className="text-[10px] text-zinc-400 leading-relaxed">
                              فعّل الإشعارات البرمجية لتصلك تنبيهات حية فورية على الشاشة في حال تغيرت حالة المعاملة لدى وزارة الخارجية من قِبل موظفي القنصلية.
                            </p>

                            <button
                              type="button"
                              onClick={() => handleToggleTrackMofaRequest({
                                appNumber: mofaResult.appNumber,
                                passportNumber: mofaResult.passportNumber,
                                visaType: mofaResult.visaType,
                                statusText: mofaResult.statusText
                              })}
                              className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                                isCurrentlyTracked
                                  ? "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20"
                                  : "bg-[#c5a059]/10 hover:bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/15"
                              }`}
                            >
                              {isCurrentlyTracked ? (
                                <>
                                  <BellOff className="h-3.5 w-3.5" />
                                  إيقاف الإشعارات والمتابعة التلقائية
                                </>
                              ) : (
                                <>
                                  <Bell className="h-3.5 w-3.5" />
                                  تفعيل الإشعارات البرمجية للطلب
                                </>
                              )}
                            </button>

                            {/* Programmatic Simulator for testing the feature! */}
                            {isCurrentlyTracked && (
                              <div className="mt-2 pt-2.5 border-t border-zinc-850/60 flex flex-col gap-1.5">
                                <span className="text-[9px] font-bold text-[#c5a059]">⚡ محاكي التحديثات البرمجية (للتجربة الفورية):</span>
                                <div className="grid grid-cols-2 gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleSimulateStatusChange(mofaResult.appNumber, 2)}
                                    className="bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/15 text-[8.5px] font-bold py-1.5 rounded-lg transition-colors cursor-pointer"
                                  >
                                    محاكاة: صدور التأشيرة 🎉
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSimulateStatusChange(mofaResult.appNumber, 3)}
                                    className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/15 text-[8.5px] font-bold py-1.5 rounded-lg transition-colors cursor-pointer"
                                  >
                                    محاكاة: طلب وثائق إضافية ⚠️
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* Timeline Steps */}
                      <div className="flex flex-col gap-3 relative pr-3 border-r border-zinc-800">
                        {mofaResult.steps.map((step: any, idx: number) => (
                          <div key={idx} className="relative flex flex-col gap-0.5 text-xs pr-4">
                            {/* Dot indicator */}
                            <div className={`absolute right-[-17.5px] top-1.5 w-2 h-2 rounded-full ${
                              step.status === "completed" ? "bg-emerald-500" :
                              step.status === "active" ? "bg-amber-500 animate-ping" : "bg-zinc-800"
                            }`}></div>
                            {step.status === "active" && (
                              <div className="absolute right-[-17.5px] top-1.5 w-2 h-2 rounded-full bg-amber-500"></div>
                            )}

                            <span className={`font-bold ${
                              step.status === "completed" ? "text-emerald-400" :
                              step.status === "active" ? "text-amber-400" : "text-zinc-500"
                            }`}>{step.name}</span>
                            <span className="text-[10px] text-zinc-400">{step.date}</span>
                          </div>
                        ))}
                      </div>

                      {/* Direct Action Instruction Panel */}
                      <div className="bg-zinc-900/70 p-3 rounded-xl border border-zinc-800 flex flex-col gap-2">
                        <p className="text-[10px] text-zinc-400 leading-relaxed">
                          📌 <strong className="text-zinc-200">إرشاد المستعلم:</strong> لمطابقة البيانات بشكل حي ومباشر على البوابة الرسمية، نوصيك بالانتقال لبوابة وزارة الخارجية السعودية الرسمية وإدخال البيانات المعروضة أعلاه:
                        </p>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(`رقم الطلب: ${mofaResult.appNumber}\nرقم جواز السفر: ${mofaResult.passportNumber}`);
                              alert("تم نسخ البيانات بنجاح! يمكنك الآن لصقها في حقول الاستعلام الرسمية.");
                            }}
                            className="flex-1 text-[10px] font-bold bg-zinc-800 hover:bg-zinc-700 text-zinc-300 py-2 rounded-lg border border-zinc-700 transition-colors"
                          >
                            نسخ البيانات للمطابقة
                          </button>
                          
                          <a 
                            href="https://visa.mofa.gov.sa/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex-1 text-[10px] font-bold bg-[#c5a059] hover:bg-[#8e6e3c] text-black text-center py-2 rounded-lg flex items-center justify-center gap-1 transition-all"
                          >
                            منصة التأشيرات (MOFA)
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setMofaResult(null);
                            setMofaAppNumber("");
                            setMofaPassportNumber("");
                          }}
                          className="flex-1 text-center text-[10px] font-bold text-zinc-400 hover:text-zinc-200 py-1.5 rounded-lg border border-zinc-850 bg-zinc-900/30 hover:bg-zinc-900/80 transition-all cursor-pointer"
                        >
                          استعلام جديد
                        </button>

                        <button
                          onClick={() => {
                            handleSendMessage(`أريد متابعة طلبي رقم ${mofaResult.appNumber} في وزارة الخارجية لنوع التأشيرة ${mofaResult.visaType} وسداد الرسوم أو إنهاء باقي الإجراءات.`);
                          }}
                          className="flex-1 text-center text-[10px] font-bold text-black bg-[#c5a059] hover:bg-amber-500 py-1.5 rounded-lg transition-all cursor-pointer"
                        >
                          اطلب المتابعة
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* INTERACTIVE VISA COST ESTIMATOR SECTION */}
                  <div className="mt-4 pt-4 border-t border-zinc-850 flex flex-col gap-3.5">
                    <div className="flex items-center gap-2 bg-[#c5a059]/10 p-2.5 rounded-xl border border-[#c5a059]/20">
                      <div className="p-1.5 bg-[#c5a059]/15 rounded-lg text-[#c5a059]">
                        <Calculator className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <h4 className="text-xs font-bold text-[#c5a059]">حاسبة تقدير تكاليف وإنجاز التأشيرات</h4>
                        <p className="text-[9px] text-zinc-400">احسب التكلفة الأولية التقريبية لجميع المعاملات والخدمات القنصلية فوراً</p>
                      </div>
                    </div>

                    <div className="bg-zinc-950/40 p-3 rounded-xl border border-zinc-850 flex flex-col gap-3.5 text-right" dir="rtl">
                      {/* Grid for Visa Type and Destination */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
                        <div>
                          <label className="block text-[10px] text-zinc-400 font-bold mb-1">نوع التأشيرة المختار</label>
                          <select 
                            value={estVisaType}
                            onChange={(e) => setEstVisaType(e.target.value)}
                            className="w-full text-xs bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059]"
                          >
                            {ESTIMATOR_VISA_TYPES.map(v => (
                              <option key={v.key} value={v.key}>{v.label} ({v.base} ر.س)</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] text-zinc-400 font-bold mb-1">بلد الوجهة</label>
                          <select 
                            value={estCountry}
                            onChange={(e) => setEstCountry(e.target.value)}
                            className="w-full text-xs bg-zinc-900 border border-zinc-800 px-2.5 py-1.5 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059]"
                          >
                            {ESTIMATOR_COUNTRIES.map(c => (
                              <option key={c.key} value={c.key}>{c.label} {c.extra > 0 ? `(+${c.extra} ر.س)` : ""}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Number of Applicants & Currency Selection */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center border-t border-zinc-900 pt-2.5">
                        {/* Applicants count +/- */}
                        <div className="flex flex-col gap-1">
                          <label className="block text-[10px] text-zinc-400 font-bold">عدد الأفراد (المتقدمين)</label>
                          <div className="flex items-center gap-2 mt-0.5 justify-start">
                            <button
                              type="button"
                              onClick={() => setEstApplicants(prev => Math.max(1, prev - 1))}
                              className="h-7 w-7 bg-zinc-900 border border-zinc-800 hover:border-[#c5a059] rounded-lg text-zinc-300 font-extrabold flex items-center justify-center cursor-pointer select-none text-xs"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-xs text-zinc-100 font-extrabold font-mono">{estApplicants}</span>
                            <button
                              type="button"
                              onClick={() => setEstApplicants(prev => Math.min(10, prev + 1))}
                              className="h-7 w-7 bg-zinc-900 border border-zinc-800 hover:border-[#c5a059] rounded-lg text-zinc-300 font-extrabold flex items-center justify-center cursor-pointer select-none text-xs"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Currency Toggle */}
                        <div className="flex flex-col gap-1">
                          <label className="block text-[10px] text-zinc-400 font-bold">عرض التكلفة بعملة</label>
                          <div className="flex p-0.5 bg-zinc-900 border border-zinc-850 rounded-lg mt-0.5">
                            {[
                              { key: "SAR", label: "ريال سعودي 🇸🇦" },
                              { key: "USD", label: "دولار أمريكي 🇺🇸" },
                              { key: "YER", label: "ريال يمني 🇾🇪" }
                            ].map(curr => (
                              <button
                                key={curr.key}
                                type="button"
                                onClick={() => setEstCurrency(curr.key)}
                                className={`flex-1 py-1 text-[9px] font-bold rounded transition-all cursor-pointer ${
                                  estCurrency === curr.key 
                                    ? "bg-amber-500/10 text-[#c5a059] border border-amber-500/15" 
                                    : "text-zinc-500 hover:text-zinc-300"
                                }`}
                              >
                                {curr.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Additional Options */}
                      <div className="border-t border-zinc-900 pt-3 flex flex-col gap-2">
                        <span className="block text-[10px] text-zinc-400 font-extrabold">إجراءات وخدمات إضافية اختيارية:</span>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                          {/* Addon 1 */}
                          <label className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all select-none ${
                            estMedical 
                              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300" 
                              : "bg-zinc-900/40 border-zinc-850 text-zinc-400 hover:bg-zinc-900"
                          }`}>
                            <div className="flex flex-col text-right">
                              <span className="text-[10px] font-bold">فحص طبي معتمد</span>
                              <span className="text-[8px] text-zinc-500 font-mono">+250 ر.س / للفرد</span>
                            </div>
                            <input 
                              type="checkbox" 
                              checked={estMedical} 
                              onChange={(e) => setEstMedical(e.target.checked)}
                              className="accent-emerald-500 h-3.5 w-3.5 mr-2"
                            />
                          </label>

                          {/* Addon 2 */}
                          <label className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all select-none ${
                            estInsurance 
                              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300" 
                              : "bg-zinc-900/40 border-zinc-850 text-zinc-400 hover:bg-zinc-900"
                          }`}>
                            <div className="flex flex-col text-right">
                              <span className="text-[10px] font-bold">تأمين طبي دولي معتمد</span>
                              <span className="text-[8px] text-zinc-500 font-mono">+120 ر.س / للفرد</span>
                            </div>
                            <input 
                              type="checkbox" 
                              checked={estInsurance} 
                              onChange={(e) => setEstInsurance(e.target.checked)}
                              className="accent-emerald-500 h-3.5 w-3.5 mr-2"
                            />
                          </label>

                          {/* Addon 3 */}
                          <label className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all select-none ${
                            estAuth 
                              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300" 
                              : "bg-zinc-900/40 border-zinc-850 text-zinc-400 hover:bg-zinc-900"
                          }`}>
                            <div className="flex flex-col text-right">
                              <span className="text-[10px] font-bold">تفويض إلكتروني (مساند/قوى)</span>
                              <span className="text-[8px] text-zinc-500 font-mono">+150 ر.س (مقطوعة)</span>
                            </div>
                            <input 
                              type="checkbox" 
                              checked={estAuth} 
                              onChange={(e) => setEstAuth(e.target.checked)}
                              className="accent-emerald-500 h-3.5 w-3.5 mr-2"
                            />
                          </label>

                          {/* Addon 4 */}
                          <label className={`p-2 rounded-lg border flex items-center justify-between cursor-pointer transition-all select-none ${
                            estTranslation 
                              ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300" 
                              : "bg-zinc-900/40 border-zinc-850 text-zinc-400 hover:bg-zinc-900"
                          }`}>
                            <div className="flex flex-col text-right">
                              <span className="text-[10px] font-bold">توثيق وترجمة المستندات</span>
                              <span className="text-[8px] text-zinc-500 font-mono">+100 ر.س (مقطوعة)</span>
                            </div>
                            <input 
                              type="checkbox" 
                              checked={estTranslation} 
                              onChange={(e) => setEstTranslation(e.target.checked)}
                              className="accent-emerald-500 h-3.5 w-3.5 mr-2"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Receipt Breakdown & Total cost */}
                      {(() => {
                        const vObj = ESTIMATOR_VISA_TYPES.find(v => v.key === estVisaType) || ESTIMATOR_VISA_TYPES[0];
                        const cObj = ESTIMATOR_COUNTRIES.find(c => c.key === estCountry) || ESTIMATOR_COUNTRIES[0];
                        
                        const baseSubtotal = vObj.base * estApplicants;
                        const countrySubtotal = cObj.extra * estApplicants;
                        const medicalSubtotal = (estMedical ? 250 : 0) * estApplicants;
                        const insuranceSubtotal = (estInsurance ? 120 : 0) * estApplicants;
                        const authSubtotal = estAuth ? 150 : 0;
                        const transSubtotal = estTranslation ? 100 : 0;

                        const totalCostSar = baseSubtotal + countrySubtotal + medicalSubtotal + insuranceSubtotal + authSubtotal + transSubtotal;

                        const formatPrice = (sarValue: number) => {
                          if (estCurrency === "USD") {
                            const usd = (sarValue / 3.75).toFixed(1);
                            return `$ ${usd}`;
                          }
                          if (estCurrency === "YER") {
                            const yer = Math.round(sarValue * 450);
                            return `${yer.toLocaleString('ar-YE')} ريال يمني`;
                          }
                          return `${sarValue} ر.س`;
                        };

                        return (
                          <div className="border-t border-zinc-900 pt-3 flex flex-col gap-2">
                            <span className="block text-[10px] text-zinc-400 font-extrabold text-right">تفصيل التكاليف التقديرية (الفاتورة الأولية):</span>
                            
                            <div className="bg-zinc-900/60 p-3 rounded-lg border border-zinc-850 flex flex-col gap-1.5 text-xs text-right">
                              {/* Line 1 */}
                              <div className="flex justify-between items-center text-zinc-400">
                                <span>رسوم {vObj.label} ({estApplicants} فرد):</span>
                                <span className="font-mono text-zinc-200">{formatPrice(baseSubtotal)}</span>
                              </div>

                              {/* Line 2 (if any country extra) */}
                              {cObj.extra > 0 && (
                                <div className="flex justify-between items-center text-zinc-400">
                                  <span>إضافي معاملة {cObj.label}:</span>
                                  <span className="font-mono text-zinc-200">{formatPrice(countrySubtotal)}</span>
                                </div>
                              )}

                              {/* Line 3 (if medical check selected) */}
                              {estMedical && (
                                <div className="flex justify-between items-center text-zinc-400">
                                  <span>فحص طبي معتمد ({estApplicants} فرد):</span>
                                  <span className="font-mono text-zinc-200">{formatPrice(medicalSubtotal)}</span>
                                </div>
                              )}

                              {/* Line 4 (if insurance selected) */}
                              {estInsurance && (
                                <div className="flex justify-between items-center text-zinc-400">
                                  <span>تأمين طبي دولي معتمد ({estApplicants} فرد):</span>
                                  <span className="font-mono text-zinc-200">{formatPrice(insuranceSubtotal)}</span>
                                </div>
                              )}

                              {/* Line 5 (if authorization selected) */}
                              {estAuth && (
                                <div className="flex justify-between items-center text-zinc-400">
                                  <span>رسوم التفويض الإلكتروني المقطوعة:</span>
                                  <span className="font-mono text-zinc-200">{formatPrice(authSubtotal)}</span>
                                </div>
                              )}

                              {/* Line 6 (if translation selected) */}
                              {estTranslation && (
                                <div className="flex justify-between items-center text-zinc-400">
                                  <span>ترجمة وتصديق المستندات:</span>
                                  <span className="font-mono text-zinc-200">{formatPrice(transSubtotal)}</span>
                                </div>
                              )}

                              {/* Total line */}
                              <div className="border-t border-zinc-850 pt-2 mt-1.5 flex justify-between items-center font-extrabold">
                                <span className="text-[#c5a059]">إجمالي التكلفة المتوقعة:</span>
                                <span className="text-amber-400 text-sm font-mono">{formatPrice(totalCostSar)}</span>
                              </div>
                            </div>

                            {/* Actions buttons for Estimator */}
                            <div className="grid grid-cols-2 gap-2 mt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const addOnStrings = [
                                    estMedical && "فحص طبي معتمد",
                                    estInsurance && "تأمين طبي دولي",
                                    estAuth && "تفويض إلكتروني عبر مساند/قوى",
                                    estTranslation && "ترجمة وتصديق للوثائق"
                                  ].filter(Boolean);

                                  const addonsText = addOnStrings.length > 0 ? addOnStrings.join(" و") : "بدون خدمات إضافية";
                                  const promptMessage = `أريد استشارة ومساعدة بخصوص التكلفة التقديرية لتأشيرة: ${vObj.label} إلى بلد الوجهة: ${cObj.label} لعدد ${estApplicants} أفراد، مع طلب خدمات إضافية تشمل: ${addonsText}. التكلفة الإجمالية المحسوبة هي: ${formatPrice(totalCostSar)}. كيف يمكنني التنسيق والبدء معكم؟`;
                                  handleSendMessage(promptMessage);
                                }}
                                className="bg-zinc-800 hover:bg-zinc-750 text-[#c5a059] border border-zinc-700 hover:border-[#c5a059]/40 text-[10px] font-bold py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1"
                              >
                                <Sparkles className="h-3 w-3" />
                                استشِر المساعد الذكي
                              </button>

                              <a
                                href={`https://wa.me/967775012242?text=${encodeURIComponent(
                                  `السلام عليكم يا مكتب أبو مجد الحداد، قمت بحساب تكلفة تأشيرة تابعة لـ ${vObj.label} لبلد ${cObj.label} لعدد ${estApplicants} أفراد عبر حاسبة موقعكم الالكتروني. التكلفة التقديرية هي: ${formatPrice(totalCostSar)}. أرجو منكم تأكيد هذه التسعيرة وتوضيح المتطلبات للبدء بالعمل.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[10px] font-extrabold py-2 rounded-xl transition-all flex items-center justify-center gap-1 cursor-pointer shadow-md"
                              >
                                <Phone className="h-3 w-3" />
                                اطلب المعاملة بالواتساب
                              </a>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: BUY AND SELL MARKETPLACE */}
              {activeSidebarTab === "trade" && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-extrabold text-[#c5a059] flex items-center gap-1.5">
                      <ShoppingBag className="h-4 w-4 text-[#c5a059]" />
                      سوق بيع وشراء الخدمات والسلع
                    </h3>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      بوابة مجانية تتيح لكم نشر إعلانات بيع أو شراء المعاملات، فيز العمل والزيارات، السيارات، العقارات، التذاكر، والإلكترونيات:
                    </p>
                  </div>

                  {/* Toggle Mode Buttons */}
                  <div className="flex gap-2 p-1 bg-zinc-950 rounded-xl border border-zinc-900">
                    <button
                      type="button"
                      onClick={() => setIsPublishingMarketAd(false)}
                      className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                        !isPublishingMarketAd 
                          ? "bg-zinc-800 text-[#c5a059] shadow-inner" 
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      تصفح الإعلانات ({marketAds.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsPublishingMarketAd(true);
                        setMarketPublishSuccess(false);
                      }}
                      className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        isPublishingMarketAd 
                          ? "bg-zinc-800 text-[#c5a059] shadow-inner" 
                          : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      <PlusCircle className="h-3 w-3" />
                      انشر إعلانك مجاناً
                    </button>
                  </div>

                  {/* User's Published Ads & Reminders Section */}
                  {myPublishedAds.length > 0 && (
                    <div className="bg-zinc-950 p-3 rounded-xl border border-[#c5a059]/30 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#c5a059] flex items-center gap-1">
                          <Bell className="h-3.5 w-3.5 text-[#c5a059] animate-bounce" />
                          إدارة إعلاناتك وصلاحيتها (المساعد الذكي)
                        </span>
                        <span className="text-[9px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded-md font-mono">
                          {myPublishedAds.length} إعلانات نشطة
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        {myPublishedAds.map(ad => {
                          const elapsed = getDaysElapsed(ad.publishedAt);
                          const isExpired = elapsed >= 30;

                          return (
                            <div 
                              key={ad.id}
                              className={`p-2.5 rounded-lg border text-xs flex flex-col gap-2 transition-all ${
                                isExpired 
                                  ? "bg-rose-950/20 border-rose-900/60 shadow-[0_0_15px_rgba(244,63,94,0.1)]" 
                                  : "bg-zinc-900/40 border-zinc-850"
                              }`}
                            >
                              <div className="flex justify-between items-start gap-2">
                                <span className="font-extrabold text-zinc-200 line-clamp-1 flex-1">
                                  {ad.title}
                                </span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-sm shrink-0 font-mono ${
                                  isExpired ? "bg-rose-500/20 text-rose-400 font-bold" : "bg-zinc-800 text-zinc-400"
                                }`}>
                                  {isExpired ? "⚠️ منتهي (30+ يوم)" : `نشط (منذ ${elapsed} يوم)`}
                                </span>
                              </div>

                              {isExpired ? (
                                <div className="bg-rose-950/40 p-2 rounded-md border border-rose-900/30 text-[10px] text-zinc-300 leading-relaxed flex flex-col gap-2">
                                  <div className="flex gap-1.5 items-start">
                                    <Sparkles className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                                    <p>
                                      <strong className="text-[#c5a059]">مساعد أبو مجد الذكي:</strong> مضى أكثر من 30 يوماً على نشر إعلانك. هل تود تمديده لرفع ظهوره في بداية قائمة السوق أم تفضل حذفه؟
                                    </p>
                                  </div>
                                  <div className="flex gap-2 justify-end pt-1">
                                    <button
                                      type="button"
                                      onClick={() => handleExtendMarketAd(ad.id)}
                                      className="px-2.5 py-1 bg-[#c5a059] hover:bg-amber-500 text-black font-extrabold rounded text-[9px] transition-colors cursor-pointer"
                                    >
                                      تمديد الإعلان
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteMarketAd(ad.id)}
                                      className="px-2.5 py-1 bg-zinc-800 hover:bg-rose-600 text-zinc-300 hover:text-white font-bold rounded text-[9px] transition-colors cursor-pointer"
                                    >
                                      حذف الإعلان
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex justify-between items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleSimulate30Days(ad.id)}
                                    className="px-2 py-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded text-[9px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                                    title="اختبار فوري لتنبيه المساعد بعد مرور 30 يوماً"
                                  >
                                    <Clock className="h-3 w-3" />
                                    ⏳ تسريع الوقت (30 يوماً لغرض الاختبار)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteMarketAd(ad.id)}
                                    className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 font-bold rounded text-[9px] transition-colors cursor-pointer"
                                  >
                                    حذف
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {!isPublishingMarketAd ? (
                    <>
                      {/* Search and Category Filters */}
                      <div className="flex flex-col gap-2 bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-900/60">
                        <div className="relative">
                          <Search className="absolute right-3 top-2 h-3.5 w-3.5 text-zinc-500" />
                          <input 
                            value={marketSearch}
                            onChange={(e) => setMarketSearch(e.target.value)}
                            placeholder="ابحث في الإعلانات..." 
                            className="w-full text-[11px] bg-zinc-900 border border-zinc-850 pr-9 pl-3 py-1.5 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059] transition-all"
                          />
                        </div>

                        {/* Category filter pills */}
                        <div className="flex flex-wrap gap-1 mt-0.5 max-h-[75px] overflow-y-auto pr-0.5">
                          <button
                            type="button"
                            onClick={() => setSelectedCategoryFilter("all")}
                            className={`px-2 py-0.5 text-[9px] font-bold rounded-md border transition-all cursor-pointer ${
                              selectedCategoryFilter === "all"
                                ? "bg-[#c5a059]/10 text-[#c5a059] border-[#c5a059]/30"
                                : "bg-zinc-900 text-zinc-400 border-zinc-850 hover:text-zinc-300"
                            }`}
                          >
                            الكل
                          </button>
                          {["تأشيرات وإقامات", "سيارات ووسائل نقل", "عقارات وأراضي", "تذاكر ورحلات", "جوالات وإلكترونيات", "خدمات عامة وأخرى"].map(cat => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedCategoryFilter(cat)}
                              className={`px-2 py-0.5 text-[9px] font-bold rounded-md border transition-all cursor-pointer ${
                                selectedCategoryFilter === cat
                                  ? "bg-[#c5a059]/10 text-[#c5a059] border-[#c5a059]/30"
                                  : "bg-zinc-900 text-zinc-400 border-zinc-850 hover:text-zinc-300"
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>

                        {/* Sell / Buy Toggle Pills and Date Sort dropdown */}
                        <div className="flex flex-wrap gap-2 items-center justify-between border-t border-zinc-900/80 pt-2 mt-1">
                          <div className="flex gap-1.5">
                            <span className="text-[9px] text-zinc-500 self-center">النوع:</span>
                            {["all", "sell", "buy"].map(type => (
                              <button
                                key={type}
                                type="button"
                                onClick={() => setMarketTypeFilter(type as any)}
                                className={`px-2 py-0.5 text-[9px] font-bold rounded-md transition-all cursor-pointer ${
                                  marketTypeFilter === type
                                    ? "bg-zinc-850 text-[#c5a059] border border-zinc-700/30"
                                    : "text-zinc-500 hover:text-zinc-300"
                                }`}
                              >
                                {type === "all" ? "الكل" : type === "sell" ? "بيع (معروض)" : "شراء (مطلوب)"}
                              </button>
                            ))}
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] text-zinc-500 font-bold flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5 text-[#c5a059]" />
                              تاريخ النشر:
                            </span>
                            <select
                              value={marketDateSort}
                              onChange={(e) => setMarketDateSort(e.target.value as any)}
                              className="text-[9px] bg-zinc-900 border border-zinc-850 px-1.5 py-1 rounded text-zinc-300 focus:outline-hidden focus:border-[#c5a059]"
                            >
                              <option value="newest">الأحدث أولاً 📅</option>
                              <option value="oldest">الأقدم أولاً ⏳</option>
                              <option value="last24h">آخر 24 ساعة ⚡</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Advertisements List */}
                      <div className="flex flex-col gap-3 max-h-[420px] overflow-y-auto pr-1">
                        {sortMarketAdsByDate(marketAds.filter(ad => {
                          const matchesSearch = 
                            ad.title.toLowerCase().includes(marketSearch.toLowerCase()) ||
                            ad.details.toLowerCase().includes(marketSearch.toLowerCase()) ||
                            ad.location.toLowerCase().includes(marketSearch.toLowerCase()) ||
                            ad.name.toLowerCase().includes(marketSearch.toLowerCase());
                          const matchesCat = selectedCategoryFilter === "all" || ad.category === selectedCategoryFilter;
                          const matchesType = marketTypeFilter === "all" || ad.type === marketTypeFilter;
                          return matchesSearch && matchesCat && matchesType;
                        }), marketDateSort).length > 0 ? (
                          sortMarketAdsByDate(marketAds.filter(ad => {
                            const matchesSearch = 
                              ad.title.toLowerCase().includes(marketSearch.toLowerCase()) ||
                              ad.details.toLowerCase().includes(marketSearch.toLowerCase()) ||
                              ad.location.toLowerCase().includes(marketSearch.toLowerCase()) ||
                              ad.name.toLowerCase().includes(marketSearch.toLowerCase());
                            const matchesCat = selectedCategoryFilter === "all" || ad.category === selectedCategoryFilter;
                            const matchesType = marketTypeFilter === "all" || ad.type === marketTypeFilter;
                            return matchesSearch && matchesCat && matchesType;
                          }), marketDateSort).map(ad => (
                            <div 
                              key={ad.id} 
                              className="p-3 bg-[#111115] hover:bg-zinc-900 border border-zinc-850 rounded-xl transition-all flex flex-col gap-2 group"
                            >
                              <div className="flex justify-between items-start gap-1">
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm ${
                                      ad.type === "sell" 
                                        ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                                        : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    }`}>
                                      {ad.type === "sell" ? "بيع" : "شراء"}
                                    </span>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                                      {ad.category}
                                    </span>
                                  </div>
                                  <h4 className="text-xs font-extrabold text-zinc-100 group-hover:text-[#c5a059] transition-colors mt-1 leading-relaxed">
                                    {ad.title}
                                  </h4>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => toggleMarketFavorite(ad.id)}
                                    className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                                    title={favoritedMarketIds.includes(ad.id) ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
                                  >
                                    <Heart 
                                      className={`h-3.5 w-3.5 transition-all ${
                                        favoritedMarketIds.includes(ad.id) 
                                          ? "fill-rose-500 text-rose-500 scale-110" 
                                          : "text-zinc-500 hover:scale-105"
                                      }`} 
                                    />
                                  </button>
                                  <span className="text-[8px] text-zinc-500 font-mono">
                                    {ad.timestamp}
                                  </span>
                                </div>
                              </div>

                              <p className="text-[11px] text-zinc-300 leading-relaxed bg-zinc-950/30 p-2 rounded-lg border border-zinc-850/40">
                                {activeTranslations[ad.id] && translatedTexts[ad.id] ? (
                                  <span className="block">
                                    <span className="text-[9px] font-bold text-amber-400 block mb-1">✨ ترجمة الذكاء الاصطناعي (العربية):</span>
                                    {translatedTexts[ad.id]}
                                  </span>
                                ) : (
                                  ad.details
                                )}
                              </p>

                              {translationErrors[ad.id] && (
                                <div className="text-[9px] text-rose-400 px-2 py-1 bg-rose-500/10 border border-rose-500/20 rounded-md">
                                  ⚠️ {translationErrors[ad.id]}
                                </div>
                              )}

                              {ad.image && (
                                <div className="w-full overflow-hidden rounded-lg border border-zinc-800 bg-black/30 flex items-center justify-center min-h-[120px] max-h-[220px] p-4">
                                  {isDataSavingMode && !loadedImageIds[ad.id] ? (
                                    <div className="flex flex-col items-center justify-center gap-2 text-center py-4 w-full">
                                      <div className="p-3 bg-zinc-900 rounded-full border border-zinc-800 text-[#c5a059] shadow-inner">
                                        <Image className="h-5 w-5 opacity-85" />
                                      </div>
                                      <div>
                                        <p className="text-[10px] text-zinc-400 font-bold">تم إيقاف التحميل التلقائي للصور</p>
                                        <p className="text-[9px] text-zinc-500 mt-0.5">وضع توفير البيانات مفعل لتوفير الاستهلاك</p>
                                      </div>
                                      <button
                                        type="button"
                                        onClick={() => setLoadedImageIds(prev => ({ ...prev, [ad.id]: true }))}
                                        className="mt-1 text-xs font-bold text-black bg-[#c5a059] hover:bg-amber-500 px-4 py-1.5 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                                      >
                                        <Image className="h-3.5 w-3.5" />
                                        تحميل الصورة
                                      </button>
                                    </div>
                                  ) : (
                                    <img 
                                      src={ad.image} 
                                      alt="صورة المنتج أو الخدمة" 
                                      className="max-h-[220px] w-auto object-contain select-none"
                                      referrerPolicy="no-referrer"
                                    />
                                  )}
                                </div>
                              )}

                              <div className="grid grid-cols-2 gap-1.5 text-[10px] text-zinc-400 bg-zinc-900/20 p-2 rounded-lg border border-zinc-850/30">
                                <div className="truncate">📍 الموقع: <span className="font-bold text-zinc-200">{ad.location}</span></div>
                                <div className="truncate flex items-center gap-1 flex-wrap">
                                  <span>👤 المعلن: <span className="font-bold text-zinc-200">{ad.name}</span></span>
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenRatingModal(ad.name, ad.phone);
                                    }}
                                    className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[8px] font-bold cursor-pointer transition-all border border-amber-500/15"
                                    title="انقر لتقييم مصداقية هذا المعلن"
                                  >
                                    <Star className="h-2 w-2 fill-amber-400 stroke-amber-400" />
                                    <span>{getAdvertiserRating(ad.phone).count > 0 ? getAdvertiserRating(ad.phone).average : "قيّم"}</span>
                                  </button>
                                </div>
                                <div className="col-span-2 mt-0.5 border-t border-zinc-800/40 pt-1 flex justify-between items-center">
                                  <span>💰 القيمة المطلوبة:</span>
                                  <span className="font-extrabold text-amber-400 font-mono">{ad.price}</span>
                                </div>
                              </div>

                              {copiedShareId === ad.id && (
                                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] py-1 px-2 rounded-lg text-center font-bold animate-pulse">
                                  ✓ تم نسخ نص وتفاصيل الإعلان بنجاح لمشاركته!
                                </div>
                              )}

                              <div className="flex gap-2 justify-end pt-1 flex-wrap">
                                {/* AI Translation Button */}
                                <button
                                  type="button"
                                  onClick={() => handleTranslate(ad.id, ad.details)}
                                  className={`text-[9px] font-bold px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-all cursor-pointer border ${
                                    activeTranslations[ad.id]
                                      ? "bg-[#c5a059]/20 border-[#c5a059]/50 text-amber-300 hover:bg-[#c5a059]/30"
                                      : "bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700/30 text-zinc-300"
                                  }`}
                                  disabled={translatingIds[ad.id]}
                                >
                                  <Globe className={`h-2.5 w-2.5 ${translatingIds[ad.id] ? "animate-spin text-[#c5a059]" : ""}`} />
                                  {translatingIds[ad.id] 
                                    ? "جاري الترجمة..." 
                                    : activeTranslations[ad.id] 
                                      ? "عرض النص الأصلي" 
                                      : "ترجمة للعربية"}
                                </button>

                                {/* Share Option */}
                                <div className="relative group/share">
                                  <button
                                    type="button"
                                    className="text-[9px] font-bold text-zinc-300 bg-zinc-800/80 hover:bg-zinc-700 px-2.5 py-1.5 rounded-md flex items-center gap-1 transition-all cursor-pointer border border-zinc-700/30"
                                  >
                                    <Share2 className="h-2.5 w-2.5 text-zinc-400" />
                                    مشاركة الإعلان
                                  </button>
                                  <div className="absolute bottom-full left-0 mb-1.5 hidden group-hover/share:flex flex-col bg-zinc-950 border border-zinc-800 rounded-lg p-1.5 shadow-2xl z-50 min-w-[130px]">
                                    <button
                                      type="button"
                                      onClick={() => handleShareAd(getMarketShareText(ad), ad.id, "whatsapp")}
                                      className="text-[9px] text-zinc-300 hover:text-emerald-400 hover:bg-zinc-900 px-2 py-1.5 rounded-md text-right cursor-pointer flex items-center justify-between font-extrabold"
                                    >
                                      <span>واتساب</span>
                                      <span className="text-emerald-500 text-[10px]">🟢</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleShareAd(getMarketShareText(ad), ad.id, "telegram")}
                                      className="text-[9px] text-zinc-300 hover:text-sky-400 hover:bg-zinc-900 px-2 py-1.5 rounded-md text-right cursor-pointer flex items-center justify-between font-extrabold"
                                    >
                                      <span>تليجرام</span>
                                      <span className="text-sky-500 text-[10px]">🔵</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleShareAd(getMarketShareText(ad), ad.id, "copy")}
                                      className="text-[9px] text-[#c5a059] hover:text-amber-300 hover:bg-zinc-900 px-2 py-1.5 rounded-md text-right cursor-pointer flex items-center justify-between font-extrabold border-t border-zinc-900 mt-1 pt-1"
                                    >
                                      <span>نسخ النص جاهزاً</span>
                                      <span>📋</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Inner App Chat Link */}
                                <button
                                  type="button"
                                  onClick={() => handleStartChat(ad.phone, ad.name, ad.id, `منتج: ${ad.title}`)}
                                  className="text-[9px] font-bold bg-amber-500/10 hover:bg-[#c5a059] text-amber-400 hover:text-black border border-amber-500/20 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                                >
                                  <MessageSquare className="h-2.5 w-2.5" />
                                  دردشة فورية 💬
                                </button>

                                <a
                                  href={`https://wa.me/${ad.phone.replace("+", "").replace(/\s+/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[9px] font-extrabold bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/20 px-2 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                                >
                                  <Phone className="h-2.5 w-2.5" />
                                  تواصل بالواتساب
                                </a>

                                <button
                                  type="button"
                                  onClick={() => {
                                    handleSendMessage(`السلام عليكم، أود الاستفسار حول الإعلان المكتوب في قسم ${ad.category} بعنوان "${ad.title}" للمعلن "${ad.name}". هل يمكن تأكيد صحة الصفقة أو التنسيق لإتمام الإجراءات وسداد الرسوم؟`);
                                  }}
                                  className="text-[9px] font-extrabold text-black bg-[#c5a059] hover:bg-[#8e6e3c] px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                                >
                                  <Sparkles className="h-2.5 w-2.5" />
                                  استفسر بالذكاء الاصطناعي
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleOpenInvoiceWizard(ad)}
                                  className="text-[9px] font-extrabold bg-zinc-900 hover:bg-[#c5a059] border border-zinc-800 text-[#c5a059] hover:text-black px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                                  title="توليد فاتورة أولية (Pro-forma Invoice) بصيغة PDF لهذه السلعة"
                                  id={`gen_invoice_btn_${ad.id}`}
                                >
                                  <FileText className="h-2.5 w-2.5 text-[#c5a059] group-hover:text-black" />
                                  فاتورة أولية
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-10 text-xs text-zinc-500 flex flex-col items-center justify-center gap-1.5">
                            <ShoppingBag className="h-6 w-6 text-zinc-700 animate-pulse" />
                            <span>لا توجد إعلانات مطابقة حالياً لخيارات البحث المحددة.</span>
                            <button
                              type="button"
                              onClick={() => setIsPublishingMarketAd(true)}
                              className="text-[#c5a059] hover:underline font-extrabold text-[10px] cursor-pointer"
                            >
                              انقر هنا لتكون أول من ينشر إعلانه!
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <form 
                      onSubmit={handlePublishMarketAdSubmit}
                      className="p-4 bg-zinc-900 rounded-xl border border-zinc-800 flex flex-col gap-3"
                    >
                      <h4 className="text-xs font-bold text-[#c5a059] flex items-center gap-1">
                        <PlusCircle className="h-3 w-3" />
                        نشر إعلان بيع أو شراء جديد
                      </h4>

                      {marketPublishSuccess ? (
                        <div className="bg-emerald-950/40 border border-emerald-900/50 p-3 rounded-xl text-center flex flex-col items-center justify-center gap-1 text-emerald-300 text-xs">
                          <CheckCircle className="h-5 w-5 text-emerald-400 animate-bounce" />
                          <p className="font-bold">تم نشر إعلانك في السوق بنجاح!</p>
                          <p className="text-[10px] text-zinc-400">سيشاهد جميع زوار الموقع وأبو مجد إعلانك فوراً.</p>
                        </div>
                      ) : (
                        <>
                          {marketPublishError && (
                            <div className="bg-rose-950/40 border border-rose-900/50 p-2 rounded-lg text-rose-300 text-[10px]">
                              {marketPublishError}
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] text-zinc-400 font-bold mb-1">نوع الإعلان *</label>
                              <select
                                value={newMarketAdForm.type}
                                onChange={(e) => setNewMarketAdForm({ ...newMarketAdForm, type: e.target.value as any })}
                                className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2 py-1.5 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059]"
                              >
                                <option value="sell">بيع (معروض)</option>
                                <option value="buy">شراء (مطلوب)</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[9px] text-zinc-400 font-bold mb-1">القسم / التصنيف *</label>
                              <select
                                value={newMarketAdForm.category}
                                onChange={(e) => setNewMarketAdForm({ ...newMarketAdForm, category: e.target.value })}
                                className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2 py-1.5 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059]"
                              >
                                {["تأشيرات وإقامات", "سيارات ووسائل نقل", "عقارات وأراضي", "تذاكر ورحلات", "جوالات وإلكترونيات", "خدمات عامة وأخرى"].map(cat => (
                                  <option key={cat} value={cat}>{cat}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[9px] text-zinc-400 font-bold mb-1">عنوان الإعلان (السلعة أو الخدمة) *</label>
                            <input
                              type="text"
                              required
                              value={newMarketAdForm.title}
                              onChange={(e) => setNewMarketAdForm({ ...newMarketAdForm, title: e.target.value })}
                              placeholder="مثال: هايلوكس 2022 نظيف مجمرك، أو تأشيرة سائق جاهزة"
                              className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2.5 py-1.5 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059]"
                            />
                          </div>

                          <div>
                            <label className="block text-[9px] text-zinc-400 font-bold mb-1">تفاصيل الإعلان والمواصفات والشروط *</label>
                            <textarea
                              required
                              rows={3}
                              value={newMarketAdForm.details}
                              onChange={(e) => setNewMarketAdForm({ ...newMarketAdForm, details: e.target.value })}
                              placeholder="أدخل كامل التفاصيل هنا وطريقة التفاهم والشرط والضمان..."
                              className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2.5 py-1.5 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059] resize-none"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] text-zinc-400 font-bold mb-1">السعر / القيمة المطلوبة *</label>
                              <input
                                type="text"
                                required
                                value={newMarketAdForm.price}
                                onChange={(e) => setNewMarketAdForm({ ...newMarketAdForm, price: e.target.value })}
                                placeholder="مثال: 5000 ريال سعودي أو للتفاوض"
                                className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2.5 py-1.5 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059]"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] text-zinc-400 font-bold mb-1">الموقع / المدينة *</label>
                              <input
                                type="text"
                                required
                                value={newMarketAdForm.location}
                                onChange={(e) => setNewMarketAdForm({ ...newMarketAdForm, location: e.target.value })}
                                placeholder="مثال: صنعاء، الرياض، عدن"
                                className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2.5 py-1.5 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[9px] text-zinc-400 font-bold mb-1">اسم المعلن الثنائي *</label>
                              <input
                                type="text"
                                required
                                value={newMarketAdForm.name}
                                onChange={(e) => setNewMarketAdForm({ ...newMarketAdForm, name: e.target.value })}
                                placeholder="مثال: أحمد الحاشدي"
                                className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2.5 py-1.5 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059]"
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] text-zinc-400 font-bold mb-1">رقم الجوال للتواصل *</label>
                              <input
                                type="text"
                                required
                                value={newMarketAdForm.phone}
                                onChange={(e) => setNewMarketAdForm({ ...newMarketAdForm, phone: e.target.value })}
                                placeholder="مثال: +967775012242"
                                className="w-full text-xs bg-[#0c0c0e] border border-zinc-800 px-2.5 py-1.5 rounded-lg text-zinc-200 focus:outline-hidden focus:border-[#c5a059]"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[9px] text-zinc-400 font-bold mb-1">إضافة صورة للمنتج أو الخدمة (اختياري)</label>
                            <div className="border border-dashed border-zinc-800 rounded-lg p-2 bg-[#0c0c0e] flex flex-col items-center justify-center gap-1.5 transition-all hover:border-[#c5a059]/40 relative min-h-[60px]">
                              {newMarketAdForm.image ? (
                                <div className="relative w-full flex items-center justify-between bg-zinc-900/60 p-1.5 rounded-md border border-zinc-800">
                                  <div className="flex items-center gap-2">
                                    <img src={newMarketAdForm.image} alt="معاينة" className="h-10 w-10 object-cover rounded-md border border-zinc-700" referrerPolicy="no-referrer" />
                                    <span className="text-[10px] text-zinc-300 font-medium">صورة مضافة بنجاح</span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setNewMarketAdForm(prev => ({ ...prev, image: "" }))}
                                    className="p-1 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-black rounded-md transition-all cursor-pointer"
                                    title="حذف الصورة"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <label className="w-full flex flex-col items-center justify-center py-2 cursor-pointer">
                                  <div className="flex items-center gap-1.5 text-zinc-400 hover:text-[#c5a059] transition-colors">
                                    <Camera className="h-4 w-4" />
                                    <span className="text-[10px] font-bold">اضغط هنا لإرفاق صورة</span>
                                  </div>
                                  <span className="text-[8px] text-zinc-500 mt-0.5">صيغ: PNG, JPG, WebP (أقل من 2MB)</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handleFileChange(e, "market")}
                                    className="hidden"
                                  />
                                </label>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2 mt-1">
                            <button
                              type="button"
                              onClick={() => setIsPublishingMarketAd(false)}
                              className="flex-1 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-xs font-bold transition-all cursor-pointer"
                            >
                              إلغاء التراجع
                            </button>
                            <button
                              type="submit"
                              className="flex-1 py-2 rounded-lg bg-gradient-to-r from-[#c5a059] to-[#8e6e3c] text-black text-xs font-bold hover:scale-102 transition-all cursor-pointer"
                            >
                              انشر الإعلان الآن
                            </button>
                          </div>
                        </>
                      )}
                    </form>
                  )}
                </motion.div>
              )}

              {/* TAB 5: FAVORITES */}
              {activeSidebarTab === "favorites" && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="text-sm font-extrabold text-[#c5a059] flex items-center gap-1.5">
                      <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />
                      الإعلانات المفضلة المحفوظة
                    </h3>
                    <p className="text-[11px] text-zinc-400 leading-relaxed">
                      هنا تجد جميع الإعلانات والفرص التي قمت بحفظها للرجوع إليها لاحقاً وتسهيل التواصل أو المتابعة:
                    </p>
                  </div>

                  {/* Nested Tab switcher for favorites if both exist, or unified view */}
                  {favoritedJobIds.length === 0 && favoritedMarketIds.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 bg-zinc-950/40 rounded-2xl border border-zinc-850 border-dashed text-center gap-2">
                      <Heart className="h-10 w-10 text-zinc-700 animate-pulse" />
                      <span className="text-xs font-bold text-zinc-400">قائمة المفضلة فارغة حالياً</span>
                      <p className="text-[10px] text-zinc-500 max-w-[200px]">
                        تصفح أقسام التوظيف وسوق بيع وشراء الخدمات، واضغط على أيقونة القلب 🤍 في أي إعلان لحفظه والرجوع إليه لاحقاً.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {/* Section 1: Favorited Job Ads */}
                      {jobAds.filter(ad => favoritedJobIds.includes(ad.id)).length > 0 && (
                        <div className="flex flex-col gap-2.5">
                          <h4 className="text-[11px] font-extrabold text-[#c5a059] flex items-center gap-1 bg-zinc-900/40 p-1.5 rounded-lg border border-zinc-850/50">
                            <Briefcase className="h-3 w-3 text-[#c5a059]" />
                            وظائف وعمالة ({jobAds.filter(ad => favoritedJobIds.includes(ad.id)).length})
                          </h4>
                          
                          <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-1">
                            {jobAds
                              .filter(ad => favoritedJobIds.includes(ad.id))
                              .map((ad) => (
                                <div 
                                  key={ad.id} 
                                  className="p-3 bg-[#111115] hover:bg-zinc-900 border border-zinc-850 rounded-xl transition-all flex flex-col gap-2 group"
                                >
                                  <div className="flex justify-between items-start gap-1">
                                    <div>
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <h4 className="text-xs font-extrabold text-[#c5a059] group-hover:text-amber-300 transition-colors">
                                          {ad.name}
                                        </h4>
                                        <button
                                          type="button"
                                          onClick={() => handleOpenRatingModal(ad.name, ad.phone)}
                                          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-[8px] font-bold cursor-pointer transition-all"
                                          title="انقر لتقييم مصداقية هذا المعلن"
                                        >
                                          <Star className="h-2.5 w-2.5 fill-amber-400 stroke-amber-400" />
                                          <span>{getAdvertiserRating(ad.phone).count > 0 ? getAdvertiserRating(ad.phone).average : "جديد (قيّم)"}</span>
                                          {getAdvertiserRating(ad.phone).count > 0 && <span className="text-zinc-500 text-[7px]">({getAdvertiserRating(ad.phone).count})</span>}
                                        </button>
                                      </div>
                                      <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300 border border-zinc-700">
                                        {ad.specialty}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => toggleJobFavorite(ad.id)}
                                        className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                                        title="إزالة من المفضلة"
                                      >
                                        <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
                                      </button>
                                      <span className="text-[8px] text-zinc-500 font-medium whitespace-nowrap">
                                        {ad.timestamp}
                                      </span>
                                    </div>
                                  </div>

                                  <p className="text-[11px] text-zinc-300 leading-relaxed font-normal bg-zinc-950/20 p-2 rounded-lg border border-zinc-850/60">
                                    {activeTranslations[ad.id] && translatedTexts[ad.id] ? (
                                      <span className="block">
                                        <span className="text-[9px] font-bold text-amber-400 block mb-1">✨ ترجمة الذكاء الاصطناعي (العربية):</span>
                                        {translatedTexts[ad.id]}
                                      </span>
                                    ) : (
                                      ad.details
                                    )}
                                  </p>

                                  {translationErrors[ad.id] && (
                                    <div className="text-[9px] text-rose-400 px-2 py-1 bg-rose-500/10 border border-rose-500/20 rounded-md">
                                      ⚠️ {translationErrors[ad.id]}
                                    </div>
                                  )}

                                  <div className="grid grid-cols-2 gap-2 text-[10px] text-zinc-400 bg-zinc-900/30 p-1.5 rounded-lg border border-zinc-850/40">
                                    <div>📍 الموقع: <span className="font-bold text-zinc-200">{ad.country}</span></div>
                                    <div>💼 الخبرة: <span className="font-bold text-zinc-200">{ad.experience || "غير محدد"}</span></div>
                                    <div className="col-span-2 mt-0.5 border-t border-zinc-850/30 pt-0.5">💰 الراتب: <span className="font-bold text-emerald-400">{ad.salary || "غير محدد"}</span></div>
                                  </div>

                                  <div className="flex gap-1.5 justify-end pt-1 flex-wrap">
                                    {/* AI Translation Button */}
                                    <button
                                      type="button"
                                      onClick={() => handleTranslate(ad.id, ad.details)}
                                      className={`text-[8px] font-bold px-2 py-1 rounded-md flex items-center gap-1 transition-all cursor-pointer border ${
                                        activeTranslations[ad.id]
                                          ? "bg-[#c5a059]/20 border-[#c5a059]/50 text-amber-300 hover:bg-[#c5a059]/30"
                                          : "bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700/30 text-zinc-300"
                                      }`}
                                      disabled={translatingIds[ad.id]}
                                    >
                                      <Globe className={`h-2 w-2 ${translatingIds[ad.id] ? "animate-spin text-[#c5a059]" : ""}`} />
                                      {translatingIds[ad.id] 
                                        ? "جاري..." 
                                        : activeTranslations[ad.id] 
                                          ? "النص الأصلي" 
                                          : "ترجمة"}
                                    </button>

                                    <a
                                      href={`https://wa.me/${ad.phone.replace("+", "").replace(/\s+/g, '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[8px] font-bold bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/20 px-2 py-1 rounded-md flex items-center gap-1 transition-all"
                                    >
                                      <Phone className="h-2.5 w-2.5" />
                                      تواصل
                                    </a>
                                    <button
                                      onClick={() => {
                                        handleSendMessage(`أريد الاستفسار بالذكاء الاصطناعي عن إعلان المفضلة "${ad.name}" المتخصص في "${ad.specialty}" من موقع "${ad.country}". هل يمكن لأبو مجد مساعدتي؟`);
                                      }}
                                      className="text-[8px] font-extrabold bg-[#c5a059]/10 hover:bg-[#c5a059] text-[#c5a059] hover:text-black border border-[#c5a059]/20 px-2 py-1 rounded-md flex items-center gap-1 transition-all cursor-pointer"
                                    >
                                      <Sparkles className="h-2.5 w-2.5" />
                                      استفسر بالذكاء الاصطناعي
                                    </button>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Section 2: Favorited Market Ads */}
                      {marketAds.filter(ad => favoritedMarketIds.includes(ad.id)).length > 0 && (
                        <div className="flex flex-col gap-2.5">
                          <h4 className="text-[11px] font-extrabold text-[#c5a059] flex items-center gap-1 bg-zinc-900/40 p-1.5 rounded-lg border border-zinc-850/50">
                            <ShoppingBag className="h-3 w-3 text-[#c5a059]" />
                            بيع وشراء ({marketAds.filter(ad => favoritedMarketIds.includes(ad.id)).length})
                          </h4>
                          
                          <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-1">
                            {marketAds
                              .filter(ad => favoritedMarketIds.includes(ad.id))
                              .map((ad) => (
                                <div 
                                  key={ad.id} 
                                  className="p-3 bg-[#111115] hover:bg-zinc-900 border border-zinc-850 rounded-xl transition-all flex flex-col gap-2 group"
                                >
                                  <div className="flex justify-between items-start gap-1">
                                    <div className="flex flex-col gap-1">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm ${
                                          ad.type === "sell" 
                                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" 
                                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        }`}>
                                          {ad.type === "sell" ? "بيع" : "شراء"}
                                        </span>
                                        <span className="text-[8px] px-1 py-0.5 rounded bg-zinc-800 text-zinc-400">
                                          {ad.category}
                                        </span>
                                      </div>
                                      <h4 className="text-xs font-extrabold text-zinc-100 group-hover:text-[#c5a059] transition-colors mt-1 leading-relaxed">
                                        {ad.title}
                                      </h4>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => toggleMarketFavorite(ad.id)}
                                        className="p-1 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-rose-500 transition-colors cursor-pointer"
                                        title="إزالة من المفضلة"
                                      >
                                        <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
                                      </button>
                                      <span className="text-[8px] text-zinc-500 font-mono whitespace-nowrap">
                                        {ad.timestamp}
                                      </span>
                                    </div>
                                  </div>

                                  <p className="text-[11px] text-zinc-300 leading-relaxed bg-zinc-950/30 p-2 rounded-lg border border-zinc-850/40">
                                    {activeTranslations[ad.id] && translatedTexts[ad.id] ? (
                                      <span className="block">
                                        <span className="text-[9px] font-bold text-amber-400 block mb-1">✨ ترجمة الذكاء الاصطناعي (العربية):</span>
                                        {translatedTexts[ad.id]}
                                      </span>
                                    ) : (
                                      ad.details
                                    )}
                                  </p>

                                  {translationErrors[ad.id] && (
                                    <div className="text-[9px] text-rose-400 px-2 py-1 bg-rose-500/10 border border-rose-500/20 rounded-md">
                                      ⚠️ {translationErrors[ad.id]}
                                    </div>
                                  )}

                                  <div className="grid grid-cols-2 gap-1.5 text-[10px] text-zinc-400 bg-zinc-900/20 p-2 rounded-lg border border-zinc-850/30">
                                    <div className="truncate">📍 الموقع: <span className="font-bold text-zinc-200">{ad.location}</span></div>
                                    <div className="truncate flex items-center gap-1 flex-wrap">
                                      <span>👤 المعلن: <span className="font-bold text-zinc-200">{ad.name}</span></span>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenRatingModal(ad.name, ad.phone);
                                        }}
                                        className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[8px] font-bold cursor-pointer transition-all border border-amber-500/15"
                                        title="انقر لتقييم مصداقية هذا المعلن"
                                      >
                                        <Star className="h-2 w-2 fill-amber-400 stroke-amber-400" />
                                        <span>{getAdvertiserRating(ad.phone).count > 0 ? getAdvertiserRating(ad.phone).average : "قيّم"}</span>
                                      </button>
                                    </div>
                                    <div className="col-span-2 mt-0.5 border-t border-zinc-800/40 pt-1 flex justify-between items-center">
                                      <span>💰 القيمة:</span>
                                      <span className="font-extrabold text-amber-400 font-mono">{ad.price}</span>
                                    </div>
                                  </div>

                                  <div className="flex gap-1.5 justify-end pt-1 flex-wrap">
                                    {/* AI Translation Button */}
                                    <button
                                      type="button"
                                      onClick={() => handleTranslate(ad.id, ad.details)}
                                      className={`text-[8px] font-bold px-2 py-1 rounded-md flex items-center gap-1 transition-all cursor-pointer border ${
                                        activeTranslations[ad.id]
                                          ? "bg-[#c5a059]/20 border-[#c5a059]/50 text-amber-300 hover:bg-[#c5a059]/30"
                                          : "bg-zinc-800/80 hover:bg-zinc-700 border-zinc-700/30 text-zinc-300"
                                      }`}
                                      disabled={translatingIds[ad.id]}
                                    >
                                      <Globe className={`h-2 w-2 ${translatingIds[ad.id] ? "animate-spin text-[#c5a059]" : ""}`} />
                                      {translatingIds[ad.id] 
                                        ? "جاري..." 
                                        : activeTranslations[ad.id] 
                                          ? "النص الأصلي" 
                                          : "ترجمة"}
                                    </button>

                                    <a
                                      href={`https://wa.me/${ad.phone.replace("+", "").replace(/\s+/g, '')}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[8px] font-bold bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black border border-emerald-500/20 px-2 py-1 rounded-md flex items-center gap-1 transition-all"
                                    >
                                      <Phone className="h-2.5 w-2.5" />
                                      تواصل
                                    </a>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 6: USER-TO-USER CHATS */}
              {activeSidebarTab === "chats" && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="flex flex-col h-[520px] bg-[#0c0c0f] rounded-2xl border border-zinc-800/80 overflow-hidden shadow-2xl"
                  id="user_to_user_chats"
                  style={{ direction: "rtl" }}
                >
                  {/* Top Profile / Settings Bar */}
                  <div className="p-3 bg-[#111116] border-b border-zinc-850 flex flex-col gap-2 text-right">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-zinc-400">👤 هويتك الافتراضية للتجربة والدردشة:</span>
                      <span className="text-[9px] text-amber-500 font-bold">تعديل فوري 🛠️</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] text-zinc-500">اسمك كمرسل:</label>
                        <input
                          type="text"
                          value={myName}
                          onChange={(e) => setMyName(e.target.value)}
                          className="px-2.5 py-1 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-[#c5a059] font-bold"
                          placeholder="مثال: أحمد اليمني"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[8px] text-zinc-500">رقم هاتفك للاختبار:</label>
                        <input
                          type="text"
                          value={myPhone}
                          onChange={(e) => setMyPhone(e.target.value)}
                          className="px-2.5 py-1 text-xs bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-200 focus:outline-none focus:border-[#c5a059] font-mono font-bold"
                          placeholder="+967770001111"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex overflow-hidden">
                    {/* Chat Thread Panel */}
                    <div className="w-1/3 border-l border-zinc-850 bg-[#09090b]/80 flex flex-col overflow-y-auto">
                      <div className="p-2.5 border-b border-zinc-850 bg-zinc-900/30 text-center">
                        <span className="text-[10px] font-black text-[#c5a059]">المحادثات المفتوحة</span>
                      </div>

                      {/* List of chat partners */}
                      {(() => {
                        const partnersMap = new Map<string, { phone: string; name: string; lastMsg: any }>();
                        chatMessages.forEach(msg => {
                          const partnerPhone = msg.senderPhone === myPhone ? msg.receiverPhone : msg.senderPhone;
                          const partnerName = msg.senderPhone === myPhone ? msg.receiverName : msg.senderName;
                          partnersMap.set(partnerPhone, { phone: partnerPhone, name: partnerName, lastMsg: msg });
                        });
                        const partners = Array.from(partnersMap.values()).sort((a, b) => 
                          new Date(b.lastMsg.timestamp).getTime() - new Date(a.lastMsg.timestamp).getTime()
                        );

                        if (partners.length === 0) {
                          return (
                            <div className="flex flex-col items-center justify-center p-6 text-center gap-2 mt-4">
                              <MessageSquare className="h-8 w-8 text-zinc-800 animate-pulse" />
                              <span className="text-[10px] font-bold text-zinc-500">لا توجد محادثات نشطة</span>
                              <p className="text-[8px] text-zinc-600 max-w-[140px] leading-relaxed">
                                تصفح أقسام الوظائف أو المعروضات لبدء دردشة مع معلنيها!
                              </p>
                            </div>
                          );
                        }

                        return partners.map((p) => {
                          const isActive = activeChatPartner?.phone === p.phone;
                          const rating = getAdvertiserRating(p.phone);
                          const unreadCount = chatMessages.filter(msg => msg.senderPhone === p.phone && msg.receiverPhone === myPhone && !msg.isRead).length;
                          const isBlockedByMe = blockedList.some(b => b.blockerPhone === myPhone && b.blockedPhone === p.phone);
                          const isBlockedByThem = blockedList.some(b => b.blockerPhone === p.phone && b.blockedPhone === myPhone);
                          return (
                            <button
                              key={p.phone}
                              type="button"
                              onClick={() => setActiveChatPartner({ phone: p.phone, name: p.name, adId: p.lastMsg.adId, adTitle: p.lastMsg.adTitle })}
                              className={`w-full p-2.5 border-b border-zinc-900/60 flex flex-col gap-1 text-right transition-all cursor-pointer ${
                                isActive ? "bg-[#c5a059]/10 border-r-2 border-r-amber-500" : "hover:bg-zinc-900/40"
                              }`}
                            >
                              <div className="flex justify-between items-center w-full gap-1">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="text-[11px] font-bold text-zinc-200 truncate">{p.name}</span>
                                  {isBlockedByMe && (
                                    <span className="text-[7px] bg-red-950 text-red-400 border border-red-900/40 px-1 py-0.5 rounded font-bold">محظور 🚫</span>
                                  )}
                                  {isBlockedByThem && !isBlockedByMe && (
                                    <span className="text-[7px] bg-zinc-850 text-zinc-400 px-1 py-0.5 rounded font-bold">حظرك 🔒</span>
                                  )}
                                  {unreadCount > 0 && !isBlockedByMe && (
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" title="رسائل غير مقروءة" />
                                  )}
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                  {unreadCount > 0 && (
                                    <span className="text-[8px] bg-amber-500/20 text-amber-400 font-bold px-1.5 py-0.5 rounded-full scale-90">
                                      {unreadCount} جديد
                                    </span>
                                  )}
                                  {rating.count > 0 && (
                                    <span className="text-[8px] text-amber-400 font-bold flex items-center gap-0.5 bg-amber-500/5 px-1 py-0.5 rounded">
                                      ⭐ {rating.average}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <span className="text-[9px] text-zinc-500 truncate w-full text-right">{p.lastMsg.text}</span>
                              <span className="text-[7px] text-zinc-600 font-mono self-start" style={{ direction: "ltr" }}>
                                {new Date(p.lastMsg.timestamp).toLocaleTimeString("ar-YE", { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </button>
                          );
                        });
                      })()}
                    </div>

                    {/* Active Conversation Log Panel */}
                    {activeChatPartner ? (
                      <div className="flex-1 flex flex-col bg-[#08080a] overflow-hidden">
                        {/* Partner Header */}
                        <div className="p-3 bg-[#111116] border-b border-zinc-850 flex justify-between items-center gap-2">
                          <div>
                            <div className="flex items-center gap-1.5 justify-start">
                              <span className="text-xs font-bold text-zinc-100">{activeChatPartner.name}</span>
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                            <span className="text-[8px] text-zinc-500 font-mono block mt-0.5" style={{ direction: "ltr" }}>{activeChatPartner.phone}</span>
                          </div>

                          <div className="flex gap-1.5 items-center">
                            {/* Block / Unblock Button */}
                            <button
                              type="button"
                              onClick={() => handleToggleBlockPartner(activeChatPartner.phone)}
                              className={`px-2 py-0.5 rounded text-[8px] font-bold cursor-pointer transition-all flex items-center gap-1 ${
                                blockedList.some(b => b.blockerPhone === myPhone && b.blockedPhone === activeChatPartner.phone)
                                  ? "bg-red-500/20 hover:bg-red-500/35 text-red-400 border border-red-500/30"
                                  : "bg-zinc-800 hover:bg-red-500/20 hover:text-red-400 border border-zinc-700 text-zinc-300"
                              }`}
                              title={blockedList.some(b => b.blockerPhone === myPhone && b.blockedPhone === activeChatPartner.phone) ? "إلغاء حظر هذا المستخدم" : "حظر هذا المستخدم"}
                            >
                              <Ban className="h-2.5 w-2.5" />
                              <span>
                                {blockedList.some(b => b.blockerPhone === myPhone && b.blockedPhone === activeChatPartner.phone)
                                  ? "إلغاء الحظر"
                                  : "حظر"}
                              </span>
                            </button>

                            {/* Fast Rating access */}
                            <button
                              type="button"
                              onClick={() => handleOpenRatingModal(activeChatPartner.name, activeChatPartner.phone)}
                              className="px-1.5 py-0.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[8px] font-bold cursor-pointer transition-all flex items-center gap-0.5"
                              title="تقييم مصداقية هذا المعلن"
                            >
                              <Star className="h-2.5 w-2.5 fill-amber-400 stroke-amber-400" />
                              <span>تقييم</span>
                            </button>
                            
                            <a
                              href={`https://wa.me/${activeChatPartner.phone.replace("+", "").replace(/\s+/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-0.5 text-[8px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 rounded hover:bg-emerald-500/30 transition-all shrink-0"
                            >
                              واتساب 📞
                            </a>
                          </div>
                        </div>

                        {/* Subject Ad Banner */}
                        {activeChatPartner.adTitle && (
                          <div className="px-3 py-1.5 bg-[#c5a059]/5 border-b border-zinc-850 text-[9px] text-amber-300/90 truncate flex items-center gap-1 justify-start">
                            <span>📦 بخصوص إعلان:</span>
                            <span className="font-bold underline text-amber-400">{activeChatPartner.adTitle}</span>
                          </div>
                        )}

                        {/* Message Stream */}
                        <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2.5 bg-zinc-950/45 font-sans">
                          {chatMessages
                            .filter(msg => 
                              (msg.senderPhone === myPhone && msg.receiverPhone === activeChatPartner.phone) ||
                              (msg.senderPhone === activeChatPartner.phone && msg.receiverPhone === myPhone)
                            )
                            .map((msg, index) => {
                              const isMe = msg.senderPhone === myPhone;
                              return (
                                <div
                                  key={msg.id || index}
                                  className={`flex flex-col max-w-[85%] ${isMe ? "self-start items-start" : "self-end items-end"}`}
                                >
                                  <div
                                    className={`p-2.5 rounded-2xl text-[11px] leading-relaxed break-words shadow-md text-right ${
                                      isMe 
                                        ? "bg-gradient-to-br from-[#c5a059] to-amber-600 text-black rounded-tl-none font-bold" 
                                        : "bg-zinc-900 text-zinc-100 rounded-tr-none border border-zinc-800"
                                    }`}
                                  >
                                    {msg.text}
                                  </div>
                                  <span className="text-[7px] text-zinc-500 font-mono mt-1 px-1 flex items-center gap-1.5">
                                    <span>{new Date(msg.timestamp).toLocaleTimeString("ar-YE", { hour: '2-digit', minute: '2-digit' })}</span>
                                    {msg.isAutoReply && <span className="text-amber-500 font-bold">(رد ذكي تلقائي ✨)</span>}
                                    {isMe && (
                                      <span className="flex items-center gap-0.5 shrink-0">
                                        {msg.isRead ? (
                                          <span className="text-amber-400 font-bold flex items-center gap-0.5" title="تمت القراءة">
                                            <span className="text-[8px]">تم القراءة</span>
                                            <CheckCheck className="h-3 w-3 text-amber-400 stroke-[2.5]" />
                                          </span>
                                        ) : (
                                          <span className="text-zinc-600 flex items-center gap-0.5" title="تم الإرسال">
                                            <span className="text-[8px]">تم الإرسال</span>
                                            <Check className="h-3 w-3 text-zinc-600 stroke-[2]" />
                                          </span>
                                        )}
                                      </span>
                                    )}
                                  </span>
                                </div>
                              );
                            })}
                        </div>

                        {/* Message Send Box */}
                        {(() => {
                          const isBlockedByMe = blockedList.some(b => b.blockerPhone === myPhone && b.blockedPhone === activeChatPartner.phone);
                          const isBlockedByThem = blockedList.some(b => b.blockerPhone === activeChatPartner.phone && b.blockedPhone === myPhone);
                          const isBlockedRelation = isBlockedByMe || isBlockedByThem;

                          if (isBlockedRelation) {
                            return (
                              <div className="p-3.5 border-t border-zinc-850 bg-red-950/15 flex flex-col gap-1 items-center text-center justify-center">
                                <div className="flex items-center gap-1.5 text-red-400 font-bold text-[11px]">
                                  <Ban className="h-3.5 w-3.5" />
                                  <span>
                                    {isBlockedByMe 
                                      ? "لقد قمت بحظر هذا المستخدم 🚫" 
                                      : "لا يمكنك المراسلة، تم حظر الاتصال 🔒"}
                                  </span>
                                </div>
                                <p className="text-[9px] text-zinc-500 max-w-[280px] leading-relaxed">
                                  {isBlockedByMe 
                                    ? "قم بإلغاء الحظر من زر التحكم بالأعلى لتتمكن من معاودة المراسلة والتواصل معه."
                                    : "لا يمكن إرسال رسائل أو استقبالها من هذا المستخدم حالياً بسبب قيود الحظر."}
                                </p>
                              </div>
                            );
                          }

                          return (
                            <div className="p-2 border-t border-zinc-850 bg-zinc-900/35 flex gap-1.5 items-center">
                              <input
                                type="text"
                                value={u2uInputMessage}
                                onChange={(e) => setU2uInputMessage(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSendU2UMessage()}
                                placeholder="اكتب رسالتك للمعلن هنا..."
                                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-[#c5a059] text-right"
                              />
                              <button
                                type="button"
                                onClick={handleSendU2UMessage}
                                disabled={isSendingU2UMessage}
                                className="p-2 rounded-xl bg-[#c5a059] hover:bg-amber-500 text-black cursor-pointer transition-all shrink-0 flex items-center justify-center disabled:opacity-50"
                              >
                                <Send className="h-3.5 w-3.5 transform rotate-180" />
                              </button>
                            </div>
                          );
                        })()}
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-3 bg-zinc-950/20">
                        <div className="h-14 w-14 rounded-full bg-amber-500/5 border border-amber-500/10 flex items-center justify-center text-amber-400">
                          <MessageSquare className="h-6 w-6" />
                        </div>
                        <h4 className="text-xs font-black text-zinc-200">الدردشة المباشرة والاتفاق داخل التطبيق</h4>
                        <p className="text-[10px] text-zinc-400 max-w-[220px] leading-relaxed">
                          تم تفعيل نظام التراسل من مستخدم إلى مستخدم لتسهيل التواصل والاتفاق السريع مع المعلنين.
                        </p>
                        <div className="p-3 bg-[#111116]/80 rounded-xl border border-zinc-850 max-w-[280px] text-right" style={{ direction: "rtl" }}>
                          <span className="text-[9px] font-black text-amber-500 block mb-1">💡 كيف تبدأ المحادثة؟</span>
                          <span className="text-[8px] text-zinc-500 leading-normal block">
                            اذهب لقسم <span className="text-zinc-300">"التوظيف"</span> أو <span className="text-zinc-300">"بيع وشراء"</span>، ثم انقر على زر <span className="text-amber-400 font-bold">"مراسلة فورية 💬"</span> في بطاقة الإعلان للتواصل الفوري!
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

            </div>
          </div>

          {/* Collapsible Core Services Panel (rendered outside to complement) */}
          <div className="bg-[#0f0f12] rounded-2xl shadow-xl border border-zinc-800 overflow-hidden">
            <div className="border-b border-zinc-800 p-4 text-zinc-100 font-bold text-md flex items-center gap-2 bg-[#0f0f12]">
              <Compass className="h-4 w-4 text-[#c5a059]" />
              <h3 className="text-[#fefefe]">الخدمات والحلول المتاحة</h3>
            </div>
            <div className="p-5 flex flex-col gap-3">
              {office.services.map((service, idx) => (
                <div key={idx} className="flex gap-2.5 items-start p-2 hover:bg-zinc-900/40 rounded-lg transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#c5a059] mt-2 shrink-0"></div>
                  <span className="text-xs sm:text-sm text-zinc-300 font-medium leading-relaxed">{service}</span>
                </div>
              ))}
              
              <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 mt-2">
                <div className="flex gap-2">
                  <Clock className="h-4 w-4 text-[#c5a059] mt-0.5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-zinc-200">ساعات تقديم الخدمة</h4>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      نستقبل معاملاتكم واستفساراتكم على مدار الساعة طوال أيام الأسبوع لضمان راحتكم التامة وسرعة إنهاء الإجراءات.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Right column (Intelligent Chat Assistant) */}
        <section className="lg:col-span-2 flex flex-col bg-[#0f0f12] rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden h-[600px] sm:h-[680px]" id="chat_section">
          {/* Chat Header */}
          <div className="bg-[#0f0f12] text-[#fefefe] p-4 flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#c5a059]/40 bg-[#0c0c0e] flex items-center justify-center shadow-md shrink-0">
                  <img 
                    src={appLogo} 
                    alt={t("مساعد أبو مجد الذكي", "Abu Majd Smart Assistant")} 
                    className="w-full h-full object-cover animate-pulse"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-0.5 -left-0.5 bg-emerald-500 h-2.5 w-2.5 rounded-full border border-zinc-950"></div>
              </div>
              <div>
                <h2 className="font-bold text-sm sm:text-base text-[#fefefe]">{t("مساعد أبو مجد الذكي", "Abu Majd Smart Assistant")}</h2>
                <p className="text-[10px] text-zinc-500">{t("يجيبك فورياً بدعم من تقنية ذكاء Gemini 3.5 الاصطناعية", "Answers instantly, powered by Gemini 3.5 AI technology")}</p>
              </div>
            </div>

            <button 
              onClick={() => {
                if (confirm(t("هل تريد إعادة ضبط المحادثة ومسح السجل؟", "Do you want to reset the conversation and clear history?"))) {
                  setMessages([
                    {
                      id: "welcome",
                      role: "model",
                      text: "مرحباً بك في **أبو مجد الحداد للسفريات والخدمات السياحية**! ✈️\n\nأنا مساعدك الذكي هنا للإجابة على جميع استفساراتك حول:\n- **تأشيرات السفر والمعاملات**\n- **حجوزات الطيران وأفضل الأسعار**\n- **الرحلات السياحية**\n\nكيف يمكنني مساعدتك اليوم؟ تفضل بطرح سؤالك مباشرة أو اختر أحد الاستفسارات الجاهزة أدناه! 👇",
                      timestamp: new Date()
                    }
                  ]);
                }
              }}
              className="text-xs text-zinc-400 hover:text-[#c5a059] hover:bg-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-800 transition-all font-medium cursor-pointer"
            >
              {t("إعادة ضبط المحادثة", "Reset Conversation")}
            </button>
          </div>

          {/* Chat messages list area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0c0c0e] flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {messages.map((msg) => {
                const welcomeTextEn = `Welcome to **Abu Majd Al-Haddad Travel & Tourism Services**! ✈️\n\nI am your smart assistant here to answer all your inquiries regarding:\n- **Travel Visas & Official Processing**\n- **Flight Bookings & Best Prices**\n- **Tour Packages**\n\nHow can I help you today? Please ask your question directly or select one of the ready-made inquiries below! 👇`;
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
                  >
                    <div className={`max-w-[85%] rounded-2xl p-4 shadow-xl relative group transition-all ${
                      msg.role === "user" 
                        ? "bg-[#c5a059] text-black rounded-tl-none border border-[#c5a059]/10" 
                        : "bg-zinc-900 text-zinc-200 rounded-tr-none border border-zinc-800"
                    }`}>
                      {/* Message Avatar Badge */}
                      <div className={`flex items-center justify-between mb-1.5 text-[10px] font-bold select-none ${
                        msg.role === "user" ? "text-zinc-800" : "text-zinc-500"
                      }`}>
                        <span>{msg.role === "user" ? t("أنت", "You") : t("المساعد الذكي", "AI Assistant")}</span>
                        <span>
                          {new Date(msg.timestamp).toLocaleTimeString(language === "ar" ? "ar-YE" : "en-US", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>

                      {/* Render message body content with markdown helpers */}
                      <div className="text-sm break-words leading-relaxed font-medium">
                        {renderMessageText(msg.id === "welcome" ? t(msg.text, welcomeTextEn) : msg.text, msg.role === "user")}
                      </div>

                    {/* Copy message button */}
                    {msg.id !== "welcome" && (
                      <div className="absolute left-2 bottom-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyToClipboard(msg.text, msg.id)}
                          className={`p-1.5 rounded-md border text-xs flex items-center justify-center gap-1 transition-all ${
                            msg.role === "user" 
                              ? "bg-zinc-900/10 border-black/10 hover:bg-black/10 text-zinc-900" 
                              : "bg-zinc-850 border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                          }`}
                          title="نسخ نص الرد"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="h-3 w-3 text-emerald-600" />
                              <span className="text-[10px]">تم النسخ</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              <span className="text-[10px]">نسخ</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ); })}
            </AnimatePresence>

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-end"
              >
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl rounded-tr-none p-4 max-w-[80%] shadow-xl">
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold mb-1">
                    <Sparkles className="h-3.5 w-3.5 text-[#c5a059] animate-pulse" />
                    <span>المساعد الذكي يكتب الرد الآن...</span>
                  </div>
                  <div className="flex items-center gap-1.5 py-1.5 px-1">
                    <span className="h-2 w-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="h-2 w-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="h-2 w-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Error Banner inside chat */}
            {error && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="bg-rose-950/40 border border-rose-900/50 rounded-xl p-4 text-rose-200 text-xs flex gap-2.5"
              >
                <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-rose-300">حدث خطأ في النظام</p>
                  <p className="mt-1 text-rose-400">{error}</p>
                  <p className="mt-2 text-[10px] text-rose-400/85 leading-relaxed">
                    يرجى تزويد مفتاح **GEMINI_API_KEY** في واجهة التطبيق عبر قائمة **Settings &gt; Secrets** ثم النقر على زر حفظ لتفعيل الذكاء الاصطناعي بشكل سليم.
                  </p>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts chips */}
          <div className="px-4 py-3 bg-[#0f0f12] border-t border-zinc-800 overflow-x-auto whitespace-nowrap flex gap-2 scrollbar-none">
            {QUICK_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt.text)}
                disabled={isLoading}
                className="inline-flex items-center gap-1 text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 hover:border-zinc-700 disabled:opacity-50 disabled:pointer-events-none px-3.5 py-2 rounded-full shadow-xs transition-all font-medium shrink-0 cursor-pointer"
              >
                {prompt.label}
              </button>
            ))}
          </div>

          {/* Chat input bar */}
          <div className="p-4 bg-[#0f0f12] border-t border-zinc-800">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
                placeholder="اكتب استفسارك هنا عن التأشيرات، رحلات الطيران، أو معاملات السفر..."
                className="flex-1 text-sm bg-zinc-900 border border-zinc-800 focus:border-[#c5a059] focus:bg-zinc-900 focus:outline-hidden px-4 py-3.5 rounded-xl disabled:opacity-55 transition-all text-[#fefefe] placeholder-zinc-650"
              />
              
              <button
                type="submit"
                disabled={!inputText.trim() || isLoading}
                className="bg-gradient-to-r from-[#c5a059] to-[#8e6e3c] text-black font-bold px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg hover:scale-103 active:scale-97 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              >
                <span className="hidden sm:inline">إرسال</span>
                <Send className="h-4 w-4 transform rotate-180" />
              </button>
            </form>
          </div>
        </section>

      </main>

      {/* Copied feedback micro-notification */}
      <AnimatePresence>
        {copiedText && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-zinc-900 text-[#fefefe] text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-zinc-800 flex items-center gap-2 z-50"
          >
            <Check className="h-4 w-4 text-emerald-400" />
            <span>تم نسخ {copiedText} بنجاح إلى الحافظة!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reading Mode Modal Popup */}
      <AnimatePresence>
        {selectedReadingAd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="reading_mode_modal">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReadingAd(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-2xl bg-[#0f0f12] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800/80 bg-[#141419]">
                <div>
                  <h3 className="text-sm font-bold text-zinc-400">📖 وضع القراءة للإعلان</h3>
                  <h2 className="text-base font-extrabold text-[#c5a059] mt-0.5">{selectedReadingAd.title}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReadingAd(null)}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                  title="إغلاق وضع القراءة"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 bg-zinc-950/50 border-b border-zinc-900/60 text-xs">
                {/* FontSize adjusters */}
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-500 font-bold ml-1.5">حجم الخط:</span>
                  {[
                    { label: "كبير", value: "lg", style: "text-lg" },
                    { label: "كبير جداً", value: "xl", style: "text-xl" },
                    { label: "ضخم", value: "2xl", style: "text-2xl" },
                    { label: "أقصى وضوح", value: "3xl", style: "text-3xl" }
                  ].map((sz) => (
                    <button
                      key={sz.value}
                      type="button"
                      onClick={() => setReadingFontSize(sz.value as any)}
                      className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all border cursor-pointer ${
                        readingFontSize === sz.value
                          ? "bg-[#c5a059] text-black border-[#c5a059]"
                          : "bg-zinc-900 text-zinc-400 border-zinc-850 hover:text-zinc-200"
                      }`}
                    >
                      {sz.label}
                    </button>
                  ))}
                </div>

                {/* Additional controls */}
                <div className="flex items-center gap-2">
                  {selectedReadingAd.isTranslation && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                      ✨ مترجم بالذكاء الاصطناعي
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedReadingAd.content);
                      setCopiedText("نص الإعلان");
                      setTimeout(() => setCopiedText(null), 2500);
                    }}
                    className="text-[10px] font-bold text-[#c5a059] bg-[#c5a059]/10 hover:bg-[#c5a059] hover:text-black border border-[#c5a059]/20 px-2.5 py-1 rounded-md transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="h-3 w-3" />
                    <span>نسخ النص</span>
                  </button>
                </div>
              </div>

              {/* Text Body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#0c0c0e]">
                <div className="max-w-prose mx-auto">
                  <div className="inline-block px-2.5 py-1 text-[10px] font-bold text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-md mb-4">
                    💼 التخصص: {selectedReadingAd.specialty}
                  </div>
                  
                  <div 
                    className={`text-zinc-200 leading-relaxed font-normal whitespace-pre-line text-right selection:bg-[#c5a059]/20 select-text ${
                      readingFontSize === "lg" ? "text-lg" :
                      readingFontSize === "xl" ? "text-xl" :
                      readingFontSize === "2xl" ? "text-2xl font-medium" :
                      "text-3xl font-semibold"
                    }`}
                    style={{ direction: "rtl" }}
                  >
                    {selectedReadingAd.content}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-[#141419] border-t border-zinc-800/80 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedReadingAd(null)}
                  className="px-5 py-2 text-xs font-bold text-zinc-300 bg-zinc-900 hover:bg-zinc-850 hover:text-white border border-zinc-800 rounded-xl transition-all cursor-pointer"
                >
                  إغلاق نافذة القراءة
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Settings Modal Popup */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="app_settings_modal">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md bg-[#0f0f12] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800/80 bg-[#141419]">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-[#c5a059]" />
                  <h2 className="text-base font-extrabold text-[#c5a059]">إعدادات التطبيق وتوفير البيانات</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                  title="إغلاق الإعدادات"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content / Settings Form */}
              <div className="p-6 flex flex-col gap-6 bg-[#0c0c0e]">
                {/* 1. Data Saving Mode Toggle */}
                <div className="flex flex-col gap-2 p-4 bg-zinc-900/30 border border-zinc-850 rounded-xl hover:border-zinc-800/80 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4 text-amber-500" />
                      <span className="text-xs font-extrabold text-zinc-100">وضع توفير البيانات (الإنترنت)</span>
                    </div>
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => setIsDataSavingMode(!isDataSavingMode)}
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isDataSavingMode ? "bg-[#c5a059]" : "bg-zinc-800"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                          isDataSavingMode ? "-translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed font-normal">
                    عند التفعيل، سيتم إيقاف التحميل التلقائي لكافة صور إعلانات السوق والتوظيف لتقليل استهلاك باقة الإنترنت، وسيظهر زر "تحميل الصورة" لتحميلها يدوياً عند الحاجة.
                  </p>
                </div>

                {/* 2. Dark Mode Toggle */}
                <div className="flex flex-col gap-2 p-4 bg-zinc-900/30 border border-zinc-850 rounded-xl hover:border-zinc-800/80 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isDarkMode ? (
                        <Moon className="h-4 w-4 text-amber-500" />
                      ) : (
                        <Sun className="h-4 w-4 text-amber-500" />
                      )}
                      <span className="text-xs font-extrabold text-zinc-100">وضع التصفح الليلي (المظهر الداكن)</span>
                    </div>
                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => setIsDarkMode(!isDarkMode)}
                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        isDarkMode ? "bg-[#c5a059]" : "bg-zinc-800"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-black shadow ring-0 transition duration-200 ease-in-out ${
                          isDarkMode ? "-translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed font-normal">
                    التحكم في سمة التطبيق العامة وتفعيل السمة الداكنة المريحة للعين أو السمة النهارية المشرقة.
                  </p>
                </div>

                {/* 3. Reading FontSize default preference */}
                <div className="flex flex-col gap-2 p-4 bg-zinc-900/30 border border-zinc-850 rounded-xl hover:border-zinc-800/80 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs font-extrabold text-zinc-100">حجم خط وضع القراءة للإعلانات</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 mt-1">
                    {[
                      { label: "كبير", value: "lg" },
                      { label: "جداً", value: "xl" },
                      { label: "ضخم", value: "2xl" },
                      { label: "أقصى", value: "3xl" }
                    ].map((sz) => (
                      <button
                        key={sz.value}
                        type="button"
                        onClick={() => setReadingFontSize(sz.value as any)}
                        className={`py-1.5 rounded-lg text-[10px] font-bold transition-all border cursor-pointer text-center ${
                          readingFontSize === sz.value
                            ? "bg-[#c5a059] text-black border-[#c5a059]"
                            : "bg-zinc-900 text-zinc-400 border-zinc-850 hover:text-zinc-200"
                        }`}
                      >
                        {sz.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-zinc-400 leading-relaxed font-normal">
                    تفضيلك المفضل لحجم الخط في وضع قراءة الإعلانات الطويلة لزيادة الوضوح والقراءة المريحة.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-[#141419] border-t border-zinc-800/80 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-6 py-2 text-xs font-bold text-black bg-[#c5a059] hover:bg-amber-500 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  حفظ وإغلاق الإعدادات
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Pro-forma Invoice Generator Modal */}
      <AnimatePresence>
        {isInvoiceModalOpen && invoiceTargetAd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto" id="proforma_invoice_modal">
            {/* Print Specific CSS Block */}
            <style dangerouslySetInnerHTML={{ __html: `
              @media print {
                body * {
                  visibility: hidden !important;
                }
                #printable-invoice, #printable-invoice * {
                  visibility: visible !important;
                }
                #printable-invoice {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 100% !important;
                  height: auto !important;
                  background: white !important;
                  color: black !important;
                  padding: 40px 30px !important;
                  margin: 0 !important;
                  box-shadow: none !important;
                  border: none !important;
                  direction: rtl !important;
                  font-family: 'Inter', system-ui, sans-serif !important;
                }
                #printable-invoice table {
                  width: 100% !important;
                  border-collapse: collapse !important;
                  margin-top: 15px !important;
                  margin-bottom: 15px !important;
                }
                #printable-invoice th {
                  background-color: #f4f4f5 !important;
                  color: #18181b !important;
                  font-weight: bold !important;
                  border: 1px solid #d4d4d8 !important;
                  padding: 10px 8px !important;
                  text-align: right !important;
                }
                #printable-invoice td {
                  border: 1px solid #e4e4e7 !important;
                  padding: 10px 8px !important;
                }
                #printable-invoice .watermark-print {
                  opacity: 0.04 !important;
                  display: flex !important;
                  position: absolute !important;
                  inset: 0 !important;
                  align-items: center !important;
                  justify-content: center !important;
                  pointer-events: none !important;
                }
                #printable-invoice .watermark-print img {
                  width: 380px !important;
                  height: 380px !important;
                  object-contain: fill !important;
                }
                .no-print {
                  display: none !important;
                }
                * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              }
            `}} />

            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsInvoiceModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md no-print"
            />

            {/* Modal Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-5xl bg-[#0b0b0d] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 max-h-[92vh] no-print"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-850 bg-[#121217]">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-[#c5a059]" />
                  <h2 className="text-sm sm:text-base font-extrabold text-[#c5a059]">توليد الفاتورة الأولية (Pro-forma Invoice)</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
                  title="إغلاق النافذة"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Modal Grid Split */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 1. Left Side: Inputs and Customization (Form) */}
                <div className="lg:col-span-5 flex flex-col gap-4 bg-zinc-950/40 p-4 border border-zinc-900 rounded-xl max-h-none lg:max-h-[65vh] overflow-y-auto">
                  <h3 className="text-xs font-extrabold text-amber-500/90 border-b border-zinc-900 pb-2 flex items-center gap-1.5">
                    ⚙️ تخصيص وحساب بيانات الاتفاق
                  </h3>

                  {/* Buyer Name Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400">اسم العميل / المشتري المهتم:</label>
                    <input
                      type="text"
                      value={invoiceBuyerName}
                      onChange={(e) => setInvoiceBuyerName(e.target.value)}
                      placeholder="مثال: عبدالله محمد صالح"
                      className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 rounded-lg px-3 py-2.5 focus:border-[#c5a059] focus:outline-none"
                    />
                  </div>

                  {/* Buyer Phone Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400">رقم هاتف المشتري (اختياري):</label>
                    <input
                      type="text"
                      value={invoiceBuyerPhone}
                      onChange={(e) => setInvoiceBuyerPhone(e.target.value)}
                      placeholder="مثال: 771234567"
                      className="w-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 rounded-lg px-3 py-2.5 focus:border-[#c5a059] focus:outline-none text-left"
                      dir="ltr"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Invoice Ref Code */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-400">رقم الفاتورة المرجعي:</label>
                      <input
                        type="text"
                        value={invoiceRefNo}
                        onChange={(e) => setInvoiceRefNo(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-200 rounded-lg px-2.5 py-2.5 focus:border-[#c5a059] focus:outline-none text-left"
                        dir="ltr"
                      />
                    </div>

                    {/* Invoice Date */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-zinc-400">تاريخ الفاتورة:</label>
                      <input
                        type="date"
                        value={invoiceDate}
                        onChange={(e) => setInvoiceDate(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-200 rounded-lg px-2.5 py-2.5 focus:border-[#c5a059] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Base Negotiated Price */}
                  <div className="flex flex-col gap-1.5 pt-1 border-t border-zinc-900">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-zinc-400">سعر السلعة المتفق عليه ({getPriceCurrency(invoiceTargetAd.price)}):</label>
                      <span className="text-[9px] text-[#c5a059]">السعر الأصلي: {invoiceTargetAd.price}</span>
                    </div>
                    <input
                      type="number"
                      value={invoiceBasePrice}
                      onChange={(e) => setInvoiceBasePrice(e.target.value)}
                      placeholder="السعر الرقمي الأساسي"
                      className="w-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-100 rounded-lg px-3 py-2.5 focus:border-[#c5a059] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Discount Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-rose-400">خصم ممنوح (-):</label>
                      <input
                        type="number"
                        value={invoiceDiscount}
                        onChange={(e) => setInvoiceDiscount(e.target.value)}
                        placeholder="خصم نقدي"
                        className="w-full bg-zinc-900 border border-zinc-800 text-xs text-rose-300 rounded-lg px-3 py-2 focus:border-rose-500 focus:outline-none"
                      />
                    </div>

                    {/* Extra fees / Transport */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-emerald-400">توصيل أو رسوم نقل (+):</label>
                      <input
                        type="number"
                        value={invoiceExtraFee}
                        onChange={(e) => setInvoiceExtraFee(e.target.value)}
                        placeholder="رسوم توصيل"
                        className="w-full bg-zinc-900 border border-zinc-800 text-xs text-emerald-300 rounded-lg px-3 py-2 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Invoice Terms / Notes */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-zinc-400">الشروط والملاحظات:</label>
                    <textarea
                      value={invoiceNotes}
                      onChange={(e) => setInvoiceNotes(e.target.value)}
                      rows={3}
                      placeholder="اكتب أي ملاحظات أو شروط تسليم خاصة بالاتفاق هنا..."
                      className="w-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300 rounded-lg p-2.5 focus:border-[#c5a059] focus:outline-none resize-none leading-relaxed"
                    />
                  </div>

                  {/* Digital Signature Drawing Pads */}
                  <div className="flex flex-col gap-3 pt-2.5 border-t border-zinc-900 mt-1">
                    <span className="text-[10px] font-extrabold text-[#c5a059] flex items-center gap-1">
                      <PenTool className="h-3 w-3 text-[#c5a059]" />
                      {t("توقيع المستند رقمياً (رسم باليد)", "Digital Signatures (Draw by Hand)")}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex flex-col gap-2">
                        <SignaturePad
                          label={t("توقيع المشتري / العميل", "Buyer / Client Signature")}
                          onSave={(dataUrl) => {
                            setInvoiceBuyerSignature(dataUrl);
                            const today = new Date().toISOString().split("T")[0];
                            setInvoiceBuyerSignatureDate(today);
                          }}
                          onClear={() => {
                            setInvoiceBuyerSignature("");
                            setInvoiceBuyerSignatureDate("");
                          }}
                          savedDataUrl={invoiceBuyerSignature}
                          language={language}
                        />
                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-2 sm:p-2.5">
                          <Calendar className="h-3.5 w-3.5 text-[#c5a059] shrink-0" />
                          <div className="flex-1 min-w-0">
                            <label className="block text-[8px] text-zinc-500 font-bold mb-0.5 leading-none">
                              {t("تاريخ توقيع المشتري تلقائياً", "Buyer Signature Date (Auto)")}
                            </label>
                            <input
                              type="date"
                              value={invoiceBuyerSignatureDate}
                              onChange={(e) => setInvoiceBuyerSignatureDate(e.target.value)}
                              className="w-full bg-transparent text-[10px] text-zinc-200 focus:outline-none cursor-pointer p-0 border-0 leading-none"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <SignaturePad
                          label={t("توقيع البائع / المكتب", "Seller / Agency Signature")}
                          onSave={(dataUrl) => {
                            setInvoiceSellerSignature(dataUrl);
                            const today = new Date().toISOString().split("T")[0];
                            setInvoiceSellerSignatureDate(today);
                          }}
                          onClear={() => {
                            setInvoiceSellerSignature("");
                            setInvoiceSellerSignatureDate("");
                          }}
                          savedDataUrl={invoiceSellerSignature}
                          language={language}
                        />
                        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-2 sm:p-2.5">
                          <Calendar className="h-3.5 w-3.5 text-[#c5a059] shrink-0" />
                          <div className="flex-1 min-w-0">
                            <label className="block text-[8px] text-zinc-500 font-bold mb-0.5 leading-none">
                              {t("تاريخ توقيع البائع تلقائياً", "Seller Signature Date (Auto)")}
                            </label>
                            <input
                              type="date"
                              value={invoiceSellerSignatureDate}
                              onChange={(e) => setInvoiceSellerSignatureDate(e.target.value)}
                              className="w-full bg-transparent text-[10px] text-zinc-200 focus:outline-none cursor-pointer p-0 border-0 leading-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Right Side: Beautiful Invoice Document Live Preview */}
                <div className="lg:col-span-7 flex flex-col gap-3">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-[11px] font-bold text-zinc-400">📋 ورقة المعاينة والمستند النهائي:</span>
                    <span className="text-[9px] text-amber-500/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      📄 يدعم العربية بالتنسيق الرسمي
                    </span>
                  </div>

                  {/* Document Container */}
                  <div className="bg-white text-zinc-950 border border-zinc-200 rounded-xl p-6 sm:p-8 shadow-xl max-h-[65vh] overflow-y-auto relative text-right select-none font-sans overflow-hidden" id="printable-invoice" style={{ direction: "rtl" }}>
                    
                    {/* Background Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none select-none z-0 overflow-hidden watermark-print">
                      <img 
                        src={appLogo} 
                        alt="Watermark" 
                        className="w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] object-contain filter grayscale"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Header Decorative Golden Stripe */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-[#c5a059] z-10" />

                    {/* Invoice Top Header */}
                    <div className="flex justify-between items-start gap-4 border-b border-zinc-200 pb-4 mt-1 relative z-10">
                      <div>
                        <h1 className="text-base font-extrabold text-[#c5a059] leading-tight flex items-center gap-1.5">
                          {office.name}
                        </h1>
                        <p className="text-[9px] text-zinc-500 mt-1 leading-normal">
                          سوق بيع وشراء السلع والخدمات | بوابة السفريات الذكية
                        </p>
                        <p className="text-[8px] text-zinc-500 leading-normal">
                          هاتف: {office.phone} | بريد: {office.email}
                        </p>
                      </div>
                      <div className="text-left font-mono" style={{ direction: "ltr" }}>
                        <div className="text-[11px] font-extrabold text-zinc-900 bg-zinc-100 px-2 py-1 rounded border border-zinc-200 inline-block">
                          PRO-FORMA INVOICE
                        </div>
                        <div className="text-[8px] text-zinc-500 mt-2">
                          <span className="font-bold text-zinc-700">REF:</span> {invoiceRefNo}
                        </div>
                        <div className="text-[8px] text-zinc-500">
                          <span className="font-bold text-zinc-700">DATE:</span> {invoiceDate}
                        </div>
                      </div>
                    </div>

                    {/* Document Title */}
                    <div className="text-center my-6 relative z-10">
                      <h2 className="text-sm font-extrabold text-zinc-900 underline underline-offset-4 decoration-[#c5a059]">
                        {t("فاتورة أولية مبدئية لتوثيق الصفقة", "Pro-forma Trade Agreement Invoice")}
                      </h2>
                      <p className="text-[8px] text-zinc-500 mt-1.5 font-medium">
                        {t("هذه الفاتورة توثق تراضي واتفاق الأطراف المبدئي بخصوص السلعة المعروضة أدناه", "This invoice documents initial agreement between the trade parties")}
                      </p>
                    </div>

                    {/* Parties Grid (Buyer & Seller) */}
                    <div className="grid grid-cols-2 gap-4 bg-zinc-50/80 p-3.5 rounded-xl border border-zinc-200/60 text-[10px] mb-4.5 relative z-10 backdrop-blur-[0.5px]">
                      <div className="border-l border-zinc-200 pl-3.5 flex flex-col gap-1.5">
                        <span className="font-extrabold text-[#c5a059] text-[9px] border-b border-zinc-200/80 pb-1 flex items-center gap-1">👤 {t("تفاصيل العميل / المشتري:", "Buyer / Client Details:")}</span>
                        <div>{t("الاسم الكريم:", "Full Name:")} <span className="font-bold text-zinc-800">{invoiceBuyerName || t("عميل محترم / زبون السوق", "Valued Client / Market Customer")}</span></div>
                        <div>{t("رقم الهاتف:", "Phone Number:")} <span className="font-bold text-zinc-800" style={{ direction: "ltr" }}>{invoiceBuyerPhone || t("غير محدد", "Not specified")}</span></div>
                        <div className="mt-0.5">{t("حالة الاتفاق:", "Status:")} <span className="font-bold text-emerald-600 bg-emerald-50/80 px-1.5 py-0.5 rounded border border-emerald-100/60 text-[8px]">{t("تنسيق مبدئي موثق", "Documented Agreement")}</span></div>
                      </div>
                      <div className="flex flex-col gap-1.5 pr-1">
                        <span className="font-extrabold text-zinc-700 text-[9px] border-b border-zinc-200/80 pb-1 flex items-center gap-1">👤 {t("تفاصيل ناشر الإعلان / البائع:", "Publisher / Seller Details:")}</span>
                        <div>{t("اسم المعلن:", "Seller Name:")} <span className="font-bold text-zinc-800">{invoiceTargetAd.name}</span></div>
                        <div>{t("رقم الهاتف:", "Phone Number:")} <span className="font-bold text-zinc-800" style={{ direction: "ltr" }}>{invoiceTargetAd.phone}</span></div>
                        <div>{t("مكان تواجد السلعة:", "Item Location:")} <span className="font-bold text-zinc-800">{invoiceTargetAd.location}</span></div>
                      </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="border border-zinc-300 rounded-xl overflow-hidden mb-4.5 relative z-10 bg-white/70 backdrop-blur-[0.5px]">
                      <table className="w-full text-right text-[10px] border-collapse">
                        <thead>
                          <tr className="bg-zinc-100/90 border-b border-zinc-300 text-zinc-800 font-extrabold text-[9px]">
                            <th className="p-2.5 border-l border-zinc-300 w-2/3">{t("بيان وإيضاح السلعة أو الخدمة المعروضة", "Item Description & Trade Agreement")}</th>
                            <th className="p-2.5 border-l border-zinc-300 text-center w-1/6">{t("القسم الكلي", "Category")}</th>
                            <th className="p-2.5 text-left w-1/6">{t("سعر السعر المتفق عليه", "Price Total")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-zinc-200 hover:bg-zinc-50/50">
                            <td className="p-2.5 border-l border-zinc-200">
                              <div className="font-black text-zinc-900 text-[11px]">{invoiceTargetAd.title}</div>
                              <p className="text-[8px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                                {invoiceTargetAd.details}
                              </p>
                              <div className="mt-1 text-[8px] text-zinc-400 font-medium">
                                {t("نوع المعاملة في السوق:", "Deal Type:")} {invoiceTargetAd.type === "sell" ? t("عرض بيع في السوق", "For Sale") : t("طلب شراء في السوق", "Wanted to Buy")}
                              </div>
                            </td>
                            <td className="p-2.5 border-l border-zinc-200 text-center text-zinc-600 font-bold">
                              {invoiceTargetAd.category}
                            </td>
                            <td className="p-2.5 text-left font-bold text-zinc-800">
                              {parseFloat(invoiceBasePrice || "0").toLocaleString()} {getPriceCurrency(invoiceTargetAd.price)}
                            </td>
                          </tr>
                          
                          {/* Calculations Summary Rows */}
                          <tr className="bg-zinc-50/30 text-[9px] border-b border-zinc-200">
                            <td colSpan={2} className="p-2 border-l border-zinc-200 text-left font-bold text-zinc-500">{t("المجموع الأساسي (Subtotal):", "Subtotal:")}</td>
                            <td className="p-2 text-left font-extrabold text-zinc-800">
                              {parseFloat(invoiceBasePrice || "0").toLocaleString()} {getPriceCurrency(invoiceTargetAd.price)}
                            </td>
                          </tr>
 
                          {parseFloat(invoiceDiscount) > 0 && (
                            <tr className="bg-zinc-50/30 text-[9px] text-rose-600 border-b border-zinc-200">
                              <td colSpan={2} className="p-2 border-l border-zinc-200 text-left font-bold">{t("خصم تجاري خاص (-):", "Discount (-):")}</td>
                              <td className="p-2 text-left font-extrabold">
                                - {parseFloat(invoiceDiscount).toLocaleString()} {getPriceCurrency(invoiceTargetAd.price)}
                              </td>
                            </tr>
                          )}
 
                          {parseFloat(invoiceExtraFee) > 0 && (
                            <tr className="bg-zinc-50/30 text-[9px] text-emerald-600 border-b border-zinc-200">
                              <td colSpan={2} className="p-2 border-l border-zinc-200 text-left font-bold">{t("رسوم إضافية أو خدمة توصيل (+):", "Extra Fees (+):")}</td>
                              <td className="p-2 text-left font-extrabold">
                                + {parseFloat(invoiceExtraFee).toLocaleString()} {getPriceCurrency(invoiceTargetAd.price)}
                              </td>
                            </tr>
                          )}
 
                          {/* NET TOTAL ROW */}
                          <tr className="bg-zinc-100/95 text-[10px] border-t border-zinc-300 font-black">
                            <td colSpan={2} className="p-2.5 border-l border-zinc-300 text-left text-zinc-900 font-extrabold">{t("الصافي الإجمالي المستحق (Net Total):", "Net Total Due:")}</td>
                            <td className="p-2.5 text-left text-[#c5a059] font-black text-xs">
                              {Math.max(0, (parseFloat(invoiceBasePrice || "0") - (parseFloat(invoiceDiscount || "0")) + (parseFloat(invoiceExtraFee || "0")))).toLocaleString()} {getPriceCurrency(invoiceTargetAd.price)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
 
                    {/* Legal Notes */}
                    <div className="bg-zinc-50/80 p-3 rounded-xl border border-zinc-200/60 text-[8px] text-zinc-600 leading-relaxed mb-6 relative z-10 backdrop-blur-[0.5px]">
                      <span className="font-extrabold text-zinc-800 block mb-1">📝 {t("ملاحظات هامة وشروط الصفقة الموثقة:", "Important Notes & Conditions:")}</span>
                      <p>{invoiceNotes}</p>
                      <p className="mt-1.5 border-t border-zinc-200/60 pt-1 text-[7.5px] text-zinc-400">
                        {t("* تم إعداد وتصدير هذه الفاتورة المبدئية إلكترونياً تلبية لرغبة المستخدمين بموجب خدمات التسويق للمكتب.", "* This pro-forma agreement was generated electronically upon the user's request.")}
                      </p>
                    </div>

                    {/* Signatures Row */}
                    <div className="grid grid-cols-2 gap-8 text-[9px] text-zinc-500 pt-4 mt-2">
                      <div className="text-center flex flex-col items-center">
                        <div className="w-full border-t border-zinc-300 pt-1.5 font-bold text-zinc-700">
                          {t("توقيع المشتري / العميل الكريـم", "Buyer / Client Authorized Signature")}
                        </div>
                        {invoiceBuyerSignature ? (
                          <div className="h-14 mt-1 flex flex-col items-center justify-center">
                            <img 
                              src={invoiceBuyerSignature} 
                              alt="Buyer Signature" 
                              className="max-h-10 max-w-[150px] object-contain select-none" 
                            />
                            {invoiceBuyerSignatureDate && (
                              <span className="text-[7px] text-zinc-400 font-mono mt-0.5">
                                {t("التاريخ:", "Date:")} {invoiceBuyerSignatureDate}
                              </span>
                            )}
                          </div>
                        ) : (
                          <div className="h-14 mt-1 text-[8px] text-zinc-300 flex items-center justify-center italic">
                            ({t("يرجى التوقيع في لوحة التخصيص", "Please sign in the customization panel")})
                          </div>
                        )}
                      </div>
                      <div className="text-center flex flex-col items-center">
                        <div className="w-full border-t border-[#c5a059] pt-1.5 text-zinc-800 font-extrabold">
                          {t(`مجموعة ${office.name} التجارية`, `${office.name} Business Group`)}
                        </div>
                        <div className="h-14 mt-1 relative flex flex-col items-center justify-center w-full">
                          {invoiceSellerSignature ? (
                            <div className="h-full flex flex-col items-center justify-center z-10">
                              <img 
                                src={invoiceSellerSignature} 
                                alt="Seller Signature" 
                                className="max-h-10 max-w-[150px] object-contain select-none" 
                              />
                              {invoiceSellerSignatureDate && (
                                <span className="text-[7px] text-zinc-500 font-mono mt-0.5">
                                  {t("التاريخ:", "Date:")} {invoiceSellerSignatureDate}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="text-[8px] text-zinc-300 flex items-center justify-center italic h-full">
                              ({t("يرجى التوقيع في لوحة التخصيص", "Please sign in the customization panel")})
                            </div>
                          )}
                          {/* Decorative stamp seal */}
                          <div className="absolute border-2 border-dashed border-amber-500/30 text-amber-500/40 text-[7px] font-black uppercase tracking-wider rounded-full h-11 w-11 flex items-center justify-center rotate-12 select-none pointer-events-none">
                            APPROVED
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Document Footer Note */}
                    <div className="text-center mt-10 border-t border-zinc-150 pt-3 text-[7px] text-zinc-400">
                      برمجيات {office.name} - سوق السلع والخدمات المبدئي الذكي
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer Controls */}
              <div className="px-6 py-4 bg-[#141419] border-t border-zinc-850 flex justify-between gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-5 py-2 text-xs font-bold text-zinc-400 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl transition-all cursor-pointer"
                >
                  إلغاء التوليد
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      window.print();
                    }}
                    className="px-6 py-2.5 text-xs font-extrabold text-black bg-[#c5a059] hover:bg-amber-500 rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    تحميل PDF
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Advertiser Rating Modal */}
      <AnimatePresence>
        {isRatingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs" id="advertiser_rating_modal">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-[#0e0e12] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-right"
              style={{ direction: "rtl" }}
            >
              {/* Golden gradient header strip */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-[#c5a059] to-amber-600" />
              
              {/* Header */}
              <div className="px-6 pt-6 pb-4 border-b border-zinc-850 flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-black text-zinc-100 flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-[#c5a059] fill-amber-500" />
                    تقييم مصداقية المعلن
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-1">
                    تقييم تعاملك ومصداقية المعلن: <span className="font-bold text-amber-400">{ratingTargetName}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRatingModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col items-center gap-5">
                {ratingSuccess ? (
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="flex flex-col items-center text-center gap-3 py-6"
                  >
                    <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-xl font-bold">
                      ✓
                    </div>
                    <p className="text-xs font-bold text-zinc-200">تم تسجيل تقييمك بنجاح!</p>
                    <p className="text-[10px] text-zinc-400 max-w-[250px]">
                      شكراً لك، تقييمك يساهم في الحفاظ على مصداقية الإعلانات وأمان المعاملات داخل مجتمع السوق.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <p className="text-[11px] text-zinc-400 text-center leading-relaxed">
                      يرجى اختيار عدد النجوم المناسب لتقييم مصداقية هذا المعلن بناءً على تعاملك الفعلي أو تواصلك معه بخصوص السلعة أو الفرصة المعروضة:
                    </p>

                    {/* Star Selection Loop */}
                    <div className="flex gap-2 justify-center items-center py-2" style={{ direction: "ltr" }}>
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isStarred = (hoverRating || selectedRating) >= star;
                        return (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setSelectedRating(star)}
                            className="p-1 cursor-pointer transition-all hover:scale-125 focus:outline-none"
                          >
                            <Star 
                              className={`h-8 w-8 transition-colors duration-150 ${
                                isStarred 
                                  ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" 
                                  : "text-zinc-700 hover:text-zinc-500"
                              }`} 
                            />
                          </button>
                        );
                      })}
                    </div>

                    {/* Rating label descriptions */}
                    <div className="w-full text-center py-1.5 px-3 rounded-lg bg-zinc-900/50 border border-zinc-850 text-[10px] font-bold">
                      {selectedRating === 1 && <span className="text-rose-400">⚠️ ضعيفة جداً / معلن غير موثوق بالتعامل</span>}
                      {selectedRating === 2 && <span className="text-amber-500">⚠️ مقبولة بصعوبة / جودة تعامل دون المتوسط</span>}
                      {selectedRating === 3 && <span className="text-zinc-300">👍 متوسطة / تعامل ومصداقية عادية مقبولة</span>}
                      {selectedRating === 4 && <span className="text-emerald-400">👍 جيدة وموثوقة / معلن جاد وصادق بالتعامل</span>}
                      {selectedRating === 5 && <span className="text-amber-400">🏆 ممتازة وموثوقية عالية جداً / ينصح بالتعامل معه</span>}
                    </div>

                    <div className="w-full text-[9px] text-zinc-500 border-t border-zinc-900 pt-3 flex items-center gap-1">
                      <span className="text-amber-500">🔒</span>
                      <span>تقييمات المستخدمين سرية وتخضع لمعايير الحماية التلقائية لضمان جودة ونزاهة المراجعات.</span>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              {!ratingSuccess && (
                <div className="px-6 py-4 bg-[#141419] border-t border-zinc-850 flex justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRatingModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-zinc-400 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl transition-all cursor-pointer"
                  >
                    إلغاء التقييم
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmittingRating}
                    className="px-6 py-2 text-xs font-extrabold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-all cursor-pointer shadow-md shadow-amber-500/10"
                  >
                    تأكيد التقييم الحقيقي ⭐
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sticky footer info */}
      <footer className="bg-[#09090b] text-zinc-500 py-6 px-6 border-t border-zinc-900 text-center text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} {office.name}. جميع الحقوق محفوظة.</p>
          <p className="text-zinc-600">تم التطوير لتسهيل المعاملات وحجوزات الطيران بالذكاء الاصطناعي الفوري</p>
        </div>
      </footer>
    </div>
  );
}
