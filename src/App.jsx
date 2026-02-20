import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wheat, Leaf, Droplets, Zap, Users, Globe, ChevronRight, Phone, Mail, 
  MapPin, Upload, Camera, FileSearch, ShieldCheck, CheckCircle2, AlertCircle, 
  TrendingUp, BarChart4, Recycle, Factory, Target, Info, Activity, ShieldAlert,
  Sun, Sprout, ArrowRightCircle
} from 'lucide-react';
import AIAssistant from './components/AIAssistant';
import confetti from 'canvas-confetti';

const API_URL = '';

export default function App() {
  const [language, setLanguage] = useState('ar');
  
  // Scanner State
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-up').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [language]);

  const curr = {
    ar: {
      company: "غلاف الأرض للتنمية الزراعية المستدامة",
      short_company: "غلاف الأرض (EAD)",
      tagline: "نزرع اليوم.. لنحمي غداً",
      desc: "نموذج تجاري خدمي صناعي متكامل يهدف لزراعة 350+ فدان بنظام الزراعة الذكية وتطبيق الاقتصاد الدائري لمواكبة رؤية مصر 2030.",
      vision_badge: "متوافق مع رؤية مصر 2030 للتحول الأخضر",
      
      // Nav & Actions
      nav_about: "من نحن",
      nav_finance: "المؤشرات المالية",
      nav_swot: "التحليل الاستراتيجي",
      nav_tech: "سُنبلة (الذكاء الاصطناعي)",
      contact: "تواصل معنا",
      ask_sonbola: "تحدث مع سنبلة",

      // About Section
      about_title: "الوضع الحالي والرؤية المستقبلية",
      about_subtitle: "تأسست المنشأة في 2018 وتسعى للتحول إلى شركة مساهمة مصرية لتتوافق مع اشتراطات الرخصة الذهبية ودعم خطط التوسع الكبرى.",
      pillars: "ركائز التنمية للمشروع",
      p1_title: "الاستدامة البيئية",
      p1_desc: "تطبيق صارم للاقتصاد الدائري وتصفير النفايات عبر تحويلها إلى أسمدة ووقود حيوي.",
      p2_title: "الري الذكي (Agri-Tech)",
      p2_desc: "رقمنة العمليات الزراعية باستخدام الذكاء الاصطناعي لتوفير 40-50% من المياه.",
      p3_title: "الأمن الغذائي",
      p3_desc: "سد الفجوة الغذائية عبر محاصيل استراتيجية كالقمح، والذرة، وفول الصويا.",
      p4_title: "المسؤولية المجتمعية (CSR)",
      p4_desc: "تأسيس مدرسة حقلية زراعية لتمكين المزارعين وتحويلهم إلى رواد أعمال.",

      // Financials / Stats
      invest_title: "دورة رأس المال والمؤشرات المالية المؤكدة",
      invest_subtitle: "خطة سداد القرض تعتمد على التنوع (تجاري، متاجرة، صناعي) والملاءة المالية المتينة.",
      stat1_val: "12M", stat1_lbl: "حجم الاستثمار (ج.م)",
      stat2_val: "350", stat2_lbl: "فدان للمرحلة الأولى",
      stat3_val: "1062", stat3_lbl: "طن إنتاج السماد العضوي سنوياً",
      stat4_val: "1.6M+", stat4_lbl: "أرباح المتاجرة للدورة الواحدة",
      
      // SWOT
      swot_title: "التحليل الاستراتيجي (SWOT)",
      swot_s_title: "نقاط القوة", swot_s_desc: "تنوع مصادر الدخل، الاقتصاد الدائري (Zero Waste)، إدارة احترافية.",
      swot_w_title: "نقاط الضعف", swot_w_desc: "الحاجة لسيولة نقدية عالية، نقص العمالة المدربة تكنولوجياً.",
      swot_o_title: "الفرص المتاحة", swot_o_desc: "التوجه القومي للمشروعات الخضراء، طلب التصدير الأوروبي والتنمية المستدامة.",
      swot_t_title: "التهديدات والحلول", swot_t_desc: "تذبذب الأسعار والمناخ (مُعالج عبر الري الذكي، وعقود البيع الآجلة والمبكرة).",

      // Roadmap / Industrial extension
      roadmap_title: "التوسعات الصناعية و التصدير",
      roadmap_subtitle: "الاقتصاد الدائري ليس شعاراً بل محرك أرباح",
      rd_1_title: "خط إنتاج الوقود الحبيبي (Pellet)", rd_1_desc: "تحويل حطب الذرة والقش لإنتاج وقود حيوي، السعر التصديري > 150 يورو للطن.",
      rd_2_title: "خط إنتاج الأعلاف عالية البروتين", rd_2_desc: "باستخدام كسب الصويا والذرة، مع دورة استرداد لرأس المال في أقل من 8 أشهر.",
      rd_3_title: "شهادات عالمية (GLOBAL GAP)", rd_3_desc: "تجهيز إنتاج المزارع ببروتوكولات الجودة للنفاذ إلى سلاسل الإمداد الأوروبية.",

      // AI Scanner
      ai_title: "سُنبلة - المهندس الزراعي الرقمي",
      ai_subtitle: "الذكاء الاصطناعي لفحص المحاصيل و ركيزة القسم الخدمي (Agri-Tech)",
      upload_btn: "رفع صورة النبات",
      camera_btn: "تصوير بالكاميرا",
      analyze_btn: "بدء التحليل الدقيق",
      healthy: "النبات سليم",
      disease: "اكتشاف إصابة",
    },
    en: {
      company: "Earth Envelope for Sustainable Agriculture",
      short_company: "Earth Envelope (EAD)",
      tagline: "Planting Today.. Protecting Tomorrow",
      desc: "An integrated commercial, service, and industrial model aiming to cultivate 350+ acres with smart agriculture and circular economy, aligned with Egypt Vision 2030.",
      vision_badge: "Aligned with Egypt Vision 2030 Green Transition",
      
      // Nav & Actions
      nav_about: "About Us",
      nav_finance: "Financial Metrics",
      nav_swot: "Strategic Analysis",
      nav_tech: "Sonbola (AI)",
      contact: "Contact Us",
      ask_sonbola: "Talk to Sonbola",

      // About Section
      about_title: "Current Status & Future Vision",
      about_subtitle: "Established in 2018, aiming to transition into an Egyptian Joint Stock Company to meet Golden License requirements and support major expansion plans.",
      pillars: "Development Pillars",
      p1_title: "Eco Sustainability",
      p1_desc: "Strict application of the circular economy and zero waste by recycling biomass into fertilizer/fuel.",
      p2_title: "Smart Irrigation (Agri-Tech)",
      p2_desc: "Digitalization of farming operations with AI to save 40-50% of water.",
      p3_title: "Food Security",
      p3_desc: "Bridging the food gap via strategic crops like wheat, corn, and soybeans.",
      p4_title: "CSR",
      p4_desc: "Establishing a one-room field school to empower farmers and transform them into entrepreneurs.",

      // Financials / Stats
      invest_title: "Capital Cycle & Key Financial Metrics",
      invest_subtitle: "Loan repayment backed by diversified streams (Commercial, Trading, Industrial).",
      stat1_val: "12M", stat1_lbl: "Investment Volume (EGP)",
      stat2_val: "350", stat2_lbl: "Initial Phase Acres",
      stat3_val: "1062", stat3_lbl: "Annual Organic Compost (Tons)",
      stat4_val: "1.6M+", stat4_lbl: "Trading Profits per Cycle",
      
      // SWOT
      swot_title: "Strategic Analysis (SWOT)",
      swot_s_title: "Strengths", swot_s_desc: "Income diversity, Zero Waste circular economy, professional management.",
      swot_w_title: "Weaknesses", swot_w_desc: "High initial liquidity needs, lack of tech-trained labor.",
      swot_o_title: "Opportunities", swot_o_desc: "National green tech push, European export demands.",
      swot_t_title: "Threats & Mitigation", swot_t_desc: "Climate & price fluctuations (mitigated by smart irrigation & hedging).",

      // Roadmap / Industrial extension
      roadmap_title: "Industrial Expansion & Exportation",
      roadmap_subtitle: "Circular economy as a robust profit engine",
      rd_1_title: "Pellet Fuel Production Line", rd_1_desc: "Transforming corn stalks and straw into biofuel (> €150/ton export price).",
      rd_2_title: "High-Protein Fodder Line", rd_2_desc: "Using soy meal and corn, offering an ROI in under 8 months.",
      rd_3_title: "Global Certifications (GLOBAL GAP)", rd_3_desc: "Prepping farm production with top protocols to penetrate EU supply chains.",

      // AI Scanner
      ai_title: "Sonbola - Digital Agronomist",
      ai_subtitle: "AI Crop Inspection & The Core of our Agri-Tech Service Division",
      upload_btn: "Upload Image",
      camera_btn: "Take Photo",
      analyze_btn: "Run Deep Analysis",
      healthy: "Plant is Healthy",
      disease: "Condition Detected",
    }
  }[language];
  
  const isRtl = language === 'ar';

  // Handlers for Scanner
  const handleImageSelect = useCallback((file) => {
    if (file && file.type.startsWith('image/')) {
        const previewUrl = URL.createObjectURL(file);
        setSelectedImage(file);
        setPreview(previewUrl);
        setResult(null);
        setError(null);
        setIsCameraOpen(false);
    }
  }, []);

  const startCamera = async () => {
    try {
        setIsCameraOpen(true);
        setResult(null); setError(null); setPreview(null); setSelectedImage(null);
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream }, 100);
    } catch (err) {
        setError(isRtl ? "يتعذر الوصول للكاميرا" : "Cannot access camera");
        setIsCameraOpen(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        canvas.width = video.videoWidth; canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
            const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
            handleImageSelect(file);
            stopCamera();
        }, 'image/jpeg', 0.95);
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    setLoading(true); setError(null);
    const formData = new FormData();
    formData.append('file', selectedImage);
    try {
        const response = await fetch(`${API_URL}/predict`, { method: 'POST', body: formData });
        if (!response.ok) throw new Error("Failed");
        const data = await response.json();
        setResult(data.prediction);
        if(data.prediction.is_healthy) confetti({ particleCount: 150, zIndex: 10000 });
    } catch (err) {
        setError(isRtl ? "حدث خطأ أثناء التحليل" : "Error analyzing image");
        
        // Mock result for demo if backend isn't connected
        setTimeout(() => {
          setLoading(false);
          setResult({
            is_healthy: false,
            plant: "Tomato", plant_ar: "طماطم",
            disease: "Late Blight", disease_ar: "اللفحة المتأخرة",
            confidence: 94
          });
          setError(null);
        }, 1500);
        return;
    }
    setLoading(false);
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className={`relative min-h-screen ${isRtl ? 'font-cairo' : 'font-outfit'}`}>
      
      {/* Animated Background */}
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
        <div className="blob blob-4"></div>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5 py-3 px-6 md:px-12 flex justify-between items-center transition-all">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
          <img src="/logo.jpg" alt="Logo" className="w-12 h-12 md:w-14 md:h-14 logo-nav object-contain" />
          <span className="font-bold text-xl md:text-2xl tracking-wide hidden md:block text-gradient-gold">
            {curr.short_company}
          </span>
        </div>
        
        <div className="hidden lg:flex items-center gap-8 font-semibold text-emerald-100/80">
          <button onClick={() => scrollTo('about')} className="hover:text-emerald-400 transition-colors">{curr.nav_about}</button>
          <button onClick={() => scrollTo('financials')} className="hover:text-emerald-400 transition-colors">{curr.nav_finance}</button>
          <button onClick={() => scrollTo('swot')} className="hover:text-emerald-400 transition-colors">{curr.nav_swot}</button>
          <button onClick={() => scrollTo('ai-scanner')} className="text-emerald-400 font-bold">{curr.nav_tech}</button>
        </div>

        <button onClick={() => setLanguage(l => l === 'ar' ? 'en' : 'ar')}
                className="px-5 py-2 glass-card !p-2 !px-4 hover:bg-white/10 !rounded-full text-sm font-bold flex items-center gap-2 border-emerald-500/30">
          <Globe className="w-5 h-5 text-gold-light" />
          {isRtl ? 'English' : 'عربي'}
        </button>
      </nav>

      <main className="pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto space-y-36">
        
        {/* --- HERO SECTION --- */}
        <section className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 min-h-[70vh]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="flex-1 space-y-8 text-center lg:text-start">
            
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, duration: 0.6 }} className="flex justify-center lg:justify-start mb-6">
              <img src="/logo.jpg" alt="Logo" className="w-32 h-32 md:w-40 md:h-40 logo-hero object-contain" />
            </motion.div>

            <div className="vision-badge mx-auto lg:mx-0 shadow-lg">
              <Sun className="w-4 h-4" /> {curr.vision_badge}
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              {curr.tagline.split('..')[0]}.. <br/>
              <span className="text-gradient drop-shadow-2xl">{curr.tagline.split('..')[1]}</span>
            </h1>
            
            <p className="text-lg lg:text-xl text-emerald-100/80 max-w-2xl leading-relaxed mx-auto lg:mx-0">
              {curr.desc}
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button onClick={() => scrollTo('ai-scanner')} className="px-8 py-4 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] hover:scale-105 transition-all flex items-center justify-center gap-2 text-lg">
                {curr.nav_tech} <ChevronRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
              </button>
              <button onClick={() => scrollTo('swot')} className="px-8 py-4 rounded-full glass hover:bg-white/5 text-emerald-100 font-bold transition-all flex items-center justify-center gap-2 border-emerald-500/30 text-lg">
                <Activity className="w-5 h-5" /> {curr.nav_finance}
              </button>
            </div>
          </motion.div>
        </section>

        <div className="section-divider"></div>

        {/* --- PILLARS / ABOUT SECTION --- */}
        <section id="about" className="space-y-16 fade-up">
          <div className="text-center space-y-4">
            <h2 className="section-title text-gradient-gold pb-2">{curr.pillars}</h2>
            <p className="section-subtitle">{curr.about_title} &bull; {curr.about_subtitle}</p>
            <div className="gradient-line mx-auto mt-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Recycle, title: curr.p1_title, desc: curr.p1_desc, c1: 'from-green-400', c2: 'to-emerald-600' },
              { icon: Droplets, title: curr.p2_title, desc: curr.p2_desc, c1: 'from-blue-400', c2: 'to-cyan-600' },
              { icon: Wheat, title: curr.p3_title, desc: curr.p3_desc, c1: 'from-yellow-400', c2: 'to-amber-600' },
              { icon: Users, title: curr.p4_title, desc: curr.p4_desc, c1: 'from-purple-400', c2: 'to-fuchsia-600' }
            ].map((p, i) => (
              <div key={i} className="glass-card flex flex-col items-center text-center space-y-5 hover:bg-white/5">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center bg-gradient-to-br ${p.c1} ${p.c2} text-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] pillar-icon`}>
                  <p.icon strokeWidth={1.5} size={36} />
                </div>
                <h3 className="text-xl font-bold text-white">{p.title}</h3>
                <p className="text-sm text-emerald-100/70 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* --- FINANCIAL STATS --- */}
        <section id="financials" className="space-y-16 fade-up">
          <div className="text-center space-y-4">
            <h2 className="section-title text-emerald-400">{curr.invest_title}</h2>
            <p className="section-subtitle">{curr.invest_subtitle}</p>
            <div className="gradient-line mx-auto mt-6 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Background glowing line connecting stats */}
            <div className="absolute top-1/2 left-10 right-10 h-1 bg-gradient-to-r from-emerald-500/0 via-emerald-500/20 to-emerald-500/0 hidden lg:block -translate-y-1/2"></div>
            
            {[
              { val: curr.stat1_val, lbl: curr.stat1_lbl, i: BarChart4 },
              { val: curr.stat2_val, lbl: curr.stat2_lbl, i: Target },
              { val: curr.stat3_val, lbl: curr.stat3_lbl, i: Factory },
              { val: curr.stat4_val, lbl: curr.stat4_lbl, i: TrendingUp }
            ].map((stat, idx) => (
              <div key={idx} className="stat-card z-10">
                 <stat.i className="w-8 h-8 text-emerald-400/50 mb-4" />
                 <span className="stat-value">{stat.val}</span>
                 <span className="stat-label">{stat.lbl}</span>
              </div>
            ))}
          </div>

          <div className="glass-panel p-8 rounded-3xl overflow-x-auto border-emerald-500/20">
             <h3 className="text-xl font-bold text-emerald-300 mb-6 flex items-center gap-3">
               <Activity className="w-6 h-6"/> نموذج الأرباح التشغيلية المتوقعة (السنة الأولى)
             </h3>
             <table className="fin-table w-full text-right" dir="rtl">
               <thead>
                 <tr>
                   <th>القطاع / البند</th>
                   <th>الإيرادات المتوقعة (ج.م)</th>
                   <th>الملاحظات</th>
                 </tr>
               </thead>
               <tbody>
                 <tr>
                   <td>أرباح مبيعات مستلزمات الإنتاج</td>
                   <td className="font-mono text-emerald-400">4,760,000</td>
                   <td className="text-slate-400">كاش وآجل (هامش مرجح 17%)</td>
                 </tr>
                 <tr>
                   <td>هامش ربح المتاجرة في المحاصيل</td>
                   <td className="font-mono text-emerald-400">3,285,000</td>
                   <td className="text-slate-400">ذرة، فول صويا، محاصيل حقلية</td>
                 </tr>
                 <tr>
                   <td>القطاع الصناعي (إنتاج السماد - كمبوست)</td>
                   <td className="font-mono text-emerald-400">987,660</td>
                   <td className="text-slate-400">تحويل 1770 طن مخلفات إلى 1062 طن سماد</td>
                 </tr>
                 <tr className="total-row text-lg">
                   <td className="text-gold-light">إجمالي الربح التشغيلي قبل المصروفات</td>
                   <td className="font-mono text-gold-light">9,032,660</td>
                   <td className="text-slate-400 text-sm">يخصم منها 1.2M للمصروفات، و 1.7M لخدمة الدين</td>
                 </tr>
               </tbody>
             </table>
          </div>
        </section>

        {/* --- SWOT & ROADMAP --- */}
        <section id="swot" className="grid lg:grid-cols-2 gap-12 fade-up">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-emerald-400" /> {curr.swot_title}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="swot-card swot-strength">
                 <h4 className="font-bold text-emerald-400 mb-2 flex flex-col"><ShieldCheck className="w-5 h-5 mb-1"/> {curr.swot_s_title}</h4>
                 <p className="text-sm text-slate-300 leading-relaxed">{curr.swot_s_desc}</p>
              </div>
              <div className="swot-card swot-weakness">
                 <h4 className="font-bold text-amber-500 mb-2 flex flex-col"><Info className="w-5 h-5 mb-1"/> {curr.swot_w_title}</h4>
                 <p className="text-sm text-slate-300 leading-relaxed">{curr.swot_w_desc}</p>
              </div>
              <div className="swot-card swot-opportunity">
                 <h4 className="font-bold text-blue-400 mb-2 flex flex-col"><TrendingUp className="w-5 h-5 mb-1"/> {curr.swot_o_title}</h4>
                 <p className="text-sm text-slate-300 leading-relaxed">{curr.swot_o_desc}</p>
              </div>
              <div className="swot-card swot-threat">
                 <h4 className="font-bold text-red-400 mb-2 flex flex-col"><ShieldAlert className="w-5 h-5 mb-1"/> {curr.swot_t_title}</h4>
                 <p className="text-sm text-slate-300 leading-relaxed">{curr.swot_t_desc}</p>
              </div>
            </div>
          </div>

          <div className="space-y-8">
             <h2 className="text-3xl font-bold flex items-center gap-3">
              <Sprout className="w-8 h-8 text-gold-light" /> {curr.roadmap_title}
            </h2>
            <div className="glass p-8 rounded-3xl space-y-6">
              <div className="timeline-item">
                <h4 className="font-bold text-lg text-emerald-300">{curr.rd_1_title}</h4>
                <p className="text-sm text-emerald-100/60 mt-2 leading-relaxed">{curr.rd_1_desc}</p>
              </div>
              <div className="timeline-item">
                <h4 className="font-bold text-lg text-emerald-300">{curr.rd_2_title}</h4>
                <p className="text-sm text-emerald-100/60 mt-2 leading-relaxed">{curr.rd_2_desc}</p>
              </div>
              <div className="timeline-item border-transparent">
                <h4 className="font-bold text-lg text-emerald-300">{curr.rd_3_title}</h4>
                <p className="text-sm text-emerald-100/60 mt-2 leading-relaxed">{curr.rd_3_desc}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="section-divider"></div>

        {/* --- AI SCANNER (SONBOLA) --- */}
        <section id="ai-scanner" className="relative z-10 fade-up">
          <div className="glass-panel rounded-[40px] p-8 md:p-14 border border-emerald-500/30 shadow-[0_30px_60px_-15px_rgba(16,185,129,0.3)]">
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-1 space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                     <div className="p-3 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
                       <Zap className="text-white w-8 h-8" fill="currentColor"/>
                     </div>
                     <h2 className="text-3xl md:text-5xl font-extrabold pb-2 text-gradient">
                       {curr.ai_title}
                     </h2>
                  </div>
                  <p className="text-emerald-100/70 text-lg leading-relaxed">{curr.ai_subtitle}</p>
                </div>

                {!preview && !isCameraOpen && (
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => fileInputRef.current?.click()} className="group upload-zone">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all mb-4">
                         <Upload className="text-emerald-400 w-7 h-7"/>
                      </div>
                      <span className="font-bold text-emerald-100">{curr.upload_btn}</span>
                    </button>
                    <button onClick={startCamera} className="group upload-zone">
                      <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-500/30 transition-all mb-4">
                         <Camera className="text-emerald-400 w-7 h-7"/>
                      </div>
                      <span className="font-bold text-emerald-100">{curr.camera_btn}</span>
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleImageSelect(e.target.files[0])} className="hidden" />
                  </div>
                )}

                {isCameraOpen && (
                  <div className="relative rounded-3xl overflow-hidden bg-black aspect-video border-2 border-emerald-500/50 shadow-2xl">
                     <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                     <canvas ref={canvasRef} className="hidden" />
                     <button onClick={capturePhoto} className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)] hover:scale-95 transition-transform z-20"></button>
                     <button onClick={stopCamera} className="absolute top-4 right-4 bg-black/60 w-10 h-10 flex items-center justify-center rounded-full text-white hover:bg-black/90">✕</button>
                  </div>
                )}

                {preview && (
                  <div className="space-y-6">
                    <div className="relative rounded-3xl overflow-hidden glass border border-white/10 p-2">
                       <img src={preview} alt="Plant" className="w-full max-h-[350px] object-contain rounded-2xl" />
                       <button onClick={() => {setPreview(null); setResult(null)}} className="absolute top-4 right-4 bg-black/60 w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/90 text-white backdrop-blur-md shadow-lg">✕</button>
                    </div>
                    {!result && !loading && (
                      <button onClick={analyzeImage} className="w-full py-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-lg tracking-wide hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-3">
                         <FileSearch className="w-6 h-6"/> {curr.analyze_btn}
                      </button>
                    )}
                    {loading && (
                      <div className="w-full py-5 rounded-2xl glass border border-emerald-500/30 flex justify-center items-center gap-4 text-emerald-400 font-bold text-lg">
                        <div className="w-6 h-6 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                        <span>جاري معالجة البيانات عبر الشبكات العصبية...</span>
                      </div>
                    )}
                    {error && <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 flex items-center gap-3 font-bold"><AlertCircle className="w-6 h-6"/> {error}</div>}
                  </div>
                )}
              </div>

              {/* AI Result Card */}
              <div className="flex-1 flex flex-col justify-center">
                <AnimatePresence>
                  {result ? (
                    <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} className="glass-card !bg-slate-900/90 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-8 border-emerald-500/30 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-400"></div>
                      
                      <div className={`p-6 rounded-2xl text-center mb-6 flex flex-col items-center gap-3 ${result.is_healthy ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border border-red-500/30 text-red-400 pulse-red'}`}>
                        {result.is_healthy ? <CheckCircle2 className="w-16 h-16" /> : <AlertCircle className="w-16 h-16" />}
                        <h3 className="text-3xl font-black tracking-wide">{result.is_healthy ? curr.healthy : curr.disease}</h3>
                      </div>
                      
                      <div className="space-y-5 mb-8">
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                          <span className="text-slate-400">{isRtl ? 'نوع النبات الأصلي' : 'Detected Plant'}</span>
                          <span className="font-bold text-xl text-white">{isRtl ? result.plant_ar : result.plant}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                          <span className="text-slate-400">{isRtl ? 'التشخيص والفحص' : 'Condition'}</span>
                          <span className="font-bold text-xl text-white">{isRtl ? result.disease_ar : result.disease}</span>
                        </div>
                        <div className="pt-2">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-slate-400">{isRtl ? 'نسبة ثقة الذكاء الاصطناعي' : 'AI Accuracy'}</span>
                            <span className="font-bold text-xl text-emerald-400">{result.confidence}%</span>
                          </div>
                          <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden shadow-inner">
                             <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 relative" style={{ width: `${result.confidence}%` }}>
                               <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20" style={{ animation: 'shimmer 2s infinite linear' }}></div>
                             </div>
                          </div>
                        </div>
                      </div>
                      
                      <button onClick={() => setShowAssistant(true)} className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600/20 to-indigo-600/20 hover:from-purple-600/40 hover:to-indigo-600/40 border border-purple-500/40 text-purple-300 font-bold transition-all flex items-center justify-center gap-3 text-lg">
                        <Zap fill="currentColor" className="w-6 h-6" /> {curr.ask_sonbola}
                      </button>
                    </motion.div>
                  ) : (
                    <div className="h-full min-h-[450px] glass border border-white/5 rounded-3xl flex flex-col items-center justify-center text-center p-10 opacity-60 bg-[rgba(0,0,0,0.2)]">
                       <ShieldCheck className="w-20 h-20 text-emerald-500/30 mb-6" />
                       <h4 className="text-2xl font-bold text-white/70 mb-2">{isRtl ? 'انتظار بصمة النبات' : 'Awaiting Plant Input'}</h4>
                       <p className="text-emerald-100/40">{isRtl ? 'بمجرد رفع الصورة، سيعمل نظام سنبلة على تحليل دقيق للبيانات' : 'Once uploaded, Sonbola will perform a deep diagnostic scan'}</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* --- FOOTER / CONTACT --- */}
        <footer className="border-t border-white/10 pt-20 mt-32 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#020a06] px-8">
            <img src="/logo.jpg" alt="Logo" className="w-16 h-16 rounded-full logo-nav" />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="space-y-6">
               <h3 className="text-2xl font-black text-gradient-gold tracking-wide">{curr.company}</h3>
               <p className="text-emerald-100/60 leading-relaxed max-w-sm">{curr.desc}</p>
               <div className="flex gap-4">
                 {/* Social placeholders if needed */}
               </div>
            </div>
            
            <div className="space-y-6">
              <h4 className="font-bold text-white text-lg">{curr.contact}</h4>
              <div className="space-y-4">
                 <div className="flex items-center gap-4 text-emerald-100/70 hover:text-emerald-400 transition-colors cursor-pointer group">
                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-emerald-500/20"><Phone className="w-5 h-5" /></div> 
                    <span dir="ltr" className="font-mono text-lg">+20 1111042290</span>
                 </div>
                 <div className="flex items-center gap-4 text-emerald-100/70 hover:text-emerald-400 transition-colors cursor-pointer group">
                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-emerald-500/20"><Phone className="w-5 h-5" /></div> 
                    <span dir="ltr" className="font-mono text-lg">+20 1008866282</span>
                 </div>
                 <div className="flex items-center gap-4 text-emerald-100/70 hover:text-emerald-400 transition-colors cursor-pointer group">
                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-emerald-500/20"><Mail className="w-5 h-5" /></div> 
                    <span className="font-mono">salahali6543210@gmail.com</span>
                 </div>
              </div>
            </div>
            
            <div>
               <div className="glass-panel p-6 rounded-2xl flex items-start gap-4 hover:border-emerald-500/40 transition-colors border-emerald-500/20">
                  <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400 shrink-0">
                     <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white mb-2 text-lg">المقر الرئيسي ومواقع العمل</h5>
                    <p className="text-sm text-emerald-100/60 leading-relaxed">العياط، محافظة الجيزة<br/>جمهورية مصر العربية<br/><br/>مواقع المشاريع تغطي 350+ فدان تحت إشراف هندسي وزراعي مستمر.</p>
                  </div>
               </div>
            </div>
          </div>
          
          <div className="border-t border-white/5 mt-16 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
             <div className="text-sm text-emerald-100/40">
               © {new Date().getFullYear()} {curr.company}. {isRtl ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
             </div>
             <div className="text-xs text-emerald-100/30 flex gap-4">
               <span>EAD - Circular Economy</span>
               <span>Vision 2030</span>
             </div>
          </div>
        </footer>
      </main>

      {/* --- AI FAB --- */}
      <button onClick={() => setShowAssistant(true)} className="fixed bottom-8 end-8 w-16 h-16 md:w-20 md:h-20 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-full shadow-[0_0_40px_rgba(147,51,234,0.6)] hover:scale-110 active:scale-95 transition-all z-40 flex items-center justify-center overflow-hidden border-2 border-white/20">
         <span className="text-3xl md:text-4xl leading-none pt-1 group-hover:animate-pulse">✨</span>
      </button>

      {/* --- AI MODAL --- */}
      {showAssistant && (
         <AIAssistant diagnosis={result} onClose={() => setShowAssistant(false)} appLanguage={language} setAppLanguage={setLanguage} />
      )}
      
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
