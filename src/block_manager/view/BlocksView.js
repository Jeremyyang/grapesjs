import { isString, isObject, bindAll } from 'underscore';
import { View } from '../../common';
import BlockView from './BlockView';
import CategoryView from './CategoryView';

export default class BlocksView extends View {
  initialize(opts, config) {
    bindAll(this, 'getSorter', 'onDrag', 'onDrop', 'onMove');
    this.config = config || {};
    this.categories = opts.categories || '';
    this.renderedCategories = [];
    var ppfx = this.config.pStylePrefix || '';
    this.ppfx = ppfx;
    this.noCatClass = `${ppfx}blocks-no-cat`;
    this.blockContClass = `${ppfx}blocks-c`;
    this.catsClass = `${ppfx}block-categories`;
    // View 最后是继承自 Events
    // View 还自带了一个 collection 对象，它也是继承自 Events
    // BlocksView 在实例化时候，collection<modal>作为参数，就赋给了父类 View（详见Backbone.View实现）
    // 等于说，BlocksView 一开始就拿到了 this.collection<model>.length 个数据，在render时即渲染成视图
    const coll = this.collection;
    this.listenTo(coll, 'add', this.addTo);
    this.listenTo(coll, 'reset', this.render);
    this.em = this.config.em;
    this.tac = 'test-tac';
    this.grabbingCls = this.ppfx + 'grabbing';

    if (this.em) {
      this.config.getSorter = this.getSorter;
      this.canvas = this.em.get('Canvas');
    }
  }

  updateConfig(opts = {}) {
    this.config = {
      ...this.config,
      ...opts,
    };
  }

  /**
   * Get sorter
   * @private
   */
  getSorter() {
    if (!this.em) return;
    if (!this.sorter) {
      var utils = this.em.get('Utils');
      var canvas = this.canvas;
      this.sorter = new utils.Sorter({
        container: canvas.getBody(),
        placer: canvas.getPlacerEl(),
        containerSel: '*',
        itemSel: '*',
        pfx: this.ppfx,
        onStart: this.onDrag,
        onEndMove: this.onDrop,
        onMove: this.onMove,
        document: canvas.getFrameEl().contentDocument,
        direction: 'a',
        wmargin: 1,
        nested: 1,
        em: this.em,
        canvasRelative: 1,
      });
    }
    return this.sorter;
  }

  /**
   * Callback when block is on drag
   * @private
   */
  onDrag(e) {
    this.em.stopDefault();
    this.em.trigger('block:drag:start', e);
  }

  onMove(e) {
    this.em.trigger('block:drag:move', e);
  }

  /**
   * Callback when block is dropped
   * @private
   */
  onDrop(model) {
    const { em } = this;
    em.runDefault();

    if (model && model.get) {
      const oldActive = 'activeOnRender';

      if (model.get(oldActive)) {
        model.trigger('active');
        model.unset(oldActive);
      }

      em.trigger('block:drag:stop', model);
    }
  }

  /**
   * Add new model to the collection
   * @param {Model} model
   * @private
   * */
  addTo(model) {
    this.add(model);
  }

  /**
   * Render new model inside the view
   * @param {Model} model
   * @param {Object} fragment Fragment collection
   * @private
   * */
  add(model, fragment) {
    const { config } = this;
    var frag = fragment || null;
    // 给每一个 model 创建一个 view
    var view = new BlockView(
      {
        model,
        attributes: model.get('attributes'),
      },
      config
    );
    // view 的 root Element
    var rendered = view.render().el;
    // 找出此 model 的所属 category<string>
    var category = model.get('category');

    // Check for categories
    if (category && this.categories && !config.ignoreCategories) {
      if (isString(category)) {
        category = {
          id: category,
          label: category,
        };
      } else if (isObject(category) && !category.id) {
        category.id = category.label;
      }
      // this.categories 早在 BlocksView 被实例化时候即以参数形式传入
      // 且它是一个 Collection 类型
      // todo 如果改下成 .ts 就省了类型推断
      var catModel = this.categories.add(category);
      var catId = catModel.get('id');
      var catView = this.renderedCategories[catId];
      var categories = this.getCategoriesEl();
      model.set('category', catModel, { silent: true });

      if (!catView && categories) {
        catView = new CategoryView(
          {
            model: catModel,
          },
          this.config
        ).render();
        this.renderedCategories[catId] = catView;
        categories.appendChild(catView.el);
      }

      catView && catView.append(rendered);
      return;
    }

    if (frag) frag.appendChild(rendered);
    else this.append(rendered);
  }

  getCategoriesEl() {
    if (!this.catsEl) {
      this.catsEl = this.el.querySelector(`.${this.catsClass}`);
    }

    return this.catsEl;
  }

  getBlocksEl() {
    if (!this.blocksEl) {
      this.blocksEl = this.el.querySelector(`.${this.noCatClass} .${this.blockContClass}`);
    }

    return this.blocksEl;
  }

  append(el) {
    let blocks = this.getBlocksEl();
    blocks && blocks.appendChild(el);
  }

  render() {
    const ppfx = this.ppfx;
    const frag = document.createDocumentFragment();
    this.catsEl = null;
    this.blocksEl = null;
    this.renderedCategories = [];
    this.el.innerHTML = `
      <div class="${this.catsClass}"></div>
      <div class="${this.noCatClass}">
        <div class="${this.blockContClass}"></div>
      </div>
    `;
    this.collection.each(model => this.add(model, frag));
    this.append(frag);
    const cls = `${this.blockContClass}s ${ppfx}one-bg ${ppfx}two-color`;
    this.$el.addClass(cls);
    this.rendered = true;
    return this;
  }
}
