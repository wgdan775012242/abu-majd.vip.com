import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import axios from "axios";
import * as cheerio from "cheerio";
import { addDoc, getDocs, doc, deleteDoc, query, orderBy, updateDoc, getDoc } from "firebase/firestore";
import { db, jobsCollection, marketCollection } from "./firebase";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ limit: "15mb", extended: true }));

  // In-memory user-to-user (U2U) chats
  let u2uMessages = [
    {
      id: "u2u-msg-1",
      senderPhone: "+967775012242",
      senderName: "أبو مجد للسفريات",
      receiverPhone: "+967771234567",
      receiverName: "المهندس وضاح حميد",
      text: "أهلاً بك يا باشمهندس وضاح بخصوص إعلانك للبرمجة وتطوير المواقع، هل أنت متاح للعمل على مشروع جديد حالياً؟",
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(), // 3 hours ago
      adId: "seed-4",
      adTitle: "أخصائي تقني / مبرمج / مصمم",
      isAutoReply: false,
      isRead: true
    },
    {
      id: "u2u-msg-2",
      senderPhone: "+967771234567",
      senderName: "المهندس وضاح حميد",
      receiverPhone: "+967775012242",
      receiverName: "أبو مجد للسفريات",
      text: "أهلاً بك أستاذ أبو مجد! نعم متاح وجاهز للعمل، يسعدني جداً التعاون معكم. ما هي تفاصيل المشروع المطلوب برمجته؟",
      timestamp: new Date(Date.now() - 3600000 * 2.8).toISOString(),
      adId: "seed-4",
      adTitle: "أخصائي تقني / مبرمج / مصمم",
      isAutoReply: false,
      isRead: true
    }
  ];

  // In-memory Job Board Advertisements
  let jobAds = [
    {
      id: "seed-1",
      type: "employer",
      name: "شركة النخبة للمقاولات بالرياض",
      phone: "+966501234567",
      specialty: "مهندس مدني / معماري / كهرباء",
      country: "السعودية (الرياض)",
      details: "مطلوب مهندس مدني خبرة لا تقل عن 5 سنوات في الإشراف على المشاريع الإنشائية السكنية والتجارية. نقل كفالة أو تأشيرة عمل جديدة.",
      salary: "6000 - 8000 ريال",
      experience: "5 سنوات",
      timestamp: new Date().toLocaleDateString("ar-YE")
    },
    {
      id: "seed-2",
      type: "employer",
      name: "أبو فهد العتيبي (أعمال منزلية)",
      phone: "+966555987654",
      specialty: "عاملة منزلية / مربية",
      country: "السعودية (جدة)",
      details: "مطلوب عاملة منزلية لرعاية أطفال وإدارة المنزل. نوفر سكن خاص وتأمين طبي وراتب مجزي.",
      salary: "2000 ريال",
      experience: "سنتين",
      timestamp: new Date().toLocaleDateString("ar-YE")
    },
    {
      id: "seed-3",
      type: "seeker",
      name: "أحمد بن سالم علي",
      phone: "+967733445566",
      specialty: "كهربائي تمديدات / فني صيانه",
      country: "اليمن (صنعاء)",
      details: "فني كهربائي تمديدات وصيانة شبكات ذو خبرة ممتازة في المخططات وقراءة الخرائط الهندسية، أبحث عن فرصة عمل وتأشيرة إلى السعودية.",
      salary: "3500 ريال",
      experience: "4 سنوات",
      timestamp: new Date().toLocaleDateString("ar-YE")
    },
    {
      id: "seed-4",
      type: "seeker",
      name: "المهندس وضاح حميد",
      phone: "+967771234567",
      specialty: "أخصائي تقني / مبرمج / مصمم",
      country: "اليمن (تعز)",
      details: "مبرمج ويب ومطور واجهات أمامية وخلفية React/Node.js، أبحث عن فرصة عمل عن بعد أو تأشيرة مهنية رسمية لدى شركة برمجيات بالمملكة.",
      salary: "5000 ريال",
      experience: "3 سنوات",
      timestamp: new Date().toLocaleDateString("ar-YE")
    }
  ];

  // In-memory Market Advertisements (Buy & Sell)
  let marketAds = [
    {
      id: "market-seed-1",
      type: "sell",
      category: "تأشيرات وإقامات",
      title: "تأشيرة حرة سائق خاص جاهزة للنقل والتفويض",
      details: "متوفر تأشيرة سائق خاص جاهزة ومفوضة لليمنيين. الدفع بعد الانجاز والتوثيق الرسمي عبر منصة قوى ومساند.",
      price: "9500 ريال سعودي",
      location: "الرياض، السعودية",
      name: "المجد للخدمات العامة",
      phone: "+966501234567",
      timestamp: new Date().toLocaleDateString("ar-YE")
    },
    {
      id: "market-seed-2",
      type: "buy",
      category: "سيارات ووسائل نقل",
      title: "مطلوب شراء سيارة هايلوكس دبل موديل 2020 فما فوق",
      details: "أبحث عن تويوتا هايلوكس غمارة أو غمارتين دبل، شرط النظافة التامة وخالية من الصدمات ومجمركة جاهزة للتصدير أو مرقمة.",
      price: "حسب النظافة والاتفاق",
      location: "صنعاء، اليمن",
      name: "أبو راكان الحاشدي",
      phone: "+967771112223",
      timestamp: new Date().toLocaleDateString("ar-YE")
    },
    {
      id: "market-seed-3",
      type: "sell",
      category: "تذاكر ورحلات",
      title: "عرض تذكرة طيران مخفضة ومباشرة (جدة - صنعاء)",
      details: "عرض خاص ولفترة محدودة على رحلة الخطوط الجوية اليمنية المباشرة من جدة إلى صنعاء. المقاعد محدودة للغاية تواصل فوري.",
      price: "850 ريال سعودي",
      location: "جدة، السعودية",
      name: "أبو مجد للسفريات",
      phone: "+967775012242",
      timestamp: new Date().toLocaleDateString("ar-YE")
    },
    {
      id: "market-seed-4",
      type: "sell",
      category: "عقارات وأراضي",
      title: "أرض للبيع بموقع مميز جداً في صنعاء - بيت بوس",
      details: "أرض حر بمساحة 4 لبن عشاري على شارع 12 متر، قريبة من الخدمات والمدارس وموقع سكني راقي جداً.",
      price: "على السوم / للتواصل",
      location: "صنعاء (بيت بوس)",
      name: "الأستاذ وجدان الحداد",
      phone: "+967738465200",
      timestamp: new Date().toLocaleDateString("ar-YE")
    }
  ];

  // Helper function to extract phone numbers
  const extractPhoneNumbers = (text: string) => {
    if (!text) return 'غير متوفر';
    const phoneRegex = /(?:\+966|00966|05\d)\s*\d{3}\s*\d{4}|(?:\+967|00967|7[13708])\s*\d{3}\s*\d{3,4}|(?:05|01)\d{8}/g;
    const matches = text.match(phoneRegex);
    if (matches && matches.length > 0) {
      const uniqueNumbers = [...new Set(matches)];
      return uniqueNumbers.join(' | ');
    }
    const simpleRegex = /(?:(?:\+|00)\d{1,3}[\s-]?)?(?:\d{2,4}[\s-]?){2,4}\d{2,4}/g;
    const simpleMatches = text.match(simpleRegex);
    if (simpleMatches) {
      const valid = simpleMatches.filter(m => m.replace(/\D/g, '').length >= 9);
      if (valid.length > 0) return [...new Set(valid)].join(' | ');
    }
    return 'غير متوفر';
  };

  // API Route to fetch job advertisements
  app.get("/api/jobs", async (req, res) => {
    try {
      const externalJobs: any[] = [];

      console.log("بداية جلب الوظائف...");

      // 1. موقع مرجان
      try {
        const mourjanRes = await axios.get('https://mourjan.com/sa/jobs/', {
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html'
          },
          timeout: 8000
        });
        const $1 = cheerio.load(mourjanRes.data);
        $1('.listing-item, .item, .ad-box').each((index: number, element: any) => {
          if (index >= 15) return false;
          const title = $1(element).find('.title, h2, h3').text().replace(/\s+/g, ' ').trim();
          const desc = $1(element).find('.desc, .description, p').text().replace(/\s+/g, ' ').trim();
          let url = $1(element).find('a').attr('href');
          if (url && !url.startsWith('http')) url = 'https://mourjan.com' + url;
          
          if (title && title.length > 5) {
            externalJobs.push({
              id: `mourjan-${Date.now()}-${index}`,
              type: 'external',
              name: 'موقع مرجان',
              title: title,
              phone: extractPhoneNumbers(desc) || extractPhoneNumbers(title),
              details: desc || 'تفاصيل الوظيفة متوفرة في الرابط.',
              url: url || 'https://mourjan.com/sa/jobs/',
              timestamp: new Date().toLocaleDateString('ar-SA')
            });
          }
        });
      } catch (e: any) {
        console.error('تخطي مرجان:', e.message);
      }

      // 2. وظيفة مشتلي
      try {
        const mshatlyRes = await axios.get('https://wazifa.mshatly.com/', {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 8000
        });
        const $2 = cheerio.load(mshatlyRes.data);
        $2('article, .post, .job-item').each((index: number, element: any) => {
          if (index >= 15) return false;
          const title = $2(element).find('.entry-title, h2, h3').text().replace(/\s+/g, ' ').trim();
          const desc = $2(element).find('.entry-content, .excerpt, p').text().replace(/\s+/g, ' ').trim();
          let url = $2(element).find('a').first().attr('href');
          
          if (title && title.length > 5) {
            externalJobs.push({
              id: `mshatly-${Date.now()}-${index}`,
              type: 'external',
              name: 'وظيفة مشتلي',
              title: title,
              phone: extractPhoneNumbers(desc) || extractPhoneNumbers(title),
              details: desc || 'اضغط على الرابط للتفاصيل.',
              url: url || 'https://wazifa.mshatly.com/',
              timestamp: new Date().toLocaleDateString('ar-SA')
            });
          }
        });
      } catch (e: any) {
        console.error('تخطي مشتلي:', e.message);
      }

      // 3. مستعد السعودية
      try {
        const mosta3edRes = await axios.get('https://mosta3ed.com/', {
          headers: { 'User-Agent': 'Mozilla/5.0' },
          timeout: 8000
        });
        const $3 = cheerio.load(mosta3edRes.data);
        $3('.job-listing, .item, .post-item').each((index: number, element: any) => {
          if (index >= 15) return false;
          const title = $3(element).find('.title, h2, h3').text().replace(/\s+/g, ' ').trim();
          const desc = $3(element).find('.description, p, .content').text().replace(/\s+/g, ' ').trim();
          let url = $3(element).find('a').attr('href');
          
          if (title && title.length > 5) {
            externalJobs.push({
              id: `mosta3ed-${Date.now()}-${index}`,
              type: 'external',
              name: 'مستعد السعودية',
              title: title,
              phone: extractPhoneNumbers(desc) || extractPhoneNumbers(title),
              details: desc || 'متاح تفاصيل إضافية في الموقع.',
              url: url || 'https://mosta3ed.com/',
              timestamp: new Date().toLocaleDateString('ar-SA')
            });
          }
        });
      } catch (e: any) {
        console.error('تخطي مستعد:', e.message);
      }

      // دمج الوظائف المحلية مع الوظائف المسحوبة
      let internalJobs: any[] = [];
      try {
        const snapshot = await getDocs(jobsCollection);
        internalJobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort by ID descending (which has timestamp if ad-timestamp) or createdAt
        internalJobs.sort((a, b) => {
          const tA = a.createdAt || 0;
          const tB = b.createdAt || 0;
          return tB - tA;
        });
      } catch (err) {
        console.error("خطأ في جلب الوظائف من Firestore:", err);
      }

      const allJobs = [...internalJobs, ...externalJobs];
      
      res.json(allJobs);
    } catch (error: any) {
      console.error("خطأ عام في الخادم:", error);
      res.json([]); // Fallback
    }
  });

  // API Route to post a new job advertisement
  app.post("/api/jobs", async (req, res) => {
    const { type, name, phone, specialty, country, details, salary, experience, image } = req.body;
    if (!type || !name || !phone || !specialty || !country || !details) {
      return res.status(400).json({ error: "جميع الحقول الأساسية مطلوبة (النوع، الاسم، الهاتف، التخصص، الموقع، تفاصيل الإعلان)" });
    }
    const newAd = {
      type,
      name,
      phone,
      specialty,
      country,
      details,
      salary: salary || "غير محدد",
      experience: experience || "غير محدد",
      timestamp: new Date().toLocaleDateString("ar-YE"),
      createdAt: Date.now(),
      image: image || undefined
    };
    try {
      const docRef = await addDoc(jobsCollection, newAd);
      res.status(201).json({ id: docRef.id, ...newAd });
    } catch (err) {
      console.error("Error adding job to Firestore", err);
      res.status(500).json({ error: "فشل حفظ الإعلان في قاعدة البيانات" });
    }
  });

  // API Route to fetch market (Buy & Sell) advertisements
  app.get("/api/market", async (req, res) => {
    try {
      const snapshot = await getDocs(marketCollection);
      const internalMarket = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      internalMarket.sort((a: any, b: any) => {
        const tA = a.createdAt || 0;
        const tB = b.createdAt || 0;
        return tB - tA;
      });
      res.json(internalMarket);
    } catch (err) {
      console.error("Error fetching market ads", err);
      res.json([]);
    }
  });

  // API Route to post a new market advertisement
  app.post("/api/market", async (req, res) => {
    const { type, category, title, details, price, location, name, phone, image } = req.body;
    if (!type || !category || !title || !details || !price || !location || !name || !phone) {
      return res.status(400).json({ error: "جميع الحقول المطلوبة يجب تعبئتها." });
    }
    const newAd = {
      type,
      category,
      title,
      details,
      price,
      location,
      name,
      phone,
      timestamp: new Date().toLocaleDateString("ar-YE"),
      createdAt: Date.now(),
      image: image || undefined
    };
    try {
      const docRef = await addDoc(marketCollection, newAd);
      res.status(201).json({ id: docRef.id, ...newAd });
    } catch (err) {
      console.error("Error adding market ad", err);
      res.status(500).json({ error: "فشل حفظ الإعلان في قاعدة البيانات" });
    }
  });

  // API Route to delete a market advertisement
  app.delete("/api/market/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const docRef = doc(db, "marketAds", id);
      await deleteDoc(docRef);
      res.json({ success: true, message: "تم حذف الإعلان بنجاح." });
    } catch (err) {
      console.error("Error deleting market ad", err);
      res.status(500).json({ error: "الإعلان غير موجود أو تم حذفه مسبقاً." });
    }
  });

  // API Route to extend a market advertisement
  app.post("/api/market/:id/extend", async (req, res) => {
    const { id } = req.params;
    try {
      const docRef = doc(db, "marketAds", id);
      const snapshot = await getDoc(docRef);
      if (!snapshot.exists()) {
        return res.status(404).json({ error: "الإعلان غير موجود." });
      }
      const newTimestamp = new Date().toLocaleDateString("ar-YE");
      await updateDoc(docRef, { timestamp: newTimestamp, createdAt: Date.now() });
      res.json({ success: true, message: "تم تمديد الإعلان بنجاح.", ad: { id, ...snapshot.data(), timestamp: newTimestamp } });
    } catch (err) {
      console.error("Error extending market ad", err);
      res.status(500).json({ error: "فشل تمديد الإعلان" });
    }
  });
    // إعدادات عرض الموقع بعد البناء
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve(__dirname, "../dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../dist/index.html"));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  // تشغيل السيرفر
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

startServer();

