    const token = CheckLogin();

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    document.getElementById("AddJournalLink").href =
        `add-journal-to-list.html?id=${id}`;


    async function LoadList(order)
    {
        document.getElementById("notice").innerText = "";

        try
        {
            // Load List
            const response1 = await fetch(
                `${URL}/List/${id}`,
                {
                    method: "GET",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const list = await HandleResponse(response1);

            document.getElementById("ListName").innerText =
                list.lists_name;

            document.getElementById("CreatedDay").innerText =
                new Date(list.created_day).toLocaleDateString("vi-VN");


            // Load journals of List
            const response = await fetch(
                `${URL}/List/sort/${id}/journals/${order}`,
                {
                    method: "GET",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const journals = await HandleResponse(response);

            const JournalsContainer =
                document.getElementById("JournalsContainer");

            JournalsContainer.innerHTML = "";

            for (const journal of journals)
            {
                const day = new Date(journal.posted_day)
                    .toLocaleDateString("vi-VN");

                JournalsContainer.innerHTML +=
                `<div>
                    <h3>${journal.title}</h3>
                    <p>${day}</p>

                    <a href="view-journal.html?id=${journal.id}">
                        Xem
                    </a>

                    <button onclick="RemoveJournal(${journal.id})">
                        Gỡ khỏi danh sách
                    </button>
                </div>`;
            }
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
                    "Bạn không có quyền xem danh sách này.";
            }
            else if (error.status === 404)
            {
                document.getElementById("notice").innerText =
                    "Không tìm thấy danh sách.";
            }
            else
            {
                document.getElementById("notice").innerText =
                    "Không thể tải danh sách hoặc nhật ký. Vui lòng thử lại.";
            }
        }
    }


    window.addEventListener("pageshow", function (event)
    {
        LoadList("desc");
    });


    async function RemoveJournal(journalID)
    {
        const confirmRemove =
            confirm("Bạn có chắc muốn gỡ nhật ký này khỏi danh sách?");

        if (!confirmRemove)
            return;

        document.getElementById("notice").innerText = "";

        try
        {
            const response = await fetch(
                `${URL}/Lists_Journals/${id}/${journalID}`,
                {
                    method: "DELETE",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            await HandleResponse(response);

            await LoadList("desc");
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
                    "Bạn không có quyền gỡ nhật ký này.";
            }
            else if (error.status === 404)
            {
                document.getElementById("notice").innerText =
                    "Nhật ký này không còn trong danh sách.";
            }
            else
            {
                document.getElementById("notice").innerText =
                    "Không thể gỡ nhật ký. Vui lòng thử lại.";
            }
        }
    }

