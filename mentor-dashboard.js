// Initialize Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// Check authentication state
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // Load user data
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();

        if (userData.role !== 'mentor') {
            window.location.href = 'student-dashboard.html';
            return;
        }

        // Update UI with user data
        document.getElementById('mentorName').textContent = userData.name;
        document.getElementById('userName').textContent = userData.name;
        document.getElementById('lastLogin').textContent = new Date().toLocaleDateString();

        // Load today's schedule
        loadTodaySchedule(user.uid);
        
        // Load student requests
        loadStudentRequests(user.uid);
        
        // Load earnings
        loadEarningsOverview(user.uid);
        
        // Load teaching stats
        loadTeachingStats(user.uid);
    } else {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
    }
});

// Logout handler
document.getElementById('logoutBtn').addEventListener('click', () => {
    auth.signOut().then(() => {
        window.location.href = 'index.html';
    });
});

async function loadTodaySchedule(userId) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sessionsRef = db.collection('sessions')
        .where('mentorId', '==', userId)
        .where('timestamp', '>=', today)
        .where('timestamp', '<', tomorrow)
        .orderBy('timestamp');

    const sessions = await sessionsRef.get();
    const scheduleList = document.getElementById('todaySchedule');
    scheduleList.innerHTML = '';

    sessions.forEach(session => {
        const data = session.data();
        const sessionElement = document.createElement('div');
        sessionElement.className = 'schedule-item';
        sessionElement.innerHTML = `
            <div class="session-info">
                <h3>${data.subject}</h3>
                <p>with ${data.studentName}</p>
                <p>${new Date(data.timestamp.toDate()).toLocaleTimeString()}</p>
            </div>
            <button class="start-btn" onclick="startSession('${session.id}')">Start</button>
        `;
        scheduleList.appendChild(sessionElement);
    });
}

async function loadStudentRequests(userId) {
    const requestsRef = db.collection('mentorships')
        .where('mentorId', '==', userId)
        .where('status', '==', 'pending');

    const requests = await requestsRef.get();
    const requestsList = document.getElementById('studentRequests');
    requestsList.innerHTML = '';

    requests.forEach(async (request) => {
        const data = request.data();
        const studentDoc = await db.collection('users').doc(data.studentId).get();
        const studentData = studentDoc.data();

        const requestElement = document.createElement('div');
        requestElement.className = 'request-item';
        requestElement.innerHTML = `
            <div class="student-info">
                <h3>${studentData.name}</h3>
                <p>${studentData.class}</p>
                <p>Subjects: ${data.subjects.join(', ')}</p>
            </div>
            <div class="request-actions">
                <button onclick="acceptRequest('${request.id}')" class="accept-btn">Accept</button>
                <button onclick="declineRequest('${request.id}')" class="decline-btn">Decline</button>
            </div>
        `;
        requestsList.appendChild(requestElement);
    });
}

async function loadEarningsOverview(userId) {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const sessionsRef = db.collection('sessions')
        .where('mentorId', '==', userId)
        .where('status', '==', 'completed')
        .where('timestamp', '>=', firstDayOfMonth);

    const sessions = await sessionsRef.get();
    let monthlyEarnings = 0;
    let totalHours = 0;

    sessions.forEach(session => {
        const data = session.data();
        monthlyEarnings += data.amount || 0;
        totalHours += data.duration || 0;
    });

    document.getElementById('monthlyEarnings').textContent = `₹${monthlyEarnings}`;
    document.getElementById('totalHours').textContent = totalHours;
}

// Add other necessary functions for handling sessions, requests, etc.