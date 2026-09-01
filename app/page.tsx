import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/public/Hero";
import { About } from "@/components/public/About";
import { Skills } from "@/components/public/Skills";
import { Projects } from "@/components/public/Projects";
import { Experience } from "@/components/public/Experience";
import { Education } from "@/components/public/Education";
import { Building } from "@/components/public/Building";
import { Vision } from "@/components/public/Vision";
import { Contact } from "@/components/public/Contact";
import { PrivateTeaser } from "@/components/public/PrivateTeaser";

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Building />
        <Vision />
        <Contact />
        <PrivateTeaser />
      </main>
      <Footer />
    </>
  );
}
