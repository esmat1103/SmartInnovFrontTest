import React, { useState } from 'react';

const ComplaintForm = () => {
  const [formData, setFormData] = useState({
    subject: '',
    details: '',
    category: '',
    urgency: '',
    deviceId: '',
    deviceType: '',
    sensorType: '',
    location: '',
    actionDue: '',
    latestRecordedData: '',
    lastCommunication: '',
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage('Your complaint has been submitted successfully.');
        setFormData({
          subject: '',
          details: '',
          category: '',
          urgency: '',
          deviceId: '',
          deviceType: '',
          sensorType: '',
          location: '',
          actionDue: '',
          latestRecordedData: '',
          lastCommunication: '',
        });
      } else {
        setErrorMessage('Failed to submit your complaint. Please try again.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="complaints-popup">
      <p>Fill out the form below to submit your complaint. Please provide as much detail as possible to help us address your issue effectively.</p>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-section-wrapper">
          <div className="form-row-wrapper">
            <div className="form-group-wrapper">
              <label htmlFor="subject">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                placeholder="Enter the subject of your complaint"
                value={formData.subject}
                onChange={handleChange}
                className="input-field-custom"
                required
              />
            </div>
            <div className="form-group-wrapper">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="custom-select-custom"
                required
              >
                <option value="">Select a category</option>
                <option value="service">Service</option>
                <option value="product">Product</option>
                <option value="billing">Billing</option>
                <option value="technical">Technical</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group-wrapper">
              <label htmlFor="urgency">Urgency</label>
              <select
                id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="custom-select-custom"
                required
              >
                <option value="">Select urgency level</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="form-row-wrapper">
            <div className="form-group-wrapper">
              <label htmlFor="details">Details</label>
              <textarea
                id="details"
                name="details"
                placeholder="Provide detailed information about your complaint"
                value={formData.details}
                onChange={handleChange}
                className="input-field-custom"
                required
              ></textarea>
            </div>
          </div>
        </div>

        <div className="form-section-wrapper">
          <div className="form-row-wrapper">
            <div className="form-group-wrapper">
              <label htmlFor="deviceId">Device ID</label>
              <input
                type="text"
                id="deviceId"
                name="deviceId"
                placeholder="Enter the ID of the device"
                value={formData.deviceId}
                onChange={handleChange}
                className="input-field-custom"
                required
              />
            </div>
            <div className="form-group-wrapper">
              <label htmlFor="deviceType">Device Type</label>
              <input
                type="text"
                id="deviceType"
                name="deviceType"
                placeholder="Enter the type of the device"
                value={formData.deviceType}
                onChange={handleChange}
                className="input-field-custom"
                required
              />
            </div>
            <div className="form-group-wrapper">
              <label htmlFor="sensorType">Sensor Type</label>
              <input
                type="text"
                id="sensorType"
                name="sensorType"
                placeholder="Enter the type of the sensor"
                value={formData.sensorType}
                onChange={handleChange}
                className="input-field-custom"
                required
              />
            </div>
            <div className="form-group-wrapper">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Enter the location of the device"
                value={formData.location}
                onChange={handleChange}
                className="input-field-custom"
                required
              />
            </div>
          </div>
        </div>

        <div className="form-section-wrapper">
          <div className="form-row-wrapper">
            <div className="form-group-wrapper">
              <label htmlFor="actionDue">Action Due</label>
              <input
                type="date"
                id="actionDue"
                name="actionDue"
                value={formData.actionDue}
                onChange={handleChange}
                className="input-field-custom"
                required
              />
            </div>
            <div className="form-group-wrapper">
              <label htmlFor="latestRecordedData">Latest Recorded Data</label>
              <input
                type="text"
                id="latestRecordedData"
                name="latestRecordedData"
                placeholder="Enter the latest data recorded by the device"
                value={formData.latestRecordedData}
                onChange={handleChange}
                className="input-field-custom"
                required
              />
            </div>
            <div className="form-group-wrapper">
              <label htmlFor="lastCommunication">Last Communication</label>
              <input
                type="date"
                id="lastCommunication"
                name="lastCommunication"
                value={formData.lastCommunication}
                onChange={handleChange}
                className="input-field-custom"
                required
              />
            </div>
          </div>
        </div>

        <button className="complaints-submit-button" type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ComplaintForm;
