/* English Flow — Google Sign-In + cloud progress sync (optional, for those who want it).
   Guests keep playing with localStorage exactly as before. When a learner signs in
   with Google, their progress (game state, 30-day practice, XP, streak) is saved to
   their own Firestore user doc and restored on any device they sign in on.
   Config lives in firebase-applet-config.json (same Firebase project as the site). */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

const SYNC_KEYS = [
  "english_flow_duo_v1",        // Duolingo-style game progress
  "english_flow_practice_v2",   // 30-day practice progress
  "userXP",
  "userStreak",
  "english_flow_streak",
  "english_flow_last_practice"
];
const LAST_SYNC_KEY = "ef_cloud_last_sync";

let auth = null;
let db = null;
let currentUser = null;
let pushTimer = null;

function snapshotLocal() {
  const snap = {};
  for (const k of SYNC_KEYS) {
    const v = localStorage.getItem(k);
    if (v !== null) snap[k] = v;
  }
  return snap;
}

function restoreLocal(snap) {
  if (!snap) return;
  for (const k of SYNC_KEYS) {
    if (typeof snap[k] === "string") {
      try { localStorage.setItem(k, snap[k]); } catch (e) { /* private mode */ }
    }
  }
}

async function pushProgress() {
  if (!currentUser || !db) return;
  const snap = snapshotLocal();
  try {
    await setDoc(
      doc(db, "users", currentUser.uid),
      {
        name: currentUser.displayName || "Learner",
        photoURL: currentUser.photoURL || null,
        efProgress: snap,
        efUpdatedAt: Date.now()
      },
      { merge: true }
    );
    localStorage.setItem(LAST_SYNC_KEY, String(Date.now()));
  } catch (e) {
    console.warn("EF Auth: progress push failed", e);
  }
}

async function pullProgress() {
  if (!currentUser || !db) return false;
  try {
    const snapDoc = await getDoc(doc(db, "users", currentUser.uid));
    if (!snapDoc.exists()) return false;
    const data = snapDoc.data();
    const cloudAt = typeof data.efUpdatedAt === "number" ? data.efUpdatedAt : 0;
    const localAt = parseInt(localStorage.getItem(LAST_SYNC_KEY) || "0", 10);
    if (data.efProgress && cloudAt > localAt) {
      restoreLocal(data.efProgress);
      localStorage.setItem(LAST_SYNC_KEY, String(cloudAt));
      return true;
    }
  } catch (e) {
    console.warn("EF Auth: progress pull failed", e);
  }
  return false;
}

/* ---------------------------------- UI ---------------------------------- */

const GOOGLE_G = '<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34.3 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34.3 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C36.9 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z"/></svg>';

function buildUI() {
  if (document.getElementById("ef-auth-root")) return;
  const root = document.createElement("div");
  root.id = "ef-auth-root";
  root.style.cssText =
    "position:fixed;top:12px;right:12px;z-index:99990;font-family:inherit;";
  root.innerHTML =
    '<button id="ef-auth-btn" type="button" style="display:flex;align-items:center;gap:8px;' +
    "background:#ffffff;color:#3c4043;border:1px solid #dadce0;border-radius:999px;" +
    "padding:8px 14px;font-size:14px;font-weight:600;cursor:pointer;" +
    'box-shadow:0 2px 10px rgba(0,0,0,.18);">' + GOOGLE_G + "<span>Sign in with Google</span></button>" +
    '<div id="ef-auth-menu" style="display:none;margin-top:8px;background:#fff;border:1px solid #e5e7eb;' +
    'border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.18);padding:10px;min-width:210px;">' +
    '<div id="ef-auth-status" style="font-size:12.5px;color:#475569;padding:2px 4px 8px;">Progress saved to your account ✓</div>' +
    '<button id="ef-auth-signout" type="button" style="width:100%;background:#f1f5f9;border:1px solid #e2e8f0;' +
    'color:#334155;border-radius:8px;padding:8px;font-size:13.5px;font-weight:600;cursor:pointer;">Sign out</button></div>';
  document.body.appendChild(root);

  const btn = document.getElementById("ef-auth-btn");
  const menu = document.getElementById("ef-auth-menu");
  btn.addEventListener("click", () => {
    if (!currentUser) {
      window.efSignInWithGoogle();
    } else {
      menu.style.display = menu.style.display === "none" ? "block" : "none";
    }
  });
  document.getElementById("ef-auth-signout").addEventListener("click", () => {
    menu.style.display = "none";
    window.efSignOut();
  });
  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) menu.style.display = "none";
  });
}

function paintUser(user) {
  const btn = document.getElementById("ef-auth-btn");
  if (!btn) return;
  if (user) {
    const name = (user.displayName || "Learner").split(" ")[0];
    const photo = user.photoURL
      ? '<img src="' + user.photoURL + '" alt="" referrerpolicy="no-referrer" style="width:22px;height:22px;border-radius:50%;object-fit:cover;">'
      : '<span style="width:22px;height:22px;border-radius:50%;background:#58cc02;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">' +
        name.charAt(0).toUpperCase() + "</span>";
    btn.innerHTML = photo + "<span>" + name + "</span>";
  } else {
    btn.innerHTML = GOOGLE_G + "<span>Sign in with Google</span>";
    const menu = document.getElementById("ef-auth-menu");
    if (menu) menu.style.display = "none";
  }
}

/* --------------------------------- Auth --------------------------------- */

window.efSignInWithGoogle = async function () {
  if (!auth) {
    alert("Sign-in is still loading — please try again in a few seconds.");
    return;
  }
  try {
    await signInWithPopup(auth, new GoogleAuthProvider());
  } catch (err) {
    console.error("EF Auth: Google sign-in failed", err);
    if (err && err.code === "auth/unauthorized-domain") {
      alert("Google sign-in isn't enabled for this website address yet. Please let the English Flow team know!");
    } else if (err && err.code !== "auth/popup-closed-by-user" && err.code !== "auth/cancelled-popup-request") {
      alert("Sign-in didn't work (" + (err.code || "unknown error") + "). Please try again.");
    }
  }
};
// Backwards-compatible name used by older page code.
window.signInWithGoogle = window.efSignInWithGoogle;

window.efSignOut = async function () {
  if (!auth) return;
  await pushProgress();
  try { await signOut(auth); } catch (e) { console.warn(e); }
};
window.signOutUser = window.efSignOut;

async function init() {
  buildUI();
  let config;
  try {
    const res = await fetch("firebase-applet-config.json", { cache: "no-store" });
    if (!res.ok) throw new Error("config fetch " + res.status);
    config = await res.json();
  } catch (e) {
    // Try the hosted API endpoint used by the dynamic deployment.
    try {
      const res = await fetch("/api/firebase-config");
      config = await res.json();
    } catch (e2) {
      console.warn("EF Auth: no Firebase config found, sign-in disabled.", e2);
      const btn = document.getElementById("ef-auth-btn");
      if (btn) btn.style.display = "none";
      return;
    }
  }

  const app = initializeApp(config);
  auth = getAuth(app);
  db = config.firestoreDatabaseId ? getFirestore(app, config.firestoreDatabaseId) : getFirestore(app);

  onAuthStateChanged(auth, async (user) => {
    currentUser = user || null;
    paintUser(currentUser);
    if (pushTimer) { clearInterval(pushTimer); pushTimer = null; }
    if (currentUser) {
      const restored = await pullProgress();
      if (!restored) await pushProgress();
      else location.reload(); // show restored progress everywhere on the page
      pushTimer = setInterval(pushProgress, 60000);
      window.addEventListener("pagehide", pushProgress);
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
