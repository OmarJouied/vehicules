import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "./ui/button"

const HoverCardButton = ({ children, className, label }: { label: string; children: React.ReactNode; className: string }) => {
  return (
    <HoverCard closeDelay={0} openDelay={0}>
      <HoverCardTrigger asChild>
        <Button variant="link" className={className}>
          {children}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-fit bg-primary text-white">
        {label}
      </HoverCardContent>
    </HoverCard>
  )
}

export default HoverCardButton