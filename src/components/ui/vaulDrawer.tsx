"use client";

import { clsx } from "clsx";
import { useState } from "react";
import { Drawer } from "vaul";
import Calendar from "../Calendar";
import { differenceInCalendarDays, format } from "date-fns";

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: Date;
};

const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", ",", "0"];
const snapPoints = ["170px", "650px", 1];

export default function VaulDrawer({
  transaction,
}: {
  transaction: Transaction;
}) {
  const [snap, setSnap] = useState<number | string | null>(snapPoints[0]);

  const [keyboard, setKeyboard] = useState(true);
  const [calendar, setCalendar] = useState(false);
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

  const [selectedDate, setSelectedDate] = useState(
    transaction ? transaction.date : new Date()
  );

  const getFormattedDates = (date: Date, locale: string): string => {
    const today = new Date();
    const diffDays = differenceInCalendarDays(date, today);

    // Маппинг локализованных названий
    const localeMap: Record<string, Record<string, string>> = {
      ru: { today: "Сегодня", tomorrow: "Завтра", yesterday: "Вчера" },
      pl: { today: "Dzisiaj", tomorrow: "Jutro", yesterday: "Wczoraj" },
      ua: { today: "Сьогодні", tomorrow: "Завтра", yesterday: "Вчора" },
      eng: { today: "Today", tomorrow: "Tomorrow", yesterday: "Yesterday" },
    };

    // Получаем локализованную строку в зависимости от дня
    const getLocalizedDate = (key: string) =>
      localeMap[locale]?.[key] || localeMap.eng[key];

    let datePrefix = "";
    if (diffDays === 0) {
      datePrefix = getLocalizedDate("today");
    } else if (diffDays === 1) {
      datePrefix = getLocalizedDate("tomorrow");
    } else if (diffDays === -1) {
      datePrefix = getLocalizedDate("yesterday");
    } else {
      datePrefix = format(date, "dd.MM.yy");
    }

    return datePrefix;
  };

  const formatedSelectedDay = getFormattedDates(selectedDate, "ru");

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
                className="cursor-text border border-gray-400 rounded-xl mb-5 p-5 text-xl text-right"
              >
                {value || "Сумма транзакции"}
              </div>
            </Drawer.Title>

            <div className="mt-4">
              <div>
                {keyboard && (
                  <div className="grid grid-cols-3 gap-4 w-full">
                    {keys.map((key) => (
                      <button
                        className="bg-neutral-100 rounded-lg py-4 active:bg-neutral-200 active:translate-y-px"
                        key={key}
                        onClick={() => handleInput(key)}
                      >
                        {key}
                      </button>
                    ))}
                    <button
                      className="bg-red-500 text-white rounded-lg py-4 active:bg-red-600 active:translate-y-px"
                      onClick={handleBackspace}
                    >
                      ⌫
                    </button>
                  </div>
                )}

                {calendar && (
                  <Calendar
                    setModal={() => {
                      setCalendar(false);
                      setKeyboard(true);
                    }}
                    selected={selectedDate}
                    onDateSelect={setSelectedDate}
                  />
                )}

                <input
                  onClick={() => {
                    setKeyboard(false);
                    setSnap(1);
                  }}
                  onBlur={() => {
                    setKeyboard(true);
                    setSnap(snapPoints[1]);
                  }}
                  className="w-full mt-4 outline-none bg-yellow-50 rounded-xl mb-5 p-5 text-xl text-right"
                  placeholder="Описание"
                />

                <div className="flex gap-4 items-center">
                  <button
                    className="w-1/2 bg-green-500 rounded-lg py-4 flex justify-center items-center gap-4"
                    onClick={() => {
                      setKeyboard(false);
                      setCalendar(true);
                    }}
                  >
                    <CalendarIcon />
                    {formatedSelectedDay}
                  </button>
                  <button
                    className="w-1/2 bg-green-500 rounded-lg py-4"
                    onClick={handleSave}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

export function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  );
}
