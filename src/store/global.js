import { observable } from 'mobx';

const GlobalStore = observable({
  startup: false,
  setStart(value) {
    this.startup = value
  }
})

export default GlobalStore;
