interface props {
  className?: string;
}
export default function Footer(props: props) {
  const { className } = props;

  return (
    <div
      className={
        `${className}` +
        " " +
        "h-full col-start-2 col-end-3 grid-cols-subgrid grid-rows-subgrid flex justify-center items-center gap-2 text-foreground/20 text-[0.5rem] md:text-xs tracking-tight border-l-[0.08rem] border-dashed"
      }
    >
      <a
        className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
        href="https://github.com/soobinrho/"
        target="_blank"
      >
        GitHub
      </a>
      <span className="pointer-events-none">|</span>
      <a
        className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
        href="https://docs.google.com/document/d/18YrIjcEnB00vqx2RoJ0TYJsbo9TvIh0lkoQddvJsIhU/edit?usp=sharing"
        target="_blank"
      >
        Resume
      </a>
      <span className="pointer-events-none">|</span>
      <a
        className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
        href="https://www.linkedin.com/in/soobinrho/"
        target="_blank"
      >
        LinkedIn
      </a>
      <span className="pointer-events-none">|</span>
      <a
        className="hover:text-foreground/40 active:text-foreground/60 transition-all duration-75"
        href="https://github.com/soobinrho/caa-supabase"
        target="_blank"
      >
        © 2025 caa, Soobin Rho.
      </a>
    </div>
  );
}
