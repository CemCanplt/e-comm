import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Facebook, Instagram, Twitter } from "lucide-react";

const AboutUsPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((res) => res.json())
      .then((data) => setTeamMembers(data));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">About Us</h1>
      <p className="text-lg mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet
        nulla auctor, vestibulum magna sed, convallis ex.
      </p>
      <p className="text-lg mb-4">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet
        nulla auctor, vestibulum magna sed, convallis ex.
      </p>
      <h2 className="text-2xl font-bold mb-4">Meet Our Team</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white p-4 rounded">
            <img
              src={`https://picsum.photos/200/300?random=${member.id}`}
              alt={member.name}
              className="w-full h-48 object-cover mb-4"
            />
            <h3 className="text-xl font-bold mb-2">{member.name}</h3>
            <p className="text-lg mb-4">{member.address.city}</p>
            <div className="flex space-x-4">
              <a
                href={`https://twitter.com/${member.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                <Twitter size={24} />
              </a>
              <a
                href={`https://www.facebook.com/${member.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                <Facebook size={24} />
              </a>
              <a
                href={`https://www.instagram.com/${member.username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-700"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>
        ))}
      </div>
      <Link to="/" className="text-blue-500 hover:text-blue-700">
        Back to Home
      </Link>
    </div>
  );
};

export default AboutUsPage;
