import Backbone from 'backbone';
import { isEmpty, isArray, isString, isFunction, each, includes, extend, flatten, debounce, keys } from 'underscore';
import Component, { keySymbol, keySymbols } from './Component';

export const getComponentIds = (cmp, res = []) => {
  if (!cmp) return [];
  const cmps = isArray(cmp) || isFunction(cmp.map) ? cmp : [cmp];
  cmps.map(cmp => {
    res.push(cmp.getId());
    getComponentIds(cmp.components().models, res);
  });
  return res;
};

const getComponentsFromDefs = (items, all = {}, opts = {}) => {
  opts.visitedCmps = opts.visitedCmps || {};
  const { visitedCmps } = opts;
  const itms = isArray(items) ? items : [items];

  return itms.map(item => {
    const { attributes = {}, components, tagName } = item;
    let { id, draggable, ...restAttr } = attributes;
    let result = item;

    if (id) {
      // Detect components with the same ID
      if (!visitedCmps[id]) {
        visitedCmps[id] = [];

        // Update the component if exists already
        if (all[id]) {
          result = all[id];
          tagName && result.set({ tagName }, { ...opts, silent: true });
          keys(restAttr).length && result.addAttributes(restAttr, { ...opts });
        }
      } else {
        // Found another component with the same ID, treat it as a new component
        visitedCmps[id].push(result);
        id = Component.getNewId(all);
        result.attributes.id = id;
      }
    }

    if (components) {
      const newComponents = getComponentsFromDefs(components, all);

      if (isFunction(result.components)) {
        const cmps = result.components();
        cmps.length > 0 && cmps.reset(newComponents, opts);
      } else {
        result.components = newComponents;
      }
    }

    return result;
  });
};

export default class Components extends Backbone.Collection {
  initialize(models, opt = {}) {
    this.opt = opt;
    this.listenTo(this, 'add', this.onAdd);
    this.listenTo(this, 'remove', this.removeChildren);
    this.listenTo(this, 'reset', this.resetChildren);
    const { em, config } = opt;
    this.config = config;
    this.em = em;
    this.domc = opt.domc || (em && em.get('DomComponents'));
  }

  resetChildren(models, opts = {}) {
    const coll = this;
    const prev = opts.previousModels || [];
    const toRemove = prev.filter(prev => !models.get(prev.cid));
    const newIds = getComponentIds(models);
    opts.keepIds = getComponentIds(prev).filter(pr => newIds.indexOf(pr) >= 0);
    toRemove.forEach(md => this.removeChildren(md, coll, opts));
    models.each(model => this.onAdd(model));
  }

  resetFromString(input = '', opts = {}) {
    opts.keepIds = getComponentIds(this);
    const { domc, em, parent } = this;
    const cssc = em?.get('CssComposer');
    const allByID = domc?.allById() || {};
    const parsed = this.parseString(input, opts);
    const newCmps = getComponentsFromDefs(parsed, allByID, opts);
    const { visitedCmps = {} } = opts;

    // Clone styles for duplicated components
    Object.keys(visitedCmps).forEach(id => {
      const cmps = visitedCmps[id];
      if (cmps.length) {
        // Get all available rules of the component
        const rulesToClone = cssc?.getRules(`#${id}`) || [];

        if (rulesToClone.length) {
          cmps.forEach(cmp => {
            rulesToClone.forEach(rule => {
              const newRule = rule.clone();
              newRule.set('selectors', [`#${cmp.attributes.id}`]);
              cssc.getAll().add(newRule);
            });
          });
        }
      }
    });

    this.reset(newCmps, opts);
    em?.trigger('component:content', parent, opts, input);
  }

  removeChildren(removed, coll, opts = {}) {
    // Removing a parent component can cause this function
    // to be called with an already removed child element
    if (!removed) {
      return;
    }

    const { domc, em } = this;
    const isTemp = opts.temporary || opts.fromUndo;
    removed.prevColl = this; // This one is required for symbols

    if (!isTemp) {
      // Remove the component from the global list
      const id = removed.getId();
      const sels = em.get('SelectorManager').getAll();
      const rules = em.get('CssComposer').getAll();
      const canRemoveStyle = (opts.keepIds || []).indexOf(id) < 0;
      const allByID = domc ? domc.allById() : {};
      delete allByID[id];

      // Remove all component related styles
      const rulesRemoved = canRemoveStyle
        ? rules.remove(
            rules.filter(r => r.getSelectors().getFullString() === `#${id}`),
            opts
          )
        : [];

      // Clean selectors
      sels.remove(rulesRemoved.map(rule => rule.getSelectors().at(0)));

      if (!removed.opt.temporary) {
        em.get('Commands').run('core:component-style-clear', {
          target: removed,
        });
        removed.removed();
        removed.trigger('removed');
        em.trigger('component:remove', removed);
      }

      const inner = removed.components();
      inner.forEach(it => this.removeChildren(it, coll, opts));
    }

    // Remove stuff registered in DomComponents.handleChanges
    const inner = removed.components();
    em.stopListening(inner);
    em.stopListening(removed);
    em.stopListening(removed.get('classes'));
    removed.__postRemove();
  }

  model(attrs, options) {
    const { opt } = options.collection;
    const { em } = opt;
    let model;
    const df = em.get('DomComponents').componentTypes;
    options.em = em;
    options.config = opt.config;
    options.componentTypes = df;
    options.domc = opt.domc;

    for (let it = 0; it < df.length; it++) {
      const dfId = df[it].id;
      if (dfId == attrs.type) {
        model = df[it].model;
        break;
      }
    }

    // If no model found, get the default one
    if (!model) {
      model = df[df.length - 1].model;
      em &&
        attrs.type &&
        em.logWarning(`Component type '${attrs.type}' not found`, {
          attrs,
          options,
        });
    }

    return new model(attrs, options);
  }
  // add 组件前，将字符串表示的组件，解析出来；
  // 同时，将组件的 class (selector) 加入到 CssComposer 和 SelectorManager 进行管理
  // 这段代码写的职责不明！
  parseString(value, opt = {}) {
    // console.log('component string', value);
    const { em, domc } = this;
    const cssc = em.get('CssComposer');
    const parsed = em.get('Parser').parseHtml(value);
    // We need this to avoid duplicate IDs
    Component.checkId(parsed.html, parsed.css, domc.componentsById, opt);

    if (parsed.css && cssc && !opt.temporary) {
      const { at, ...optsToPass } = opt;
      cssc.addCollection(parsed.css, {
        ...optsToPass,
        extend: 1,
      });
    }

    return parsed.html;
  }

  add(models, opt = {}) {
    opt.keepIds = [...(opt.keepIds || []), ...getComponentIds(opt.previousModels)];

    if (isString(models)) {
      models = this.parseString(models, opt);
    } else if (isArray(models)) {
      models = [...models];
      models.forEach((item, index) => {
        if (isString(item)) {
          const nodes = this.parseString(item, opt);
          models[index] = isArray(nodes) && !nodes.length ? null : nodes;
        }
      });
    }

    const isMult = isArray(models);
    models = (isMult ? models : [models]).filter(i => i).map(model => this.processDef(model));
    models = isMult ? flatten(models, 1) : models[0];

    const result = Backbone.Collection.prototype.add.apply(this, [models, opt]);
    this.__firstAdd = result;
    return result;
  }

  /**
   * Process component definition.
   */
  processDef(mdl) {
    // Avoid processing Models
    if (mdl.cid && mdl.ccid) return mdl;
    const { em, config = {} } = this;
    const { processor } = config;
    let model = mdl;

    if (processor) {
      model = { ...model }; // Avoid 'Cannot delete property ...'
      const modelPr = processor(model);
      if (modelPr) {
        each(model, (val, key) => delete model[key]);
        extend(model, modelPr);
      }
    }

    // React JSX preset
    if (model.$$typeof && typeof model.props == 'object') {
      model = { ...model };
      model.props = { ...model.props };
      const domc = em.get('DomComponents');
      const parser = em.get('Parser');
      const { parserHtml } = parser;

      each(model, (value, key) => {
        if (!includes(['props', 'type'], key)) delete model[key];
      });
      const { props } = model;
      const comps = props.children;
      delete props.children;
      delete model.props;
      const res = parserHtml.splitPropsFromAttr(props);
      model.attributes = res.attrs;

      if (comps) {
        model.components = comps;
      }
      if (!model.type) {
        model.type = 'textnode';
      } else if (!domc.getType(model.type)) {
        model.tagName = model.type;
        delete model.type;
      }

      extend(model, res.props);
    }

    return model;
  }

  onAdd(model, c, opts = {}) {
    const { domc, em } = this;
    const style = model.getStyle();
    const avoidInline = em && em.getConfig().avoidInlineStyle;
    domc && domc.Component.ensureInList(model);

    if (!isEmpty(style) && !avoidInline && em && em.get && em.getConfig().forceClass && !opts.temporary) {
      const name = model.cid;
      const rule = em.get('CssComposer').setClassRule(name, style);
      model.setStyle({});
      model.addClass(name);
    }

    model.__postAdd({ recursive: 1 });
    this.__onAddEnd();
  }

  __onAddEnd = debounce(function () {
    // TODO to check symbols on load, probably this might be removed as symbols
    // are always recovered from the model
    // const { domc } = this;
    // const allComp = (domc && domc.allById()) || {};
    // const firstAdd = this.__firstAdd;
    // const toCheck = isArray(firstAdd) ? firstAdd : [firstAdd];
    // const silent = { silent: true };
    // const onAll = comps => {
    //   comps.forEach(comp => {
    //     const symbol = comp.get(keySymbols);
    //     const symbolOf = comp.get(keySymbol);
    //     if (symbol && isArray(symbol) && isString(symbol[0])) {
    //       comp.set(
    //         keySymbols,
    //         symbol.map(smb => allComp[smb]).filter(i => i),
    //         silent
    //       );
    //     }
    //     if (isString(symbolOf)) {
    //       comp.set(keySymbol, allComp[symbolOf], silent);
    //     }
    //     onAll(comp.components());
    //   });
    // };
    // onAll(toCheck);
  });
}
