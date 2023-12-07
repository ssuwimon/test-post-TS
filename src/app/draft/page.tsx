import ListPost from '@/components/listPost'
import React from 'react'
import AddForm from './add'

type Props = {}
async function getData(term?:string) {
  const res = await fetch(`https://post-api.opensource-technology.com/api/posts/draft?${term ? `&term=${term}`: ''}`,

      {
        cache: 'no-cache'
      }
    )
  
    if (!res.ok) {
      throw new Error('Failed to fetch data')
    }
    return res.json()
  }
  
export default async function DraftPage({searchParams}:any) {

  const data = await getData(searchParams?.query)

    return (
      <div className='w-[80%] m-auto'>
      <AddForm label="create draft"/>
        <ListPost posts={data} draft />
      </div>
    )}