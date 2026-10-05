/**
 * English Flow — Community Comments & Learner Discussion
 * 100% Free & No Account Needed.
 * Pre-populated with realistic global learner feedback + instant guest posting.
 */
(function () {
  "use strict";

  var PRELOADED_COMMENTS = [
    {
      id: "c1",
      name: "Ananya Sharma",
      location: "Mumbai, India",
      avatarType: "image",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
      time: "24 mins ago",
      text: "Day 16 completed! Honestly, practicing for just 5 minutes everyday is the only habit that actually stuck with me. I used to translate every word in my head before speaking, but now it feels natural. Love Flo the owl! 🦉🔥",
      likes: 19,
      badge: "🔥 16-Day Streak"
    },
    {
      id: "c2",
      name: "Carlos Mendez",
      location: "Mexico City",
      avatarType: "initial",
      avatarBg: "#10b981",
      time: "2 hours ago",
      text: "The new Daily Vocabulary Tracker Excel sheet is brilliant! Having the column for real movie scene examples makes memorizing 10x easier than memorizing definitions from a dictionary. Downloaded it immediately.",
      likes: 14,
      badge: "📊 Excel Tracker"
    },
    {
      id: "c3",
      name: "Elena Rostova",
      location: "Prague, Czechia",
      avatarType: "image",
      avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80",
      time: "4 hours ago",
      text: "Present Perfect vs Past Simple finally clicked today. The timeline visual in the 12 Tenses room made it so clear. No boring grammatical jargon, just how people actually talk.",
      likes: 27,
      badge: "📘 12 Tenses"
    },
    {
      id: "c4",
      name: "David Chen",
      location: "Taipei, Taiwan",
      avatarType: "initial",
      avatarBg: "#6366f1",
      time: "7 hours ago",
      text: "No login or password needed was the best part. I just open the site on my Android phone while riding the metro every morning. The audio pronunciation button is super clean.",
      likes: 11,
      badge: "🚇 Mobile Learner"
    },
    {
      id: "c5",
      name: "Sarah Jenkins",
      location: "London, UK",
      avatarType: "image",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
      time: "Yesterday",
      text: "I shared the 30-Day speaking workbook PDF with my conversational English study group. We are practicing the real-life dialogues together every weekend. Keep up the great work!",
      likes: 22,
      badge: "✍️ 30-Day Workbook"
    },
    {
      id: "c6",
      name: "Aarav Patel",
      location: "Ahmedabad, India",
      avatarType: "initial",
      avatarBg: "#f59e0b",
      time: "Yesterday",
      text: "Just mastered the phrasal verbs section. 'Touch base' and 'bring up' make me sound so much more natural during remote standup meetings at work.",
      likes: 16,
      badge: "⚡ Phrasal Verbs"
    },
    {
      id: "c7",
      name: "Mariana Silva",
      location: "São Paulo, Brazil",
      avatarType: "image",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
      time: "2 days ago",
      text: "Already added 15 words to the new Excel tracker template from the TV series I'm watching. Thank you for keeping all these resources completely free! 💖",
      likes: 18,
      badge: "🎬 Movie Flow"
    },
    {
      id: "c8",
      name: "Tariq Al-Mansoor",
      location: "Dubai, UAE",
      avatarType: "initial",
      avatarBg: "#0ea5e9",
      time: "3 days ago",
      text: "Best spoken English web app I have used this year. Zero clutter, zero annoying ads, and runs lightning-fast on phone browsers.",
      likes: 25,
      badge: "🌟 Top Review"
    }
  ];

  var AVATAR_COLORS = ["#10b981", "#6366f1", "#f59e0b", "#0ea5e9", "#ec4899", "#8b5cf6", "#14b8a6"];

  function getLocalComments() {
    try {
      var raw = localStorage.getItem("ef_user_comments");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [];
  }

  function saveLocalComment(comment) {
    try {
      var list = getLocalComments();
      list.unshift(comment);
      localStorage.setItem("ef_user_comments", JSON.stringify(list));
    } catch (e) {}
  }

  function getLikedCommentIds() {
    try {
      var raw = localStorage.getItem("ef_liked_comments");
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {};
  }

  function setLikedCommentId(id) {
    try {
      var liked = getLikedCommentIds();
      liked[id] = true;
      localStorage.setItem("ef_liked_comments", JSON.stringify(liked));
    } catch (e) {}
  }

  function renderCommentHTML(c, isUser) {
    var avatarMarkup = "";
    if (c.avatarType === "image" && c.avatarUrl) {
      avatarMarkup = '<img src="' + c.avatarUrl + '" alt="' + (c.name || "Learner") + '" class="comm-avatar-img" loading="lazy" />';
    } else {
      var initial = (c.name || "L").trim().charAt(0).toUpperCase();
      var bg = c.avatarBg || AVATAR_COLORS[Math.abs(c.name.charCodeAt(0) || 0) % AVATAR_COLORS.length];
      avatarMarkup = '<div class="comm-avatar-letter" style="background-color: ' + bg + ';">' + initial + '</div>';
    }

    var badgeMarkup = c.badge ? '<span class="comm-badge">' + c.badge + '</span>' : '';
    var userTag = isUser ? '<span class="comm-you-tag">YOU</span>' : '';
    var locationMarkup = c.location ? '<span class="comm-loc">📍 ' + c.location + '</span>' : '';

    var likedObj = getLikedCommentIds();
    var isLiked = !!likedObj[c.id];

    return '' +
      '<div class="comm-card ' + (isUser ? 'comm-card-user' : '') + '" id="' + c.id + '">' +
        '<div class="comm-header">' +
          '<div class="comm-avatar-shell">' + avatarMarkup + '</div>' +
          '<div class="comm-user-meta">' +
            '<div class="comm-user-top">' +
              '<h4 class="comm-name">' + (c.name || "Guest Learner") + '</h4>' +
              userTag +
              badgeMarkup +
            '</div>' +
            '<div class="comm-sub-meta">' +
              locationMarkup +
              '<span class="comm-time">' + (c.time || "Just now") + '</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<p class="comm-body">' + c.text + '</p>' +
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
    if (!container) return;

    var shell = document.createElement("div");
    shell.className = "comm-shell";

    shell.innerHTML = '' +
      '<div class="comm-intro">' +
        '<div class="comm-title-row">' +
          '<span class="comm-eyebrow">💬 REAL LEARNER VOICES</span>' +
          '<div class="comm-live-pill">' +
            '<span class="pulse-dot-green"></span>' +
            '<span>Active Community Discussion</span>' +
          '</div>' +
        '</div>' +
        '<h2>Join the conversation. <em>Speak up anytime.</em></h2>' +
        '<p class="comm-desc">No login or account needed. Share your daily wins, study streak, thoughts on the new Excel tracker, or ask any question!</p>' +
      '</div>' +

      '<div class="comm-post-box">' +
        '<div class="comm-box-top">' +
          '<div class="comm-box-avatar" id="comm-current-avatar">👤</div>' +
          '<div class="comm-box-fields">' +
            '<div class="comm-input-row">' +
              '<input type="text" id="comm-name-input" class="comm-input" placeholder="Your Name or Nickname (e.g. Maya)" maxlength="40" />' +
              '<input type="text" id="comm-loc-input" class="comm-input" placeholder="City or Country (e.g. Tokyo, Berlin)" maxlength="40" />' +
            '</div>' +
            '<textarea id="comm-text-input" class="comm-textarea" placeholder="Share your practice progress, thoughts, or ask a question..." rows="3"></textarea>' +
            '<div class="comm-action-row">' +
              '<div class="comm-helper-hints">' +
                '<span class="comm-hint-item">✨ Instant Post</span>' +
                '<span class="comm-hint-item">⚡ 100% Free &amp; Open</span>' +
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
          '<span class="comm-feed-badge" id="comm-total-badge">8 Comments</span>' +
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

    function renderAll() {
      var userComments = getLocalComments();
      var all = [].concat(userComments, PRELOADED_COMMENTS);
      totalBadge.textContent = all.length + " Comments";

      var html = "";
      all.forEach(function (c) {
        var isUser = userComments.some(function (u) { return u.id === c.id; });
        html += renderCommentHTML(c, isUser);
      });
      listContainer.innerHTML = html;
      bindLikeButtons();
    }

    function bindLikeButtons() {
      var btns = listContainer.querySelectorAll(".comm-like-btn");
      btns.forEach(function (btn) {
        btn.onclick = function () {
          var cid = btn.getAttribute("data-id");
          var likedObj = getLikedCommentIds();
          if (likedObj[cid]) return; // already liked

          setLikedCommentId(cid);
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
        };
      });
    }

    // Handle Comment Submission
    submitBtn.onclick = function () {
      var text = (textInput.value || "").trim();
      if (!text) {
        textInput.focus();
        textInput.classList.add("input-shake");
        setTimeout(function () { textInput.classList.remove("input-shake"); }, 500);
        return;
      }

      var name = (nameInput.value || "").trim() || "Guest Learner";
      var loc = (locInput.value || "").trim();
      var colorIdx = Math.floor(Math.random() * AVATAR_COLORS.length);

      var newComment = {
        id: "user_" + Date.now(),
        name: name,
        location: loc,
        avatarType: "initial",
        avatarBg: AVATAR_COLORS[colorIdx],
        time: "Just now",
        text: text,
        likes: 1,
        badge: "✨ New Comment"
      };

      saveLocalComment(newComment);

      // Celebrate
      if (window.FlowFun && window.FlowFun.confetti) {
        window.FlowFun.confetti(45);
      }

      // Reset form
      textInput.value = "";
      renderAll();

      // Smooth scroll to new comment
      var newElem = document.getElementById(newComment.id);
      if (newElem) {
        newElem.classList.add("comm-just-added");
        newElem.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    };

    renderAll();
  }

  function init() {
    var targets = document.querySelectorAll(".community-comments-mount");
    targets.forEach(function (t) { mountComments(t); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
