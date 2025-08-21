import { NextResponse } from "next/server";
import { getPool } from "@/app/Mysql";

export async function GET() {
  const [rows] = await getPool().query("SELECT * FROM people ORDER BY id DESC");
  return NextResponse.json(rows);
}

export async function POST(req: Request) {
  const { name, age, phone } = await req.json();
  const [result]: any = await getPool().execute(
    "INSERT INTO people (name, age, phone) VALUES (?, ?, ?)",
    [name, age, phone]
  );
  return NextResponse.json({ id: result.insertId, name, age, phone });
}
