import { BaseStep } from "./BaseStep.js?v=1.1.82-shared-command-center-shell";
import { buildSharedActivityCss, buildSvgTerminal } from "../../../../../packages/ui/shared/visualHelpers.js?v=1.1.83-student-assignment-load";

export class CyberCodeMissionStep extends BaseStep {
  static get type() {
    return "cyberCodeMission";
  }

  static get label() {
    return "Cyber Code Mission";
  }

  static get description() {
    return "A cyber-styled shell for coding and HTML missions.";
  }

  static get category() {
    return "Coding";
  }

  static get complexity() {
    return "Advanced";
  }

  static get previewMode() {
    return "full";
  }

  static get completionMode() {
    return "manual";
  }

  static get defaultConfig() {
    return {
      missionTitle: "",
      missionSubtitle: "",
      instructions: "",
      starterCode: "",
      successMessage: "",
      theme: ""
    };
  }

  static get editorSchema() {
    return {
      fields: [
        {
          key: "missionTitle",
          label: "Mission Title",
          type: "text"
        },
        {
          key: "missionSubtitle",
          label: "Mission Subtitle",
          type: "text"
        },
        {
          key: "instructions",
          label: "Instructions",
          type: "textarea"
        },
        {
          key: "starterCode",
          label: "Starter Code",
          type: "textarea"
        },
        {
          key: "successMessage",
          label: "Success Message",
          type: "text"
        },
        {
          key: "theme",
          label: "Theme",
          type: "text"
        }
      ]
    };
  }

  static renderPlayerShell(config) {
    var missionTitle = this.readText(config, "missionTitle", "Cyber Code Mission");
    var missionSubtitle = this.readText(config, "missionSubtitle", "Repair the HTML signal.");
    var instructions = this.readText(config, "instructions", "Read the mission, inspect the starter code, and complete the challenge.");
    var starterCode = this.readText(config, "starterCode", "<h1>Hello OquWay</h1>");
    var successMessage = this.readText(config, "successMessage", "Mission complete.");
    var theme = this.readText(config, "theme", "neon");
    var html = "";

    html += buildSharedActivityCss();

    html += '<article class="oqu-player-step oqu-full-experience-step oqu-cyber-mission-step" style="position: relative; max-width: 900px; margin: 0 auto; background: #0f172a; border-radius: 16px; overflow: hidden; border: 1px solid #334155; box-shadow: 0 20px 40px rgba(0,0,0,0.4); font-family: monospace;">';
    
    // Scanline effect
    html += '<div class="oqu-decorative-overlay" style="background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1)); background-size: 100% 4px; pointer-events: none; z-index: 1;"></div>';
    
    html += '<div class="oqu-interactive-content" style="padding: 32px; z-index: 2; position: relative;">';
    
    html += '<div class="oqu-experience-kicker" style="color: #38bdf8; font-weight: bold; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px; display: flex; align-items: center; gap: 8px;">';
    html += '<span style="display: inline-block; width: 8px; height: 8px; background: #38bdf8; border-radius: 50%; box-shadow: 0 0 10px #38bdf8;" class="oqu-anim-pulse"></span> SYSTEM: ' + this.escapeHtml(theme);
    html += '</div>';

    html += '<section class="oqu-cyber-mission-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; border-bottom: 1px solid #1e293b; padding-bottom: 24px;">';
    html += '<div>';
    html += '<h2 style="font-size: 2rem; color: #f8fafc; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.05em; text-shadow: 0 0 10px rgba(248,250,252,0.3);">' + this.escapeHtml(missionTitle) + '</h2>';
    html += '<p style="color: #94a3b8; font-size: 1.1rem; margin: 0;">> ' + this.escapeHtml(missionSubtitle) + '</p>';
    html += '</div>';
    html += '<div style="background: rgba(56, 189, 248, 0.1); border: 1px solid #38bdf8; color: #38bdf8; padding: 12px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">' + buildSvgTerminal() + '</div>';
    html += '</section>';

    html += '<div class="oqu-cyber-layout" style="display: grid; grid-template-columns: 1fr; gap: 24px; margin-bottom: 32px;">';
    
    html += '<div class="oqu-cyber-panel" style="background: #1e293b; border-left: 4px solid #38bdf8; padding: 24px; border-radius: 0 8px 8px 0;">';
    html += '<strong style="color: #38bdf8; display: block; margin-bottom: 12px; text-transform: uppercase;">Mission Briefing</strong>';
    html += '<p style="color: #cbd5e1; line-height: 1.6; margin: 0; font-family: sans-serif;">' + this.escapeHtml(instructions) + '</p>';
    html += '</div>';

    html += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">';
    
    html += '<div class="oqu-cyber-code-area" style="background: #020617; border: 1px solid #334155; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;">';
    html += '<div class="oqu-cyber-window-label" style="background: #1e293b; color: #94a3b8; padding: 8px 16px; font-size: 0.85rem; border-bottom: 1px solid #334155; display: flex; align-items: center; gap: 8px;"><span style="width: 10px; height: 10px; border-radius: 50%; background: #ef4444; display: inline-block;"></span><span style="width: 10px; height: 10px; border-radius: 50%; background: #eab308; display: inline-block;"></span><span style="width: 10px; height: 10px; border-radius: 50%; background: #22c55e; display: inline-block;"></span> terminal.html</div>';
    html += '<pre style="padding: 16px; margin: 0; color: #a5b4fc; overflow-x: auto; flex: 1;">' + this.escapeHtml(starterCode) + '</pre>';
    html += '</div>';

    html += '<div class="oqu-cyber-preview-area" style="background: white; border: 1px solid #cbd5e1; border-radius: 8px; overflow: hidden; display: flex; flex-direction: column;">';
    html += '<div class="oqu-cyber-window-label" style="background: #f1f5f9; color: #64748b; padding: 8px 16px; font-size: 0.85rem; border-bottom: 1px solid #cbd5e1; font-family: sans-serif;">Live Preview</div>';
    html += '<div class="oqu-cyber-preview-box" style="padding: 16px; color: var(--ink); font-family: sans-serif; flex: 1; display: flex; align-items: center; justify-content: center; background: repeating-linear-gradient(45deg, #f8fafc, #f8fafc 10px, #ffffff 10px, #ffffff 20px);">[Rendered Output]</div>';
    html += '</div>';
    
    html += '</div>';
    html += '</div>';

    html += '<div class="oqu-cyber-success" style="display: none; background: rgba(34, 197, 94, 0.1); border: 1px solid #22c55e; color: #22c55e; padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: center; font-weight: bold;">[SUCCESS]: ' + this.escapeHtml(successMessage) + '</div>';

    html += '<button type="button" class="oqu-player-complete-btn" style="background: #38bdf8; color: #0f172a; border: none; padding: 16px; border-radius: 8px; font-weight: bold; font-size: 1.1rem; cursor: pointer; width: 100%; transition: all 0.2s; text-transform: uppercase; letter-spacing: 0.1em; font-family: monospace;">Execute Sequence</button>';
    
    html += '</div>';
    html += '</article>';

    return html;
  }
}
