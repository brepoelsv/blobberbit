class EventHandler {
  constructor() {
    this.eventIndex = {};
  }
  fireEvent(event, ...data) {
    var eventList = this.eventIndex[event];
    if(!eventList)
      console.error(`event ${event} not have any listener`);
    else for(var e of eventList)
    setTimeout(e,0,...data)
  }
  addEventListener(event, callback) {
    if (!(callback instanceof Function)) {
      console.error("typeof callback must be function");
    }

    if (!this.eventIndex[event]) {
      this.eventIndex[event] = [];
    }

    this.eventIndex[event].push(callback);
  }
  removeEventListener(event, callback) {
    if (this.eventIndex[event]) {
      const removeIndex = this.eventIndex[event].indexOf(callback);
      if (removeIndex > -1) {
        this.eventIndex[event].splice(removeIndex, 1);
      } else {
        console.error(`event ${event} isn't add before`);
      }
    } else {
      console.error(`event ${event} isn't existance`);
    }
  }
}

const GlobalEventHandler = new EventHandler();

export {
  EventHandler,
  GlobalEventHandler,
};
