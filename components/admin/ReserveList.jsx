import React, { useState, useEffect } from "react";
import { FaTrash, FaPlus } from "react-icons/fa";
import AddReservationForm from "./AddReservationForm";

const ReserveList = () => {
  const [reservations, setReservations] = useState([
    {
      id: "1",
      کد: "RES001",
      "نام ونام خانوادگی": "علی محمدی",
      "نام فرزند": "امیر",
      "زمان معارفه": "1403/08/15 - 10:00",
    },
    {
      id: "2",
      کد: "RES002",
      "نام ونام خانوادگی": "فاطمه حسینی",
      "نام فرزند": "زهرا",
      "زمان معارفه": "1403/08/16 - 11:30",
    },
    {
      id: "3",
      کد: "RES003",
      "نام ونام خانوادگی": "رضا احمدی",
      "نام فرزند": "محمد",
      "زمان معارفه": "1403/08/17 - 09:45",
    },
    {
      id: "4",
      کد: "RES004",
      "نام ونام خانوادگی": "مریم خانی",
      "نام فرزند": "حسن",
      "زمان معارفه": "1403/08/15 - 12:00",
    },
    {
      id: "5",
      کد: "RES005",
      "نام ونام خانوادگی": "جواد اکبری",
      "نام فرزند": "لیلا",
      "زمان معارفه": "1403/08/17 - 14:15",
    },
    {
      id: "6",
      کد: "RES006",
      "نام ونام خانوادگی": "Sara Ahmadi",
      "نام فرزند": "علی",
      "زمان معارفه": "1403/08/16 - 10:00",
    },
  ]);

  const [groupedReservations, setGroupedReservations] = useState({});
  const [showAddForm, setShowAddForm] = useState(false); // State to control form visibility

  useEffect(() => {
    const grouped = reservations.reduce((acc, reservation) => {
      const date = reservation["زمان معارفه"].split(" ")[0];
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(reservation);
      return acc;
    }, {});
    setGroupedReservations(grouped);
  }, [reservations]);

  const handleDelete = (idToDelete) => {
    setReservations(reservations.filter((item) => item.id !== idToDelete));
  };

  const handleAddReservation = (newReservation) => {
    // Generate a unique ID (in a real app, this would come from the server)
    const newId = String(Date.now());
    const newReservationWithId = {
      ...newReservation,
      id: newId,
      کد: `RES-${newId.slice(-4)}`,
    }; //added کد
    setReservations([...reservations, newReservationWithId]);
    setShowAddForm(false); // Hide the form after adding
  };

  return (
    <div className="text-right">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center mb-4 sm:mb-0"
        >
          <FaPlus className="mr-2" />
          افزودن معارفه
        </button>
        {showAddForm && (
          <AddReservationForm
            onAdd={handleAddReservation}
            onCancel={() => setShowAddForm(false)}
          />
        )}
      </div>

      {Object.keys(groupedReservations).length === 0 ? (
        <p className="text-gray-600">هیچ رزروی ثبت نشده است.</p>
      ) : (
        Object.entries(groupedReservations).map(
          ([date, reservationsForDate]) => (
            <div key={date} className="mb-6">
              <h3 className="text-lg font-semibold mb-2">{date}</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">حذف</span>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        زمان معارفه
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        نام فرزند
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        نام ونام خانوادگی
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        کد
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reservationsForDate.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-left">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-red-500 hover:text-red-700 focus:outline-none"
                          >
                            <FaTrash />
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {item["زمان معارفه"]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {item["نام فرزند"]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {item["نام ونام خانوادگی"]}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          {item.کد}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )
      )}
    </div>
  );
};

export default ReserveList;
