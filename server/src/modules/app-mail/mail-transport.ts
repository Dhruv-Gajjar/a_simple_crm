import {
  FileMailTransport,
  MailTransport,
  ResendTransport,
} from '@nestjs/mail';

export function mailTransport(
  env: NodeJS.ProcessEnv = process.env,
): MailTransport {
  switch (env.MAIL_TRANSPORT ?? 'file') {
    case 'file':
      return new FileMailTransport({
        directory: env.MAIL_DIRECTORY ?? 'var/mail',
      });
    case 'resend':
      return new ResendTransport({ apiKey: required(env, 'RESEND_API_KEY') });
    default:
      throw new Error(
        `MAIL_TRANSPORT must be a "file" or "resend" (got "${env.MAIL_TRANSPORT}")"`,
      );
  }
}

function required(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name];
  if (!value) {
    throw new Error(
      `${name} is required when MAIL_TRANSPORT is "${env.MAIL_TRANSPORT}"`,
    );
  }
  return value;
}
