        const token = CheckLogin();

        const params =
            new URLSearchParams(window.location.search);

        const id =
            params.get("id");

        async function LoadJournal()
        {
            try
            {
                const response = await fetch( 
                `${URL}/Journal/${id}`, 
                {
                    method : "GET",
                    headers : 
                    {
                        "Authorization" : `Bearer ${token}`
                    }
                });
                const journal = await HandleResponse(response);
                document.getElementById("title").innerText = journal.title;
                document.getElementById("content").innerText = journal.content;
                document.getElementById("day").innerText = new Date(journal.posted_day).toLocaleDateString("vi-VN");
                document.getElementById("img").src = journal.img_url;
            }
            catch( error )
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
                        "Bạn không có quyền xem nhật ký này.";

                else if (error.status === 404)
                    document.getElementById("notice").innerText =
                        "Không tìm thấy nhật ký.";

                else
                    document.getElementById("notice").innerText =
                        "Không thể tải nhật ký. Vui lòng thử lại.";
            }
            
        }

        LoadJournal();

        async function DeleteJournal()
        {
            try
            {
                const response = await fetch(
                    `${URL}/Journal/${id}`,
                    {
                        method: "DELETE",
                        headers:
                        {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );
                await HandleResponse(response);
                window.location.href = "journals.html";
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
                        "Bạn không có quyền xóa nhật ký này.";

                else if (error.status === 404)
                    document.getElementById("notice").innerText =
                        "Không tìm thấy nhật ký cần xóa.";

                else
                    document.getElementById("notice").innerText =
                        "Không thể xóa nhật ký. Vui lòng thử lại.";
            }
        }