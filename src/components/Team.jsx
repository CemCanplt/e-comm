const teamMembers = [
  {
    name: "Gökhan Özdemir",
    role: "Project Manager",
    // Replace URL with the actual LinkedIn profile image if available
    img: "https://avatars.githubusercontent.com/u/8511119?v=4",
  },
  {
    name: "Cem Canpolat",
    role: "Full Stack Developer",
    img: "https://via.placeholder.com/150?text=Cem+Canpolat",
  },
  {
    name: "Team Member 1",
    role: "Developer",
    img: "https://via.placeholder.com/150?text=Member+1",
  },
  {
    name: "Team Member 2",
    role: "Designer",
    img: "https://via.placeholder.com/150?text=Member+2",
  },
  // Add more team members as needed
];

// Team sayfası

function Team() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Our Team</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {teamMembers.map(({ name, role, img }, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-white p-6 shadow rounded"
          >
            <img
              src={img}
              alt={name}
              className="w-24 h-24 rounded-full object-cover mb-4"
            />
            <h2 className="text-xl font-semibold">{name}</h2>
            <p className="text-md text-gray-600">{role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Team;
