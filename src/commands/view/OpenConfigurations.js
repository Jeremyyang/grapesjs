// 理解为挂载在 panel => button 上的 commands
// 当 button 被 click 时，执行 run 指令，并且 button 处于 active = true 态
// 当 button 再次被 click 或者被置为 active = false 态时，执行 stop 指令

import Backbone from 'backbone';
const $ = Backbone.$;
export default {
  run(editor, sender) {
    const modal = editor.Modal;

    modal
      .open({
        title: 'Configurations',
        content: 'coming soooon...',
      })
      .getModel()
      .once('change:open', () => {
        sender && sender.set && sender.set('active', false);
        console.log('todo with', sender);
      });
  },

  stop() {
    // todo nothing
  },
};
