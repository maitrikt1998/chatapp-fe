import * as Yup from 'yup';

// export const registerSchema = Yup.object().shape({
//   name: Yup.string().required('Name is required'),
//   email: Yup.string().email('Invalid email').required('Email is required'),
//   password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
// //   image: Yup.mixed().required('Image is required').test('fileType', 'Only image files are allowed', (value) => {
// //     return value && value.type.startsWith('image/');
// //   }),
// });

// export const loginSchema = Yup.object().shape({
//   email: Yup.string().email('Invalid email').required('Email is required'),
//   password: Yup.string().required('Password is required'),
// });