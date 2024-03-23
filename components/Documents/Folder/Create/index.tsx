import { FolderIcon } from '@heroicons/react/20/solid';
import React, { useState } from 'react'
import { SupabaseFolder } from '../..';
import supabase from '@/utils/setup/supabase';
import { useSelector } from 'react-redux';
import { selectUser } from '@/redux/features/UserSlice';
import { toast } from 'react-toastify';

interface FolderCreateProps {
    active: Boolean,
    setActive: any,
    folders: Array<SupabaseFolder>,
    setFolders: any
}

const FolderCreate = ({active, setActive, folders, setFolders}: FolderCreateProps) => {
    
    

    const user = useSelector(selectUser);

    const handleCreateFolder = async (name: string) => {
        if (!name) return toast.error('Enter name');
        const folder = await supabase.from('DocumentFolders').insert({userId: user.id, name }).select().single().then(res => res.data);
        console.log(folder);
        setFolders([folder, ...folders]);
        setActive(false);
    }


    // reset if no text entered or esc pressed 
    const handleFocusOut = (e: any) => {
        console.log(e.target.value);
        if (!e.target.value) setActive(false);
       
    }

    const handleKeyDown = (e: any) => {
        if (e.key === 'Escape') setActive(false);
        else if (e.key === 'Enter') {
            console.log('create a folder');
            handleCreateFolder(e.target.value);
        }
    }

    if (!active) return <></>;
    return (
        <div className="w-full max-w-4xl mx-4">
            <div className="w-full border rounded-xl md:px-8 px-4 py-4 cursor-pointer justify-between flex items-center gap-4 h-24">
                <div className='flex gap-4'>
                    <FolderIcon className='h-12 w-12 text-blue-400 animate-pulse' />
                    <input className='outline-none' onBlur={handleFocusOut} onKeyDown={handleKeyDown}  placeholder='Enter folder name...' autoFocus/>
                </div>
                <div>
                    <p className='text-gray-500'>0 files</p>
                </div>
                
            </div>
        </div>
    )
}

export default FolderCreate