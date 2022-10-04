import { View } from '../../common';
import html from '../../utils/html';

export default class EditorView extends View {
  template({ pfx, codeName, label }) {
    return html`
      <div class="${pfx}editor" id="${pfx}${codeName}">
        <div class="${pfx}title">${label}</div>
        <div class="${pfx}code"></div>
      </div>
    `;
  }

  initialize(o) {
    this.config = o.config || {};
    this.pfx = this.config.stylePrefix;
  }

  render() {
    const { model, pfx, $el } = this;
    // 把代码相关数据填充到模版，即代码编辑器视图
    const obj = model.toJSON();
    obj.pfx = pfx;
    $el.html(this.template(obj));
    $el.attr('class', `${pfx}editor-c`);
    $el.find(`.${pfx}code`).append(model.get('input'));
    return this;
  }
}
