import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const usePermissions = () => {
  const [pages, setPages] = useState<any>([]);
  const { data: session } = useSession();

  useEffect(() => {
    setPages(
      getPages(session?.user?.permissions)
    );
  }, [JSON.stringify(session)]);

  return { pages, user: session?.user };
}

const getPages = (permissions: Record<string, unknown> | '*' | null) => {
  switch (permissions) {
    case '*':
      return "*";
    case null:
      return [];
    case undefined:
      return [];
    default:
      return Object.entries(permissions).filter(([_, value]) => value === "*" || (typeof value === 'string' && value.includes('GET'))).map(([key]) => key);
  }
}