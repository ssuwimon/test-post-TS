import { Input } from 'antd'
import React from 'react'
import { IoSearchOutline } from "react-icons/io5";

type Search = {
  onChange?: (e:React.ChangeEvent<HTMLInputElement>) => void;
  // value?: 
}

export default function SearchBar(props:Search) {
    const {onChange} = props
  return (
    <div>
      <Input 
      // value={value}
      onChange={onChange}
      placeholder='title'
      prefix={<IoSearchOutline/>}
      />
    </div>
  )
}
