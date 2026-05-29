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
```

The hash input is the four fruit keys joined with `|`, for example:

```txt
apple|banana|kiwi|orange
```

If `fruitPasswordHash` is missing, fruit login fails safely.
