const links = [
  {
    logo: "https://placehold.co/150x100/green/FFF",
    link: "",
  },
  {
    logo: "https://placehold.co/150x100/black/FFF",
    link: "",
  },
  {
    logo: "https://placehold.co/150x100/gray/FFF",
    link: "",
  },
  {
    logo: "https://placehold.co/150x100/cyan/black",
    link: "",
  },
  {
    logo: "https://placehold.co/150x100/yellow/black",
    link: "",
  },
];

function ShoppingLinks() {
  return (
    <div className="flex flex-col items-center py-10 justify-center gap-10">
      {links.map((link, index) => (
        <a key={index} href={link.link}>
          <img
            className="w-40 h-auto"
            src={link.logo}
            alt="Shopping Linkleri"
          />
        </a>
      ))}
    </div>
  );
}

export default ShoppingLinks;
