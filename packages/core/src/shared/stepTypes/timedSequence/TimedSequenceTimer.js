export function renderTimedSequenceTimer(state, escapeHtml) {
  var progress = Math.max(0, Math.min(1, Number(state.timerProgress) || 0));

  return '<div class="timed-sequence-timer">'
    + '<div><span>Time Remaining</span><strong data-timed-sequence-timer-text>' + escapeHtml(String(state.timeRemaining)) + 's</strong></div>'
    + '<div class="timed-sequence-timer-track"><span data-timed-sequence-timer-bar style="width:' + Math.round(progress * 100) + '%"></span></div>'
    + '</div>';
}
