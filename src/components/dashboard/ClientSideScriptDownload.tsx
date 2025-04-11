"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

export function ClientSideScriptDownload() {
  const [isChecked, setIsChecked] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingError, setIsGeneratingError] = useState(false);
  const [isRevoking, setIsRevoking] = useState(false);
  const [isRevokingError, setIsRevokingError] = useState(false);
  return (
    <div className="flex flex-col gap-4 items-start rounded-md border p-4 shadow text-sm">
      <div className="flex flex-row items-center space-x-3 space-y-0">
        <Checkbox
          className="ring-1 ring-accent-foreground/30"
          id="iUnderstand"
          checked={isChecked || isGenerating}
          onCheckedChange={() => {
            setIsChecked(!isChecked);
          }}
        />
        <label
          className="space-y-1 leading-normal cursor-pointer"
          htmlFor="iUnderstand"
        >
          <p>
            API keys in all of your previously downloaded Python scripts will be
            revoked every time you click download, and only the
            latest-downloaded version will retain its access rights to your own
            caa Dashboard. This is a security measure (we do not store any of
            your sensitive information and that includes your caa Dashboard
            API key).
          </p>
        </label>
      </div>
      <div className="flex flex-col md:flex-row gap-2 justify-between w-full">
        <Button
          disabled={
            !isChecked ||
            isGenerating ||
            isRevoking ||
            isGeneratingError ||
            isRevokingError
          }
          className="w-[10rem] text-[0.7rem]"
          onClick={(e) => {
            e.preventDefault();
            setIsGenerating(true);
            fetch("/api/v1/client-side-python-scripts", {
              method: "POST",
            }).then((res) => {
              if (res.ok) {
                res.text().then((text) => {
                  const a = document.createElement("a");
                  a.href = URL.createObjectURL(
                    new Blob([JSON.parse(text)], {
                      type: "text/x-python",
                    })
                  );
                  a.download = `caa_supabase.py`;
                  a.click();
                });
              } else {
                setIsGeneratingError(true);
              }
            });
            setIsGenerating(false);
          }}
        >
          {isGeneratingError
            ? "Error"
            : isGenerating
            ? "Generating..."
            : "Download"}
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              disabled={
                !isChecked ||
                isGenerating ||
                isRevoking ||
                isGeneratingError ||
                isRevokingError
              }
              className="w-[13rem] text-[0.7rem]"
              variant="destructive"
              onClick={() => {
                setIsRevoking(true);
              }}
            >
              {isRevokingError
                ? "Error"
                : isRevoking
                ? "Revoking..."
                : "(Optional) Revoke all of my API keys"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmation</AlertDialogTitle>
              <AlertDialogDescription>
                This will revoke all your clinet-side Python script API keys.
                <br />
                <br />
                Note: You can click the &#34;Download&#34; button to generate a
                new API key. Everytime you click &#34;Download,&#34; the server
                bakes your new key into your Python script so that you can run
                it without any extra configuration.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setIsRevoking(false);
                }}
              >
                <AlertDialogCancel type="submit">Cancel</AlertDialogCancel>
              </form>
              <form
                onClick={(e) => {
                  e.preventDefault();
                  fetch("/api/v1/client-side-api-keys", {
                    method: "DELETE",
                  }).then((res) => {
                    if (res.ok) {
                      setIsRevoking(false);
                    } else {
                      setIsRevokingError(true);
                    }
                  });
                }}
              >
                <AlertDialogAction type="submit">Continue</AlertDialogAction>
              </form>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
