import Vue from 'vue';
import {
  postNamespace,
  fetchNamespaces,
  getNamespace,
  removeNamespace,
  putNamespace,
  addUserToNamespace,
  removeUserFromNamespace,
  tenantSwitch,
} from '@/store/api/namespaces';

export default {
  namespaced: true,

  state: {
    namespace: {},
    namespaces: [],
    numberNamespaces: 0,
  },

  getters: {
    list: (state) => state.namespaces,
    get: (state) => state.namespace,
    getNumberNamespaces: (state) => state.numberNamespaces,
  },

  mutations: {
    setNamespaces: (state, res) => {
      Vue.set(state, 'namespaces', res.data);
      Vue.set(state, 'numberNamespaces', parseInt(res.headers['x-total-count'], 10));
    },

    setNamespace: (state, res) => {
      Vue.set(state, 'namespace', res.data);
    },

    removeNamespace: (state, id) => {
      state.namespaces.splice(state.namespaces.findIndex((d) => d.tenant_id === id), 1);
    },

    removeMember: (state, usr) => {
      state.namespace.member_names.splice(state.namespace.member_names.findIndex(
        (m) => m === usr,
      ), 1);
    },

    clearNamespaceList: (state) => {
      Vue.set(state, 'namespaces', []);
      Vue.set(state, 'numberNamespaces', 0);
    },

    clearObjectNamespace: (state) => {
      Vue.set(state, 'namespace', {});
    },
  },

  actions: {
    post: async (context, data) => {
      await postNamespace(data);
    },

    fetch: async (context) => {
      const res = await fetchNamespaces();
      context.commit('setNamespaces', res);
    },

    get: async (context, id) => {
      const res = await getNamespace(id);
      context.commit('setNamespace', res);
    },

    put: async (context, data) => {
      await putNamespace(data);
    },

    remove: async (context, id) => {
      await removeNamespace(id);
      context.commit('removeNamespace', id);
      context.commit('clearObjectNamespace');
      context.commit('clearNamespaceList');
    },

    addUser: async (context, data) => {
      await addUserToNamespace(data);
    },

    removeUser: async (context, data) => {
      const res = await removeUserFromNamespace(data);
      if (res.status === 200) {
        context.commit('removeMember', data.username);
      }
    },

    switchNamespace: async (context, data) => {
      const res = await tenantSwitch(data);
      if (res.status === 200) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('tenant', data.tenant_id);
      }
    },
  },
};
