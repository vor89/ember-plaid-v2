import { Promise } from 'rsvp';
import Service from '@ember/service';
import { typeOf } from '@ember/utils';
import { assert } from '@ember/debug';

export default Service.extend({
  isLoading: false,
  isInjected: false,
  plaidPromise: null,

  /**
    @method injectScript
    @returns {Promise}
    @public
   */
  injectScript() {
    if (this.get('isLoading') || this.get('isInjected')) {
      return this.get('plaidPromise');
    } else {
      this.set('isLoading', true);
      const plaidPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js';
        script.onload = resolve;
        script.onerror = reject;
        document.getElementsByTagName('head')[0].appendChild(script);
      })
      .then(() => {
        this.set('isInjected', true);
      })
      .finally(() => {
        this.set('isLoading', false);
      });
      this.set('plaidPromise', plaidPromise);
      return plaidPromise;
    }
  },

  /**
    @method open
    @param {object} [options] the parameters to pass to Plaid.create
    @returns {Promise} plaidPromise
    @public
   */
  open(options) {
    return this.injectScript().then(() => window.Plaid.create(options).open());
  },
});
