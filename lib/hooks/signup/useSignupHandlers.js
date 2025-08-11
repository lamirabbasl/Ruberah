"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { requestPhoneValidationCode, verifyPhoneValidationCode, registerUser } from "@/lib/api/api";

export const useSignupHandlers = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [registrationCode, setRegistrationCode] = useState("");
  const [address, setAddress] = useState("");
  const [isColleague, setIsColleague] = useState(false);
  const [howDidYouKnowAboutUs, setHowDidYouKnowAboutUs] = useState("");
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    place_of_birth: "",
    marital_status: "",
    occupation: "",
    field_of_study: "",
    highest_education: "",
    phone_number: "",
    national_id: "",
    full_address: "",
    landline_number: "",
    emergency_contact_number: "",
    gender: "",
  });
  const [phoneValidated, setPhoneValidated] = useState(false);
  const [validationCode, setValidationCode] = useState("");
  const [isRequestingCode, setIsRequestingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [showValidationInput, setShowValidationInput] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const router = useRouter();

  const handleRequestCode = async () => {
    if (!phone.trim()) {
      toast.error("لطفاً شماره تلفن را وارد کنید.");
      return;
    }
    setIsRequestingCode(true);
    try {
      const response = await requestPhoneValidationCode(phone);
      const successMessage = response.data?.message || "کد با موفقیت ارسال شد.";
      toast.success(successMessage);
      setShowValidationInput(true);
    } catch (err) {
      console.error("Error requesting validation code:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در ثبت نام";
      toast.error(errorMessage);
    } finally {
      setIsRequestingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!validationCode.trim()) {
      toast.error("لطفاً کد اعتبارسنجی را وارد کنید.");
      return;
    }
    setIsVerifyingCode(true);
    try {
      const response = await verifyPhoneValidationCode(phone, validationCode, "signup");
      const successMessage = response.data?.message || "شماره تلفن با موفقیت تایید شد.";
        setPhoneValidated(true);
        toast.success(successMessage);   
    } catch (err) {
      console.error("Error verifying code:", err);
      const errorMessage = err.response?.data?.message || err.message || "خطا در ثبت نام";
      toast.error(errorMessage);
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (
      !name.trim() ||
      !phone.trim() ||
      !password.trim() ||
      !passwordConfirm.trim() ||
      !registrationCode.trim() ||
      !address.trim() ||
      !howDidYouKnowAboutUs.trim() ||
      !profile.first_name.trim() ||
      !profile.last_name.trim() ||
      !profile.date_of_birth.trim() ||
      !profile.place_of_birth.trim() ||
      !profile.marital_status.trim() ||
      !profile.occupation.trim() ||
      !profile.field_of_study.trim() ||
      !profile.highest_education.trim() ||
      !profile.phone_number.trim() ||
      !profile.national_id.trim() ||
      !profile.full_address.trim() ||
      !profile.emergency_contact_number.trim() ||
      !profile.gender.trim()
    ) {
      toast.error("لطفاً همه فیلدها را پر کنید.");
      return;
    }
    if (password !== passwordConfirm) {
      toast.error("رمز عبور و تکرار آن مطابقت ندارند.");
      return;
    }
    if (!phoneValidated) {
      toast.error("لطفاً ابتدا شماره تلفن خود را اعتبارسنجی کنید.");
      return;
    }

    try {
      const response = await registerUser({
        username: name,
        phone_number: phone,
        password,
        registration_code: registrationCode,
        address,
        is_colleague: isColleague,
        how_did_you_know_about_us: howDidYouKnowAboutUs,
        profile: {
          first_name: profile.first_name,
          last_name: profile.last_name,
          date_of_birth: profile.date_of_birth,
          place_of_birth: profile.place_of_birth,
          marital_status: profile.marital_status,
          occupation: profile.occupation,
          field_of_study: profile.field_of_study,
          highest_education: profile.highest_education,
          phone_number: profile.phone_number,
          national_id: profile.national_id,
          full_address: profile.full_address,
          landline_number: profile.landline_number,
          emergency_contact_number: profile.emergency_contact_number,
          gender: profile.gender,
        },
      });
      const successMessage = response.data?.message || "ثبت‌نام با موفقیت انجام شد.";
      toast.success(successMessage);
      setName("");
      setPhone("");
      setPassword("");
      setPasswordConfirm("");
      setRegistrationCode("");
      setAddress("");
      setIsColleague(false);
      setHowDidYouKnowAboutUs("");
      setProfile({
        first_name: "",
        last_name: "",
        date_of_birth: "",
        place_of_birth: "",
        marital_status: "",
        occupation: "",
        field_of_study: "",
        highest_education: "",
        phone_number: "",
        national_id: "",
        full_address: "",
        landline_number: "",
        emergency_contact_number: "",
        gender: "",
      });
      setPhoneValidated(false);
      setValidationCode("");
      setShowValidationInput(false);
      setShowProfileModal(false);
      router.push("/api/auth/login");
    } catch (err) {
      console.error("Error during signup:", err);
      if (err.response?.data?.profile) {
        const profileErrors = err.response.data.profile;
        Object.keys(profileErrors).forEach((key) => {
          const errorMessages = profileErrors[key];
          errorMessages.forEach((message) => {
            toast.error(`${getFieldLabel(key)}: ${message}`);
          });
        });
      } else {
        const errorMessage = err.response?.data?.message || err.message || "خطا در ثبت نام";
        toast.error(errorMessage);
      }
    }
  };

  const getFieldLabel = (key) => {
    const fieldLabels = {
      first_name: "نام",
      last_name: "نام خانوادگی",
      date_of_birth: "تاریخ تولد",
      place_of_birth: "محل تولد",
      marital_status: "وضعیت تاهل",
      occupation: "شغل",
      field_of_study: "رشته تحصیلی",
      highest_education: "بالاترین مدرک تحصیلی",
      phone_number: "شماره تلفن",
      national_id: "کد ملی",
      full_address: "آدرس کامل",
      landline_number: "شماره تلفن ثابت",
      emergency_contact_number: "شماره تماس اضطراری",
      gender: "جنسیت",
    };
    return fieldLabels[key] || key;
  };

  return {
    name,
    setName,
    phone,
    setPhone,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    registrationCode,
    setRegistrationCode,
    address,
    setAddress,
    isColleague,
    setIsColleague,
    howDidYouKnowAboutUs,
    setHowDidYouKnowAboutUs,
    profile,
    setProfile,
    loading: false,
    handleSignup,
    onRequestCodeClick: handleRequestCode,
    isRequestingCode,
    showValidationInput,
    validationCode,
    setValidationCode,
    isVerifyingCode,
    handleVerifyCode,
    phoneValidated,
    showProfileModal,
    setShowProfileModal,
  };
};