import Card from "@/components/Card";
import newsData from "@/mocks/news.json";

export default function Home() {
  return (
    <div className="container mx-auto grid gap-6 px-4 py-6 md:grid-cols-2 lg:grid-cols-3">
      {newsData.map((n) => (
        <Card key={n.id} id={n.id} image={n.image} title={n.title} date={n.date} text={n.text} />
      ))}
    </div>
  );
}
