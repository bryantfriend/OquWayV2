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
