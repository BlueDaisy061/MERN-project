import { useEffect, useState, useCallback } from "react";

const useAuth = () => {
    const [token, setToken] = useState(false);
    const [userId, setUserId] = useState(null);

    const login = useCallback((uid, token) => {
        setToken(token);
        setUserId(uid);
        localStorage.setItem(
            "userData",
            JSON.stringify({ userId: uid, token: token })
        );
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        localStorage.removeItem("userData");
    }, []);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem("userData"));
        if (storedData && storedData.token) {
            login(storedData.userId, storedData.token);
        }
    }, [login]);

    return { token, userId, login, logout };
};

export default useAuth;
