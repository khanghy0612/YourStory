        const token = localStorage.getItem("token");

        async function ChangePassword()
        {
            document.getElementById("notice").innerText = "";
            
            const oldpass = document.getElementById("oldpass").value;
            const newpass = document.getElementById("newpass").value;
            try
            {    
                const response = await fetch( 
                    `${URL}/User/password?newpass=${newpass}&oldpass=${oldpass}`, 
                    {
                        method : "PUT",
                        headers : 
                        {
                            Authorization : `Bearer ${token}`
                        }
                    });

                await HandleResponse(response);

                document.getElementById("notice").innerText = "Đổi mật khẩu thành công.";
            }
            catch (error)
            {
                if (error.message === "Failed to fetch")
                    document.getElementById("notice").innerText = "Chưa thể kết nối với máy chủ.";

                else if (error.status === 401)
                {
                    if( error.message === "Old password wrong")
                        document.getElementById("notice").innerText = "Nhập sai mật khẩu hiện tại.";
                    else
                    {
                        localStorage.removeItem("token");
                        document.getElementById("notice").innerText = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
                    }
                }
                else if (error.status === 404)
                    document.getElementById("notice").innerText = "Không tìm thấy thông tin người dùng.";

                else if (error.status === 400)
                    document.getElementById("notice").innerText = "Thông tin cập nhật không hợp lệ.";

                else
                    document.getElementById("notice").innerText = "Cập nhật thất bại. Vui lòng thử lại.";
            }
        }