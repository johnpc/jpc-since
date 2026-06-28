import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

/**
 * Since backend: auth + data only. The app is purely personal (owner-auth
 * Cognito + AppSync/DynamoDB) — no ingestion pipeline, storage, or functions.
 * @see https://docs.amplify.aws/react/build-a-backend/
 */
defineBackend({
  auth,
  data,
});
