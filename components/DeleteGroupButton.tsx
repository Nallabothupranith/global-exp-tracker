"use client";
import { useTransition } from "react";

export default function DeleteGroupButton({ groupId }: { groupId: string }) {
  const [isPending, startTransition] = useTransition();

  async function handleDelete(e: React.MouseEvent) {
    if (!confirm("Are you sure you want to delete this group?")) {
      e.preventDefault();
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/groups", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: groupId }),
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Failed to delete group");
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
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
