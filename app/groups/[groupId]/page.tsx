import Link from "next/link";
import { notFound } from "next/navigation";
import AddExpense from "@/components/AddExpense";
import AddGroupMember from "@/components/AddGroupMember";
import DeleteGroupMemberButton from "@/components/DeleteGroupMemberButton";
import SettleUp from "@/components/SettleUp";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

async function getGroupExpenses(groupId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/expences`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data)
    ? data.filter(
        (exp: any) => exp.group_id && String(exp.group_id) === String(groupId)
      )
    : [];
}

async function getGroupMembers(groupId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/group-members?group_id=${groupId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

interface PageProps {
  params: { groupId: string };
}

const Page = async ({ params }: PageProps) => {
  const groupId = params.groupId;
  if (!groupId) return notFound();
  const expenses = await getGroupExpenses(groupId);
  const members = await getGroupMembers(groupId);

  return (
    <div className="mt-8">
      <div className="mb-4 flex items-center gap-4">
        <Link
          href="/groups"
          className="inline-block px-3 py-1 rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-sm font-medium mb-2"
        >
          ← Back to Groups
        </Link>
        <AddExpense groupId={groupId} />
        <SettleUp
          members={members.map((m: any) => ({ id: m.id, name: m.name }))}
          expenses={expenses.map((e: any) => ({
            id: e.id,
            amount: e.amount,
            spent_by: e.spent_by,
            spent_to: Array.isArray(e.spent_to) ? e.spent_to : [],
          }))}
        />
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
      <h2 className="text-lg font-semibold mt-8 mb-2 flex items-center gap-4">
        Group Members <AddGroupMember groupId={groupId} />
      </h2>
      <Table>
        <TableCaption>Members of this group.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>No members found.</TableCell>
            </TableRow>
          ) : (
            members.map((member: any) => (
              <TableRow key={member.id}>
                <TableCell>{member.id}</TableCell>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.email || "-"}</TableCell>
                <TableCell>{member.phone || "-"}</TableCell>
                <TableCell></TableCell>

                <TableCell>
                  <DeleteGroupMemberButton memberId={member.id} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Page;
