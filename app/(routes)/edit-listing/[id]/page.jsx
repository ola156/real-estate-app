"use client";
import React, { use, useEffect, useState } from "react";
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
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(param.id);
    user && checkIsCorrectUser();
  }, [user]);

  const checkIsCorrectUser = async () => {
    const { data, error } = await supabase
      .from("listing")
      .select("*, listingImages(listing_id, url)")
      .eq("createdBy", user?.primaryEmailAddress.emailAddress)
      .eq("id", param.id);

    if (data) {
      console.log(data);
      setListingData(data[0]);
    }

    if (data?.length <= 0) {
      router.replace("/");
    }
  };

  const onSubmitHandler = async (formValues) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("listing")
      .update(formValues)
      .eq("id", param.id)
      .select();

    if (data) {
      console.log("data", data);
      setLoading(false);
      alert("Listing updated successfully");
    }

    for (const image of images) {
      setLoading(true);
      const file = image;
      console.log("file", file);
      const fileName = Date.now().toString();
      const fileExt = fileName.split(".").pop();
      const { data, error } = await supabase.storage
        .from("listingImages")
        .upload(fileName, file, {
          contentType: `video/${fileExt}`,
          upsert: false,
        });

      if (error) {
        setLoading(false);
        alert(error);
      } else {
        const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL + fileName;
        console.log(imageUrl);
        const { data, error } = await supabase
          .from("listingImages")
          .insert([{ url: imageUrl, listing_id: param?.id }])
          .select();

        if (data) {
          console.log("image data", data);
          setLoading(false);
        }

        if (error) {
          setLoading(false);
        }
      }
      setLoading(false);
    }
  };

 const publishBtnHandler = async () => {
  setLoading(true);
  const { data, error } = await supabase.from("listing")
  .update({ active: true })
  .eq("id", param.id).select();

  if(data) {
    
    setLoading(false);
    alert("Listing published successfully");
  }


 }


  return (
    <div className="px-10 md:px-20">
      <h2 className="font-bold md:text-xl text-md">
        Enter some more details about your listing
      </h2>
      <Formik
        initialValues={{
          type: "rent",
          propertyType: "",
          rent: "",
          totalPackage: "",
          description: "",
          profileImg: user?.imageUrl,
          fullName: user?.fullName,
            agent: "",
            agent_num: "",
        }}
        onSubmit={(values) => {
          console.log(values);
          onSubmitHandler(values);
        }}>
        {({ values, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="p-8 rounded-lg shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-gray-500 text-md">Rent or Sale</h2>
                  <RadioGroup
                    defaultValue={listingData?.type}
                    onValueChange={(v) => (values.type = v)}>
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
                <div className="flex flex-col gap-2">
                  <h2 className="text-md text-gray-500">Property Type</h2>
                  <Select
                    defaultValue={listingData?.propertyType}
                    onValueChange={(e) => (values.propertyType = e)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue
                        placeholder={
                          listingData?.propertyType || "Select Property Type"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="Single Room">Single Room</SelectItem>
                        <SelectItem value="Room in a flat">
                          Room in a flat
                        </SelectItem>
                        <SelectItem value="Room self-contained">
                          Room self-contained
                        </SelectItem>
                        <SelectItem value="Room and palor self-contained">
                          Room and palor self-contained
                        </SelectItem>
                        <SelectItem value="2 Bed Room">2 Bed Room</SelectItem>
                        <SelectItem value="3 Bed Room">3 Bed Room</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                <div className="flex flex-col gap-2">
                  <h2 className="text-md text-gray-500">Rent</h2>
                  <Input
                    placeholder="Enter Rent Price"
                    type="number"
                    name="rent"
                    onChange={handleChange}
                    defaultValue={listingData?.rent}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-md text-gray-500">Total Package</h2>
                  <Input
                    placeholder="Enter Total Package"
                    type="number"
                    name="totalPackage"
                    onChange={handleChange}
                    defaultValue={listingData?.totalPackage}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-md text-gray-500">Agent</h2>
                  <Input
                    placeholder="Enter Agent Name"
                    type="text"
                    name="agent"
                    onChange={handleChange}
                    defaultValue={listingData?.agent}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h2 className="text-md text-gray-500">Agent Number</h2>
                  <Input
                    placeholder="Enter Agent Number"
                    type="text"
                    name="agent_num"
                    onChange={handleChange}
                    defaultValue={listingData?.agent_num}
                  />
                </div>
              </div>

              <div className="grid grid-col-1 gap-10 my-4">
                <div children="flex flex-col gap-3">
                  <h2 className="text-gray-500 text-md">Description</h2>
                  <Textarea
                    placeholder="Enter property description"
                    name="description"
                    onChange={handleChange}
                    defaultValue={listingData?.description}
                  />
                </div>
              </div>
              <div className="my-5">
                <h2 className="font-md text-gray-500 my-2">
                  Upload Property Images or Videos
                </h2>
                <FileUpload
                  setImages={(value) => setImages(value)}
                  imageList={listingData.listingImages}
                />
              </div>
              <div className="flex gap-7  justify-end">
                <Button
                  variant="outline"
                  className=" py-2 px-4 rounded-md text-primary border-primary"
                  type="submit"
                  disabled={loading}>
                  {loading ? <Loader className="animate-spin" /> : " Save"}
                </Button>
               
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                   <Button
                  className=" py-2 px-4 rounded-md hidden"
                  type="button"
                  disabled={loading}>
                  {loading ? (
                    <Loader className="animate-spin" />
                  ) : (
                    " Save & Publish"
                  )}
                </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                      Ready to publish your listing?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                      By clicking continue, your listing will be visible to everyone. Are you sure you want to publish?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => publishBtnHandler()}>
                       {loading ? <Loader className="animate-spin" /> : " Continue"}
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
