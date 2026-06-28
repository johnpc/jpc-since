/**
 * Shared Amplify Data client, typed against the backend Schema.
 *
 * Since is purely personal: every model is owner-authed and every call uses
 * authMode 'userPool' (the owner rule scopes rows to the signed-in Cognito
 * user automatically). There is no guest/identityPool path — see
 * docs/decisions/0001-personal-owner-auth.md.
 */
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

export const dataClient = generateClient<Schema>({ authMode: 'userPool' });

/** Pass to every models.* call so reads/writes ride the owner's Cognito JWT. */
export const USER_POOL = { authMode: 'userPool' } as const;

export type CounterRecord = Schema['Counter']['type'];
export type CounterResetRecord = Schema['CounterReset']['type'];
