import { Promise } from 'rsvp';
import Service from '@ember/service';
import { typeOf } from '@ember/utils';
import { assert } from '@ember/debug';

export default Service.extend({
  isInjected: false,
  isLoading: true,
  failedToLoad: false,

  /**
    @method injectScript
    @returns {Promise}
    @public
   */
  injectScript() {
    if (this.get('isInjected')) {
      return new Promise(resolve => {
        resolve();
      });
    } else {
      this.toggleProperty('isInjected');

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
        script.onload = resolve;
        script.onerror = reject;
        document.getElementsByTagName('head')[0].appendChild(script);
      })
        .catch(() => {
          this.set('failedToLoad', true);
          this.set('isInjected', false);
        })
        .finally(() => {
          this.set('isLoading', false);
        });
    }
  },

  /**
    @method open
    @param {String} [capitalUnitToken]
    @param {Function} [afterClose] callback will be called immediately when the
      account has successfully been linked and the plaid window is closed, and
      before any requests are made to the server to actually link the account
    @returns {Promise}
    @public
   */
  open(options, afterClose) {
    const promise = this.openPlaidWindow(options);

    if (typeOf(afterClose) === 'function') {
      promise.then(result => {
        const { success } = result;

        if (success) {
          afterClose(result);
        }

        return result;
      });
    } else {
      const isUndefined = typeOf(afterClose) === 'undefined';
      assert('`afterClose callback must be a function or undefined`', isUndefined);
    }

    return promise
  },

  /**
    @method openPlaidWindow
    @returns {Promise}
    @private
   */
  openPlaidWindow(options) {
    let webhook;

    return new Promise(resolve => {
      return window.Plaid
        .create({
          apiVersion: 'v2',
          clientName: options['clientName'],
          env: options['env'],
          product: options['product'],
          key: options['key'],
          webhook,
          onSuccess: resolve,
          onExit: options['onExit'],
          onEvent: options['onEvent'],
        })
        .open();
    });
  },
});
