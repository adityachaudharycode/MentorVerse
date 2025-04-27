// Inbox functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize inbox filtering
  initializeInboxFilters();
  
  // Handle message selection
  const messageItems = document.querySelectorAll('.message-item');
  messageItems.forEach(item => {
    item.addEventListener('click', () => {
      messageItems.forEach(msg => msg.classList.remove('active'));
      item.classList.add('active');
      
      const studentName = item.querySelector('h4').textContent;
      const chatHeader = document.querySelector('.chat-header .chat-user h3');
      if (chatHeader) {
        chatHeader.textContent = studentName;
      }
      
      const unreadBadge = item.querySelector('.unread-badge');
      if (unreadBadge) {
        unreadBadge.remove();
      }
    });
  });
  
  // Handle message sending
  const chatInput = document.querySelector('.chat-input input');
  const sendButton = document.querySelector('.send-btn');
  
  if (chatInput && sendButton) {
    sendButton.addEventListener('click', () => {
      sendMessage(chatInput.value);
    });
    
    chatInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        sendMessage(chatInput.value);
      }
    });
  }
});

function sendMessage(text) {
  if (!text.trim()) return;
  
  const chatMessages = document.querySelector('.chat-messages');
  if (!chatMessages) return;
  
  // Create message element
  const messageEl = document.createElement('div');
  messageEl.className = 'message mentor';
  messageEl.innerHTML = `
    <div class="message-content">
      <p>${text}</p>
    </div>
    <div class="message-time">${formatTime(new Date())}</div>
  `;
  
  // Insert message before typing indicator
  const typingIndicator = document.querySelector('.message-typing');
  if (typingIndicator) {
    chatMessages.insertBefore(messageEl, typingIndicator);
  } else {
    chatMessages.appendChild(messageEl);
  }
  
  // Clear input
  const chatInput = document.querySelector('.chat-input input');
  if (chatInput) {
    chatInput.value = '';
  }
  
  // Scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Simulate student reply
  showTypingIndicator();
  simulateReply();
}

function showTypingIndicator() {
  const typingIndicator = document.querySelector('.message-typing');
  if (typingIndicator) {
    typingIndicator.style.display = 'flex';
  }
}

function hideTypingIndicator() {
  const typingIndicator = document.querySelector('.message-typing');
  if (typingIndicator) {
    typingIndicator.style.display = 'none';
  }
}

function simulateReply() {
  setTimeout(() => {
    hideTypingIndicator();
    
    const replies = [
      "Thank you for your guidance! This is very helpful.",
      "I'll implement these suggestions and get back to you with results.",
      "That makes sense. Do you have any resources you could recommend on this topic?",
      "I appreciate your quick response. This clarifies my doubts."
    ];
    
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return;
    
    const replyEl = document.createElement('div');
    replyEl.className = 'message student';
    replyEl.innerHTML = `
      <div class="message-content">
        <p>${replies[Math.floor(Math.random() * replies.length)]}</p>
      </div>
      <div class="message-time">${formatTime(new Date())}</div>
    `;
    
    chatMessages.appendChild(replyEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 2000);
}

function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12;
  
  return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
}

// Initialize inbox filters
function initializeInboxFilters() {
  const subjectFilter = document.getElementById('subject-filter');
  const priorityFilter = document.getElementById('priority-filter');
  const statusFilter = document.getElementById('status-filter');
  const dateFilter = document.getElementById('date-filter');
  const messageList = document.getElementById('messageList');
  const messageItems = messageList ? messageList.querySelectorAll('.message-item') : [];
  
  function applyFilters() {
    const subjectValue = subjectFilter ? subjectFilter.value : 'all';
    const priorityValue = priorityFilter ? priorityFilter.value : 'all';
    const statusValue = statusFilter ? statusFilter.value : 'all';
    const dateValue = dateFilter ? dateFilter.value : 'all';
    
    messageItems.forEach(item => {
      const subject = item.getAttribute('data-subject');
      const priority = item.getAttribute('data-priority');
      const status = item.getAttribute('data-status');
      const date = item.getAttribute('data-date');
      
      const subjectMatch = subjectValue === 'all' || subject === subjectValue;
      const priorityMatch = priorityValue === 'all' || priority === priorityValue;
      const statusMatch = statusValue === 'all' || status === statusValue;
      const dateMatch = dateValue === 'all' || date === dateValue;
      
      if (subjectMatch && priorityMatch && statusMatch && dateMatch) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  }
  
  if (subjectFilter) subjectFilter.addEventListener('change', applyFilters);
  if (priorityFilter) priorityFilter.addEventListener('change', applyFilters);
  if (statusFilter) statusFilter.addEventListener('change', applyFilters);
  if (dateFilter) dateFilter.addEventListener('change', applyFilters);
}