import Image from "next/image";

export const metadata = {
  title: "Bienvenue",
  description: "Bienvenue sur l’application Véhicules",
};

export default async function Home() {
  return (
    <main className="container grid gap-4 grid-cols-1 lg:grid-cols-2">
      <div className="pt-6 text-center lg:text-left">
        <h1 className="text-3xl md:text-6xl capitalize leading-[1.2]">Bienvenue sur l’application Véhicules</h1>
        <p className="mt-4 text-xs md:text-lg text-gray-700">
          gestion globale de votre parc automobile
        </p>
      </div>
      <div className="flex justify-center">
        <Image className="object-contain" src="/leading-img.png" alt="Application Logo" width={500} height={500} />
      </div>
    </main>
  )
}
