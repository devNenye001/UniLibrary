// src/components/Footer.jsx

const Footer = () => {
  return (
    <footer className="bg-white-900 text-gray-300 mt-12">
      <div className="py-5 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} UniLibrary. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
