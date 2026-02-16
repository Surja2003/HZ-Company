import { Seo } from "../components/Seo";

export function Careers() {
  return (
    <div className="min-h-screen bg-white">
      <Seo
        title="Careers"
        description="Explore open roles and apply to join HZ IT Company."
        path="/careers"
      />

      <section className="pt-28 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 font-poppins">
            Careers
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl">
            We’re building a world-class delivery team. Share your profile and we’ll get back to you.
          </p>

          <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <p className="text-gray-700">
              Career applications will be enabled after OTP + email verification is rolled out.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
