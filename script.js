import { db, doc, getDoc, collection, getDocs } from "./Firebase config.js";

// ==========================================
// 1. نظام الترجمة (Translation System)
// ==========================================
let currentLang = localStorage.getItem('layan_lang') || 'en';

const uiDict = {
    en: {
        navHome: "Home", navAbout: "About me", navPort: "Portfolio", navBlog: "Blog", navContact: "Contact me",
        langToggle: "عربي", 
        aboutTitle: "ABOUT ME", successTitle: "SUCCESS STORIES", blogTitle: "MY BLOGS", toolsTitle: "CORE TOOLS",
        blogTeaserDesc: "A weekly newsletter on marketing, corporate communications, and brand building.",
        blogTeaserBtn: "View all articles &nbsp;↗"
    },
    ar: {
        navHome: "الرئيسية", navAbout: "نبذة عني", navPort: "أعمالي", navBlog: "المدونة", navContact: "تواصل معي",
        langToggle: "English", 
        aboutTitle: "نبذة عني", successTitle: "قصص النجاح", blogTitle: "المدونة", toolsTitle: "الأدوات الأساسية",
        blogTeaserDesc: "نشرة أسبوعية في التسويق والاتصال المؤسسي وبناء العلامات التجارية.",
        blogTeaserBtn: "استعرض جميع المقالات &nbsp;↗"
    }
};

function applyTranslations() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    const dict = uiDict[currentLang];

    Object.keys(dict).forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = dict[id];
    });
}

// ==========================================
// 2. جلب البيانات من Firebase
// ==========================================
async function loadSiteData() {
    try {
        const docName = currentLang === 'ar' ? 'content_ar' : 'content_en';
        const docRef = doc(db, "site", docName);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            if (data.theme && data.theme.accentColor) {
                document.documentElement.style.setProperty('--accent-blue', data.theme.accentColor);
            }

            if (data.titles) {
                const elAbout = document.getElementById('aboutTitle');
                if (elAbout && data.titles.about) elAbout.textContent = data.titles.about;
                
                const elSuccess = document.getElementById('successTitle');
                if (elSuccess && data.titles.success) elSuccess.textContent = data.titles.success;
                
                const elTools = document.getElementById('toolsTitle');
                if (elTools && data.titles.tools) elTools.textContent = data.titles.tools;
                
                const elBlog = document.getElementById('blogTitle');
                if (elBlog && data.titles.blog) elBlog.textContent = data.titles.blog;
            }

            if (data.about && data.about.length > 0) {
                const aboutParagraphs = document.querySelectorAll('.about-right p');
                const aboutTitles = document.querySelectorAll('.about-left h3');
                for (let i = 0; i < 3; i++) {
                    if (aboutParagraphs[i] && data.about[i]) aboutParagraphs[i].textContent = data.about[i].text;
                    if (aboutTitles[i] && data.about[i]) aboutTitles[i].innerHTML = data.about[i].title.replace(/\n/g, '<br>');
                }
            }

            if (data.stories && data.stories.length > 0) {
                const track = document.getElementById('success-track');
                if (track) {
                    track.innerHTML = ""; 
                    data.stories.forEach(story => {
                        let topContent = "";
                        let titleInBottom = "";

                        if (story.imageUrl && story.imageUrl.trim() !== "") {
                            topContent = `<img src="${story.imageUrl}" alt="${story.title}" class="story-image">`;
                            titleInBottom = `<h4 style="color: var(--text-white); margin-bottom: 8px; font-size: 1.1rem;">${story.title}</h4>`;
                        } else {
                            topContent = `<div class="story-top">${story.title.replace(/\n/g, '<br>')}</div>`;
                        }

                        track.innerHTML += `
                            <div class="story-card">
                                ${topContent}
                                <div class="story-bottom">
                                    ${titleInBottom}
                                    ${story.text}
                                </div>
                            </div>`;
                    });
                }
            }

            if (data.tools && data.tools.length > 0) {
                const toolsContainer = document.querySelector('.tools-icons');
                if (toolsContainer) {
                    toolsContainer.innerHTML = '';
                    data.tools.forEach(tool => {
                        if (tool.type === 'text') {
                            toolsContainer.innerHTML += `<span class="tool-box">${tool.label}</span>`;
                        } else if (tool.type === 'image') {
                            toolsContainer.innerHTML += `
                                <div class="tool-item">
                                    <img src="${tool.value}" alt="${tool.label}" class="custom-tool-img">
                                </div>`;
                        } else if (tool.type === 'icontext') {
                            toolsContainer.innerHTML += `
                                <div class="tool-item">
                                    <img src="https://cdn.simpleicons.org/${tool.value}/white" alt="${tool.label}" class="tool-svg">
                                    <span class="tool-text">${tool.label}</span>
                                </div>`;
                        }
                    });
                }
            }

            if (data.hero) {
                const heroGreeting = document.getElementById('heroGreeting');
                const heroTitle = document.getElementById('heroTitle');
                const heroSection = document.getElementById('home');

                if (heroGreeting) heroGreeting.textContent = data.hero.greeting;
                if (heroTitle) heroTitle.innerHTML = `${data.hero.title1}<br>${data.hero.title2}`;

                if (data.hero.bgImage && data.hero.bgImage.trim() !== "") {
                    heroSection.style.setProperty('background', `linear-gradient(rgba(5, 5, 5, 0.30), rgba(5, 5, 5, 0.98)), url('${data.hero.bgImage}')`, 'important');
                    heroSection.style.setProperty('background-size', 'cover', 'important');
                    heroSection.style.setProperty('background-position', 'center top', 'important');
                }

                // --------- حفظ الكلمات المتحركة في متغير ---------
                if (data.hero.typewriter && data.hero.typewriter.trim() !== "") {
                    window.currentTypewriterPhrases = data.hero.typewriter.split(',').map(item => item.trim()).filter(item => item !== "");
                }
            }

            if (data.services && data.services.length > 0) {
                const servicesRow = document.getElementById('servicesRow');
                if (servicesRow) {
                    servicesRow.innerHTML = ''; 
                    data.services.forEach(service => {
                        servicesRow.innerHTML += `
                            <div class="service-item">
                                <span class="accent-text">${service.num}</span>
                                <p>${service.title.replace(/\n/g, '<br>')}</p>
                            </div>`;
                    });
                }
            }

            if (data.footer) {
                const footerTitleText = document.querySelector('#footerTitleText');
                if (footerTitleText && data.footer.title) footerTitleText.textContent = data.footer.title;

                if (data.footer.email) {
                    const mailUrl = `mailto:${data.footer.email}`;
                    document.querySelectorAll('.btn-contact, .social-icon[title="Email"], .footer-email-link, #heroEmail, #navContact')
                        .forEach(el => el.href = mailUrl);
                }

                if (data.footer.linkedin) {
                    document.querySelectorAll('.social-icon[title="LinkedIn"], .footer-linkedin-link, #heroLinkedin')
                        .forEach(el => el.href = data.footer.linkedin);
                }

                if (data.footer.twitter) {
                    document.querySelectorAll('.social-icon[title="X"], .footer-x-link, #heroX')
                        .forEach(el => el.href = data.footer.twitter);
                }

                if (data.footer.insta) {
                    document.querySelectorAll('.social-icon[title="Instagram"], .footer-insta-link, #heroInsta')
                        .forEach(el => el.href = data.footer.insta);
                }
            }
        }
    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
    }
}

// ==========================================
// 3. جلب آخر المقالات للمدونة (مباشرة من فايربيس)
// ==========================================
async function loadBlogPreviews() {
    const blogGrid = document.getElementById('blogPreviewGrid');
    if (!blogGrid) return;
    blogGrid.innerHTML = "<p style='color:#888; text-align:center; width:100%;'>⏳ جاري تحميل المقالات...</p>";

    try {
        const querySnapshot = await getDocs(collection(db, "blog_posts"));
        let posts = [];
        querySnapshot.forEach((doc) => posts.push(doc.data()));

        if (posts.length === 0) {
            const emptyMsg = currentLang === 'ar' ? 'لا توجد مقالات حتى الآن.' : 'No articles yet.';
            blogGrid.innerHTML = `<p style='color:#888; text-align:center; width:100%;'>${emptyMsg}</p>`;
            return;
        }

        posts.sort((a, b) => b.id - a.id);
        const recentPosts = posts.slice(0, 4);
        blogGrid.innerHTML = "";

        recentPosts.forEach((post) => {
            const coverSrc = post.coverImage || 'images/brain.png';
            const title = currentLang === 'ar' && post.titleAr ? post.titleAr : (post.title || '');
            const excerpt = currentLang === 'ar' && post.excerptAr ? post.excerptAr : (post.excerpt || '');
            const cardColor = post.color || 'var(--accent-blue)';

            blogGrid.innerHTML += `
                <div class="blog-card" onclick="window.location.href='blog.html'" style="cursor:pointer; min-width: 300px; flex-shrink: 0;">
                    <div class="blog-visual-area">
                        <div class="soft-green-circle" style="background:${cardColor}; opacity:0.15;"></div>
                        <img src="${coverSrc}" alt="Cover" class="brain-img" style="width: 140px; height: 140px; object-fit: contain; z-index: 2; filter: drop-shadow(0 10px 15px rgba(0,0,0,0.1));" onerror="this.src='images/brain.png'">
                    </div>
                    <div class="blog-card-body">
                        <h3 class="highlight-percent" style="font-size: 1.4rem; color:${cardColor};">${title}</h3>
                        <p class="study-text">${excerpt}</p>
                    </div>
                </div>`;
        });
    } catch (error) {
        console.error("Error loading blogs:", error);
        blogGrid.innerHTML = "<p style='color:red; text-align:center; width:100%;'>تعذر تحميل المقالات من الخادم.</p>";
    }
}

// 1. تحديد الكلمات حسب اللغة ديناميكياً من لوحة التحكم
function getPhrases() {
    const isArabic = document.documentElement.dir === 'rtl' || localStorage.getItem('layan_lang') === 'ar' || document.body.classList.contains('rtl');
    
    const staticText = document.getElementById('static-expertise');
    if(staticText) {
        staticText.textContent = isArabic ? staticText.getAttribute('data-ar') : staticText.getAttribute('data-en');
    }

    // قراءة الكلمات القادمة من لوحة التحكم (إن وجدت)
    if (window.currentTypewriterPhrases && window.currentTypewriterPhrases.length > 0) {
        return window.currentTypewriterPhrases;
    }

    // الكلمات الافتراضية
    return isArabic ? [
        "إدارة العلامات التجارية",
        "التواصل المؤسسي",
        "التسويق",
        "صناعة المحتوى"
    ] : [
        "Branding",
        "Corporate Communication",
        "Marketing",
        "Content Creation"
    ];
}

// 2. تشغيل تأثير الآلة الكاتبة
const typewriterElement = document.getElementById('typewriter');
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    if (!typewriterElement) return;

    const phrases = getPhrases();
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && charIndex === currentPhrase.length) {
        typeSpeed = 2000; 
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 400; 
    }

    setTimeout(typeEffect, typeSpeed);
}

document.addEventListener("DOMContentLoaded", function() {
    typeEffect();
});

// ==========================================
// 4. تشغيل الأكواد الأساسية
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    
    applyTranslations();
    await loadSiteData();
    loadBlogPreviews();

    // برمجة زر تغيير اللغة
    const langBtn = document.getElementById('langToggle');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'ar' : 'en';
            localStorage.setItem('layan_lang', currentLang);
            location.reload();
        });
    }

    // برمجة أسهم تمرير قصص النجاح
    const successTrack = document.getElementById('success-track');
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (nextBtn && successTrack) {
        nextBtn.addEventListener('click', () => {
            const scrollDir = currentLang === 'ar' ? -350 : 350;
            successTrack.scrollBy({ left: scrollDir, behavior: 'smooth' });
        });
    }
    if (prevBtn && successTrack) {
        prevBtn.addEventListener('click', () => {
            const scrollDir = currentLang === 'ar' ? 350 : -350;
            successTrack.scrollBy({ left: scrollDir, behavior: 'smooth' });
        });
    }
});

// ==========================================
// تشغيل قائمة الهامبرجر للموبايل
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.getElementById('mobile-menu');
    const navWrapper = document.getElementById('nav-wrapper');
    const navLinks = document.querySelectorAll('.nav-wrapper nav a');

    if(menuToggle && navWrapper) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('is-active');
            navWrapper.classList.toggle('active');
            
            if(navWrapper.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('is-active');
                navWrapper.classList.remove('active');
                document.body.style.overflow = 'auto';
            });
        });
    }
});
