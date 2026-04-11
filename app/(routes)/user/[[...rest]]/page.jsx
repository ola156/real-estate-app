'use client'
import { UserButton, UserProfile } from '@clerk/nextjs'
import { Building } from 'lucide-react'
import React from 'react'
import UserListing from '../_components/UserListing'

function User() {
  return (
    <div className='my-2 px-3 md:px-7 lg:px-15'>
        
        <UserProfile>
            <UserButton.UserProfilePage 
            label='My Listing'
            labelIcon={<Building className='h-5 w-5'/>}
            url='my-listing'
            routing='hash'
            >
<UserListing/>
            </UserButton.UserProfilePage>
        </UserProfile>
    </div>
  )
}

export default User