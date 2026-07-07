import {
  destroyLearningActivityTemplate,
  renderLearningActivityTemplate
} from "../../../templateRenderer.js?v=1.1.228-learning-activity-drag-interactions";

export function renderTemplate(activityContext) {
  renderLearningActivityTemplate(activityContext, {
    eyebrow: "Card Reveal",
    title: "Speed Reveal Stack",
    layout: "skill-sprint",
    interaction: "reveal",
    accent: "#16a34a",
    completeLabel: "Complete stack"
  });
}

export function destroyTemplate(activityContext) {
  destroyLearningActivityTemplate(activityContext);
}

export function getTemplateDefaultContent() {
  return {
    templateId: "speed-reveal-stack",
    title: "Speed Reveal Stack",
    instructions: "Reveal each quick card to finish the stack.",
    cards: [
      { id: "speed-1", front: "Clue", back: "Answer" },
      { id: "speed-2", front: "Example", back: "Explanation" },
      { id: "speed-3", front: "Check", back: "Why it works" }
    ]
  };
}

export function getTemplatePreviewContent() {
  return {
    templateId: "speed-reveal-stack",
    title: "Speed Reveal Stack",
    instructions: "Reveal each card in the rapid review stack.",
    cards: [
      { id: "speed-preview-1", front: "Input", back: "Data given to a program" },
      { id: "speed-preview-2", front: "Process", back: "Steps the program follows" },
      { id: "speed-preview-3", front: "Output", back: "The result produced" }
    ]
  };
}
