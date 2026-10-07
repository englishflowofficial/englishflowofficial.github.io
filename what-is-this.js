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
      id: "tick-clock",
      category: "Everyday Objects",
      title: "2D Animation — Timepiece",
      actionKey: "tick_clock",
      videoType: "anim_stream",
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
      id: "bloom-flower",
      category: "Nature & Outdoors",
      title: "2D Animation — Petals Opening",
      actionKey: "bloom_flower",
      videoType: "anim_stream",
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
      id: "wash-hands",
      category: "Everyday Habits",
      title: "2D Animation — Hygiene Care",
      actionKey: "wash_hands",
      videoType: "anim_stream",
      question: "What is this?",
      options: [
        "Wash the hands",
        "Dry the towels",
        "Paint the fingers",
        "Put on gloves"
      ],
      correctIndex: 0,
      word: "Wash the hands",
      ipa: "/wɒʃ ðə hændz/",
      definition: "To clean one's hands with running water and soap to remove dirt and germs.",
      example: "Always wash your hands thoroughly with soap before eating or preparing meals.",
      tip: "Health tip: Lather with soap for at least 20 seconds before rinsing."
    },
    {
      id: "tie-shoelace",
      category: "Everyday Habits",
      title: "2D Animation — Getting Ready",
      actionKey: "tie_shoelace",
      videoType: "anim_stream",
      question: "What is this?",
      options: [
        "Tie the shoelace",
        "Polish the shoes",
        "Cut the string",
        "Zip the jacket"
      ],
      correctIndex: 0,
      word: "Tie the shoelace",
      ipa: "/taɪ ðə ˈʃuː.leɪs/",
      definition: "To fasten shoes securely by looping, crossing, and tightening their laces.",
      example: "He stopped on the sidewalk to tie his loose shoelace before jogging.",
      tip: "You can say 'tie your shoes' or 'tie your shoelaces' interchangeably."
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
      // 16:9 Studio Background
      var bg = ctx.createLinearGradient(0, 0, 0, 540);
      bg.addColorStop(0, "#f8fafc");
      bg.addColorStop(0.7, "#f1f5f9");
      bg.addColorStop(1, "#e2e8f0");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 960, 540);

      // Warm wooden countertop
      var table = ctx.createLinearGradient(0, 440, 0, 540);
      table.addColorStop(0, "#ebd5bd");
      table.addColorStop(1, "#cfb193");
      ctx.fillStyle = table;
      ctx.fillRect(0, 440, 960, 100);
      ctx.strokeStyle = "rgba(0,0,0,0.08)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 440);
      ctx.lineTo(960, 440);
      ctx.stroke();

      // Soft contact shadow
      ctx.fillStyle = "rgba(15, 23, 42, 0.08)";
      ctx.beginPath();
      ctx.ellipse(480, 455, 130, 22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Animation timeline (0 to 1)
      var peel = Math.min(1, Math.max(0, (t - 0.12) / 0.68));

      ctx.save();
      // Exposed inner edible banana fruit
      ctx.fillStyle = "#fffef2";
      ctx.strokeStyle = "#e9dfb9";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(460, 410);
      ctx.bezierCurveTo(442, 330, 445, 230, 474, 160);
      ctx.bezierCurveTo(488, 142, 508, 145, 514, 165);
      ctx.bezierCurveTo(526, 235, 524, 335, 502, 410);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Delicate natural banana fruit fibers
      ctx.strokeStyle = "#efe3ba";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(482, 175);
      ctx.quadraticCurveTo(476, 270, 480, 395);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(498, 178);
      ctx.quadraticCurveTo(502, 270, 496, 395);
      ctx.stroke();

      // Lower unpeeled banana body (firmly held)
      ctx.fillStyle = "#fbbf24";
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(446, 340);
      ctx.bezierCurveTo(438, 410, 452, 460, 480, 465);
      ctx.bezierCurveTo(508, 460, 522, 410, 516, 340);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Lower banana tip
      ctx.fillStyle = "#78350f";
      ctx.beginPath();
      ctx.arc(480, 464, 7, 0, Math.PI * 2);
      ctx.fill();

      // Peeling Ribbons
      var peelY = 160 + peel * 190;
      var peelLeftX = 460 - peel * 115;
      var peelRightX = 510 + peel * 115;

      // Left peel ribbon (outer yellow, inner cream)
      ctx.fillStyle = "#facc15";
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(470, 165 + peel * 40);
      ctx.bezierCurveTo(peelLeftX - 30, peelY - 35, peelLeftX - 20, peelY + 50, peelLeftX + 35, peelY + 70);
      ctx.bezierCurveTo(peelLeftX + 15, peelY + 20, 454, peelY - 10, 448, 340);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right peel ribbon
      ctx.fillStyle = "#f59e0b";
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(505, 165 + peel * 40);
      ctx.bezierCurveTo(peelRightX + 30, peelY - 35, peelRightX + 20, peelY + 50, peelRightX - 35, peelY + 70);
      ctx.bezierCurveTo(peelRightX - 15, peelY + 20, 510, peelY - 10, 514, 340);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Front central peel ribbon (pulling down towards viewer)
      ctx.fillStyle = "#fcd34d";
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(482, 165 + peel * 30);
      ctx.bezierCurveTo(460, peelY, 465, peelY + 65, 480, peelY + 80);
      ctx.bezierCurveTo(495, peelY + 65, 500, peelY, 498, 165 + peel * 30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Banana top stem before/during peel
      var stemX = 490 + (1 - peel) * 5;
      var stemY = 135 + peel * 45;
      ctx.fillStyle = "#65a30d";
      ctx.strokeStyle = "#365314";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(stemX - 8, stemY - 18, 16, 24, 4);
      ctx.fill();
      ctx.stroke();

      // Left holding hand (realistic cartoon hand holding lower banana)
      ctx.fillStyle = "#fed7aa";
      ctx.strokeStyle = "#ea580c";
      ctx.lineWidth = 3;
      // Palm / sleeve base
      ctx.beginPath();
      ctx.roundRect(380, 400, 75, 48, 14);
      ctx.fill();
      ctx.stroke();
      // Fingers gripping around
      for (var f = 0; f < 3; f++) {
        ctx.beginPath();
        ctx.roundRect(436, 375 + f * 19, 42, 17, 8);
        ctx.fill();
        ctx.stroke();
      }
      // Thumb in front
      ctx.beginPath();
      ctx.roundRect(430, 415, 34, 18, 9);
      ctx.fill();
      ctx.stroke();

      // Right peeling hand (pinching top and moving downward)
      var handRy = 120 + peel * 175;
      var handRx = 515 + (1 - peel) * 20;
      ctx.save();
      ctx.translate(handRx, handRy);
      ctx.fillStyle = "#fed7aa";
      ctx.strokeStyle = "#ea580c";
      ctx.lineWidth = 3;
      // Index finger pulling
      ctx.beginPath();
      ctx.roundRect(-10, -5, 38, 16, 8);
      ctx.fill();
      ctx.stroke();
      // Thumb pinching
      ctx.beginPath();
      ctx.roundRect(-14, 8, 34, 16, 8);
      ctx.fill();
      ctx.stroke();
      // Knuckles
      ctx.beginPath();
      ctx.roundRect(14, -12, 45, 42, 10);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      ctx.restore();

      // Completion sparkles
      if (peel > 0.85) {
        drawSparkle(ctx, 420, 210, ((t * 3) % 1));
        drawSparkle(ctx, 550, 230, (((t + 0.4) * 3) % 1));
      }

      // Neutral scene badge — ZERO SPOILERS!
      drawSceneBadge(ctx, "● ROUND 1 · WATCH & GUESS");
    },

    crack_egg: function (ctx, t) {
      // 16:9 Studio Background
      var bg = ctx.createLinearGradient(0, 0, 0, 540);
      bg.addColorStop(0, "#f1f5f9");
      bg.addColorStop(0.7, "#e2e8f0");
      bg.addColorStop(1, "#cbd5e1");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 960, 540);

      // Cooktop surface
      var stove = ctx.createLinearGradient(0, 420, 0, 540);
      stove.addColorStop(0, "#334155");
      stove.addColorStop(1, "#1e293b");
      ctx.fillStyle = stove;
      ctx.fillRect(0, 420, 960, 120);

      // Cast iron skillet
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(480, 390, 260, 85, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Skillet inner cooking surface
      ctx.fillStyle = "#1e293b";
      ctx.beginPath();
      ctx.ellipse(480, 385, 235, 70, 0, 0, Math.PI * 2);
      ctx.fill();

      // Skillet handle
      ctx.fillStyle = "#0f172a";
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(700, 375, 170, 28, 12);
      ctx.fill();
      ctx.stroke();

      var eggT = t;
      if (eggT < 0.32) {
        // Hands bringing egg down to tap pan rim
        var tapSin = Math.sin(eggT * Math.PI * 8);
        var eggY = 220 + (eggT > 0.2 ? tapSin * 25 : 0);
        var isCracked = eggT > 0.22;

        // Two hands holding egg
        // Left hand
        ctx.fillStyle = "#fed7aa";
        ctx.strokeStyle = "#ea580c";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(360, eggY - 30, 75, 45, 14);
        ctx.fill();
        ctx.stroke();

        // Right hand
        ctx.beginPath();
        ctx.roundRect(525, eggY - 30, 75, 45, 14);
        ctx.fill();
        ctx.stroke();

        // Whole egg
        ctx.fillStyle = "#fed7aa";
        ctx.strokeStyle = "#fb923c";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.ellipse(480, eggY, 48, 66, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Egg highlight
        ctx.fillStyle = "#fff7ed";
        ctx.beginPath();
        ctx.ellipse(465, eggY - 18, 14, 25, -0.2, 0, Math.PI * 2);
        ctx.fill();

        if (isCracked) {
          // Fracture zigzag
          ctx.strokeStyle = "#c2410c";
          ctx.lineWidth = 3.5;
          ctx.beginPath();
          ctx.moveTo(455, eggY);
          ctx.lineTo(470, eggY - 12);
          ctx.lineTo(485, eggY + 10);
          ctx.lineTo(505, eggY - 4);
          ctx.stroke();
        }
      } else {
        // Shells separating and yolk dropping
        var split = Math.min(1, (eggT - 0.32) / 0.35);
        var shellDist = split * 95;
        var shellAngle = split * 0.38;

        // Left shell & hand
        ctx.save();
        ctx.translate(480 - shellDist, 200 - split * 15);
        ctx.rotate(-shellAngle);
        // Hand
        ctx.fillStyle = "#fed7aa";
        ctx.strokeStyle = "#ea580c";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(-90, -30, 70, 42, 12);
        ctx.fill();
        ctx.stroke();
        // Left shell half
        ctx.fillStyle = "#fed7aa";
        ctx.strokeStyle = "#fb923c";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 46, Math.PI * 0.5, Math.PI * 1.5);
        ctx.lineTo(10, -20);
        ctx.lineTo(-5, 0);
        ctx.lineTo(10, 20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Right shell & hand
        ctx.save();
        ctx.translate(480 + shellDist, 200 - split * 15);
        ctx.rotate(shellAngle);
        // Hand
        ctx.fillStyle = "#fed7aa";
        ctx.strokeStyle = "#ea580c";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(20, -30, 70, 42, 12);
        ctx.fill();
        ctx.stroke();
        // Right shell half
        ctx.fillStyle = "#fed7aa";
        ctx.strokeStyle = "#fb923c";
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(0, 0, 46, Math.PI * 1.5, Math.PI * 0.5);
        ctx.lineTo(-10, 20);
        ctx.lineTo(5, 0);
        ctx.lineTo(-10, -20);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();

        // Egg falling & cooking in pan
        var dropT = Math.min(1, (eggT - 0.32) / 0.45);
        var yolkY = 220 + dropT * 165;
        var bounce = dropT >= 1 ? Math.sin((eggT - 0.77) * Math.PI * 12) * Math.max(0, 6 * (1 - (eggT - 0.77) * 3)) : 0;
        yolkY += bounce;

        // Spreading Egg White (albumen)
        var whiteW = 30 + dropT * 105;
        var whiteH = 20 + dropT * 45;
        ctx.fillStyle = "rgba(255, 255, 255, 0.88)";
        ctx.strokeStyle = "rgba(226, 232, 240, 0.95)";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(480, 385, whiteW, whiteH, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Sizzle bubbles
        if (dropT > 0.8) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
          for (var b = 0; b < 6; b++) {
            var bx = 480 + Math.cos(b * 1.1 + eggT * 10) * (whiteW * 0.75);
            var by = 385 + Math.sin(b * 1.1 + eggT * 10) * (whiteH * 0.75);
            ctx.beginPath();
            ctx.arc(bx, by, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Egg Yolk
        var yolkR = 26;
        var yolkGrad = ctx.createRadialGradient(474, yolkY - 6, 4, 480, yolkY, yolkR);
        yolkGrad.addColorStop(0, "#fde047");
        yolkGrad.addColorStop(0.5, "#f59e0b");
        yolkGrad.addColorStop(1, "#d97706");
        ctx.fillStyle = yolkGrad;
        ctx.strokeStyle = "#b45309";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(480, yolkY, yolkR, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Yolk specular 3D gloss shine
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.ellipse(472, yolkY - 10, 7, 4, -0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // Neutral scene badge — ZERO SPOILERS!
      drawSceneBadge(ctx, "● ROUND 2 · WATCH & GUESS");
    },

    pour_water: function (ctx, t) {
      // 16:9 Studio Background
      var bg = ctx.createLinearGradient(0, 0, 0, 540);
      bg.addColorStop(0, "#f0fdf4");
      bg.addColorStop(0.7, "#e2e8f0");
      bg.addColorStop(1, "#cbd5e1");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 960, 540);

      // Wooden dining table
      var table = ctx.createLinearGradient(0, 400, 0, 540);
      table.addColorStop(0, "#e2d5c3");
      table.addColorStop(1, "#c5b29b");
      ctx.fillStyle = table;
      ctx.fillRect(0, 400, 960, 140);
      ctx.strokeStyle = "rgba(0,0,0,0.06)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 400);
      ctx.lineTo(960, 400);
      ctx.stroke();

      // Glass Tumbler
      var gx = 560, gy = 230, gw = 120, gh = 180;
      // Tumbler shadow
      ctx.fillStyle = "rgba(15, 23, 42, 0.08)";
      ctx.beginPath();
      ctx.ellipse(gx + gw / 2, gy + gh + 4, gw * 0.55, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Pouring timeline (0 to 1)
      var fillProgress = Math.min(1, Math.max(0, (t - 0.15) * 1.35));
      var waterH = fillProgress * (gh - 35);

      // Water inside the glass
      if (waterH > 2) {
        ctx.fillStyle = "rgba(56, 189, 248, 0.7)";
        ctx.beginPath();
        ctx.roundRect(gx + 8, gy + gh - waterH, gw - 16, waterH - 6, [0, 0, 8, 8]);
        ctx.fill();

        // Water surface meniscus
        var wave = Math.sin(t * Math.PI * 12) * 2;
        ctx.fillStyle = "rgba(14, 165, 233, 0.9)";
        ctx.beginPath();
        ctx.ellipse(gx + gw / 2, gy + gh - waterH + wave, (gw - 16) / 2, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        // Effervescent rising bubbles
        ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
        for (var b = 0; b < 5; b++) {
          var bx = gx + 20 + ((b * 22 + t * 90) % (gw - 40));
          var by = (gy + gh - 10) - ((t * 180 + b * 35) % waterH);
          ctx.beginPath();
          ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Glass tumbler walls & rim reflections
      ctx.strokeStyle = "rgba(148, 163, 184, 0.8)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(gx, gy, gw, gh, [4, 4, 12, 12]);
      ctx.stroke();

      // Specular glass shine stripe
      ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
      ctx.fillRect(gx + 12, gy + 15, 10, gh - 30);

      // Pitcher / Carafe on left
      var tilt = 0;
      if (t > 0.1 && t < 0.85) {
        tilt = -0.65 * Math.sin(((t - 0.1) / 0.75) * Math.PI);
      }

      ctx.save();
      ctx.translate(340, 220);
      ctx.rotate(tilt);

      // Pitcher body
      ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
      ctx.strokeStyle = "#0284c7";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(-70, -90, 140, 170, 24);
      ctx.fill();
      ctx.stroke();

      // Water remaining in pitcher
      ctx.fillStyle = "rgba(14, 165, 233, 0.55)";
      ctx.beginPath();
      ctx.roundRect(-64, -20, 128, 92, [0, 0, 18, 18]);
      ctx.fill();

      // Pitcher pouring spout
      ctx.beginPath();
      ctx.moveTo(60, -75);
      ctx.lineTo(105, -55);
      ctx.lineTo(65, -25);
      ctx.closePath();
      ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
      ctx.fill();
      ctx.stroke();

      // Pitcher handle
      ctx.lineWidth = 8;
      ctx.strokeStyle = "#0284c7";
      ctx.beginPath();
      ctx.arc(-72, 0, 36, Math.PI * 0.5, Math.PI * 1.5);
      ctx.stroke();

      // Hand holding pitcher handle
      ctx.fillStyle = "#fed7aa";
      ctx.strokeStyle = "#ea580c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(-125, -25, 45, 50, 10);
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      // Liquid stream from spout to tumbler
      if (tilt < -0.15) {
        ctx.fillStyle = "rgba(14, 165, 233, 0.85)";
        ctx.beginPath();
        var spoutX = 340 + Math.cos(tilt) * 95 - Math.sin(tilt) * (-55);
        var spoutY = 220 + Math.sin(tilt) * 95 + Math.cos(tilt) * (-55);
        var targetY = gy + gh - waterH;
        ctx.moveTo(spoutX, spoutY);
        ctx.quadraticCurveTo(spoutX + 90, spoutY + 40, gx + gw / 2 - 8, targetY);
        ctx.lineTo(gx + gw / 2 + 8, targetY);
        ctx.quadraticCurveTo(spoutX + 105, spoutY + 50, spoutX + 12, spoutY + 12);
        ctx.closePath();
        ctx.fill();
      }

      // Neutral scene badge — ZERO SPOILERS!
      drawSceneBadge(ctx, "● ROUND 3 · WATCH & GUESS");
    },

    chop_carrot: function (ctx, t) {
      // 16:9 Studio Background
      var bg = ctx.createLinearGradient(0, 0, 0, 540);
      bg.addColorStop(0, "#fff7ed");
      bg.addColorStop(0.7, "#ffedd5");
      bg.addColorStop(1, "#fed7aa");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 960, 540);

      // Large Wooden Cutting Board
      ctx.fillStyle = "#fed7aa";
      ctx.strokeStyle = "#ea580c";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(160, 240, 640, 240, 24);
      ctx.fill();
      ctx.stroke();

      // Cutting board wood grain lines
      ctx.strokeStyle = "rgba(234, 88, 12, 0.15)";
      ctx.lineWidth = 2.5;
      for (var g = 0; g < 4; g++) {
        ctx.beginPath();
        ctx.moveTo(180, 280 + g * 45);
        ctx.lineTo(780, 280 + g * 45);
        ctx.stroke();
      }

      // Left Hand with authentic chef's "claw grip"
      ctx.fillStyle = "#fed7aa";
      ctx.strokeStyle = "#ea580c";
      ctx.lineWidth = 3;
      // Palm
      ctx.beginPath();
      ctx.roundRect(240, 310, 80, 50, 14);
      ctx.fill();
      ctx.stroke();
      // Curled fingers holding carrot
      for (var f = 0; f < 3; f++) {
        ctx.beginPath();
        ctx.roundRect(295 + f * 18, 340, 18, 32, 8);
        ctx.fill();
        ctx.stroke();
      }

      // Carrot body
      ctx.fillStyle = "#ea580c";
      ctx.strokeStyle = "#c2410c";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(270, 350);
      ctx.lineTo(500, 352);
      ctx.lineTo(500, 388);
      ctx.lineTo(270, 378);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Carrot frond greens on left
      ctx.fillStyle = "#16a34a";
      ctx.beginPath();
      ctx.moveTo(270, 360);
      ctx.lineTo(210, 335);
      ctx.lineTo(230, 360);
      ctx.lineTo(195, 375);
      ctx.lineTo(270, 370);
      ctx.closePath();
      ctx.fill();

      // Carrot sliced rounds stacking on right
      var chopProgress = t * 5;
      var numSlices = Math.floor(chopProgress);
      for (var s = 0; s < numSlices; s++) {
        ctx.fillStyle = "#f97316";
        ctx.strokeStyle = "#c2410c";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.ellipse(540 + s * 32, 372 + (s % 2) * 6, 14, 22, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Inner core ring
        ctx.fillStyle = "#fdba74";
        ctx.beginPath();
        ctx.ellipse(540 + s * 32, 372 + (s % 2) * 6, 6, 10, 0.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Chef's Knife & Chopping Motion
      var knifePhase = (chopProgress % 1);
      var knifeY = 280 + Math.sin(knifePhase * Math.PI) * 75;
      var knifeAngle = Math.sin(knifePhase * Math.PI) * -0.22;

      ctx.save();
      ctx.translate(505, knifeY);
      ctx.rotate(knifeAngle);

      // Stainless Steel Blade
      ctx.fillStyle = "#e2e8f0";
      ctx.strokeStyle = "#64748b";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-110, 0);
      ctx.lineTo(40, 0);
      ctx.lineTo(40, 70);
      ctx.quadraticCurveTo(-30, 70, -110, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Metallic blade gleam
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
      ctx.beginPath();
      ctx.moveTo(-70, 8);
      ctx.lineTo(25, 8);
      ctx.lineTo(15, 22);
      ctx.lineTo(-65, 20);
      ctx.closePath();
      ctx.fill();

      // Knife pakkawood handle
      ctx.fillStyle = "#78350f";
      ctx.strokeStyle = "#451a03";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(40, 10, 100, 26, 8);
      ctx.fill();
      ctx.stroke();

      // Right hand gripping knife handle
      ctx.fillStyle = "#fed7aa";
      ctx.strokeStyle = "#ea580c";
      ctx.beginPath();
      ctx.roundRect(55, 4, 65, 38, 10);
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      // Neutral scene badge — ZERO SPOILERS!
      drawSceneBadge(ctx, "● ROUND 4 · WATCH & GUESS");
    },

    squeeze_lemon: function (ctx, t) {
      // 16:9 Studio Background
      var bg = ctx.createLinearGradient(0, 0, 0, 540);
      bg.addColorStop(0, "#fefce8");
      bg.addColorStop(0.7, "#fef9c3");
      bg.addColorStop(1, "#fef08a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 960, 540);

      // Marble prep table
      var table = ctx.createLinearGradient(0, 420, 0, 540);
      table.addColorStop(0, "#f8fafc");
      table.addColorStop(1, "#e2e8f0");
      ctx.fillStyle = table;
      ctx.fillRect(0, 420, 960, 120);
      ctx.strokeStyle = "rgba(0,0,0,0.06)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 420);
      ctx.lineTo(960, 420);
      ctx.stroke();

      // Clear Glass Juice Bowl
      ctx.fillStyle = "rgba(254, 240, 138, 0.45)";
      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(480, 430, 130, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Squeeze compression cycle
      var squeezeCycle = Math.sin(t * Math.PI * 4);
      var squish = Math.max(0, squeezeCycle) * 25;

      ctx.save();
      ctx.translate(480, 240);

      // Lemon half (compressed by squish)
      var lemonW = 95 + squish * 0.4;
      var lemonH = 80 - squish * 0.8;

      // Outer yellow lemon skin
      ctx.fillStyle = "#facc15";
      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(0, 0, lemonW, lemonH, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // White inner pith layer
      ctx.fillStyle = "#fffbeb";
      ctx.beginPath();
      ctx.ellipse(0, 4, lemonW - 12, lemonH - 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Translucent juicy pulp core with radial segments
      ctx.fillStyle = "#fef08a";
      ctx.strokeStyle = "#fefce8";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, 6, lemonW - 22, lemonH - 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Radial wedge lines
      for (var a = 0; a < 8; a++) {
        var ang = (a * Math.PI) / 4;
        ctx.beginPath();
        ctx.moveTo(0, 6);
        ctx.lineTo(Math.cos(ang) * (lemonW - 24), 6 + Math.sin(ang) * (lemonH - 24));
        ctx.stroke();
      }

      // Hand gripping lemon from above
      ctx.fillStyle = "#fed7aa";
      ctx.strokeStyle = "#ea580c";
      ctx.lineWidth = 3.5;
      // Palm
      ctx.beginPath();
      ctx.roundRect(-75, -lemonH - 45, 150, 55, 18);
      ctx.fill();
      ctx.stroke();
      // Fingers curling around lemon
      for (var f = 0; f < 4; f++) {
        var fx = -60 + f * 38;
        ctx.beginPath();
        ctx.roundRect(fx, -lemonH - 10 + squish * 0.3, 28, 55, 12);
        ctx.fill();
        ctx.stroke();
      }

      ctx.restore();

      // Flowing juice streams and droplets
      if (squish > 5) {
        ctx.fillStyle = "#facc15";
        for (var d = 0; d < 8; d++) {
          var dy = 310 + ((t * 900 + d * 45) % 120);
          var dx = 480 + Math.sin(d * 2.3) * (25 + squish * 0.8);
          ctx.beginPath();
          ctx.ellipse(dx, dy, 5, 10, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        // Bowl ripple rings
        ctx.strokeStyle = "rgba(234, 179, 8, 0.6)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(480, 435, 35 + squish * 1.2, 10, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Neutral scene badge — ZERO SPOILERS!
      drawSceneBadge(ctx, "● ROUND 5 · WATCH & GUESS");
    },

    bite_apple: function (ctx, t) {
      // 16:9 Studio Background
      var bg = ctx.createLinearGradient(0, 0, 0, 540);
      bg.addColorStop(0, "#fff1f2");
      bg.addColorStop(0.7, "#ffe4e6");
      bg.addColorStop(1, "#fecdd3");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 960, 540);

      var biteOccurred = t > 0.36;

      ctx.save();
      ctx.translate(480, 270);

      // Whole / Bitten Apple Body
      var appleGrad = ctx.createRadialGradient(-20, -30, 20, 0, 0, 130);
      appleGrad.addColorStop(0, "#f87171");
      appleGrad.addColorStop(0.5, "#dc2626");
      appleGrad.addColorStop(1, "#991b1b");
      ctx.fillStyle = appleGrad;
      ctx.strokeStyle = "#7f1d1d";
      ctx.lineWidth = 5;

      ctx.beginPath();
      ctx.moveTo(0, -95);
      ctx.bezierCurveTo(75, -120, 140, -30, 120, 70);
      ctx.bezierCurveTo(105, 135, 30, 150, 0, 125);
      ctx.bezierCurveTo(-30, 150, -105, 135, -120, 70);
      ctx.bezierCurveTo(-140, -30, -75, -120, 0, -95);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Apple natural 3D glossy highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.beginPath();
      ctx.ellipse(-45, -35, 32, 55, -0.3, 0, Math.PI * 2);
      ctx.fill();

      // Woody apple stem
      ctx.strokeStyle = "#5a2d0c";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(0, -95);
      ctx.quadraticCurveTo(15, -135, 25, -150);
      ctx.stroke();

      // Fresh green leaf
      ctx.fillStyle = "#16a34a";
      ctx.strokeStyle = "#14532d";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(10, -120);
      ctx.quadraticCurveTo(70, -150, 65, -105);
      ctx.quadraticCurveTo(35, -105, 10, -120);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Hand holding apple from bottom
      ctx.fillStyle = "#fed7aa";
      ctx.strokeStyle = "#ea580c";
      ctx.lineWidth = 3.5;
      for (var f = 0; f < 3; f++) {
        ctx.beginPath();
        ctx.roundRect(-60 + f * 42, 105, 34, 45, 12);
        ctx.fill();
        ctx.stroke();
      }

      // Crisp Bite taken out of right shoulder
      if (biteOccurred) {
        // Cutout background
        ctx.fillStyle = "#fff1f2";
        ctx.beginPath();
        ctx.arc(95, 10, 52, Math.PI * 0.5, Math.PI * 1.5, true);
        ctx.fill();

        // Exposed juicy pale-cream apple interior flesh
        ctx.fillStyle = "#fefce8";
        ctx.strokeStyle = "#e2d9b5";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(80, 10, 42, Math.PI * 0.5, Math.PI * 1.5, true);
        ctx.fill();
        ctx.stroke();

        // Tooth bite scallops
        ctx.fillStyle = "#fffbeb";
        for (var b = 0; b < 4; b++) {
          ctx.beginPath();
          ctx.arc(48 + (b % 2) * 8, -25 + b * 22, 12, 0, Math.PI * 2);
          ctx.fill();
        }

        // Tiny brown apple seed speck near core
        ctx.fillStyle = "#451a03";
        ctx.beginPath();
        ctx.ellipse(38, 12, 4, 7, 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Flying micro-droplets on bite impact
      if (biteOccurred && t < 0.65) {
        ctx.fillStyle = "#fef08a";
        for (var j = 0; j < 6; j++) {
          var jx = 580 + Math.cos(j * 1.2) * (t - 0.36) * 160;
          var jy = 270 + Math.sin(j * 1.2) * (t - 0.36) * 160;
          ctx.beginPath();
          ctx.arc(jx, jy, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Neutral scene badge — ZERO SPOILERS!
      drawSceneBadge(ctx, "● ROUND 6 · WATCH & GUESS");
    },

    brush_teeth: function (ctx, t) {
      // 16:9 Studio Background
      var bg = ctx.createLinearGradient(0, 0, 0, 540);
      bg.addColorStop(0, "#ecfeff");
      bg.addColorStop(0.7, "#cffafe");
      bg.addColorStop(1, "#a5f3fc");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 960, 540);

      // Smiling mouth & lips
      ctx.fillStyle = "#fb7185";
      ctx.strokeStyle = "#e11d48";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(480, 270, 200, 110, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Mouth interior
      ctx.fillStyle = "#881337";
      ctx.beginPath();
      ctx.ellipse(480, 275, 175, 75, 0, 0, Math.PI * 2);
      ctx.fill();

      // Upper & Lower Dental Arches (Teeth)
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 3;

      // Upper teeth (8 teeth)
      for (var u = 0; u < 8; u++) {
        ctx.beginPath();
        ctx.roundRect(365 + u * 29, 230, 27, 36, [4, 4, 10, 10]);
        ctx.fill();
        ctx.stroke();
      }
      // Lower teeth (8 teeth)
      for (var l = 0; l < 8; l++) {
        ctx.beginPath();
        ctx.roundRect(365 + l * 29, 280, 27, 36, [10, 10, 4, 4]);
        ctx.fill();
        ctx.stroke();
      }

      // Toothbrush Scrubbing Motion
      var scrubCycle = Math.sin(t * Math.PI * 8);
      var brushX = 480 + scrubCycle * 95;
      var brushY = 270 + Math.sin(t * Math.PI * 16) * 12;

      ctx.save();
      ctx.translate(brushX, brushY);

      // Brush head bristles
      ctx.fillStyle = "#f8fafc";
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.roundRect(-45, -26, 90, 26, 6);
      ctx.fill();
      ctx.stroke();

      // Bristle texture lines
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1.5;
      for (var br = 0; br < 7; br++) {
        ctx.beginPath();
        ctx.moveTo(-35 + br * 11, -26);
        ctx.lineTo(-35 + br * 11, 0);
        ctx.stroke();
      }

      // Mint toothpaste dollop
      ctx.fillStyle = "#38bdf8";
      ctx.beginPath();
      ctx.roundRect(-30, -34, 60, 12, 6);
      ctx.fill();

      // Ergonomic colorful toothbrush neck & handle
      ctx.fillStyle = "#0284c7";
      ctx.strokeStyle = "#0369a1";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(40, -14, 210, 24, 10);
      ctx.fill();
      ctx.stroke();

      // Hand holding handle
      ctx.fillStyle = "#fed7aa";
      ctx.strokeStyle = "#ea580c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(110, -22, 95, 42, 12);
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      // Foamy Toothpaste Bubbles around teeth
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      for (var fb = 0; fb < 10; fb++) {
        var fbx = 400 + ((fb * 34 + t * 140) % 170);
        var fby = 245 + Math.sin(fb * 2.1 + t * 10) * 35;
        ctx.beginPath();
        ctx.arc(fbx, fby, 7 + (fb % 5), 0, Math.PI * 2);
        ctx.fill();
      }

      // Sparkling enamel shines
      drawSparkle(ctx, 390, 245, (t * 3) % 1);
      drawSparkle(ctx, 570, 290, ((t + 0.5) * 3) % 1);

      // Neutral scene badge — ZERO SPOILERS!
      drawSceneBadge(ctx, "● ROUND 7 · WATCH & GUESS");
    },

    blow_candle: function (ctx, t) {
      // 16:9 Moody Celebration Background
      var bg = ctx.createLinearGradient(0, 0, 0, 540);
      bg.addColorStop(0, "#0f172a");
      bg.addColorStop(0.7, "#1e1b4b");
      bg.addColorStop(1, "#312e81");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 960, 540);

      var isBlown = t > 0.42;

      // Candle Glow (when burning)
      if (!isBlown) {
        var glow = ctx.createRadialGradient(480, 240, 15, 480, 240, 220);
        glow.addColorStop(0, "rgba(251, 191, 36, 0.5)");
        glow.addColorStop(0.5, "rgba(245, 158, 11, 0.2)");
        glow.addColorStop(1, "rgba(245, 158, 11, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(480, 240, 220, 0, Math.PI * 2);
        ctx.fill();
      }

      // Cupcake Base
      ctx.fillStyle = "#78350f";
      ctx.beginPath();
      ctx.moveTo(420, 470);
      ctx.lineTo(435, 400);
      ctx.lineTo(525, 400);
      ctx.lineTo(540, 470);
      ctx.closePath();
      ctx.fill();

      // Swirled Vanilla Frosting
      ctx.fillStyle = "#fef08a";
      ctx.strokeStyle = "#facc15";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(480, 395, 65, Math.PI, 0);
      ctx.fill();
      ctx.stroke();

      // Festive Striped Birthday Candle
      ctx.fillStyle = "#f43f5e";
      ctx.strokeStyle = "#e11d48";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(462, 280, 36, 120, [8, 8, 2, 2]);
      ctx.fill();
      ctx.stroke();

      // White spiral candle stripes
      ctx.fillStyle = "#ffffff";
      for (var s = 0; s < 4; s++) {
        ctx.fillRect(462, 295 + s * 26, 36, 12);
      }

      // Braided cotton wick
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(480, 280);
      ctx.lineTo(480, 252);
      ctx.stroke();

      // Candle Flame & Flickering / Wind
      if (!isBlown) {
        var flicker = Math.sin(t * 50) * 4;
        ctx.save();
        ctx.translate(480, 230);

        // Outer warm orange teardrop flame
        ctx.fillStyle = "#f59e0b";
        ctx.beginPath();
        ctx.moveTo(0, -35 + flicker);
        ctx.quadraticCurveTo(20, 2, 0, 16);
        ctx.quadraticCurveTo(-20, 2, 0, -35 + flicker);
        ctx.fill();

        // Hot bright yellow inner core
        ctx.fillStyle = "#fef08a";
        ctx.beginPath();
        ctx.moveTo(0, -22 + flicker);
        ctx.quadraticCurveTo(10, 4, 0, 12);
        ctx.quadraticCurveTo(-10, 4, 0, -22 + flicker);
        ctx.fill();

        // Blue base
        ctx.fillStyle = "rgba(56, 189, 248, 0.7)";
        ctx.beginPath();
        ctx.arc(0, 14, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      } else {
        // Breath wind blowing across
        var windT = (t - 0.42) * 2;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        ctx.lineWidth = 3;
        for (var w = 0; w < 3; w++) {
          var wy = 230 + w * 18;
          ctx.beginPath();
          ctx.moveTo(280 + windT * 120, wy);
          ctx.lineTo(440 + windT * 180, wy);
          ctx.stroke();
        }

        // Graceful rising ribbon of smoke
        var smokeProgress = Math.min(1, (t - 0.42) / 0.55);
        ctx.strokeStyle = "rgba(203, 213, 225, " + (0.75 - smokeProgress * 0.5) + ")";
        ctx.lineWidth = 5 + smokeProgress * 8;
        ctx.beginPath();
        ctx.moveTo(480, 250);
        ctx.bezierCurveTo(
          470 + Math.sin(smokeProgress * 7) * 45, 200 - smokeProgress * 60,
          500 + Math.cos(smokeProgress * 9) * 60, 140 - smokeProgress * 90,
          475, 70 - smokeProgress * 50
        );
        ctx.stroke();
      }

      // Neutral scene badge — ZERO SPOILERS!
      drawSceneBadge(ctx, "● ROUND 8 · WATCH & GUESS");
    },

    tick_clock: function (ctx, t) {
      // 16:9 Cozy Study Room Background
      var bg = ctx.createLinearGradient(0, 0, 0, 540);
      bg.addColorStop(0, "#f8fafc");
      bg.addColorStop(0.7, "#f1f5f9");
      bg.addColorStop(1, "#e2e8f0");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 960, 540);

      var cx = 480, cy = 250;

      // Swinging brass pendulum behind
      var pendAngle = Math.sin(t * Math.PI * 6) * 0.28;
      ctx.save();
      ctx.translate(cx, cy + 90);
      ctx.rotate(pendAngle);
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 150);
      ctx.stroke();
      // Brass bob
      ctx.fillStyle = "#fbbf24";
      ctx.strokeStyle = "#b45309";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 150, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      // Clock wall shadow
      ctx.fillStyle = "rgba(15, 23, 42, 0.12)";
      ctx.beginPath();
      ctx.arc(cx + 8, cy + 12, 145, 0, Math.PI * 2);
      ctx.fill();

      // Outer mahogany wood bezel
      ctx.fillStyle = "#78350f";
      ctx.strokeStyle = "#451a03";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Inner brass ring
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, 126, 0, Math.PI * 2);
      ctx.stroke();

      // Parchment white clock face
      ctx.fillStyle = "#fffef7";
      ctx.beginPath();
      ctx.arc(cx, cy, 122, 0, Math.PI * 2);
      ctx.fill();

      // 60 Tick marks & numerals
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 18px 'DM Sans', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (var hr = 1; hr <= 12; hr++) {
        var hAngle = (hr * Math.PI) / 6;
        var nx = cx + Math.sin(hAngle) * 98;
        var ny = cy - Math.cos(hAngle) * 98;
        ctx.fillText(hr.toString(), nx, ny);
      }

      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2;
      for (var m = 0; m < 60; m++) {
        var mAngle = (m * Math.PI) / 30;
        var m1x = cx + Math.sin(mAngle) * 114;
        var m1y = cy - Math.cos(mAngle) * 114;
        var m2x = cx + Math.sin(mAngle) * 120;
        var m2y = cy - Math.cos(mAngle) * 120;
        ctx.beginPath();
        ctx.moveTo(m1x, m1y);
        ctx.lineTo(m2x, m2y);
        ctx.stroke();
      }

      // Hour hand (points to ~10)
      ctx.strokeStyle = "#0f172a";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - 40, cy - 45);
      ctx.stroke();

      // Minute hand (points to ~2)
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + 65, cy - 50);
      ctx.stroke();

      // Ticking red second hand (steps crisply every loop tick)
      var secSteps = 12;
      var currentStep = Math.floor(t * secSteps);
      var secFraction = (t * secSteps) % 1;
      var secJitter = Math.sin(secFraction * Math.PI * 2) * 0.02 * Math.exp(-secFraction * 4);
      var secAngle = (currentStep / secSteps) * Math.PI * 2 + secJitter;

      ctx.strokeStyle = "#dc2626";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx - Math.sin(secAngle) * 22, cy + Math.cos(secAngle) * 22);
      ctx.lineTo(cx + Math.sin(secAngle) * 92, cy - Math.cos(secAngle) * 92);
      ctx.stroke();

      // Center cap
      ctx.fillStyle = "#dc2626";
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fill();

      // Neutral scene badge — ZERO SPOILERS!
      drawSceneBadge(ctx, "● ROUND 9 · WATCH & GUESS");
    },

    bloom_flower: function (ctx, t) {
      // 16:9 Lush Morning Garden Background
      var bg = ctx.createLinearGradient(0, 0, 0, 540);
      bg.addColorStop(0, "#ecfdf5");
      bg.addColorStop(0.6, "#d1fae5");
      bg.addColorStop(1, "#a7f3d0");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 960, 540);

      var cx = 480, cy = 250;

      // Stem rising from bottom
      ctx.strokeStyle = "#15803d";
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(cx, 480);
      ctx.quadraticCurveTo(cx - 15, 360, cx, cy + 40);
      ctx.stroke();

      // Two lush green leaves
      ctx.fillStyle = "#16a34a";
      ctx.strokeStyle = "#14532d";
      ctx.lineWidth = 3;
      // Left leaf
      ctx.beginPath();
      ctx.moveTo(cx - 8, 380);
      ctx.quadraticCurveTo(cx - 90, 360, cx - 110, 330);
      ctx.quadraticCurveTo(cx - 70, 395, cx - 8, 380);
      ctx.fill();
      ctx.stroke();
      // Right leaf
      ctx.beginPath();
      ctx.moveTo(cx + 8, 350);
      ctx.quadraticCurveTo(cx + 90, 330, cx + 110, 300);
      ctx.quadraticCurveTo(cx + 70, 365, cx + 8, 350);
      ctx.fill();
      ctx.stroke();

      // Bloom progress (0 = tight bud, 1 = fully open flower)
      var bloom = Math.min(1, Math.max(0, (t - 0.1) / 0.75));

      ctx.save();
      ctx.translate(cx, cy);

      // Flower Petals (Layered rosette unfurling outward)
      var petalCount = 8;
      var petalSpread = 30 + bloom * 85;
      var petalRadius = 25 + bloom * 65;

      for (var p = 0; p < petalCount; p++) {
        var angle = (p * Math.PI * 2) / petalCount + (t * 0.1);
        var px = Math.cos(angle) * petalSpread;
        var py = Math.sin(angle) * petalSpread;

        var petalGrad = ctx.createRadialGradient(px, py, 5, px, py, petalRadius);
        petalGrad.addColorStop(0, "#f43f5e");
        petalGrad.addColorStop(0.7, "#e11d48");
        petalGrad.addColorStop(1, "#be123c");

        ctx.fillStyle = petalGrad;
        ctx.strokeStyle = "#9f1239";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.ellipse(px, py, petalRadius * 0.85, petalRadius * 1.1, angle, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      // Golden Center Core with pollen stamens
      var coreR = 14 + bloom * 22;
      ctx.fillStyle = "#facc15";
      ctx.strokeStyle = "#d97706";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, coreR, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Stamens
      if (bloom > 0.4) {
        ctx.fillStyle = "#f59e0b";
        for (var st = 0; st < 12; st++) {
          var sa = (st * Math.PI) / 6;
          var sx = Math.cos(sa) * (coreR * 0.7);
          var sy = Math.sin(sa) * (coreR * 0.7);
          ctx.beginPath();
          ctx.arc(sx, sy, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      // Floating morning pollen dust & sparkle gleams
      if (bloom > 0.7) {
        drawSparkle(ctx, 430, 180, (t * 3) % 1);
        drawSparkle(ctx, 530, 210, ((t + 0.3) * 3) % 1);
        drawSparkle(ctx, 480, 130, ((t + 0.7) * 3) % 1);
      }

      // Neutral scene badge — ZERO SPOILERS!
      drawSceneBadge(ctx, "● ROUND 10 · WATCH & GUESS");
    },

    wash_hands: function (ctx, t) {
      // 16:9 Clean Bathroom Vanity
      var bg = ctx.createLinearGradient(0, 0, 0, 540);
      bg.addColorStop(0, "#f0fdfa");
      bg.addColorStop(0.7, "#ccfbf1");
      bg.addColorStop(1, "#99f6e4");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 960, 540);

      // Chrome faucet above
      ctx.fillStyle = "#94a3b8";
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(455, 40, 50, 90, [10, 10, 0, 0]);
      ctx.fill();
      ctx.stroke();

      // Faucet running water stream
      ctx.fillStyle = "rgba(56, 189, 248, 0.75)";
      ctx.fillRect(470, 130, 20, 260);

      // Two hands rubbing together in lather motion
      var rub = Math.sin(t * Math.PI * 8) * 20;

      ctx.save();
      ctx.translate(480, 310);

      // Left hand
      ctx.fillStyle = "#fed7aa";
      ctx.strokeStyle = "#ea580c";
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.roundRect(-75 + rub, -30, 75, 60, 16);
      ctx.fill();
      ctx.stroke();

      // Right hand interlocking
      ctx.beginPath();
      ctx.roundRect(-20 - rub, -20, 75, 60, 16);
      ctx.fill();
      ctx.stroke();

      // Bubbly white soapy lather
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      for (var b = 0; b < 12; b++) {
        var bx = -40 + Math.sin(b * 1.5 + t * 8) * 45;
        var by = 5 + Math.cos(b * 1.5 + t * 8) * 35;
        ctx.beginPath();
        ctx.arc(bx, by, 7 + (b % 4), 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Splashing micro-droplets
      ctx.fillStyle = "rgba(14, 165, 233, 0.8)";
      for (var d = 0; d < 6; d++) {
        var dx = 480 + Math.cos(d * 1.3) * (t * 80 % 70);
        var dy = 330 + Math.sin(d * 1.3) * (t * 80 % 70);
        ctx.beginPath();
        ctx.arc(dx, dy, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Neutral scene badge — ZERO SPOILERS!
      drawSceneBadge(ctx, "● WATCH & GUESS");
    },

    tie_shoelace: function (ctx, t) {
      // 16:9 Clean Floor Setting
      var bg = ctx.createLinearGradient(0, 0, 0, 540);
      bg.addColorStop(0, "#f8fafc");
      bg.addColorStop(0.7, "#f1f5f9");
      bg.addColorStop(1, "#e2e8f0");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 960, 540);

      var cx = 480, cy = 300;

      // Sneaker silhouette
      ctx.fillStyle = "#3b82f6";
      ctx.strokeStyle = "#1d4ed8";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(cx - 150, cy + 80);
      ctx.lineTo(cx + 140, cy + 80);
      ctx.bezierCurveTo(cx + 170, cy + 40, cx + 150, cy - 20, cx + 80, cy - 40);
      ctx.lineTo(cx - 60, cy - 40);
      ctx.bezierCurveTo(cx - 140, cy - 20, cx - 170, cy + 30, cx - 150, cy + 80);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // White sneaker sole
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(cx - 160, cy + 70, 320, 30, 8);
      ctx.fill();
      ctx.stroke();

      // Sneaker eyelets & laces
      var tieProgress = Math.min(1, t * 1.3);

      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 6;
      ctx.lineCap = "round";

      // Cross laces on shoe
      ctx.beginPath();
      ctx.moveTo(cx - 30, cy - 20);
      ctx.lineTo(cx + 30, cy);
      ctx.moveTo(cx + 30, cy - 20);
      ctx.lineTo(cx - 30, cy);
      ctx.stroke();

      // Bow loops tying motion
      var loopSize = tieProgress * 45;
      ctx.beginPath();
      // Left bow loop
      ctx.ellipse(cx - 35, cy - 50, loopSize * 0.7, loopSize, -0.6, 0, Math.PI * 2);
      // Right bow loop
      ctx.ellipse(cx + 35, cy - 50, loopSize * 0.7, loopSize, 0.6, 0, Math.PI * 2);
      ctx.stroke();

      // Hands pulling laces tight
      var pullDist = 30 + tieProgress * 35;
      ctx.fillStyle = "#fed7aa";
      ctx.strokeStyle = "#ea580c";
      ctx.lineWidth = 3;

      // Left pulling hand
      ctx.beginPath();
      ctx.roundRect(cx - 60 - pullDist, cy - 80, 55, 38, 10);
      ctx.fill();
      ctx.stroke();

      // Right pulling hand
      ctx.beginPath();
      ctx.roundRect(cx + 15 + pullDist, cy - 80, 55, 38, 10);
      ctx.fill();
      ctx.stroke();

      // Neutral scene badge — ZERO SPOILERS!
      drawSceneBadge(ctx, "● WATCH & GUESS");
    }
  };

  function drawSceneBadge(ctx, label) {
    ctx.save();
    ctx.fillStyle = "rgba(15, 23, 42, 0.82)";
    ctx.beginPath();
    ctx.roundRect(24, 24, 230, 38, 19);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Red live recording dot
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(44, 43, 5, 0, Math.PI * 2);
    ctx.fill();

    // Text label (NO spoiler, only round / instruction)
    ctx.fillStyle = "#f8fafc";
    ctx.font = "700 13px 'DM Sans', -apple-system, sans-serif";
    ctx.fillText(label || "● WATCH & GUESS", 58, 48);
    ctx.restore();
  }

  function drawSparkle(ctx, x, y, progress) {
    var size = 14 * Math.sin(progress * Math.PI);
    if (size <= 0) return;
    ctx.save();
    ctx.fillStyle = "#fbbf24";
    ctx.beginPath();
    ctx.moveTo(x, y - size);
    ctx.lineTo(x + size * 0.28, y - size * 0.28);
    ctx.lineTo(x + size, y);
    ctx.lineTo(x + size * 0.28, y + size * 0.28);
    ctx.lineTo(x, y + size);
    ctx.lineTo(x - size * 0.28, y + size * 0.28);
    ctx.lineTo(x - size, y);
    ctx.lineTo(x - size * 0.28, y - size * 0.28);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
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
      // Create 16:9 HD Canvas feeding 60fps realistic 2D animated stream
      var canvas = document.createElement("canvas");
      canvas.width = 960;
      canvas.height = 540;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.style.objectFit = "cover";
      canvas.style.borderRadius = "14px";
      canvas.style.display = "block";
      stageEl.appendChild(canvas);

      var ctx = canvas.getContext("2d");
      var durationMs = 2800; // 2.8s per loop
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

  if (typeof window !== "undefined") {
    window.WHAT_IS_THIS_DATA = WHAT_IS_THIS_DATA;
  }

  updateStatsUI();
  renderQuestion();
})();
