import { BaseStep } from "./BaseStep.js?v=1.1.162-modal-stack";
import { TextBriefingStep } from "./TextBriefingStep.js?v=1.1.162-modal-stack";
import { VocabularyStep } from "./VocabularyStep.js?v=1.1.162-modal-stack";
import { PhraseStep } from "./PhraseStep.js?v=1.1.162-modal-stack";
import { ListeningStep } from "./ListeningStep.js?v=1.1.162-modal-stack";
import { SpeakingPromptStep } from "./SpeakingPromptStep.js?v=1.1.162-modal-stack";
import { ReflectionStep } from "./ReflectionStep.js?v=1.1.162-modal-stack";
import { EmotionalCheckInStep } from "./EmotionalCheckInStep.js?v=1.1.162-modal-stack";
import { CustomExperienceStep } from "./CustomExperienceStep.js?v=1.1.162-modal-stack";
import { CyberCodeMissionStep } from "./CyberCodeMissionStep.js?v=1.1.162-modal-stack";
import { DragMatchIslandStep } from "./DragMatchIslandStep.js?v=1.1.162-modal-stack";
import { ExternalTaskStep } from "./ExternalTaskStep.js?v=1.1.162-modal-stack";
import {
  CardRevealStep,
  IntroCardStep,
  MatchingStep,
  MultipleChoiceStep,
  OrderingStep,
  ReflectionStep as MainPathReflectionStep,
  RoadmapStep,
  SortingStep
} from "./InteractiveLearningSteps.js?v=1.1.177-level-unlock-roadmap";
export {
  getActivityTemplateDefinition,
  getActivityTemplateOptions,
  getActivityTemplateRegistry,
  getDefaultActivityTemplateId,
  isDefaultActivityTemplate,
  isReadyActivityTemplate,
  normalizeActivityTemplateId
} from "./activityTemplateRegistry.js?v=1.1.177-level-unlock-roadmap";

var stepTypes = {
  "intro-card": IntroCardStep,
  "card-reveal": CardRevealStep,
  sorting: SortingStep,
  "multiple-choice": MultipleChoiceStep,
  roadmap: RoadmapStep,
  matching: MatchingStep,
  ordering: OrderingStep,
  reflection: MainPathReflectionStep,
  "emotional-check-in": EmotionalCheckInStep,
  "mood-reset": EmotionalCheckInStep,
  emotionalcheckin: EmotionalCheckInStep,
  emotionalCheckIn: EmotionalCheckInStep,
  EmotionalCheckIn: EmotionalCheckInStep,
  textBriefing: TextBriefingStep,
  vocabulary: VocabularyStep,
  phrase: PhraseStep,
  listening: ListeningStep,
  speakingPrompt: SpeakingPromptStep,
  reflectionShell: ReflectionStep,
  customExperience: CustomExperienceStep,
  cyberCodeMission: CyberCodeMissionStep,
  dragMatchIsland: DragMatchIslandStep,
  externalTask: ExternalTaskStep
};

export function getStepTypeDefinition(stepType) {
  if (!stepType || !stepTypes[stepType]) {
    return null;
  }

  return stepTypes[stepType];
}

export function listStepTypeDefinitions() {
  void BaseStep;

  return [
    IntroCardStep,
    CardRevealStep,
    SortingStep,
    MultipleChoiceStep,
    RoadmapStep,
    MatchingStep,
    OrderingStep,
    MainPathReflectionStep,
    EmotionalCheckInStep,
    TextBriefingStep,
    VocabularyStep,
    PhraseStep,
    ListeningStep,
    SpeakingPromptStep,
    ReflectionStep,
    CustomExperienceStep,
    CyberCodeMissionStep,
    DragMatchIslandStep,
    ExternalTaskStep
  ];
}

export function isSupportedStepType(stepType) {
  return getStepTypeDefinition(stepType) !== null;
}

export function createDefaultStepConfig(stepType, config) {
  var StepTypeDefinition = getStepTypeDefinition(stepType);

  if (!StepTypeDefinition) {
    if (config && typeof config === "object" && !Array.isArray(config)) {
      return Object.assign({}, config);
    }

    return {};
  }

  return StepTypeDefinition.createConfig(config);
}
