<template>
  <div>
    <div>channel_viewer</div>
    <div>token: <input name="token" type="text" v-model="state.token" /></div>
    <div><input type="button" value="start" @click="start" /></div>
    <hr />
    exclude joined channel
    <input
      name="exclude_joined_channel"
      type="checkbox"
      v-model="state.excludeJoinedChannel"
    />
    <ul>
      <li v-for="channel in filteredChannels" v-bind:key="channel.id">
        {{ channel.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { reactive, defineComponent, computed } from '@vue/composition-api';
import { slackClient, Conversation } from '@/services/slackClient';

const key = 'slack_token';
export default defineComponent({
  setup() {
    const state = reactive({
      token: localStorage.getItem(key) ?? '',
      excludeJoinedChannel: true,
      channels: [] as Conversation[]
    });
    const filteredChannels = computed(() =>
      state.channels.filter(c => {
        if (state.excludeJoinedChannel) {
          return c.is_member;
        } else {
          return true;
        }
      })
    );
    return {
      state,
      filteredChannels,
      async start() {
        localStorage.setItem(key, state.token);
        const res = await slackClient.listConversations({
          token: state.token,
          limit: 1000
        });
        state.channels = res.channels;
      }
    };
  }
});
</script>

<style></style>
