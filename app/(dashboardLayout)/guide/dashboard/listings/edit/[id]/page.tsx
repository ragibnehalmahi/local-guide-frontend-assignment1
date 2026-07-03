// dashboardlayout/guide/dashboard/listings/edit/[id]/page.tsx
import EditListingForm from "@/components/modules/Guide/EditListingForm";
import { getListingById } from "@/services/listing/listing.service";   
import { IListing } from "@/types/listing.interface";
import { notFound } from "next/navigation";

 
export default async function EditListingPage(props: any) {
  try {
     
    let id = "";
    
     
    if (props.params) {
      const params = await props.params;
      id = params?.id || params?._id || "";
    }
    
     
    if (!id && props.id) {
      id = props.id;
    }
    
   
    if (!id && typeof window !== 'undefined') {
      const path = window.location.pathname;
      const match = path.match(/edit\/([^/]+)/);
      id = match ? match[1] : "";
    }

    console.log("🔍 Debug - All props keys:", Object.keys(props));
    console.log("🔍 Debug - Received ID:", id);
   
    if (!id || id === "undefined" || id === "edit") {
      console.error("❌ Invalid ID received:", id);
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold text-red-500">Error: Invalid Listing ID</h1>
          <p className="mt-2">ID received: <code>{id || "(empty)"}</code></p>
          
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h2 className="font-bold">Possible fixes:</h2>
            <ol className="mt-2 list-decimal pl-5">
              <li>Check if the listing has a valid _id</li>
              <li>Verify the Edit link is correctly formed</li>
              <li>Make sure folder is named <code>[id]</code> not <code>id</code></li>
            </ol>
          </div>
          
          <a 
            href="/guide/dashboard/listings" 
            className="inline-block mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            ← Back to Listings
          </a>
        </div>
      );
    }

   
    console.log("📞 Calling API with ID:", id);
    const response = await getListingById(id);
    
    if (!response.success || !response.data) {
      console.error("❌ API Error:", response.message);
      notFound();
    }

    const listing: IListing = response.data;
    
    console.log("✅ Listing loaded:", listing.title);

    return (
      <div className="container mx-auto px-4 py-8">
        <EditListingForm listing={listing} />
      </div>
    );
    
  } catch (error: any) {
    console.error("❌ Fatal page error:", error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-500">Error Loading Page</h1>
        <p className="mt-2">{error.message}</p>
        <a 
          href="/guide/dashboard/listings" 
          className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ← Back to Listings
        </a>
      </div>
    );
  }
}