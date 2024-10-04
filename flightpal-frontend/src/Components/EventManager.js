// This will handle subscribing, unsubscribing, and notifying listeners
class EventEmitter {
    constructor() {
      this.events = {};
    }
  
    subscribe(event, listener) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(listener);
    }
  
    unsubscribe(event, listenerToRemove) {
      if (!this.events[event]) return;
  
      this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
    }
  
    notify(event, data) {
      if (!this.events[event]) return;
  
      this.events[event].forEach(listener => listener(data));
    }
  }
  
  const eventEmitterInstance = new EventEmitter();
export default eventEmitterInstance;
  