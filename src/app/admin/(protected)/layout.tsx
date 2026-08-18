import { redirect } from "next/navigation";

import { readAdminSessionFromCookies } from "@/lib/admin/authorize";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await readAdminSessionFromCookies();
  if (!session) {
    redirect("/admin/login");
  }
  return children;
}
