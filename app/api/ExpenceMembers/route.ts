import { supabase } from '@/supabaseClient';
import { NextResponse } from 'next/server';
// Adjust the path as necessary

export async function GET(request: Request) {
    const { data, error } = await supabase
        .from('Expenses')
        .select('*');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { spent_to, expense_id } = body; // Assuming the Expenses table has these columns

    const { data, error } = await supabase
        .from('Expenses')
        .insert([{ spent_to, expense_id }]);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}

export async function PUT(request: Request) {
    const body = await request.json();
    const { id, spent_to, expense_id } = body; // Assuming the Expenses table has these columns

    const { data, error } = await supabase
        .from('Expenses')
        .update({ spent_to, expense_id })
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}

export async function DELETE(request: Request) {
    const { id } = await request.json(); // Assuming the Expenses table has an 'id' column

    const { data, error } = await supabase
        .from('Expenses')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
}