import { 
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

export const chatService = {
    // Send message
    async sendMessage(studentId, mentorId, message) {
        try {
            await addDoc(collection(db, 'messages'), {
                studentId,
                mentorId,
                content: message,
                timestamp: serverTimestamp()
            });
        } catch (error) {
            throw error;
        }
    },

    // Listen to chat messages
    subscribeToChat(studentId, mentorId, callback) {
        const q = query(
            collection(db, 'messages'),
            where('studentId', '==', studentId),
            where('mentorId', '==', mentorId),
            orderBy('timestamp', 'asc')
        );

        return onSnapshot(q, (snapshot) => {
            const messages = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            callback(messages);
        });
    }
};