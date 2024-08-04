import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import clear from '../../../public/assets/Table/delete.svg';
import edit from '../../../public/assets/Table/edit.svg';
import DeleteConfirmation from '@components/Commun/Popups/Clients/DeleteConfirmationModal';
import Flag from 'react-world-flags'; 
import UpdateAdmin from '../Popups/Admins/UpdateForm';
import profilePlaceholder from '../../../public/assets/profile.svg';

const countryCodes = [
  { code: "+1", country: "US" },
  { code: "+7", country: "RU" },
  { code: "+20", country: "EG" },
  { code: "+27", country: "ZA" },
  { code: "+30", country: "GR" },
  { code: "+31", country: "NL" },
  { code: "+32", country: "BE" },
  { code: "+33", country: "FR" },
  { code: "+34", country: "ES" },
  { code: "+36", country: "HU" },
  { code: "+39", country: "IT" },
  { code: "+40", country: "RO" },
  { code: "+41", country: "CH" },
  { code: "+43", country: "AT" },
  { code: "+44", country: "GB" },
  { code: "+45", country: "DK" },
  { code: "+46", country: "SE" },
  { code: "+47", country: "NO" },
  { code: "+48", country: "PL" },
  { code: "+49", country: "DE" },
  { code: "+51", country: "PE" },
  { code: "+52", country: "MX" },
  { code: "+53", country: "CU" },
  { code: "+54", country: "AR" },
  { code: "+55", country: "BR" },
  { code: "+56", country: "CL" },
  { code: "+57", country: "CO" },
  { code: "+58", country: "VE" },
  { code: "+60", country: "MY" },
  { code: "+61", country: "AU" },
  { code: "+62", country: "ID" },
  { code: "+63", country: "PH" },
  { code: "+64", country: "NZ" },
  { code: "+65", country: "SG" },
  { code: "+66", country: "TH" },
  { code: "+81", country: "JP" },
  { code: "+82", country: "KR" },
  { code: "+84", country: "VN" },
  { code: "+86", country: "CN" },
  { code: "+90", country: "TR" },
  { code: "+91", country: "IN" },
  { code: "+92", country: "PK" },
  { code: "+93", country: "AF" },
  { code: "+94", country: "LK" },
  { code: "+95", country: "MM" },
  { code: "+98", country: "IR" },
  { code: "+212", country: "MA" },
  { code: "+213", country: "DZ" },
  { code: "+216", country: "TN" },
  { code: "+218", country: "LY" },
  { code: "+220", country: "GM" },
  { code: "+221", country: "SN" },
  { code: "+222", country: "MR" },
  { code: "+223", country: "ML" },
  { code: "+224", country: "GN" },
  { code: "+225", country: "CI" },
  { code: "+226", country: "BF" },
  { code: "+227", country: "NE" },
  { code: "+228", country: "TG" },
  { code: "+229", country: "BJ" },
  { code: "+230", country: "MU" },
  { code: "+231", country: "LR" },
  { code: "+232", country: "SL" },
  { code: "+233", country: "GH" },
  { code: "+234", country: "NG" },
  { code: "+235", country: "TD" },
  { code: "+236", country: "CF" },
  { code: "+237", country: "CM" },
  { code: "+238", country: "CV" },
  { code: "+239", country: "ST" },
  { code: "+240", country: "GQ" },
  { code: "+241", country: "GA" },
  { code: "+242", country: "CG" },
  { code: "+243", country: "CD" },
  { code: "+244", country: "AO" },
  { code: "+245", country: "GW" },
  { code: "+246", country: "IO" },
  { code: "+248", country: "SC" },
  { code: "+249", country: "SD" },
  { code: "+250", country: "RW" },
  { code: "+251", country: "ET" },
  { code: "+252", country: "SO" },
  { code: "+253", country: "DJ" },
  { code: "+254", country: "KE" },
  { code: "+255", country: "TZ" },
  { code: "+256", country: "UG" },
  { code: "+257", country: "BI" },
  { code: "+258", country: "MZ" },
  { code: "+260", country: "ZM" },
  { code: "+261", country: "MG" },
  { code: "+262", country: "RE" },
  { code: "+263", country: "ZW" },
  { code: "+264", country: "NA" },
  { code: "+265", country: "MW" },
  { code: "+266", country: "LS" },
  { code: "+267", country: "BW" },
  { code: "+268", country: "SZ" },
  { code: "+269", country: "KM" },
  { code: "+290", country: "SH" },
  { code: "+291", country: "ER" },
  { code: "+297", country: "AW" },
  { code: "+298", country: "FO" },
  { code: "+299", country: "GL" },
  { code: "+350", country: "GI" },
  { code: "+351", country: "PT" },
  { code: "+352", country: "LU" },
  { code: "+353", country: "IE" },
  { code: "+354", country: "IS" },
  { code: "+355", country: "AL" },
  { code: "+356", country: "MT" },
  { code: "+357", country: "CY" },
  { code: "+358", country: "FI" },
  { code: "+359", country: "BG" },
  { code: "+370", country: "LT" },
  { code: "+371", country: "LV" },
  { code: "+372", country: "EE" },
  { code: "+373", country: "MD" },
  { code: "+374", country: "AM" },
  { code: "+375", country: "BY" },
  { code: "+376", country: "AD" },
  { code: "+377", country: "MC" },
  { code: "+378", country: "SM" },
  { code: "+379", country: "VA" },
  { code: "+380", country: "UA" },
  { code: "+381", country: "RS" },
  { code: "+382", country: "ME" },
  { code: "+385", country: "HR" },
  { code: "+386", country: "SI" },
  { code: "+387", country: "BA" },
  { code: "+389", country: "MK" },
  { code: "+420", country: "CZ" },
  { code: "+421", country: "SK" },
  { code: "+423", country: "LI" },
  { code: "+500", country: "FK" },
  { code: "+501", country: "BZ" },
  { code: "+502", country: "GT" },
  { code: "+503", country: "SV" },
  { code: "+504", country: "HN" },
  { code: "+505", country: "NI" },
  { code: "+506", country: "CR" },
  { code: "+507", country: "PA" },
  { code: "+508", country: "PM" },
  { code: "+509", country: "HT" },
  { code: "+590", country: "GP" },
  { code: "+591", country: "BO" },
  { code: "+592", country: "GY" },
  { code: "+593", country: "EC" },
  { code: "+594", country: "GF" },
  { code: "+595", country: "PY" },
  { code: "+596", country: "MQ" },
  { code: "+597", country: "SR" },
  { code: "+598", country: "UY" },
  { code: "+599", country: "CW" },
  { code: "+670", country: "TL" },
  { code: "+672", country: "AQ" },
  { code: "+673", country: "BN" },
  { code: "+674", country: "NR" },
  { code: "+675", country: "PG" },
  { code: "+676", country: "TO" },
  { code: "+677", country: "SB" },
  { code: "+678", country: "VU" },
  { code: "+679", country: "FJ" },
  { code: "+680", country: "PW" },
  { code: "+681", country: "WF" },
  { code: "+682", country: "CK" },
  { code: "+683", country: "NU" },
  { code: "+685", country: "WS" },
  { code: "+686", country: "KI" },
  { code: "+687", country: "NC" },
  { code: "+688", country: "TV" },
  { code: "+689", country: "PF" },
  { code: "+690", country: "TK" },
  { code: "+691", country: "FM" },
  { code: "+692", country: "MH" },
  { code: "+850", country: "KP" },
  { code: "+852", country: "HK" },
  { code: "+853", country: "MO" },
  { code: "+855", country: "KH" },
  { code: "+856", country: "LA" },
  { code: "+870", country: "PN" },
  { code: "+878", country: "UM" },
  { code: "+880", country: "BD" },
  { code: "+886", country: "TW" },
  { code: "+960", country: "MV" },
  { code: "+961", country: "LB" },
  { code: "+962", country: "JO" },
  { code: "+963", country: "SY" },
  { code: "+964", country: "IQ" },
  { code: "+965", country: "KW" },
  { code: "+966", country: "SA" },
  { code: "+967", country: "YE" },
  { code: "+968", country: "OM" },
  { code: "+970", country: "PS" },
  { code: "+971", country: "AE" },
  { code: "+972", country: "IL" },
  { code: "+973", country: "BH" },
  { code: "+974", country: "QA" },
  { code: "+975", country: "BT" },
  { code: "+976", country: "MN" },
  { code: "+977", country: "NP" },
  { code: "+992", country: "TJ" },
  { code: "+993", country: "TM" },
  { code: "+994", country: "AZ" },
  { code: "+995", country: "GE" },
  { code: "+996", country: "KG" },
  { code: "+998", country: "UZ" }
];

const getCountryCode = (phoneNumber) => {
  const foundCode = countryCodes.find(c => phoneNumber.startsWith(c.code));
  return foundCode ? foundCode.country : null;
};
const formatCreatedAt = (createdAt) => {
  const dateObj = new Date(createdAt);
  return dateObj.toLocaleString(); 
};

const TableBody = ({ tableData, handleEdit, selectedRows, handleCheckboxChange ,handleDelete}) => {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateItemId, setUpdateItemId] = useState(null);


  const confirmDelete = (id) => {
    handleDelete(id);
    setShowDeleteConfirmation(false);
  };

  const cancelDelete = () => {
    setShowDeleteConfirmation(false);
  };
  const openUpdateForm = (id) => {
    setUpdateItemId(id);
    setShowUpdateForm(true);
  };

  const closeUpdateForm = () => {
    setShowUpdateForm(false);
    setUpdateItemId(null);
  };
  return (
    <>
      <tbody className='darkgrey'>
        {tableData.map((row, index) => (
          <tr key={row._id || index} className="table-row-box f12 nunito">
            <td>
              <input
                type="checkbox"
                className="custom-checkbox"
                checked={selectedRows.includes(row._id)}
                onChange={() => handleCheckboxChange(row._id)}
              />
            </td>
            <td className="centered-cell center">
              <div className="box-cell f12">{row._id}</div>
            </td>
            <td className="flex items-center">
              <div className='profile-container'>
              <Image
                  src={row.profileImage ? `http://localhost:3008/uploads/${row.profileImage}` : profilePlaceholder}
                  alt={`${row.firstName} ${row.lastName}`}
                  width={50}
                  height={50}
                  className="mr-2"
                  id='profile-pic'
                />
              </div>
              <span className='fw600'>{row.firstName} {row.lastName}</span>
            </td>
            <td className='f12 center'>{row.email}</td>
            <td className="centered-cell center" style={{ width: '150px' }}>
              <div className="box-cell flex f10 center">
                <Flag code={getCountryCode(row.phoneNumber)} style={{ width: 20, height: 15, marginRight: 10 }} />
                {row.phoneNumber}
              </div>
            </td>
            <td className="centered-cell center">
              <div className="box-cell f12">{formatCreatedAt(row.createdAt)}</div>
            </td>
            <td className="text-center pl23">
              <div className="flex justify-center">
              <button onClick={() => openUpdateForm(row._id)}>
                  <Image src={edit} alt='edit' width={20} height={20} />
                </button>
                <button onClick={() => {
                  setDeleteItem(row);
                  setShowDeleteConfirmation(true);
                }}>
                  <Image src={clear} alt='delete' width={20} height={20} />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
      {showDeleteConfirmation && (
        <DeleteConfirmation
          item={deleteItem}
          onConfirmDelete={() => confirmDelete(deleteItem._id)}
          onCancelDelete={cancelDelete}
        />
      )}
      {showUpdateForm && (
        <>
        <UpdateAdmin
          isOpen={showUpdateForm} 
          onClose={closeUpdateForm}
          adminData={tableData.find(item => item._id === updateItemId)} 
        />
        <div className="table-overlay"></div>
       </> 
      )}
    </>
  );
};

export default TableBody;