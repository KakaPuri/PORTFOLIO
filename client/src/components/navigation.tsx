import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navigation() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/articles", label: "Artikel" },
    { href: "/contact", label: "Contact" },
    { href: "/admin", label: "Admin" },
  ];

  const isActive = (href: string) => {
    if (href === "/" && location === "/") return true;
    if (href !== "/" && location.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect shadow-xl rounded-b-2xl border-b-2 border-gradient-to-r from-blue-500 to-green-400 transition-all duration-300 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link href="/">
            <div className="text-2xl font-extrabold gradient-text cursor-pointer tracking-widest px-2 py-1 rounded-lg">
              KK
            </div>
          </Link>
          {/* Desktop Navigation Right */}
          <div className="hidden md:flex items-center space-x-8 bg-black/10 px-6 py-2 rounded-full shadow-inner border border-white/10">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.a
                  className={`transition-colors duration-300 cursor-pointer text-lg font-semibold px-2 py-1 rounded-lg ${
                    isActive(item.href)
                      ? "text-blue-400 bg-white/10 shadow"
                      : "text-white hover:text-blue-400 hover:bg-white/5"
                  }`}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {item.label}
                </motion.a>
              </Link>
            ))}
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white focus:outline-none"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="md:hidden glass-effect"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 py-2 space-y-2">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`block py-2 transition-colors duration-300 cursor-pointer ${
                        isActive(item.href)
                          ? "text-blue-400"
                          : "text-white hover:text-blue-400"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
