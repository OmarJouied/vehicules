import { connectDB } from "@/lib/db";

export const wrapperEndPoints = (endpoint: (req: Request) => Promise<Response>) => async (req: Request) => {
  await connectDB();
  return endpoint(req);
}