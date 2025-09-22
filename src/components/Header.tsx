import { Link, NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import { useLogout, useMe } from "@/features/auth/hooks";
import Button from "./Button";
import Container from "./Container";

export default function Header() {
  const navigate = useNavigate();
  const { data: user } = useMe();
  const logout = useLogout();

  const handleSignOut = async () => {
    await logout.mutateAsync();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/70 dark:bg-gray-900/70 backdrop-blur supports-backdrop-blur:backdrop-blur-sm">
      <Container>
        <div className="flex h-14 items-center justify-between gap-4">
          <Link to="/" className="text-lg font-semibold">
            News App
          </Link>

          <nav className="flex items-center gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-sm ${isActive ? "font-semibold text-gray-900 dark:text-gray-100" : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"}`
              }
            >
              Home
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Hi, <b>{user.name}</b>
                </span>
                <Button onClick={handleSignOut} disabled={logout.isPending}>
                  Log Out
                </Button>
              </>
            ) : (
              <Button onClick={() => navigate("/login")}>Log In</Button>
            )}
          </div>
        </div>
      </Container>
    </header>
  );
}
