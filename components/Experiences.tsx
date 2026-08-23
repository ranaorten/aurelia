import ExperienceSection from "@/components/ExperienceSection";

const EXPERIENCES = [
  {
    title: "Restaurant",
    description:
      "Seasonal dining shaped by local ingredients and quiet hospitality.",
    image: "/images/experiences/restaurant.jpg",
    imageAlt: "AURELIA restaurant dining atmosphere",
  },
  {
    title: "Pool",
    description:
      "An infinity edge framed by olive trees and countryside views.",
    image: "/images/experiences/pool.jpg",
    imageAlt: "AURELIA infinity pool surrounded by olive trees",
  },
  {
    title: "Spa",
    description:
      "A sanctuary for stillness, treatments inspired by nature.",
    image: "/images/experiences/spa.jpg",
    imageAlt: "AURELIA spa sanctuary",
  },
  {
    title: "Gardens",
    description: "Mediterranean gardens shaped by seasons and time.",
    image: "/images/experiences/gardens.jpg",
    imageAlt: "AURELIA Mediterranean gardens",
  },
] as const;

export default function Experiences() {
  return (
    <section
      id="experiences"
      className="scroll-mt-24 bg-warm-ivory px-6 py-28 md:px-10 md:py-36"
    >
      <h2 className="font-heading text-center text-4xl uppercase tracking-wide text-deep-espresso sm:text-5xl md:text-6xl">
        The Aurelia Experience.
      </h2>

      <div className="mx-auto mt-16 flex max-w-6xl flex-col gap-24 md:mt-24 md:gap-32">
        {EXPERIENCES.map((experience, index) => (
          <div
            key={experience.title}
            className={
              index % 2 === 1 ? "bg-soft-cream px-6 py-16 md:px-10" : ""
            }
          >
            <ExperienceSection
              title={experience.title}
              description={experience.description}
              image={experience.image}
              imageAlt={experience.imageAlt}
              imagePosition={index % 2 === 0 ? "left" : "right"}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
