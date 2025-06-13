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

const memberSchema = z.object({
  name: z.string().min(1, "Member name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .min(7, "Phone number is required")
    .max(15, "Phone number too long"),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required",
  }),
});

type MemberForm = z.infer<typeof memberSchema>;

interface AddGroupMemberProps {
  groupId: string;
  onMemberAdded?: () => void;
}

export default function AddGroupMember({
  groupId,
  onMemberAdded,
}: AddGroupMemberProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MemberForm>({
    resolver: zodResolver(memberSchema),
  });

  const onSubmit = async (data: MemberForm) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/group-members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, group_id: groupId }),
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Failed to add member");
      } else {
        setOpen(false);
        reset();
        if (onMemberAdded) onMemberAdded();
        else window.location.reload();
      }
    } catch (err) {
      alert("Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add Member
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Group Member</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-2"
        >
          <div>
            <label className="block mb-1">Member Name</label>
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
            <label className="block mb-1">Email</label>
            <input
              className="w-full border rounded px-2 py-1 dark:bg-neutral-900"
              {...register("email")}
              disabled={loading}
            />
            {errors.email && (
              <div className="text-red-500 text-sm">{errors.email.message}</div>
            )}
          </div>
          <div>
            <label className="block mb-1">Phone</label>
            <input
              className="w-full border rounded px-2 py-1 dark:bg-neutral-900"
              {...register("phone")}
              disabled={loading}
            />
            {errors.phone && (
              <div className="text-red-500 text-sm">{errors.phone.message}</div>
            )}
          </div>
          <div>
            <label className="block mb-1">Gender</label>
            <select
              className="w-full border rounded px-2 py-1 dark:bg-neutral-900"
              {...register("gender")}
              disabled={loading}
              defaultValue=""
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && (
              <div className="text-red-500 text-sm">
                {errors.gender.message}
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
