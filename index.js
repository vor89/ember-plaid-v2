/* eslint-env node */
'use strict';

const PLAID_LINK_SCRIPT_TAG = '<script src="https://cdn.plaid.com/link/v2/stable/link-initialize.js"></script>';

module.exports = {
  name: 'ember-plaid-v2',

  contentFor: function(type) {
    if (type === 'body') {
      return PLAID_LINK_SCRIPT_TAG;
    }
  },
};
