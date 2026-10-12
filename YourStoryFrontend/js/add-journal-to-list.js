    const token = CheckLogin();

    const params = new URLSearchParams(window.location.search);
    const listID = params.get("id");


    // Load all Journals
    async function LoadJournals()
    {
        document.getElementById("notice").innerText = "";

        try
        {
            // Get Journals of this User
            const response = await fetch(
                `${URL}/Journal`,
                {
                    method: "GET",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const journals = await HandleResponse(response);


            // Get Journals already in this List
            const response2 = await fetch(
                `${URL}/List/${listID}/journals`,
                {
                    method: "GET",
                    headers:
                    {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );

            const listJournals = await HandleResponse(response2);


            // Get IDs of Journals already in List
            const existingIDs = listJournals.map(journal => journal.id);

            const JournalContainer =
                document.getElementById("JournalContainer");

            JournalContainer.innerHTML = "";


            // Display Journals not in List
            for (const journal of journals)
            {
                if (existingIDs.includes(journal.id))
                    continue;

                const day = new Date(journal.posted_day)
                    .toLocaleDateString("vi-VN");

                JournalContainer.innerHTML +=
                `<div>
                    <h3>${journal.title}</h3>
                    <p>${day}</p>

                    <a href="view-journal.html?id=${journal.id}">
                        Xem
                    </a>

                    <button onclick="AddJournal(${journal.id})">
                        Thêm vào danh sách
                    </button>
                </div>`;
            }

            if (JournalContainer.innerHTML === "")
            {
                JournalContainer.innerText =
                    "Không có nhật ký nào để thêm.";
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
                    "Bạn không có quyền truy cập dữ liệu này.";
            }
            else if (error.status === 404)
            {
                document.getElementById("notice").innerText =
                    "Không tìm thấy danh sách cần thêm nhật ký.";
            }
            else
            {
                document.getElementById("notice").innerText =
                    "Không thể tải nhật ký. Vui lòng thử lại.";
            }
        }
    }


    LoadJournals();


    // Add Journal to List
    async function AddJournal(journalID)
    {
        document.getElementById("notice").innerText = "";

        try
        {
            const response = await fetch(
                `${URL}/Lists_Journals`,
                {
                    method: "POST",
                    headers:
                    {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(
                    {
                        lists_id: Number(listID),
                        journals_id: journalID
                    })
                }
            );

            await HandleResponse(response);
            await LoadJournals();
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
                    "Bạn không có quyền thêm nhật ký vào danh sách này.";
            }
            else if (error.status === 400)
            {
                document.getElementById("notice").innerText =
                    "Danh sách hoặc nhật ký không hợp lệ, hoặc nhật ký đã có trong danh sách.";
            }
            else
            {
                document.getElementById("notice").innerText =
                    "Không thể thêm nhật ký. Vui lòng thử lại.";
            }
        }
    }

