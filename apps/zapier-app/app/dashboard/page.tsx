import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";
import { CreateZap } from "../components/CreateZap";
import { ZapsTable } from "../components/ZapsTable";

export default async function () {
  const session = await getServerSession(authOptions);

  if (!session?.user) redirect("/");

  return (
    <div className="flex justify-center">
      <div className="flex flex-col w-3/5">
        <CreateZap />
        <ZapsTable />
      </div>
    </div>
  );
}
