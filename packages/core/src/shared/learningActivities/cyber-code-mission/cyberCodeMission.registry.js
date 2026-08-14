import { createStepBackedActivityDefinition } from "../stepBackedActivityFactory.js?v=1.1.231-platform-performance-release";
import { CyberCodeMissionStep } from "../../stepTypes/CyberCodeMissionStep.js?v=1.1.231-platform-performance-release";
import { cyberCodeMissionSchema } from "./cyberCodeMission.schema.js?v=1.1.231-platform-performance-release";
import { cyberCodeMissionStandardMeta } from "./templates/cyber-code-mission-standard/cyberCodeMissionStandard.meta.js?v=1.1.231-platform-performance-release";
import * as cyberCodeMissionStandardTemplate from "./templates/cyber-code-mission-standard/cyberCodeMissionStandard.template.js?v=1.1.231-platform-performance-release";
import { cyberCodeMissionDebugBriefMeta } from "./templates/cyber-code-mission-debug-brief/cyberCodeMissionDebugBrief.meta.js?v=1.1.231-platform-performance-release";
import * as cyberCodeMissionDebugBriefTemplate from "./templates/cyber-code-mission-debug-brief/cyberCodeMissionDebugBrief.template.js?v=1.1.231-platform-performance-release";
import { cyberCodeMissionHtmlRescueMeta } from "./templates/cyber-code-mission-html-rescue/cyberCodeMissionHtmlRescue.meta.js?v=1.1.231-platform-performance-release";
import * as cyberCodeMissionHtmlRescueTemplate from "./templates/cyber-code-mission-html-rescue/cyberCodeMissionHtmlRescue.template.js?v=1.1.231-platform-performance-release";
import { cyberCodeMissionFirewallBossMeta } from "./templates/cyber-code-mission-firewall-boss/cyberCodeMissionFirewallBoss.meta.js?v=1.1.231-platform-performance-release";
import * as cyberCodeMissionFirewallBossTemplate from "./templates/cyber-code-mission-firewall-boss/cyberCodeMissionFirewallBoss.template.js?v=1.1.231-platform-performance-release";
import { cyberCodeMissionPatchTimelineMeta } from "./templates/cyber-code-mission-patch-timeline/cyberCodeMissionPatchTimeline.meta.js?v=1.1.231-platform-performance-release";
import * as cyberCodeMissionPatchTimelineTemplate from "./templates/cyber-code-mission-patch-timeline/cyberCodeMissionPatchTimeline.template.js?v=1.1.231-platform-performance-release";

export const cyberCodeMissionActivityDefinition = createStepBackedActivityDefinition({
  StepTypeDefinition: CyberCodeMissionStep,
  activityType: "cyberCodeMission",
  legacyStepType: "cyberCodeMission",
  displayName: "Cyber Code Mission",
  description: "A cyber-styled shell for coding and HTML missions.",
  icon: "fa-solid fa-code",
  category: "Coding",
  complexity: "Advanced",
  templateId: "cyberCodeMission-standard",
  templateDisplayName: "Terminal Repair",
  registryFile: "packages/core/src/shared/learningActivities/cyber-code-mission/cyberCodeMission.registry.js",
  activityFile: "packages/core/src/shared/learningActivities/cyber-code-mission/cyberCodeMission.activity.js",
  schemaFile: "packages/core/src/shared/learningActivities/cyber-code-mission/cyberCodeMission.schema.js",
  schema: cyberCodeMissionSchema,
  templates: [
    {
      meta: cyberCodeMissionStandardMeta,
      module: cyberCodeMissionStandardTemplate
    },
    {
      meta: cyberCodeMissionDebugBriefMeta,
      module: cyberCodeMissionDebugBriefTemplate
    },
    {
      meta: cyberCodeMissionHtmlRescueMeta,
      module: cyberCodeMissionHtmlRescueTemplate
    },
    {
      meta: cyberCodeMissionFirewallBossMeta,
      module: cyberCodeMissionFirewallBossTemplate
    },
    {
      meta: cyberCodeMissionPatchTimelineMeta,
      module: cyberCodeMissionPatchTimelineTemplate
    }
  ]
});
