import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddExpense from "@/components/AddExpense";
import Link from "next/link";
import { notFound } from "next/navigation";

async function getGroupExpenses(groupId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await fetch(`${baseUrl}/api/expences`);
  if (!res.ok) return [];
  const data = await res.json();
  // Filter on the client side and validate group_id
  return Array.isArray(data)
    ? data.filter(
        (exp: any) => exp.group_id && String(exp.group_id) === String(groupId)
      )
    : [];
}

export default async function Page({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const { groupId } = await params;
  if (!groupId) return notFound();
  const expenses = await getGroupExpenses(groupId);

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center gap-4">
        <Link
          href={`/groups/${groupId}`}
          className="inline-block px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium mb-2"
        >
          ← Back to Group
        </Link>
        <AddExpense groupId={groupId} members={[]} />
      </div>
      <h1 className="text-xl font-bold mb-4">Expenses for Group {groupId}</h1>
      <Table>
        <TableCaption>Expenses for this group.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Currency</TableHead>
            <TableHead>Spent By</TableHead>
            <TableHead>Spent To</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>
                No expenses found for this group.
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((exp: any) => (
              <TableRow key={exp.id}>
                <TableCell>{exp.id}</TableCell>
                <TableCell>{exp.date}</TableCell>
                <TableCell>{exp.amount}</TableCell>
                <TableCell>{exp.currency}</TableCell>
                <TableCell>{exp.GroupMembers.name}</TableCell>
                <TableCell>
                  {Array.isArray(exp.spent_to) ? exp.spent_to.join(", ") : "-"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
