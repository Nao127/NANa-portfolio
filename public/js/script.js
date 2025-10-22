// DOM取得
const worksTypes = document.querySelectorAll('.type_button-item');
const allCircles = document.querySelectorAll('.circle');
const WorksCards = document.querySelectorAll('.works-card');

// モーダル関連DOM
const modalOverlay = document.createElement('div');
modalOverlay.classList.add('modal-overlay');
document.body.appendChild(modalOverlay);

// 各タブの初期スライド位置（0番目のカード）を保持
const currentSlideIndex = {
    '01': 0, // 'Site'タブのアクティブなカードインデックス
    '02': 0  // 'Design'タブのアクティブなカードインデックス
};

// イベントリスナー付加
worksTypes.forEach((workType) => {
    workType.addEventListener('click', tabSwitch);
});
allCircles.forEach((circle) => {
    circle.addEventListener('click', handleSlide);
});

// 作品カードクリックでモーダル表示
WorksCards.forEach(card => {
    card.addEventListener('click', (event) => {
        event.preventDefault(); // リンクのデフォルト動作を停止
        handleMouseLeave();
        openModal(card);        
    });
});


// タブ切り替え時の処理
function tabSwitch(event) {
    const typeTargetData = event.currentTarget.dataset.type;
    const typeItems = document.querySelectorAll('.works-type .type_button-item');
    const worksContainers = document.querySelectorAll('.c_container .card_container');
    const circlesInBar = document.querySelectorAll('.bar .circle');

    // 全てのタブボタンから 'is-active' クラスを削除
    typeItems.forEach((typeItem) => {
        typeItem.classList.remove('is-active');
    });

    // 全てのカードコンテナを非表示にし、スライド位置をリセット
    worksContainers.forEach((worksContainer) => {
        worksContainer.classList.remove('is-show');
        if (window.innerWidth < 768) {
            // タブ切り替え時に、そのタブで最後に表示していたカードのtransformを適用
            const targetContainerType = worksContainer.dataset.container;
            const indexToRestore = currentSlideIndex[targetContainerType] || 0; // なければ0
            const numberOfCards = worksContainer.querySelectorAll('.works-card').length;
            const slidePercentage = - (100 / numberOfCards) * indexToRestore;
            worksContainer.style.transform = `translateX(${slidePercentage}%)`;
        }
    });

    // クリックされたボタンに 'is-active' クラスを付加
    event.currentTarget.classList.add('is-active');

    // クリックされたボタンのデータ属性と同じ値を持つカードコンテナを表示
    let activeContainer = null;
    worksContainers.forEach((worksContainer) => {
        if (worksContainer.dataset.container === typeTargetData) {
            worksContainer.classList.add('is-show');
            activeContainer = worksContainer;

            // アクティブになったコンテナに、保存されているスライド位置を適用
            if (window.innerWidth < 768) {
                const indexToRestore = currentSlideIndex[typeTargetData] || 0;
                const numberOfCards = activeContainer.querySelectorAll('.works-card').length;
                const slidePercentage = - (100 / numberOfCards) * indexToRestore;
                activeContainer.style.transform = `translateX(${slidePercentage}%)`;
            }
        }
    });

    updateSliderBarVisibility(activeContainer, circlesInBar, typeTargetData);

}

// === スライドバーの表示/非表示を更新 ===
function updateSliderBarVisibility(activeContainer, circlesInBar, activeTabType) {
    if (window.innerWidth < 768) { // 小画面の場合のみスライドバーを更新
        if (activeContainer) {
            const numberOfCards = activeContainer.querySelectorAll('.works-card').length;
            const currentActiveIndex = currentSlideIndex[activeTabType] || 0; // 保存されているインデックスを使用

            circlesInBar.forEach((circle, index) => {
                if (index < numberOfCards) {
                    circle.classList.remove('is-hidden');
                    if (index === currentActiveIndex) { // 保存されているインデックスと一致するサークルをアクティブに
                        circle.classList.add('is-active');
                    } else {
                        circle.classList.remove('is-active');
                    }
                } else {
                    circle.classList.add('is-hidden');
                }
            });
        } else {
            circlesInBar.forEach(circle => circle.classList.add('is-hidden'));
        }
    } else { // 大画面の場合、全てのサークルを非表示
        circlesInBar.forEach(circle => circle.classList.add('is-hidden'));
    }
}


// カードスライド時の処理
function handleSlide(eventObject) {
    if (window.innerWidth >= 768) return;

    const clickedCircle = eventObject.currentTarget;
    const barElement = clickedCircle.closest('.bar');
    const circlesInBar = Array.from(barElement.querySelectorAll('.circle:not(.is-hidden)'));

    const activeContainer = document.querySelector('.card_container.is-show');

    if (!activeContainer) {
        console.error('表示中のカードコンテナが見つかりません。');
        return;
    }

    const numberOfCards = activeContainer.querySelectorAll('.works-card').length;
    const clickedCircleIndex = circlesInBar.indexOf(clickedCircle);

    const slidePercentage = - (100 / numberOfCards) * clickedCircleIndex;

    activeContainer.style.transform = `translateX(${slidePercentage}%)`;

    circlesInBar.forEach((circle) => {
        circle.classList.remove('is-active');
    });
    clickedCircle.classList.add('is-active');

    // アクティブなタブのインデックスを更新
    const activeTab = document.querySelector('.works-type .type_button-item.is-active');
    if (activeTab) {
        const activeTabType = activeTab.dataset.type;
        currentSlideIndex[activeTabType] = clickedCircleIndex;
    }

}

// 初期ロード時のタブとスライドバーの状態を設定
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.type_button-item').forEach(item => item.classList.remove('is-active'));

    const firstTab = document.querySelector('.type_button-item[data-type="01"]');
    if (firstTab) {
        const syntheticEvent = { currentTarget: firstTab };
        tabSwitch(syntheticEvent);
    } else {
        console.warn('初期表示すべきタブボタンが見つかりませんでした。');
        document.querySelectorAll('.c_container .card_container').forEach(container => {
            container.classList.remove('is-show');
            container.style.transform = 'translateX(0%)';
        });
        document.querySelectorAll('.bar .circle').forEach(circle => circle.classList.add('is-hidden'));
    }
});

// === 画面リサイズ時にバーの状態を更新 ===
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        const activeTab = document.querySelector('.works-type .type_button-item.is-active');
        if (activeTab) {
            const syntheticEvent = { currentTarget: activeTab };
            tabSwitch(syntheticEvent);
        }
    }, 250);
});

// モーダルウィンドウ関連関数

function openModal(cardElement) {
    modalOverlay.innerHTML = `
        <div class="modal-content">
            <button class="modal-close-btn"><i class="las la-times"></i></button>
            <img src="${cardElement.querySelector('img').src}" alt="${cardElement.querySelector('h3').textContent}" class="modal-image">
            <h3 class="modal-title">${cardElement.querySelector('h3').textContent}</h3>
            <div class="modal-description-container">
                ${cardElement.querySelector('.description-container').innerHTML}
            </div>
            <div class="modal-tags">
                <ul class="tag-container">${cardElement.querySelector('.tag-container').innerHTML}</ul>
            </div>
            <div class="modal-links">
                <a href="${cardElement.querySelector('a').href}" target="_blank" rel="noopener noreferrer"><i class="las la-external-link-alt"></i>サイトを見る</a>
                <!-- GitHubリンクなど、必要に応じて追加 -->
            </div>
        </div>
    `;

    modalOverlay.classList.add('is-active');
    document.body.classList.add('modal-open');
    
    const closeBtn = modalOverlay.querySelector('.modal-close-btn');
    closeBtn.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) { // オーバーレイ自身をクリックした場合
            closeModal();
        }
    });
    document.addEventListener('keydown', handleEscKey);

    // モーダル内のインタラクティブ要素を再取得
    updateInteractiveElements();
}


function closeModal() {
    modalOverlay.classList.remove('is-active');

    document.body.classList.remove('modal-open');

    document.removeEventListener('keydown', handleEscKey);
    setTimeout(() => modalOverlay.innerHTML = '', 300);

    handleMouseLeave();

    updateInteractiveElements();
}

function handleEscKey(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
}


// cutom cursor
const cursorDot = document.querySelector('.custom-cursor-dot');
const cursorRing = document.querySelector('.custom-cursor-ring');
let interactiveElements = document.querySelectorAll('a:not(.img-anchor), button, input, textarea, .works-card, .circle span, .modal-content a, .modal-content button');
let isFirstMove = true; // 初回移動を検知するフラグ
let isHovering = false; // ホバー状態を管理

function updateInteractiveElements() {
    // 既存のイベントリスナー削除
    interactiveElements.forEach(element => {
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
    });

    interactiveElements = document.querySelectorAll('a:not(.img-anchor), button, input, textarea, .works-card, .circle span, .modal-content a, .modal-content button');

    // イベントリスナー再設定
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', handleMouseEnter);
        element.addEventListener('mouseleave', handleMouseLeave);
    });
}

// カスタムポインターをマウスに追従
document.addEventListener('mousemove', throttle((eventObject) => {
    cursorDot.style.left = eventObject.clientX + 'px';
    cursorDot.style.top = eventObject.clientY + 'px';
    cursorRing.style.left = eventObject.clientX + 'px';
    cursorRing.style.top = eventObject.clientY + 'px';
}, 16));

// スロットリング関数
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const context = this;
        const args = arguments;
        // スロットル中でないなら
        if(!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ホバー時のスタイル
function handleMouseEnter() {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '1';
    cursorDot.classList.remove('left-elements');
    cursorRing.classList.add('is-hovering');
}

function handleMouseLeave() {
    cursorDot.style.opacity = '1';
    cursorRing.style.opacity = '0';
    cursorDot.classList.add('left-elements');
    cursorRing.classList.remove('is-hovering');
}

updateInteractiveElements();

// viewport出入り
document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorDot.classList.remove('left-elements');
});
document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity = '1';
});


// ===== チャットボット機能 =====
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSendBtn = document.getElementById('chatSendBtn');

if (chatMessages && chatInput && chatSendBtn) {
    // メッセージを追加
    function addChatMessage(content, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = content;
        
        messageDiv.appendChild(contentDiv);
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 入力中表示
    function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message';
        typingDiv.id = 'typingIndicator';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content typing-indicator';
        contentDiv.innerHTML = '<span></span><span></span><span></span>';
        
        typingDiv.appendChild(contentDiv);
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 入力中表示を削除
    function removeTyping() {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
    }

    // メッセージ送信
    async function sendChatMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        addChatMessage(message, true);
        chatInput.value = '';
        chatSendBtn.disabled = true;
        chatInput.disabled = true;
        
        showTyping();
        
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            removeTyping();
            
            if (data.reply) {
                addChatMessage(data.reply);
            } else {
                addChatMessage('エラーが発生しました。もう一度お試しください。');
            }
        } catch (error) {
            removeTyping();
            addChatMessage('通信エラーが発生しました。');
            console.error('エラー:', error);
        } finally {
            chatSendBtn.disabled = false;
            chatInput.disabled = false;
            chatInput.focus();
        }
    }

    // イベントリスナー
    chatSendBtn.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
}

// ===== コンタクトフォーム機能（新規追加） =====
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    // フォーム送信時の処理
    contactForm.addEventListener('submit', async (event) => {
        // デフォルトのフォーム送信動作（ページリロード）を防止
        event.preventDefault();
        
        // フォームの各入力欄から値を取得
        const formData = {
            name: contactForm.querySelector('input[name="name"]').value,
            email: contactForm.querySelector('input[name="email"]').value,
            message: contactForm.querySelector('textarea[name="message"]').value
        };
        
        // 送信ボタンを取得
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // 送信中は二重送信を防ぐためボタンを無効化
        submitButton.disabled = true;
        submitButton.textContent = '送信中...';
        
        try {
            // サーバーにデータを送信
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            // サーバーからの応答を取得
            const data = await response.json();
            
            if (data.success) {
                // 送信成功時の処理
                showContactMessage('success', data.message || 'お問い合わせを受け付けました。ありがとうございます！');
                
                // フォームをリセット（入力欄を空にする）
                contactForm.reset();
            } else {
                // 送信失敗時の処理
                showContactMessage('error', data.error || '送信に失敗しました。もう一度お試しください。');
            }
            
        } catch (error) {
            // ネットワークエラーなどの予期しないエラー
            console.error('送信エラー:', error);
            showContactMessage('error', 'エラーが発生しました。インターネット接続を確認して、もう一度お試しください。');
        } finally {
            // 送信処理が終わったらボタンを再度有効化
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// メッセージ表示関数
// 成功/失敗メッセージをユーザーに表示します
function showContactMessage(type, message) {
    // 既存のメッセージがあれば削除
    const existingMessage = document.querySelector('.contact-message-alert');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 新しいメッセージ要素を作成
    const messageDiv = document.createElement('div');
    messageDiv.className = `contact-message-alert ${type}`;
    messageDiv.textContent = message;
    
    // フォームの上にメッセージを挿入
    contactForm.parentNode.insertBefore(messageDiv, contactForm);
    
    // メッセージをアニメーションで表示
    setTimeout(() => {
        messageDiv.classList.add('show');
    }, 10);
    
    // 5秒後に自動的にメッセージを消す
    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 5000);
}

// ===== テーマ切り替え機能 =====

const themeToggleBtn = document.getElementById('theme-toggle-btn');
const body = document.body;

// アイコンをHTMLに動的に追加
themeToggleBtn.innerHTML = '<i class="las la-sun"></i><i class="las la-moon"></i>';

// 1. ページ読み込み時に、保存されたテーマ設定を適用する
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    modalOverlay.classList.add('dark-mode');
}

// 2. ボタンクリック時のイベントリスナー
themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    modalOverlay.classList.toggle('dark-mode');
    
    // 3. 切り替えた設定をlocalStorageに保存する
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
    if (modalOverlay.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});