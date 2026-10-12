    const token = CheckLogin();

    async function LoadProfile()
    {
        try
        {
            const response = await fetch(
            `${URL}/User/profile`, 
            { method : "GET",  
              headers: 
              { 
                "Authorization" : `Bearer ${token}` 
              } 
            } );
            const data = await HandleResponse(response);
            document.getElementById("username").innerText = data.users_name;
            document.getElementById("email").innerText = data.email;
            document.getElementById("avatar").src = data.avatar_url;
        }
        catch( error )
        {
            if (error.message === "Failed to fetch") 
                document.getElementById("notice").innerText = "Chưa thể kết nối với máy chủ."; 

            else if (error.status === 401)
            {
                localStorage.removeItem("token");
                document.getElementById("notice").innerText = "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";
            }
                    
            else if (error.status === 404) 
                document.getElementById("notice").innerText = "Không tìm thấy thông tin cá nhân."; 
            
            else 
                document.getElementById("notice").innerText = "Đã xảy ra lỗi.";
        }
        
    }

    LoadProfile();