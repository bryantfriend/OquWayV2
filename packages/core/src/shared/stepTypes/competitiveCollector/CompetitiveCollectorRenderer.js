import { renderCollectibleItem } from "./CollectibleItem.js?v=1.1.192-timed-sequence";
import { renderCollectorLeaderboard } from "./CollectorLeaderboard.js?v=1.1.192-timed-sequence";
import { renderCollectorResults } from "./CollectorResults.js?v=1.1.192-timed-sequence";
import { renderUpgradePanel } from "./UpgradePanel.js?v=1.1.192-timed-sequence";
import { normalizeCompetitiveCollectorConfig } from "./competitiveCollectorConfig.js?v=1.1.192-timed-sequence";
import {
  buyCompetitiveUpgrade,
  calculateTargetProgress,
  collectCompetitiveItem,
  createCompetitiveCollectorResults,
  createCompetitiveCollectorState,
  tickCompetitiveCollector
} from "./competitiveCollectorEngine.js?v=1.1.192-timed-sequence";

export class CompetitiveCollectorRenderer {
  static renderPlayerShell(StepType, config) {
    var collectorConfig = normalizeCompetitiveCollectorConfig(config);

    return '<style>' + buildCompetitiveCollectorCss() + '</style>'
      + '<article class="competitive-collector-step">'
      + '<div class="collector-root" data-collector-root>'
      + renderCollectorGame(StepType, collectorConfig, createCompetitiveCollectorState(collectorConfig))
      + '</div>'
      + '</article>';
  }

  static attachPlayerHandlers(container, config, complete) {
    var collectorConfig = normalizeCompetitiveCollectorConfig(config);
    var root = container.querySelector("[data-collector-root]");
    var state = createCompetitiveCollectorState(collectorConfig);
    var completeCalled = false;
    var timerId = null;

    if (!root) {
      return;
    }

    function render() {
      root.innerHTML = renderCollectorGame(CompetitiveCollectorRenderer, collectorConfig, state);

      if (state.completed && !completeCalled) {
        completeCalled = true;
        stopTimer();
        window.setTimeout(function () {
          var results = createCompetitiveCollectorResults(collectorConfig, state);

          if (!root.isConnected) {
            return;
          }

          complete({
            success: true,
            score: results.stats.progressPercent,
            data: {
              completed: true,
              template: "competitive-collector",
              subjectTheme: collectorConfig.subjectTheme,
              gameMode: collectorConfig.gameMode,
              finalScore: results.stats.score,
              targetScore: results.stats.targetScore,
              completionTimeSeconds: results.stats.completionTimeSeconds,
              correctClicks: results.stats.correctClicks,
              wrongClicks: results.stats.wrongClicks,
              totalClicks: results.stats.totalClicks,
              starsEarned: results.summary.stars,
              xpEarned: results.summary.xpEarned,
              gamification: results.summary
            }
          });
        }, 900);
      }
    }

    function stopTimer() {
      if (timerId) {
        window.clearInterval(timerId);
        timerId = null;
      }
    }

    root.addEventListener("click", function (event) {
      var itemButton = event.target && event.target.closest ? event.target.closest("[data-collector-item]") : null;
      var upgradeButton = event.target && event.target.closest ? event.target.closest("[data-collector-upgrade]") : null;

      if (itemButton) {
        state = collectCompetitiveItem(collectorConfig, state, itemButton.getAttribute("data-collector-item"));
        render();
        return;
      }

      if (upgradeButton) {
        state = buyCompetitiveUpgrade(collectorConfig, state, upgradeButton.getAttribute("data-collector-upgrade"));
        render();
      }
    });

    timerId = window.setInterval(function () {
      if (!root.isConnected) {
        stopTimer();
        return;
      }

      state = tickCompetitiveCollector(collectorConfig, state);
      render();
    }, 1000);
  }

  static escapeHtml(value) {
    return escapeHtml(value);
  }
}

function renderCollectorGame(StepType, config, state) {
  var progress = calculateTargetProgress(config, state);
  var html = "";

  if (!config.valid) {
    html += '<div class="collector-empty">';
    html += '<strong>Competitive Collector needs items.</strong>';
    html += '<span>Choose a subject theme preset or add collectibles in the editor.</span>';
    html += '</div>';
    return html;
  }

  if (state.completed) {
    return renderCollectorResults(config, state, escapeHtml);
  }

  html += '<div class="collector-shell collector-mode-' + escapeHtml(config.gameMode) + '">';
  html += '<header class="collector-header">';
  html += '<div>';
  html += '<span class="collector-kicker">' + escapeHtml(config.subjectThemeName) + '</span>';
  html += '<h2>' + escapeHtml(config.title) + '</h2>';
  html += '<p>' + escapeHtml(config.instructions) + '</p>';
  html += '</div>';
  html += '<div class="collector-score-card">';
  html += '<strong>' + Math.round(state.score) + '</strong>';
  html += '<span>' + escapeHtml(config.resourceName) + '</span>';
  html += '</div>';
  html += '</header>';

  if (state.modeNotice) {
    html += '<div class="collector-mode-notice">' + escapeHtml(state.modeNotice) + '</div>';
  }

  html += '<section class="collector-progress" aria-label="Collector progress">';
  html += '<div><span>Target</span><strong>' + escapeHtml(String(config.targetScore)) + '</strong></div>';
  html += '<div><span>Timer</span><strong>' + formatTime(state.timeLeft) + '</strong></div>';
  html += '<div><span>Auto</span><strong>' + escapeHtml(String(state.pointsPerSecond)) + '/sec</strong></div>';
  html += '</section>';
  html += '<div class="collector-meter"><span style="width:' + progress + '%"></span></div>';
  html += '<div class="collector-feedback" aria-live="polite">' + escapeHtml(state.feedback) + '</div>';

  html += '<div class="collector-layout">';
  html += '<main class="collector-stage" aria-label="Collectibles">';
  html += '<div class="collector-stage-header"><strong>Collect</strong><span>' + escapeHtml(config.resourceName) + '</span></div>';
  html += '<div class="collector-items">';
  config.collectibles.forEach(function (item) {
    html += renderCollectibleItem(item, escapeHtml);
  });
  html += '</div>';
  html += '</main>';
  html += '<aside class="collector-sidebar">';
  html += renderUpgradePanel(config, state, escapeHtml);
  html += renderCollectorLeaderboard(config, state, escapeHtml);
  html += '</aside>';
  html += '</div>';
  html += '</div>';

  return html;
}

function formatTime(seconds) {
  var safeSeconds = Math.max(0, Math.round(Number(seconds) || 0));
  var minutes = Math.floor(safeSeconds / 60);
  var remainder = safeSeconds % 60;

  return String(minutes) + ":" + (remainder < 10 ? "0" : "") + remainder;
}

function buildCompetitiveCollectorCss() {
  return ".competitive-collector-step{box-sizing:border-box;width:100%;max-width:820px;margin:0 auto;border:1px solid #dbeafe;border-radius:16px;background:#fff;padding:20px;color:#0f172a;box-shadow:0 18px 40px rgba(15,23,42,.08);font-family:Inter,system-ui,sans-serif;}"
    + ".competitive-collector-step *{box-sizing:border-box;}"
    + ".competitive-collector-step button{font:inherit;cursor:pointer;transition:transform .16s,border-color .16s,background .16s,box-shadow .16s;}"
    + ".collector-shell{display:grid;gap:14px;}"
    + ".collector-header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;}"
    + ".collector-kicker{display:inline-flex;margin-bottom:6px;border:1px solid #bfdbfe;border-radius:999px;background:#eff6ff;color:#1d4ed8;padding:4px 9px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}"
    + ".collector-header h2{margin:0 0 8px;color:#0f172a;font-size:26px;line-height:1.15;font-weight:950;}"
    + ".collector-header p{margin:0;color:#475569;font-size:14px;line-height:1.5;font-weight:700;}"
    + ".collector-score-card{flex:0 0 auto;min-width:108px;border:1px solid #bbf7d0;border-radius:16px;background:#ecfdf5;padding:12px;text-align:center;color:#047857;}"
    + ".collector-score-card strong{display:block;font-size:28px;font-weight:950;line-height:1;}"
    + ".collector-score-card span{display:block;margin-top:4px;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}"
    + ".collector-mode-notice{border:1px solid #fed7aa;border-radius:12px;background:#fff7ed;color:#9a3412;padding:9px 11px;font-size:12px;font-weight:850;line-height:1.35;}"
    + ".collector-progress{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;}"
    + ".collector-progress div{min-width:0;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px;text-align:center;}"
    + ".collector-progress span{display:block;color:#64748b;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.07em;}"
    + ".collector-progress strong{display:block;margin-top:4px;color:#0f172a;font-size:15px;font-weight:950;}"
    + ".collector-meter{height:11px;border-radius:999px;background:#e2e8f0;overflow:hidden;box-shadow:inset 0 1px 2px rgba(15,23,42,.08);}"
    + ".collector-meter span{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#2563eb,#22c55e);transition:width .25s ease;}"
    + ".collector-feedback{min-height:34px;border:1px solid #dbeafe;border-radius:14px;background:#f8fafc;padding:10px 12px;color:#475569;font-size:13px;font-weight:850;line-height:1.4;}"
    + ".collector-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(210px,.42fr);gap:14px;align-items:start;}"
    + ".collector-stage,.collector-panel{min-width:0;border:1px solid #dbeafe;border-radius:16px;background:#ffffff;padding:12px;box-shadow:0 10px 22px rgba(15,23,42,.06);}"
    + ".collector-stage-header,.collector-panel-header{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px;}"
    + ".collector-stage-header strong,.collector-panel-header strong{color:#0f172a;font-size:13px;font-weight:950;}"
    + ".collector-stage-header span,.collector-panel-header span{color:#64748b;font-size:10px;font-weight:950;text-transform:uppercase;letter-spacing:.08em;}"
    + ".collector-items{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:10px;}"
    + ".collector-item{min-width:0;min-height:116px;display:grid;justify-items:center;align-content:center;gap:7px;border:1px solid #cbd5e1;border-radius:16px;background:#fff;text-align:center;padding:12px;color:#0f172a;}"
    + ".collector-item:hover{transform:translateY(-2px);border-color:#60a5fa;background:#eff6ff;box-shadow:0 12px 24px rgba(37,99,235,.12);}"
    + ".collector-item-orb{display:grid;place-items:center;width:38px;height:38px;border-radius:999px;background:#2563eb;color:#fff;font-size:18px;font-weight:950;line-height:1;}"
    + ".collector-item strong{max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:13px;font-weight:950;line-height:1.2;}"
    + ".collector-item em{font-style:normal;color:#047857;font-size:12px;font-weight:950;}"
    + ".collector-item-rare{border-color:#fde68a;background:#fffbeb;}"
    + ".collector-item-rare .collector-item-orb{background:#f59e0b;}"
    + ".collector-item-incorrect .collector-item-orb{background:#f97316;}"
    + ".collector-sidebar{display:grid;gap:12px;}"
    + ".collector-muted{border:1px dashed #cbd5e1;border-radius:12px;background:#f8fafc;padding:12px;color:#64748b;font-size:12px;font-weight:800;line-height:1.4;}"
    + ".collector-upgrade{width:100%;min-height:52px;display:flex;align-items:center;justify-content:space-between;gap:10px;border:1px solid #cbd5e1;border-radius:12px;background:#fff;padding:9px;text-align:left;color:#0f172a;margin-top:8px;}"
    + ".collector-upgrade:hover:not(:disabled){background:#eff6ff;border-color:#60a5fa;}"
    + ".collector-upgrade:disabled{opacity:.52;cursor:not-allowed;}"
    + ".collector-upgrade span{min-width:0;display:grid;gap:2px;}"
    + ".collector-upgrade strong{font-size:12px;font-weight:950;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}"
    + ".collector-upgrade em{font-size:10px;font-style:normal;font-weight:850;color:#64748b;}"
    + ".collector-upgrade b{flex:0 0 auto;border-radius:999px;background:#111827;color:#fff;padding:5px 8px;font-size:11px;font-weight:950;}"
    + ".collector-leader-row{display:grid;grid-template-columns:24px minmax(0,1fr) auto;align-items:center;gap:8px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;padding:7px 8px;margin-top:6px;}"
    + ".collector-leader-row.is-current{border-color:#86efac;background:#ecfdf5;color:#047857;}"
    + ".collector-leader-row span{font-size:11px;font-weight:950;color:#64748b;}"
    + ".collector-leader-row strong{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px;font-weight:950;}"
    + ".collector-leader-row b{font-size:12px;font-weight:950;}"
    + ".collector-empty{border:1px dashed #cbd5e1;border-radius:16px;background:#f8fafc;padding:18px;color:#475569;display:grid;gap:5px;}"
    + ".collector-empty strong{color:#0f172a;font-size:15px;font-weight:950;}"
    + ".collector-empty span{font-size:13px;font-weight:750;line-height:1.45;}"
    + ".collector-results{display:grid;gap:12px;}"
    + ".activity-results-card{display:grid;justify-items:center;gap:10px;width:100%;border:1px solid #bbf7d0;border-radius:18px;background:linear-gradient(135deg,#ecfdf5,#ffffff);padding:22px;text-align:center;}"
    + ".activity-celebration{display:inline-flex;align-items:center;justify-content:center;min-height:26px;border-radius:999px;border:1px solid #dbeafe;background:#eff6ff;color:#1d4ed8;padding:4px 10px;font-size:11px;font-weight:950;line-height:1;text-transform:uppercase;letter-spacing:.06em;}"
    + ".activity-celebration-perfect,.activity-celebration-complete{border-color:#bbf7d0;background:#ecfdf5;color:#047857;}"
    + ".activity-results-heading{display:grid;gap:4px;}.activity-results-heading strong{color:#0f172a;font-size:18px;font-weight:950;line-height:1.2;}.activity-results-heading span{color:#047857;font-size:13px;font-weight:850;line-height:1.4;}"
    + ".activity-results-score{width:84px;height:84px;border-radius:999px;display:grid;place-items:center;background:#2563eb;color:#fff;font-size:24px;font-weight:950;box-shadow:0 16px 34px rgba(37,99,235,.2);}"
    + ".activity-results-stars{display:flex;align-items:center;justify-content:center;gap:3px;font-size:22px;line-height:1;}.activity-results-stars .is-earned{color:#f59e0b;}.activity-results-stars .is-empty{color:#cbd5e1;}"
    + ".activity-results-grid,.collector-results-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;width:100%;}"
    + ".activity-results-grid div,.collector-results-grid div{min-width:0;border:1px solid #dbeafe;border-radius:12px;background:#fff;padding:9px 8px;text-align:center;}"
    + ".activity-results-grid span,.collector-results-grid span{display:block;color:#64748b;font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:.06em;}"
    + ".activity-results-grid strong,.collector-results-grid strong{display:block;margin-top:3px;color:#0f172a;font-size:14px;font-weight:950;}"
    + "@media(max-width:720px){.competitive-collector-step{padding:16px;border-radius:12px;}.collector-header{display:grid;}.collector-score-card{width:100%;}.collector-progress,.collector-layout,.activity-results-grid,.collector-results-grid{grid-template-columns:1fr;}.collector-items{grid-template-columns:repeat(2,minmax(0,1fr));}.collector-item{min-height:104px;}.collector-sidebar{grid-row:auto;}}";
}

function escapeHtml(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
