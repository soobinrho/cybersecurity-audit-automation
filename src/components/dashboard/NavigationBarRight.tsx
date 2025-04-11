import SignOutButton from "@/components/dashboard/SignOutButton";
import DarkModeButton from "@/components/dashboard/DarkModeButton";
import MobileMenu from "@/components/dashboard/MobileMenu";

export default function NavigationBarRight() {
  return (
    <span className="flex gap-1 md:gap-4 pt-0.5 md:pt-0 justify-center md:justify-end items-center align-middle">
      <span className="md:hidden flex justify-center align-middle text-nowrap mr-[0.75rem]">
        <MobileMenu />
      </span>
      <span className="flex gap-1 md:gap-4 align-middle justify-end items-center transition-all duration-75">
        <DarkModeButton variant={"ghost"} />
        {/* [Profile Picture] */}
        {/* [Drop down menu] */}
        <SignOutButton
          variant={"ghost"}
          size="default"
          className="font-normal text-foreground/60"
        />
      </span>
    </span>
  );
}
