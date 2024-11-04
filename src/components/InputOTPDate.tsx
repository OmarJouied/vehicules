import { useState } from "react"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "./ui/input-otp"

const InputOTPDate = ({ date, setDate }: { date: string; setDate: any }) => {
  return (
    <InputOTP maxLength={8} value={date.split("/").join("")} onChange={(value) => setDate(`${value.slice(0, 2) ?? ""}/${value.slice(2, 4) ?? ""}/${value.slice(4) ?? ""}`)}>
      <InputOTPGroup className="flex-[.25]">
        <InputOTPSlot index={0} className="w-full border-r-0" />
        <InputOTPSlot index={1} className="w-full border-l-0" />
      </InputOTPGroup>
      /
      <InputOTPGroup className="flex-[.25]">
        <InputOTPSlot index={2} className="w-full border-r-0" />
        <InputOTPSlot index={3} className="w-full border-l-0" />
      </InputOTPGroup>
      /
      <InputOTPGroup className="flex-[.5]">
        <InputOTPSlot index={4} className="w-full border-r-0" />
        <InputOTPSlot index={5} className="w-full border-l-0 border-r-0" />
        <InputOTPSlot index={6} className="w-full border-l-0 border-r-0" />
        <InputOTPSlot index={7} className="w-full border-l-0" />
      </InputOTPGroup>
    </InputOTP>
  )
}

export default InputOTPDate