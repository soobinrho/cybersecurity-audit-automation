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
        "h-full md:grid flex-col md:grid-cols-[70%_30%] xl:border-x-[0.08rem] border-dashed px-4 pt-4 pb-1 md:px-8 md:py-4"
      }
    >
      <NavigationBarLeft />
      <NavigationBarRight />
    </nav>
  );
}
