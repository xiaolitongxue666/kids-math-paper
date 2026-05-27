/**
 * print.js — 打印布局与分页控制
 * 将题目数组渲染为 A4 打印页面
 */

const PrintLayout = (() => {
  'use strict';

  // 每页可容纳的题目数（取决于字号和列数）
  // 估算值：3列时约 15-18 题/页，2列时约 12-14 题/页
  const ITEMS_PER_PAGE = {
    2: 14,
    3: 18,
    4: 24,
  };

  /**
   * 将题目分页
   * @param {Array} questions - Engine.formatQuestion() 输出
   * @param {number} cols - 列数（2/3/4）
   * @param {string} pageMode - 'single' | 'multi'
   * @returns {Array<Array>} 每个元素是一页的题目数组
   */
  function paginate(questions, cols, pageMode) {
    if (pageMode === 'single') {
      return [questions]; // 全部塞到一页
    }
    const perPage = ITEMS_PER_PAGE[cols] || 18;
    const pages = [];
    for (let i = 0; i < questions.length; i += perPage) {
      pages.push(questions.slice(i, i + perPage));
    }
    return pages;
  }

  /**
   * 渲染一页的 HTML
   * @param {Array} pageQuestions - 该页的题目数组
   * @param {number} pageNum - 页码（从1开始）
   * @param {number} totalPages - 总页数
   * @param {number} cols - 列数
   * @param {string} showAnswer - 'no' | 'after' | 'separate'
   * @param {number} scorePerQ - 每题分值
   * @param {string} pageMode - 'single' | 'multi'
   * @returns {string} HTML 字符串
   */
  function renderPage(pageQuestions, { pageNum, totalPages, cols, showAnswer, scorePerQ, pageMode }) {
    const title = pageMode === 'single' ? '数学练习题' : `数学练习题 — 第 ${pageNum} 页`;
    const colsClass = `cols-${cols}`;

    let questionsHtml = '';
    for (const q of pageQuestions) {
      let answerHtml = '';
      if (showAnswer === 'after') {
        answerHtml = `<span class="q-answer">(${q.answer})</span>`;
      }
      questionsHtml += `
        <div class="question-item">
          ${q.html}
          ${answerHtml}
        </div>
      `;
    }

    const totalScore = scorePerQ * pageQuestions.length;

    return `
      <div class="print-page">
        <div class="page-header">
          <span class="page-title">${title}</span>
          <span class="page-meta">
            <span class="field">姓名:<span class="blank"></span></span>
            <span class="field">日期:<span class="blank"></span></span>
            <span class="field">用时:<span class="blank"></span>分</span>
            <span class="field">得分:___/${totalScore}</span>
          </span>
        </div>
        <div class="question-grid ${colsClass}">
          ${questionsHtml}
        </div>
        <div class="page-footer">
          共 ${totalPages} 页 · 第 ${pageNum} 页
        </div>
      </div>
    `;
  }

  /**
   * 渲染答案汇总页
   * @param {Array} allQuestions - 所有题目的 formatQuestion 输出
   * @returns {string} HTML
   */
  function renderAnswerSheet(allQuestions) {
    let listHtml = '';
    for (const q of allQuestions) {
      listHtml += `
        <div class="ans-item">
          <span class="ans-num">${q.num}.</span>
          <span class="ans-val">${q.answer}</span>
        </div>
      `;
    }

    return `
      <div class="answer-sheet-page">
        <div class="page-header">
          <span class="page-title">参考答案</span>
          <span class="page-meta">
            <span>共 ${allQuestions.length} 题</span>
          </span>
        </div>
        <div class="answer-list">
          ${listHtml}
        </div>
        <div class="page-footer">参考答案 · 仅供参考</div>
      </div>
    `;
  }

  /**
   * 渲染完整打印内容
   * @param {Array} questions - Engine.generateBatch() 的原始输出
   * @param {Object} opts
   * @returns {string} 完整 HTML（不含 <html>/<head>，仅内容区）
   */
  function renderAll(questions, opts) {
    const { cols = 3, showAnswer = 'no', scorePerQ = 5, pageMode = 'multi' } = opts;

    const formatted = questions.map((q, i) => Engine.formatQuestion(q, i));
    const pages = paginate(formatted, cols, pageMode);
    let html = '';

    for (let i = 0; i < pages.length; i++) {
      html += renderPage(pages[i], {
        pageNum: i + 1,
        totalPages: pages.length,
        cols,
        showAnswer,
        scorePerQ,
        pageMode,
      });
    }

    // 尾页答案汇总
    if (showAnswer === 'separate' && formatted.length > 0) {
      html += renderAnswerSheet(formatted);
    }

    return html;
  }

  return { renderAll, paginate };
})();
