export default {
  run(editor) {
    const lm = editor.LayerManager;
    const pn = editor.Panels;
    const lmConfig = lm.getConfig();
    // 注释掉是因为：return 将无法用到内置的 appendContent 等响应操作
    // if (lmConfig.appendTo) return;
    const injectTo = lmConfig.injectTo;

    if (!this.layers) {
      const id = 'layers-viewer';
      const layers = document.createElement('div');
      const panels = pn.getPanel(id) || pn.addPanel({ id, appendTo: injectTo });

      if (lmConfig.custom) {
        lm.__trgCustom({ container: layers });
      } else {
        layers.appendChild(lm.render());
      }

      panels.set('appendContent', layers).trigger('change:appendContent');
      this.layers = layers;
    }

    // this.layers.style.display = 'block';
    this.layers.parentElement.style.display = 'block';
  },

  stop() {
    const { layers } = this;
    // layers && (layers.style.display = 'none');
    layers && (layers.parentElement.style.display = 'none');
  },
};
