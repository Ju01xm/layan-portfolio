/* ==========================================
   ADMIN SCRIPT — Layan Alamrah Portfolio
   Professional Image Upload using Cloudinary 
   ========================================== */

// ==========================================
// 1. إعدادات قاعدة البيانات (Firebase Firestore) 
// ==========================================
let db = null;
let firestoreDoc = null;
let getDoc = null;
let setDoc = null;

async function loadFirebase() {
    try {
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js");
        const fs = await import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

        const firebaseConfig = {
            apiKey: "AIzaSyBIxhqqk425SFWQXe6Y3KThpV83v5CJvLA",
            authDomain: "layan-portfolio.firebaseapp.com",
            projectId: "layan-portfolio",
            storageBucket: "layan-portfolio.firebasestorage.app",
            messagingSenderId: "568091761785",
            appId: "1:568091761785:web:a0020d59bf58167f7408a8"
        };

        const app = initializeApp(firebaseConfig);
        db = fs.getFirestore(app);
        firestoreDoc = fs.doc;
        getDoc = fs.getDoc;
        setDoc = fs.setDoc;

        return true;
    } catch (e) {
        console.warn("Firebase load failed:", e.message);
        return false;
    }
}

// ==========================================
// 🌟 دالة الرفع السحابي الاحترافية (Cloudinary) 🌟
// ==========================================
const CLOUD_NAME = "dzzxebvvl"; 
const UPLOAD_PRESET = "layan-alamrah";

async function uploadImageProfessional(file) {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
        throw new Error("يرجى إعداد Cloudinary أولاً");
    }

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData
        });
        
        const data = await response.json();
        
        if (data.secure_url) {
            return data.secure_url; 
        } else {
            throw new Error(data.error.message || "خطأ في رفع الصورة للسيرفر");
        }
    } catch (error) {
        throw new Error("فشل الرفع: " + error.message);
    }
}

// ==========================================
// 2. المحتوى الافتراضي (Default Content)
// ==========================================
const DEFAULTS = {
    en: {
        theme: { accentColor: '#4052FF' },
        titles: { about: 'ABOUT ME', success: 'SUCCESS STORIES', blog: 'MY BLOGS', tools: 'CORE TOOLS' },
        hero: { greeting: "HI! I'M LAYAN ALAMRAH", btnText: "Get in Touch →", bgImage: "", staticText: "I have Expertise in ", typewriter: "Branding, Corporate Communication, Marketing, Content Creation" },
        services: [
            { num: '#01', title: 'Brand\nManagement' }, { num: '#02', title: 'Content\nStrategy' },
            { num: '#03', title: 'Digital\nMarketing' }, { num: '#04', title: 'Event\nManagement' }, { num: '#05', title: 'Corporate\nCommunications' }
        ],
        tools: [
            { type: 'text', label: 'Ai', value: '' }, { type: 'text', label: 'Ps', value: '' }, { type: 'text', label: 'Id', value: '' },
            { type: 'image', label: 'Office', value: 'images/office.png' }, { type: 'icontext', label: 'Figma', value: 'figma' },
            { type: 'image', label: 'Canva', value: 'images/canva.png' }, { type: 'icontext', label: 'Google Analytics', value: 'googleanalytics' }
        ],
        about: [
            { title: 'CORPORATE\nCOMMUNICATIONS', text: 'Corporate communications professional experienced in executive messaging...' },
            { title: 'BRAND &\nMARKETING', text: 'Experienced in brand management, digital marketing, and content strategy.' },
            { title: 'PROFESSIONAL\nDEVELOPMENT', text: 'Industrial Design graduate with PMP and Agile Scrum certifications.' }
        ],
        stories: [
            { title: 'Brand Identity\n& Positioning', text: 'Led the development of brand and communication assets.', imageUrl: '' },
            { title: 'Corporate\nCommunications', text: 'Led corporate communications, preparing leadership presentations.', imageUrl: '' },
            { title: 'Exhibition & Industry\nBrand Presence', text: 'Led brand presence at industry exhibitions and corporate events.', imageUrl: '' }
        ],
        footer: { title: 'Get in Touch', email: '', linkedin: '', twitter: '', insta: '' },
    },
    ar: {
        theme: { accentColor: '#4052FF' },
        titles: { about: 'نبذة عني', success: 'قصص النجاح', blog: 'المدونة', tools: 'الأدوات الأساسية' },
        hero: { greeting: "مرحباً! أنا ليان العمرة", btnText: "تواصلي معي ←", bgImage: "", staticText: "لدي خبرة في ", typewriter: "إدارة العلامات التجارية, التواصل المؤسسي, التسويق, صناعة المحتوى" },
        services: [
            { num: '#01', title: 'إدارة\nالعلامة التجارية' }, { num: '#02', title: 'استراتيجية\nالمحتوى' },
            { num: '#03', title: 'التسويق\nالرقمي' }, { num: '#04', title: 'إدارة\nالفعاليات' }, { num: '#05', title: 'الاتصالات\nالمؤسسية' }
        ],
        tools: [
            { type: 'text', label: 'Ai', value: '' }, { type: 'text', label: 'Ps', value: '' }, { type: 'text', label: 'Id', value: '' },
            { type: 'image', label: 'Office', value: 'images/office.png' }, { type: 'icontext', label: 'Figma', value: 'figma' },
            { type: 'image', label: 'Canva', value: 'images/canva.png' }, { type: 'icontext', label: 'Google Analytics', value: 'googleanalytics' }
        ],
        about: [
            { title: 'الاتصالات\nالمؤسسية', text: 'متخصصة في الاتصالات المؤسسية مع خبرة في رسائل القيادة...' },
            { title: 'العلامة التجارية\nوالتسويق', text: 'خبرة في إدارة العلامة التجارية والتسويق الرقمي واستراتيجية المحتوى.' },
            { title: 'التطوير\nالمهني', text: 'خريجة تصميم صناعي حاصلة على شهادات PMP وAgile Scrum.' }
        ],
        stories: [
            { title: 'هوية العلامة التجارية\nوتموضعها', text: 'قادت تطوير أصول العلامة التجارية والاتصالات.', imageUrl: '' },
            { title: 'الاتصالات\nالمؤسسية', text: 'قادت الاتصالات المؤسسية وأعدّت عروض القيادة.', imageUrl: '' },
            { title: 'الحضور في المعارض\nوالفعاليات', text: 'قادت تخطيط وتنفيذ حضور العلامة التجارية في المعارض.', imageUrl: '' }
        ],
        footer: { title: 'تواصلي معي', email: '', linkedin: '', twitter: '', insta: '' },
    }
};

// ==========================================
// 3. حالة لوحة التحكم والأمان (State & Auth)
// ==========================================
let content = { en: null, ar: null };
let editLang = 'en';
let currentPanel = 'hero';

const DEFAULT_PASSWORD = 'Layan2026';
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 10 * 60 * 1000;

let fails = parseInt(localStorage.getItem('adm_fails') || '0');
let lockUntil = parseInt(localStorage.getItem('adm_lock') || '0');

function getPassword() { return localStorage.getItem('admin_pass') || DEFAULT_PASSWORD; }

function isLocked() {
    if (Date.now() < lockUntil) return true;
    if (lockUntil && Date.now() >= lockUntil) {
        fails = 0; lockUntil = 0;
        localStorage.removeItem('adm_fails');
        localStorage.removeItem('adm_lock');
    }
    return false;
}

async function tryLogin() {
    if (isLocked()) {
        showErr(`🔒 مقفل — انتظري ${Math.ceil((lockUntil - Date.now()) / 60000)} دقيقة`);
        return;
    }
    const val = document.getElementById('passInput').value;
    if (val === getPassword()) {
        fails = 0; lockUntil = 0;
        localStorage.removeItem('adm_fails');
        localStorage.removeItem('adm_lock');
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('adminApp').style.display = 'block';
        initAdmin();
    } else {
        fails++;
        localStorage.setItem('adm_fails', fails);
        if (fails >= MAX_ATTEMPTS) {
            lockUntil = Date.now() + LOCKOUT_MS;
            localStorage.setItem('adm_lock', lockUntil);
        }
        const inp = document.getElementById('passInput');
        inp.classList.add('shake');
        setTimeout(() => inp.classList.remove('shake'), 400);
        inp.value = '';
        const left = MAX_ATTEMPTS - fails;
        showErr(left > 0 ? `كلمة المرور غير صحيحة — تبقى ${left} محاولة` : '🔒 تم قفل الدخول لمدة 10 دقائق');
    }
}

function showErr(m) { document.getElementById('loginErr').textContent = m; }

function doLogout() {
    document.getElementById('adminApp').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('passInput').value = '';
}

// ==========================================
// 4. التهيئة وجلب البيانات (Init & Fetch)
// ==========================================
async function initAdmin() {
    toast('⏳ جاري تحميل البيانات...', '');
    const firebaseOK = await loadFirebase();

    if (firebaseOK && db) {
        try {
            const [snapEN, snapAR] = await Promise.all([
                getDoc(firestoreDoc(db, 'site', 'content_en')),
                getDoc(firestoreDoc(db, 'site', 'content_ar')),
            ]);
            content.en = snapEN.exists() ? { ...JSON.parse(JSON.stringify(DEFAULTS.en)), ...snapEN.data() } : JSON.parse(JSON.stringify(DEFAULTS.en));
            content.ar = snapAR.exists() ? { ...JSON.parse(JSON.stringify(DEFAULTS.ar)), ...snapAR.data() } : JSON.parse(JSON.stringify(DEFAULTS.ar));
            toast('✅ تم تحميل البيانات', 'ok');
        } catch (e) {
            console.warn('Firestore read failed:', e.message);
            content.en = JSON.parse(JSON.stringify(DEFAULTS.en));
            content.ar = JSON.parse(JSON.stringify(DEFAULTS.ar));
            toast('⚠️ Firebase متصل لكن القراءة فشلت — تعمل بالبيانات الافتراضية', 'err');
        }
    } else {
        content.en = JSON.parse(JSON.stringify(DEFAULTS.en));
        content.ar = JSON.parse(JSON.stringify(DEFAULTS.ar));
        toast('⚠️ تعذّر الاتصال بـ Firebase — تعمل بالبيانات الافتراضية', 'err');
    }

    renderAll();
    switchPanel('hero');

    await loadBlogPosts();
    bindImageEvents();
}

// ==========================================
// 5. التبديل (UI Controls)
// ==========================================
const META = {
    hero: { title: 'الهوية والهيرو', sub: 'تعديل الألوان، صورة الهيرو، والنصوص' },
    services: { title: 'الخدمات', sub: 'إضافة أو تعديل أو حذف الخدمات' },
    tools: { title: 'Core Tools', sub: 'تعديل الأدوات المعروضة' },
    about: { title: 'About Me', sub: 'تعديل بطاقات التعريف' },
    stories: { title: 'Success Stories', sub: 'تعديل قصص النجاح وإضافة صور' },
    footer: { title: 'Footer & Contact', sub: 'معلومات التواصل والروابط' },
    blog: { title: 'إدارة المدونة', sub: 'إضافة المقالات وتعديلها وحذفها' },
    security: { title: 'كلمة المرور', sub: 'تغيير كلمة مرور لوحة التحكم' },
};

function switchPanel(id) {
    currentPanel = id;
    document.querySelectorAll('.nav-item[data-panel]').forEach(n => n.classList.remove('active'));
    document.querySelector(`.nav-item[data-panel="${id}"]`)?.classList.add('active');
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`panel-${id}`)?.classList.add('active');
    const m = META[id] || {};
    document.getElementById('pTitle').textContent = m.title || id;
    document.getElementById('pSub').textContent = m.sub || '';

    const langTabs = document.querySelector('.lang-tabs');
    if (langTabs) {
        langTabs.style.display = (id === 'blog' || id === 'security') ? 'none' : '';
    }
}

function setEditLang(lang) {
    editLang = lang;
    document.querySelectorAll('.lang-tab').forEach(t => t.classList.toggle('active', t.dataset.lang === lang));
    const main = document.querySelector('.admin-main');
    if (main) main.dir = lang === 'ar' ? 'rtl' : 'ltr';
    renderAll();
}

window.toggleCard = head => {
    head.classList.toggle('open');
    head.nextElementSibling.classList.toggle('collapsed');
};

function toast(msg, type = '') {
    const el = document.getElementById('toast');
    el.textContent = msg; el.className = `toast ${type} show`;
    clearTimeout(el._t); el._t = setTimeout(() => el.classList.remove('show'), 3500);
}

// ==========================================
// 6. حفظ وتجميع البيانات (Save Data)
// ==========================================
function collectPanel() {
    const c = content[editLang];
    switch (currentPanel) {
        case 'hero':
            c.hero.greeting = document.getElementById('heroGreeting').value;
            c.hero.btnText = document.getElementById('heroBtnText').value;
            if(document.getElementById('heroTypewriter')) {
                c.hero.typewriter = document.getElementById('heroTypewriter').value;
            }
            // ✅ النص الثابت — يُحفظ لكل لغة منفصلة
            if (document.getElementById('heroStaticEN')) {
                content.en.hero.staticText = document.getElementById('heroStaticEN').value;
                content.ar.hero.staticText = document.getElementById('heroStaticAR').value;
            }
            if (document.getElementById('themeColor')) {
                const colorVal = document.getElementById('themeColor').value;
                if (!content.en.theme) content.en.theme = {};
                if (!content.ar.theme) content.ar.theme = {};
                content.en.theme.accentColor = colorVal;
                content.ar.theme.accentColor = colorVal;
            }
            break;
        case 'footer':
            c.footer.title = document.getElementById('footerTitle').value;
            const emailVal = document.getElementById('footerEmail').value;
            const linkedinVal = document.getElementById('footerLinkedin').value;
            const twitterVal = document.getElementById('footerTwitter').value;
            const instaVal = document.getElementById('footerInsta').value;
            content.en.footer.email = emailVal; content.ar.footer.email = emailVal;
            content.en.footer.linkedin = linkedinVal; content.ar.footer.linkedin = linkedinVal;
            content.en.footer.twitter = twitterVal; content.ar.footer.twitter = twitterVal;
            content.en.footer.insta = instaVal; content.ar.footer.insta = instaVal;
            break;
    }
}

async function savePanel() {
    if (currentPanel === 'security') return;
    collectPanel();
    const btn = document.getElementById('saveBtn');
    btn.textContent = '⏳ جاري الحفظ...'; btn.disabled = true;

    if (!db) {
        toast('⚠️ لا يوجد اتصال بـ Firebase — التغييرات محفوظة محلياً فقط', 'err');
        btn.textContent = '💾 حفظ التغييرات'; btn.disabled = false; return;
    }

    try {
        await Promise.all([
            setDoc(firestoreDoc(db, 'site', 'content_en'), content.en),
            setDoc(firestoreDoc(db, 'site', 'content_ar'), content.ar),
        ]);
        toast('✅ تم الحفظ — التغييرات ظاهرة للزوار!', 'ok');
    } catch (e) {
        toast('❌ فشل الحفظ: ' + e.message, 'err');
    }
    btn.textContent = '💾 حفظ التغييرات'; btn.disabled = false;
}

// ==========================================
// 7. عرض البيانات في الحقول (Render)
// ==========================================
function C() { return content[editLang]; }

function renderAll() {
    renderHero(); renderServices(); renderTools(); renderAbout(); renderStories(); renderFooter(); renderAdminPosts();
}

function renderHero() {
    document.getElementById('heroGreeting').value = C().hero.greeting || '';
    document.getElementById('heroBtnText').value = C().hero.btnText || '';
    
    if(document.getElementById('heroTypewriter')) {
        document.getElementById('heroTypewriter').value = C().hero.typewriter || '';
    }

    // ✅ النص الثابت — يعرض قيم اللغتين دايماً
    if (document.getElementById('heroStaticEN')) {
        document.getElementById('heroStaticEN').value = content.en.hero?.staticText || '';
        document.getElementById('heroStaticAR').value = content.ar.hero?.staticText || '';
    }

    if (document.getElementById('themeColor')) {
        document.getElementById('themeColor').value = C().theme?.accentColor || '#4052FF';
    }
    if (document.getElementById('heroBgPreview')) {
        const previewImg = document.getElementById('heroBgPreview');
        if (C().hero.bgImage) {
            previewImg.src = C().hero.bgImage;
            previewImg.style.display = 'block';
        } else {
            previewImg.style.display = 'none';
        }
    }
}

// 🖼️ رفع صورة الهيرو — Cloudinary
window.uploadHeroBg = async function (e) {
    const file = e.target.files[0];
    if (!file) return;

    try {
        toast("⏳ جاري رفع صورة الهيرو للسيرفر السحابي...", "");
        const url = await uploadImageProfessional(file);
        
        content.en.hero.bgImage = url;
        content.ar.hero.bgImage = url;

        const preview = document.getElementById("heroBgPreview");
        if (preview) { preview.src = url; preview.style.display = "block"; }

        if (db) {
            toast("⏳ جاري الحفظ...", "");
            await Promise.all([
                setDoc(firestoreDoc(db, 'site', 'content_en'), content.en),
                setDoc(firestoreDoc(db, 'site', 'content_ar'), content.ar),
            ]);
            toast("✅ تم رفع الصورة وحفظها بنجاح!", "ok");
        }
    } catch (err) {
        toast("❌ فشل الرفع: " + err.message, "err");
    }
};

window.removeHeroBg = function () {
    content.en.hero.bgImage = '';
    content.ar.hero.bgImage = '';
    if (document.getElementById('heroBgPreview')) {
        document.getElementById('heroBgPreview').src = '';
        document.getElementById('heroBgPreview').style.display = 'none';
    }
    document.getElementById('heroImgInput').value = '';
};

function renderServices() {
    const el = document.getElementById('servRep'); el.innerHTML = '';
    C().services.forEach((s, i) => {
        const d = document.createElement('div'); d.className = 'rep-item';
        d.innerHTML = `
            <div class="rep-head"><span class="rep-num">${editLang === 'ar' ? 'خدمة' : 'Service'} ${i + 1}</span>
            <button class="del-btn" onclick="deleteService(${i})">🗑</button></div>
            <div class="fg2">
                <div class="f"><label>${editLang === 'ar' ? 'الرقم' : 'Number'}</label>
                <input type="text" value="${s.num}" onchange="content.en.services[${i}].num=this.value; content.ar.services[${i}].num=this.value;"/></div>
                <div class="f"><label>${editLang === 'ar' ? 'الاسم (/ للسطر الثاني)' : 'Title (/ for line break)'}</label>
                <input type="text" value="${s.title.replace('\n', ' / ')}" onchange="content['${editLang}'].services[${i}].title=this.value.replace(' / ','\\n')"/></div>
            </div>`;
        el.appendChild(d);
    });
}

window.addService = () => {
    const nextNum = `#0${content.en.services.length + 1}`;
    content.en.services.push({ num: nextNum, title: 'New Service' });
    content.ar.services.push({ num: nextNum, title: 'خدمة جديدة' });
    renderServices();
};
window.deleteService = i => {
    if (content.en.services.length <= 1) return toast('يجب الإبقاء على خدمة', 'err');
    content.en.services.splice(i, 1);
    content.ar.services.splice(i, 1);
    renderServices();
};

function renderTools() {
    if (document.getElementById('secTitleTools')) {
        document.getElementById('secTitleTools').value = C().titles?.tools || '';
    }
    const el = document.getElementById('toolsRep'); el.innerHTML = '';
    C().tools.forEach((t, i) => {
        const d = document.createElement('div'); d.className = 'tool-item-row';
        const opts = ['text', 'image', 'icontext'].map(v =>
            `<option value="${v}" ${t.type === v ? 'selected' : ''}>${v === 'text' ? 'text (box)' : v === 'image' ? 'image' : 'icon+text'}</option>`
        ).join('');

        let valueInput = '';
        if (t.type === 'image') {
            const hasImg = t.value && (t.value.startsWith('http') || t.value.startsWith('data:'));
            valueInput = `
                <input type="file" accept="image/*" onchange="uploadToolImg(event, ${i})" style="max-width:200px; padding: 0.3rem;" />
                ${hasImg ? `<img src="${t.value}" style="width:40px; height:40px; object-fit:contain; border-radius:4px; border:1px solid #ddd;" title="الصورة الحالية"/>` : ''}
            `;
        } else if (t.type !== 'text') {
            valueInput = `<input type="text" dir="ltr" placeholder="slug e.g. figma" value="${t.value}" onchange="if(content.en.tools[${i}]) content.en.tools[${i}].value=this.value; if(content.ar.tools[${i}]) content.ar.tools[${i}].value=this.value;"/>`;
        }

        d.innerHTML = `
            <select onchange="content.en.tools[${i}].type=this.value; content.ar.tools[${i}].type=this.value; renderTools()">${opts}</select>
            <input type="text" placeholder="Label" value="${t.label}" onchange="content['${editLang}'].tools[${i}].label=this.value" style="max-width:150px"/>
            ${valueInput}
            <button class="del-btn" onclick="deleteTool(${i})" style="flex-shrink:0">🗑</button>`;
        el.appendChild(d);
    });
}

// 🖼️ أداة رفع الأدوات - Cloudinary
window.uploadToolImg = async function (e, i) {
    const file = e.target.files[0]; if (!file) return;
    try {
        toast("⏳ جاري رفع الأداة للسيرفر السحابي...", "");
        const url = await uploadImageProfessional(file);
        if (content.en.tools[i]) content.en.tools[i].value = url;
        if (content.ar.tools[i]) content.ar.tools[i].value = url;
        renderTools();
        toast("✅ تم تحميل صورة الأداة بنجاح", "ok");
    } catch(err) {
        toast("❌ فشل: " + err.message, "err");
    }
};

window.addTool = () => {
    content.en.tools.push({ type: 'text', label: 'New Tool', value: '' });
    content.ar.tools.push({ type: 'text', label: 'أداة جديدة', value: '' });
    renderTools();
};
window.deleteTool = i => {
    content.en.tools.splice(i, 1);
    content.ar.tools.splice(i, 1);
    renderTools();
};

function renderAbout() {
    if (document.getElementById('secTitleAbout')) {
        document.getElementById('secTitleAbout').value = C().titles?.about || '';
    }
    const el = document.getElementById('aboutRep'); el.innerHTML = '';
    C().about.forEach((a, i) => {
        const d = document.createElement('div'); d.className = 'rep-item';
        d.innerHTML = `
            <div class="rep-head"><span class="rep-num">${editLang === 'ar' ? 'بطاقة' : 'Card'} ${i + 1}</span></div>
            <div class="f"><label>${editLang === 'ar' ? 'العنوان (| للسطر الثاني)' : 'Title (| for line break)'}</label>
            <input type="text" value="${a.title.replace('\n', ' | ')}" onchange="content['${editLang}'].about[${i}].title=this.value.replace(' | ','\\n')"/></div>
            <div class="f"><label>${editLang === 'ar' ? 'النص' : 'Text'}</label>
            <textarea rows="3" onchange="content['${editLang}'].about[${i}].text=this.value">${a.text}</textarea></div>`;
        el.appendChild(d);
    });
}

function renderStories() {
    if (document.getElementById('secTitleStories')) {
        document.getElementById('secTitleStories').value = C().titles?.success || '';
    }
    const el = document.getElementById('storiesRep'); el.innerHTML = '';
    C().stories.forEach((s, i) => {
        const d = document.createElement('div'); d.className = 'rep-item';
        const imgUI = `
            <div class="f" style="background: rgba(64,82,255,0.05); padding: 10px; border-radius: 8px;">
                <label style="color:var(--blue); font-weight:bold;">${editLang === 'ar' ? 'صورة القصة (تتطبق على اللغتين)' : 'Story Image (Synced to both languages)'}</label>
                <input type="file" accept="image/*" onchange="uploadStoryImg(event, ${i})" style="max-width:250px; padding: 0.3rem;" />
                ${s.imageUrl && s.imageUrl.length > 10 ?
                    `<div style="margin-top:8px;">
                        <img src="${s.imageUrl}" style="max-width:150px; border-radius:10px; display:block; margin-bottom:5px;">
                        <button class="del-btn" onclick="removeStoryImg(${i})">إزالة الصورة والعودة للمربع</button>
                    </div>`
                : '<span style="font-size:0.8rem; color:#888;">لم يتم رفع صورة (سيظهر المربع الأزرق)</span>'}
            </div>
        `;
        d.innerHTML = `
            <div class="rep-head"><span class="rep-num">${editLang === 'ar' ? 'قصة' : 'Story'} ${i + 1}</span>
            <button class="del-btn" onclick="deleteStory(${i})">🗑</button></div>
            ${imgUI}
            <div class="f"><label>${editLang === 'ar' ? 'العنوان (/ للسطر الثاني)' : 'Title (/ for line break)'}</label>
            <input type="text" value="${s.title.replace('\n', ' / ')}" onchange="content['${editLang}'].stories[${i}].title=this.value.replace(' / ','\\n')"/></div>
            <div class="f"><label>${editLang === 'ar' ? 'النص' : 'Text'}</label>
            <textarea rows="3" onchange="content['${editLang}'].stories[${i}].text=this.value">${s.text}</textarea></div>`;
        el.appendChild(d);
    });
}

// 🖼️ رفع صورة القصة — Cloudinary
window.uploadStoryImg = async function (e, i) {
    const file = e.target.files[0]; if (!file) return;
    try {
        toast("⏳ جاري رفع صورة القصة للسيرفر السحابي...", "");
        const url = await uploadImageProfessional(file);
        if (content.en.stories[i]) content.en.stories[i].imageUrl = url;
        if (content.ar.stories[i]) content.ar.stories[i].imageUrl = url;
        renderStories();
        toast("✅ تم رفع صورة القصة", "ok");
    } catch (err) {
        toast("❌ فشل رفع الصورة: " + err.message, "err");
    }
};

window.removeStoryImg = function (i) {
    if (content.en.stories[i]) content.en.stories[i].imageUrl = '';
    if (content.ar.stories[i]) content.ar.stories[i].imageUrl = '';
    renderStories();
};

window.addStory = () => {
    content.en.stories.push({ title: 'New Story', text: '...', imageUrl: '' });
    content.ar.stories.push({ title: 'قصة جديدة', text: '...', imageUrl: '' });
    renderStories();
};
window.deleteStory = i => {
    if (content.en.stories.length <= 1) return toast('يجب الإبقاء على قصة', 'err');
    content.en.stories.splice(i, 1);
    content.ar.stories.splice(i, 1);
    renderStories();
};

function renderFooter() {
    document.getElementById('footerTitle').value = C().footer.title || '';
    document.getElementById('footerEmail').value = C().footer.email || '';
    document.getElementById('footerLinkedin').value = C().footer.linkedin || '';
    document.getElementById('footerTwitter').value = C().footer.twitter || '';
    document.getElementById('footerInsta').value = C().footer.insta || '';
}

// ==========================================
// 8. إدارة كلمة المرور (Security)
// ==========================================
window.changePass = () => {
    const cur = document.getElementById('curPass').value;
    const nw = document.getElementById('newPass').value;
    const conf = document.getElementById('confPass').value;
    if (cur !== getPassword()) return toast('كلمة المرور الحالية غير صحيحة', 'err');
    if (nw.length < 6) return toast('كلمة المرور قصيرة جداً', 'err');
    if (nw !== conf) return toast('كلمتا المرور غير متطابقتين', 'err');
    localStorage.setItem('admin_pass', nw);
    ['curPass', 'newPass', 'confPass'].forEach(id => document.getElementById(id).value = '');
    toast('✅ تم تحديث كلمة المرور', 'ok');
};

// ==========================================
// 9. إدارة المدونة (Blog Management)
// ==========================================
let blogPosts = []; 
let currentBlogCover = '';

async function loadBlogPosts() {
    if (!db) return;
    try {
        const { collection, getDocs } = await import(
            "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
        );
        const snapshot = await getDocs(collection(db, 'blog_posts'));
        blogPosts = [];
        snapshot.forEach(doc => blogPosts.push({ firestoreId: doc.id, ...doc.data() }));
        blogPosts.sort((a, b) => b.id - a.id);
        renderAdminPosts();
    } catch (e) {
        toast('⚠️ تعذّر تحميل المقالات: ' + e.message, 'err');
    }
}

window.renderAdminPosts = () => {
    if (document.getElementById('secTitleBlog')) {
        document.getElementById('secTitleBlog').value = C().titles?.blog || '';
    }
    const el = document.getElementById('adminPostsRep');
    if (!el) return;
    el.innerHTML = '';
    if (blogPosts.length === 0) {
        el.innerHTML = '<p style="color:#888; text-align:center; padding: 1rem;">لا توجد مقالات حالياً.</p>'; return;
    }
    blogPosts.forEach((p, i) => {
        const d = document.createElement('div'); d.className = 'rep-item';
        d.innerHTML = `
            <div class="rep-head" style="margin-bottom:0;"><span class="rep-num" style="font-size:1rem; color:var(--black);">${p.title}</span>
            <div style="display:flex; gap:0.5rem;">
                <button class="del-btn" onclick="openBlogEditor(${i})" style="color:var(--blue); border-color:var(--blue);">✏️ تعديل</button>
                <button class="del-btn" onclick="deleteBlogPost(${i})">🗑 حذف</button>
            </div></div>`;
        el.appendChild(d);
    });
};

window.openBlogEditor = (index) => {
    document.getElementById('blogEditorCard').style.display = 'block';
    document.getElementById('editBlogIndex').value = index;
    currentBlogCover = '';
    document.getElementById('postCover').value = '';
    document.getElementById('coverPreview').style.display = 'none';

    if (index >= 0) {
        const p = blogPosts[index];
        document.getElementById('blogEditorTitle').textContent = 'تعديل المقال';
        document.getElementById('postTitle').value = p.title || '';
        document.getElementById('postTitleAr').value = p.titleAr || '';
        document.getElementById('postTag').value = p.tag || '';
        document.getElementById('postReadTime').value = p.readTime || '';
        document.getElementById('postExcerpt').value = p.excerpt || '';
        document.getElementById('postExcerptAr').value = p.excerptAr || '';
        document.getElementById('postColor').value = p.color || '#4052FF';

        const editor = document.getElementById('postContent');
        if (editor) editor.innerHTML = p.content || '';

        const editorAr = document.getElementById('postContentAr');
        if (editorAr) editorAr.innerHTML = p.contentAr || '';

        if (p.coverImage) {
            currentBlogCover = p.coverImage;
            document.getElementById('coverPreview').src = currentBlogCover;
            document.getElementById('coverPreview').style.display = 'block';
        }
    } else {
        document.getElementById('blogEditorTitle').textContent = 'إضافة مقال جديد';
        ['postTitle', 'postTitleAr', 'postTag', 'postReadTime', 'postExcerpt', 'postExcerptAr'].forEach(id => document.getElementById(id).value = '');
        document.getElementById('postColor').value = '#4052FF';

        const editor = document.getElementById('postContent');
        if (editor) editor.innerHTML = '';
        const editorAr = document.getElementById('postContentAr');
        if (editorAr) editorAr.innerHTML = '';
    }
    document.getElementById('blogEditorCard').scrollIntoView({ behavior: 'smooth' });
};

window.closeBlogEditor = () => document.getElementById('blogEditorCard').style.display = 'none';

window.saveBlogPost = async () => {
    const title = document.getElementById('postTitle').value.trim();
    const excerpt = document.getElementById('postExcerpt').value.trim();
    if (!title || !excerpt) return toast('يرجى إدخال العنوان والمقتطف الإنجليزي على الأقل', 'err');

    if (!db) return toast('❌ لا يوجد اتصال بـ Firebase', 'err');

    const index = parseInt(document.getElementById('editBlogIndex').value);

    const editorEn = document.getElementById('postContent');
    const editorAr = document.getElementById('postContentAr');

    const postData = {
        id: index >= 0 ? blogPosts[index].id : Date.now(),
        title,
        titleAr: document.getElementById('postTitleAr').value.trim(),
        excerpt,
        excerptAr: document.getElementById('postExcerptAr').value.trim(),
        content: editorEn ? editorEn.innerHTML.trim() : '',
        contentAr: editorAr ? editorAr.innerHTML.trim() : '',
        tag: document.getElementById('postTag').value.trim(),
        readTime: parseInt(document.getElementById('postReadTime').value) || null,
        color: document.getElementById('postColor').value,
        coverImage: currentBlogCover,
        date: index >= 0 ? blogPosts[index].date : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };

    try {
        toast('⏳ جاري حفظ المقال...', '');
        const { collection, addDoc, doc, updateDoc } = await import(
            "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
        );

        if (index >= 0 && blogPosts[index].firestoreId) {
            const docRef = doc(db, 'blog_posts', blogPosts[index].firestoreId);
            await updateDoc(docRef, postData);
        } else {
            await addDoc(collection(db, 'blog_posts'), postData);
        }

        await loadBlogPosts();
        closeBlogEditor();
        toast('✅ تم حفظ المقال — يظهر الآن في المدونة!', 'ok');
    } catch (e) {
        toast('❌ فشل الحفظ: ' + e.message, 'err');
    }
};

window.deleteBlogPost = async (i) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟')) return;
    if (!db) return toast('❌ لا يوجد اتصال بـ Firebase', 'err');

    try {
        const { doc, deleteDoc } = await import(
            "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
        );
        if (blogPosts[i].firestoreId) {
            await deleteDoc(doc(db, 'blog_posts', blogPosts[i].firestoreId));
        }
        await loadBlogPosts();
        toast('🗑 تم الحذف', 'ok');
    } catch (e) {
        toast('❌ فشل الحذف: ' + e.message, 'err');
    }
};

window.insertBlogFormat = (type, editorId = 'postContent') => {
    const editor = document.getElementById(editorId);
    if (!editor) return;
    editor.focus();

    let html = '';
    switch (type) {
        case 'h2': html = `<h2>${editorId === 'postContentAr' ? 'عنوان جانبي' : 'Side Heading'}</h2>`; break;
        case 'h3': html = `<h3>${editorId === 'postContentAr' ? 'عنوان فرعي' : 'Sub Heading'}</h3>`; break;
        case 'bold': html = `<strong>${editorId === 'postContentAr' ? 'نص عريض' : 'Bold Text'}</strong>`; break;
        case 'bullet': html = `<ul><li>${editorId === 'postContentAr' ? 'عنصر قائمة' : 'List item'}</li></ul>`; break;
        case 'divider': html = `<hr/>`; break;
    }

    const sel = window.getSelection();
    if (sel.rangeCount) {
        const range = sel.getRangeAt(0);
        range.deleteContents();
        const el = document.createElement('div');
        el.innerHTML = html;
        const frag = document.createDocumentFragment();
        let lastNode;
        while (el.firstChild) { lastNode = frag.appendChild(el.firstChild); }
        range.insertNode(frag);
        if (lastNode) {
            const newRange = range.cloneRange();
            newRange.setStartAfter(lastNode);
            newRange.collapse(true);
            sel.removeAllRanges();
            sel.addRange(newRange);
        }
    } else {
        editor.innerHTML += html;
    }
};

// ==========================================
// 🌟 ربط أحداث الصور الاحترافية (Cloudinary) 🌟
// ==========================================
function bindImageEvents() {

    // 🖼️ صورة الغلاف للمقال
    document.getElementById('postCover')?.addEventListener('change', async (e) => {
        const file = e.target.files[0]; if (!file) return;
        try {
            toast("⏳ جاري رفع صورة الغلاف للسيرفر...", "");
            const url = await uploadImageProfessional(file);
            currentBlogCover = url;
            const prev = document.getElementById('coverPreview');
            if (prev) { prev.src = currentBlogCover; prev.style.display = 'block'; }
            toast("✅ تم رفع صورة الغلاف بنجاح", "ok");
        } catch (err) {
            toast("❌ فشل الرفع: " + err.message, "err");
        }
    });

    // دالة مساعدة لإدراج الصورة في المحرر
    function insertImgUrlInEditor(editorId, url) {
        const editor = document.getElementById(editorId);
        if (!editor) return;
        editor.focus();

        const img = document.createElement('img');
        img.src = url;
        img.alt = "صورة توضيحية";
        img.style.cssText = `max-width:100%; border-radius:8px; display:block; margin:12px auto; cursor:pointer; box-shadow:0 2px 8px rgba(0,0,0,0.15);`;
        img.title = "انقري مرتين للحذف";
        img.ondblclick = () => { if (confirm('حذف هذه الصورة؟')) img.remove(); };

        const sel = window.getSelection();
        if (sel.rangeCount && editor.contains(sel.anchorNode)) {
            const range = sel.getRangeAt(0);
            range.insertNode(img);
            range.setStartAfter(img);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
        } else {
            editor.appendChild(img);
        }
    }

    // 🖼️ صورة داخل المقال الإنجليزي
    document.getElementById('inlineImgUpload')?.addEventListener('change', async (e) => {
        const file = e.target.files[0]; if (!file) return;
        try {
            toast("⏳ جاري رفع الصورة...", "");
            const url = await uploadImageProfessional(file);
            insertImgUrlInEditor('postContent', url);
            toast("✅ أُدرجت الصورة في المقال", "ok");
        } catch (err) { toast("❌ فشل: " + err.message, "err"); }
        e.target.value = '';
    });

    // 🖼️ صورة داخل المقال العربي
    document.getElementById('inlineImgUploadAr')?.addEventListener('change', async (e) => {
        const file = e.target.files[0]; if (!file) return;
        try {
            toast("⏳ جاري رفع الصورة...", "");
            const url = await uploadImageProfessional(file);
            insertImgUrlInEditor('postContentAr', url);
            toast("✅ أُدرجت الصورة في المقال", "ok");
        } catch (err) { toast("❌ فشل: " + err.message, "err"); }
        e.target.value = '';
    });
}

// ==========================================
// 10. تشغيل الأكواد الأساسية (Event Listeners)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginBtn').addEventListener('click', tryLogin);
    document.getElementById('passInput').addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
    document.getElementById('logoutBtn').addEventListener('click', doLogout);
    document.getElementById('blogLink')?.addEventListener('click', () => window.open('blog.html', '_blank'));
    document.getElementById('saveBtn').addEventListener('click', savePanel);

    document.querySelectorAll('.nav-item[data-panel]').forEach(item =>
        item.addEventListener('click', () => switchPanel(item.dataset.panel)));

    document.querySelectorAll('.lang-tab').forEach(tab =>
        tab.addEventListener('click', () => setEditLang(tab.dataset.lang)));

    if (isLocked()) {
        document.getElementById('loginHint').textContent = `🔒 مقفل مؤقتاً — انتظري ${Math.ceil((lockUntil - Date.now()) / 60000)} دقيقة`;
    }
});