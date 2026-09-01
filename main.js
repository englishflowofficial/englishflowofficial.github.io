import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInAnonymously, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp, setDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

let db, auth, currentUser;
let userXP = parseInt(localStorage.getItem('userXP')) || 240;
let userStreak = parseInt(localStorage.getItem('userStreak')) || 3;
let currentQuizIndex = 0;
let quizDatabase = [];

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
export function playTone(type) {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  if (type === 'correct') {
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
    osc.frequency.setValueAtTime(880.00, audioCtx.currentTime + 0.12);
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
  } else if (type === 'xp') {
    osc.frequency.setValueAtTime(440, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.25);
    gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
  } else {
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, audioCtx.currentTime);
    osc.frequency.setValueAtTime(170, audioCtx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.18, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
  }
  osc.start();
  osc.stop(audioCtx.currentTime + 0.4);
}
window.playTone = playTone;

export function playAudioPronunciation(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }
}
window.playAudioPronunciation = playAudioPronunciation;

async function init() {
  try {
    const res = await fetch('/api/firebase-config');
    const config = await res.json();
    const app = initializeApp(config);
    auth = getAuth(app);
    db = config.firestoreDatabaseId ? getFirestore(app, config.firestoreDatabaseId) : getFirestore(app);
    
    setupAuthListeners();
    
    setupLiveToasts();
    setupLeaderboard();
    setupComments();
    
    if (document.getElementById('quiz-anchor')) await loadQuizzes();
    
    // Always init the UI (covers Guest mode immediately)
    updateUserProfileNav(currentUser);
  } catch (err) {
    console.error("Firebase Init Error:", err);
    updateUserProfileNav(null);
  }
}

function setupAuthListeners() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      currentUser = user;
      updateUserProfileNav(user);
      
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.xp > userXP) {
            userXP = data.xp;
            localStorage.setItem('userXP', userXP);
        }
        if (data.streak > userStreak) {
            userStreak = data.streak;
            localStorage.setItem('userStreak', userStreak);
        }
      } else {
        await setDoc(userRef, { 
            name: user.displayName || "Learner", 
            xp: userXP, 
            streak: userStreak, 
            photoURL: user.photoURL 
        });
      }
      updateXPUI();
    } else {
      currentUser = null;
      updateUserProfileNav(null);
    }
  });
}

function updateUserProfileNav(user) {
  const navProfile = document.getElementById('user-profile-nav');
  const modalAvatar = document.getElementById('modal-avatar');
  const modalName = document.getElementById('modal-name');
  const modalAuthContainer = document.getElementById('modal-auth-container');
  const modalStreak = document.getElementById('modal-streak');
  const modalXp = document.getElementById('modal-xp');
  
  if (modalStreak) modalStreak.innerText = userStreak;
  if (modalXp) modalXp.innerText = userXP;
  
  if (!user) {
    // Guest Mode
    if (navProfile) {
      navProfile.innerHTML = `
        <div style="font-size: 0.9rem; font-weight: 700; color: #FFF;">Guest</div>
        <div style="width: 30px; height: 30px; border-radius: 50%; background: #94a3b8; display: flex; align-items: center; justify-content: center; font-weight: bold; color: white;">G</div>
      `;
    }
    if (modalAvatar) {
      modalAvatar.innerHTML = 'G';
      modalAvatar.style.background = '#94a3b8';
      modalAvatar.style.backgroundImage = 'none';
    }
    if (modalName) modalName.innerText = "Guest Learner";
    if (modalAuthContainer) {
      modalAuthContainer.innerHTML = `
        <button class="btn-3d btn-secondary" style="width: 100%; margin-top: 15px;" onclick="window.signInWithGoogle()">Sign in with Google to Save Progress</button>
      `;
    }
  } else {
    // Logged In User
    if (navProfile) {
      navProfile.innerHTML = `
        <div style="font-size: 0.9rem; font-weight: 700; color: #FFF;">${user.displayName || 'User'}</div>
        <img src="${user.photoURL || 'https://via.placeholder.com/30'}" alt="Avatar" style="width: 30px; height: 30px; border-radius: 50%; border: 2px solid white; object-fit: cover;">
      `;
    }
    if (modalAvatar) {
      modalAvatar.innerHTML = '';
      modalAvatar.style.background = 'transparent';
      modalAvatar.style.backgroundImage = `url('${user.photoURL || 'https://via.placeholder.com/80'}')`;
      modalAvatar.style.backgroundSize = 'cover';
    }
    if (modalName) modalName.innerText = user.displayName || "Learner";
    if (modalAuthContainer) {
      modalAuthContainer.innerHTML = `
        <button class="btn-3d" style="width: 100%; margin-top: 15px; background: #e2e8f0; border-color: #cbd5e1; color: #475569;" onclick="window.signOutUser()">Sign Out</button>
      `;
    }
  }
}

window.signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    currentUser = user;
    
    // Merge local XP and streak to Firestore
    await setDoc(doc(db, "users", user.uid), {
      name: user.displayName, 
      photoURL: user.photoURL, 
      xp: userXP,
      streak: userStreak
    }, { merge: true });
    
    updateUserProfileNav(user);
    
    alert("Signed in! Progress saved.");
    
    const profileModal = document.getElementById('profile-modal-overlay');
    if (profileModal) profileModal.style.display = 'none';
    
  } catch (err) {
    console.error("Google sign in error:", err);
  }
}

window.signOutUser = async () => {
  if (auth) {
    await auth.signOut();
    currentUser = null;
    alert("Signed out successfully.");
    updateUserProfileNav(null);
    
    const profileModal = document.getElementById('profile-modal-overlay');
    if (profileModal) profileModal.style.display = 'none';
  }
}

export function addXP(amount) {
  userXP += amount;
  localStorage.setItem('userXP', userXP);
  updateXPUI();
  playTone('xp');
  if (currentUser) {
    setDoc(doc(db, "users", currentUser.uid), { xp: userXP, name: currentUser.displayName || "Guest" }, { merge: true });
  }
}
window.addXP = addXP;

function updateXPUI() {
  const xpText = document.getElementById('user-xp-text');
  const leadXp = document.getElementById('leaderboard-user-xp');
  if (xpText) xpText.innerText = userXP + " XP";
  if (leadXp) leadXp.innerText = userXP + " XP";
}

const simulatedNames = ["Rahul", "Sofia", "Ahmed", "Elena", "Aarav", "David"];
function setupLiveToasts() {
  const q = query(collection(db, "activities"), orderBy("timestamp", "desc"), limit(1));
  onSnapshot(q, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
      if (change.type === "added") spawnActivityToast(change.doc.data());
    });
  });
  setInterval(() => {
    const randomName = simulatedNames[Math.floor(Math.random() * simulatedNames.length)];
    spawnActivityToast({ name: randomName, action: "completed a lesson!", xp: "+15 XP" });
  }, 12000);
}

function spawnActivityToast(data) {
  const toastTray = document.getElementById('toast-tray');
  if(!toastTray) return;
  const toast = document.createElement('div');
  toast.className = 'live-toast';
  toast.innerHTML = `<div class="toast-icon">✨</div><div style="flex:1;"><div class="toast-content"><strong>${data.name || 'A learner'}</strong> ${data.action}</div><div class="toast-time">Just now • <span style="color:var(--primary); font-weight:800;">${data.xp || '+10 XP'}</span></div></div>`;
  toastTray.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(15px)'; setTimeout(() => toast.remove(), 350); }, 4200);
}

function setupLeaderboard() {
  const q = query(collection(db, "users"), orderBy("xp", "desc"), limit(5));
  const container = document.getElementById('leaderboard-container');
  if(!container) return;
  onSnapshot(q, (snapshot) => {
    if(snapshot.empty) return;
    let html = '';
    let rank = 1;
    snapshot.forEach((doc) => {
      const data = doc.data();
      const isMe = currentUser && doc.id === currentUser.uid;
      const rankIcon = rank === 1 ? '🥇' : (rank===2 ? '🥈' : '🎖️');
      html += `<div class="leaderboard-row ${isMe ? 'highlight' : ''}"><div class="rank-num">${rankIcon}</div><div class="user-info-flex"><div class="user-avatar" style="background: #FFEAA7;">${data.name ? data.name.charAt(0) : 'U'}</div><div><div style="font-size: 0.95rem;">${isMe ? 'You (Learner)' : (data.name || 'Guest')}</div></div></div><div class="user-xp-score">${data.xp} XP</div></div>`;
      rank++;
    });
    container.innerHTML = html;
  });
}

async function loadQuizzes() {
  try {
    const res = await fetch('/quizzes.json');
    quizDatabase = await res.json();
    renderCurrentQuiz();
  } catch(err) { console.log(err); }
}

export function renderCurrentQuiz() {
  if(!quizDatabase.length) return;
  const q = quizDatabase[currentQuizIndex];
  const qCounter = document.getElementById('quiz-question-counter');
  const qProg = document.getElementById('quiz-progress-bar');
  if(qCounter) qCounter.innerText = `Question ${currentQuizIndex + 1} of 50`;
  if(qProg) qProg.style.width = `${((currentQuizIndex + 1) / quizDatabase.length) * 100}%`;
  document.getElementById('quiz-category-badge').innerText = q.category;
  document.getElementById('quiz-prompt').innerText = q.question;

  const optionsBox = document.getElementById('quiz-options-box');
  optionsBox.innerHTML = '';
  document.getElementById('quiz-feedback-box').style.display = 'none';
  document.getElementById('quiz-next-btn').style.display = 'none';

  q.options.forEach((optionText, idx) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-opt-btn';
    btn.innerHTML = `<span>${optionText}</span> <span style="font-size:1.2rem; opacity:0.6;">⚪</span>`;
    btn.onclick = () => selectQuizAnswer(idx);
    optionsBox.appendChild(btn);
  });
}

window.selectQuizAnswer = (selectedIndex) => {
  const q = quizDatabase[currentQuizIndex];
  const buttons = document.querySelectorAll('.quiz-opt-btn');
  const fb = document.getElementById('quiz-feedback-box');
  buttons.forEach(b => b.disabled = true);

  if (selectedIndex === q.answer) {
    buttons[selectedIndex].classList.add('correct');
    buttons[selectedIndex].querySelector('span:last-child').innerText = '✅';
    fb.style.display = 'block'; fb.style.background = '#E5FAD7'; fb.style.color = '#256601'; fb.style.border = '2px solid #58CC02';
    fb.innerHTML = `🎉 <strong>Awesome Job! (+10 XP)</strong><br><span style="font-size:0.9rem; font-weight:700;">${q.explanation}</span>`;
    playTone('correct'); addXP(10);
  } else {
    buttons[selectedIndex].classList.add('wrong');
    buttons[selectedIndex].querySelector('span:last-child').innerText = '❌';
    buttons[q.answer].classList.add('correct');
    buttons[q.answer].querySelector('span:last-child').innerText = '✅';
    fb.style.display = 'block'; fb.style.background = '#FFEAEA'; fb.style.color = '#9a1010'; fb.style.border = '2px solid #FF4B4B';
    fb.innerHTML = `💡 <strong>Learning Moment!</strong><br><span style="font-size:0.9rem; font-weight:700;">${q.explanation}</span>`;
    playTone('wrong');
  }
  document.getElementById('quiz-next-btn').style.display = 'block';
}

window.nextQuizStep = () => {
  if (currentQuizIndex < quizDatabase.length - 1) { currentQuizIndex++; renderCurrentQuiz(); }
  else { alert("🏆 Quiz Complete!"); currentQuizIndex = 0; renderCurrentQuiz(); }
}

function setupComments() {
  const list = document.getElementById('comments-list');
  if(!list) return;
  const q = query(collection(db, "comments"), orderBy("timestamp", "desc"), limit(20));
  onSnapshot(q, (snapshot) => {
    let html = '';
    snapshot.forEach(doc => {
      const data = doc.data();
      html += `<div class="comment-item"><div class="comment-avatar">${(data.name || 'G').charAt(0)}</div><div class="comment-content"><h5>${data.name}</h5><p>${data.text}</p></div></div>`;
    });
    list.innerHTML = html;
  });
}

window.submitComment = async () => {
  const input = document.getElementById('comment-input');
  const text = input.value.trim();
  if(!text) return;
  await addDoc(collection(db, "comments"), { text, name: currentUser?.displayName || "Guest Learner", uid: currentUser?.uid || "guest", timestamp: serverTimestamp() });
  input.value = '';
}

init();
