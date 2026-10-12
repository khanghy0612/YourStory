
    const token = CheckLogin();

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    if (id)
        LoadJournal();


    async function CreateJournal(is_draft)
    {
        document.getElementById("notice").innerText = "";

        const journal =
        {
            title: document.getElementById("title").value,
            content: document.getElementById("content").value,
            img_url: document.getElementById("img_url").value,
            is_draft: is_draft,
            for_you: document.getElementById("forYou").checked
        };

        try
        {
            let response;

            // Cập nhật nhật ký nháp
            if (id)
            {
                response = await fetch(
                    `${URL}/Journal/${id}`,
                    {
                        method: "PUT",
                        headers:
                        {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(journal)
                    }
                );
            }
            // Tạo nhật ký mới
            else
            {
                response = await fetch(
                    `${URL}/Journal`,
                    {
                        method: "POST",
                        headers:
                        {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(journal)
                    }
                );
            }

            await HandleResponse(response);

            window.location.href = "journals.html";
        }
        catch (error)
        {
            if (error.message === "Failed to fetch")
            {
                document.getElementById("notice").innerText =
                    "Chưa thể kết nối với máy chủ.";
            }
            else if (error.status === 401)
            {
                localStorage.removeItem("token");

                document.getElementById("notice").innerText =
                    "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
            }
            else if (error.status === 403)
            {
                document.getElementById("notice").innerText =
                    "Bạn không có quyền chỉnh sửa nhật ký này.";
            }
            else if (error.status === 404)
            {
                document.getElementById("notice").innerText =
                    "Không tìm thấy nhật ký cần chỉnh sửa.";
            }
            else if (error.status === 400)
            {
                document.getElementById("notice").innerText =
                    "Không thể chỉnh sửa nhật ký đã đăng.";
            }
            else
            {
                document.getElementById("notice").innerText =
                    "Không thể lưu nhật ký. Vui lòng thử lại.";
            }
        }
    }


    async function LoadJournal()
    {
        document.getElementById("notice").innerText = "";

        try
        {
            const response = await fetch(
                `${URL}/Journal/${id}`,
                {
                    method: "GET",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const journal = await HandleResponse(response);

            document.getElementById("title").value = journal.title;
            document.getElementById("content").value = journal.content;
            document.getElementById("img_url").value = journal.img_url;

            if (journal.for_you)
                document.getElementById("forYou").checked = true;
            else
                document.getElementById("forOthers").checked = true;
        }
        catch (error)
        {
            if (error.message === "Failed to fetch")
            {
                document.getElementById("notice").innerText =
                    "Chưa thể kết nối với máy chủ.";
            }
            else if (error.status === 401)
            {
                localStorage.removeItem("token");
                document.getElementById("notice").innerText =
                    "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
            }
            else if (error.status === 403)
            {
                document.getElementById("notice").innerText =
                    "Bạn không có quyền xem nhật ký này.";
            }
            else if (error.status === 404)
            {
                document.getElementById("notice").innerText =
                    "Không tìm thấy nhật ký cần chỉnh sửa.";
            }
            else
            {
                document.getElementById("notice").innerText =
                    "Không thể tải nhật ký. Vui lòng thử lại.";
            }
        }
    }

