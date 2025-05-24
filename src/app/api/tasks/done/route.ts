import { db } from "@/utils/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  await updateDoc(doc(db, "tasks", id), { done: true });
  return NextResponse.json({ success: true });
}
