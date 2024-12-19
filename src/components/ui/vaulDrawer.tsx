"use client";

import { clsx } from "clsx";
import { useState } from "react";
import { Drawer } from "vaul";

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0"];
const snapPoints = ["170px", "650px", 1];

export default function VaulDrawer() {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);
  //   const [open, setOpen] = useState(true);

  const [value, setValue] = useState("");

  const handleInput = (input: string) => {
    setValue((prev) => prev + input);
  };
  const handleBackspace = () => {
    setValue((prev) => prev.slice(0, -1));
  };

  const handleSave = () => {
    alert(`Saved value: ${value}`);
    setValue("");
    setSnap(snapPoints[0]);
  };

  return (
    <Drawer.Root
      snapPoints={snapPoints}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      open={true}
    >
      <Drawer.Overlay className="fixed inset-0 bg-black/40" />
      <Drawer.Portal>
        <Drawer.Content
          data-testid="content"
          className="fixed flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]"
        >
          <div
            aria-hidden
            className="mx-auto mt-3 w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 z-10"
          />
          <div
            className={clsx("flex flex-col max-w-md mx-auto w-full p-4 pt-5", {
              "overflow-y-auto": snap === 1,
              "overflow-hidden": snap !== 1,
            })}
          >
            <Drawer.Title className="text-2xl font-medium text-gray-900">
              <div
                onClick={() => {
                  snap !== snapPoints[1] && setSnap(snapPoints[1]);
                }}
                className="border border-gray-400 rounded-xl mb-5 p-5 text-xl text-right"
              >
                {value || "Сумма транзакции"}
              </div>
            </Drawer.Title>

            <div className="mt-4">
              <div>
                <div className="grid grid-cols-3 gap-4 w-full">
                  {keys.map((key) => (
                    <button
                      className="bg-neutral-100 rounded-lg py-4"
                      key={key}
                      onClick={() => handleInput(key)}
                    >
                      {key}
                    </button>
                  ))}
                  <button
                    className="bg-red-500 text-white rounded-lg py-4"
                    onClick={handleBackspace}
                  >
                    ⌫
                  </button>
                </div>

                <input
                  onClick={() => {
                    setSnap(1);
                  }}
                  className="w-full mt-4 outline-none border border-gray-400 rounded-xl mb-5 p-5 text-xl text-right"
                  placeholder="Описание"
                />

                <button
                  className="w-full bg-green-500 mt-4 rounded-lg py-4"
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
