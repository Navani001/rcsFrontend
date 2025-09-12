import { auth } from "@/utils";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/component";
import DashboardContent from "@/component/dashboard/DashboardContent";

export default async function Home() {
  const data: any = await auth();
  console.log("data in home",data)
  // Redirect to login if not authenticated
  if (!data?.user) {
    redirect("/login");
  }
  // xx
  if(data?.user.role=="admin"){
    redirect("/admin/dashboard")
  }

  return (
    <DashboardLayout user={data.user}>
      <DashboardContent />
    </DashboardLayout>
  );
}
