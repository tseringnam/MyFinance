import { a, defineData, type ClientSchema } from '@aws-amplify/backend';

const schema = a.schema({
  Budget: a.model({
    payload: a.json().required(),
    // Owners can view their identity but cannot change it to share a record.
    owner: a.string().authorization(allow => [allow.owner().to(['read', 'delete'])]),
  }).authorization(allow => [allow.owner()]),
});
export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
  authorizationModes: { defaultAuthorizationMode: 'userPool' },
});
