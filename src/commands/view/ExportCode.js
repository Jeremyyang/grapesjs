import Backbone from 'backbone';
const $ = Backbone.$;

const getJson = () => {};

export default {
  run(editor, sender, opts = {}) {
    sender && sender.set && sender.set('active', 0);
    const config = editor.getConfig();
    const modal = editor.Modal;
    const pfx = config.stylePrefix;
    this.cm = editor.CodeManager || null;

    if (!this.$editors) {
      const oHtmlEd = this.buildEditor('htmlmixed', 'hopscotch', 'HTML');
      const oCsslEd = this.buildEditor('css', 'hopscotch', 'CSS');
      const oJsonlEd = this.buildEditor('javascript', 'hopscotch', 'JSON');
      this.htmlEditor = oHtmlEd.el;
      this.cssEditor = oCsslEd.el;
      this.jsonEditor = oJsonlEd.el;
      const $editors = $(`<div class="${pfx}export-dl"></div>`);
      $editors.append(oHtmlEd.$el).append(oCsslEd.$el).append(oJsonlEd.$el);
      this.$editors = $editors;
    }

    modal
      .open({
        title: config.textViewCode,
        content: this.$editors,
        attributes: {
          'data-custom-modal': 'true',
        },
      })
      .getModel()
      .once('change:open', () => editor.stopCommand(this.id));
    this.htmlEditor.setContent(editor.getHtml());
    this.cssEditor.setContent(editor.getCss());
    // this.jsonEditor.setContent(getJson(editor));
  },

  stop(editor) {
    const modal = editor.Modal;
    modal && modal.close();
  },

  // editor.CodeManager.createViewer 就是实现方法
  buildEditor(codeName, theme, label) {
    const input = document.createElement('textarea');
    if (!this.codeMirror) {
      // 本库用的就是 CodeMirror 编辑器
      this.codeMirror = this.cm.getViewer('CodeMirror');
    }
    const el = this.codeMirror.clone().set({
      label, // CSS, JSON
      codeName, // css, json
      theme, // skin
      input, // textarea
    });

    // EditorView $Dom
    const $el = new this.cm.EditorView({
      model: el,
      config: this.cm.getConfig(),
    }).render().$el;

    el.init(input);

    return { el, $el };
  },
};
