export default function QuickLinksSection() {
  const links = [
    {
      title: "ERP Portal",
      description: "Access fee management, student records, attendance, and academic reports.",
      icon: "🗂️",
      href: "#",
      color: "from-blue-600 to-blue-700",
      bg: "bg-blue-50",
      badge: "Management System",
    },
    {
      title: "LMS Platform",
      description: "Digital learning resources, assignments, e-books, and course materials online.",
      icon: "📚",
      href: "#",
      color: "from-indigo-600 to-violet-700",
      bg: "bg-indigo-50",
      badge: "Learning Platform",
    },
    {
      title: "Online Classes",
      description: "Live and recorded online classes accessible from anywhere, anytime.",
      icon: "🎓",
      href: "#",
      color: "from-teal-600 to-cyan-700",
      bg: "bg-teal-50",
      badge: "Virtual Classroom",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-semibold tracking-widest uppercase rounded-full mb-4">
            Digital Access
          </span>
          <h2 className="section-title">Quick Access Portals</h2>
          <p className="section-subtitle">
            Seamless digital tools for students, parents, and educators — learning without boundaries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className="group card p-7 flex flex-col items-start hover:-translate-y-1 transition-all duration-300"
            >
              {/* Badge */}
              <span className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-4">
                {link.badge}
              </span>

              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${link.color} flex items-center justify-center text-3xl mb-5 shadow-md group-hover:shadow-lg transition-shadow`}>
                {link.icon}
              </div>

              {/* Text */}
              <h3 className="font-serif font-bold text-navy-800 text-xl mb-2 group-hover:text-blue-700 transition-colors">
                {link.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed flex-1">{link.description}</p>

              {/* Arrow */}
              <div className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold bg-gradient-to-r ${link.color} bg-clip-text text-transparent`}>
                Access Portal
                <svg className="w-4 h-4 text-blue-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
