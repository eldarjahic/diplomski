function About() {
  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-4xl px-4 py-12">
      <section className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">About LD Nekretnine</h1>
          <p className="mt-2 text-lg text-gray-600">
            Connecting people with homes they love across Bosnia and Herzegovina.
          </p>
        </header>

        <article className="space-y-4 text-gray-700">
          <p>
            LD Nekretnine is a modern real estate platform built to make buying,
            selling, and renting property simpler for everyone. We combine a
            curated marketplace of verified listings with the tools that help you
            move fast&mdash;from tailored search filters to instant alerts and
            direct contact with owners or agents.
          </p>

          <p>
            Our mission is to remove friction from the property journey. Whether
            you are a family searching for your next home, an investor exploring
            new opportunities, or an owner ready to list, we provide a transparent
            experience backed by trustworthy data and responsive support.
          </p>

          <p>
            The platform was created in Sarajevo and is growing with a community
            of users who expect more from real estate services: better
            information, quicker decisions, and a friendly interface that works on
            every device. With LD Nekretnine you can:
          </p>

          <ul className="list-disc space-y-2 pl-6">
            <li>Browse verified homes for rent or purchase with rich details</li>
            <li>Save favorites and compare properties side by side</li>
            <li>Promote your own listings with professional presentation</li>
            <li>Use Google Maps integration to explore neighborhoods instantly</li>
          </ul>

          <p>
            We are continuously expanding the platform, adding new features, and
            partnering with local professionals to deliver the best real estate
            experience in the region. Thank you for being part of our story.
          </p>
        </article>

        <footer className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-gray-700">
          <h2 className="text-xl font-semibold text-gray-900">Get in touch</h2>
          <p className="mt-2">
            Have feedback, a partnership idea, or a property you would like to
            feature? Reach out at
            <a
              href="mailto:info@ldnekretnine.com"
              className="ml-1 font-semibold text-gray-900 hover:text-gray-600"
            >
              info@ldnekretnine.com
            </a>
            and our team will respond shortly.
          </p>
        </footer>
      </section>
    </main>
  );
}

export default About;


