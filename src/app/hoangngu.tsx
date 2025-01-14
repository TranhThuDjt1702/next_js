// "use client";
// import { useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import Cookies from "js-cookie";

// const LoginPage: React.FC = () => {
//   const [usernameOrEmail, setUsernameOrEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
//     event.preventDefault();

//     setErrorMessage(""); // Clear previous error messages

//     const user = {
//       usernameOrEmail,
//       password,
//     };

//     try {
//       const response = await axios.post(
//         "http://localhost:8080/api/auth/login",
//         user,
//         {
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       // Save tokens and user data in cookies
//       Cookies.set("userId", response.data.userId, { expires: 7 });
//       Cookies.set("username", response.data.username, { expires: 7 });
//       Cookies.set("accessToken", response.data.accessToken, { expires: 7 }); // Expires in 7 days
//       Cookies.set("email", response.data.email, { expires: 7 });
//       Cookies.set(
//         "roleList",
//         JSON.stringify(
//           response.data.roleList.map((element: any) => element.authority)
//         ),
//         { expires: 7 }
//       );
//       setIsLoggedIn(true);

//       // Redirect to home page
//       router.push("/");
//     } catch (error: any) {
//       if (error.response && error.response.status === 401) {
//         setErrorMessage("Thông tin đăng nhập chưa chính xác");
//       } else {
//         setErrorMessage("Hệ thống đang gặp lỗi, xin thử lại sau!");
//       }
//     }
//   };

//   return (
//     <div>
//       <form onSubmit={handleSubmit} className="form">
//         <p className="form-title">Sign in to your account</p>
//         <div className="input-container">
//           <input
//             id="username-or-email"
//             type="email"
//             placeholder="Enter email"
//             value={usernameOrEmail}
//             onChange={(e) => setUsernameOrEmail(e.target.value)}
//             required
//           />
//           <span></span>
//         </div>
//         <div className="input-container">
//           <input
//             id="password"
//             type="password"
//             placeholder="Enter password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="submit">
//           Sign in
//         </button>
//         {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
//       </form>
//     </div>
//   );
// };

// export default LoginPage;