"use client";
import { Post } from "@/types";
import { Tag, Modal, Button, Pagination } from "antd";
import moment from "moment";
import React, { ReactElement, useState } from "react";
import { MdEdit, MdDelete } from "react-icons/md/index";
import { ExclamationCircleFilled } from '@ant-design/icons';
import DraftForm from "@/app/draft/form";
import { useSearchParams, useParams,usePathname, useRouter } from 'next/navigation';

type ListPost = {
  posts: {
    posts: Post[],
    page: number,
    size:number,
    count: number
  };
  draft?: boolean;
};
async function deleteData(id: string) {
  try {
    const res = await fetch(`https://post-api.opensource-technology.com/api/posts/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await res.json()
    return response

  } catch (error) {

  }
}

async function getDataId(id?: string) {
  const res = await fetch(`https://post-api.opensource-technology.com/api/posts/${id}`)
  const response = await res.json()
  return response
}
async function updatePublished(id?: string) {
  try {
    const res = await fetch(`https://post-api.opensource-technology.com/api/posts/${id}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          published: true
        }),
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
    const response = await res.json()
    return response
  } catch (error) {

  }
}

export default function ListPost(props: ListPost):ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { draft,posts } = props;
  const [modal, contextHolderModal] = Modal.useModal();
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [newId, setNewId] = useState<string>()
  const [data, setData] = useState()
  const [error, setError] = useState<string | null>()
  const pathname = usePathname();
  const { replace } = useRouter();
  const onEdit = async (id: string) => {
    const data = await getDataId(id)
    setData(data)
    setIsOpen(true)
    setNewId(id)
  };

  const onDelete = (id: string) => {
    setNewId(id)
    modal.confirm({
      title: `ยืนยันที่จะลบ ${draft ? "Draft" : "Post"} นี้ ? `,
      icon: <ExclamationCircleFilled />,
      okText: "ตกลง",
      cancelText: "ยกเลิก",
      onOk: async () => {
        const res = await deleteData(id);
        if (res?.error) {
          setError("Please try again")
        } else {
          setError(null)
          router.refresh()
          onCancel()
        }
      },
    });
  };
  const onCancel = () => {
    setIsOpen(false)
  }

  const onPublish = async (id: string) => {
    const response = await updatePublished(id)

    if (response?.error) {
      setError("Please try again")

    } else {
      setError(null)
      router.refresh()
    }
  }
  const onChangePagination = (page:number, pageSize:number) => {
    console.log("🚀 ~ file: listPost.tsx:117 ~ onChangePagination ~ page:", page)
    const params = new URLSearchParams(searchParams);
    if (page || pageSize) {
      params.set('page', page.toString());
      params.set('limit', pageSize.toString());

    } else {
      params.delete('query');
    }
    replace(`${pathname}?${params.toString()}`);


  }
  return (
    <>
      <DraftForm id={newId} isOpen={isOpen} onCancel={onCancel} data={data} />
      {contextHolderModal}

      {posts?.posts?.map((post: Post, index: number) => {
        const { id, title, content, published, created_at } = post;
        return (
          <div
            key={index}
            className={`border-2 border-[#e9e9e9] my-2 rounded-lg p-6`}
          >
            {(id === newId) && error && <div className="text-[#ef4c4c]">{error}</div>}
            <div className="flex justify-between items-center font-bold ">
              {title}
              <div className="flex gap-2 ">
                <MdEdit
                  onClick={() => onEdit(id)}
                  fontSize={30}
                  color="#F0B41C"
                  className="cursor-pointer hover:color-black"
                />
                <MdDelete
                  fontSize={30}
                  onClick={() => {
                    onDelete(id);
                  }}
                  color="#C30707"
                  className="cursor-pointer"
                />
                {draft && (
                  <Button
                    onClick={() => onPublish(id)}
                  >
                    Published
                  </Button>
                )}
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="font-light break-words w-full">{content}</div>
            </div>
            <Tag bordered={false} color="blue" className="mt-4">
              <div>{moment(created_at).format("LL , LT")}</div>
            </Tag>
          </div>
        );
      })}
      <Pagination
        current={posts?.page}
        onChange={onChangePagination}
        total={posts?.count} 
        />
    </>
  );
}
