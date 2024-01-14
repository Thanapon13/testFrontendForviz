import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import { GiHamburgerMenu } from "react-icons/gi";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaStar } from "react-icons/fa";
import { generateDate, months, days } from "./util/calendar";
import eventData from "../src/mocData/eventData.json";
import Modal from "./components/Modal";
import ModalConfirmSave from "./components/ModalConfirmSave";
import { formatTime } from "./util/formatTime";

function App() {
  const [open, setOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [input, setInput] = useState({
    topic: ""
  });

  const storedEventData = JSON.parse(localStorage.getItem("eventData")) || [];
  const [eventDatas, setEventDatas] = useState(storedEventData);
  // console.log("eventDatas:", eventDatas);
  const [eventDataId, setEventDataId] = useState("");
  // console.log("eventDataId:", eventDataId);

  useEffect(() => {
    localStorage.setItem("eventData", JSON.stringify(eventDatas));
  }, [eventDatas]);

  const handleChangeInput = e => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const currentYear = dayjs().year().toString();
  const years = Array.from({ length: 100 }, (_, index) =>
    (parseInt(currentYear) - index).toString()
  ).reverse();

  const [selectedMonth, setSelectedMonth] = useState(dayjs().format("MMMM"));
  // console.log("selectedMonth:", selectedMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  // console.log("selectedYear:", selectedYear);
  const [selectedDay, setSelectedDay] = useState(null);
  // console.log("selectedDay:", selectedDay);
  const [selectedDate, setSelectedDate] = useState(null);
  // console.log("selectedDate:", selectedDate);
  const [selectedPriority, setSelectedPriority] = useState("");
  // console.log("selectedPriority:", selectedPriority);

  const handleYearChange = increment => {
    const currentIndex = years.indexOf(selectedYear);
    const newIndex = currentIndex + increment;

    if (newIndex >= 0 && newIndex < years.length) {
      setSelectedYear(years[newIndex]);
    }
  };

  // SELECTED MONTH
  const handleMonthClick = month => {
    // console.log("month;", month);
    setSelectedMonth(month);
  };

  const generateCalendarData = () => {
    return generateDate(months.indexOf(selectedMonth), parseInt(selectedYear));
  };

  // SELECTED DATE DAY
  const handleClick = (day, date) => {
    setSelectedDay(day);
    setSelectedDate(date);
  };

  // ADD EVENT
  const handleSubmitForm = async e => {
    try {
      e.preventDefault();

      const newEvent = {
        id: Math.max(...eventDatas.map(el => el.id), 0) + 1,
        day: selectedDay,
        date: selectedDate,
        topic: input.topic,
        month: selectedMonth,
        year: selectedYear,
        createDate: new Date(),
        importance: selectedPriority
      };
      // console.log("newEvent:", newEvent);

      setEventDatas(prevEventData => [...prevEventData, newEvent]);

      localStorage.setItem(
        "eventData",
        JSON.stringify([...eventData, newEvent])
      );

      setInput("");
      setSelectedPriority("");
      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE EVENT
  const handleClickDeleteEvent = async eventId => {
    try {
      // console.log("eventId:", eventId);

      const updatedEvents = eventDatas.filter(event => event.id !== eventId);

      // console.log("updatedEvents:", updatedEvents);

      setEventDatas(updatedEvents);

      localStorage.setItem("eventData", JSON.stringify(updatedEvents));

      setOpenConfirm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full md:h-screen flex ">
      {/* from select month */}

      <div className="md:w-1/5 md:flex md:flex-col md:items-center gap-10 text-white bg-purple-400 hidden md:block">
        {/* TOP */}

        <div className="text-2xl flex items-center gap-6 mt-6">
          <button onClick={() => handleYearChange(-1)}>
            <i className="hover:text-slate-100">
              <HiChevronLeft />
            </i>
          </button>

          <p>{selectedYear}</p>

          <button onClick={() => handleYearChange(1)}>
            <i className="hover:text-slate-100">
              <HiChevronRight />
            </i>
          </button>
        </div>

        {/* Bottom */}
        <div className="w-full h-full text-center">
          {months.map((el, idx) => (
            <button
              key={idx}
              className={`w-full h-[50px] text-base p-2 cursor-pointer ${
                selectedMonth === el ? "bg-purple-500 hover:bg-purple-500" : ""
              }`}
              onClick={() => handleMonthClick(el)}
            >
              {el}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full md:flex w-full">
        {/* from calendar */}
        <div className="md:w-4/5 bg-violet-50 flex flex-col justify-center shadow-xl shadow-indigo-500/40">
          <div className="mb-8 ">
            <button
              className="relative text-2xl text-back md:hidden p-4"
              onClick={() => setMenuOpen(!isMenuOpen)}
            >
              <GiHamburgerMenu />
            </button>

            <h1 className="text-3xl text-gray-500 text-center">
              {selectedMonth}
            </h1>

            {isMenuOpen && (
              <div className="absolute left-2 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                <ul className="text-sm text-gray-700 dark:text-gray-200">
                  <div className="w-full z-10 text-lg flex items-center justify-center gap-4 bg-purple-400 text-white">
                    <button onClick={() => handleYearChange(-1)}>
                      <i className="hover:text-slate-100">
                        <HiChevronLeft />
                      </i>
                    </button>

                    <p>{selectedYear}</p>

                    <button onClick={() => handleYearChange(1)}>
                      <i className="hover:text-slate-100">
                        <HiChevronRight />
                      </i>
                    </button>
                  </div>

                  {months.map((el, idx) => (
                    <li key={idx}>
                      <button
                        className={`w-full block px-4 py-2 bg-purple-400  text-white ${
                          selectedMonth === el
                            ? "bg-purple-500 hover:bg-purple-500"
                            : ""
                        } `}
                        onClick={() => {
                          handleMonthClick(el);
                          setMenuOpen(false);
                        }}
                      >
                        {el}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="grid grid-cols-7">
            {days.map((day, index) => {
              return (
                <h1
                  key={index}
                  className="text-xl text-center grid place-content-center text-gray-500 select-none"
                >
                  {day}
                </h1>
              );
            })}
          </div>

          <div className="grid grid-cols-7">
            {generateCalendarData().map(({ date }, index) => {
              const isEventDate = eventDatas.some(
                event =>
                  event.day === date.format("ddd") &&
                  event.date === date.date() &&
                  event.month.toLowerCase() === selectedMonth.toLowerCase() &&
                  event.year === selectedYear
              );
              return (
                <div
                  key={index}
                  className="p-2 text-center h-14 grid place-content-center text-sm"
                >
                  <button
                    onClick={() => {
                      if (!isEventDate) {
                        handleClick(date.format("ddd"), date.date());
                        setOpen(!open);
                      }
                    }}
                    className={`h-10 w-10 rounded-full grid place-content-center  ${
                      isEventDate
                        ? "bg-red-200 text-white"
                        : "hover:bg-black hover:text-white"
                    }  cursor-pointer select-none `}
                  >
                    <h1>{date.date()}</h1>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* from event */}
        <ol className="md:w-2/5 relative border-l border-gray-200 dark:border-gray-700 ml-10 md:mt-40 mt-20">
          <div className="flex flex-col justify-center">
            {eventDatas.some(
              el => selectedMonth === el.month && selectedYear === el.year
            ) ? (
              eventDatas
                .filter(
                  el => selectedMonth === el.month && selectedYear === el.year
                )
                .sort((a, b) => {
                  if (a.year !== b.year) return a.year - b.year;

                  if (months.indexOf(a.month) !== months.indexOf(b.month)) {
                    return months.indexOf(a.month) - months.indexOf(b.month);
                  }

                  return a.date - b.date;
                })
                .map((el, idx) => (
                  <li className="mt-4 ml-6" key={idx}>
                    <span className="absolute flex items-center justify-center w-3 h-3 bg-red-200 rounded-full -left-1.5"></span>

                    <div key={idx}>
                      <div className="flex items-center gap-4">
                        <p className="text-lg text-gray-500">
                          {el?.month} {el?.date} {el?.year}{" "}
                          {formatTime(new Date(el?.createDate))}
                        </p>

                        <i className="text-sm flex text-purple-400">
                          {Array.from({ length: el.importance }, (_, index) => (
                            <FaStar key={index} />
                          ))}
                        </i>
                      </div>

                      <div className="flex items-center justify-start gap-6">
                        <p className="text-lg text-gray-500 font-bold">
                          {el?.topic}
                        </p>
                        <button
                          className="text-lg hover:text-red-600"
                          onClick={() => {
                            setOpenConfirm(!openConfirm);
                            setEventDataId(el?.id);
                          }}
                        >
                          <RiDeleteBinLine />
                        </button>

                        {openConfirm && (
                          <ModalConfirmSave
                            onClose={() => setOpenConfirm(false)}
                            onSave={() => handleClickDeleteEvent(eventDataId)}
                            header={`Delete Event for : ${el?.day} ${el?.date} ${el?.month} ${el?.year} `}
                            text={`Do you want to Delete Topic :`}
                            topic={el?.topic}
                          />
                        )}
                      </div>
                    </div>
                  </li>
                ))
            ) : (
              <div className="text-lg text-gray-500 mt-4 ml-6">
                <p> No events for this month. </p>
                <p>You can add an event by clicking on the desired date.</p>
              </div>
            )}
          </div>
        </ol>
      </div>

      {open && (
        <Modal
          id="showViewImageModal"
          isVisible={open}
          onClose={() => setOpen(false)}
          header={`Add Event for : ${selectedDay} ${selectedDate}  ${selectedMonth} ${selectedYear}`}
        >
          <form className="max-w-md mx-auto" onSubmit={handleSubmitForm}>
            <div className="relative z-0 w-full mb-5 group">
              <input
                type="text"
                name="topic"
                id="topic"
                className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
                onChange={handleChangeInput}
              />
              <label
                htmlFor="topic"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Topic
              </label>
            </div>

            <div className="mb-4">
              <select
                className="block py-2.5 px-0 w-full text-sm text-gray-500 bg-transparent border-0 border-b-2 border-gray-200 appearance-none dark:text-gray-400 dark:border-gray-700 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
                onChange={e => setSelectedPriority(parseInt(e.target.value))}
                value={selectedPriority || ""}
              >
                <option value="" disabled>
                  Select priority level
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>

            <div className="flex items-center justify-center gap-6 p-2">
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Submit
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  setInput("");
                  setSelectedPriority("");
                }}
                className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default App;
