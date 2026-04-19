import { Button } from "@/components/ui/button";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { CheckCircle, Circle, ShieldCheck } from "lucide-react";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <section className="w-full py-20 md:py-32 lg:py-40">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-8">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm w-fit font-semibold tracking-wider text-secondary-foreground/80">
                  TRUSTED BY 5M+ PATIENTS AND DOCTORS WORLDWIDE
                </div>
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline">
                  Intelligent Vision.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                    Trusted Care.
                  </span>
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Revolutionizing eye health through deep learning analysis and seamless connectivity with expert ophthalmologists.
                </p>
                <div className="flex flex-col gap-4 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <Link href="/dashboard">Begin Diagnosis</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                     <Link href="/doctor">Continue as Doctor</Link>
                  </Button>
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="relative w-full max-w-lg">
                  <div className="absolute -top-8 -left-8 z-10 flex items-center gap-3 rounded-full bg-background/30 backdrop-blur-xl p-3 pr-5 shadow-2xl shadow-blue-500/10 border border-white/10">
                    <div className="bg-green-500/20 p-2 rounded-full border border-green-400/20">
                       <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Initial Scans</p>
                      <p className="font-bold text-sm">Healthy Pattern</p>
                    </div>
                  </div>
                  <div className="absolute -bottom-8 -right-8 z-10 flex items-center gap-3 rounded-full bg-background/30 backdrop-blur-xl p-3 pr-5 shadow-2xl shadow-cyan-500/10 border border-white/10">
                    <div className="bg-blue-500/20 p-2 rounded-full border border-blue-400/20">
                       <ShieldCheck className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Confidence Score</p>
                      <p className="font-bold text-sm">98.97% Match</p>
                    </div>
                  </div>
                  
                  <div className="bg-card/50 dark:bg-secondary/20 rounded-2xl shadow-2xl shadow-primary/20 backdrop-blur-xl border border-white/10 overflow-hidden">
                    <div className="h-10 bg-muted/50 dark:bg-muted/20 flex items-center px-4 gap-2 border-b border-white/10">
                        <Circle className="h-3 w-3 text-red-500 fill-current" />
                        <Circle className="h-3 w-3 text-yellow-500 fill-current" />
                        <Circle className="h-3 w-3 text-green-500 fill-current" />
                    </div>
                     {heroImage && (
                      <div className="relative aspect-square">
                        <Image
                          alt="Hero"
                          className="object-cover"
                          data-ai-hint={heroImage.imageHint}
                          fill
                          src={heroImage.imageUrl}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-cyan-400/50 animate-pulse" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
