import { FACILITIES } from "@/lib/data";

export default function FacilitiesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold tracking-widest uppercase rounded-full mb-4">
            Our Facilities
          </span>
          <h2 className="section-title">World-Class Infrastructure</h2>
          <p className="section-subtitle">
            Everything a student needs to learn, grow, and thrive — all within our campus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FACILITIES.map((facility, index) => (
            <div
              key={facility.id}
              className="card p-6 group cursor-default"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${facility.color} flex items-center justify-center text-2xl mb-5 shadow-md group-hover:scale-110 transition-transform duration-300`}>
                {facility.icon}
              </div>

              {/* Content */}
              <h3 className="font-serif font-semibold text-navy-800 text-lg mb-2 group-hover:text-blue-700 transition-colors">
                {facility.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">{facility.description}</p>

              {/* Hover line */}
              <div className={`mt-5 h-0.5 w-0 bg-gradient-to-r ${facility.color} rounded-full group-hover:w-full transition-all duration-500`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
