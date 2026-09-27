/* English Flow — practice sets for all 12 tenses.
   Each tense has its own 5-question practice set (multiple choice + type-the-answer).
   Used by tenses.js on tenses.html. */
window.TENSE_PRACTICE = {
  'present-simple': {
    name: 'Present simple',
    emoji: '🔁',
    questions: [
      { type: 'mcq', prompt: 'My sister ____ coffee every morning.', options: ['drink', 'drinks', 'is drinking'], correct: 1, why: '“Every morning” = a routine, so we use the present simple. With he / she / it we add -s: drinks.' },
      { type: 'fill', prompt: 'Water ____ at 100 degrees.', hint: 'boil', accept: ['boils'], why: 'A general fact takes the present simple, and “water” (it) needs the -s ending: boils.' },
      { type: 'mcq', prompt: 'Which question is correct?', options: ['Does he work on Sundays?', 'Do he works on Sundays?', 'Is he work on Sundays?'], correct: 0, why: 'After “does”, the main verb goes back to its base form: Does he work…?' },
      { type: 'mcq', prompt: 'Choose the correct sentence.', options: ["She don't like spicy food.", "She doesn't likes spicy food.", "She doesn't like spicy food."], correct: 2, why: 'He / she / it takes “doesn’t”, and after it the verb has no -s: doesn’t like.' },
      { type: 'fill', prompt: 'The shop ____ at 9 a.m. every day.', hint: 'open', accept: ['opens'], why: 'Timetables and repeated events use the present simple: opens.' }
    ]
  },
  'present-continuous': {
    name: 'Present continuous',
    emoji: '🎬',
    questions: [
      { type: 'mcq', prompt: 'Be quiet — the baby ____.', options: ['sleeps', 'is sleeping', 'has slept'], correct: 1, why: 'It is happening at this exact moment, so we use am / is / are + verb-ing.' },
      { type: 'fill', prompt: 'Look! It ____ again.', hint: 'rain', accept: ['is raining', "it's raining", 'is raining again'], why: 'Right now = present continuous: is raining.' },
      { type: 'mcq', prompt: 'Which negative sentence is correct?', options: ['I am not working today.', 'I not working today.', "I don't working today."], correct: 0, why: 'Put “not” after am / is / are: I am not working.' },
      { type: 'mcq', prompt: 'Which sentence sounds natural?', options: ['I am knowing the answer.', 'I know the answer.', 'I am know the answer.'], correct: 1, why: 'State verbs (know, like, want, need) are not normally used in the continuous form.' },
      { type: 'fill', prompt: 'This week I ____ from home.', hint: 'work', accept: ['am working', "i'm working"], why: 'A temporary situation around now: am working.' }
    ]
  },
  'present-perfect': {
    name: 'Present perfect',
    emoji: '✅',
    questions: [
      { type: 'mcq', prompt: "I ____ my keys. I can't open the door!", options: ['lost', 'have lost', 'was losing'], correct: 1, why: 'A past action with a result right now → present perfect: have lost.' },
      { type: 'fill', prompt: 'She ____ in Paris since 2019.', hint: 'live', accept: ['has lived', 'has been living'], why: '“Since 2019” connects the past to now, so we use has lived (or has been living).' },
      { type: 'mcq', prompt: 'Which question is correct?', options: ['Have you ever been to Japan?', 'Have you ever went to Japan?', 'Did you ever been to Japan?'], correct: 0, why: 'After have / has we use the past participle: been.' },
      { type: 'mcq', prompt: 'Choose the natural sentence.', options: ['I have already finished my homework.', 'I am finish my homework already.', 'I finish already my homework.'], correct: 0, why: '“Already” sits between have and the past participle: have already finished.' },
      { type: 'fill', prompt: 'He ____ me yet.', hint: 'not / call', accept: ['has not called', "hasn't called"], why: '“Yet” in a negative sentence loves the present perfect: hasn’t called.' }
    ]
  },
  'present-perfect-continuous': {
    name: 'Present perfect continuous',
    emoji: '⏱️',
    questions: [
      { type: 'mcq', prompt: "I'm exhausted because I ____ all day.", options: ['have been studying', 'have studied', 'studied'], correct: 0, why: 'The long activity and how it affects you now → have been studying.' },
      { type: 'fill', prompt: 'They ____ for an hour.', hint: 'wait', accept: ['have been waiting'], why: 'Duration that is still going on: have been waiting.' },
      { type: 'mcq', prompt: 'Which question asks about duration?', options: ['How long have you been learning English?', 'How long do you learn English?', 'How long are you learning English?'], correct: 0, why: '“How long…?” about something that started in the past and continues → have been + verb-ing.' },
      { type: 'mcq', prompt: 'Choose the correct sentence.', options: ['She has been work here for a year.', 'She has been working here for a year.', 'She is been working here for a year.'], correct: 1, why: 'The pattern is has / have been + verb-ing: has been working.' },
      { type: 'fill', prompt: 'It ____ since last night.', hint: 'snow', accept: ['has been snowing'], why: '“Since last night” + still happening → has been snowing.' }
    ]
  },
  'past-simple': {
    name: 'Past simple',
    emoji: '📅',
    questions: [
      { type: 'mcq', prompt: 'We ____ to the beach last Sunday.', options: ['go', 'went', 'have gone'], correct: 1, why: '“Last Sunday” is a finished time, so we use the past simple: went.' },
      { type: 'fill', prompt: 'I ____ this jacket in 2021.', hint: 'buy', accept: ['bought'], why: 'Buy is irregular: buy → bought.' },
      { type: 'mcq', prompt: 'Which question is correct?', options: ['Did you saw the message?', 'Did you see the message?', 'Do you saw the message?'], correct: 1, why: '“Did” already shows the past, so the main verb stays in the base form: see.' },
      { type: 'mcq', prompt: 'Choose the correct negative.', options: ["He didn't came home.", 'He not came home.', "He didn't come home."], correct: 2, why: 'didn’t + base verb: didn’t come.' },
      { type: 'fill', prompt: 'She ____ the film.', hint: 'not / like', accept: ['did not like', "didn't like"], why: 'Negative past simple = didn’t + base verb: didn’t like.' }
    ]
  },
  'past-continuous': {
    name: 'Past continuous',
    emoji: '🎞️',
    questions: [
      { type: 'mcq', prompt: 'I ____ TV when the power went off.', options: ['watched', 'was watching', 'have watched'], correct: 1, why: 'A longer action in progress, interrupted by a short one → past continuous.' },
      { type: 'fill', prompt: 'At 8 p.m. yesterday we ____ dinner.', hint: 'have', accept: ['were having'], why: 'In progress at a specific past moment: were having.' },
      { type: 'mcq', prompt: 'Choose the correct sentence.', options: ['While she was reading, the phone rang.', 'While she read, the phone was ringing.', 'While she is reading, the phone rang.'], correct: 0, why: 'The long background action takes the past continuous; the sudden one takes the past simple.' },
      { type: 'mcq', prompt: 'Which question is correct?', options: ['What were you doing at midnight?', 'What was you doing at midnight?', 'What you were doing at midnight?'], correct: 0, why: 'With “you” we use were: What were you doing?' },
      { type: 'fill', prompt: 'They ____ to me at all.', hint: 'not / listen', accept: ['were not listening', "weren't listening"], why: 'Negative past continuous: were not (weren’t) listening.' }
    ]
  },
  'past-perfect': {
    name: 'Past perfect',
    emoji: '⏮️',
    questions: [
      { type: 'mcq', prompt: 'When I arrived at the station, the train ____.', options: ['left', 'had left', 'has left'], correct: 1, why: 'The earlier of two past actions takes the past perfect: had left.' },
      { type: 'fill', prompt: 'She ____ her work before the meeting started.', hint: 'finish', accept: ['had finished'], why: 'First action in the past → had + past participle: had finished.' },
      { type: 'mcq', prompt: 'Choose the correct sentence.', options: ['After he had eaten, he went out.', 'After he has eaten, he went out.', 'After he eat, he went out.'], correct: 0, why: 'Both actions are in the past; the first one uses had + past participle.' },
      { type: 'mcq', prompt: 'Which question is correct?', options: ['Had you met him before the party?', 'Did you had met him before the party?', 'Have you met him before the party yesterday?'], correct: 0, why: 'Questions start with “Had” + subject + past participle.' },
      { type: 'fill', prompt: "I couldn't get in because I ____ my key.", hint: 'lose', accept: ['had lost'], why: 'Losing the key happened before “couldn’t get in”: had lost.' }
    ]
  },
  'past-perfect-continuous': {
    name: 'Past perfect continuous',
    emoji: '⌛',
    questions: [
      { type: 'mcq', prompt: 'He was tired because he ____ all night.', options: ['had been driving', 'had driven', 'was driving'], correct: 0, why: 'How long the action continued before another past moment → had been driving.' },
      { type: 'fill', prompt: 'We ____ for two hours before the bus came.', hint: 'wait', accept: ['had been waiting'], why: 'Duration before a past event: had been waiting.' },
      { type: 'mcq', prompt: 'Choose the correct sentence.', options: ['She had been study for hours.', 'She had been studying for hours.', 'She has been studied for hours.'], correct: 1, why: 'The pattern is had been + verb-ing: had been studying.' },
      { type: 'mcq', prompt: 'Which sentence shows how long something continued before a past moment?', options: ['They had been living there for ten years before they moved.', 'They lived there ten years ago.', 'They have lived there for ten years.'], correct: 0, why: '“…for ten years before they moved” = past perfect continuous.' },
      { type: 'fill', prompt: 'The ground was wet because it ____ .', hint: 'rain', accept: ['had been raining'], why: 'The rain continued before that past moment: had been raining.' }
    ]
  },
  'future-simple': {
    name: 'Future simple',
    emoji: '🚀',
    questions: [
      { type: 'mcq', prompt: 'The phone is ringing. — “I ____ it!”', options: ['will get', 'am getting', 'get'], correct: 0, why: 'A decision made while you speak → will.' },
      { type: 'fill', prompt: "Don't worry, I ____ you.", hint: 'help', accept: ['will help', "i'll help", "'ll help"], why: 'A promise or offer uses will: will help.' },
      { type: 'mcq', prompt: 'Choose the correct sentence.', options: ['I will to call you later.', 'I will call you later.', 'I will calling you later.'], correct: 1, why: 'After “will” we use the base verb — no “to”, no -ing.' },
      { type: 'mcq', prompt: 'Which question is correct?', options: ['Will you come with me?', 'Do you will come with me?', 'Are you will come with me?'], correct: 0, why: 'Just move “will” in front of the subject: Will you come…?' },
      { type: 'fill', prompt: 'I think it ____ sunny tomorrow.', hint: 'be', accept: ['will be', "'ll be", "it'll be"], why: 'A prediction with “I think” takes will: will be.' }
    ]
  },
  'future-continuous': {
    name: 'Future continuous',
    emoji: '🛫',
    questions: [
      { type: 'mcq', prompt: 'This time tomorrow I ____ on a plane to Rome.', options: ['will sit', 'will be sitting', 'am sitting'], correct: 1, why: 'In progress at a future moment → will be + verb-ing.' },
      { type: 'fill', prompt: 'At 9 p.m. tonight we ____ the match.', hint: 'watch', accept: ['will be watching', "'ll be watching"], why: 'Happening across a future moment: will be watching.' },
      { type: 'mcq', prompt: 'Choose the correct sentence.', options: ['I will be work late tonight.', 'I will be working late tonight.', 'I will working late tonight.'], correct: 1, why: 'The pattern is will be + verb-ing: will be working.' },
      { type: 'mcq', prompt: 'Which question sounds most natural?', options: ['Will you be using the car tonight?', 'Will you be use the car tonight?', 'Do you will use the car tonight?'], correct: 0, why: 'Will + subject + be + verb-ing is a soft, polite way to ask about plans.' },
      { type: 'fill', prompt: "Don't call me at 7 — I ____ then.", hint: 'drive', accept: ['will be driving', "'ll be driving"], why: 'The action will already be in progress: will be driving.' }
    ]
  },
  'future-perfect': {
    name: 'Future perfect',
    emoji: '🏁',
    questions: [
      { type: 'mcq', prompt: 'By Friday I ____ the report.', options: ['will finish', 'will have finished', 'finish'], correct: 1, why: 'Complete before a future deadline → will have + past participle.' },
      { type: 'fill', prompt: 'By 2030 she ____ enough money for the trip.', hint: 'save', accept: ['will have saved'], why: 'Finished before a future point: will have saved.' },
      { type: 'mcq', prompt: 'Choose the correct sentence.', options: ['We will have arrive by six.', 'We will have arrived by six.', 'We will arrived by six.'], correct: 1, why: 'will have + past participle: will have arrived.' },
      { type: 'mcq', prompt: 'Which sentence says the action is finished before a future time?', options: ['By the time you wake up, I will have left.', 'When you wake up, I will leave.', 'I am leaving when you wake up.'], correct: 0, why: '“By the time…” + will have left shows it is complete before that moment.' },
      { type: 'fill', prompt: 'By next month they ____ the new bridge.', hint: 'build', accept: ['will have built'], why: 'Complete before next month: will have built.' }
    ]
  },
  'future-perfect-continuous': {
    name: 'Future perfect continuous',
    emoji: '🌠',
    questions: [
      { type: 'mcq', prompt: 'In June, I ____ here for ten years.', options: ['will work', 'will have been working', 'will be working'], correct: 1, why: 'How long something will have continued by a future point → will have been + verb-ing.' },
      { type: 'fill', prompt: 'By 5 p.m. we ____ for eight hours.', hint: 'travel', accept: ['will have been travelling', 'will have been traveling'], why: 'Duration up to a future point: will have been travelling.' },
      { type: 'mcq', prompt: 'Choose the correct sentence.', options: ['She will have been teach for 20 years.', 'She will have been teaching for 20 years.', 'She will has been teaching for 20 years.'], correct: 1, why: 'will have been + verb-ing: will have been teaching.' },
      { type: 'mcq', prompt: 'Which sentence talks about how long an action will have continued?', options: ['Next week he will have been waiting for a reply for a month.', 'Next week he will wait for a reply.', 'Next week he waits for a reply.'], correct: 0, why: '“for a month” + a future point = future perfect continuous.' },
      { type: 'fill', prompt: 'By midnight they ____ for six hours.', hint: 'dance', accept: ['will have been dancing'], why: 'Still going at midnight, measured in hours: will have been dancing.' }
    ]
  }
};

/* The mixed challenge at the end of the page — one question per tense. */
window.TENSE_CHALLENGE = [
  { prompt: 'She ____ in Berlin since 2015.', options: ['is living', 'has lived', 'lived'], correct: 1, tense: 'Present perfect', why: '“Since 2015” connects the past to now, so we use the present perfect: has lived.' },
  { prompt: 'By the time we arrived, the concert ____.', options: ['started', 'has started', 'had started'], correct: 2, tense: 'Past perfect', why: 'One past action happened before another, so the earlier one takes the past perfect.' },
  { prompt: 'Look at those clouds! It ____.', options: ['will rain', 'is going to rain', 'rains'], correct: 1, tense: 'Going to', why: 'There is evidence right in front of you, so use “going to” rather than “will”.' },
  { prompt: 'I ____ dinner when the lights went out.', options: ['cooked', 'was cooking', 'have cooked'], correct: 1, tense: 'Past continuous', why: 'A longer action in progress, interrupted by a short one: past continuous.' },
  { prompt: "Sorry, I can't talk — I ____ to a meeting right now.", options: ['walk', 'am walking', 'have walked'], correct: 1, tense: 'Present continuous', why: 'It is happening at this exact moment: present continuous.' },
  { prompt: 'By next summer, they ____ here for ten years.', options: ['will live', 'will have lived', 'are living'], correct: 1, tense: 'Future perfect', why: 'Completed before a future point: future perfect, will have lived.' },
  { prompt: 'My train ____ at 7:15 every morning.', options: ['leaves', 'is leaving', 'has left'], correct: 0, tense: 'Present simple', why: 'Timetables and repeated routines take the present simple.' },
  { prompt: 'I ____ for you for twenty minutes! Where were you?', options: ['waited', 'have been waiting', 'will wait'], correct: 1, tense: 'Present perfect continuous', why: 'The duration matters and it has just finished: present perfect continuous.' },
  { prompt: 'We ____ the whole match last night.', options: ['have watched', 'watched', 'had watched'], correct: 1, tense: 'Past simple', why: '“Last night” is a finished time, so the past simple is right.' },
  { prompt: 'This time next week I ____ on a beach.', options: ['will lie', 'will be lying', 'lie'], correct: 1, tense: 'Future continuous', why: 'In progress at a future moment: will be lying.' },
  { prompt: 'He was out of breath — he ____ for an hour.', options: ['had been running', 'has run', 'was run'], correct: 0, tense: 'Past perfect continuous', why: 'How long it continued before that past moment: had been running.' },
  { prompt: "Don't worry, I ____ you as soon as I land.", options: ['call', 'am calling', 'will call'], correct: 2, tense: 'Future simple', why: 'A promise made while speaking takes “will”.' }
];
