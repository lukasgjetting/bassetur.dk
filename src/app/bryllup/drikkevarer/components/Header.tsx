import useCart from "../useCart";

type HeaderProps = {
  userName: string;
};

const Header: React.FC<HeaderProps> = ({ userName }) => {
  return (
    <div className="flex justify-between items-center bg-purple-800 text-purple-50 p-4">
      <h1>Hej {userName}!</h1>
      <div>
        <button className="bg-purple-700 text-purple-50 p-2 rounded-lg">
          Historik
        </button>
      </div>
    </div>
  );
};

export default Header;
