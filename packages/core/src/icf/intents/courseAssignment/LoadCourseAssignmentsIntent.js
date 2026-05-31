import { ListCourseAssignmentsIntent } from "./ListCourseAssignmentsIntent.js";

export function LoadCourseAssignmentsIntent() {
  var intent = ListCourseAssignmentsIntent();

  intent.type = "LoadCourseAssignmentsIntent";
  return intent;
}
