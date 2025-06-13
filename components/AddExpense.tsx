"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const expenseSchema = z.object({
  date: z.string().min(1, "Date is required"),
  amount: z.coerce.number().min(0.01, "Amount must be greater than 0"),
  currency: z.string().min(1, "Currency is required"),
  spent_by: z.string().min(1, "Spent By is required"),
  group_id: z.string().min(1, "Group is required"),
  spent_to: z.array(z.string()).min(1, "At least one recipient required"),
  expense_id: z.string().optional(), // Optional related expense
});

type ExpenseForm = z.infer<typeof expenseSchema>;

export default function AddExpense({
  onExpenseAdded,
  groupId,
}: {
  onExpenseAdded?: () => void;
  groupId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState(groupId || "");
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<ExpenseForm>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { spent_to: [], group_id: groupId || "" },
  });

  useEffect(() => {
    if (groupId) {
      setValue("group_id", groupId);
      setSelectedGroup(groupId);
    }
  }, [groupId, setValue]);

  useEffect(() => {
    fetch("/api/expences")
      .then((res) => res.json())
      .then((data) => setExpenses(Array.isArray(data) ? data : []));
  }, []);

  const onSubmit = async (data: ExpenseForm) => {
    setLoading(true);
    // Defensive: always send spent_to as array of strings
    let spentToArr: string[] = [];
    if (Array.isArray(data.spent_to)) {
      spentToArr = data.spent_to;
    } else if (typeof data.spent_to === "string") {
      spentToArr = (data.spent_to as string)
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    } else {
      spentToArr = [];
    }
    const payload = { ...data, spent_to: spentToArr };
    try {
      const res = await fetch("/api/expences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Failed to add expense");
      } else {
        setOpen(false);
        reset();
        if (onExpenseAdded) onExpenseAdded();
        else window.location.reload();
      }
    } catch (err) {
      alert("Failed to add expense");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add Expense
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <div>
            <label className="block mb-1">Date</label>
            <input
              type="date"
              className="w-full border rounded px-2 py-1 dark:bg-neutral-900"
              {...register("date")}
              disabled={loading}
            />
            {errors.date && (
              <div className="text-red-500 text-sm">{errors.date.message}</div>
            )}
          </div>
          <div>
            <label className="block mb-1">Amount</label>
            <input
              type="number"
              step="0.01"
              className="w-full border rounded px-2 py-1 dark:bg-neutral-900"
              {...register("amount")}
              disabled={loading}
            />
            {errors.amount && (
              <div className="text-red-500 text-sm">
                {errors.amount.message}
              </div>
            )}
          </div>
          <div>
            <label className="block mb-1">Currency</label>
            <input
              className="w-full border rounded px-2 py-1 dark:bg-neutral-900"
              {...register("currency")}
              disabled={loading}
            />
            {errors.currency && (
              <div className="text-red-500 text-sm">
                {errors.currency.message}
              </div>
            )}
          </div>
          <div>
            <label className="block mb-1">Spent By (User ID)</label>
            <input
              className="w-full border rounded px-2 py-1 dark:bg-neutral-900"
              {...register("spent_by")}
              disabled={loading}
            />
            {errors.spent_by && (
              <div className="text-red-500 text-sm">
                {errors.spent_by.message}
              </div>
            )}
          </div>
          <div>
            <label className="block mb-1">Group ID</label>
            <input
              className="w-full border rounded px-2 py-1 dark:bg-neutral-900"
              {...register("group_id")}
              disabled={!!groupId || loading}
              value={groupId ? groupId : undefined}
              onChange={(e) => {
                setSelectedGroup(e.target.value);
                register("group_id").onChange(e);
              }}
            />
            {errors.group_id && (
              <div className="text-red-500 text-sm">
                {errors.group_id.message}
              </div>
            )}
          </div>
          <div>
            <label className="block mb-1">
              Spent To (comma separated user IDs)
            </label>
            <input
              className="w-full border rounded px-2 py-1 dark:bg-neutral-900"
              {...register("spent_to", {
                setValueAs: (v: unknown) => {
                  if (typeof v === "string") {
                    return v
                      .split(",")
                      .map((s: string) => s.trim())
                      .filter(Boolean);
                  }
                  if (Array.isArray(v)) {
                    return v;
                  }
                  return [];
                },
              })}
              placeholder="e.g. 2,3,4"
              disabled={loading}
            />
            {errors.spent_to && (
              <div className="text-red-500 text-sm">
                {errors.spent_to.message}
              </div>
            )}
          </div>
          <div>
            <label className="block mb-1">
              Related Expense (optional, same group only)
            </label>
            <select
              className="w-full border rounded px-2 py-1 dark:bg-neutral-900"
              {...register("expense_id")}
              disabled={loading || !selectedGroup}
              defaultValue=""
            >
              <option value="">None</option>
              {expenses
                .filter((exp) => exp.group_id === selectedGroup)
                .map((exp) => (
                  <option key={exp.id} value={exp.id}>
                    {`#${exp.id} - ${exp.date} by ${exp.spent_by}`}
                  </option>
                ))}
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="px-3 py-1 rounded border"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-blue-600 text-white"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
