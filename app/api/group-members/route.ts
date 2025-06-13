import { supabase } from "@/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const group_id = searchParams.get("group_id");
  const { data, error } = await supabase
    .from("GroupMembers")
    .select("*")
    .eq("group_id", group_id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { group_id, name, phone, email } = body; // Assuming the GroupMembers table has 'group_id' and 'userId' columns

  const { data, error } = await supabase
    .from("GroupMembers")
    .insert([{ group_id, name, phone, email }]);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, group_id, name, phone, email } = body; // Assuming the GroupMembers table has 'id', 'group_id', and 'userId' columns

  const { data, error } = await supabase
    .from("GroupMembers")
    .update({ group_id, name, phone, email })
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const { id } = await request.json(); // GroupMember id

  // First, delete all expenses where spent_by is this member
  await supabase.from("Expences").delete().eq("spent_by", id);

  // Then, delete the group member
  const { data, error } = await supabase
    .from("GroupMembers")
    .delete()
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
