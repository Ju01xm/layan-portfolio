/* ==========================================
   BLOG SCRIPT — Firebase Live Version
   Layan Alamrah Portfolio
   ========================================== */
import { db, collection, getDocs } from "./Firebase config.js";

let currentLang = localStorage.getItem('layan_lang') || 'en';
let posts = [];

const blogDict = {
    en: {
        blogBack: "&larr; Back to Portfolio", langToggle: "عربي",
        heroLabel: "Knowledge Newsletter", heroTitle: "Articles on Marketing<br>& Corporate Comms",
        heroDesc: "Weekly insights and analysis in brand building and communication management.",
        statArticles: "Articles", statWeekly: "Weekly", statUpdates: "Updates",
        emptyStateText: "No articles yet. Check back soon!", closePostView: "✕ Close",
        readMore: "Read Article &rarr;", readTimeMsg: "min read", generalTag: "General",
    },
    ar: {
        blogBack: "العودة للرئيسية &rarr;", langToggle: "English",
        heroLabel: "النشرة المعرفية", heroTitle: "مقالات في التسويق<br>والاتصال المؤسسي",
        heroDesc: "أفكار وتحليلات أسبوعية في بناء العلامة التجارية وإدارة الاتصالات.",
        statArticles: "مقال", statWeekly: "أسبوعياً", statUpdates: "تحديثات",
        emptyStateText: "لا توجد مقالات بعد. عد قريباً!", closePostView: "✕ إغلاق",
        readMore: "&larr; اقرأ المقال", readTimeMsg: "دقائق للقراءة", generalTag: "عام",
    }
};

function applyBlogTranslations() {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    const dict = blogDict[currentLang];
    
    const ids = ['blogBack', 'heroLabel', 'heroTitle', 'heroDesc', 'statArticles', 'statWeekly', 'statUpdates', 'emptyStateText', 'closePostView'];
    ids.forEach(id => { 
        const el = document.getElementById(id); 
        if (el) el.innerHTML = dict[id]; 
    });
    
    document.getElementById('langToggle').innerHTML = dict.langToggle;
}

function renderPosts() {
    const grid = document.getElementById('postsGrid');
    const emptyState = document.getElementById('emptyState');
    document.getElementById('postCount').textContent = posts.length;
    
    grid.innerHTML = '';

    if (posts.length === 0) {
        emptyState.style.display = 'block'; 
        return;
    }
    
    emptyState.style.display = 'none';

    posts.forEach((post, index) => {
        const card = document.createElement('div');
        card.className = 'post-card';
        
        const formattedDate = new Date(post.id).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

        // ✅ عرض العنوان والمقتطف حسب اللغة
        const title = currentLang === 'ar' && post.titleAr ? post.titleAr : (post.title || '');
        const excerpt = currentLang === 'ar' && post.excerptAr ? post.excerptAr : (post.excerpt || '');
        
        card.innerHTML = `
            <div class="card-color-bar" style="background:${post.color}"></div>
            <div class="card-body">
                <div class="card-meta">
                    <span class="card-tag" style="background:${post.color}">${post.tag || blogDict[currentLang].generalTag}</span>
                    <span class="card-date">${formattedDate}</span>
                    ${post.readTime ? `<span class="card-read-time">⏱ ${post.readTime} ${blogDict[currentLang].readTimeMsg}</span>` : ''}
                </div>
                <h2 class="card-title" style="color:${post.color}">${title}</h2>
                <p class="card-excerpt">${excerpt}</p>
            </div>
            <div class="card-footer">
                <span class="read-more" style="color:${post.color}">${blogDict[currentLang].readMore}</span>
            </div>
        `;
        
        card.addEventListener('click', () => openPost(index));
        grid.appendChild(card);
    });
}

// ✅ تحويل Markdown داخل HTML
function markdownToHtml(text) {
    if (!text) return '';

    // تحويل markdown حتى لو المحتوى يحتوي HTML
    return text
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .replace(/^---$/gm, '<hr>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>[\s\S]+?<\/li>)/g, '<ul>$1</ul>');
}

function openPost(index) {
    const post = posts[index];
    const article = document.getElementById('articleContent');
    
    // ✅ عرض المحتوى حسب اللغة + تحويل markdown إذا لزم
    const rawContent = currentLang === 'ar' && post.contentAr ? post.contentAr : (post.content || '');
    const htmlContent = markdownToHtml(rawContent);
    const excerpt = currentLang === 'ar' && post.excerptAr ? post.excerptAr : (post.excerpt || '');
    const title = currentLang === 'ar' && post.titleAr ? post.titleAr : (post.title || '');
    
    const dict = blogDict[currentLang];
    const formattedDate = new Date(post.id).toLocaleDateString(currentLang === 'ar' ? 'ar-SA' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    article.innerHTML = `
        <div class="article-header">
            <div class="article-meta">
                <span class="article-tag" style="background:${post.color}">${post.tag || dict.generalTag}</span>
                <span class="article-date">${formattedDate}</span>
                ${post.readTime ? `<span class="article-read-time">⏱ ${post.readTime} ${dict.readTimeMsg}</span>` : ''}
            </div>
            <h1 class="article-title" style="color:${post.color}">${title}</h1>
            <p class="article-excerpt">${excerpt}</p>
        </div>
        <div class="article-divider"></div>
        <div class="newsletter-content" dir="${currentLang === 'ar' ? 'rtl' : 'ltr'}">${htmlContent}</div>
        <div class="article-footer">
            <div class="author-info">
                <div class="author-avatar">L</div>
                <div class="author-details">
                    <span class="author-name">Layan Alamrah</span>
                    <span class="author-role">Brand & Corporate Communications</span>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('postViewModal').classList.add('active');
}

function parseContent(text) {
    if (!text) return ''; 
    let html = ''; 
    const lines = text.split('\n'); 
    let inList = false;
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        
        if (line.startsWith('## ')) { if (inList) { html += '</ul>'; inList = false; } html += `<h2>${line.slice(3)}</h2>`; continue; }
        if (line.startsWith('### ')) { if (inList) { html += '</ul>'; inList = false; } html += `<h3>${line.slice(4)}</h3>`; continue; }
        if (line.startsWith('> ')) { if (inList) { html += '</ul>'; inList = false; } html += `<blockquote>${formatInline(line.slice(2))}</blockquote>`; continue; }
        if (line.trim() === '---') { if (inList) { html += '</ul>'; inList = false; } html += '<hr>'; continue; }
        if (line.startsWith('- ') || line.startsWith('• ')) { if (!inList) { html += '<ul>'; inList = true; } html += `<li>${formatInline(line.slice(2))}</li>`; continue; }
        if (/^\d+\. /.test(line)) { if (!inList) { html += '<ol>'; inList = true; } html += `<li>${formatInline(line.replace(/^\d+\. /, ''))}</li>`; continue; }
        if (line.trim() === '') { if (inList) { html += '</ul>'; inList = false; } continue; }
        
        if (inList) { html += '</ul>'; inList = false; } 
        html += `<p>${formatInline(line)}</p>`;
    }
    
    if (inList) html += '</ul>'; 
    return html;
}

function formatInline(text) {
    return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
               .replace(/\*(.+?)\*/g, '<em>$1</em>')
               .replace(/!\[([^\]]*)\]\((.*?)\)/g, (match, alt, src) => `<img src="${src}" alt="${alt || 'Image'}" style="max-width:100%; height:auto; border-radius:12px; margin: 1.5rem 0;">`);
}

document.addEventListener('DOMContentLoaded', async () => {
    applyBlogTranslations(); 
    
    const grid = document.getElementById('postsGrid');
    if(grid) grid.innerHTML = "<p style='text-align:center; color:#888; width:100%; margin-top:2rem;'>⏳ جاري تحميل المقالات...</p>";
    
    try {
        const querySnapshot = await getDocs(collection(db, "blog_posts"));
        querySnapshot.forEach((doc) => posts.push(doc.data()));
        posts.sort((a, b) => b.id - a.id);
        renderPosts();
    } catch(e) {
        if(grid) grid.innerHTML = "<p style='text-align:center; color:red; width:100%;'>❌ تعذر تحميل المقالات.</p>";
    }
    
    document.getElementById('langToggle')?.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ar' : 'en';
        localStorage.setItem('layan_lang', currentLang); 
        location.reload();
    });
    
    document.getElementById('closePostView')?.addEventListener('click', () => {
        document.getElementById('postViewModal').classList.remove('active');
    });
});