import React, { useState, useEffect } from 'react';
import './feedback.css'; // Make sure this path is correct

const FeedbackManagement = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Fetch feedback data from the API
    fetch('/api/admin/feedback/allFeedback')
      .then(response => response.json())
      .then(data => setFeedbackList(data))
      .catch(error => console.error('Error fetching feedback:', error));
  }, []);

  const filterTable = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredFeedbackList = feedbackList.filter(feedback =>
    feedback.id.toString().toLowerCase().includes(searchTerm)
  );

  return (
    <div className="container">
      <h1>Danh sách feedback</h1>
      <div className="search-container">
        <input
          type="text"
          id="searchInput"
          placeholder="Search by ID..."
          value={searchTerm}
          onChange={filterTable}
        />
      </div>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User ID</th>
            <th>Tour ID</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Created At</th>
            <th>Admin Reply</th>
            <th>Admin Reply Created At</th>
          </tr>
        </thead>
        <tbody id="feedbackTable">
          {filteredFeedbackList.map(feedback => (
            <tr key={feedback.id}>
              <td>{feedback.id}</td>
              <td>{feedback.userId}</td>
              <td>{feedback.tourId}</td>
              <td>{feedback.rating}</td>
              <td>{feedback.comment}</td>
              <td>{feedback.createdAt}</td>
              <td>{feedback.adminReply}</td>
              <td>{feedback.adminReplyCreatedAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackManagement;
