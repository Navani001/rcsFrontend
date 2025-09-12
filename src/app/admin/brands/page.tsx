import { auth } from "@/utils";
import { redirect } from "next/navigation";
import { SuperAdminLayout } from "@/component/admin/SuperAdminLayout";
import BrandApprovalManagement from "@/component/admin/BrandApprovalManagement";
// import { BrandApprovalManagement } from "@/component/admin/BrandApprovalManagement";

export default async function AdminBrandsPage() {
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
      <BrandApprovalManagement />
    </SuperAdminLayout>
  );
}
