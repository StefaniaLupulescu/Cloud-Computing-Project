import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET() {
  const snap = await getDocs(collection(db, "tasks"));
  const data = snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  return NextResponse.json(data);
}
