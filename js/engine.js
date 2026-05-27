/**
 * engine.js — 数学题目生成引擎
 * 支持加法、减法、乘法、除法、混合运算
 * 三级难度：easy / medium / hard
 */

const Engine = (() => {
  'use strict';

  // ---------- 可播种的伪随机数生成器（Mulberry32） ----------
  // 同一 seed 始终生成同一组题目，方便老师复现
  function createRng(seed) {
    let s = seed | 0;
    return () => {
      s |= 0;
      s = (s + 0x6D2B79F5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // ---------- 难度参数配置 ----------
  const DIFFICULTY = {
    easy: {
      label: '简单',
      add:    { min: 1,  max: 10  },
      sub:    { min: 1,  max: 10  },
      mul:    { min: 1,  max: 5   },
      div:    { min: 1,  max: 5   },
      score:  5,
    },
    medium: {
      label: '中等',
      add:    { min: 10, max: 50  },
      sub:    { min: 10, max: 50  },
      mul:    { min: 2,  max: 9   },
      div:    { min: 2,  max: 9   },
      score:  5,
    },
    hard: {
      label: '困难',
      add:    { min: 50, max: 99  },
      sub:    { min: 50, max: 99  },
      mul:    { min: 6,  max: 12  },
      div:    { min: 6,  max: 12  },
      score:  10,
    },
  };

  // ---------- 运算符符号 ----------
  const OP_SYMBOL = {
    add: '+',
    sub: '−',
    mul: '×',
    div: '÷',
  };

  const OP_LIST = ['add', 'sub', 'mul', 'div'];

  // ---------- 生成一道题 ----------
  function generateQuestion(type, diff, rng) {
    const cfg = DIFFICULTY[diff];
    const range = cfg[type] || cfg.add;
    const a = randInt(range.min, range.max, rng);
    let b, answer;

    switch (type) {
      case 'add':
        b = randInt(range.min, range.max, rng);
        answer = a + b;
        break;

      case 'sub':
        // 保证 a >= b（不退位），适合儿童
        b = randInt(range.min, Math.min(a, range.max), rng);
        answer = a - b;
        break;

      case 'mul':
        b = randInt(range.min, range.max, rng);
        answer = a * b;
        break;

      case 'div':
        // 保证整除：b × 随机商 → a
        b = randInt(range.min, range.max, rng);
        const quotient = randInt(range.min, 10, rng);
        // 重新算 a 确保整除
        b = Math.max(range.min, b);
        const adjA = b * quotient;
        // 如果 adjA 超大，缩小 b
        if (adjA > 100 && diff === 'easy') {
          b = randInt(1, 5, rng);
          answer = randInt(1, 9, rng);
          return { type, a: b * answer, b, answer, symbol: OP_SYMBOL[type] };
        }
        answer = quotient;
        return { type, a: b * answer, b, answer, symbol: OP_SYMBOL[type] };

      default:
        b = randInt(range.min, range.max, rng);
        answer = a + b;
    }

    return { type, a, b, answer, symbol: OP_SYMBOL[type] };
  }

  // ---------- 随机整数 [min, max] ----------
  function randInt(min, max, rng) {
    return Math.floor(rng() * (max - min + 1)) + min;
  }

  // ---------- 生成一组题目 ----------
  function generateBatch({ type, count, difficulty, seed }) {
    const rng = seed != null && seed !== '' ? createRng(Number(seed)) : createRng(Date.now());
    const questions = [];

    for (let i = 0; i < count; i++) {
      let opType = type;
      if (type === 'mixed') {
        opType = OP_LIST[i % 4]; // 轮流四种题型，保证分布均匀
      }
      questions.push(generateQuestion(opType, difficulty, rng));
    }

    return questions;
  }

  // ---------- 格式化题目文本（用于渲染） ----------
  function formatQuestion(q, index) {
    const num = index + 1;
    return {
      num,
      text: `${q.a} ${q.symbol} ${q.b} = ___`,
      answer: q.answer,
      html: `
        <span class="q-num">${num}.</span>
        <span class="q-body">
          <span class="op">${q.a}</span>
          <span class="op">${q.symbol}</span>
          <span class="op">${q.b}</span>
          <span class="eq">=</span>
          <span class="blank"></span>
        </span>
      `.trim(),
    };
  }

  // ---------- 公开 API ----------
  return {
    generateBatch,
    formatQuestion,
    DIFFICULTY,
    OP_SYMBOL,
    OP_LIST,
  };
})();
