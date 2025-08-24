import { auth } from "@/utils";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/component";
import DashboardContent from "@/component/dashboard/DashboardContent";

export default async function Home() {
  const data: any = await auth();
  
  // Redirect to login if not authenticated
  if (!data?.user) {
    redirect("/login");
  }

  return (
    <DashboardLayout user={data.user}>
      <DashboardContent />
    </DashboardLayout>
  );
}
