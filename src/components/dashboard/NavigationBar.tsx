import NavigationBarLeft from "./NavigationBarLeft";
import NavigationBarRight from "./NavigationBarRight";

interface props {
  className?: string;
}

export default function NavigationBar(props: props) {
  const { className } = props;
  return (
    <nav
      className={
        `${className}` +
        " " +
        "flex flex-col self-center md:flex-row md:justify-between pt-2 md:pt-0 md:pl-4 md:pr-2"
      }
    >
      <NavigationBarLeft />
      <NavigationBarRight />
    </nav>
  );
}
