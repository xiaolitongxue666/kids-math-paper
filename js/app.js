/**
 * app.js — 主应用逻辑
 * 绑定 UI 控件、驱动题目生成与渲染
 */

(() => {
  'use strict';

  const $ = (id) => document.getElementById(id);

  // ---------- DOM 引用 ----------
  const container   = $('printContainer');
  const btnGenerate = $('btnGenerate');
  const btnPrint    = $('btnPrint');

  // ---------- 读取控件配置 ----------
  function getOptions() {
    const checkedTypes = Array.from(document.querySelectorAll('.op-cb:checked'))
      .map(cb => cb.value);
    return {
      types:      checkedTypes,
      difficulty: $('difficulty').value,
      count:      parseInt($('count').value, 10),
      cols:       parseInt($('columns').value, 10),
      showAnswer: $('showAnswer').value,
      pageMode:   $('pageMode').value,
      seed:       $('seed').value,
      scorePerQ:  parseInt($('scorePerQ').value, 10) || 5,
    };
  }

  // ---------- 生成并渲染 ----------
  function generate() {
    const opts = getOptions();

    const questions = Engine.generateBatch({
      types:      opts.types,
      count:      opts.count,
      difficulty: opts.difficulty,
      seed:       opts.seed || undefined,
    });

    const html = PrintLayout.renderAll(questions, {
      cols:       opts.cols,
      showAnswer: opts.showAnswer,
      scorePerQ:  opts.scorePerQ,
      pageMode:   opts.pageMode,
    });

    container.innerHTML = html;
  }

  // ---------- 打印 ----------
  function printSheets() {
    window.print();
  }

  // ---------- 键盘快捷键 ----------
  function onKeydown(e) {
    // Ctrl+Enter / Cmd+Enter → 生成
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      generate();
    }
    // Ctrl+P / Cmd+P → 打印
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      // 浏览器原生打印可由用户触发，我们不劫持，但提供按钮
    }
  }

  // ---------- 页面加载后自动生成 ----------
  function init() {
    btnGenerate.addEventListener('click', generate);
    btnPrint.addEventListener('click', printSheets);
    document.addEventListener('keydown', onKeydown);

    // 自动生成第一组
    generate();
  }

  // 等 DOM 就绪
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
