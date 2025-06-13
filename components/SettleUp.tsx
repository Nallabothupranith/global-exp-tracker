"use client";
import { useState } from "react";

interface Member {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  amount: number;
  spent_by: string;
  spent_to: string[];
}

interface SettleUpProps {
  members: Member[];
  expenses: Expense[];
}

export default function SettleUp({ members, expenses }: SettleUpProps) {
  const [open, setOpen] = useState(false);

  // Calculate net balances for each member
  const balances: { [id: string]: number } = {};
  members.forEach((m) => (balances[m.id] = 0));
  expenses.forEach((exp) => {
    if (!Array.isArray(exp.spent_to) || !exp.spent_by) return;
    const split = exp.amount / exp.spent_to.length;
    exp.spent_to.forEach((to) => {
      if (to !== exp.spent_by) {
        balances[to] -= split;
        balances[exp.spent_by] += split;
      }
    });
  });

  return (
    <>
      <button
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        type="button"
        onClick={() => setOpen(true)}
      >
        Settle Up
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded shadow-lg min-w-[320px]">
            <h2 className="text-lg font-semibold mb-2">Settle Up Balances</h2>
            <ul className="mb-4">
              {members.map((m) => (
                <li key={m.id} className="mb-1">
                  <span className="font-medium">{m.name}:</span>{" "}
                  {balances[m.id] > 0
                    ? `gets ${balances[m.id].toFixed(2)}`
                    : balances[m.id] < 0
                    ? `owes ${(-balances[m.id]).toFixed(2)}`
                    : "settled"}
                </li>
              ))}
            </ul>
            <button
              className="mt-2 px-3 py-1 bg-gray-300 rounded"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
