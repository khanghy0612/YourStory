const URL = "https://localhost:7145/api";

function CheckLogin()
{
    const token = localStorage.getItem("token");

    if (!token)
    {
        window.location.href = "login.html";
    }

    return token;
}

function Logout()
{
    localStorage.removeItem("token");
    window.location.href = "firstpage.html";
}