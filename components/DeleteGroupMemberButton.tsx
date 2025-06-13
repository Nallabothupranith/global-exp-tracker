"use client";
import { useTransition } from "react";

export default function DeleteGroupMemberButton({
  memberId,
}: {
  memberId: string;
}) {
  const [isPending, startTransition] = useTransition();

  async function handleDelete(e: React.MouseEvent) {
    if (!confirm("Are you sure you want to delete this group member?")) {
      e.preventDefault();
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/group-members", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: memberId }),
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Failed to delete group member");
        return;
      }
      window.location.reload();
    });
  }

  return (
    <button
      className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs"
      onClick={handleDelete}
      disabled={isPending}
      title="Delete member"
    >
      Delete
    </button>
  );
}
