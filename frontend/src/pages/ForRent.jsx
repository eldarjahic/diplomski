import PropertyList from "../components/PropertyList";

function ForRent() {
  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Properties for Rent</h1>
        <p className="mt-2 text-gray-600">
          Find the perfect rental property for you
        </p>
      </div>

      <PropertyList listingType="rent" />
    </main>
  );
}

export default ForRent;
