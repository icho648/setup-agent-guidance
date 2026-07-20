(() => {
  "use strict";

  const text = (value) => String(value || "").trim();

  function setFeedback(question, message, state) {
    const output = question.querySelector("[data-feedback]");
    question.classList.remove("is-correct", "is-incorrect");
    if (state) question.classList.add(`is-${state}`);
    if (output) output.textContent = message;
  }

  function checkQuiz(quiz) {
    const questions = [...quiz.querySelectorAll("[data-question]")];
    let correct = 0;
    let answered = 0;

    questions.forEach((question) => {
      const selected = question.querySelector("input[type='radio']:checked");
      const expected = text(question.dataset.answer);

      if (!selected) {
        setFeedback(question, "请先选择一个答案。", "");
        return;
      }

      answered += 1;
      if (text(selected.value) === expected) {
        correct += 1;
        setFeedback(
          question,
          text(question.dataset.correctFeedback) || "正确。请继续解释判断依据。",
          "correct",
        );
      } else {
        setFeedback(
          question,
          text(question.dataset.incorrectFeedback) || "还不符合核对标准，请根据提示重试。",
          "incorrect",
        );
      }
    });

    quiz.dataset.attempts = String(Number(quiz.dataset.attempts || 0) + 1);
    const summary = quiz.querySelector("[data-summary]");
    const message =
      answered === questions.length
        ? `本次答对 ${correct}/${questions.length}，累计尝试 ${quiz.dataset.attempts} 次。`
        : `已回答 ${answered}/${questions.length}；请完成后再检查。`;
    if (summary) summary.textContent = message;
    quiz.dataset.lastSummary = message;
  }

  function retryQuiz(quiz) {
    quiz.querySelectorAll("[data-question]").forEach((question) => {
      question.querySelectorAll("input[type='radio']").forEach((input) => {
        input.checked = false;
      });
      setFeedback(question, "", "");
    });
    delete quiz.dataset.lastSummary;
    const summary = quiz.querySelector("[data-summary]");
    if (summary) summary.textContent = "已清空本轮答案，可以重新尝试。";
  }

  function invalidateSummary(quiz) {
    if (!quiz.dataset.lastSummary) return;
    delete quiz.dataset.lastSummary;
    const summary = quiz.querySelector("[data-summary]");
    if (summary) summary.textContent = "答案已修改，请重新检查以更新结果。";
  }

  async function copyText(value, output) {
    try {
      await navigator.clipboard.writeText(value);
      if (output) output.textContent = "结果与答案已复制，请在对话中提交以获得反馈。";
    } catch {
      const helper = document.createElement("textarea");
      helper.value = value;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
      if (output) output.textContent = "结果与答案已复制，请在对话中提交以获得反馈。";
    }
  }

  function buildResultText(quiz) {
    const title = document.querySelector("h1")?.textContent || "交互练习";
    const lines = [title, ""];

    const textareas = document.querySelectorAll(".lesson textarea");
    if (textareas.length) {
      lines.push("自由作答：");
      textareas.forEach((ta, i) => {
        const label =
          (ta.labels && ta.labels[0] && ta.labels[0].textContent) ||
          `第 ${i + 1} 项`;
        const answer = text(ta.value) || "（未填写）";
        lines.push(`- ${label}：${answer}`);
      });
      lines.push("");
    }

    const questions = [...quiz.querySelectorAll("[data-question]")];
    if (questions.length) {
      lines.push("选择题：");
      questions.forEach((question, i) => {
        const legend =
          question.querySelector("legend")?.textContent || `第 ${i + 1} 题`;
        const selected = question.querySelector("input[type='radio']:checked");
        const expected = text(question.dataset.answer);
        let answerText = "未作答";
        let mark = " ✗";
        if (selected) {
          answerText =
            selected.parentElement?.textContent?.trim() || selected.value;
          mark = text(selected.value) === expected ? " ✓" : " ✗";
        }
        lines.push(`- ${legend}：${answerText}${mark}`);
      });
      lines.push("");
    }

    const summary = quiz.dataset.lastSummary || "尚未完成检查。";
    lines.push(`结果：${summary}`);
    return lines.join("\n");
  }

  document.querySelectorAll("[data-quiz]").forEach((quiz) => {
    quiz.dataset.attempts = "0";
    quiz.querySelector("[data-action='check']")?.addEventListener("click", () => {
      checkQuiz(quiz);
    });
    quiz.querySelector("[data-action='retry']")?.addEventListener("click", () => {
      retryQuiz(quiz);
    });
    quiz.querySelector("[data-action='copy']")?.addEventListener("click", () => {
      copyText(buildResultText(quiz), quiz.querySelector("[data-summary]"));
    });
    quiz.querySelectorAll("input[type='radio']").forEach((input) => {
      input.addEventListener("change", () => {
        const question = input.closest("[data-question]");
        if (question) setFeedback(question, "", "");
        invalidateSummary(quiz);
      });
    });
  });

  document.querySelectorAll("[data-reveal]").forEach((section) => {
    const button = section.querySelector("[data-action='reveal']");
    const rubric = section.querySelector("[data-rubric]");
    button?.addEventListener("click", () => {
      if (!rubric) return;
      rubric.hidden = false;
      button.setAttribute("aria-expanded", "true");
    });
  });
})();
