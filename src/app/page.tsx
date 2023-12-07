import ListPost from '@/components/listPost'
import React,{useState} from 'react'
import AddForm from './draft/add';
import SearchBar from '@/components/search';
import { Post } from '@/types';
import { Pagination } from 'antd';


async function getData(term ?: string, page?:number, limit?:number) {
  const res = await fetch(`https://post-api.opensource-technology.com/api/posts?page=${page}&limit=${limit}&${term ? `&term=${term}`: ''}`,
    {
      cache: 'no-cache'
    }
  )

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  return res.json()
}

export default async function Home({searchParams}:any) {
  const data = await getData(searchParams?.query, searchParams?.page,searchParams?.limit)

  
  return (
    <div className='w-[80%] m-auto'>
      <AddForm label="create post"/>
      <ListPost posts={data} />
      
    </div>
  )
}