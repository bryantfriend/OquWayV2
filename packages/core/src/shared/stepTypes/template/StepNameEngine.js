export class StepNameEngine {

  constructor({ container, config, onIntent }) {
    this.container = container;
    this.config = config;
    this.onIntent = onIntent;
    this.uiState = {};
  }

  mount() {
    this.render();
    this.bind();
  }

  render() {
    this.container.innerHTML = `
      <button class="continue-btn">Continue</button>
    `;
  }

  bind() {
    var btn = this.container.querySelector(".continue-btn");
    btn.onclick = function () {
      this.onIntent("continue", {});
    }.bind(this);
  }

  destroy() {
    this.container.innerHTML = "";
  }
}
