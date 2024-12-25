import { Card, CardDescription, CardHeader, CardTitle } from './ui/card'

const Unauthorize = ({ message }: { message: string }) => {
  return (
    <main className="container">
      <Card className="mx-auto max-w-lg shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-red-500">{message}</CardTitle>
          {message === "Unauthorize" && <CardDescription className=" text-red-400">Vous n&#39;etes pas autorise a interagir avec cette page.</CardDescription>}
        </CardHeader>
      </Card>
    </main>
  )
}

export default Unauthorize