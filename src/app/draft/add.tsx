'use client'
import React, { useState } from 'react'
import { Button } from 'antd'
import { log } from 'console'
import Form from './form'
import SearchBar from '@/components/search'
import { Post } from '@/types'
import { useSearchParams, useParams,usePathname, useRouter } from 'next/navigation';


type Props = {
  label?: string;
}

export default function AddForm(props: Props) {
  
 
  const searchParams = useSearchParams();
  const { label } = props
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const pathname = usePathname();
  const { replace } = useRouter();

  const onCancel = () => {
    setIsModalOpen(false)
  };
  const handleError = (error: string) => {
    setError(error)
    return error
  }

  const handleChange =async (e: React.ChangeEvent<HTMLInputElement>) => {
    const params = new URLSearchParams(searchParams);
    if (e) {
      params.set('query', e.target.value);
    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);

  }
  return (
    <div className='flex justify-between'>
       <SearchBar 
onChange={(e) => handleChange(e)}
       />

      <Button onClick={() => {
        setIsModalOpen(true)
      }}>{label}</Button>
      {error && <div className='text-[#ef4c4c]'>{error}</div>}
      <Form isOpen={isModalOpen} onCancel={onCancel} error={handleError} />

    </div>
  )
}

