import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import user from './moudles/user.js'

export default new Vuex.Store({
  modules:{
    user
  }
});
