/* global Plaid:false */
// Sets Plaid as a global read-only variable for eslint

import Component from '@ember/component';
import layout from '../templates/components/plaid-link';

const OPTIONS = ['clientName', 'env', 'key', 'product', 'webhook', 'token'];
const DEFAULT_LABEL = 'Link Bank Account'; // Displayed on button if no block is passed to component

export default Component.extend({
  layout,
  tagName: 'button',
  label: DEFAULT_LABEL,

  // Link Parameters to pass into component via config file
  // Complete documentation: https://plaid.com/docs/api/#parameter-reference
  clientName: null,
  env: null,
  key: null,
  product: null,
  webhook: null,
  token: null,

  // Private
  _link: null,

  // TODO: Implement onEvent callback

  init() {
    this._super(...arguments);
    const options = Object.assign(this.getProperties(OPTIONS), {
      onLoad: this._onLoad.bind(this),
      onSuccess: this._onSuccess.bind(this),
      onExit: this._onExit.bind(this)
    });
    this._link = Plaid.create(options);
  },

  click() {
    this.send('clicked');
    this._link.open();
  },

  _onLoad() {
    this.send('loaded');
  },

  _onExit: function(error, metadata) {
    this.send('exited', error, metadata);
  },

  _onSuccess: function(token, metadata) {
    this.send('succeeded', token, metadata);
  },

  actions: { // Send closure actions passed into component, if available
    clicked() {
      if (this.get('onOpen')) {
        this.get('onOpen')();
      }
    },

    loaded() {
      if (this.get('onLoad')){
        this.get('onLoad')();
      }
    },

    exited(error, metadata) {
      if (this.get('onExit')){
        this.get('onExit')(error, metadata);
      }
    },

    succeeded(token, metadata) {
      if (this.get('onSuccess')) {
        this.get('onSuccess')(token, metadata);
      }
    }
  }
});
