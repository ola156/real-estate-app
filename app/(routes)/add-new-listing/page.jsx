'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/utils/client';
import { useUser } from '@clerk/nextjs';
import { Loader, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'


function AddNewListing() {


  const[ selectedAddress, setSelectedAddress ] = useState("")
 const {user} = useUser();
 const [loading, setLoading] = useState(false)
 const router = useRouter();
  
  const nextHandler = async()=>{
    setLoading(true)
    console.log(selectedAddress)
    const {data, error} = await  supabase.from("listing").insert([{
      address: selectedAddress,
     createdBy: user?.primaryEmailAddress?.emailAddress
   
    }]).select()

    if(data){
      setLoading(false)
      alert('New Data added,',data)
      router.replace(`/edit-listing/${data[0].id}`)

    } else {
      setLoading(false)
      alert('Error adding data,',error)
    }
  }


  return (
    <div className="p-10 flex flex-col gap-5 items-center justify-center">
      <h2 className="font-bold text-2xl">Add New Listing</h2>
      <div className='shadow-md border rounded-lg flex flex-col p-5 gap-5'>
        <h2 className="text-gray-500">Enter Address Which You Want To List</h2>
        <div className='flex gap-2 items-center mt-2'>
          <MapPin className='h-10 w-10 p-2 rounded-full text-primary'/>
          <Input 
         placeholder="Enter address..." 
         onChange={(e)=> setSelectedAddress(e.target.value)
          } />

        </div>
        <Button
        disabled={!selectedAddress  || loading}
         onClick={nextHandler}


         >
         {loading ? <Loader className='animate-spin'/> : 'Next'}</Button>
      </div>
    </div>
  );
}

export default AddNewListing;