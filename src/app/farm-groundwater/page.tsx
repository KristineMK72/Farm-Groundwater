import Container from "@/components/Container";
import Card from "@/components/Card";

export default function FarmGroundwaterPage() {
  return (
    <main>
      <Container className="pt-10">
        <Card className="hero-panel p-8 md:p-14">
          <div className="kicker">Farm Groundwater</div>
          <h1 className="h1 mt-4">Minnesota Groundwater Explorer</h1>
          <p className="p mt-6 max-w-2xl">
            Interactive map + layers coming next.
          </p>
        </Card>
      </Container>
    </main>
  );
}
