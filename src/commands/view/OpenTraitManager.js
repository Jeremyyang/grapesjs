import Backbone from 'backbone';

const $ = Backbone.$;

export default {
  run(editor, sender) {
    this.sender = sender;
    const em = editor.getModel();

    const config = editor.Config;
    const pfx = config.stylePrefix;
    const tm = editor.TraitManager;
    const confTm = tm.getConfig();
    let panelC;

    if (confTm.appendTo) return;

    if (!this.$cn) {
      this.$cn = $('<div></div>');
      this.$cn2 = $('<div class="traits-panel"></div>');
      this.$cn.append(this.$cn2);
      this.$header = $('<div>').append(`<div class="${confTm.stylePrefix}header">${em.t('traitManager.empty')}</div>`);
      this.$cn.append(this.$header);
      this.$cn2.append(`<div class="${pfx}traits-label">${em.t('traitManager.label')}</div>`);
      this.$cn2.append(tm.render());
      var panels = editor.Panels;
      // 默认是加到 views-container 组件下的
      panelC = panels.getPanel('views-container');
      if (!panelC) {
        panelC = panels.addPanel({ id: 'views-container' });
      }

      panelC.set('appendContent', this.$cn.get(0)).trigger('change:appendContent');

      this.target = editor.getModel();
      this.listenTo(this.target, 'component:toggled', this.toggleTm);
    }

    this.toggleTm();
  },

  /**
   * Toggle Trait Manager visibility
   * @private
   */
  toggleTm() {
    const sender = this.sender;
    if (sender && sender.get && !sender.get('active')) return;

    if (this.target.getSelectedAll().length === 1) {
      this.$cn2.show();
      this.$header.hide();
    } else {
      this.$cn2.hide();
      this.$header.show();
    }
  },

  stop() {
    this.$cn2 && this.$cn2.hide();
    this.$header && this.$header.hide();
  },
};
