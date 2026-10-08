/**
 * English Flow — "Say This, Not That!" Daily Spoken English Vocab Engine
 * Eliminates common translation mistakes (e.g. "Cut the banana" -> "Peel the banana")
 * Interactive 4-option quiz, Web Audio sound effects, and SpeechSynthesis pronunciation.
 */
(function () {
  "use strict";

  // =========================================================================
  // Question Dataset (12 High-Impact Daily English Mistake Busters)
  // =========================================================================
  var VOCAB_QUIZ_DATA = [
    {
      id: "cut-banana",
      category: "Kitchen & Food",
      wrongPhrase: "Cut the banana",
      wrongNote: "Sounds like using a knife to slice it in half",
      question: "Don't say: ❌ 'Cut the banana' — What should you say?",
      options: [
        "Peel the banana",
        "Open the banana",
        "Skin the banana",
        "Uncover the banana"
      ],
      correctIndex: 0,
      word: "Peel the banana",
      ipa: "/piːl ðə bəˈnæn.ə/",
      definition: "To remove the outer skin or peel from a ripe banana before eating.",
      example: "She peeled the banana and sliced it into her morning oatmeal bowl.",
      tip: "We use 'peel' for fruits and vegetables with skins: peel an orange, peel a potato, peel an apple."
    },
    {
      id: "break-egg",
      category: "Kitchen & Food",
      wrongPhrase: "Break the egg",
      wrongNote: "Too violent or destructive for cooking",
      question: "Don't say: ❌ 'Break the egg' — What is the natural cooking verb?",
      options: [
        "Crack an egg",
        "Smash an egg",
        "Burst an egg",
        "Snap an egg"
      ],
      correctIndex: 0,
      word: "Crack an egg",
      ipa: "/kræk ən eɡ/",
      definition: "To break the brittle outer shell of an egg to release the yolk and white inside.",
      example: "He cracked two fresh eggs directly into the sizzling hot skillet.",
      tip: "Collocation: Always say 'crack an egg' or 'crack open an egg'."
    },
    {
      id: "open-light",
      category: "Daily Habits",
      wrongPhrase: "Open the light",
      wrongNote: "Direct translation error; you cannot open electricity",
      question: "Don't say: ❌ 'Open the light' — How do you say this in English?",
      options: [
        "Turn on the light",
        "Open the light",
        "Start the light",
        "Ignite the light"
      ],
      correctIndex: 0,
      word: "Turn on the light",
      ipa: "/tɜːrn ɒn ðə laɪt/",
      definition: "To activate an electrical light switch or lamp.",
      example: "It's getting dark in here; could you please turn on the living room light?",
      tip: "Appliances and lights are 'turned on' or 'switched on'. We only 'open' doors, boxes, or windows."
    },
    {
      id: "drop-water",
      category: "Kitchen & Food",
      wrongPhrase: "Put water into the glass",
      wrongNote: "Clumsy and vague for liquid movement",
      question: "Don't say: ❌ 'Put water in the glass' — What is the natural action verb?",
      options: [
        "Pour the water",
        "Drop the water",
        "Spill the water",
        "Flow the water"
      ],
      correctIndex: 0,
      word: "Pour the water",
      ipa: "/pɔːr ðə ˈwɔː.tər/",
      definition: "To cause liquid to flow from a pitcher, bottle, or kettle into a drinking cup.",
      example: "Could you please pour me a cold glass of water?",
      tip: "Always use 'pour' for flowing liquids (pour milk, pour tea, pour juice)."
    },
    {
      id: "wash-teeth",
      category: "Daily Habits",
      wrongPhrase: "Wash your teeth",
      wrongNote: "We wash body parts with soap, not teeth",
      question: "Don't say: ❌ 'Wash your teeth' — What is the correct daily hygiene phrase?",
      options: [
        "Brush your teeth",
        "Wash your teeth",
        "Scrub your teeth",
        "Rinse your teeth"
      ],
      correctIndex: 0,
      word: "Brush your teeth",
      ipa: "/brʌʃ jʊər tiːθ/",
      definition: "To clean your teeth using a bristled toothbrush and toothpaste.",
      example: "Dentists recommend brushing your teeth for two full minutes twice a day.",
      tip: "Remember: 'tooth' is singular, and 'teeth' is the irregular plural."
    },
    {
      id: "close-candle",
      category: "Daily Habits",
      wrongPhrase: "Close the candle",
      wrongNote: "A flame has no door or lid to close",
      question: "Don't say: ❌ 'Close the candle' — What should you say on a birthday?",
      options: [
        "Blow out the candle",
        "Turn off the candle",
        "Close the candle",
        "Shut the candle"
      ],
      correctIndex: 0,
      word: "Blow out the candle",
      ipa: "/bloʊ aʊt ðə ˈkæn.dəl/",
      definition: "To extinguish a burning candle flame using a stream of breath.",
      example: "Make a wish before you blow out your birthday candles!",
      tip: "Phrasal verb: 'Blow out' specifically means extinguishing a flame with your breath."
    },
    {
      id: "do-mistake",
      category: "Common Collocations",
      wrongPhrase: "I did a mistake",
      wrongNote: "Very common non-native collocation mistake",
      question: "Don't say: ❌ 'I did a mistake' — What is the natural collocation?",
      options: [
        "I made a mistake",
        "I did a mistake",
        "I had a mistake",
        "I created a mistake"
      ],
      correctIndex: 0,
      word: "I made a mistake",
      ipa: "/aɪ meɪd ə mɪˈsteɪk/",
      definition: "To do something incorrect or produce an accidental error.",
      example: "I made an honest mistake on question three, but now I know the right phrase.",
      tip: "Collocation rule: We DO homework and DO chores, but we always MAKE a mistake and MAKE a choice."
    },
    {
      id: "close-shoes",
      category: "Daily Habits",
      wrongPhrase: "Close your shoes",
      wrongNote: "Shoes are not containers or boxes",
      question: "Don't say: ❌ 'Close your shoes' — What action is this?",
      options: [
        "Tie your shoelaces",
        "Close your shoes",
        "Lock your shoes",
        "Button your shoes"
      ],
      correctIndex: 0,
      word: "Tie your shoelaces",
      ipa: "/taɪ jʊər ˈʃuː.leɪ.sɪz/",
      definition: "To fasten shoes securely by looping, crossing, and tightening their strings.",
      example: "He stopped on the sidewalk to tie his loose shoelace before running.",
      tip: "You can say 'tie your shoes' or 'tie your shoelaces' interchangeably."
    },
    {
      id: "push-lemon",
      category: "Kitchen & Food",
      wrongPhrase: "Push the lemon",
      wrongNote: "'Push' means moving an object forward",
      question: "Don't say: ❌ 'Push the lemon' — How do you extract citrus juice?",
      options: [
        "Squeeze the lemon",
        "Push the lemon",
        "Pinch the lemon",
        "Crush the lemon"
      ],
      correctIndex: 0,
      word: "Squeeze the lemon",
      ipa: "/skwiːz ðə ˈlem.ən/",
      definition: "To press firmly on a citrus fruit to force out its sour juice.",
      example: "Squeeze half a fresh lemon over the grilled salmon for extra brightness.",
      tip: "Idiom: 'When life gives you lemons, make lemonade!'"
    },
    {
      id: "cut-carrot",
      category: "Kitchen & Food",
      wrongPhrase: "Cut cut the carrot",
      wrongNote: "Repetitive or vague culinary phrasing",
      question: "Don't say: ❌ 'Cut cut the carrot' — What culinary verb is this?",
      options: [
        "Chop the carrots",
        "Tear the carrots",
        "Break the carrots",
        "Melt the carrots"
      ],
      correctIndex: 0,
      word: "Chop the carrots",
      ipa: "/tʃɒp ðə ˈkær.əts/",
      definition: "To cut vegetables into bite-sized chunks with repeated knife strokes on a board.",
      example: "The chef chopped the fresh carrots rapidly on the wooden cutting board.",
      tip: "'Chop' means cutting into firm chunks. If cutting into tiny uniform squares, say 'dice'."
    },
    {
      id: "eat-medicine",
      category: "Daily Habits",
      wrongPhrase: "Eat medicine",
      wrongNote: "Medicine is not food or a meal",
      question: "Don't say: ❌ 'I need to eat medicine' — What verb is used for pills?",
      options: [
        "Take medicine",
        "Eat medicine",
        "Drink medicine",
        "Feed medicine"
      ],
      correctIndex: 0,
      word: "Take medicine",
      ipa: "/teɪk ˈmed.ɪ.sən/",
      definition: "To swallow prescribed tablets or syrup to treat an illness.",
      example: "The doctor advised her to take her medicine with a full glass of water after breakfast.",
      tip: "In English, we never 'eat' medicine. We always 'take medicine' or 'take a pill'."
    },
    {
      id: "listen-me",
      category: "Common Collocations",
      wrongPhrase: "Please listen me",
      wrongNote: "Missing preposition required by English grammar",
      question: "Don't say: ❌ 'Please listen me' — What preposition is missing?",
      options: [
        "Listen to me",
        "Listen me",
        "Listen at me",
        "Listen for me"
      ],
      correctIndex: 0,
      word: "Listen to me",
      ipa: "/ˈlɪs.ən tuː miː/",
      definition: "To pay active attention to someone speaking.",
      example: "Please listen to me carefully before you make your final decision.",
      tip: "The verb 'listen' always requires 'to' before an object: listen to music, listen to me."
    }
  ];

  // =========================================================================
  // State
  // =========================================================================
  var state = {
    currentIndex: 0,
    filteredList: VOCAB_QUIZ_DATA.slice(),
    streak: parseInt(localStorage.getItem("wit_streak") || "0", 10),
    xp: parseInt(localStorage.getItem("wit_xp") || "0", 10),
    selectedCategory: "all",
    slowMotion: false,
    isAnswered: false
  };

  // =========================================================================
  // Web Audio Synthesizer (Chimes & Feedback Sounds)
  // =========================================================================
  var audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      var AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSuccessChime() {
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var now = ctx.currentTime;
      var notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach(function (freq, idx) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } catch (e) {}
  }

  function playWrongBoop() {
    try {
      var ctx = getAudioContext();
      if (!ctx) return;
      var now = ctx.currentTime;
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.25);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch (e) {}
  }

  // =========================================================================
  // SpeechSynthesis Pronunciation
  // =========================================================================
  function speak(text) {
    if (!window.speechSynthesis || !text) return;
    try {
      window.speechSynthesis.cancel();
      var utt = new SpeechSynthesisUtterance(text);
      utt.lang = "en-US";
      utt.rate = state.slowMotion ? 0.72 : 0.95;
      utt.pitch = 1.0;
      var voices = window.speechSynthesis.getVoices();
      var usVoice = voices.find(function (v) {
        return (v.lang === "en-US" || v.lang.startsWith("en")) && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha"));
      });
      if (usVoice) utt.voice = usVoice;
      window.speechSynthesis.speak(utt);
    } catch (e) {}
  }

  // =========================================================================
  // DOM References
  // =========================================================================
  var stageEl = document.getElementById("wit-stage");
  var optionsGridEl = document.getElementById("wit-options-grid");
  var feedbackBoxEl = document.getElementById("wit-feedback-box");
  var fbStatusEl = document.getElementById("wit-fb-status");
  var fbWordEl = document.getElementById("wit-fb-word");
  var fbIpaEl = document.getElementById("wit-fb-ipa");
  var fbDescEl = document.getElementById("wit-fb-desc");
  var fbExampleEl = document.getElementById("wit-fb-example");
  var fbSpeakBtnEl = document.getElementById("wit-fb-speak-btn");
  var nextBtnEl = document.getElementById("wit-next-btn");
  var qCountEl = document.getElementById("wit-q-count");
  var streakNumEl = document.getElementById("wit-streak-num");
  var xpNumEl = document.getElementById("wit-xp-num");
  var categoryTagEl = document.getElementById("wit-category-tag");
  var questionTitleEl = document.getElementById("wit-q-title");
  var questionSpeakBtnEl = document.getElementById("wit-q-speak-btn");
  var progressBarFillEl = document.getElementById("wit-progress-fill");
  var floBubbleEl = document.getElementById("wit-flo-bubble");
  var speedBtnEl = document.getElementById("wit-speed-btn");
  var replayBtnEl = document.getElementById("wit-replay-btn");

  // =========================================================================
  // Render Current Question
  // =========================================================================
  function renderQuestion() {
    state.isAnswered = false;

    if (feedbackBoxEl) {
      feedbackBoxEl.classList.remove("is-visible");
      feedbackBoxEl.classList.remove("wit-fb-correct");
      feedbackBoxEl.classList.remove("wit-fb-wrong");
    }

    var list = state.filteredList;
    if (!list.length) return;
    if (state.currentIndex >= list.length) state.currentIndex = 0;

    var item = list[state.currentIndex];

    // Header & Progress
    if (categoryTagEl) categoryTagEl.textContent = item.category || "Common Mistakes";
    if (qCountEl) qCountEl.textContent = (state.currentIndex + 1) + " / " + list.length;
    if (progressBarFillEl) {
      var pct = Math.round(((state.currentIndex + 1) / list.length) * 100);
      progressBarFillEl.style.width = pct + "%";
    }

    // Question Prompt
    if (questionTitleEl) questionTitleEl.textContent = item.question || "What should you say instead?";

    // Render Say-This-Not-That Visual Card
    renderVocabStage(item, false);

    // Render 4 Options
    renderOptions(item);

    // Mascot Message
    if (floBubbleEl) {
      floBubbleEl.innerHTML = "<b>Flo says:</b> Stop translating in your head! How would a native English speaker say this?";
    }
  }

  function renderVocabStage(item, isRevealed) {
    if (!stageEl) return;

    var rightBoxHtml = "";
    if (isRevealed) {
      rightBoxHtml =
        '<div class="wit-say-box is-revealed">' +
          '<span class="wit-say-tag">✅ SAY THIS INSTEAD</span>' +
          '<h3 class="wit-say-phrase">“' + item.word + '”</h3>' +
          '<p class="wit-say-sub">' + (item.ipa ? '<span style="font-family:monospace; color:#a7f3d0;">' + item.ipa + '</span> · ' : '') + 'Natural Spoken English</p>' +
        '</div>';
    } else {
      rightBoxHtml =
        '<div class="wit-say-box">' +
          '<span class="wit-say-tag">❓ WHAT TO SAY?</span>' +
          '<h3 class="wit-say-phrase" style="color:#94a3b8; font-weight:600; font-size:18px;">Pick the natural phrase below 👇</h3>' +
          '<p class="wit-say-sub">Choose from the 4 options</p>' +
        '</div>';
    }

    stageEl.innerHTML =
      '<div class="wit-vocab-stage">' +
        '<div class="wit-vocab-comparison">' +
          '<div class="wit-dont-box">' +
            '<span class="wit-dont-tag">❌ DON’T SAY</span>' +
            '<h3 class="wit-dont-phrase">“' + item.wrongPhrase + '”</h3>' +
            '<p class="wit-dont-sub">' + item.wrongNote + '</p>' +
          '</div>' +
          '<div class="wit-vs-badge">VS</div>' +
          rightBoxHtml +
        '</div>' +
      '</div>';
  }

  function renderOptions(item) {
    if (!optionsGridEl) return;
    optionsGridEl.innerHTML = "";

    // Build array and shuffle so Option A is not always correct
    var opts = item.options.map(function (optText, idx) {
      return {
        text: optText,
        isCorrect: (idx === item.correctIndex)
      };
    });

    for (var i = opts.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = opts[i];
      opts[i] = opts[j];
      opts[j] = temp;
    }

    var letters = ["A", "B", "C", "D"];
    opts.forEach(function (opt, idx) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "wit-option-card";
      btn.dataset.isCorrect = opt.isCorrect ? "true" : "false";
      btn.setAttribute("aria-label", "Option " + letters[idx] + ": " + opt.text);

      btn.innerHTML =
        '<span class="wit-opt-letter">' + letters[idx] + '</span>' +
        '<span class="wit-opt-text">' + opt.text + '</span>';

      btn.addEventListener("click", function () {
        handleOptionClick(btn, opt.isCorrect, item);
      });

      optionsGridEl.appendChild(btn);
    });
  }

  // =========================================================================
  // Option Selection Logic
  // =========================================================================
  function handleOptionClick(clickedBtn, isCorrect, item) {
    if (state.isAnswered) return;
    state.isAnswered = true;

    var allOptionBtns = optionsGridEl.querySelectorAll(".wit-option-card");

    allOptionBtns.forEach(function (btn) {
      btn.disabled = true;
      var optIsCorrect = btn.dataset.isCorrect === "true";
      if (optIsCorrect) {
        btn.classList.add(isCorrect ? "is-correct" : "is-revealed-correct");
      }
      if (btn === clickedBtn && !isCorrect) {
        btn.classList.add("is-wrong");
      }
    });

    // Reveal correct phrase in visual stage
    renderVocabStage(item, true);

    if (isCorrect) {
      playSuccessChime();
      state.streak += 1;
      state.xp += 10;
      localStorage.setItem("wit_streak", state.streak.toString());
      localStorage.setItem("wit_xp", state.xp.toString());
      updateStatsUI();

      if (window.FlowFun && window.FlowFun.confetti) {
        window.FlowFun.confetti(35);
      }

      feedbackBoxEl.className = "wit-feedback-box is-visible wit-fb-correct";
      fbStatusEl.innerHTML = '<span style="color:#059669;">✓ Spot on! That is natural English (+10 XP)</span>';
      fbWordEl.textContent = item.word;
      fbIpaEl.textContent = item.ipa || "";
      fbDescEl.textContent = item.definition || "";
      fbExampleEl.textContent = "“" + (item.example || "") + "”";

      if (floBubbleEl) {
        floBubbleEl.innerHTML = "<b>Flo cheers:</b> Perfect! You replaced a common translation error with genuine spoken English!";
      }

      speak(item.word + ". " + (item.example || ""));

    } else {
      playWrongBoop();
      state.streak = 0;
      localStorage.setItem("wit_streak", "0");
      updateStatsUI();

      feedbackBoxEl.className = "wit-feedback-box is-visible wit-fb-wrong";
      fbStatusEl.innerHTML = '<span style="color:#dc2626;">✗ Don’t say that! Here is the natural phrase:</span>';
      fbWordEl.textContent = item.word;
      fbIpaEl.textContent = item.ipa || "";
      fbDescEl.textContent = (item.tip ? item.tip + " " : "") + (item.definition || "");
      fbExampleEl.textContent = "“" + (item.example || "") + "”";

      if (floBubbleEl) {
        floBubbleEl.innerHTML = "<b>Flo explains:</b> That's a super common mistake! Look at the green box above to remember the right phrase.";
      }

      speak(item.word);
    }
  }

  function updateStatsUI() {
    if (streakNumEl) streakNumEl.textContent = state.streak;
    if (xpNumEl) xpNumEl.textContent = state.xp;
  }

  function nextQuestion() {
    state.currentIndex += 1;
    if (state.currentIndex >= state.filteredList.length) {
      showCompletionScreen();
    } else {
      renderQuestion();
    }
  }

  function showCompletionScreen() {
    playSuccessChime();

    if (progressBarFillEl) progressBarFillEl.style.width = "100%";
    if (qCountEl) qCountEl.textContent = state.filteredList.length + " / " + state.filteredList.length;

    feedbackBoxEl.classList.remove("is-visible");

    var scoreMsg = "I scored " + state.xp + " XP on English Flow's 'Say This, Not That' Daily Quiz! Mastered 12 common English mistakes. Can you beat me? 🔥";
    var shareUrl = "https://englishflowofficial.github.io/what-is-this.html";
    var encodedMsg = encodeURIComponent(scoreMsg + "\n" + shareUrl);

    stageEl.innerHTML =
      '<div class="wit-completion-card">' +
        '<div class="wit-comp-badge">🎉 QUIZ COMPLETED!</div>' +
        '<h2 class="wit-comp-title">Incredible Job!</h2>' +
        '<p class="wit-comp-sub">You eliminated 12 of the most common spoken English translation mistakes.</p>' +
        '<div class="wit-comp-stats">' +
          '<div class="wit-comp-stat"><b>+' + state.xp + '</b><small>TOTAL XP</small></div>' +
          '<div class="wit-comp-stat"><b>🔥 ' + state.streak + '</b><small>BEST STREAK</small></div>' +
          '<div class="wit-comp-stat"><b>' + state.filteredList.length + '/' + state.filteredList.length + '</b><small>COMPLETED</small></div>' +
        '</div>' +
        '<div class="wit-share-section">' +
          '<p class="wit-share-heading">🚀 Challenge a Friend & Share:</p>' +
          '<div class="wit-share-buttons">' +
            '<a href="https://api.whatsapp.com/send?text=' + encodedMsg + '" target="_blank" rel="noopener noreferrer" class="wit-share-btn wit-btn-whatsapp">' +
              '<span>💬 Share on WhatsApp</span>' +
            '</a>' +
            '<a href="https://t.me/share/url?url=' + encodeURIComponent(shareUrl) + '&text=' + encodeURIComponent(scoreMsg) + '" target="_blank" rel="noopener noreferrer" class="wit-share-btn wit-btn-telegram">' +
              '<span>✈️ Telegram</span>' +
            '</a>' +
            '<a href="https://twitter.com/intent/tweet?text=' + encodedMsg + '" target="_blank" rel="noopener noreferrer" class="wit-share-btn wit-btn-twitter">' +
              '<span>𝕏 Share on X</span>' +
            '</a>' +
            '<button type="button" class="wit-share-btn wit-btn-copy" id="wit-copy-share-btn">' +
              '<span>🔗 Copy Link</span>' +
            '</button>' +
          '</div>' +
        '</div>' +
        '<div class="wit-comp-actions">' +
          '<button type="button" class="wit-comp-restart-btn" id="wit-restart-btn">🔄 Play Again</button>' +
          '<a href="practice.html" class="wit-comp-next-btn">Try Daily Speaking Room →</a>' +
        '</div>' +
      '</div>';

    if (questionTitleEl) questionTitleEl.textContent = "You've finished today's daily vocab set!";
    if (optionsGridEl) optionsGridEl.innerHTML = "";
    if (floBubbleEl) {
      floBubbleEl.innerHTML = "<b>Flo cheers:</b> Spectacular work! Share your score with study partners to see who knows more everyday English!";
    }

    var copyBtn = document.getElementById("wit-copy-share-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(scoreMsg + "\n" + shareUrl).then(function () {
            copyBtn.innerHTML = "<span>✓ Copied to Clipboard!</span>";
            setTimeout(function () { copyBtn.innerHTML = "<span>🔗 Copy Link</span>"; }, 2500);
          });
        }
      });
    }

    var restartBtn = document.getElementById("wit-restart-btn");
    if (restartBtn) {
      restartBtn.addEventListener("click", function () {
        state.currentIndex = 0;
        renderQuestion();
      });
    }
  }

  // =========================================================================
  // Event Listeners
  // =========================================================================
  if (nextBtnEl) {
    nextBtnEl.addEventListener("click", nextQuestion);
  }

  if (fbSpeakBtnEl) {
    fbSpeakBtnEl.addEventListener("click", function () {
      var item = state.filteredList[state.currentIndex];
      if (item) speak(item.word + ". " + (item.example || ""));
    });
  }

  if (questionSpeakBtnEl) {
    questionSpeakBtnEl.addEventListener("click", function () {
      var item = state.filteredList[state.currentIndex];
      if (item) speak("Don't say: " + item.wrongPhrase + ". What should you say instead?");
    });
  }

  // Speed Toggle
  if (speedBtnEl) {
    speedBtnEl.addEventListener("click", function () {
      state.slowMotion = !state.slowMotion;
      speedBtnEl.textContent = state.slowMotion ? "⚡ 0.7x Slow Pronunciation" : "⚡ 1x Normal Speed";
      var item = state.filteredList[state.currentIndex];
      if (item) speak(item.word);
    });
  }

  // Replay Audio
  if (replayBtnEl) {
    replayBtnEl.addEventListener("click", function () {
      var item = state.filteredList[state.currentIndex];
      if (item) {
        if (state.isAnswered) {
          speak(item.word + ". " + (item.example || ""));
        } else {
          speak("Don't say: " + item.wrongPhrase + ". What should you say instead?");
        }
      }
    });
  }

  // Category Filtering
  var filterBtns = document.querySelectorAll(".wit-filter-btn");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");

      var cat = btn.dataset.category;
      state.selectedCategory = cat;
      if (cat === "all") {
        state.filteredList = VOCAB_QUIZ_DATA.slice();
      } else {
        state.filteredList = VOCAB_QUIZ_DATA.filter(function (it) {
          return it.category.toLowerCase().includes(cat.toLowerCase());
        });
      }
      state.currentIndex = 0;
      renderQuestion();
    });
  });

  // Keyboard Shortcuts (1-4 for options, Enter for next)
  window.addEventListener("keydown", function (e) {
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
    if (["1", "2", "3", "4"].includes(e.key) && !state.isAnswered) {
      var idx = parseInt(e.key, 10) - 1;
      if (optionsGridEl) {
        var btns = optionsGridEl.querySelectorAll(".wit-option-card");
        if (btns && btns[idx]) {
          btns[idx].click();
        }
      }
    } else if (e.key === "Enter" && state.isAnswered) {
      nextQuestion();
    }
  });

  // =========================================================================
  // Initialize
  // =========================================================================
  updateStatsUI();
  renderQuestion();
})();
