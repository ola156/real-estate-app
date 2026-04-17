"use client";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Formik } from "formik";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/client";
import { useUser } from "@clerk/nextjs";
import FileUpload from "../_components/FileUpload";
import { Loader } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function EditListing({ params }) {
  const param = React.use(params);
  const { user } = useUser();
  const router = useRouter();

  const [listingData, setListingData] = useState([]);
  const [images, setImages] = useState([]); // This will now hold {url, type} objects from Cloudinary
  const [loading, setLoading] = useState(false);

  console.log('images:', images);
  useEffect(() => {
    user && checkIsCorrectUser();
  }, [user]);

  const checkIsCorrectUser = async () => {
    const { data, error } = await supabase
      .from("listing")
      .select("*, listingImages(listing_id, url)")
      .eq("createdBy", user?.primaryEmailAddress.emailAddress)
      .eq("id", param.id);

    if (data) {
      setListingData(data[0]);
    }

    if (data?.length <= 0) {
      router.replace("/");
    }
  };

  const onSubmitHandler = async (formValues) => {
    setLoading(true);

    // 1. Update the main listing text data
    const { data, error: updateError } = await supabase
      .from("listing")
      .update(formValues)
      .eq("id", param.id)
      .select();

    if (updateError) {
      toast.error("Error updating listing details");
      setLoading(false);
      return;
    }

    // 2. Save Cloudinary URLs to listingImages table
    // We only iterate if there are NEW images uploaded in this session
    if (images.length > 0) {
      for (const imageObj of images) {
        const { error: imgError } = await supabase
          .from("listingImages")
          .insert([{ 
            url: imageObj, 
            listing_id: param?.id 
          }]);

        if (imgError) {
          console.error("Error saving image URL:", imgError);
        }
      }
    }

    setLoading(false);
    toast.success("Listing updated successfully!");
  };

  const publishBtnHandler = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("listing")
      .update({ active: true })
      .eq("id", param.id)
      .select();

    if (data) {
      setLoading(false);
      toast.success("Listing published successfully");
    }
  };

  return (
    <div className="px-10 md:px-20 py-10">
      <h2 className="font-bold md:text-xl text-md mb-6">
        Edit your listing details
      </h2>
      <Formik
        enableReinitialize={true} // Important to show existing data
        initialValues={{
          type: listingData?.type || "Rent",
          propertyType: listingData?.propertyType || "",
          rent: listingData?.rent || "",
          totalPackage: listingData?.totalPackage || "",
          description: listingData?.description || "",
          profileImg: user?.imageUrl,
          fullName: user?.fullName,
          agent: listingData?.agent || "",
          agent_num: listingData?.agent_num || "",
        }}
        onSubmit={(values) => onSubmitHandler(values)}
      >
        {({ values, handleChange, handleSubmit, setFieldValue }) => (
          <form onSubmit={handleSubmit}>
            <div className="p-8 rounded-[2.5rem] border border-slate-100 shadow-sm bg-white">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Rent or Sale */}
                <div className="flex flex-col gap-2">
                  <h2 className="text-gray-500 text-sm font-bold uppercase tracking-wider">Type</h2>
                  <RadioGroup
                    value={values.type}
                    onValueChange={(v) => setFieldValue("type", v)}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="Rent" id="Rent" />
                      <Label htmlFor="Rent">Rent</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="Sale" id="Sale" />
                      <Label htmlFor="Sale">Sale</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Property Type */}
                <div className="flex flex-col gap-2">
                  <h2 className="text-sm text-gray-500 font-bold uppercase tracking-wider">Property Type</h2>
                  <Select
                    value={values.propertyType}
                    onValueChange={(e) => setFieldValue("propertyType", e)}
                  >
                    <SelectTrigger className="w-full h-12 rounded-xl border-slate-100 bg-slate-50">
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Single Room">Single Room</SelectItem>
                        <SelectItem value="Room in a flat">Room in a flat</SelectItem>
                        <SelectItem value="Room self-contained">Room self-contained</SelectItem>
                        <SelectItem value="Room and palor self-contained">Room and palor self-contained</SelectItem>
                        <SelectItem value="2 Bed Room">2 Bed Room</SelectItem>
                        <SelectItem value="3 Bed Room">3 Bed Room</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pricing and Agent */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                <div className="space-y-2">
                  <Label className="text-gray-500">Rent (₦)</Label>
                  <Input type="number" name="rent" onChange={handleChange} value={values.rent} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Total Package (₦)</Label>
                  <Input type="number" name="totalPackage" onChange={handleChange} value={values.totalPackage} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Agent Name</Label>
                  <Input name="agent" onChange={handleChange} value={values.agent} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-500">Agent Phone</Label>
                  <Input name="agent_num" onChange={handleChange} value={values.agent_num} className="h-12 rounded-xl" />
                </div>
              </div>

              {/* Description */}
              <div className="mt-8 space-y-2">
                <Label className="text-gray-500">Description</Label>
                <Textarea name="description" onChange={handleChange} value={values.description} className="rounded-2xl min-h-[120px]" />
              </div>

              {/* File Upload Section */}
              <div className="my-10">
                <h2 className="font-bold text-slate-800 mb-4">Property Media</h2>
                <FileUpload
                  setImages={(value) => setImages(value)}
                  imageList={listingData.listingImages}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-end mt-10">
                <Button
                  variant="outline"
                  className="h-14 px-8 rounded-2xl font-bold border-2"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? <Loader className="animate-spin" /> : "Save Changes"}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="h-14 px-8 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 transition-all"
                      type="button"
                      disabled={loading || listingData?.active}
                    >
                      {listingData?.active ? "Published" : "Publish Listing"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-[2rem]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Ready to go live?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will make your property visible to all potential renters on the platform.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={publishBtnHandler} className="rounded-xl bg-blue-600">
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default EditListing;