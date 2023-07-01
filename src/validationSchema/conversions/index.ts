import * as yup from 'yup';

export const conversionValidationSchema = yup.object().shape({
  timecode: yup.string().required(),
  frame_count: yup.number().integer().required(),
  length: yup.number().integer().required(),
  duration: yup.number().integer().required(),
  frames_per_second: yup.number().integer().required(),
  format: yup.string().required(),
  user_id: yup.string().nullable(),
});
