import { supabase } from "@/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { data, error } = await supabase
    .from("Expences")
    .select(
      "id, date, amount, currency, spent_by, group_id, spent_to, GroupMembers (name)"
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  console.log("test", data);
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const { date, amount, currency, spent_by, group_id, spent_to } =
      await request.json();
    console.log({ date, amount, currency, spent_by, group_id, spent_to });
    const { data, error } = await supabase
      .from("Expences")
      .insert([{ date, amount, currency, spent_by, group_id, spent_to }]);
    console.log("Hi", { data, error });
    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: error.message || JSON.stringify(error) },
        { status: 500 }
      );
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error("Catch error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : JSON.stringify(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  const { id, amount, date, spent_by, group_id, spent_to } = body;

  const { data, error } = await supabase
    .from("Expences")
    .update({ amount, date, spent_by, group_id, spent_to })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function DELETE(request: Request) {
  const { id } = await request.json(); // Assuming the Expenses table has an 'id' column

  const { data, error } = await supabase.from("Expences").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
