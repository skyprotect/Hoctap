/**
 * CHAT MODULE
 * Quản lý tin nhắn thời gian thực giữa Phụ huynh và Học sinh, Bong bóng chat thu nhỏ và Bộ chọn Emoji
 */
(function() {
    'use strict';

    let chatPollingInterval = null;

    const ChatModule = {
        init: function() {
            this.startNotificationPolling();
        },

        sendMessage: function() {
            const input = document.getElementById('chat-input');
            if (!input || !input.value.trim()) return;

            const text = input.value.trim();
            const config = (window.AppState && window.AppState.config) || {};
            const senderId = config.defaultStudentId || 'std_htsj4gbmo';
            const senderName = config.studentName || 'Học sinh';
            const receiverId = 'parent';

            fetch('/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senderId, senderName, receiverId, text })
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    input.value = '';
                    this.loadMessages();
                }
            })
            .catch(err => console.warn("[Chat] Send error:", err));
        },

        loadMessages: function() {
            const container = document.getElementById('chat-messages-body');
            if (!container) return;

            const config = (window.AppState && window.AppState.config) || {};
            const studentId = config.defaultStudentId || 'std_htsj4gbmo';
            const roomId = [studentId, 'parent'].sort().join('_');

            fetch(`/api/chat/messages?roomId=${encodeURIComponent(roomId)}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && Array.isArray(data.messages)) {
                        this.renderMessages(data.messages);
                    }
                })
                .catch(err => console.warn("[Chat] Load messages error:", err));
        },

        renderMessages: function(messages) {
            const container = document.getElementById('chat-messages-body');
            if (!container) return;

            const config = (window.AppState && window.AppState.config) || {};
            const currentId = config.defaultStudentId || 'std_htsj4gbmo';

            container.innerHTML = messages.map(m => {
                const isMe = (m.senderId === currentId);
                return `
                    <div class="chat-message ${isMe ? 'outgoing' : 'incoming'}">
                        <div class="message-sender">${m.senderName || (isMe ? 'Con' : 'Phụ huynh')}</div>
                        <div class="message-text">${m.text}</div>
                    </div>
                `;
            }).join('');

            container.scrollTop = container.scrollHeight;
        },

        toggleMinimize: function(show) {
            const chatWindow = document.getElementById('chat-main-window');
            const chatBubble = document.getElementById('chat-minimized-bubble');

            if (chatWindow && chatBubble) {
                if (show === false) {
                    // Mở lại cửa sổ chat
                    chatWindow.classList.remove('hidden');
                    chatBubble.classList.add('hidden');
                    this.loadMessages();
                } else {
                    // Thu nhỏ chat
                    chatWindow.classList.add('hidden');
                    chatBubble.classList.remove('hidden');
                }
            }
        },

        closeCompletely: function() {
            const chatWindow = document.getElementById('chat-main-window');
            const chatBubble = document.getElementById('chat-minimized-bubble');
            if (chatWindow) chatWindow.classList.add('hidden');
            if (chatBubble) chatBubble.classList.add('hidden');
        },

        toggleEmoji: function() {
            const picker = document.getElementById('emoji-picker-container');
            if (picker) picker.classList.toggle('hidden');
        },

        insertEmoji: function(emoji) {
            const input = document.getElementById('chat-input');
            if (input) {
                input.value += emoji;
                input.focus();
            }
            this.toggleEmoji();
        },

        startNotificationPolling: function() {
            if (chatPollingInterval) clearInterval(chatPollingInterval);
            chatPollingInterval = setInterval(() => {
                const config = (window.AppState && window.AppState.config) || {};
                const studentId = config.defaultStudentId;
                if (!studentId) return;

                fetch(`/api/chat/notifications?studentId=${encodeURIComponent(studentId)}`)
                    .then(res => res.json())
                    .then(data => {
                        if (data.success && data.notifications) {
                            const badge = document.getElementById('chat-unread-badge');
                            const count = Object.keys(data.notifications).length;
                            if (badge) {
                                badge.textContent = count;
                                badge.style.display = count > 0 ? 'inline-block' : 'none';
                            }
                        }
                    })
                    .catch(() => {});
            }, 10000);
        }
    };

    if (typeof window !== 'undefined') {
        window.ChatModule = ChatModule;
    }
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = ChatModule;
    }
})();
