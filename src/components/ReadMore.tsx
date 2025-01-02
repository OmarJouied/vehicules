import { useToast } from '@/hooks/use-toast';
import { useState } from 'react'
import { Button } from './ui/button';

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
      // fetch data
      const { data } = await fetch(`/api/${title}?more=${readMoreCounter + 1}`).then(res => res.json());

      if (data.length === 0) {
        throw new Error("No suite");
      }

      setReadMoreDisabled(false);
      setReadMoreText("Lire la suite");
      setReadMoreCounter(prev => prev + 1);
      setCurrentData((prev: any[]) => {
        tableUpdate?.updateData(data);
        return [...prev, ...data]
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