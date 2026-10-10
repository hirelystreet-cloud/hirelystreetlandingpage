type WaitlistRole = "customer" | "provider";

type WaitlistPayload = {
  name?: unknown;
  email?: unknown;
  role?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isRole(value: unknown): value is WaitlistRole {
  return value === "customer" || value === "provider";
}

export async function POST(request: Request) {
  let payload: WaitlistPayload;

  try {
    payload = (await request.json()) as WaitlistPayload;
  } catch {
    return Response.json({ message: "Please send a valid JSON request." }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const errors: Record<string, string> = {};

  if (name.length < 2 || name.length > 100) {
    errors.name = "Enter a name between 2 and 100 characters.";
  }

  if (!emailPattern.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!isRole(payload.role)) {
    errors.role = "Choose whether you are looking for a service or providing one.";
  }

  if (Object.keys(errors).length > 0) {
    return Response.json({ message: "Please correct the highlighted fields.", errors }, { status: 400 });
  }

  return Response.json({
    status: "accepted",
    message:
      "Your request passed the development waitlist check. Persistent waitlist storage is not connected yet.",
  });
}
