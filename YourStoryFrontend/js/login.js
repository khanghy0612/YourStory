    async function Login()
    {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        document.getElementById("notice").innerText = "";

        try
        {
            const response = await fetch(`${URL}/User/login?username=${username}&pass=${password}`, { method: "POST"});
            const data = await HandleResponse(response);
            localStorage.setItem("token", data.token );
            localStorage.setItem("username", data.users_name );
            window.location.href = "home.html";
        }
        catch(error )
        {
            if (error.message === "401")
                document.getElementById("notice").innerText = "Sai tên đăng nhập hoặc mật khẩu.";

            else if (error.message === "Failed to fetch")
                document.getElementById("notice").innerText = "Chưa thể kết nối với máy chủ.";
            
            else
                document.getElementById("notice").innerText = "Đã xảy ra lỗi.";
        }
    }