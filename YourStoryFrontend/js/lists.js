    const token = CheckLogin();

    async function LoadLists(order)
    {
        document.getElementById("notice").innerText = "";

        try
        {
            const response = await fetch(
                `${URL}/List/sort/${order}`,
                {
                    headers:
                    {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const lists = await HandleResponse(response);

            const listContainer = document.getElementById("listContainer");
            listContainer.innerHTML = "";

            for (const list of lists)
            {
                const day = new Date(list.created_day).toLocaleDateString("vi-VN");

                listContainer.innerHTML +=
                `<div>
                    <h3>${list.lists_name}</h3>
                    <p>${day}</p>

                    <button onclick="RenameList(${list.id})">
                        Đổi tên
                    </button>

                    <a href="view-list.html?id=${list.id}">
                        Xem
                    </a>

                    <button onclick="DeleteList(${list.id})">
                        Xóa
                    </button>
                </div>`;
            }
        }
        catch (error)
        {
            if (error.message === "Failed to fetch")
                document.getElementById("notice").innerText =
                    "Chưa thể kết nối với máy chủ.";
            else if (error.status === 401)
            {
                localStorage.removeItem("token");
                document.getElementById("notice").innerText =
                    "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
            }
            else
                document.getElementById("notice").innerText =
                    "Không thể tải danh sách. Vui lòng thử lại.";
        }
    }

    LoadLists("desc");

    async function DeleteList(id)
    {
        document.getElementById("notice").innerText = "";

        try
        {
            const response = await fetch(
                `${URL}/List/${id}`,
                {
                    method: "DELETE",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            await HandleResponse(response);
            await LoadLists("desc");
        }
        catch (error)
        {
            if (error.message === "Failed to fetch")
                document.getElementById("notice").innerText =
                    "Chưa thể kết nối với máy chủ.";
            else if (error.status === 401)
            {
                localStorage.removeItem("token");
                document.getElementById("notice").innerText =
                    "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
            }
            else if (error.status === 403)
                document.getElementById("notice").innerText =
                    "Bạn không có quyền xóa danh sách này.";
            else if (error.status === 404)
                document.getElementById("notice").innerText =
                    "Không tìm thấy danh sách cần xóa.";
            else
                document.getElementById("notice").innerText =
                    "Không thể xóa danh sách. Vui lòng thử lại.";
        }
    }


    async function RenameList(id)
    {
        const newName = prompt("Nhập tên mới cho danh sách:");

        if (newName === null || newName.trim() === "")
            return;

        document.getElementById("notice").innerText = "";

        try
        {
            const response = await fetch(
                `${URL}/List/${id}?newName=${encodeURIComponent(newName.trim())}`,
                {
                    method: "PUT",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            await HandleResponse(response);
            await LoadLists("desc");
        }
        catch (error)
        {
            if (error.message === "Failed to fetch")
                document.getElementById("notice").innerText =
                    "Chưa thể kết nối với máy chủ.";
            else if (error.status === 401)
            {
                localStorage.removeItem("token");
                document.getElementById("notice").innerText =
                    "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
            }
            else if (error.status === 403)
                document.getElementById("notice").innerText =
                    "Bạn không có quyền đổi tên danh sách này.";
            else if (error.status === 404)
                document.getElementById("notice").innerText =
                    "Không tìm thấy danh sách cần đổi tên.";
            else
                document.getElementById("notice").innerText =
                    "Không thể đổi tên danh sách. Vui lòng thử lại.";
        }
    }


    async function CreateList()
    {
        const name = document.getElementById("listName").value.trim();

        if (name === "")
        {
            document.getElementById("notice").innerText =
                "Vui lòng nhập tên danh sách.";
            return;
        }

        document.getElementById("notice").innerText = "";

        try
        {
            const response = await fetch(
                `${URL}/List`,
                {
                    method: "POST",
                    headers:
                    {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(
                    {
                        lists_name: name
                    })
                }
            );

            await HandleResponse(response);

            document.getElementById("listName").value = "";
            await LoadLists("desc");
        }
        catch (error)
        {
            if (error.message === "Failed to fetch")
                document.getElementById("notice").innerText =
                    "Chưa thể kết nối với máy chủ.";
            else if (error.status === 401)
            {
                localStorage.removeItem("token");
                document.getElementById("notice").innerText =
                    "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
            }
            else
                document.getElementById("notice").innerText =
                    "Không thể tạo danh sách. Vui lòng thử lại.";
        }
    }

