/**
 * English Flow — "What Is This?" 2D Video Learning Engine
 * Features real 2D animated action video clips (Peel the banana, Crack an egg, Pour the water, etc.),
 * HTML5 video stream player, Web Audio sound effects, and SpeechSynthesis pronunciation.
 */
(function () {
  "use strict";

  // =========================================================================
  // Question Dataset (2D Cartoon Animated Clips of Daily Actions)
  // =========================================================================
  var WHAT_IS_THIS_DATA = [
    {
      id: "peel-banana",
      category: "Kitchen & Food",
      title: "2D Animation — Fruit Prep",
      actionKey: "peel_banana",
      videoType: "anim_stream",
      question: "What is this?",
      options: [
        "Peel the banana",
        "Slice the melon",
        "Mash the potato",
        "Pick the berries"
      ],
      correctIndex: 0,
      word: "Peel the banana",
      ipa: "/piːl ðə bəˈnæn.ə/",
      definition: "To remove the outer skin or peel from a ripe banana before eating.",
      example: "She peeled the banana and sliced it into her morning oatmeal bowl.",
      tip: "We use 'peel' for fruits and vegetables with skins: peel an orange, peel a potato, peel an apple."
    },
    {
      id: "crack-egg",
      category: "Kitchen & Food",
      title: "2D Animation — Cooking Action",
      actionKey: "crack_egg",
      videoType: "anim_stream",
      question: "What is this?",
      options: [
        "Crack an egg",
        "Boil the water",
        "Roll the dough",
        "Melt the butter"
      ],
      correctIndex: 0,
      word: "Crack an egg",
      ipa: "/kræk ən eɡ/",
      definition: "To break the brittle outer shell of an egg to release the yolk and white inside.",
      example: "He cracked two fresh eggs directly into the sizzling hot skillet.",
      tip: "Phrasal variation: You can also say 'crack open an egg'."
    },
    {
      id: "pour-water",
      category: "Kitchen & Food",
      title: "2D Animation — Drink Serving",
      actionKey: "pour_water",
      videoType: "anim_stream",
      question: "What is this?",
      options: [
        "Pour the water",
        "Freeze the ice",
        "Wash the plate",
        "Stir the coffee"
      ],
      correctIndex: 0,
      word: "Pour the water",
      ipa: "/pɔːr ðə ˈwɔː.tər/",
      definition: "To cause liquid to flow from a pitcher, bottle, or kettle into a drinking cup.",
      example: "Could you please pour me a cold glass of water?",
      tip: "Don't say 'drop the water' or 'put the water' — always use 'pour' for flowing liquids."
    },
    {
      id: "chop-carrot",
      category: "Kitchen & Food",
      title: "2D Animation — Meal Preparation",
      actionKey: "chop_carrot",
      videoType: "anim_stream",
      question: "What is this?",
      options: [
        "Chop the carrot",
        "Peel the onion",
        "Bake the bread",
        "Grate the cheese"
      ],
      correctIndex: 0,
      word: "Chop the carrot",
      ipa: "/tʃɒp ðə ˈkær.ət/",
      definition: "To cut a vegetable into smaller bite-sized slices or chunks with repeated knife strokes.",
      example: "The chef chopped the fresh carrots rapidly on the wooden cutting board.",
      tip: "'Chop' implies firm cutting motions; 'dice' means cutting into tiny uniform cubes."
    },
    {
      id: "squeeze-lemon",
      category: "Kitchen & Food",
      title: "2D Animation — Extracting Juice",
      actionKey: "squeeze_lemon",
      videoType: "anim_stream",
      question: "What is this?",
      options: [
        "Squeeze the lemon",
        "Shake the bottle",
        "Plant the seeds",
        "Peel an apple"
      ],
      correctIndex: 0,
      word: "Squeeze the lemon",
      ipa: "/skwiːz ðə ˈlem.ən/",
      definition: "To press firmly on a citrus fruit to force out its sour juice.",
      example: "Squeeze half a fresh lemon over the grilled salmon for extra brightness.",
      tip: "Common idiom: 'When life gives you lemons, make lemonade!'"
    },
    {
      id: "bite-apple",
      category: "Kitchen & Food",
      title: "2D Animation — Eating Fruit",
      actionKey: "bite_apple",
      videoType: "anim_stream",
      question: "What is this?",
      options: [
        "Bite an apple",
        "Slice a watermelon",
        "Dry the fruit",
        "Toss the salad"
      ],
      correctIndex: 0,
      word: "Bite an apple",
      ipa: "/baɪt ən ˈæp.əl/",
      definition: "To cut into an apple using one's teeth with a crisp snapping sound.",
      example: "He took a crisp, juicy bite of the Honeycrisp apple after his morning workout.",
      tip: "Collocation: We say 'take a bite of' something when taking a single mouthful."
    },
    {
      id: "brush-teeth",
      category: "Everyday Habits",
      title: "2D Animation — Morning Hygiene",
      actionKey: "brush_teeth",
      videoType: "anim_stream",
      question: "What is this?",
      options: [
        "Brush the teeth",
        "Comb the hair",
        "Wash the face",
        "Clip the nails"
      ],
      correctIndex: 0,
      word: "Brush the teeth",
      ipa: "/brʌʃ ðə tiːθ/",
      definition: "To clean your teeth with toothpaste and a bristled brush.",
      example: "Dentists recommend brushing your teeth for two full minutes twice a day.",
      tip: "Remember: 'tooth' is singular, and 'teeth' is the irregular plural."
    },
    {
      id: "blow-candle",
      category: "Everyday Habits",
      title: "2D Animation — Celebration & Calm",
      actionKey: "blow_candle",
      videoType: "anim_stream",
      question: "What is this?",
      options: [
        "Blow out the candle",
        "Light the match",
        "Cut the cake",
        "Wrap the gift"
      ],
      correctIndex: 0,
      word: "Blow out the candle",
      ipa: "/bloʊ aʊt ðə ˈkæn.dəl/",
      definition: "To extinguish a burning candle flame by blowing a gentle stream of air.",
      example: "Make a quiet wish before you blow out the birthday candles!",
      tip: "Phrasal verb: 'Blow out' specifically means extinguishing a flame with breath."
    },
    {
      id: "clock-veo",
      category: "Everyday Objects",
      title: "AI Video Animation — Timepiece",
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
    }
  ];

  // =========================================================================
  // State
  // =========================================================================
  var state = {
    currentIndex: 0,
    filteredList: WHAT_IS_THIS_DATA.slice(),
    selectedCategory: "all",
    streak: parseInt(localStorage.getItem("wit_streak") || "0", 10),
    xp: parseInt(localStorage.getItem("wit_xp") || "0", 10),
    isAnswered: false,
    soundEnabled: true,
    slowMotion: false,
    animFrameId: null,
    animStartTime: 0
  };

  // =========================================================================
  // Web Audio Synthesizer
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
      console.warn("Audio error", e);
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

  // Speech Pronunciation
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
  // 2D Cartoon Animation Renderers
  // =========================================================================
  var ACTION_RENDERERS = {
    peel_banana: function (ctx, t) {
      ctx.fillStyle = "#fffbeb";
      ctx.fillRect(0, 0, 480, 360);

      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.06)";
      ctx.beginPath();
      ctx.ellipse(240, 310, 110, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.translate(240, 200);

      // Inner white banana
      ctx.fillStyle = "#fffef0";
      ctx.strokeStyle = "#e2d9b5";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(0, 10, 42, 95, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Banana inner ridges
      ctx.strokeStyle = "#eedc9a";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-15, -60);
      ctx.quadraticCurveTo(-10, 20, -5, 80);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(15, -60);
      ctx.quadraticCurveTo(10, 20, 15, 80);
      ctx.stroke();

      // Peel progress: 0 to 1
      var peel = Math.min(1, Math.max(0, (t - 0.15) / 0.7));
      var peelY = -70 + peel * 130;

      // Bottom peel cup
      ctx.fillStyle = "#fbbf24";
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(5, 55, 48, 55, 0.15, 0, Math.PI);
      ctx.fill();
      ctx.stroke();

      // Left peel strip peeling down
      ctx.fillStyle = "#facc15";
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(-25, -65 + peel * 25);
      ctx.quadraticCurveTo(-45 - peel * 65, peelY - 30, -50 - peel * 70, peelY + 20);
      ctx.quadraticCurveTo(-35 - peel * 40, peelY - 10, -20, 45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right peel strip peeling down
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.moveTo(25, -65 + peel * 25);
      ctx.quadraticCurveTo(45 + peel * 65, peelY - 30, 50 + peel * 70, peelY + 20);
      ctx.quadraticCurveTo(35 + peel * 40, peelY - 10, 20, 45);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Unpeeled top cap before full peel
      if (peel < 0.3) {
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.moveTo(-35, -50);
        ctx.quadraticCurveTo(0, -95, 0, -115);
        ctx.quadraticCurveTo(5, -95, 35, -50);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      // Top stem
      ctx.fillStyle = "#65a30d";
      ctx.strokeStyle = "#3f6212";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.rect(-6, -125, 12, 18);
      ctx.fill();
      ctx.stroke();

      // Banana tip at bottom
      ctx.fillStyle = "#78350f";
      ctx.beginPath();
      ctx.arc(10, 105, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      drawSparkle(ctx, 160, 140, (t * 4) % 1);
      drawSparkle(ctx, 320, 150, ((t + 0.5) * 4) % 1);
      drawActionBadge(ctx, "🍌 Action: Peel the banana");
    },

    crack_egg: function (ctx, t) {
      ctx.fillStyle = "#f0f9ff";
      ctx.fillRect(0, 0, 480, 360);

      // Frying pan in background
      ctx.fillStyle = "#1e293b";
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(240, 260, 140, 55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Pan inner rim
      ctx.fillStyle = "#334155";
      ctx.beginPath();
      ctx.ellipse(240, 258, 125, 45, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pan handle
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.roundRect(360, 250, 90, 16, 8);
      ctx.fill();

      if (t < 0.35) {
        var tapY = 140 + Math.sin(t * Math.PI * 6) * 12;
        drawWholeEgg(ctx, 240, tapY, t > 0.25);
      } else {
        var split = Math.min(1, (t - 0.35) / 0.35);
        var shellDist = split * 45;
        var shellAngle = split * 0.4;

        ctx.save();
        ctx.translate(240 - shellDist, 140 - split * 10);
        ctx.rotate(-shellAngle);
        drawHalfEgg(ctx, "left");
        ctx.restore();

        ctx.save();
        ctx.translate(240 + shellDist, 140 - split * 10);
        ctx.rotate(shellAngle);
        drawHalfEgg(ctx, "right");
        ctx.restore();

        var dropProgress = Math.min(1, (t - 0.35) / 0.5);
        var yolkY = 150 + dropProgress * 95;

        // Egg white
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        ctx.strokeStyle = "rgba(226, 232, 240, 0.9)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(240, yolkY, 32 + dropProgress * 15, 20 + dropProgress * 10, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Yolk
        ctx.fillStyle = "#f59e0b";
        ctx.strokeStyle = "#d97706";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(240, yolkY, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#fef3c7";
        ctx.beginPath();
        ctx.arc(234, yolkY - 6, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      drawActionBadge(ctx, "🍳 Action: Crack an egg");
    },

    pour_water: function (ctx, t) {
      ctx.fillStyle = "#f0fdf4";
      ctx.fillRect(0, 0, 480, 360);

      // Table
      ctx.fillStyle = "#e2e8f0";
      ctx.fillRect(0, 280, 480, 80);
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 280);
      ctx.lineTo(480, 280);
      ctx.stroke();

      var glassX = 260, glassY = 160, glassW = 80, glassH = 120;
      var waterFill = Math.min(1, Math.max(0, (t - 0.1) * 1.2));
      var currentWaterH = waterFill * 90;

      if (currentWaterH > 0) {
        ctx.fillStyle = "rgba(56, 189, 248, 0.65)";
        ctx.fillRect(glassX + 6, glassY + glassH - currentWaterH, glassW - 12, currentWaterH);

        ctx.fillStyle = "rgba(14, 165, 233, 0.8)";
        ctx.beginPath();
        ctx.ellipse(glassX + glassW / 2, glassY + glassH - currentWaterH, (glassW - 12) / 2, 6, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.strokeStyle = "rgba(100, 116, 139, 0.5)";
      ctx.lineWidth = 4;
      ctx.strokeRect(glassX, glassY, glassW, glassH);

      ctx.save();
      ctx.translate(140, 110);
      ctx.rotate(-0.45);

      ctx.fillStyle = "#38bdf8";
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(-40, -50, 80, 100, 16);
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(35, -40);
      ctx.lineTo(65, -30);
      ctx.lineTo(40, -10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(-42, 0, 22, Math.PI * 0.5, Math.PI * 1.5);
      ctx.stroke();
      ctx.restore();

      if (t > 0.08 && t < 0.95) {
        ctx.fillStyle = "rgba(14, 165, 233, 0.85)";
        ctx.beginPath();
        ctx.moveTo(195, 105);
        ctx.quadraticCurveTo(240, 130, glassX + glassW / 2 - 4, glassY + glassH - currentWaterH);
        ctx.lineTo(glassX + glassW / 2 + 6, glassY + glassH - currentWaterH);
        ctx.quadraticCurveTo(250, 130, 205, 115);
        ctx.closePath();
        ctx.fill();
      }

      drawActionBadge(ctx, "💧 Action: Pour the water");
    },

    chop_carrot: function (ctx, t) {
      ctx.fillStyle = "#fff7ed";
      ctx.fillRect(0, 0, 480, 360);

      // Wooden cutting board
      ctx.fillStyle = "#fed7aa";
      ctx.strokeStyle = "#ea580c";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(80, 180, 320, 120, 18);
      ctx.fill();
      ctx.stroke();

      // Carrot
      ctx.fillStyle = "#f97316";
      ctx.strokeStyle = "#c2410c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(140, 220);
      ctx.lineTo(260, 225);
      ctx.lineTo(260, 245);
      ctx.lineTo(140, 240);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Greens
      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.moveTo(140, 230);
      ctx.lineTo(105, 215);
      ctx.lineTo(115, 230);
      ctx.lineTo(100, 240);
      ctx.lineTo(140, 235);
      ctx.fill();

      // Slices
      var chopCount = Math.floor(t * 4);
      for (var i = 0; i < chopCount; i++) {
        ctx.fillStyle = "#fb923c";
        ctx.strokeStyle = "#c2410c";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(280 + i * 24, 235 + (i % 2) * 5, 10, 16, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Knife
      var knifeCycle = (t * 4) % 1;
      var knifeY = 160 + Math.sin(knifeCycle * Math.PI) * 45;

      ctx.save();
      ctx.translate(265, knifeY);
      ctx.fillStyle = "#e2e8f0";
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-60, 0);
      ctx.lineTo(20, 0);
      ctx.lineTo(20, 45);
      ctx.quadraticCurveTo(-20, 45, -60, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#78350f";
      ctx.strokeStyle = "#451a03";
      ctx.beginPath();
      ctx.roundRect(20, 5, 60, 18, 5);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      drawActionBadge(ctx, "🥕 Action: Chop the carrot");
    },

    squeeze_lemon: function (ctx, t) {
      ctx.fillStyle = "#fefce8";
      ctx.fillRect(0, 0, 480, 360);

      // Bowl
      ctx.fillStyle = "rgba(254, 240, 138, 0.35)";
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(240, 270, 75, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      var squeezeCycle = Math.sin(t * Math.PI * 4);
      var squish = Math.max(0, squeezeCycle) * 16;

      ctx.save();
      ctx.translate(240, 170);

      ctx.fillStyle = "#facc15";
      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(0, 0, 55 - squish * 0.7, 45 + squish * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#fef9c3";
      ctx.beginPath();
      ctx.ellipse(0, 5, 45 - squish * 0.7, 35 + squish * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      if (squish > 4) {
        ctx.fillStyle = "#facc15";
        for (var d = 0; d < 6; d++) {
          var dy = 210 + ((t * 800 + d * 35) % 80);
          var dx = 240 + Math.sin(d * 3) * (18 + squish);
          ctx.beginPath();
          ctx.ellipse(dx, dy, 4, 7, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      drawActionBadge(ctx, "🍋 Action: Squeeze the lemon");
    },

    bite_apple: function (ctx, t) {
      ctx.fillStyle = "#fff1f2";
      ctx.fillRect(0, 0, 480, 360);

      var biteOccurred = t > 0.45;

      ctx.save();
      ctx.translate(240, 190);

      ctx.fillStyle = "#ef4444";
      ctx.strokeStyle = "#b91c1c";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(0, -60);
      ctx.bezierCurveTo(45, -75, 85, -20, 75, 45);
      ctx.bezierCurveTo(65, 85, 20, 95, 0, 80);
      ctx.bezierCurveTo(-20, 95, -65, 85, -75, 45);
      ctx.bezierCurveTo(-85, -20, -45, -75, 0, -60);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      if (biteOccurred) {
        ctx.fillStyle = "#fff1f2";
        ctx.beginPath();
        ctx.arc(60, 5, 32, Math.PI * 0.5, Math.PI * 1.5, true);
        ctx.fill();

        ctx.fillStyle = "#fef9c3";
        ctx.strokeStyle = "#e2e8f0";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(48, 5, 24, Math.PI * 0.5, Math.PI * 1.5, true);
        ctx.fill();
        ctx.stroke();
      }

      ctx.strokeStyle = "#78350f";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(0, -60);
      ctx.quadraticCurveTo(8, -85, 15, -95);
      ctx.stroke();

      ctx.fillStyle = "#22c55e";
      ctx.strokeStyle = "#15803d";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(8, -75);
      ctx.quadraticCurveTo(45, -95, 40, -65);
      ctx.quadraticCurveTo(20, -65, 8, -75);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      drawActionBadge(ctx, "🍎 Action: Bite an apple");
    },

    brush_teeth: function (ctx, t) {
      ctx.fillStyle = "#ecfeff";
      ctx.fillRect(0, 0, 480, 360);

      // Lips
      ctx.fillStyle = "#fda4af";
      ctx.strokeStyle = "#e11d48";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(240, 200, 130, 75, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#881337";
      ctx.beginPath();
      ctx.ellipse(240, 205, 110, 50, 0, 0, Math.PI * 2);
      ctx.fill();

      // Teeth
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 2.5;

      for (var i = 0; i < 7; i++) {
        ctx.beginPath();
        ctx.roundRect(165 + i * 22, 175, 20, 25, [3, 3, 8, 8]);
        ctx.fill();
        ctx.stroke();
      }
      for (var j = 0; j < 7; j++) {
        ctx.beginPath();
        ctx.roundRect(165 + j * 22, 210, 20, 25, [8, 8, 3, 3]);
        ctx.fill();
        ctx.stroke();
      }

      var brushX = 240 + Math.sin(t * Math.PI * 6) * 65;
      ctx.save();
      ctx.translate(brushX, 195);
      ctx.fillStyle = "#38bdf8";
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-35, -18, 70, 20, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#a855f7";
      ctx.strokeStyle = "#7e22ce";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(30, -10, 150, 18, 8);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      drawActionBadge(ctx, "🪥 Action: Brush the teeth");
    },

    blow_candle: function (ctx, t) {
      ctx.fillStyle = "#1e1b4b";
      ctx.fillRect(0, 0, 480, 360);

      var isBlown = t > 0.45;

      if (!isBlown) {
        var glow = ctx.createRadialGradient(240, 170, 10, 240, 170, 130);
        glow.addColorStop(0, "rgba(251, 191, 36, 0.45)");
        glow.addColorStop(1, "rgba(251, 191, 36, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(240, 170, 130, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = "#f43f5e";
      ctx.beginPath();
      ctx.roundRect(220, 200, 40, 100, [6, 6, 2, 2]);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      for (var s = 0; s < 3; s++) {
        ctx.fillRect(220, 220 + s * 26, 40, 10);
      }

      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(240, 200);
      ctx.lineTo(240, 182);
      ctx.stroke();

      if (!isBlown) {
        var flicker = Math.sin(t * 40) * 3;
        ctx.save();
        ctx.translate(240, 165);
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.moveTo(0, -25 + flicker);
        ctx.quadraticCurveTo(14, 0, 0, 12);
        ctx.quadraticCurveTo(-14, 0, 0, -25 + flicker);
        ctx.fill();

        ctx.fillStyle = "#fef08a";
        ctx.beginPath();
        ctx.moveTo(0, -15 + flicker);
        ctx.quadraticCurveTo(7, 2, 0, 8);
        ctx.quadraticCurveTo(-7, 2, 0, -15 + flicker);
        ctx.fill();
        ctx.restore();
      } else {
        var smokeT = (t - 0.45) * 2;
        ctx.strokeStyle = "rgba(203, 213, 225, 0.7)";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(240, 180);
        ctx.bezierCurveTo(
          230 + Math.sin(smokeT * 6) * 25, 150 - smokeT * 30,
          250 + Math.cos(smokeT * 8) * 35, 120 - smokeT * 50,
          235, 80 - smokeT * 60
        );
        ctx.stroke();
      }

      drawActionBadge(ctx, "🕯️ Action: Blow out the candle");
    }
  };

  function drawSparkle(ctx, x, y, progress) {
    var size = 10 * Math.sin(progress * Math.PI);
    if (size <= 0) return;
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size * 0.3, y - size * 0.3);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + size * 0.3, y + size * 0.3);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size * 0.3, y + size * 0.3);
    ctx.lineTo(x - size, y);
    ctx.lineTo(x - size * 0.3, y - size * 0.3);
    ctx.closePath();
    ctx.fill();
  }

  function drawActionBadge(ctx, text) {
    ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
    ctx.beginPath();
    ctx.roundRect(14, 14, 240, 36, 18);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(text, 26, 37);
  }

  function drawWholeEgg(ctx, x, y, cracked) {
    ctx.fillStyle = "#ffedd5";
    ctx.strokeStyle = "#fb923c";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(x, y, 42, 58, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (cracked) {
      ctx.strokeStyle = "#c2410c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x - 20, y);
      ctx.lineTo(x - 5, y - 8);
      ctx.lineTo(x + 5, y + 8);
      ctx.lineTo(x + 20, y - 2);
      ctx.stroke();
    }
  }

  function drawHalfEgg(ctx, side) {
    ctx.fillStyle = "#ffedd5";
    ctx.strokeStyle = "#fb923c";
    ctx.lineWidth = 4;
    ctx.beginPath();
    if (side === "left") {
      ctx.arc(0, 0, 38, Math.PI * 0.5, Math.PI * 1.5);
      ctx.lineTo(5, -15);
      ctx.lineTo(-5, 0);
      ctx.lineTo(5, 15);
    } else {
      ctx.arc(0, 0, 38, Math.PI * 1.5, Math.PI * 0.5);
      ctx.lineTo(-5, 15);
      ctx.lineTo(5, 0);
      ctx.lineTo(-5, -15);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // =========================================================================
  // DOM References
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
  var replayBtnEl = document.getElementById("wit-replay-btn");

  // =========================================================================
  // Render Current Question
  // =========================================================================
  function renderQuestion() {
    state.isAnswered = false;
    if (state.animFrameId) {
      cancelAnimationFrame(state.animFrameId);
      state.animFrameId = null;
    }

    feedbackBoxEl.classList.remove("is-visible");
    feedbackBoxEl.classList.remove("wit-fb-correct");
    feedbackBoxEl.classList.remove("wit-fb-wrong");

    var list = state.filteredList;
    if (!list.length) return;
    if (state.currentIndex >= list.length) state.currentIndex = 0;

    var item = list[state.currentIndex];

    // Header & Progress
    if (categoryTagEl) categoryTagEl.textContent = item.category || "Video Quiz";
    if (qCountEl) qCountEl.textContent = (state.currentIndex + 1) + " / " + list.length;
    if (progressBarFillEl) {
      var pct = Math.round(((state.currentIndex + 1) / list.length) * 100);
      progressBarFillEl.style.width = pct + "%";
    }

    // Question Prompt
    if (questionTitleEl) questionTitleEl.textContent = item.question || "What is this?";

    // Render 2D Animated Clip Stage
    renderVideoStage(item);

    // Render 4 Options
    renderOptions(item);

    // Mascot Message
    if (floBubbleEl) {
      floBubbleEl.innerHTML = "<b>Flo says:</b> Watch the 2D animated clip above. What action is this in English?";
    }
  }

  function renderVideoStage(item) {
    if (!stageEl) return;
    stageEl.innerHTML = "";

    if (item.videoType === "anim_stream" && ACTION_RENDERERS[item.actionKey]) {
      // Create Canvas that feeds real-time 60fps 2D animated stream into <video>
      var canvas = document.createElement("canvas");
      canvas.width = 480;
      canvas.height = 360;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.objectFit = "contain";
      canvas.style.display = "block";
      stageEl.appendChild(canvas);

      var ctx = canvas.getContext("2d");
      var durationMs = 2600; // 2.6s per loop
      state.animStartTime = performance.now();

      function loop(now) {
        var elapsed = now - state.animStartTime;
        var rate = state.slowMotion ? 0.65 : 1.0;
        var t = ((elapsed * rate) % durationMs) / durationMs;

        ACTION_RENDERERS[item.actionKey](ctx, t);
        state.animFrameId = requestAnimationFrame(loop);
      }

      state.animFrameId = requestAnimationFrame(loop);

    } else if (item.videoType === "youtube") {
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
      playSuccessChime();
      state.streak += 1;
      state.xp += 10;
      localStorage.setItem("wit_streak", state.streak.toString());
      localStorage.setItem("wit_xp", state.xp.toString());
      updateStatsUI();

      feedbackBoxEl.className = "wit-feedback-box is-visible wit-fb-correct";
      fbStatusEl.innerHTML = '<span style="color:#059669;">✓ Spot on! Correct (+10 XP)</span>';
      fbWordEl.textContent = item.word || item.options[item.correctIndex];
      fbIpaEl.textContent = item.ipa || "";
      fbDescEl.textContent = item.definition || "";
      fbExampleEl.textContent = "“" + (item.example || "") + "”";

      if (floBubbleEl) {
        floBubbleEl.innerHTML = "<b>Flo cheers:</b> Spot on! You recognized that 2D animated action immediately!";
      }

      speak((item.word || item.options[item.correctIndex]) + ". " + (item.example || ""));

    } else {
      playWrongBoop();
      state.streak = 0;
      localStorage.setItem("wit_streak", "0");
      updateStatsUI();

      feedbackBoxEl.className = "wit-feedback-box is-visible wit-fb-wrong";
      fbStatusEl.innerHTML = '<span style="color:#dc2626;">✗ Not quite! Here is the correct answer:</span>';
      fbWordEl.textContent = item.word || item.options[item.correctIndex];
      fbIpaEl.textContent = item.ipa || "";
      fbDescEl.textContent = (item.tip ? item.tip + " " : "") + (item.definition || "");
      fbExampleEl.textContent = "“" + (item.example || "") + "”";

      if (floBubbleEl) {
        floBubbleEl.innerHTML = "<b>Flo encourages you:</b> Good try! Watch the clip once more and listen to the phrase.";
      }

      speak(item.word || item.options[item.correctIndex]);
    }
  }

  function updateStatsUI() {
    if (streakNumEl) streakNumEl.textContent = state.streak;
    if (xpNumEl) xpNumEl.textContent = state.xp;
  }

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

  if (fbSpeakBtnEl) {
    fbSpeakBtnEl.addEventListener("click", function () {
      var item = state.filteredList[state.currentIndex];
      if (item) speak((item.word || item.options[item.correctIndex]) + ". " + (item.example || ""));
    });
  }

  if (questionSpeakBtnEl) {
    questionSpeakBtnEl.addEventListener("click", function () {
      speak("What is this? Choose the correct English phrase below.");
    });
  }

  // Speed Toggle
  if (speedBtnEl) {
    speedBtnEl.addEventListener("click", function () {
      state.slowMotion = !state.slowMotion;
      speedBtnEl.textContent = state.slowMotion ? "⚡ 0.65x Slow-Mo" : "⚡ 1x Normal";
      var vid = document.getElementById("wit-active-video");
      if (vid) vid.playbackRate = state.slowMotion ? 0.65 : 1.0;
    });
  }

  // Replay
  if (replayBtnEl) {
    replayBtnEl.addEventListener("click", function () {
      state.animStartTime = performance.now();
      var vid = document.getElementById("wit-active-video");
      if (vid) {
        vid.currentTime = 0;
        vid.play();
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

  // Keyboard navigation
  document.addEventListener("keydown", function (e) {
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;

    if (!state.isAnswered) {
      if (e.key === "1" || e.key.toLowerCase() === "a") selectByIndex(0);
      else if (e.key === "2" || e.key.toLowerCase() === "b") selectByIndex(1);
      else if (e.key === "3" || e.key.toLowerCase() === "c") selectByIndex(2);
      else if (e.key === "4" || e.key.toLowerCase() === "d") selectByIndex(3);
    } else {
      if (e.key === " " || e.key === "Enter" || e.key === "ArrowRight") {
        e.preventDefault();
        nextQuestion();
      }
    }
  });

  function selectByIndex(idx) {
    var item = state.filteredList[state.currentIndex];
    if (item && item.options[idx]) handleOptionClick(idx, item);
  }

  // Google Flow / Custom Video Loader
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
        title: "Your 2D Animated Clip",
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
        definition: "Your custom 2D animated video loaded from Google Flow into English Flow!",
        example: "Practicing custom 2D animated actions for English learners.",
        tip: "Google Flow video animation loaded live!"
      };

      WHAT_IS_THIS_DATA.unshift(customItem);
      state.filteredList = WHAT_IS_THIS_DATA.slice();
      state.currentIndex = 0;
      renderQuestion();
      alert("✨ Success! Your 2D video animation is now loaded into the video quiz arena!");
    });
  }

  if (typeof window !== "undefined") {
    window.WHAT_IS_THIS_DATA = WHAT_IS_THIS_DATA;
  }

  updateStatsUI();
  renderQuestion();
})();
