# OquWay Firebase Functions

## `studentLogin`

Callable function used by the student fruit login flow.

Supported actions:

- `listClasses`
- `listStudents`
- `login`

Fruit passwords are never verified in browser code. Store fruit passwords on the student document as:

```txt
fruitPasswordHash: "pbkdf2:{iterations}:{salt}:{hexHash}"
fruitPasswordSet: true
fruitPasswordUpdatedAt: server timestamp
fruitPasswordResetBy: admin uid
```

The hash input is the four fruit keys joined with `|`, for example:

```txt
apple|banana|kiwi|orange
```

If `fruitPasswordHash` is missing, fruit login fails safely.

The canonical submitted sequence is a four-item array of fruit IDs, for example:

```json
["apple", "banana", "kiwi", "orange"]
```

The callable defensively normalizes supported emoji and labels to those IDs before hashing or verifying. Admin resets write only the hash fields above and delete legacy plain-text `fruitPassword` / `fruit` arrays from the `users/{studentId}` document.

## `adminAuthorizeTeacherLogin`

Callable function used by the Admin Dashboard to authorize Teacher Dashboard login.

The callable verifies the caller is a `schoolAdmin`, `platformAdmin`, or `superAdmin`, then loads `users/{userId}` and requires:

- display name
- email
- teacher role
- primary location
- at least one assigned class
- active status

It creates or carefully reuses a Firebase Auth user, sets teacher custom claims, and updates the Firestore profile with:

```txt
email
authUid
loginEnabled: true
loginAuthorizedAt
loginAuthorizedBy
updatedAt
```

Custom claims set:

```json
{
  "role": "teacher",
  "roles": ["teacher"],
  "ROLE_TEACHER": true
}
```

The backend checks that a password reset link can be generated. The Admin Dashboard sends the Firebase password reset/setup email from the frontend after the callable succeeds.
