/* English Flow — tenses page interactions.
   Filters · listen buttons · a practice set for every tense · the mixed challenge quiz.
   Progress is stored on the learner's own device (localStorage), no sign-in needed. */
(function () {
  'use strict';

  var STORE_KEY = 'english_flow_tense_progress';
  var LABELS = ['A', 'B', 'C', 'D'];
  var DATA = window.TENSE_PRACTICE || {};
  var CHALLENGE = window.TENSE_CHALLENGE || [];
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- helpers ---------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function norm(value) {
    return String(value || '')
      .toLowerCase()
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/[.,!?;:]+$/g, '')
      .trim();
  }

  function loadProgress() {
    try {
      var raw = window.localStorage.getItem(STORE_KEY);
      var parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (err) { return {}; }
  }
  function saveProgress(progress) {
    try { window.localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (err) { /* private mode */ }
  }

  var progress = loadProgress();

  /* ---------------- toast + confetti ---------------- */
  var toastEl = null, toastTimer = null;

  /* An open <dialog> lives in the browser's top layer, so overlays have to be
     placed inside it to stay visible above the modal. */
  function overlayHost() {
    return document.querySelector('dialog[open]') || document.body;
  }

  function toast(message) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'tp-toast';
    }
    overlayHost().appendChild(toastEl);
    toastEl.textContent = message;
    toastEl.classList.add('show');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  function confetti(amount) {
    if (reduced) return;
    var colours = ['#ff4d8d', '#ff8a3d', '#ffc73d', '#16c79a', '#3d8bff', '#8b5cf6'];
    var layer = document.createElement('div');
    layer.className = 'tp-confetti';
    for (var i = 0; i < (amount || 60); i++) {
      var bit = document.createElement('i');
      bit.style.left = Math.random() * 100 + '%';
      bit.style.background = colours[i % colours.length];
      bit.style.animationDuration = (1.6 + Math.random() * 1.4) + 's';
      bit.style.animationDelay = (Math.random() * 0.4) + 's';
      bit.style.transform = 'rotate(' + Math.random() * 360 + 'deg)';
      layer.appendChild(bit);
    }
    var openDialog = document.querySelector('dialog[open]');
    var card = openDialog && openDialog.querySelector('.tp-dialog-card');
    if (card) {
      layer.classList.add('in-card');
      card.appendChild(layer);
    } else {
      document.body.appendChild(layer);
    }
    window.setTimeout(function () { layer.remove(); }, 3600);
  }

  /* ---------------- speech ---------------- */
  function speak(text) {
    if (!('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    var utterance = new window.SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  $$('.tp-listen').forEach(function (button) {
    button.addEventListener('click', function () {
      speak(button.getAttribute('data-say'));
      var original = button.textContent;
      button.textContent = '🔊';
      window.setTimeout(function () { button.textContent = original; }, 1700);
    });
  });

  /* ---------------- filters ---------------- */
  var filterButtons = $$('.tp-filters button');
  var cards = $$('.tp-card');
  var groupTitles = $$('.tp-group-title');
  var countEl = $('#tp-filter-count');
  var emptyEl = $('#tp-empty');

  function applyFilter(filter) {
    var visible = 0;
    cards.forEach(function (card) {
      var time = card.getAttribute('data-time') || '';
      var aspect = card.getAttribute('data-aspect') || '';
      var show = filter === 'all' || time === filter || aspect.split(' ').indexOf(filter) > -1;
      card.hidden = !show;
      if (show) visible++;
    });
    groupTitles.forEach(function (title) {
      var grid = title.nextElementSibling;
      var anyVisible = grid && grid.querySelector('.tp-card:not([hidden])');
      title.hidden = !anyVisible;
      if (grid) grid.hidden = !anyVisible;
    });
    if (countEl) {
      countEl.textContent = filter === 'all'
        ? '✨ Showing all 12 tenses — each one has its own practice set.'
        : '✨ Showing ' + visible + ' ' + (visible === 1 ? 'tense' : 'tenses') + ' · ' + filter + '.';
    }
    if (emptyEl) emptyEl.hidden = visible !== 0;
  }

  filterButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      filterButtons.forEach(function (other) { other.classList.remove('is-current'); });
      button.classList.add('is-current');
      applyFilter(button.getAttribute('data-filter'));
    });
  });

  /* ---------------- print ---------------- */
  var printButton = $('#tp-print');
  if (printButton) {
    printButton.addEventListener('click', function () {
      filterButtons.forEach(function (b) { b.classList.toggle('is-current', b.getAttribute('data-filter') === 'all'); });
      applyFilter('all');
      window.print();
    });
  }

  /* ---------------- progress panel ---------------- */
  var barEl = $('#tp-bar i');
  var dotsEl = $('#tp-dots');
  var doneCountEl = $('#tp-done-count');
  var trophyEl = $('#tp-trophy');
  var progressNote = $('#tp-progress-note');
  var totalTenses = cards.length || 12;

  function cardStatusText(id) {
    var record = progress[id];
    if (!record) return 'Not practised yet';
    if (record.best >= 5) return '★ Mastered · 5/5';
    return 'Best score ' + record.best + '/5';
  }

  function refreshProgress() {
    var done = 0;
    cards.forEach(function (card) {
      var id = card.getAttribute('data-tense');
      var record = progress[id];
      var statusEl = card.querySelector('.tp-status');
      var button = card.querySelector('.tp-practice');
      if (record && record.best >= 4) {
        done++;
        card.classList.add('is-done');
      } else {
        card.classList.remove('is-done');
      }
      if (statusEl) {
        statusEl.textContent = cardStatusText(id);
        statusEl.classList.toggle('done', !!record && record.best >= 4);
      }
      if (button && record) button.innerHTML = 'Practise again <span aria-hidden="true">↻</span>';
    });

    if (doneCountEl) doneCountEl.textContent = done;
    if (barEl) barEl.style.width = (done / totalTenses) * 100 + '%';
    if (dotsEl) {
      dotsEl.innerHTML = '';
      for (var i = 0; i < totalTenses; i++) {
        var dot = document.createElement('i');
        if (i < done) dot.className = 'on';
        dotsEl.appendChild(dot);
      }
    }
    if (trophyEl) trophyEl.textContent = done === 0 ? '🌱' : done < 4 ? '🌿' : done < 8 ? '⭐' : done < 12 ? '🔥' : '🏆';
    if (progressNote) {
      progressNote.textContent = done === 0
        ? 'Tap “Practice set” on any card to begin — 5 quick questions each.'
        : done === totalTenses
          ? 'All 12 practice sets cleared. You are officially a tense master!'
          : 'Keep going — ' + (totalTenses - done) + ' practice ' + (totalTenses - done === 1 ? 'set' : 'sets') + ' left.';
    }
  }

  var resetButton = $('#tp-reset');
  if (resetButton) {
    resetButton.addEventListener('click', function () {
      if (!window.confirm('Clear your practice progress on this device?')) return;
      progress = {};
      saveProgress(progress);
      refreshProgress();
      toast('Progress cleared — a fresh start ✨');
    });
  }

  /* =========================================================
     A small reusable quiz engine (used by both the practice
     sets and the big mixed challenge).
     ========================================================= */
  function createQuiz(options) {
    var root = options.root;
    var questions = [];
    var hooks = {};
    var state = { index: 0, score: 0, picked: null, checked: false, typed: '' };

    var promptEl = $('[data-role="prompt"]', root);
    var bodyEl = $('[data-role="body"]', root);
    var feedbackEl = $('[data-role="feedback"]', root);
    var nextEl = $('[data-role="next"]', root);
    var counterEl = $('[data-role="counter"]', root);
    var barFill = $('[data-role="bar"]', root);
    var stage = $('[data-role="stage"]', root);
    var resultEl = $('[data-role="result"]', root);

    function setFeedback(text, tone) {
      if (!feedbackEl) return;
      feedbackEl.className = 'tp-feedback' + (tone ? ' ' + tone : '');
      feedbackEl.textContent = text;
    }

    function render() {
      var question = questions[state.index];
      if (!question) return;
      state.picked = null;
      state.checked = false;
      state.typed = '';

      if (stage) stage.hidden = false;
      if (resultEl) resultEl.hidden = true;
      if (counterEl) counterEl.textContent = pad(state.index + 1) + ' / ' + pad(questions.length);
      if (barFill) barFill.style.width = (state.index / questions.length) * 100 + 8 + '%';
      if (promptEl) promptEl.innerHTML = String(question.prompt).replace(/____/g, '<u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</u>');
      if (nextEl) {
        nextEl.disabled = true;
        nextEl.innerHTML = 'Check answer <span aria-hidden="true">&rarr;</span>';
      }
      setFeedback(question.type === 'fill' ? 'Type the missing words, then check.' : 'Pick the answer that sounds right to you.');

      bodyEl.innerHTML = '';
      if (question.type === 'fill') {
        var wrap = document.createElement('div');
        wrap.className = 'tp-type';
        var hint = document.createElement('p');
        hint.className = 'tp-type-hint';
        hint.innerHTML = 'Use this verb: <em>' + question.hint + '</em>';
        var input = document.createElement('input');
        input.type = 'text';
        input.autocomplete = 'off';
        input.autocapitalize = 'none';
        input.spellcheck = false;
        input.setAttribute('aria-label', 'Your answer');
        input.placeholder = 'Type your answer\u2026';
        input.addEventListener('input', function () {
          if (state.checked) return;
          state.typed = input.value;
          if (nextEl) nextEl.disabled = !input.value.trim();
        });
        input.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' && nextEl && !nextEl.disabled) { event.preventDefault(); nextEl.click(); }
        });
        wrap.appendChild(hint);
        wrap.appendChild(input);
        bodyEl.appendChild(wrap);
        window.setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); } }, 60);
      } else {
        var list = document.createElement('div');
        list.className = 'tp-options';
        list.setAttribute('role', 'group');
        list.setAttribute('aria-label', 'Answer choices');
        question.options.forEach(function (text, i) {
          var button = document.createElement('button');
          button.type = 'button';
          button.className = 'tp-option';
          button.innerHTML = '<b>' + LABELS[i] + '</b><span></span>';
          button.lastChild.textContent = text;
          button.addEventListener('click', function () {
            if (state.checked) return;
            $$('.tp-option', list).forEach(function (other) { other.classList.remove('is-picked'); });
            button.classList.add('is-picked');
            state.picked = i;
            if (nextEl) nextEl.disabled = false;
          });
          list.appendChild(button);
        });
        bodyEl.appendChild(list);
      }
    }

    function check() {
      var question = questions[state.index];
      var isCorrect;

      if (question.type === 'fill') {
        var wrap = $('.tp-type', bodyEl);
        var input = $('input', bodyEl);
        var given = norm(state.typed);
        isCorrect = question.accept.some(function (answer) {
          return given === norm(answer) || given === norm(question.prompt.replace('____', answer));
        });
        if (input) input.readOnly = true;
        if (wrap) wrap.classList.add(isCorrect ? 'is-right' : 'is-wrong');
        if (!isCorrect && wrap) {
          var reveal = document.createElement('p');
          reveal.className = 'tp-answer-reveal';
          reveal.textContent = '\u2713 Answer: ' + question.accept[0];
          wrap.appendChild(reveal);
        }
      } else {
        var buttons = $$('.tp-option', bodyEl);
        buttons[question.correct].classList.add('is-right');
        isCorrect = state.picked === question.correct;
        if (!isCorrect && buttons[state.picked]) buttons[state.picked].classList.add('is-wrong');
      }

      state.checked = true;
      if (isCorrect) {
        state.score++;
        setFeedback('\uD83C\uDF89 Correct! ' + question.why, 'good');
        if (window.FlowFun) window.FlowFun.pop('+10 XP', undefined, undefined, 'green');
        if (hooks.onCorrect) hooks.onCorrect(state.score);
      } else {
        setFeedback('\uD83D\uDCA1 Not quite. ' + question.why, 'bad');
      }
      if (hooks.onAnswer) hooks.onAnswer(state.index, isCorrect);

      if (barFill) barFill.style.width = ((state.index + 1) / questions.length) * 100 + '%';
      if (nextEl) {
        nextEl.disabled = false;
        nextEl.innerHTML = state.index < questions.length - 1
          ? 'Next question <span aria-hidden="true">&rarr;</span>'
          : 'See my result <span aria-hidden="true">&#10022;</span>';
      }
    }

    function finish() {
      var score = state.score;
      var total = questions.length;
      var percent = Math.round((score / total) * 100);
      if (stage) stage.hidden = true;
      if (resultEl) {
        resultEl.hidden = false;
        var colour = percent === 100 ? '#16c79a' : percent >= 60 ? '#3d8bff' : '#ff8a3d';
        var ring = $('[data-role="ring"]', resultEl);
        if (ring) {
          ring.style.background = 'conic-gradient(' + colour + ' ' + percent + '%, #eef1f8 0)';
          var strong = $('strong', ring);
          if (strong) { strong.textContent = score + '/' + total; strong.style.color = colour; }
        }
        var title = $('[data-role="result-title"]', resultEl);
        var note = $('[data-role="result-note"]', resultEl);
        if (title) title.textContent = percent === 100 ? 'Perfect! \uD83C\uDFC6' : percent >= 60 ? 'Nicely done! \uD83C\uDF1F' : 'Good try! \uD83C\uDF31';
        if (note) {
          note.textContent = percent === 100
            ? 'Every single one right. This tense is yours now.'
            : percent >= 60
              ? 'Solid work. Read the card once more and go for a perfect score.'
              : 'Mistakes are the lesson. Look at the examples again, then try once more.';
        }
      }
      if (percent >= 80) confetti(percent === 100 ? 90 : 55);
      if (hooks.onFinish) hooks.onFinish(score, total);
    }

    if (nextEl) {
      nextEl.addEventListener('click', function () {
        if (!questions.length) return;
        if (!state.checked) {
          var question = questions[state.index];
          if (question.type === 'fill' ? !state.typed.trim() : state.picked === null) return;
          check();
        } else if (state.index < questions.length - 1) {
          state.index++;
          render();
        } else {
          finish();
        }
      });
    }

    function restart() { state.index = 0; state.score = 0; render(); }

    return {
      load: function (nextQuestions, nextHooks) {
        questions = nextQuestions || [];
        hooks = nextHooks || {};
        restart();
      },
      restart: restart
    };
  }

  /* =========================================================
     Practice set dialog (one per tense)
     ========================================================= */
  var dialog = $('#tp-dialog');
  var dialogCard = dialog ? $('.tp-dialog-card', dialog) : null;
  var dialogQuiz = dialog ? createQuiz({ root: dialog }) : null;
  var activeTense = null;

  function openDialog() {
    if (!dialog) return;
    if (typeof dialog.showModal === 'function') {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute('open', '');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeDialog() {
    if (!dialog) return;
    if (typeof dialog.close === 'function' && dialog.open) dialog.close();
    else dialog.removeAttribute('open');
    document.body.style.overflow = '';
    if (window.speechSynthesis) window.speechSynthesis.cancel();
  }

  function startPractice(tenseId) {
    var set = DATA[tenseId];
    if (!set || !dialog || !dialogQuiz) return;
    var card = document.querySelector('.tp-card[data-tense="' + tenseId + '"]');
    activeTense = tenseId;

    if (card && dialogCard) {
      dialogCard.style.setProperty('--c1', card.style.getPropertyValue('--c1') || '#8b5cf6');
      dialogCard.style.setProperty('--c2', card.style.getPropertyValue('--c2') || '#ff4d8d');
    }
    $('[data-role="dialog-emoji"]', dialog).textContent = set.emoji;
    $('[data-role="dialog-name"]', dialog).textContent = set.name;

    var pips = $('[data-role="pips"]', dialog);
    function resetPips() {
      pips.innerHTML = '';
      set.questions.forEach(function () { pips.appendChild(document.createElement('i')); });
    }
    resetPips();

    dialogQuiz.load(set.questions, {
      onRestart: resetPips,
      onAnswer: function (index, correct) {
        var pip = pips.children[index];
        if (pip) pip.className = correct ? 'on' : 'miss';
      },
      onFinish: function (score, total) {
        var previous = progress[tenseId] || { best: 0, tries: 0 };
        progress[tenseId] = { best: Math.max(previous.best || 0, score), tries: (previous.tries || 0) + 1, total: total };
        saveProgress(progress);
        refreshProgress();
        if (score >= 4) toast('Practice set complete \u2014 ' + score + '/' + total + ' \uD83C\uDF89');
      }
    });
    openDialog();
  }

  $$('.tp-practice').forEach(function (button) {
    button.addEventListener('click', function () { startPractice(button.getAttribute('data-practice')); });
  });

  if (dialog) {
    $$('[data-role="dialog-close"]', dialog).forEach(function (button) {
      button.addEventListener('click', closeDialog);
    });
    dialog.addEventListener('cancel', function () { document.body.style.overflow = ''; });
    dialog.addEventListener('click', function (event) { if (event.target === dialog) closeDialog(); });

    var again = $('[data-role="again"]', dialog);
    if (again) {
      again.addEventListener('click', function () {
        var pips = $('[data-role="pips"]', dialog);
        $$('i', pips).forEach(function (pip) { pip.className = ''; });
        dialogQuiz.restart();
      });
    }

    var nextTense = $('[data-role="next-tense"]', dialog);
    if (nextTense) {
      nextTense.addEventListener('click', function () {
        var ids = cards.map(function (card) { return card.getAttribute('data-tense'); });
        var position = ids.indexOf(activeTense);
        startPractice(ids[(position + 1) % ids.length]);
      });
    }
  }

  /* =========================================================
     The mixed challenge quiz
     ========================================================= */
  var challengeRoot = $('#tp-challenge');
  if (challengeRoot && CHALLENGE.length) {
    var liveScore = $('#tp-live-score');
    var liveNote = $('#tp-live-note');
    var tenseLabel = $('#tp-challenge-tense');
    var challengeQuiz = createQuiz({ root: challengeRoot });

    var challengeHooks = {
      onAnswer: function (index, correct) {
        if (tenseLabel) tenseLabel.textContent = 'That one was: ' + CHALLENGE[index].tense;
        if (liveNote) liveNote.textContent = correct ? 'Yes! That one clicked. \u2728' : 'Every miss teaches you something.';
      },
      onCorrect: function (score) { if (liveScore) liveScore.textContent = score; },
      onFinish: function (score, total) {
        if (liveNote) liveNote.textContent = 'You scored ' + score + ' out of ' + total + '.';
        try {
          var best = parseInt(window.localStorage.getItem('english_flow_tense_challenge') || '0', 10);
          if (score > best) window.localStorage.setItem('english_flow_tense_challenge', String(score));
        } catch (err) { /* storage blocked */ }
      }
    };
    challengeQuiz.load(CHALLENGE, challengeHooks);

    var challengeAgain = $('[data-role="again"]', challengeRoot);
    if (challengeAgain) {
      challengeAgain.addEventListener('click', function () {
        if (liveScore) liveScore.textContent = '0';
        if (liveNote) liveNote.textContent = 'A fresh start. Take your time.';
        if (tenseLabel) tenseLabel.textContent = 'Take your time \u2014 you\u2019re learning.';
        challengeQuiz.restart();
      });
    }
  }

  refreshProgress();
  applyFilter('all');
})();
