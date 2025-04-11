"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export function ClientSideScriptDownload() {
  const [isChecked, setIsChecked] = useState(false);
  const [isRevokedAndRegenerated, setIsRevokedAndRegenerated] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  return (
    <div className="flex flex-col gap-4 items-start rounded-md border p-4 shadow text-sm">
      <div className="flex flex-row items-center space-x-3 space-y-0">
        <Checkbox
          checked={isChecked}
          onCheckedChange={() => {
            setIsChecked(!isChecked);
          }}
        />
        <div className="space-y-1 leading-normal">
          <p>
            When this Python script gets generated, it will contain a disposable
            API key unique to you with read, write, and delete access to your
            personal caa dashboard. You can revoke and regenerate a new API
            key unlimited times whenever you suspect that your file has been
            accessed by unauthorized personnel.
          </p>
        </div>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <Button
          disabled={!isChecked || isGenerating || isRegenerating}
          className={isRevokedAndRegenerated ? "ring-3 ring-purple-900" : ""}
          onClick={() => {
            setIsGenerating(true);
            setTimeout(() => {
              setIsGenerating(false);
            }, 1000);
          }}
        >
          Download
        </Button>
        <Button
          variant="destructive"
          disabled={
            !isChecked ||
            isGenerating ||
            isRegenerating ||
            isRevokedAndRegenerated
          }
          onClick={() => {
            setIsRegenerating(true);
            setTimeout(() => {
              setIsRegenerating(false);
              setIsRevokedAndRegenerated(true);
            }, 1000);
          }}
        >
          {isRegenerating
            ? "In Progress..."
            : isRevokedAndRegenerated
            ? "Ready for Download"
            : "Revoke and Regenerate"}
        </Button>
      </div>
    </div>
  );
}
