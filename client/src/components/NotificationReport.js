import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import html2pdf from "html2pdf.js";
import { useSelector } from "react-redux";

const NotificationReport = () => {
  const [notifications, setNotifications] = useState([]);
  const [usernames, setUsernames] = useState({});
  const user = useSelector((state) => state.user);

  const pageRef = useRef();

  // Function to fetch username by ID
  const fetchUsernameById = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:3005/api/users/name/${id}`
      );
      return response.data.username;
    } catch (error) {
      console.error("Error fetching username:", error);
      return "Unknown";
    }
  };

  // Fetch notifications for the logged-in user
  const fetchNotifications = async () => {
    if (user && user.id) {
      try {
        const response = await axios.get(
          `http://localhost:3005/api/notification/${user.id}`
        );
        if (response.status === 200) {
          const notificationsData = response.data;
          console.log(response.data)
          setNotifications(notificationsData); // Set the fetched notifications

          // Collect all unique sender and receiver IDs
          const uniqueIds = [
            ...new Set([
              ...notificationsData.map((notification) => notification.senderId),
              ...notificationsData.map(
                (notification) => notification.reciverId
              ),
            ]),
          ];

          // Fetch usernames for all unique IDs
          const fetchedUsernames = await Promise.all(
            uniqueIds.map(async (id) => {
              const username = await fetchUsernameById(id);
              return { id, username };
            })
          );

          // Map usernames to their IDs
          const usernameMap = fetchedUsernames.reduce(
            (acc, { id, username }) => {
              acc[id] = username;
              return acc;
            },
            {}
          );

          setUsernames(usernameMap);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    }
  };

  useEffect(() => {
    fetchNotifications(); // Fetch notifications on component load
  }, [user]);

  // Function to download the notifications report as PDF
  const downloadPdf = () => {
    const element = pageRef.current;
    html2pdf().from(element).save();
  };

  return (
    <div>
      <div
        ref={pageRef}
        id="page-content"
        style={{
          maxWidth: "1100px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "0 auto",
        }}
      >
        <h1 style={{ textAlign: "center" }}>Notifications Report</h1>
        <table
          style={{
            width: "100%",
            maxWidth: "1000px", // Set max width
            margin: "0 auto",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Title
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Description
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Time
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Sender Username
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Receiver Username
              </th>
              <th style={{ border: "1px solid black", padding: "8px" }}>
                Is Read
              </th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification._id}>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {notification.title}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {notification.description}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {new Date(notification.time).toLocaleString()}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {usernames[notification.senderId] || "Loading..."}
                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {usernames[notification.reciverId] || "Loading..."}
                  

                </td>
                <td style={{ border: "1px solid black", padding: "8px" }}>
                  {notification.isRead ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}
      >
        <button
          style={{
            backgroundColor: "#FF5700",
            padding: "6px 8px",
            borderRadius: "12px",
            border: "none",
            color: "white",
            cursor: "pointer",
          }}
          onClick={downloadPdf}
        >
          Download as PDF
        </button>
      </div>
    </div>
  );
};

export default NotificationReport;
