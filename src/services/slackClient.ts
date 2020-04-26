import { conversations } from 'slack';

export interface Conversation {
  id: string;
  name: string;
  is_group: boolean;
  is_member: boolean;
}
interface ConversationsListResponse {
  ok: boolean;
  channels: Conversation[];
}
class SlackClient {
  async listConversations(params: Conversations.List.Params) {
    const base = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      exclude_archived: true
    };
    return conversations.list({ ...base, ...params }) as Promise<
      ConversationsListResponse
    >;
  }
}
export const slackClient = new SlackClient();
