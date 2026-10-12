    const token = CheckLogin();

    async function UpdateProfile()
    {
        document.getElementById("notice").innerText = "";

        const username = document.getElementById("username").value;
        const avatar_url = document.getElementById("avatar_url").value;

        try
        {
            const response = await fetch(`${URL}/User/profile`, {
                method: "PUT",
                headers:
                {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    users_name: username,
                    avatar_url: avatar_url,
                    email: "a@gmail.com",
                    pass_word: "11111111"
                })
            });

            await HandleResponse(response);

            document.getElementById("notice").innerText = "Cập nhật thông tin thành công.";
        }
        catch (error)
        {
            if (error.message === "Failed to fetch")
                document.getElementById("notice").innerText = "Chưa thể kết nối với máy chủ.";

            else if (error.status === 401)
            {
                localStorage.removeItem("token");
                document.getElementById("notice").innerText = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
            }
            else if (error.status === 404)
                document.getElementById("notice").innerText = "Không tìm thấy thông tin người dùng.";

            else if (error.status === 400)
                document.getElementById("notice").innerText = "Thông tin cập nhật không hợp lệ.";

            else
                document.getElementById("notice").innerText = "Cập nhật thất bại. Vui lòng thử lại.";
        }
    }

