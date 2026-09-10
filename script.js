// English Flow - Interactive script for all pages

document.addEventListener('DOMContentLoaded', () => {
  // 1. Footer Copyright Year
  const yearElements = document.querySelectorAll('#year');
  const currentYear = new Date().getFullYear();
  yearElements.forEach(el => {
    el.textContent = currentYear;
  });

  // 2. Mobile Navigation Toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const siteNav = document.getElementById('site-nav');
  if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = siteNav.classList.toggle('is-open');
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking nav links
    siteNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        siteNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!siteNav.contains(e.target) && !menuToggle.contains(e.target)) {
        siteNav.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 3. Audio Speech Pronunciation
  function speakPhrase(text) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9; // gentle, natural pace
    window.speechSynthesis.speak(utterance);
  }

  const listenButtons = document.querySelectorAll('.listen-button');
  listenButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const phraseCard = btn.closest('.phrase-card');
      let textToRead = "That sounds great to me.";
      if (phraseCard) {
        const strong = phraseCard.querySelector('strong');
        if (strong) textToRead = strong.textContent.replace(/["“”]/g, '');
      }
      speakPhrase(textToRead);
      btn.textContent = '🔊';
      setTimeout(() => { btn.textContent = '▶'; }, 1800);
    });
  });

  // 4. Library Page Filter Bar
  const filterButtons = document.querySelectorAll('.filter-bar button');
  const libraryCards = document.querySelectorAll('.library-grid .library-card');
  if (filterButtons.length && libraryCards.length) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('is-current'));
        button.classList.add('is-current');
        const filter = button.getAttribute('data-filter');

        libraryCards.forEach(card => {
          const topic = card.getAttribute('data-topic');
          if (filter === 'all' || topic === filter) {
            card.removeAttribute('hidden');
          } else {
            card.setAttribute('hidden', '');
          }
        });
      });
    });
  }

  // 5. Practice Page Phrase Pocket Reveal
  const flipCards = document.querySelectorAll('.phrase-flip');
  flipCards.forEach(card => {
    const revealBtn = card.querySelector('button[data-reveal]');
    const answerSpan = card.querySelector('.phrase-answer span');

    function toggleCard() {
      const isRevealed = card.classList.toggle('is-revealed');
      if (revealBtn) {
        revealBtn.textContent = isRevealed ? 'Hide phrase' : 'Reveal phrase';
      }
      if (isRevealed && answerSpan) {
        speakPhrase(answerSpan.textContent.replace(/["“”]/g, ''));
      }
    }

    if (revealBtn) {
      revealBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCard();
      });
    }
    card.addEventListener('click', () => {
      toggleCard();
    });
  });

  // 6. Home Page Interactive Practice Quiz
  initPracticeQuiz();
});

// Interactive Practice Quiz System
function initPracticeQuiz() {
  const quizCard = document.getElementById('practice-card');
  if (!quizCard) return;

  const promptEl = document.getElementById('quiz-question-prompt');
  const answerList = document.getElementById('practice-answer-list');
  const feedbackEl = document.getElementById('quiz-feedback');
  const nextBtn = document.getElementById('next-practice');
  const counterEl = document.getElementById('practice-counter');
  const progressBar = document.getElementById('practice-progress-bar');
  const streakEl = document.getElementById('streak-number');

  // Load streak
  let currentStreak = parseInt(localStorage.getItem('english_flow_streak') || '1', 10);
  if (streakEl) streakEl.textContent = currentStreak;

  const questions = [
    {
      prompt: "You want to agree with a friend’s plan. Which reply feels most natural?",
      answers: [
        { label: "A", text: "Yes, I am agree.", correct: false },
        { label: "B", text: "That sounds great to me.", correct: true },
        { label: "C", text: "I am in agree with it.", correct: false }
      ],
      explanation: "“That sounds great to me” is natural and warm. In English we say “I agree”, never “I am agree”."
    },
    {
      prompt: "You need a brief moment to consider an offer before answering. What would you say?",
      answers: [
        { label: "A", text: "Let me think about that for a second.", correct: true },
        { label: "B", text: "I wait my thoughts now.", correct: false },
        { label: "C", text: "Wait me please, thinking.", correct: false }
      ],
      explanation: "“Let me think about that for a second” gives you polite thinking time without freezing up."
    },
    {
      prompt: "Someone explains a new perspective to you. How do you show you understand thoughtfully?",
      answers: [
        { label: "A", text: "I watch your sense completely.", correct: false },
        { label: "B", text: "I see what you mean.", correct: true },
        { label: "C", text: "I look at your opinion.", correct: false }
      ],
      explanation: "“I see what you mean” is the go-to conversational bridge for real active listening."
    }
  ];

  let currentIndex = 0;
  let selectedBtn = null;
  let isAnswerChecked = false;

  function renderQuestion(index) {
    const q = questions[index];
    isAnswerChecked = false;
    selectedBtn = null;

    if (counterEl) counterEl.textContent = `0${index + 1} / 0${questions.length}`;
    if (progressBar) progressBar.style.width = `${((index + 1) / questions.length) * 100}%`;
    if (promptEl) promptEl.textContent = q.prompt;

    feedbackEl.className = 'quiz-feedback';
    feedbackEl.textContent = "Choose the phrase you would say out loud.";

    nextBtn.disabled = true;
    nextBtn.innerHTML = 'Check answer <span>→</span>';

    answerList.innerHTML = '';
    q.answers.forEach(ans => {
      const btn = document.createElement('button');
      btn.className = 'answer';
      btn.type = 'button';
      btn.dataset.correct = ans.correct ? 'true' : 'false';
      btn.innerHTML = `<b>${ans.label}</b> ${ans.text}`;

      btn.addEventListener('click', () => {
        if (isAnswerChecked) return;
        answerList.querySelectorAll('.answer').forEach(b => b.classList.remove('is-selected'));
        btn.classList.add('is-selected');
        selectedBtn = btn;
        nextBtn.disabled = false;
        feedbackEl.textContent = `Selected: “${ans.text}”. Ready to check?`;
      });

      answerList.appendChild(btn);
    });
  }

  nextBtn.addEventListener('click', () => {
    if (!isAnswerChecked) {
      // Check state
      if (!selectedBtn) return;
      isAnswerChecked = true;
      const isCorrect = selectedBtn.dataset.correct === 'true';

      if (isCorrect) {
        selectedBtn.classList.add('is-correct');
        feedbackEl.className = 'quiz-feedback success';
        feedbackEl.textContent = `✦ Correct! ${questions[currentIndex].explanation}`;
        
        // Play subtle sound or speak phrase
        if ('speechSynthesis' in window) {
          const phraseText = selectedBtn.innerText.replace(/^[A-C]\s*/, '');
          const utterance = new SpeechSynthesisUtterance(phraseText);
          utterance.lang = 'en-US';
          window.speechSynthesis.speak(utterance);
        }

        // Increment streak if not already boosted today
        const lastPracticeDate = localStorage.getItem('english_flow_last_practice');
        const today = new Date().toDateString();
        if (lastPracticeDate !== today) {
          currentStreak += 1;
          localStorage.setItem('english_flow_streak', currentStreak);
          localStorage.setItem('english_flow_last_practice', today);
          if (streakEl) streakEl.textContent = currentStreak;
        }
      } else {
        selectedBtn.classList.add('is-wrong');
        const correctBtn = answerList.querySelector('[data-correct="true"]');
        if (correctBtn) correctBtn.classList.add('is-correct');
        feedbackEl.className = 'quiz-feedback error';
        feedbackEl.textContent = `Notice the difference: ${questions[currentIndex].explanation}`;
      }

      if (currentIndex < questions.length - 1) {
        nextBtn.innerHTML = 'Next phrase <span>→</span>';
      } else {
        nextBtn.innerHTML = 'Complete practice <span>✦</span>';
      }
    } else {
      // Next or Complete
      if (currentIndex < questions.length - 1) {
        currentIndex++;
        renderQuestion(currentIndex);
      } else {
        // Finished all
        feedbackEl.className = 'quiz-feedback success';
        feedbackEl.textContent = "🎉 Daily flow complete! Keep your momentum going tomorrow.";
        nextBtn.innerHTML = 'Practice again <span>↺</span>';
        nextBtn.onclick = () => {
          currentIndex = 0;
          renderQuestion(currentIndex);
        };
      }
    }
  });

  renderQuestion(0);
}
