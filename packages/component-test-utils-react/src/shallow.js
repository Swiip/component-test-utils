const React = require('react');
// Const ReactIs = require('react-is');
const {getHtml} = require('./methods/html');
const {render} = require('./render/render');
const {createDispatcher} = require('./dispatcher/');
const {dispatchEvent} = require('./methods/dispatchEvent');
const {querySelector} = require('./methods/querySelector');

const {
  ReactCurrentDispatcher
} = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;

const defaultConfig = {
  mocks: {}
};

class ShallowRender {
  constructor(component, config = defaultConfig) {
    this._component = component;
    this._config = config;
    this._dispatcher = createDispatcher(this);

    this._render();
  }

  _render(props) {
    const prevDispatcher = ReactCurrentDispatcher.current;
    ReactCurrentDispatcher.current = this._dispatcher;

    this._dispatcher._informDipatcherRenderIsComming();

    const reactEl = this._component.type.call(
      undefined,
      props || this._component.props
    );

    this._rendered = render(reactEl, this._config, ShallowRender);

    /* If (ReactIs.isContextProvider(this._rendered)) {
      this._context = this._rendered.type._context;
      // Actualize the current value according to the value
      if (Object.keys(this._rendered.props).includes('value')) {
        this._context._currentValue = this._rendered.props.value;
      }
    } */

    // Finish recording the order of hooks by toogling this dispatcher property
    this._dispatcher._informDipatcherRenderIsDone();

    ReactCurrentDispatcher.current = prevDispatcher;
  }

  // Methods
  html() {
    return getHtml(this._rendered);
  }

  dispatchEvent(event) {
    return dispatchEvent(this._rendered, event);
  }

  // Alias for dispatchEvent
  trigger(event) {
    return dispatchEvent(this._rendered, event);
  }

  setProps(props) {
    this._render(props);
  }

  querySelector(selector) {
    return querySelector(this._rendered, selector, ShallowRender);
  }
}

exports.shallow = (component, config) => {
  return new ShallowRender(component, config);
};
