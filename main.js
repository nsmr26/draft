// ========================================
// DOM要素の取得
// ========================================
const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const scrollTopBtn = document.getElementById('scrollTop');
const menuCategoryBtns = document.querySelectorAll('.menu-category-btn');
const menuItems = document.querySelectorAll('.menu-item');
const reservationForm = document.getElementById('reservationForm');

// ========================================
// ヘッダーのスクロール効果
// ========================================
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
    
    // トップへ戻るボタンの表示/非表示
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

// ========================================
// モバイルナビゲーションの開閉
// ========================================
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // ハンバーガーメニューのアニメーション
    const spans = navToggle.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// ========================================
// ナビゲーションリンクのクリック処理
// ========================================
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // ハッシュリンクの場合
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // モバイルメニューを閉じる
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const spans = navToggle.querySelectorAll('span');
                    spans[0].style.transform = 'none';
                    spans[1].style.opacity = '1';
                    spans[2].style.transform = 'none';
                }
            }
        }
    });
});

// ========================================
// トップへ戻るボタン
// ========================================
scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// メニューカテゴリーフィルター
// ========================================
menuCategoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const category = btn.getAttribute('data-category');
        
        // アクティブなボタンのスタイルを更新
        menuCategoryBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // メニューアイテムのフィルタリング
        menuItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (itemCategory === category) {
                item.style.display = 'block';
                // フェードインアニメーション
                setTimeout(() => {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    requestAnimationFrame(() => {
                        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    });
                }, 10);
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// ========================================
// 予約フォームの送信処理
// ========================================
if (reservationForm) {
    reservationForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // フォームデータの取得
        const formData = {
            name: document.getElementById('name').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            guests: document.getElementById('guests').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            message: document.getElementById('message').value,
            status: 'pending'
        };
        
        try {
            // Table APIへの送信
            const response = await fetch('tables/reservations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                const result = await response.json();
                
                // 成功メッセージの表示
                showNotification('success', 'ご予約を承りました。確認のメールをお送りいたします。');
                
                // フォームのリセット
                reservationForm.reset();
            } else {
                throw new Error('予約の送信に失敗しました');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('error', '予約の送信中にエラーが発生しました。お電話でのご予約をお願いいたします。');
        }
    });
}

// ========================================
// 通知メッセージの表示
// ========================================
function showNotification(type, message) {
    // 既存の通知を削除
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 通知要素の作成
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // スタイルの追加
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        z-index: 10000;
        padding: 1rem 1.5rem;
        background-color: ${type === 'success' ? '#2c5f8d' : '#d63447'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.3s ease;
        max-width: 400px;
    `;
    
    // DOMに追加
    document.body.appendChild(notification);
    
    // 3秒後に自動削除
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// 通知アニメーションのスタイルを追加
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-content i {
        font-size: 1.5rem;
    }
    
    @media (max-width: 480px) {
        .notification {
            right: 15px;
            left: 15px;
            max-width: none;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// ニュースの動的読み込み
// ========================================
async function loadNews() {
    try {
        const response = await fetch('tables/news?page=1&limit=3&sort=-created_at');
        
        if (response.ok) {
            const result = await response.json();
            const newsGrid = document.getElementById('newsGrid');
            
            if (result.data && result.data.length > 0) {
                newsGrid.innerHTML = '';
                
                result.data.forEach(news => {
                    const newsItem = document.createElement('div');
                    newsItem.className = 'news-item fade-in';
                    
                    // 日付のフォーマット
                    const date = new Date(news.date || news.created_at);
                    const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
                    
                    newsItem.innerHTML = `
                        <div class="news-date">${formattedDate}</div>
                        <h3 class="news-title">${news.title}</h3>
                        <p class="news-content">${news.content}</p>
                    `;
                    
                    newsGrid.appendChild(newsItem);
                });
            }
        }
    } catch (error) {
        console.error('ニュースの読み込みに失敗しました:', error);
        // デフォルトのニュースを表示（既にHTMLに記述済み）
    }
}

// ページ読み込み時にニュースを取得
document.addEventListener('DOMContentLoaded', () => {
    loadNews();
});

// ========================================
// 日付入力の制限（今日以降のみ選択可能）
// ========================================
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 2); // 2日後から予約可能
    
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    const minDate = `${year}-${month}-${day}`;
    
    dateInput.setAttribute('min', minDate);
}

// ========================================
// スクロールアニメーション（要素が表示されたらフェードイン）
// ========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';
            entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            
            requestAnimationFrame(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            });
            
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// 監視対象の要素を取得
const animateElements = document.querySelectorAll('.about-content, .menu-item, .news-item, .access-content, .reservation-content');
animateElements.forEach(el => {
    observer.observe(el);
});

// ========================================
// 電話番号のフォーマット（自動ハイフン挿入）
// ========================================
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/[^\d]/g, '');
        
        if (value.length > 0) {
            if (value.length <= 3) {
                value = value;
            } else if (value.length <= 6) {
                value = value.slice(0, 3) + '-' + value.slice(3);
            } else if (value.length <= 10) {
                value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
            } else {
                value = value.slice(0, 3) + '-' + value.slice(3, 7) + '-' + value.slice(7, 11);
            }
        }
        
        e.target.value = value;
    });
}

// ========================================
// フォームバリデーション
// ========================================
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const guests = document.getElementById('guests').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    
    if (!name || !phone || !email || !guests || !date || !time) {
        showNotification('error', '必須項目をすべて入力してください。');
        return false;
    }
    
    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('error', '正しいメールアドレスを入力してください。');
        return false;
    }
    
    // 電話番号の形式チェック（数字とハイフンのみ）
    const phoneRegex = /^[\d-]+$/;
    if (!phoneRegex.test(phone)) {
        showNotification('error', '正しい電話番号を入力してください。');
        return false;
    }
    
    return true;
}

// フォーム送信前のバリデーション
if (reservationForm) {
    reservationForm.addEventListener('submit', (e) => {
        if (!validateForm()) {
            e.preventDefault();
            return false;
        }
    });
}

// ========================================
// パフォーマンス最適化：画像の遅延読み込み
// ========================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Intersection Observer APIを使用したポリフィル
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ========================================
// コンソールログ（開発用）
// ========================================
console.log('%cLoudia Website', 'color: #2c5f8d; font-size: 24px; font-weight: bold;');
console.log('%c鎌倉で味わう、本格ガレット', 'color: #666; font-size: 14px;');
