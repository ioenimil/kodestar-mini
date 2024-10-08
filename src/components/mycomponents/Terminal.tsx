"use client";

import React, { useEffect, useRef, useState } from "react";
import { Event, listen } from "@tauri-apps/api/event";

// import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import "xterm/css/xterm.css";
import { invoke } from "@tauri-apps/api";
import { appDataDir } from "@tauri-apps/api/path";
import { ResizablePanel } from "@/components/ui/resizable";
import { getUser } from "@/lib/utils";
import { platform, type } from "@tauri-apps/api/os";
import { Terminal } from "@xterm/xterm";

const TerminalComponent = ({
  projectId,
  showTerminal,
}: {
  projectId: string;
  showTerminal: boolean;
}) => {
  const terminalRef = useRef<HTMLDivElement | null>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);

  const fitTerminal = async () => {
    fitAddon.fit();

    console.log("Resizing terminal");
    console.log(term.rows, term.cols);
    await invoke("resize_pty", {
      rows: term.rows,
      cols: term.cols,
    });
  };

  const writeToPty = (data: string) => {
    void invoke("write_to_pty", {
      data,
    });
  };

  const term = new Terminal({
    theme: {
      background: "rgb(47, 47, 47)",
    },
  });
  const init = async () => {
    const osType = await platform();

    const appDataDirPath = await appDataDir();
    const { id } = await getUser();
    const projectPath =
      appDataDirPath +
      (osType === "win32"
        ? `databases\\user_projects\\${id}\\${projectId}\\`
        : `databases/user_projects/${id}/${projectId}/`);

    // const formatted = projectPath.replace(/\//g, "\\");

    writeToPty(`cd "${projectPath}" \n\n`);
    writeToPty(`clear \n`);
  };

  const fitAddon = new FitAddon();

  useEffect(() => {
    if (terminalRef.current) {
      console.log("in terminal");
      // term.loadAddon(new WebLinksAddon());
      fitAddon.fit();
      term.loadAddon(fitAddon);
      term.open(terminalRef.current);

      // Invoke async_shell command to create the shell process
      invoke("async_shell")
        .then(() => {
          return init();
        })
        .then(() => console.log("Done with the terminal"))
        .catch((error) => {
          console.error("Error creating shell:", error);
          return init();
        });
      fitTerminal();
    }
    // return () => {
    //   term.dispose();
    // };
  }, []);

  termRef.current = term;
  fitAddonRef.current = fitAddon;

  term.onData(writeToPty);
  const writeToTerminal = (ev: Event<string>) => {
    term.write(ev.payload);
  };

  listen("data", writeToTerminal);

  const [terminals, setTerminals] = useState([{ id: 1 }]);

  return (
    <ResizablePanel
      defaultSize={20}
      className="bg-gray-600 bottom-0 left-0 w-full pb-3 flex "
      onResize={fitTerminal}
      style={{
        display: showTerminal ? "flex" : "none",
      }}
      order={2}
    >
      <div
        id="terminal"
        ref={terminalRef}
        className="flex-1"
        style={{ height: "100%" }}
      ></div>
    </ResizablePanel>
  );
};

export default TerminalComponent;
