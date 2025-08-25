"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Check, Trash2, Eye } from "lucide-react";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getChildPhotoUrl, getChildWithParentPhotoUrl, uploadChildPhotos, getChildById } from "@/lib/api/api";
import JalaliCalendar from "../common/JalaliCalendar";
import { convertToJalali } from "@/lib/utils/convertDate";
import LoadingSpinner from "../common/LoadingSpinner";

const EditableChild = ({ child, onUpdate, onDelete, onView }) => {
  const [editing, setEditing] = useState(false);
  const [fullChild, setFullChild] = useState(null);
  const [tempFullName, setTempFullName] = useState("");
  const [tempFirstName, setTempFirstName] = useState(child.first_name);
  const [tempLastName, setTempLastName] = useState(child.last_name);
  const [tempGender, setTempGender] = useState(child.gender);
  const [tempBirthDate, setTempBirthDate] = useState(child.birth_date || "");
  const [tempPlaceOfBirth, setTempPlaceOfBirth] = useState(child.place_of_birth || "");
  const [tempBloodType, setTempBloodType] = useState(child.blood_type || "");
  const [tempNationalId, setTempNationalId] = useState("");
  const [tempSiblingsCount, setTempSiblingsCount] = useState("");
  const [tempBirthOrder, setTempBirthOrder] = useState("");
  const [tempCourses, setTempCourses] = useState("");
  const [tempChallenges, setTempChallenges] = useState("");
  const [tempAllergies, setTempAllergies] = useState("");
  const [tempIllness, setTempIllness] = useState("");
  const [tempHospitalization, setTempHospitalization] = useState("");
  const [childPhotoUrl, setChildPhotoUrl] = useState(null);
  const [parentPhotoUrl, setParentPhotoUrl] = useState(null);
  const [uploadingChildPhoto, setUploadingChildPhoto] = useState(false);
  const [uploadingParentPhoto, setUploadingParentPhoto] = useState(false);
  const [error, setError] = useState(null);
  const [showBirthCalendar, setShowBirthCalendar] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoadingDetails(true);
      try {
        const data = await getChildById(child.id);
        setFullChild(data);
      } catch (err) {
        console.error("Error fetching full child details:", err);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchDetails();
  }, [child.id]);

  useEffect(() => {
    if (fullChild) {
      setTempFullName(fullChild.full_name || "");
      setTempFirstName(fullChild.first_name || "");
      setTempLastName(fullChild.last_name || "");
      setTempGender(fullChild.gender || "");
      setTempBirthDate(fullChild.birth_date || "");
      setTempPlaceOfBirth(fullChild.place_of_birth || "");
      setTempBloodType(fullChild.blood_type || "");
      setTempNationalId(fullChild.national_id || "");
      setTempSiblingsCount(fullChild.siblings_count || "");
      setTempBirthOrder(fullChild.birth_order || "");
      setTempCourses(fullChild.courses_signed_up_outside || "");
      setTempChallenges(fullChild.medical_info?.challenges || "");
      setTempAllergies(fullChild.medical_info?.allergies || "");
      setTempIllness(fullChild.medical_info?.illness_or_medications || "");
      setTempHospitalization(fullChild.medical_info?.hospitalization_history || "");
    } else {
      setTempFirstName(child.first_name || "");
      setTempLastName(child.last_name || "");
      setTempGender(child.gender || "");
      setTempBirthDate(child.birth_date || "");
      setTempPlaceOfBirth(child.place_of_birth || "");
      setTempBloodType(child.blood_type || "");
    }
  }, [fullChild, child]);

  useEffect(() => {
    const fetchPhotos1 = async () => {
      try {
        const childPhoto = await getChildPhotoUrl(child.id);
        setChildPhotoUrl(childPhoto);
      } catch (error) {
        console.error("Error fetching child photo:", error);
        setChildPhotoUrl(null);
      }
    };
    const fetchPhotos2 = async () => {
      try {
        const parentPhoto = await getChildWithParentPhotoUrl(child.id);
        setParentPhotoUrl(parentPhoto);
      } catch (error) {
        console.error("Error fetching parent photo:", error);
        setParentPhotoUrl(null);
      }
    };
    fetchPhotos1();
    fetchPhotos2();
  }, [child.id]);

  const handleEditToggle = () => {
    setEditing(!editing);
  };

  const handleSave = () => {
    if (!tempFirstName || !tempLastName || !tempBirthDate) {
      const errorMessage = "لطفا تمام فیلدهای ضروری را پر کنید";
      toast.error(errorMessage);
      setError(errorMessage);
      return;
    }
    setError(null);
    const updatedChild = {
      id: child.id,
      full_name: tempFullName,
      first_name: tempFirstName,
      last_name: tempLastName,
      birth_date: tempBirthDate,
      place_of_birth: tempPlaceOfBirth,
      gender: tempGender,
      national_id: tempNationalId,
      siblings_count: tempSiblingsCount ? parseInt(tempSiblingsCount) : null,
      birth_order: tempBirthOrder ? parseInt(tempBirthOrder) : null,
      blood_type: tempBloodType,
      courses_signed_up_outside: tempCourses,
      medical_info: {
        challenges: tempChallenges,
        allergies: tempAllergies,
        illness_or_medications: tempIllness,
        hospitalization_history: tempHospitalization,
      },
    };
    onUpdate(updatedChild);
    setEditing(false);
  };

  const handleChildPhotoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      const errorMessage = "لطفا یک فایل تصویر انتخاب کنید";
      toast.error(errorMessage);
      setError(errorMessage);
      return;
    }
    setUploadingChildPhoto(true);
    setError(null);
    try {
      const response = await uploadChildPhotos(child.id, file, null);
      const successMessage = response.data?.message || "اطلاعات با موفقیت بروزرسانی شد.";
      toast.success(successMessage);
      const updatedChildPhoto = await getChildPhotoUrl(child.id);
      setChildPhotoUrl(updatedChildPhoto);
    } catch (err) {
      console.error("Error uploading child photo:", err);
      const errorMessage = err.response?.data?.message ||  "خطا در بروزرسانی اطلاعات";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setUploadingChildPhoto(false);
    }
  };

  const handleParentPhotoChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      const errorMessage = "لطفا یک فایل تصویر انتخاب کنید";
      toast.error(errorMessage);
      setError(errorMessage);
      return;
    }
    setUploadingParentPhoto(true);
    setError(null);
    try {
      const response = await uploadChildPhotos(child.id, null, file);
      const successMessage = response.data?.message || "اطلاعات با موفقیت بروزرسانی شد.";
      toast.success(successMessage);
      const updatedParentPhoto = await getChildWithParentPhotoUrl(child.id);
      setParentPhotoUrl(updatedParentPhoto);
    } catch (err) {
      console.error("Error uploading parent photo:", err);
      const errorMessage = err.response?.data?.message ||  "خطا در بروزرسانی اطلاعات";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setUploadingParentPhoto(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    onDelete(child.id);
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  const displayChild = fullChild || child;

  return (
    <motion.div
      layout
      dir="rtl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="flex flex-col-reverse md:flex-row-reverse md:items-start gap-28 pb-8 bg-white rounded-2xl shadow-md p-6 w-full max-w-4xl mx-auto border border-gray-200 hover:shadow-lg transition-shadow duration-300"
    >
      {/* Buttons stacked vertically on left */}
      <div className="flex flex-col gap-3 md:order-1">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEditToggle}
          className="px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm text-sm font-medium flex items-center justify-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <Pencil size={18} />
          ویرایش
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onView(child.id)}
          className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors duration-200 shadow-sm text-sm font-medium flex items-center justify-center gap-2"
        >
          <Eye size={18} />
          مشاهده
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDelete}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200 shadow-sm text-sm font-medium flex items-center justify-center gap-2"
        >
          <Trash2 size={18} />
          حذف
        </motion.button>
      </div>

      {/* Images */}
      <div className="flex flex-row gap-6 justify-center md:order-2 ">
        {/* Child Photo */}
        <motion.div
          className="relative flex flex-col items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src={childPhotoUrl || "/user.png"}
            className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
            alt="عکس فرزند"
          />
          <label
            htmlFor={`childPhotoInput-${child.id}`}
            className="absolute -bottom-2 right-0 bg-indigo-600 text-white rounded-full p-2 cursor-pointer hover:bg-indigo-700 transition-colors duration-200 shadow-md"
            title="تغییر عکس کودک"
          >
            {uploadingChildPhoto ? (
              <span className="text-xs px-2">در حال آپلود...</span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </label>
          <input
            id={`childPhotoInput-${child.id}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChildPhotoChange}
            disabled={uploadingChildPhoto}
          />
          <p className="mt-2 text-sm text-gray-600">عکس فرزند</p>
        </motion.div>

        {/* Parent Photo */}
        <motion.div
          className="relative flex flex-col items-center"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src={parentPhotoUrl || "/user.png"}
            className="w-32 h-32 rounded-full  ml-4 object-cover border-4 border-white shadow-md"
            alt="عکس با والدین"
          />
          <label
            htmlFor={`parentPhotoInput-${child.id}`}
            className="absolute -bottom-2 right-0 bg-indigo-600 text-white rounded-full p-2 cursor-pointer hover:bg-indigo-700 transition-colors duration-200 shadow-md"
            title="تغییر عکس والدین"
          >
            {uploadingParentPhoto ? (
              <span className="text-xs px-2">در حال آپلود...</span>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </label>
          <input
            id={`parentPhotoInput-${child.id}`}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleParentPhotoChange}
            disabled={uploadingParentPhoto}
          />
          <p className="mt-2 text-sm text-gray-600">عکس با والدین</p>
        </motion.div>
      </div>

      {/* Info */}
      <div className="flex-1 w-full min-w-0 md:order-3 order-2 mt-6 md:mt-0">
        {loadingDetails ? (
          <LoadingSpinner />
        ) : (
          <div className="flex flex-col text-right gap-3">
            <p className="text-xl font-bold text-gray-900 truncate">
              {displayChild.first_name} {displayChild.last_name}
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <div>
                <p className="text-gray-900 text-lg whitespace-nowrap">جنسیت:  {displayChild.gender === "boy" ? "پسر" : "دختر"}</p>
              </div>
              <div>
                <p className="text-gray-900 text-lg whitespace-nowrap">تاریخ تولد: {convertToJalali(displayChild.birth_date) || "-"} </p>
              </div>
              <div>
                <p className="text-gray-900 text-lg whitespace-nowrap">محل تولد: {displayChild.place_of_birth || "-"}</p>
              </div>

            </div>
          </div>
        )}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600 text-center text-sm mt-2"
          >
            {error}
          </motion.p>
        )}
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setEditing(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl max-h-[80vh] overflow-y-auto"
              dir="rtl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4 text-right">
                ویرایش اطلاعات فرزند
              </h2>
              <div className="flex flex-col gap-4 pr-2">
                <div className="space-y-2">
                  <label className="block text-lg font-medium text-gray-700">نام کامل</label>
                  <input
                    type="text"
                    value={tempFullName}
                    onChange={(e) => setTempFullName(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg text-right w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white text-sm shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-lg font-medium text-gray-700">نام</label>
                  <input
                    type="text"
                    value={tempFirstName}
                    onChange={(e) => setTempFirstName(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg text-right w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white text-sm shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-lg font-medium text-gray-700">نام خانوادگی</label>
                  <input
                    type="text"
                    value={tempLastName}
                    onChange={(e) => setTempLastName(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg text-right w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white text-sm shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-lg font-medium text-gray-700">جنسیت</label>
                  <select
                    value={tempGender}
                    onChange={(e) => setTempGender(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg text-right w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white text-sm shadow-sm"
                  >
                    <option value="boy">پسر</option>
                    <option value="girl">دختر</option>
                  </select>
                </div>
                <div className="space-y-2 relative">
                  <label className="block text-lg font-medium text-gray-700">تاریخ تولد</label>
                  <input
                    type="text"
                    readOnly
                    value={convertToJalali(tempBirthDate)}
                    onClick={() => setShowBirthCalendar(true)}
                    className="p-3 border border-gray-300 rounded-lg text-right w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white text-sm cursor-pointer shadow-sm"
                  />
                  {showBirthCalendar && (
                    <div className="absolute z-50 w-80 bg-white bottom-[-100px] shadow-lg rounded-lg">
                      <JalaliCalendar
                        onDateSelect={(date) => {
                          setTempBirthDate(date);
                          setShowBirthCalendar(false);
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="block text-lg font-medium text-gray-700">محل تولد</label>
                  <input
                    type="text"
                    value={tempPlaceOfBirth}
                    onChange={(e) => setTempPlaceOfBirth(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg text-right w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white text-sm shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-lg font-medium text-gray-700">گروه خونی</label>
                  <input
                    type="text"
                    value={tempBloodType}
                    onChange={(e) => setTempBloodType(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg text-right w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white text-sm shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-lg font-medium text-gray-700">کد ملی</label>
                  <input
                    type="text"
                    value={tempNationalId}
                    onChange={(e) => setTempNationalId(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg text-right w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white text-sm shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-lg font-medium text-gray-700">تعداد فرزندان خانواده </label>
                  <input
                    type="number"
                    value={tempSiblingsCount}
                    onChange={(e) => setTempSiblingsCount(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg text-right w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white text-sm shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-lg font-medium text-gray-700">کودک شما فرزند چندم خانواده است؟</label>
                  <input
                    type="number"
                    value={tempBirthOrder}
                    onChange={(e) => setTempBirthOrder(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg text-right w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white text-sm shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-lg font-medium text-gray-700">اگر پیش از این و با همزمان با این دوره, کودک شما در دوره های دیگری شرکت کرده است جزئیات آن را وارد کنید</label>
                  <input
                    type="text"
                    value={tempCourses}
                    onChange={(e) => setTempCourses(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg text-right w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white text-sm shadow-sm"
                  />
                </div>
                <div className="text-gray-900 text-xl border-t-2 border-gray-200 pt-4 font-bold mt-4">اطلاعات پزشکی</div>
                <div className="space-y-2">
                  <label className="block text-lg font-medium text-gray-700">آیا در ارتباط با کودک خود چالشی دارید و یا موردی که لازم است ما نسبت به آن آگاه باشیم؟</label>
                  <input
                    type="text"
                    value={tempChallenges}
                    onChange={(e) => setTempChallenges(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg text-right w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white text-sm shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-lg font-medium text-gray-700">کودک شما به مواد غذایی و یا داروی خاصی  حساسیت دارد؟ (اگر بله موارد را با جزئیات بنویسید)</label>
                  <input
                    type="text"
                    value={tempAllergies}
                    onChange={(e) => setTempAllergies(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg text-right w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white text-sm shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-lg font-medium text-gray-700">آیا کودک شما بیماری خاص و یا داروی خاصی استفاده می کند؟ (اگر بله موارد را با جزئیات بنویسید)</label>
                  <input
                    type="text"
                    value={tempIllness}
                    onChange={(e) => setTempIllness(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg text-right w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white text-sm shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-lg font-medium text-gray-700">آیا کودک شما بستری در بیمارستان و یا تحت عمل جراحی قرار گرفته؟ (اگر بله موارد را با جزئیات بنویسید)</label>
                  <input
                    type="text"
                    value={tempHospitalization}
                    onChange={(e) => setTempHospitalization(e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg text-right w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 bg-white text-sm shadow-sm"
                  />
                </div>
              </div>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-600 text-center text-sm mt-4"
                >
                  {error}
                </motion.p>
              )}
              <div className="flex justify-end gap-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setEditing(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  انصراف
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
                >
                  ذخیره
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4 text-right">
                تأیید حذف
              </h2>
              <p className="text-gray-700 mb-6 text-right">
                آیا مطمئن هستید که می‌خواهید اطلاعات فرزند {child.first_name} {child.last_name} را حذف کنید؟
              </p>
              <div className="flex justify-end gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium"
                >
                  انصراف
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                >
                  حذف
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EditableChild;