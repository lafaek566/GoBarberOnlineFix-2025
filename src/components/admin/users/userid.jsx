// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Cookies from "js-cookie";
// // Use named import based on your environment
// import * as jwt_decode from "jwt-decode"; // Named import for jwt-decode

// const AllUsers = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       setLoading(true);
//       const token = Cookies.get("token");

//       console.log("Token from Cookies:", token); // Log token to verify it's being fetched

//       if (!token) {
//         setError("Token tidak ditemukan. Silakan login kembali.");
//         setLoading(false);
//         return;
//       }

//       try {
//         // Decode token to get the userId
//         const decodedToken = jwt_decode(token); // Decode the token
//         const userId = decodedToken.userId; // Get the userId from the token

//         console.log("Decoded userId:", userId); // Log userId for debugging

//         // Make request to fetch user data based on userId
//         const response = await axios.get(
//           `http://localhost:5001/api/auth/${userId}`, // Use userId in the URL
//           {
//             headers: {
//               Authorization: `Bearer ${token}`, // Send token in the header for authentication
//             },
//           }
//         );

//         console.log("Response data:", response.data); // Log response data for debugging
//         setUser(response.data.user); // Set user data state
//       } catch (error) {
//         console.error("Error fetching user:", error); // Log error details

//         // Check for specific error response
//         if (error.response) {
//           if (error.response.status === 401) {
//             setError("Unauthorized access. Please log in again.");
//           } else {
//             setError(
//               `Error: ${error.response.data.error || "Something went wrong"}`
//             );
//           }
//         } else if (error.request) {
//           // The request was made but no response was received
//           setError("No response received from the server.");
//         } else {
//           // Something happened in setting up the request
//           setError("Error in setting up the request.");
//         }
//       } finally {
//         setLoading(false); // Ensure loading state is reset
//       }
//     };

//     fetchUser(); // Call function to fetch user data
//   }, []);

//   return (
//     <div className="bg-gray-50 min-h-screen p-8">
//       <div className="bg-white p-6 rounded-lg shadow-lg">
//         <h3 className="text-2xl font-semibold text-gray-800 mb-6">User Data</h3>

//         {loading ? (
//           <p>Loading...</p> // Display loading text
//         ) : error ? (
//           <p className="text-red-500">{error}</p> // Display error message
//         ) : (
//           user && (
//             <div className="p-4">
//               <h4 className="text-lg font-semibold">User Details</h4>
//               <p>
//                 <strong>Username:</strong> {user.username}
//               </p>
//               <p>
//                 <strong>Email:</strong> {user.email}
//               </p>
//               <p>
//                 <strong>Role:</strong> {user.role}
//               </p>
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default AllUsers;

import React from "react";

const userid = () => {
  return <div>Profile</div>;
};

export default userid;
