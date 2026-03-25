import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CheckCircle2 } from "lucide-react";

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');
  const symptomCheckerImage = PlaceHolderImages.find(p => p.id === 'symptom-checker');
  const findDoctorImage = PlaceHolderImages.find(p => p.id === 'find-doctor');
  const appointmentsImage = PlaceHolderImages.find(p => p.id === 'appointments');

  const features = [
    {
      title: "AI Symptom Analysis",
      description: "Describe your eye symptoms to get instant, AI-powered insights and preliminary guidance. Understand potential causes and know when to seek professional help.",
      image: symptomCheckerImage,
    },
    {
      title: "Find Top Specialists",
      description: "Search our network of verified ophthalmologists and optometrists. Filter by location, specialty, and availability to find the right doctor for you.",
      image: findDoctorImage,
    },
    {
      title: "Seamless Appointments",
      description: "Book and manage your appointments with ease. Get reminders and connect with your doctor for virtual consultations directly through our platform.",
      image: appointmentsImage,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none font-headline">
                    Intelligent Eye Care,
                    <br />
                    Instantly Accessible
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    OptiCare AI provides smart symptom analysis and connects you with trusted eye care professionals. Take control of your vision health today.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/signup">Get Started</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                     <Link href="#">Learn More</Link>
                  </Button>
                </div>
              </div>
              <div className="relative">
                {heroImage && (
                  <Image
                    alt="Hero"
                    className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
                    data-ai-hint={heroImage.imageHint}
                    height="400"
                    src={heroImage.imageUrl}
                    width="600"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
        
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">A Smarter Way to Manage Your Vision Health</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform integrates cutting-edge technology with professional medical access to give you a complete eye care solution.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:max-w-none lg:grid-cols-3 mt-12">
              {features.map((feature, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    {feature.image && (
                       <Image
                        alt={feature.title}
                        className="mx-auto aspect-video overflow-hidden rounded-t-lg object-cover"
                        data-ai-hint={feature.image.imageHint}
                        height="400"
                        src={feature.image.imageUrl}
                        width="600"
                      />
                    )}
                    <CardTitle className="pt-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container mx-auto grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Ready to See a Clearer Future for Your Eyes?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of users who trust OptiCare AI for their vision health.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
               <Button asChild size="lg" className="w-full">
                  <Link href="/signup">Create Your Account</Link>
                </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
