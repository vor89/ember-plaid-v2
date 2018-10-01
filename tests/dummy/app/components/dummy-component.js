import Component from '@ember/component';

export default Component.extend({
  actions: {
    onError(err) {
      console.log(`onError called with err ${JSON.stringify(err, ['message', 'arguments', 'type', 'name'])}`);
    },
    onOpen() {
      console.log('onOpen called');
    },
    onLoad() {
      console.log('onLoad called');
    },
    onEvent(eventName, metadata) {
      console.log(`onEvent called with eventName ${eventName}, metadata ${JSON.stringify(metadata)}`);
    },
    onSuccess(token, metadata) {
      console.log(`onSuccess called with token ${token}, metadata ${JSON.stringify(metadata)}`);
    },
    onExit(error, metadata) {
      console.log(`onExit called with error ${error}, metadata ${JSON.stringify(metadata)}`);
    },
  }
});
