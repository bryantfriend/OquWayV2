export function addAdminContext(executionState) {
  executionState.context = Object.assign({}, executionState.context, {
    actor: executionState.context.actor || window.oquwayAdminApp && window.oquwayAdminApp.state.currentUser || null
  });

  return { valid: true };
}
