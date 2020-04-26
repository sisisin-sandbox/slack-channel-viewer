<template>
  <div>
    <div>channel_viewer</div>
    <div>token: <input name="token" type="text" v-model="state.token" /></div>
    <div><input type="button" value="start" @click="start" /></div>
    <hr />
    <div>
      exclude joined channel
      <input
        name="exclude_joined_channel"
        type="checkbox"
        v-model="state.excludeJoinedChannel"
      />
    </div>
    <div>
      serch: <input name="search" type="text" v-model="state.searchText" />
    </div>
    <ul>
      <li v-for="channel in searched" v-bind:key="channel.id">
        {{ channel.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { reactive, defineComponent, computed } from '@vue/composition-api';
import { slackClient, Conversation } from '@/services/slackClient';
import Fuse from 'fuse.js';

const key = 'slack_token';

export default defineComponent({
  setup() {
    const state = reactive({
      token: localStorage.getItem(key) ?? '',
      excludeJoinedChannel: false,
      searchText: '',
      channels: [] as Conversation[],
      searcher: null as Fuse<
        Conversation,
        Fuse.IFuseOptions<Conversation>
      > | null
    });
    const filteredChannels = computed(() => {
      if (!state.excludeJoinedChannel) {
        return state.channels;
      }
      return state.channels.filter(c => {
        return c.is_member;
      });
    });
    const searched = computed(() => {
      if (state.searcher === null || state.searchText === '') {
        return filteredChannels.value;
      }
      return state.searcher.search(state.searchText).map(s => s.item);
    });
    return {
      state,
      searched,
      async start() {
        localStorage.setItem(key, state.token);
        const res = await slackClient.listConversations({
          token: state.token,
          limit: 1000
        });
        state.channels = res.channels;
        state.searcher = new Fuse(filteredChannels.value, { keys: ['name'] });
      }
    };
  }
});
</script>

<style></style>
