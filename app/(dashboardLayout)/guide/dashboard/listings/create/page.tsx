//app/(dashboardLayout)/guide/dashboard/listings/create/page.tsx 



import Link, { LinkProps } from "next/link";

import CreateListingForm from "@/components/modules/Guide/CreateListingForm";
export default function CreateListingPage() {
  return (
    <div style={{ padding: "20px" }}>
      <Link href="/guide/dashboard/listings">
        ← Back to Listings
      </Link>

      <h1 style={{ fontSize: "24px", margin: "20px 0" }}>
        Create New Listing
      </h1>

      <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "8px" }}>
        <CreateListingForm />
      </div>
    </div>
  );
}