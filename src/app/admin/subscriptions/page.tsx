import { auth } from "@/utils";
import { redirect } from "next/navigation";
import { SuperAdminLayout } from "@/component/admin/SuperAdminLayout";
import { SubscriptionManagement } from "@/component/admin/SubscriptionManagement";

export default async function AdminSubscriptionsPage() {
  const data: any = await auth();
  
  // Redirect to login if not authenticated
  if (!data?.user) {
    redirect("/login");
  }

  // TODO: Add role-based access control for super admin
  // if (data.user.role !== 'super_admin') {
  //   redirect("/");
  // }

  return (
    <SuperAdminLayout user={data.user}>
      <SubscriptionManagement />
    </SuperAdminLayout>
  );
}
