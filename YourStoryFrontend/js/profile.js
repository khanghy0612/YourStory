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
            console.log("Avatar URL:", data.avatar_url);
            console.log("Full URL:", `https://localhost:7145${data.avatar_url}`);
            document.getElementById("username").innerText = data.users_name;
            document.getElementById("email").innerText = data.email;
            document.getElementById("avatar").src = `https://localhost:7145${data.avatar_url}`;
        }
        catch( error )
        {
            console.error(error);
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


    // Preview Avatar
    document.getElementById("avatar-input").addEventListener("change",
    async function()
    {
        const file = this.files[0];

        if (file)
        {
            const previewURL = window.URL.createObjectURL(file);

            document.getElementById("avatar").src = previewURL;

            await UploadAvatar();
        }
    });

    async function UploadAvatar()
    {
        const file = document.getElementById("avatar-input").files[0];

        if (!file)
        {
            document.getElementById("notice").innerText = "Vui lòng chọn ảnh.";
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try
        {
            const response = await fetch(`${URL}/User/avatar`,
            {
                method: "PUT",
                headers:
                {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });

            await HandleResponse(response);

            document.getElementById("notice").innerText = "Cập nhật avatar thành công!";

            await LoadProfile();

            document.getElementById("avatar-input").value = "";

        }
        catch(error)
        {
            console.error(error);
            document.getElementById("notice").innerText = "Không thể cập nhật avatar.";
        }
    }


    async function RenameUser()
    {
        const newName = document.getElementById("new-username").value.trim();

        if (!newName)
        {
            document.getElementById("notice").innerText = "Tên không được để trống.";
            return;
        }

        try
        {
            const response = await fetch(`${URL}/User/rename`,
            {
                method: "PUT",
                headers:
                {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newName)
            });

            await HandleResponse(response);

            document.getElementById("notice").innerText = "Đổi tên thành công!";

            localStorage.setItem("username", newName);

            await LoadProfile();

            CancelRename();
        }
        catch(error)
        {
            console.error(error);
            document.getElementById("notice").innerText = "Không thể đổi tên.";
        }
    }

    function ShowRename() {
        document.getElementById("rename-section").style.display = "block";
        document.getElementById("rename-button").style.display = "none";

        document.getElementById("new-username").value = document.getElementById("username").innerText;
    }

    function CancelRename() {
        document.getElementById("rename-section").style.display = "none";
        document.getElementById("rename-button").style.display = "block";
    }

    LoadProfile();