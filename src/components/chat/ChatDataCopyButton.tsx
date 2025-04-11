interface ChatDataCopyButtonProps {
  label: string;
  onClickCopyData: () => void;
}

export default function ChatDataCopyButton(props: ChatDataCopyButtonProps) {
  const { label, onClickCopyData } = props;
  return (
    <button
      onClick={(e) => {
        const btn = e.target as HTMLButtonElement;
        btn.setAttribute("disabled", "true");
        btn.textContent = "Copied";
        onClickCopyData();
        btn.classList.add("text-accent-foreground", "font-bold");
        setTimeout(() => {
          btn.textContent = label;
          btn.classList.remove("text-accent-foreground", "font-bold");
        }, 300);
        btn.removeAttribute("disabled");
      }}
      className="px-1 py-1 leading-4 font-extralight text-xs md:font-light text-foreground border rounded hover:bg-muted disabled:cursor-pointer disabled:pointer-events-none tracking-tighter"
    >
      {label}
    </button>
  );
}
