import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() =>
        setTheme(theme === "dark" ? "light" : "dark")
      }
      className="flex items-center justify-center w-11 h-11 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 dark:bg-stone-800 dark:border-stone-700 dark:hover:bg-stone-700 transition"
    >
      {theme === "dark" ? (
        <Sun size={20} className="text-yellow-400" />
      ) : (
        <Moon size={20} className="text-[#65735B]" />
      )}
    </button>
  );
}

export default ThemeToggle;