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
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="text-gray-500"
        >
          <ChewronLeftIcon />
        </button>
        <div className="font-aptosSemiBold capitalize text-lg">
          {format(currentMonth, "LLLL yyyy", { locale: ru })}
        </div>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="text-gray-500"
        >
          <ChewronRightIcon />
        </button>
      </div>
    );
  };

  const getDaysOfWeek = (locale: string): string[] => {
    const daysOfWeekMap: Record<string, string[]> = {
      ru: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
    };

    return daysOfWeekMap[locale] || daysOfWeekMap.eng; // Возвращаем массив для выбранной локали, или по умолчанию английский
  };

  const renderDaysOfWeek = () => {
    const daysOfWeek = getDaysOfWeek("ru");
    return (
      <div className="grid grid-cols-7 text-center mb-2 font-aptosSemiBold">
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
          <div
            key={day.toString()}
            className={`${
              isSameDay(day, today) &&
              "text-lg bg-neutral-100 dark:bg-neutral-500"
            } rounded-full shrink-0 aspect-square flex items-center justify-center cursor-pointer leading-none m-px  ${
              isSameDay(day, selected ?? new Date())
                ? clsx("ring-2 ring-[#EA4335]/80 bg-[#EA4335]/20")
                : !isSameMonth(day, monthStart) && "text-gray-400"
            }`}
            onClick={() => onDateClick(cloneDay)}
          >
            {format(day, "d")}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="grid grid-cols-7" key={day.toString()}>
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
    <div className="w-full max-w-md mx-auto">
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCells()}

      <div className="mt-4 flex gap-2">
        <button className="btn_2" onClick={onTodayClick}>
          Сегодня
        </button>
      </div>
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
