import { NextResponse } from "next/server";
import { getPool } from "@/app/Mysql";

type Ctx = { params: { id: string } };

export async function PUT(req: Request, { params }: Ctx) {
  const id = Number(params.id);
  const { name, age, phone } = await req.json();
  await getPool().execute(
    "UPDATE people SET name=?, age=?, phone=? WHERE id=?",
    [name, age, phone, id]
  );
  return NextResponse.json({ id, name, age, phone });
}

export async function DELETE(_: Request, { params }: Ctx) {
  const id = Number(params.id);
  await getPool().execute("DELETE FROM people WHERE id=?", [id]);
  return NextResponse.json({ ok: true });
}
