import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function fmt(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function BookingCalendar({ checkIn, checkOut, onSelectRange }) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewing, setViewing] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [hovering, setHovering] = useState(null);
  const [selecting, setSelecting] = useState("checkin");

  const prevMonth = () => {
    setViewing((v) => {
      if (v.month === 0) return { year: v.year - 1, month: 11 };
      return { ...v, month: v.month - 1 };
    });
  };
  const nextMonth = () => {
    setViewing((v) => {
      if (v.month === 11) return { year: v.year + 1, month: 0 };
      return { ...v, month: v.month + 1 };
    });
  };

  const firstDay = new Date(viewing.year, viewing.month, 1).getDay();
  const daysInMonth = new Date(viewing.year, viewing.month + 1, 0).getDate();

  const canGoPrev =
    viewing.year > today.getFullYear() ||
    (viewing.year === today.getFullYear() && viewing.month > today.getMonth());

  function isPast(date) {
    return date < today;
  }

  function isCheckIn(date) {
    return checkIn && fmt(date) === fmt(checkIn);
  }

  function isCheckOut(date) {
    return checkOut && fmt(date) === fmt(checkOut);
  }

  function isInRange(date) {
    if (checkIn && checkOut) {
      return date > checkIn && date < checkOut;
    }
    if (checkIn && !checkOut && hovering) {
      const hoverDate = new Date(viewing.year, viewing.month, hovering);
      return hoverDate > checkIn && date > checkIn && date <= hoverDate;
    }
    return false;
  }

  const handleClick = (day) => {
    const clicked = new Date(viewing.year, viewing.month, day);
    clicked.setHours(0, 0, 0, 0);

    if (isPast(clicked)) return;

    if (selecting === "checkin" || (checkIn && checkOut)) {
      onSelectRange(clicked, null);
      setSelecting("checkout");
    } else {
      if (clicked <= checkIn) {
        onSelectRange(clicked, null);
        setSelecting("checkout");
      } else {
        onSelectRange(checkIn, clicked);
        setSelecting("checkin");
      }
    }
  };

  const cells = [];
  for (let i = 0; i < firstDay; i++) {
    cells.push(<div key={`e-${i}`} />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(viewing.year, viewing.month, day);
    date.setHours(0, 0, 0, 0);
    const past = isPast(date);
    const cin = isCheckIn(date);
    const cout = isCheckOut(date);
    const selected = cin || cout;
    const inRange = isInRange(date);

    let className =
      "relative w-full aspect-square flex items-center justify-center text-sm transition-colors select-none ";

    if (past) {
      className += "text-gray-300 cursor-not-allowed bg-gray-50";
    } else if (selected) {
      className += "bg-olive text-white font-semibold cursor-pointer";
    } else if (inRange) {
      className += "bg-olive/15 text-olive cursor-pointer";
    } else {
      className += "hover:bg-olive/10 text-charcoal cursor-pointer";
    }

    cells.push(
      <div
        key={day}
        className={className}
        onClick={() => handleClick(day)}
        onMouseEnter={() => !past && setHovering(day)}
        onMouseLeave={() => setHovering(null)}
      >
        {day}
        {(cin || cout) && (
          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-[8px] text-white/80 leading-none">
            {cin ? "IN" : "OUT"}
          </span>
        )}
      </div>,
    );
  }

  return (
    <div className="bg-white border border-gray-100 p-6">
      {/* Selecting indicator */}
      <div className="text-center text-sm text-olive font-medium mb-4">
        {selecting === "checkin"
          ? "Select Check-In Date"
          : "Select Check-Out Date"}
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="p-2 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={18} />
        </button>
        <h3 className="font-serif text-lg text-charcoal">
          {`${MONTHS[viewing.month]} ${viewing.year}`}
        </h3>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-50 transition-colors"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] uppercase tracking-wider text-gray-400 font-medium py-2"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px">{cells}</div>

      {/* Legend */}
      <div className="flex items-center gap-5 mt-5 text-[11px] text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-olive inline-block" /> Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-olive/15 border border-olive/30 inline-block" />{" "}
          Your Stay
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 bg-gray-50 border border-gray-200 inline-block" />{" "}
          Past
        </span>
      </div>
    </div>
  );
}
