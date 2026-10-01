// data.js
const quizData = [
  {
    id: 1,
    trigger: 'leaf', // 触发这个题目的景物类型
    question: "There are two pine nuts in the snow. What do you do?",
    options: [
      { text: "Pick them up and take a closer look", scores: { curiosity: 2, exploration: 1 } },
      { text: "	Gently walk around them", scores: { calm: 2, curiosity: 0 } }
    ]
  },
  {
    id: 2,
    trigger: 'flower',
    question: "Seeing a small flower blooming in the snow, what is your first reaction?",
    options: [
      { text: "	Lean in and smell it", scores: { curiosity: 1, calm: 1 } },
      { text: "Take a photo as a keepsake", scores: { exploration: 2, calm: 0 } }
    ]
  },
  {
    id: 3,
    trigger: 'fish',
    question: "The little fish in the lake swims away. What do you do?",
    options: [
      { text: "Feel a bit disappointed, watch quietly for a while", scores: { calm: 2, exploration: 0 } },
      { text: "Follow the direction it swam", scores: { exploration: 2, curiosity: 1 } }
    ]
  }
];

// 性格维度定义，用于雷达图
const personalityDimensions = ['curiosity', 'calm', 'exploration'];