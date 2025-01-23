import { useToast } from '@/hooks/use-toast';
import { useState } from 'react'
import { Button } from './ui/button';
import { NormalDate } from '@/utils/backend-functions';

const ReadMore = (
  { title, setCurrentData, hasNext, tableUpdate }: { title: string; setCurrentData: React.Dispatch<React.SetStateAction<any[]>>; hasNext: boolean; tableUpdate: any }
) => {
  const [readMoreCounter, setReadMoreCounter] = useState(0);
  const [readMoreDisabled, setReadMoreDisabled] = useState(false);
  const [readMoreText, setReadMoreText] = useState("Lire la suite");
  const { toast } = useToast();

  if (hasNext) {
    return null;
  }

  const handleReadMore = async () => {
    try {
      setReadMoreText(prev => prev + "...");
      setReadMoreDisabled(true);

      const { data } = await fetch(`/api/${title}?more=${readMoreCounter + 1}`).then(res => res.json());

      if (data.length === 0) {
        throw new Error("No suite");
      }

      const newData = data.map((r: any) => ({ ...r, ...(r.date ? { date: new Intl.DateTimeFormat(['ban', 'id'], { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(r.date)) } : {}) }))

      setReadMoreDisabled(false);
      setReadMoreText("Lire la suite");
      setReadMoreCounter(prev => prev + 1);
      setCurrentData((prev: any[]) => {
        tableUpdate?.updateData(newData);
        return [...prev, ...newData]
      });

    } catch ({ message }: any) {
      toast({
        title: message,
        variant: "destructive"
      });
      setReadMoreText(message);
    }
  }

  return (
    <Button
      size="sm"
      onClick={handleReadMore}
      disabled={readMoreDisabled}
    >
      {readMoreText}
    </Button>
  )
}

export default ReadMore