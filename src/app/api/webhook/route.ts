import { createUser } from "@/lib/actions/user.actions";
import { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

const webhookSecret: string = process.env.WEBHOOK_SECRET || "";

export async function POST(req: Request) {
  const svix_id = req.headers.get("svix-id") ?? "";
  const svix_timestamp = req.headers.get("svix-timestamp") ?? "";
  const svix_signature = req.headers.get("svix-signature") ?? "";

  if (!process.env.WEBHOOK_SECRET) {
    console.log("WEBHOOK_SECRET does not exist");
  }
if(!svix_id||!svix_timestamp||!svix_timestamp) {
    return new Response("bad request", { status:400})
}

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const sivx = new Webhook(webhookSecret);

  let msg: WebhookEvent;

  try {
    msg = sivx.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    return new Response("Bad Request", { status: 400 });
  }

  const eventType = msg.type;
  if (eventType === "user.created") {
    const { id, username, email_addresses, image_url } = msg.data;
    const user = await createUser({
      clerkId: id,
      email: email_addresses[0].email_address,
      name: username!,
      userName: username!,
      avatar: image_url,
    });
    return NextResponse.json({
      message: "ok",
      user,
    });
  }

  // Rest

  return new Response("OK", { status: 200 });
}
