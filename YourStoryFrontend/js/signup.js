    async function Signup()
    {
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const user =
        {
            users_name : username,
            email : email,
            pass_word : password,
            avatar_url : ""
        }

        try
        {
            const response = await fetch( `${URL}/User/signup`, { method : "POST", 
                                                              headers : {"Content-Type" : "application/json"}, 
                                                              body: JSON.stringify(user)
                                                            });
            await HandleResponse(response);
            window.location.href = "login.html";
        }
        catch(error )
        {
            if (error.message === "Failed to fetch") 
                document.getElementById("notice").innerText = "Chưa thể kết nối với máy chủ."; 
            
            else if (error.message.includes("User exist")) 
                document.getElementById("notice").innerText = "Email đã tồn tại."; 
            
            else if (error.status === 400) 
                document.getElementById("notice").innerText = "Thông tin đăng ký không hợp lệ."; 
            
            else 
                document.getElementById("notice").innerText = "Đã xảy ra lỗi.";
        }
    }