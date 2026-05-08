"use client";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
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
import FileUpload from "../_components/FileUpload";
import { Loader, Sparkles, X, CheckCircle } from "lucide-react"; 
import { toast } from "sonner";
import Image from "next/image";

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
  const router = useRouter();

  const [listingData, setListingData] = useState(null);
  const [images, setImages] = useState([]); 
  const [existingImages, setExistingImages] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  useEffect(() => {
    fetchUserAndListing();
  }, []);

  const fetchUserAndListing = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      toast.error("Session expired. Please login.");
      router.replace("/login");
      return;
    }

    setAuthenticatedUser(user);

    const { data, error } = await supabase
      .from("listing")
      .select("*, listingImages(id, url)") 
      .eq("user_id", user.id)
      .eq("id", param.id)
      .single();

    if (data) {
      setListingData(data);
      setExistingImages(data.listingImages || []);
    } else {
      toast.error("Listing not found");
      router.replace("/");
    }
  };

  const removeImage = async (imageId) => {
    const { error } = await supabase.from("listingImages").delete().eq("id", imageId);
    if (!error) {
      setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success("Image removed");
    }
  };

  const handleFormSubmit = async (formValues, isPublishing = false) => {
    setLoading(true);

    const cleanedValues = {
      ...formValues,
      rent: formValues.rent === "" ? 0 : Number(formValues.rent),
      totalPackage: formValues.totalPackage === "" ? 0 : Number(formValues.totalPackage),
      active: isPublishing ? true : listingData?.active 
    };

    const { data, error: updateError } = await supabase
      .from("listing")
      .update(cleanedValues)
      .eq("id", param.id)
      .select();

    if (updateError) {
      toast.error("Update failed: " + updateError.message);
      setLoading(false);
      return;
    }

    if (images.length > 0) {
      const imagePayload = images.map(imgUrl => ({
        url: imgUrl,
        listing_id: param.id
      }));
      await supabase.from("listingImages").insert(imagePayload);
    }

    toast.success(isPublishing ? "Published Live!" : "Listing Updated");
    setLoading(false);
    fetchUserAndListing();
    router.replace(`/dashboard/agent`);
  };

  if (!listingData) return <div className="flex justify-center p-20"><Loader className="animate-spin text-blue-600" /></div>;

  return (
    <div className="px-5 pt-26 md:px-20 lg:px-40 py-12 bg-[#FDFDFD] min-h-screen mt-20">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 flex justify-between gap-2 items-center">
          <div>
            <h2 className="font-black text-2xl text-slate-900 tracking-tight">
              {listingData.active ? "Update Listing" : "Complete Listing"}
            </h2>
            <p className="text-slate-500 font-medium">Manage your property details and images.</p>
          </div>
          {listingData.active && (
            <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full flex items-center gap-2 font-bold text-sm">
              <CheckCircle size={18}/> Active
            </div>
          )}
        </div>

        <Formik
          enableReinitialize={true}
          initialValues={{
            type: listingData?.type || "Rent",
            propertyType: listingData?.propertyType || "",
            rent: listingData?.rent ?? "",
            totalPackage: listingData?.totalPackage ?? "",
            description: listingData?.description || "",
          }}
          onSubmit={(values) => handleFormSubmit(values, false)}
        >
          {({ values, handleChange, handleSubmit, setFieldValue }) => (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="p-8 md:p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 bg-white">
                
                {/* Form fields stay the same */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 block ml-1">Listing Type</label>
                    <RadioGroup value={values.type} onValueChange={(v) => setFieldValue("type", v)} className="flex gap-4">
                      {["Rent", "Sale", "ShortLet"].map((item) => (
                        <div key={item} className={`flex items-center gap-2 p-3 rounded-xl border transition-all ${values.type === item ? 'border-blue-600 bg-blue-50' : 'border-slate-100'}`}>
                          <RadioGroupItem value={item} id={item} />
                          <Label htmlFor={item} className="font-bold cursor-pointer">{item}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-400 block ml-1">Category</label>
                    <Select value={values.propertyType} onValueChange={(e) => setFieldValue("propertyType", e)}>
                      <SelectTrigger className="w-full h-14 p-5 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl">
                        <SelectItem value="Single Room">Single Room</SelectItem>
                        <SelectItem value="Room in a flat">Room in a flat</SelectItem>
                        <SelectItem value="Room self-contained">Room self-contained</SelectItem>
                         <SelectItem value="Room & Palor self-con">Room & Palor self-con</SelectItem>
                        <SelectItem value="1 Bed Room">1 Bed Room</SelectItem>
                        <SelectItem value="2 Bed Room">2 Bed Room</SelectItem>
                         <SelectItem value="3 Bed Room">3 Bedroom</SelectItem>
                        <SelectItem value="Land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 pt-10 border-t border-slate-50">
                  <div className="space-y-2">
                    <Label className="font-bold text-slate-700">Price / Rent (₦)</Label>
                    <Input type="number" name="rent" onChange={handleChange} value={values.rent} className="h-14 rounded-2xl bg-slate-50 border-none" />
                  </div>
                  {values.type === "Rent" && (
                    <div className="space-y-2">
                      <Label className="font-bold text-slate-700">Total Package (₦)</Label>
                      <Input type="number" name="totalPackage" onChange={handleChange} value={values.totalPackage} className="h-14 rounded-2xl bg-slate-50 border-none" />
                    </div>
                  )}
                </div>

                <div className="mt-8 space-y-2">
                  <Label className="font-bold text-slate-700">Property Description</Label>
                  <Textarea name="description" onChange={handleChange} value={values.description} className="rounded-[2rem] min-h-[150px] bg-slate-50 border-none p-6" />
                </div>

                <div className="my-12">
                  <div className="flex items-center gap-2 mb-6">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h2 className="font-black text-lg text-slate-800">Media Management</h2>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                    {existingImages.map((img, index) => (
                      <div key={index} className="relative group aspect-square rounded-3xl overflow-hidden border border-slate-100">
                        <Image src={img.url} alt="property" fill className="object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeImage(img.id)}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <Label className="font-bold text-slate-700 block mb-4">Add More Photos</Label>
                  <FileUpload setImages={(value) => setImages(value)} />
                </div>

                <div className="flex justify-center  pt-6 border-t border-slate-50">
                  {listingData.active ? (
                    /* Show UPDATE button only if already active */
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="h-16 px-10 rounded-2xl font-black uppercase text-xs bg-slate-900 hover:bg-black text-white"
                    >
                      {loading ? <Loader className="animate-spin" /> : "Save Updates"}
                    </Button>
                  ) : (
                    /* Show GO LIVE button only if NOT active */
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          type="button" 
                          disabled={loading}
                          className="h-14 px-10  w-[40%] rounded-2xl font-black uppercase text-xs bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {loading ? <Loader className="animate-spin" /> : "Go Live"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-[3rem] p-10">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-2xl font-black">Publish Property?</AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-500 text-lg">
                            This will save your details and make the property visible on the platform.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6">
                          <AlertDialogCancel className="rounded-2xl h-14 font-bold bg-slate-100 border-none">Not yet</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleFormSubmit(values, true)} 
                            className="rounded-2xl h-14 font-bold bg-blue-600"
                          >
                            Yes, Go Live
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
              </div>
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default EditListing;