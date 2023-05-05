import { useEffect, useState } from "react";

export interface AlertType {
  type: "success" | "warning" | "error" | null;
  message: string;
  setAlert: React.Dispatch<React.SetStateAction<AlertType["type"]>>;
}

export const Alert = ({ type, message, setAlert }: AlertType) => {
  const [showAlert, setShowAlert] = useState(false);
  useEffect(() => {
    if (type === null) {
      setShowAlert(false);
    } else {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        setAlert(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [type]);
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 transition-all duration-1000 ease-out ${
        showAlert ? "translate-y-[30rem]" : "translate-y-full"
      }`}
    >
      <div className="fixed"></div>
      <div className="h-full max-w-md">
        {type === "success" && (
          <div className="alert alert-success origin-bottom translate-y-40 transform shadow-lg transition-all duration-500 ease-in">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 flex-shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Your purchase has been confirmed!</span>
            </div>
          </div>
        )}
        {type === "warning" && (
          <div className="alert alert-warning shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 flex-shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>Warning: Invalid email address!</span>
            </div>
          </div>
        )}
        {type === "error" && (
          <div className="alert alert-error shadow-lg">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 flex-shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Error! Task failed successfully.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
