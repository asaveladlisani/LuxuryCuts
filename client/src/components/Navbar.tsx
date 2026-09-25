import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Scissors } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const nav = [
    ['Home', '/'],
    ['Services', '/services'],
    ['Our Story', '/about'],
    ['Contact', '/contact'],
  ];

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0c0c0ce8] backdrop-blur-xl border-b border-white/5">
      <div className="container h-20 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex items-center gap-3"
        >
          <span className="h-10 w-10 rounded-full border border-[#c9a96e] grid place-items-center">
            <Scissors
              size={18}
              className="text-[#c9a96e]"
            />
          </span>

          <span className="font-display text-xl font-extrabold tracking-tight">
            LUXURY
            <span className="text-[#c9a96e]">CUTS</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
          {nav.map(([label, path]) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `transition ${
                  isActive
                    ? 'text-[#c9a96e]'
                    : 'text-white/70 hover:text-white'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Booking Button */}
        <Link
          to="/booking"
          className="hidden md:block btn-gold text-sm"
        >
          Book an appointment
        </Link>

        {/* Mobile Booking Button + Menu Button */}
        <div className="md:hidden flex items-center gap-4">
        <Link
          to="/booking"
          onClick={closeMenu}
          className="btn-gold btn-sm"
        >
          Book Now
        </Link>
        <button
          type="button"
          className="text-white"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? (
            <X size={26} />
          ) : (
            <Menu size={26} />
          )}
        </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#0c0c0c]">
          <nav className="container py-6 flex flex-col gap-5">

            {nav.map(([label, path]) => (
              <NavLink
                key={path}
                to={path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `text-base transition ${
                    isActive
                      ? 'text-[#c9a96e]'
                      : 'text-white/80 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

          </nav>
        </div>
      )}
    </header>
  );
}