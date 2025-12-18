import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function ProtectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = cookieStore.get("student_uuid");
  return <>{children}</>;
}
