// Initialize Firebase
const auth = firebase.auth();
const db = firebase.firestore();

// Check authentication state
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // Load user data
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();

        if (userData.role !== 'student') {
            window.location.href = 'mentor-dashboard.html';
            return;
        }

        // Update UI with user data
        document.getElementById('studentName').textContent = userData.name;
        document.getElementById('userName').textContent = userData.name;
        document.getElementById('lastLogin').textContent = new Date().toLocaleDateString();

        // Load upcoming sessions
        loadUpcomingSessions(user.uid);
        
        // Load mentors
        loadMyMentors(user.uid);
        
        // Load progress
        loadProgress(user.uid);
        
        // Load resources
        loadStudyResources(userData.subjects);
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

async function loadUpcomingSessions(userId) {
    const sessionsRef = db.collection('sessions')
        .where('studentId', '==', userId)
        .where('timestamp', '>', new Date())
        .orderBy('timestamp')
        .limit(5);

    const sessions = await sessionsRef.get();
    const sessionsList = document.getElementById('upcomingSessions');
    sessionsList.innerHTML = '';

    sessions.forEach(session => {
        const data = session.data();
        const sessionElement = document.createElement('div');
        sessionElement.className = 'session-item';
        sessionElement.innerHTML = `
            <div class="session-info">
                <h3>${data.subject}</h3>
                <p>with ${data.mentorName}</p>
                <p>${new Date(data.timestamp.toDate()).toLocaleString()}</p>
            </div>
            <button class="join-btn" onclick="joinSession('${session.id}')">Join</button>
        `;
        sessionsList.appendChild(sessionElement);
    });
}

async function loadMyMentors(userId) {
    const mentorsRef = db.collection('mentorships')
        .where('studentId', '==', userId)
        .where('status', '==', 'active');

    const mentorships = await mentorsRef.get();
    const mentorsList = document.getElementById('myMentors');
    mentorsList.innerHTML = '';

    mentorships.forEach(async (mentorship) => {
        const data = mentorship.data();
        const mentorDoc = await db.collection('users').doc(data.mentorId).get();
        const mentorData = mentorDoc.data();

        const mentorElement = document.createElement('div');
        mentorElement.className = 'mentor-item';
        mentorElement.innerHTML = `
            <img src="${mentorData.profilePic || 'https://placeholder.com/50'}" alt="${mentorData.name}">
            <div class="mentor-info">
                <h3>${mentorData.name}</h3>
                <p>${mentorData.subjects.join(', ')}</p>
            </div>
            <button onclick="chatWithMentor('${data.mentorId}')">Chat</button>
        `;
        mentorsList.appendChild(mentorElement);
    });
}

// Add other necessary functions for handling sessions, progress tracking, etc.