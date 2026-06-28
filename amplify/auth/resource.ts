import { defineAuth } from '@aws-amplify/backend';

/**
 * Auth resource: email sign-in only.
 *
 * Since is a purely personal app — every row is owned by its creator (see
 * docs/decisions/0001-personal-owner-auth.md). There is no editorial/admin
 * role and no public reference data, so there are no Cognito groups.
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
