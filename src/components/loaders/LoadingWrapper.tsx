// import React, { useEffect } from "react";
// import { useLocation } from "react-router-dom";
// import LoadingScreenSplit from "./LoadingScreenSplit";
// import LoadingScreenAreYouReady from "./LoadingScreenAreYouReady";
// import PixelLoadingScreen from "./PixelLoadingScreen";
// import LoadingSquareHole from "./LoadingSquareHole";
// import LoadingScreenStrips from "./LoadingScreenStrips";
// import LoadingScreenStripsCenter from "./loadingScreenStripsCenter";

// interface LoadingWrapperProps {
//     children: React.ReactNode;
// }

// const LoadingWrapper: React.FC<LoadingWrapperProps> = ({ children }) => {
//     const location = useLocation();

//     useEffect(() => {
//         console.log("Navigating to:", location.pathname);
//     }, [location.pathname]);

//     const handleLoadingComplete = () => {
//         console.log("Loading complete");
//     };

//     const getLoadingScreen = () => {
//         switch (location.pathname) {
//             case "/":
//                 return (
//                     <LoadingScreenSplit onComplete={handleLoadingComplete} />
//                 );
//             case "/AreYouReady":
//                 return (
//                     <LoadingScreenAreYouReady
//                         onComplete={handleLoadingComplete}
//                     />
//                 );
//             case "/pixel":
//                 return (
//                     <PixelLoadingScreen onComplete={handleLoadingComplete} />
//                 );
//             case "/SquareHole":
//                 return <LoadingSquareHole onComplete={handleLoadingComplete} />;
//             case "/Strips":
//                 return (
//                     <LoadingScreenStrips onComplete={handleLoadingComplete} />
//                 );
//             case "/StripsCenter":
//                 return (
//                     <LoadingScreenStripsCenter
//                         onComplete={handleLoadingComplete}
//                     />
//                 );
//             default:
//                 return (
//                     <LoadingScreenSplit onComplete={handleLoadingComplete} />
//                 );
//         }
//     };

//     return (
//         <>
//             {getLoadingScreen()}
//             <div>{children}</div>
//         </>
//     );
// };

// export default LoadingWrapper;
