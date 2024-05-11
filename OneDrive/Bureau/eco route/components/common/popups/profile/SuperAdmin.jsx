import React from 'react';

const Admin = ({userEmail, onClose, onResetPassword }) => {

    const handleClose = () => {
        onClose();
        const popup = document.querySelector('.popupProfile');
        popup.classList.add('slideOut');
    };

    return (
        <div className="fixed top-0 right-0 mt-10 mr-3">
            <form className="popupProfile slideIn">
                <h2 className="text-lg font-semibold mb-2">My Profile</h2>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        value={userEmail}
                        readOnly
                    />
                </div>
                <div className=" justify-end">
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray px-4 py-2 rounded-md mr-2" onClick={onResetPassword}>
                        Reset Password
                    </button>
                    <button className="bg-gray-200 hover:bg-gray-300 text-gray px-4 py-2 rounded-md mr-2" onClick={handleClose}>
                         Close
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Admin;
