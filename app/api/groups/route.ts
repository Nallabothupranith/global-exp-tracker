import { supabase } from "@/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { data, error } = await supabase.from("Groups").select("*");

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, currency } = body; // Assuming the Groups table has a 'name' column

  const { data, error } = await supabase
    .from("Groups")
    .insert([{ name, currency }]);
  console.log("Hi", { data, error });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, name, description } = body; // Assuming the Groups table has 'id' and 'name' columns

  const { data, error } = await supabase
    .from("Groups")
    .update({ name, description })
    .eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const { id } = await request.json(); // Group id

  // First, delete all expenses where spent_by is a member of this group or group_id matches
  await supabase.from("Expences").delete().eq("group_id", id);

  // Then, delete all group members for this group
  const { error: memberError } = await supabase
    .from("GroupMembers")
    .delete()
    .eq("group_id", id);
  if (memberError) {
    return NextResponse.json({ error: memberError.message }, { status: 500 });
  }

  // Then, delete the group itself
  const { data, error } = await supabase.from("Groups").delete().eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
