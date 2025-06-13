"use client";
import { useState } from "react";
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

const groupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
  currency: z.string().min(1, "Currency is required"),
  description: z.string().optional(),
});

type GroupForm = z.infer<typeof groupSchema>;

interface AddGroupProps {
  onGroupAdded?: () => void;
}

export default function AddGroup({ onGroupAdded }: AddGroupProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GroupForm>({
    resolver: zodResolver(groupSchema),
  });

  const onSubmit = async (data: GroupForm) => {
    setLoading(true);
    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) {
        // Show API error as a form error
        alert(result.error || "Failed to add group");
      } else {
        setOpen(false);
        reset();
        if (onGroupAdded) onGroupAdded();
        else window.location.reload();
      }
    } catch (err) {
      alert("Failed to add group");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add Group
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Group</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <div>
            <label className="block mb-1">Group Name</label>
            <input
              className="w-full border rounded px-2 py-1 dark:bg-neutral-900"
              {...register("name")}
              disabled={loading}
            />
            {errors.name && (
              <div className="text-red-500 text-sm">{errors.name.message}</div>
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
            <label className="block mb-1">Description</label>
            <textarea
              className="w-full border rounded px-2 py-1 dark:bg-neutral-900"
              {...register("description")}
              disabled={loading}
            />
            {errors.description && (
              <div className="text-red-500 text-sm">
                {errors.description.message}
              </div>
            )}
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
