/**
 * English Flow — "What Is This?" Video Learning Engine
 * Interactive video quiz system with real videos (HTML5 & YouTube),
 * Web Audio sound chimes, SpeechSynthesis pronunciation, and Google Flow creator studio.
 */
(function () {
  "use strict";

  // =========================================================================
  // Question Dataset (Curated Real Video Animations)
  // Supports HTML5 video files (local or URL) and YouTube Shorts/clips
  // =========================================================================
  var WHAT_IS_THIS_DATA = [
    {
      id: "clock-veo",
      category: "Everyday Objects",
      title: "Google Veo AI Animation — Timepiece",
      videoType: "video",
      videoSrc: "videos/veo_clock.webm",
      question: "What is this?",
      options: [
        "A ticking clock",
        "A pocket compass",
        "A digital thermometer",
        "A bicycle wheel"
      ],
      correctIndex: 0,
      word: "A ticking clock",
      ipa: "/ə ˈtɪk.ɪŋ klɒk/",
      definition: "A timepiece with moving hands that indicates hours, minutes, and seconds.",
      example: "The rhythmic ticking of the wall clock helped him focus while studying.",
      tip: "In English, clocks 'tick' (the sound of the seconds hand) and 'chime' (the sound when ringing on the hour)."
    },
    {
      id: "flower-bloom",
      category: "Nature & Outdoors",
      title: "Nature in Motion — Petals Opening",
      videoType: "video",
      videoSrc: "videos/flower_blooming.mp4",
      question: "What is this?",
      options: [
        "A blooming flower",
        "Falling autumn leaves",
        "A melting ice cube",
        "A sprouting mushroom"
      ],
      correctIndex: 0,
      word: "A blooming flower",
      ipa: "/ə ˈbluː.mɪŋ ˈflaʊ.ər/",
      definition: "The process of a flower bud opening up and revealing its petals.",
      example: "Every spring, thousands of cherry blossoms bloom throughout the city parks.",
      tip: "'Bloom' can be a noun ('in full bloom') or an active verb ('the roses are blooming')."
    },
    {
      id: "sugar-coffee",
      category: "Kitchen & Food",
      title: "Morning Routine — Sweetening a Drink",
      videoType: "video",
      videoSrc: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Sugar_falling_into_coffee.webm",
      question: "What is this?",
      options: [
        "Adding sugar to coffee",
        "Spilling hot tomato soup",
        "Grinding dark coffee beans",
        "Pouring milk into cereal"
      ],
      correctIndex: 0,
      word: "Adding sugar to coffee",
      ipa: "/ˈæd.ɪŋ ˈʃʊɡ.ər tuː ˈkɒf.i/",
      definition: "Dropping sugar cubes or granules into a hot cup of coffee to sweeten it.",
      example: "Do you take sugar with your coffee, or do you prefer it black?",
      tip: "Native speakers casually say 'Do you take sugar?' instead of 'Do you want to put sugar inside?'"
    },
    {
      id: "cup-coffee",
      category: "Kitchen & Food",
      title: "Warm Beverage — Fresh Roast",
      videoType: "video",
      videoSrc: "https://upload.wikimedia.org/wikipedia/commons/5/5f/A_cup_of_Kenyan_Coffee.webm",
      question: "What is this?",
      options: [
        "A cup of coffee",
        "A bowl of chicken noodle soup",
        "A glass of iced lemon water",
        "A pot of boiling pasta"
      ],
      correctIndex: 0,
      word: "A cup of coffee",
      ipa: "/ə kʌp əv ˈkɒf.i/",
      definition: "A warm, freshly prepared brewed caffeinated beverage.",
      example: "I love holding a warm cup of coffee on chilly autumn mornings.",
      tip: "At a coffee shop, you can simply ask: 'Could I please get a black coffee to go?'"
    },
    {
      id: "short-natural",
      category: "English Flow Masterclass",
      title: "English Flow Short — Natural Expressions",
      videoType: "youtube",
      videoSrc: "rZOKKde9hek",
      question: "What is this English lesson teaching?",
      options: [
        "Upgrading daily conversational phrases",
        "Practicing past continuous verbs",
        "Ordering groceries online",
        "Spelling difficult names"
      ],
      correctIndex: 0,
      word: "Conversational Upgrade",
      ipa: "/ˌkɒn.vəˈseɪ.ʃən.əl ˈʌp.ɡreɪd/",
      definition: "Replacing stiff textbook expressions with natural phrases used by native speakers.",
      example: "Instead of saying 'I am fine, thank you', say 'Doing well, thanks!'",
      tip: "Natural phrases help you sound warm, relaxed, and approachable in real conversations."
    },
    {
      id: "short-confidence",
      category: "Everyday Routines",
      title: "English Flow Short — Speaking Without Fear",
      videoType: "youtube",
      videoSrc: "tNdgsDK4_9g",
      question: "What is this lesson focused on?",
      options: [
        "Speaking English with daily confidence",
        "Memorizing grammar rules for exams",
        "Writing formal business invoices",
        "Passing a driving test"
      ],
      correctIndex: 0,
      word: "Speaking with Confidence",
      ipa: "/ˈspiː.kɪŋ wɪð ˈkɒn.fɪ.dəns/",
      definition: "Expressing yourself clearly without hesitating, overthinking, or fearing small mistakes.",
      example: "Confidence comes from speaking a little bit every day without fear.",
      tip: "Remember: fluency is about connecting and communicating, not about being 100% perfect!"
    },
    {
      id: "short-common-error",
      category: "Common Spoken Errors",
      title: "English Flow Short — Habit Correction",
      videoType: "youtube",
      videoSrc: "gP2X9hMMblA",
      question: "What is this video showing?",
      options: [
        "“Don’t say this — say this instead!”",
        "How to prepare a quick meal",
        "Walking around a museum",
        "Booking an international flight"
      ],
      correctIndex: 0,
      word: "Fixing Spoken Habits",
      ipa: "/ˈfɪk.sɪŋ ˈspoʊ.kən ˈhæb.ɪts/",
      definition: "Replacing awkward direct translations with fluent, natural expressions.",
      example: "Never say 'I am agree' — always say 'I agree' or 'I feel the same way.'",
      tip: "'Agree' is already a verb in English — you don't need 'am' before it!"
    },
    {
      id: "short-daily-phrase",
      category: "Everyday Routines",
      title: "English Flow Short — Bite-Sized Learning",
      videoType: "youtube",
      videoSrc: "TNNLuFnPJ5U",
      question: "What daily habit is shown here?",
      options: [
        "Learning one bite-sized phrase every day",
        "Studying for six hours straight",
        "Translating a dictionary word for word",
        "Watching silent movies with subtitles"
      ],
      correctIndex: 0,
      word: "Bite-Sized Learning",
      ipa: "/ˈbaɪt saɪzd ˈlɜː.nɪŋ/",
      definition: "Practicing one small, useful phrase each day so it sticks in long-term memory.",
      example: "Ten minutes of daily practice is far more effective than cramming once a week.",
      tip: "Small daily steps build big, lasting English confidence."
    },
    {
      id: "hand-washing",
      category: "Everyday Actions",
      title: "Hygiene Action — Clean Hands",
      videoType: "video",
      videoSrc: "https://upload.wikimedia.org/wikipedia/commons/e/e3/Hand_Washing.webmhd.webm",
      question: "What action is this?",
      options: [
        "Washing hands with soap and water",
        "Applying moisturizing cream",
        "Slicing vegetables on a board",
        "Polishing leather work shoes"
      ],
      correctIndex: 0,
      word: "Washing hands",
      ipa: "/ˈwɒʃ.ɪŋ hændz/",
      definition: "Cleaning one's hands with running water and soap to remove germs and dirt.",
      example: "Always wash your hands thoroughly before preparing a meal.",
      tip: "Native speakers use the phrase 'scrub your hands' when cleaning them vigorously."
    },
    {
      id: "typing-action",
      category: "Tools & Objects",
      title: "Office & Study — Keyboard Input",
      videoType: "video",
      videoSrc: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Hunt_and_peck_typing_%E2%80%94_Monkeytype_benchmark.webm",
      question: "What action is this?",
      options: [
        "Typing on a computer keyboard",
        "Playing classical piano keys",
        "Writing a handwritten note",
        "Operating an office calculator"
      ],
      correctIndex: 0,
      word: "Typing on a keyboard",
      ipa: "/ˈtaɪ.pɪŋ ɒn ə ˈkiː.bɔːd/",
      definition: "Pressing keys on an alphanumeric keyboard to input text into a digital device.",
      example: "She is typing out an urgent reply to her client's email.",
      tip: "Typing quickly without glancing down at your hands is known as 'touch typing'."
    },
    {
      id: "guitar-picks",
      category: "Everyday Objects",
      title: "Music & Hobbies — Acoustic Strings",
      videoType: "video",
      videoSrc: "https://upload.wikimedia.org/wikipedia/commons/0/08/Demonstration_of_26_Guitar_Picks.webm",
      question: "What is this person doing?",
      options: [
        "Playing an acoustic guitar",
        "Tuning a violin",
        "Adjusting a stage microphone",
        "Playing a snare drum"
      ],
      correctIndex: 0,
      word: "Playing the guitar",
      ipa: "/ˈpleɪ.ɪŋ ðə ɡɪˈtɑːr/",
      definition: "Strumming or plucking the strings of a fretted musical instrument.",
      example: "He loves playing acoustic guitar by the campfire on weekend trips.",
      tip: "In English, remember to say 'play THE guitar' (musical instruments generally take 'the')."
    },
    {
      id: "bunny-waking",
      category: "Nature & Outdoors",
      title: "Forest Animation — Morning Wake Up",
      videoType: "video",
      videoSrc: "https://upload.wikimedia.org/wikipedia/commons/transcoded/c/c0/Big_Buck_Bunny_4K.webm/Big_Buck_Bunny_4K.webm.360p.vp9.webm",
      question: "What is shown in this animated clip?",
      options: [
        "A rabbit waking up in nature",
        "A fierce lion hunting in the savanna",
        "An owl flying silently through the night",
        "A dolphin leaping through ocean waves"
      ],
      correctIndex: 0,
      word: "A rabbit waking up",
      ipa: "/ə ˈræb.ɪt ˈweɪk.ɪŋ ʌp/",
      definition: "A small furry woodland mammal stirring and opening its eyes after sleeping.",
      example: "The wild rabbit hopped across the dew-covered grass in the morning.",
      tip: "'Bunny' is a common, affectionate informal name for a rabbit."
    }
  ];

  // =========================================================================
  // State Management
  // =========================================================================
  var state = {
    currentIndex: 0,
    filteredList: WHAT_IS_THIS_DATA.slice(),
    selectedCategory: "all",
    streak: parseInt(localStorage.getItem("wit_streak") || "0", 10),
    xp: parseInt(localStorage.getItem("wit_xp") || "0", 10),
    isAnswered: false,
    soundEnabled: true,
    slowMotion: false
  };

  // Flo mascot commentary phrases
  var FLO_CHEERS = [
    "Spot on! That's exactly how native speakers describe it!",
    "Great eye! Visual memory helps words stick 7x faster!",
    "Boom! Another win for your English vocabulary!",
    "Fantastic! You're building real-life conversational flow!",
    "Keep it up! Little steps lead to big English confidence!"
  ];

  var FLO_ENCOURAGEMENTS = [
    "No worries at all! That's how we learn. Hear the word once more!",
    "Close one! Take a second to listen to the pronunciation above.",
    "Every mistake is a stepping stone. Now you know the real phrase!",
    "Don't worry — native speech takes time to train your eye. Let's keep flowing!"
  ];

  // =========================================================================
  // Web Audio Synthesizer (Instant chime/boop without downloading external audio)
  // =========================================================================
  var audioCtx = null;
  function getAudioContext() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      var AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtxClass();
    }
    return audioCtx;
  }

  function playTone(freq, type, startTime, duration, gainVal) {
    var ctx = getAudioContext();
    if (!ctx || !state.soundEnabled) return;
    try {
      if (ctx.state === "suspended") ctx.resume();
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = type || "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      gain.gain.setValueAtTime(gainVal || 0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      console.warn("Audio play error", e);
    }
  }

  function playSuccessChime() {
    var ctx = getAudioContext();
    if (!ctx || !state.soundEnabled) return;
    var now = ctx.currentTime;
    playTone(523.25, "sine", now, 0.15, 0.12);        // C5
    playTone(659.25, "sine", now + 0.1, 0.2, 0.15);   // E5
    playTone(783.99, "sine", now + 0.2, 0.35, 0.18);  // G5
  }

  function playWrongBoop() {
    var ctx = getAudioContext();
    if (!ctx || !state.soundEnabled) return;
    var now = ctx.currentTime;
    playTone(260, "triangle", now, 0.2, 0.15);
    playTone(200, "triangle", now + 0.15, 0.25, 0.12);
  }

  // =========================================================================
  // Speech Synthesis Helper
  // =========================================================================
  function speak(text, rate) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    var utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate || 0.92;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  // =========================================================================
  // DOM Elements
  // =========================================================================
  var stageEl = document.getElementById("wit-stage");
  var questionTitleEl = document.getElementById("wit-q-title");
  var optionsGridEl = document.getElementById("wit-options-grid");
  var feedbackBoxEl = document.getElementById("wit-feedback-box");
  var fbStatusEl = document.getElementById("wit-fb-status");
  var fbWordEl = document.getElementById("wit-fb-word");
  var fbIpaEl = document.getElementById("wit-fb-ipa");
  var fbDescEl = document.getElementById("wit-fb-desc");
  var fbExampleEl = document.getElementById("wit-fb-example");
  var nextBtnEl = document.getElementById("wit-next-btn");
  var fbSpeakBtnEl = document.getElementById("wit-fb-speak-btn");
  var questionSpeakBtnEl = document.getElementById("wit-q-speak-btn");
  var categoryTagEl = document.getElementById("wit-category-tag");
  var qCountEl = document.getElementById("wit-q-count");
  var progressBarFillEl = document.getElementById("wit-progress-fill");
  var streakNumEl = document.getElementById("wit-streak-num");
  var xpNumEl = document.getElementById("wit-xp-num");
  var floBubbleEl = document.getElementById("wit-flo-bubble");
  var speedBtnEl = document.getElementById("wit-speed-btn");
  var loopBtnEl = document.getElementById("wit-loop-btn");
  var replayBtnEl = document.getElementById("wit-replay-btn");

  // =========================================================================
  // Render Current Question
  // =========================================================================
  function renderQuestion() {
    state.isAnswered = false;
    feedbackBoxEl.classList.remove("is-visible");
    feedbackBoxEl.classList.remove("wit-fb-correct");
    feedbackBoxEl.classList.remove("wit-fb-wrong");

    var list = state.filteredList;
    if (!list.length) return;
    if (state.currentIndex >= list.length) {
      state.currentIndex = 0;
    }

    var item = list[state.currentIndex];

    // Update Header & Progress
    if (categoryTagEl) categoryTagEl.textContent = item.category || "Video Quiz";
    if (qCountEl) qCountEl.textContent = (state.currentIndex + 1) + " / " + list.length;
    if (progressBarFillEl) {
      var pct = Math.round(((state.currentIndex + 1) / list.length) * 100);
      progressBarFillEl.style.width = pct + "%";
    }

    // Update Question Prompt
    if (questionTitleEl) {
      questionTitleEl.textContent = item.question || "What is this?";
    }

    // Render Video Stage (HTML5 video or YouTube)
    renderVideoStage(item);

    // Render 4 Options
    renderOptions(item);

    // Update Mascot Flo message
    if (floBubbleEl) {
      floBubbleEl.innerHTML = "<b>Flo says:</b> Watch the video animation above. What is this called in English?";
    }
  }

  function renderVideoStage(item) {
    if (!stageEl) return;
    stageEl.innerHTML = "";

    if (item.videoType === "youtube") {
      var ytId = item.videoSrc;
      var iframe = document.createElement("iframe");
      iframe.className = "wit-iframe-player";
      iframe.src = "https://www.youtube-nocookie.com/embed/" + ytId + "?autoplay=1&mute=1&loop=1&playlist=" + ytId + "&controls=0&modestbranding=1&playsinline=1&rel=0";
      iframe.title = item.title || "Video Animation";
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      stageEl.appendChild(iframe);
    } else {
      var video = document.createElement("video");
      video.className = "wit-video-player";
      video.id = "wit-active-video";
      video.src = item.videoSrc;
      video.autoplay = true;
      video.loop = true;
      video.muted = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.preload = "auto";
      if (state.slowMotion) {
        video.playbackRate = 0.75;
      }
      stageEl.appendChild(video);
    }
  }

  function renderOptions(item) {
    if (!optionsGridEl) return;
    optionsGridEl.innerHTML = "";

    var letters = ["A", "B", "C", "D"];
    item.options.forEach(function (optText, idx) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "wit-option-card";
      btn.dataset.index = idx;
      btn.setAttribute("aria-label", "Option " + letters[idx] + ": " + optText);

      btn.innerHTML =
        '<span class="wit-opt-letter">' + letters[idx] + '</span>' +
        '<span class="wit-opt-text">' + optText + '</span>';

      btn.addEventListener("click", function () {
        handleOptionClick(idx, item);
      });

      optionsGridEl.appendChild(btn);
    });
  }

  // =========================================================================
  // Option Selection Logic
  // =========================================================================
  function handleOptionClick(selectedIndex, item) {
    if (state.isAnswered) return;
    state.isAnswered = true;

    var isCorrect = (selectedIndex === item.correctIndex);
    var allOptionBtns = optionsGridEl.querySelectorAll(".wit-option-card");

    allOptionBtns.forEach(function (btn, idx) {
      btn.disabled = true;
      if (idx === item.correctIndex) {
        btn.classList.add(isCorrect ? "is-correct" : "is-revealed-correct");
      }
      if (idx === selectedIndex && !isCorrect) {
        btn.classList.add("is-wrong");
      }
    });

    if (isCorrect) {
      // Correct Audio & Streak
      playSuccessChime();
      state.streak += 1;
      state.xp += 10;
      localStorage.setItem("wit_streak", state.streak.toString());
      localStorage.setItem("wit_xp", state.xp.toString());

      updateStatsUI();

      // Show Feedback Card
      feedbackBoxEl.className = "wit-feedback-box is-visible wit-fb-correct";
      fbStatusEl.innerHTML = '<span style="color:#059669;">✓ Excellent! Correct Answer (+10 XP)</span>';
      fbWordEl.textContent = item.word || item.options[item.correctIndex];
      fbIpaEl.textContent = item.ipa || "";
      fbDescEl.textContent = item.definition || "";
      fbExampleEl.textContent = "“" + (item.example || "") + "”";

      // Cheerful Mascot Reaction
      if (floBubbleEl) {
        var randomCheer = FLO_CHEERS[Math.floor(Math.random() * FLO_CHEERS.length)];
        floBubbleEl.innerHTML = "<b>Flo cheers:</b> " + randomCheer;
      }

      // Voice Pronunciation
      speak((item.word || item.options[item.correctIndex]) + ". " + (item.example || ""));

    } else {
      // Wrong Audio & Feedback
      playWrongBoop();
      state.streak = 0;
      localStorage.setItem("wit_streak", "0");
      updateStatsUI();

      feedbackBoxEl.className = "wit-feedback-box is-visible wit-fb-wrong";
      fbStatusEl.innerHTML = '<span style="color:#dc2626;">✗ Not quite! Here is the correct answer:</span>';
      fbWordEl.textContent = item.word || item.options[item.correctIndex];
      fbIpaEl.textContent = item.ipa || "";
      fbDescEl.textContent = item.tip ? (item.tip + " " + (item.definition || "")) : (item.definition || "");
      fbExampleEl.textContent = "“" + (item.example || "") + "”";

      // Encouraging Mascot Reaction
      if (floBubbleEl) {
        var randomEnc = FLO_ENCOURAGEMENTS[Math.floor(Math.random() * FLO_ENCOURAGEMENTS.length)];
        floBubbleEl.innerHTML = "<b>Flo encourages you:</b> " + randomEnc;
      }

      // Speak correct pronunciation so learner learns
      speak(item.word || item.options[item.correctIndex]);
    }
  }

  function updateStatsUI() {
    if (streakNumEl) streakNumEl.textContent = state.streak;
    if (xpNumEl) xpNumEl.textContent = state.xp;
  }

  // =========================================================================
  // Next Question Advance
  // =========================================================================
  function nextQuestion() {
    state.currentIndex += 1;
    if (state.currentIndex >= state.filteredList.length) {
      state.currentIndex = 0;
    }
    renderQuestion();
  }

  if (nextBtnEl) {
    nextBtnEl.addEventListener("click", nextQuestion);
  }

  // Audio Repeat Buttons
  if (fbSpeakBtnEl) {
    fbSpeakBtnEl.addEventListener("click", function () {
      var item = state.filteredList[state.currentIndex];
      if (item) {
        speak((item.word || item.options[item.correctIndex]) + ". " + (item.example || ""));
      }
    });
  }

  if (questionSpeakBtnEl) {
    questionSpeakBtnEl.addEventListener("click", function () {
      speak("What is this? Choose the correct English phrase below.");
    });
  }

  // Video Speed Toggle (Normal / 0.75x Slow Motion)
  if (speedBtnEl) {
    speedBtnEl.addEventListener("click", function () {
      state.slowMotion = !state.slowMotion;
      speedBtnEl.textContent = state.slowMotion ? "⚡ 0.75x Slow-Mo" : "⚡ 1x Speed";
      var vid = document.getElementById("wit-active-video");
      if (vid) {
        vid.playbackRate = state.slowMotion ? 0.75 : 1.0;
      }
    });
  }

  // Replay Video
  if (replayBtnEl) {
    replayBtnEl.addEventListener("click", function () {
      var vid = document.getElementById("wit-active-video");
      if (vid) {
        vid.currentTime = 0;
        vid.play();
      } else {
        var item = state.filteredList[state.currentIndex];
        renderVideoStage(item);
      }
    });
  }

  // =========================================================================
  // Category Filtering
  // =========================================================================
  var filterBtns = document.querySelectorAll(".wit-filter-btn");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");

      var cat = btn.dataset.category;
      state.selectedCategory = cat;
      if (cat === "all") {
        state.filteredList = WHAT_IS_THIS_DATA.slice();
      } else {
        state.filteredList = WHAT_IS_THIS_DATA.filter(function (it) {
          return it.category.toLowerCase().indexOf(cat.toLowerCase()) !== -1;
        });
      }
      state.currentIndex = 0;
      renderQuestion();
    });
  });

  // =========================================================================
  // Keyboard Navigation (1, 2, 3, 4, Space to advance)
  // =========================================================================
  document.addEventListener("keydown", function (e) {
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;

    if (!state.isAnswered) {
      if (e.key === "1" || e.key.toLowerCase() === "a") {
        selectByIndex(0);
      } else if (e.key === "2" || e.key.toLowerCase() === "b") {
        selectByIndex(1);
      } else if (e.key === "3" || e.key.toLowerCase() === "c") {
        selectByIndex(2);
      } else if (e.key === "4" || e.key.toLowerCase() === "d") {
        selectByIndex(3);
      }
    } else {
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") {
        e.preventDefault();
        nextQuestion();
      }
    }
  });

  function selectByIndex(idx) {
    var item = state.filteredList[state.currentIndex];
    if (item && item.options[idx]) {
      handleOptionClick(idx, item);
    }
  }

  // =========================================================================
  // Google Flow Live Tester / Custom Video Loader
  // Allows testing any Google Flow video URL or file live on the page!
  // =========================================================================
  var customTestBtn = document.getElementById("wit-custom-preview-btn");
  if (customTestBtn) {
    customTestBtn.addEventListener("click", function () {
      var urlInput = document.getElementById("wit-custom-url");
      var opt1Input = document.getElementById("wit-custom-opt1");
      var opt2Input = document.getElementById("wit-custom-opt2");
      var opt3Input = document.getElementById("wit-custom-opt3");
      var opt4Input = document.getElementById("wit-custom-opt4");

      var url = urlInput ? urlInput.value.trim() : "";
      if (!url) {
        alert("Please paste your Google Flow video URL or YouTube ID!");
        return;
      }

      var customItem = {
        id: "custom-" + Date.now(),
        category: "Google Flow Custom",
        title: "Your Google Flow Animation",
        videoType: url.indexOf("youtube") !== -1 || url.length === 11 ? "youtube" : "video",
        videoSrc: url,
        question: "What is this?",
        options: [
          (opt1Input && opt1Input.value.trim()) || "Action / Object 1",
          (opt2Input && opt2Input.value.trim()) || "Action / Object 2",
          (opt3Input && opt3Input.value.trim()) || "Action / Object 3",
          (opt4Input && opt4Input.value.trim()) || "Action / Object 4"
        ],
        correctIndex: 0,
        word: (opt1Input && opt1Input.value.trim()) || "Correct English Phrase",
        ipa: "/ˈkəstəm ˈæksən/",
        definition: "Your custom video loaded from Google Flow into English Flow!",
        example: "Testing custom Google Flow animations for English learners.",
        tip: "Google Flow video clip previewed live!"
      };

      WHAT_IS_THIS_DATA.unshift(customItem);
      state.filteredList = WHAT_IS_THIS_DATA.slice();
      state.currentIndex = 0;
      renderQuestion();
      alert("✨ Success! Your Google Flow video animation is now loaded into the video quiz arena!");
    });
  }

  // Expose global array for developer extension
  if (typeof window !== "undefined") {
    window.WHAT_IS_THIS_DATA = WHAT_IS_THIS_DATA;
    window.addNewGoogleFlowVideo = function (videoData) {
      WHAT_IS_THIS_DATA.push(videoData);
      state.filteredList = WHAT_IS_THIS_DATA.slice();
    };
  }

  // Initial Boot
  updateStatsUI();
  renderQuestion();
})();
