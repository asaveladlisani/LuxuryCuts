import BarberCard from '../components/BarberCard';

const barbers = [
  {
    id: 1,
    name: 'Marcus Williams',
    role: 'Master Barber',
    bio: 'Precision-led cuts with a classic Cape Town edge.',
    image:
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 2,
    name: 'Daniel Mokoena',
    role: 'Senior Barber',
    bio: 'Known for clean fades and effortless modern styling.',
    image:
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=85',
  },
  {
    id: 3,
    name: 'Leo Daniels',
    role: 'Barber & Stylist',
    bio: 'Texture, shape and detail are his signature.',
    image:
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=85',
  },
];

export default function About() {
  return (
    <main className="bg-[#0c0c0c] pt-32 pb-24 text-[#f5f2ec]">
      <div className="container">

        {/* Our Story */}
        <section className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          
          {/* Story Content */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a96e]">
              Our Story
            </div>

            <h1 className="mt-4 font-display text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
              Built for the{' '}
              <span className="text-[#c9a96e]">
                modern gentleman.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-[#9b9b9b]">
              LuxuryCuts began with a simple idea: a barbershop should be
              more than a place to get a haircut. It should be a place where
              craft, conversation and confidence meet.
            </p>

            <p className="mt-5 max-w-xl leading-8 text-[#9b9b9b]">
              Our team brings traditional barbering technique together with
              contemporary styling, creating cuts that work in the chair
              and in real life.
            </p>

            {/* Small detail */}
            <div className="mt-8 flex items-center gap-3 text-sm text-[#c9a96e]">
              <span className="h-px w-10 bg-[#c9a96e]" />
              Precision. Style. Confidence.
            </div>
          </div>

          {/* Story Image */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10 bg-[#151515]">
            <img
              src="/images/luxurycuts-story.jpg"
              alt="LuxuryCuts barber styling a client"
              className="h-full w-full object-cover"
            />

            {/* Image overlay */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          </div>
        </section>

        {/* Team */}
        <section className="mt-24">
          <div className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a96e]">
            The people behind the chair
          </div>

          <h2 className="mt-3 mb-10 font-display text-4xl font-bold sm:text-5xl">
            Meet the team.
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {barbers.map((barber) => (
              <BarberCard
                key={barber.id}
                barber={barber}
              />
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}