export var appVersion = "1.1.46";

export var COURSE_CREATOR_URL = "../course-creator-dashboard/index.html";

export var userRoles = [
  "student",
  "teacher",
  "parent",
  "schoolAdmin",
  "regionalAdmin",
  "ministryUser",
  "platformAdmin",
  "superAdmin"
];

export var userRoleFilterOptions = ["student", "teacher", "parent", "admin", "superAdmin"];

export var userStatuses = ["active", "inactive", "suspended", "archived"];

export var roleFilterCards = [
  { key: "", label: "All Users", icon: "ALL", tone: "all", artwork: "../../assets/user-role-cards/all-users.svg", roles: [] },
  { key: "student", label: "Students", icon: "STU", tone: "student", artwork: "../../assets/user-role-cards/students.svg", roles: ["student"] },
  { key: "teacher", label: "Teachers", icon: "TCH", tone: "teacher", artwork: "../../assets/user-role-cards/teachers.svg", roles: ["teacher"] },
  { key: "parent", label: "Parents", icon: "PAR", tone: "parent", artwork: "../../assets/user-role-cards/parents.svg", roles: ["parent"] },
  { key: "admin", label: "Admins", icon: "ADM", tone: "admin", artwork: "../../assets/user-role-cards/admins.svg", roles: ["schoolAdmin", "regionalAdmin", "ministryUser", "platformAdmin"] },
  { key: "superAdmin", label: "Super Admins", icon: "SUP", tone: "super", artwork: "../../assets/user-role-cards/super-admins.svg", roles: ["superAdmin"] }
];

export var fruitOptions = ["apple", "watermelon", "banana", "strawberry", "pineapple", "mango", "kiwi", "orange", "cherry"];

export var fruitLabels = {
  apple: "🍎",
  watermelon: "🍉",
  banana: "🍌",
  strawberry: "🍓",
  pineapple: "🍍",
  mango: "🥭",
  kiwi: "🥝",
  orange: "🍊",
  cherry: "🍒"
};
