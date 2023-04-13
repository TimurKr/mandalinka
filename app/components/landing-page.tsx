import SubheadingText from './subheading';
import Navigation from './navigation';

export default function LandingPage() {
  return (
    <>
      <section className="relative h-screen w-full items-center justify-center bg-primary">
        <div className="absolute top-1/2 left-1/2 h-min -translate-x-1/2 -translate-y-1/2 text-center">
          <h1 className="pb-5 text-5xl font-medium tracking-widest sm:text-6xl">
            Mandalinka
          </h1>
          <hr className="border-neutral-500" />
          <SubheadingText />
        </div>
        <Navigation />
      </section>
      <section className="h-screen">Prečo sme skvelí?</section>
    </>
  );
}
