const token = CheckLogin();

async function LoadJournals(order)
{
    document.getElementById("notice").innerText = "";

    try
    {
        const response = await fetch(
            `${URL}/Journal/sort/${order}`,
            {
                headers:
                {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const journals = await HandleResponse(response);

        const publishedContainer = document.getElementById("publishedContainer");
        const draftContainer = document.getElementById("draftContainer");

        publishedContainer.innerHTML = "";
        draftContainer.innerHTML = "";

        for (const journal of journals)
        {
            const day = new Date(journal.posted_day).toLocaleDateString("vi-VN");

            // Bản nháp
            if (journal.is_draft)
            {
                draftContainer.innerHTML +=
                `<div>
                    <h3>${journal.title}</h3>
                    <p>${day}</p>

                    <a href="write-journal.html?id=${journal.id}">
                        Chỉnh sửa
                    </a>

                    <button onclick="DeleteJournal(${journal.id})">
                        Xóa
                    </button>
                </div>`;
            }

            // Nhật ký đã đăng
            else
            {
                publishedContainer.innerHTML +=
                `<div>
                    <h3>${journal.title}</h3>
                    <p>${day}</p>

                    <a href="view-journal.html?id=${journal.id}">
                        Xem
                    </a>

                    <button onclick="DeleteJournal(${journal.id})">
                        Xóa
                    </button>
                </div>`;
            }
        }
    }
    catch (error)
    {
        if (error.message === "Failed to fetch")
        {
            document.getElementById("notice").innerText = "Chưa thể kết nối với máy chủ.";
        }
        else if (error.status === 401)
        {
            localStorage.removeItem("token");
            document.getElementById("notice").innerText =
                "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
        }
        else
        {
            document.getElementById("notice").innerText =
                "Không thể tải danh sách nhật ký. Vui lòng thử lại.";
        }
    }
}

LoadJournals("desc");


async function DeleteJournal(id)
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
        LoadJournals("desc");
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

