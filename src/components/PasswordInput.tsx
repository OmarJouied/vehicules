import { Input } from './ui/input';

const PasswordInput = ({ data, setData }: { data: any, setData: any }) => {
  return (
    <Input {...{
      type: "password",
      value: data.password ? data.password + "" : "",
      onChange: ({ target: { value } }) => setData((prev: any) => ({ ...prev, password: value })),
      className: "flex-1"
    }} />
  )
}

export default PasswordInput