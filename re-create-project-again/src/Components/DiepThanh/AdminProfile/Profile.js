// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';

// const Profile = ({ onClose }) => {
//   const { t } = useTranslation();

//   const [adminInfo, setAdminInfo] = useState({
//     username: '',
//     email: '',
//     phoneNumber: '',
//     role: '',
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setAdminInfo(prevInfo => ({
//       ...prevInfo,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Admin info saved:', adminInfo);
//     setAdminInfo({
//       username: '',
//       email: '',
//       phoneNumber: '',
//       role: '',
//     });
//     // Optionally, perform additional logic such as API calls
//   };

//   const handleClose = () => {
//     onClose(); // Notify parent component to close the profile modal
//   };

//   return (
//     <div className="profile-modal">
//       <div className="profile-header">
//         <h2>{t('editProfile')}</h2>
//         <button className="close-button" onClick={handleClose}>{t('close')}</button>
//       </div>
//       <form className="profile-form" onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label>{t('usernameLabel')}</label>
//           <input type="text" name="username" value={adminInfo.username} onChange={handleChange} />
//         </div>

//         <div className="form-group">
//           <label>{t('emailLabel')}</label>
//           <input type="email" name="email" value={adminInfo.email} onChange={handleChange} />
//         </div>

//         <div className="form-group">
//           <label>{t('phoneNumberLabel')}</label>
//           <input type="text" name="phoneNumber" value={adminInfo.phoneNumber} onChange={handleChange} />
//         </div>

//         <div className="form-group">
//           <label>{t('roleLabel')}</label>
//           <input type="text" name="role" value={adminInfo.role} onChange={handleChange} />
//         </div>

//         <button type="submit">{t('save')}</button>
//       </form>
//     </div>
//   );
// };

// export default Profile;
