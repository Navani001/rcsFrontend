"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const BrandSubscriptionPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home page since subscription is now a popup
    router.push("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default BrandSubscriptionPage;
