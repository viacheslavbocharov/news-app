import Container from "./Container";

export default function Footer() {
  return (
    <footer
      className="border-t border-gray-200 dark:border-gray-700 
                 mt-10 py-8 text-sm 
                 text-gray-600 dark:text-gray-400"
    >
      <Container>
        <div className="flex items-center justify-between">
          <p>© {new Date().getFullYear()} News App</p>
          <p className="opacity-80">Built with Vite + React + Tailwind</p>
        </div>
      </Container>
    </footer>
  );
}
