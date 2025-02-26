import { Link } from "react-router-dom";

function HeaderLogo() {
  return (
    <div className="flex-1 flex justify-start">
      <Link to="/" className="text-xl font-bold text-(--Bandage-Rengi)">
        Bandage
      </Link>
    </div>
  );
}

export default HeaderLogo;