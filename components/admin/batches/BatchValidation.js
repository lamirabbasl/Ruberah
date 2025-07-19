export const validateBatch = (batch) => {
  const errors = {};

  if (!batch.course) {
    errors.course = "لطفا دوره را انتخاب کنید";
  }

  if (!batch.season) {
    errors.season = "لطفا فصل را انتخاب کنید";
  }

  if (!batch.title?.trim()) {
    errors.title = "لطفا عنوان را وارد کنید";
  }

  if (!batch.min_age) {
    errors.min_age = "لطفا حداقل سن را وارد کنید";
  }

  if (!batch.max_age) {
    errors.max_age = "لطفا حداکثر سن را وارد کنید";
  }

  if (!batch.location) {
    errors.location = "لطفا مکان را وارد کنید";
  }

  if (!batch.capacity) {
    errors.capacity = "لطفا ظرفیت را وارد کنید";
  }

  if (batch.min_age && batch.max_age && parseInt(batch.min_age) > parseInt(batch.max_age)) {
    errors.age = "حداقل سن نمی‌تواند بیشتر از حداکثر سن باشد";
  }

  return errors;
};

export const getValidationErrorMessage = (errors) => {
  if (Object.keys(errors).length > 0) {
    return "لطفا تمام فیلدهای ضروری را پر کنید";
  }
  return null;
};
