/**
 * Thin wrapper over Amplify Auth. Isolates the SDK so the provider stays
 * declarative and tests can mock a single module.
 */
import {
  getCurrentUser,
  signIn as amplifySignIn,
  signUp as amplifySignUp,
  confirmSignUp as amplifyConfirmSignUp,
  signOut as amplifySignOut,
} from 'aws-amplify/auth';
import type { SignUpResult } from './types';

/** Returns the signed-in user's email, or null if there is no session. */
export async function currentEmail(): Promise<string | null> {
  try {
    const user = await getCurrentUser();
    return user.signInDetails?.loginId ?? user.username;
  } catch {
    return null;
  }
}

export async function signIn(email: string, password: string): Promise<void> {
  await amplifySignIn({ username: email, password });
}

export async function signUp(email: string, password: string): Promise<SignUpResult> {
  const { nextStep } = await amplifySignUp({
    username: email,
    password,
    options: { userAttributes: { email } },
  });
  return { needsConfirmation: nextStep.signUpStep === 'CONFIRM_SIGN_UP' };
}

export async function confirmSignUp(email: string, code: string): Promise<void> {
  await amplifyConfirmSignUp({ username: email, confirmationCode: code });
}

export async function signOut(): Promise<void> {
  await amplifySignOut();
}
