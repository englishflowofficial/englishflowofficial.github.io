/**
 * English Flow — Global Community Comments & Learner Discussion
 * 100% Free & Open to All Learners (No Account / Sign-In Needed).
 *
 * Real-Time Cloud Synchronization:
 * Comments submitted by ANY visitor appear live for EVERYONE across all devices!
 * Dual-cloud fallback + automatic offline queue retry + instant local cache.
 */
(function () {
  "use strict";

  var PRIMARY_API_URL = "https://api.restful-api.dev/objects/ff808181a09d98f701a10af6b5a27b29";
  var BACKUP_API_URL  = "https://api.restful-api.dev/objects/ff808181a09d98f701a11cab481f2436";

  var PRELOADED_COMMENTS = [
    {
      id: "c_p1",
      name: "Ananya Sharma",
      location: "Mumbai, India",
      avatarType: "image",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      time: "25 mins ago",
      text: "Day 16 completed! The 'Say This, Not That' quiz helped me break the 'Cut the banana' habit today — native speakers really say 'Peel the banana'! Practicing 5 minutes a day with Flo the owl is the only routine that ever stuck with me. 🦉🔥",
      likes: 24,
      badge: "🔥 16-Day Streak"
    },
    {
      id: "c_p2",
      name: "Carlos Mendez",
      location: "Mexico City",
      avatarType: "initial",
      avatarBg: "#10b981",
      time: "1 hour ago",
      text: "The new Daily Vocabulary Tracker Excel sheet is brilliant! Having the column for real movie scene examples makes memorizing collocations 10x easier than memorizing textbook definitions. Downloaded it immediately. 📊",
      likes: 19,
      badge: "📊 Excel Tracker"
    },
    {
      id: "c_p3",
      name: "Elena Rostova",
      location: "Prague, Czechia",
      avatarType: "image",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
      time: "3 hours ago",
      text: "Present Perfect vs Past Simple finally clicked today. The timeline visual in the 12 Tenses room made it so clear. No boring grammatical jargon, just how people actually talk in real life.",
      likes: 31,
      badge: "📘 12 Tenses"
    },
    {
      id: "c_p4",
      name: "David Chen",
      location: "Taipei, Taiwan",
      avatarType: "initial",
      avatarBg: "#6366f1",
      time: "5 hours ago",
      text: "No login or password needed was the best part. I just open the site on my phone while riding the metro every morning. The audio pronunciation button for 'crack an egg' and 'blow out the candle' is super crisp.",
      likes: 15,
      badge: "🚇 Mobile Learner"
    },
    {
      id: "c_p5",
      name: "Sarah Jenkins",
      location: "London, UK",
      avatarType: "image",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      time: "Yesterday",
      text: "I shared the 30-Day speaking workbook PDF with my conversational English study group. We are practicing the real-life dialogues together every weekend. Keep up the great work! ✨",
      likes: 27,
      badge: "✍️ 30-Day Workbook"
    },
    {
      id: "c_p6",
      name: "Aarav Patel",
      location: "Ahmedabad, India",
      avatarType: "initial",
      avatarBg: "#f59e0b",
      time: "Yesterday",
      text: "Just mastered the phrasal verbs section. 'Touch base' and 'bring up' make me sound so much more natural during remote standup meetings at work. Highly recommend to everyone working in tech.",
      likes: 21,
      badge: "⚡ Phrasal Verbs"
    },
    {
      id: "c_p7",
      name: "Mariana Silva",
      location: "São Paulo, Brazil",
      avatarType: "image",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
      time: "2 days ago",
      text: "Already added 18 words to the Excel tracker template from the Netflix series I'm watching. Thank you for keeping all these resources completely free! 💖",
      likes: 22,
      badge: "🎬 Movie Flow"
    },
    {
      id: "c_p8",
      name: "Tariq Al-Mansoor",
      location: "Dubai, UAE",
      avatarType: "initial",
      avatarBg: "#0ea5e9",
      time: "3 days ago",
      text: "Best spoken English web app I have used this year. Zero clutter, zero annoying ads, and runs lightning-fast on phone browsers. 🌟",
      likes: 35,
      badge: "🌟 Top Review"
    }
  ];

  var AVATAR_COLORS = ["#10b981", "#6366f1", "#f59e0b", "#0ea5e9", "#ec4899", "#8b5cf6", "#14b8a6", "#3b82f6"];

  // Broadcast Channel for Instant Multi-Tab Updates
  var broadcastChannel = null;
  try {
    if (typeof BroadcastChannel !== "undefined") {
      broadcastChannel = new BroadcastChannel("english_flow_comments_v2");
    }
  } catch (e) {}

  // -------------------------------------------------------------------------
  // Local Storage Helpers
  // -------------------------------------------------------------------------
  function getCachedCloudComments() {
    try {
      var raw = localStorage.getItem("ef_cached_cloud_comments");
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return [];
  }

  function setCachedCloudComments(list) {
    try {
      localStorage.setItem("ef_cached_cloud_comments", JSON.stringify(list));
    } catch (e) {}
  }

  function getLocalUserComments() {
    try {
      var raw = localStorage.getItem("ef_user_comments");
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  }

  function saveLocalUserComment(comment) {
    try {
      var list = getLocalUserComments();
      list.unshift(comment);
      localStorage.setItem("ef_user_comments", JSON.stringify(list));
    } catch (e) {}
  }

  function getUnsyncedComments() {
    try {
      var raw = localStorage.getItem("ef_unsynced_comments");
      if (raw) {
        var parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  }

  function queueUnsyncedComment(comment) {
    try {
      var list = getUnsyncedComments();
      if (!list.some(function (c) { return c.id === comment.id; })) {
        list.push(comment);
        localStorage.setItem("ef_unsynced_comments", JSON.stringify(list));
      }
    } catch (e) {}
  }

  function removeUnsyncedComment(id) {
    try {
      var list = getUnsyncedComments().filter(function (c) { return c.id !== id; });
      localStorage.setItem("ef_unsynced_comments", JSON.stringify(list));
    } catch (e) {}
  }

  function getLikedComments() {
    try {
      var raw = localStorage.getItem("ef_liked_comments");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {};
  }

  function markCommentLiked(id) {
    try {
      var liked = getLikedComments();
      liked[id] = true;
      localStorage.setItem("ef_liked_comments", JSON.stringify(liked));
    } catch (e) {}
  }

  // Active in-memory cloud comments list
  var cloudComments = getCachedCloudComments();
  var isSyncing = false;

  // -------------------------------------------------------------------------
  // Cloud Networking (Primary with Fallback to Backup)
  // -------------------------------------------------------------------------
  function fetchFromEndpoint(url, callback) {
    fetch(url, { cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (resData) {
        var list = (resData && resData.data && Array.isArray(resData.data.comments)) ? resData.data.comments : [];
        callback(null, list);
      })
      .catch(function (err) {
        callback(err, null);
      });
  }

  function putToEndpoint(url, name, comments, callback) {
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        data: { comments: comments }
      })
    })
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        callback(null, data);
      })
      .catch(function (err) {
        callback(err, null);
      });
  }

  function fetchCloudComments(onDone) {
    fetchFromEndpoint(PRIMARY_API_URL, function (errPrimary, list) {
      if (!errPrimary && list && list.length > 0) {
        updateCloudMemory(list);
        if (onDone) onDone(cloudComments);
        checkAndFlushUnsynced();
        return;
      }

      // Fallback to backup if primary failed or empty
      fetchFromEndpoint(BACKUP_API_URL, function (errBackup, backupList) {
        if (!errBackup && backupList && backupList.length > 0) {
          updateCloudMemory(backupList);
          if (onDone) onDone(cloudComments);
        } else if (onDone) {
          onDone(cloudComments);
        }
        checkAndFlushUnsynced();
      });
    });
  }

  function updateCloudMemory(newList) {
    if (!Array.isArray(newList)) return;
    // Deduplicate and retain
    var map = {};
    newList.forEach(function (c) {
      if (c && c.id) map[c.id] = c;
    });

    // Also ensure local user comments are present
    var localUser = getLocalUserComments();
    localUser.forEach(function (c) {
      if (c && c.id && !map[c.id]) {
        map[c.id] = c;
        queueUnsyncedComment(c);
      }
    });

    var merged = Object.keys(map).map(function (k) { return map[k]; });
    // Sort latest first
    merged.sort(function (a, b) {
      var timeA = parseInt(a.ts, 10) || 0;
      var timeB = parseInt(b.ts, 10) || 0;
      return timeB - timeA;
    });

    cloudComments = merged.slice(0, 100);
    setCachedCloudComments(cloudComments);
  }

  function syncCommentsToCloud(newComment, onDone) {
    if (newComment) {
      queueUnsyncedComment(newComment);
    }

    if (isSyncing) {
      if (onDone) onDone(false);
      return;
    }
    isSyncing = true;

    // 1. Fetch latest from primary
    fetchFromEndpoint(PRIMARY_API_URL, function (err, latestList) {
      var current = (Array.isArray(latestList) && latestList.length > 0) ? latestList : cloudComments.slice();

      var map = {};
      current.forEach(function (c) { if (c && c.id) map[c.id] = c; });

      // Merge all unsynced items
      var unsynced = getUnsyncedComments();
      unsynced.forEach(function (c) { if (c && c.id) map[c.id] = c; });
      if (newComment && newComment.id) map[newComment.id] = newComment;

      var merged = Object.keys(map).map(function (k) { return map[k]; });
      merged.sort(function (a, b) {
        var timeA = parseInt(a.ts, 10) || 0;
        var timeB = parseInt(b.ts, 10) || 0;
        return timeB - timeA;
      });
      if (merged.length > 100) merged = merged.slice(0, 100);

      // 2. PUT to Primary
      putToEndpoint(PRIMARY_API_URL, "EnglishFlowComments", merged, function (errPut, putResult) {
        isSyncing = false;
        if (!errPut) {
          // Success!
          unsynced.forEach(function (c) { removeUnsyncedComment(c.id); });
          if (newComment) removeUnsyncedComment(newComment.id);

          var updated = (putResult && putResult.data && Array.isArray(putResult.data.comments)) ? putResult.data.comments : merged;
          cloudComments = updated;
          setCachedCloudComments(cloudComments);

          // Mirror to Backup in background
          putToEndpoint(BACKUP_API_URL, "EnglishFlowCommentsBackup", merged, function () {});

          // Notify other tabs
          if (broadcastChannel) {
            try { broadcastChannel.postMessage({ type: "refresh" }); } catch (e) {}
          }

          if (onDone) onDone(true);
        } else {
          // Fallback PUT to Backup
          putToEndpoint(BACKUP_API_URL, "EnglishFlowCommentsBackup", merged, function (errBackupPut) {
            if (!errBackupPut) {
              unsynced.forEach(function (c) { removeUnsyncedComment(c.id); });
              if (newComment) removeUnsyncedComment(newComment.id);
              cloudComments = merged;
              setCachedCloudComments(cloudComments);
              if (onDone) onDone(true);
            } else {
              console.warn("Cloud sync will retry automatically:", errPut);
              if (onDone) onDone(false);
            }
          });
        }
      });
    });
  }

  function checkAndFlushUnsynced() {
    var unsynced = getUnsyncedComments();
    if (unsynced.length > 0 && !isSyncing) {
      syncCommentsToCloud(null, function () {});
    }
  }

  function syncLikeToCloud(commentId) {
    fetchFromEndpoint(PRIMARY_API_URL, function (err, latestList) {
      var current = (Array.isArray(latestList) && latestList.length > 0) ? latestList : cloudComments.slice();
      var found = false;
      current.forEach(function (c) {
        if (c.id === commentId) {
          c.likes = (c.likes || 0) + 1;
          found = true;
        }
      });
      if (found) {
        putToEndpoint(PRIMARY_API_URL, "EnglishFlowComments", current, function () {});
        putToEndpoint(BACKUP_API_URL, "EnglishFlowCommentsBackup", current, function () {});
      }
    });
  }

  // -------------------------------------------------------------------------
  // UI Rendering
  // -------------------------------------------------------------------------
  function escapeHTML(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function renderCommentCard(c, isLocalUser) {
    var safeName = escapeHTML(c.name || "English Learner");
    var safeLoc = escapeHTML(c.location || "");
    var safeText = escapeHTML(c.text || "");
    var safeBadge = escapeHTML(c.badge || "");
    var safeTime = escapeHTML(c.time || "Just now");

    var avatarMarkup = "";
    if (c.avatarType === "image" && c.avatarUrl) {
      avatarMarkup = '<img src="' + c.avatarUrl + '" alt="' + safeName + '" class="comm-avatar-img" loading="lazy" />';
    } else {
      var initial = safeName.trim().charAt(0).toUpperCase() || "L";
      var bg = c.avatarBg || AVATAR_COLORS[Math.abs(safeName.charCodeAt(0) || 0) % AVATAR_COLORS.length];
      avatarMarkup = '<div class="comm-avatar-letter" style="background-color: ' + bg + ';">' + initial + '</div>';
    }

    var badgeMarkup = safeBadge ? '<span class="comm-badge">' + safeBadge + '</span>' : '';
    var userTag = isLocalUser ? '<span class="comm-you-tag">YOU</span>' : '';
    var locationMarkup = safeLoc ? '<span class="comm-loc">📍 ' + safeLoc + '</span>' : '';

    var likedObj = getLikedComments();
    var isLiked = !!likedObj[c.id];

    return '' +
      '<div class="comm-card ' + (isLocalUser ? 'comm-card-user' : '') + '" id="' + c.id + '">' +
        '<div class="comm-header">' +
          '<div class="comm-avatar-shell">' + avatarMarkup + '</div>' +
          '<div class="comm-user-meta">' +
            '<div class="comm-user-top">' +
              '<h4 class="comm-name">' + safeName + '</h4>' +
              userTag +
              badgeMarkup +
            '</div>' +
            '<div class="comm-sub-meta">' +
              locationMarkup +
              '<span class="comm-time">' + safeTime + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<p class="comm-body">' + safeText + '</p>' +
        '<div class="comm-footer">' +
          '<button type="button" class="comm-like-btn ' + (isLiked ? 'is-liked' : '') + '" data-id="' + c.id + '" aria-label="Like this comment">' +
            '<span class="comm-heart">' + (isLiked ? '❤️' : '🤍') + '</span>' +
            '<span class="comm-like-count">' + (c.likes || 0) + '</span>' +
          '</button>' +
          '<span class="comm-reply-tag">💬 Replied</span>' +
        '</div>' +
      '</div>';
  }

  function mountComments(container) {
    if (!container || container.dataset.mounted === "true") return;
    container.dataset.mounted = "true";

    var shell = document.createElement("div");
    shell.className = "comm-shell";

    shell.innerHTML = '' +
      '<div class="comm-intro">' +
        '<div class="comm-title-row">' +
          '<span class="comm-eyebrow">💬 GLOBAL LEARNER DISCUSSION</span>' +
          '<div class="comm-live-pill">' +
            '<span class="pulse-dot-green"></span>' +
            '<span>Live Community (Everyone Sees All Comments)</span>' +
          '</div>' +
        '</div>' +
        '<h2>Join the conversation. <em>Speak up anytime.</em></h2>' +
        '<p class="comm-desc">100% Free &amp; Open to all learners. No login or password required. Share your daily wins, study streak, thoughts on the Say This, Not That quiz, or ask any question!</p>' +
      '</div>' +

      '<div class="comm-post-box">' +
        '<div class="comm-box-top">' +
          '<div class="comm-box-avatar" id="comm-current-avatar">👤</div>' +
          '<div class="comm-box-fields">' +
            '<div class="comm-input-row">' +
              '<input type="text" id="comm-name-input" class="comm-input" placeholder="Your Name or Nickname (e.g. Maya)" maxlength="40" />' +
              '<input type="text" id="comm-loc-input" class="comm-input" placeholder="City or Country (e.g. Tokyo, Berlin)" maxlength="40" />' +
            '</div>' +
            '<textarea id="comm-text-input" class="comm-textarea" placeholder="Share your practice progress, a phrase you learned today, or a question..." rows="3"></textarea>' +
            '<div class="comm-action-row">' +
              '<div class="comm-helper-hints">' +
                '<span class="comm-hint-item">🌐 Visible to All Visitors Globally</span>' +
                '<span class="comm-hint-item">⚡ No Login Needed</span>' +
              '</div>' +
              '<button type="button" id="comm-submit-btn" class="ff-btn ff-btn-green comm-btn-post">' +
                '<span>Post Comment</span> <span aria-hidden="true">💬</span>' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div class="comm-feed-wrap">' +
        '<div class="comm-feed-header">' +
          '<h3>Recent Community Thoughts</h3>' +
          '<span class="comm-feed-badge" id="comm-total-badge">Comments</span>' +
        '</div>' +
        '<div class="comm-list" id="comm-list-container"></div>' +
      '</div>';

    container.appendChild(shell);

    var listContainer = shell.querySelector("#comm-list-container");
    var totalBadge = shell.querySelector("#comm-total-badge");
    var nameInput = shell.querySelector("#comm-name-input");
    var locInput = shell.querySelector("#comm-loc-input");
    var textInput = shell.querySelector("#comm-text-input");
    var submitBtn = shell.querySelector("#comm-submit-btn");

    function renderFeed() {
      var localList = getLocalUserComments();
      var combined = [];
      var seenIds = {};

      function add(item) {
        if (!item || !item.id || seenIds[item.id]) return;
        seenIds[item.id] = true;
        combined.push(item);
      }

      // 1. Local and Cloud comments
      localList.forEach(add);
      cloudComments.forEach(add);

      // 2. Preloaded reviews
      PRELOADED_COMMENTS.forEach(add);

      totalBadge.textContent = combined.length + " Comments";

      var html = "";
      combined.forEach(function (c) {
        var isLocal = localList.some(function (u) { return u.id === c.id; });
        html += renderCommentCard(c, isLocal);
      });
      listContainer.innerHTML = html;
      bindLikes();
    }

    function bindLikes() {
      var btns = listContainer.querySelectorAll(".comm-like-btn");
      btns.forEach(function (btn) {
        btn.onclick = function () {
          var cid = btn.getAttribute("data-id");
          var likedObj = getLikedComments();
          if (likedObj[cid]) return;

          markCommentLiked(cid);
          btn.classList.add("is-liked");
          var countSpan = btn.querySelector(".comm-like-count");
          var heartSpan = btn.querySelector(".comm-heart");
          if (countSpan) {
            var current = parseInt(countSpan.textContent, 10) || 0;
            countSpan.textContent = current + 1;
          }
          if (heartSpan) heartSpan.textContent = "❤️";

          if (window.FlowFun && window.FlowFun.pop) {
            window.FlowFun.pop(btn, "+1 ❤️");
          }

          // Push like to cloud
          syncLikeToCloud(cid);
        };
      });
    }

    // Submit New Comment
    submitBtn.onclick = function () {
      var text = (textInput.value || "").trim();
      if (!text) {
        textInput.focus();
        textInput.classList.add("input-shake");
        setTimeout(function () { textInput.classList.remove("input-shake"); }, 500);
        return;
      }

      var name = (nameInput.value || "").trim() || "English Learner";
      var loc = (locInput.value || "").trim();
      var colorIdx = Math.floor(Math.random() * AVATAR_COLORS.length);

      var newComment = {
        id: "ef_" + Date.now() + "_" + Math.floor(Math.random() * 1000),
        name: name,
        location: loc,
        avatarType: "initial",
        avatarBg: AVATAR_COLORS[colorIdx],
        time: "Just now",
        ts: String(Date.now()),
        text: text,
        likes: 1,
        badge: "✨ Learner"
      };

      // 1. Save locally for guaranteed retention
      saveLocalUserComment(newComment);

      // 2. Add to active in-memory list and render immediately (optimistic UI)
      cloudComments.unshift(newComment);
      renderFeed();

      // 3. UI feedback
      submitBtn.disabled = true;
      var btnSpan = submitBtn.querySelector("span");
      if (btnSpan) btnSpan.textContent = "Posting to cloud...";

      // 4. Sync to Global Cloud so EVERY visitor sees it!
      syncCommentsToCloud(newComment, function (success) {
        submitBtn.disabled = false;
        if (btnSpan) btnSpan.textContent = "Post Comment";

        if (success && window.FlowFun && window.FlowFun.pop) {
          window.FlowFun.pop(submitBtn, "Live for everyone! 🌐✨");
        }
      });

      // Celebration
      if (window.FlowFun && window.FlowFun.confetti) {
        window.FlowFun.confetti(40);
      }

      textInput.value = "";

      // Scroll to new comment
      var newElem = document.getElementById(newComment.id);
      if (newElem) {
        newElem.classList.add("comm-just-added");
        newElem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    // Initial render with cached/local comments (instant)
    renderFeed();

    // Fetch live updates from cloud
    fetchCloudComments(function () {
      renderFeed();
    });

    // Listen for BroadcastChannel message from other tabs
    if (broadcastChannel) {
      broadcastChannel.addEventListener("message", function (ev) {
        if (ev.data && ev.data.type === "refresh") {
          fetchCloudComments(function () {
            renderFeed();
          });
        }
      });
    }

    // Auto-poll cloud every 10 seconds so comments by other visitors appear automatically
    setInterval(function () {
      if (!document.hidden) {
        fetchCloudComments(function () {
          renderFeed();
        });
      }
    }, 10000);
  }

  function init() {
    var targets = document.querySelectorAll(".community-comments-mount");
    targets.forEach(function (t) {
      mountComments(t);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
