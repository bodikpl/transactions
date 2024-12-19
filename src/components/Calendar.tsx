import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { ru } from "date-fns/locale";
import clsx from "clsx";

type CalendarProps = {
  selected: Date;
  onDateSelect: React.Dispatch<React.SetStateAction<Date>>;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Calendar({
  selected,
  onDateSelect,
  setModal,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const today = new Date();

  const renderHeader = () => {
    return (
      <div className="w-full flex justify-between items-center">
        <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <ChewronLeftIcon />
        </button>
        <div className="capitalize text-lg font-semibold">
          {format(currentMonth, "LLLL yyyy", { locale: ru })}
        </div>
        <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          <ChewronRightIcon />
        </button>
      </div>
    );
  };

  const getDaysOfWeek = (locale: string): string[] => {
    const daysOfWeekMap: Record<string, string[]> = {
      ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    };

    return daysOfWeekMap[locale];
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = getDaysOfWeek("ru");
    return (
      <div className="mt-4 grid grid-cols-7 text-center">
        {daysOfWeek.map((day, index) => (
          <div key={index}>{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;

        days.push(
          <button
            key={day.toString()}
            className={`${
              isSameDay(day, today) && "text-lg bg-neutral-100"
            } rounded-lg shrink-0 h-9 mx-1 m-px ${
              isSameDay(day, selected ?? new Date())
                ? clsx("ring-2 ring-[#EA4335]/80 bg-[#EA4335]/20")
                : !isSameMonth(day, monthStart) && "text-gray-400"
            }`}
            onClick={() => onDateClick(cloneDay)}
          >
            {format(day, "d")}
          </button>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="mt-2 grid grid-cols-7" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const onDateClick = (day: Date) => {
    onDateSelect(day); // Устанавливаем выбранную дату
    setModal(false); // Закрываем модалку
  };

  const onTodayClick = () => {
    const today = new Date();
    setCurrentMonth(today); // Устанавливаем текущий месяц
    onDateSelect(today); // Устанавливаем сегодняшнюю дату
    setModal(false); // Закрываем модалку
  };

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden">
      <div className="flex gap-4">
        {renderHeader()}
        <button
          className="bg-neutral-100 rounded-lg px-2 py-1 font-semibold"
          onClick={onTodayClick}
        >
          Сегодня
        </button>
      </div>

      {renderDaysOfWeek()}
      {renderCells()}
    </div>
  );
}

function ChewronLeftIcon() {
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
      className="lucide lucide-chevron-left"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChewronRightIcon() {
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
      className="lucide lucide-chevron-right"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
