import ChatDataCopyButton from "@/components/chat/ChatDataCopyButton";
import { useUsersQuery } from "@/hooks/useUsersQuery";
import { useProjectsQuery } from "@/hooks/useProjectsQuery";
import { useTablesQuery } from "@/hooks/useTablesQuery";

export default function LLMHeader() {
  const copyDataToClipboard = (dataToBeCopied: string) => {
    const plain = new Blob([dataToBeCopied], { type: "text/plain" });
    const data = new ClipboardItem({
      "text/plain": plain,
    });
    navigator.clipboard.write([data]);
  };

  const { data: users } = useUsersQuery();
  const { data: projects } = useProjectsQuery();
  const { data: tables } = useTablesQuery();

  return (
    <div className="flex flex-col self-center md:flex-row md:justify-between pt-2 md:pt-0 md:pl-4 md:pr-2 flex-nowrap gap-1 mb-2 md:mb-0 z-10">
      <div className="grow-7">
        <h2 className="text-2xl font-bold">Claude 3.7 Sonnet</h2>
        <p className="text-[0.7rem] text-muted-foreground">
          You have full control over your data. Choose which data you want to
          share with LLM, if any. Your chat history is saved and encrypted as
          LocalStorage, and is neither sent nor stored on our server.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-1 grow-3 w-full">
        <ChatDataCopyButton
          label="Copy MFA status as JSON"
          onClickCopyData={() =>
            copyDataToClipboard(JSON.stringify(users, null, 4))
          }
        />
        <ChatDataCopyButton
          label="Copy PITR status as JSON"
          onClickCopyData={() =>
            copyDataToClipboard(JSON.stringify(projects, null, 4))
          }
        />
        <ChatDataCopyButton
          label="Copy RLS status as JSON"
          onClickCopyData={() =>
            copyDataToClipboard(JSON.stringify(tables, null, 4))
          }
        />
      </div>
    </div>
  );
}
