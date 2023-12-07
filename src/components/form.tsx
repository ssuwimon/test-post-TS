import React from 'react'
import { Input, Form, Button } from 'antd'
import TextArea from 'antd/es/input/TextArea'


type Form = {
  name: string;
  textArea?: boolean;
  label?: string;
  required?: boolean;
  type?: string;
  hidden?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
}
export default function FormItem(props: Form) {
  const { name, textArea, label, required, type, hidden, onClick, ...res } = props
  return (
    <Form.Item
      label={label}
      name={name}
      {...res}
      rules={[
        {
          required: required ? true : false,
          message: `Please input ${label}`
        }
      ]}
    >

      {
        type ?
          !hidden && <Button
            {...res}
            onClick={onClick}>
            Publish now
          </Button>
          : textArea ? <TextArea
            placeholder={label}
            autoSize={{
              minRows: 3,
              maxRows: 5,
            }}
          /> : <Input placeholder={label} />
      }
    </Form.Item>
  )
}
