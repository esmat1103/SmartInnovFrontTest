import React from 'react';
import bin from '../public/main_content/deleteM.svg';
import Image from 'next/image';
import ProfileImage from '@/components/common/PImage';

const DeleteConfirmationModal = ({ adminData, employeeData, onConfirm, onCancel }) => {
  
  return (
    <div className="fixed inset-0 overflow-y-auto flex items-center justify-center bg-gray-500 bg-opacity-75">
      <div className="bg-white overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full">
        <div className="px-3 py-3">
          <div className="flex items-center justify-center">
            <Image src={bin} alt='bin' width={30} />
            <h3 className="ml-2 text-lg leading-6 font-medium text-gray-900 ">Delete Confirmation</h3>
          </div>
          {(adminData || employeeData) && ( 
            <div className="mt-2 text-sm text-gray-500 mb-0">
              <p>Are you sure you want to delete this {adminData ? 'admin' : 'employee'}:</p>
              <p className="fw600 mx-1 poppins">{adminData ? adminData.first_name : employeeData.first_name} {adminData ? adminData.last_name : employeeData.last_name}</p>
              {adminData && adminData.profileImageURL && (
                <div className="flex justify-center">
                  <ProfileImage imageUrl={adminData.profileImageURL} />
                </div>
              )}
              {employeeData && employeeData.imageUrl && (
                <div className="flex justify-center">
                  <ProfileImage imageUrl={employeeData.imageUrl} />
                </div>
              )}
            </div>
          )}
        </div>
        <div className="bg-gray-50 px-2 py-3 sm:flex sm:flex-row-reverse">
          <button onClick={onConfirm} type="button" className="mx-1 w-full inline-flex justify-center px-4 py-2 bg-red-600 text-base font-medium text-white rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
            Yes, I'm sure
          </button>
          <button onClick={onCancel} type="button" className="mx-1 pt-3 pt-2 w-full inline-flex justify-center px-4 py-2 bg-white text-base font-medium text-gray-700 border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
