import AddGroup from "@/components/AddGroup";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import DeleteGroupButton from "@/components/DeleteGroupButton";

async function getGroups() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  const res = await fetch(`${baseUrl}/api/groups`, {
    cache: "no-store",
  });
  if (!res.ok) {
    return { error: "Failed to fetch groups", groups: [] };
  }
  const data = await res.json();
  if (data.error) {
    return { error: data.error, groups: [] };
  }
  return { groups: data };
}

export default async function GroupsPage() {
  const { groups, error } = await getGroups();

  return (
    <>
      <div className="mb-4">
        {/* No back button needed here, as this is the main groups page */}
      </div>
      <Table>
        <TableCaption>
          Groups. <AddGroup />
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Created-At</TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Currency</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {error ? (
            <TableRow>
              <TableCell colSpan={6} className="text-red-500">
                {error}
              </TableCell>
            </TableRow>
          ) : groups.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>No groups found.</TableCell>
            </TableRow>
          ) : (
            groups.map((group: any) => (
              <TableRow key={group.id}>
                <TableCell className="font-medium">{group.id}</TableCell>
                <TableCell>
                  {group.created_at
                    ? new Date(group.created_at).toLocaleString()
                    : "-"}
                </TableCell>
                <TableCell>
                  <Link
                    href={`/groups/${group.id}`}
                    className="hover:underline hover:text-blue-600 transition-colors duration-200"
                  >
                    {group.name}
                  </Link>
                </TableCell>
                <TableCell className="text-right">{group.currency}</TableCell>
                <TableCell>{group.description}</TableCell>
                <TableCell>
                  <DeleteGroupButton groupId={group.id} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </>
  );
}
