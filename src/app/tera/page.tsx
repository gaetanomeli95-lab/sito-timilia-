import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeraStory from "@/components/tera/TeraStory";

export default function TeraPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1ea]">
      <Navbar />
      <main className="flex-1">
        <TeraStory />
      </main>
      <Footer />
    </div>
  );
}
