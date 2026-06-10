import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400
    });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occured', {
      status: 400
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const { id, first_name, last_name, image_url } = evt.data;
    await db.insert(users).values({
      id: id as string,
      displayName: `${first_name || ''} ${last_name || ''}`.trim() || 'Chef',
      avatarUrl: image_url as string,
      subscriptionTier: 'free',
    }).onConflictDoUpdate({
      target: users.id,
      set: {
        displayName: `${first_name || ''} ${last_name || ''}`.trim() || 'Chef',
        avatarUrl: image_url as string,
      }
    });
  }

  // Handle subscription events (clerk billing)
  // eventType === 'subscription.created', 'subscription.updated', 'subscription.deleted'
  // Note: Clerk Billing events might vary slightly based on their SDK version
  if (eventType.startsWith('subscription.')) {
    const data = evt.data as any;
    const userId = data.user_id;
    const status = data.status; // active, canceled, etc.
    const tier = status === 'active' ? 'pro' : 'free';

    await db.update(users).set({
      subscriptionTier: tier
    }).where(eq(users.id, userId));
  }

  return new Response('', { status: 200 });
}
