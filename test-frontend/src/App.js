import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { HiChevronRight, HiChevronLeft } from "react-icons/hi";
import { generateDate, months, days } from "./util/calendar";
import eventData from "../src/mocData/eventData.json";
import Modal from "./components/Modal";

function App() {
  const [open, setOpen] = useState(false);

  const [input, setInput] = useState({
    topic: ""
  });

  const storedEventData = JSON.parse(localStorage.getItem("eventData")) || [];
  const [eventDatas, setEventDatas] = useState(storedEventData);
  console.log("eventDatas:", eventDatas);

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
  const [selectedDay, setSelectedDay] = useState(null);
  // console.log("selectedDay:", selectedDay);
  const [selectedDate, setSelectedDate] = useState(null);
  // console.log("selectedDate:", selectedDate);

  const handleYearChange = increment => {
    const currentIndex = years.indexOf(selectedYear);
    const newIndex = currentIndex + increment;

    if (newIndex >= 0 && newIndex < years.length) {
      setSelectedYear(years[newIndex]);
    }
  };

  // console.log("selectedMonth:", selectedMonth);

  const handleMonthClick = month => {
    // console.log("month;", month);
    setSelectedMonth(month);
  };

  const generateCalendarData = () => {
    return generateDate(months.indexOf(selectedMonth), parseInt(selectedYear));
  };

  const handleClick = (day, date) => {
    setSelectedDay(day);
    setSelectedDate(date);
  };

  const handleSubmitForm = async e => {
    try {
      e.preventDefault();

      const newEvent = {
        id: eventData.length + 1,
        day: selectedDay,
        date: selectedDate,
        topic: input.topic,
        createDate: "13/06/2000",
        month: selectedMonth,
        year: selectedYear
      };
      // console.log("newEvent:", newEvent);

      setEventDatas(prevEventData => [...prevEventData, newEvent]);

      localStorage.setItem(
        "eventData",
        JSON.stringify([...eventData, newEvent])
      );

      setInput("");
      setOpen(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-full h-screen flex ">
      {/* select month */}
      <div className="w-1/5 flex flex-col items-center gap-10 text-white bg-purple-400">
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

      <div className="w-full flex ">
        <div className="w-4/5 bg-violet-50 flex flex-col justify-center shadow-xl shadow-indigo-500/40 ">
          <div className="mb-8">
            <h1 className="text-3xl text-gray-500 text-center">
              {selectedMonth}
            </h1>
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
              // console.log("date:", date);
              return (
                <div
                  key={index}
                  className="p-2 text-center h-14 grid place-content-center text-sm"
                >
                  <button
                    onClick={() => {
                      handleClick(date.format("ddd"), date.date());
                      setOpen(!open);
                    }}
                    className="h-10 w-10 rounded-full grid place-content-center hover:bg-black hover:text-white cursor-pointer select-none"
                  >
                    <h1>{date.date()}</h1>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-2/5">
          <div className="flex items-center justify-start gap-10 ml-4">
            <div>sss</div>

            <div>
              {eventDatas?.map((el, idx) => (
                <div key={idx}>
                  <p className="text-lg text-gray-500">
                    {el?.month} {el?.date} {el?.year}
                  </p>
                  <p className="text-lg text-gray-500 font-bolad">
                    {el?.topic}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
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