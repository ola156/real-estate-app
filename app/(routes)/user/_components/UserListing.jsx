import { supabase } from '@/utils/client'
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { 
  MapPin, 
  Trash2, 
  Edit3, 
  Loader2, 
  Video, 
  Calendar,
  Globe,
  EyeOff,
  ChevronRight
} from 'lucide-react'
import Link from 'next/link'

function UserListing() {
  const { user } = useUser()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) getUserListing()
  }, [user])

  const getUserListing = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('listing')
        .select('*, listingImages(url, listing_id)')
        .eq('createdBy', user.primaryEmailAddress.emailAddress)
        .order('created_at', { ascending: false })

      if (error) throw error
      setListings(data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async (id, currentStatus) => {
    const { error } = await supabase
      .from('listing')
      .update({ active: !currentStatus })
      .eq('id', id)

    if (!error) {
      setListings((prev) => 
        prev.map((item) => item.id === id ? { ...item, active: !currentStatus } : item)
      )
    }
  }

  const handleDelete = async (id) => {
    const confirmDelete = confirm("Are you sure? This listing will be gone forever.")
     
    const { error } = await supabase.from('listing').delete().eq('id', id)
    if (!error) setListings((prev) => prev.filter((item) => item.id !== id))
        alert('Listing deleted successfully.')
  }

  return (
    <div className="max-w-4xl mx-auto p-2 md:p-6 md:pt-24 pt-7 pb-20">
      <div className="mb-12">
        <h2 className='font-black text-4xl text-slate-900 tracking-tighter'>
          Manage <span className="text-blue-600">Listings</span>
        </h2>
        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">
          Control your digital property portfolio
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={32} /></div>
      ) : (
        <div className="flex flex-col gap-10">
          {listings.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden transition-all hover:shadow-2xl hover:shadow-slate-100"
            >
              {/* 1. Video Section (Always on Top) */}
              <div className="relative aspect-video bg-slate-900 overflow-hidden">
                {item.listingImages?.[0] ? (
                  <video 
                    src={item.listingImages[0].url} 
                    className={`w-full h-full object-cover ${item.active ? 'opacity-90' : 'opacity-40 grayscale'}`}
                    muted
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-700"><Video size={48} /></div>
                )}
                
                {/* Floating Status Badge */}
                <div className={`absolute top-6 left-6 px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl backdrop-blur-md ${
                  item.active ? 'bg-green-500 text-white' : 'bg-slate-950 text-slate-400'
                }`}>
                   <div className={`w-2 h-2 rounded-full ${item.active ? 'bg-white animate-pulse' : 'bg-slate-700'}`} />
                   {item.active ? 'Published' : 'Draft Mode'}
                </div>
              </div>

              {/* 2. Content Section */}
              <div className="p-8 space-y-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-blue-600 font-bold text-[10px] uppercase tracking-widest">
                    <MapPin size={12} /> {item.area || 'Ibadan'}
                  </div>
                  <h3 className="text-xl md:text-2xl font-black text-slate-950 tracking-tight">{item.address}</h3>
                </div>

                {/* Info Bar */}
                <div className="flex gap-4 md:gap-6 items-center border-y border-slate-50 py-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Listed On</span>
                    <span className="text-sm font-bold text-slate-700">{new Date(item.created_at).toLocaleDateString('en-GB')}</span>
                  </div>
                  <div className="h-8 w-px bg-slate-100" />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Rent</span>
                    <span className="text-sm font-bold text-slate-900">{item.rent}</span>
                  </div>
                      <div className="h-8 w-px bg-slate-100" />
                   <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Total Package</span>
                    <span className="text-sm font-bold text-slate-900">{item.totalPackage}</span>
                  </div>
                </div>

                {/* Action Grid (Universal for small and big screens) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button 
                    onClick={() => handlePublish(item.id, item.active)}
                    className={`col-span-2 md:col-span-1 flex items-center justify-center gap-2 p-4 rounded-2xl transition-all font-bold text-xs ${
                      item.active 
                      ? 'bg-amber-50 text-amber-600 hover:bg-amber-100' 
                      : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {item.active ? <><EyeOff size={16} /> Disable</> : <><Globe size={16} /> Publish</>}
                  </button>

                  <Link href={`/edit-listing/${item.id}`} className="md:col-span-1">
                    <button className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white transition-all font-bold text-xs">
                      <Edit3 size={16} /> Edit
                    </button>
                  </Link>

                  <button 
                    onClick={() => handleDelete(item.id)}
                    className="md:col-span-1 flex items-center justify-center gap-2 p-4 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all font-bold text-xs"
                  >
                    <Trash2 size={16} /> Delete
                  </button>

                  <Link href={`/for-rent/${item.id}`} className="md:col-span-1">
                    <button className="w-full h-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-all font-bold text-xs">
                      View <ChevronRight size={16} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserListing