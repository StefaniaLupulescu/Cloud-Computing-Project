import { db } from "@/utils/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { title, description, deadline, email } = await req.json();
  if (!title || !deadline || !email)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  await addDoc(collection(db, "tasks"), {
    title,
    description,
    email,
    deadline: Timestamp.fromDate(new Date(deadline)),
    done: false,
  });

  return NextResponse.json({ success: true });
}
