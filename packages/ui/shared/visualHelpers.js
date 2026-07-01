/**
 * Shared visual helpers for OquWay learning activities.
 * Provides inline SVGs and CSS animations to enhance step types visually
 * without depending on external assets or causing layout thrashing.
 */

export function buildSharedActivityCss() {
  return `
    <style>
      @media (prefers-reduced-motion: no-preference) {
        @keyframes oqu-float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
        @keyframes oqu-pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes oqu-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes oqu-pop {
          0% { transform: scale(0.9); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes oqu-scan {
          0% { transform: translateY(-100%); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        @keyframes oqu-glow-pulse {
          0% { box-shadow: 0 0 5px rgba(37, 99, 235, 0.2); }
          50% { box-shadow: 0 0 20px rgba(37, 99, 235, 0.6); }
          100% { box-shadow: 0 0 5px rgba(37, 99, 235, 0.2); }
        }
        
        .oqu-anim-float { animation: oqu-float 3s ease-in-out infinite; }
        .oqu-anim-pulse { animation: oqu-pulse 2s ease-in-out infinite; }
        .oqu-anim-pop { animation: oqu-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .oqu-anim-glow { animation: oqu-glow-pulse 2.5s ease-in-out infinite; }
      }

      /* Base layout utility to protect interactions */
      .oqu-decorative-overlay {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
      }

      .oqu-interactive-content {
        position: relative;
        z-index: 10;
      }
      
      /* Standardized card enhancements */
      .oqu-enhanced-card {
        background: #ffffff;
        border-radius: 16px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.05);
        border: 1px solid var(--line, #dbe5f2);
        padding: 24px;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      
      .oqu-enhanced-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0,0,0,0.08);
      }
      
      .oqu-icon-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 12px;
        background: var(--soft-blue, #eff6ff);
        color: var(--blue, #2563eb);
        margin-bottom: 16px;
      }
      
      /* Progress accents */
      .oqu-reading-progress {
        height: 4px;
        background: var(--line, #dbe5f2);
        border-radius: 2px;
        overflow: hidden;
        margin-top: 16px;
      }
      .oqu-reading-progress-bar {
        height: 100%;
        background: var(--blue, #2563eb);
        width: 0%;
        transition: width 1s ease-out;
      }
    </style>
  `;
}

export function buildSvgDocumentIcon() {
  return `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `;
}

export function buildSvgFlashcardIcon() {
  return `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
      <line x1="3" y1="10" x2="21" y2="10"></line>
      <line x1="8" y1="15" x2="16" y2="15"></line>
    </svg>
  `;
}

export function buildSvgSpeechBubble() {
  return `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  `;
}

export function buildSvgHeadphones() {
  return `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"></path>
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"></path>
    </svg>
  `;
}

export function buildSvgMicrophone() {
  return `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="22"></line>
    </svg>
  `;
}

export function buildSvgTerminal() {
  return `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `;
}

export function buildSvgIslandMap() {
  return `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
      <line x1="9" y1="3" x2="9" y2="18"></line>
      <line x1="15" y1="6" x2="15" y2="21"></line>
    </svg>
  `;
}

export function buildSvgChecklist() {
  return `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M9 11l3 3L22 4"></path>
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
    </svg>
  `;
}

export function buildSvgSparkles() {
  return \`
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="oqu-decorative-overlay">
      <circle cx="15" cy="20" r="3" fill="#fcd34d" class="oqu-anim-float" style="animation-delay: 0.1s" />
      <circle cx="85" cy="30" r="4" fill="#60a5fa" class="oqu-anim-float" style="animation-delay: 0.5s" />
      <circle cx="75" cy="80" r="2" fill="#a78bfa" class="oqu-anim-float" style="animation-delay: 0.9s" />
      <circle cx="25" cy="70" r="3" fill="#34d399" class="oqu-anim-float" style="animation-delay: 0.3s" />
    </svg>
  \`;
}
