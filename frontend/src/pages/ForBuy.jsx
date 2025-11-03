import PropertyList from "../components/PropertyList";

function ForBuy() {
  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Properties for Sale</h1>
        <p className="mt-2 text-gray-600">
          Discover properties available for purchase
        </p>
      </div>

      <PropertyList listingType="buy" />
    </main>
  );
}

export default ForBuy;
