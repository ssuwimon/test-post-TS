import React, { useEffect, useState } from 'react'
import { Button, Modal, Form } from 'antd';
import FormItem from '@/components/form';
import { useRouter } from 'next/navigation';
import { Post } from '@/types';


type Props = {
    id?: string;
    isOpen?: boolean;
    onCancel: () => void;
    error?: (error: string) => string;
    data?: Post
}


type Req = {
    title: string;
    content: string;
    published: boolean
}
async function newData(req?: Req) {
    try {
        const res = await fetch('https://post-api.opensource-technology.com/api/posts',
            {
                method: 'POST',
                body: JSON.stringify(req),
                headers: {
                    'Content-Type': 'application/json',
                }
            }

        )
        const response = await res.json()
        return response
    } catch (error) {
        return error

    }
}
async function editData(id?: string, req?: Req) {
    try {
        const res = await fetch(`https://post-api.opensource-technology.com/api/posts/${id}`,
            {
                method: 'PATCH',
                body: JSON.stringify(req),
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
  
export default function DraftForm(props: Props) {
    const { id, isOpen, onCancel, data } = props
    const [form] = Form.useForm();
    const router = useRouter()
    const [error, setError] = useState<string | null>()
    const [isSuccess, setIsSuccess] = useState<boolean>(false)
    const [idPost, setIdPost] = useState<string>()

    const handleSave = async () => {
        const values: Req = await form.validateFields();
        const response = !id ? await newData(values) : await editData(id, values)
        console.log("🚀 ~ file: form.tsx:89 ~ handleSave ~ response:", response)
        if (response?.error) {
            setError("Please try again")
            setIsSuccess(false)
        } else {
            setIdPost(response?.id)
            setError(null)
            setIsSuccess(true)
            router.replace('/draft')
            router.refresh();
        }
    }
    useEffect(() => {
        form.setFieldsValue({
            title: data?.title,
            content: data?.content,
            published: data?.published,
        });
    }, [data,id])
    const handleSaveAndclose = async () => {
        const values = await form.validateFields();
        const response = !id ? await newData(values) : await editData(id, values)
        if (response?.error) {
            setError("Please try again")
        } else {
            setError(null)
            form?.resetFields()
            router.refresh()
            onCancel()
        }
    }
    const onPublish = async () => {
        const response =await updatePublished(idPost)
        if (response?.error) {
            setError("Please try again")
        } else {
            setError(null)
            form?.resetFields()
            onCancel()
            router.replace('/')
            router.refresh()
        }
    }
    return (
        <Modal
            title={id ? "Edit Post" : "New Post"}
            open={isOpen}
            onCancel={() => {
                onCancel()
                setError(null)
            }}
            footer={[
                <div key="div" className='flex gap-2 justify-end'>
                    <Button
                        key="cancel"
                        onClick={() => {
                            form.resetFields()
                            setError(null)
                            onCancel()
                        }}>
                        cancel
                    </Button>

                    {!id && <Button key="save" onClick={handleSave}>save</Button>}
                    <Button onClick={handleSaveAndclose}> save & close </Button>
                </div>
            ]}
        >
            {error && <div className='text-[#ef4c4c]'>{error}</div>}
            <Form
                form={form}
                layout="vertical"
                autoComplete="off"
            >
                <FormItem
                    name="title"
                    label="title"
                    required />
                <FormItem
                    name="content"
                    label="content"
                    required
                    textArea />
                <FormItem
                    type="button"
                    name="published"
                onClick={onPublish}
                hidden={id}
                disabled={!isSuccess}
                />
            </Form>
        </Modal>
    )
}