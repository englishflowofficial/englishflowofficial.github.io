/**
 * English Flow — Learn English with Animations (Interactive Engine)
 */
(function () {
  "use strict";

  // =========================================================================
  // Audio Speech Synthesis Helper
  // =========================================================================
  function speakText(text, rate) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate || 0.95;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  // =========================================================================
  // Module 1: Animated Dialogue Theater
  // =========================================================================
  var SCENES = [
    {
      id: "cafe",
      title: "At the Coffee Shop",
      desc: "Polite ordering & custom options",
      icon: "☕",
      backdrop: "linear-gradient(135deg, #78350f 0%, #451a03 100%)",
      sky: "☕ Urban Roastery & Cafe",
      leftChar: { name: "Barista (Alex)", avatar: "🧑‍🍳", bg: "#f59e0b" },
      rightChar: { name: "You (Learner)", avatar: "🙋", bg: "#10b981" },
      dialogues: [
        {
          speaker: "left",
          text: "Hi there! Welcome to Flo Roast. What can I get started for you today?",
          sub: "Friendly greeting at the counter",
          tip: "Listen for the open question 'What can I get started for you?'"
        },
        {
          speaker: "right",
          text: "Could I please get a medium oat latte with an extra shot of espresso?",
          sub: "Polite request formula: 'Could I please get...'",
          tip: "Always use 'Could I please get' or 'May I have' instead of 'Give me'."
        },
        {
          speaker: "left",
          text: "Sure thing! Would you like that for here or to go?",
          sub: "Standard service choice",
          tip: "'For here' = drink inside cafe. 'To go' = takeaway."
        },
        {
          speaker: "right",
          text: "To go, please! And could you leave a little room for milk?",
          sub: "Natural conversational request",
          tip: "'Leave room for milk' means don't fill the cup to the brim."
        }
      ]
    },
    {
      id: "airport",
      title: "Airport Check-In & Gate",
      desc: "Travel English & directions",
      icon: "✈️",
      backdrop: "linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%)",
      sky: "✈️ Terminal 2 — International Departures",
      leftChar: { name: "Gate Agent (Sarah)", avatar: "👩‍💼", bg: "#3b82f6" },
      rightChar: { name: "You (Traveler)", avatar: "🧳", bg: "#10b981" },
      dialogues: [
        {
          speaker: "left",
          text: "Good morning! Flight EF-402 to London. May I see your passport and boarding pass?",
          sub: "Standard border / gate check",
          tip: "'May I see...' is polite and official."
        },
        {
          speaker: "right",
          text: "Here you go! Is the flight still on schedule for departure?",
          sub: "Handing over documents & checking status",
          tip: "'Here you go' is the natural way to hand something to someone."
        },
        {
          speaker: "left",
          text: "Yes, boarding will begin at Gate B14 in about twenty minutes.",
          sub: "Clear announcement",
          tip: "Gate announcements always emphasize the letter and number clearly."
        },
        {
          speaker: "right",
          text: "Thank you so much! Have a wonderful day.",
          sub: "Polite departure closing",
          tip: "Courteous closings create immediate warm impressions."
        }
      ]
    },
    {
      id: "interview",
      title: "Job Interview Introduction",
      desc: "Professional pitch & confidence",
      icon: "💼",
      backdrop: "linear-gradient(135deg, #312e81 0%, #1e1b4b 100%)",
      sky: "💼 Global Tech Headquarters — 12th Floor",
      leftChar: { name: "Interviewer (Marcus)", avatar: "👨‍💼", bg: "#6366f1" },
      rightChar: { name: "You (Candidate)", avatar: "👔", bg: "#10b981" },
      dialogues: [
        {
          speaker: "left",
          text: "Thanks for coming in today! To start off, could you tell us a bit about yourself?",
          sub: "The #1 classic interview opener",
          tip: "Keep your answer focused on professional wins and recent projects."
        },
        {
          speaker: "right",
          text: "Certainly! Over the past three years, I've specialized in collaborating across international teams.",
          sub: "Strong active phrasing",
          tip: "Use 'I have specialized in...' to demonstrate proven experience."
        },
        {
          speaker: "left",
          text: "That sounds great. How do you handle tight project deadlines under pressure?",
          sub: "Behavioral question",
          tip: "Structure answers with: Situation -> Action -> Result."
        },
        {
          speaker: "right",
          text: "I prioritize high-impact deliverables first and maintain clear daily communication with stakeholders.",
          sub: "Executive-level clarity",
          tip: "Powerful words: 'prioritize', 'deliverables', 'stakeholders'."
        }
      ]
    },
    {
      id: "friends",
      title: "Casual Hangout with Friends",
      desc: "Slang, idioms & weekend plans",
      icon: "🍕",
      backdrop: "linear-gradient(135deg, #065f46 0%, #064e3b 100%)",
      sky: "🍕 Downtown Weekend Lounge",
      leftChar: { name: "Friend (Chloe)", avatar: "👱‍♀️", bg: "#ec4899" },
      rightChar: { name: "You", avatar: "😎", bg: "#10b981" },
      dialogues: [
        {
          speaker: "left",
          text: "Hey! Long time no see! Are you up for catching that new sci-fi movie tonight?",
          sub: "Casual slang & invitation",
          tip: "'Are you up for...' = Do you want to / feel like doing something?"
        },
        {
          speaker: "right",
          text: "I'd love to! I'm starving though, let's grab a bite to eat beforehand.",
          sub: "Natural conversational contraction",
          tip: "'Grab a bite' = eat a quick casual meal together."
        },
        {
          speaker: "left",
          text: "Sounds like a plan! How about that pizza place down the block?",
          sub: "Enthusiastic agreement",
          tip: "'Sounds like a plan' is universal spoken English for 'I agree!'"
        },
        {
          speaker: "right",
          text: "Count me in! I'll swing by your place around six.",
          sub: "Casual confirmation",
          tip: "'Count me in' = Include me. 'Swing by' = drop by quickly."
        }
      ]
    }
  ];

  var activeSceneIdx = 0;
  var currentStepIdx = 0;
  var isPlayingScene = false;
  var playbackTimer = null;

  function initTheater() {
    var sidebar = document.getElementById("anim-scenes-nav");
    var stageBackdrop = document.getElementById("anim-stage-backdrop");
    var stageSky = document.getElementById("anim-stage-sky");
    var leftChar = document.getElementById("anim-char-left");
    var rightChar = document.getElementById("anim-char-right");
    var speechSpeaker = document.getElementById("anim-speaker-name");
    var speechText = document.getElementById("anim-speech-text");
    var speechSub = document.getElementById("anim-speech-sub");
    var playBtn = document.getElementById("anim-play-btn");
    var audioBtn = document.getElementById("anim-audio-btn");
    var stepDots = document.getElementById("anim-step-dots");

    if (!sidebar || !playBtn) return;

    // Render Scene buttons
    sidebar.innerHTML = "";
    SCENES.forEach(function (scene, idx) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "anim-scene-btn" + (idx === 0 ? " is-active" : "");
      btn.innerHTML = '' +
        '<div class="anim-scene-icon">' + scene.icon + '</div>' +
        '<div class="anim-scene-meta">' +
          '<h4>' + scene.title + '</h4>' +
          '<p>' + scene.desc + '</p>' +
        '</div>';
      btn.onclick = function () {
        selectScene(idx);
      };
      sidebar.appendChild(btn);
    });

    function selectScene(idx) {
      if (playbackTimer) clearTimeout(playbackTimer);
      isPlayingScene = false;
      playBtn.innerHTML = '<span>Play Scene</span> <span aria-hidden="true">▶️</span>';

      activeSceneIdx = idx;
      currentStepIdx = 0;

      // Update sidebar active state
      var allBtns = sidebar.querySelectorAll(".anim-scene-btn");
      allBtns.forEach(function (b, i) {
        b.classList.toggle("is-active", i === idx);
      });

      var s = SCENES[idx];
      stageBackdrop.style.background = s.backdrop;
      stageSky.textContent = s.sky;

      // Update character representations
      leftChar.querySelector(".anim-char-avatar").textContent = s.leftChar.avatar;
      leftChar.querySelector(".anim-char-label").textContent = s.leftChar.name;
      rightChar.querySelector(".anim-char-avatar").textContent = s.rightChar.avatar;
      rightChar.querySelector(".anim-char-label").textContent = s.rightChar.name;

      renderStep();
    }

    function renderStep() {
      var s = SCENES[activeSceneIdx];
      var d = s.dialogues[currentStepIdx];

      // Highlight active speaker
      if (d.speaker === "left") {
        leftChar.classList.add("is-speaking");
        rightChar.classList.remove("is-speaking");
        speechSpeaker.textContent = s.leftChar.name;
      } else {
        rightChar.classList.add("is-speaking");
        leftChar.classList.remove("is-speaking");
        speechSpeaker.textContent = s.rightChar.name;
      }

      speechText.textContent = d.text;
      speechSub.innerHTML = '<b>' + d.sub + '</b> — <em>' + d.tip + '</em>';

      // Update step dots
      stepDots.innerHTML = "";
      s.dialogues.forEach(function (_, i) {
        var dot = document.createElement("span");
        dot.className = "anim-step-dot" + (i === currentStepIdx ? " is-active" : "");
        stepDots.appendChild(dot);
      });
    }

    playBtn.onclick = function () {
      if (isPlayingScene) {
        clearTimeout(playbackTimer);
        isPlayingScene = false;
        playBtn.innerHTML = '<span>Resume</span> <span aria-hidden="true">▶️</span>';
        return;
      }

      isPlayingScene = true;
      playBtn.innerHTML = '<span>Pause</span> <span aria-hidden="true">⏸️</span>';

      function playNext() {
        if (!isPlayingScene) return;
        renderStep();
        var s = SCENES[activeSceneIdx];
        var d = s.dialogues[currentStepIdx];
        speakText(d.text);

        // Estimate duration based on word length
        var delay = Math.max(3000, d.text.split(" ").length * 480);

        playbackTimer = setTimeout(function () {
          if (!isPlayingScene) return;
          if (currentStepIdx < s.dialogues.length - 1) {
            currentStepIdx++;
            playNext();
          } else {
            // End of scene
            isPlayingScene = false;
            playBtn.innerHTML = '<span>Replay Scene</span> <span aria-hidden="true">🔄</span>';
            currentStepIdx = 0;
            if (window.FlowFun && window.FlowFun.confetti) {
              window.FlowFun.confetti(35);
            }
          }
        }, delay);
      }

      playNext();
    };

    audioBtn.onclick = function () {
      var s = SCENES[activeSceneIdx];
      var d = s.dialogues[currentStepIdx];
      speakText(d.text);
      if (window.FlowFun && window.FlowFun.pop) {
        window.FlowFun.pop(audioBtn, "🔊 Playing");
      }
    };

    selectScene(0);
  }

  // =========================================================================
  // Module 2: Sentence Transformer (Word Blocks in Motion)
  // =========================================================================
  var TRANSFORM_MODES = [
    {
      id: "active-passive",
      title: "Active ➔ Passive Voice",
      original: [
        { word: "Flo the Owl", role: "Subject", type: "subject" },
        { word: "baked", role: "Past Verb", type: "verb" },
        { word: "delicious cookies", role: "Object", type: "object" }
      ],
      transformed: [
        { word: "Delicious cookies", role: "New Subject", type: "object" },
        { word: "were", role: "Auxiliary", type: "aux" },
        { word: "baked", role: "Past Participle", type: "verb" },
        { word: "by Flo", role: "Agent", type: "subject" }
      ],
      explain: "The object glides to the start, 'were' appears as helper verb, and the original subject moves to the end."
    },
    {
      id: "statement-question",
      title: "Statement ➔ Question Inversion",
      original: [
        { word: "You", role: "Subject", type: "subject" },
        { word: "are", role: "Auxiliary", type: "aux" },
        { word: "learning", role: "Main Verb", type: "verb" },
        { word: "English daily", role: "Object", type: "object" }
      ],
      transformed: [
        { word: "Are", role: "Auxiliary (Front)", type: "aux" },
        { word: "you", role: "Subject", type: "subject" },
        { word: "learning", role: "Main Verb", type: "verb" },
        { word: "English daily?", role: "Object", type: "object" }
      ],
      explain: "In English questions, the helper verb 'Are' leaps ahead of the subject 'you'!"
    },
    {
      id: "positive-negative",
      title: "Positive ➔ Negative Lock",
      original: [
        { word: "She", role: "Subject", type: "subject" },
        { word: "can", role: "Modal Verb", type: "aux" },
        { word: "speak", role: "Main Verb", type: "verb" },
        { word: "with confidence", role: "Complement", type: "object" }
      ],
      transformed: [
        { word: "She", role: "Subject", type: "subject" },
        { word: "can", role: "Modal Verb", type: "aux" },
        { word: "NOT", role: "Negative Lock", type: "neg" },
        { word: "speak", role: "Main Verb", type: "verb" },
        { word: "with doubt", role: "Complement", type: "object" }
      ],
      explain: "'NOT' drops right in the middle between the helper verb and the main verb."
    }
  ];

  var activeTransformIdx = 0;
  var isTransformed = false;

  function initSentenceTransformer() {
    var modeRow = document.getElementById("anim-transform-modes");
    var slot = document.getElementById("anim-sentence-slot");
    var explainText = document.getElementById("anim-transform-explain");
    var triggerBtn = document.getElementById("anim-transform-trigger");

    if (!modeRow || !triggerBtn) return;

    modeRow.innerHTML = "";
    TRANSFORM_MODES.forEach(function (m, idx) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "anim-mode-btn" + (idx === 0 ? " is-active" : "");
      btn.textContent = m.title;
      btn.onclick = function () {
        activeTransformIdx = idx;
        isTransformed = false;
        var all = modeRow.querySelectorAll(".anim-mode-btn");
        all.forEach(function (b, i) { b.classList.toggle("is-active", i === idx); });
        renderTiles();
      };
      modeRow.appendChild(btn);
    });

    function renderTiles() {
      var cur = TRANSFORM_MODES[activeTransformIdx];
      var tiles = isTransformed ? cur.transformed : cur.original;

      slot.innerHTML = "";
      tiles.forEach(function (t) {
        var tileElem = document.createElement("div");
        tileElem.className = "anim-word-tile tile-" + t.type;
        tileElem.innerHTML = '' +
          '<span>' + t.word + '</span>' +
          '<span class="anim-word-role">' + t.role + '</span>';
        slot.appendChild(tileElem);
      });

      explainText.textContent = isTransformed ? cur.explain : "Tap the button below to watch the words slide and swap positions live!";
      triggerBtn.textContent = isTransformed ? "Reset Original Form ↺" : "Watch Animated Transformation ⚡";
    }

    triggerBtn.onclick = function () {
      isTransformed = !isTransformed;
      renderTiles();

      // Speak transformed sentence
      var cur = TRANSFORM_MODES[activeTransformIdx];
      var text = (isTransformed ? cur.transformed : cur.original).map(function (x) { return x.word; }).join(" ");
      speakText(text);

      if (isTransformed && window.FlowFun && window.FlowFun.confetti) {
        window.FlowFun.confetti(25);
      }
    };

    renderTiles();
  }

  // =========================================================================
  // Module 3: 12 Tenses Timeline Simulator
  // =========================================================================
  var TENSE_TIMELINE_DATA = [
    {
      time: "Past Simple",
      markerLeft: "10%",
      fillWidth: "15%",
      sentence: "Flo <em>studied</em> English yesterday at the library.",
      formula: "Subject + Verb(Past -ed) + Time Context",
      floEmoji: "🦉📜"
    },
    {
      time: "Present Continuous",
      markerLeft: "50%",
      fillWidth: "50%",
      sentence: "Flo <em>is practicing</em> speaking right now on the web.",
      formula: "Subject + am/is/are + Verb(-ing)",
      floEmoji: "🦉🎧"
    },
    {
      time: "Future Continuous",
      markerLeft: "90%",
      fillWidth: "90%",
      sentence: "Flo <em>will be flying</em> to London tomorrow morning.",
      formula: "Subject + will be + Verb(-ing)",
      floEmoji: "🦉✈️"
    }
  ];

  function initTimeline() {
    var fill = document.getElementById("anim-timeline-fill");
    var marker = document.getElementById("anim-flo-marker");
    var resultSentence = document.getElementById("anim-timeline-sentence");
    var resultFormula = document.getElementById("anim-timeline-formula");
    var nodes = document.querySelectorAll(".anim-time-node");

    if (!fill || !marker) return;

    function applyTense(idx) {
      var d = TENSE_TIMELINE_DATA[idx];
      fill.style.width = d.fillWidth;
      marker.style.left = d.markerLeft;
      marker.textContent = d.floEmoji;

      resultSentence.innerHTML = d.sentence;
      resultFormula.textContent = d.formula;

      nodes.forEach(function (n, i) {
        n.classList.toggle("is-active", i === idx);
      });

      // Voice read
      var plainText = d.sentence.replace(/<[^>]+>/g, "");
      speakText(plainText);
    }

    nodes.forEach(function (node, idx) {
      node.onclick = function () {
        applyTense(idx);
      };
    });

    applyTense(1);
  }

  // =========================================================================
  // Module 4: Phrasal Verbs Theater (Literal vs Idiomatic)
  // =========================================================================
  var PHRASAL_ITEMS = [
    {
      word: "Look up",
      literalEmoji: "🔭🌌",
      literalText: "Point your eyes upwards towards the sky or stars.",
      literalExample: "“Look up at the stars tonight!”",
      idiomEmoji: "📖🔍",
      idiomText: "Search for information in a dictionary, phone, or book.",
      idiomExample: "“I will look up that vocabulary word in the Excel tracker.”"
    },
    {
      word: "Turn down",
      literalEmoji: "🔉🎛️",
      literalText: "Reduce the volume or heat of an appliance.",
      literalExample: "“Could you turn down the music a bit?”",
      idiomEmoji: "🙅‍♂️💼",
      idiomText: "Politely reject or decline an offer or invitation.",
      idiomExample: "“She turned down the job offer for a better one.”"
    },
    {
      word: "Break down",
      literalEmoji: "🚗💨",
      literalText: "A machine or vehicle stops functioning.",
      literalExample: "“The taxi broke down on the way to the airport.”",
      idiomEmoji: "🥺😭",
      idiomText: "Lose emotional control and cry or analyze into small parts.",
      idiomExample: "“Let Flo break down this grammar rule step by step.”"
    },
    {
      word: "Run into",
      literalEmoji: "💥🏃‍♂️",
      literalText: "Physically collide or bump into an object.",
      literalExample: "“I wasn't looking and ran into a glass door!”",
      idiomEmoji: "👋😲",
      idiomText: "Meet an acquaintance unexpectedly by surprise.",
      idiomExample: "“Guess who I ran into at the cafe today?”"
    }
  ];

  function initPhrasalVerbs() {
    var grid = document.getElementById("anim-phrasal-grid");
    if (!grid) return;

    grid.innerHTML = "";
    PHRASAL_ITEMS.forEach(function (item) {
      var card = document.createElement("div");
      card.className = "anim-phrasal-card";

      var isIdiom = true;

      function renderCard() {
        var emoji = isIdiom ? item.idiomEmoji : item.literalEmoji;
        var text = isIdiom ? item.idiomText : item.literalText;
        var ex = isIdiom ? item.idiomExample : item.literalExample;

        card.innerHTML = '' +
          '<div class="anim-pv-header">' +
            '<h3 class="anim-pv-word">' + item.word + '</h3>' +
            '<button type="button" class="anim-btn anim-btn-audio pv-audio-btn" aria-label="Listen">🔊</button>' +
          '</div>' +
          '<div class="anim-pv-stage">' +
            '<div class="anim-pv-big-emoji">' + emoji + '</div>' +
          '</div>' +
          '<div class="anim-pv-mode-toggle">' +
            '<button type="button" class="anim-pv-toggle-btn' + (!isIdiom ? ' is-active' : '') + ' btn-literal">Literal Meaning</button>' +
            '<button type="button" class="anim-pv-toggle-btn' + (isIdiom ? ' is-active' : '') + ' btn-idiom">Real Idiom ✨</button>' +
          '</div>' +
          '<p class="anim-pv-text">' + text + '</p>' +
          '<p class="anim-pv-example">' + ex + '</p>';

        card.querySelector(".btn-literal").onclick = function () {
          isIdiom = false;
          renderCard();
        };

        card.querySelector(".btn-idiom").onclick = function () {
          isIdiom = true;
          renderCard();
        };

        card.querySelector(".pv-audio-btn").onclick = function () {
          speakText(item.word + ". " + ex.replace(/[“”]/g, ""));
        };
      }

      renderCard();
      grid.appendChild(card);
    });
  }

  // =========================================================================
  // Module 5: Pronunciation & Mouth Shape Visualizer
  // =========================================================================
  var PRONOUNCE_DATA = [
    {
      sound: "/θ/ & /ð/ (TH Sound)",
      words: "Think, Through, This, That",
      rule: "Tongue between teeth gently. Air flows continuously.",
      tip: "Do NOT place tongue behind teeth (which sounds like 'S' or 'D'). Let the tongue tip stick out slightly between your upper and lower teeth!",
      mouthVisual: '<circle cx="70" cy="70" r="50" fill="#f87171" opacity="0.3"/><rect x="40" y="55" width="60" height="12" rx="4" fill="#ffffff"/><rect x="52" y="65" width="36" height="16" rx="6" fill="#fb7185"/><text x="70" y="110" font-size="14" fill="#ffffff" text-anchor="middle" font-weight="bold">Tongue between teeth</text>'
    },
    {
      sound: "/v/ vs /b/ (V vs B)",
      words: "Very / Berry, Vote / Boat",
      rule: "V: Top teeth touch lower lip. B: Both lips pressed firmly.",
      tip: "For V, blow air gently through your top teeth onto your wet lower lip. For B, pop both lips open with air burst.",
      mouthVisual: '<circle cx="70" cy="70" r="50" fill="#38bdf8" opacity="0.3"/><rect x="42" y="55" width="56" height="10" rx="3" fill="#ffffff"/><ellipse cx="70" cy="75" rx="28" ry="10" fill="#fb7185"/><text x="70" y="110" font-size="14" fill="#ffffff" text-anchor="middle" font-weight="bold">Top teeth on bottom lip</text>'
    },
    {
      sound: "/r/ vs /l/ (R vs L)",
      words: "Right / Light, Read / Lead",
      rule: "R: Tongue curves back, never touches roof. L: Tongue touches roof behind teeth.",
      tip: "For R, your tongue stays suspended inside your mouth without touching the ceiling. For L, tap the front tip firmly against the gum ridge.",
      mouthVisual: '<circle cx="70" cy="70" r="50" fill="#34d399" opacity="0.3"/><path d="M 45 75 Q 70 50 95 75" stroke="#fb7185" stroke-width="12" fill="transparent" stroke-linecap="round"/><text x="70" y="110" font-size="14" fill="#ffffff" text-anchor="middle" font-weight="bold">Curved tongue (No roof touch)</text>'
    }
  ];

  function initPronunciation() {
    var pills = document.querySelectorAll(".anim-sound-pill");
    var ruleText = document.getElementById("anim-sound-rule");
    var tipText = document.getElementById("anim-sound-tip");
    var svgBox = document.getElementById("anim-mouth-svg");
    var speakSoundBtn = document.getElementById("anim-sound-audio-btn");

    if (!ruleText || !svgBox) return;

    var activeIdx = 0;

    function applySound(idx) {
      activeIdx = idx;
      var d = PRONOUNCE_DATA[idx];
      ruleText.textContent = d.sound + " — Examples: " + d.words;
      tipText.textContent = d.tip;
      svgBox.innerHTML = d.mouthVisual;

      pills.forEach(function (p, i) {
        p.classList.toggle("is-active", i === idx);
      });
    }

    pills.forEach(function (pill, idx) {
      pill.onclick = function () {
        applySound(idx);
      };
    });

    if (speakSoundBtn) {
      speakSoundBtn.onclick = function () {
        var d = PRONOUNCE_DATA[activeIdx];
        speakText(d.words, 0.85);
      };
    }

    applySound(0);
  }

  // =========================================================================
  // Initialize Everything on DOM Ready
  // =========================================================================
  function initAll() {
    initTheater();
    initSentenceTransformer();
    initTimeline();
    initPhrasalVerbs();
    initPronunciation();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAll);
  } else {
    initAll();
  }
})();
