import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Introduction from "@/components/Introduction";
import HotelStory from "@/components/HotelStory";
import Rooms from "@/components/Rooms";
import Experiences from "@/components/Experiences";
import Gallery from "@/components/Gallery";
import Location from "@/components/Location";
import BookingCTA from "@/components/BookingCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <Navbar />
      <Hero />
      <Introduction />
      <HotelStory />
      <Rooms />
      <Experiences />
      <Gallery />
      <Location />
      <BookingCTA />
      <Footer />
    </main>
  );
}
