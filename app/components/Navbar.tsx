import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <div className="flex items-center justify-between p-4">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/grospace-log.png"
          alt="GroSpace Logo"
          width={150}
          height={40}
          className="object-contain"
        />
      </Link>
    </div>
  );
};

export default Navbar; 